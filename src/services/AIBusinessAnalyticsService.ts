// src/services/AIBusinessAnalyticsService.ts
import axiosClient from '../api/axiosClient';
import type { 
  AnalysisType,
  AIAnalysisRequest,
  BusinessContext,
  DataSource,
  AIAnalysisResponse,
  AnalysisHistory,
  QuickPrompt,
  AnalysisFormData,
  BusinessContextFormData,
  AIAnalysisRequestPayload
} from '../interfaces/AIBusinessAnalyticsData';
import { DEFAULT_QUICK_PROMPTS } from '../interfaces/AIBusinessAnalyticsData';

/**
 * Service layer for handling all AI Business Analytics operations
 */
class AIBusinessAnalyticsService {
  
  // ==================== AI ANALYSIS OPERATIONS ====================

  /**
   * Submit AI analysis request
   */
  async submitAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const payload: AIAnalysisRequestPayload = {
        query: request.query,
        analysisType: request.analysisType,
        businessContext: request.businessContext,
        dataSources: request.dataSources,
        timeRange: request.timeRange,
        priority: request.priority,
        includeRecommendations: request.includeRecommendations,
        includeDataVisualization: request.includeDataVisualization,
        language: request.language,
        createdBy: request.userId
      };

      const response = await axiosClient.post('/ai-analytics/analyze', payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting AI analysis:', error);
      throw new Error('Failed to submit AI analysis');
    }
  }

  /**
   * Get analysis by ID
   */
  async getAnalysisById(analysisId: string): Promise<AIAnalysisResponse> {
    try {
      const response = await axiosClient.get(`/ai-analytics/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw new Error('Failed to fetch analysis');
    }
  }

  /**
   * Get analysis status
   */
  async getAnalysisStatus(analysisId: string): Promise<'processing' | 'completed' | 'failed' | 'cancelled'> {
    try {
      const response = await axiosClient.get(`/ai-analytics/analysis/${analysisId}/status`);
      return response.data.status;
    } catch (error) {
      console.error('Error fetching analysis status:', error);
      throw new Error('Failed to fetch analysis status');
    }
  }

  /**
   * Cancel analysis
   */
  async cancelAnalysis(analysisId: string, userId: string): Promise<void> {
    try {
      await axiosClient.post(`/ai-analytics/analysis/${analysisId}/cancel`, { userId });
    } catch (error) {
      console.error('Error cancelling analysis:', error);
      throw new Error('Failed to cancel analysis');
    }
  }

  /**
   * Retry failed analysis
   */
  async retryAnalysis(analysisId: string, userId: string): Promise<AIAnalysisResponse> {
    try {
      const response = await axiosClient.post(`/ai-analytics/analysis/${analysisId}/retry`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error retrying analysis:', error);
      throw new Error('Failed to retry analysis');
    }
  }

  // ==================== ANALYSIS HISTORY ====================

  /**
   * Get user's analysis history
   */
  async getAnalysisHistory(userId: string, limit: number = 50): Promise<AnalysisHistory[]> {
    try {
      const response = await axiosClient.get(`/ai-analytics/history/${userId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      throw new Error('Failed to fetch analysis history');
    }
  }

  /**
   * Bookmark analysis
   */
  async bookmarkAnalysis(analysisId: string, userId: string): Promise<void> {
    try {
      await axiosClient.post(`/ai-analytics/analysis/${analysisId}/bookmark`, { userId });
    } catch (error) {
      console.error('Error bookmarking analysis:', error);
      throw new Error('Failed to bookmark analysis');
    }
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(analysisId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete(`/ai-analytics/analysis/${analysisId}/bookmark`, {
        params: { userId }
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw new Error('Failed to remove bookmark');
    }
  }

  /**
   * Delete analysis
   */
  async deleteAnalysis(analysisId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete(`/ai-analytics/analysis/${analysisId}`, {
        params: { userId }
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw new Error('Failed to delete analysis');
    }
  }

  // ==================== QUICK PROMPTS ====================

  /**
   * Get quick prompts
   */
  async getQuickPrompts(category?: AnalysisType): Promise<QuickPrompt[]> {
    try {
      const response = await axiosClient.get('/ai-analytics/prompts', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quick prompts:', error);
      // Return default prompts as fallback
      return category 
        ? DEFAULT_QUICK_PROMPTS.filter(prompt => prompt.category === category)
        : DEFAULT_QUICK_PROMPTS;
    }
  }

  /**
   * Create custom prompt
   */
  async createCustomPrompt(prompt: Omit<QuickPrompt, 'id' | 'popularity' | 'createdAt'>, userId: string): Promise<QuickPrompt> {
    try {
      const response = await axiosClient.post('/ai-analytics/prompts/custom', {
        ...prompt,
        createdBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating custom prompt:', error);
      throw new Error('Failed to create custom prompt');
    }
  }

  /**
   * Update custom prompt
   */
  async updateCustomPrompt(promptId: string, prompt: Partial<QuickPrompt>, userId: string): Promise<QuickPrompt> {
    try {
      const response = await axiosClient.put(`/ai-analytics/prompts/custom/${promptId}`, {
        ...prompt,
        updatedBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating custom prompt:', error);
      throw new Error('Failed to update custom prompt');
    }
  }

  /**
   * Delete custom prompt
   */
  async deleteCustomPrompt(promptId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete(`/ai-analytics/prompts/custom/${promptId}`, {
        params: { userId }
      });
    } catch (error) {
      console.error('Error deleting custom prompt:', error);
      throw new Error('Failed to delete custom prompt');
    }
  }

  // ==================== BUSINESS CONTEXT ====================

  /**
   * Get user's business context
   */
  async getBusinessContext(userId: string): Promise<BusinessContext> {
    try {
      const response = await axiosClient.get(`/ai-analytics/context/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business context:', error);
      throw new Error('Failed to fetch business context');
    }
  }

  /**
   * Update business context
   */
  async updateBusinessContext(context: BusinessContext, userId: string): Promise<BusinessContext> {
    try {
      const response = await axiosClient.put(`/ai-analytics/context/${userId}`, {
        ...context,
        updatedBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating business context:', error);
      throw new Error('Failed to update business context');
    }
  }

  // ==================== DATA SOURCES ====================

  /**
   * Get available data sources
   */
  async getDataSources(userId: string): Promise<DataSource[]> {
    try {
      const response = await axiosClient.get(`/ai-analytics/data-sources/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data sources:', error);
      throw new Error('Failed to fetch data sources');
    }
  }

  /**
   * Add data source
   */
  async addDataSource(dataSource: Omit<DataSource, 'lastUpdated' | 'dataPoints'>, userId: string): Promise<DataSource> {
    try {
      const response = await axiosClient.post(`/ai-analytics/data-sources/${userId}`, {
        ...dataSource,
        createdBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding data source:', error);
      throw new Error('Failed to add data source');
    }
  }

  /**
   * Update data source
   */
  async updateDataSource(sourceId: string, dataSource: Partial<DataSource>, userId: string): Promise<DataSource> {
    try {
      const response = await axiosClient.put(`/ai-analytics/data-sources/${userId}/${sourceId}`, {
        ...dataSource,
        updatedBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating data source:', error);
      throw new Error('Failed to update data source');
    }
  }

  /**
   * Delete data source
   */
  async deleteDataSource(sourceId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete(`/ai-analytics/data-sources/${userId}/${sourceId}`);
    } catch (error) {
      console.error('Error deleting data source:', error);
      throw new Error('Failed to delete data source');
    }
  }

  // ==================== ANALYTICS SETTINGS ====================

  /**
   * Get analytics settings
   */
  async getAnalyticsSettings(userId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`/ai-analytics/settings/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics settings:', error);
      throw new Error('Failed to fetch analytics settings');
    }
  }

  /**
   * Update analytics settings
   */
  async updateAnalyticsSettings(settings: any, userId: string): Promise<any> {
    try {
      const response = await axiosClient.put(`/ai-analytics/settings/${userId}`, {
        ...settings,
        updatedBy: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating analytics settings:', error);
      throw new Error('Failed to update analytics settings');
    }
  }

  // ==================== USAGE STATISTICS ====================

  /**
   * Get usage statistics
   */
  async getUsageStatistics(userId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`/ai-analytics/usage/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching usage statistics:', error);
      throw new Error('Failed to fetch usage statistics');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform form data to analysis request
   */
  transformToAnalysisRequest(formData: AnalysisFormData, userId: string): AIAnalysisRequest {
    return {
      query: formData.query,
      analysisType: formData.analysisType,
      businessContext: formData.businessContext,
      includeRecommendations: formData.includeRecommendations,
      includeDataVisualization: formData.includeDataVisualization,
      language: formData.language,
      userId
    };
  }

  /**
   * Transform business context form data
   */
  transformToBusinessContext(formData: BusinessContextFormData): BusinessContext {
    return {
      industry: formData.industry,
      businessSize: formData.businessSize,
      revenueRange: formData.revenueRange,
      employeeCount: formData.employeeCount,
      businessModel: formData.businessModel,
      targetMarket: formData.targetMarket,
      geographicLocation: formData.geographicLocation,
      yearsInOperation: formData.yearsInOperation,
      currentChallenges: formData.currentChallenges.split(',').map(challenge => challenge.trim()).filter(challenge => challenge.length > 0),
      businessGoals: formData.businessGoals.split(',').map(goal => goal.trim()).filter(goal => goal.length > 0)
    };
  }

  /**
   * Transform business context to form data
   */
  transformToBusinessContextFormData(context: BusinessContext): BusinessContextFormData {
    return {
      industry: context.industry,
      businessSize: context.businessSize,
      revenueRange: context.revenueRange,
      employeeCount: context.employeeCount,
      businessModel: context.businessModel,
      targetMarket: context.targetMarket,
      geographicLocation: context.geographicLocation,
      yearsInOperation: context.yearsInOperation,
      currentChallenges: context.currentChallenges ? context.currentChallenges.join(', ') : '',
      businessGoals: context.businessGoals ? context.businessGoals.join(', ') : ''
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format processing time
   */
  formatProcessingTime(seconds?: number): string {
    if (!seconds) return 'N/A';
    
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  /**
   * Get status color
   */
  getStatusColor(status: 'processing' | 'completed' | 'failed' | 'cancelled'): string {
    switch (status) {
      case 'processing': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get impact color
   */
  getImpactColor(impact: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (impact) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get priority color
   */
  getPriorityColor(priority: 'low' | 'medium' | 'high' | 'urgent'): string {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Validate analysis form
   */
  validateAnalysisForm(formData: AnalysisFormData): string | null {
    if (!formData.query.trim()) {
      return 'Query is required';
    }
    
    if (formData.query.length < 10) {
      return 'Query must be at least 10 characters long';
    }
    
    if (formData.query.length > 1000) {
      return 'Query must not exceed 1000 characters';
    }
    
    if (!formData.analysisType) {
      return 'Analysis type is required';
    }
    
    if (!formData.businessContext.industry) {
      return 'Industry is required';
    }
    
    if (!formData.businessContext.businessSize) {
      return 'Business size is required';
    }
    
    return null; // No errors
  }

  /**
   * Validate business context form
   */
  validateBusinessContextForm(formData: BusinessContextFormData): string | null {
    if (!formData.industry.trim()) {
      return 'Industry is required';
    }
    
    if (!formData.businessSize) {
      return 'Business size is required';
    }
    
    if (!formData.revenueRange.trim()) {
      return 'Revenue range is required';
    }
    
    if (!formData.employeeCount.trim()) {
      return 'Employee count is required';
    }
    
    if (!formData.businessModel.trim()) {
      return 'Business model is required';
    }
    
    if (!formData.targetMarket.trim()) {
      return 'Target market is required';
    }
    
    if (!formData.geographicLocation.trim()) {
      return 'Geographic location is required';
    }
    
    if (formData.yearsInOperation < 0) {
      return 'Years in operation must be positive';
    }
    
    return null; // No errors
  }

  /**
   * Get default business context
   */
  getDefaultBusinessContext(): BusinessContext {
    return {
      industry: '',
      businessSize: 'small',
      revenueRange: '',
      employeeCount: '',
      businessModel: '',
      targetMarket: '',
      geographicLocation: '',
      yearsInOperation: 0,
      currentChallenges: [],
      businessGoals: []
    };
  }

  /**
   * Get default analysis form data
   */
  getDefaultAnalysisFormData(): AnalysisFormData {
    return {
      query: '',
      analysisType: 'business_performance',
      businessContext: this.getDefaultBusinessContext(),
      includeRecommendations: true,
      includeDataVisualization: true,
      language: 'en'
    };
  }
}

// Export as singleton instance
export const aiBusinessAnalyticsService = new AIBusinessAnalyticsService();
export default aiBusinessAnalyticsService;
