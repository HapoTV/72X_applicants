// src/services/AuthService.ts
import axios from "axios";
import axiosClient from '../api/axiosClient';
import type { 
  User, 
  LoginRequest, 
  ChangePasswordRequest, 
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse,
} from '../interfaces/UserData';

// Base URL for public axios (no auth required)
const API_URL = 'http://localhost:8080/api';

// Separate axios instance for public endpoints
const publicAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {
  /**
   * Create a new user (public signup) - No authentication required
   */
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log("👤 Creating new user (public signup)...", userData);
      
      // Prepare request body matching backend DTO
      const requestBody = {
        fullName: userData.fullName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        companyName: userData.companyName,
        organisation: userData.organisation || null, // NEW: Include organisation
        employees: userData.employees,
        founded: userData.founded,
        industry: userData.industry,
        location: userData.location,
        businessReference: userData.businessReference || null,
        hasReference: userData.hasReference || false,
        role: 'USER', // Force USER role for public signups
        status: 'PENDING_PASSWORD'
      };

      console.log("📤 Sending public signup request:", requestBody);
      
      // Use publicAxios (no auth token) for signup
      const response = await publicAxios.post('/users/signup', requestBody);
      
      const createdUser: CreateUserResponse = response.data;
      console.log("✅ User created successfully:", {
        userId: createdUser.userId,
        email: createdUser.email,
        organisation: createdUser.organisation,
        status: createdUser.status
      });
      
      // Store temporary user data for password creation flow
      localStorage.setItem('userEmail', createdUser.email);
      if (createdUser.organisation) {
        localStorage.setItem('userOrganisation', createdUser.organisation);
      }
      localStorage.setItem('tempUserData', JSON.stringify(createdUser));
      
      return createdUser;
    } catch (error: any) {
      console.error('❌ Create user error details:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('email')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (errorMessage.toLowerCase().includes('business reference')) {
          errorMessage = 'This business reference is already in use. Please check your reference number.';
        }
      }
      
      // Check if endpoint doesn't exist (404) and provide fallback
      if (error.response?.status === 404) {
        console.warn('⚠️ Signup endpoint not found. Please check backend routes.');
        errorMessage = 'Signup service is currently unavailable. Please contact support.';
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Login user, admin, or super admin.
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login...", { 
        email: loginData.email, 
        loginType: loginData.loginType,
        hasBusinessRef: !!loginData.businessReference 
      });
      
      const response = await axiosClient.post('/authentication/login', loginData);

      const loginResponse: LoginResponse = response.data;
      console.log("✅ Login response received:", {
        ...loginResponse,
        token: loginResponse.token ? "***MASKED***" : undefined,
        role: loginResponse.role,
        organisation: loginResponse.organisation,
        status: loginResponse.status,
        requiresPackageSelection: loginResponse.requiresPackageSelection,
        requiresOtpVerification: loginResponse.requiresOtpVerification
      });

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
      
      // Store organisation in localStorage if present
      if (response.data.organisation) {
        localStorage.setItem('userOrganisation', response.data.organisation);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);

      // If unauthorized, clear token and redirect
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userOrganisation');
        window.location.href = '/login';
      }

      throw new Error('Failed to fetch user profile.');
    }
  }

  /**
   * Create password for user
   */
  async createPassword(email: string, password: string, businessReference?: string): Promise<any> {
    try {
      console.log("🔐 Creating password for user:", { email, businessReference });
      
      const response = await axiosClient.post('/authentication/create-password', {
        email,
        password,
        businessReference
      });
      
      console.log("✅ Password created successfully for:", email);
      return response.data;
    } catch (error: any) {
      console.error('Create password error:', error);
      
      let errorMessage = 'Failed to create password.';
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
   * Update current user profile
   */
  async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const userId =
        userData.userId ||
        (() => {
          try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.userId || localStorage.getItem('userId') || undefined;
          } catch {
            return localStorage.getItem('userId') || undefined;
          }
        })();

      const response = await axiosClient.put('/users/me', {
        ...userData,
        userId,
      });
      
      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update organisation if present
      if (response.data.organisation) {
        localStorage.setItem('userOrganisation', response.data.organisation);
      }
      
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
      await axiosClient.put('/authentication/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Failed to reset password.');
    }
  }

  /**
   * Reset password verify
   */
  async resetPasswordVerify(token: string, newPassword: string): Promise<void> {
    try {
    console.log("🔐 Verifying password reset...");

    await publicAxios.put('/authentication/reset-password', {
    token,
    newPassword
    });

    console.log("✅ Password reset successful");

    } catch (error: any) {

    let errorMessage = 'Failed to reset password.';

    if (error.response?.data) {
    errorMessage = typeof error.response.data === 'string'
    ? error.response.data
    : error.response.data.message || errorMessage;
    } else if (error.message) {
    errorMessage = error.message;
    }

    if (error.response?.status === 400) {
    errorMessage = 'Invalid or expired reset link.';
    }

    if (error.response?.status === 404) {
    errorMessage = 'Reset request not found.';
    }

    throw new Error(errorMessage);
    }
    }

  // src/services/AuthService.ts

/**
 * Change password - Matches backend API: PUT /authentication/change-password
 */
  async changePassword(passwords: ChangePasswordRequest): Promise<void> {
    try {
      console.log("🔐 Changing password...");

      // Backend expects "oldPassword" and "newPassword" keys
      const requestBody = {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      };

      // REMOVED: ${userId} from the URL - just use the base endpoint
      await axiosClient.put(`/authentication/change-password`, requestBody);
      
      console.log("✅ Password changed successfully");
    } catch (error: any) {
      console.error('❌ Change password error:', error);
      console.error('Error response:', error.response);

      let errorMessage = 'Failed to change password.';

      // Extract error message from response
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific HTTP status codes
      if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect. Please try again.';
      } else if (error.response?.status === 400) {
        // Keep the backend's validation message if available
        if (!error.response.data?.message) {
          errorMessage = 'Invalid password format. Please check the requirements.';
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please log in again.';
      }

      throw new Error(errorMessage);
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
   * OTP verification
   */
  async verifyOtp(verifyOtpRequest: any): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/authentication/verify-otp`, verifyOtpRequest);
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(resendOtpRequest: any): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/authentication/resend-otp`, resendOtpRequest);
      return response.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  }

  /**
   * Set default Authorization header for axios
   */
  setAxiosAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear all auth-related localStorage items
    const itemsToKeep = ['language', 'theme']; // Items to preserve
    const allItems = Object.keys(localStorage);
    
    allItems.forEach(key => {
      if (!itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
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
   * Get current user role
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * Get current user organisation
   */
  getUserOrganisation(): string | null {
    return localStorage.getItem('userOrganisation');
  }

  /**
   * Check if current user is super admin
   */
  isSuperAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'SUPER_ADMIN';
  }

  /**
   * Check if current user is admin (including super admin)
   */
  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
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

export const authService = new AuthService();