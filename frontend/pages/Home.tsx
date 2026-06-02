import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logoUrl from '../assets/gotogym-logo.jpg';

type FocusKey = 'historia' | 'mision' | 'quantum';

const focusContent: Record<FocusKey, { label: string; title: string; body: string }> = {
  historia: {
    label: 'Nuestra Historia',
    title: 'Tecnologia para cuidarnos mejor',
    body:
      'GoToGym nace de una pregunta simple pero profunda: y si la tecnologia pudiera ayudarnos a cuidarnos mejor, sin imponernos mas presion. Acompanamos la vida diaria desde el entrenamiento, el descanso, la nutricion y el equilibrio emocional.',
  },
  mision: {
    label: 'Mision',
    title: 'Bienestar personalizado para mas personas',
    body:
      'Democratizamos el acceso al bienestar personalizado mediante inteligencia artificial, ciencia aplicada y diseno centrado en el usuario.',
  },
  quantum: {
    label: 'Quantum Research',
    title: 'Datos humanos con criterio y responsabilidad',
    body:
      'Investigamos patrones de bienestar y sistemas de apoyo inteligentes sin reemplazar profesionales ni tomar decisiones por las personas. La tecnologia orienta; el bienestar siempre es la prioridad.',
  },
};

const researchPillars = [
  'Privacidad de los datos',
  'Seguridad de la informacion',
  'Acompanamiento humano',
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/gotogym/' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCXRp8PgcE7L75jEewIixeXg' },
  { label: 'X', href: 'https://x.com/GOTOGYM6' },
  { label: 'Facebook', href: 'https://www.facebook.com/Gotogym.Sportwear/' },
];

const Home: React.FC = () => {
  const [activeFocus, setActiveFocus] = useState<FocusKey>('historia');
  const activeInfo = focusContent[activeFocus];

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleContactClick = () => {
    document.getElementById('gtg-home-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="gtg-home">
      <header className="gtg-home-nav" aria-label="Navegacion principal">
        <a className="gtg-home-brand" href="#top" aria-label="GoToGym inicio">
          <img src={logoUrl} alt="Logo GoToGym" className="gtg-home-brand-logo" />
          <span>GoToGym</span>
        </a>
        <nav className="gtg-home-nav-links" aria-label="Secciones">
          <a href="#historia">Historia</a>
          <a href="#quantum">Research</a>
          <button type="button" onClick={handleContactClick}>
            Contacto
          </button>
          <Link to="/login" className="gtg-home-login">
            Iniciar sesion
          </Link>
        </nav>
      </header>

      <section className="gtg-home-hero" id="top">
        <div className="gtg-home-hero-content">
          <div className="gtg-home-kicker">GoToGym Developers</div>
          <h1>Bienestar inteligente, disenado con criterio humano.</h1>
          <p>
            Integramos ciencia, diseno y tecnologia para acompanar a las personas en su vida
            diaria: entrenamiento, descanso, nutricion y equilibrio emocional.
          </p>
          <div className="gtg-home-hero-actions">
            <button type="button" className="gtg-home-primary-action" onClick={handleContactClick}>
              Hablar con soporte
            </button>
            <a className="gtg-home-secondary-action" href="#historia">
              Conocer GoToGym
            </a>
          </div>
        </div>

        <aside className="gtg-home-signal" aria-label="Senal de marca GoToGym">
          <img src={logoUrl} alt="" aria-hidden="true" />
          <div className="gtg-home-signal-line" />
          <div className="gtg-home-signal-copy">
            <strong>Claridad, constancia y bienestar sostenible.</strong>
            <span>El progreso no se mide solo en rendimiento.</span>
          </div>
        </aside>
      </section>

      <section className="gtg-home-section gtg-home-intro-grid" id="historia">
        <article className="gtg-home-panel gtg-home-focus-panel">
          <div className="gtg-home-section-label">Explora GoToGym</div>
          <div className="gtg-home-tabs" role="tablist" aria-label="Contenido de GoToGym">
            {(Object.keys(focusContent) as FocusKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeFocus === key}
                className={activeFocus === key ? 'is-active' : ''}
                onClick={() => setActiveFocus(key)}
              >
                {focusContent[key].label}
              </button>
            ))}
          </div>
          <div className="gtg-home-focus-copy">
            <h2>{activeInfo.title}</h2>
            <p>{activeInfo.body}</p>
          </div>
        </article>

        <article className="gtg-home-panel gtg-home-mission-panel">
          <span className="gtg-home-section-label">Mision</span>
          <h2>IA responsable para bienestar personalizado</h2>
          <p>
            Desarrollamos herramientas que entienden el contexto de cada persona y acompanan con
            criterio, no con exigencia.
          </p>
          <button type="button" onClick={() => setActiveFocus('mision')}>
            Ver enfoque
          </button>
        </article>
      </section>

      <section className="gtg-home-section gtg-home-research" id="quantum">
        <div className="gtg-home-section-heading">
          <span className="gtg-home-section-label">Investigacion y tecnologia</span>
          <h2>Quantum Research</h2>
          <p>
            Un area dedicada al estudio de datos humanos, patrones de bienestar y sistemas de apoyo
            inteligentes, con orientacion responsable, personalizada y etica.
          </p>
        </div>

        <div className="gtg-home-research-grid">
          {researchPillars.map((pillar, index) => (
            <article className="gtg-home-research-card" key={pillar}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{pillar}</h3>
              <p>
                Cada sistema se disena para proteger la confianza del usuario y mantener el
                acompanamiento humano en el centro.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="gtg-home-section gtg-home-contact" id="gtg-home-contact">
        <article className="gtg-home-contact-main">
          <span className="gtg-home-section-label">Soporte GoToGym</span>
          <h2>Tienes una pregunta o necesitas ayuda?</h2>
          <p>
            Nuestro equipo revisa cada mensaje y responde lo antes posible. Soporte humano,
            respuesta por correo y sin bots automaticos.
          </p>
          <div className="gtg-home-contact-actions">
            <a href="mailto:contacto@gotogym.com">contacto@gotogym.com</a>
            <a href="tel:+573122570297">+57 312 257 0297</a>
          </div>
        </article>

        <aside className="gtg-home-contact-side">
          <div>
            <strong>Equipo de Soporte GoToGym</strong>
            <span>Atencion en dias habiles · Horario Colombia</span>
          </div>
          <div>
            <strong>Bogota D.C., Colombia</strong>
            <span>Investigacion, diseno y bienestar en distintos formatos.</span>
          </div>
          <div className="gtg-home-socials" aria-label="Redes sociales GoToGym">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <footer className="gtg-home-footer">
        <span>GoToGym Developers</span>
        <span>{currentYear} · Bienestar, datos y tecnologia responsable.</span>
      </footer>
    </main>
  );
};

export default Home;
