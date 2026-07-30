import type { ApplicationStatus } from '../types';

interface ProgrammeApplicationFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  programmeFilter: string;
  onProgrammeFilterChange: (value: string) => void;
  statusFilter: ApplicationStatus | 'All';
  onStatusFilterChange: (value: ApplicationStatus | 'All') => void;
  programmes: string[];
}

export function ProgrammeApplicationFilters({
  searchTerm,
  onSearchTermChange,
  programmeFilter,
  onProgrammeFilterChange,
  statusFilter,
  onStatusFilterChange,
  programmes,
}: ProgrammeApplicationFiltersProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="applicant-search" className="block text-sm font-medium text-gray-700">
            Search Applicant
          </label>
          <input
            id="applicant-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search applicant"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label htmlFor="application-programme" className="block text-sm font-medium text-gray-700">
            Filter by Programme
          </label>
          <select
            id="application-programme"
            value={programmeFilter}
            onChange={(e) => onProgrammeFilterChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="All">All Programmes</option>
            {programmes.map((programme) => (
              <option key={programme} value={programme}>
                {programme}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="application-status" className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="application-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as ApplicationStatus | 'All')}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="All">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Not selected">Not selected</option>
          </select>
        </div>
      </div>
    </div>
  );
}
