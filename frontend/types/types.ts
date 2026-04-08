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
