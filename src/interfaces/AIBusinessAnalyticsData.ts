// src/interfaces/AIBusinessAnalyticsData.ts

// ==================== AI ANALYSIS TYPES ====================
export type AnalysisType = 
  | 'business_performance'
  | 'growth_opportunities'
  | 'cash_flow_optimization'
  | 'market_expansion'
  | 'competitive_analysis'
  | 'risk_assessment'
  | 'financial_health'
  | 'operational_efficiency'
  | 'customer_insights'
  | 'marketing_strategy'
  | 'product_development'
  | 'cost_reduction'
  | 'revenue_optimization'
  | 'custom';

  export interface FileAnalysisRequest {
  documentId?: string;
  fileUrl?: string;
  analysisType?: AnalysisType;
  query?: string;
  businessContext?: BusinessContext;
  includeRecommendations?: boolean;
  includeDataVisualization?: boolean;
  language?: string;
  userId: string;
  customPrompt?: string;
}

export interface AvailableDocument {
  documentId: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedDate: string; // Formatted date
  description?: string;
  mimeType?: string;
  status?: 'active' | 'archived' | 'processing' | 'failed';
  extractedData?: ExtractedDocumentData;
  thumbnailUrl?: string; // For image previews
  isSelected?: boolean; // For UI selection state
}

export interface ExtractedDocumentData {
  hasContent?: boolean;
  contentLength?: number;
  extractedText?: string;
  detectedEntities?: string[];
  metadata?: {
    pageCount?: number;
    author?: string;
    createdDate?: string;
    modifiedDate?: string;
    keywords?: string[];
  };
  financialData?: {
    revenue?: number;
    expenses?: number;
    profit?: number;
    period?: string;
  };
  customerData?: {
    customerCount?: number;
    retentionRate?: number;
    avgValue?: number;
  };
}

export const ANALYSIS_TYPE_OPTIONS: { value: AnalysisType; label: string; description: string }[] = [
  { value: 'business_performance', label: 'Business Performance', description: 'Comprehensive analysis of overall business metrics' },
  { value: 'growth_opportunities', label: 'Growth Opportunities', description: 'Identify potential areas for business expansion' },
  { value: 'cash_flow_optimization', label: 'Cash Flow Optimization', description: 'Improve financial liquidity and cash management' },
  { value: 'market_expansion', label: 'Market Expansion', description: 'Strategies for entering new markets' },
  { value: 'competitive_analysis', label: 'Competitive Analysis', description: 'Analyze market position vs competitors' },
  { value: 'risk_assessment', label: 'Risk Assessment', description: 'Identify and mitigate business risks' },
  { value: 'financial_health', label: 'Financial Health', description: 'Comprehensive financial analysis and recommendations' },
  { value: 'operational_efficiency', label: 'Operational Efficiency', description: 'Optimize business processes and operations' },
  { value: 'customer_insights', label: 'Customer Insights', description: 'Deep dive into customer behavior and preferences' },
  { value: 'marketing_strategy', label: 'Marketing Strategy', description: 'Develop effective marketing approaches' },
  { value: 'product_development', label: 'Product Development', description: 'Innovation and product improvement strategies' },
  { value: 'cost_reduction', label: 'Cost Reduction', description: 'Identify opportunities to reduce expenses' },
  { value: 'revenue_optimization', label: 'Revenue Optimization', description: 'Maximize revenue generation strategies' },
  { value: 'custom', label: 'Custom Analysis', description: 'Tailored analysis based on specific needs' }
];

// ==================== AI ANALYSIS REQUEST ====================
export interface AIAnalysisRequest {
  query: string;
  analysisType: AnalysisType;
  businessContext?: BusinessContext;
  dataSources?: DataSource[];
  timeRange?: string;
  priority?: 'low' | 'medium' | 'high';
  includeRecommendations?: boolean;
  includeDataVisualization?: boolean;
  language?: string;
  userId: string;
}

export interface BusinessContext {
  industry: string;
  businessSize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  revenueRange: string;
  employeeCount: string;
  businessModel: string;
  targetMarket: string;
  geographicLocation: string;
  yearsInOperation: number;
  currentChallenges?: string[];
  businessGoals?: string[];
}

export interface DataSource {
  type: 'financial' | 'sales' | 'customer' | 'marketing' | 'operations' | 'inventory' | 'hr' | 'custom';
  name: string;
  description?: string;
  isActive: boolean;
  lastUpdated?: string;
  dataPoints?: number;
}

// ==================== AI ANALYSIS RESPONSE ====================
export interface AIAnalysisResponse {
  analysisId: string;
  query: string;
  analysisType: AnalysisType;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  generatedAt: string;
  processingTime?: number;
  confidence?: number;
  summary: string;
  detailedAnalysis: string;
  insights: AnalysisInsight[];
  recommendations: Recommendation[];
  dataVisualizations?: DataVisualization[];
  riskFactors?: RiskFactor[];
  opportunities?: Opportunity[];
  actionItems?: ActionItem[];
  relevantMetrics?: Metric[];
  sources?: string[];
  disclaimer: string;
  nextSteps?: string[];
  followUpQuestions?: string[];
}

export interface AnalysisInsight {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  supportingData?: string;
  actionRequired?: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedImpact: string;
  implementationTime: string;
  requiredResources: string[];
  costEstimate?: string;
  riskLevel: 'low' | 'medium' | 'high';
  successMetrics: string[];
  steps: string[];
}

export interface DataVisualization {
  id: string;
  type: 'chart' | 'graph' | 'table' | 'heatmap' | 'dashboard';
  title: string;
  description: string;
  data: any;
  config: VisualizationConfig;
  insights?: string[];
}

export interface VisualizationConfig {
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'radar';
  xAxis: string;
  yAxis: string;
  colors?: string[];
  filters?: Record<string, any>;
  interactive?: boolean;
}

export interface RiskFactor {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'operational' | 'strategic' | 'compliance' | 'reputational';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation?: string;
  monitoringRequired?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'market' | 'product' | 'operational' | 'financial' | 'strategic';
  potentialValue: string;
  timeToMarket: string;
  requiredInvestment?: string;
  competitiveAdvantage?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimatedHours?: number;
  dependencies?: string[];
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  trend?: 'up' | 'down' | 'stable';
  benchmark?: number;
  category: string;
}

// ==================== ANALYSIS HISTORY ====================
export interface AnalysisHistory {
  analysisId: string;
  query: string;
  analysisType: AnalysisType;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  summary?: string;
  confidence?: number;
  isBookmarked?: boolean;
  tags?: string[];
}

// ==================== QUICK PROMPTS ====================
export interface QuickPrompt {
  id: string;
  text: string;
  category: AnalysisType;
  icon?: string;
  popularity: number;
  isRecommended?: boolean;
}

export const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: 'Analyze my business performance', category: 'business_performance', popularity: 95, isRecommended: true },
  { id: '2', text: 'What are growth opportunities?', category: 'growth_opportunities', popularity: 88, isRecommended: true },
  { id: '3', text: 'How can I improve cash flow?', category: 'cash_flow_optimization', popularity: 82, isRecommended: true },
  { id: '4', text: 'Market expansion strategies', category: 'market_expansion', popularity: 76, isRecommended: false },
  { id: '5', text: 'Competitive analysis', category: 'competitive_analysis', popularity: 71, isRecommended: false },
  { id: '6', text: 'Risk assessment', category: 'risk_assessment', popularity: 68, isRecommended: false },
  { id: '7', text: 'Financial health check', category: 'financial_health', popularity: 85, isRecommended: true },
  { id: '8', text: 'Operational efficiency', category: 'operational_efficiency', popularity: 64, isRecommended: false },
  { id: '9', text: 'Customer insights', category: 'customer_insights', popularity: 79, isRecommended: true },
  { id: '10', text: 'Marketing strategy', category: 'marketing_strategy', popularity: 73, isRecommended: false }
];

// ==================== FORM DATA ====================
export interface AnalysisFormData {
  query: string;
  analysisType: AnalysisType;
  businessContext: BusinessContext;
  includeRecommendations: boolean;
  includeDataVisualization: boolean;
  language: string;
}

export interface BusinessContextFormData {
  industry: string;
  businessSize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  revenueRange: string;
  employeeCount: string;
  businessModel: string;
  targetMarket: string;
  geographicLocation: string;
  yearsInOperation: number;
  currentChallenges: string;
  businessGoals: string;
}

// ==================== API RESPONSES ====================
export interface AIAnalysisApiResponse {
  analysisId: string;
  query: string;
  analysisType: AnalysisType;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  generatedAt: string;
  processingTime?: number;
  confidence?: number;
  summary: string;
  detailedAnalysis: string;
  insights: AnalysisInsight[];
  recommendations: Recommendation[];
  dataVisualizations?: DataVisualization[];
  riskFactors?: RiskFactor[];
  opportunities?: Opportunity[];
  actionItems?: ActionItem[];
  relevantMetrics?: Metric[];
  sources?: string[];
  disclaimer: string;
  nextSteps?: string[];
  followUpQuestions?: string[];
  createdBy: string;
}

// ==================== REQUEST PAYLOADS ====================
export interface AIAnalysisRequestPayload {
  query: string;
  analysisType: AnalysisType;
  businessContext?: BusinessContext;
  dataSources?: DataSource[];
  timeRange?: string;
  priority?: 'low' | 'medium' | 'high';
  includeRecommendations?: boolean;
  includeDataVisualization?: boolean;
  language?: string;
  createdBy: string;
}
