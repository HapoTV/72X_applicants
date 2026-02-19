// src/pages/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest, LoginResponse, User } from '../../interfaces/UserData';

export type LoginType = 'user' | 'admin' | 'superadmin';

interface UserFormData {
  email: string;
  businessReference: string;
  password: string;
  rememberMe: boolean;
}

interface AdminFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const isTruthyFlag = (value: unknown): boolean => {
  if (value === true) return true;
  if (value === false || value == null) return false;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
  }
  return Boolean(value);
};

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // User login handler
  const handleUserLogin = async (formData: UserFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('🚀 Starting user login process...');
      console.log('📧 Email:', formData.email);

      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
        businessReference: formData.businessReference,
        loginType: 'user',
      };

      console.log('🔑 Calling login endpoint...');
      const loginResponse = await authService.login(loginRequest);
      console.log('✅ Login response received:', loginResponse);

      await handleLoginResponse(loginResponse, formData.email, formData.businessReference, 'user');
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (formData: AdminFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('🚀 Starting admin login process...');
      console.log('📧 Email:', formData.email);

      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
        loginType: 'admin',
      };

      console.log('🔑 Calling login endpoint...');
      const loginResponse = await authService.login(loginRequest);
      console.log('✅ Login response received:', loginResponse);

      await handleLoginResponse(loginResponse, formData.email, undefined, 'admin');
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Super Admin login handler
  const handleSuperAdminLogin = async (formData: AdminFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('🚀 Starting super admin login process...');
      console.log('📧 Email:', formData.email);

      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
        loginType: 'superadmin',
      };

      console.log('🔑 Calling login endpoint...');
      const loginResponse = await authService.login(loginRequest);
      console.log('✅ Login response received:', loginResponse);

      await handleLoginResponse(loginResponse, formData.email, undefined, 'superadmin');
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Common response handler
  const handleLoginResponse = async (
    loginResponse: LoginResponse,
    email: string,
    businessReference?: string,
    loginType?: LoginType
  ) => {
    const requiresOtp =
      isTruthyFlag((loginResponse as any).requiresOtpVerification) ||
      isTruthyFlag((loginResponse as any).requiresTwoFactor);

    console.log('🔍 requiresOtp check result:', requiresOtp);

    if (requiresOtp) {
      console.log('📱 OTP verification required, redirecting...');
      navigate('/verify-otp', {
        state: {
          email: email,
          loginType: loginType || 'user',
          businessReference: businessReference,
          userId: loginResponse.userId,
          requiresOtpVerification: true,
          otpCode: loginResponse.otpCode,
        },
      });
      return;
    }

    console.log('✅ No OTP required, completing login...');
    await completeLogin(loginResponse, login, navigate);
  };

  // Error handler
  const handleLoginError = (error: any) => {
    console.error('❌ Login error:', error);
    console.error('❌ Error response:', (error as any).response?.data);
    console.error('❌ Error status:', (error as any).response?.status);

    let message = error.message || 'An error occurred during login. Please try again.';

    if (message.includes('Network Error') || message.includes('Cannot connect')) {
      message = 'Cannot connect to server. Please check if the backend is running.';
    } else if (message.includes('Invalid credentials')) {
      message = 'Invalid email or password. Please try again.';
    } else if (message.includes('Business reference is required')) {
      message = 'Business reference is required for user login.';
    }

    setErrorMessage(message);
  };

  // Fill demo credentials for user
  const fillUserCredentials = (setFormData: (updater: (prev: UserFormData) => UserFormData) => void) => {
    setFormData((prev) => ({
      ...prev,
      email: 'asandile.nkala@example.com',
      businessReference: '7272002',
      password: '@TesterAsandile123',
    }));
    setErrorMessage('');
  };

  // Fill demo credentials for admin
  const fillAdminCredentials = (setFormData: (updater: (prev: AdminFormData) => AdminFormData) => void) => {
    setFormData((prev) => ({
      ...prev,
      email: 'asavela.mbengashe@example.com',
      password: '@TesterAsavela123',
    }));
    setErrorMessage('');
  };

  // Fill demo credentials for super admin
  const fillSuperAdminCredentials = (setFormData: (updater: (prev: AdminFormData) => AdminFormData) => void) => {
    setFormData((prev) => ({
      ...prev,
      email: 'misa@gmail.com',
      password: 'Misa@123',
    }));
    setErrorMessage('');
  };

  return {
    isLoading,
    errorMessage,
    setErrorMessage,
    handleUserLogin,
    handleAdminLogin,
    handleSuperAdminLogin,
    fillUserCredentials,
    fillAdminCredentials,
    fillSuperAdminCredentials,
  };
}

async function completeLogin(
  loginResponse: LoginResponse,
  login: (user: User) => void,
  navigate: ReturnType<typeof useNavigate>
) {
  try {
    console.log('🎯 Starting completeLogin with role from backend:', loginResponse.role);
    
    if (loginResponse.token) {
      localStorage.setItem('authToken', loginResponse.token);
      authService.setAxiosAuthHeader(loginResponse.token);
    }

    // Store user role from response - this is the source of truth
    const userRole = loginResponse.role || '';
    console.log('📝 Storing user role:', userRole);
    
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', loginResponse.email);
    localStorage.setItem('userId', loginResponse.userId);
    localStorage.setItem('fullName', loginResponse.fullName || '');

    if (loginResponse.status) {
      localStorage.setItem('userStatus', loginResponse.status);
      console.log('📋 Backend user status:', loginResponse.status);
    }

    if (loginResponse.businessReference) {
      localStorage.setItem('businessReference', loginResponse.businessReference);
    }

    const userData: User = {
      userId: loginResponse.userId,
      fullName: loginResponse.fullName,
      email: loginResponse.email,
      role: userRole,
      status: loginResponse.status || 'ACTIVE',
      businessReference: loginResponse.businessReference,
      companyName: loginResponse.companyName,
      profileImageUrl: loginResponse.profileImageUrl,
    };

    login(userData);

    console.log('🎉 Login complete! Token:', loginResponse.token ? loginResponse.token.substring(0, 30) + '...' : 'none');
    console.log('📊 Post-login status check:', {
      status: loginResponse.status,
      role: userRole,
      isAuthenticated: true,
    });

    // Use setTimeout to ensure state updates are complete
    setTimeout(() => {
      // Check role from response - this is the ONLY place we determine where to redirect
      const role = userRole.toUpperCase();
      console.log('🔍 Determining redirect based on role:', role);
      
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        console.log('👑 Redirecting to admin dashboard for role:', role);
        window.location.href = '/admin/dashboard/overview';
        return; // Important: return to prevent further execution
      }
      
      // If we get here, it's a regular user
      console.log('👤 Processing regular user redirect with role:', role);
      const userStatus = loginResponse.status || localStorage.getItem('userStatus');
      const selectedPackage = localStorage.getItem('selectedPackage');

      console.log('🔍 User dashboard redirection check:', {
        userStatus,
        selectedPackage,
        role,
      });

      if (userStatus === 'PENDING_PACKAGE') {
        console.log('📦 User needs package selection, redirecting to /select-package');
        window.location.href = '/select-package';
      } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
        console.log('💳 User needs payment for selected package, redirecting to /payments/new');
        window.location.href = '/payments/new';
      } else if (userStatus === 'PENDING_PAYMENT' && !selectedPackage) {
        console.log('⚠️ User PENDING_PAYMENT but no package selected, redirecting to package selection');
        window.location.href = '/select-package';
      } else {
        console.log('🏠 User is active, going to dashboard');
        window.location.href = '/dashboard/overview';
      }
    }, 100);
  } catch (error: any) {
    console.error('❌ Login error in completeLogin:', error);

    let message = error.message || 'An error occurred during login. Please try again.';

    if (message.includes('Network Error') || message.includes('Cannot connect')) {
      message = 'Cannot connect to server. Please check if the backend is running.';
    } else if (message.includes('Invalid credentials')) {
      message = 'Invalid email or password. Please try again.';
    } else if (message.includes('Business reference is required')) {
      message = 'Business reference is required for user login.';
    }

    console.error('❌ Complete login error message:', message);
  }
}