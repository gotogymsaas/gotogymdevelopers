import type { AppPermission, AppRole, TenantContext } from '../types/auth';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  permissions: AppPermission[];
  tenant: TenantContext;
}

const password123456Hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';

const userPermissions: AppPermission[] = [
  'smartwatch:read',
  'bodygraph:read',
];

const gymPermissions: AppPermission[] = [
  'business:wellbeing:read',
  'integrations:read',
  'bodygraph:read',
];

const adminPermissions: AppPermission[] = [
  'integrations:read',
  'integrations:sync',
  'bodygraph:read',
  'smartwatch:read',
  'business:wellbeing:read',
  'admin:modules:read',
];

export const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    email: 'user@test.com',
    passwordHash: password123456Hash,
    role: 'user',
    permissions: userPermissions,
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
    role: 'gym',
    permissions: gymPermissions,
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
    role: 'admin',
    permissions: adminPermissions,
    tenant: {
      tenantId: 'tenant-platform',
      organizationId: 'org-platform',
      workspaceId: 'workspace-platform-admin',
      membershipId: 'membership-admin-001',
    },
  },
];
