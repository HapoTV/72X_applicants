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
  userPackage?: string;
  createdAt?: string;
  updatedAt?: string;
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