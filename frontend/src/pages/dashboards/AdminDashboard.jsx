// src/pages/dashboards/AdminDashboard.jsx
import { Link } from 'react-router-dom';
import { Users, FolderOpen, ScrollText, FileText, Activity, AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import {
  users, cases, auditLogs, postMortemReports, alerts,
  systemHealth, ROLES, ROLE_LABELS,
} from '../../data/mockData';

/* ── Computed stats from live data ── */
const activeCases = cases.filter((c) => c.status !== 'Closed').length;
const totalUsers = users.length;
const pendingReports = postMortemReports.filter((p) => p.status === 'Draft').length;
const today = new Date().toISOString().split('T')[0];
const auditToday = auditLogs.filter((l) => l.timestamp.startsWith(today)).length;

const statCards = [
  { label: 'Active Cases', value: activeCases, icon: FolderOpen, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Reports', value: pendingReports, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Audit Events Today', value: auditToday, icon: ScrollText, color: 'text-purple-600', bg: 'bg-purple-50' },
];

/* ── Recent cases (last 5 by date) ── */
const recentCases = [...cases].sort((a, b) => b.openedDate.localeCompare(a.openedDate)).slice(0, 5);

const caseColumns = [
  { key: 'caseNo', header: 'Case No.', sortable: true },
  { key: 'caseType', header: 'Type' },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  { key: 'openedDate', header: 'Opened', render: (r) => new Date(r.openedDate).toLocaleDateString('en-LK') },
  { key: 'jmo', header: 'Assigned JMO', render: (r) => r.assignedJMO?.fullName || '—' },
];

/* ── Recent audit (last 10) ── */
const recentAudit = [...auditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 10);

const auditColumns = [
  { key: 'username', header: 'User', sortable: true },
  { key: 'action', header: 'Action', render: (r) => <StatusBadge status={r.action} type="action" /> },
  { key: 'tableName', header: 'Table' },
  { key: 'timestamp', header: 'Timestamp', render: (r) => new Date(r.timestamp).toLocaleString('en-LK') },
];

/* ── Role distribution ── */
const roleCounts = Object.values(ROLES).map((role) => ({
  role,
  label: ROLE_LABELS[role],
  count: users.filter((u) => u.role === role).length,
}));
const maxCount = Math.max(...roleCounts.map((r) => r.count), 1);

const roleBarColors = {
  [ROLES.ADMIN]: 'bg-red-500',
  [ROLES.JMO]: 'bg-blue-500',
  [ROLES.POLICE]: 'bg-green-500',
  [ROLES.REGISTRAR]: 'bg-purple-500',
  [ROLES.RECORDS_CLERK]: 'bg-amber-500',
};

/* ── Alert styles ── */
const alertStyles = {
  critical: { border: 'border-l-red-500', icon: AlertCircle, iconColor: 'text-red-500' },
  warning: { border: 'border-l-amber-500', icon: AlertTriangle, iconColor: 'text-amber-500' },
  info: { border: 'border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
};

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Administrator Dashboard"
        subtitle="System overview and management"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* ── Widget 1: Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── System Health ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-600" />
          System Health
        </h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-500 uppercase">Database</span>
            <p className="text-gray-900 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {systemHealth.dbStatus} ({systemHealth.dbResponseTime})
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Storage</span>
            <p className="text-gray-900 font-medium mt-0.5">
              {systemHealth.storageUsed} / {systemHealth.storageTotal}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Uptime</span>
            <p className="text-gray-900 font-medium mt-0.5">{systemHealth.uptime}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase">Last Backup</span>
            <p className="text-gray-900 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {systemHealth.backupStatus}
            </p>
          </div>
        </div>
      </div>

      {/* ── Widget 2: Recent Cases ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-green-600" />
            Recent Cases
          </h3>
          <Link to="/cases" className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1">
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <DataTable columns={caseColumns} data={recentCases} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* ── Widget 3: Recent Audit Log ── */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-purple-600" />
              Recent Audit Log
            </h3>
            <Link to="/audit-trail" className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1">
              View Full Log <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <DataTable columns={auditColumns} data={recentAudit} />
        </div>

        {/* ── Widget 4: User Role Distribution ── */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            User Role Distribution
          </h3>
          <div className="space-y-3">
            {roleCounts.map((rc) => (
              <div key={rc.role}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{rc.label}</span>
                  <span className="text-gray-500 font-semibold">{rc.count}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${roleBarColors[rc.role] || 'bg-gray-400'}`}
                    style={{ width: `${(rc.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Widget 5: System Alerts ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          System Alerts
        </h3>
        <div className="space-y-2">
          {alerts.map((alert) => {
            const style = alertStyles[alert.type] || alertStyles.info;
            const Icon = style.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-3 bg-white border border-gray-100 border-l-4 ${style.border} rounded-r`}>
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString('en-LK')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
