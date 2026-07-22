// src/pages/cases/CaseDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Stethoscope, FlaskConical, Gavel, Users, ScrollText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import {
  cases, deceasedPersons, injuredPersons, mlefForms, postMortemReports,
  specimens, courtCertificates, courtSummons, auditLogs
} from '../../data/mockData';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'persons', label: 'Persons', icon: Users },
  { key: 'mlef', label: 'MLEF Forms', icon: FileText },
  { key: 'postmortem', label: 'Post-Mortem', icon: Stethoscope },
  { key: 'specimens', label: 'Specimens', icon: FlaskConical },
  { key: 'court', label: 'Court Documents', icon: Gavel },
  { key: 'audit', label: 'Audit Trail', icon: ScrollText },
];

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const caseData = cases.find((c) => c.id === parseInt(id));

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Case not found.</p>
        <Link to="/cases" className="text-sm text-[#1e3a5f] hover:underline mt-2 inline-block">
          Back to Cases
        </Link>
      </div>
    );
  }

  const caseDeceased = deceasedPersons.filter((p) => p.caseId === caseData.id);
  const caseInjured = injuredPersons.filter((p) => p.caseId === caseData.id);
  const caseMLEF = mlefForms.filter((m) => m.caseId === caseData.id);
  const casePM = postMortemReports.filter((pm) => pm.caseId === caseData.id);
  const caseSpecimens = specimens.filter((s) => s.caseId === caseData.id);
  const caseCerts = courtCertificates.filter((cc) => cc.caseId === caseData.id);
  const caseSummons = courtSummons.filter((cs) => cs.caseId === caseData.id);
  const caseAudit = auditLogs.filter((al) => al.recordId.includes(caseData.caseNo.split('/').pop()));

  const canCreateMLEF = user?.role === ROLES.JMO || user?.role === ROLES.ADMIN;
  const canCreatePM = user?.role === ROLES.JMO || user?.role === ROLES.ADMIN;

  return (
    <div>
      <PageHeader
        title={caseData.caseNo}
        subtitle={`Inquest No: ${caseData.inquestNo}`}
        breadcrumbs={[
          { label: 'Cases', path: '/cases' },
          { label: caseData.caseNo },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={caseData.status} />
            <StatusBadge status={caseData.caseType} className="bg-gray-100 text-gray-700 border-gray-200" />
          </div>
        }
      />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab caseData={caseData} />}
      {activeTab === 'persons' && <PersonsTab caseId={caseData.id} deceased={caseDeceased} injured={caseInjured} />}
      {activeTab === 'mlef' && <MLEFTab caseId={caseData.id} mlefs={caseMLEF} canCreate={canCreateMLEF} navigate={navigate} />}
      {activeTab === 'postmortem' && <PostMortemTab caseId={caseData.id} reports={casePM} canCreate={canCreatePM} navigate={navigate} />}
      {activeTab === 'specimens' && <SpecimensTab specimens={caseSpecimens} />}
      {activeTab === 'court' && <CourtTab certs={caseCerts} summons={caseSummons} />}
      {activeTab === 'audit' && <AuditTab logs={caseAudit} />}
    </div>
  );
}

function OverviewTab({ caseData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-6">
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        <Field label="Case Number" value={caseData.caseNo} />
        <Field label="Case Type" value={caseData.caseType} />
        <Field label="Inquest Number" value={caseData.inquestNo} />
        <Field label="Court Case Number" value={caseData.courtCaseNo || '—'} />
        <Field label="Status" value={caseData.status} />
        <Field label="Opened Date" value={new Date(caseData.openedDate).toLocaleDateString('en-LK')} />
        <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assigned Personnel</p>
        </div>
        <Field label="Assigned JMO" value={caseData.assignedJMO.fullName} />
        <Field label="JMO Qualification" value={caseData.assignedJMO.qualification} />
        <Field label="Police Station" value={caseData.policeStation.name} />
        <Field label="Investigating Officer" value={`${caseData.policeOfficer.name} (${caseData.policeOfficer.regNo})`} />
        <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Linked Court</p>
        </div>
        <Field label="Court" value={caseData.court.name} />
        <Field label="Magistrate" value={caseData.magistrate.name} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function PersonsTab({ caseId, deceased, injured }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Deceased Persons</h3>
          <Link to="/persons/deceased/new" className="text-xs text-[#1e3a5f] hover:underline">
            + Add Deceased
          </Link>
        </div>
        <DataTable
          columns={[
            { key: 'fullName', header: 'Full Name', sortable: true },
            { key: 'nicNo', header: 'NIC No.' },
            { key: 'age', header: 'Age' },
            { key: 'sex', header: 'Sex' },
            { key: 'dateOfDeath', header: 'Date of Death', render: (r) => new Date(r.dateOfDeath).toLocaleDateString('en-LK') },
            { key: 'placeOfDeath', header: 'Place of Death' },
          ]}
          data={deceased}
          emptyMessage="No deceased persons registered for this case."
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Injured Persons</h3>
          <Link to="/persons/injured/new" className="text-xs text-[#1e3a5f] hover:underline">
            + Add Injured Person
          </Link>
        </div>
        <DataTable
          columns={[
            { key: 'fullName', header: 'Full Name', sortable: true },
            { key: 'nicNo', header: 'NIC No.' },
            { key: 'age', header: 'Age' },
            { key: 'sex', header: 'Sex' },
            { key: 'hospital', header: 'Hospital' },
            { key: 'currentStatus', header: 'Status', render: (r) => <StatusBadge status={r.currentStatus} /> },
          ]}
          data={injured}
          emptyMessage="No injured persons registered for this case."
        />
      </div>
    </div>
  );
}

function MLEFTab({ caseId, mlefs, canCreate, navigate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">MLEF Forms</h3>
        {canCreate && (
          <Link to={`/cases/${caseId}/mlef/new`} className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline">
            <Plus className="h-3 w-3" /> Create New MLEF
          </Link>
        )}
      </div>
      <DataTable
        columns={[
          { key: 'mlefSerialNo', header: 'MLEF Serial No.', sortable: true },
          { key: 'examineeName', header: 'Examinee' },
          { key: 'policeStation', header: 'Police Station' },
          { key: 'doctorName', header: 'Examining Officer' },
          { key: 'categoryOfHurt', header: 'Category of Hurt' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'dateOfIssue',
            header: 'Date',
            sortable: true,
            render: (r) => new Date(r.dateOfIssue).toLocaleDateString('en-LK'),
          },
        ]}
        data={mlefs}
        onRowClick={(row) => navigate(`/cases/${caseId}/mlef/${row.id}`)}
        emptyMessage="No MLEF forms for this case."
      />
    </div>
  );
}

function PostMortemTab({ caseId, reports, canCreate, navigate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Post-Mortem Reports</h3>
        {canCreate && (
          <Link to={`/cases/${caseId}/postmortem/new`} className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline">
            <Plus className="h-3 w-3" /> Create PM Report
          </Link>
        )}
      </div>
      <DataTable
        columns={[
          { key: 'pmSerialNo', header: 'PM Serial No.', sortable: true },
          { key: 'deceasedName', header: 'Deceased' },
          { key: 'examiningOfficer', header: 'Examining Officer' },
          { key: 'examDate', header: 'Exam Date', sortable: true, render: (r) => new Date(r.examDate).toLocaleDateString('en-LK') },
          { key: 'causeOfDeath', header: 'Cause of Death', cellClassName: 'max-w-xs truncate' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={reports}
        onRowClick={(row) => navigate(`/cases/${caseId}/postmortem/${row.id}`)}
        emptyMessage="No post-mortem reports for this case."
      />
    </div>
  );
}

function SpecimensTab({ specimens: specimenData }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Specimens</h3>
      <DataTable
        columns={[
          { key: 'specimenNo', header: 'Specimen No.', sortable: true },
          { key: 'type', header: 'Type', sortable: true },
          { key: 'dateRetained', header: 'Date Retained', render: (r) => new Date(r.dateRetained).toLocaleDateString('en-LK') },
          { key: 'purpose', header: 'Purpose', cellClassName: 'max-w-sm truncate' },
          { key: 'storageLocation', header: 'Storage Location' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={specimenData}
        emptyMessage="No specimens recorded for this case."
      />
    </div>
  );
}

function CourtTab({ certs, summons }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Court Certificates</h3>
        <DataTable
          columns={[
            { key: 'certId', header: 'Cert ID' },
            { key: 'court', header: 'Court' },
            { key: 'trialDate', header: 'Trial Date', render: (r) => new Date(r.trialDate).toLocaleDateString('en-LK') },
            { key: 'dispatchDate', header: 'Dispatch Date', render: (r) => r.dispatchDate ? new Date(r.dispatchDate).toLocaleDateString('en-LK') : '—' },
            { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          data={certs}
          emptyMessage="No court certificates for this case."
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Court Summons</h3>
        <DataTable
          columns={[
            { key: 'court', header: 'Court' },
            { key: 'magistrate', header: 'Magistrate' },
            { key: 'trialDate', header: 'Trial Date', render: (r) => new Date(r.trialDate).toLocaleDateString('en-LK') },
            { key: 'purpose', header: 'Purpose' },
            { key: 'responseStatus', header: 'Status', render: (r) => <StatusBadge status={r.responseStatus} /> },
          ]}
          data={summons}
          emptyMessage="No court summons for this case."
        />
      </div>
    </div>
  );
}

function AuditTab({ logs }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Audit Trail</h3>
      <DataTable
        columns={[
          { key: 'id', header: 'Log ID' },
          { key: 'username', header: 'User' },
          { key: 'action', header: 'Action', render: (r) => <StatusBadge status={r.action} type="action" /> },
          { key: 'tableName', header: 'Table' },
          { key: 'timestamp', header: 'Timestamp', render: (r) => new Date(r.timestamp).toLocaleString('en-LK') },
          { key: 'ipAddress', header: 'IP Address' },
        ]}
        data={logs}
        emptyMessage="No audit records found for this case."
      />
    </div>
  );
}
