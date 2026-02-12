// src/pages/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest, LoginResponse, User } from '../../interfaces/UserData';

export type LoginType = 'user' | 'admin';

interface FormData {
  email: string;
  businessReference: string;
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

  const [loginType, setLoginType] = useState<LoginType>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('🚀 Starting login process...');

      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
        businessReference: loginType === 'user' ? formData.businessReference : undefined,
        loginType,
      };

      console.log('🔑 Calling login endpoint...');
      const loginResponse = await authService.login(loginRequest);
      console.log('✅ Login response received:', loginResponse);

      const requiresOtp =
        isTruthyFlag((loginResponse as any).requiresOtpVerification) ||
        isTruthyFlag((loginResponse as any).requiresTwoFactor);

      console.log('🔍 requiresOtp check result:', requiresOtp);

      if (requiresOtp) {
        console.log('📱 OTP verification required, redirecting...');
        navigate('/verify-otp', {
          state: {
            email: formData.email,
            loginType,
            businessReference: loginType === 'user' ? formData.businessReference : undefined,
            userId: loginResponse.userId,
            requiresOtpVerification: true,
            otpCode: loginResponse.otpCode,
          },
        });
        return;
      }

      console.log('✅ No OTP required, completing login...');
      await completeLogin(loginResponse, loginType, login);
    } catch (error: any) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (setFormData: (updater: (prev: FormData) => FormData) => void) => {
    const demoCredentials = {
      user: {
        email: 'asandile.nkala@example.com',
        businessReference: '7272002',
        password: '@TesterAsandile123',
      },
      admin: {
        email: 'asavela.mbengashe@example.com',
        businessReference: '',
        password: '@TesterAsavela123',
      },
    } as const;

    const credentials = demoCredentials[loginType];
    setFormData((prev) => ({
      ...prev,
      email: credentials.email,
      businessReference: credentials.businessReference,
      password: credentials.password,
    }));
    setErrorMessage('');
  };

  return {
    loginType,
    setLoginType,
    isLoading,
    errorMessage,
    setErrorMessage,
    handleLogin,
    fillDemoCredentials,
  };
}

async function completeLogin(
  loginResponse: LoginResponse,
  loginType: LoginType,
  login: (user: User) => void,
) {
  try {
    if (loginResponse.token) {
      localStorage.setItem('authToken', loginResponse.token);
      authService.setAxiosAuthHeader(loginResponse.token);
    }

    localStorage.setItem('userType', loginType);
    localStorage.setItem('userEmail', loginResponse.email);
    localStorage.setItem('userId', loginResponse.userId);
    localStorage.setItem('userRole', loginResponse.role || '');
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
      role: loginResponse.role,
      status: loginResponse.status || 'ACTIVE',
      businessReference: loginResponse.businessReference,
      companyName: loginResponse.companyName,
      profileImageUrl: loginResponse.profileImageUrl,
    };

    login(userData);

    console.log(
      '🎉 Login complete! Token:',
      loginResponse.token ? loginResponse.token.substring(0, 30) + '...' : 'none',
    );
    console.log('📊 Post-login status check:', {
      status: loginResponse.status,
      isAuthenticated: true,
    });

    setTimeout(() => {
      if (loginType === 'admin') {
        window.location.href = '/admin/dashboard/overview';
      } else {
        const userStatus = loginResponse.status || localStorage.getItem('userStatus');
        const selectedPackage = localStorage.getItem('selectedPackage');

        console.log('🔍 Post-login redirection check:', {
          userStatus,
          selectedPackage,
          loginType,
        });

        if (userStatus === 'PENDING_PACKAGE') {
          console.log('📦 User needs package selection, redirecting to /select-package');
          window.location.href = '/select-package';
        } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
          console.log('💳 User needs payment for selected package, redirecting to /payments/new');
          window.location.href = '/payments/new';
        } else if (userStatus === 'PENDING_PAYMENT' && !selectedPackage) {
          console.log(
            '⚠️ User PENDING_PAYMENT but no package selected, redirecting to package selection',
          );
          window.location.href = '/select-package';
        } else {
          console.log('🏠 User is active, going to dashboard');
          window.location.href = '/dashboard/overview';
        }
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

    // Surface via console for now; component can still show the outer errorMessage
    console.error('❌ Complete login error message:', message);
  }
}
