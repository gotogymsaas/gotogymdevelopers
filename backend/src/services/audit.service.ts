export type AuditAction =
  | 'application.created'
  | 'application.updated'
  | 'application.disabled'
  | 'application.secret_regenerated';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actorUserId: string;
  organizationId: string;
  resourceType: 'application';
  resourceId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const auditEvents: AuditEvent[] = [];

export function recordAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
  const auditEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}-${auditEvents.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  auditEvents.unshift(auditEvent);
  return auditEvent;
}

export function listAuditEvents(): AuditEvent[] {
  return [...auditEvents];
}

