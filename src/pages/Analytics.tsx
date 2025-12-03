import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users } from 'lucide-react';
import { dataInputService } from '../services/DataInputService';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [keyMetrics, setKeyMetrics] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    avgCustomerValue: 0,
    revenueGrowth: 0,
    customerGrowth: 0
  });

  const expenseBreakdown = [
    { name: 'Marketing', value: 35, color: '#0ea5e9' },
    { name: 'Operations', value: 25, color: '#10b981' },
    { name: 'Staff', value: 20, color: '#f59e0b' },
    { name: 'Technology', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' },
  ];

  // Get time range label for display
  const getTimeRangeLabel = (range: string): string => {
    switch (range) {
      case '3months':
        return '3 months';
      case '6months':
        return '6 months';
      case '1year':
        return '1 year';
      default:
        return '6 months';
    }
  };

  // Get the number of months to show based on time range
  const getMonthLimit = (range: string): number => {
    switch (range) {
      case '3months':
        return 3;
      case '6months':
        return 6;
      case '1year':
        return 12;
      default:
        return 6;
    }
  };

  // Filter data based on time range
  const filterDataByTimeRange = (data: any[], range: string): any[] => {
    const limit = getMonthLimit(range);
    return data.slice(-limit); // Get last N months
  };

  // Calculate metrics for filtered data
  const calculateMetricsForTimeRange = (financialData: any[], customerData: any[], range: string) => {
    const filteredFinancial = filterDataByTimeRange(financialData, range);
    const filteredCustomer = filterDataByTimeRange(customerData, range);

    if (filteredFinancial.length === 0 || filteredCustomer.length === 0) {
      return {
        totalRevenue: 0,
        totalCustomers: 0,
        avgCustomerValue: 0,
        revenueGrowth: 0,
        customerGrowth: 0
      };
    }

    const totalRevenue = filteredFinancial.reduce((sum, item) => sum + item.revenue, 0);
    const totalCustomers = filteredCustomer.reduce((sum, item) => sum + item.customers, 0);
    
    // Calculate average customer value from the most recent customer data
    const avgCustomerValue = filteredCustomer.length > 0 
      ? totalRevenue / totalCustomers 
      : 0;

    // Calculate growth rates within the filtered period
    const revenueGrowth = filteredFinancial.length >= 2 
      ? ((filteredFinancial[filteredFinancial.length - 1].revenue - filteredFinancial[0].revenue) / filteredFinancial[0].revenue) * 100
      : 0;

    const customerGrowth = filteredCustomer.length >= 2
      ? ((filteredCustomer[filteredCustomer.length - 1].customers - filteredCustomer[0].customers) / filteredCustomer[0].customers) * 100
      : 0;

    return {
      totalRevenue,
      totalCustomers,
      avgCustomerValue,
      revenueGrowth,
      customerGrowth
    };
  };

  useEffect(() => {
    // Load data from service
    const financialData = dataInputService.getFinancialChartData();
    const customerChartData = dataInputService.getCustomerChartData();

    // Get fallback data if no real data exists
    const fallbackFinancialData = [
      { month: 'Jan', revenue: 18000, expenses: 12000, profit: 6000 },
      { month: 'Feb', revenue: 22000, expenses: 14000, profit: 8000 },
      { month: 'Mar', revenue: 19000, expenses: 13000, profit: 6000 },
      { month: 'Apr', revenue: 25000, expenses: 15000, profit: 10000 },
      { month: 'May', revenue: 28000, expenses: 16000, profit: 12000 },
      { month: 'Jun', revenue: 24500, expenses: 14500, profit: 10000 },
      { month: 'Jul', revenue: 26000, expenses: 15500, profit: 10500 },
      { month: 'Aug', revenue: 27500, expenses: 16000, profit: 11500 },
      { month: 'Sep', revenue: 29000, expenses: 16500, profit: 12500 },
      { month: 'Oct', revenue: 30000, expenses: 17000, profit: 13000 },
      { month: 'Nov', revenue: 31000, expenses: 17500, profit: 13500 },
      { month: 'Dec', revenue: 32000, expenses: 18000, profit: 14000 },
    ];

    const fallbackCustomerData = [
      { month: 'Jan', customers: 1100 },
      { month: 'Feb', customers: 1150 },
      { month: 'Mar', customers: 1180 },
      { month: 'Apr', customers: 1200 },
      { month: 'May', customers: 1230 },
      { month: 'Jun', customers: 1247 },
      { month: 'Jul', customers: 1265 },
      { month: 'Aug', customers: 1280 },
      { month: 'Sep', customers: 1300 },
      { month: 'Oct', customers: 1325 },
      { month: 'Nov', customers: 1350 },
      { month: 'Dec', customers: 1380 },
    ];

    const finalFinancialData = financialData.length > 0 ? financialData : fallbackFinancialData;
    const finalCustomerData = customerChartData.length > 0 ? customerChartData : fallbackCustomerData;

    // Apply time range filtering
    const filteredFinancialData = filterDataByTimeRange(finalFinancialData, timeRange);
    const filteredCustomerData = filterDataByTimeRange(finalCustomerData, timeRange);
    const filteredMetrics = calculateMetricsForTimeRange(finalFinancialData, finalCustomerData, timeRange);

    setRevenueData(filteredFinancialData);
    setCustomerData(filteredCustomerData);
    setKeyMetrics(filteredMetrics);
  }, [timeRange]); // Re-run when timeRange changes

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
            onChange={(e) => setTimeRange(e.target.value)}
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
          <h3 className="text-2xl font-bold text-gray-900">R{keyMetrics.totalRevenue.toLocaleString()}</h3>
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
          <h3 className="text-2xl font-bold text-gray-900">R{keyMetrics.avgCustomerValue.toLocaleString()}</h3>
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
              <YAxis stroke="#6b7280" />
              <Tooltip 
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
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
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