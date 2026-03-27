import { Request, Response, NextFunction } from 'express';
import * as IntegrationService from '../services/integration.service';
import { ApiResponse } from '../types/api-response';

export async function getIntegrations(req: Request, res: Response, next: NextFunction) {
  try {
    const integrations = await IntegrationService.listIntegrations();
    const response: ApiResponse<typeof integrations> = { success: true, data: integrations };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function syncIntegration(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await IntegrationService.simulateSync(id);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
