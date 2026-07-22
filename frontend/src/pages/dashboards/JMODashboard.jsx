// src/pages/dashboards/JMODashboard.jsx
import { FolderOpen, FileText, Stethoscope, FlaskConical, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, cases, specimens, courtSummons } from '../../data/mockData';

const stats = dashboardStats.jmo;

const statCards = [
  { label: 'Assigned Cases', value: stats.assignedCases, icon: FolderOpen, color: 'text-blue-600' },
  { label: 'Pending PM Reports', value: stats.pendingPMReports, icon: Stethoscope, color: 'text-amber-600' },
  { label: 'Pending MLEF', value: stats.pendingMLEF, icon: FileText, color: 'text-green-600' },
  { label: 'Specimens Awaiting', value: stats.specimensAwaiting, icon: FlaskConical, color: 'text-purple-600' },
  { label: 'Upcoming Court Dates', value: stats.upcomingCourtDates, icon: Gavel, color: 'text-red-600' },
];

const caseColumns = [
  { key: 'caseNo', header: 'Case No.', sortable: true },
  { key: 'caseType', header: 'Type', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'inquestNo', header: 'Inquest No.' },
  {
    key: 'openedDate',
    header: 'Opened',
    sortable: true,
    render: (row) => new Date(row.openedDate).toLocaleDateString('en-LK'),
  },
];

const specimenColumns = [
  { key: 'specimenNo', header: 'Specimen No.' },
  { key: 'type', header: 'Type', sortable: true },
  {
    key: 'dateRetained',
    header: 'Date Retained',
    render: (row) => new Date(row.dateRetained).toLocaleDateString('en-LK'),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const courtColumns = [
  { key: 'caseNo', header: 'Case No.' },
  { key: 'court', header: 'Court' },
  {
    key: 'trialDate',
    header: 'Trial Date',
    sortable: true,
    render: (row) => new Date(row.trialDate).toLocaleDateString('en-LK'),
  },
  { key: 'purpose', header: 'Purpose' },
  {
    key: 'responseStatus',
    header: 'Status',
    render: (row) => <StatusBadge status={row.responseStatus} />,
  },
];

export default function JMODashboard() {
  const navigate = useNavigate();
  // Filter cases assigned to current JMO (mock: MO id 1)
  const myCases = cases.filter((c) => c.assignedJMO.id === 1);
  const awaitingSpecimens = specimens.filter((s) => s.status === 'Awaiting' || s.status === 'Sent to Lab');

  return (
    <div>
      <PageHeader
        title="JMO Dashboard"
        subtitle="Dr. C.U. Wickramasinghe — Consultant Judicial Medical Officer"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
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

      {/* My Cases */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          My Assigned Cases
        </h3>
        <DataTable
          columns={caseColumns}
          data={myCases}
          onRowClick={(row) => navigate(`/cases/${row.id}`)}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Specimens & Lab Results
          </h3>
          <DataTable columns={specimenColumns} data={awaitingSpecimens} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Upcoming Court Dates
          </h3>
          <DataTable columns={courtColumns} data={courtSummons} />
        </div>
      </div>
    </div>
  );
}
