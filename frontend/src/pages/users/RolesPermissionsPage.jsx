// src/pages/users/RolesPermissionsPage.jsx
import { Shield } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { ROLES, ROLE_LABELS, permissionMatrix } from '../../data/mockData';

const modules = ['Cases', 'Users', 'MLEF_Forms', 'PostMortem_Reports', 'Specimens', 'Court_Documents', 'Audit_Log', 'System_Config'];

const moduleLabels = {
  Cases: 'Cases', Users: 'Users', MLEF_Forms: 'MLEF Forms',
  PostMortem_Reports: 'PM Reports', Specimens: 'Specimens',
  Court_Documents: 'Court Docs', Audit_Log: 'Audit Log', System_Config: 'System Config',
};

function PermCell({ value }) {
  if (!value || value === '—') {
    return <span className="inline-flex items-center justify-center h-6 w-6 rounded text-xs font-mono text-gray-400 bg-gray-100">—</span>;
  }
  return (
    <div className="flex gap-0.5">
      {['R', 'W', 'D'].map((perm) => {
        const has = value.includes(perm);
        return (
          <span key={perm} className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-mono font-bold ${
            has ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-300'
          }`}>
            {perm}
          </span>
        );
      })}
    </div>
  );
}

const roleRowColors = {
  [ROLES.ADMIN]: 'border-l-red-500',
  [ROLES.JMO]: 'border-l-blue-500',
  [ROLES.POLICE]: 'border-l-green-500',
  [ROLES.REGISTRAR]: 'border-l-purple-500',
  [ROLES.RECORDS_CLERK]: 'border-l-amber-500',
};

export default function RolesPermissionsPage() {
  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        subtitle="System-wide permission matrix (read-only)"
        breadcrumbs={[{ label: 'System' }, { label: 'Roles & Permissions' }]}
        icon={Shield}
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>R</strong> = Read &nbsp; <strong>W</strong> = Write &nbsp; <strong>D</strong> = Delete &nbsp; <strong>—</strong> = No Access
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">Role</th>
                {modules.map((m) => (
                  <th key={m} className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {moduleLabels[m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.values(ROLES).map((role) => (
                <tr key={role} className={`hover:bg-gray-50 border-l-4 ${roleRowColors[role] || ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{ROLE_LABELS[role]}</td>
                  {modules.map((m) => (
                    <td key={m} className="px-3 py-3 text-center">
                      <PermCell value={permissionMatrix[role]?.[m]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
