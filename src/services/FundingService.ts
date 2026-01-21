// src/services/FundingService.ts
import axiosClient from '../api/axiosClient';
import type {  
  FundingFormData, 
  AdminFundingItem, 
  UserFundingItem, 
  FundingApiResponse, 
  FundingRequest
} from '../interfaces/FundingData';

class FundingService {
  
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getCurrentUserEmail(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.email || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return '';
  }

  // ==================== ADMIN OPERATIONS ====================

  async getAllFunding(): Promise<AdminFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding', {
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToAdminFundingItem(funding)
      );
    } catch (error) {
      console.error('Error fetching all funding opportunities:', error);
      throw new Error('Failed to fetch funding opportunities');
    }
  }

  async createFunding(fundingData: FundingFormData, createdBy: string): Promise<AdminFundingItem> {
    try {
      const fundingRequest: FundingRequest = this.transformToFundingRequest(fundingData, createdBy);
      const response = await axiosClient.post('/funding', fundingRequest, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminFundingItem(response.data);
    } catch (error) {
      console.error('Error creating funding opportunity:', error);
      throw new Error('Failed to create funding opportunity');
    }
  }

  async updateFunding(fundingId: string, fundingData: FundingFormData, createdBy: string): Promise<AdminFundingItem> {
    try {
      const fundingRequest: FundingRequest = this.transformToFundingRequest(fundingData, createdBy);
      const response = await axiosClient.put(`/funding/${fundingId}`, fundingRequest, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminFundingItem(response.data);
    } catch (error) {
      console.error('Error updating funding opportunity:', error);
      throw new Error('Failed to update funding opportunity');
    }
  }

  async deleteFunding(fundingId: string): Promise<void> {
    try {
      await axiosClient.delete(`/funding/${fundingId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting funding opportunity:', error);
      throw new Error('Failed to delete funding opportunity');
    }
  }

  // ==================== USER OPERATIONS ====================

  async getActiveFunding(): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/active', {
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error: any) {
      console.error('Error fetching active funding opportunities:', error);
      
      if (error.response?.status === 404) {
        const allFunding = await this.getAllFunding();
        const today = new Date();
        
        const activeFunding = allFunding.filter(funding => {
          if (!funding.deadline) return true;
          
          const deadline = new Date(funding.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysLeft >= 0 || daysLeft === undefined;
        });
        
        return activeFunding.map(funding => ({
          id: funding.id,
          title: funding.title,
          provider: funding.provider,
          deadline: funding.deadline,
          fundingAmount: funding.fundingAmount,
          description: funding.description,
          applicationUrl: funding.applicationUrl,
          contactInfo: funding.contactInfo,
          industry: funding.industry,
          type: funding.type,
          daysLeft: funding.deadline ? this.calculateDaysLeft(funding.deadline) : undefined,
          isExpired: funding.deadline ? this.isFundingExpired(funding.deadline) : false
        }));
      }
      
      throw new Error('Failed to fetch funding opportunities');
    }
  }

  async getFundingByIndustry(industry: string): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get(`/funding/industry/${industry}`, {
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error: any) {
      console.error('Error fetching funding by industry:', error);
      if (error.response?.status === 404) {
        const activeFunding = await this.getActiveFunding();
        return activeFunding.filter(funding => 
          !industry || industry === 'all' || funding.industry === industry
        );
      }
      throw new Error('Failed to fetch funding opportunities by industry');
    }
  }

  async getFundingByType(type: string): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get(`/funding/type/${type}`, {
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error: any) {
      console.error('Error fetching funding by type:', error);
      if (error.response?.status === 404) {
        const activeFunding = await this.getActiveFunding();
        return activeFunding.filter(funding => 
          !type || type === 'all' || funding.type === type
        );
      }
      throw new Error('Failed to fetch funding opportunities by type');
    }
  }

  async getUpcomingDeadlines(): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/upcoming-deadlines', {
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error: any) {
      console.error('Error fetching upcoming deadlines:', error);
      if (error.response?.status === 404) {
        const activeFunding = await this.getActiveFunding();
        const today = new Date();
        
        return activeFunding.filter(funding => {
          if (!funding.deadline) return false;
          
          const deadline = new Date(funding.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysLeft >= 0 && daysLeft <= 30;
        }).sort((a, b) => {
          if (!a.daysLeft || !b.daysLeft) return 0;
          return a.daysLeft - b.daysLeft;
        });
      }
      throw new Error('Failed to fetch upcoming deadlines');
    }
  }

  async searchFunding(query: string): Promise<UserFundingItem[]> {
    try {
      const response = await axiosClient.get('/funding/search', {
        params: { query },
        headers: this.getAuthHeader()
      });
      return response.data.map((funding: any) => 
        this.transformToUserFundingItem(funding)
      );
    } catch (error: any) {
      console.error('Error searching funding opportunities:', error);
      if (error.response?.status === 404) {
        const activeFunding = await this.getActiveFunding();
        const searchLower = query.toLowerCase();
        
        return activeFunding.filter(funding => 
          funding.title.toLowerCase().includes(searchLower) ||
          funding.description?.toLowerCase().includes(searchLower) ||
          funding.provider.toLowerCase().includes(searchLower)
        );
      }
      throw new Error('Failed to search funding opportunities');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  private transformToAdminFundingItem(apiFunding: any): AdminFundingItem {
    return {
      id: apiFunding.fundingId,
      title: apiFunding.title,
      provider: apiFunding.provider,
      deadline: apiFunding.deadline ? this.formatDate(apiFunding.deadline) : undefined,
      description: apiFunding.description,
      fundingAmount: apiFunding.fundingAmount,
      contactInfo: apiFunding.contactInfo,
      applicationUrl: apiFunding.applicationUrl,
      industry: apiFunding.industry,
      type: apiFunding.type,
      createdBy: apiFunding.createdBy
    };
  }

  private transformToUserFundingItem(apiFunding: any): UserFundingItem {
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
      industry: apiFunding.industry,
      type: apiFunding.type,
      daysLeft: daysLeft,
      isExpired: daysLeft !== undefined && daysLeft < 0
    };
  }

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
      industry: formData.industry || undefined,
      type: formData.type || undefined,
      createdBy: createdBy
    };
  }

  transformToFormData(funding: AdminFundingItem): FundingFormData {
    let deadline = '';
    if (funding.deadline) {
      const date = new Date(funding.deadline);
      deadline = date.toISOString().split('T')[0];
    }
    
    return {
      title: funding.title,
      provider: funding.provider,
      deadline: deadline,
      description: funding.description || '',
      eligibilityCriteria: '',
      fundingAmount: funding.fundingAmount || '',
      contactInfo: funding.contactInfo || '',
      applicationUrl: funding.applicationUrl || '',
      industry: funding.industry || '',
      type: funding.type || ''
    };
  }

  // ==================== UTILITY METHODS ====================

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  calculateDaysLeft(deadline: string): number {
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timeDiff = deadlineDate.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch (error) {
      console.error('Error calculating days left:', error);
      return 0;
    }
  }

  isFundingExpired(deadline: string): boolean {
    return this.calculateDaysLeft(deadline) < 0;
  }

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
    
    return null;
  }

  /**
   * Parse funding amount to numeric range
   */
  parseFundingAmountRange(fundingAmount: string): { min: number; max: number } | null {
    if (!fundingAmount) return null;
    
    try {
      // Remove currency symbols, commas, and spaces
      const cleaned = fundingAmount.replace(/[R$,]/g, '').replace(/\s+/g, '').trim();
      
      // Check for range pattern like "50000-100000" or "50000 - 100000"
      const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i);
      if (rangeMatch) {
        return {
          min: parseFloat(rangeMatch[1]),
          max: parseFloat(rangeMatch[2])
        };
      }
      
      // Check for single amount
      const singleMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
      if (singleMatch) {
        const amount = parseFloat(singleMatch[1]);
        return {
          min: amount,
          max: amount
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing funding amount:', error);
      return null;
    }
  }

  /**
   * Check if amount matches filter
   */
  matchesAmountFilter(fundingAmount: string, filter: string): boolean {
    if (filter === 'all' || !fundingAmount) return true;
    
    const range = this.parseFundingAmountRange(fundingAmount);
    if (!range) return true;
    
    const amount = (range.min + range.max) / 2; // Use average for comparison
    
    switch (filter) {
      case '0-10k':
        return amount <= 10000;
      case '10k-50k':
        return amount > 10000 && amount <= 50000;
      case '50k-100k':
        return amount > 50000 && amount <= 100000;
      case '100k-500k':
        return amount > 100000 && amount <= 500000;
      case '500k+':
        return amount > 500000;
      default:
        return true;
    }
  }
}

export const fundingService = new FundingService();
export default fundingService;