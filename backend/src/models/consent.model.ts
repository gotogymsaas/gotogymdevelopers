import type { DeveloperScope } from '../types/developer-scopes';

export type ConsentStatus = 'pending' | 'authorized' | 'rejected' | 'revoked';

export type ConsentAuditAction =
  | 'consent.requested'
  | 'consent.authorized'
  | 'consent.rejected'
  | 'consent.revoked';

export interface IntegrationConsent {
  id: string;
  userId: string;
  integrationId: string;
  integrationName: string;
  ownerCompany: string;
  requestedScopes: DeveloperScope[];
  status: ConsentStatus;
  requestedAt: string;
  authorizedAt?: string;
  rejectedAt?: string;
  revokedAt?: string;
  updatedAt: string;
}

export interface ConsentHistoryEvent {
  id: string;
  consentId: string;
  action: ConsentAuditAction;
  actorUserId: string;
  status: ConsentStatus;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ConsentWithHistory extends IntegrationConsent {
  history: ConsentHistoryEvent[];
}
