import { Eye } from 'lucide-react';
import type { ProgrammeApplicationItem } from '../types';

interface ProgrammeApplicationsTableProps {
  applications: ProgrammeApplicationItem[];
  loading: boolean;
  onView: (application: ProgrammeApplicationItem) => void;
}

const statusStyles: Record<string, string> = {
  'Under Review': 'bg-slate-100 text-slate-800',
  Shortlisted: 'bg-emerald-100 text-emerald-700',
  'Not selected': 'bg-red-100 text-red-700',
};

export function ProgrammeApplicationsTable({ applications, loading, onView }: ProgrammeApplicationsTableProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Loading applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        No applications match the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Applicant Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Programme</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Phone Number</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Submission Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{application.applicantName}</td>
                <td className="px-6 py-4 text-slate-600">{application.programme}</td>
                <td className="px-6 py-4 text-slate-600">{application.email}</td>
                <td className="px-6 py-4 text-slate-600">{application.phoneNumber}</td>
                <td className="px-6 py-4 text-slate-600">{application.submissionDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[application.status]}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onView(application)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Application
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
