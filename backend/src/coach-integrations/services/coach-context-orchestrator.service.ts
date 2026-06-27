import type { OAuthIntrospectionResponse } from '../../models/oauth.model';
import { expandDeveloperScopes, type DeveloperScope } from '../../types/developer-scopes';
import {
  CoachContextRequest,
  CoachTenantContext,
  CoachUserContext,
} from '../types/coach-integration.types';
import { evaluateConsentPolicy, parseGrantedScopes } from './third-party-consent-policy.service';
import { enforceSensitiveDataPolicy } from './sensitive-data-guard.service';
import { recordAuditEvent } from '../../services/audit.service';

const toTenantContext = (
  token: OAuthIntrospectionResponse,
  subjectUserId?: string,
): CoachTenantContext => ({
  tenantId: token.tenant_id ?? 'unknown-tenant',
  organizationId: token.organization_id ?? 'unknown-organization',
  clientId: token.client_id ?? 'unknown-client',
  subjectUserId: subjectUserId ?? token.sub ?? 'unknown-user',
});

export function buildCoachContext(
  token: OAuthIntrospectionResponse,
  request: CoachContextRequest,
): CoachUserContext {
  const grantedScopes = parseGrantedScopes(token.scope);
  const requestedScopes = expandDeveloperScopes(
    request.requestedScopes && request.requestedScopes.length > 0
      ? request.requestedScopes
      : ['profile.read', 'wellbeing.read'],
  ).filter(scope => grantedScopes.includes(scope));
  const tenant = toTenantContext(token, request.subjectUserId);
  const consent = evaluateConsentPolicy(requestedScopes, grantedScopes);

  const baseContext: CoachUserContext = {
    subjectUserId: tenant.subjectUserId,
    tenantId: tenant.tenantId,
    organizationId: tenant.organizationId,
    profile: {
      displayName: 'Usuario GoToGym',
      segment: 'employee',
    },
    wellbeing: {
      readiness: 78,
      stressLevel: 'medium',
      sleepQuality: 'good',
      lastCoachSummary: 'Resumen sintetico disponible para experiencia QAF.',
    },
    metrics: {
      activityScore: 82,
      recoveryScore: 74,
      adherencePercent: 69,
    },
    devices: [
      {
        provider: 'GoToGym Wearables',
        status: 'connected',
        lastSyncAt: new Date().toISOString(),
      },
    ],
    documents: request.includeDocuments
      ? [
          {
            id: 'doc-context-summary',
            type: 'coach_summary',
            summary: 'Documento resumido sin texto fuente sensible.',
          },
        ]
      : undefined,
    consent,
    redactions: [],
  };

  const safeContext = enforceSensitiveDataPolicy(baseContext, grantedScopes);

  recordAuditEvent({
    action: 'quantum_coach.context.shared',
    actorUserId: token.sub ?? 'oauth-subject',
    organizationId: tenant.organizationId,
    resourceType: 'quantum_coach',
    resourceId: tenant.subjectUserId,
    metadata: {
      clientId: tenant.clientId,
      tenantId: tenant.tenantId,
      requestedScopes,
      redactions: safeContext.redactions,
    },
  });

  return safeContext;
}
