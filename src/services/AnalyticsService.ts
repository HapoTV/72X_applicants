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
  DashboardAnalytics
} from '../interfaces/AnalyticsData';

class AnalyticsService {
  private baseURL = '/analytics';

  async getDashboardAnalytics(timeRange: AnalyticsTimeRange = '6months'): Promise<DashboardAnalytics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/dashboard`, {
        params: { timeRange }
      });
      
      const data = response.data;
      return this.transformToDashboardAnalytics(data);
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Return default structure if API fails
      return this.getDefaultDashboardAnalytics();
    }
  }

  private transformToDashboardAnalytics(apiData: any): DashboardAnalytics {
    return {
      timeRange: apiData.timeRange || '6months',
      generatedAt: apiData.generatedAt || new Date().toISOString(),
      revenueMetrics: this.transformRevenueMetrics(apiData.revenueMetrics),
      customerMetrics: this.transformCustomerMetrics(apiData.customerMetrics),
      expenseMetrics: this.transformExpenseMetrics(apiData.expenseMetrics),
      kpiDashboard: this.createKPIDashboard(apiData.kpiDashboard || {}),
      salesMetrics: this.transformSalesMetrics(apiData.salesMetrics),
      productMetrics: this.createProductMetrics(apiData),
      userActivityMetrics: this.createUserActivityMetrics(),
      financialMetrics: this.createFinancialMetrics(),
      marketingMetrics: this.createMarketingMetrics()
    };
  }

  private getDefaultDashboardAnalytics(): DashboardAnalytics {
    return {
      timeRange: '6months',
      generatedAt: new Date().toISOString(),
      revenueMetrics: {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        revenueGrowth: 0,
        profitMargin: 0,
        averageMonthlyRevenue: 0,
        averageMonthlyExpenses: 0,
        averageMonthlyProfit: 0
      },
      customerMetrics: {
        totalCustomers: 0,
        activeCustomers: 0,
        newCustomers: 0,
        customerGrowth: 0,
        churnRate: 0,
        averageCustomerValue: 0,
        customerLifetimeValue: 0,
        retentionRate: 0
      },
      expenseMetrics: {
        totalExpenses: 0,
        averageMonthlyExpenses: 0,
        expenseGrowth: 0,
        biggestExpenseCategory: 'N/A',
        expenseBreakdown: []
      },
      kpiDashboard: this.createKPIDashboard({}),
      salesMetrics: {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        salesGrowth: 0,
        salesByCategory: []
      },
      productMetrics: {
        topProducts: [],
        totalProducts: 0,
        averageProductRating: 0,
        totalProductViews: 0,
        productConversionRate: 0
      },
      userActivityMetrics: {
        totalActiveUsers: 0,
        averageDailyActiveUsers: 0,
        totalPageViews: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        userRetentionRate: 0,
        mostActiveDay: 'N/A'
      },
      financialMetrics: {
        cashFlow: 0,
        burnRate: 0,
        runway: 0,
        grossMargin: 0,
        netMargin: 0,
        ebitda: 0,
        debtToEquity: 0,
        currentRatio: 0
      },
      marketingMetrics: {
        totalMarketingSpend: 0,
        costPerAcquisition: 0,
        customerAcquisitionCost: 0,
        returnOnAdSpend: 0,
        marketingROI: 0,
        conversionRate: 0,
        clickThroughRate: 0,
        impressions: 0
      }
    };
  }

  private transformRevenueMetrics(data: any): RevenueMetrics {
    return {
      totalRevenue: data?.totalRevenue || 0,
      totalExpenses: data?.totalExpenses || 0,
      totalProfit: data?.totalProfit || 0,
      revenueGrowth: data?.revenueGrowth || 0,
      profitMargin: data?.profitMargin || 0,
      averageMonthlyRevenue: data?.averageMonthlyRevenue || 0,
      averageMonthlyExpenses: data?.averageMonthlyExpenses || 0,
      averageMonthlyProfit: data?.averageMonthlyProfit || 0
    };
  }

  private transformCustomerMetrics(data: any): CustomerMetrics {
    return {
      totalCustomers: data?.totalCustomers || 0,
      activeCustomers: data?.activeCustomers || 0,
      newCustomers: data?.newCustomers || 0,
      customerGrowth: data?.customerGrowth || 0,
      churnRate: data?.churnRate || 0,
      averageCustomerValue: data?.averageCustomerValue || 0,
      customerLifetimeValue: data?.customerLifetimeValue || 0,
      retentionRate: data?.retentionRate || 0
    };
  }

  private transformExpenseMetrics(data: any): ExpenseMetrics {
    const breakdown = data?.expenseBreakdown || [];
    return {
      totalExpenses: data?.totalExpenses || 0,
      averageMonthlyExpenses: data?.averageMonthlyExpenses || 0,
      expenseGrowth: data?.expenseGrowth || 0,
      biggestExpenseCategory: data?.biggestExpenseCategory || 'N/A',
      expenseBreakdown: breakdown.map((item: any) => ({
        name: item.name || 'Unknown',
        value: item.value || 0,
        percentage: item.percentage || 0,
        color: item.color || '#CCCCCC',
        trend: 'stable'
      }))
    };
  }

  private transformSalesMetrics(data: any): any {
    return {
      totalSales: data?.totalSales || 0,
      totalOrders: data?.totalOrders || 0,
      averageOrderValue: data?.averageOrderValue || 0,
      conversionRate: data?.conversionRate || 0,
      salesGrowth: data?.salesGrowth || 0,
      topSellingProduct: data?.topSellingProduct || 'N/A',
      salesByCategory: data?.salesByCategory || []
    };
  }

  private createKPIDashboard(data: any): KPIDashboard {
    return {
      revenue: {
        id: 'revenue',
        name: 'Total Revenue',
        value: data.revenue?.value || 0,
        unit: 'R',
        change: data.revenue?.change || 0,
        changeType: data.revenue?.change >= 0 ? 'increase' : 'decrease',
        trend: this.getTrend(data.revenue?.change),
        status: this.getStatus(data.revenue?.change)
      },
      customers: {
        id: 'customers',
        name: 'Active Customers',
        value: data.customers?.value || 0,
        unit: '',
        change: data.customers?.change || 0,
        changeType: data.customers?.change >= 0 ? 'increase' : 'decrease',
        trend: this.getTrend(data.customers?.change),
        status: this.getStatus(data.customers?.change)
      },
      profit: {
        id: 'profit',
        name: 'Total Profit',
        value: data.profit?.value || 0,
        unit: 'R',
        change: data.profit?.change || 0,
        changeType: data.profit?.change >= 0 ? 'increase' : 'decrease',
        trend: this.getTrend(data.profit?.change),
        status: this.getStatus(data.profit?.change)
      },
      growth: {
        id: 'growth',
        name: 'Growth Rate',
        value: data.growth?.value || 0,
        unit: '%',
        change: data.growth?.change || 0,
        changeType: data.growth?.change >= 0 ? 'increase' : 'decrease',
        trend: this.getTrend(data.growth?.change),
        status: this.getStatus(data.growth?.change)
      },
      conversion: {
        id: 'conversion',
        name: 'Conversion Rate',
        value: data.conversion?.value || 0,
        unit: '%',
        change: 0,
        changeType: 'increase',
        trend: 'stable',
        status: 'average'
      },
      retention: {
        id: 'retention',
        name: 'Customer Retention',
        value: data.retention?.value || 0,
        unit: '%',
        change: 0,
        changeType: 'increase',
        trend: 'stable',
        status: 'average'
      }
    };
  }

  private getTrend(change: number): 'up' | 'down' | 'stable' {
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }

  private getStatus(change: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (change > 10) return 'excellent';
    if (change > 0) return 'good';
    if (change > -5) return 'average';
    return 'poor';
  }

  private createProductMetrics(data: any): any {
    return {
      topProducts: [],
      totalProducts: 0,
      averageProductRating: 0,
      totalProductViews: 0,
      productConversionRate: 0
    };
  }

  private createUserActivityMetrics(): any {
    return {
      totalActiveUsers: 0,
      averageDailyActiveUsers: 0,
      totalPageViews: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      userRetentionRate: 0,
      mostActiveDay: 'N/A'
    };
  }

  private createFinancialMetrics(): any {
    return {
      cashFlow: 0,
      burnRate: 0,
      runway: 0,
      grossMargin: 0,
      netMargin: 0,
      ebitda: 0,
      debtToEquity: 0,
      currentRatio: 0
    };
  }

  private createMarketingMetrics(): any {
    return {
      totalMarketingSpend: 0,
      costPerAcquisition: 0,
      customerAcquisitionCost: 0,
      returnOnAdSpend: 0,
      marketingROI: 0,
      conversionRate: 0,
      clickThroughRate: 0,
      impressions: 0
    };
  }

  // ==================== CHART DATA METHODS ====================

  async getRevenueChartData(timeRange: AnalyticsTimeRange): Promise<RevenueData[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/revenue/chart`, {
        params: { timeRange }
      });
      
      const data = response.data;
      return this.transformRevenueChartData(data);
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return this.getDefaultRevenueData();
    }
  }

  private transformRevenueChartData(apiData: any): RevenueData[] {
    const labels = apiData.labels || [];
    const revenueData = apiData.datasets?.[0]?.data || [];
    const expenseData = apiData.datasets?.[1]?.data || [];
    
    return labels.map((label: string, index: number) => ({
      period: label,
      revenue: revenueData[index] || 0,
      expenses: expenseData[index] || 0,
      profit: (revenueData[index] || 0) - (expenseData[index] || 0)
    }));
  }

  private getDefaultRevenueData(): RevenueData[] {
    return [
      { period: 'Jan', revenue: 18000, expenses: 12000, profit: 6000 },
      { period: 'Feb', revenue: 22000, expenses: 14000, profit: 8000 },
      { period: 'Mar', revenue: 19000, expenses: 13000, profit: 6000 },
      { period: 'Apr', revenue: 25000, expenses: 15000, profit: 10000 },
      { period: 'May', revenue: 28000, expenses: 16000, profit: 12000 },
      { period: 'Jun', revenue: 24500, expenses: 14500, profit: 10000 }
    ];
  }

  async getExpenseBreakdown(timeRange: AnalyticsTimeRange): Promise<ExpenseCategory[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/expenses/breakdown`, {
        params: { timeRange }
      });
      
      return (response.data || []).map((item: any) => ({
        name: item.name || 'Unknown',
        value: item.value || 0,
        percentage: item.percentage || 0,
        color: item.color || '#CCCCCC',
        trend: 'stable'
      }));
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      return [
        { name: 'Marketing', value: 35, percentage: 35, color: '#0ea5e9', trend: 'stable' },
        { name: 'Operations', value: 25, percentage: 25, color: '#10b981', trend: 'stable' },
        { name: 'Staff', value: 20, percentage: 20, color: '#f59e0b', trend: 'stable' },
        { name: 'Technology', value: 12, percentage: 12, color: '#ef4444', trend: 'stable' },
        { name: 'Other', value: 8, percentage: 8, color: '#8b5cf6', trend: 'stable' },
      ];
    }
  }

  // ==================== OTHER ANALYTICS METHODS ====================

  async getSalesAnalytics(timeRange: AnalyticsTimeRange): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/sales`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return {};
    }
  }

  async getCustomerAnalytics(timeRange: AnalyticsTimeRange): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/customers`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      return {};
    }
  }

  async getAnalyticsSummary(): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return {};
    }
  }

  async getReports(): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/reports`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  }

  // ==================== UTILITY METHODS ====================

  formatCurrency(amount: number, currency: string = 'R'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', currency);
  }

  formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  getTrendColor(change: number, isPositiveGood: boolean = true): string {
    if (isPositiveGood) {
      return change >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return change >= 0 ? 'text-red-600' : 'text-green-600';
    }
  }
}

export const analyticsService = new AnalyticsService();