import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface ApplicationsPageProps {
  onLogout: () => void;
}

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onLogout }) => {
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
      initialSection="applications"
    />
  );
};

export default ApplicationsPage;
