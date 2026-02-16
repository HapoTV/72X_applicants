// src/interfaces/UserData.ts
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
  organisation?: string; // NEW: Organisation that referred the user
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
  
  // Availability
  availabilityStatus?: string;
  lastSeenAt?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  organisation?: string; // NEW: Optional organisation
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
  organisation?: string; // NEW
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
    loginType: 'user' | 'admin' | 'superadmin'; // Added superadmin type
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
  organisation?: string; // NEW
  status?: string;
  requiresPackageSelection?: boolean;

  // OTP / 2FA flags from demo branch
  requiresOtpVerification?: boolean;
  requiresTwoFactor?: boolean;
  otpCode?: string; // for dev/testing only
  
  // Availability
  availabilityStatus?: string;
  lastSeenAt?: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  organisation?: string; // NEW
  industry: string;
  location: string;
  employees: string;
  founded: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// NEW: Interface for organisation-based user operations
export interface OrganisationUserRequest {
  organisation: string;
  userId?: string;
  role?: string;
  status?: string;
}

// NEW: Interface for user availability
export interface UserAvailability {
  userId: string;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
  lastSeenAt: string;
  sessionId?: string;
  ipAddress?: string;
  deviceInfo?: string;
}