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

class RoadmapService {
  
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getCurrentUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user.userId || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return '';
  }

  // ==================== ROADMAP OPERATIONS ====================

  async createRoadmap(roadmapData: RoadmapFormData): Promise<AdminRoadmapItem> {
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
        status: 'DRAFT'
      };
      
      const response = await axiosClient.post('/roadmaps', roadmapDTO, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error creating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create roadmap';
      throw new Error(errorMessage);
    }
  }

  async getRoadmapById(roadmapId: string): Promise<RoadmapApiResponse> {
    try {
      const response = await axiosClient.get(`/roadmaps/${roadmapId}`, {
        headers: this.getAuthHeader()
      });
      return this.transformToRoadmapApiResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roadmap';
      throw new Error(errorMessage);
    }
  }

  async getUserRoadmaps(): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps/my-roadmaps', {
        headers: this.getAuthHeader()
      });
      return response.data.map((roadmap: any) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error: any) {
      console.error('Error fetching user roadmaps:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user roadmaps';
      throw new Error(errorMessage);
    }
  }

  async getPublicRoadmaps(): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps/public', {
        headers: this.getAuthHeader()
      });
      return response.data.map((roadmap: any) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error: any) {
      console.error('Error fetching public roadmaps:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch public roadmaps';
      throw new Error(errorMessage);
    }
  }

  async getTemplates(): Promise<RoadmapTemplate[]> {
    try {
      const response = await axiosClient.get('/roadmaps/templates', {
        headers: this.getAuthHeader()
      });
      return response.data.map((template: any) => 
        this.transformToTemplate(template)
      );
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch templates';
      throw new Error(errorMessage);
    }
  }

  async updateRoadmap(roadmapId: string, roadmapData: RoadmapFormData): Promise<AdminRoadmapItem> {
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
        headers: this.getAuthHeader()
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error updating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update roadmap';
      throw new Error(errorMessage);
    }
  }

  async deleteRoadmap(roadmapId: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error: any) {
      console.error('Error deleting roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete roadmap';
      throw new Error(errorMessage);
    }
  }

  async duplicateRoadmap(roadmapId: string, newTitle: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/${roadmapId}/duplicate`, {
        newTitle
      }, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error duplicating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to duplicate roadmap';
      throw new Error(errorMessage);
    }
  }

  async createFromTemplate(templateId: string, title: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/templates/${templateId}/create`, {
        title
      }, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error: any) {
      console.error('Error creating roadmap from template:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create roadmap from template';
      throw new Error(errorMessage);
    }
  }

  async generateRoadmap(generationRequest: RoadmapGenerationRequest): Promise<RoadmapGenerationResponse> {
    try {
      const response = await axiosClient.post('/roadmaps/generate', generationRequest, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate roadmap';
      throw new Error(errorMessage);
    }
  }

  async searchRoadmaps(query: string): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps/search', {
        params: { query },
        headers: this.getAuthHeader()
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

  async getRoadmapStatistics(): Promise<RoadmapAnalytics> {
    try {
      const response = await axiosClient.get('/roadmaps/statistics', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching roadmap statistics:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roadmap statistics';
      throw new Error(errorMessage);
    }
  }

  // ==================== DATA TRANSFORMATION ====================

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
      usageCount: 0,
      rating: undefined,
      createdBy: apiTemplate.createdBy?.fullName || 'Unknown',
      createdAt: apiTemplate.createdAt,
      updatedAt: apiTemplate.updatedAt
    };
  }

  private mapStatus(backendStatus: string): 'draft' | 'active' | 'completed' | 'archived' {
    const status = backendStatus?.toLowerCase();
    if (status === 'active' || status === 'completed' || status === 'archived') {
      return status;
    }
    return 'draft';
  }

  // ==================== UTILITY METHODS ====================

  async saveGeneratedRoadmap(
    generationRequest: RoadmapGenerationRequest,
    title: string
  ): Promise<AdminRoadmapItem> {
    try {
      const generatedRoadmap = await this.generateRoadmap(generationRequest);
      
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
      
      return await this.createRoadmap(roadmapData);
    } catch (error: any) {
      console.error('Error saving generated roadmap:', error);
      throw new Error('Failed to save roadmap: ' + (error.message || 'Unknown error'));
    }
  }

  validateRoadmapForm(formData: RoadmapFormData): string | null {
    if (!formData.title.trim()) return 'Roadmap title is required';
    if (!formData.businessType.trim()) return 'Business type is required';
    if (!formData.industry.trim()) return 'Industry is required';
    if (!formData.stage.trim()) return 'Business stage is required';
    if (!formData.timeline.trim()) return 'Timeline is required';
    if (formData.goals.length === 0) return 'At least one goal is required';
    return null;
  }

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

  getPriorityColor(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

export const roadmapService = new RoadmapService();
export default roadmapService;