// src/pages/hooks/useAIBusinessAnalyst.ts
import { useEffect, useState } from 'react';
import { aiBusinessAnalystService } from '../../services/AiBusinessAnalystService';

import type { AnalysisTypeId, UsageStats } from '../../services/aiBusinessAnalystTypes';

export function useAIBusinessAnalyst() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  type Message = { role: 'user' | 'assistant'; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
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

  const runAnalysis = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? query) || '';
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    // Append user message to history
    const userMessage: Message = { role: 'user', text: q.trim() };
    setMessages((m) => [...m, userMessage]);

    try {
      const data = await aiBusinessAnalystService.analyze(q, analysisType);
      const assistantText = data.analysis;

      // Append assistant response to history
      const assistantMessage: Message = { role: 'assistant', text: assistantText };
      setMessages((m) => [...m, assistantMessage]);
      setQuery('');

      setTokensUsed(data.totalTokensUsed || data.tokensUsed || 0);
      await fetchUsageStats();
    } catch (err: any) {
      console.error('💥 Analysis error:', err);
      let message =
        err.response?.data?.error ||
        err.message ||
        'An error occurred while analyzing your query.';

      if (message.includes('Failed to fetch')) {
        message = 'Cannot connect to backend. Make sure Spring Boot is running on port 8080.';
      } else if (message.includes('timeout') || message.includes('Timeout')) {
        message = 'The AI analysis is taking longer than expected. Please try again.';
      } else if (message.includes('Unexpected end of JSON')) {
        message = 'Backend returned empty response. Check server logs for errors.';
      }

      setError(message);
    } finally {
      setIsAnalyzing(false);
      // leave query in input for quick edits / follow-ups — caller may clear if desired
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setQuery('');
    setTokensUsed(0);
  };

  return {
    query,
    setQuery,
    isAnalyzing,
    // backward-compatible single analysis string (latest assistant message)
    analysis: messages.length ? messages.filter((m) => m.role === 'assistant').map(m => m.text).join('\n\n') : null,
    analysisType,
    setAnalysisType,
    messages,
    tokensUsed,
    usageStats,
    error,
    runAnalysis,
    clearConversation,
  };
}
