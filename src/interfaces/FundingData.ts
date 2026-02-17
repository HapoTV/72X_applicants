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
  industry?: string;
  type?: string;
  createdBy: string;
  createdByUserId?: string; // New field
  organisation?: string; // New field: Organisation that can see this funding
  isPublic?: boolean; // New field: If true, visible to all organisations
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
  industry: string;
  type: string;
  organisation?: string; // New field
  isPublic?: boolean; // New field
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
  industry?: string;
  type?: string;
  organisation?: string; // New field
  isPublic?: boolean; // New field
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
  industry?: string;
  type?: string;
  organisation?: string; // New field
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
  industry?: string;
  type?: string;
  createdBy: string;
  createdByUserId?: string;
  organisation?: string;
  isPublic?: boolean;
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
  industry?: string;
  type?: string;
  createdBy: string;
  createdByUserId?: string;
  organisation?: string;
  isPublic?: boolean;
}

/**
 * Industry options for dropdowns
 */
export const IndustryOptions = [
  { value: '', label: 'Select Industry' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Education', label: 'Education' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Tourism', label: 'Tourism' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Media', label: 'Media & Entertainment' },
  { value: 'Other', label: 'Other' }
];

/**
 * Type options
 */
export const TypeOptions = [
  { value: '', label: 'Select Type' },
  { value: 'GRANT', label: 'Grant' },
  { value: 'LOAN', label: 'Loan' },
  { value: 'COMPETITION', label: 'Competition' },
  { value: 'ACCELERATOR', label: 'Accelerator' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'CROWDFUNDING', label: 'Crowdfunding' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'FELLOWSHIP', label: 'Fellowship' },
  { value: 'OTHER', label: 'Other' }
];

/**
 * Default values
 */
export const DEFAULT_INDUSTRY = '';
export const DEFAULT_TYPE = '';