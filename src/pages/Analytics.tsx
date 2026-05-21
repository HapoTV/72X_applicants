// src/pages/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/AnalyticsService';
import AnalyticsEmptyState, { AnalyticsErrorState, AnalyticsLoadingState } from './components/AnalyticsPageState';
import AnalyticsHeader from './components/AnalyticsHeader';
import AnalyticsMetricsGrid from './components/AnalyticsMetricsGrid';
import CustomerGrowthChart from './components/CustomerGrowthChart';
import ExpenseBreakdownChart from './components/ExpenseBreakdownChart';
import RevenueExpensesChart from './components/RevenueExpensesChart';
import {
  initialKeyMetrics,
  transformCustomerChartData
} from './analyticsHelpers';
import type {
  CustomerPoint,
  ExpenseSlice,
  KeyMetrics,
  RevenuePoint,
  TimeRange
} from './analyticsHelpers';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [customerData, setCustomerData] = useState<CustomerPoint[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseSlice[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics>(initialKeyMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [dashboardData, revenueChartData, expenseData, customerAnalytics] = await Promise.all([
        analyticsService.getDashboardAnalytics(timeRange),
        analyticsService.getRevenueChartData(timeRange),
        analyticsService.getExpenseBreakdown(timeRange),
        analyticsService.getCustomerAnalytics(timeRange)
      ]);

      setRevenueData(revenueChartData);
      setCustomerData(transformCustomerChartData(revenueChartData, customerAnalytics));
      setExpenseBreakdown(expenseData);
      setKeyMetrics({
        totalRevenue: dashboardData.revenueMetrics.totalRevenue,
        totalCustomers: dashboardData.customerMetrics.totalCustomers,
        avgCustomerValue: dashboardData.customerMetrics.averageCustomerValue,
        revenueGrowth: dashboardData.revenueMetrics.revenueGrowth,
        customerGrowth: dashboardData.customerMetrics.customerGrowth,
        totalProfit: dashboardData.revenueMetrics.totalProfit,
        profitMargin: dashboardData.revenueMetrics.profitMargin
      });

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
      setRevenueData([]);
      setCustomerData([]);
      setExpenseBreakdown([]);
      setKeyMetrics(initialKeyMetrics);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  if (isLoading) {
    return <AnalyticsLoadingState />;
  }

  if (error) {
    return <AnalyticsErrorState error={error} onRetry={fetchAnalyticsData} />;
  }

  if (revenueData.length === 0 && customerData.length === 0 && expenseBreakdown.length === 0) {
    return <AnalyticsEmptyState />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <AnalyticsMetricsGrid
        keyMetrics={keyMetrics}
        timeRange={timeRange}
      />

      <RevenueExpensesChart revenueData={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerGrowthChart customerData={customerData} />
        <ExpenseBreakdownChart expenseBreakdown={expenseBreakdown} />
      </div>
    </div>
  );
};

export default Analytics;
