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
  OrganisationUserRequest,
  UserAvailability
} from '../interfaces/UserData';

const API_URL = 'http://localhost:8080/api';

const publicAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log("👤 Creating new user (public signup)...", userData);
      
      const requestBody = {
        fullName: userData.fullName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        companyName: userData.companyName,
        organisation: userData.organisation || null,
        employees: userData.employees,
        founded: userData.founded,
        industry: userData.industry,
        location: userData.location,
        businessReference: userData.businessReference || null,
        hasReference: userData.hasReference || false,
        role: 'USER',
        status: 'PENDING_PASSWORD'
      };

      const response = await publicAxios.post('/users/signup', requestBody);
      const createdUser: CreateUserResponse = response.data;

      localStorage.setItem('userEmail', createdUser.email);
      if (createdUser.organisation) {
        localStorage.setItem('userOrganisation', createdUser.organisation);
      }
      localStorage.setItem('tempUserData', JSON.stringify(createdUser));
      
      return createdUser;
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('email')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (errorMessage.toLowerCase().includes('business reference')) {
          errorMessage = 'This business reference is already in use. Please check your reference number.';
        }
      }
      if (error.response?.status === 404) {
        errorMessage = 'Signup service is currently unavailable. Please contact support.';
      }
      throw new Error(errorMessage);
    }
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login...", { 
        email: loginData.email, 
        loginType: loginData.loginType,
        hasBusinessRef: !!loginData.businessReference 
      });
      const response = await axiosClient.post('/authentication/login', loginData);
      return response.data;
    } catch (error: any) {
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

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosClient.get('/users/me');
      if (response.data.organisation) {
        localStorage.setItem('userOrganisation', response.data.organisation);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userOrganisation');
        window.location.href = '/login';
      }
      throw new Error('Failed to fetch user profile.');
    }
  }

  async createPassword(email: string, password: string, businessReference?: string): Promise<any> {
    try {
      const response = await axiosClient.post('/authentication/create-password', {
        email,
        password,
        businessReference
      });
      return response.data;
    } catch (error: any) {
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

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axiosClient.put('/users/me', userData);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (response.data.organisation) {
        localStorage.setItem('userOrganisation', response.data.organisation);
      }
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile.');
    }
  }

  async updateProfileImage(imageFile: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axiosClient.put('/users/me/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile image.');
    }
  }

  /**
   * Forgot password - stores email in localStorage for reset step
   */
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await publicAxios.post('/authentication/forgot-password', { email });
      // Store email so ResetPasswordVerify can use it without a token
      localStorage.setItem('resetEmail', email);
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Failed to request password reset.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Reset password by email — no token needed.
   * Email is already verified from the forgot-password flow.
   * Works exactly like changePassword on the Profile page,
   * but uses email instead of userId and requires no old password.
   */
  async resetPasswordVerify(token: string, newPassword: string): Promise<void> {
  try {
    console.log("🔐 Verifying password reset...");

    await publicAxios.post('/authentication/reset-password/verify', {
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
  

  /**
   * Change password (Profile page) — PUT /authentication/change-password/{userId}
   */
  async changePassword(passwords: ChangePasswordRequest): Promise<void> {
    try {
      console.log("🔐 Changing password...");
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId;
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      await axiosClient.put(`/authentication/change-password/${userId}`, {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      console.log("✅ Password changed successfully");
    } catch (error: any) {
      let errorMessage = 'Failed to change password.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect. Please try again.';
      } else if (error.response?.status === 400 && !error.response.data?.message) {
        errorMessage = 'Invalid password format. Please check the requirements.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please log in again.';
      }
      throw new Error(errorMessage);
    }
  }

  async deactivateUser(): Promise<void> {
    try {
      await axiosClient.put('/users/me/deactivate');
      this.logout();
    } catch (error) {
      throw new Error('Failed to deactivate account.');
    }
  }

  async checkBusinessReferenceExists(reference: string): Promise<boolean> {
    try {
      const response = await axiosClient.get(`/users/business-reference/${reference}/exists`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to check business reference.');
    }
  }

  async verifyOtp(verifyOtpRequest: any): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/authentication/verify-otp`, verifyOtpRequest);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(resendOtpRequest: any): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/authentication/resend-otp`, resendOtpRequest);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  setAxiosAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  logout(): void {
    const itemsToKeep = ['language', 'theme'];
    Object.keys(localStorage).forEach(key => {
      if (!itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserOrganisation(): string | null {
    return localStorage.getItem('userOrganisation');
  }

  isSuperAdmin(): boolean {
    return localStorage.getItem('userRole') === 'SUPER_ADMIN';
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  async refreshToken(): Promise<string | null> {
    try {
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();