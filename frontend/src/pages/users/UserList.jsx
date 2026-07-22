// src/pages/users/UserList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { users } from '../../data/mockData';
import { useAuth, ROLES } from '../../contexts/AuthContext';

export default function UserList() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('');

  // Only Admin should theoretically be here, but just in case
  const canCreate = user?.role === ROLES.ADMIN;

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'username', header: 'Username' },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.username.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="System Users" 
        subtitle={`Manage access for ${users.length} users`}
        breadcrumbs={[{ label: 'System' }, { label: 'Users' }]}
        icon={Users}
        actions={canCreate && (
          <Link to="/users/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> Add User
          </Link>
        )}
      />

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Search by name, username, or role..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        emptyMessage="No users found." 
      />
    </div>
  );
}
