// src/services/AdminMonitoringService.ts
import axiosClient from '../api/axiosClient';
import type {
  AdminDashboard,
  DashboardStats,
  SystemMetrics,
  UserSubscription,
  SystemIssue,
  SystemHealth,
  SupabaseMetrics,
  SubscriptionStats,
  IssueStats,
  UserActivityLog
} from '../interfaces/MonitoringData';

class AdminMonitoringService {
  private baseURL = '/admin';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/dashboard`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No dashboard data received');
      }
      
      return this.transformDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/dashboard/stats`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No dashboard stats received');
      }
      
      return this.transformDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/metrics`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No system metrics received');
      }
      
      return this.transformSystemMetrics(response.data);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  }

  async getSupabaseMetrics(): Promise<SupabaseMetrics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/supabase/metrics`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No Supabase metrics received');
      }
      
      return this.transformSupabaseMetrics(response.data);
    } catch (error) {
      console.error('Error fetching Supabase metrics:', error);
      throw error;
    }
  }

  async getUserSubscriptions(type?: string): Promise<UserSubscription[]> {
    try {
      const params = type ? { type } : {};
      const response = await axiosClient.get(`${this.baseURL}/subscriptions`, {
        params,
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No subscription data received');
      }
      
      return (response.data || []).map(this.transformUserSubscription);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  }

  async getSubscriptionStats(): Promise<SubscriptionStats> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/subscriptions/stats`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No subscription stats received');
      }
      
      return this.transformSubscriptionStats(response.data);
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      throw error;
    }
  }

  async getSystemIssues(): Promise<SystemIssue[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/issues`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No system issues received');
      }
      
      return (response.data || []).map(this.transformSystemIssue);
    } catch (error) {
      console.error('Error fetching system issues:', error);
      throw error;
    }
  }

  async getIssueStats(): Promise<IssueStats> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/issues/stats`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No issue stats received');
      }
      
      return this.transformIssueStats(response.data);
    } catch (error) {
      console.error('Error fetching issue stats:', error);
      throw error;
    }
  }

  async reportSystemIssue(issue: Partial<SystemIssue>): Promise<SystemIssue> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/issues`, issue, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to report system issue');
      }
      
      return this.transformSystemIssue(response.data);
    } catch (error) {
      console.error('Error reporting system issue:', error);
      throw error;
    }
  }

  async resolveSystemIssue(issueId: string, resolvedBy: string): Promise<SystemIssue> {
    try {
      const response = await axiosClient.put(`${this.baseURL}/issues/${issueId}/resolve`, null, {
        params: { resolvedBy },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to resolve issue');
      }
      
      return this.transformSystemIssue(response.data);
    } catch (error) {
      console.error('Error resolving system issue:', error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/health`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No system health data received');
      }
      
      return this.transformSystemHealth(response.data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  async getUserActivityLogs(): Promise<UserActivityLog[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/activity/logs`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No user activity logs received');
      }
      
      return (response.data || []).map(this.transformUserActivityLog);
    } catch (error) {
      console.error('Error fetching user activity logs:', error);
      throw error;
    }
  }

  async getRecentActivity(limit: number = 10): Promise<UserActivityLog[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/activity/recent`, {
        params: { limit },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No recent activity data received');
      }
      
      return (response.data || []).map(this.transformUserActivityLog);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getUserMetrics(userId?: string): Promise<any> {
    try {
      const params = userId ? { userId } : {};
      const response = await axiosClient.get(`${this.baseURL}/user/metrics`, {
        params,
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No user metrics received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(timeRange: string = '24h'): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/performance`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No performance metrics received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getAuditLogs(startDate?: string, endDate?: string): Promise<any[]> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axiosClient.get(`${this.baseURL}/audit/logs`, {
        params,
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No audit logs received');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async exportData(dataType: string, format: 'csv' | 'json' = 'json'): Promise<Blob> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/export/${dataType}`, {
        params: { format },
        responseType: 'blob',
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No data received for export');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async sendAdminAlert(message: string, type: 'info' | 'warning' | 'critical' = 'info'): Promise<void> {
    try {
      await axiosClient.post(`${this.baseURL}/alerts`, {
        message,
        type,
        timestamp: new Date().toISOString()
      }, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error sending admin alert:', error);
      throw error;
    }
  }

  // ==================== TRANSFORM METHODS ====================

  private transformDashboardData(data: any): AdminDashboard {
    return {
      stats: this.transformDashboardStats(data.stats || {}),
      systemMetrics: this.transformSystemMetrics(data.systemMetrics || {}),
      recentSubscriptions: (data.recentSubscriptions || []).map(this.transformUserSubscription),
      recentIssues: (data.recentIssues || []).map(this.transformSystemIssue),
      supabaseMetrics: this.transformSupabaseMetrics(data.supabaseMetrics || {}),
      userActivityLogs: (data.userActivityLogs || []).map(this.transformUserActivityLog)
    };
  }

  private transformDashboardStats(data: any): DashboardStats {
    return {
      totalUsers: data.totalUsers || 0,
      activeUsers: data.activeUsers || 0,
      freeTrialUsers: data.freeTrialUsers || 0,
      paidUsers: data.paidUsers || 0,
      expiredUsers: data.expiredUsers || 0,
      monthlyRevenue: data.monthlyRevenue || 0,
      totalRevenue: data.totalRevenue || 0,
      totalApiCalls: data.totalApiCalls || 0,
      failedApiCalls: data.failedApiCalls || 0,
      conversionRate: data.conversionRate || 0
    };
  }

  private transformSystemMetrics(data: any): SystemMetrics {
    return {
      id: data.id || '',
      cpuUsage: data.cpuUsage || 0,
      memoryUsage: data.memoryUsage || 0,
      diskUsage: data.diskUsage || 0,
      activeConnections: data.activeConnections || 0,
      databaseSize: data.databaseSize || '0 MB',
      storageUsed: data.storageUsed || '0 MB',
      storageRemaining: data.storageRemaining || '0 MB',
      responseTimeAvg: data.responseTimeAvg || 0,
      errorRate: data.errorRate || 0,
      status: data.status || 'HEALTHY',
      collectedAt: data.collectedAt || '',
      createdAt: data.createdAt || ''
    };
  }

  private transformSupabaseMetrics(data: any): SupabaseMetrics {
    return {
      databaseSize: data.databaseSize || '0 MB',
      storageUsed: data.storageUsed || '0 MB',
      storageRemaining: data.storageRemaining || '0 MB',
      activeConnections: data.activeConnections || 0,
      cacheHitRate: data.cacheHitRate || 0,
      lastBackup: data.lastBackup || '',
      backupStatus: data.backupStatus || 'UNKNOWN',
      supabaseTotalUsers: data.supabaseTotalUsers || 0
    };
  }

  private transformUserSubscription = (data: any): UserSubscription => ({
    id: data.id || '',
    userId: data.userId || '',
    userEmail: data.userEmail || '',
    subscriptionType: data.subscriptionType || 'FREE_TRIAL',
    isActive: data.isActive || false,
    trialEndsAt: data.trialEndsAt,
    subscriptionEndsAt: data.subscriptionEndsAt,
    planName: data.planName || '',
    monthlyPrice: data.monthlyPrice || 0,
    storageLimit: data.storageLimit || '0 MB',
    apiCallsLimit: data.apiCallsLimit || 0,
    currentApiCalls: data.currentApiCalls || 0,
    lastPaymentDate: data.lastPaymentDate,
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || ''
  });

  private transformSystemIssue = (data: any): SystemIssue => ({
    id: data.id || '',
    issueType: data.issueType || '',
    severity: data.severity || 'MEDIUM',
    errorMessage: data.errorMessage || '',
    endpoint: data.endpoint,
    userId: data.userId,
    userEmail: data.userEmail,
    stackTrace: data.stackTrace,
    isResolved: data.isResolved || false,
    resolvedBy: data.resolvedBy,
    resolvedAt: data.resolvedAt,
    createdAt: data.createdAt || ''
  });

  private transformUserActivityLog = (data: any): UserActivityLog => ({
    userId: data.userId || '',
    userEmail: data.userEmail || '',
    action: data.action || '',
    endpoint: data.endpoint || '',
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    details: data.details || '',
    timestamp: data.timestamp || data.createdAt || ''
  });

  private transformSystemHealth(data: any): SystemHealth {
    return {
      status: data.status || 'UNKNOWN',
      cpuUsage: data.cpuUsage || 0,
      memoryUsage: data.memoryUsage || 0,
      responseTime: data.responseTime || 0,
      errorRate: data.errorRate || 0,
      timestamp: data.timestamp || ''
    };
  }

  private transformSubscriptionStats(data: any): SubscriptionStats {
    return {
      totalUsers: data.totalUsers || 0,
      freeTrialUsers: data.freeTrialUsers || 0,
      paidUsers: data.paidUsers || 0,
      monthlyRevenue: data.monthlyRevenue || 0,
      conversionRate: data.conversionRate || 0
    };
  }

  private transformIssueStats(data: any): IssueStats {
    return {
      totalIssues: data.totalIssues || 0,
      criticalIssues: data.criticalIssues || 0,
      resolvedIssues: data.resolvedIssues || 0,
      unresolvedIssues: data.unresolvedIssues || 0
    };
  }

  // ==================== UTILITY METHODS ====================

  formatStorage(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCurrency(amount: number, currency: string = 'R'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', currency);
  }

  getHealthColor(status: string): string {
    switch (status) {
      case 'HEALTHY': return 'text-green-600 bg-green-100';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatTimeAgo(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return this.formatDate(dateString);
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Cache management
  clearCache(): void {
    // Clear any cached data if needed
    console.log('Cache cleared');
  }

  // Error handling utilities
  handleApiError(error: any): string {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      return 'No response from server. Please check your connection.';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  }

  // Validation utilities
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Data sanitization
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .substring(0, 5000); // Limit length
  }
}

export const adminMonitoringService = new AdminMonitoringService();