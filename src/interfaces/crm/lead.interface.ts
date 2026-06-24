// src/interfaces/crm/lead.interface.ts

export type LeadStage = 'New' | 'Considering' | 'Active' | 'Inactive';

export interface Lead {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    stage: LeadStage;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeadRequest {
    name: string;
    email?: string;
    phone?: string;
    source?: string;
    stage?: LeadStage;
    notes?: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
    id: string;
}

export interface UpdateLeadStageRequest {
    stage: LeadStage;
}

export interface LeadResponse {
    success: boolean;
    data: Lead;
    message?: string;
}

export interface LeadsResponse {
    success: boolean;
    data: Lead[];
    count: number;
    message?: string;
}