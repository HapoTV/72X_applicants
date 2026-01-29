// src/interfaces/UserSubscriptionData.ts

export interface UserSubscriptionData {
  id: string;
  userEmail: string;
  subscriptionType: UserSubscriptionType;
  isActive: boolean;
  trialEndsAt?: string | null;
  subscriptionEndsAt?: string | null;
  planName: string;
  monthlyPrice: number;
  storageLimit: string;
  apiCallsLimit: number;
  currentApiCalls: number;
  lastPaymentDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageSelectionData {
  packageType: UserSubscriptionType;
  amount?: number;
  currency?: string;
  paymentMethodId?: string;
  paymentIntentId?: string;
}

export const UserSubscriptionType = {
  START_UP: 'START_UP',
  ESSENTIAL: 'ESSENTIAL',
  PREMIUM: 'PREMIUM'
} as const;

export type UserSubscriptionType = typeof UserSubscriptionType[keyof typeof UserSubscriptionType];

export interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  backendType: UserSubscriptionType;
}