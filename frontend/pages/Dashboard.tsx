import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoToGymDeveloperConsole } from '../components/GoToGymDeveloperConsole';
import { getUserRole } from '../auth/rbac';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const role = getUserRole() ?? 'user';

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  return <GoToGymDeveloperConsole onLogout={handleLogout} role={role} />;
};

export default Dashboard;
