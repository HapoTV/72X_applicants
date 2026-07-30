import React from 'react';
import type { FinanceStats, Invoice } from '../../interfaces/FinanceData';

interface ReportsTabProps {
  stats: FinanceStats;
  invoices: Invoice[];
  cashBalance: number;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ stats, invoices, cashBalance }) => {
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalExpenses = stats.monthlyExpenses;
  const netProfit = totalRevenue - totalExpenses;

  const cashReceived = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const outstandingAmount = invoices
    .filter((invoice) => invoice.status !== 'Paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-500">What you earned • What you spent • What you are still owed</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Profit & Loss Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profit & Loss</h3>
              <p className="text-sm text-gray-500">Income vs expenses overview.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">R{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">R{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Net Profit</p>
              <p className={`text-lg font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R{netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
              <p className="text-sm text-gray-500">Money in and out tracking.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Cash Received</p>
              <p className="text-lg font-semibold text-gray-900">R{cashReceived.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Cash Spent</p>
              <p className="text-lg font-semibold text-gray-900">R{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Net Cash Flow</p>
              <p className={`text-lg font-semibold ${cashBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R{cashBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Invoices Summary Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Invoices Summary</h3>
              <p className="text-sm text-gray-500">Complete invoice breakdown.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Total Invoices</p>
                <p className="text-lg font-semibold text-gray-900">{invoices.length}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Paid Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoices.filter((inv) => inv.status === 'Paid').length}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Unpaid Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoices.filter((inv) => inv.status !== 'Paid').length}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Overdue Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoices.filter((inv) => inv.status === 'Overdue').length}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Outstanding Amount</p>
              <p className="text-lg font-semibold text-gray-900">R{outstandingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Expense Summary Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Expense Summary</h3>
              <p className="text-sm text-gray-500">Spending overview and trends.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">R{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Paid Expenses</p>
              <p className="text-lg font-semibold text-gray-900">R{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Unpaid Expenses</p>
              <p className="text-lg font-semibold text-gray-900">R0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
