import axiosClient from '../api/axiosClient';

export interface CocSubOrganisation {
  id: string;
  name: string;
  parentOrganisation: string;
  contactFullName?: string;
  contactEmail?: string;
  contactMobile?: string;
  industry?: string;
  location?: string;
  employees?: string;
  yearEstablished?: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  businessReference?: string;
  subscriptionType?: string;
}

export interface CocSubOrganisationUpsert {
  name: string;
  contactFullName: string;
  contactEmail: string;
  contactMobile: string;
  industry: string;
  location: string;
  employees: string;
  yearEstablished: number;
  businessReference: string;
  subscriptionType: string;
}

class CocOrganisationService {
  private baseUrl = '/coc-organisations';

  async listMine(): Promise<CocSubOrganisation[]> {
    const response = await axiosClient.get(this.baseUrl);
    return Array.isArray(response.data) ? response.data : [];
  }

  async createMineWithDetails(payload: CocSubOrganisationUpsert): Promise<CocSubOrganisation> {
    const response = await axiosClient.post(this.baseUrl, payload);
    return response.data;
  }

  async updateMineWithDetails(id: string, payload: CocSubOrganisationUpsert): Promise<CocSubOrganisation> {
    const response = await axiosClient.put(`${this.baseUrl}/${id}`, payload);
    return response.data;
  }

  async deleteMine(id: string): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}/${id}`);
  }

  async updateBusinessReference(id: string, newRef: string): Promise<CocSubOrganisation> {
    const response = await axiosClient.put(`${this.baseUrl}/${id}/reference`, { businessReference: newRef });
    return response.data;
  }
}

export const cocOrganisationService = new CocOrganisationService();
