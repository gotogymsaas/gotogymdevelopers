import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface IntegrationsPageProps {
  onLogout: () => void;
}

const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const role = getUserRole() ?? 'user';

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  if (role !== 'gym' && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <GoToGymDeveloperConsole
      onLogout={handleLogout}
      role={role}
      initialSection="integrations"
    />
  );
};

export default IntegrationsPage;
