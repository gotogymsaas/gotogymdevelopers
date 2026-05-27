import React, { useState } from 'react';

export type InfoCardStatus = 'success' | 'warning' | 'error' | 'info';

interface DynamicInfoCardProps {
  title: string;
  value: string;
  description: string;
  status?: InfoCardStatus;
  icon?: React.ReactNode;
  detail?: string;
}

const statusStyles: Record<InfoCardStatus, { background: string; color: string; label: string }> = {
  success: { background: '#e6fffa', color: '#0f766e', label: 'OK' },
  warning: { background: '#fef3c7', color: '#713f12', label: 'Atención' },
  error: { background: '#fee2e2', color: '#991b1b', label: 'Error' },
  info: { background: '#e0f2fe', color: '#0369a1', label: 'Info' },
};

export const DynamicInfoCard: React.FC<DynamicInfoCardProps> = ({
  title,
  value,
  description,
  status = 'info',
  icon,
  detail,
}) => {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = statusStyles[status];

  return (
    <article className="gtg-card gtg-card-elevated" style={{ padding: '18px', borderRadius: '20px', minHeight: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            {icon && <div style={{ fontSize: '1.3rem' }}>{icon}</div>}
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{title}</h3>
          </div>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.97rem', lineHeight: 1.5 }}>{description}</p>
        </div>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '999px',
            background: statusStyle.background,
            color: statusStyle.color,
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      <div style={{ marginTop: '24px' }}>
        <p style={{ margin: 0, fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word' }}>
          {value}
        </p>
      </div>

      {detail && (
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setExpanded(prev => !prev)}
            style={{
              alignSelf: 'flex-start',
              padding: '8px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              background: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {expanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
          {expanded && (
            <div style={{ borderRadius: '16px', background: '#f8fafc', padding: '14px', color: '#475569', fontSize: '0.9rem', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
              {detail}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
