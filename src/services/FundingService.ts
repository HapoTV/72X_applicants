// src/services/FundingService.ts
import axiosClient from '../api/axiosClient';
import type { 
  Funding, 
  FundingFormData, 
  AdminFundingItem, 
  UserFundingItem, 
  FundingApiResponse, 
  FundingRequest 
} from '../interfaces/FundingData';

/**
 * Service layer for handling all funding-related operations
 */
class FundingService {
  
  // ==================== ADMIN OPERATIONS ====================

  /**
   * Get all funding opportunities (Admin only)
   */
  async getAllFunding(): Promise<AdminFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding');
      return response.data.map((funding: FundingApiResponse) => 
        this.transformToAdminFundingItem(funding)
      );
    } catch (error) {
      console.error('Error fetching all funding opportunities:', error);
      throw new Error('Failed to fetch funding opportunities');
    }
  }

  /**
   * Create a new funding opportunity (Admin only)
   */
  async createFunding(fundingData: FundingFormData, createdBy: string): Promise<AdminFundingItem> {
    try {
      const fundingRequest: FundingRequest = this.transformToFundingRequest(fundingData, createdBy);
      const response = await axiosClient.post('/funding', fundingRequest);
      return this.transformToAdminFundingItem(response.data);
    } catch (error) {
      console.error('Error creating funding opportunity:', error);
      throw new Error('Failed to create funding opportunity');
    }
  }

  /**
   * Update an existing funding opportunity (Admin only)
   */
  async updateFunding(fundingId: string, fundingData: FundingFormData, createdBy: string): Promise<AdminFundingItem> {
    try {
      const fundingRequest: FundingRequest = this.transformToFundingRequest(fundingData, createdBy);
      const response = await axiosClient.put(`/funding/${fundingId}`, fundingRequest);
      return this.transformToAdminFundingItem(response.data);
    } catch (error) {
      console.error('Error updating funding opportunity:', error);
      throw new Error('Failed to update funding opportunity');
    }
  }

  /**
   * Delete a funding opportunity (Admin only)
   */
  async deleteFunding(fundingId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/funding/${fundingId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting funding opportunity:', error);
      throw new Error('Failed to delete funding opportunity');
    }
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Get active funding opportunities for users
   */
  async getActiveFunding(): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/active');
      return response.data.map((funding: FundingApiResponse) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error) {
      console.error('Error fetching active funding opportunities:', error);
      throw new Error('Failed to fetch funding opportunities');
    }
  }

  /**
   * Get upcoming funding deadlines
   */
  async getUpcomingDeadlines(): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/upcoming-deadlines');
      return response.data.map((funding: FundingApiResponse) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      throw new Error('Failed to fetch upcoming deadlines');
    }
  }

  /**
   * Search funding opportunities
   */
  async searchFunding(query: string): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/search', {
        params: { query }
      });
      return response.data.map((funding: FundingApiResponse) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error) {
      console.error('Error searching funding opportunities:', error);
      throw new Error('Failed to search funding opportunities');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminFundingItem
   */
  private transformToAdminFundingItem(apiFunding: FundingApiResponse): AdminFundingItem {
    return {
      id: apiFunding.fundingId,
      title: apiFunding.title,
      provider: apiFunding.provider,
      deadline: apiFunding.deadline ? this.formatDate(apiFunding.deadline) : undefined,
      description: apiFunding.description,
      fundingAmount: apiFunding.fundingAmount,
      contactInfo: apiFunding.contactInfo,
      applicationUrl: apiFunding.applicationUrl,
      createdBy: apiFunding.createdBy
    };
  }

  /**
   * Transform API response to UserFundingItem
   */
  private transformToUserFundingItem(apiFunding: FundingApiResponse): UserFundingItem {
    const deadline = apiFunding.deadline ? new Date(apiFunding.deadline) : undefined;
    const today = new Date();
    const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    
    return {
      id: apiFunding.fundingId,
      title: apiFunding.title,
      provider: apiFunding.provider,
      deadline: deadline ? this.formatDate(apiFunding.deadline) : undefined,
      fundingAmount: apiFunding.fundingAmount,
      description: apiFunding.description,
      applicationUrl: apiFunding.applicationUrl,
      contactInfo: apiFunding.contactInfo,
      daysLeft: daysLeft,
      isExpired: daysLeft !== undefined && daysLeft < 0
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToFundingRequest(formData: FundingFormData, createdBy: string): FundingRequest {
    return {
      title: formData.title,
      provider: formData.provider,
      deadline: formData.deadline || undefined,
      description: formData.description || undefined,
      eligibilityCriteria: formData.eligibilityCriteria || undefined,
      fundingAmount: formData.fundingAmount || undefined,
      contactInfo: formData.contactInfo || undefined,
      applicationUrl: formData.applicationUrl || undefined,
      createdBy: createdBy
    };
  }

  /**
   * Transform AdminFundingItem back to form data for editing
   */
  transformToFormData(funding: AdminFundingItem): FundingFormData {
    // Parse the formatted date back to input format
    let deadline = '';
    if (funding.deadline) {
      const [month, day, year] = funding.deadline.split('/');
      deadline = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return {
      title: funding.title,
      provider: funding.provider,
      deadline: deadline,
      description: funding.description || '',
      eligibilityCriteria: '',
      fundingAmount: funding.fundingAmount || '',
      contactInfo: funding.contactInfo || '',
      applicationUrl: funding.applicationUrl || ''
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Calculate days until deadline
   */
  calculateDaysLeft(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Check if funding is expired
   */
  isFundingExpired(deadline: string): boolean {
    return this.calculateDaysLeft(deadline) < 0;
  }

  /**
   * Validate funding form data
   */
  validateFundingForm(formData: FundingFormData): string | null {
    if (!formData.title.trim()) {
      return 'Funding title is required';
    }
    if (!formData.provider.trim()) {
      return 'Provider name is required';
    }
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        return 'Deadline must be in the future';
      }
    }
    
    return null; // No errors
  }
}

// Export as singleton instance
export const fundingService = new FundingService();
export default fundingService;