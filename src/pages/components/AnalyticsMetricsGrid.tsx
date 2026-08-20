import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { analyticsService } from '../../services/AnalyticsService';
import { getTimeRangeLabel } from '../analyticsHelpers';
import type { KeyMetrics, TimeRange } from '../analyticsHelpers';
import AnalyticsMetricCard from './AnalyticsMetricCard';

interface AnalyticsMetricsGridProps {
  keyMetrics: KeyMetrics;
  timeRange: TimeRange;
}

const AnalyticsMetricsGrid: React.FC<AnalyticsMetricsGridProps> = ({ keyMetrics, timeRange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnalyticsMetricCard
        title={`Total Revenue (${getTimeRangeLabel(timeRange)})`}
        value={analyticsService.formatCurrency(keyMetrics.totalRevenue)}
        change={`${keyMetrics.revenueGrowth >= 0 ? '+' : ''}${keyMetrics.revenueGrowth.toFixed(1)}%`}
        changeColor={keyMetrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}
        icon={DollarSign}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <AnalyticsMetricCard
        title="Active Customers"
        value={keyMetrics.totalCustomers.toLocaleString()}
        change={`${keyMetrics.customerGrowth >= 0 ? '+' : ''}${keyMetrics.customerGrowth.toFixed(1)}%`}
        changeColor={keyMetrics.customerGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}
        icon={Users}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <AnalyticsMetricCard
        title="Total Profit"
        value={analyticsService.formatCurrency(keyMetrics.totalProfit)}
        change={`${keyMetrics.profitMargin.toFixed(1)}%`}
        changeColor={keyMetrics.profitMargin >= 20 ? 'text-purple-600' : 'text-yellow-600'}
        icon={TrendingUp}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
};

export default AnalyticsMetricsGrid;
