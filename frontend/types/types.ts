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
