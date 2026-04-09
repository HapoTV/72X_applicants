// src/services/OrganisationService.ts
import axiosClient, { publicAxios } from '../api/axiosClient';

export interface OrganisationDTO {
  organisationId: string;
  name: string;
  businessReference: string;
  subscriptionType: string;
  createdAt: string;
  userCount: number;
  adminCount: number;
}

export interface CreateOrganisationRequest {
  name: string;
  businessReference: string;
  subscriptionType: string;
  adminFullName: string;
  adminEmail: string;
}

export interface SignupOrganisationGroups {
  organisations: string[];
  cocSubOrganisations: string[];
}

class OrganisationService {

  async getSignupOrganisationGroups(): Promise<SignupOrganisationGroups> {
    try {
      const response = await publicAxios.get('/organisations/signup-names');
      return response.data || { organisations: [], cocSubOrganisations: [] };
    } catch {
      return { organisations: [], cocSubOrganisations: [] };
    }
  }

  async getAllOrganisationNames(): Promise<string[]> {
    const response = await publicAxios.get('/organisations/signup-names');
    const data = response.data || { organisations: [], cocSubOrganisations: [] };
    return [...(data.organisations || []), ...(data.cocSubOrganisations || [])];
  }

  async validateOrgReference(businessReference: string, organisation: string): Promise<{ valid: boolean; isCocSubOrg?: boolean }> {
    try {
      const response = await publicAxios.get('/organisations/validate-reference', {
        params: { businessReference, organisation }
      });
      return response.data;
    } catch {
      return { valid: false };
    }
  }

  async getAllOrganisations(): Promise<OrganisationDTO[]> {
    const response = await axiosClient.get('/organisations');
    return response.data || [];
  }

  async createOrganisation(data: CreateOrganisationRequest): Promise<OrganisationDTO> {
    const response = await axiosClient.post('/organisations', data);
    return response.data;
  }

  async deleteOrganisation(organisationId: string): Promise<void> {
    await axiosClient.delete(`/organisations/${organisationId}`);
  }

  async updateBusinessReference(organisationId: string, businessReference: string): Promise<OrganisationDTO> {
    const response = await axiosClient.put(`/organisations/${organisationId}/reference`, { businessReference });
    return response.data;
  }

  async updateSubscription(organisationId: string, subscriptionType: string): Promise<OrganisationDTO> {
    const response = await axiosClient.put(`/organisations/${organisationId}/subscription`, { subscriptionType });
    return response.data;
  }

  async getMyOrganisation(): Promise<OrganisationDTO> {
    const response = await axiosClient.get('/organisations/my-organisation');
    return response.data;
  }
}

export default new OrganisationService();
