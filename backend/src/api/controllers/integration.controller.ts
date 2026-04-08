import { Request, Response, NextFunction } from 'express';
import * as IntegrationService from '../../services/integration.service';

export const getIntegrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const integrations = await IntegrationService.listIntegrations();
    const response = integrations.map(i => ({
      id: i.id,
      name: i.name,
      status: i.state === 'success' ? 'connected' : i.state,
      lastSync: i.lastSync,
    }));
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const syncIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await IntegrationService.simulateSync(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
