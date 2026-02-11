// src/services/AiBusinessAnalystService.ts
// Thin service wrapper around the AI Business Analyst backend

const API_BASE = 'http://localhost:8080/api/ai-analyst';

export interface AnalysisResponse {
  analysis: string;
  error?: string;
  totalTokensUsed?: number;
  tokensUsed?: number;
}

export interface UsageStats {
  tokensUsed?: number;
  tokensRemaining?: number;
  percentageUsed?: number;
  requestsToday?: number;
  [key: string]: any;
}

export const aiBusinessAnalystService = {
  async fetchUsage(): Promise<UsageStats | null> {
    try {
      const response = await fetch(`${API_BASE}/usage`);
      if (!response.ok) {
        console.error('Failed to fetch usage stats:', response.status, response.statusText);
        return null;
      }
      const data = await response.json();
      return data as UsageStats;
    } catch (err) {
      console.error('Failed to fetch usage stats:', err);
      return null;
    }
  },

  async analyze(query: string, analysisType: string): Promise<AnalysisResponse> {
    console.log('🔍 Sending request to:', `${API_BASE}/analyze`);

    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, analysisType }),
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok?', response.ok);

    const contentType = response.headers.get('content-type');
    console.log('📊 Content-Type:', contentType);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response text:', errorText);
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.warn('⚠️ Response is not JSON:', text);
      throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
    }

    const data = (await response.json()) as AnalysisResponse | null;
    console.log('✅ Response data:', data);

    if (!data) {
      throw new Error('Server returned empty response');
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.analysis) {
      throw new Error('Analysis field missing in response');
    }

    return data;
  },
};
