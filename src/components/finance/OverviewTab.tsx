import React from 'react';
import { BarChart3, CreditCard, FileText, Shield, TrendingUp } from 'lucide-react';
import type { FinanceStats, Quote, Invoice } from '../../interfaces/FinanceData';

const RandIcon = ({ className }: { className?: string }) => (
  <span className={`text-base font-bold ${className || ''}`}>R</span>
);

interface OverviewTabProps {
  stats: FinanceStats;
  quotes: Quote[];
  invoices: Invoice[];
  cashBalance: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  quotes,
  invoices,
  cashBalance,
}) => {
  const summaryCards = [
    {
      label: 'Cash Balance',
      value: `R${cashBalance.toLocaleString()}`,
      icon: RandIcon,
      cardBg: 'bg-white',
      borderColor: 'border-gray-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Open Quotes',
      value: String(stats.openQuotes),
      icon: FileText,
      cardBg: 'bg-white',
      borderColor: 'border-gray-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      label: 'Awaiting Payment',
      value: String(stats.awaitingInvoices),
      icon: CreditCard,
      cardBg: 'bg-white',
      borderColor: 'border-gray-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-700',
    },
    {
      label: 'Overdue',
      value: String(stats.overdueInvoices),
      icon: CreditCard,
      cardBg: 'bg-white',
      borderColor: 'border-gray-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
    },
    {
      label: 'Expenses This Month',
      value: `R${stats.monthlyExpenses.toLocaleString()}`,
      icon: Shield,
      cardBg: 'bg-white',
      borderColor: 'border-gray-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.cardBg} rounded-xl p-6 shadow-sm border ${card.borderColor}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  {typeof Icon === 'string' ? (
                    <span className={`text-sm font-bold ${card.iconColor}`}>{Icon}</span>
                  ) : (
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Financial activities</h2>
              <p className="text-sm text-gray-500">
                A quick view of the latest quote and invoice activity.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Recent Quote</p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {quotes[0]?.id} • {quotes[0]?.client}
              </p>
              <p className="text-sm text-gray-600">Expires {quotes[0]?.expiresAt}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-sm text-green-700">Recent Paid Invoice</p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {invoices.find((invoice) => invoice.status === 'Paid')?.id || 'None yet'}
              </p>
              <p className="text-sm text-gray-600">
                {invoices.find((invoice) => invoice.status === 'Paid')
                  ? `Paid on ${invoices.find((invoice) => invoice.status === 'Paid')?.issuedAt}`
                  : 'No paid invoices available'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Performance trends</h2>
              <p className="text-sm text-gray-500">Compare revenue and spending over the month.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Updated today
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Revenue vs expenses</span>
                <span>70%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[70%] rounded-full bg-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Invoice collection</span>
                <span>42%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[42%] rounded-full bg-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
