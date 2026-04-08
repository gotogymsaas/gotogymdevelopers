import { useMemo, useState } from 'react';
import type { Integration } from '../types/types';

export interface IntegrationAlert {
  id: string;
  integrationId: string;
  integrationName: string;
  message: string;
}

interface UseNotificationsResult {
  alerts: IntegrationAlert[];
  count: number;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

/**
 * Deriva alertas automáticas por integraciones desconectadas.
 * El listado se recalcula reactivamente cada vez que `integrations` cambia.
 */
export function useNotifications(integrations: Integration[]): UseNotificationsResult {
  const [isOpen, setIsOpen] = useState(false);

  const alerts = useMemo<IntegrationAlert[]>(
    () =>
      integrations
        .filter(i => i.status === 'disconnected')
        .map(i => ({
          id: `alert-${i.id}`,
          integrationId: i.id,
          integrationName: i.name,
          message: `La integración con ${i.name} está desconectada, por favor revísela.`,
        })),
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
