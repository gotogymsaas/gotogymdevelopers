export type IntegrationStatus =
  | 'connected'
  | 'disconnected'
  | 'syncing'
  | 'error'
  | 'syncing_error'
  | 'timeout'
  | 'pending_review'
  | 'failed'
  | 'unauthorized';

export type IntegrationCategory =
  | 'Wearables'
  | 'Salud'
  | 'Actividad'
  | 'Empresa'
  | 'Manual';

export interface Integration {
  id: string;
  name: string;
  status: IntegrationStatus;
  lastSync: string | null;
  category?: IntegrationCategory;
  description?: string;
  providerKey?: string;
  configurable?: boolean;
}

export type DeveloperApplicationStatus = 'active' | 'disabled';

export type ApplicationScope =
  | 'profile.read'
  | 'wellbeing.read'
  | 'metrics.read'
  | 'analytics.read'
  | 'organization.read'
  | 'devices.read'
  | 'documents.read';

export interface DeveloperApplication {
  id: string;
  name: string;
  description?: string;
  ownerOrganizationId: string;
  clientId: string;
  redirectUris: string[];
  authorizedScopes: ApplicationScope[];
  status: DeveloperApplicationStatus;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
  createdByUserId: string;
  updatedByUserId?: string;
}

export interface DeveloperApplicationWithSecret extends DeveloperApplication {
  clientSecret: string;
}

export interface ApplicationFormInput {
  name: string;
  description: string;
  redirectUris: string[];
  authorizedScopes: ApplicationScope[];
}

export type ConsentStatus = 'pending' | 'authorized' | 'rejected' | 'revoked';

export type ConsentAuditAction =
  | 'consent.requested'
  | 'consent.authorized'
  | 'consent.rejected'
  | 'consent.revoked';

export interface IntegrationConsent {
  id: string;
  userId: string;
  integrationId: string;
  integrationName: string;
  ownerCompany: string;
  requestedScopes: ApplicationScope[];
  status: ConsentStatus;
  requestedAt: string;
  authorizedAt?: string;
  rejectedAt?: string;
  revokedAt?: string;
  updatedAt: string;
}

export interface ConsentHistoryEvent {
  id: string;
  consentId: string;
  action: ConsentAuditAction;
  actorUserId: string;
  status: ConsentStatus;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ConsentWithHistory extends IntegrationConsent {
  history: ConsentHistoryEvent[];
}

export interface BodyGraphData {
  heart_rate: number;
  steps: number;
  sleep: number;
  stress: number;
  source: string;
  timestamp: string;
}

export type SmartwatchMetricId =
  | 'heart_rate'
  | 'spo2'
  | 'sleep'
  | 'physical_activity'
  | 'stress'
  | 'blood_pressure'
  | 'ecg'
  | 'body_temperature'
  | 'health_tracking';

export interface SmartwatchMetric {
  id: SmartwatchMetricId;
  title: string;
  value: string;
  note: string;
}

export type SmartwatchDetailTone = 'normal' | 'good' | 'warning' | 'danger' | 'info';

export interface SmartwatchDetailItem {
  label: string;
  value: string;
  tone?: SmartwatchDetailTone;
}

export interface SmartwatchDetailSection {
  title: string;
  items: SmartwatchDetailItem[];
  note?: string;
}

export interface SmartwatchMetricDetail {
  sections: SmartwatchDetailSection[];
}

export type SmartwatchMetricDetailsMap = Record<SmartwatchMetricId, SmartwatchMetricDetail>;

export interface HeartRateTrendPoint {
  time: string;
  bpm: number;
}

export interface SleepPhaseDatum {
  phase: 'Ligero' | 'Profundo' | 'REM';
  hours: number;
  color: string;
}

export interface ActivitySummaryDatum {
  metric: 'Pasos' | 'Calorias' | 'Distancia';
  value: number;
  unit: string;
  color: string;
}
