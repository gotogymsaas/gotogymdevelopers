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

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
  alerts,
  isOpen,
  onToggle,
  onClose,
  onNavigate,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cierra el panel al hacer clic fuera
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

  // Cierra el panel con Escape
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
      <button
        className={`gtg-header-btn gtg-notif-btn${count > 0 ? ' has-alerts' : ''}`}
        onClick={onToggle}
        aria-label={`Notificaciones${count > 0 ? `, ${count} activa${count !== 1 ? 's' : ''}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Notificaciones"
      >
        🔔
        {count > 0 && (
          <span className="gtg-notif-badge" aria-hidden="true">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="gtg-notif-panel"
          role="dialog"
          aria-label="Panel de notificaciones"
        >
          <div className="gtg-notif-panel-header">
            <span className="gtg-notif-panel-title">Notificaciones</span>
            {count > 0 && (
              <span className="gtg-notif-panel-count">
                {count} activa{count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="gtg-notif-panel-body">
            {alerts.length === 0 ? (
              <div className="gtg-notif-empty">
                <span className="gtg-notif-empty-icon">✅</span>
                <p className="gtg-notif-empty-text">Todo en orden</p>
                <p className="gtg-notif-empty-sub">
                  No hay integraciones desconectadas.
                </p>
              </div>
            ) : (
              <ul className="gtg-notif-list" role="list">
                {alerts.map(alert => (
                  <li
                    key={alert.id}
                    className="gtg-notif-item"
                    role="button"
                    tabIndex={0}
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
                    <div className="gtg-notif-item-icon" aria-hidden="true">
                      ⚠️
                    </div>
                    <div className="gtg-notif-item-content">
                      <p className="gtg-notif-item-msg">{alert.message}</p>
                      <p className="gtg-notif-item-action">Ver integración →</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {alerts.length > 0 && (
            <div className="gtg-notif-panel-footer">
              <button
                className="gtg-notif-view-all"
                onClick={() => {
                  onNavigate('');
                  onClose();
                }}
              >
                Ver tabla de integraciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
