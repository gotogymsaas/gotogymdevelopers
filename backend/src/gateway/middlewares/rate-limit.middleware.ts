import { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function gatewayRateLimit(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = [
      req.oauthToken?.client_id ?? req.ip,
      req.oauthToken?.tenant_id ?? 'anonymous',
      req.path,
    ].join(':');
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('x-ratelimit-limit', String(maxRequests));
      res.setHeader('x-ratelimit-remaining', String(maxRequests - 1));
      return next();
    }

    if (bucket.count >= maxRequests) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Gateway rate limit exceeded',
          details: { resetAt: new Date(bucket.resetAt).toISOString() },
        },
      };
      res.setHeader('retry-after', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json(response);
    }

    bucket.count += 1;
    res.setHeader('x-ratelimit-limit', String(maxRequests));
    res.setHeader('x-ratelimit-remaining', String(Math.max(0, maxRequests - bucket.count)));
    next();
  };
}
