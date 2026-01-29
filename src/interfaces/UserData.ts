// src/interfaces/UserData.ts
export interface User {
  userId: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  businessReference?: string;
  hasReference?: boolean;
  companyName?: string;
  industry?: string;
  location?: string;
  founded?: string;
  employees?: string;
  profileImageUrl?: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
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
  hasReference?: boolean;
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
  oldPassword: string;
  newPassword: string;
}