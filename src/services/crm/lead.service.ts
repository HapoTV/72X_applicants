// src/services/crm/lead.service.ts

import type {
    Lead,
    CreateLeadRequest,
    UpdateLeadRequest,
    LeadResponse,
    LeadsResponse,
    LeadStage,
} from '../../interfaces/crm/lead.interface';
import { CRMService } from './crm.service';

export class LeadService extends CRMService {
    private readonly endpoint = '/crm/leads';

    async getLeads(): Promise<LeadsResponse> {
        const response = await this.get<LeadsResponse>(this.endpoint);
        console.log('LeadService - getLeads raw response:', response);
        return response;
    }

    async getLead(id: string): Promise<LeadResponse> {
        return this.get<LeadResponse>(`${this.endpoint}/${id}`);
    }

    async createLead(data: CreateLeadRequest): Promise<LeadResponse> {
        return this.post<LeadResponse>(this.endpoint, data);
    }

    async updateLead(id: string, data: UpdateLeadRequest): Promise<LeadResponse> {
        return this.put<LeadResponse>(`${this.endpoint}/${id}`, data);
    }

    async updateLeadStage(id: string, stage: LeadStage): Promise<LeadResponse> {
        return this.patch<LeadResponse>(`${this.endpoint}/${id}/stage`, null, {
            params: { stage },
        });
    }

    async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
        return this.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
    }

    async searchLeads(query: string): Promise<LeadsResponse> {
        return this.get<LeadsResponse>(`${this.endpoint}/search`, { params: { q: query } });
    }

    async getLeadsByStage(stage: LeadStage): Promise<LeadsResponse> {
        return this.get<LeadsResponse>(`${this.endpoint}/stage/${stage}`);
    }
}

export const leadService = new LeadService();