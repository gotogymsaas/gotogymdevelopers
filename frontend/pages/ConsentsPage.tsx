import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../auth/rbac';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';

interface ConsentsPageProps {
  onLogout: () => void;
}

const ConsentsPage: React.FC<ConsentsPageProps> = ({ onLogout }) => {
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
      initialSection="consents"
    />
  );
};

export default ConsentsPage;
