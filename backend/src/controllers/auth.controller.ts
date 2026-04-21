import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import type { ApiResponse } from '../types/api-response';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email.trim() || !password.trim()) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Email and password are required',
        },
      };
      res.status(400).json(response);
      return;
    }

    const result = await AuthService.loginWithEmailPassword(email, password);
    if (!result) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
