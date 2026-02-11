export type AnalysisTypeId =
  | 'REQUIREMENT_ANALYSIS'
  | 'USER_STORY'
  | 'SWOT_ANALYSIS'
  | 'MARKET_RESEARCH'
  | 'FINANCIAL_PROJECTION'
  | 'RISK_ASSESSMENT';

export interface AnalysisRequest {
  query: string;
  analysisType: AnalysisTypeId;
}

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
