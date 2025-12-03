// src/services/AnalyticsService.ts
import axiosClient from '../api/axiosClient';
import type { 
  AnalyticsTimeRange,
  RevenueData,
  RevenueMetrics,
  CustomerData,
  CustomerMetrics,
  ExpenseCategory,
  ExpenseMetrics,
  KPIDashboard,
  SalesData,
  SalesMetrics,
  ProductPerformance,
  ProductMetrics,
  UserActivity,
  UserActivityMetrics,
  FinancialMetrics,
  CashFlowData,
  MarketingMetrics,
  CampaignPerformance,
  DashboardAnalytics,
  ChartData,
  PieChartData,
  LineChartData,
  AnalyticsRequest,
  AnalyticsApiResponse,
  AnalyticsReport,
  ReportRequest,
  AnalyticsAlert,
  AlertRequest,
  AnalyticsGoal,
  GoalRequest
} from '../interfaces/AnalyticsData';

/**
 * Service layer for handling all analytics-related operations
 */
class AnalyticsService {
  
  // ==================== DASHBOARD ANALYTICS ====================

  /**
   * Get comprehensive dashboard analytics
   */
  async getDashboardAnalytics(request: AnalyticsRequest): Promise<DashboardAnalytics> {
    try {
      const response = await axiosClient.post('/analytics/dashboard', request);
      return this.transformToDashboardAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw new Error('Failed to fetch dashboard analytics');
    }
  }

  /**
   * Get quick KPI metrics
   */
  async getKPIMetrics(timeRange: AnalyticsTimeRange): Promise<KPIDashboard> {
    try {
      const response = await axiosClient.get('/analytics/kpi', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      throw new Error('Failed to fetch KPI metrics');
    }
  }

  // ==================== REVENUE ANALYTICS ====================

  /**
   * Get revenue data over time
   */
  async getRevenueAnalytics(request: AnalyticsRequest): Promise<{ data: RevenueData[]; metrics: RevenueMetrics }> {
    try {
      const response = await axiosClient.post('/analytics/revenue', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw new Error('Failed to fetch revenue analytics');
    }
  }

  /**
   * Get revenue chart data
   */
  async getRevenueChartData(timeRange: AnalyticsTimeRange): Promise<ChartData> {
    try {
      const response = await axiosClient.get('/analytics/revenue/chart', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      throw new Error('Failed to fetch revenue chart data');
    }
  }

  // ==================== CUSTOMER ANALYTICS ====================

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(request: AnalyticsRequest): Promise<{ data: CustomerData[]; metrics: CustomerMetrics }> {
    try {
      const response = await axiosClient.post('/analytics/customers', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw new Error('Failed to fetch customer analytics');
    }
  }

  /**
   * Get customer growth chart data
   */
  async getCustomerGrowthChartData(timeRange: AnalyticsTimeRange): Promise<LineChartData[]> {
    try {
      const response = await axiosClient.get('/analytics/customers/growth', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer growth data:', error);
      throw new Error('Failed to fetch customer growth data');
    }
  }

  // ==================== EXPENSE ANALYTICS ====================

  /**
   * Get expense analytics
   */
  async getExpenseAnalytics(request: AnalyticsRequest): Promise<{ data: ExpenseCategory[]; metrics: ExpenseMetrics }> {
    try {
      const response = await axiosClient.post('/analytics/expenses', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense analytics:', error);
      throw new Error('Failed to fetch expense analytics');
    }
  }

  /**
   * Get expense breakdown for pie chart
   */
  async getExpenseBreakdown(timeRange: AnalyticsTimeRange): Promise<PieChartData[]> {
    try {
      const response = await axiosClient.get('/analytics/expenses/breakdown', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      throw new Error('Failed to fetch expense breakdown');
    }
  }

  // ==================== SALES ANALYTICS ====================

  /**
   * Get sales analytics
   */
  async getSalesAnalytics(request: AnalyticsRequest): Promise<{ data: SalesData[]; metrics: SalesMetrics }> {
    try {
      const response = await axiosClient.post('/analytics/sales', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw new Error('Failed to fetch sales analytics');
    }
  }

  /**
   * Get top performing products
   */
  async getTopProducts(limit: number = 10): Promise<ProductPerformance[]> {
    try {
      const response = await axiosClient.get('/analytics/products/top', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw new Error('Failed to fetch top products');
    }
  }

  /**
   * Get product performance metrics
   */
  async getProductMetrics(timeRange: AnalyticsTimeRange): Promise<ProductMetrics> {
    try {
      const response = await axiosClient.get('/analytics/products/metrics', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product metrics:', error);
      throw new Error('Failed to fetch product metrics');
    }
  }

  // ==================== USER ACTIVITY ANALYTICS ====================

  /**
   * Get user activity analytics
   */
  async getUserActivityAnalytics(request: AnalyticsRequest): Promise<{ data: UserActivity[]; metrics: UserActivityMetrics }> {
    try {
      const response = await axiosClient.post('/analytics/user-activity', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity analytics:', error);
      throw new Error('Failed to fetch user activity analytics');
    }
  }

  // ==================== FINANCIAL ANALYTICS ====================

  /**
   * Get financial metrics
   */
  async getFinancialMetrics(timeRange: AnalyticsTimeRange): Promise<FinancialMetrics> {
    try {
      const response = await axiosClient.get('/analytics/financial', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw new Error('Failed to fetch financial metrics');
    }
  }

  /**
   * Get cash flow data
   */
  async getCashFlowData(timeRange: AnalyticsTimeRange): Promise<CashFlowData[]> {
    try {
      const response = await axiosClient.get('/analytics/cash-flow', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow data:', error);
      throw new Error('Failed to fetch cash flow data');
    }
  }

  // ==================== MARKETING ANALYTICS ====================

  /**
   * Get marketing metrics
   */
  async getMarketingMetrics(timeRange: AnalyticsTimeRange): Promise<MarketingMetrics> {
    try {
      const response = await axiosClient.get('/analytics/marketing', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw new Error('Failed to fetch marketing metrics');
    }
  }

  /**
   * Get campaign performance
   */
  async getCampaignPerformance(timeRange: AnalyticsTimeRange): Promise<CampaignPerformance[]> {
    try {
      const response = await axiosClient.get('/analytics/campaigns', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      throw new Error('Failed to fetch campaign performance');
    }
  }

  // ==================== REPORTS ====================

  /**
   * Generate analytics report
   */
  async generateReport(reportRequest: ReportRequest): Promise<AnalyticsReport> {
    try {
      const response = await axiosClient.post('/analytics/reports', reportRequest);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }

  /**
   * Get all reports
   */
  async getReports(): Promise<AnalyticsReport[]> {
    try {
      const response = await axiosClient.get('/analytics/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId: string): Promise<AnalyticsReport> {
    try {
      const response = await axiosClient.get(`/analytics/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw new Error('Failed to fetch report');
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/analytics/reports/${reportId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    }
  }

  // ==================== ALERTS ====================

  /**
   * Create analytics alert
   */
  async createAlert(alertRequest: AlertRequest): Promise<AnalyticsAlert> {
    try {
      const response = await axiosClient.post('/analytics/alerts', alertRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw new Error('Failed to create alert');
    }
  }

  /**
   * Get all alerts
   */
  async getAlerts(): Promise<AnalyticsAlert[]> {
    try {
      const response = await axiosClient.get('/analytics/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  /**
   * Update alert status
   */
  async updateAlertStatus(alertId: string, isActive: boolean): Promise<void> {
    try {
      await axiosClient.patch(`/analytics/alerts/${alertId}/status`, { isActive });
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw new Error('Failed to update alert status');
    }
  }

  /**
   * Delete alert
   */
  async deleteAlert(alertId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/analytics/alerts/${alertId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw new Error('Failed to delete alert');
    }
  }

  // ==================== GOALS ====================

  /**
   * Create analytics goal
   */
  async createGoal(goalRequest: GoalRequest): Promise<AnalyticsGoal> {
    try {
      const response = await axiosClient.post('/analytics/goals', goalRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw new Error('Failed to create goal');
    }
  }

  /**
   * Get all goals
   */
  async getGoals(): Promise<AnalyticsGoal[]> {
    try {
      const response = await axiosClient.get('/analytics/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw new Error('Failed to fetch goals');
    }
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, currentValue: number): Promise<void> {
    try {
      await axiosClient.patch(`/analytics/goals/${goalId}/progress`, { currentValue });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw new Error('Failed to update goal progress');
    }
  }

  /**
   * Delete goal
   */
  async deleteGoal(goalId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/analytics/goals/${goalId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw new Error('Failed to delete goal');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to DashboardAnalytics
   */
  private transformToDashboardAnalytics(apiData: AnalyticsApiResponse): DashboardAnalytics {
    return {
      timeRange: apiData.timeRange,
      generatedAt: apiData.generatedAt,
      revenueMetrics: apiData.metrics.revenue,
      customerMetrics: apiData.metrics.customers,
      expenseMetrics: apiData.metrics.expenses,
      kpiDashboard: this.createKPIDashboard(apiData.metrics),
      salesMetrics: apiData.metrics.sales,
      productMetrics: this.createProductMetrics(apiData),
      userActivityMetrics: apiData.metrics.userActivity,
      financialMetrics: apiData.metrics.financial,
      marketingMetrics: apiData.metrics.marketing
    };
  }

  /**
   * Create KPI dashboard from metrics
   */
  private createKPIDashboard(metrics: AnalyticsApiResponse['metrics']): KPIDashboard {
    return {
      revenue: {
        id: 'revenue',
        name: 'Total Revenue',
        value: metrics.revenue.totalRevenue,
        unit: 'R',
        change: metrics.revenue.revenueGrowth,
        changeType: metrics.revenue.revenueGrowth >= 0 ? 'increase' : 'decrease',
        trend: metrics.revenue.revenueGrowth > 5 ? 'up' : metrics.revenue.revenueGrowth < -5 ? 'down' : 'stable',
        status: metrics.revenue.revenueGrowth > 10 ? 'excellent' : metrics.revenue.revenueGrowth > 0 ? 'good' : 'poor'
      },
      customers: {
        id: 'customers',
        name: 'Active Customers',
        value: metrics.customers.activeCustomers,
        unit: '',
        change: metrics.customers.customerGrowth,
        changeType: metrics.customers.customerGrowth >= 0 ? 'increase' : 'decrease',
        trend: metrics.customers.customerGrowth > 5 ? 'up' : metrics.customers.customerGrowth < -5 ? 'down' : 'stable',
        status: metrics.customers.customerGrowth > 10 ? 'excellent' : metrics.customers.customerGrowth > 0 ? 'good' : 'poor'
      },
      profit: {
        id: 'profit',
        name: 'Total Profit',
        value: metrics.revenue.totalProfit,
        unit: 'R',
        change: metrics.revenue.profitMargin,
        changeType: metrics.revenue.profitMargin >= 0 ? 'increase' : 'decrease',
        trend: metrics.revenue.profitMargin > 15 ? 'up' : metrics.revenue.profitMargin < 5 ? 'down' : 'stable',
        status: metrics.revenue.profitMargin > 20 ? 'excellent' : metrics.revenue.profitMargin > 10 ? 'good' : 'average'
      },
      growth: {
        id: 'growth',
        name: 'Growth Rate',
        value: metrics.revenue.revenueGrowth,
        unit: '%',
        change: metrics.revenue.revenueGrowth,
        changeType: metrics.revenue.revenueGrowth >= 0 ? 'increase' : 'decrease',
        trend: metrics.revenue.revenueGrowth > 10 ? 'up' : metrics.revenue.revenueGrowth < 0 ? 'down' : 'stable',
        status: metrics.revenue.revenueGrowth > 15 ? 'excellent' : metrics.revenue.revenueGrowth > 5 ? 'good' : 'average'
      },
      conversion: {
        id: 'conversion',
        name: 'Conversion Rate',
        value: metrics.sales.conversionRate,
        unit: '%',
        change: 0, // Would need historical data
        changeType: 'increase',
        trend: 'stable',
        status: metrics.sales.conversionRate > 3 ? 'excellent' : metrics.sales.conversionRate > 2 ? 'good' : 'average'
      },
      retention: {
        id: 'retention',
        name: 'Customer Retention',
        value: metrics.customers.retentionRate,
        unit: '%',
        change: 0, // Would need historical data
        changeType: 'increase',
        trend: 'stable',
        status: metrics.customers.retentionRate > 80 ? 'excellent' : metrics.customers.retentionRate > 70 ? 'good' : 'average'
      }
    };
  }

  /**
   * Create product metrics from API data
   */
  private createProductMetrics(apiData: AnalyticsApiResponse): ProductMetrics {
    // This would need actual product data from the API
    return {
      topProducts: [],
      totalProducts: 0,
      averageProductRating: 0,
      totalProductViews: 0,
      productConversionRate: apiData.metrics.sales.conversionRate
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'R'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', currency);
  }

  /**
   * Format percentage for display
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format large numbers
   */
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }

  /**
   * Get trend color based on change
   */
  getTrendColor(change: number, isPositiveGood: boolean = true): string {
    if (isPositiveGood) {
      return change >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return change >= 0 ? 'text-red-600' : 'text-green-600';
    }
  }

  /**
   * Get status color for metrics
   */
  getStatusColor(status: 'excellent' | 'good' | 'average' | 'poor'): string {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Calculate percentage change
   */
  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Validate analytics request
   */
  validateAnalyticsRequest(request: AnalyticsRequest): string | null {
    if (!request.timeRange) {
      return 'Time range is required';
    }
    
    if (request.timeRange === 'custom') {
      if (!request.startDate || !request.endDate) {
        return 'Start date and end date are required for custom time range';
      }
      
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      if (start >= end) {
        return 'Start date must be before end date';
      }
      
      const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        return 'Custom time range cannot exceed 1 year';
      }
    }
    
    return null; // No errors
  }

  /**
   * Get default analytics request
   */
  getDefaultAnalyticsRequest(timeRange: AnalyticsTimeRange = '6months'): AnalyticsRequest {
    return {
      timeRange,
      metrics: ['revenue', 'customers', 'expenses', 'sales'],
      groupBy: 'month'
    };
  }
}

// Export as singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
