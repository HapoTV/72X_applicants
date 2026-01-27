// src/services/PaymentService.ts
import axiosClient from '../api/axiosClient';
import type {
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  PaymentStatistics,
  RevenueAnalytics,
  CardDetails,
  PaymentMethod,
  Invoice,
} from '../interfaces/PaymentData';

class PaymentService {
  private baseURL = '/payments';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Payment Operations
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

  async getMyPayments(): Promise<PaymentResponse[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/user/me`, {
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

  // Statistics
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

  // Subscription Operations
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

  // Admin Operations
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

  async getPaymentByStripeId(stripePaymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/stripe/${stripePaymentId}`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Payment not found');
      }
      
      return this.transformPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching payment by Stripe ID:', error);
      throw error;
    }
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/methods`, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        return [];
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async addPaymentMethod(cardDetails: CardDetails): Promise<PaymentMethod> {
    try {
      const response = await axiosClient.post(`${this.baseURL}/methods`, cardDetails, {
        headers: this.getAuthHeader()
      });
      
      if (!response.data) {
        throw new Error('Failed to add payment method');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  async removePaymentMethod(methodId: string): Promise<void> {
    try {
      await axiosClient.delete(`${this.baseURL}/methods/${methodId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  }

  // Invoices
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

  // Helper Methods
  private transformPaymentResponse(data: any): PaymentResponse {
    return {
      id: data.id || '',
      userId: data.userId || '',
      userEmail: data.userEmail || '',
      userFullName: data.userFullName || '',
      stripeCustomerId: data.stripeCustomerId || '',
      stripePaymentId: data.stripePaymentId || '',
      amount: data.amount || 0,
      currency: data.currency || 'ZAR',
      description: data.description || '',
      status: data.status || 'PENDING',
      orderId: data.orderId || '',
      receiptEmail: data.receiptEmail || '',
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      failureMessage: data.failureMessage,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      clientSecret: data.clientSecret,
      subscriptionId: data.subscriptionId,
      invoiceId: data.invoiceId,
      paymentMethodId: data.paymentMethodId,
      isRecurring: data.isRecurring || false,
      recurringInterval: data.recurringInterval,
      metadata: data.metadata
    };
  }

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

  // Formatting helpers
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

  // Validation
  validateCardDetails(card: CardDetails): string[] {
    const errors: string[] = [];

    if (!card.cardNumber || card.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push('Card number must be 16 digits');
    }

    if (!card.expiryMonth || !card.expiryYear) {
      errors.push('Expiry date is required');
    } else {
      const month = parseInt(card.expiryMonth);
      const year = parseInt(card.expiryYear);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.push('Invalid expiry month');
      }

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    if (!card.cvc || card.cvc.length < 3) {
      errors.push('CVC is required (3 digits)');
    }

    if (!card.cardholderName) {
      errors.push('Cardholder name is required');
    }

    return errors;
  }

  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Limit to 1,000,000
  }
}

export const paymentService = new PaymentService();