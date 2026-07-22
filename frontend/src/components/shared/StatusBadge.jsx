// src/components/shared/StatusBadge.jsx
import { cn } from '../../lib/utils';

const statusStyles = {
  Open: 'bg-blue-50 text-blue-700 border-blue-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Investigation': 'bg-purple-50 text-purple-700 border-purple-200',
  Closed: 'bg-gray-100 text-gray-600 border-gray-200',
  Active: 'bg-green-50 text-green-700 border-green-200',
  Inactive: 'bg-red-50 text-red-700 border-red-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Dispatched: 'bg-blue-50 text-blue-700 border-blue-200',
  Acknowledged: 'bg-green-50 text-green-700 border-green-200',
  'Sent to Lab': 'bg-blue-50 text-blue-700 border-blue-200',
  Awaiting: 'bg-amber-50 text-amber-700 border-amber-200',
  Stored: 'bg-gray-100 text-gray-600 border-gray-200',
  Admitted: 'bg-orange-50 text-orange-700 border-orange-200',
  'Under Observation': 'bg-purple-50 text-purple-700 border-purple-200',
  Discharged: 'bg-green-50 text-green-700 border-green-200',
};

const actionStyles = {
  SELECT: 'bg-gray-100 text-gray-600 border-gray-200',
  INSERT: 'bg-green-50 text-green-700 border-green-200',
  UPDATE: 'bg-amber-50 text-amber-700 border-amber-200',
  DELETE: 'bg-red-50 text-red-700 border-red-200',
};

export default function StatusBadge({ status, type = 'status', className }) {
  const styles = type === 'action' ? actionStyles : statusStyles;
  const style = styles[status] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded',
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
