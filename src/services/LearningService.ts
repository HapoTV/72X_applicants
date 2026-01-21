// src/services/LearningService.ts
import axiosClient from '../api/axiosClient';
import type { 
  UserLearningModule, 
  LearningStats,
  LearningModuleFilter,
  LearningMaterialUserProgress,
  LearningProgressEventRequest
} from '../interfaces/LearningData';

class LearningService {
  private baseUrl = '/learning-materials';

  private async safeGet<T>(url: string, config?: any): Promise<T | null> {
    try {
      const res = await axiosClient.get(url, config);
      return res.data as T;
    } catch (error) {
      console.warn(`LearningService.safeGet failed for ${url} (safe to ignore until backend supports it):`, error);
      return null;
    }
  }

  private async safePost<T>(url: string, body?: any, config?: any): Promise<T | null> {
    try {
      const res = await axiosClient.post(url, body, config);
      return res.data as T;
    } catch (error) {
      console.warn(`LearningService.safePost failed for ${url} (safe to ignore until backend supports it):`, error);
      return null;
    }
  }

  private normalizeCategory(category: string): string {
    const normalized = (category || '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-');
    if (normalized === 'business-planning' || normalized === 'businessplanning') return 'business-plan';
    return normalized;
  }

  /**
   * Get all learning materials
   */
  async getAllLearningMaterials(): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('Error fetching learning materials:', error);
      // Return empty array instead of mock data
      return [];
    }
  }

  /**
   * Get learning materials by category
   */
  async getLearningMaterialsByCategory(category: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/category/${category}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('Error fetching learning materials by category:', error);
      return [];
    }
  }

  /**
   * Get learning materials by creator (user-specific)
   */
  async getLearningMaterialsByCreator(userEmail: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/creator/${userEmail}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('Error fetching learning materials by creator:', error);
      return [];
    }
  }

  /**
   * Search learning materials
   */
  async searchLearningMaterials(query: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('Error searching learning materials:', error);
      return [];
    }
  }

  /**
   * Get learning modules for a user (like EventService.getUserEvents)
   */
  async getUserModules(userEmail: string, filter?: LearningModuleFilter): Promise<UserLearningModule[]> {
    try {
      console.log('getUserModules called with:', { userEmail, filter });
      // Use the same endpoint as admin dashboard to get all materials
      const response = await axiosClient.get(`${this.baseUrl}`);
      console.log('Backend response:', response.data);
      let allModules = this.transformBackendToUserModules(response.data);
      console.log('Transformed modules:', allModules);

      // Try to fetch per-user progress and merge it (safe if endpoint not implemented)
      const progress = await this.safeGet<LearningMaterialUserProgress[]>(`${this.baseUrl}/progress/${encodeURIComponent(userEmail)}`);
      if (progress && Array.isArray(progress) && progress.length > 0) {
        const progressById = new Map(progress.map((p) => [p.materialId, p] as const));
        allModules = allModules.map((m) => {
          const p = progressById.get(m.id);
          if (!p) return m;
          const mergedProgress = typeof p.progress === 'number' ? p.progress : m.progress;
          const quizStartedAt = (p.quizStartedAt || undefined) as any;
          const quizPassedAt = (p.quizPassedAt || undefined) as any;

          return {
            ...m,
            progress: mergedProgress,
            lastAccessed: p.lastAccessed || m.lastAccessed,
            openedAt: p.openedAt,
            finishedAt: p.finishedAt,
            quizStartedAt,
            quizPassedAt,
            quizAttempts: p.attempts,
            lastQuizScore: p.lastQuizScore,
            lastQuizTotalQuestions: p.lastQuizTotalQuestions,
            lastQuizPercentage: p.lastQuizPercentage,
            isCompleted: Boolean(quizPassedAt || p.finishedAt || mergedProgress === 100),
          };
        });
      }
      
      // Apply category filter if specified
      if (filter?.category && filter.category !== 'all') {
        const target = this.normalizeCategory(filter.category);
        allModules = allModules.filter(module => this.normalizeCategory(module.category) === target);
        console.log('Filtered modules for category', filter.category, ':', allModules);
      }
      
      return allModules;
    } catch (error) {
      console.error('Error fetching user learning modules:', error);
      // Return empty array instead of mock data
      return [];
    }
  }

  /**
   * Get learning statistics for a user (like EventService pattern)
   */
  async getUserStats(userEmail: string): Promise<LearningStats> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/stats/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user learning stats:', error);
      // Return default stats instead of mock data
      return {
        totalModules: 0,
        completedModules: 0,
        inProgressModules: 0,
        totalProgress: 0,
        timeSpent: 0,
        averageRating: 0,
        byCategory: {},
        byDifficulty: {}
      };
    }
  }

  /**
   * Record a progress event for a user's learning material.
   *
   * Proposed endpoint: POST /learning-materials/progress/event
   * This is safe: if the endpoint is not available yet, it won't throw.
   */
  async recordProgressEvent(payload: LearningProgressEventRequest): Promise<void> {
    await this.safePost(`${this.baseUrl}/progress/event`, payload);
  }

  async recordOpened(userEmail: string, materialId: string): Promise<void> {
    await this.recordProgressEvent({
      userEmail,
      materialId,
      event: 'OPENED',
      occurredAt: new Date().toISOString(),
    });
  }

  async recordFinished(userEmail: string, materialId: string): Promise<void> {
    await this.recordProgressEvent({
      userEmail,
      materialId,
      event: 'FINISHED',
      occurredAt: new Date().toISOString(),
    });
  }

  async recordQuizStarted(userEmail: string, materialId: string): Promise<void> {
    await this.recordProgressEvent({
      userEmail,
      materialId,
      event: 'QUIZ_STARTED',
      occurredAt: new Date().toISOString(),
    });
  }

  async recordQuizPassed(userEmail: string, materialId: string, score: number, totalQuestions: number, percentage: number): Promise<void> {
    await this.recordProgressEvent({
      userEmail,
      materialId,
      event: 'QUIZ_PASSED',
      occurredAt: new Date().toISOString(),
      score,
      totalQuestions,
      percentage,
      progress: 100,
    });
  }

  /**
   * Get learning material by ID
   */
  async getModuleById(moduleId: string): Promise<UserLearningModule | null> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${moduleId}`);
      const modules = this.transformBackendToUserModules([response.data]);
      return modules[0] || null;
    } catch (error) {
      console.error('Error fetching learning material:', error);
      return null;
    }
  }

  /**
   * Transform backend DTO response to UserLearningModule format
   */
  private transformBackendToUserModules(backendData: any[]): UserLearningModule[] {
    return backendData.map(item => ({
      id: item.materialId || item.id,
      title: item.title,
      description: item.description || '',
      category: this.transformCategory(item.category),
      duration: item.estimatedDuration || '60 min',
      lessons: 1, // Backend doesn't have lessons, default to 1
      difficulty: 'Beginner', // Backend doesn't have difficulty, default to Beginner
      rating: 0, // Backend doesn't have rating, default to 0
      students: 0, // Backend doesn't have students count, default to 0
      isPremium: false, // Backend doesn't have premium flag, default to false
      progress: 0, // Backend doesn't track progress, default to 0
      thumbnail: item.thumbnailUrl || this.getDefaultThumbnail(item.category),
      isCompleted: false,
      isLocked: false,
      // Include resource information for file/URL access
      resourceUrl: item.resourceUrl,
      fileName: item.fileName,
      type: item.type
    }));
  }

  /**
   * Get default thumbnail based on category
   */
  private getDefaultThumbnail(category: string): string {
    const thumbnailMap: Record<string, string> = {
      'business-plan': 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400',
      'marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      'finance': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
      'operations': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      'leadership': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      'standardbank': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
    };
    
    return thumbnailMap[category] || 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400';
  }

  /**
   * Transform backend category to frontend category
   */
  private transformCategory(backendCategory: string): string {
    return this.normalizeCategory(backendCategory);
  }

}

export const learningService = new LearningService();
