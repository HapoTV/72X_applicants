import type { ProgrammeStatus } from '../types';

interface ProgrammeFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: ProgrammeStatus | 'All';
  onStatusFilterChange: (value: ProgrammeStatus | 'All') => void;
  partnerFilter: string;
  onPartnerFilterChange: (value: string) => void;
  partners: string[];
}

export function ProgrammeFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  partnerFilter,
  onPartnerFilterChange,
  partners,
}: ProgrammeFiltersProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label htmlFor="programme-search" className="block text-sm font-medium text-gray-700">
            Search Programme
          </label>
          <input
            id="programme-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search programme"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="programme-status" className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="programme-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as ProgrammeStatus | 'All')}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="programme-partner" className="block text-sm font-medium text-gray-700">
            Filter by Partner
          </label>
          <select
            id="programme-partner"
            value={partnerFilter}
            onChange={(e) => onPartnerFilterChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="All">All Partners</option>
            {partners.map((partner) => (
              <option key={partner} value={partner}>
                {partner}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
