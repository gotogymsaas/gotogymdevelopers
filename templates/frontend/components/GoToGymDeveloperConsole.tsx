import { useDeveloperDashboard } from '../hooks/useDeveloperDashboard';
import '../styles/GoToGymDeveloperConsole.css';

export const GoToGymDeveloperConsole: React.FC = () => {
  const {
    integrations,
    selectedSource,
    setSelectedSource,
    uiState,
    bodyGraph,
    error,
    handleSync,
  } = useDeveloperDashboard();

  const activeIntegrations = integrations.filter(i => i.status === 'connected').length;
  const connectedSources = integrations.filter(i => i.status !== 'disconnected').length;
    const lastSync = integrations
      .map((i: typeof integrations[0]) => i.lastSync)
      .filter(Boolean)
      .sort()
      .reverse()[0] || 'N/A';
  const processedEvents = 1287;

  return (
    <div className="gtg-dashboard">
      <header>
        <h1>GoToGym Developer Console</h1>
        <p>Tu espacio de integración y monitoreo de datos biométricos</p>
      </header>

      <section className="gtg-stats">
        <div className="gtg-card">
          <span className="gtg-card-title">Integraciones activas</span>
          <span className="gtg-card-value">{activeIntegrations}</span>
        </div>
        <div className="gtg-card">
          <span className="gtg-card-title">Fuentes conectadas</span>
          <span className="gtg-card-value">{connectedSources}</span>
        </div>
        <div className="gtg-card">
          <span className="gtg-card-title">Última sincronización</span>
          <span className="gtg-card-value">{lastSync}</span>
        </div>
        <div className="gtg-card">
          <span className="gtg-card-title">Eventos procesados</span>
          <span className="gtg-card-value">{processedEvents}</span>
        </div>
      </section>

      <section className="gtg-integrations">
        <h2>Integraciones conectadas</h2>
        <div className="gtg-integrations-list">
            {integrations.map((integration: typeof integrations[0]) => (
            <div
              key={integration.id}
              className={`gtg-integration-card gtg-status-${integration.status}`}
              onClick={() => setSelectedSource(integration.id)}
              aria-selected={selectedSource === integration.id}
            >
              <div className="gtg-integration-header">
                <span>{integration.name}</span>
                <span className={`gtg-status-dot gtg-status-${integration.status}`}></span>
              </div>
              <div className="gtg-integration-meta">
                <span>Estado: {integration.status}</span>
                <span>Última sync: {integration.lastSync || 'Nunca'}</span>
              </div>
              <button
                className="gtg-action-btn"
                disabled={integration.status === 'disconnected' || uiState === 'loading'}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedSource(integration.id);
                  handleSync();
                }}
              >
                {integration.status === 'error' ? 'Retry' : 'Sync'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="gtg-action-panel">
        <h2>Panel de acción</h2>
        <div>
          <label htmlFor="source-select">Selecciona una fuente:</label>
          <select
            id="source-select"
            value={selectedSource || ''}
            onChange={e => setSelectedSource(e.target.value)}
            disabled={uiState === 'loading'}
          >
            <option value="" disabled>Selecciona...</option>
            {integrations.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <button
            onClick={handleSync}
            disabled={!selectedSource || uiState === 'loading'}
          >
            {uiState === 'loading' ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>
      </section>

      <section className="gtg-result-panel">
        <h2>Resultado BodyGraph</h2>
        {uiState === 'initial' && <p>Ejecuta una sincronización para ver datos.</p>}
        {uiState === 'loading' && <p>Cargando datos...</p>}
        {uiState === 'error' && <p className="gtg-error">{error}</p>}
        {uiState === 'success' && bodyGraph && (
          <pre className="gtg-json">{JSON.stringify(bodyGraph, null, 2)}</pre>
        )}
      </section>
    </div>
  );
};
