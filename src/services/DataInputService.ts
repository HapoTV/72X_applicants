// src/services/DataInputService.ts
import axiosClient from '../api/axiosClient';
import type {  
  FinancialData,
  CustomerData,
  DataInputFormData,
  DataValidationRule,
  DataInputValidation,
  DataInputApiResponse,
  AdminDataInputItem,
  DataInputRequest
} from '../interfaces/DataInputData';

/**
 * Service layer for handling all data input operations
 * Currently uses localStorage for data persistence
 * Designed to easily migrate to backend API when ready
 */
class DataInputService {
  private storageKey = 'business_data';
  private useLocalStorage = true; // Set to false when backend is ready

  // ==================== LOCAL STORAGE METHODS (Current Implementation) ====================

  /**
   * Save financial data to localStorage
   */
  saveFinancialData(data: FinancialData): void {
    if (this.useLocalStorage) {
      const existingData = this.getLocalData();
      existingData.financial.push(data);
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
    } else {
      // TODO: Implement backend API call
      this.submitFinancialData(data);
    }
  }

  /**
   * Save customer data to localStorage
   */
  saveCustomerData(data: CustomerData): void {
    if (this.useLocalStorage) {
      const existingData = this.getLocalData();
      existingData.customer.push(data);
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
    } else {
      // TODO: Implement backend API call
      this.submitCustomerData(data);
    }
  }

  /**
   * Get all stored data from localStorage
   */
  private getLocalData(): { financial: FinancialData[]; customer: CustomerData[] } {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    return { financial: [], customer: [] };
  }

  /**
   * Get financial data for charts from localStorage
   */
  getFinancialChartData(): Array<{month: string, revenue: number, expenses: number, profit: number}> {
    const data = this.getLocalData();
    return data.financial.map((item) => {
      const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
      return {
        month,
        revenue: item.revenue,
        expenses: item.expenses,
        profit: item.revenue - item.expenses
      };
    }).slice(-6); // Last 6 entries
  }

  /**
   * Get customer data for charts from localStorage
   */
  getCustomerChartData(): Array<{month: string, customers: number}> {
    const data = this.getLocalData();
    return data.customer.map((item) => {
      const month = new Date().toLocaleDateString('en-US', { month: 'short' });
      return {
        month,
        customers: item.totalCustomers
      };
    }).slice(-6); // Last 6 entries
  }

  /**
   * Calculate key metrics from localStorage data
   */
  getKeyMetrics() {
    const data = this.getLocalData();
    const financialData = data.financial;
    const customerData = data.customer;

    if (financialData.length === 0 || customerData.length === 0) {
      return {
        totalRevenue: 0,
        totalCustomers: 0,
        avgCustomerValue: 0,
        revenueGrowth: 0,
        customerGrowth: 0
      };
    }

    const totalRevenue = financialData.reduce((sum, item) => sum + item.revenue, 0);
    const totalCustomers = customerData.reduce((sum, item) => sum + item.totalCustomers, 0);
    const avgCustomerValue = customerData.reduce((sum, item) => sum + item.avgCustomerValue, 0) / customerData.length;

    // Calculate growth rates
    const revenueGrowth = financialData.length >= 2 
      ? ((financialData[financialData.length - 1].revenue - financialData[0].revenue) / financialData[0].revenue) * 100
      : 0;

    const customerGrowth = customerData.length >= 2
      ? ((customerData[customerData.length - 1].totalCustomers - customerData[0].totalCustomers) / customerData[0].totalCustomers) * 100
      : 0;

    return {
      totalRevenue,
      totalCustomers,
      avgCustomerValue,
      revenueGrowth,
      customerGrowth
    };
  }

  /**
   * Clear all data from localStorage
   */
  clearData(): void {
    if (this.useLocalStorage) {
      localStorage.removeItem(this.storageKey);
    } else {
      // TODO: Implement backend API call
      console.log('Backend clear data method not implemented yet');
    }
  }

  // ==================== BACKEND API METHODS (For Future Use) ====================

  /**
   * Get all data input entries (Admin only)
   */
  async getAllDataInput(): Promise<AdminDataInputItem[]> {
    try {
      const response = await axiosClient.get('/data-input');
      return response.data.map((item: any) => 
        this.transformToAdminDataInputItem(item)
      );
    } catch (error) {
      console.error('Error fetching all data input entries:', error);
      throw new Error('Failed to fetch data input entries');
    }
  }

  /**
   * Create a new data input entry (Admin only)
   */
  async createDataInput(data: DataInputRequest, userId: string): Promise<AdminDataInputItem> {
    try {
      const response = await axiosClient.post('/data-input', { ...data, userId });
      return this.transformToAdminDataInputItem(response.data);
    } catch (error) {
      console.error('Error creating data input entry:', error);
      throw new Error('Failed to create data input entry');
    }
  }

  /**
   * Submit financial data to backend
   */
  async submitFinancialData(data: FinancialData): Promise<DataInputApiResponse> {
    try {
      const response = await axiosClient.post('/data-input/financial', data);
      return {
        success: true,
        message: 'Financial data submitted successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting financial data:', error);
      return {
        success: false,
        message: 'Failed to submit financial data',
        errors: ['Network error occurred']
      };
    }
  }

  /**
   * Submit customer data to backend
   */
  async submitCustomerData(data: CustomerData): Promise<DataInputApiResponse> {
    try {
      const response = await axiosClient.post('/data-input/customer', data);
      return {
        success: true,
        message: 'Customer data submitted successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting customer data:', error);
      return {
        success: false,
        message: 'Failed to submit customer data',
        errors: ['Network error occurred']
      };
    }
  }

  /**
   * Upload a file to backend
   */
  async uploadFile(file: File, userId: string): Promise<DataInputApiResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await axiosClient.post('/data-input/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        message: 'File uploaded successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        message: 'Failed to upload file',
        errors: ['Network error occurred']
      };
    }
  }

  // ==================== VALIDATION METHODS ====================

  /**
   * Validate financial data
   */
  validateFinancialData(data: Partial<FinancialData>): DataInputValidation {
    const errors: Array<{ field: string; message: string }> = [];
    
    const rules: DataValidationRule[] = [
      { field: 'revenue', required: true, type: 'number', min: 0, errorMessage: 'Revenue must be a positive number' },
      { field: 'expenses', required: true, type: 'number', min: 0, errorMessage: 'Expenses must be a positive number' },
      { field: 'period', required: true, type: 'string', errorMessage: 'Period is required' },
      { field: 'date', required: true, type: 'date', errorMessage: 'Date is required' }
    ];

    rules.forEach(rule => {
      const value = data[rule.field as keyof FinancialData];
      
      if (rule.required && (!value || value === '')) {
        errors.push({ field: rule.field, message: rule.errorMessage });
        return;
      }

      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({ field: rule.field, message: rule.errorMessage });
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push({ field: rule.field, message: `${rule.field} cannot exceed ${rule.max}` });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate customer data
   */
  validateCustomerData(data: Partial<CustomerData>): DataInputValidation {
    const errors: Array<{ field: string; message: string }> = [];
    
    const rules: DataValidationRule[] = [
      { field: 'totalCustomers', required: true, type: 'number', min: 0, errorMessage: 'Total customers must be a positive number' },
      { field: 'newCustomers', required: true, type: 'number', min: 0, errorMessage: 'New customers must be a positive number' },
      { field: 'retentionRate', required: true, type: 'number', min: 0, max: 100, errorMessage: 'Retention rate must be between 0 and 100' },
      { field: 'avgCustomerValue', required: true, type: 'number', min: 0, errorMessage: 'Average customer value must be a positive number' }
    ];

    rules.forEach(rule => {
      const value = data[rule.field as keyof CustomerData];
      
      if (rule.required && (!value || value === '')) {
        errors.push({ field: rule.field, message: rule.errorMessage });
        return;
      }

      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({ field: rule.field, message: rule.errorMessage });
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push({ field: rule.field, message: `${rule.field} cannot exceed ${rule.max}` });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Transform form data to FinancialData
   */
  transformToFinancialData(formData: DataInputFormData, userId: string): FinancialData {
    return {
      revenue: parseFloat(formData.revenue) || 0,
      expenses: parseFloat(formData.expenses) || 0,
      period: formData.period as 'monthly' | 'quarterly' | 'yearly',
      date: formData.date,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Transform form data to CustomerData
   */
  transformToCustomerData(formData: DataInputFormData, userId: string): CustomerData {
    return {
      totalCustomers: parseFloat(formData.customers) || 0,
      newCustomers: parseFloat(formData.newCustomers) || 0,
      retentionRate: parseFloat(formData.retentionRate) || 0,
      avgCustomerValue: parseFloat(formData.avgCustomerValue) || 0,
      period: formData.period as 'monthly' | 'quarterly' | 'yearly',
      date: formData.date,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Format currency for display (South African Rand)
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format percentage for display
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Transform API response to AdminDataInputItem
   */
  private transformToAdminDataInputItem(apiData: any): AdminDataInputItem {
    return {
      id: apiData.id || '',
      type: apiData.type || 'financial',
      userId: apiData.userId || '',
      userEmail: apiData.userEmail || '',
      data: apiData.data || {},
      status: apiData.status || 'pending',
      reviewedBy: apiData.reviewedBy,
      reviewedAt: apiData.reviewedAt,
      createdAt: apiData.createdAt || new Date().toISOString(),
      updatedAt: apiData.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Switch between localStorage and backend mode
   */
  setUseLocalStorage(useLocal: boolean): void {
    this.useLocalStorage = useLocal;
    console.log(`DataInputService now using: ${useLocal ? 'localStorage' : 'backend API'}`);
  }
}

export const dataInputService = new DataInputService();
