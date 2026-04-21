import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '720px',
  background: '#ffffff',
  border: '1px solid #dbe3ed',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '24px',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '0.95rem',
  fontWeight: 600,
  background: '#0f172a',
  color: '#f8fafc',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '0.95rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  color: '#0f172a',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>GoToGym Developers</h1>
        <p style={{ marginTop: '12px', color: '#334155', lineHeight: 1.6 }}>
          Plataforma para conectar integraciones, monitorear sincronizaciones y centralizar operaciones
          para productos de fitness y salud.
        </p>

        <div style={buttonRowStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate('/dashboard')}>
            Ir al Dashboard
          </button>
          <Link to="/login" style={secondaryButtonStyle}>
            Iniciar Sesion
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
