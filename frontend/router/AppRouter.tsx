import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CardsPage from '../pages/CardsPage';
import SmartwatchPage from '../pages/SmartwatchPage';
import AppGoToGymPage from '../pages/AppGoToGymPage';
import BusinessWellbeingPage from '../pages/BusinessWellbeingPage';
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
      <Route
        path="/smartwatch"
        element={(
          <ProtectedRoute allowedRoles={['user']}>
            <SmartwatchPage onLogout={onLogout} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/app-gotogym"
        element={(
          <ProtectedRoute allowedRoles={['user']}>
            <AppGoToGymPage onLogout={onLogout} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/business-wellbeing"
        element={(
          <ProtectedRoute allowedRoles={['gym', 'admin']}>
            <BusinessWellbeingPage onLogout={onLogout} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/cards"
        element={(
          <ProtectedRoute allowedRoles={['user']}>
            <CardsPage onLogout={onLogout} />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
