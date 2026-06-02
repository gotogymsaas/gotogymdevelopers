import { NextFunction, Request, Response } from 'express';
import * as CorporateWellbeingService from '../services/corporate-wellbeing.service';
import type { ApiResponse } from '../types/api-response';
import type { CorporateWellbeingResponse } from '../types/corporate-wellbeing';

const extractBearerToken = (authorization: string | undefined): string | null => {
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
};

export async function getCorporateWellbeing(req: Request, res: Response, next: NextFunction) {
  try {
    const bearerToken = extractBearerToken(req.header('authorization'));

    if (!bearerToken) {
      const authError: any = new Error('Missing or invalid Authorization header');
      authError.status = 401;
      authError.code = 'UNAUTHORIZED';
      throw authError;
    }

    const query = CorporateWellbeingService.buildCorporateWellbeingQuery(req.query);
    const data = await CorporateWellbeingService.getCorporateWellbeing(bearerToken, query);
    const response: ApiResponse<CorporateWellbeingResponse> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
