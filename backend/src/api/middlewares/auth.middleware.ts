import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../services/auth.service';
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
