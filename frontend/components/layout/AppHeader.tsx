import React from 'react';
import type { Integration } from '../../types/types';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBell } from '../notifications/NotificationBell';

type Section = 'dashboard' | 'cards' | 'integrations' | 'actions' | 'results';

interface AppHeaderProps {
  section: Section;
  integrations: Integration[];
  onNavigateToIntegration: (integrationId: string) => void;
}

const sectionMeta: Record<Section, { title: string; desc: string }> = {
  dashboard: { title: 'Dashboard', desc: 'Vista general del sistema y métricas en tiempo real' },
  cards: { title: 'Cards', desc: 'Resumen de estadísticas clave de la plataforma' },
  integrations: { title: 'Tabla de Integraciones', desc: 'Gestiona y monitorea todas las fuentes de datos conectadas' },
  actions: { title: 'Acciones', desc: 'Ejecuta operaciones y gestiona conexiones manualmente' },
  results: { title: 'Panel de Resultados', desc: 'Visualiza respuestas del sistema y datos sincronizados' },
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  section,
  integrations,
  onNavigateToIntegration,
}) => {
  const { title, desc } = sectionMeta[section];
  const { alerts, count, isOpen, toggle, close } = useNotifications(integrations);

  return (
    <header className="gtg-header">
      <div className="gtg-header-breadcrumb">
        <span className="gtg-header-brand">GoToGym Developer Console 🚫</span>
        <span className="gtg-header-sep">/</span>
        <span className="gtg-header-page">{title}</span>
        <p className="gtg-header-desc">{desc}</p>
      </div>
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
        <button className="gtg-header-btn" title="Configuración" aria-label="Configuración">⚙️</button>
        <div className="gtg-header-avatar" title="GoToGym User">GG</div>
      </div>
    </header>
  );
};
