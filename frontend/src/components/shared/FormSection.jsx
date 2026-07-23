// src/components/shared/FormSection.jsx
import { ROLE_LABELS } from '../../data/mockData';

const roleBannerColors = {
  ADMIN: 'bg-red-50 border-red-200 text-red-800',
  JMO: 'bg-blue-50 border-blue-200 text-blue-800',
  POLICE: 'bg-green-50 border-green-200 text-green-800',
  REGISTRAR: 'bg-purple-50 border-purple-200 text-purple-800',
  RECORDS_CLERK: 'bg-amber-50 border-amber-200 text-amber-800',
};

export default function FormSection({ title, subtitle, children, className = '', filledByRole, sensitive }) {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Navy header bar */}
      <div className="bg-[#1e3a5f] text-white px-4 py-2 rounded-t font-semibold text-sm uppercase tracking-wider">
        {title}
      </div>

      {/* Role banner */}
      {filledByRole && (
        <div className={`flex items-center gap-2 px-4 py-2 border-x border-b text-sm ${roleBannerColors[filledByRole] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          <span className="inline-block h-2 w-2 rounded-full bg-current opacity-60" />
          This section is filled by <strong>{ROLE_LABELS[filledByRole] || filledByRole}</strong>
        </div>
      )}

      {/* Sensitive warning */}
      {sensitive && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-x border-b border-amber-200 text-sm text-amber-800">
          <span className="text-amber-500 font-bold">⚠</span>
          This section contains sensitive clinical information. Access is restricted to the examining Medical Officer.
        </div>
      )}

      {/* Content */}
      <div className="border border-t-0 border-gray-200 rounded-b p-4 bg-white">
        {subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
