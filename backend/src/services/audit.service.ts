import { readStore, updateStore } from '../storage/persistent-store';

export type AuditAction =
  | 'application.created'
  | 'application.updated'
  | 'application.disabled'
  | 'application.secret_regenerated'
  | 'consent.requested'
  | 'consent.authorized'
  | 'consent.rejected'
  | 'consent.revoked'
  | 'oauth.authorization_code.issued'
  | 'oauth.token.issued'
  | 'oauth.token.revoked'
  | 'oauth.key.rotated'
  | 'quantum_coach.context.shared'
  | 'quantum_coach.qaf.executed'
  | 'quantum_coach.metrics.exposed';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actorUserId: string;
  organizationId: string;
  resourceType: 'application' | 'consent' | 'oauth_client' | 'oauth_token' | 'oauth_key' | 'quantum_coach';
  resourceId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export function recordAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
  const auditEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}-${readStore().auditEvents.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  updateStore(state => {
    state.auditEvents.unshift(auditEvent);
  });
  return auditEvent;
}

export function listAuditEvents(): AuditEvent[] {
  return [...readStore().auditEvents];
}
