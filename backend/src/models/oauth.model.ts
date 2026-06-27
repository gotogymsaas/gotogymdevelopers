import type { AppRole, TenantContext } from '../types/auth';
import type { DeveloperScope } from '../types/developer-scopes';
import type { JsonWebKey } from 'crypto';

export type OAuthCodeChallengeMethod = 'S256';
export type OAuthGrantType = 'authorization_code' | 'refresh_token';
export type OAuthTokenType = 'Bearer';

export interface OAuthAuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: OAuthCodeChallengeMethod;
  scopes: DeveloperScope[];
  userId: string;
  email: string;
  role: AppRole;
  tenant: TenantContext;
  nonce?: string;
  expiresAt: string;
  consumedAt?: string;
}

export interface OAuthRefreshToken {
  tokenHash: string;
  familyId: string;
  clientId: string;
  userId: string;
  email: string;
  role: AppRole;
  scopes: DeveloperScope[];
  tenant: TenantContext;
  expiresAt: string;
  createdAt: string;
  revokedAt?: string;
  replacedByHash?: string;
}

export interface OAuthSigningKey {
  kid: string;
  alg: 'RS256';
  status: 'active' | 'retiring' | 'retired';
  publicJwk: JsonWebKey;
  privateKeyPem: string;
  createdAt: string;
  retiredAt?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: OAuthTokenType;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface OAuthIntrospectionResponse {
  active: boolean;
  iss?: string;
  sub?: string;
  aud?: string;
  client_id?: string;
  username?: string;
  scope?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  tenant_id?: string;
  organization_id?: string;
  token_type?: OAuthTokenType;
}

export interface OAuthJwtClaims {
  iss: string;
  sub: string;
  aud: string;
  client_id: string;
  scope: string;
  tenant_id: string;
  organization_id: string;
  role: AppRole;
  token_use: 'access' | 'id';
  email?: string;
  nonce?: string;
  jti: string;
}
