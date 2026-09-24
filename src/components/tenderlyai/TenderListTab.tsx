import React, { useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import type {
  TenderItem,
  TenderSearchFilters,
} from '../../interfaces/TenderlyAIData';

interface TenderListTabProps {
  tenders: TenderItem[];
  filters: TenderSearchFilters;
  onFilterChange: (filters: Partial<TenderSearchFilters>) => void;
  onSave: (tenderId: string) => void;
  savedIds: Set<string>;
  loading?: boolean;
  isDarkMode: boolean;
}

const isClosingWithinDays = (closingAt: string, days: number) => {
  const dt = new Date(closingAt);

  if (Number.isNaN(dt.getTime())) return false;

  const diffDays =
    (dt.getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= days;
};

export const TenderListTab: React.FC<TenderListTabProps> = ({
  tenders,
  filters,
  onFilterChange,
  onSave,
  savedIds,
  loading = false,
  isDarkMode,
}) => {
  const filteredTenders = useMemo(() => {
    return tenders.filter((tender) => {
      const q = (filters.searchTerm || '').toLowerCase();

      if (
        q &&
        !`${tender.title} ${tender.buyer} ${tender.province} ${tender.industry}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      if (
        filters.province &&
        filters.province !== 'All Provinces' &&
        tender.province !== filters.province
      ) {
        return false;
      }

      if (
        filters.industry &&
        tender.industry !== filters.industry
      ) {
        return false;
      }

      if (
        filters.status &&
        filters.status !== 'ALL' &&
        tender.status !== filters.status
      ) {
        return false;
      }

      return true;
    });
  }, [tenders, filters]);

  const cardClass = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const headingClass = isDarkMode
    ? 'text-white'
    : 'text-gray-900';

  const bodyTextClass = isDarkMode
    ? 'text-gray-300'
    : 'text-gray-700';

  const mutedTextClass = isDarkMode
    ? 'text-gray-400'
    : 'text-gray-500';

  const dividerClass = isDarkMode
    ? 'divide-gray-700'
    : 'divide-gray-200';

  const secondaryButtonClass = isDarkMode
    ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';

  return (
    <div
      className={`${cardClass} rounded-lg border shadow-sm overflow-hidden transition-colors`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } flex items-center justify-between`}
      >
        <div>
          <h3 className={`text-lg font-semibold ${headingClass}`}>
            Tender Feed
          </h3>

          <p className={`text-sm ${mutedTextClass}`}>
            Latest opportunities matching your criteria
          </p>
        </div>

        <div className={`text-xs ${mutedTextClass}`}>
          {filteredTenders.length} total tenders
        </div>
      </div>

      {/* Tender List */}
      <div className={dividerClass}>
        {filteredTenders.map((tender) => {
          const isSaved = savedIds.has(tender.id);
          const isUrgent = isClosingWithinDays(
            tender.closingAt,
            7
          );

          return (
            <div
              key={tender.id}
              className={`p-5 transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-750'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-base font-semibold truncate ${headingClass}`}
                    >
                      {tender.title}
                    </h4>

                    {isUrgent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Industry */}
                  <p
                    className={`text-sm mt-1 ${mutedTextClass}`}
                  >
                    {tender.industry}
                  </p>

                  {/* Details */}
                  <div
                    className={`mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm ${bodyTextClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={mutedTextClass}>
                        Buyer:
                      </span>

                      <span className="font-medium">
                        {tender.buyer}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={mutedTextClass}>
                        Province:
                      </span>

                      <span className="font-medium">
                        {tender.province}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 ${
                          isDarkMode
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      />

                      <span className={mutedTextClass}>
                        Closing:
                      </span>

                      <span className="font-medium">
                        {tender.closingAt}
                      </span>
                    </div>
                  </div>

                  {/* Source */}
                  <div
                    className={`mt-3 text-xs flex items-center gap-2 ${mutedTextClass}`}
                  >
                    <span>
                      Source: {tender.source}
                    </span>

                    <span
                      className={
                        isDarkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }
                    >
                      •
                    </span>

                    <span>
                      {tender.documentsCount} documents
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Status */}
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      tender.status === 'EXPIRED'
                        ? isDarkMode
                          ? 'bg-gray-700 text-gray-300 border-gray-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                        : 'bg-primary-50 text-primary-700 border-primary-200'
                    }`}
                  >
                    {tender.status === 'EXPIRED'
                      ? 'Expired'
                      : 'Open'}
                  </span>

                  {/* Industry */}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tender.industry}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onSave(tender.id)}
                      disabled={loading}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        isSaved
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : secondaryButtonClass
                      } ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {!filteredTenders.length && (
          <div className="p-10 text-center">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-100'
              }`}
            >
              <Search
                className={`w-5 h-5 ${
                  isDarkMode
                    ? 'text-gray-300'
                    : 'text-gray-500'
                }`}
              />
            </div>

            <h4
              className={`text-sm font-semibold ${headingClass}`}
            >
              No tenders found
            </h4>

            <p
              className={`text-sm mt-1 ${mutedTextClass}`}
            >
              Try adjusting your filters or search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};