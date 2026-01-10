// src/interfaces/AnalyticsData.ts

// ==================== ANALYTICS TIME RANGES ====================
export type AnalyticsTimeRange = '3months' | '6months' | '1year' | 'custom';

export const TIME_RANGE_OPTIONS: { value: AnalyticsTimeRange; label: string }[] = [
  { value: '3months', label: 'Last 3 months' },
  { value: '6months', label: 'Last 6 months' },
  { value: '1year', label: 'Last year' },
  { value: 'custom', label: 'Custom range' }
];

// ==================== REVENUE ANALYTICS =====================
export interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth?: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  revenueGrowth: number;
  profitMargin: number;
  averageMonthlyRevenue: number;
  averageMonthlyExpenses: number;
  averageMonthlyProfit: number;
}

// ==================== CUSTOMER ANALYTICS ====================
export interface CustomerData {
  period: string;
  customers: number;
  newCustomers: number;
  returningCustomers: number;
  churnRate?: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customerGrowth: number;
  churnRate: number;
  averageCustomerValue: number;
  customerLifetimeValue: number;
  retentionRate: number;
}

// ==================== EXPENSE ANALYTICS ====================
export interface ExpenseCategory {
  name: string;
  value: number;
  percentage: number;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface ExpenseMetrics {
  totalExpenses: number;
  averageMonthlyExpenses: number;
  expenseGrowth: number;
  biggestExpenseCategory: string;
  expenseBreakdown: ExpenseCategory[];
}

// ==================== PERFORMANCE METRICS ====================
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  trend: 'up' | 'down' | 'stable';
  target?: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export interface KPIDashboard {
  revenue: PerformanceMetric;
  customers: PerformanceMetric;
  profit: PerformanceMetric;
  growth: PerformanceMetric;
  conversion: PerformanceMetric;
  retention: PerformanceMetric;
}

// ==================== SALES ANALYTICS ====================
export interface SalesData {
  period: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
  topSellingProduct?: string;
  salesByCategory: Array<{ category: string; sales: number; percentage: number }>;
}

// ==================== PRODUCT ANALYTICS ====================
export interface ProductPerformance {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  rating: number;
  reviews: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProductMetrics {
  topProducts: ProductPerformance[];
  totalProducts: number;
  averageProductRating: number;
  totalProductViews: number;
  productConversionRate: number;
}

// ==================== USER ACTIVITY ANALYTICS ====================
export interface UserActivity {
  date: string;
  activeUsers: number;
  pageViews: number;
  sessions: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export interface UserActivityMetrics {
  totalActiveUsers: number;
  averageDailyActiveUsers: number;
  totalPageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  userRetentionRate: number;
  mostActiveDay: string;
}

// ==================== FINANCIAL ANALYTICS ====================
export interface FinancialMetrics {
  cashFlow: number;
  burnRate: number;
  runway: number; // months
  grossMargin: number;
  netMargin: number;
  ebitda: number;
  debtToEquity: number;
  currentRatio: number;
}

export interface CashFlowData {
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
}

// ==================== MARKETING ANALYTICS ====================
export interface MarketingMetrics {
  totalMarketingSpend: number;
  costPerAcquisition: number;
  customerAcquisitionCost: number;
  returnOnAdSpend: number;
  marketingROI: number;
  conversionRate: number;
  clickThroughRate: number;
  impressions: number;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
  status: 'active' | 'paused' | 'completed';
}

// ==================== DASHBOARD ANALYTICS ====================
export interface DashboardAnalytics {
  timeRange: AnalyticsTimeRange;
  generatedAt: string;
  revenueMetrics: RevenueMetrics;
  customerMetrics: CustomerMetrics;
  expenseMetrics: ExpenseMetrics;
  kpiDashboard: KPIDashboard;
  salesMetrics: SalesMetrics;
  productMetrics: ProductMetrics;
  userActivityMetrics: UserActivityMetrics;
  financialMetrics: FinancialMetrics;
  marketingMetrics: MarketingMetrics;
}

// ==================== CHART DATA FORMATS ====================
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }>;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface LineChartData {
  period: string;
  [key: string]: string | number;
}

// ==================== ANALYTICS REQUESTS ====================
export interface AnalyticsRequest {
  timeRange: AnalyticsTimeRange;
  startDate?: string;
  endDate?: string;
  metrics?: string[];
  filters?: AnalyticsFilters;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface AnalyticsFilters {
  productIds?: string[];
  categories?: string[];
  regions?: string[];
  customerSegments?: string[];
  campaignIds?: string[];
}

// ==================== API RESPONSES ====================
export interface AnalyticsApiResponse {
  timeRange: AnalyticsTimeRange;
  generatedAt: string;
  revenue: RevenueData[];
  customers: CustomerData[];
  expenses: ExpenseCategory[];
  sales: SalesData[];
  userActivity: UserActivity[];
  cashFlow: CashFlowData[];
  metrics: {
    revenue: RevenueMetrics;
    customers: CustomerMetrics;
    expenses: ExpenseMetrics;
    sales: SalesMetrics;
    userActivity: UserActivityMetrics;
    financial: FinancialMetrics;
    marketing: MarketingMetrics;
  };
}

// ==================== REPORTS ====================
export interface AnalyticsReport {
  reportId: string;
  name: string;
  type: 'revenue' | 'customers' | 'expenses' | 'sales' | 'performance' | 'custom';
  timeRange: AnalyticsTimeRange;
  generatedAt: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl?: string;
  status: 'generating' | 'ready' | 'failed';
  filters?: AnalyticsFilters;
}

export interface ReportRequest {
  name: string;
  type: 'revenue' | 'customers' | 'expenses' | 'sales' | 'performance' | 'custom';
  timeRange: AnalyticsTimeRange;
  format: 'pdf' | 'excel' | 'csv';
  filters?: AnalyticsFilters;
  createdBy: string;
}

// ==================== ALERTS ====================
export interface AnalyticsAlert {
  alertId: string;
  name: string;
  description: string;
  metric: string;
  condition: 'above' | 'below' | 'percentage_change';
  threshold: number;
  isActive: boolean;
  lastTriggered?: string;
  createdBy: string;
  createdAt: string;
}

export interface AlertRequest {
  name: string;
  description: string;
  metric: string;
  condition: 'above' | 'below' | 'percentage_change';
  threshold: number;
  createdBy: string;
}

// ==================== GOALS ====================
export interface AnalyticsGoal {
  goalId: string;
  name: string;
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  timeRange: AnalyticsTimeRange;
  dueDate: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'achieved';
  progress: number;
  createdBy: string;
  createdAt: string;
}

export interface GoalRequest {
  name: string;
  description: string;
  metric: string;
  targetValue: number;
  timeRange: AnalyticsTimeRange;
  dueDate: string;
  createdBy: string;
}
