import type { GatewayLogEvent } from '../types/gateway.types';

const events: GatewayLogEvent[] = [];

export function recordGatewayEvent(event: GatewayLogEvent): GatewayLogEvent {
  events.unshift(event);
  if (events.length > 500) {
    events.pop();
  }

  return event;
}

export function listGatewayEvents(): GatewayLogEvent[] {
  return [...events];
}

export function getGatewayHealth() {
  const lastEvents = events.slice(0, 50);
  const errorCount = lastEvents.filter(event => event.statusCode >= 500).length;
  const avgDurationMs = lastEvents.length === 0
    ? 0
    : Math.round(lastEvents.reduce((sum, event) => sum + event.durationMs, 0) / lastEvents.length);

  return {
    status: errorCount > 5 ? 'degraded' : 'ok',
    recentRequests: lastEvents.length,
    recentErrors: errorCount,
    avgDurationMs,
  };
}
