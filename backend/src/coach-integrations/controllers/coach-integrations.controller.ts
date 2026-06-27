import { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response';
import { buildCoachContext } from '../services/coach-context-orchestrator.service';
import { executeQAFExperience } from '../services/qaf-experience.service';
import { getAggregateMetrics } from '../services/aggregate-metrics.service';

const requireOAuthToken = (req: Request) => {
  if (!req.oauthToken) {
    const error: any = new Error('OAuth access token is required');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  return req.oauthToken;
};

export function getCapabilities(req: Request, res: Response, next: NextFunction) {
  try {
    requireOAuthToken(req);
    const data = {
      contracts: [
        'quantum_coach.context.v1',
        'quantum_coach.qaf_execution.v1',
        'quantum_coach.aggregate_metrics.v1',
      ],
      supportedExperiences: [
        'daily_checkin',
        'habit_reinforcement',
        'recovery_guidance',
        'progress_review',
        'corporate_wellbeing_summary',
      ],
      security: {
        consentRequired: true,
        aggregateOnlyMetrics: true,
        multiTenantEnforced: true,
      },
    };
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getContext(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await buildCoachContext(requireOAuthToken(req), req.body ?? {});
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function executeQAF(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await executeQAFExperience(requireOAuthToken(req), req.body ?? {});
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export function getMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = getAggregateMetrics(requireOAuthToken(req), {
      organizationId: typeof req.query.organizationId === 'string' ? req.query.organizationId : undefined,
      period: String(req.query.period ?? '30d') as any,
      cohort: typeof req.query.cohort === 'string' ? req.query.cohort : 'all',
    });
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
