// src/interfaces/PaymentData.ts
export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  paystackCustomerId: string;
  paystackReference: string;
  amount: number;
  currency: Currency;
  description: string;
  status: PaymentStatus;
  orderId: string;
  receiptEmail: string;
  billingAddress?: string;
  shippingAddress?: string;
  phoneNumber?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  
  subscriptionId?: string;
  authorizationCode?: string;
  paymentMethodId?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
  metadata?: string;
  
  // Paystack specific fields
  channel?: string;
  ipAddress?: string;
  fee?: number;
  amountSettled?: number;
  verifiedAt?: string;
  authorizationUrl?: string;
  accessCode?: string;
}

export const Currency = {
  ZAR: 'ZAR',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;

export type Currency = typeof Currency[keyof typeof Currency];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELED: 'CANCELED'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: Currency;
  description: string;
  orderId: string;
  receiptEmail: string;
  billingAddress?: string;
  shippingAddress?: string;
  phoneNumber?: string;
  isRecurring?: boolean;
  recurringInterval?: 'month' | 'year' | 'week';
  metadata?: string;
}

export interface PaymentResponse {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  paystackCustomerId: string;
  paystackReference: string;
  amount: number;
  currency: Currency;
  description: string;
  status: PaymentStatus;
  orderId: string;
  receiptEmail: string;
  billingAddress?: string;
  shippingAddress?: string;
  phoneNumber?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionId?: string;
  authorizationCode?: string;
  paymentMethodId?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
  metadata?: string;
  
  // Paystack specific fields
  channel?: string;
  ipAddress?: string;
  fee?: number;
  amountSettled?: number;
  verifiedAt?: string;
  authorizationUrl?: string;
  accessCode?: string;
}

export interface InitializePaymentRequest {
  email: string;
  amount: number;
  currency: Currency;
  reference: string;
  metadata?: {
    userId: string;
    orderId: string;
    subscriptionPlan?: string;
    billingAddress?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
}

export interface VerifyPaymentRequest {
  reference: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface PaymentStatistics {
  userId: string;
  totalAmountPaid: number;
  totalSuccessfulPayments: number;
  totalFailedPayments: number;
  totalRefundedAmount: number;
  averagePaymentAmount: number;
  lastPaymentDate?: string;
  monthlySummary?: MonthlySummary[];
}

export interface MonthlySummary {
  month: string;
  totalAmount: number;
  paymentCount: number;
  averageAmount: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  revenueGrowth: number;
  profitMargin: number;
  monthlyRevenue: MonthlyRevenue[];
  topCustomers: TopCustomer[];
  paymentMethods: PaymentMethodDistribution[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TopCustomer {
  userId?: string;
  userEmail: string;
  userFullName: string;
  totalSpent: number;
  paymentCount: number;
  lastPaymentDate: string;
}

export interface PaymentMethodDistribution {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  userId?: string;
  orderId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  isRecurring?: boolean;
  search?: string;
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averagePaymentAmount: number;
  lastUpdated: string;
}

export interface Invoice {
  invoiceId: string;
  customerId: string;
  customerEmail?: string;
  customerName?: string;
  subscriptionId?: string;
  amountTotal: number;
  amountPaid: number;
  amountDue: number;
  status: string;
  issueDate?: string;
  dueDate?: string;
  paidDate?: string;
  periodStart?: string;
  periodEnd?: string;
  created: string;
  paid: boolean;
  attempted: boolean;
  attemptCount: number;
  metadata?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: string;
  amount: number;
  currency: string;
  metadata?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageAmount: number;
  topCustomers: Array<{
    id?: string;
    name: string;
    email: string;
    amount: number;
    payments: number;
  }>;
}