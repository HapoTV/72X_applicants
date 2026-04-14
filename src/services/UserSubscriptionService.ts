// src/services/UserSubscriptionService.ts

import axiosClient from '../api/axiosClient';
import { UserSubscriptionType } from '../interfaces/UserSubscriptionData';
import type { 
  UserSubscriptionData, 
  PackageSelectionData, 
} from '../interfaces/UserSubscriptionData';

class UserSubscriptionService {
  async selectPackage(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axiosClient.post('/user-packages/select', { packageType });
      return response.data;
    } catch (error) {
      console.error('Error selecting package:', error);
      throw error;
    }
  }

  async getUserPackageByUserId(userId: string): Promise<UserSubscriptionData | null> {
    try {
      const response = await axiosClient.get(`/user-packages/user/${userId}`);

      if (typeof response.data === 'string') {
        return null;
      }

      return response.data as UserSubscriptionData;
    } catch (error) {
      console.error('Error getting user package:', error);
      return null;
    }
  }

  async activateFreeTrial(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axiosClient.post('/free-trial/activate', {
        new_package: packageType,
      });
      return response.data;
    } catch (error) {
      console.error('Error activating free trial:', error);
      throw error;
    }
  }

  async getCurrentUserPackage(): Promise<UserSubscriptionData | null> {
    try {
      const response = await axiosClient.get('/user-packages/my-package');
      
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
      const response = await axiosClient.get('/free-trial/status');
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
      const response = await axiosClient.post('/user-packages/confirm-payment', packageData);
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async cancelSubscription(): Promise<any> {
    try {
      const response = await axiosClient.delete('/user-packages/cancel');
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async updateSubscription(packageType: UserSubscriptionType): Promise<any> {
    try {
      const response = await axiosClient.put('/user-packages/update', { packageType });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async checkFreeTrialEligibility(): Promise<any> {
    try {
      const response = await axiosClient.get('/free-trial/check-eligibility');
      return response.data;
    } catch (error) {
      console.error('Error checking free trial eligibility:', error);
      throw error;
    }
  }
}

export default new UserSubscriptionService();