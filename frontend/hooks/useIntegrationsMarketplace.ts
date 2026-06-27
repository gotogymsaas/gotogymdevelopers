import { useMemo, useState } from 'react';
import type { Integration, IntegrationCategory } from '../types/types';
import { toMarketplaceIntegrations } from '../src/services/integrationsService';

export type IntegrationMarketplaceFilter = 'all' | IntegrationCategory;

interface UseIntegrationsMarketplaceParams {
  integrations: Integration[];
  selectedSource: string | null;
  onSelect: (id: string) => void;
  onConnect: (id: string) => void;
}

export function useIntegrationsMarketplace({
  integrations,
  selectedSource,
  onSelect,
  onConnect,
}: UseIntegrationsMarketplaceParams) {
  const [activeFilter, setActiveFilter] = useState<IntegrationMarketplaceFilter>('all');
  const [configuredId, setConfiguredId] = useState<string | null>(null);

  const marketplaceIntegrations = useMemo(
    () => toMarketplaceIntegrations(integrations),
    [integrations],
  );

  const categories = useMemo<IntegrationCategory[]>(
    () => Array.from(new Set(marketplaceIntegrations.map(integration => integration.category).filter(Boolean))) as IntegrationCategory[],
    [marketplaceIntegrations],
  );

  const visibleIntegrations = useMemo(
    () => activeFilter === 'all'
      ? marketplaceIntegrations
      : marketplaceIntegrations.filter(integration => integration.category === activeFilter),
    [activeFilter, marketplaceIntegrations],
  );

  const connectedCount = marketplaceIntegrations.filter(integration => integration.status === 'connected').length;

  const connectIntegration = (id: string) => {
    onSelect(id);
    onConnect(id);
  };

  const configureIntegration = (id: string) => {
    onSelect(id);
    setConfiguredId(id);
  };

  return {
    activeFilter,
    categories,
    configuredId,
    connectedCount,
    selectedSource,
    visibleIntegrations,
    setActiveFilter,
    connectIntegration,
    configureIntegration,
  };
}

