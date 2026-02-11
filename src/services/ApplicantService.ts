// src/services/ApplicationService.ts
import axiosClient from '../api/axiosClient';
import type {
  Application,
  CreateApplicationRequest,
} from '../interfaces/ApplicantData';

class ApplicationService {
  /**
   * Build auth header for requests that need explicit headers
   */
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Ensure axiosClient has Authorization default header set
   */
  private ensureAuthHeader(): void {
    const token = localStorage.getItem('authToken');
    if (token && !axiosClient.defaults.headers.common['Authorization']) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Create a new application for the current user
   */
  async createApplication(
    applicationData: CreateApplicationRequest,
  ): Promise<Application> {
    try {
      const userId = this.getCurrentUserId();
      applicationData.userId = userId;

      this.ensureAuthHeader();
      const response = await axiosClient.post<Application>(
        '/applications',
        applicationData,
      );
      return response.data;
    } catch (error: any) {
      console.error('Create application error:', error);

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || error.response.data || 'Invalid application data. Please check your inputs.');
      }

      throw new Error(error.response?.data?.message || 'Failed to create application. Please try again.');
    }
  }

  async getApplicationById(applicationId: string): Promise<Application> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<Application>(
        `/applications/${applicationId}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Get application error:', error);

      if (error.response?.status === 404) {
        throw new Error('Application not found.');
      }

      throw new Error(error.response?.data?.message || 'Failed to fetch application details.');
    }
  }

  /**
   * Get current user's applications (convenience for "my applications")
   */
  async getMyApplications(): Promise<Application[]> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<Application[]>(
        '/applications/my-applications',
      );
      return response.data;
    } catch (error: any) {
      console.error('Get user applications error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user applications.',
      );
    }
  }

  /**
   * Get all applications for a specific user (admin)
   */
  async getUserApplications(userId: string): Promise<Application[]> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<Application[]>(
        `/applications/user/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Get user applications error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user applications.',
      );
    }
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<Application[]>(
        `/applications/status/${status}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Get applications by status error:', error);
      throw new Error(
        error.response?.data ||
          `Failed to fetch applications with status: ${status}`,
      );
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,

    status: string,
    reviewNotes?: string
  ): Promise<Application> {
    try {
      this.ensureAuthHeader();
      const params = new URLSearchParams();
      params.append('status', status);
      if (reviewNotes) {
        params.append('reviewNotes', reviewNotes);
      }

      const response = await axiosClient.put<Application>(
        `/applications/${applicationId}/status?${params.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Update application status error:', error);

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid status update request.');
      }

      throw new Error(error.response?.data?.message || 'Failed to update application status.');
    }
  }

  /**
   * Generate application number
   */
  async generateApplicationNumber(): Promise<string> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<string>(
        '/applications/generate-number',
      );
      return response.data;
    } catch (error: any) {
      console.error('Generate application number error:', error);
      throw new Error(
        error.response?.data || 'Failed to generate application number.',
      );
    }
  }

  /**
   * Get all applications (Admin only)
   */
  async getAllApplications(): Promise<Application[]> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get<Application[]>(
        '/applications/all',
      );
      return response.data;
    } catch (error: any) {
      console.error('Get all applications error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch all applications.',
      );
    }
  }

  async deleteApplication(applicationId: string): Promise<void> {
    try {
      this.ensureAuthHeader();
      await axiosClient.delete(`/applications/${applicationId}`);
    } catch (error: any) {
      console.error('Delete application error:', error);

      if (error.response?.status === 404) {
        throw new Error('Application not found.');
      }

      if (error.response?.status === 403) {
        throw new Error('You are not authorized to delete this application.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to delete application.');
    }
  }

  async uploadSupportingDocument(
    applicationId: string, 
    documentFile: File, 
    documentType: string
  ): Promise<Application> {
    try {
      this.ensureAuthHeader();
      const formData = new FormData();
      formData.append('file', documentFile);
      formData.append('documentType', documentType);

      const response = await axiosClient.post<Application>(
        `/applications/${applicationId}/documents`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Upload document error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid document type or file format.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to upload supporting document.');
    }
  }

  async searchApplications(
    filters: {
      applicationNumber?: string;
      userFullName?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Application[]> {
    try {
      this.ensureAuthHeader();
      const params = new URLSearchParams();
      
      if (filters.applicationNumber) params.append('applicationNumber', filters.applicationNumber);
      if (filters.userFullName) params.append('userFullName', filters.userFullName);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axiosClient.get<Application[]>(
        `/applications/search?${params.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Search applications error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search applications.');
    }
  }

  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    approved: number;
    rejected: number;
  }> {
    try {
      this.ensureAuthHeader();
      const response = await axiosClient.get('/applications/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get application stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch application statistics.');
    }
  }

  private getCurrentUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.userId || user.id || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    throw new Error('User not authenticated');
  }
}

// Export as singleton instance
export const applicationService = new ApplicationService();
export default applicationService;