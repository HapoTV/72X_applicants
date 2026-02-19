// src/pages/adminDashboard/tabs/components/types.ts
import type { User } from '../../../../interfaces/UserData';
import type { UserSubscriptionData } from '../../../../interfaces/UserSubscriptionData';

export interface UserWithSubscription extends User {
  subscription?: UserSubscriptionData | null;
  isOnline: boolean;
  lastActive: string;
}

export interface StatsData {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  offlineUsers: number;
  inactiveUsers: number;
  freeTrialUsers: number;
  totalOrganisations: number;
  adminsCount: number;
  usersCount: number;
}

export interface UserFilters {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  organisationFilter: string;
}

export interface NewUserData {
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  organisation: string;
  employees: string;
  founded: string;
  industry: string;
  location: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'USER';
  status: string;
}