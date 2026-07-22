// src/pages/court/CourtSummonsList.jsx
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { courtSummons } from '../../data/mockData';
import { useAuth, ROLES } from '../../contexts/AuthContext';

export default function CourtSummonsList() {
  const { user } = useAuth();
  const canCreate = [ROLES.ADMIN, ROLES.REGISTRAR].includes(user?.role);

  const columns = [
    { key: 'caseNo', header: 'Case No.', sortable: true },
    { key: 'court', header: 'Court' },
    { key: 'magistrate', header: 'Magistrate' },
    { key: 'dateIssued', header: 'Date Issued', sortable: true, render: (r) => new Date(r.dateIssued).toLocaleDateString('en-LK') },
    { key: 'trialDate', header: 'Trial Date', sortable: true, render: (r) => new Date(r.trialDate).toLocaleDateString('en-LK') },
    { key: 'purpose', header: 'Purpose', cellClassName: 'max-w-xs truncate' },
    { key: 'responseStatus', header: 'Status', render: (r) => <StatusBadge status={r.responseStatus} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Court Summons"
        subtitle={`${courtSummons.length} summons record(s)`}
        breadcrumbs={[{ label: 'Court' }, { label: 'Summons' }]}
        actions={canCreate && (
          <Link to="/court/summons/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> New Summons
          </Link>
        )}
      />
      <DataTable columns={columns} data={courtSummons} emptyMessage="No court summons records." />
    </div>
  );
}
