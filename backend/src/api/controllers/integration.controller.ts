import { Request, Response } from 'express';
import * as IntegrationService from '../../services/integration.service';

export const getIntegrations = (req: Request, res: Response) => {
  const integrations = IntegrationService.listIntegrations();
  res.json(integrations);
};

export const syncIntegration = (req: Request, res: Response) => {
  const { id } = req.params;
  const result = IntegrationService.simulateSync(id);
  res.json(result);
};
