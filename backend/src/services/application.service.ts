import { createHash, randomBytes, randomUUID } from 'crypto';
import { ApplicationRepository } from '../repositories/application.repository';
import type {
  DeveloperApplication,
  DeveloperApplicationPublic,
  DeveloperApplicationWithSecret,
} from '../models/application.model';
import type { AuthUser } from '../types/auth';
import {
  DEVELOPER_SCOPES,
  type DeveloperScope,
  validateDeveloperScopes,
} from '../types/developer-scopes';
import { recordAuditEvent } from './audit.service';

const applicationRepo = new ApplicationRepository();

export const APPLICATION_SCOPES: DeveloperScope[] = [...DEVELOPER_SCOPES];

export interface CreateApplicationInput {
  name: string;
  description?: string;
  redirectUris?: string[];
  authorizedScopes: DeveloperScope[];
}

export interface UpdateApplicationInput {
  name?: string;
  description?: string;
  redirectUris?: string[];
  authorizedScopes?: DeveloperScope[];
}

const hashSecret = (secret: string) => createHash('sha256').update(secret).digest('hex');

const createClientId = (organizationId: string) =>
  `gtg_${organizationId.replace(/[^a-zA-Z0-9]/g, '_')}_${randomBytes(5).toString('hex')}`.toLowerCase();

const createClientSecret = () => `gtg_secret_${randomBytes(24).toString('hex')}`;

const badRequest = (message: string, details?: unknown) => {
  const error: any = new Error(message);
  error.status = 400;
  error.code = 'BAD_REQUEST';
  error.details = details;
  return error;
};

const notFound = () => {
  const error: any = new Error('Application not found');
  error.status = 404;
  error.code = 'NOT_FOUND';
  return error;
};

const forbidden = () => {
  const error: any = new Error('Application is outside the active tenant');
  error.status = 403;
  error.code = 'FORBIDDEN';
  return error;
};

const validateName = (name: unknown): string => {
  if (typeof name !== 'string') {
    throw badRequest('Application name is required');
  }

  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 80) {
    throw badRequest('Application name must be between 3 and 80 characters');
  }

  return trimmed;
};

const validateDescription = (description: unknown): string | undefined => {
  if (description === undefined || description === null || description === '') {
    return undefined;
  }

  if (typeof description !== 'string' || description.length > 240) {
    throw badRequest('Description must be 240 characters or less');
  }

  return description.trim();
};

const validateScopes = (scopes: unknown, actor: AuthUser): DeveloperScope[] => {
  const validation = validateDeveloperScopes(scopes, actor.role);
  if (!validation.valid) {
    throw badRequest('One or more scopes are not allowed for this role', {
      invalidScopes: validation.invalidScopes,
      restrictedScopes: validation.restrictedScopes,
    });
  }

  return validation.normalizedScopes;
};

const validateRedirectUris = (redirectUris: unknown): string[] => {
  const rawUris = Array.isArray(redirectUris) ? redirectUris : [];
  if (rawUris.length === 0) {
    throw badRequest('At least one redirect URI is required');
  }

  const parsedUris = rawUris.map(value => {
    if (typeof value !== 'string') {
      throw badRequest('Redirect URIs must be strings');
    }

    const trimmed = value.trim();
    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
        throw badRequest('Redirect URIs must use HTTPS, except localhost during development');
      }
      url.hash = '';
      return url.toString();
    } catch {
      throw badRequest('One or more redirect URIs are invalid');
    }
  });

  return [...new Set(parsedUris)];
};

const toPublicApplication = (application: DeveloperApplication): DeveloperApplicationPublic => ({
  id: application.id,
  name: application.name,
  description: application.description,
  ownerOrganizationId: application.ownerOrganizationId,
  clientId: application.clientId,
  redirectUris: [...application.redirectUris],
  authorizedScopes: [...application.authorizedScopes],
  status: application.status,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
  disabledAt: application.disabledAt,
  createdByUserId: application.createdByUserId,
  updatedByUserId: application.updatedByUserId,
});

const assertTenantAccess = (application: DeveloperApplication, actor: AuthUser) => {
  if (actor.role === 'gotogym_admin') {
    return;
  }

  if (application.ownerOrganizationId !== actor.tenant.organizationId) {
    throw forbidden();
  }
};

export async function listApplications(actor: AuthUser): Promise<DeveloperApplicationPublic[]> {
  if (actor.role === 'gotogym_admin') {
    const orgApplications = await applicationRepo.findByOrganization(actor.tenant.organizationId);
    return orgApplications.map(toPublicApplication);
  }

  const orgApplications = await applicationRepo.findByOrganization(actor.tenant.organizationId);
  return orgApplications.map(toPublicApplication);
}

export async function createApplication(
  actor: AuthUser,
  input: CreateApplicationInput,
): Promise<DeveloperApplicationWithSecret> {
  const now = new Date().toISOString();
  const clientSecret = createClientSecret();
  const application: DeveloperApplication = {
    id: randomUUID(),
    name: validateName(input.name),
    description: validateDescription(input.description),
    ownerOrganizationId: actor.tenant.organizationId,
    clientId: createClientId(actor.tenant.organizationId),
    clientSecretHash: hashSecret(clientSecret),
    redirectUris: validateRedirectUris(input.redirectUris),
    authorizedScopes: validateScopes(input.authorizedScopes, actor),
    status: 'active',
    createdAt: now,
    updatedAt: now,
    createdByUserId: actor.id,
  };

  await applicationRepo.create(application);
  recordAuditEvent({
    action: 'application.created',
    actorUserId: actor.id,
    organizationId: actor.tenant.organizationId,
    resourceType: 'application',
    resourceId: application.id,
    metadata: { scopes: application.authorizedScopes },
  });

  return {
    ...toPublicApplication(application),
    clientSecret,
  };
}

export async function updateApplication(
  actor: AuthUser,
  id: string,
  input: UpdateApplicationInput,
): Promise<DeveloperApplicationPublic> {
  const application = await applicationRepo.findById(id);
  if (!application) {
    throw notFound();
  }

  assertTenantAccess(application, actor);

  const changes: Partial<DeveloperApplication> = {
    updatedAt: new Date().toISOString(),
    updatedByUserId: actor.id,
  };

  if (input.name !== undefined) {
    changes.name = validateName(input.name);
  }

  if (input.description !== undefined) {
    changes.description = validateDescription(input.description);
  }

  if (input.authorizedScopes !== undefined) {
    changes.authorizedScopes = validateScopes(input.authorizedScopes, actor);
  }

  if (input.redirectUris !== undefined) {
    changes.redirectUris = validateRedirectUris(input.redirectUris);
  }

  const updated = await applicationRepo.update(id, changes);
  if (!updated) {
    throw notFound();
  }

  recordAuditEvent({
    action: 'application.updated',
    actorUserId: actor.id,
    organizationId: actor.tenant.organizationId,
    resourceType: 'application',
    resourceId: id,
    metadata: { changedFields: Object.keys(changes) },
  });

  return toPublicApplication(updated);
}

export async function disableApplication(actor: AuthUser, id: string): Promise<DeveloperApplicationPublic> {
  const application = await applicationRepo.findById(id);
  if (!application) {
    throw notFound();
  }

  assertTenantAccess(application, actor);

  const updated = await applicationRepo.update(id, {
    status: 'disabled',
    disabledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedByUserId: actor.id,
  });

  if (!updated) {
    throw notFound();
  }

  recordAuditEvent({
    action: 'application.disabled',
    actorUserId: actor.id,
    organizationId: actor.tenant.organizationId,
    resourceType: 'application',
    resourceId: id,
  });

  return toPublicApplication(updated);
}

export async function regenerateClientSecret(
  actor: AuthUser,
  id: string,
): Promise<DeveloperApplicationWithSecret> {
  const application = await applicationRepo.findById(id);
  if (!application) {
    throw notFound();
  }

  assertTenantAccess(application, actor);

  const clientSecret = createClientSecret();
  const updated = await applicationRepo.update(id, {
    clientSecretHash: hashSecret(clientSecret),
    updatedAt: new Date().toISOString(),
    updatedByUserId: actor.id,
  });

  if (!updated) {
    throw notFound();
  }

  recordAuditEvent({
    action: 'application.secret_regenerated',
    actorUserId: actor.id,
    organizationId: actor.tenant.organizationId,
    resourceType: 'application',
    resourceId: id,
  });

  return {
    ...toPublicApplication(updated),
    clientSecret,
  };
}
