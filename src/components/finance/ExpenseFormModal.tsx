import React from 'react';

import type { Expense } from '../../interfaces/FinanceData';

interface ExpenseFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  expense?: Expense;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const todayString = new Date().toISOString().slice(0, 10);

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  mode,
  expense,
  onSave,
  onDelete,
  onClose,
}) => {
  const [draft, setDraft] = React.useState<Omit<Expense, 'id'>>(() => {
    if (expense) {
      return {
        amount: expense.amount,
        description: expense.description,
        spentAt: expense.spentAt,
        spentOn: expense.spentOn,
        proof: expense.proof || '',
      };
    }
    return {
      amount: 0,
      description: '',
      spentAt: '',
      spentOn: todayString,
      proof: '',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(draft);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            {mode === 'create' ? 'New Expense' : 'Edit Expense'}
          </h3>
          <p className="text-sm text-blue-700">
            Record expense details and save them for your financial summary.
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
              Delete Expense
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Expense
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Amount spent</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.amount}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  amount: Number(event.target.value) || 0,
                }))
              }
              placeholder="0.00"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Description</label>
            <input
              type="text"
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="What was it for?"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Spent at</label>
            <input
              type="text"
              value={draft.spentAt}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, spentAt: event.target.value }))
              }
              placeholder="Where was the money spent?"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Spent on</label>
            <input
              type="date"
              value={draft.spentOn}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, spentOn: event.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-900">Attach proof</label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setDraft((prev) => ({
                  ...prev,
                  proof: file ? file.name : '',
                }));
              }}
              className="mt-2 w-full text-sm text-gray-700"
            />
            {draft.proof && (
              <p className="mt-2 text-sm text-gray-500">Attached: {draft.proof}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
