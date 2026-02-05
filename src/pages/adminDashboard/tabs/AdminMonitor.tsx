// src/pages/adminDashboard/tabs/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, CreditCard, AlertTriangle, Server, Activity, 
  Shield, BarChart, RefreshCw,
  Loader2, AlertCircle, CheckCircle, XCircle, Cpu, HardDrive
} from 'lucide-react';
import { adminMonitoringService } from '../../../services/AdminMonitoringService';
import type {
  AdminDashboard,
  SystemMetrics,
  SupabaseMetrics,
  UserSubscription,
  SystemIssue,
  DashboardStats
} from '../../../interfaces/MonitoringData';

const AdminMonitor: React.FC = () => {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [supabaseMetrics, setSupabaseMetrics] = useState<SupabaseMetrics | null>(null);
  const [issues, setIssues] = useState<SystemIssue[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [dashboardData, statsData, metricsData, supabaseData, issuesData, subscriptionsData] = await Promise.all([
        adminMonitoringService.getAdminDashboard(),
        adminMonitoringService.getDashboardStats(),
        adminMonitoringService.getSystemMetrics(),
        adminMonitoringService.getSupabaseMetrics(),
        adminMonitoringService.getSystemIssues(),
        adminMonitoringService.getUserSubscriptions()
      ]);

      setDashboard(dashboardData);
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
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
        <p className="text-gray-600">Loading admin dashboard...</p>
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
          onClick={fetchAllData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor system health, users, and performance</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          subtitle={`${stats?.activeUsers || 0} active`}
        />
        <StatCard
          title="Paid Subscriptions"
          value={stats?.paidUsers || 0}
          icon={<CreditCard className="w-5 h-5" />}
          color="green"
          subtitle={`${adminMonitoringService.formatCurrency(stats?.monthlyRevenue || 0)}/month`}
        />
        <StatCard
          title="Free Trials"
          value={stats?.freeTrialUsers || 0}
          icon={<Shield className="w-5 h-5" />}
          color="purple"
          subtitle={`${stats?.expiredUsers || 0} expired`}
        />
        <StatCard
          title="System Issues"
          value={issues.filter(i => !i.isResolved).length}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
          subtitle={`${issues.filter(i => i.severity === 'CRITICAL').length} critical`}
        />
      </div>

      {/* System Health & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Server className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
            </div>
            <div className={`px-3 py-1 rounded-full ${adminMonitoringService.getHealthColor(metrics?.status || 'UNKNOWN')}`}>
              {metrics?.status || 'UNKNOWN'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HealthMetric
              title="CPU Usage"
              value={`${metrics?.cpuUsage?.toFixed(1) || 0}%`}
              icon={<Cpu className="w-4 h-4" />}
              status={getMetricStatus(metrics?.cpuUsage, 75, 90)}
            />
            <HealthMetric
              title="Memory"
              value={`${metrics?.memoryUsage?.toFixed(1) || 0}%`}
              icon={<Activity className="w-4 h-4" />}
              status={getMetricStatus(metrics?.memoryUsage, 75, 90)}
            />
            <HealthMetric
              title="Response Time"
              value={`${metrics?.responseTimeAvg?.toFixed(0) || 0}ms`}
              icon={<BarChart className="w-4 h-4" />}
              status={getMetricStatus(metrics?.responseTimeAvg, 1000, 2000)}
            />
            <HealthMetric
              title="Error Rate"
              value={`${metrics?.errorRate?.toFixed(2) || 0}%`}
              icon={<XCircle className="w-4 h-4" />}
              status={getMetricStatus(metrics?.errorRate, 2, 5, true)}
            />
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <HardDrive className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Storage</h2>
          </div>
          
          <div className="space-y-4">
            <StorageMetric
              title="Database"
              used={supabaseMetrics?.databaseSize || '0 MB'}
              total="5 GB"
              percentage={calculatePercentage(supabaseMetrics?.databaseSize || '0 MB', '5 GB')}
            />
            <StorageMetric
              title="File Storage"
              used={supabaseMetrics?.storageUsed || '0 MB'}
              remaining={supabaseMetrics?.storageRemaining || '5 GB'}
              percentage={calculatePercentage(supabaseMetrics?.storageUsed || '0 MB', '5 GB')}
            />
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Active Connections</span>
                <span className="font-medium">{supabaseMetrics?.activeConnections || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Cache Hit Rate</span>
                <span className="font-medium">{supabaseMetrics?.cacheHitRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Issues & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
            </div>
            <span className="text-sm text-gray-500">
              {issues.filter(i => !i.isResolved).length} unresolved
            </span>
          </div>
          
          <div className="space-y-4">
            {issues.length > 0 ? (
              issues.slice(0, 5).map((issue) => (
                <IssueItem key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                <p>No active issues</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Subscriptions</h2>
            </div>
            <span className="text-sm text-gray-500">
              {subscriptions.filter(s => s.isActive).length} active
            </span>
          </div>
          
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.slice(0, 5).map((subscription) => (
                <SubscriptionItem key={subscription.id} subscription={subscription} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p>No subscriptions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <div className={`text-${color}-600`}>{icon}</div>
      </div>
      {subtitle && (
        <span className="text-sm font-medium text-gray-600">{subtitle}</span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const HealthMetric = ({ title, value, icon, status }: any) => (
  <div className="p-4 border border-gray-100 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <div className={`w-3 h-3 rounded-full ${
        status === 'good' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        'bg-red-500'
      }`}></div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const StorageMetric = ({ title, used, remaining, percentage }: any) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <span className="text-sm text-gray-500">
        {used} / {remaining}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${
          percentage < 70 ? 'bg-green-500' :
          percentage < 90 ? 'bg-yellow-500' :
          'bg-red-500'
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  </div>
);

const IssueItem = ({ issue }: { issue: SystemIssue }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
    <div className="flex-1">
      <div className="flex items-center mb-1">
        <span className={`px-2 py-1 text-xs rounded-full mr-2 ${adminMonitoringService.getSeverityColor(issue.severity)}`}>
          {issue.severity}
        </span>
        <span className="text-sm font-medium text-gray-900 truncate">{issue.issueType}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{issue.errorMessage}</p>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-500">
        {new Date(issue.createdAt).toLocaleDateString()}
      </span>
      {!issue.isResolved && (
        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
          Resolve
        </button>
      )}
    </div>
  </div>
);

const SubscriptionItem = ({ subscription }: { subscription: UserSubscription }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
    <div className="flex-1">
      <div className="flex items-center mb-1">
        <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
          subscription.subscriptionType === 'FREE_TRIAL' ? 'bg-purple-100 text-purple-800' :
          subscription.subscriptionType === 'PREMIUM' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {subscription.subscriptionType}
        </span>
        <span className={`w-2 h-2 rounded-full mr-2 ${
          subscription.isActive ? 'bg-green-500' : 'bg-gray-400'
        }`}></span>
      </div>
      <p className="text-sm font-medium text-gray-900">{subscription.userEmail}</p>
      <p className="text-xs text-gray-500 truncate">
        {subscription.planName} • {adminMonitoringService.formatCurrency(subscription.monthlyPrice)}/month
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">{subscription.storageLimit}</p>
      <p className="text-xs text-gray-500">
        {new Date(subscription.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

// Helper Functions
const getMetricStatus = (value: number = 0, warningThreshold: number, criticalThreshold: number, reverse: boolean = false) => {
  if (reverse) {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'good';
  } else {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'good';
  }
};

const calculatePercentage = (used: string, total: string): number => {
  const usedMB = parseStorageToMB(used);
  const totalMB = parseStorageToMB(total);
  return totalMB > 0 ? (usedMB / totalMB) * 100 : 0;
};

const parseStorageToMB = (size: string): number => {
  const match = size.match(/(\d+\.?\d*)\s*(\w+)/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  
  switch (unit) {
    case 'GB': return value * 1024;
    case 'MB': return value;
    case 'KB': return value / 1024;
    default: return 0;
  }
};

export default AdminMonitor;