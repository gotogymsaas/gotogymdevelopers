import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../services/auth.service';
import type { AppPermission, AppRole, Scope } from '../../types/auth';
import type { ApiResponse } from '../../types/api-response';

const unauthorized = (res: Response, message: string) => {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message,
    },
  };
  return res.status(401).json(response);
};

const forbidden = (res: Response, message: string) => {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'FORBIDDEN',
      message,
    },
  };
  return res.status(403).json(response);
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return unauthorized(res, 'Missing or invalid Authorization header');
  }

  const token = authorization.slice('Bearer '.length).trim();
  const authUser = verifyAccessToken(token);

  if (!authUser) {
    return unauthorized(res, 'Invalid authentication token');
  }

  req.authUser = authUser;
  next();
}

export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return unauthorized(res, 'Authentication is required');
    }

    if (!roles.includes(req.authUser.role)) {
      return forbidden(res, 'Insufficient role');
    }

    next();
  };
}

export function requireScope(scope: Scope) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return unauthorized(res, 'Authentication is required');
    }

    if (!req.authUser.scopes.includes(scope)) {
      return forbidden(res, 'Insufficient scope');
    }

    next();
  };
}

export const requirePermission = (permission: AppPermission) => requireScope(permission);

export function requireOrganizationAccess(getOrganizationId: (req: Request) => string | undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return unauthorized(res, 'Authentication is required');
    }

    if (req.authUser.role === 'gotogym_admin') {
      next();
      return;
    }

    const organizationId = getOrganizationId(req);
    if (!organizationId) {
      next();
      return;
    }

    if (organizationId !== req.authUser.tenant.organizationId) {
      return forbidden(res, 'Organization is outside the active tenant');
    }

    next();
  };
}
