// src/pages/specimens/SpecimenListPage.jsx
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { specimens, specimenInvestigations } from '../../data/mockData';

export default function SpecimenListPage() {
  const { id: caseId } = useParams();
  const caseSpecimens = caseId ? specimens.filter((s) => s.caseId === parseInt(caseId)) : specimens;

  const columns = [
    { key: 'specimenNo', header: 'Specimen No.', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'dateRetained', header: 'Date Retained', sortable: true, render: (r) => new Date(r.dateRetained).toLocaleDateString('en-LK') },
    { key: 'purpose', header: 'Purpose', cellClassName: 'max-w-sm truncate' },
    { key: 'storageLocation', header: 'Storage Location' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Specimens"
        subtitle={caseId ? `Case ${caseId} — Specimen Records` : 'All Specimen Records'}
        breadcrumbs={caseId ? [
          { label: 'Cases', path: '/cases' },
          { label: `Case ${caseId}`, path: `/cases/${caseId}` },
          { label: 'Specimens' },
        ] : [{ label: 'Specimens' }]}
      />
      <DataTable columns={columns} data={caseSpecimens} emptyMessage="No specimens recorded." />

      {specimenInvestigations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Lab Investigation Results
          </h3>
          <DataTable
            columns={[
              { key: 'labName', header: 'Lab Name' },
              { key: 'testType', header: 'Test Type', sortable: true },
              { key: 'result', header: 'Result', cellClassName: 'max-w-md' },
              { key: 'resultDate', header: 'Result Date', render: (r) => r.resultDate ? new Date(r.resultDate).toLocaleDateString('en-LK') : 'Pending' },
            ]}
            data={specimenInvestigations}
          />
        </div>
      )}
    </div>
  );
}
