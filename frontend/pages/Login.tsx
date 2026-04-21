import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface LoginProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
  background: 'linear-gradient(135deg, #eff6ff 0%, #e2e8f0 100%)',
};

const formCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  background: '#ffffff',
  borderRadius: '14px',
  border: '1px solid #dbe3ed',
  padding: '24px',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '6px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '0.95rem',
};

const Login: React.FC<LoginProps> = ({ isAuthenticated, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    onLogin();
    navigate('/dashboard', { replace: true });
  };

  return (
    <section style={wrapperStyle}>
      <form style={formCardStyle} onSubmit={handleSubmit}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>Iniciar sesion</h1>
        <p style={{ margin: '8px 0 18px', color: '#475569' }}>
          Accede a la consola de GoToGym Developers.
        </p>

        <label htmlFor="email" style={{ display: 'block', marginBottom: '12px', color: '#0f172a' }}>
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

        <label htmlFor="password" style={{ display: 'block', marginBottom: '16px', color: '#0f172a' }}>
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
          style={{
            width: '100%',
            padding: '11px 14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            background: '#0f172a',
            color: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          Iniciar sesion
        </button>
      </form>
    </section>
  );
};

export default Login;
