import { Integration } from '../models/integration.model';

export const integrations: Integration[] = [
  {
    id: '1',
    name: 'Apple HealthKit',
    type: 'HealthKit',
    state: 'success',
    lastSync: '2026-03-27T10:00:00Z',
    source: 'HealthKit'
  },
  {
    id: '2',
    name: 'Google Health Connect',
    type: 'HealthConnect',
    state: 'disconnected',
    lastSync: null,
    source: 'HealthConnect'
  },
  {
    id: '3',
    name: 'Garmin',
    type: 'Garmin',
    state: 'syncing',
    lastSync: '2026-03-27T09:30:00Z',
    source: 'Garmin'
  },
  {
    id: '4',
    name: 'Fitbit',
    type: 'Fitbit',
    state: 'error',
    lastSync: '2026-03-26T22:00:00Z',
    source: 'Fitbit'
  },
  {
    id: '5',
    name: 'Manual Input',
    type: 'ManualInput',
    state: 'success',
    lastSync: '2026-03-27T08:00:00Z',
    source: 'ManualInput'
  }
];
