import React from 'react';
import { ADMIN_MODULE_LABELS } from '../../auth/rbac';
import type { AdminModule } from '../../auth/rbac';
import type { UserRole } from '../../auth/rbac';

export type Section = 'dashboard' | 'cards' | 'integrations' | 'actions' | 'results' | 'notifications';

interface AppSidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  adminModules: AdminModule[];
  roleLabel: string;
  role: UserRole;
}

/* ── Inline SVG icons ─────────────────────────────────────────── */
const IcoGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IcoCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IcoLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IcoZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IcoMonitor = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IcoBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IcoBook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IcoKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3L22 7l-3-3" />
  </svg>
);
const IcoShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoGym = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="M6 8v8" /><path d="M18 8v8" />
    <path d="M8 12h8" />
  </svg>
);
const IcoTrainer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
);
const IcoReport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
const IcoSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

interface NavItem { id: Section | string; label: string; icon: React.ReactNode; section?: Section; }

const mainNav: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',       icon: <IcoGrid />,    section: 'dashboard' },
  { id: 'cards',          label: 'Cards',            icon: <IcoCard />,    section: 'cards' },
  { id: 'integrations',   label: 'Integraciones',    icon: <IcoLink />,    section: 'integrations' },
  { id: 'actions',        label: 'Acciones',         icon: <IcoZap />,     section: 'actions' },
  { id: 'results',        label: 'Resultados',       icon: <IcoMonitor />, section: 'results' },
  { id: 'notifications',  label: 'Notificaciones',   icon: <IcoBell />,    section: 'notifications' },
];

const resourceNav = [
  { id: 'docs',      label: 'Documentación', icon: <IcoBook />,   disabled: true },
  { id: 'apikeys',   label: 'API Keys',       icon: <IcoKey />,    disabled: true },
  { id: 'security',  label: 'Seguridad',      icon: <IcoShield />, disabled: true },
];

const adminModuleIcons: Record<AdminModule, React.ReactNode> = {
  users: <IcoUsers />,
  gyms: <IcoGym />,
  trainers: <IcoTrainer />,
  reports: <IcoReport />,
  settings: <IcoSettings />,
};

export const AppSidebar: React.FC<AppSidebarProps> = ({
  active,
  onNavigate,
  isCollapsed,
  adminModules,
  roleLabel,
  role,
}) => {
  const isUser = role === 'user';
  const isGym = role === 'gym';
  const isAdmin = role === 'admin';

  const visibleMainNav = isUser
    ? mainNav.filter(item => item.section === 'dashboard' || item.section === 'cards')
    : isGym
      ? mainNav.filter(item => item.section === 'dashboard')
      : mainNav;

  return (
    <aside className={`gtg-sidebar${isCollapsed ? ' is-collapsed' : ''}`}>
      {/* ── Brand ── */}
      <div className="gtg-sidebar-brand">
        <div className="gtg-brand-logo">G</div>
        <div className="gtg-brand-text">
          <span className="gtg-brand-name">GoToGym</span>
          <span className="gtg-brand-tag">Developers</span>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="gtg-sidebar-nav">
        <span className="gtg-nav-section-label">Principal</span>

        {visibleMainNav.map(item => (
          <button
            key={item.id}
            className={`gtg-nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => item.section && onNavigate(item.section)}
            data-label={item.label}
            title={isCollapsed ? item.label : undefined}
            aria-label={item.label}
          >
            <span className="gtg-nav-icon">{item.icon}</span>
            <span className="gtg-nav-label">{item.label}</span>
          </button>
        ))}

        {isAdmin && adminModules.length > 0 && (
          <>
            <span className="gtg-nav-section-label" style={{ marginTop: 8 }}>Administracion</span>

            {adminModules.map(module => (
              <button
                key={module}
                className="gtg-nav-item"
                disabled
                data-label={ADMIN_MODULE_LABELS[module]}
                title={isCollapsed ? ADMIN_MODULE_LABELS[module] : undefined}
                aria-label={ADMIN_MODULE_LABELS[module]}
                style={{ opacity: .7, cursor: 'not-allowed' }}
              >
                <span className="gtg-nav-icon">{adminModuleIcons[module]}</span>
                <span className="gtg-nav-label">{ADMIN_MODULE_LABELS[module]}</span>
              </button>
            ))}
          </>
        )}

        {isAdmin && (
          <>
            <span className="gtg-nav-section-label" style={{ marginTop: 8 }}>Recursos</span>

            {resourceNav.map(item => (
              <button
                key={item.id}
                className="gtg-nav-item"
                disabled
                data-label={item.label}
                title={isCollapsed ? item.label : undefined}
                aria-label={item.label}
                style={{ opacity: .45, cursor: 'not-allowed' }}
              >
                <span className="gtg-nav-icon">{item.icon}</span>
                <span className="gtg-nav-label">{item.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="gtg-sidebar-footer">
        <div className="gtg-env-badge">
          <span className="gtg-env-dot" />
          <span className="gtg-env-text">Production</span>
        </div>
        <div className="gtg-sidebar-user">
          <div className="gtg-sidebar-user-avatar">GG</div>
          <div className="gtg-sidebar-user-info">
            <span className="gtg-sidebar-user-name">Dev User</span>
            <span className="gtg-sidebar-user-role">{roleLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
