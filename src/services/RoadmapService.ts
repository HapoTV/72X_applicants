// src/services/RoadmapService.ts
import axiosClient from '../api/axiosClient';
import type { 
  RoadmapFormData,
  AdminRoadmapItem,
  UserRoadmapItem,
  RoadmapApiResponse,
  RoadmapRequest,
  RoadmapGenerationRequest,
  RoadmapGenerationResponse,
  RoadmapTemplate,
  TemplateFormData,
  RoadmapAnalytics,
  PhaseFormData,
  TaskFormData,
  PhaseRequest,
  TaskRequest,
  RoadmapShare,
  ShareFormData,
  RoadmapPhase
} from '../interfaces/RoadmapData';

/**
 * Service layer for handling all roadmap-related operations
 */
class RoadmapService {
  
  // ==================== ROADMAP OPERATIONS ====================

  /**
   * Get all roadmaps (Admin only)
   */
  async getAllRoadmaps(): Promise<AdminRoadmapItem[]> {
    try {
      const response = await axiosClient.get('/roadmaps');
      return response.data.map((roadmap: RoadmapApiResponse) => 
        this.transformToAdminRoadmapItem(roadmap)
      );
    } catch (error) {
      console.error('Error fetching all roadmaps:', error);
      throw new Error('Failed to fetch roadmaps');
    }
  }

  /**
   * Get user's roadmaps
   */
  async getUserRoadmaps(userId: string): Promise<UserRoadmapItem[]> {
    try {
      const response = await axiosClient.get(`/roadmaps/user/${userId}`);
      return response.data.map((roadmap: RoadmapApiResponse) => 
        this.transformToUserRoadmapItem(roadmap)
      );
    } catch (error) {
      console.error('Error fetching user roadmaps:', error);
      throw new Error('Failed to fetch user roadmaps');
    }
  }

  /**
   * Get roadmap by ID
   */
  async getRoadmapById(roadmapId: string): Promise<RoadmapApiResponse> {
    try {
      const response = await axiosClient.get(`/roadmaps/${roadmapId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw new Error('Failed to fetch roadmap');
    }
  }

  /**
   * Create a new roadmap
   */
  async createRoadmap(roadmapData: RoadmapFormData, createdBy: string): Promise<AdminRoadmapItem> {
    try {
      const roadmapRequest: RoadmapRequest = this.transformToRoadmapRequest(roadmapData, createdBy);
      const response = await axiosClient.post('/roadmaps', roadmapRequest);
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw new Error('Failed to create roadmap');
    }
  }

  /**
   * Update an existing roadmap
   */
  async updateRoadmap(roadmapId: string, roadmapData: RoadmapFormData, createdBy: string): Promise<AdminRoadmapItem> {
    try {
      const roadmapRequest: RoadmapRequest = this.transformToRoadmapRequest(roadmapData, createdBy);
      const response = await axiosClient.put(`/roadmaps/${roadmapId}`, roadmapRequest);
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error) {
      console.error('Error updating roadmap:', error);
      throw new Error('Failed to update roadmap');
    }
  }

  /**
   * Delete a roadmap
   */
  async deleteRoadmap(roadmapId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      throw new Error('Failed to delete roadmap');
    }
  }

  /**
   * Duplicate a roadmap
   */
  async duplicateRoadmap(roadmapId: string, newTitle: string, createdBy: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/${roadmapId}/duplicate`, {
        newTitle,
        createdBy
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error) {
      console.error('Error duplicating roadmap:', error);
      throw new Error('Failed to duplicate roadmap');
    }
  }

  // ==================== ROADMAP GENERATION ====================

  /**
   * Generate roadmap based on business information
   */
  async generateRoadmap(generationRequest: RoadmapGenerationRequest): Promise<RoadmapGenerationResponse> {
    try {
      const response = await axiosClient.post('/roadmaps/generate', generationRequest);
      return response.data;
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw new Error('Failed to generate roadmap');
    }
  }

  /**
   * Save generated roadmap
   */
  async saveGeneratedRoadmap(
    generationResponse: RoadmapGenerationResponse,
    title: string,
    createdBy: string
  ): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post('/roadmaps/save-generated', {
        title,
        phases: generationResponse.phases,
        createdBy
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error) {
      console.error('Error saving generated roadmap:', error);
      throw new Error('Failed to save generated roadmap');
    }
  }

  // ==================== TEMPLATE OPERATIONS ====================

  /**
   * Get all roadmap templates
   */
  async getTemplates(businessType?: string): Promise<RoadmapTemplate[]> {
    try {
      const params = businessType ? { businessType } : {};
      const response = await axiosClient.get('/roadmaps/templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(templateData: TemplateFormData, phases: Omit<RoadmapPhase, 'phaseId'>[], createdBy: string): Promise<RoadmapTemplate> {
    try {
      const response = await axiosClient.post('/roadmaps/templates', {
        ...templateData,
        phases,
        createdBy
      });
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  /**
   * Create roadmap from template
   */
  async createFromTemplate(templateId: string, title: string, createdBy: string): Promise<AdminRoadmapItem> {
    try {
      const response = await axiosClient.post(`/roadmaps/templates/${templateId}/create`, {
        title,
        createdBy
      });
      return this.transformToAdminRoadmapItem(response.data);
    } catch (error) {
      console.error('Error creating roadmap from template:', error);
      throw new Error('Failed to create roadmap from template');
    }
  }

  // ==================== PHASE OPERATIONS ====================

  /**
   * Add phase to roadmap
   */
  async addPhase(roadmapId: string, phaseData: PhaseFormData): Promise<void> {
    try {
      const phaseRequest: PhaseRequest = {
        title: phaseData.title,
        description: phaseData.description,
        duration: phaseData.duration,
        order: phaseData.order,
        tasks: []
      };
      await axiosClient.post(`/roadmaps/${roadmapId}/phases`, phaseRequest);
    } catch (error) {
      console.error('Error adding phase:', error);
      throw new Error('Failed to add phase');
    }
  }

  /**
   * Update phase
   */
  async updatePhase(roadmapId: string, phaseId: string, phaseData: PhaseFormData): Promise<void> {
    try {
      const phaseRequest: PhaseRequest = {
        title: phaseData.title,
        description: phaseData.description,
        duration: phaseData.duration,
        order: phaseData.order,
        tasks: []
      };
      await axiosClient.put(`/roadmaps/${roadmapId}/phases/${phaseId}`, phaseRequest);
    } catch (error) {
      console.error('Error updating phase:', error);
      throw new Error('Failed to update phase');
    }
  }

  /**
   * Delete phase
   */
  async deletePhase(roadmapId: string, phaseId: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}/phases/${phaseId}`);
    } catch (error) {
      console.error('Error deleting phase:', error);
      throw new Error('Failed to delete phase');
    }
  }

  /**
   * Reorder phases
   */
  async reorderPhases(roadmapId: string, phaseOrders: Array<{ phaseId: string; order: number }>): Promise<void> {
    try {
      await axiosClient.put(`/roadmaps/${roadmapId}/phases/reorder`, { phaseOrders });
    } catch (error) {
      console.error('Error reordering phases:', error);
      throw new Error('Failed to reorder phases');
    }
  }

  // ==================== TASK OPERATIONS ====================

  /**
   * Add task to phase
   */
  async addTask(roadmapId: string, phaseId: string, taskData: TaskFormData): Promise<void> {
    try {
      const taskRequest: TaskRequest = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        duration: taskData.duration,
        order: taskData.order,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        notes: taskData.notes,
        resources: []
      };
      await axiosClient.post(`/roadmaps/${roadmapId}/phases/${phaseId}/tasks`, taskRequest);
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  }

  /**
   * Update task
   */
  async updateTask(roadmapId: string, phaseId: string, taskId: string, taskData: TaskFormData): Promise<void> {
    try {
      const taskRequest: TaskRequest = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        duration: taskData.duration,
        order: taskData.order,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        notes: taskData.notes,
        resources: []
      };
      await axiosClient.put(`/roadmaps/${roadmapId}/phases/${phaseId}/tasks/${taskId}`, taskRequest);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Delete task
   */
  async deleteTask(roadmapId: string, phaseId: string, taskId: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}/phases/${phaseId}/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(roadmapId: string, phaseId: string, taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'skipped'): Promise<void> {
    try {
      await axiosClient.patch(`/roadmaps/${roadmapId}/phases/${phaseId}/tasks/${taskId}/status`, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('Failed to update task status');
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Get roadmap analytics (Admin only)
   */
  async getRoadmapAnalytics(): Promise<RoadmapAnalytics> {
    try {
      const response = await axiosClient.get('/roadmaps/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmap analytics:', error);
      throw new Error('Failed to fetch roadmap analytics');
    }
  }

  // ==================== SHARING ====================

  /**
   * Share roadmap
   */
  async shareRoadmap(roadmapId: string, shareData: ShareFormData, createdBy: string): Promise<RoadmapShare> {
    try {
      const response = await axiosClient.post(`/roadmaps/${roadmapId}/share`, {
        ...shareData,
        createdBy
      });
      return response.data;
    } catch (error) {
      console.error('Error sharing roadmap:', error);
      throw new Error('Failed to share roadmap');
    }
  }

  /**
   * Get shared roadmap
   */
  async getSharedRoadmap(shareToken: string): Promise<RoadmapApiResponse> {
    try {
      const response = await axiosClient.get(`/roadmaps/shared/${shareToken}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shared roadmap:', error);
      throw new Error('Failed to fetch shared roadmap');
    }
  }

  /**
   * Unshare roadmap
   */
  async unshareRoadmap(roadmapId: string, shareId: string): Promise<void> {
    try {
      await axiosClient.delete(`/roadmaps/${roadmapId}/share/${shareId}`);
    } catch (error) {
      console.error('Error unsharing roadmap:', error);
      throw new Error('Failed to unshare roadmap');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminRoadmapItem
   */
  private transformToAdminRoadmapItem(apiRoadmap: RoadmapApiResponse): AdminRoadmapItem {
    return {
      id: apiRoadmap.roadmapId,
      title: apiRoadmap.title,
      businessType: apiRoadmap.businessType,
      industry: apiRoadmap.industry,
      stage: apiRoadmap.stage,
      revenue: apiRoadmap.revenue,
      employees: apiRoadmap.employees,
      goals: apiRoadmap.goals,
      timeline: apiRoadmap.timeline,
      phases: apiRoadmap.phases,
      isPublic: apiRoadmap.isPublic,
      isTemplate: apiRoadmap.isTemplate,
      status: apiRoadmap.status,
      progress: apiRoadmap.progress,
      createdBy: apiRoadmap.createdBy,
      createdAt: apiRoadmap.createdAt,
      updatedAt: apiRoadmap.updatedAt
    };
  }

  /**
   * Transform API response to UserRoadmapItem
   */
  private transformToUserRoadmapItem(apiRoadmap: RoadmapApiResponse): UserRoadmapItem {
    const phaseCount = apiRoadmap.phases.length;
    const taskCount = apiRoadmap.phases.reduce((total, phase) => total + phase.tasks.length, 0);
    const completedTasks = apiRoadmap.phases.reduce((total, phase) => 
      total + phase.tasks.filter(task => task.status === 'completed').length, 0);
    const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

    return {
      id: apiRoadmap.roadmapId,
      title: apiRoadmap.title,
      businessType: apiRoadmap.businessType,
      industry: apiRoadmap.industry,
      stage: apiRoadmap.stage,
      goals: apiRoadmap.goals,
      timeline: apiRoadmap.timeline,
      phaseCount: phaseCount,
      taskCount: taskCount,
      completedTasks: completedTasks,
      progress: progress,
      status: apiRoadmap.status,
      createdAt: apiRoadmap.createdAt,
      lastModified: apiRoadmap.updatedAt
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToRoadmapRequest(formData: RoadmapFormData, createdBy: string): RoadmapRequest {
    return {
      title: formData.title,
      businessType: formData.businessType,
      industry: formData.industry,
      stage: formData.stage,
      revenue: formData.revenue,
      employees: formData.employees,
      goals: formData.goals,
      timeline: formData.timeline,
      phases: [], // Empty phases for initial creation
      isPublic: formData.isPublic,
      isTemplate: formData.isTemplate,
      createdBy: createdBy
    };
  }

  /**
   * Transform AdminRoadmapItem back to form data for editing
   */
  transformToRoadmapFormData(roadmap: AdminRoadmapItem): RoadmapFormData {
    return {
      title: roadmap.title,
      businessType: roadmap.businessType,
      industry: roadmap.industry,
      stage: roadmap.stage,
      revenue: roadmap.revenue,
      employees: roadmap.employees,
      goals: roadmap.goals,
      timeline: roadmap.timeline,
      isPublic: roadmap.isPublic,
      isTemplate: roadmap.isTemplate
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Calculate roadmap progress
   */
  calculateProgress(phases: RoadmapPhase[]): number {
    const totalTasks = phases.reduce((total, phase) => total + phase.tasks.length, 0);
    const completedTasks = phases.reduce((total, phase) => 
      total + phase.tasks.filter(task => task.status === 'completed').length, 0);
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  /**
   * Get priority color for display
   */
  getPriorityColor(priority: 'High' | 'Medium' | 'Low'): string {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status color for display
   */
  getStatusColor(status: 'draft' | 'active' | 'completed' | 'archived'): string {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Format timeline for display
   */
  formatTimeline(timeline: string): string {
    const timelineMap: Record<string, string> = {
      '3months': '3 months',
      '6months': '6 months',
      '1year': '1 year',
      '2years': '2+ years'
    };
    return timelineMap[timeline] || timeline;
  }

  /**
   * Validate roadmap form data
   */
  validateRoadmapForm(formData: RoadmapFormData): string | null {
    if (!formData.title.trim()) {
      return 'Roadmap title is required';
    }
    if (!formData.businessType.trim()) {
      return 'Business type is required';
    }
    if (!formData.industry.trim()) {
      return 'Industry is required';
    }
    if (!formData.stage.trim()) {
      return 'Business stage is required';
    }
    if (!formData.timeline.trim()) {
      return 'Timeline is required';
    }
    if (formData.goals.length === 0) {
      return 'At least one goal is required';
    }
    
    return null; // No errors
  }

  /**
   * Validate task form data
   */
  validateTaskForm(formData: TaskFormData): string | null {
    if (!formData.title.trim()) {
      return 'Task title is required';
    }
    if (!formData.duration.trim()) {
      return 'Task duration is required';
    }
    if (!formData.priority) {
      return 'Task priority is required';
    }
    
    return null; // No errors
  }

  /**
   * Export roadmap to PDF (returns download URL)
   */
  async exportToPDF(roadmapId: string): Promise<string> {
    try {
      const response = await axiosClient.post(`/roadmaps/${roadmapId}/export/pdf`);
      return response.data.downloadUrl;
    } catch (error) {
      console.error('Error exporting roadmap to PDF:', error);
      throw new Error('Failed to export roadmap to PDF');
    }
  }
}

// Export as singleton instance
export const roadmapService = new RoadmapService();
export default roadmapService;
