// src/pages/court/CourtCertificateList.jsx
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { courtCertificates } from '../../data/mockData';
import { useAuth, ROLES } from '../../contexts/AuthContext';

export default function CourtCertificateList() {
  const { user } = useAuth();
  const canCreate = [ROLES.ADMIN, ROLES.REGISTRAR].includes(user?.role);

  const columns = [
    { key: 'certId', header: 'Cert ID', sortable: true },
    { key: 'caseNo', header: 'Case No.', sortable: true },
    { key: 'court', header: 'Court' },
    { key: 'trialDate', header: 'Trial Date', sortable: true, render: (r) => new Date(r.trialDate).toLocaleDateString('en-LK') },
    { key: 'dispatchDate', header: 'Dispatch Date', render: (r) => r.dispatchDate ? new Date(r.dispatchDate).toLocaleDateString('en-LK') : '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Court Certificates"
        subtitle={`${courtCertificates.length} certificate(s)`}
        breadcrumbs={[{ label: 'Court' }, { label: 'Certificates' }]}
        actions={canCreate && (
          <Link to="/court/certificates/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> New Certificate
          </Link>
        )}
      />
      <DataTable columns={columns} data={courtCertificates} emptyMessage="No court certificates." />
    </div>
  );
}
