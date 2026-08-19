// src/services/ProgrammeService.ts

import axiosClient from '../api/axiosClient';
import type { ProgrammeListItem } from '../interfaces/coc-admin/ProgrammeData';
import type { ProgrammeApplicationRequest } from '../interfaces/ApplicantData';

class ProgrammeService {
  private baseURL = '/coc/programmes';

  /**
   * Get all programmes - PUBLIC endpoint (no auth required)
   * Increased timeout to 30 seconds for Cloud Run
   */
  async getProgrammes(): Promise<ProgrammeListItem[]> {
    try {
      console.log('📡 Fetching programmes from:', this.baseURL);
      const response = await axiosClient.get(`${this.baseURL}`, {
        timeout: 30000, // 30 second timeout for Cloud Run
      });
      console.log('✅ Programmes fetched successfully:', response.data?.length || 0, 'items');
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching programmes:', error.message);
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.warn('⏱️ Request timed out. Backend may be slow or down.');
      }
      
      // Handle network errors
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.warn('🌐 Network error. Backend may be unreachable.');
      }
      
      throw error;
    }
  }

  /**
   * Get programme by ID - PUBLIC endpoint (no auth required)
   */
  async getProgrammeById(programmeId: string): Promise<ProgrammeListItem> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/${programmeId}`, {
        timeout: 30000,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching programme:', error.message);
      throw error;
    }
  }

  /**
   * Submit programme application - PUBLIC endpoint (no auth required)
   */
  async submitProgrammeApplication(
    programmeId: string,
    applicationData: ProgrammeApplicationRequest,
  ): Promise<{ id: string }> {
    try {
      const response = await axiosClient.post(
        `${this.baseURL}/${programmeId}/applications`,
        applicationData,
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Error submitting application:', error.message);
      throw error;
    }
  }

  /**
   * Upload programme application document - PUBLIC endpoint (no auth required)
   */
  async uploadProgrammeApplicationDocument(
    applicationId: string,
    label: string,
    file: File,
  ): Promise<unknown> {
    try {
      const formData = new FormData();
      formData.append('label', label);
      formData.append('file', file);

      const response = await axiosClient.post(
        `${this.baseURL}/applications/${applicationId}/documents`,
        formData,
        {
          timeout: 60000, // 60 seconds for file upload
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Error uploading document:', error.message);
      throw error;
    }
  }
}

export const programmeService = new ProgrammeService();