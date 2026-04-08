import React, { useState } from 'react';
import { useDeveloperDashboard } from '../hooks/useDeveloperDashboard';
import { AppHeader } from './layout/AppHeader';
import { AppSidebar } from './layout/AppSidebar';
import type { Section } from './layout/AppSidebar';
import { DashboardSection } from './sections/DashboardSection';
import { CardsSection } from './sections/CardsSection';
import { IntegrationsTable } from './sections/IntegrationsTable';
import { ActionsSection } from './sections/ActionsSection';
import { ResultsPanel } from './sections/ResultsPanel';
import '../styles/GoToGymDeveloperConsole.css';

export const GoToGymDeveloperConsole: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const {
    integrations,
    selectedSource,
    setSelectedSource,
    uiState,
    bodyGraph,
    error,
    handleSync,
  } = useDeveloperDashboard();

  const activeIntegrations = integrations.filter(i => i.status === 'connected').length;
  const connectedSources = integrations.filter(i => i.status !== 'disconnected').length;
  const lastSync =
    integrations
      .map(i => i.lastSync)
      .filter((s): s is string => s !== null)
      .sort()
      .reverse()[0] ?? 'N/A';
  const processedEvents = 1287;

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            integrations={integrations}
            activeIntegrations={activeIntegrations}
            connectedSources={connectedSources}
            lastSync={lastSync}
            processedEvents={processedEvents}
          />
        );
      case 'cards':
        return (
          <CardsSection
            activeIntegrations={activeIntegrations}
            connectedSources={connectedSources}
            lastSync={lastSync}
            processedEvents={processedEvents}
          />
        );
      case 'integrations':
        return (
          <IntegrationsTable
            integrations={integrations}
            selectedSource={selectedSource}
            uiState={uiState}
            onSelect={setSelectedSource}
            onSync={handleSync}
          />
        );
      case 'actions':
        return (
          <ActionsSection
            integrations={integrations}
            selectedSource={selectedSource}
            uiState={uiState}
            onSelect={setSelectedSource}
            onSync={handleSync}
          />
        );
      case 'results':
        return (
          <ResultsPanel
            uiState={uiState}
            bodyGraph={bodyGraph}
            error={error}
          />
        );
    }
  };

  return (
    <div className="gtg-app">
      <AppSidebar active={activeSection} onNavigate={setActiveSection} />
      <div className="gtg-main-area">
        <AppHeader section={activeSection} />
        <main className="gtg-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

