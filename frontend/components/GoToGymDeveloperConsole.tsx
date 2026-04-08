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
import { NotificationsSection } from './sections/NotificationsSection';
import '../styles/GoToGymDeveloperConsole.css';

export const GoToGymDeveloperConsole: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [highlightedIntegrationId, setHighlightedIntegrationId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigateToIntegration = (integrationId: string) => {
    setActiveSection('integrations');
    if (integrationId) {
      setHighlightedIntegrationId(integrationId);
      setTimeout(() => setHighlightedIntegrationId(null), 3000);
    }
  };

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
            highlightedId={highlightedIntegrationId}
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
      case 'notifications':
        return (
          <NotificationsSection
            integrations={integrations}
            onNavigateToIntegration={handleNavigateToIntegration}
          />
        );
    }
  };

  return (
    <div className={`gtg-app${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <AppSidebar
        active={activeSection}
        onNavigate={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="gtg-main-area">
        <AppHeader
          section={activeSection}
          integrations={integrations}
          onNavigateToIntegration={handleNavigateToIntegration}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="gtg-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

