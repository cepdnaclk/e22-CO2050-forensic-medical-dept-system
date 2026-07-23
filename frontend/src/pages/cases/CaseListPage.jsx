// src/pages/cases/CaseListPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { caseService } from '../../services/api';
// Using mock constants for dropdowns until their APIs are wired
import { CASE_TYPES, CASE_STATUSES, medicalOfficers } from '../../data/mockData';

export default function CaseListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = user?.role === ROLES.ADMIN || user?.role === ROLES.RECORDS_CLERK;

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJMO, setFilterJMO] = useState('');

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // We can pass status filter to the API directly if needed
        const data = await caseService.getCases({ status: filterStatus || undefined });
        setCases(data);
      } catch (err) {
        setError('Failed to load cases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [filterStatus]); // refetch when status changes

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !(c.case_number || '').toLowerCase().includes(q) &&
          !(c.court_case_no || '').toLowerCase().includes(q)
        )
          return false;
      }
      // Depending on API response shape, adjust these field names:
      // c.case_type might be an object or string
      // filterType might need adjustment based on how the backend returns CaseType
      // if (filterType && c.caseType !== filterType) return false;
      if (filterJMO && c.assigned_jmo_id !== parseInt(filterJMO)) return false;
      return true;
    });
  }, [cases, search, filterType, filterJMO]);

  const columns = [
    { key: 'case_number', header: 'Case No.', sortable: true },
    { key: 'court_case_no', header: 'Inquest No.', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'opened_date',
      header: 'Opened Date',
      sortable: true,
      render: (row) => new Date(row.opened_date).toLocaleDateString('en-LK'),
    },
    {
      key: 'assigned_jmo_id',
      header: 'Assigned JMO',
      sortable: false,
      render: (row) => {
        if (!row.assigned_jmo_id) return 'Unassigned';
        const jmo = medicalOfficers.find(mo => mo.id === row.assigned_jmo_id);
        return jmo ? jmo.fullName : `ID: ${row.assigned_jmo_id}`;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cases/${row.id}`);
          }}
          className="text-xs text-[#1e3a5f] hover:underline font-medium"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cases"
        subtitle={`${filteredCases.length} case${filteredCases.length !== 1 ? 's' : ''} found`}
        breadcrumbs={[{ label: 'Cases' }]}
        actions={
          canCreate && (
            <Link
              to="/cases/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Register New Case
            </Link>
          )
        }
      />

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-md p-3 mb-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case or inquest no."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            />
          </div>

          {/* Case Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          >
            <option value="">All Types</option>
            {CASE_TYPES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          >
            <option value="">All Statuses</option>
            {CASE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Assigned JMO */}
          <select
            value={filterJMO}
            onChange={(e) => setFilterJMO(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          >
            <option value="">All JMOs</option>
            {medicalOfficers.map((mo) => (
              <option key={mo.id} value={mo.id}>
                {mo.fullName}
              </option>
            ))}
          </select>

          {(search || filterType || filterStatus || filterJMO) && (
            <button
              onClick={() => {
                setSearch('');
                setFilterType('');
                setFilterStatus('');
                setFilterJMO('');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading cases...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCases}
          onRowClick={(row) => navigate(`/cases/${row.id}`)}
          emptyMessage="No cases match the current filters."
        />
      )}
    </div>
  );
}
