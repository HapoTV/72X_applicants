// src/pages/adminDashboard/tabs/AdminMonitor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, Crown } from 'lucide-react';

import { adminMonitoringService } from '../../../services/AdminMonitoringService';
import { useAuth } from '../../../context/AuthContext';
import type {
  SystemMetrics,
  SupabaseMetrics,
  UserSubscription,
  SystemIssue,
  DashboardStats,
} from '../../../interfaces/MonitoringData';
import { AdminMonitorView } from './components/AdminMonitorView';

const AdminMonitor: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [supabaseMetrics, setSupabaseMetrics] = useState<SupabaseMetrics | null>(null);

  const [issues, setIssues] = useState<SystemIssue[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, metricsData, supabaseData, issuesData, subscriptionsData] = await Promise.all([
        adminMonitoringService.getDashboardStats(),
        adminMonitoringService.getSystemMetrics(),
        adminMonitoringService.getSupabaseMetrics(),
        adminMonitoringService.getSystemIssues(),
        adminMonitoringService.getUserSubscriptions(),
      ]);

      setStats(statsData);
      setMetrics(metricsData);
      setSupabaseMetrics(supabaseData);
      setIssues(issuesData);
      setSubscriptions(subscriptionsData);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }

    fetchAllData();

    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData, isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="bg-red-50 p-8 rounded-xl text-center max-w-md">
          <Crown className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only Super Admins can access the system monitoring dashboard.</p>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-sm text-red-700">
              If you need monitoring access, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
        <p className="text-gray-600">Loading system monitoring dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Unable to Load Dashboard</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <button
          type="button"
          onClick={fetchAllData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AdminMonitorView
      stats={stats}
      metrics={metrics}
      supabaseMetrics={supabaseMetrics}
      issues={issues}
      subscriptions={subscriptions}
    />
  );
};

export default AdminMonitor;
