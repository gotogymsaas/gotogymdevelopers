import jwt, { type JwtPayload } from 'jsonwebtoken';
import { createHash, createPublicKey, generateKeyPairSync, randomBytes, randomUUID } from 'crypto';
import { ApplicationRepository } from '../repositories/application.repository';
import { OAuthRepository } from '../repositories/oauth.repository';
import type {
  OAuthAuthorizationCode,
  OAuthCodeChallengeMethod,
  OAuthIntrospectionResponse,
  OAuthJwtClaims,
  OAuthRefreshToken,
  OAuthSigningKey,
  OAuthTokenResponse,
} from '../models/oauth.model';
import type { AuthUser } from '../types/auth';
import {
  expandDeveloperScopes,
  isDeveloperScope,
  type DeveloperScope,
  validateDeveloperScopes,
} from '../types/developer-scopes';
import { recordAuditEvent } from './audit.service';

const oauthRepo = new OAuthRepository();
const applicationRepo = new ApplicationRepository();

const ISSUER = process.env.OAUTH_ISSUER ?? 'https://developers.gotogym.store';
const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.OAUTH_ACCESS_TOKEN_TTL_SECONDS ?? 900);
const ID_TOKEN_TTL_SECONDS = Number(process.env.OAUTH_ID_TOKEN_TTL_SECONDS ?? 900);
const REFRESH_TOKEN_TTL_SECONDS = Number(process.env.OAUTH_REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30);
const AUTH_CODE_TTL_SECONDS = Number(process.env.OAUTH_AUTH_CODE_TTL_SECONDS ?? 300);

const badRequest = (message: string, details?: unknown) => {
  const error: any = new Error(message);
  error.status = 400;
  error.code = 'BAD_REQUEST';
  error.details = details;
  return error;
};

const unauthorizedClient = () => {
  const error: any = new Error('Invalid OAuth client');
  error.status = 401;
  error.code = 'INVALID_CLIENT';
  return error;
};

const tokenHash = (token: string): string => createHash('sha256').update(token).digest('hex');

const secondsFromNow = (seconds: number): string =>
  new Date(Date.now() + seconds * 1000).toISOString();

const base64Url = (input: Buffer): string =>
  input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const verifyPkce = (verifier: string, challenge: string): boolean =>
  base64Url(createHash('sha256').update(verifier).digest()) === challenge;

const createOpaqueToken = (prefix: string): string =>
  `${prefix}_${base64Url(randomBytes(32))}`;

const normalizeScopes = (scope: unknown, role = 'integrator' as AuthUser['role']): DeveloperScope[] => {
  const rawScopes = typeof scope === 'string'
    ? scope.split(' ').filter(Boolean)
    : Array.isArray(scope) ? scope : [];
  const validation = validateDeveloperScopes(rawScopes, role);

  if (!validation.valid) {
    throw badRequest('Invalid requested OAuth scopes', validation);
  }

  return validation.normalizedScopes;
};

const assertClientScopes = async (clientId: string, scopes: DeveloperScope[]) => {
  const application = await applicationRepo.findByClientId(clientId);
  if (!application || application.status !== 'active') {
    throw unauthorizedClient();
  }

  const allowed = expandDeveloperScopes(application.authorizedScopes);
  const forbiddenScopes = scopes.filter(scope => !allowed.includes(scope));
  if (forbiddenScopes.length > 0) {
    throw badRequest('Client is not allowed to request one or more scopes', { forbiddenScopes });
  }

  return application;
};

const getOrCreateActiveKey = async (): Promise<OAuthSigningKey> => {
  const activeKey = await oauthRepo.getActiveSigningKey();
  if (activeKey) {
    return activeKey;
  }

  return rotateSigningKey();
};

const signToken = async (
  claims: Omit<OAuthJwtClaims, 'iss' | 'jti'>,
  expiresInSeconds: number,
): Promise<string> => {
  const key = await getOrCreateActiveKey();
  const payload: OAuthJwtClaims = {
    ...claims,
    iss: ISSUER,
    jti: randomUUID(),
  };

  return jwt.sign(payload, key.privateKeyPem, {
    algorithm: key.alg,
    expiresIn: expiresInSeconds,
    keyid: key.kid,
  });
};

export async function rotateSigningKey(): Promise<OAuthSigningKey> {
  await oauthRepo.retireActiveKeys();
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const kid = `gtg-oauth-${Date.now()}`;
  const publicJwk = publicKey.export({ format: 'jwk' }) as JsonWebKey;
  const privateKeyPem = privateKey.export({ format: 'pem', type: 'pkcs8' }).toString();

  const key = await oauthRepo.saveSigningKey({
    kid,
    alg: 'RS256',
    status: 'active',
    publicJwk: {
      ...publicJwk,
      kid,
      alg: 'RS256',
      use: 'sig',
    },
    privateKeyPem,
    createdAt: new Date().toISOString(),
  });

  recordAuditEvent({
    action: 'oauth.key.rotated',
    actorUserId: 'system',
    organizationId: 'org-platform',
    resourceType: 'oauth_key',
    resourceId: key.kid,
    metadata: { alg: key.alg, status: key.status },
  });

  return key;
}

export async function getJwks() {
  const keys = await oauthRepo.listSigningKeys();
  return {
    keys: keys
      .filter(key => key.status !== 'retired')
      .map(key => key.publicJwk),
  };
}

export function getOpenIdConfiguration() {
  return {
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/oauth/authorize`,
    token_endpoint: `${ISSUER}/oauth/token`,
    revocation_endpoint: `${ISSUER}/oauth/revoke`,
    introspection_endpoint: `${ISSUER}/oauth/introspect`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    scopes_supported: [
      'openid',
      'profile.read',
      'wellbeing.read',
      'metrics.read',
      'analytics.read',
      'organization.read',
      'devices.read',
      'documents.read',
    ],
  };
}

export async function createAuthorizationCode(input: {
  actor: AuthUser;
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: OAuthCodeChallengeMethod;
  state?: string;
  nonce?: string;
}) {
  if (input.codeChallengeMethod !== 'S256') {
    throw badRequest('Only S256 PKCE is supported');
  }

  const requestedScopes = normalizeScopes(input.scope.replace(/\bopenid\b/g, '').trim(), input.actor.role);
  await assertClientScopes(input.clientId, requestedScopes);

  const authorizationCode: OAuthAuthorizationCode = {
    code: createOpaqueToken('gtg_code'),
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: input.codeChallengeMethod,
    scopes: requestedScopes,
    userId: input.actor.id,
    email: input.actor.email,
    role: input.actor.role,
    tenant: input.actor.tenant,
    nonce: input.nonce,
    expiresAt: secondsFromNow(AUTH_CODE_TTL_SECONDS),
  };

  await oauthRepo.saveAuthorizationCode(authorizationCode);
  const redirectUrl = new URL(input.redirectUri);
  redirectUrl.searchParams.set('code', authorizationCode.code);
  if (input.state) {
    redirectUrl.searchParams.set('state', input.state);
  }

  recordAuditEvent({
    action: 'oauth.authorization_code.issued',
    actorUserId: input.actor.id,
    organizationId: input.actor.tenant.organizationId,
    resourceType: 'oauth_client',
    resourceId: input.clientId,
    metadata: { scopes: requestedScopes },
  });

  return {
    code: authorizationCode.code,
    redirectUrl: redirectUrl.toString(),
    expiresIn: AUTH_CODE_TTL_SECONDS,
  };
}

const issueTokenResponse = async (
  codeOrRefresh: Pick<OAuthAuthorizationCode, 'clientId' | 'userId' | 'email' | 'role' | 'tenant' | 'scopes' | 'nonce'>,
  familyId?: string,
): Promise<OAuthTokenResponse> => {
  const scope = codeOrRefresh.scopes.join(' ');
  const refreshToken = createOpaqueToken('gtg_refresh');
  const refreshHash = tokenHash(refreshToken);

  const accessToken = await signToken({
    sub: codeOrRefresh.userId,
    aud: codeOrRefresh.clientId,
    client_id: codeOrRefresh.clientId,
    scope,
    tenant_id: codeOrRefresh.tenant.tenantId,
    organization_id: codeOrRefresh.tenant.organizationId,
    role: codeOrRefresh.role,
    token_use: 'access',
    email: codeOrRefresh.email,
  }, ACCESS_TOKEN_TTL_SECONDS);

  const idToken = await signToken({
    sub: codeOrRefresh.userId,
    aud: codeOrRefresh.clientId,
    client_id: codeOrRefresh.clientId,
    scope: 'openid profile.read',
    tenant_id: codeOrRefresh.tenant.tenantId,
    organization_id: codeOrRefresh.tenant.organizationId,
    role: codeOrRefresh.role,
    token_use: 'id',
    email: codeOrRefresh.email,
    nonce: codeOrRefresh.nonce,
  }, ID_TOKEN_TTL_SECONDS);

  await oauthRepo.saveRefreshToken({
    tokenHash: refreshHash,
    familyId: familyId ?? randomUUID(),
    clientId: codeOrRefresh.clientId,
    userId: codeOrRefresh.userId,
    email: codeOrRefresh.email,
    role: codeOrRefresh.role,
    scopes: codeOrRefresh.scopes,
    tenant: codeOrRefresh.tenant,
    expiresAt: secondsFromNow(REFRESH_TOKEN_TTL_SECONDS),
    createdAt: new Date().toISOString(),
  });

  recordAuditEvent({
    action: 'oauth.token.issued',
    actorUserId: codeOrRefresh.userId,
    organizationId: codeOrRefresh.tenant.organizationId,
    resourceType: 'oauth_token',
    resourceId: codeOrRefresh.clientId,
    metadata: {
      clientId: codeOrRefresh.clientId,
      scopes: codeOrRefresh.scopes,
      tenantId: codeOrRefresh.tenant.tenantId,
    },
  });

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope,
    id_token: idToken,
  };
};

export async function exchangeAuthorizationCode(input: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<OAuthTokenResponse> {
  const authorizationCode = await oauthRepo.findAuthorizationCode(input.code);
  if (!authorizationCode) {
    throw badRequest('Invalid authorization code');
  }

  if (authorizationCode.consumedAt || new Date(authorizationCode.expiresAt).getTime() < Date.now()) {
    throw badRequest('Authorization code expired or already used');
  }

  if (authorizationCode.clientId !== input.clientId || authorizationCode.redirectUri !== input.redirectUri) {
    throw badRequest('Authorization code binding mismatch');
  }

  if (!verifyPkce(input.codeVerifier, authorizationCode.codeChallenge)) {
    throw badRequest('Invalid PKCE verifier');
  }

  await assertClientScopes(input.clientId, authorizationCode.scopes);
  await oauthRepo.consumeAuthorizationCode(input.code);

  return issueTokenResponse(authorizationCode);
}

export async function rotateRefreshToken(input: {
  refreshToken: string;
  clientId: string;
}): Promise<OAuthTokenResponse> {
  const refreshHash = tokenHash(input.refreshToken);
  const storedRefreshToken = await oauthRepo.findRefreshToken(refreshHash);

  if (!storedRefreshToken || storedRefreshToken.clientId !== input.clientId) {
    throw badRequest('Invalid refresh token');
  }

  if (storedRefreshToken.revokedAt) {
    await oauthRepo.revokeRefreshTokenFamily(storedRefreshToken.familyId);
    throw badRequest('Refresh token reuse detected');
  }

  if (new Date(storedRefreshToken.expiresAt).getTime() < Date.now()) {
    throw badRequest('Refresh token expired');
  }

  const response = await issueTokenResponse({
    clientId: storedRefreshToken.clientId,
    userId: storedRefreshToken.userId,
    email: storedRefreshToken.email,
    role: storedRefreshToken.role,
    tenant: storedRefreshToken.tenant,
    scopes: storedRefreshToken.scopes,
  }, storedRefreshToken.familyId);

  await oauthRepo.revokeRefreshToken(refreshHash, tokenHash(response.refresh_token));
  return response;
}

export async function introspectToken(token: string): Promise<OAuthIntrospectionResponse> {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    const kid = typeof decodedHeader === 'object' && decodedHeader?.header
      ? decodedHeader.header.kid
      : undefined;
    if (!kid) {
      return { active: false };
    }

    const key = await oauthRepo.findSigningKey(kid);
    if (!key) {
      return { active: false };
    }

    const publicKey = createPublicKey({ key: key.publicJwk, format: 'jwk' });
    const claims = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: ISSUER,
    }) as JwtPayload & OAuthJwtClaims;

    if (await oauthRepo.isAccessTokenRevoked(claims.jti)) {
      return { active: false };
    }

    return {
      active: true,
      iss: claims.iss,
      sub: claims.sub,
      aud: typeof claims.aud === 'string' ? claims.aud : claims.client_id,
      client_id: claims.client_id,
      username: claims.email,
      scope: claims.scope,
      exp: claims.exp,
      iat: claims.iat,
      jti: claims.jti,
      tenant_id: claims.tenant_id,
      organization_id: claims.organization_id,
      token_type: 'Bearer',
    };
  } catch {
    return { active: false };
  }
}

export async function revokeToken(token: string, tokenTypeHint?: string): Promise<void> {
  if (tokenTypeHint === 'refresh_token' || token.startsWith('gtg_refresh_')) {
    await oauthRepo.revokeRefreshToken(tokenHash(token));
    recordAuditEvent({
      action: 'oauth.token.revoked',
      actorUserId: 'system',
      organizationId: 'unknown',
      resourceType: 'oauth_token',
      resourceId: 'refresh_token',
      metadata: { tokenTypeHint },
    });
    return;
  }

  const decoded = jwt.decode(token) as JwtPayload | null;
  if (decoded?.jti && typeof decoded.jti === 'string') {
    await oauthRepo.revokeAccessTokenId(decoded.jti);
    recordAuditEvent({
      action: 'oauth.token.revoked',
      actorUserId: typeof decoded.sub === 'string' ? decoded.sub : 'system',
      organizationId: typeof decoded.organization_id === 'string' ? decoded.organization_id : 'unknown',
      resourceType: 'oauth_token',
      resourceId: decoded.jti,
      metadata: { tokenTypeHint },
    });
  }
}
