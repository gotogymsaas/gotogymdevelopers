import type { OAuthIntrospectionResponse } from '../../models/oauth.model';
import type { QAFExecutionRequest, QAFExecutionResult } from '../types/coach-integration.types';
import { buildCoachContext } from './coach-context-orchestrator.service';
import { recordAuditEvent } from '../../services/audit.service';

export async function executeQAFExperience(
  token: OAuthIntrospectionResponse,
  request: QAFExecutionRequest,
): Promise<QAFExecutionResult> {
  const context = await buildCoachContext(token, {
    subjectUserId: request.subjectUserId,
    requestedScopes: ['profile.read', 'wellbeing.read', 'metrics.read'],
  });

  const blocked = !context.consent.allowed;
  const result: QAFExecutionResult = {
    executionId: `qaf-${Date.now()}`,
    experienceId: request.experienceId,
    status: blocked ? 'blocked' : 'completed',
    tenantId: context.tenantId,
    organizationId: context.organizationId,
    subjectUserId: context.subjectUserId,
    consent: context.consent,
    redactions: context.redactions,
    recommendation: blocked
      ? undefined
      : {
          title: 'Ajuste de entrenamiento recomendado',
          actions: [
            'Reducir intensidad si el estres permanece alto.',
            'Priorizar recuperacion activa durante la proxima sesion.',
            'Revisar adherencia semanal con Quantum Coach.',
          ],
          confidence: 0.82,
        },
  };

  recordAuditEvent({
    action: 'quantum_coach.qaf.executed',
    actorUserId: token.sub ?? 'oauth-subject',
    organizationId: context.organizationId,
    resourceType: 'quantum_coach',
    resourceId: result.executionId,
    metadata: {
      clientId: token.client_id,
      tenantId: context.tenantId,
      experienceId: request.experienceId,
      status: result.status,
      redactions: context.redactions,
    },
  });

  return result;
}
