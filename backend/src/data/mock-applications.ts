import { createHash } from 'crypto';
import type { DeveloperApplication } from '../models/application.model';

const hashSecret = (secret: string) => createHash('sha256').update(secret).digest('hex');

export const applications: DeveloperApplication[] = [
  {
    id: 'app-001',
    name: 'Portal Bienestar Empresa',
    description: 'Aplicacion interna para consumir bienestar corporativo agregado.',
    ownerOrganizationId: 'org-gym-001',
    clientId: 'gtg_org_gym_001_portal',
    clientSecretHash: hashSecret('initial-secret-not-exposed'),
    authorizedScopes: [
      'wellbeing.read',
      'analytics.read',
    ],
    status: 'active',
    createdAt: '2026-06-16T12:00:00.000Z',
    updatedAt: '2026-06-16T12:00:00.000Z',
    createdByUserId: 'gym-001',
  },
];
