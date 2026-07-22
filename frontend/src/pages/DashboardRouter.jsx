// src/pages/DashboardRouter.jsx
import { useAuth, ROLES } from '../contexts/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import JMODashboard from './dashboards/JMODashboard';
import RegistrarDashboard from './dashboards/RegistrarDashboard';
import PoliceDashboard from './dashboards/PoliceDashboard';
import RecordsClerkDashboard from './dashboards/RecordsClerkDashboard';

const dashboardMap = {
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.JMO]: JMODashboard,
  [ROLES.REGISTRAR]: RegistrarDashboard,
  [ROLES.POLICE]: PoliceDashboard,
  [ROLES.RECORDS_CLERK]: RecordsClerkDashboard,
};

export default function DashboardRouter() {
  const { user } = useAuth();
  const DashboardComponent = dashboardMap[user?.role] || AdminDashboard;
  return <DashboardComponent />;
}
