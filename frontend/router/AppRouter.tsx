import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

interface AppRouterProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={<Login isAuthenticated={isAuthenticated} onLogin={onLogin} />}
      />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <Dashboard onLogout={onLogout} />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
