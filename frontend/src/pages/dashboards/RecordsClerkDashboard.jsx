// src/pages/dashboards/RecordsClerkDashboard.jsx
import { FolderOpen, UserPlus, Upload, FileText } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, cases } from '../../data/mockData';

const stats = dashboardStats.recordsClerk;

const statCards = [
  { label: 'Intake Queue', value: stats.intakeQueue, icon: FolderOpen, color: 'text-amber-600' },
  { label: 'Recently Registered', value: stats.recentlyRegistered, icon: FileText, color: 'text-blue-600' },
  { label: 'Pending Uploads', value: stats.pendingUploads, icon: Upload, color: 'text-purple-600' },
];

const caseColumns = [
  { key: 'caseNo', header: 'Case No.', sortable: true },
  { key: 'caseType', header: 'Case Type', sortable: true },
  { key: 'inquestNo', header: 'Inquest No.' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'openedDate',
    header: 'Opened',
    sortable: true,
    render: (row) => new Date(row.openedDate).toLocaleDateString('en-LK'),
  },
  {
    key: 'assignedJMO',
    header: 'Assigned JMO',
    render: (row) => row.assignedJMO.fullName,
  },
];

export default function RecordsClerkDashboard() {
  const navigate = useNavigate();
  const recentCases = [...cases].sort((a, b) => new Date(b.openedDate) - new Date(a.openedDate)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Records Clerk Dashboard"
        subtitle="A.P. Fernando — Case Registration & Document Management"
        breadcrumbs={[{ label: 'Dashboard' }]}
        actions={
          <Link
            to="/cases/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Register New Case
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Recently Registered Cases
        </h3>
        <DataTable
          columns={caseColumns}
          data={recentCases}
          onRowClick={(row) => navigate(`/cases/${row.id}`)}
        />
      </div>
    </div>
  );
}
