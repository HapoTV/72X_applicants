// src/services/AiBusinessAnalystService.ts
// Thin service wrapper around the AI Business Analyst backend

import axiosClient from '../api/axiosClient';
import type { AnalysisRequest, AnalysisResponse, UsageStats } from './aiBusinessAnalystTypes';

export const aiBusinessAnalystService = {
  async fetchUsage(): Promise<UsageStats | null> {
    try {
      const response = await axiosClient.get('/ai-analyst/usage');
      return response.data as UsageStats;
    } catch (err) {
      console.error('Failed to fetch usage stats:', err);
      return null;
    }
  },

  async analyze(query: string, analysisType: AnalysisRequest['analysisType']): Promise<AnalysisResponse> {
    console.log('🔍 Sending request to:', '/ai-analyst/analyze');

    const response = await axiosClient.post('/ai-analyst/analyze', { query, analysisType });
    const data = response.data as AnalysisResponse;

    console.log('✅ Response data:', data);

    if ((data as any)?.error) {
      throw new Error((data as any).error);
    }

    if (!(data as any)?.analysis) {
      throw new Error('Analysis field missing in response');
    }

    return data;
  },
};
