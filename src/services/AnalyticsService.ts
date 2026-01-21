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
  DashboardAnalytics,
  SalesMetrics
} from '../interfaces/AnalyticsData';

class AnalyticsService {
  private baseURL = '/analytics';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getDashboardAnalytics(timeRange: AnalyticsTimeRange = '6months'): Promise<DashboardAnalytics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/dashboard`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return this.transformToDashboardAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error; // Propagate error instead of returning fallback
    }
  }

  async getRevenueChartData(timeRange: AnalyticsTimeRange): Promise<RevenueData[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/revenue/chart`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No chart data received from server');
      }
      
      return this.transformRevenueChartData(response.data);
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      throw error;
    }
  }

  async getExpenseBreakdown(timeRange: AnalyticsTimeRange): Promise<ExpenseCategory[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/expenses/breakdown`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No expense breakdown received from server');
      }
      
      return (response.data || []).map((item: any) => ({
        name: item.name || 'Unknown',
        value: item.value || 0,
        percentage: item.percentage || 0,
        color: item.color || '#CCCCCC',
        trend: item.trend || 'stable'
      }));
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(timeRange: AnalyticsTimeRange): Promise<CustomerMetrics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/customers`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No customer analytics received from server');
      }
      
      return this.transformCustomerMetrics(response.data.metrics || {});
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  async getSalesAnalytics(timeRange: AnalyticsTimeRange): Promise<SalesMetrics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/sales`, {
        params: { timeRange },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No sales analytics received from server');
      }
      
      return this.transformSalesMetrics(response.data.metrics || {});
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  async getAnalyticsSummary(): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/summary`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No analytics summary received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  }

  async getReports(): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/reports`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No reports received from server');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  private transformToDashboardAnalytics(apiData: any): DashboardAnalytics {
    return {
      timeRange: apiData.timeRange || '6months',
      generatedAt: apiData.generatedAt || new Date().toISOString(),
      revenueMetrics: this.transformRevenueMetrics(apiData.revenueMetrics || {}),
      customerMetrics: this.transformCustomerMetrics(apiData.customerMetrics || {}),
      expenseMetrics: this.transformExpenseMetrics(apiData.expenseMetrics || {}),
      kpiDashboard: this.transformKPIDashboard(apiData.kpiDashboard || {}),
      salesMetrics: this.transformSalesMetrics(apiData.salesMetrics || {}),
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
      activeCustomers: data?.activeCustomers || data?.totalCustomers || 0,
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
        trend: item.trend || 'stable'
      }))
    };
  }

  private transformSalesMetrics(data: any): SalesMetrics {
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

  private transformKPIDashboard(data: any): KPIDashboard {
    return {
      revenue: {
        id: 'revenue',
        name: 'Total Revenue',
        value: data.revenue?.value || 0,
        unit: data.revenue?.unit || 'R',
        change: data.revenue?.change || 0,
        changeType: data.revenue?.changeType || (data.revenue?.change >= 0 ? 'increase' : 'decrease'),
        trend: data.revenue?.trend || this.getTrend(data.revenue?.change),
        status: data.revenue?.status || this.getStatus(data.revenue?.change)
      },
      customers: {
        id: 'customers',
        name: 'Active Customers',
        value: data.customers?.value || 0,
        unit: data.customers?.unit || '',
        change: data.customers?.change || 0,
        changeType: data.customers?.changeType || (data.customers?.change >= 0 ? 'increase' : 'decrease'),
        trend: data.customers?.trend || this.getTrend(data.customers?.change),
        status: data.customers?.status || this.getStatus(data.customers?.change)
      },
      profit: {
        id: 'profit',
        name: 'Total Profit',
        value: data.profit?.value || 0,
        unit: data.profit?.unit || 'R',
        change: data.profit?.change || 0,
        changeType: data.profit?.changeType || (data.profit?.change >= 0 ? 'increase' : 'decrease'),
        trend: data.profit?.trend || this.getTrend(data.profit?.change),
        status: data.profit?.status || this.getStatus(data.profit?.change)
      },
      growth: {
        id: 'growth',
        name: 'Growth Rate',
        value: data.growth?.value || 0,
        unit: data.growth?.unit || '%',
        change: data.growth?.change || 0,
        changeType: data.growth?.changeType || (data.growth?.change >= 0 ? 'increase' : 'decrease'),
        trend: data.growth?.trend || this.getTrend(data.growth?.change),
        status: data.growth?.status || this.getStatus(data.growth?.change)
      },
      conversion: {
        id: 'conversion',
        name: 'Conversion Rate',
        value: data.conversion?.value || 0,
        unit: data.conversion?.unit || '%',
        change: data.conversion?.change || 0,
        changeType: data.conversion?.changeType || 'increase',
        trend: data.conversion?.trend || 'stable',
        status: data.conversion?.status || 'average'
      },
      retention: {
        id: 'retention',
        name: 'Customer Retention',
        value: data.retention?.value || 0,
        unit: data.retention?.unit || '%',
        change: data.retention?.change || 0,
        changeType: data.retention?.changeType || 'increase',
        trend: data.retention?.trend || 'stable',
        status: data.retention?.status || 'average'
      }
    };
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