import { getAuthToken } from '../../auth/rbac';
import type {
  ConsentHistoryEvent,
  ConsentWithHistory,
  IntegrationConsent,
} from '../../types/types';
import { getApiBaseUrl } from './api';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const CONSENTS_PATH = '/api/v1/consents';

const mockHistory: ConsentHistoryEvent[] = [
  {
    id: 'history-local-001',
    consentId: 'consent-local-healthkit',
    action: 'consent.requested',
    actorUserId: 'system',
    status: 'pending',
    createdAt: '2026-06-12T14:30:00.000Z',
  },
  {
    id: 'history-local-002',
    consentId: 'consent-local-healthkit',
    action: 'consent.authorized',
    actorUserId: 'user-001',
    status: 'authorized',
    createdAt: '2026-06-12T14:35:00.000Z',
  },
  {
    id: 'history-local-003',
    consentId: 'consent-local-garmin',
    action: 'consent.requested',
    actorUserId: 'system',
    status: 'pending',
    createdAt: '2026-06-20T09:10:00.000Z',
  },
];

const mockConsents: IntegrationConsent[] = [
  {
    id: 'consent-local-healthkit',
    userId: 'user-001',
    integrationId: 'healthkit',
    integrationName: 'Apple HealthKit',
    ownerCompany: 'Apple Inc.',
    requestedScopes: ['metrics.read', 'wellbeing.read'],
    status: 'authorized',
    requestedAt: '2026-06-12T14:30:00.000Z',
    authorizedAt: '2026-06-12T14:35:00.000Z',
    updatedAt: '2026-06-12T14:35:00.000Z',
  },
  {
    id: 'consent-local-garmin',
    userId: 'user-001',
    integrationId: 'garmin',
    integrationName: 'Garmin Connect',
    ownerCompany: 'Garmin Ltd.',
    requestedScopes: ['metrics.read', 'devices.read'],
    status: 'pending',
    requestedAt: '2026-06-20T09:10:00.000Z',
    updatedAt: '2026-06-20T09:10:00.000Z',
  },
];

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const token = getAuthToken();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json() as ApiEnvelope<T> | T;
  return payload && typeof payload === 'object' && 'data' in payload
    ? (payload as ApiEnvelope<T>).data
    : payload as T;
};

const localTransition = (id: string, status: IntegrationConsent['status']): ConsentWithHistory => {
  const index = mockConsents.findIndex(consent => consent.id === id);
  if (index < 0) {
    throw new Error('Consent not found');
  }

  const now = new Date().toISOString();
  const current = mockConsents[index];
  const updated: IntegrationConsent = {
    ...current,
    status,
    authorizedAt: status === 'authorized' ? now : current.authorizedAt,
    rejectedAt: status === 'rejected' ? now : current.rejectedAt,
    revokedAt: status === 'revoked' ? now : current.revokedAt,
    updatedAt: now,
  };
  mockConsents[index] = updated;

  const action = `consent.${status === 'authorized' ? 'authorized' : status === 'rejected' ? 'rejected' : 'revoked'}` as ConsentHistoryEvent['action'];
  mockHistory.unshift({
    id: `history-local-${Date.now()}`,
    consentId: id,
    action,
    actorUserId: 'local-user',
    status,
    createdAt: now,
  });

  return {
    ...updated,
    history: mockHistory.filter(event => event.consentId === id),
  };
};

export const listConsents = async (): Promise<IntegrationConsent[]> => {
  try {
    return await request<IntegrationConsent[]>(CONSENTS_PATH);
  } catch {
    return [...mockConsents];
  }
};

export const authorizeConsent = async (id: string): Promise<ConsentWithHistory> => {
  try {
    return await request<ConsentWithHistory>(`${CONSENTS_PATH}/${id}/authorize`, { method: 'POST' });
  } catch {
    return localTransition(id, 'authorized');
  }
};

export const rejectConsent = async (id: string): Promise<ConsentWithHistory> => {
  try {
    return await request<ConsentWithHistory>(`${CONSENTS_PATH}/${id}/reject`, { method: 'POST' });
  } catch {
    return localTransition(id, 'rejected');
  }
};

export const revokeConsent = async (id: string): Promise<ConsentWithHistory> => {
  try {
    return await request<ConsentWithHistory>(`${CONSENTS_PATH}/${id}/revoke`, { method: 'POST' });
  } catch {
    return localTransition(id, 'revoked');
  }
};

export const getConsentHistory = async (id: string): Promise<ConsentWithHistory> => {
  try {
    return await request<ConsentWithHistory>(`${CONSENTS_PATH}/${id}/history`);
  } catch {
    const consent = mockConsents.find(item => item.id === id);
    if (!consent) {
      throw new Error('Consent not found');
    }

    return {
      ...consent,
      history: mockHistory.filter(event => event.consentId === id),
    };
  }
};
