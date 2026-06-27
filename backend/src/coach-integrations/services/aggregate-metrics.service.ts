import type { OAuthIntrospectionResponse } from '../../models/oauth.model';
import type { AggregateMetricsQuery, AggregateMetricsResponse } from '../types/coach-integration.types';
import { recordAuditEvent } from '../../services/audit.service';

const normalizePeriod = (period?: string): AggregateMetricsResponse['period'] => {
  if (period === '7d' || period === '90d') {
    return period;
  }
  return '30d';
};

export function getAggregateMetrics(
  token: OAuthIntrospectionResponse,
  query: AggregateMetricsQuery,
): AggregateMetricsResponse {
  const organizationId = query.organizationId ?? token.organization_id ?? 'unknown-organization';
  const period = normalizePeriod(query.period);
  const cohort = query.cohort ?? 'all';
  const activeUsers = cohort === 'small-team' ? 4 : 126;
  const minimumCohortSize = 10;
  const suppressed = activeUsers < minimumCohortSize;

  const response: AggregateMetricsResponse = {
    tenantId: token.tenant_id ?? 'unknown-tenant',
    organizationId,
    period,
    cohort,
    minimumCohortSize,
    metrics: suppressed
      ? {
          activeUsers,
          averageReadiness: 0,
          averageAdherencePercent: 0,
          highStressPercent: 0,
        }
      : {
          activeUsers,
          averageReadiness: 76,
          averageAdherencePercent: 71,
          highStressPercent: 18,
        },
    privacy: {
      aggregateOnly: true,
      suppressed,
      suppressedReason: suppressed ? 'Cohort below minimum privacy threshold' : undefined,
    },
  };

  recordAuditEvent({
    action: 'quantum_coach.metrics.exposed',
    actorUserId: token.sub ?? 'oauth-subject',
    organizationId,
    resourceType: 'quantum_coach',
    resourceId: `${organizationId}:${period}:${cohort}`,
    metadata: {
      clientId: token.client_id,
      aggregateOnly: true,
      suppressed,
    },
  });

  return response;
}
