// src/interfaces/crm/sale.interface.ts

export type SaleStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Sale {
    id: string;
    userId: string;
    customerId: string;
    customerName: string;
    productId: string;
    productName: string;
    amount: number;
    paymentMethod: string;
    date: string;
    status: SaleStatus;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSaleRequest {
    customerId: string;
    customerName: string;
    productId: string;
    productName: string;
    amount: number;
    paymentMethod: string;
    date: string;
    status?: SaleStatus;
    notes?: string;
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
    id: string;
}

export interface SaleResponse {
    success: boolean;
    data: Sale;
    message?: string;
}

export interface SalesResponse {
    success: boolean;
    data: Sale[];
    count: number;
    message?: string;
}