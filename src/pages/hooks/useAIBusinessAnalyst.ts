// src/pages/hooks/useAIBusinessAnalyst.ts
import { useEffect, useState } from 'react';
import { aiBusinessAnalystService } from '../../services/AiBusinessAnalystService';

import type { AnalysisTypeId, UsageStats } from '../../services/aiBusinessAnalystTypes';

export function useAIBusinessAnalyst() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisTypeId>('REQUIREMENT_ANALYSIS');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    const data = await aiBusinessAnalystService.fetchUsage();
    if (data) {
      setUsageStats(data);
      setTokensUsed(data.tokensUsed || 0);
    }
  };

  const runAnalysis = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await aiBusinessAnalystService.analyze(query, analysisType);
      setAnalysis(data.analysis);
      setTokensUsed(data.totalTokensUsed || data.tokensUsed || 0);
      await fetchUsageStats();
    } catch (err: any) {
      console.error('💥 Analysis error:', err);
      let message = err.message || 'An error occurred while analyzing your query.';

      if (message.includes('Failed to fetch')) {
        message = 'Cannot connect to backend. Make sure Spring Boot is running on port 8080.';
      } else if (message.includes('Unexpected end of JSON')) {
        message = 'Backend returned empty response. Check server logs for errors.';
      }

      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    query,
    setQuery,
    isAnalyzing,
    analysis,
    analysisType,
    setAnalysisType,
    tokensUsed,
    usageStats,
    error,
    runAnalysis,
  };
}
