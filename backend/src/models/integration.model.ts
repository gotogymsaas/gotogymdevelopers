export type IntegrationType = 'HealthKit' | 'HealthConnect' | 'Garmin' | 'Fitbit' | 'ManualInput';
export type IntegrationState = 'success' | 'error' | 'syncing' | 'disconnected';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  state: IntegrationState;
  lastSync: string | null;
  source: string;
}
