// src/pages/postmortem/PostMortemListPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Stethoscope } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { postMortemReports } from '../../data/mockData';
import { useAuth, ROLES } from '../../contexts/AuthContext';

export default function PostMortemListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // JMO and Admin can create
  const canCreate = [ROLES.ADMIN, ROLES.JMO].includes(user?.role);

  const columns = [
    { key: 'pmSerialNo', header: 'PM Serial No.', sortable: true },
    { key: 'deceasedName', header: 'Deceased' },
    { key: 'examiningOfficer', header: 'Examining Officer' },
    { key: 'examDate', header: 'Exam Date', sortable: true, render: (r) => new Date(r.examDate).toLocaleDateString('en-LK') },
    { key: 'causeOfDeath', header: 'Cause of Death', cellClassName: 'max-w-xs truncate' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Post-Mortem Reports"
        subtitle={`Total of ${postMortemReports.length} Post-Mortem Report(s)`}
        breadcrumbs={[{ label: 'Forms' }, { label: 'Post-Mortem' }]}
        icon={Stethoscope}
        actions={canCreate && (
          <Link to="/postmortems/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> New PM Report
          </Link>
        )}
      />
      <DataTable 
        columns={columns} 
        data={postMortemReports} 
        onRowClick={(row) => navigate(`/cases/${row.caseId}/postmortem/${row.id}`)}
        emptyMessage="No post-mortem reports found." 
      />
    </div>
  );
}
