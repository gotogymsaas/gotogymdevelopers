import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { mockUsers } from '../data/mock-users';
import type { AppRole, AuthUser } from '../types/auth';

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: AppRole;
}

interface LoginResult {
  token: string;
  role: AppRole;
  expiresIn: SignOptions['expiresIn'];
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me';
const JWT_ISSUER = process.env.JWT_ISSUER ?? 'gotogymdevelopers';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

const isAppRole = (value: unknown): value is AppRole =>
  value === 'user' || value === 'gym' || value === 'admin';

const toAuthUser = (input: { id: string; email: string; role: AppRole }): AuthUser => ({
  id: input.id,
  email: input.email,
  role: input.role,
});

const signAccessToken = (user: AuthUser): string => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
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
      && currentUser.password === password,
  );

  if (!user) {
    return null;
  }

  const authUser = toAuthUser(user);
  const token = signAccessToken(authUser);

  return {
    token,
    role: authUser.role,
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
    ) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}
