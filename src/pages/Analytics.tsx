// src/pages/Analytics.tsx (FIXED VERSION)
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Loader2 } from 'lucide-react';
import { analyticsService } from '../services/AnalyticsService';
import { dataInputService } from '../services/DataInputService';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year'>('6months');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [keyMetrics, setKeyMetrics] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    avgCustomerValue: 0,
    revenueGrowth: 0,
    customerGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const getTimeRangeLabel = useCallback((range: string): string => {
    switch (range) {
      case '3months': return '3 months';
      case '6months': return '6 months';
      case '1year': return '1 year';
      default: return '6 months';
    }
  }, []);

  const transformCustomerData = useCallback((_dashboardData?: any): any[] => {
    // This would transform the customer metrics into chart data format
    // For now, return mock data
    return [
      { month: 'Jan', customers: 1100 },
      { month: 'Feb', customers: 1150 },
      { month: 'Mar', customers: 1180 },
      { month: 'Apr', customers: 1200 },
      { month: 'May', customers: 1230 },
      { month: 'Jun', customers: 1247 }
    ];
  }, []);

  const getFallbackData = useCallback((timeRange: string) => {
    const baseRevenue = [
      { month: 'Jan', revenue: 18000, expenses: 12000, profit: 6000 },
      { month: 'Feb', revenue: 22000, expenses: 14000, profit: 8000 },
      { month: 'Mar', revenue: 19000, expenses: 13000, profit: 6000 },
      { month: 'Apr', revenue: 25000, expenses: 15000, profit: 10000 },
      { month: 'May', revenue: 28000, expenses: 16000, profit: 12000 },
      { month: 'Jun', revenue: 24500, expenses: 14500, profit: 10000 },
    ];

    const baseCustomer = [
      { month: 'Jan', customers: 1100 },
      { month: 'Feb', customers: 1150 },
      { month: 'Mar', customers: 1180 },
      { month: 'Apr', customers: 1200 },
      { month: 'May', customers: 1230 },
      { month: 'Jun', customers: 1247 },
    ];

    const baseExpense = [
      { name: 'Marketing', value: 35, color: '#0ea5e9' },
      { name: 'Operations', value: 25, color: '#10b981' },
      { name: 'Staff', value: 20, color: '#f59e0b' },
      { name: 'Technology', value: 12, color: '#ef4444' },
      { name: 'Other', value: 8, color: '#8b5cf6' },
    ];

    const limit = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    
    return {
      revenueData: baseRevenue.slice(-limit),
      customerData: baseCustomer.slice(-limit),
      expenseData: baseExpense
    };
  }, []);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const userId = dataInputService.getCurrentUserId();
        
        // Fetch all data in parallel
        const [dashboardData, revenueChartData, expenseData] = await Promise.allSettled([
          analyticsService.getDashboardAnalytics(userId, timeRange),
          analyticsService.getRevenueChartData(userId, timeRange),
          analyticsService.getExpenseBreakdown(userId, timeRange)
        ]);

        // Handle dashboard data
        if (dashboardData.status === 'fulfilled') {
          const data = dashboardData.value;
          
          // Transform customer data from dashboard
          const customerChartData = transformCustomerData(data);
          setCustomerData(customerChartData);

          // Set key metrics
          setKeyMetrics({
            totalRevenue: data.revenueMetrics?.totalRevenue || 0,
            totalCustomers: data.customerMetrics?.totalCustomers || 0,
            avgCustomerValue: data.customerMetrics?.averageCustomerValue || 0,
            revenueGrowth: data.revenueMetrics?.revenueGrowth || 0,
            customerGrowth: data.customerMetrics?.customerGrowth || 0
          });
        }

        // Handle revenue chart data
        if (revenueChartData.status === 'fulfilled') {
          setRevenueData(revenueChartData.value);
        } else {
          // Use fallback data
          const fallback = getFallbackData(timeRange);
          setRevenueData(fallback.revenueData);
        }

        // Handle expense breakdown
        if (expenseData.status === 'fulfilled') {
          setExpenseBreakdown(expenseData.value);
        } else {
          // Use fallback data
          const fallback = getFallbackData(timeRange);
          setExpenseBreakdown(fallback.expenseData);
        }

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Use fallback data
        const fallback = getFallbackData(timeRange);
        setRevenueData(fallback.revenueData);
        setCustomerData(fallback.customerData);
        setExpenseBreakdown(fallback.expenseData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, transformCustomerData, getFallbackData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
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
            onChange={(e) => setTimeRange(e.target.value as any)}
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
            <span className="text-sm text-purple-600 font-medium">Current</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {analyticsService.formatCurrency(keyMetrics.avgCustomerValue)}
          </h3>
          <p className="text-gray-600 text-sm">Avg. Customer Value</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis 
                stroke="#6b7280"
                tickFormatter={(value) => analyticsService.formatCurrency(value).replace('R', '')}
              />
              <Tooltip 
                formatter={(value) => [analyticsService.formatCurrency(Number(value)), '']}
                labelFormatter={(label) => `Month: ${label}`}
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

      {/* Customer Growth & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
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
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, _name, props) => [`${value}%`, props.payload.name]}
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
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;