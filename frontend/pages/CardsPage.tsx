import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';
import type { SmartwatchMetricId } from '../types/types';

interface CardsPageProps {
  onLogout: () => void;
}

const smartwatchMetricIds: SmartwatchMetricId[] = [
  'heart_rate',
  'spo2',
  'sleep',
  'physical_activity',
  'stress',
  'blood_pressure',
  'ecg',
  'body_temperature',
  'health_tracking',
];

const isSmartwatchMetricId = (value: unknown): value is SmartwatchMetricId => {
  return typeof value === 'string' && smartwatchMetricIds.includes(value as SmartwatchMetricId);
};

interface CardsLocationState {
  activeCard?: unknown;
}

const CardsPage: React.FC<CardsPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole() ?? 'user';
  const navigationState = location.state as CardsLocationState | null;
  const initialUserMetricId = isSmartwatchMetricId(navigationState?.activeCard)
    ? navigationState.activeCard
    : null;

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  if (role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <GoToGymDeveloperConsole
      onLogout={handleLogout}
      role={role}
      initialUserMetricId={initialUserMetricId}
    />
  );
};

export default CardsPage;
