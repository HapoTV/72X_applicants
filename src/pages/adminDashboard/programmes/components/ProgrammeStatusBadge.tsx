import type { ProgrammeStatus } from '../types';

const statusStyles: Record<ProgrammeStatus, string> = {
  Open: 'bg-green-100 text-emerald-700',
  Closed: 'bg-red-100 text-red-700',
  'Coming Soon': 'bg-amber-100 text-amber-800',
};

export function ProgrammeStatusBadge({ status }: { status: ProgrammeStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
