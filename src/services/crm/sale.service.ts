// src/services/crm/sale.service.ts

import type {
    Sale,
    CreateSaleRequest,
    UpdateSaleRequest,
    SaleResponse,
    SalesResponse,
} from '../../interfaces/crm/sale.interface';
import { CRMService } from './crm.service';

export class SaleService extends CRMService {
    private readonly endpoint = '/crm/sales';

    async getSales(): Promise<SalesResponse> {
        const response = await this.get<SalesResponse>(this.endpoint);
        console.log('SaleService - getSales raw response:', response);
        return response;
    }

    async getSale(id: string): Promise<SaleResponse> {
        return this.get<SaleResponse>(`${this.endpoint}/${id}`);
    }

    async createSale(data: CreateSaleRequest): Promise<SaleResponse> {
        return this.post<SaleResponse>(this.endpoint, data);
    }

    async updateSale(id: string, data: UpdateSaleRequest): Promise<SaleResponse> {
        return this.put<SaleResponse>(`${this.endpoint}/${id}`, data);
    }

    async deleteSale(id: string): Promise<{ success: boolean; message: string }> {
        return this.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
    }

    async searchSales(query: string): Promise<SalesResponse> {
        return this.get<SalesResponse>(`${this.endpoint}/search`, { params: { q: query } });
    }

    async getSalesByDateRange(start: string, end: string): Promise<SalesResponse> {
        return this.get<SalesResponse>(`${this.endpoint}/date-range`, {
            params: { start, end },
        });
    }
}

export const saleService = new SaleService();