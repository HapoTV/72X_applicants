import axiosClient from '../api/axiosClient';
import type { ProgrammeListItem } from '../interfaces/coc-admin/ProgrammeData';
import type { ProgrammeApplicationRequest } from '../interfaces/ApplicantData';

class ProgrammeService {
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

  async submitProgrammeApplication(
    programmeId: string,
    applicationData: ProgrammeApplicationRequest,
  ): Promise<unknown> {
    const response = await axiosClient.post(
      `${this.baseURL}/${programmeId}/applications`,
      applicationData,
      {
        headers: this.getAuthHeader(),
      },
    );
    return response.data;
  }
}

export const programmeService = new ProgrammeService();
