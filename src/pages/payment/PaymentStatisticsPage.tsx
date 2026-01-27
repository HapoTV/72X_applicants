// src/pages/payment/PaymentStatisticsPage.tsx
import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/PaymentService';
import type { PaymentStatistics } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, TrendingUp, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';

const PaymentStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getMyPaymentStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return paymentService.formatCurrency(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
            onClick={fetchStatistics}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Statistics</h1>
        <p className="text-gray-600 mt-2">
          Overview of your payment history and performance metrics
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
          onClick={fetchStatistics}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.totalAmountPaid)}
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
                <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.totalSuccessfulPayments}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.totalFailedPayments}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.averagePaymentAmount)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Summary */}
        {statistics.monthlySummary && statistics.monthlySummary.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics.monthlySummary.slice(0, 6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{month.month}</p>
                      <p className="text-sm text-gray-600">{month.paymentCount} payments</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(month.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Avg: {formatCurrency(month.averageAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Successful Payments</span>
                  <span className="text-sm font-bold text-green-600">
                    {statistics.totalSuccessfulPayments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(statistics.totalSuccessfulPayments / 
                        (statistics.totalSuccessfulPayments + statistics.totalFailedPayments)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Failed Payments</span>
                  <span className="text-sm font-bold text-red-600">
                    {statistics.totalFailedPayments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(statistics.totalFailedPayments / 
                        (statistics.totalSuccessfulPayments + statistics.totalFailedPayments)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {statistics.totalRefundedAmount > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Refunded</span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatCurrency(statistics.totalRefundedAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(statistics.totalRefundedAmount / statistics.totalAmountPaid) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {statistics.lastPaymentDate && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Last Payment</p>
                  <p className="font-medium text-gray-900">
                    {paymentService.formatDate(statistics.lastPaymentDate)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Payment Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Payment Frequency</h4>
              <p className="text-gray-600">
                {statistics.totalSuccessfulPayments > 0 
                  ? `You make approximately ${Math.round(statistics.totalSuccessfulPayments / 12)} payments per month`
                  : 'Start making payments to see insights'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Average Transaction</h4>
              <p className="text-gray-600">
                Your average payment amount is {formatCurrency(statistics.averagePaymentAmount)}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Success Rate</h4>
              <p className="text-gray-600">
                {statistics.totalSuccessfulPayments > 0 
                  ? `${formatPercentage((statistics.totalSuccessfulPayments / 
                      (statistics.totalSuccessfulPayments + statistics.totalFailedPayments)) * 100)} of your payments are successful`
                  : 'No payment data available'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Total Value</h4>
              <p className="text-gray-600">
                You've processed {formatCurrency(statistics.totalAmountPaid)} in total payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatisticsPage;