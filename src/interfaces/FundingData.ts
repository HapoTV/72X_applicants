// src/interfaces/FundingData.ts
export interface Funding {
  fundingId: string;
  title: string;
  provider: string;
  deadline?: string; // ISO string for API compatibility
  description?: string;
  eligibilityCriteria?: string;
  fundingAmount?: string;
  contactInfo?: string;
  applicationUrl?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FundingFormData {
  title: string;
  provider: string;
  deadline: string; // YYYY-MM-DD
  description: string;
  eligibilityCriteria: string;
  fundingAmount: string;
  contactInfo: string;
  applicationUrl: string;
}

export interface AdminFundingItem {
  id: string;
  title: string;
  provider: string;
  deadline?: string; // Formatted date
  description?: string;
  fundingAmount?: string;
  contactInfo?: string;
  applicationUrl?: string;
  createdBy: string;
}

export interface UserFundingItem {
  id: string;
  title: string;
  provider: string;
  deadline?: string; // Formatted date
  fundingAmount?: string;
  description?: string;
  applicationUrl?: string;
  contactInfo?: string;
  daysLeft?: number;
  isExpired?: boolean;
}

/**
 * API Response structure for funding
 */
export interface FundingApiResponse {
  fundingId: string;
  title: string;
  provider: string;
  deadline?: string;
  description?: string;
  eligibilityCriteria?: string;
  fundingAmount?: string;
  contactInfo?: string;
  applicationUrl?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating/updating funding
 */
export interface FundingRequest {
  title: string;
  provider: string;
  deadline?: string;
  description?: string;
  eligibilityCriteria?: string;
  fundingAmount?: string;
  contactInfo?: string;
  applicationUrl?: string;
  createdBy: string;
}