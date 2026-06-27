export type AppRole = 'end_user' | 'company_owner' | 'company_manager' | 'gotogym_admin' | 'integrator';

export type Resource =
  | 'profile'
  | 'smartwatch'
  | 'coach_context'
  | 'documents'
  | 'organization'
  | 'organization_members'
  | 'corporate_wellbeing'
  | 'integrations'
  | 'bodygraph'
  | 'applications'
  | 'api_credentials'
  | 'audit_logs'
  | 'billing'
  | 'admin_console'
  | 'webhooks'
  | 'support';

export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'invite'
  | 'sync'
  | 'export'
  | 'manage'
  | 'impersonate';

export type ScopeLevel = 'self' | 'organization' | 'application' | 'platform';

export type Scope =
  | 'profile:read:self'
  | 'profile:update:self'
  | 'smartwatch:read:self'
  | 'coach_context:read:self'
  | 'bodygraph:read:self'
  | 'documents:read:self'
  | 'documents:update:self'
  | 'integrations:read:self'
  | 'integrations:sync:self'
  | 'integrations:delete:self'
  | 'organization:read:organization'
  | 'organization:update:organization'
  | 'organization_members:read:organization'
  | 'organization_members:invite:organization'
  | 'organization_members:update:organization'
  | 'corporate_wellbeing:read:organization'
  | 'integrations:read:organization'
  | 'integrations:sync:organization'
  | 'integrations:manage:organization'
  | 'applications:manage:organization'
  | 'api_credentials:manage:organization'
  | 'audit_logs:read:organization'
  | 'organization:read:platform'
  | 'organization:update:platform'
  | 'organization_members:read:platform'
  | 'corporate_wellbeing:read:platform'
  | 'integrations:read:platform'
  | 'integrations:manage:platform'
  | 'applications:manage:platform'
  | 'api_credentials:manage:platform'
  | 'audit_logs:read:platform'
  | 'billing:manage:organization'
  | 'billing:manage:platform'
  | 'admin_console:manage:platform'
  | 'support:impersonate:platform'
  | 'integrations:read:application'
  | 'integrations:sync:application'
  | 'coach_context:read:application'
  | 'smartwatch:read:application'
  | 'corporate_wellbeing:read:application'
  | 'webhooks:manage:application';

export type AppPermission = Scope;

export interface Permission {
  id: string;
  key: Scope;
  resource: Resource;
  action: Action;
  scopeLevel: ScopeLevel;
  description: string;
  sensitive: boolean;
  requiresConsent?: boolean;
  requiresAudit?: boolean;
}

export interface Role {
  id: string;
  key: AppRole;
  name: string;
  description: string;
  tenantMode: ScopeLevel;
  scopes: Scope[];
  systemRole: boolean;
}

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  type: 'consumer' | 'company' | 'gym' | 'partner' | 'platform';
  status: 'active' | 'trial' | 'suspended' | 'closed';
  plan: 'free' | 'business' | 'enterprise' | 'internal';
  parentOrganizationId?: string;
  settings?: {
    minimumCohortSize: number;
    allowThirdPartyApps: boolean;
    allowedProviderKeys: string[];
  };
}

export interface Application {
  id: string;
  key: string;
  name: string;
  ownerOrganizationId: string;
  type: 'first_party' | 'third_party' | 'internal';
  allowedScopes: Scope[];
  status: 'active' | 'disabled' | 'revoked';
  redirectUris?: string[];
  webhookUrl?: string;
  rateLimitPerMinute: number;
  createdByUserId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'invited' | 'suspended' | 'deleted';
  primaryOrganizationId?: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: AppRole;
  status: 'active' | 'invited' | 'revoked' | 'suspended';
  permissionOverrides?: {
    allow?: Scope[];
    deny?: Scope[];
  };
}

export interface ApiCredential {
  id: string;
  applicationId: string;
  clientId: string;
  secretHash: string;
  status: 'active' | 'rotating' | 'revoked';
  expiresAt?: string;
  lastUsedAt?: string;
}

export interface TenantContext {
  tenantId: string;
  organizationId: string;
  workspaceId?: string;
  membershipId: string;
  applicationId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
  scopes: Scope[];
  permissions: AppPermission[];
  tenant: TenantContext;
  applicationId?: string;
  tokenType: 'user' | 'application';
}

export type AuthPrincipal = AuthUser;
