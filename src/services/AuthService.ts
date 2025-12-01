// src/services/AuthService.ts
import axiosClient from '../api/axiosClient';
import type { User, LoginRequest, ChangePasswordRequest } from '../interfaces/UserData';

class AuthService {
  /**
   * Login user or admin
   */
  async login(loginData: LoginRequest): Promise<User> {
    try {
      const response = await axiosClient.post('/authentication/login', loginData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Create password for user
   */
  async createPassword(email: string, password: string, businessReference?: string): Promise<any> {
    try {
      const response = await axiosClient.post('/authentication/create-password', {
        email,
        password,
        businessReference
      });
      return response.data;
    } catch (error) {
      console.error('Create password error:', error);
      throw new Error('Failed to create password.');
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, passwords: ChangePasswordRequest): Promise<void> {
    try {
      await axiosClient.put(`/authentication/change-password/${userId}`, passwords);
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error('Failed to change password.');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      // This would typically get the user ID from the token or context
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('No user email found');
      }
      
      const response = await axiosClient.get(`/users/email/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error('Failed to fetch user profile.');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await axiosClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile.');
    }
  }

  /**
   * Update profile image
   */
  async updateProfileImage(userId: string, imageFile: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosClient.put(
        `/users/${userId}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update profile image error:', error);
      throw new Error('Failed to update profile image.');
    }
  }

  /**
   * Check if business reference exists
   */
  async checkBusinessReferenceExists(reference: string): Promise<boolean> {
    try {
      const response = await axiosClient.get(`/users/business-reference/${reference}/exists`);
      return response.data;
    } catch (error) {
      console.error('Check business reference error:', error);
      throw new Error('Failed to check business reference.');
    }
  }
}

// Export as singleton instance
export const authService = new AuthService();
export default authService;