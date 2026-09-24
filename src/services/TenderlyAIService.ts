import axiosClient from '../api/axiosClient';
import type { TenderItem } from '../interfaces/TenderlyAIData';

export interface TenderFilter {
  search?: string;
  searchTerm?: string;
  industries?: string[];
  province?: string;
  status?: string;
  closingFrom?: string | null;
  closingTo?: string | null;
  page?: number;
  size?: number;
}

export interface TenderResponse {
  success: boolean;
  data: TenderItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

class TenderlyAIService {
  async listTenders(
    filters: TenderFilter = {}
  ): Promise<TenderResponse> {
    const response = await axiosClient.post<TenderResponse>(
      '/tenderly/tenders',
      {
        search: filters.searchTerm ?? filters.search ?? '',
        industries: filters.industries ?? [],
        province: filters.province ?? '',
        status: filters.status ?? '',
        closingFrom: filters.closingFrom ?? null,
        closingTo: filters.closingTo ?? null,
        page: filters.page ?? 0,
        size: filters.size ?? 10,
      }
    );

    return response.data;
  }

  async getTender(id: string): Promise<TenderItem> {
    const response = await axiosClient.get<{
      success: boolean;
      data: TenderItem;
    }>(`/tenderly/tenders/${id}`);

    return response.data.data;
  }

  async getSavedTenders(): Promise<TenderItem[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: TenderItem[];
      count: number;
    }>('/tenderly/saved');

    return response.data.data;
  }

  async saveTender(id: string): Promise<void> {
    await axiosClient.post(`/tenderly/tenders/${id}/save`);
  }

  async unsaveTender(id: string): Promise<void> {
    await axiosClient.delete(`/tenderly/tenders/${id}/save`);
  }

  async getStats() {
    const response = await axiosClient.get<{
      success: boolean;
      data: unknown;
    }>('/tenderly/stats');

    return response.data.data;
  }

  async getIndustries(): Promise<string[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: string[];
    }>('/tenderly/industries');

    return response.data.data;
  }

  async getProvinces(): Promise<string[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: string[];
    }>('/tenderly/provinces');

    return response.data.data;
  }
}

export default new TenderlyAIService();
