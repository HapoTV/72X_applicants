import axiosClient from '../api/axiosClient';

export interface OrganisationBranding {
  organisation: string | null;
  logoUrl: string | null;
}

class OrganisationBrandingService {
  private baseUrl = '/organisation-branding';

  async getMine(): Promise<OrganisationBranding> {
    const response = await axiosClient.get(`${this.baseUrl}/me`);
    return response.data;
  }

  async uploadMyLogo(imageFile: File): Promise<OrganisationBranding> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosClient.put(`${this.baseUrl}/me/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  }

  async removeMyLogo(): Promise<OrganisationBranding> {
    const response = await axiosClient.delete(`${this.baseUrl}/me/logo`);
    return response.data;
  }
}

export const organisationBrandingService = new OrganisationBrandingService();
