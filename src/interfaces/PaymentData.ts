export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  stripeCustomerId: string;
  stripePaymentId: string;
  amount: number;
  currency: Currency;
  description: string;
  status: PaymentStatus;
  orderId: string;
  receiptEmail: string;
  billingAddress?: string;
  shippingAddress?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  clientSecret?: string;
  
  // Subscription fields
  subscriptionId?: string;
  invoiceId?: string;
  paymentMethodId?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
  metadata?: string;
}

export const Currency = {
  ZAR: 'ZAR',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY'
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
  isRecurring?: boolean;
  recurringInterval?: 'month' | 'year' | 'week';
  metadata?: string;
}

export interface PaymentResponse {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  stripeCustomerId: string;
  stripePaymentId: string;
  amount: number;
  currency: Currency;
  description: string;
  status: PaymentStatus;
  orderId: string;
  receiptEmail: string;
  billingAddress?: string;
  shippingAddress?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  clientSecret?: string;
  subscriptionId?: string;
  invoiceId?: string;
  paymentMethodId?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
  metadata?: string;
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
  userId: string;
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

export interface CardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  cardholderName: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingDetails?: {
    name: string;
    email: string;
    address?: string;
  };
  created: string;
}

export interface Invoice {
  invoiceId: string;
  customerId: string;
  subscriptionId?: string;
  amountTotal: number;
  amountPaid: number;
  amountDue: number;
  status: string;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
  periodStart?: string;
  periodEnd?: string;
  created: string;
  paid: boolean;
  attempted: boolean;
  attemptCount: number;
  nextPaymentAttempt?: string;
  metadata?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  items: SubscriptionItem[];
  latestInvoice?: string;
  metadata?: string;
}

export interface SubscriptionItem {
  id: string;
  price: {
    id: string;
    currency: string;
    unitAmount: number;
    recurring: {
      interval: string;
    };
    product: {
      id: string;
      name: string;
    };
  };
  quantity: number;
}

export interface CreateSubscriptionRequest {
  priceId: string;
  customerId: string;
  paymentMethodId?: string;
  trialPeriodDays?: number;
  metadata?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  customer?: string;
  description?: string;
}