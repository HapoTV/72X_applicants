// src/pages/adminDashboard/tabs/components/AdminMonitorView.tsx
import React from 'react';
import {
  Users,
  CreditCard,
  AlertTriangle,
  Server,
  Activity,
  Shield,
  BarChart,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
} from 'lucide-react';

import { adminMonitoringService } from '../../../../services/AdminMonitoringService';
import type {
  SystemMetrics,
  SupabaseMetrics,
  UserSubscription,
  SystemIssue,
  DashboardStats,
} from '../../../../interfaces/MonitoringData';
import { calculatePercentage, getMetricStatus } from './adminMonitorHelpers';

export type AdminMonitorViewProps = {
  stats: DashboardStats | null;
  metrics: SystemMetrics | null;
  supabaseMetrics: SupabaseMetrics | null;
  issues: SystemIssue[];
  subscriptions: UserSubscription[];
};

const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <div className={`text-${color}-600`}>{icon}</div>
      </div>
      {subtitle && <span className="text-sm font-medium text-gray-600">{subtitle}</span>}
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
      <div
        className={`w-3 h-3 rounded-full ${
          status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`}
      />
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
          percentage < 70 ? 'bg-green-500' : percentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  </div>
);

const IssueItem = ({ issue }: { issue: SystemIssue }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
    <div className="flex-1">
      <div className="flex items-center mb-1">
        <span
          className={`px-2 py-1 text-xs rounded-full mr-2 ${adminMonitoringService.getSeverityColor(issue.severity)}`}
        >
          {issue.severity}
        </span>
        <span className="text-sm font-medium text-gray-900 truncate">{issue.issueType}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{issue.errorMessage}</p>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
      {!issue.isResolved && (
        <button type="button" className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
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
        <span
          className={`px-2 py-1 text-xs rounded-full mr-2 ${
            subscription.subscriptionType === 'FREE_TRIAL'
              ? 'bg-purple-100 text-purple-800'
              : subscription.subscriptionType === 'PREMIUM'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {subscription.subscriptionType}
        </span>
        <span className={`w-2 h-2 rounded-full mr-2 ${subscription.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>
      <p className="text-sm font-medium text-gray-900">{subscription.userEmail}</p>
      <p className="text-xs text-gray-500 truncate">
        {subscription.planName} • {adminMonitoringService.formatCurrency(subscription.monthlyPrice)}/month
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">{subscription.storageLimit}</p>
      <p className="text-xs text-gray-500">{new Date(subscription.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

export const AdminMonitorView: React.FC<AdminMonitorViewProps> = ({
  stats,
  metrics,
  supabaseMetrics,
  issues,
  subscriptions,
}) => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
        </div>
        <p className="text-gray-600">Monitor system health, users, and performance metrics</p>
      </div>
    </div>

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

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
          </div>
          <span className="text-sm text-gray-500">{issues.filter(i => !i.isResolved).length} unresolved</span>
        </div>

        <div className="space-y-4">
          {issues.length > 0 ? (
            issues.slice(0, 5).map(issue => <IssueItem key={issue.id} issue={issue} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p>No active issues</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Subscriptions</h2>
          </div>
          <span className="text-sm text-gray-500">{subscriptions.filter(s => s.isActive).length} active</span>
        </div>

        <div className="space-y-4">
          {subscriptions.length > 0 ? (
            subscriptions.slice(0, 5).map(subscription => (
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
