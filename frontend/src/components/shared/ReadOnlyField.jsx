// src/components/shared/ReadOnlyField.jsx
import { Lock } from 'lucide-react';

export default function ReadOnlyField({ label, value, children, required }) {
  return (
    <div className="group relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        <span className="inline-flex items-center ml-1.5 opacity-50">
          <Lock className="h-3 w-3" />
        </span>
      </label>
      {children ? (
        <div className="relative">
          {children}
        </div>
      ) : (
        <div className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-[#f8fafc] cursor-not-allowed">
          {value || '—'}
        </div>
      )}
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        Read Only
      </div>
    </div>
  );
}
