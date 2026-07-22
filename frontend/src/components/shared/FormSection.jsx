// src/components/shared/FormSection.jsx
export default function FormSection({ title, subtitle, children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
