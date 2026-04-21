import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface CardsPageProps {
  onLogout: () => void;
}

const CardsPage: React.FC<CardsPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const role = getUserRole() ?? 'user';

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  if (role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return <GoToGymDeveloperConsole onLogout={handleLogout} role={role} />;
};

export default CardsPage;
