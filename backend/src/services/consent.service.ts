import { randomUUID } from 'crypto';
import { ConsentRepository } from '../repositories/consent.repository';
import type {
  ConsentAuditAction,
  ConsentHistoryEvent,
  ConsentStatus,
  ConsentWithHistory,
  IntegrationConsent,
} from '../models/consent.model';
import type { AuthUser } from '../types/auth';
import { recordAuditEvent } from './audit.service';

const consentRepo = new ConsentRepository();

const notFound = () => {
  const error: any = new Error('Consent not found');
  error.status = 404;
  error.code = 'NOT_FOUND';
  return error;
};

const forbidden = () => {
  const error: any = new Error('Consent is outside the active user');
  error.status = 403;
  error.code = 'FORBIDDEN';
  return error;
};

const badRequest = (message: string) => {
  const error: any = new Error(message);
  error.status = 400;
  error.code = 'BAD_REQUEST';
  return error;
};

const assertUserAccess = (consent: IntegrationConsent, actor: AuthUser) => {
  if (actor.role === 'gotogym_admin') {
    return;
  }

  if (consent.userId !== actor.id) {
    throw forbidden();
  }
};

const addConsentEvent = async (
  actor: AuthUser,
  consent: IntegrationConsent,
  action: ConsentAuditAction,
  status: ConsentStatus,
  metadata?: Record<string, unknown>,
): Promise<ConsentHistoryEvent> => {
  const event: ConsentHistoryEvent = {
    id: randomUUID(),
    consentId: consent.id,
    action,
    actorUserId: actor.id,
    status,
    createdAt: new Date().toISOString(),
    metadata,
  };

  await consentRepo.addHistory(event);
  recordAuditEvent({
    action,
    actorUserId: actor.id,
    organizationId: actor.tenant.organizationId,
    resourceType: 'consent',
    resourceId: consent.id,
    metadata: {
      integrationId: consent.integrationId,
      integrationName: consent.integrationName,
      scopes: consent.requestedScopes,
      ...metadata,
    },
  });

  return event;
};

export async function listConsents(actor: AuthUser): Promise<IntegrationConsent[]> {
  return consentRepo.findByUser(actor.id);
}

export async function getConsentHistory(actor: AuthUser, id: string): Promise<ConsentWithHistory> {
  const consent = await consentRepo.findById(id);
  if (!consent) {
    throw notFound();
  }

  assertUserAccess(consent, actor);
  const history = await consentRepo.findHistory(id);
  return { ...consent, history };
}

export async function authorizeConsent(actor: AuthUser, id: string): Promise<ConsentWithHistory> {
  const consent = await consentRepo.findById(id);
  if (!consent) {
    throw notFound();
  }

  assertUserAccess(consent, actor);
  if (consent.status === 'authorized') {
    throw badRequest('Consent is already authorized');
  }

  const now = new Date().toISOString();
  const updated = await consentRepo.update(id, {
    status: 'authorized',
    authorizedAt: now,
    rejectedAt: undefined,
    revokedAt: undefined,
    updatedAt: now,
  });

  if (!updated) {
    throw notFound();
  }

  await addConsentEvent(actor, updated, 'consent.authorized', 'authorized');
  return getConsentHistory(actor, id);
}

export async function rejectConsent(actor: AuthUser, id: string): Promise<ConsentWithHistory> {
  const consent = await consentRepo.findById(id);
  if (!consent) {
    throw notFound();
  }

  assertUserAccess(consent, actor);
  if (consent.status === 'authorized') {
    throw badRequest('Authorized consent must be revoked instead of rejected');
  }

  const now = new Date().toISOString();
  const updated = await consentRepo.update(id, {
    status: 'rejected',
    rejectedAt: now,
    revokedAt: undefined,
    updatedAt: now,
  });

  if (!updated) {
    throw notFound();
  }

  await addConsentEvent(actor, updated, 'consent.rejected', 'rejected');
  return getConsentHistory(actor, id);
}

export async function revokeConsent(actor: AuthUser, id: string): Promise<ConsentWithHistory> {
  const consent = await consentRepo.findById(id);
  if (!consent) {
    throw notFound();
  }

  assertUserAccess(consent, actor);
  if (consent.status !== 'authorized') {
    throw badRequest('Only authorized consents can be revoked');
  }

  const now = new Date().toISOString();
  const updated = await consentRepo.update(id, {
    status: 'revoked',
    revokedAt: now,
    updatedAt: now,
  });

  if (!updated) {
    throw notFound();
  }

  await addConsentEvent(actor, updated, 'consent.revoked', 'revoked');
  return getConsentHistory(actor, id);
}
