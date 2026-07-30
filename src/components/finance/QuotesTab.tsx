import React from 'react';
import { FilePlus } from 'lucide-react';
import type { Quote, QuoteStatus } from '../../interfaces/FinanceData';

interface QuotesTabProps {
  quotes: Quote[];
  filteredQuotes: Quote[];
  filter: 'All' | 'Draft' | 'Sent' | 'Declined' | 'Accepted';
  onFilterChange: (filter: 'All' | 'Draft' | 'Sent' | 'Declined' | 'Accepted') => void;
  onStatusChange: (quoteId: string, status: QuoteStatus) => void;
  onEdit: (quote: Quote) => void;
  onCreateNew: () => void;
}

const filterOptions = ['All', 'Draft', 'Sent', 'Declined', 'Accepted'] as const;

export const QuotesTab: React.FC<QuotesTabProps> = ({
  quotes,
  filteredQuotes,
  filter,
  onFilterChange,
  onStatusChange,
  onEdit,
  onCreateNew,
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quotes</h2>
          <p className="text-sm text-gray-500">
            Create, edit, and monitor all of your quotes from one dashboard.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          onClick={onCreateNew}
        >
          <FilePlus className="h-4 w-4" />
          New Quote
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        {filterOptions.map((filterOption) => (
          <button
            key={filterOption}
            type="button"
            onClick={() => onFilterChange(filterOption)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-200 px-6 py-4 text-sm uppercase tracking-wide text-gray-500">
          <span>Number</span>
          <span>Reference</span>
          <span>Customer</span>
          <span>Issue date</span>
          <span>Expiration date</span>
          <span>Status</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="space-y-2 px-6 py-4">
          {filteredQuotes.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No quotes found</p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="grid grid-cols-7 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onEdit(quote)}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {quote.id}
                  </button>
                </div>
                <div className="text-sm text-gray-900">{quote.reference}</div>
                <div>
                  <p className="font-semibold text-gray-900">{quote.client}</p>
                </div>
                <div className="text-sm text-gray-600">{quote.createdAt}</div>
                <div className="text-sm text-gray-600">{quote.expiresAt}</div>
                <div className="flex justify-center">
                  <select
                    value={quote.status}
                    onChange={(event) =>
                      onStatusChange(quote.id, event.target.value as QuoteStatus)
                    }
                    className="block w-32 max-w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="text-right font-semibold text-gray-900">
                  R{quote.total.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
