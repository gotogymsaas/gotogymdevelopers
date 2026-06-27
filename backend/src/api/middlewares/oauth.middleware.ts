import { NextFunction, Request, Response } from 'express';
import * as OAuthService from '../../services/oauth.service';
import type { DeveloperScope } from '../../types/developer-scopes';
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

export function requireOAuthAccessToken(...requiredScopes: DeveloperScope[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return unauthorized(res, 'Missing or invalid Authorization header');
    }

    const token = authorization.slice('Bearer '.length).trim();
    const introspection = await OAuthService.introspectToken(token);
    if (!introspection.active || !introspection.scope) {
      return unauthorized(res, 'Inactive OAuth access token');
    }

    const grantedScopes = introspection.scope.split(' ');
    const missingScopes = requiredScopes.filter(scope => !grantedScopes.includes(scope));
    if (missingScopes.length > 0) {
      return forbidden(res, 'Insufficient OAuth scope');
    }

    req.oauthToken = introspection;
    next();
  };
}
