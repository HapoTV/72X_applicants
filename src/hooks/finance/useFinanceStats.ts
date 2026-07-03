import { useMemo } from 'react';
import type { Invoice, Quote, Expense, FinanceStats } from '../../interfaces/FinanceData';

export const useFinanceStats = (
  quotes: Quote[],
  invoices: Invoice[],
  expenses: Expense[],
) => {
  const stats = useMemo((): FinanceStats => {
    // Calculate cash balance
    const paidInvoicesTotal = invoices
      .filter((invoice) => invoice.status === 'Paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const cashBalance = paidInvoicesTotal - totalExpenses;

    // Count open quotes
    const openQuotes = quotes.filter(
      (quote) => quote.status !== 'Accepted' && quote.status !== 'Rejected',
    ).length;

    // Count awaiting invoices
    const awaitingInvoices = invoices.filter(
      (invoice) => invoice.status === 'Awaiting Payment',
    ).length;

    // Count overdue invoices
    const overdueInvoices = invoices.filter(
      (invoice) => invoice.status === 'Overdue',
    ).length;

    // Calculate monthly expenses
    const now = new Date();
    const monthlyExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.spentOn);
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate total sales
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      cashBalance,
      openQuotes,
      awaitingInvoices,
      overdueInvoices,
      monthlyExpenses,
      totalSales,
    };
  }, [quotes, invoices, expenses]);

  return stats;
};
