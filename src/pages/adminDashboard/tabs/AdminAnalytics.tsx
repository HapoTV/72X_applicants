import React, { useState, useEffect } from 'react';
import { paymentService } from '../../../services/PaymentService';
import type { RevenueAnalytics } from '../../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Loader2, TrendingUp, DollarSign, Calendar, Users, PieChart } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range
      const endDate = new Date().toISOString();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      
      const data = await paymentService.getRevenueAnalytics(
        startDate.toISOString(),
        endDate
      );
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <Button
            onClick={fetchAnalytics}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-600 mt-2">
          Business performance and revenue insights
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {(['7days', '30days', '90days', '1year'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              size="sm"
            >
              {range === '7days' ? '7 Days' :
               range === '30days' ? '30 Days' :
               range === '90days' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={fetchAnalytics}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentService.formatCurrency(analytics.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentService.formatCurrency(analytics.totalProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className={`text-2xl font-bold ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenueGrowth >= 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.profitMargin.toFixed(1)}%
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      {analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyRevenue.slice(0, 6).map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{month.month}</span>
                    <span className="font-bold text-gray-900">
                      {paymentService.formatCurrency(month.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(month.revenue / Math.max(...analytics.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Profit: {paymentService.formatCurrency(month.profit)}</span>
                    <span>Expenses: {paymentService.formatCurrency(month.expenses)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Customers */}
      {analytics.topCustomers && analytics.topCustomers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCustomers.slice(0, 5).map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.userFullName}</p>
                    <p className="text-sm text-gray-600">{customer.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {paymentService.formatCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {customer.paymentCount} payments
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Distribution */}
      {analytics.paymentMethods && analytics.paymentMethods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{method.method}</span>
                    <span className="text-gray-600">{method.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{method.count} transactions</span>
                    <span>{paymentService.formatCurrency(method.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalytics;