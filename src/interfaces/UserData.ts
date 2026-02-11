export interface User {
    userId: string;
    email: string;
    role: string;
    fullName?: string;
    status?: string;
    businessReference?: string;
    companyName?: string;
    profileImageUrl?: string;
    token?: string;
    requiresTwoFactor?: boolean;
    twoFactorEnabled?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
    businessReference?: string;
    loginType: 'user' | 'admin';
}

export interface UserFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  industry: string;
  location: string;
  employees: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
