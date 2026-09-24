import axiosClient from '../api/axiosClient';

export interface FinanceExpense {
  id: string;
  amount: number;
  description: string;
  spentAt?: string;
  spentOn: string;
  proof?: string;
  category?: string;
  notes?: string;
  createdTimestamp?: string;
  updatedTimestamp?: string;
}

export interface FinanceInvoice {
  id: string;
  customer: string;
  invoiceNumber: string;
  reference?: string;
  total: number;
  status: string;
  issuedAt: string;
  dueAt: string;
  notes?: string;
  items?: FinanceInvoiceItem[];
  createdTimestamp?: string;
  updatedTimestamp?: string;
}

export interface FinanceInvoiceItem {
  id?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
}

export interface FinanceQuote {
  id: string;
  client: string;
  reference?: string;
  total: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  notes?: string;
  items?: FinanceQuoteItem[];
  createdTimestamp?: string;
  updatedTimestamp?: string;
}

export interface FinanceQuoteItem {
  id?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
}

export interface FinanceStats {
  cashBalance: number;
  openQuotes: number;
  awaitingInvoices: number;
  overdueInvoices: number;
  monthlyExpenses: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  outstandingAmount: number;
  conversionRate: number;
}

class FinanceService {
  // =========================
  // Expenses
  // =========================

  async getExpenses(): Promise<FinanceExpense[]> {
    const response = await axiosClient.get('/finance/expenses');
    return response.data?.data || [];
  }

  async getExpense(id: string): Promise<FinanceExpense> {
    const response = await axiosClient.get(`/finance/expenses/${id}`);
    return response.data?.data;
  }

  async createExpense(
    data: Partial<FinanceExpense>,
  ): Promise<FinanceExpense> {
    const response = await axiosClient.post(
      '/finance/expenses',
      data,
    );
    return response.data?.data;
  }

  async updateExpense(
    id: string,
    data: Partial<FinanceExpense>,
  ): Promise<FinanceExpense> {
    const response = await axiosClient.put(
      `/finance/expenses/${id}`,
      data,
    );
    return response.data?.data;
  }

  async deleteExpense(id: string): Promise<void> {
    await axiosClient.delete(`/finance/expenses/${id}`);
  }

  // =========================
  // Invoices
  // =========================

  async getInvoices(): Promise<FinanceInvoice[]> {
    const response = await axiosClient.get('/finance/invoices');
    return response.data?.data || [];
  }

  async getInvoice(id: string): Promise<FinanceInvoice> {
    const response = await axiosClient.get(
      `/finance/invoices/${id}`,
    );
    return response.data?.data;
  }

  async createInvoice(
    data: Partial<FinanceInvoice>,
  ): Promise<FinanceInvoice> {
    const response = await axiosClient.post(
      '/finance/invoices',
      data,
    );
    return response.data?.data;
  }

  async updateInvoice(
    id: string,
    data: Partial<FinanceInvoice>,
  ): Promise<FinanceInvoice> {
    const response = await axiosClient.put(
      `/finance/invoices/${id}`,
      data,
    );
    return response.data?.data;
  }

  async updateInvoiceStatus(
    id: string,
    status: string,
  ): Promise<FinanceInvoice> {
    const response = await axiosClient.patch(
      `/finance/invoices/${id}/status?status=${encodeURIComponent(status)}`,
    );
    return response.data?.data;
  }

  async deleteInvoice(id: string): Promise<void> {
    await axiosClient.delete(`/finance/invoices/${id}`);
  }

  // =========================
  // Quotes
  // =========================

  async getQuotes(): Promise<FinanceQuote[]> {
    const response = await axiosClient.get('/finance/quotes');
    return response.data?.data || [];
  }

  async getQuote(id: string): Promise<FinanceQuote> {
    const response = await axiosClient.get(
      `/finance/quotes/${id}`,
    );
    return response.data?.data;
  }

  async createQuote(
    data: Partial<FinanceQuote>,
  ): Promise<FinanceQuote> {
    const response = await axiosClient.post(
      '/finance/quotes',
      data,
    );
    return response.data?.data;
  }

  async updateQuote(
    id: string,
    data: Partial<FinanceQuote>,
  ): Promise<FinanceQuote> {
    const response = await axiosClient.put(
      `/finance/quotes/${id}`,
      data,
    );
    return response.data?.data;
  }

  async updateQuoteStatus(
    id: string,
    status: string,
  ): Promise<FinanceQuote> {
    const response = await axiosClient.patch(
      `/finance/quotes/${id}/status?status=${encodeURIComponent(status)}`,
    );
    return response.data?.data;
  }

  async deleteQuote(id: string): Promise<void> {
    await axiosClient.delete(`/finance/quotes/${id}`);
  }

  // =========================
  // Reports / Overview
  // =========================

  async getStats(): Promise<FinanceStats> {
    const response = await axiosClient.get(
      '/finance/reports/stats',
    );
    return response.data?.data || response.data;
  }

  async getMonthlyReport(): Promise<unknown> {
    const response = await axiosClient.get(
      '/finance/reports/monthly',
    );
    return response.data?.data || response.data;
  }

  async getYearToDateReport(): Promise<unknown> {
    const response = await axiosClient.get(
      '/finance/reports/ytd',
    );
    return response.data?.data || response.data;
  }

  async getAgingReport(): Promise<unknown> {
    const response = await axiosClient.get(
      '/finance/reports/aging',
    );
    return response.data?.data || response.data;
  }

  async getExpenseCategoriesReport(): Promise<unknown> {
    const response = await axiosClient.get(
      '/finance/reports/expense-categories',
    );
    return response.data?.data || response.data;
  }

  async getQuoteConversionReport(): Promise<unknown> {
    const response = await axiosClient.get(
      '/finance/reports/quote-conversion',
    );
    return response.data?.data || response.data;
  }
}

export default new FinanceService();