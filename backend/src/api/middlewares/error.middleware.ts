import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types/api-response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
      details: err.details || undefined
    }
  };
  res.status(status).json(response);
}
