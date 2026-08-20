import axiosClient from '../api/axiosClient';
import type { TenderItem } from '../interfaces/TenderlyAIData';

class TenderlyAIService {
  async listTenders(): Promise<TenderItem[]> {
    const response = await axiosClient.get('/tenderly-ai/tenders');
    return response.data || [];
  }
}

export default new TenderlyAIService();
