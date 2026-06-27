import type { DeveloperScope } from '../../types/developer-scopes';

export type QAFExperienceId =
  | 'daily_checkin'
  | 'habit_reinforcement'
  | 'recovery_guidance'
  | 'progress_review'
  | 'corporate_wellbeing_summary';

export type SensitiveField =
  | 'profile.email'
  | 'profile.name'
  | 'documents.rawText'
  | 'metrics.rawSamples'
  | 'wellbeing.freeText';

export interface CoachTenantContext {
  tenantId: string;
  organizationId: string;
  clientId: string;
  subjectUserId: string;
}

export interface ConsentDecision {
  allowed: boolean;
  enforced: boolean;
  requiredScopes: DeveloperScope[];
  missingScopes: DeveloperScope[];
  reason?: string;
}

export interface CoachContextRequest {
  subjectUserId?: string;
  requestedScopes?: DeveloperScope[];
  includeDocuments?: boolean;
}

export interface CoachUserContext {
  subjectUserId: string;
  tenantId: string;
  organizationId: string;
  profile?: {
    displayName?: string;
    segment?: 'consumer' | 'employee' | 'athlete';
  };
  wellbeing?: {
    readiness: number;
    stressLevel: 'low' | 'medium' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good';
    lastCoachSummary: string;
  };
  metrics?: {
    activityScore: number;
    recoveryScore: number;
    adherencePercent: number;
  };
  devices?: Array<{
    provider: string;
    status: 'connected' | 'stale' | 'revoked';
    lastSyncAt: string;
  }>;
  documents?: Array<{
    id: string;
    type: string;
    summary: string;
  }>;
  consent: ConsentDecision;
  redactions: SensitiveField[];
}

export interface QAFExecutionRequest {
  subjectUserId?: string;
  experienceId: QAFExperienceId;
  inputs?: Record<string, unknown>;
}

export interface QAFExecutionResult {
  executionId: string;
  experienceId: QAFExperienceId;
  status: 'completed' | 'blocked';
  tenantId: string;
  organizationId: string;
  subjectUserId: string;
  recommendation?: {
    title: string;
    actions: string[];
    confidence: number;
  };
  consent: ConsentDecision;
  redactions: SensitiveField[];
}

export interface AggregateMetricsQuery {
  organizationId?: string;
  period?: '7d' | '30d' | '90d';
  cohort?: string;
}

export interface AggregateMetricsResponse {
  tenantId: string;
  organizationId: string;
  period: '7d' | '30d' | '90d';
  cohort: string;
  minimumCohortSize: number;
  metrics: {
    activeUsers: number;
    averageReadiness: number;
    averageAdherencePercent: number;
    highStressPercent: number;
  };
  privacy: {
    aggregateOnly: true;
    suppressed: boolean;
    suppressedReason?: string;
  };
}
