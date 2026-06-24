// src/interfaces/crm/stats.interface.ts

export interface CRMStats {
    totalContacts: number;
    totalLeads: number;
    totalSales: number;
    totalSalesAmount: number;
    monthlySalesAmount: number;
    conversionRate: number;
}

export interface StatsResponse {
    success: boolean;
    data: CRMStats;
    message?: string;
}