export type TenderStatus = 'OPEN' | 'EXPIRED';

export interface TenderItem {
  id: string;
  title: string;
  buyer: string;
  province: string;
  industry: string;
  publishedAt: string;
  closingAt: string;
  source: string;
  documentsCount: number;
  status: TenderStatus;

  // Backend fields
  referenceNumber?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
  isViewed?: boolean;
}

export interface TenderSearchFilters {
  searchTerm?: string;
  province?: string;
  industry?: string;
  status?: TenderStatus | 'ALL';
}