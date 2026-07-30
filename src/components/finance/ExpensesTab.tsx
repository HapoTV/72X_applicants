import React from 'react';
import { FilePlus } from 'lucide-react';
import type { Expense } from '../../interfaces/FinanceData';

interface ExpensesTabProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onCreateNew: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ expenses, onEdit, onCreateNew }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
          <p className="text-sm text-gray-500">Track spending across categories and vendors.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          onClick={onCreateNew}
        >
          <FilePlus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b border-gray-200 px-6 py-4 text-sm uppercase tracking-wide text-gray-500">
          <span className="col-span-2">Description</span>
          <span>Spent at</span>
          <span>Spent on</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="space-y-2 px-6 py-4">
          {expenses.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No expenses recorded</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="grid grid-cols-5 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
              >
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => onEdit(expense)}
                    className="text-left text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {expense.description || 'No description provided'}
                  </button>
                  <p className="text-xs text-gray-500">Proof: {expense.proof || 'None'}</p>
                </div>
                <div className="text-sm text-gray-600">{expense.spentAt}</div>
                <div className="text-sm text-gray-600">{expense.spentOn}</div>
                <div className="text-right font-semibold text-gray-900">
                  R{expense.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
