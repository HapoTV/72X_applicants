// src/interfaces/DataInputData.ts

export interface FinancialData {
  revenue: number;
  expenses: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  date: string; // ISO string
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  retentionRate: number;
  avgCustomerValue: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  date: string; // ISO string
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DataInputFormData {
  // Financial Data Form
  revenue: string;
  expenses: string;
  period: string;
  date: string;
  
  // Customer Data Form
  customers: string;
  newCustomers: string;
  retentionRate: string;
  avgCustomerValue: string;
}

export interface UploadedFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  uploadedAt: string;
  userId: string;
  status: 'uploading' | 'completed' | 'failed';
}

export interface DataInputMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalCustomers: number;
  avgCustomerValue: number;
  revenueGrowth: number;
  customerGrowth: number;
  profitMargin: number;
  dataPoints: number;
  lastUpdated: string;
}

export interface DataInputAnalytics {
  revenueOverTime: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  customerGrowth: Array<{
    month: string;
    customers: number;
    newCustomers: number;
  }>;
  topExpenses: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface DataValidationRule {
  field: string;
  required: boolean;
  type: 'number' | 'string' | 'date';
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage: string;
}

export interface DataInputValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface DataInputApiResponse {
  success: boolean;
  message: string;
  data?: FinancialData | CustomerData | UploadedFile;
  errors?: string[];
}

// Admin-specific interfaces
export interface AdminDataInputItem {
  id: string;
  type: 'financial' | 'customer' | 'file';
  userId: string;
  userEmail: string;
  data: FinancialData | CustomerData | UploadedFile;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDataInputItem {
  id: string;
  type: 'financial' | 'customer' | 'file';
  data: FinancialData | CustomerData | UploadedFile;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DataInputRequest {
  type: 'financial' | 'customer';
  data: FinancialData | CustomerData;
}

export interface DataInputStats {
  totalDataPoints: number;
  financialEntries: number;
  customerEntries: number;
  uploadedFiles: number;
  totalUsers: number;
  activeUsers: number;
  averageRevenue: number;
  averageCustomers: number;
}

export interface FileUploadMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'excel' | 'csv' | 'image' | 'other';
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  userId: string;
  extractedData?: {
    revenue?: number;
    expenses?: number;
    customers?: number;
    period?: string;
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  document?: UploadedDocument;
  errors?: string[];
}