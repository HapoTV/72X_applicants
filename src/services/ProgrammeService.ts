// src/services/ProgrammeService.ts

import axiosClient from '../api/axiosClient';
import type { ProgrammeListItem } from '../interfaces/coc-admin/ProgrammeData';
import type { ProgrammeApplicationRequest } from '../interfaces/ApplicantData';

class ProgrammeService {
  private baseURL = '/coc/programmes';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get all programmes - PUBLIC endpoint (no auth required)
   */
  async getProgrammes(): Promise<ProgrammeListItem[]> {
    // No auth header needed for public endpoint
    const response = await axiosClient.get(`${this.baseURL}`);
    return response.data;
  }

  /**
   * Get programme by ID - PUBLIC endpoint (no auth required)
   */
  async getProgrammeById(programmeId: string): Promise<ProgrammeListItem> {
    // No auth header needed for public endpoint
    const response = await axiosClient.get(`${this.baseURL}/${programmeId}`);
    return response.data;
  }

  /**
   * Submit programme application - PUBLIC endpoint (no auth required)
   */
  async submitProgrammeApplication(
    programmeId: string,
    applicationData: ProgrammeApplicationRequest,
  ): Promise<{ id: string }> {
    // No auth header needed for public submission
    const response = await axiosClient.post(
      `${this.baseURL}/${programmeId}/applications`,
      applicationData,
    );
    return response.data;
  }

  /**
   * Upload programme application document - PUBLIC endpoint (no auth required)
   */
  async uploadProgrammeApplicationDocument(
    applicationId: string,
    label: string,
    file: File,
  ): Promise<unknown> {
    const formData = new FormData();
    formData.append('label', label);
    formData.append('file', file);

    // No auth header needed for public document upload
    const response = await axiosClient.post(
      `${this.baseURL}/applications/${applicationId}/documents`,
      formData,
    );
    return response.data;
  }
}

export const programmeService = new ProgrammeService();