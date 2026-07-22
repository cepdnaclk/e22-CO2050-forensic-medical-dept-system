// src/components/shared/PageHeader.jsx
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function PageHeader({ title, subtitle, actions, breadcrumbs }) {
  const location = useLocation();

  const autoBreadcrumbs = breadcrumbs || generateBreadcrumbs(location.pathname);

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 mb-2">
        <Link to="/dashboard" className="hover:text-gray-700 flex items-center">
          <Home className="h-3 w-3 mr-1" />
          Home
        </Link>
        {autoBreadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center">
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-gray-700">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

function generateBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let path = '';

  const labelMap = {
    dashboard: 'Dashboard',
    cases: 'Cases',
    new: 'New',
    mlef: 'MLEF',
    postmortem: 'Post-Mortem',
    specimens: 'Specimens',
    'court-documents': 'Court Documents',
    'autopsy-notification': 'Autopsy Notification',
    persons: 'Persons',
    deceased: 'Deceased',
    injured: 'Injured',
    court: 'Court',
    certificates: 'Certificates',
    summons: 'Summons',
    receipts: 'Receipts',
    'audit-log': 'Audit Log',
    users: 'Users',
    edit: 'Edit',
    'system-config': 'System Configuration',
    roles: 'Roles & Permissions',
  };

  segments.forEach((segment, idx) => {
    path += `/${segment}`;
    const label = labelMap[segment] || segment;
    const isLast = idx === segments.length - 1;
    breadcrumbs.push({
      label,
      path: isLast ? null : path,
    });
  });

  return breadcrumbs;
}
