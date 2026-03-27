import { Request, Response, NextFunction } from 'express';
import * as BodyGraphService from '../services/bodygraph.service';
import { ApiResponse } from '../types/api-response';

export async function getBodyGraph(req: Request, res: Response, next: NextFunction) {
  try {
    const { integrationId } = req.params;
    const payload = await BodyGraphService.getBodyGraphPayload(integrationId);
    const response: ApiResponse<typeof payload> = { success: true, data: payload };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
