// src/interfaces/MonitoringData.ts

// ==================== SYSTEM METRICS ====================
export interface SystemMetrics {
  id: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  databaseSize: string;
  storageUsed: string;
  storageRemaining: string;
  responseTimeAvg: number;
  errorRate: number;
  status: SystemHealthStatus;
  collectedAt: string;
  createdAt: string;
}

export type SystemHealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

// ==================== USER SUBSCRIPTION ====================
export interface UserSubscription {
  id: string;
  userId: string;
  userEmail: string;
  subscriptionType: UserSubscriptionType;
  isActive: boolean;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  planName: string;
  monthlyPrice: number;
  storageLimit: string;
  apiCallsLimit: number;
  currentApiCalls: number;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserSubscriptionType = 'FREE_TRIAL' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | 'EXPIRED';

// ==================== SYSTEM ISSUES ====================
export interface SystemIssue {
  id: string;
  issueType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  errorMessage: string;
  endpoint?: string;
  userId?: string;
  userEmail?: string;
  stackTrace?: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  freeTrialUsers: number;
  paidUsers: number;
  expiredUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalApiCalls: number;
  failedApiCalls: number;
  conversionRate: number;
}

// ==================== ADMIN DASHBOARD ====================
export interface AdminDashboard {
  stats: DashboardStats;
  systemMetrics: SystemMetrics;
  recentSubscriptions: UserSubscription[];
  recentIssues: SystemIssue[];
  supabaseMetrics: SupabaseMetrics;
  userActivityLogs: UserActivityLog[];
}

// ==================== SUPABASE METRICS ====================
export interface SupabaseMetrics {
  databaseSize: string;
  storageUsed: string;
  storageRemaining: string;
  activeConnections: number;
  cacheHitRate: number;
  lastBackup: string;
  backupStatus: string;
  supabaseTotalUsers: number;
  [key: string]: any; // For additional metrics
}

// ==================== USER ACTIVITY ====================
export interface UserActivityLog {
  userId: string;
  userEmail: string;
  action: string;
  endpoint: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
  timestamp: string;
}

// ==================== SYSTEM HEALTH ====================
export interface SystemHealth {
  status: SystemHealthStatus;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  timestamp: string;
}

// ==================== SUBSCRIPTION STATS ====================
export interface SubscriptionStats {
  totalUsers: number;
  freeTrialUsers: number;
  paidUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
}

// ==================== ISSUE STATS ====================
export interface IssueStats {
  totalIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  unresolvedIssues: number;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  success: boolean;
  message?: string;
}