// src/services/PaymentService.ts
import axiosClient from '../api/axiosClient';
import type {
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  PaymentStatistics,
  RevenueAnalytics,
  Invoice,
  PaymentFilters
} from '../interfaces/PaymentData';

class PaymentService {
  private baseURL = '/payments';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Create a new payment
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/create`, paymentRequest, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error creating payment:', error);
      throw this.handlePaymentError(error);
    }
  }

  // Get payment by ID
  async getPayment(id: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Payment not found');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Get payment by Paystack reference
  async getPaymentByReference(reference: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/reference/${reference}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Payment not found');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching payment by reference:', error);
      throw error;
    }
  }

  // Verify Paystack payment with retry logic
  async verifyPaystackPayment(reference: string, maxRetries = 10, delay = 1000): Promise<PaymentResponse> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Verification attempt ${attempt}/${maxRetries} for reference: ${reference}`);
        
        const response = await axiosClient.get(`${this.baseURL}/verify/${reference}`, {
          headers: this.getAuthHeader(),
          timeout: 5000 // 5 second timeout
        });
        
        console.log(`✅ Payment verified successfully on attempt ${attempt}`);
        return this.transformPaymentResponse(response.data);
        
      } catch (error: any) {
        lastError = error;
        
        // If it's a 400 error, check if it's "Payment not found" or other
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.failureMessage || error.response?.data?.message || '';
          
          if (errorMessage.includes('not found')) {
            console.log(`⏳ Payment not yet processed (attempt ${attempt}/${maxRetries})`);
            
            if (attempt < maxRetries) {
              // Wait with exponential backoff
              const waitTime = delay * Math.pow(1.5, attempt - 1);
              console.log(`Waiting ${waitTime}ms before next attempt...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          } else {
            // Other 400 errors - don't retry
            throw error;
          }
        } else if (error.response?.status === 404) {
          console.log(`⏳ Payment reference not found (attempt ${attempt}/${maxRetries})`);
          
          if (attempt < maxRetries) {
            const waitTime = delay * Math.pow(1.5, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        } else {
          // Network errors or other status codes
          if (attempt < maxRetries) {
            const waitTime = delay * Math.pow(1.5, attempt - 1);
            console.log(`Network error, retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
      }
    }
    
    console.error('❌ All verification attempts failed:', lastError);
    throw lastError;
  }

  // Get current user's payments
  async getMyPayments(filters?: PaymentFilters): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/user/me`, {
        params: filters,
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }

  // Get payments for a specific user (Admin only)
  async getUserPayments(userId: string): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/user/${userId}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }

  // Get all payments (Admin only)
  async getAllPayments(filters?: PaymentFilters): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/all`, {
        params: filters,
        headers: this.getAuthHeader()
      });
      
      console.log('Raw getAllPayments response:', response.data);
      
      if (!response.data) {
        return [];
      }
      
      // Handle both array and single object responses
      if (Array.isArray(response.data)) {
        return response.data.map(this.transformPaymentResponse);
      } else if (response.data.content && Array.isArray(response.data.content)) {
        // Handle paginated response
        return response.data.content.map(this.transformPaymentResponse);
      } else {
        return [this.transformPaymentResponse(response.data)];
      }
    } catch (error: any) {
      console.error('Error fetching all payments:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Get payments by status (Admin only)
  async getPaymentsByStatus(status: string): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/payments/status/${status}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching payments by status:', error);
      return [];
    }
  }

  // Get recent payments for current user
  async getMyRecentPayments(limit: number = 10): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/user/me/recent`, {
        params: { limit },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching recent payments:', error);
      return [];
    }
  }

  // Get payments by order ID
  async getOrderPayments(orderId: string): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/order/${orderId}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching order payments:', error);
      return [];
    }
  }

  // Confirm payment manually
  async confirmPayment(id: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/${id}/confirm`, {}, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to confirm payment');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Cancel a payment
  async cancelPayment(id: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/${id}/cancel`, {}, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to cancel payment');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error cancelling payment:', error);
      throw error;
    }
  }

  // Process refund (Admin only)
  async processRefund(refundRequest: RefundRequest): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/refund`, refundRequest, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to process refund');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Get current user's payment statistics
  async getMyPaymentStatistics(): Promise<PaymentStatistics> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/user/statistics`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No statistics data received');
      }
      
      return this.transformPaymentStatistics(response.data);
    } catch (error: any) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  }

  // Create subscription payment
  async createSubscriptionPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/subscription/create`, paymentRequest, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error creating subscription payment:', error);
      throw this.handlePaymentError(error);
    }
  }

  // Get current user's subscription payments
  async getMySubscriptionPayments(): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/subscription/user/me`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching subscription payments:', error);
      return [];
    }
  }

  // Get revenue analytics (Admin only)
  async getRevenueAnalytics(startDate?: string, endDate?: string): Promise<RevenueAnalytics> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosClient.get(`${this.baseURL}/admin/revenue`, {
        params,
        headers: this.getAuthHeader()
      });
      
      console.log('Raw revenue analytics response:', response.data);
      
      if (!response.data) {
        throw new Error('No revenue analytics data received');
      }
      
      return this.transformRevenueAnalytics(response.data);
    } catch (error: any) {
      console.error('Error fetching revenue analytics:', error);
      // Return default analytics instead of throwing
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        revenueGrowth: 0,
        profitMargin: 0,
        monthlyRevenue: [],
        topCustomers: [],
        paymentMethods: []
      };
    }
  }

  // Get current user's invoices
  async getMyInvoices(): Promise<Invoice[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/invoices/me`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  // Get specific invoice
  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/invoices/${invoiceId}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Invoice not found');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  // Create subscription authorization
  async createSubscriptionAuthorization(
    email: string, 
    amount: number, 
    plan: string
  ): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/subscription/authorize`, {
        email,
        amount,
        plan,
        isRecurring: true
      }, {
        headers: this.getAuthHeader()
      });
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error creating subscription authorization:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await axiosClient.post(`${this.baseURL}/subscription/cancel`, { subscriptionId }, {
        headers: this.getAuthHeader()
      });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get admin payment statistics
  async getAdminPaymentStats(): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/stats`, {
        headers: this.getAuthHeader()
      });
      
      console.log('Raw admin stats response:', response.data);
      
      if (!response.data) {
        return this.getDefaultAdminStats();
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      return this.getDefaultAdminStats();
    }
  }

  // Search payments (Admin only)
  async searchPayments(query: string): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/search`, {
        params: { q: query },
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error searching payments:', error);
      return [];
    }
  }

  // Export payments (Admin only)
  async exportPayments(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/export`, {
        params: { format },
        responseType: 'blob',
        headers: this.getAuthHeader()
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error exporting payments:', error);
      throw error;
    }
  }

  // Transform response data to PaymentResponse
  private transformPaymentResponse(data: any): PaymentResponse {
    // Handle null or undefined
    if (!data) {
      return this.getDefaultPaymentResponse();
    }

    return {
      id: data.id || data.paymentId || '',
      userId: data.userId || (data.user && data.user.userId ? data.user.userId.toString() : ''),
      userEmail: data.userEmail || (data.user ? data.user.email : '') || '',
      userFullName: data.userFullName || (data.user ? data.user.fullName : '') || '',
      paystackCustomerId: data.paystackCustomerId || '',
      paystackReference: data.paystackReference || '',
      amount: data.amount || 0,
      currency: data.currency || 'ZAR',
      description: data.description || '',
      status: data.status || 'PENDING',
      orderId: data.orderId || '',
      receiptEmail: data.receiptEmail || '',
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      phoneNumber: data.phoneNumber,
      failureMessage: data.failureMessage,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      subscriptionId: data.subscriptionId,
      authorizationCode: data.authorizationCode,
      paymentMethodId: data.paymentMethodId,
      isRecurring: data.isRecurring || false,
      recurringInterval: data.recurringInterval,
      metadata: typeof data.metadata === 'object' ? JSON.stringify(data.metadata) : data.metadata,
      // Additional Paystack fields
      channel: data.channel,
      ipAddress: data.ipAddress,
      fee: data.fee,
      amountSettled: data.amountSettled,
      verifiedAt: data.verifiedAt,
      authorizationUrl: data.authorizationUrl,
      accessCode: data.accessCode,
      organisation: data.organisation || (data.user ? data.user.organisation : '')
    };
  }

  private getDefaultPaymentResponse(): PaymentResponse {
    return {
      id: '',
      userId: '',
      userEmail: '',
      userFullName: '',
      paystackCustomerId: '',
      paystackReference: '',
      amount: 0,
      currency: 'ZAR',
      description: '',
      status: 'PENDING',
      orderId: '',
      receiptEmail: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: false
    };
  }

  // Transform statistics data
  private transformPaymentStatistics(data: any): PaymentStatistics {
    if (!data) {
      return {
        userId: '',
        totalAmountPaid: 0,
        totalSuccessfulPayments: 0,
        totalFailedPayments: 0,
        totalRefundedAmount: 0,
        averagePaymentAmount: 0
      };
    }

    return {
      userId: data.userId || '',
      totalAmountPaid: data.totalAmountPaid || 0,
      totalSuccessfulPayments: data.totalSuccessfulPayments || 0,
      totalFailedPayments: data.totalFailedPayments || 0,
      totalRefundedAmount: data.totalRefundedAmount || 0,
      averagePaymentAmount: data.averagePaymentAmount || 0,
      lastPaymentDate: data.lastPaymentDate,
      monthlySummary: data.monthlySummary || []
    };
  }

  // Transform revenue analytics data
  private transformRevenueAnalytics(data: any): RevenueAnalytics {
    if (!data) {
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        revenueGrowth: 0,
        profitMargin: 0,
        monthlyRevenue: [],
        topCustomers: [],
        paymentMethods: []
      };
    }

    return {
      totalRevenue: data.totalRevenue || 0,
      totalExpenses: data.totalExpenses || 0,
      totalProfit: data.totalProfit || 0,
      revenueGrowth: data.revenueGrowth || 0,
      profitMargin: data.profitMargin || 0,
      monthlyRevenue: data.monthlyRevenue || [],
      topCustomers: (data.topCustomers || []).map((customer: any) => ({
        userId: customer.userId,
        userEmail: customer.userEmail || customer.email || '',
        userFullName: customer.userFullName || customer.name || '',
        totalSpent: customer.totalSpent || customer.amount || 0,
        paymentCount: customer.paymentCount || customer.payments || 0,
        lastPaymentDate: customer.lastPaymentDate || ''
      })),
      paymentMethods: data.paymentMethods || []
    };
  }

  private getDefaultAdminStats() {
    return {
      totalRevenue: 0,
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      pendingPayments: 0,
      averageAmount: 0,
      topCustomers: []
    };
  }

  // Handle payment errors
  private handlePaymentError(error: any): Error {
    if (error.response) {
      const { data, status } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data?.failureMessage || data?.message || 'Payment request is invalid');
        case 402:
          return new Error(data?.failureMessage || 'Payment failed. Please check your payment details');
        case 403:
          return new Error('You do not have permission to perform this action');
        case 404:
          return new Error('Payment not found');
        case 409:
          return new Error('Payment conflict. Please try again');
        case 422:
          return new Error('Payment validation failed');
        default:
          return new Error(data?.failureMessage || `Payment error: ${status}`);
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection');
    } else {
      return new Error('Payment service error. Please try again later');
    }
  }

  // Utility methods
  formatCurrency(amount: number, currency: string = 'R'): string {
    if (amount === undefined || amount === null) return 'R0';
    
    if (currency === 'ZAR' || currency === 'R') {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SUCCEEDED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCEEDED':
        return '✓';
      case 'PROCESSING':
      case 'PENDING':
        return '⏳';
      case 'FAILED':
        return '✗';
      case 'REFUNDED':
        return '↩️';
      case 'CANCELED':
        return '🗑️';
      default:
        return '?';
    }
  }

  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000;
  }
}

export const paymentService = new PaymentService();