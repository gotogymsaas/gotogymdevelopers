import { NextFunction, Request, Response } from 'express';
import * as ApplicationService from '../services/application.service';
import type { ApiResponse } from '../types/api-response';

const requireActor = (req: Request) => {
  if (!req.authUser) {
    const error: any = new Error('Authentication is required');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  return req.authUser;
};

export async function getApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApplicationService.listApplications(requireActor(req));
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApplicationService.createApplication(requireActor(req), req.body);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApplicationService.updateApplication(requireActor(req), req.params.id, req.body);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function disableApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApplicationService.disableApplication(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function regenerateClientSecret(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ApplicationService.regenerateClientSecret(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

