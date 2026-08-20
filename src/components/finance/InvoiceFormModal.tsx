import React from 'react';
import { FilePlus } from 'lucide-react';
import type { Invoice, InvoiceStatus, QuoteItem, Quote } from '../../interfaces/FinanceData';

interface InvoiceFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  invoice?: Invoice;
  quotes: Quote[];
  invoiceId?: string | null;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onPrint?: (invoice: Invoice) => void;
  onDelete?: () => void;
  onClose: () => void;
}
const todayString = new Date().toISOString().slice(0, 10);

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  mode,
  invoice,
  quotes,
  onSave,
  onPrint,
  onDelete,
  onClose,
}) => {
  const [draft, setDraft] = React.useState<{
    customer: string;
    invoiceNumber: string;
    reference: string;
    total: number;
    items: QuoteItem[];
    status: InvoiceStatus;
    issuedAt: string;
    dueAt: string;
  }>(() => {
    if (invoice) {
      return {
        customer: invoice.customer,
        invoiceNumber: invoice.invoiceNumber || invoice.id,
        reference: invoice.reference || '',
        total: invoice.total,
        items: invoice.items ?? [{ description: '', quantity: 1, unitPrice: 0 }],
        status: invoice.status,
        issuedAt: invoice.issuedAt,
        dueAt: invoice.dueAt,
      };
    }
    return {
      customer: '',
      invoiceNumber: '',
      reference: '',
      total: 0,
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      status: 'Draft' as InvoiceStatus,
      issuedAt: todayString,
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    };
  });

  const [showSaveMenu, setShowSaveMenu] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const items = draft.items ?? [];
    const computedTotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    onSave({
      customer: draft.customer || 'New Customer',
      invoiceNumber: draft.invoiceNumber || '',
      reference: draft.reference || '',
      total: computedTotal,
      items,
      status: draft.status,
      issuedAt: draft.issuedAt,
      dueAt: draft.dueAt,
    });
  };

  return (
    <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            {mode === 'create' ? 'New Invoice' : 'Edit Invoice'}
          </h3>
          <p className="text-sm text-blue-700">
            Use the invoice section to add customer details, dates, and line items.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            Cancel
          </button>
          {mode === 'edit' && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Delete Invoice
            </button>
          )}
          <div className="relative inline-flex">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Invoice
            </button>
            {onPrint && (
              <>
                <button
                  type="button"
                  onClick={() => setShowSaveMenu((prev) => !prev)}
                  aria-label="Invoice save options"
                  className="-ml-1 rounded-r-full rounded-l-none border border-transparent bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100"
                >
                  ⋮
                </button>
                {showSaveMenu && (
                  <div className="absolute right-0 top-full z-10 mt-2 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        handleSave();
                       onPrint({
  id: invoice?.id ?? 'Preview',
  customer: draft.customer,
  invoiceNumber: draft.invoiceNumber,
  reference: draft.reference,
  total: draft.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ),
  items: draft.items,
  status: draft.status,
  issuedAt: draft.issuedAt,
  dueAt: draft.dueAt,
});
                        setShowSaveMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Save as PDF
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Choose from accepted quotes</label>
            <select
              onChange={(e) => {
                const qid = e.target.value;
                const selected = quotes.find((q) => q.id === qid);
                if (selected) {
                  setDraft((prev) => ({
                    ...prev,
                    customer: selected.client,
                    reference: selected.reference || prev.reference,
                    items: selected.items?.map((it) => ({ ...it })) ?? prev.items,
                  }));
                }
              }}
              defaultValue=""
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— Select accepted quote —</option>
              {quotes
                .filter((q) => q.status === 'Accepted')
                .map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.id} • {q.client}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Customer</label>
            <input
              type="text"
              value={draft.customer}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, customer: event.target.value }))
              }
              placeholder="Customer name"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Invoice number</label>
            <input
              type="text"
              value={draft.invoiceNumber}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, invoiceNumber: event.target.value }))
              }
              placeholder="INV-0001"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Reference</label>
            <input
              type="text"
              value={draft.reference}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, reference: event.target.value }))
              }
              placeholder="Invoice reference"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Status</label>
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as InvoiceStatus,
                }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="Draft">Draft</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Overdue">Overdue</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Issue date</label>
            <input
              type="date"
              value={draft.issuedAt}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, issuedAt: event.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Due date</label>
            <input
              type="date"
              value={draft.dueAt}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, dueAt: event.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-semibold text-gray-900">Line items</h4>
            <p className="text-sm text-gray-500">Add invoice products or services below.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }],
              }))
            }
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <FilePlus className="w-4 h-4" />
            Add line
          </button>
        </div>
        <div className="overflow-auto rounded-3xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit Price</th>
                <th className="px-3 py-2">Line Total</th>
                <th className="px-3 py-2">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {draft.items.map((item, idx) => {
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx ? { ...it, description: e.target.value } : it,
                            ),
                          }))
                        }
                        placeholder="Description"
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 w-24">
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx ? { ...it, quantity: Number(e.target.value) || 0 } : it,
                            ),
                          }))
                        }
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 w-36">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx ? { ...it, unitPrice: Number(e.target.value) || 0 } : it,
                            ),
                          }))
                        }
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 w-36">R{lineTotal.toLocaleString()}</td>
                    <td className="px-3 py-2 w-20 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            items: prev.items.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Total</span>
          <span className="font-semibold text-gray-900">
            R{draft.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
};
