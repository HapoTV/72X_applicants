// src/pages/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Loader2, AlertCircle } from 'lucide-react';
import { analyticsService } from '../services/AnalyticsService';

type TimeRange = '3months' | '6months' | '1year';

type RevenuePoint = {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
};

type CustomerPoint = {
  period: string;
  customers: number;
  newCustomers?: number;
  churnRate?: number;
};

type ExpenseSlice = {
  name: string;
  value: number;
  percentage: number;
  color: string;
  trend?: 'up' | 'down' | 'stable';
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [customerData, setCustomerData] = useState<CustomerPoint[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseSlice[]>([]);
  const [keyMetrics, setKeyMetrics] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    avgCustomerValue: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
    totalProfit: 0,
    profitMargin: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [dashboardData, revenueChartData, expenseData, customerAnalytics] = await Promise.all([
        analyticsService.getDashboardAnalytics(timeRange),
        analyticsService.getRevenueChartData(timeRange),
        analyticsService.getExpenseBreakdown(timeRange),
        analyticsService.getCustomerAnalytics(timeRange)
      ]);

      // Set revenue chart data
      setRevenueData(revenueChartData);

      // Transform customer data for chart
      const customerChartData: CustomerPoint[] = revenueChartData.map((point, index) => ({
        period: point.period,
        customers: Math.round(customerAnalytics.totalCustomers * (0.95 + (index * 0.01))), // Simple scaling
        newCustomers: Math.round(customerAnalytics.newCustomers / 6), // Assuming 6 months
        churnRate: customerAnalytics.churnRate
      }));
      setCustomerData(customerChartData);

      // Set expense breakdown
      setExpenseBreakdown(expenseData);

      // Set key metrics from dashboard
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
      
      // Clear all data on error
      setRevenueData([]);
      setCustomerData([]);
      setExpenseBreakdown([]);
      setKeyMetrics({
        totalRevenue: 0,
        totalCustomers: 0,
        avgCustomerValue: 0,
        revenueGrowth: 0,
        customerGrowth: 0,
        totalProfit: 0,
        profitMargin: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const getTimeRangeLabel = (range: string): string => {
    switch (range) {
      case '3months': return '3 months';
      case '6months': return '6 months';
      case '1year': return '1 year';
      default: return '6 months';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
        <p className="text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Unable to Load Data</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (revenueData.length === 0 && customerData.length === 0 && expenseBreakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Analytics Data Available</h3>
        <p className="text-gray-600 text-center max-w-md">
          Start by adding your financial data to see analytics.
          <br />
          Go to Data Input to add revenue, expenses, and customer information.
        </p>
        <button
          onClick={() => window.location.href = '/data-input'}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go to Data Input
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Analytics</h1>
          <p className="text-gray-600">Track your business performance and growth metrics</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${keyMetrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {keyMetrics.revenueGrowth >= 0 ? '+' : ''}{keyMetrics.revenueGrowth.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {analyticsService.formatCurrency(keyMetrics.totalRevenue)}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue ({getTimeRangeLabel(timeRange)})</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${keyMetrics.customerGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {keyMetrics.customerGrowth >= 0 ? '+' : ''}{keyMetrics.customerGrowth.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{keyMetrics.totalCustomers.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Active Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className={`text-sm font-medium ${keyMetrics.profitMargin >= 20 ? 'text-purple-600' : 'text-yellow-600'}`}>
              {keyMetrics.profitMargin.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {analyticsService.formatCurrency(keyMetrics.totalProfit)}
          </h3>
          <p className="text-gray-600 text-sm">Total Profit</p>
        </div>
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => analyticsService.formatCurrency(value).replace('R', '')}
                />
                <Tooltip 
                  formatter={(value) => [analyticsService.formatCurrency(Number(value)), '']}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customer Growth & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customerData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {expenseBreakdown.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, _name, props) => [
                      `${analyticsService.formatCurrency(Number(value))} (${props.payload.percentage?.toFixed(1)}%)`,
                      props.payload.name
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {analyticsService.formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;