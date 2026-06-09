import React from 'react';
import logoUrl from '../../assets/gotogym-logo.jpg';

export const DashboardWelcomeSection: React.FC = () => {
  return (
    <section className="gtg-dashboard-home">
      <div className="gtg-dashboard-home-hero">
        <div className="gtg-dashboard-home-copy">
          <span className="gtg-dashboard-home-kicker">GoToGym Developers</span>
          <h1>Bienestar inteligente, listo para operar.</h1>
          <p>
            Un espacio para revisar contexto, datos de bienestar e integraciones con el mismo
            criterio visual de GoToGym: claro, humano y enfocado en accion.
          </p>
        </div>

        <aside className="gtg-dashboard-home-signal" aria-label="Senal GoToGym">
          <img src={logoUrl} alt="" aria-hidden="true" />
          <div className="gtg-dashboard-home-signal-line" />
          <div className="gtg-dashboard-home-signal-copy">
            <strong>Claridad, constancia y bienestar sostenible.</strong>
            <span>El dashboard conserva tus flujos actuales y presenta la informacion con mas foco.</span>
          </div>
        </aside>
      </div>

      <div className="gtg-dashboard-home-grid">
        <article className="gtg-dashboard-home-panel gtg-dashboard-home-focus">
          <span className="gtg-dashboard-home-label">Vista general</span>
          <h2>Contexto operativo con identidad GoToGym</h2>
          <p>
            Los modulos actuales siguen disponibles debajo de esta bienvenida, con una superficie
            mas cercana al Home publico y preparada para crecer.
          </p>
        </article>

        <article className="gtg-dashboard-home-panel gtg-dashboard-home-mission">
          <span className="gtg-dashboard-home-label">Prioridad</span>
          <h2>Datos utiles, lectura simple</h2>
          <p>
            Integraciones, smartwatch y App GoToGym mantienen su comportamiento; solo cambia la
            presentacion del dashboard inicial.
          </p>
        </article>
      </div>
    </section>
  );
};
