import React from 'react';
import { Bookmark, Calendar } from 'lucide-react';
import type { TenderItem } from '../../interfaces/TenderlyAIData';

interface SavedTendersTabProps {
  tenders: TenderItem[];
  onRemove: (tenderId: string) => void;
  loading?: boolean;
  isDarkMode: boolean;
}

export const SavedTendersTab: React.FC<SavedTendersTabProps> = ({
  tenders,
  onRemove,
  loading = false,
  isDarkMode,
}) => {
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
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-primary-50'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isDarkMode
                  ? 'text-primary-400'
                  : 'text-primary-600'
              }`}
            />
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${headingClass}`}>
              Saved Tenders
            </h3>

            <p className={`text-sm ${mutedTextClass}`}>
              Your bookmarked opportunities
            </p>
          </div>
        </div>

        <div className={`text-xs ${mutedTextClass}`}>
          {tenders.length} saved
        </div>
      </div>

      {/* Saved tenders */}
      {tenders.length > 0 ? (
        <div className={dividerClass}>
          {tenders.map((tender) => (
            <div
              key={tender.id}
              className={`p-5 transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-base font-semibold ${headingClass}`}
                  >
                    {tender.title}
                  </h4>

                  <p
                    className={`text-sm mt-1 ${mutedTextClass}`}
                  >
                    {tender.industry}
                  </p>

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

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
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

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onRemove(tender.id)}
                      disabled={loading}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        secondaryButtonClass
                      } ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      Remove
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
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="p-10 text-center">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
              isDarkMode
                ? 'bg-gray-700'
                : 'bg-gray-100'
            }`}
          >
            <Bookmark
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
            No saved tenders
          </h4>

          <p
            className={`text-sm mt-1 ${mutedTextClass}`}
          >
            Bookmark tenders to save them for later.
          </p>
        </div>
      )}
    </div>
  );
};
