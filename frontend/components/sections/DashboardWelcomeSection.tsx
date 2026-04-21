import React from 'react';

export const DashboardWelcomeSection: React.FC = () => {
  return (
    <section>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          Dashboard
        </h2>
        <p className="gtg-section-desc">Vista inicial preparada para nuevas funcionalidades.</p>
      </div>

      <div className="gtg-panel-card">
        <div className="gtg-panel-card-title">Bienvenida</div>
        <p className="gtg-section-desc">Bienvenido al Dashboard.</p>
      </div>
    </section>
  );
};
