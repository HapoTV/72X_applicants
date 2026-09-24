import { useEffect, useState } from 'react';
import type { FinanceStats } from '../../interfaces/FinanceData';
import FinanceService from '../../services/FinanceService';

export const useFinanceStats = () => {
  const [stats, setStats] = useState<FinanceStats>({
  cashBalance: 0,
  openQuotes: 0,
  awaitingInvoices: 0,
  overdueInvoices: 0,
  monthlyExpenses: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  totalInvoices: 0,
  paidInvoices: 0,
  unpaidInvoices: 0,
  outstandingAmount: 0,
  conversionRate: 0,
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await FinanceService.getStats();

        setStats(data);
      } catch (err) {
        console.error('Failed to load finance stats:', err);
        setError(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
  };
};