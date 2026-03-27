import { Integration, BodyGraphData } from '../types/types';

export const integrationsMock: Integration[] = [
  {
    id: 'apple',
    name: 'Apple HealthKit',
    status: 'connected',
    lastSync: '2026-03-27T15:45:00Z',
  },
  {
    id: 'google',
    name: 'Health Connect',
    status: 'syncing',
    lastSync: '2026-03-27T15:50:00Z',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    status: 'disconnected',
    lastSync: null,
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    status: 'error',
    lastSync: '2026-03-27T14:30:00Z',
  },
  {
    id: 'manual',
    name: 'Manual Input',
    status: 'connected',
    lastSync: '2026-03-27T15:00:00Z',
  },
];

export const bodyGraphMock: BodyGraphData = {
  heart_rate: 72,
  steps: 10500,
  sleep: 7.2,
  stress: 18,
  source: 'Apple HealthKit',
  timestamp: '2026-03-27T15:45:00Z',
};
