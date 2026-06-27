import type { Integration, IntegrationCategory } from '../../types/types';

interface IntegrationMetadata {
  category: IntegrationCategory;
  description: string;
  providerKey: string;
  configurable: boolean;
}

const defaultMetadata: IntegrationMetadata = {
  category: 'Actividad',
  description: 'Fuente disponible para enviar eventos de bienestar y actividad hacia GoToGym Developers.',
  providerKey: 'generic_provider',
  configurable: true,
};

const metadataByProvider: Record<string, IntegrationMetadata> = {
  '1': {
    category: 'Salud',
    description: 'Sincroniza actividad, frecuencia cardiaca y datos de bienestar desde Apple HealthKit.',
    providerKey: 'healthkit',
    configurable: true,
  },
  '2': {
    category: 'Salud',
    description: 'Conecta Google Health Connect para centralizar metricas de salud y actividad Android.',
    providerKey: 'health_connect',
    configurable: true,
  },
  '3': {
    category: 'Wearables',
    description: 'Integra Garmin para actividad, entrenamiento, sueno y recuperacion de usuarios conectados.',
    providerKey: 'garmin',
    configurable: true,
  },
  '4': {
    category: 'Wearables',
    description: 'Recibe metricas de Fitbit para seguimiento diario, sueno y senales de actividad.',
    providerKey: 'fitbit',
    configurable: true,
  },
  '5': {
    category: 'Manual',
    description: 'Permite registrar informacion manual cuando el usuario no tiene un dispositivo conectado.',
    providerKey: 'manual_input',
    configurable: false,
  },
};

const inferMetadata = (integration: Integration): IntegrationMetadata => {
  const name = integration.name.toLowerCase();

  if (name.includes('garmin')) {
    return metadataByProvider['3'] ?? defaultMetadata;
  }

  if (name.includes('fitbit')) {
    return metadataByProvider['4'] ?? defaultMetadata;
  }

  if (name.includes('google')) {
    return metadataByProvider['2'] ?? defaultMetadata;
  }

  if (name.includes('manual')) {
    return metadataByProvider['5'] ?? defaultMetadata;
  }

  return metadataByProvider['1'] ?? defaultMetadata;
};

export const toMarketplaceIntegrations = (integrations: Integration[]): Integration[] =>
  integrations.map(integration => {
    const metadata = metadataByProvider[integration.id] ?? inferMetadata(integration);

    return {
      ...integration,
      category: integration.category ?? metadata.category,
      description: integration.description ?? metadata.description,
      providerKey: integration.providerKey ?? metadata.providerKey,
      configurable: integration.configurable ?? metadata.configurable,
    };
  });
