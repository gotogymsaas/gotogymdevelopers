import React, { useEffect, useRef } from 'react';
import type { IntegrationAlert } from '../../hooks/useNotifications';

interface NotificationBellProps {
  count: number;
  alerts: IntegrationAlert[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigate: (integrationId: string) => void;
}

/* SVG icons — inline para evitar dependencias */
const BellIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {active && (
      <circle cx="19" cy="5" r="4" fill="#ef4444" stroke="none" />
    )}
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ArrowRightIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
  alerts,
  isOpen,
  onToggle,
  onClose,
  onNavigate,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className="gtg-notif-wrapper" ref={wrapperRef}>
      {/* ── Trigger button ── */}
      <button
        className={`gtg-notif-trigger${count > 0 ? ' has-alerts' : ''}${isOpen ? ' is-open' : ''}`}
        onClick={onToggle}
        aria-label={`Notificaciones${count > 0 ? `, ${count} activa${count !== 1 ? 's' : ''}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Notificaciones"
      >
        <BellIcon active={count > 0} />
        {count > 0 && (
          <span className="gtg-notif-badge" aria-hidden="true">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="gtg-notif-panel"
          role="dialog"
          aria-label="Panel de notificaciones"
        >
          {/* Header */}
          <div className="gtg-notif-panel-header">
            <div className="gtg-notif-panel-header-left">
              <span className="gtg-notif-panel-title">Notificaciones</span>
              <span
                className={`gtg-notif-panel-pill${count === 0 ? ' clear' : ''}`}
              >
                {count === 0 ? 'Sin alertas' : `${count} alerta${count !== 1 ? 's' : ''}`}
              </span>
            </div>
            <button
              className="gtg-notif-close-btn"
              onClick={onClose}
              aria-label="Cerrar notificaciones"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="gtg-notif-panel-body">
            {alerts.length === 0 ? (
              <div className="gtg-notif-empty">
                <div className="gtg-notif-empty-icon">
                  <CheckCircleIcon />
                </div>
                <p className="gtg-notif-empty-title">Todo en orden</p>
                <p className="gtg-notif-empty-sub">
                  No hay integraciones desconectadas.
                </p>
              </div>
            ) : (
              <ul className="gtg-notif-list" role="list">
                {alerts.map((alert, idx) => (
                  <li
                    key={alert.id}
                    className="gtg-notif-item"
                    role="button"
                    tabIndex={0}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    onClick={() => {
                      onNavigate(alert.integrationId);
                      onClose();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate(alert.integrationId);
                        onClose();
                      }
                    }}
                  >
                    {/* Borde izquierdo de severidad */}
                    <div className="gtg-notif-item-accent" aria-hidden="true" />

                    {/* Ícono */}
                    <div className="gtg-notif-item-icon-wrap" aria-hidden="true">
                      <AlertIcon />
                    </div>

                    {/* Contenido */}
                    <div className="gtg-notif-item-body">
                      <div className="gtg-notif-item-row-top">
                        <span className="gtg-notif-item-source">
                          {alert.integrationName}
                        </span>
                        <span className="gtg-notif-item-type-badge">
                          Desconectada
                        </span>
                      </div>
                      <p className="gtg-notif-item-msg">{alert.message}</p>
                      <div className="gtg-notif-item-footer">
                        <span className="gtg-notif-item-cta">
                          Ver integración
                          <ExternalLinkIcon />
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="gtg-notif-panel-footer">
              <button
                className="gtg-notif-view-all"
                onClick={() => {
                  onNavigate('');
                  onClose();
                }}
              >
                <span>Ver tabla de integraciones</span>
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

