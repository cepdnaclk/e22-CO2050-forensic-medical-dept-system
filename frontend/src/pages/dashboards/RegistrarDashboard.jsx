// src/pages/dashboards/RegistrarDashboard.jsx
import { ClipboardList, Gavel, Receipt } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, courtCertificates, courtSummons } from '../../data/mockData';

const stats = dashboardStats.registrar;

const statCards = [
  { label: 'Pending Certificates', value: stats.pendingCertificates, icon: ClipboardList, color: 'text-amber-600' },
  { label: 'Upcoming Trials', value: stats.upcomingTrials, icon: Gavel, color: 'text-blue-600' },
  { label: 'Awaiting Receipt', value: stats.awaitingReceipt, icon: Receipt, color: 'text-purple-600' },
];

const certColumns = [
  { key: 'certId', header: 'Cert ID', sortable: true },
  { key: 'caseNo', header: 'Case No.' },
  { key: 'court', header: 'Court' },
  {
    key: 'trialDate',
    header: 'Trial Date',
    sortable: true,
    render: (row) => new Date(row.trialDate).toLocaleDateString('en-LK'),
  },
  {
    key: 'dispatchDate',
    header: 'Dispatch Date',
    render: (row) => row.dispatchDate ? new Date(row.dispatchDate).toLocaleDateString('en-LK') : '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const summonsColumns = [
  { key: 'caseNo', header: 'Case No.' },
  { key: 'court', header: 'Court' },
  { key: 'magistrate', header: 'Magistrate' },
  {
    key: 'trialDate',
    header: 'Trial Date',
    sortable: true,
    render: (row) => new Date(row.trialDate).toLocaleDateString('en-LK'),
  },
  {
    key: 'responseStatus',
    header: 'Status',
    render: (row) => <StatusBadge status={row.responseStatus} />,
  },
];

export default function RegistrarDashboard() {
  return (
    <div>
      <PageHeader
        title="Court Registrar Dashboard"
        subtitle="N.A. Jayawardena — Magistrate's Court, Kandy"
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

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Court Certificates
        </h3>
        <DataTable columns={certColumns} data={courtCertificates} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Upcoming Court Summons
        </h3>
        <DataTable columns={summonsColumns} data={courtSummons} />
      </div>
    </div>
  );
}
