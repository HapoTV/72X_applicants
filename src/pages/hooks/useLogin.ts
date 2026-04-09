// src/pages/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest, LoginResponse, User } from '../../interfaces/UserData';

export type LoginType = 'user' | 'admin' | 'superadmin' | 'cocadmin';

const PERMISSION_DENIED_MESSAGE = 'You do not have permission to login to this dashboard.';

function expectedLoginTypeForRole(roleRaw: string | undefined | null): LoginType | undefined {
  const role = (roleRaw || '').toUpperCase();
  if (role === 'COC_ADMIN') return 'cocadmin';
  if (role === 'SUPER_ADMIN') return 'superadmin';
  if (role === 'ADMIN') return 'admin';
  if (role === 'USER') return 'user';
  return undefined;
}

function loginPathForType(loginType: LoginType): string {
  if (loginType === 'cocadmin') return '/login/cocadmin';
  if (loginType === 'superadmin') return '/login/haposuperadmin';
  if (loginType === 'admin') return '/login/asadmin';
  return '/login';
}

function isLoginTypeAllowedForRole(roleRaw: string | undefined | null, loginType: LoginType | undefined): boolean {
  const expected = expectedLoginTypeForRole(roleRaw);
  if (!expected || !loginType) return true;
  return expected === loginType;
}

interface UserFormData {
  email: string;
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

  const handleUserLogin = async (formData: UserFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loginResponse = await authService.login({ email: formData.email, password: formData.password, loginType: 'user' } as LoginRequest);
      await handleLoginResponse(loginResponse, formData.email, undefined, 'user');
    } catch (error: any) { handleLoginError(error); }
    finally { setIsLoading(false); }
  };

  const handleAdminLogin = async (formData: AdminFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loginResponse = await authService.login({ email: formData.email, password: formData.password, loginType: 'admin' } as LoginRequest);
      await handleLoginResponse(loginResponse, formData.email, undefined, 'admin');
    } catch (error: any) { handleLoginError(error); }
    finally { setIsLoading(false); }
  };

  const handleSuperAdminLogin = async (formData: AdminFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loginResponse = await authService.login({ email: formData.email, password: formData.password, loginType: 'superadmin' } as LoginRequest);
      await handleLoginResponse(loginResponse, formData.email, undefined, 'superadmin');
    } catch (error: any) { handleLoginError(error); }
    finally { setIsLoading(false); }
  };

  const handleCocAdminLogin = async (formData: AdminFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loginResponse = await authService.login({ email: formData.email, password: formData.password, loginType: 'admin' } as LoginRequest);
      await handleLoginResponse(loginResponse, formData.email, undefined, 'cocadmin');
    } catch (error: any) { handleLoginError(error); }
    finally { setIsLoading(false); }
  };

  const handleLoginResponse = async (loginResponse: LoginResponse, email: string, businessReference?: string, loginType?: LoginType) => {
    if (loginType && !isLoginTypeAllowedForRole((loginResponse as any).role, loginType)) {
      setErrorMessage(PERMISSION_DENIED_MESSAGE);
      navigate(loginPathForType(expectedLoginTypeForRole((loginResponse as any).role) || 'user'), { replace: true });
      return;
    }
    const requiresOtp = isTruthyFlag((loginResponse as any).requiresOtpVerification) || isTruthyFlag((loginResponse as any).requiresTwoFactor);
    if (requiresOtp) {
      navigate('/verify-otp', { state: { email, loginType: loginType || 'user', apiLoginType: loginType === 'cocadmin' ? 'admin' : (loginType || 'user'), businessReference, userId: loginResponse.userId, requiresOtpVerification: true, otpCode: loginResponse.otpCode } });
      return;
    }
    await completeLogin(loginResponse, login, loginType);
  };

  const handleLoginError = (error: any) => {
    let message = error.message || 'An error occurred during login. Please try again.';
    if (message.includes('Network Error') || message.includes('Cannot connect')) message = 'Cannot connect to server. Please check if the backend is running.';
    else if (message.includes('Invalid credentials')) message = 'Invalid email or password. Please try again.';
    setErrorMessage(message);
  };

  const fillUserCredentials = (setFormData: (updater: (prev: UserFormData) => UserFormData) => void) => {
    setFormData(prev => ({ ...prev, email: 'asandile.nkala@example.com', password: '@TesterAsandile123' }));
    setErrorMessage('');
  };

  const fillAdminCredentials = (setFormData: (updater: (prev: AdminFormData) => AdminFormData) => void) => {
    setFormData(prev => ({ ...prev, email: 'asavela.mbengashe@example.com', password: '@TesterAsavela123' }));
    setErrorMessage('');
  };

  const fillSuperAdminCredentials = (setFormData: (updater: (prev: AdminFormData) => AdminFormData) => void) => {
    setFormData(prev => ({ ...prev, email: 'misa@gmail.com', password: 'Misa@123' }));
    setErrorMessage('');
  };

  return { isLoading, errorMessage, setErrorMessage, handleUserLogin, handleAdminLogin, handleSuperAdminLogin, handleCocAdminLogin, fillUserCredentials, fillAdminCredentials, fillSuperAdminCredentials };
}

async function completeLogin(loginResponse: LoginResponse, login: (user: User, authToken?: string) => void, loginType?: LoginType) {
  try {
    if (loginType && !isLoginTypeAllowedForRole((loginResponse as any).role, loginType)) {
      localStorage.removeItem('authToken');
      alert(PERMISSION_DENIED_MESSAGE);
      const expected = expectedLoginTypeForRole((loginResponse as any).role) || 'user';
      window.location.href = `${import.meta.env.BASE_URL}${loginPathForType(expected).replace(/^\//, '')}`;
      return;
    }

    if (loginResponse.token) {
      localStorage.setItem('authToken', loginResponse.token);
      authService.setAxiosAuthHeader(loginResponse.token);
    }

    const userRole = loginResponse.role || '';
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', loginResponse.email);
    localStorage.setItem('userId', loginResponse.userId);
    localStorage.setItem('fullName', loginResponse.fullName || '');
    if (loginResponse.status) localStorage.setItem('userStatus', loginResponse.status);
    if (loginResponse.organisation) localStorage.setItem('userOrganisation', loginResponse.organisation);

    login({ userId: loginResponse.userId, fullName: loginResponse.fullName, email: loginResponse.email, role: userRole, status: loginResponse.status || 'ACTIVE', companyName: loginResponse.companyName, profileImageUrl: loginResponse.profileImageUrl, organisation: loginResponse.organisation } as User, loginResponse.token);

    setTimeout(() => {
      const baseUrl = import.meta.env.BASE_URL;
      const role = userRole.toUpperCase();

      if (loginType === 'cocadmin' || role === 'COC_ADMIN') { window.location.href = `${baseUrl}cocadmin/dashboard/applicants`; return; }
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') { window.location.href = `${baseUrl}admin/dashboard/overview`; return; }

      const userStatus = loginResponse.status || localStorage.getItem('userStatus');
      const selectedPackage = localStorage.getItem('selectedPackage');

      if ((loginResponse as any).requiresPackageSelection === false && userStatus === 'ACTIVE') {
        window.location.href = `${baseUrl}dashboard/overview`;
      } else if (userStatus === 'PENDING_PACKAGE') {
        window.location.href = `${baseUrl}select-package`;
      } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
        window.location.href = `${baseUrl}payments/new`;
      } else if (userStatus === 'PENDING_PAYMENT' && !selectedPackage) {
        window.location.href = `${baseUrl}select-package`;
      } else {
        window.location.href = `${baseUrl}dashboard/overview`;
      }
    }, 100);
  } catch (error: any) {
    console.error('❌ Complete login error:', error.message);
  }
}
