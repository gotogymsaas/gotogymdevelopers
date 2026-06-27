import type { DeveloperScope } from '../../types/developer-scopes';

export type GatewayUpstream = 'appgotogym' | 'coach_context' | 'oauth_gateway' | 'third_party';

export interface GatewayRequestContext {
  requestId: string;
  clientId?: string;
  subject?: string;
  tenantId?: string;
  organizationId?: string;
  scopes: DeveloperScope[];
  upstream: GatewayUpstream;
  startedAt: number;
}

export interface GatewayRoutePolicy {
  id: string;
  upstream: GatewayUpstream;
  requiredScopes: DeveloperScope[];
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cache?: {
    ttlMs: number;
    varyBy: Array<'tenant' | 'organization' | 'subject' | 'scope' | 'query'>;
  };
  transform: 'coach_context_safe' | 'corporate_wellbeing' | 'passthrough';
}

export interface GatewayCacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface GatewayLogEvent {
  requestId: string;
  routeId: string;
  upstream: GatewayUpstream;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  clientId?: string;
  tenantId?: string;
  organizationId?: string;
  cacheStatus?: 'hit' | 'miss' | 'skip';
}

export interface GatewayUpstreamResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  data: T;
}
