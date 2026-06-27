import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'crypto';
import { mockUsers } from '../data/mock-users';
import type { AppRole, AuthUser, Scope, TenantContext } from '../types/auth';

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: AppRole;
  scopes: Scope[];
  permissions?: Scope[];
  tenant: TenantContext;
  activeOrganizationId: string;
  applicationId?: string;
  type: 'user' | 'application';
}

interface LoginResult {
  token: string;
  role: AppRole;
  user: AuthUser;
  expiresIn: SignOptions['expiresIn'];
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me';
const JWT_ISSUER = process.env.JWT_ISSUER ?? 'gotogymdevelopers';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production');
}

const isAppRole = (value: unknown): value is AppRole =>
  value === 'end_user'
  || value === 'company_owner'
  || value === 'company_manager'
  || value === 'gotogym_admin'
  || value === 'integrator';

const APP_SCOPES: Scope[] = [
  'profile:read:self',
  'profile:update:self',
  'smartwatch:read:self',
  'coach_context:read:self',
  'bodygraph:read:self',
  'organization:read:organization',
  'organization:update:organization',
  'organization_members:read:organization',
  'organization_members:invite:organization',
  'corporate_wellbeing:read:organization',
  'integrations:read:organization',
  'integrations:sync:organization',
  'applications:manage:organization',
  'api_credentials:manage:organization',
  'audit_logs:read:platform',
  'billing:manage:organization',
];

const isScope = (value: unknown): value is Scope =>
  typeof value === 'string' && APP_SCOPES.includes(value as Scope);

const isTenantContext = (value: unknown): value is TenantContext => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const tenant = value as Partial<TenantContext>;
  return typeof tenant.tenantId === 'string'
    && tenant.tenantId.length > 0
    && typeof tenant.organizationId === 'string'
    && tenant.organizationId.length > 0
    && typeof tenant.membershipId === 'string'
    && tenant.membershipId.length > 0;
};

const toAuthUser = (input: {
  id: string;
  email: string;
  role: AppRole;
  scopes: Scope[];
  tenant: TenantContext;
  applicationId?: string;
  tokenType?: 'user' | 'application';
}): AuthUser => ({
  id: input.id,
  email: input.email,
  role: input.role,
  scopes: [...input.scopes],
  permissions: [...input.scopes],
  tenant: { ...input.tenant },
  applicationId: input.applicationId,
  tokenType: input.tokenType ?? 'user',
});

const hashPassword = (password: string): string =>
  createHash('sha256').update(password).digest('hex');

const verifyPassword = (password: string, passwordHash: string): boolean => {
  const candidate = Buffer.from(hashPassword(password), 'hex');
  const expected = Buffer.from(passwordHash, 'hex');

  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
};

const signAccessToken = (user: AuthUser): string => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    scopes: user.scopes,
    permissions: user.scopes,
    tenant: user.tenant,
    activeOrganizationId: user.tenant.organizationId,
    applicationId: user.applicationId,
    type: user.tokenType,
  };

  return jwt.sign(payload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    expiresIn: JWT_EXPIRES_IN,
  });
};

export async function loginWithEmailPassword(email: string, password: string): Promise<LoginResult | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = mockUsers.find(
    currentUser =>
      currentUser.email.toLowerCase() === normalizedEmail
      && verifyPassword(password, currentUser.passwordHash),
  );

  if (!user) {
    return null;
  }

  const authUser = toAuthUser(user);
  const token = signAccessToken(authUser);

  return {
    token,
    role: authUser.role,
    user: authUser,
    expiresIn: JWT_EXPIRES_IN,
  };
}

export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
    }) as AccessTokenPayload | string;

    if (typeof decoded === 'string') {
      return null;
    }

    if (
      typeof decoded.sub !== 'string'
      || typeof decoded.email !== 'string'
      || !isAppRole(decoded.role)
      || !Array.isArray(decoded.scopes)
      || !decoded.scopes.every(isScope)
      || !isTenantContext(decoded.tenant)
      || decoded.activeOrganizationId !== decoded.tenant.organizationId
      || (decoded.type !== 'user' && decoded.type !== 'application')
    ) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      scopes: decoded.scopes,
      permissions: decoded.scopes,
      tenant: decoded.tenant,
      applicationId: typeof decoded.applicationId === 'string' ? decoded.applicationId : undefined,
      tokenType: decoded.type,
    };
  } catch {
    return null;
  }
}
