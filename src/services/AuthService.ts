import axios from "axios";
import axiosClient from '../api/axiosClient';
import type { 
  User, 
  LoginRequest, 
  ChangePasswordRequest, 
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse 
} from '../interfaces/UserData';

// Create a separate axios instance for public endpoints (no auth required)
const publicAxios = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// FRONTEND-ONLY PASSWORD RESET FUNCTIONALITY
// =========================================

// Storage for verification codes (frontend-only)
const verificationStore = {
  codes: new Map<string, { code: string; expiresAt: number; email: string }>(),
  
  setCode(email: string, code: string) {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.codes.set(email, { code, expiresAt, email });
    
    // Also store in localStorage for persistence
    localStorage.setItem(`frontend_reset_${email}`, JSON.stringify({
      code,
      expiresAt,
      email,
      timestamp: new Date().toISOString()
    }));
    
    console.log(`✅ Frontend: Code stored for ${email}: ${code}`);
  },
  
  getCode(email: string): string | null {
    // Try memory first
    const memoryCode = this.codes.get(email);
    if (memoryCode) {
      if (Date.now() > memoryCode.expiresAt) {
        this.codes.delete(email);
        return null;
      }
      return memoryCode.code;
    }
    
    // Try localStorage
    const storedData = localStorage.getItem(`frontend_reset_${email}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem(`frontend_reset_${email}`);
        return null;
      }
      return data.code;
    }
    
    return null;
  },
  
  deleteCode(email: string) {
    this.codes.delete(email);
    localStorage.removeItem(`frontend_reset_${email}`);
  }
};

// Email service using Resend API
import { createExternalAxios } from '../api/axiosClient';

// Hardcoded for development; replace with env variable in production
const RESEND_API_KEY = 're_AT599Xgk_H85L563k1Jk4C8HizSWEsFhK';

const emailService = {
  async sendVerificationCode(email: string, code: string, businessRef?: string): Promise<boolean> {
    try {
      console.log('📧 [Resend Email Service] Sending to:', email);
      const resendAxios = createExternalAxios('https://api.resend.com', RESEND_API_KEY);
      const subject = 'Your 72X Password Reset Verification Code';
      const html = `
        <div style="font-family: Arial, sans-serif;">
          <h2>🔐 Password Reset Verification</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Verification Code:</strong> <span style="font-size: 1.5em; color: #2563eb;">${code}</span></p>
          ${businessRef ? `<p><strong>Business:</strong> ${businessRef}</p>` : ''}
          <p>⏰ This code expires in 10 minutes.</p>
          <p>Copy this code to use on the reset password page.</p>
        </div>
      `;
      const data = {
        from: 'no-reply@72x.app',
        to: [email],
        subject,
        html,
      };
      const response = await resendAxios.post('/emails', data);
      console.log('✅ Resend API response:', response.data);
      return true;
    } catch (error: any) {
      console.error('❌ Resend email service error:', error?.response?.data || error);
      return false;
    }
  },
};

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
        status: createdUser.status
      });
      
      // Store temporary user data for password creation flow
      localStorage.setItem('userEmail', createdUser.email);
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
   * Login user or admin - NOW RETURNS LoginResponse WITH TOKEN
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login...", loginData);
      const response = await axiosClient.post('/authentication/login', loginData);
      
      const loginResponse: LoginResponse = response.data;
      console.log("✅ Login response received:", {
        ...loginResponse,
        token: loginResponse.token ? "***MASKED***" : undefined,
        status: loginResponse.status,
        requiresPackageSelection: loginResponse.requiresPackageSelection
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
        status: loginResponse.status || 'ACTIVE', // Use status from response
        businessReference: loginResponse.businessReference,
        companyName: loginResponse.companyName,
        profileImageUrl: loginResponse.profileImageUrl
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userStatus', loginResponse.status || 'ACTIVE');
      
      // Store if package selection is required
      if (loginResponse.requiresPackageSelection) {
        localStorage.setItem('requiresPackageSelection', 'true');
      } else {
        localStorage.removeItem('requiresPackageSelection');
      }
      
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
   * Request password reset - FRONTEND ONLY
   * Generates a 6-digit code and stores it in localStorage
   */
  async requestPasswordReset(email: string, businessRef?: string): Promise<{ message: string; code: string }> {
    try {
      console.log("📧 [Frontend Only] Requesting password reset for:", email);
      
      // Generate a 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log(`🔐 Generated code: ${verificationCode}`);
      
      // Store in localStorage with expiration (10 minutes)
      verificationStore.setCode(email, verificationCode);
      
      // Also store in sessionStorage for current session
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.setItem('resetCode', verificationCode);
      
      // Try to send email (will show alert in development)
      try {
        await emailService.sendVerificationCode(email, verificationCode, businessRef);
        
        return { 
          message: '✅ Verification code generated and sent!',
          code: verificationCode
        };
      } catch (emailError) {
        // Even if email fails, return the code
        console.log('⚠️ Email failed, but code is:', verificationCode);
        return { 
          message: `📝 Verification code: ${verificationCode}`,
          code: verificationCode
        };
      }
      
    } catch (error: any) {
      console.error('❌ Frontend password reset error:', error);
      
      // Generate a fallback code
      const fallbackCode = '123456';
      verificationStore.setCode(email, fallbackCode);
      
      return { 
        message: `🔄 Fallback code: ${fallbackCode}`,
        code: fallbackCode
      };
    }
  }

  /**
   * Verify reset code - FRONTEND ONLY
   */
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    console.log(`🔍 [Frontend Only] Verifying code for ${email}`);
    
    // Get the stored code
    const storedCode = verificationStore.getCode(email);
    
    if (!storedCode) {
      // Check sessionStorage as fallback
      const sessionCode = sessionStorage.getItem('resetCode');
      const sessionEmail = sessionStorage.getItem('resetEmail');
      
      if (sessionEmail === email && sessionCode === code) {
        console.log('✅ Code verified from sessionStorage');
        return true;
      }
      
      throw new Error('No verification code found. Please request a new code.');
    }
    
    if (storedCode !== code.trim()) {
      console.log(`❌ Code mismatch: Entered ${code}, Expected ${storedCode}`);
      throw new Error('Invalid verification code. Please check and try again.');
    }
    
    console.log('✅ Code verified successfully');
    return true;
  }

  /**
   * Reset password with verification code - FRONTEND ONLY
   * Stores the new password in localStorage (for demo)
   */
  async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      console.log("🔄 [Frontend Only] Resetting password for:", email);
      
      // First verify the code
      await this.verifyResetCode(email, code);
      
      // Code is valid - store the new password in localStorage
      const passwordResetRecord = {
        email: email,
        newPassword: newPassword, // In real app, you would hash this
        resetAt: new Date().toISOString(),
        codeUsed: code,
        status: 'reset'
      };
      
      // Save to localStorage (for demo purposes)
      localStorage.setItem(`password_reset_record_${email}`, JSON.stringify(passwordResetRecord));
      
      // Clear the verification data
      verificationStore.deleteCode(email);
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetCode');
      
      console.log('✅ Password reset saved to localStorage');
      
      // Show success
      alert(`✅ Password reset successful!\n\nEmail: ${email}\nNew password has been saved.\n\nIn a real app, this would update your backend database.`);
      
      return true;
      
    } catch (error: any) {
      console.error('❌ Frontend password reset error:', error);
      throw error;
    }
  }

  /**
   * Check if a password reset was performed (frontend demo)
   */
  getPasswordResetStatus(email: string): any {
    const record = localStorage.getItem(`password_reset_record_${email}`);
    return record ? JSON.parse(record) : null;
  }

  /**
   * Clear all reset data (for testing)
   */
  clearAllResetData(): void {
    // Clear localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('frontend_reset_') || key?.startsWith('password_reset_record_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.removeItem('resetEmail');
    sessionStorage.removeItem('resetCode');
    
    console.log('🧹 Cleared all reset data');
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
      if ((error as any).response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
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
   * Request password reset (keeping original for backward compatibility)
   */
  async requestPasswordResetOld(email: string): Promise<any> {
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
    localStorage.removeItem('tempUserData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('requiresPackageSelection');
    
    // Also clear frontend reset data
    this.clearAllResetData();
    
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