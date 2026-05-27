import React from 'react';

interface DataStatePanelProps {
  title: string;
  description: string;
  loading: boolean;
  forbidden: boolean;
  error: string | null;
  loadingMessage?: string;
  forbiddenMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export const DataStatePanel: React.FC<DataStatePanelProps> = ({
  title,
  description,
  loading,
  forbidden,
  error,
  loadingMessage = 'Cargando...',
  forbiddenMessage = 'Acceso prohibido. Verifica tu sesión o token de autorización.',
  emptyMessage = 'No hay datos disponibles.',
  children,
}) => {
  return (
    <section>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">{title}</h2>
        <p className="gtg-section-desc">{description}</p>
      </div>

      <div className="gtg-panel-card">
        {loading && <p>{loadingMessage}</p>}
        {!loading && forbidden && (
          <p className="gtg-section-desc" style={{ color: '#c0392b' }}>
            {forbiddenMessage}
          </p>
        )}
        {!loading && !forbidden && error && (
          <p className="gtg-section-desc" style={{ color: '#c0392b' }}>
            {error}
          </p>
        )}
        {!loading && !forbidden && !error && (
          <div className="gtg-panel-card-content">
            {children ?? <p>{emptyMessage}</p>}
          </div>
        )}
      </div>
    </section>
  );
};
