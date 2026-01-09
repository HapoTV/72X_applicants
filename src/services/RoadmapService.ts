// src/services/RoadmapService.ts
import axiosClient from '../api/axiosClient';
import type { 
  RoadmapFormData,
  AdminRoadmapItem,
  UserRoadmapItem,
  RoadmapApiResponse,
  RoadmapGenerationRequest,
  RoadmapGenerationResponse,
  RoadmapTemplate,
  RoadmapAnalytics
} from '../interfaces/RoadmapData';

/**
 * Service layer for handling all roadmap-related operations
 * Using ONLY actual backend endpoints
 */
class RoadmapService {
  
  // ==================== EXISTING BACKEND ENDPOINTS ====================

  /**
   * Create a new roadmap
   * POST /api/roadmaps?userId={userId}
   */
  async createRoadmap(roadmapData: RoadmapFormData, userId: string): Promise<AdminRoadmapItem> {
    try {
      // Transform to match backend DTO structure
      const roadmapDTO = {
        title: roadmapData.title,
        businessType: roadmapData.businessType,
        industry: roadmapData.industry,
        stage: roadmapData.stage,
        revenue: roadmapData.revenue,
        employees: roadmapData.employees,
        goals: roadmapData.goals,
        timeline: roadmapData.timeline,
        isPublic: roadmapData.isPublic,
        isTemplate: roadmapData.isTemplate,
        status: 'DRAFT' // Backend expects uppercase
      };
      
      const response = await axiosClient.post('/roadmaps', roadmapDTO, {
        params: { userId }
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error creating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user's roadmaps
   * GET /api/roadmaps/user/{userId}
   */
  async getUserRoadmaps(userId: string): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get(`/roadmaps/user/${userId}`);
      return response.data.map((roadmap: any) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error: any) {
      console.error('Error fetching user roadmaps:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user roadmaps';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get public roadmaps
   * GET /api/roadmaps/public
   */
  async getPublicRoadmaps(): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps/public');
      return response.data.map((roadmap: any) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error: any) {
      console.error('Error fetching public roadmaps:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch public roadmaps';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get templates
   * GET /api/roadmaps/templates
   */
  async getTemplates(): Promise<RoadmapTemplate[]> {
    try {
      const response = await axiosClient.get('/roadmaps/templates');
      return response.data.map((template: any) => 
        this.transformToTemplate(template)
      );
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch templates';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get roadmap by ID
   * GET /api/roadmaps/{roadmapId}?userId={userId}
   */
  async getRoadmapById(roadmapId: string, userId: string): Promise<RoadmapApiResponse> {
    try {
      const response = await axiosClient.get(`/roadmaps/${roadmapId}`, {
        params: { userId }
      });
      return this.transformToRoadmapApiResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update roadmap
   * PUT /api/roadmaps/{roadmapId}?userId={userId}
   */
  async updateRoadmap(roadmapId: string, roadmapData: RoadmapFormData, userId: string): Promise<AdminRoadmapItem> {
    try {
      const roadmapDTO = {
        title: roadmapData.title,
        businessType: roadmapData.businessType,
        industry: roadmapData.industry,
        stage: roadmapData.stage,
        revenue: roadmapData.revenue,
        employees: roadmapData.employees,
        goals: roadmapData.goals,
        timeline: roadmapData.timeline,
        isPublic: roadmapData.isPublic,
        isTemplate: roadmapData.isTemplate,
        status: 'ACTIVE'
      };
      
      const response = await axiosClient.put(`/roadmaps/${roadmapId}`, roadmapDTO, {
        params: { userId }
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error updating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete roadmap
   * DELETE /api/roadmaps/{roadmapId}?userId={userId}
   */
  async deleteRoadmap(roadmapId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}`, {
        params: { userId }
      });
    } catch (error: any) {
      console.error('Error deleting roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Duplicate roadmap
   * POST /api/roadmaps/{roadmapId}/duplicate?userId={userId}
   */
  async duplicateRoadmap(roadmapId: string, newTitle: string, userId: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/${roadmapId}/duplicate`, {
        newTitle
      }, {
        params: { userId }
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error duplicating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to duplicate roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Create roadmap from template
   * POST /api/roadmaps/templates/{templateId}/create?userId={userId}
   */
  async createFromTemplate(templateId: string, title: string, userId: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/templates/${templateId}/create`, {
        title
      }, {
        params: { userId }
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error creating roadmap from template:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create roadmap from template';
      throw new Error(errorMessage);
    }
  }

  /**
   * Generate roadmap
   * POST /api/roadmaps/generate
   */
  async generateRoadmap(generationRequest: RoadmapGenerationRequest): Promise<RoadmapGenerationResponse> {
    try {
      const response = await axiosClient.post('/roadmaps/generate', generationRequest);
      return response.data;
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate roadmap';
      throw new Error(errorMessage);
    }
  }

  /**
   * Search roadmaps
   * GET /api/roadmaps/search?query={query}&userId={userId}
   */
  async searchRoadmaps(query: string, userId: string): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps/search', {
        params: { query, userId }
      });
      return response.data.map((roadmap: any) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error: any) {
      console.error('Error searching roadmaps:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to search roadmaps';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get roadmap statistics
   * GET /api/roadmaps/statistics/{userId}
   */
  async getRoadmapStatistics(userId: string): Promise<RoadmapAnalytics> {
    try {
      const response = await axiosClient.get(`/roadmaps/statistics/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching roadmap statistics:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roadmap statistics';
      throw new Error(errorMessage);
    }
  }

  // ==================== DATA TRANSFORMATION ====================

  /**
   * Transform API response to AdminRoadmapItem
   */
  private transformToAdminRoadmapItem(apiRoadmap: any): AdminRoadmapItem {
    const phases = apiRoadmap.phases || [];
    const taskCount = phases.reduce((total: number, phase: any) => 
      total + (phase.tasks?.length || 0), 0);
    const completedTasks = phases.reduce((total: number, phase: any) => 
      total + (phase.tasks?.filter((task: any) => task.status === 'COMPLETED')?.length || 0), 0);
    const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

    return {
      id: apiRoadmap.roadmapId,
      title: apiRoadmap.title,
      businessType: apiRoadmap.businessType,
      industry: apiRoadmap.industry,
      stage: apiRoadmap.stage,
      revenue: apiRoadmap.revenue,
      employees: apiRoadmap.employees,
      goals: apiRoadmap.goals || [],
      timeline: apiRoadmap.timeline,
      phases: phases,
      isPublic: apiRoadmap.isPublic,
      isTemplate: apiRoadmap.isTemplate,
      status: this.mapStatus(apiRoadmap.status),
      progress: progress,
      createdBy: apiRoadmap.createdBy?.fullName || 'Unknown',
      createdAt: apiRoadmap.createdAt,
      updatedAt: apiRoadmap.updatedAt
    };
  }

  /**
   * Transform API response to UserRoadmapItem
   */
  private transformToUserRoadmapItem(apiRoadmap: any): UserRoadmapItem {
    const phases = apiRoadmap.phases || [];
    const phaseCount = phases.length;
    const taskCount = phases.reduce((total: number, phase: any) => 
      total + (phase.tasks?.length || 0), 0);
    const completedTasks = phases.reduce((total: number, phase: any) => 
      total + (phase.tasks?.filter((task: any) => task.status === 'COMPLETED')?.length || 0), 0);
    const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

    return {
      id: apiRoadmap.roadmapId,
      title: apiRoadmap.title,
      businessType: apiRoadmap.businessType,
      industry: apiRoadmap.industry,
      stage: apiRoadmap.stage,
      goals: apiRoadmap.goals || [],
      timeline: apiRoadmap.timeline,
      phaseCount: phaseCount,
      taskCount: taskCount,
      completedTasks: completedTasks,
      progress: progress,
      status: this.mapStatus(apiRoadmap.status),
      createdAt: apiRoadmap.createdAt,
      lastModified: apiRoadmap.updatedAt
    };
  }

  /**
   * Transform API response to RoadmapApiResponse
   */
  private transformToRoadmapApiResponse(apiRoadmap: any): RoadmapApiResponse {
    return {
      roadmapId: apiRoadmap.roadmapId,
      title: apiRoadmap.title,
      businessType: apiRoadmap.businessType,
      industry: apiRoadmap.industry,
      stage: apiRoadmap.stage,
      revenue: apiRoadmap.revenue,
      employees: apiRoadmap.employees,
      goals: apiRoadmap.goals || [],
      timeline: apiRoadmap.timeline,
      phases: apiRoadmap.phases || [],
      isPublic: apiRoadmap.isPublic,
      isTemplate: apiRoadmap.isTemplate,
      status: this.mapStatus(apiRoadmap.status),
      progress: apiRoadmap.progress || 0,
      createdBy: apiRoadmap.createdBy?.fullName || 'Unknown',
      createdAt: apiRoadmap.createdAt,
      updatedAt: apiRoadmap.updatedAt
    };
  }

  /**
   * Transform API response to RoadmapTemplate
   */
  private transformToTemplate(apiTemplate: any): RoadmapTemplate {
    return {
      templateId: apiTemplate.roadmapId,
      name: apiTemplate.title,
      description: apiTemplate.description || '',
      businessType: apiTemplate.businessType,
      industry: apiTemplate.industry,
      stage: apiTemplate.stage,
      goals: apiTemplate.goals || [],
      phases: apiTemplate.phases || [],
      isPublic: apiTemplate.isPublic,
      usageCount: 0, // Not provided by backend
      rating: undefined, // Not provided by backend
      createdBy: apiTemplate.createdBy?.fullName || 'Unknown',
      createdAt: apiTemplate.createdAt,
      updatedAt: apiTemplate.updatedAt
    };
  }

  /**
   * Map backend status to frontend status
   */
  private mapStatus(backendStatus: string): 'draft' | 'active' | 'completed' | 'archived' {
    const status = backendStatus?.toLowerCase();
    if (status === 'active' || status === 'completed' || status === 'archived') {
      return status;
    }
    return 'draft';
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Save generated roadmap
   */
  async saveGeneratedRoadmap(
    generationRequest: RoadmapGenerationRequest,
    title: string,
    userId: string
  ): Promise<AdminRoadmapItem> {
    try {
      // First generate the roadmap
      const generatedRoadmap = await this.generateRoadmap(generationRequest);
      
      // Create roadmap with the generated data
      const roadmapData: RoadmapFormData = {
        title: title,
        businessType: generationRequest.businessType,
        industry: generationRequest.industry,
        stage: generationRequest.stage,
        revenue: generationRequest.revenue,
        employees: generationRequest.employees,
        goals: generationRequest.goals,
        timeline: generationRequest.timeline,
        isPublic: false,
        isTemplate: false
      };
      
      return await this.createRoadmap(roadmapData, userId);
    } catch (error: any) {
      console.error('Error saving generated roadmap:', error);
      throw new Error('Failed to save roadmap: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Validate roadmap form data
   */
  validateRoadmapForm(formData: RoadmapFormData): string | null {
    if (!formData.title.trim()) return 'Roadmap title is required';
    if (!formData.businessType.trim()) return 'Business type is required';
    if (!formData.industry.trim()) return 'Industry is required';
    if (!formData.stage.trim()) return 'Business stage is required';
    if (!formData.timeline.trim()) return 'Timeline is required';
    if (formData.goals.length === 0) return 'At least one goal is required';
    return null;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Get priority color for display
   */
  getPriorityColor(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status color for display
   */
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

// Export as singleton instance
export const roadmapService = new RoadmapService();
export default roadmapService;