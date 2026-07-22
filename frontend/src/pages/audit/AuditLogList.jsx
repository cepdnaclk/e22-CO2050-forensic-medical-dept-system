// src/pages/audit/AuditLogList.jsx
import { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import { auditLogs } from '../../data/mockData';
import { Activity } from 'lucide-react';

export default function AuditLogList() {
  const [filter, setFilter] = useState('');

  const columns = [
    { key: 'timestamp', header: 'Timestamp', render: (r) => new Date(r.timestamp).toLocaleString('en-LK') },
    { key: 'user', header: 'User' },
    { key: 'role', header: 'Role' },
    { key: 'action', header: 'Action', render: (r) => <span className="font-medium text-[#1e3a5f]">{r.action}</span> },
    { key: 'entity', header: 'Entity' },
    { key: 'entityId', header: 'Entity ID' },
    { key: 'details', header: 'Details', cellClassName: 'max-w-md truncate text-gray-500 text-xs' },
  ];

  const filteredData = auditLogs.filter((log) => 
    log.user.toLowerCase().includes(filter.toLowerCase()) || 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.entity.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Audit Trail" 
        subtitle="System activity and changelog"
        breadcrumbs={[{ label: 'System' }, { label: 'Audit Trail' }]}
        icon={Activity}
      />
      
      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Search logs by user, action, or entity..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        emptyMessage="No audit logs found matching criteria." 
      />
    </div>
  );
}
