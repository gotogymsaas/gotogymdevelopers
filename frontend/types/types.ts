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

export interface Integration {
  id: string;
  name: string;
  status: IntegrationStatus;
  lastSync: string | null;
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
