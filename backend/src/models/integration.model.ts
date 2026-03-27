export type IntegrationState = 'success' | 'error' | 'syncing' | 'disconnected';

export interface Integration {
  id: string;
  name: string;
  type: 'HealthKit' | 'HealthConnect' | 'Garmin' | 'Fitbit' | 'ManualInput';
  state: IntegrationState;
  lastSync: string | null; // ISO date
  source: string;
}
