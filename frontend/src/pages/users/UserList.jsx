// src/pages/users/UserList.jsx
// Full User Management with CRUD modal/drawer
import { useState, useMemo } from 'react';
import { Plus, Users, Shield, Edit2, UserX, UserCheck, X, Eye, EyeOff, Search } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { users as initialUsers, ROLES, ROLE_LABELS, policeStations, courts } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

/* ── role badge colors ── */
const roleColors = {
  [ROLES.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [ROLES.JMO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ROLES.POLICE]: 'bg-green-100 text-green-800 border-green-200',
  [ROLES.REGISTRAR]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ROLES.RECORDS_CLERK]: 'bg-amber-100 text-amber-800 border-amber-200',
};

const emptyUser = {
  fullName: '', username: '', email: '', role: '',
  slmcRegNo: '', badgeRegNo: '', policeStation: '', assignedCourt: '',
  password: '', confirmPassword: '', mfaEnabled: false,
  requirePasswordChange: true, isActive: true,
};

export default function UserList() {
  const { user: loggedInUser } = useAuth();
  const [usersList, setUsersList] = useState([...initialUsers]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modal / drawer state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({ ...emptyUser });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  /* ── Filtered users ── */
  const filtered = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch = !search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [usersList, search, roleFilter]);

  /* ── Table columns ── */
  const columns = [
    { key: 'username', header: 'Username', sortable: true },
    { key: 'fullName', header: 'Full Name', sortable: true },
    {
      key: 'role', header: 'Role', sortable: true,
      render: (r) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${roleColors[r.role] || ''}`}>
          {ROLE_LABELS[r.role] || r.role}
        </span>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'isActive', header: 'Status',
      render: (r) => <StatusBadge status={r.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      key: 'mfaEnabled', header: 'MFA',
      render: (r) => r.mfaEnabled ? <Shield className="h-4 w-4 text-green-600" /> : <span className="text-gray-300">—</span>,
    },
    {
      key: 'lastLogin', header: 'Last Login', sortable: true,
      render: (r) => r.lastLogin ? new Date(r.lastLogin).toLocaleString('en-LK') : '—',
    },
    {
      key: 'actions', header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); openEdit(r); }}
            className="p-1.5 text-gray-500 hover:text-[#1e3a5f] hover:bg-gray-100 rounded transition-colors"
            title="Edit user">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          {r.id === loggedInUser?.id ? (
            <button disabled className="p-1.5 text-gray-300 cursor-not-allowed rounded" title="Cannot deactivate your own account">
              <UserX className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); setConfirmDeactivate(r); }}
              className={`p-1.5 rounded transition-colors ${r.isActive ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
              title={r.isActive ? 'Deactivate' : 'Activate'}>
              {r.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      ),
    },
  ];

  /* ── Open create modal ── */
  const openCreate = () => {
    setFormData({ ...emptyUser });
    setFormErrors({});
    setShowPassword(false);
    setShowCreateModal(true);
  };

  /* ── Open edit drawer ── */
  const openEdit = (u) => {
    setFormData({
      ...emptyUser,
      fullName: u.fullName, username: u.username, email: u.email,
      role: u.role, mfaEnabled: u.mfaEnabled, isActive: u.isActive,
    });
    setFormErrors({});
    setEditUserId(u.id);
  };

  /* ── Validate ── */
  const validateForm = (isEdit = false) => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Required';
    if (!isEdit && !formData.username.trim()) e.username = 'Required';
    if (!isEdit && usersList.some((u) => u.username === formData.username.trim())) e.username = 'Username already exists';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.role) e.role = 'Required';
    if (formData.role === ROLES.JMO && !formData.slmcRegNo?.trim()) e.slmcRegNo = 'Required for JMO';
    if (formData.role === ROLES.POLICE && !formData.badgeRegNo?.trim()) e.badgeRegNo = 'Required for Police';
    if (!isEdit) {
      if (!formData.password) e.password = 'Required';
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit create ── */
  const handleCreate = () => {
    if (!validateForm(false)) return;
    const newUser = {
      id: Math.max(...usersList.map((u) => u.id)) + 1,
      username: formData.username.trim(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      isActive: true,
      mfaEnabled: formData.role === ROLES.ADMIN || formData.role === ROLES.JMO ? true : formData.mfaEnabled,
      lastLogin: null,
    };
    setUsersList((prev) => [...prev, newUser]);
    setShowCreateModal(false);
    showToast(`User "${newUser.username}" created successfully.`);
  };

  /* ── Submit edit ── */
  const handleEdit = () => {
    if (!validateForm(true)) return;
    setUsersList((prev) => prev.map((u) =>
      u.id === editUserId ? { ...u, role: formData.role, email: formData.email, mfaEnabled: formData.mfaEnabled, isActive: formData.isActive } : u
    ));
    setEditUserId(null);
    showToast('User updated successfully.');
  };

  /* ── Toggle active ── */
  const toggleActive = (u) => {
    setUsersList((prev) => prev.map((x) =>
      x.id === u.id ? { ...x, isActive: !x.isActive } : x
    ));
    setConfirmDeactivate(null);
    showToast(`User "${u.username}" ${u.isActive ? 'deactivated' : 'activated'}.`);
  };

  /* ── Toast ── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── MFA locked check ── */
  const isMfaLocked = formData.role === ROLES.ADMIN || formData.role === ROLES.JMO;

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`Managing ${usersList.length} system users`}
        breadcrumbs={[{ label: 'System' }, { label: 'Users' }]}
        icon={Users}
        actions={
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] transition-colors">
            <Plus className="h-4 w-4" /> Add New User
          </button>
        }
      />

      {/* Search & Filter */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by username or full name..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No users found." />

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-16 right-4 z-[60] bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-green-500" /> {toast}
        </div>
      )}

      {/* ── Confirm Deactivate Dialog ── */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {confirmDeactivate.isActive ? 'Deactivate User' : 'Activate User'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirmDeactivate.isActive
                ? `Are you sure you want to deactivate "${confirmDeactivate.username}"? They will immediately lose system access.`
                : `Are you sure you want to activate "${confirmDeactivate.username}"?`}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeactivate(null)} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button onClick={() => toggleActive(confirmDeactivate)}
                className={`px-3 py-1.5 text-sm font-medium text-white rounded ${confirmDeactivate.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {confirmDeactivate.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create User Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-12 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            {renderForm(false)}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-1.5 text-sm font-medium text-white bg-[#1e3a5f] rounded hover:bg-[#163050]">Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Drawer ── */}
      {editUserId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="bg-white w-full max-w-md shadow-xl h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Edit User</h3>
                <button onClick={() => setEditUserId(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
              {renderForm(true)}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setEditUserId(null)} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                <button onClick={handleEdit} className="px-4 py-1.5 text-sm font-medium text-white bg-[#1e3a5f] rounded hover:bg-[#163050]">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Shared form renderer ── */
  function renderForm(isEdit) {
    const ic = (err) => `w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${err ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
          <input type="text" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} className={ic(formErrors.fullName)} />
          {formErrors.fullName && <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username *</label>
          {isEdit ? (
            <div className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-[#f8fafc] cursor-not-allowed">{formData.username}</div>
          ) : (
            <>
              <input type="text" value={formData.username} onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))} className={ic(formErrors.username)} />
              {formErrors.username && <p className="text-xs text-red-600 mt-1">{formErrors.username}</p>}
            </>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className={ic(formErrors.email)} />
          {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role *</label>
          <select value={formData.role} onChange={(e) => {
            const r = e.target.value;
            setFormData((p) => ({ ...p, role: r, mfaEnabled: r === ROLES.ADMIN || r === ROLES.JMO ? true : p.mfaEnabled }));
          }} className={ic(formErrors.role)}>
            <option value="">Select Role</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          {formErrors.role && <p className="text-xs text-red-600 mt-1">{formErrors.role}</p>}
        </div>

        {/* Conditional role fields */}
        {formData.role === ROLES.JMO && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SLMC Registration Number *</label>
            <input type="text" value={formData.slmcRegNo} onChange={(e) => setFormData((p) => ({ ...p, slmcRegNo: e.target.value }))} className={ic(formErrors.slmcRegNo)} placeholder="e.g. SLMC 37177" />
            {formErrors.slmcRegNo && <p className="text-xs text-red-600 mt-1">{formErrors.slmcRegNo}</p>}
          </div>
        )}
        {formData.role === ROLES.POLICE && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Badge / Reg Number *</label>
              <input type="text" value={formData.badgeRegNo} onChange={(e) => setFormData((p) => ({ ...p, badgeRegNo: e.target.value }))} className={ic(formErrors.badgeRegNo)} />
              {formErrors.badgeRegNo && <p className="text-xs text-red-600 mt-1">{formErrors.badgeRegNo}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Police Station</label>
              <select value={formData.policeStation} onChange={(e) => setFormData((p) => ({ ...p, policeStation: e.target.value }))} className={ic()}>
                <option value="">Select Station</option>
                {policeStations.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </>
        )}
        {formData.role === ROLES.REGISTRAR && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assigned Court</label>
            <select value={formData.assignedCourt} onChange={(e) => setFormData((p) => ({ ...p, assignedCourt: e.target.value }))} className={ic()}>
              <option value="">Select Court</option>
              {courts.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        )}

        {/* Password (create only) */}
        {!isEdit && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Temporary Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} className={ic(formErrors.password)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm Password *</label>
              <input type="password" value={formData.confirmPassword}
                onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))} className={ic(formErrors.confirmPassword)} />
              {formErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>}
            </div>
          </>
        )}

        {/* MFA toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Require MFA</label>
            {isMfaLocked && <p className="text-xs text-gray-400">Mandatory for Admin and JMO roles</p>}
          </div>
          <button type="button"
            onClick={() => !isMfaLocked && setFormData((p) => ({ ...p, mfaEnabled: !p.mfaEnabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.mfaEnabled ? 'bg-[#1e3a5f]' : 'bg-gray-300'} ${isMfaLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.mfaEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Active status (edit only) */}
        {isEdit && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Status</label>
            <button type="button" onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.isActive ? 'bg-green-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}

        {/* Require password change (create only) */}
        {!isEdit && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Require Password Change on First Login</label>
            <button type="button" onClick={() => setFormData((p) => ({ ...p, requirePasswordChange: !p.requirePasswordChange }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.requirePasswordChange ? 'bg-[#1e3a5f]' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.requirePasswordChange ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>
    );
  }
}
