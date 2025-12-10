// src/services/DataInputService.ts
import axiosClient from '../api/axiosClient';
import type {  
  FinancialData,
  CustomerData,
  DataInputFormData,
  DataValidationRule,
  DataInputValidation,
  DataInputApiResponse
} from '../interfaces/DataInputData';

class DataInputService {
  private baseURL = '/data-input';

  // ==================== FINANCIAL DATA METHODS ====================

  async saveFinancialData(data: FinancialData): Promise<DataInputApiResponse> {
    try {
      // Format date for backend
      const periodDate = data.date ? new Date(data.date).toISOString().replace('Z', '') : new Date().toISOString().replace('Z', '');
      
      const requestData = {
        revenue: data.revenue,
        expenses: data.expenses,
        period: data.period,
        periodDate: periodDate,
        userId: data.userId
      };

      const response = await axiosClient.post(`${this.baseURL}/financial`, requestData);
      
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error saving financial data:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save financial data',
        errors: [error.response?.data?.message || 'Network error occurred']
      };
    }
  }

  async getFinancialData(userId: string): Promise<FinancialData[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/financial/${userId}`);
      
      return (response.data.data || []).map((item: any) => ({
        revenue: item.revenue || 0,
        expenses: item.expenses || 0,
        period: item.period || 'monthly',
        date: item.periodDate || new Date().toISOString(),
        userId: item.userId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching financial data:', error);
      return [];
    }
  }

  // ==================== CUSTOMER DATA METHODS ====================

  async saveCustomerData(data: CustomerData): Promise<DataInputApiResponse> {
    try {
      // Format date for backend
      const periodDate = data.date ? new Date(data.date).toISOString().replace('Z', '') : new Date().toISOString().replace('Z', '');
      
      const requestData = {
        totalCustomers: data.totalCustomers,
        newCustomers: data.newCustomers,
        retentionRate: data.retentionRate,
        avgCustomerValue: data.avgCustomerValue,
        period: data.period,
        periodDate: periodDate,
        userId: data.userId
      };

      const response = await axiosClient.post(`${this.baseURL}/customer`, requestData);
      
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error saving customer data:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save customer data',
        errors: [error.response?.data?.message || 'Network error occurred']
      };
    }
  }

  async getCustomerData(userId: string): Promise<CustomerData[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/customer/${userId}`);
      
      return (response.data.data || []).map((item: any) => ({
        totalCustomers: item.totalCustomers || 0,
        newCustomers: item.newCustomers || 0,
        retentionRate: item.retentionRate || 0,
        avgCustomerValue: item.avgCustomerValue || 0,
        period: item.period || 'monthly',
        date: item.periodDate || new Date().toISOString(),
        userId: item.userId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }
  }

  // ==================== ANALYTICS & METRICS METHODS ====================

  async getMetrics(userId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/metrics/${userId}`);
      return response.data.metrics || {};
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return {};
    }
  }

  async getChartData(userId: string, type: 'financial' | 'customer'): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/charts/${userId}`, {
        params: { type }
      });
      return response.data.charts || {};
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return {};
    }
  }

  async getFinancialChartData(userId: string): Promise<any[]> {
    try {
      const data = await this.getChartData(userId, 'financial');
      return data.revenueOverTime || [];
    } catch (error) {
      console.error('Error fetching financial chart data:', error);
      return [];
    }
  }

  async getCustomerChartData(userId: string): Promise<any[]> {
    try {
      const data = await this.getChartData(userId, 'customer');
      return data.customerGrowth || [];
    } catch (error) {
      console.error('Error fetching customer chart data:', error);
      return [];
    }
  }

  // ==================== VALIDATION METHODS ====================

  async validateFinancialData(data: Partial<FinancialData>): Promise<DataInputValidation> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/validate/financial`, {
        revenue: data.revenue?.toString(),
        expenses: data.expenses?.toString(),
        period: data.period
      });
      
      const validation = response.data.validation;
      
      return {
        isValid: validation.isValid || false,
        errors: (validation.errors || []).map((error: string) => ({
          field: 'general',
          message: error
        }))
      };
    } catch (error) {
      console.error('Error validating financial data:', error);
      return {
        isValid: false,
        errors: [{ field: 'general', message: 'Validation service unavailable' }]
      };
    }
  }

  async validateCustomerData(data: Partial<CustomerData>): Promise<DataInputValidation> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/validate/customer`, {
        totalCustomers: data.totalCustomers?.toString(),
        newCustomers: data.newCustomers?.toString(),
        retentionRate: data.retentionRate?.toString(),
        avgCustomerValue: data.avgCustomerValue?.toString()
      });
      
      const validation = response.data.validation;
      
      return {
        isValid: validation.isValid || false,
        errors: (validation.errors || []).map((error: string) => ({
          field: 'general',
          message: error
        }))
      };
    } catch (error) {
      console.error('Error validating customer data:', error);
      return {
        isValid: false,
        errors: [{ field: 'general', message: 'Validation service unavailable' }]
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  transformToFinancialData(formData: DataInputFormData, userId: string): FinancialData {
    return {
      revenue: parseFloat(formData.revenue) || 0,
      expenses: parseFloat(formData.expenses) || 0,
      period: formData.period as 'monthly' | 'quarterly' | 'yearly',
      date: formData.date || new Date().toISOString(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  transformToCustomerData(formData: DataInputFormData, userId: string): CustomerData {
    return {
      totalCustomers: parseInt(formData.customers) || 0,
      newCustomers: parseInt(formData.newCustomers) || 0,
      retentionRate: parseFloat(formData.retentionRate) || 0,
      avgCustomerValue: parseFloat(formData.avgCustomerValue) || 0,
      period: formData.period as 'monthly' | 'quarterly' | 'yearly',
      date: formData.date || new Date().toISOString(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getCurrentUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user.userId || 'demo-user';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return 'demo-user';
  }
}

export const dataInputService = new DataInputService();