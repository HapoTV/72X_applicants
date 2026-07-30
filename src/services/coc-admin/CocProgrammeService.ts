import axiosClient from '../../api/axiosClient';
import type {
  ProgrammeListItem,
  ProgrammeFormData,
  ProgrammeApplicationItem,
} from '../../interfaces/coc-admin/ProgrammeData';

class CocProgrammeService {
  private baseURL = '/coc/programmes';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getProgrammes(): Promise<ProgrammeListItem[]> {
    const response = await axiosClient.get(`${this.baseURL}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getProgrammeById(programmeId: string): Promise<ProgrammeListItem> {
    const response = await axiosClient.get(`${this.baseURL}/${programmeId}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async createProgramme(programmeData: ProgrammeFormData): Promise<ProgrammeListItem> {
    const response = await axiosClient.post(`${this.baseURL}`, programmeData, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async updateProgramme(programmeId: string, programmeData: ProgrammeFormData): Promise<ProgrammeListItem> {
    const response = await axiosClient.put(`${this.baseURL}/${programmeId}`, programmeData, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async deleteProgramme(programmeId: string): Promise<void> {
    await axiosClient.delete(`${this.baseURL}/${programmeId}`, {
      headers: this.getAuthHeader(),
    });
  }

  async getProgrammeApplications(programmeId?: string): Promise<ProgrammeApplicationItem[]> {
    const url = programmeId ? `${this.baseURL}/${programmeId}/applications` : `${this.baseURL}/applications`;
    const response = await axiosClient.get(url, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<ProgrammeApplicationItem> {
    const response = await axiosClient.patch(`${this.baseURL}/applications/${applicationId}/status`, { status }, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }
}

export const cocProgrammeService = new CocProgrammeService();
