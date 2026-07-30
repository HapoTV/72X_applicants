import React from 'react';
import { FilePlus } from 'lucide-react';
import type { Quote, QuoteStatus, QuoteItem } from '../../interfaces/FinanceData';
import type { Contact } from '../../interfaces/FinanceData';

interface QuoteFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  quote?: Quote;
  crmContacts: Contact[];
  onSave: (quote: Omit<Quote, 'id'>) => void;
  onSaveAndPrint?: (quote: Omit<Quote, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const todayString = new Date().toISOString().slice(0, 10);

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  isOpen,
  mode,
  quote,
  crmContacts,
  onSave,
  onSaveAndPrint,
  onDelete,
  onClose,
}) => {
  const [draft, setDraft] = React.useState<{
    client: string;
    quoteNumber: string;
    reference: string;
    total: number;
    items: QuoteItem[];
    status: QuoteStatus;
    createdAt: string;
    expiresAt: string;
  }>(() => {
    if (quote) {
      return {
        client: quote.client,
        quoteNumber: quote.id,
        reference: quote.reference || '',
        total: quote.total,
        items: quote.items ?? [{ description: '', quantity: 1, unitPrice: 0 }],
        status: quote.status,
        createdAt: quote.createdAt,
        expiresAt: quote.expiresAt,
      };
    }
    return {
      client: '',
      quoteNumber: '',
      reference: '',
      total: 0,
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      status: 'Draft',
      createdAt: todayString,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
      client: draft.client || 'New Customer',
      reference: draft.reference || 'Reference not set',
      total: computedTotal,
      items,
      status: draft.status,
      createdAt: draft.createdAt,
      expiresAt: draft.expiresAt,
    });
  };

  return (
    <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            {mode === 'create' ? 'New Quote' : 'Edit Quote'}
          </h3>
          <p className="text-sm text-blue-700">
            Use the quote section to add line items, client details, and quote metadata.
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
              Delete Quote
            </button>
          )}
          <div className="relative inline-flex">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Quote
            </button>
            {onSaveAndPrint && (
              <>
                <button
                  type="button"
                  onClick={() => setShowSaveMenu((prev) => !prev)}
                  aria-label="Quote save options"
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
                        onSaveAndPrint(draft as any);
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
            <label className="text-sm font-medium text-gray-900">Select customer</label>
            <select
              value={draft.client}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, client: event.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Choose a CRM contact or enter a name</option>
              {crmContacts.map((contact) => (
                <option key={contact.id} value={contact.name}>
                  {contact.name}{contact.company ? ` — ${contact.company}` : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={draft.client}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, client: event.target.value }))
              }
              placeholder="Customer name"
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Quote Number</label>
            <input
              type="text"
              value={draft.quoteNumber}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, quoteNumber: event.target.value }))
              }
              placeholder="Q-003"
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
              placeholder="Quote reference"
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
                  status: event.target.value as QuoteStatus,
                }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Issue date</label>
            <input
              type="date"
              value={draft.createdAt}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, createdAt: event.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Expiration date</label>
            <input
              type="date"
              value={draft.expiresAt}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, expiresAt: event.target.value }))
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
            <p className="text-sm text-gray-500">Add quoted services or products in the table below.</p>
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
                        placeholder="Item description"
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
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">
            R{draft.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
};
