export interface SyncResult {
  integrationId: string;
  status: 'success' | 'error' | 'syncing';
  message: string;
  syncedAt: string; // ISO date
}
