// src/pages/mlef/MLEFListPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { mlefForms } from '../../data/mockData';
import { useAuth, ROLES } from '../../contexts/AuthContext';

export default function MLEFListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // JMO and Admin can create
  const canCreate = [ROLES.ADMIN, ROLES.JMO].includes(user?.role);

  const columns = [
    { key: 'mlefSerialNo', header: 'MLEF Serial No.', sortable: true },
    { key: 'examineeName', header: 'Examinee' },
    { key: 'policeStation', header: 'Police Station' },
    { key: 'doctorName', header: 'Examining Officer' },
    { key: 'categoryOfHurt', header: 'Category of Hurt' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'dateOfIssue', header: 'Date', sortable: true, render: (r) => new Date(r.dateOfIssue).toLocaleDateString('en-LK') },
  ];

  return (
    <div>
      <PageHeader
        title="MLEF Forms"
        subtitle={`Total of ${mlefForms.length} Medico-Legal Examination Form(s)`}
        breadcrumbs={[{ label: 'Forms' }, { label: 'MLEF' }]}
        icon={FileText}
        actions={canCreate && (
          <Link to="/mlefs/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> New MLEF Form
          </Link>
        )}
      />
      <DataTable 
        columns={columns} 
        data={mlefForms} 
        onRowClick={(row) => navigate(`/cases/${row.caseId}/mlef/${row.id}`)}
        emptyMessage="No MLEF forms found." 
      />
    </div>
  );
}
