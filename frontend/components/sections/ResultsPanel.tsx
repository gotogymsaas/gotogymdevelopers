import React from 'react';
import type { BodyGraphData } from '../../types/types';

interface ResultsPanelProps {
  uiState: string;
  bodyGraph: BodyGraphData | null;
  error: string | null;
}

function JsonViewer({ data }: { data: object }) {
  const text = JSON.stringify(data, null, 2);
  const tokens = text.split(/(\"[^\"]*\"\s*:?|\d+\.?\d*|true|false|null)/g);

  return (
    <div className="gtg-json-viewer">
      {tokens.map((token, i) => {
        if (/^"[^"]*"\s*:$/.test(token.trim()) || /^"[^"]*":$/.test(token.trim())) {
          return <span key={i} className="gtg-json-key">{token}</span>;
        } else if (/^"[^"]*"$/.test(token)) {
          return <span key={i} className="gtg-json-string">{token}</span>;
        } else if (/^\d+\.?\d*$/.test(token)) {
          return <span key={i} className="gtg-json-number">{token}</span>;
        } else if (token === 'true' || token === 'false') {
          return <span key={i} className="gtg-json-bool">{token}</span>;
        } else if (token === 'null') {
          return <span key={i} className="gtg-json-null">{token}</span>;
        }
        return <span key={i}>{token}</span>;
      })}
    </div>
  );
}

const endpoints = [
  { method: 'GET', path: '/api/bodygraph/{userId}' },
  { method: 'POST', path: '/api/integrations/sync' },
  { method: 'GET', path: '/api/integrations/status' },
  { method: 'PUT', path: '/api/integrations/{id}/connect' },
];

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ uiState, bodyGraph, error }) => {
  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">🖥️ Panel de Resultados</h2>
        <p className="gtg-section-desc">Visualiza respuestas del sistema y datos sincronizados</p>
      </div>

      <div className="gtg-results-layout">
        <div className="gtg-terminal">
          <div className="gtg-terminal-bar">
            <span className="gtg-terminal-dot red"></span>
            <span className="gtg-terminal-dot yellow"></span>
            <span className="gtg-terminal-dot green"></span>
            <span className="gtg-terminal-title">BodyGraph — Response Viewer</span>
          </div>
          <div className="gtg-terminal-body">
            {uiState === 'initial' && (
              <div className="gtg-terminal-empty">
                <span className="gtg-terminal-prompt">
                  $ awaiting sync...<span className="gtg-terminal-cursor"></span>
                </span>
                <span className="gtg-terminal-hint">Ejecuta una sincronización en Acciones para ver datos</span>
              </div>
            )}
            {uiState === 'loading' && (
              <div className="gtg-terminal-empty">
                <span className="gtg-terminal-prompt">
                  $ syncing data...<span className="gtg-terminal-cursor"></span>
                </span>
              </div>
            )}
            {uiState === 'error' && (
              <div className="gtg-json-viewer gtg-json-error">
                {'// Error\n'}{error}
              </div>
            )}
            {uiState === 'success' && bodyGraph !== null && (
              <JsonViewer data={bodyGraph} />
            )}
          </div>
        </div>

        <div className="gtg-panel-card">
          <div className="gtg-panel-card-title">🔌 API Endpoints</div>
          {endpoints.map(ep => (
            <div className="gtg-endpoint-row" key={ep.path}>
              <span className={`gtg-http-method ${ep.method.toLowerCase()}`}>{ep.method}</span>
              <span className="gtg-endpoint-path">{ep.path}</span>
            </div>
          ))}

          <div className="gtg-panel-card-title" style={{ marginTop: '20px' }}>📦 Último Payload</div>
          {bodyGraph ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px 0' }}>
              <div>Fuente: <strong>{bodyGraph.source}</strong></div>
              <div>Timestamp: <strong>{new Date(bodyGraph.timestamp).toLocaleString('es-MX')}</strong></div>
            </div>
          ) : (
            <p className="gtg-endpoint-empty">Sin datos aún</p>
          )}
        </div>
      </div>
    </div>
  );
};
