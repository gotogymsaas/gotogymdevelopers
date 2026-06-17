import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'crypto';
import { mockUsers } from '../data/mock-users';
import type { AppPermission, AppRole, AuthUser, TenantContext } from '../types/auth';

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: AppRole;
  permissions: AppPermission[];
  tenant: TenantContext;
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
  value === 'user' || value === 'gym' || value === 'admin';

const APP_PERMISSIONS: AppPermission[] = [
  'integrations:read',
  'integrations:sync',
  'bodygraph:read',
  'smartwatch:read',
  'business:wellbeing:read',
  'admin:modules:read',
];

const isAppPermission = (value: unknown): value is AppPermission =>
  typeof value === 'string' && APP_PERMISSIONS.includes(value as AppPermission);

const isTenantContext = (value: unknown): value is TenantContext => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const tenant = value as Partial<TenantContext>;
  return typeof tenant.tenantId === 'string' && tenant.tenantId.length > 0;
};

const toAuthUser = (input: {
  id: string;
  email: string;
  role: AppRole;
  permissions: AppPermission[];
  tenant: TenantContext;
}): AuthUser => ({
  id: input.id,
  email: input.email,
  role: input.role,
  permissions: [...input.permissions],
  tenant: { ...input.tenant },
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
    permissions: user.permissions,
    tenant: user.tenant,
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
      || !Array.isArray(decoded.permissions)
      || !decoded.permissions.every(isAppPermission)
      || !isTenantContext(decoded.tenant)
    ) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions,
      tenant: decoded.tenant,
    };
  } catch {
    return null;
  }
}
