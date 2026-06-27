import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { recordGatewayEvent } from '../services/observability.service';

export function gatewayRequestLogger(routeId = 'unknown') {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.header('x-request-id') ?? randomUUID();
    const startedAt = Date.now();
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      recordGatewayEvent({
        requestId,
        routeId,
        upstream: 'oauth_gateway',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
        clientId: req.oauthToken?.client_id,
        tenantId: req.oauthToken?.tenant_id,
        organizationId: req.oauthToken?.organization_id,
        cacheStatus: res.getHeader('x-gateway-cache') as 'hit' | 'miss' | 'skip' | undefined,
      });
    });

    next();
  };
}
