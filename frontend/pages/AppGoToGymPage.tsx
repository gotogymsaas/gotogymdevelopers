import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface AppGoToGymPageProps {
  onLogout: () => void;
}

const AppGoToGymPage: React.FC<AppGoToGymPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const role = getUserRole() ?? 'user';

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  if (role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <GoToGymDeveloperConsole
      onLogout={handleLogout}
      role={role}
      initialSection="app-gotogym"
    />
  );
};

export default AppGoToGymPage;
