export type CrmLeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost' | string;

export type CrmSaleStatus = 'Completed' | 'Pending' | 'Cancelled' | 'Refunded' | string;

export interface CrmContact {
  id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCrmContactRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
}

export type UpdateCrmContactRequest = Partial<CreateCrmContactRequest>;

export interface CrmLead {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: CrmLeadStatus;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCrmLeadRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: CrmLeadStatus;
  value: number;
}

export type UpdateCrmLeadRequest = Partial<CreateCrmLeadRequest>;

export interface CrmSale {
  id: number | string;
  amount: number;
  date: string;
  description: string;
  status: CrmSaleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCrmSaleRequest {
  amount: number;
  date: string;
  description: string;
  status: CrmSaleStatus;
}

export type UpdateCrmSaleRequest = Partial<CreateCrmSaleRequest>;

export interface CrmActivity {
  id: number | string;
  message: string;
  timestamp: string;
  type?: 'contact' | 'lead' | 'sale' | 'system' | string;
}

export interface CrmOverviewMetrics {
  totalContacts: number;
  totalLeads: number;
  salesThisMonth: number;
  conversionRate: number;
}

export interface CrmReportsSummary {
  totalSalesAmount: number;
  completedSales: number;
  totalDeals: number;
  totalLeads: number;
  conversionRate: number;
}

export interface CrmDashboardData {
  contacts: CrmContact[];
  leads: CrmLead[];
  sales: CrmSale[];
  activities: CrmActivity[];
  metrics: CrmOverviewMetrics;
  reports: CrmReportsSummary;
}
