// src/services/ApplicationService.ts
import axiosClient from '../api/axiosClient';
import type { 
  Application, 
  CreateApplicationRequest
} from '../interfaces/ApplicantData';

class ApplicationService {
  /**
   * Create a new application
   */
  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    try {
      const response = await axiosClient.post<Application>('/api/applications', applicationData);
      return response.data;
    } catch (error: any) {
      console.error('Create application error:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data || 'Invalid application data. Please check your inputs.');
      }
      
      throw new Error(error.response?.data || 'Failed to create application. Please try again.');
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string): Promise<Application> {
    try {
      const response = await axiosClient.get<Application>(`/api/applications/${applicationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get application error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Application not found.');
      }
      
      throw new Error(error.response?.data || 'Failed to fetch application details.');
    }
  }

  /**
   * Get application by application number
   */
  async getApplicationByNumber(applicationNumber: string): Promise<Application> {
    try {
      const response = await axiosClient.get<Application>(`/api/applications/number/${applicationNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('Get application by number error:', error);
      
      if (error.response?.status === 404) {
        throw new Error(`Application with number ${applicationNumber} not found.`);
      }
      
      throw new Error(error.response?.data || 'Failed to fetch application by number.');
    }
  }

  /**
   * Get all applications for a user
   */
  async getUserApplications(userId: string): Promise<Application[]> {
    try {
      const response = await axiosClient.get<Application[]>(`/api/applications/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get user applications error:', error);
      throw new Error(error.response?.data || 'Failed to fetch user applications.');
    }
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      const response = await axiosClient.get<Application[]>(`/api/applications/status/${status}`);
      return response.data;
    } catch (error: any) {
      console.error('Get applications by status error:', error);
      throw new Error(error.response?.data || `Failed to fetch applications with status: ${status}`);
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
      const params = new URLSearchParams();
      params.append('status', status);
      if (reviewNotes) {
        params.append('reviewNotes', reviewNotes);
      }

      const response = await axiosClient.put<Application>(
        `/api/applications/${applicationId}/status?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Update application status error:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data || 'Invalid status update request.');
      }
      
      throw new Error(error.response?.data || 'Failed to update application status.');
    }
  }

  /**
   * Generate application number
   */
  async generateApplicationNumber(): Promise<string> {
    try {
      const response = await axiosClient.get<string>('/api/applications/generate-number');
      return response.data;
    } catch (error: any) {
      console.error('Generate application number error:', error);
      throw new Error(error.response?.data || 'Failed to generate application number.');
    }
  }

  /**
   * Get all applications (Admin only)
   */
  async getAllApplications(): Promise<Application[]> {
    try {
      const response = await axiosClient.get<Application[]>('/api/applications/all');
      return response.data;
    } catch (error: any) {
      console.error('Get all applications error:', error);
      throw new Error(error.response?.data || 'Failed to fetch all applications.');
    }
  }

  /**
   * Delete application by ID
   */
  async deleteApplication(applicationId: string, userEmail: string): Promise<void> {
    try {
      const params = new URLSearchParams();
      params.append('userEmail', userEmail);
      
      await axiosClient.delete(`/api/applications/${applicationId}?${params.toString()}`);
    } catch (error: any) {
      console.error('Delete application error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Application not found.');
      }
      
      if (error.response?.status === 403) {
        throw new Error('You are not authorized to delete this application.');
      }
      
      throw new Error(error.response?.data || 'Failed to delete application.');
    }
  }

  /**
   * Upload supporting document for application
   */
  async uploadSupportingDocument(
    applicationId: string, 
    documentFile: File, 
    documentType: string
  ): Promise<Application> {
    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('documentType', documentType);

      const response = await axiosClient.post<Application>(
        `/api/applications/${applicationId}/documents`,
        formData,
        {
          headers: {
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
      
      throw new Error(error.response?.data || 'Failed to upload supporting document.');
    }
  }

  /**
   * Search applications with filters
   */
  async searchApplications(
    filters: {
      applicationNumber?: string;
      userEmail?: string;
      userFullName?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Application[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.applicationNumber) params.append('applicationNumber', filters.applicationNumber);
      if (filters.userEmail) params.append('userEmail', filters.userEmail);
      if (filters.userFullName) params.append('userFullName', filters.userFullName);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axiosClient.get<Application[]>(
        `/api/applications/search?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Search applications error:', error);
      throw new Error(error.response?.data || 'Failed to search applications.');
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    approved: number;
    rejected: number;
  }> {
    try {
      const response = await axiosClient.get('/api/applications/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get application stats error:', error);
      throw new Error(error.response?.data || 'Failed to fetch application statistics.');
    }
  }
}

// Export as singleton instance
export const applicationService = new ApplicationService();
export default applicationService;