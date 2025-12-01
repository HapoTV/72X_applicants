// src/interfaces/ApplicationData.ts

export interface Application {
  applicationId: string;
  applicationNumber: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO string for LocalDateTime
  reviewedAt?: string; // ISO string for LocalDateTime
  reviewNotes?: string;
}

export interface CreateApplicationRequest {
  userId: string;
  applicationNumber?: string; // Can be generated if not provided
  // Add other required fields based on your domain
  // Example:
  // jobId?: string;
  // resume?: string;
  // coverLetter?: string;
  // additionalInfo?: Record<string, any>;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  reviewNotes?: string;
}

export type ApplicationStatus = 
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

// For search functionality
export interface ApplicationFilter {
  applicationNumber?: string;
  userEmail?: string;
  userFullName?: string;
  status?: ApplicationStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// For paginated responses
export interface PaginatedApplications {
  content: Application[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}