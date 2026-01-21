// src/services/AuthService.ts
import axiosClient from '../api/axiosClient';
import type { User, LoginRequest, ChangePasswordRequest, LoginResponse } from '../interfaces/UserData';

class AuthService {
  /**
   * Login user or admin - NOW RETURNS LoginResponse WITH TOKEN
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login...", loginData);
      const response = await axiosClient.post('/authentication/login', loginData);
      
      const loginResponse: LoginResponse = response.data;
      console.log("✅ Login response received:", {
        ...loginResponse,
        token: loginResponse.token ? "***MASKED***" : undefined
      });
      
      if (!loginResponse.token) {
        throw new Error("No authentication token received from server");
      }
      
      // Store token and user data
      localStorage.setItem('authToken', loginResponse.token);
      
      // Construct user object from response
      const user: User = {
        userId: loginResponse.userId,
        fullName: loginResponse.fullName,
        email: loginResponse.email,
        role: loginResponse.role,
        status: 'ACTIVE',
        businessReference: loginResponse.businessReference,
        companyName: loginResponse.companyName,
        profileImageUrl: loginResponse.profileImageUrl
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return loginResponse;
    } catch (error: any) {
      console.error('❌ Login error details:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get current user profile (uses JWT token)
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      
      // If unauthorized, clear token and redirect
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw new Error('Failed to fetch user profile.');
    }
  }

  /**
   * Update current user profile
   */
  async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axiosClient.put('/users/me', userData);
      
      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile.');
    }
  }

  /**
   * Update profile image
   */
  async updateProfileImage(imageFile: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosClient.put(
        '/users/me/profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      console.error('Update profile image error:', error);
      throw new Error('Failed to update profile image.');
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
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await axiosClient.post('/authentication/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Request password reset error:', error);
      throw new Error('Failed to request password reset.');
    }
  }

  /**
   * Reset password using token
   */
  async resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    try {
      await axiosClient.post('/authentication/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Failed to reset password.');
    }
  }

  /**
   * Change password
   */
  async changePassword(passwords: ChangePasswordRequest): Promise<void> {
    try {
      await axiosClient.put('/authentication/change-password', passwords);
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error('Failed to change password.');
    }
  }

  /**
   * Deactivate current user
   */
  async deactivateUser(): Promise<void> {
    try {
      await axiosClient.put('/users/me/deactivate');
      
      // Logout after deactivation
      this.logout();
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw new Error('Failed to deactivate account.');
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

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Refresh token (optional - implement if you have refresh token endpoint)
   */
  async refreshToken(): Promise<string | null> {
    try {
      // If you implement refresh tokens in backend
      // const response = await axiosClient.post('/authentication/refresh');
      // const newToken = response.data.token;
      // localStorage.setItem('authToken', newToken);
      // return newToken;
      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return null;
    }
  }
}

// Export as singleton instance
export const authService = new AuthService();
export default authService;