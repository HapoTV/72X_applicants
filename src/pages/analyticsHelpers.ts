import type { CustomerMetrics, RevenueData } from '../interfaces/AnalyticsData';

export type TimeRange = '3months' | '6months' | '1year';

export type RevenuePoint = {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export type CustomerPoint = {
  period: string;
  customers: number;
  newCustomers?: number;
  churnRate?: number;
};

export type ExpenseSlice = {
  name: string;
  value: number;
  percentage: number;
  color: string;
  trend?: 'up' | 'down' | 'stable';
};

export interface KeyMetrics {
  totalRevenue: number;
  totalCustomers: number;
  avgCustomerValue: number;
  revenueGrowth: number;
  customerGrowth: number;
  totalProfit: number;
  profitMargin: number;
}

export const initialKeyMetrics: KeyMetrics = {
  totalRevenue: 0,
  totalCustomers: 0,
  avgCustomerValue: 0,
  revenueGrowth: 0,
  customerGrowth: 0,
  totalProfit: 0,
  profitMargin: 0
};

export const getTimeRangeLabel = (range: string): string => {
  switch (range) {
    case '3months': return '3 months';
    case '6months': return '6 months';
    case '1year': return '1 year';
    default: return '6 months';
  }
};

export const transformCustomerChartData = (
  revenueChartData: RevenueData[],
  customerAnalytics: CustomerMetrics
): CustomerPoint[] => {
  return revenueChartData.map((point, index) => ({
    period: point.period,
    customers: Math.round(customerAnalytics.totalCustomers * (0.95 + (index * 0.01))),
    newCustomers: Math.round(customerAnalytics.newCustomers / 6),
    churnRate: customerAnalytics.churnRate
  }));
};
