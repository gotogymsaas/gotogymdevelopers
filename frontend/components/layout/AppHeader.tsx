import React from 'react';
import type { Integration } from '../../types/types';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBell } from '../notifications/NotificationBell';
import type { Section } from './AppSidebar';

interface AppHeaderProps {
  section: Section;
  integrations: Integration[];
  onNavigateToIntegration: (integrationId: string) => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const sectionMeta: Record<Section, { title: string; desc: string }> = {
  dashboard:     { title: 'Dashboard',              desc: 'Vista general del sistema y métricas en tiempo real' },
  cards:         { title: 'Cards',                   desc: 'Resumen de estadísticas clave de la plataforma' },
  integrations:  { title: 'Tabla de Integraciones',  desc: 'Gestiona y monitorea todas las fuentes de datos conectadas' },
  actions:       { title: 'Acciones',                desc: 'Ejecuta operaciones y gestiona conexiones manualmente' },
  results:       { title: 'Panel de Resultados',     desc: 'Visualiza respuestas del sistema y datos sincronizados' },
  notifications: { title: 'Notificaciones',          desc: 'Alertas de integraciones desconectadas y eventos críticos' },
};

const MenuIcon = ({ collapsed }: { collapsed: boolean }) => (
  collapsed ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="21" y1="6" x2="9" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="9" y2="18"/>
      <polyline points="4 9 1 12 4 15"/>
    </svg>
  )
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export const AppHeader: React.FC<AppHeaderProps> = ({
  section,
  integrations,
  onNavigateToIntegration,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const { title, desc } = sectionMeta[section];
  const { alerts, count, isOpen, toggle, close } = useNotifications(integrations);

  return (
    <header className="gtg-header">
      {/* Sidebar toggle */}
      <button
        className="gtg-header-toggle"
        onClick={onToggleSidebar}
        title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        aria-label={sidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
      >
        <MenuIcon collapsed={sidebarCollapsed} />
      </button>

      {/* Breadcrumb */}
      <div className="gtg-header-breadcrumb">
        <div>
          <span className="gtg-header-brand">GoToGym Developer Console</span>
          <span className="gtg-header-sep">/</span>
          <span className="gtg-header-page">{title}</span>
        </div>
        <p className="gtg-header-desc">{desc}</p>
      </div>

      {/* Actions */}
      <div className="gtg-header-actions">
        <span className="gtg-header-version">v1.0.0</span>
        <NotificationBell
          count={count}
          alerts={alerts}
          isOpen={isOpen}
          onToggle={toggle}
          onClose={close}
          onNavigate={onNavigateToIntegration}
        />
        <button className="gtg-header-btn" title="Configuración" aria-label="Configuración">
          <SettingsIcon />
        </button>
        <div className="gtg-header-avatar" title="GoToGym User">GG</div>
      </div>
    </header>
  );
};
