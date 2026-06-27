import type { AppRole, Scope, TenantContext } from '../types/auth';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  scopes: Scope[];
  tenant: TenantContext;
  applicationId?: string;
  tokenType?: 'user' | 'application';
}

const password123456Hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';

const endUserScopes: Scope[] = [
  'profile:read:self',
  'profile:update:self',
  'smartwatch:read:self',
  'coach_context:read:self',
  'bodygraph:read:self',
];

const companyOwnerScopes: Scope[] = [
  'organization:read:organization',
  'organization:update:organization',
  'organization_members:read:organization',
  'organization_members:invite:organization',
  'corporate_wellbeing:read:organization',
  'integrations:read:organization',
  'integrations:sync:organization',
  'applications:manage:organization',
  'api_credentials:manage:organization',
  'billing:manage:organization',
];

const gotogymAdminScopes: Scope[] = [
  'profile:read:self',
  'organization:read:organization',
  'organization:update:organization',
  'organization_members:read:organization',
  'organization_members:invite:organization',
  'corporate_wellbeing:read:organization',
  'integrations:read:organization',
  'integrations:sync:organization',
  'applications:manage:organization',
  'api_credentials:manage:organization',
  'audit_logs:read:platform',
  'billing:manage:organization',
  'bodygraph:read:self',
  'smartwatch:read:self',
];

const integratorScopes: Scope[] = [
  'integrations:read:organization',
  'integrations:sync:organization',
];

export const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    email: 'user@test.com',
    passwordHash: password123456Hash,
    role: 'end_user',
    scopes: endUserScopes,
    tenant: {
      tenantId: 'tenant-user-001',
      organizationId: 'org-consumer',
      workspaceId: 'workspace-user-001',
      membershipId: 'membership-user-001',
    },
  },
  {
    id: 'gym-001',
    email: 'gym@test.com',
    passwordHash: password123456Hash,
    role: 'company_owner',
    scopes: companyOwnerScopes,
    tenant: {
      tenantId: 'tenant-gym-001',
      organizationId: 'org-gym-001',
      workspaceId: 'workspace-gym-001',
      membershipId: 'membership-gym-001',
    },
  },
  {
    id: 'admin-001',
    email: 'admin@test.com',
    passwordHash: password123456Hash,
    role: 'gotogym_admin',
    scopes: gotogymAdminScopes,
    tenant: {
      tenantId: 'tenant-platform',
      organizationId: 'org-platform',
      workspaceId: 'workspace-platform-admin',
      membershipId: 'membership-admin-001',
    },
  },
  {
    id: 'integrator-001',
    email: 'integrator@test.com',
    passwordHash: password123456Hash,
    role: 'integrator',
    scopes: integratorScopes,
    applicationId: 'app-integrator-001',
    tokenType: 'application',
    tenant: {
      tenantId: 'tenant-gym-001',
      organizationId: 'org-gym-001',
      workspaceId: 'workspace-gym-001',
      membershipId: 'membership-integrator-001',
    },
  },
];
