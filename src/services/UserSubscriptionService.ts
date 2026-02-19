// src/services/UserSubscriptionService.ts

import axios from 'axios';
import { UserSubscriptionType } from '../interfaces/UserSubscriptionData';
import type { 
  UserSubscriptionData, 
  PackageSelectionData, 
} from '../interfaces/UserSubscriptionData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class UserSubscriptionService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async selectPackage(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user-packages/select`,
        { packageType },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error selecting package:', error);
      throw error;
    }
  }

  async activateFreeTrial(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/free-trial/activate`,
        { 
          new_package: packageType 
        },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error activating free trial:', error);
      throw error;
    }
  }

  async getCurrentUserPackage(): Promise<UserSubscriptionData | null> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user-packages/my-package`,
        { headers: this.getAuthHeaders() }
      );
      
      if (typeof response.data === 'string') {
        return null;
      }
      
      return response.data as UserSubscriptionData;
    } catch (error) {
      console.error('Error getting user package:', error);
      return null;
    }
  }

  async getFreeTrialStatus(): Promise<any> {
    try {
      // CORRECTED: Remove userId from path - use the correct endpoint that matches your backend
      const response = await axios.get(
        `${API_BASE_URL}/free-trial/status`,
        { headers: this.getAuthHeaders() }
      );
      console.log('Free trial status response:', response.data); // Add logging to debug
      return response.data;
    } catch (error) {
      console.error('Error getting free trial status:', error);
      // Return default response if API fails
      return {
        success: false,
        message: "Could not fetch free trial status"
      };
    }
  }

  async confirmPayment(packageData: PackageSelectionData): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user-packages/confirm-payment`,
        packageData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async cancelSubscription(): Promise<any> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user-packages/cancel`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async updateSubscription(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user-packages/update`,
        { packageType },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  private getCurrentUserId(): string | null {
    // Try multiple sources for user ID
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      // Try to extract from JWT token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.userId || payload.sub || null;
        } catch (e) {
          console.warn('Could not extract userId from token:', e);
        }
      }
    }
    
    return userId;
  }

  async checkFreeTrialEligibility(): Promise<any> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/free-trial/check-eligibility`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking free trial eligibility:', error);
      throw error;
    }
  }
}

export default new UserSubscriptionService();