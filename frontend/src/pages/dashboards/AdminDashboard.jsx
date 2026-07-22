// src/pages/dashboards/AdminDashboard.jsx
import { Users, FolderOpen, ScrollText, Activity, Shield, Clock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { dashboardStats, users, auditLogs, systemHealth } from '../../data/mockData';

const stats = dashboardStats.admin;

const statCards = [
  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600' },
  { label: 'Active Cases', value: stats.activeCases, icon: FolderOpen, color: 'text-green-600' },
  { label: 'Pending Cases', value: stats.pendingCases, icon: Clock, color: 'text-amber-600' },
  { label: 'Audit Actions', value: stats.recentAuditActions, icon: ScrollText, color: 'text-purple-600' },
];

const recentLoginColumns = [
  { key: 'username', header: 'Username', sortable: true },
  { key: 'fullName', header: 'Full Name', sortable: true },
  { key: 'role', header: 'Role' },
  {
    key: 'isActive',
    header: 'Status',
    render: (row) => <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} />,
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    sortable: true,
    render: (row) => new Date(row.lastLogin).toLocaleString('en-LK'),
  },
];

const recentAuditColumns = [
  { key: 'id', header: 'Log ID', sortable: true },
  { key: 'username', header: 'User', sortable: true },
  {
    key: 'action',
    header: 'Action',
    render: (row) => <StatusBadge status={row.action} type="action" />,
  },
  { key: 'tableName', header: 'Table', sortable: true },
  { key: 'recordId', header: 'Record ID' },
  {
    key: 'timestamp',
    header: 'Timestamp',
    sortable: true,
    render: (row) => new Date(row.timestamp).toLocaleString('en-LK'),
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Administrator Dashboard"
        subtitle="System overview and management"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      {/* System Health */}
      <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-600" />
          System Health
        </h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-500 uppercase">Database</span>
            <p className="text-gray-900 font-medium flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {systemHealth.dbStatus} ({systemHealth.dbResponseTime})
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Storage</span>
            <p className="text-gray-900 font-medium">
              {systemHealth.storageUsed} / {systemHealth.storageTotal}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Uptime</span>
            <p className="text-gray-900 font-medium">{systemHealth.uptime}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Last Backup</span>
            <p className="text-gray-900 font-medium flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {systemHealth.backupStatus} — {new Date(systemHealth.lastBackup).toLocaleDateString('en-LK')}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Logins */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            Recent User Logins
          </h3>
          <DataTable columns={recentLoginColumns} data={users.filter((u) => u.isActive)} />
        </div>

        {/* Recent Audit Log */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-purple-600" />
            Recent Audit Activity
          </h3>
          <DataTable columns={recentAuditColumns} data={auditLogs.slice(0, 8)} />
        </div>
      </div>
    </div>
  );
}
