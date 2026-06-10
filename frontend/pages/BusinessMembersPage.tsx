import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface BusinessMembersPageProps {
  onLogout: () => void;
}

const BusinessMembersPage: React.FC<BusinessMembersPageProps> = ({ onLogout }) => {
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
      initialSection="business-members"
    />
  );
};

export default BusinessMembersPage;
