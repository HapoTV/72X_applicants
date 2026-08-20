import { Pencil, Trash2 } from 'lucide-react';
import type { ProgrammeListItem } from '../types';
import { ProgrammeStatusBadge } from './ProgrammeStatusBadge';

interface ProgrammeTableProps {
  programmes: ProgrammeListItem[];
  loading: boolean;
  onEdit: (programme: ProgrammeListItem) => void;
  onDelete: (programme: ProgrammeListItem) => void;
}

export function ProgrammeTable({ programmes, loading, onEdit, onDelete }: ProgrammeTableProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Loading programmes...
      </div>
    );
  }

  if (programmes.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        No programmes match the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Programme Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Partner</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Province</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Duration</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Applications</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Created Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {programmes.map((programme) => (
              <tr key={programme.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{programme.programmeName}</td>
                <td className="px-6 py-4 text-slate-600">{programme.partner}</td>
                <td className="px-6 py-4 text-slate-600">{programme.province}</td>
                <td className="px-6 py-4 text-slate-600">{programme.duration}</td>
                <td className="px-6 py-4 text-slate-600">{programme.applications}</td>
                <td className="px-6 py-4">
                  <ProgrammeStatusBadge status={programme.status} />
                </td>
                <td className="px-6 py-4 text-slate-600">{programme.createdDate}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(programme)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(programme)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
