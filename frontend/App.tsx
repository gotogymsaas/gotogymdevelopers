import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { clearStoredSession, isAuthenticated } from './auth/rbac';

const App: React.FC = () => {
  const [sessionActive, setSessionActive] = useState<boolean>(() => isAuthenticated());

  const handleLogin = () => {
    setSessionActive(true);
  };

  const handleLogout = () => {
    clearStoredSession();
    setSessionActive(false);
  };

  return (
    <BrowserRouter>
      <AppRouter
        isAuthenticated={sessionActive}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
};

export default App;
