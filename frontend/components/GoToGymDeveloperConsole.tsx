import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeveloperDashboard } from '../hooks/useDeveloperDashboard';
import { AppHeader } from './layout/AppHeader';
import { AppSidebar } from './layout/AppSidebar';
import type { Section } from './layout/AppSidebar';
import type { UserRole } from '../auth/rbac';
import { getRoleAccess, getRoleDisplayName } from '../auth/rbac';
import { DashboardWelcomeSection } from './sections/DashboardWelcomeSection';
import { BusinessWellbeingSection } from './sections/BusinessWellbeingSection';
import { BusinessMembersSection } from './sections/BusinessMembersSection';
import { AppGoToGymSection, AppGoToGymWidgetsSection } from './sections/AppGoToGymSection';
import { CardsSection } from './sections/CardsSection';
import { IntegrationsMarketplaceSection } from './sections/IntegrationsMarketplaceSection';
import { ApplicationsSection } from './sections/ApplicationsSection';
import { ConsentsSection } from './sections/ConsentsSection';
import { ActionsSection } from './sections/ActionsSection';
import { ResultsPanel } from './sections/ResultsPanel';
import { NotificationsSection } from './sections/NotificationsSection';
import { SmartwatchSection } from './sections/SmartwatchSection';
import { SmartwatchSummary } from './sections/SmartwatchSummary';
import { useSmartwatchMetrics } from '../hooks/useSmartwatchMetrics';
import { useCoachContext } from '../hooks/useCoachContext';
import {
  smartwatchActivitySummaryMock,
  smartwatchHeartRateTrendMock,
  smartwatchSleepPhasesMock,
} from '../mocks/smartwatchData';
import type { SmartwatchMetricId } from '../types/types';
import '../styles/GoToGymDeveloperConsole.css';

interface GoToGymDeveloperConsoleProps {
  onLogout: () => void;
  role: UserRole;
  initialSection?: Section;
  initialUserMetricId?: SmartwatchMetricId | null;
}

export const GoToGymDeveloperConsole: React.FC<GoToGymDeveloperConsoleProps> = ({
  onLogout,
  role,
  initialSection = 'dashboard',
  initialUserMetricId = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [highlightedIntegrationId, setHighlightedIntegrationId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isUser = role === 'user';
  const isGym = role === 'gym';
  const roleAccess = getRoleAccess(role);
  const isAdmin = roleAccess.canViewSidebar;
  const showSidebar = isAdmin || isUser || isGym;
  const brandedSections: Section[] = ['dashboard', 'smartwatch', 'app-gotogym', 'business-wellbeing', 'business-members'];

  const {
    data: coachContext,
    loading: coachLoading,
    error: coachError,
    forbidden: coachForbidden,
  } = useCoachContext(undefined, isUser, 30000);
  const businessContext = coachContext?.business;
  const hasBusinessWorkspace = Boolean(
    isGym
    || isAdmin
    || (
      businessContext
      && typeof businessContext === 'object'
      && !Array.isArray(businessContext)
      && (
        businessContext.has_business_workspace === true
        || (Array.isArray(businessContext.workspaces) && businessContext.workspaces.length > 0)
        || Boolean(businessContext.active_workspace)
      )
    ),
  );
  const currentSection: Section = isUser
      ? location.pathname === '/smartwatch' || location.pathname === '/cards'
        ? 'smartwatch'
      : location.pathname === '/app-gotogym'
        ? 'app-gotogym'
        : location.pathname === '/consents'
          ? 'consents'
        : location.pathname === '/business-members' && hasBusinessWorkspace
          ? 'business-members'
          : 'dashboard'
    : isGym
      ? location.pathname === '/business-wellbeing'
        ? 'business-wellbeing'
        : location.pathname === '/business-members'
          ? 'business-members'
          : location.pathname === '/integrations'
            ? 'integrations'
            : location.pathname === '/applications'
              ? 'applications'
              : location.pathname === '/consents'
                ? 'consents'
          : 'dashboard'
      : location.pathname === '/integrations'
        ? 'integrations'
        : location.pathname === '/applications'
          ? 'applications'
          : location.pathname === '/consents'
            ? 'consents'
        : activeSection;
  const isBrandedSection = brandedSections.includes(currentSection);

  const {
    metrics: smartwatchMetrics,
    loading: smartwatchLoading,
    error: smartwatchError,
    dataSource: smartwatchDataSource,
    reloadMetrics,
  } = useSmartwatchMetrics({ enabled: isUser });

  useEffect(() => {
    if (isGym) {
      setActiveSection('dashboard');
      setSidebarCollapsed(false);
    }
  }, [isGym]);

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

  const handleSidebarNavigate = (section: Section) => {
    if (isUser) {
      if (section === 'smartwatch') {
        navigate('/smartwatch');
        return;
      }

      if (section === 'app-gotogym') {
        navigate('/app-gotogym');
        return;
      }

      if (section === 'business-members' && hasBusinessWorkspace) {
        navigate('/business-members');
        return;
      }

      if (section === 'consents') {
        navigate('/consents');
        return;
      }

      navigate('/dashboard');
      return;
    }

    if (isGym) {
      if (section === 'business-wellbeing') {
        navigate('/business-wellbeing');
        return;
      }

      if (section === 'business-members') {
        navigate('/business-members');
        return;
      }

      if (section === 'integrations') {
        navigate('/integrations');
        return;
      }

      if (section === 'applications') {
        navigate('/applications');
        return;
      }

      if (section === 'consents') {
        navigate('/consents');
        return;
      }

      navigate('/dashboard');
      return;
    }

    if (isAdmin && section === 'integrations') {
      navigate('/integrations');
      return;
    }

    if (isAdmin && section === 'applications') {
      navigate('/applications');
      return;
    }

    if (isAdmin && section === 'consents') {
      navigate('/consents');
      return;
    }

    setActiveSection(section);
  };

  const handleNavigateToIntegration = (integrationId: string) => {
    if (!isAdmin) {
      return;
    }

    setActiveSection('integrations');
    navigate('/integrations');
    if (integrationId) {
      setHighlightedIntegrationId(integrationId);
      setTimeout(() => setHighlightedIntegrationId(null), 3000);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        if (isUser) {
          return (
            <>
              <DashboardWelcomeSection />
              <SmartwatchSummary
                heartRateTrend={smartwatchHeartRateTrendMock}
                sleepPhases={smartwatchSleepPhasesMock}
                activitySummary={smartwatchActivitySummaryMock}
              />
              <AppGoToGymWidgetsSection
                data={coachContext}
                loading={coachLoading}
                error={coachError}
                forbidden={coachForbidden}
              />
            </>
          );
        }

        return <DashboardWelcomeSection />;

      case 'business-wellbeing':
        if (!isGym && !isAdmin) {
          return null;
        }

        return <BusinessWellbeingSection />;

      case 'business-members':
        if (!hasBusinessWorkspace) {
          return null;
        }

        return <BusinessMembersSection />;

      case 'smartwatch':
        if (!isUser) {
          return null;
        }

        return (
          <SmartwatchSection
            metrics={smartwatchMetrics}
            loading={smartwatchLoading}
            error={smartwatchError}
            dataSource={smartwatchDataSource}
            onRetry={reloadMetrics}
            preferredMetricId={initialUserMetricId}
          />
        );

      case 'app-gotogym':
        if (!isUser) {
          return null;
        }

        return (
          <AppGoToGymSection
            data={coachContext}
            loading={coachLoading}
            error={coachError}
            forbidden={coachForbidden}
          />
        );

      case 'cards':
        if (isUser) {
          return (
            <SmartwatchSection
              metrics={smartwatchMetrics}
              loading={smartwatchLoading}
              error={smartwatchError}
              dataSource={smartwatchDataSource}
              onRetry={reloadMetrics}
              preferredMetricId={initialUserMetricId}
            />
          );
        }

        return (
          <CardsSection
            activeIntegrations={activeIntegrations}
            connectedSources={connectedSources}
            lastSync={lastSync}
            processedEvents={processedEvents}
          />
        );

      case 'integrations':
        if (!isGym && !isAdmin) {
          return null;
        }

        return (
          <IntegrationsMarketplaceSection
            integrations={integrations}
            selectedSource={selectedSource}
            uiState={uiState}
            onSelect={setSelectedSource}
            onConnect={syncIntegration}
            syncingId={syncingId}
            highlightedId={highlightedIntegrationId}
          />
        );

      case 'applications':
        if (!isGym && !isAdmin) {
          return null;
        }

        return <ApplicationsSection />;

      case 'consents':
        return <ConsentsSection />;

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
      className={`gtg-app${showSidebar && sidebarCollapsed ? ' sidebar-collapsed' : ''}${!showSidebar ? ' no-sidebar' : ''}`}
    >
      {showSidebar && (
        <AppSidebar
          active={currentSection}
          onNavigate={handleSidebarNavigate}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          adminModules={roleAccess.adminModules}
          roleLabel={getRoleDisplayName(role)}
          role={role}
          hasBusinessAccess={hasBusinessWorkspace}
        />
      )}
      <div className={`gtg-main-area${isBrandedSection ? ' gtg-main-area-dashboard-home' : ''}`}>
        <AppHeader
          section={currentSection}
          integrations={integrations}
          onNavigateToIntegration={handleNavigateToIntegration}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          sidebarCollapsed={sidebarCollapsed}
          showSidebarToggle={showSidebar}
          onLogout={onLogout}
        />
        <main className={`gtg-content${isBrandedSection ? ' gtg-dashboard-home-content' : ''}`}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};
