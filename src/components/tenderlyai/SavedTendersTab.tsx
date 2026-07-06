import React from 'react';
import { Bookmark, Calendar } from 'lucide-react';
import type { TenderItem } from '../../interfaces/TenderlyAIData';

interface SavedTendersTabProps {
  tenders: TenderItem[];
  onRemove: (tenderId: string) => void;
  loading?: boolean;
}

export const SavedTendersTab: React.FC<SavedTendersTabProps> = ({
  tenders,
  onRemove,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50">
            <Bookmark className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Saved Tenders</h3>
            <p className="text-sm text-gray-600">Your bookmarked opportunities</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">{tenders.length} saved</div>
      </div>

      {tenders.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {tenders.map((tender) => (
            <div key={tender.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-900">{tender.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{tender.industry}</p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Buyer:</span>
                      <span className="font-medium">{tender.buyer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Province:</span>
                      <span className="font-medium">{tender.province}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Closing:</span>
                      <span className="font-medium">{tender.closingAt}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <span>Source: {tender.source}</span>
                    <span className="text-gray-300">•</span>
                    <span>{tender.documentsCount} documents</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      tender.status === 'EXPIRED'
                        ? 'bg-gray-50 text-gray-600 border-gray-200'
                        : 'bg-primary-50 text-primary-700 border-primary-200'
                    }`}
                  >
                    {tender.status === 'EXPIRED' ? 'Expired' : 'Open'}
                  </span>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onRemove(tender.id)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
        <div className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <Bookmark className="w-5 h-5 text-gray-500" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">No saved tenders</h4>
          <p className="text-sm text-gray-600 mt-1">Bookmark tenders to save them for later.</p>
        </div>
      )}
    </div>
  );
};
