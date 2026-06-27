import { NextFunction, Request, Response } from 'express';
import * as ConsentService from '../services/consent.service';
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

export async function getConsents(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ConsentService.listConsents(requireActor(req));
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function authorizeConsent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ConsentService.authorizeConsent(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function rejectConsent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ConsentService.rejectConsent(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function revokeConsent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ConsentService.revokeConsent(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getConsentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ConsentService.getConsentHistory(requireActor(req), req.params.id);
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
