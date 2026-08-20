import React, { useCallback, useState, useEffect } from 'react';
import { paymentService } from '../../../services/PaymentService';
import type { RevenueAnalytics } from '../../../interfaces/PaymentData';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { AdminAnalyticsView } from './components/AdminAnalyticsView';
import { startDateForAnalyticsRange, type AnalyticsTimeRange } from './components/adminAnalyticsHelpers';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30days');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date().toISOString();
      const startDate = startDateForAnalyticsRange(timeRange);

      const data = await paymentService.getRevenueAnalytics(startDate.toISOString(), endDate);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

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
          <Button onClick={fetchAnalytics} className="mt-4" variant="outline">
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
    <AdminAnalyticsView
      analytics={analytics}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      onRefresh={fetchAnalytics}
    />
  );
};

export default AdminAnalytics;
