import React from 'react';
import type { FinanceStats } from '../../interfaces/FinanceData';

interface ReportsTabProps {
  stats: FinanceStats;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ stats }) => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-500">
          What you earned • What you spent • What you are still owed
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Profit & Loss Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Profit & Loss
            </h3>
            <p className="text-sm text-gray-500">
              Income vs expenses overview.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.totalExpenses.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Net Profit</p>
              <p
                className={`text-lg font-semibold ${
                  stats.netProfit >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                R{stats.netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Flow
            </h3>
            <p className="text-sm text-gray-500">
              Money in and out tracking.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Cash Received</p>
              <p className="text-lg font-semibold text-gray-900">
                R{(stats.totalRevenue - stats.outstandingAmount).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Cash Spent</p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.totalExpenses.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Net Cash Flow</p>
              <p
                className={`text-lg font-semibold ${
                  stats.cashBalance >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                R{stats.cashBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Invoices Summary Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Invoices Summary
            </h3>
            <p className="text-sm text-gray-500">
              Complete invoice breakdown.
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Total Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.totalInvoices}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Paid Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.paidInvoices}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Unpaid Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.unpaidInvoices}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Overdue Invoices</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.overdueInvoices}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Total Outstanding Amount
              </p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.outstandingAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Expense Summary Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Summary
            </h3>
            <p className="text-sm text-gray-500">
              Spending overview and trends.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.totalExpenses.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Monthly Expenses
              </p>
              <p className="text-lg font-semibold text-gray-900">
                R{stats.monthlyExpenses.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Quote Conversion Rate
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.conversionRate.toLocaleString()}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};