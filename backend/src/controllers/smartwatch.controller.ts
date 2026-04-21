import { NextFunction, Request, Response } from 'express';
import * as SmartwatchService from '../services/smartwatch.service';
import type { ApiResponse } from '../types/api-response';

export async function getSmartwatchMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.authUser) {
      const authError: any = new Error('Unauthorized');
      authError.status = 401;
      authError.code = 'UNAUTHORIZED';
      throw authError;
    }

    const metrics = await SmartwatchService.listSmartwatchMetrics(req.authUser.id);
    const response: ApiResponse<typeof metrics> = { success: true, data: metrics };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
