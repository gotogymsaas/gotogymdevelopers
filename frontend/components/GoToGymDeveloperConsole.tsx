import React, { useEffect, useState } from 'react';
import { useDeveloperDashboard } from '../hooks/useDeveloperDashboard';
import { AppHeader } from './layout/AppHeader';
import { AppSidebar } from './layout/AppSidebar';
import type { Section } from './layout/AppSidebar';
import type { UserRole } from '../auth/rbac';
import { getRoleAccess, getRoleDisplayName } from '../auth/rbac';
import { DashboardSection } from './sections/DashboardSection';
import { CardsSection } from './sections/CardsSection';
import { IntegrationsTable } from './sections/IntegrationsTable';
import { ActionsSection } from './sections/ActionsSection';
import { ResultsPanel } from './sections/ResultsPanel';
import { NotificationsSection } from './sections/NotificationsSection';
import { SmartwatchSection } from './sections/SmartwatchSection';
import { useSmartwatchMetrics } from '../hooks/useSmartwatchMetrics';
import '../styles/GoToGymDeveloperConsole.css';

interface GoToGymDeveloperConsoleProps {
  onLogout: () => void;
  role: UserRole;
}

export const GoToGymDeveloperConsole: React.FC<GoToGymDeveloperConsoleProps> = ({ onLogout, role }) => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [highlightedIntegrationId, setHighlightedIntegrationId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isUser = role === 'user';
  const roleAccess = getRoleAccess(role);
  const isAdmin = roleAccess.canViewSidebar;
  const currentSection: Section = isAdmin ? activeSection : 'dashboard';

  const {
    metrics: smartwatchMetrics,
    loading: smartwatchLoading,
    error: smartwatchError,
    dataSource: smartwatchDataSource,
    reloadMetrics,
  } = useSmartwatchMetrics({ enabled: isUser });

  useEffect(() => {
    if (!isAdmin) {
      setActiveSection('dashboard');
      setSidebarCollapsed(false);
    }
  }, [isAdmin]);

  const handleNavigateToIntegration = (integrationId: string) => {
    if (!isAdmin) {
      return;
    }

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
    syncIntegration,
    syncingId,
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
    switch (currentSection) {
      case 'dashboard':
        if (isUser) {
          return (
            <SmartwatchSection
              metrics={smartwatchMetrics}
              loading={smartwatchLoading}
              error={smartwatchError}
              dataSource={smartwatchDataSource}
              onRetry={reloadMetrics}
            />
          );
        }

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
            onSyncRow={syncIntegration}
            syncingId={syncingId}
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
    <div
      className={`gtg-app${isAdmin && sidebarCollapsed ? ' sidebar-collapsed' : ''}${!isAdmin ? ' no-sidebar' : ''}`}
    >
      {isAdmin && (
        <AppSidebar
          active={activeSection}
          onNavigate={setActiveSection}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          adminModules={roleAccess.adminModules}
          roleLabel={getRoleDisplayName(role)}
        />
      )}
      <div className="gtg-main-area">
        <AppHeader
          section={currentSection}
          integrations={integrations}
          onNavigateToIntegration={handleNavigateToIntegration}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          sidebarCollapsed={sidebarCollapsed}
          showSidebarToggle={isAdmin}
          onLogout={onLogout}
        />
        <main className="gtg-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

