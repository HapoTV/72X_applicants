// src/services/UserSubscriptionService.ts

import axios from 'axios';
import { UserSubscriptionType } from '../interfaces/UserSubscriptionData';
import type{ 
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

  async getCurrentUserPackage(): Promise<UserSubscriptionData | null> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user-packages/my-package`,
        { headers: this.getAuthHeaders() }
      );
      
      // If response is a string "No package selected yet"
      if (typeof response.data === 'string') {
        return null;
      }
      
      return response.data as UserSubscriptionData;
    } catch (error) {
      console.error('Error getting user package:', error);
      return null;
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
      // Note: You might need to create this endpoint in your backend
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
}

export default new UserSubscriptionService();