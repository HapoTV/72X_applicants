export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected";
export type InvoiceStatus = "Draft" | "Awaiting Payment" | "Paid" | "Overdue";
export type InvoiceFilter = "All" | "Draft" | "Awaiting Payment" | "Paid" | "Overdue";
export type FinanceTab = "overview" | "quotes" | "invoices" | "expenses" | "reports";

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  client: string;
  reference: string;
  total: number;
  items?: QuoteItem[];
  status: QuoteStatus;
  createdAt: string;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  customer: string;
  invoiceNumber: string;
  reference: string;
  total: number;
  items?: QuoteItem[];
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  spentAt: string;
  spentOn: string;
  proof?: string;
}

export interface Contact {
  id: number | string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface FinanceStats {
  cashBalance: number;
  openQuotes: number;
  awaitingInvoices: number;
  overdueInvoices: number;
  monthlyExpenses: number;
  totalSales: number;
}
