import { getApiBaseUrl } from './api';
import { getAuthToken } from '../../auth/rbac';
import type {
  ApplicationFormInput,
  DeveloperApplication,
  DeveloperApplicationWithSecret,
} from '../../types/types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const APPLICATIONS_PATH = '/api/v1/applications';

const mockApplications: DeveloperApplication[] = [
  {
    id: 'app-local-001',
    name: 'Portal Bienestar Empresa',
    description: 'Aplicacion interna para reportes agregados de bienestar corporativo.',
    ownerOrganizationId: 'org-local',
    clientId: 'gtg_org_local_portal',
    authorizedScopes: ['corporate_wellbeing:read:application', 'integrations:read:application'],
    status: 'active',
    createdAt: '2026-06-16T12:00:00.000Z',
    updatedAt: '2026-06-16T12:00:00.000Z',
    createdByUserId: 'local-user',
  },
];

const createLocalSecret = () => `gtg_secret_local_${Math.random().toString(16).slice(2)}${Date.now()}`;

const optionalDescription = (description: string): { description?: string } => {
  const trimmed = description.trim();
  return trimmed ? { description: trimmed } : {};
};

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

export const listApplications = async (): Promise<DeveloperApplication[]> => {
  try {
    return await request<DeveloperApplication[]>(APPLICATIONS_PATH);
  } catch {
    return [...mockApplications];
  }
};

export const createApplication = async (
  input: ApplicationFormInput,
): Promise<DeveloperApplicationWithSecret> => {
  try {
    return await request<DeveloperApplicationWithSecret>(APPLICATIONS_PATH, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    const now = new Date().toISOString();
    const application: DeveloperApplicationWithSecret = {
      id: `app-local-${Date.now()}`,
      name: input.name.trim(),
      ...optionalDescription(input.description),
      ownerOrganizationId: 'org-local',
      clientId: `gtg_local_${Date.now()}`,
      clientSecret: createLocalSecret(),
      authorizedScopes: [...input.authorizedScopes],
      status: 'active',
      createdAt: now,
      updatedAt: now,
      createdByUserId: 'local-user',
    };

    mockApplications.unshift(application);
    return application;
  }
};

export const updateApplication = async (
  id: string,
  input: ApplicationFormInput,
): Promise<DeveloperApplication> => {
  try {
    return await request<DeveloperApplication>(`${APPLICATIONS_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  } catch {
    const index = mockApplications.findIndex(application => application.id === id);
    if (index < 0) {
      throw new Error('Application not found');
    }

    const current = mockApplications[index];
    if (!current) {
      throw new Error('Application not found');
    }

    const updated: DeveloperApplication = {
      ...current,
      name: input.name.trim(),
      ...optionalDescription(input.description),
      authorizedScopes: [...input.authorizedScopes],
      updatedAt: new Date().toISOString(),
    };

    mockApplications[index] = updated;
    return updated;
  }
};

export const disableApplication = async (id: string): Promise<DeveloperApplication> => {
  try {
    return await request<DeveloperApplication>(`${APPLICATIONS_PATH}/${id}/disable`, {
      method: 'POST',
    });
  } catch {
    const index = mockApplications.findIndex(application => application.id === id);
    if (index < 0) {
      throw new Error('Application not found');
    }

    const current = mockApplications[index];
    if (!current) {
      throw new Error('Application not found');
    }

    const updated: DeveloperApplication = {
      ...current,
      status: 'disabled',
      disabledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockApplications[index] = updated;
    return updated;
  }
};

export const regenerateClientSecret = async (
  id: string,
): Promise<DeveloperApplicationWithSecret> => {
  try {
    return await request<DeveloperApplicationWithSecret>(`${APPLICATIONS_PATH}/${id}/regenerate-secret`, {
      method: 'POST',
    });
  } catch {
    const index = mockApplications.findIndex(application => application.id === id);
    if (index < 0) {
      throw new Error('Application not found');
    }

    const current = mockApplications[index];
    if (!current) {
      throw new Error('Application not found');
    }

    const updated: DeveloperApplicationWithSecret = {
      ...current,
      clientSecret: createLocalSecret(),
      updatedAt: new Date().toISOString(),
    };
    mockApplications[index] = updated;
    return updated;
  }
};
