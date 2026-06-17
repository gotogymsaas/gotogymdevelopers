export type AppRole = 'user' | 'gym' | 'admin';

export type AppPermission =
  | 'integrations:read'
  | 'integrations:sync'
  | 'bodygraph:read'
  | 'smartwatch:read'
  | 'business:wellbeing:read'
  | 'admin:modules:read';

export interface TenantContext {
  tenantId: string;
  organizationId?: string;
  workspaceId?: string;
  membershipId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
  permissions: AppPermission[];
  tenant: TenantContext;
}
