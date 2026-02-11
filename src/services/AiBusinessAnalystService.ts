// src/services/AiBusinessAnalystService.ts
// Thin service wrapper around the AI Business Analyst backend

import type { AnalysisRequest, AnalysisResponse, UsageStats } from './aiBusinessAnalystTypes';

const API_BASE = 'http://localhost:8080/api/ai-analyst';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('❌ Response error:', response.status, response.statusText, errorText);
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text().catch(() => '');
    console.warn('⚠️ Response is not JSON:', text);
    throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
  }

  const data = (await response.json()) as T | null;
  if (!data) {
    throw new Error('Server returned empty response');
  }

  return data;
}

export const aiBusinessAnalystService = {
  async fetchUsage(): Promise<UsageStats | null> {
    try {
      return await requestJson<UsageStats>(`${API_BASE}/usage`);
    } catch (err) {
      console.error('Failed to fetch usage stats:', err);
      return null;
    }
  },

  async analyze(query: string, analysisType: AnalysisRequest['analysisType']): Promise<AnalysisResponse> {
    console.log('🔍 Sending request to:', `${API_BASE}/analyze`);

    const data = await requestJson<AnalysisResponse>(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, analysisType }),
    });

    console.log('✅ Response data:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.analysis) {
      throw new Error('Analysis field missing in response');
    }

    return data;
  },
};
