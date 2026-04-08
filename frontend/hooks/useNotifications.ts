import { useMemo, useState } from 'react';
import type { Integration, IntegrationStatus } from '../types/types';

export interface IntegrationAlert {
  id: string;
  integrationId: string;
  integrationName: string;
  message: string;
  status: IntegrationStatus;
}

interface UseNotificationsResult {
  alerts: IntegrationAlert[];
  count: number;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

/** Descripción humana del estado para el mensaje de alerta */
const STATUS_LABEL: Partial<Record<IntegrationStatus, string>> = {
  disconnected: 'desconectada',
  syncing: 'en proceso de sincronización sin resultado',
  error: 'con error de sistema',
  syncing_error: 'con error durante la sincronización',
  timeout: 'con timeout en la última operación',
  pending_review: 'pendiente de revisión',
  failed: 'con fallo en la última operación',
  unauthorized: 'con credenciales no autorizadas',
};

/**
 * Deriva alertas automáticas para toda integración cuyo estado sea distinto de "connected".
 * El listado se recalcula reactivamente cada vez que `integrations` cambia.
 */
export function useNotifications(integrations: Integration[]): UseNotificationsResult {
  const [isOpen, setIsOpen] = useState(false);

  const alerts = useMemo<IntegrationAlert[]>(
    () =>
      integrations
        .filter(i => i.status !== 'connected')
        .map(i => {
          const label = STATUS_LABEL[i.status] ?? `con estado ${i.status}`;
          return {
            id: `alert-${i.id}`,
            integrationId: i.id,
            integrationName: i.name,
            status: i.status,
            message: `La integración con ${i.name} presenta estado ${i.status} — ${label}. Por favor revísela.`,
          };
        }),
    [integrations],
  );

  return {
    alerts,
    count: alerts.length,
    isOpen,
    toggle: () => setIsOpen(v => !v),
    close: () => setIsOpen(false),
  };
}
