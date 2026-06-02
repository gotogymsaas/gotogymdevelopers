import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginWithApi } from '../auth/rbac';
import logoUrl from '../assets/gotogym-logo.jpg';

interface LoginProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  padding: '34px 22px',
  background: '#020303',
  color: '#ffffff',
};

const formCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '520px',
  minHeight: 'calc(100vh - 68px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'transparent',
  padding: '0',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '8px',
  border: '1px solid rgba(0, 214, 203, 0.35)',
  borderRadius: '12px',
  padding: '13px 15px',
  fontSize: '0.98rem',
  color: '#ffffff',
  background: 'rgba(255, 255, 255, 0.045)',
  outline: 'none',
};

const Login: React.FC<LoginProps> = ({ isAuthenticated, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Debes ingresar email y password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await loginWithApi(email, password);
      if (!session) {
        setErrorMessage('Credenciales invalidas o backend no disponible.');
        return;
      }

      onLogin();
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={wrapperStyle}>
      <form style={formCardStyle} onSubmit={handleSubmit}>
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '3px solid #00d6cb',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 36px rgba(0, 214, 203, 0.35), 0 0 80px rgba(0, 214, 203, 0.12)',
            marginTop: '2px',
            marginBottom: '78px',
          }}
        >
          <img
            src={logoUrl}
            alt="GoToGym"
            style={{
              width: '168px',
              height: '168px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>

        <h1
          style={{
            margin: 0,
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 'clamp(2rem, 6vw, 2.7rem)',
            lineHeight: 1.1,
            fontWeight: 900,
          }}
        >
          Bienvenido a GoToGym Developers
        </h1>
        <p
          style={{
            margin: '16px 0 12px',
            color: '#c7c7c7',
            textAlign: 'center',
            fontSize: '1.08rem',
            lineHeight: 1.5,
            maxWidth: '500px',
          }}
        >
          La plataforma inteligente para construir, integrar y evolucionar soluciones digitales de bienestar y salud.
        </p>
        <p style={{ margin: '0 0 34px', color: '#929292', textAlign: 'center', fontSize: '0.94rem' }}>
          Accede con tu cuenta para comenzar.
        </p>

        <div style={{ width: '100%', maxWidth: '420px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '14px', color: '#d9d9d9', fontWeight: 700 }}>
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="dev@gotogym.com"
              style={inputStyle}
              required
            />
          </label>

          <label htmlFor="password" style={{ display: 'block', marginBottom: '24px', color: '#d9d9d9', fontWeight: 700 }}>
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              style={inputStyle}
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '14px 18px',
              borderRadius: '999px',
              border: '2px solid #e3c269',
              fontSize: '1rem',
              fontWeight: 800,
              background: isSubmitting ? 'rgba(227, 194, 105, 0.15)' : 'transparent',
              color: '#e3c269',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 18px rgba(227, 194, 105, 0.22)',
            }}
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar sesion'}
          </button>

          {errorMessage && (
            <p style={{ color: '#ff6b6b', marginTop: '16px', fontSize: '0.88rem', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          <p style={{ marginTop: '18px', fontSize: '0.78rem', color: '#8b8b8b', lineHeight: 1.5, textAlign: 'center' }}>
            Usa las credenciales reales de GoToGym. La consola consume el backend productivo con JWT.
          </p>
        </div>

        <a
          href="/"
          style={{
            marginTop: 'auto',
            paddingTop: '36px',
            color: '#9a9a9a',
            fontSize: '0.84rem',
            textDecoration: 'none',
          }}
        >
          Volver al inicio
        </a>
      </form>
    </section>
  );
};

export default Login;
