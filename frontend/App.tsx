import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <AppRouter isAuthenticated={isAuthenticated} onLogin={handleLogin} />
    </BrowserRouter>
  );
};

export default App;
