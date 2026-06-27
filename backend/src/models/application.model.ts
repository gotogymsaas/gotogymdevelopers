import type { DeveloperScope } from '../types/developer-scopes';

export type DeveloperApplicationStatus = 'active' | 'disabled';

export interface DeveloperApplication {
  id: string;
  name: string;
  description?: string;
  ownerOrganizationId: string;
  clientId: string;
  clientSecretHash: string;
  authorizedScopes: DeveloperScope[];
  status: DeveloperApplicationStatus;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
  createdByUserId: string;
  updatedByUserId?: string;
}

export interface DeveloperApplicationPublic {
  id: string;
  name: string;
  description?: string;
  ownerOrganizationId: string;
  clientId: string;
  authorizedScopes: DeveloperScope[];
  status: DeveloperApplicationStatus;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
  createdByUserId: string;
  updatedByUserId?: string;
}

export interface DeveloperApplicationWithSecret extends DeveloperApplicationPublic {
  clientSecret: string;
}
