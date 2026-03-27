import { integrations } from '../data/mock-integrations';
import { SyncResult } from '../models/syncresult.model';

export function listIntegrations() {
  return integrations;
}

export function simulateSync(id: string): SyncResult {
  const integration = integrations.find(i => i.id === id);
  if (!integration) {
    return {
      integrationId: id,
      status: 'error',
      message: 'Integration not found',
      syncedAt: new Date().toISOString()
    };
  }
  // Simulación simple
  integration.state = 'syncing';
  setTimeout(() => {
    integration.state = 'success';
    integration.lastSync = new Date().toISOString();
  }, 1000);

  return {
    integrationId: id,
    status: 'syncing',
    message: 'Sync started',
    syncedAt: new Date().toISOString()
  };
}
