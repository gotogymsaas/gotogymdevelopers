import React from 'react';
import type { ApplicationScope, DeveloperApplication } from '../../types/types';
import { APPLICATION_SCOPE_OPTIONS, useApplications } from '../../hooks/useApplications';

const scopeLabels: Record<ApplicationScope, string> = {
  'profile.read': 'Perfil',
  'wellbeing.read': 'Bienestar',
  'metrics.read': 'Metricas',
  'analytics.read': 'Analitica',
  'organization.read': 'Organizacion',
  'devices.read': 'Dispositivos',
  'documents.read': 'Documentos',
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

interface ApplicationRowProps {
  application: DeveloperApplication;
  onEdit: (application: DeveloperApplication) => void;
  onDisable: (id: string) => void;
  onRegenerateSecret: (id: string) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({
  application,
  onEdit,
  onDisable,
  onRegenerateSecret,
}) => (
  <article className={`gtg-application-row ${application.status}`}>
    <div className="gtg-application-main">
      <div>
        <div className="gtg-application-title-row">
          <h3>{application.name}</h3>
          <span className={`gtg-badge ${application.status === 'active' ? 'connected' : 'disconnected'}`}>
            {application.status === 'active' ? 'Activa' : 'Desactivada'}
          </span>
        </div>
        <p>{application.description || 'Sin descripcion'}</p>
      </div>
      <div className="gtg-application-client">
        <span>Client ID</span>
        <code>{application.clientId}</code>
      </div>
      <div className="gtg-application-client">
        <span>Redirect URI</span>
        <code>{application.redirectUris[0] ?? 'Sin callback'}</code>
      </div>
    </div>

    <div className="gtg-application-scopes">
      {application.authorizedScopes.map(scope => (
        <span key={scope}>{scopeLabels[scope]}</span>
      ))}
    </div>

    <div className="gtg-application-footer">
      <span>Creada: {formatDate(application.createdAt)}</span>
      <div className="gtg-application-actions">
        <button className="gtg-btn gtg-btn-secondary" onClick={() => onEdit(application)}>
          Editar
        </button>
        <button className="gtg-btn gtg-btn-secondary" onClick={() => onRegenerateSecret(application.id)}>
          Regenerar Secret
        </button>
        <button
          className="gtg-btn gtg-btn-danger"
          disabled={application.status === 'disabled'}
          onClick={() => onDisable(application.id)}
        >
          Desactivar
        </button>
      </div>
    </div>
  </article>
);

export const ApplicationsSection: React.FC = () => {
  const {
    activeCount,
    applications,
    editingId,
    error,
    form,
    latestSecret,
    loading,
    saving,
    resetForm,
    save,
    setForm,
    setScope,
    startEdit,
    disable,
    regenerateSecret,
  } = useApplications();

  return (
    <section className="gtg-applications-section">
      <div className="gtg-section-header gtg-applications-header">
        <div>
          <p className="gtg-section-kicker">Empresa y Administracion</p>
          <h2 className="gtg-section-title">Mis Aplicaciones</h2>
          <p className="gtg-section-desc">
            Administra credenciales OAuth, scopes autorizados y ciclo de vida de aplicaciones conectadas.
          </p>
        </div>
        <div className="gtg-integrations-summary">
          <span>{activeCount} activas</span>
          <span>{applications.length} registradas</span>
        </div>
      </div>

      <div className="gtg-applications-layout">
        <div className="gtg-application-form">
          <div className="gtg-application-form-head">
            <h3>{editingId ? 'Editar aplicacion' : 'Crear aplicacion'}</h3>
            {editingId && (
              <button className="gtg-table-action-btn" onClick={resetForm}>
                Nueva
              </button>
            )}
          </div>

          <label className="gtg-field">
            <span>Nombre</span>
            <input
              value={form.name}
              maxLength={80}
              onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
              placeholder="Mi app corporativa"
            />
          </label>

          <label className="gtg-field">
            <span>Descripcion</span>
            <textarea
              value={form.description}
              maxLength={240}
              onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
              placeholder="Uso interno, integracion de partner o panel corporativo"
            />
          </label>

          <label className="gtg-field">
            <span>Redirect URI OAuth</span>
            <input
              value={form.redirectUris[0] ?? ''}
              onChange={event => setForm(current => ({ ...current, redirectUris: [event.target.value] }))}
              placeholder="https://miapp.com/oauth/callback"
            />
          </label>

          <div className="gtg-scope-picker">
            <span>Scopes autorizados</span>
            {APPLICATION_SCOPE_OPTIONS.map(scope => (
              <label key={scope} className="gtg-scope-option">
                <input
                  type="checkbox"
                  checked={form.authorizedScopes.includes(scope)}
                  onChange={event => setScope(scope, event.target.checked)}
                />
                <span>{scopeLabels[scope]}</span>
              </label>
            ))}
          </div>

          {latestSecret && (
            <div className="gtg-secret-box">
              <span>Client Secret nuevo</span>
              <code>{latestSecret}</code>
            </div>
          )}

          {error && <p className="gtg-form-error">{error}</p>}

          <button
            className="gtg-btn gtg-btn-primary"
            disabled={saving || form.name.trim().length < 3 || form.authorizedScopes.length === 0}
            onClick={save}
          >
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear aplicacion'}
          </button>
        </div>

        <div className="gtg-applications-list">
          {loading && <p className="gtg-cell-muted">Cargando aplicaciones...</p>}
          {!loading && applications.map(application => (
            <ApplicationRow
              key={application.id}
              application={application}
              onEdit={startEdit}
              onDisable={disable}
              onRegenerateSecret={regenerateSecret}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
