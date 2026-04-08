import { Request, Response, NextFunction } from 'express';
import * as BodyGraphService from '../../services/bodygraph.service';

export const getBodyGraph = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { integrationId } = req.params;
    const payload = await BodyGraphService.getBodyGraphPayload(integrationId);
    res.json(payload);
  } catch (err) {
    next(err);
  }
};
