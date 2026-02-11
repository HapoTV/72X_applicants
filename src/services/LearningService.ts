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
   * Get learning modules for a user
   */
  async getUserModules(userEmail: string, filter?: LearningModuleFilter): Promise<UserLearningModule[]> {
    try {
      console.log('getUserModules called with:', { userEmail, filter });
      const response = await axiosClient.get(`${this.baseUrl}`);
      console.log('Backend response:', response.data);
      let allModules = this.transformBackendToUserModules(response.data);
      console.log('Transformed modules:', allModules);

      // Try to fetch per-user progress
      const progress = await this.safeGet<LearningMaterialUserProgress[]>(`${this.baseUrl}/progress/${encodeURIComponent(userEmail)}`);
      if (progress && Array.isArray(progress) && progress.length > 0) {
        const progressById = new Map(progress.map((p) => [p.materialId, p] as const));
        allModules = allModules.map((m) => {
          const p = progressById.get(m.id);
          if (!p) return m;
          const mergedProgress = typeof p.progress === 'number' ? p.progress : m.progress;

          return {
            ...m,
            progress: mergedProgress,
            lastAccessed: p.lastAccessed || m.lastAccessed,
            openedAt: p.openedAt,
            finishedAt: p.finishedAt,
            quizStartedAt: p.quizStartedAt,
            quizPassedAt: p.quizPassedAt,
            quizAttempts: p.attempts,
            lastQuizScore: p.lastQuizScore,
            lastQuizTotalQuestions: p.lastQuizTotalQuestions,
            lastQuizPercentage: p.lastQuizPercentage,
            isCompleted: Boolean(p.quizPassedAt || p.finishedAt || mergedProgress === 100),
          };
        });
      }
      
      // Apply category filter
      if (filter?.category && filter.category !== 'all') {
        const target = this.normalizeCategory(filter.category);
        allModules = allModules.filter(module => this.normalizeCategory(module.category) === target);
      }
      
      return allModules;
    } catch (error) {
      console.error('Error fetching user learning modules:', error);
      return [];
    }
  }

  /**
   * Get learning statistics for a user
   */
  async getUserStats(userEmail: string): Promise<LearningStats> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/stats/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user learning stats:', error);
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
   * Record a progress event for a user's learning material
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

  // ============== QUIZ METHODS ==============

  /**
   * Generate quiz for a learning material using AI
   */
  async generateQuiz(materialId: string, numberOfQuestions: number = 20): Promise<any> {
    try {
      const response = await axiosClient.post(
        `${this.baseUrl}/${materialId}/quiz?numberOfQuestions=${numberOfQuestions}`
      );
      return response.data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      return null;
    }
  }

  /**
   * Get quiz for a learning material
   */
  async getQuiz(materialId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${materialId}/quiz`);
      return response.data;
    } catch (error) {
      console.error('Error getting quiz:', error);
      return null;
    }
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(quizId: string, answers: Record<string, any>, timeSpentSeconds: number): Promise<any> {
    try {
      const response = await axiosClient.post(
        `${this.baseUrl}/quiz/${quizId}/submit?timeSpentSeconds=${timeSpentSeconds}`, 
        answers
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return null;
    }
  }

  /**
   * Get user's quiz attempts for a material
   */
  async getQuizAttempts(materialId: string): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${materialId}/quiz/attempts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }
  }

  // ============== TRANSFORM METHODS ==============

  /**
   * Transform backend DTO response to UserLearningModule format
   */
  private transformBackendToUserModules(backendData: any[]): UserLearningModule[] {
    return backendData.map(item => ({
      id: item.materialId || item.id,
      title: item.title,
      description: item.description || '',
      category: this.transformCategory(item.category),
      duration: item.estimatedDuration || '15 min',
      lessons: 1,
      difficulty: this.mapDifficulty(item.difficulty || 'Beginner'),
      rating: item.rating || 0,
      students: item.students || 0,
      isPremium: item.isPremium || false,
      progress: item.progress || 0,
      thumbnail: item.thumbnailUrl || this.getDefaultThumbnail(item.category),
      isCompleted: false,
      isLocked: false,
      resourceUrl: item.resourceUrl,
      fileName: item.fileName,
      type: item.type,
      // Quiz status fields
      quizStartedAt: item.quizStartedAt,
      quizPassedAt: item.quizPassedAt,
      quizAttempts: item.quizAttempts || 0,
      lastQuizScore: item.lastQuizScore,
      lastQuizTotalQuestions: item.lastQuizTotalQuestions,
      lastQuizPercentage: item.lastQuizPercentage
    }));
  }

  /**
   * Map difficulty string
   */
  private mapDifficulty(difficulty: string): string {
    const map: Record<string, string> = {
      'BEGINNER': 'Beginner',
      'INTERMEDIATE': 'Intermediate',
      'ADVANCED': 'Advanced'
    };
    return map[difficulty.toUpperCase()] || 'Beginner';
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
      'standardbank': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      'sales': 'https://images.unsplash.com/photo-1552581234-26160f608093?w=400',
      'strategy': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    };
    
    return thumbnailMap[category] || 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400';
  }

  /**
   * Transform backend category to frontend category
   */
  private transformCategory(backendCategory: string): string {
    return this.normalizeCategory(backendCategory);
  }

  /**
   * Upload a new learning material
   */
  async uploadLearningMaterial(file: File, metadata: { title: string; description?: string; category?: string; creatorEmail?: string }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.creatorEmail) formData.append('creatorEmail', metadata.creatorEmail);

      const res = await axiosClient.post(`${this.baseUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      console.error('Error uploading learning material:', error);
      return null;
    }
  }

  /**
   * Delete a learning material
   */
  async deleteLearningMaterial(materialId: string): Promise<boolean> {
    try {
      const res = await axiosClient.delete(`${this.baseUrl}/${encodeURIComponent(materialId)}`);
      return res.status >= 200 && res.status < 300;
    } catch (error) {
      console.error('Error deleting learning material:', error);
      return false;
    }
  }
}

export const learningService = new LearningService();