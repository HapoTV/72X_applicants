export interface User {
  // Core identity
  userId: string;
  email: string;
  role: string;

  // Profile / business details
  fullName?: string;
  mobileNumber?: string;
  businessReference?: string;
  hasReference?: boolean;
  companyName?: string;
  industry?: string;
  location?: string;
  founded?: string;
  employees?: string;
  profileImageUrl?: string;

  // Account status & security
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  requiresTwoFactor?: boolean;
  twoFactorEnabled?: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  employees: string;
  founded: string;
  industry: string;
  location: string;
  businessReference?: string;
  hasReference?: boolean;
  role?: string;
  status?: string;
}

export interface CreateUserResponse {
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  businessReference?: string;
  hasReference?: boolean;
  role: string;
  status: string;
  createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    businessReference?: string;
    loginType: 'user' | 'admin';
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  businessReference?: string;
  profileImageUrl?: string;
  companyName?: string;
  status?: string;
  requiresPackageSelection?: boolean;

  // OTP / 2FA flags from demo branch
  requiresOtpVerification?: boolean;
  requiresTwoFactor?: boolean;
  otpCode?: string; // for dev/testing only
}

export interface UserFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  industry: string;
  location: string;
  employees: string;
  founded: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;

  
}
