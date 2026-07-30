import React from 'react';
import { FilePlus } from 'lucide-react';
import type { Invoice, InvoiceStatus, InvoiceFilter } from '../../interfaces/FinanceData';

interface InvoicesTabProps {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filter: InvoiceFilter;
  onFilterChange: (filter: InvoiceFilter) => void;
  onStatusChange: (invoiceId: string, status: InvoiceStatus) => void;
  onEdit: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

const filterOptions: InvoiceFilter[] = ['All', 'Draft', 'Awaiting Payment', 'Paid', 'Overdue'];

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  invoices,
  filteredInvoices,
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
          <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
          <p className="text-sm text-gray-500">
            Review invoice statuses and due dates in one place.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          onClick={onCreateNew}
        >
          <FilePlus className="h-4 w-4" />
          New Invoice
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
          <span>Ref</span>
          <span>To</span>
          <span>Date</span>
          <span>Due Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="space-y-2 px-6 py-4">
          {filteredInvoices.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No invoices found</p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => {
              const paidAmount = invoice.status === 'Paid' ? invoice.total : 0;
              return (
                <div
                  key={invoice.id}
                  className="grid grid-cols-7 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onEdit(invoice)}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {invoice.invoiceNumber || invoice.id}
                    </button>
                  </div>
                  <div className="text-sm text-gray-900">{invoice.reference || '—'}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{invoice.customer}</p>
                  </div>
                  <div className="text-sm text-gray-600">{invoice.issuedAt}</div>
                  <div className="text-sm text-gray-600">{invoice.dueAt}</div>
                  <div className="text-sm text-gray-900">R{paidAmount.toLocaleString()}</div>
                  <div className="flex justify-center">
                    <select
                      value={invoice.status}
                      onChange={(event) =>
                        onStatusChange(invoice.id, event.target.value as InvoiceStatus)
                      }
                      className="block w-36 max-w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
