import { IntegrationRepository } from '../repositories/integration.repository';
import { SyncResult } from '../models/syncresult.model';

const integrationRepo = new IntegrationRepository();

export async function listIntegrations() {
  return integrationRepo.findAll();
}

export async function simulateSync(id: string): Promise<SyncResult> {
  const integration = await integrationRepo.findById(id);
  if (!integration) {
    const error: any = new Error('Integration not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
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
