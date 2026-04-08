import React from 'react';

export type Section = 'dashboard' | 'cards' | 'integrations' | 'actions' | 'results';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'cards', label: 'Cards', icon: '🃏' },
  { id: 'integrations', label: 'Integraciones', icon: '🔗' },
  { id: 'actions', label: 'Acciones', icon: '⚡' },
  { id: 'results', label: 'Resultados', icon: '🖥️' },
];

interface AppSidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ active, onNavigate }) => {
  return (
    <aside className="gtg-sidebar">
      <div className="gtg-sidebar-brand">
        <div className="gtg-brand-logo">G</div>
        <div className="gtg-brand-text">
          <span className="gtg-brand-name">GoToGym</span>
          <span className="gtg-brand-tag">Developers</span>
        </div>
      </div>

      <nav className="gtg-sidebar-nav">
        <span className="gtg-nav-section-label">Principal</span>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`gtg-nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="gtg-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <span className="gtg-nav-section-label" style={{ marginTop: '12px' }}>Recursos</span>
        <button className="gtg-nav-item">
          <span className="gtg-nav-icon">📚</span>
          Documentación
        </button>
        <button className="gtg-nav-item">
          <span className="gtg-nav-icon">🔑</span>
          API Keys
        </button>
        <button className="gtg-nav-item">
          <span className="gtg-nav-icon">🛡️</span>
          Seguridad
        </button>
      </nav>

      <div className="gtg-sidebar-footer">
        <div className="gtg-env-badge">
          <span className="gtg-env-dot"></span>
          Production
        </div>
        <div className="gtg-sidebar-user">
          <div className="gtg-sidebar-user-avatar">GG</div>
          <div className="gtg-sidebar-user-info">
            <span className="gtg-sidebar-user-name">Dev User</span>
            <span className="gtg-sidebar-user-role">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
