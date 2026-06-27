import type { AppRole, Scope } from './auth';

export type DeveloperScope =
  | 'profile.read'
  | 'wellbeing.read'
  | 'metrics.read'
  | 'analytics.read'
  | 'organization.read'
  | 'devices.read'
  | 'documents.read';

export type DeveloperScopeDomain =
  | 'identity'
  | 'wellbeing'
  | 'metrics'
  | 'analytics'
  | 'organization'
  | 'devices'
  | 'documents';

export type DeveloperScopeSensitivity = 'low' | 'medium' | 'high';

export interface DeveloperScopeDefinition {
  key: DeveloperScope;
  domain: DeveloperScopeDomain;
  description: string;
  parent?: DeveloperScope;
  includes: DeveloperScope[];
  allowedRoles: AppRole[];
  internalScopes: Scope[];
  requiresConsent: boolean;
  requiresAudit: boolean;
  sensitivity: DeveloperScopeSensitivity;
}

export interface DeveloperScopeValidationResult {
  valid: boolean;
  normalizedScopes: DeveloperScope[];
  invalidScopes: string[];
  restrictedScopes: DeveloperScope[];
}

export const DEVELOPER_SCOPE_DEFINITIONS: Record<DeveloperScope, DeveloperScopeDefinition> = {
  'profile.read': {
    key: 'profile.read',
    domain: 'identity',
    description: 'Lectura basica del perfil del usuario autenticado.',
    includes: [],
    allowedRoles: ['end_user', 'company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['profile:read:self'],
    requiresConsent: true,
    requiresAudit: false,
    sensitivity: 'low',
  },
  'wellbeing.read': {
    key: 'wellbeing.read',
    domain: 'wellbeing',
    description: 'Lectura de contexto de bienestar, recomendaciones y resumen de salud.',
    parent: 'profile.read',
    includes: ['profile.read'],
    allowedRoles: ['end_user', 'company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['coach_context:read:self', 'corporate_wellbeing:read:organization'],
    requiresConsent: true,
    requiresAudit: true,
    sensitivity: 'high',
  },
  'metrics.read': {
    key: 'metrics.read',
    domain: 'metrics',
    description: 'Lectura de metricas personales y agregadas de actividad, wearables y BodyGraph.',
    parent: 'wellbeing.read',
    includes: ['profile.read', 'wellbeing.read', 'devices.read'],
    allowedRoles: ['end_user', 'company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['smartwatch:read:self', 'bodygraph:read:self'],
    requiresConsent: true,
    requiresAudit: true,
    sensitivity: 'high',
  },
  'analytics.read': {
    key: 'analytics.read',
    domain: 'analytics',
    description: 'Lectura de analitica agregada de uso, actividad y bienestar.',
    parent: 'metrics.read',
    includes: ['profile.read', 'wellbeing.read', 'metrics.read', 'organization.read'],
    allowedRoles: ['company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['corporate_wellbeing:read:organization', 'audit_logs:read:organization'],
    requiresConsent: true,
    requiresAudit: true,
    sensitivity: 'medium',
  },
  'organization.read': {
    key: 'organization.read',
    domain: 'organization',
    description: 'Lectura de datos de organizacion, tenant y membresias relacionadas.',
    includes: [],
    allowedRoles: ['company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['organization:read:organization', 'organization_members:read:organization'],
    requiresConsent: false,
    requiresAudit: true,
    sensitivity: 'medium',
  },
  'devices.read': {
    key: 'devices.read',
    domain: 'devices',
    description: 'Lectura de dispositivos conectados y estado de sincronizacion.',
    parent: 'profile.read',
    includes: ['profile.read'],
    allowedRoles: ['end_user', 'company_owner', 'company_manager', 'gotogym_admin', 'integrator'],
    internalScopes: ['integrations:read:self', 'integrations:read:organization'],
    requiresConsent: true,
    requiresAudit: false,
    sensitivity: 'medium',
  },
  'documents.read': {
    key: 'documents.read',
    domain: 'documents',
    description: 'Lectura de documentos autorizados por el usuario.',
    parent: 'profile.read',
    includes: ['profile.read'],
    allowedRoles: ['end_user', 'gotogym_admin'],
    internalScopes: ['documents:read:self'],
    requiresConsent: true,
    requiresAudit: true,
    sensitivity: 'high',
  },
};

export const DEVELOPER_SCOPES = Object.keys(DEVELOPER_SCOPE_DEFINITIONS) as DeveloperScope[];

export const isDeveloperScope = (value: unknown): value is DeveloperScope =>
  typeof value === 'string' && DEVELOPER_SCOPES.includes(value as DeveloperScope);

export const expandDeveloperScopes = (scopes: DeveloperScope[]): DeveloperScope[] => {
  const expanded = new Set<DeveloperScope>();

  const addScope = (scope: DeveloperScope) => {
    if (expanded.has(scope)) {
      return;
    }

    expanded.add(scope);
    DEVELOPER_SCOPE_DEFINITIONS[scope].includes.forEach(addScope);
  };

  scopes.forEach(addScope);
  return [...expanded];
};

export const validateDeveloperScopes = (
  scopes: unknown,
  role?: AppRole,
): DeveloperScopeValidationResult => {
  const rawScopes = Array.isArray(scopes) ? scopes : [];
  const invalidScopes = rawScopes.filter(scope => !isDeveloperScope(scope)).map(String);
  const normalizedScopes = expandDeveloperScopes(rawScopes.filter(isDeveloperScope));
  const restrictedScopes = role
    ? normalizedScopes.filter(scope => !DEVELOPER_SCOPE_DEFINITIONS[scope].allowedRoles.includes(role))
    : [];

  return {
    valid: invalidScopes.length === 0 && restrictedScopes.length === 0 && normalizedScopes.length > 0,
    normalizedScopes,
    invalidScopes,
    restrictedScopes,
  };
};

export const developerScopeToInternalScopes = (scope: DeveloperScope): Scope[] =>
  DEVELOPER_SCOPE_DEFINITIONS[scope].internalScopes;

export const internalScopesToDeveloperScopes = (scopes: Scope[]): DeveloperScope[] => {
  const developerScopes = DEVELOPER_SCOPES.filter(scope =>
    DEVELOPER_SCOPE_DEFINITIONS[scope].internalScopes.some(internalScope => scopes.includes(internalScope)),
  );

  return expandDeveloperScopes(developerScopes);
};
