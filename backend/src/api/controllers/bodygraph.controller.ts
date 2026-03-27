import { Request, Response } from 'express';
import * as BodyGraphService from '../../services/bodygraph.service';

export const getBodyGraph = (req: Request, res: Response) => {
  const { integrationId } = req.params;
  const payload = BodyGraphService.getBodyGraphPayload(integrationId);
  res.json(payload);
};
