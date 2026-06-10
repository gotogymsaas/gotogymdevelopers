import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <GoToGymDeveloperConsole
      onLogout={handleLogout}
      role={role}
      initialSection="business-members"
    />
  );
};

export default BusinessMembersPage;
