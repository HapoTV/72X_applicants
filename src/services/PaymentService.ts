import axiosClient from '../api/axiosClient';
import type {
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  PaymentStatistics,
  RevenueAnalytics,
  InitializePaymentRequest,
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

  // Verify Paystack payment
  async verifyPaystackPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/verify/${reference}`, {
        headers: this.getAuthHeader()
      });
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error verifying Paystack payment:', error);
      throw error;
    }
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
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) 
        ? response.data.map(this.transformPaymentResponse)
        : [];
    } catch (error: any) {
      console.error('Error fetching all payments:', error);
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      
      if (!response.data) {
        throw new Error('No revenue analytics data received');
      }
      
      return this.transformRevenueAnalytics(response.data);
    } catch (error: any) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
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
      throw error;
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
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      throw error;
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
      throw error;
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
    return {
      id: data.id || '',
      userId: data.userId || '',
      userEmail: data.userEmail || '',
      userFullName: data.userFullName || '',
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
      metadata: data.metadata,
      // Additional Paystack fields
      channel: data.channel,
      ipAddress: data.ipAddress,
      fee: data.fee,
      amountSettled: data.amountSettled,
      verifiedAt: data.verifiedAt,
      authorizationUrl: data.authorizationUrl,
      accessCode: data.accessCode
    };
  }

  // Transform statistics data
  private transformPaymentStatistics(data: any): PaymentStatistics {
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
    return {
      totalRevenue: data.totalRevenue || 0,
      totalExpenses: data.totalExpenses || 0,
      totalProfit: data.totalProfit || 0,
      revenueGrowth: data.revenueGrowth || 0,
      profitMargin: data.profitMargin || 0,
      monthlyRevenue: data.monthlyRevenue || [],
      topCustomers: data.topCustomers || [],
      paymentMethods: data.paymentMethods || []
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
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SUCCEEDED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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