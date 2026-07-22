// src/pages/dashboards/PoliceDashboard.jsx
import { FolderOpen, Send, FileSearch, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, cases } from '../../data/mockData';

const stats = dashboardStats.police;

const statCards = [
  { label: 'Station Cases', value: stats.stationCases, icon: FolderOpen, color: 'text-blue-600' },
  { label: 'Pending MLEF', value: stats.pendingMLEF, icon: Send, color: 'text-amber-600' },
  { label: 'Reports Received', value: stats.reportsReceived, icon: Inbox, color: 'text-green-600' },
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

export default function PoliceDashboard() {
  const navigate = useNavigate();
  // Filter cases from Mahanuwara station (station id 1)
  const stationCases = cases.filter((c) => c.policeStation.id === 1);

  return (
    <div>
      <PageHeader
        title="Police Officer Dashboard"
        subtitle="SI W.M. Perera — Mahanuwara Police Station, Kandy"
        breadcrumbs={[{ label: 'Dashboard' }]}
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
          Cases from Mahanuwara Station
        </h3>
        <DataTable
          columns={caseColumns}
          data={stationCases}
          onRowClick={(row) => navigate(`/cases/${row.id}`)}
        />
      </div>
    </div>
  );
}
