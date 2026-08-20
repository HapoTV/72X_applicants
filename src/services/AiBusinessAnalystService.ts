// src/services/AiBusinessAnalystService.ts
// Thin service wrapper around the AI Business Analyst backend

import axiosClient from '../api/axiosClient';
import type { AnalysisRequest, AnalysisResponse, UsageStats } from './aiBusinessAnalystTypes';

export const aiBusinessAnalystService = {
  async fetchUsage(): Promise<UsageStats | null> {
    try {
      const response = await axiosClient.get('/ai-analytics/usage');
      return response.data as UsageStats;
    } catch (err) {
      console.error('Failed to fetch usage stats:', err);
      return null;
    }
  },

  async analyze(query: string, analysisType: AnalysisRequest['analysisType']): Promise<AnalysisResponse> {
    console.log('🔍 Sending request to:', '/ai-analytics/analyze');
    const response = await axiosClient.post(
      '/ai-analytics/analyze',
      { query, analysisType },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );
    const data = response.data as AnalysisResponse & {
      detailedAnalysis?: string;
      success?: boolean;
      error?: string;
    };

    console.log('✅ Response data:', data);

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.success && data?.success !== undefined) {
      throw new Error('Analysis request failed');
    }

    const analysisText = data.analysis || data.detailedAnalysis;
    if (!analysisText) {
      throw new Error('Analysis field missing in response');
    }

    return {
      analysis: analysisText,
      totalTokensUsed: data.totalTokensUsed,
      tokensUsed: data.tokensUsed,
    };
  },
};
