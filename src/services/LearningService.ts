// src/services/LearningService.ts
import axiosClient from '../api/axiosClient';
import type { 
  UserLearningModule, 
  LearningStats,
  LearningModuleFilter,
  LearningProgressEventRequest
} from '../interfaces/LearningData';

class LearningService {
  private baseUrl = '/learning-materials';

  private parseBackendTimestamp(ts?: string): number {
    if (!ts) return Number.NaN;
    const direct = Date.parse(ts);
    if (Number.isFinite(direct)) return direct;

    const microMatch = ts.match(/^(.+\.\d{3})\d+(Z|[+-]\d{2}:?\d{2})?$/);
    if (microMatch) {
      const trimmed = `${microMatch[1]}${microMatch[2] || ''}`;
      const trimmedParsed = Date.parse(trimmed);
      if (Number.isFinite(trimmedParsed)) return trimmedParsed;
    }

    const noFractionMatch = ts.match(/^(.+?)\.\d+(Z|[+-]\d{2}:?\d{2})?$/);
    if (noFractionMatch) {
      const noFraction = `${noFractionMatch[1]}${noFractionMatch[2] || ''}`;
      const noFractionParsed = Date.parse(noFraction);
      if (Number.isFinite(noFractionParsed)) return noFractionParsed;
    }

    return Number.NaN;
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
   * Get all learning materials (filtered by organisation on backend)
   */
  async getAllLearningMaterials(): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch learning materials:', error);
      throw new Error('Failed to fetch learning materials from server');
    }
  }

  /**
   * Get learning materials by category (filtered by organisation on backend)
   */
  async getLearningMaterialsByCategory(category: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/category/${category}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error(`❌ Failed to fetch learning materials by category ${category}:`, error);
      throw new Error(`Failed to fetch learning materials for category: ${category}`);
    }
  }

  /**
   * Get learning materials by creator
   */
  async getLearningMaterialsByCreator(userEmail: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/creator/${userEmail}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error(`❌ Failed to fetch learning materials for creator ${userEmail}:`, error);
      throw new Error(`Failed to fetch learning materials for user: ${userEmail}`);
    }
  }

  /**
   * Search learning materials (filtered by organisation on backend)
   */
  async searchLearningMaterials(query: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error(`❌ Failed to search learning materials with query "${query}":`, error);
      throw new Error(`Failed to search learning materials: ${query}`);
    }
  }

  /**
   * Get learning modules for a user (filtered by organisation on backend)
   */
  async getUserModules(userEmail: string, filter?: LearningModuleFilter): Promise<UserLearningModule[]> {
    try {
      console.log('getUserModules called with:', { userEmail, filter });
      const response = await axiosClient.get(`${this.baseUrl}`);
      console.log('Backend response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }
      
      let allModules = this.transformBackendToUserModules(response.data);
      console.log('Transformed modules:', allModules);

      // Fetch per-user progress - this can fail gracefully, but we still need the modules
      try {
        const progressResponse = await axiosClient.get(`${this.baseUrl}/progress/${encodeURIComponent(userEmail)}`);
        const progress = progressResponse.data;
        
        if (progress && Array.isArray(progress) && progress.length > 0) {
          const progressById = new Map(progress.map((p) => [p.materialId, p] as const));
          allModules = allModules.map((m: UserLearningModule) => {
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
      } catch (progressError) {
        console.warn('⚠️ Could not fetch user progress, continuing with modules only:', progressError);
        // Continue without progress - not a fatal error
      }
      
      // Apply category filter
      if (filter?.category && filter.category !== 'all') {
        const target = this.normalizeCategory(filter.category);
        allModules = allModules.filter((module: UserLearningModule) => this.normalizeCategory(module.category) === target);
      }

      allModules = allModules
        .map((m, idx) => ({ m, idx }))
        .sort((a, b) => {
          const aTime = this.parseBackendTimestamp(a.m.createdAt) || this.parseBackendTimestamp(a.m.updatedAt);
          const bTime = this.parseBackendTimestamp(b.m.createdAt) || this.parseBackendTimestamp(b.m.updatedAt);

          const aValid = Number.isFinite(aTime);
          const bValid = Number.isFinite(bTime);

          if (aValid && bValid && aTime !== bTime) return aTime - bTime;
          if (aValid && !bValid) return -1;
          if (!aValid && bValid) return 1;

          return a.idx - b.idx;
        })
        .map(({ m }) => m);

      if (allModules.length === 0) {
        console.warn(`⚠️ No modules found for filter:`, filter);
      }
      
      return allModules;
    } catch (error) {
      console.error('❌ Failed to fetch user learning modules:', error);
      throw new Error('Failed to load learning modules. Please try again later.');
    }
  }

  /**
   * Get learning statistics for a user
   */
  async getUserStats(userEmail: string): Promise<LearningStats> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/stats/${userEmail}`);
      
      if (!response.data) {
        throw new Error('No statistics data received');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user learning stats:', error);
      throw new Error('Failed to load learning statistics');
    }
  }

  /**
   * Record a progress event for a user's learning material
   */
  async recordProgressEvent(payload: LearningProgressEventRequest): Promise<void> {
    try {
      await axiosClient.post(`${this.baseUrl}/progress/event`, payload);
    } catch (error) {
      console.error('❌ Failed to record progress event:', error);
      // Don't throw - this is non-critical
    }
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
  async getModuleById(moduleId: string): Promise<UserLearningModule> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${moduleId}`);
      
      if (!response.data) {
        throw new Error(`No learning material found with ID: ${moduleId}`);
      }
      
      const modules = this.transformBackendToUserModules([response.data]);
      
      if (!modules || modules.length === 0) {
        throw new Error(`Failed to transform learning material with ID: ${moduleId}`);
      }
      
      return modules[0];
    } catch (error) {
      console.error(`❌ Failed to fetch learning material ${moduleId}:`, error);
      throw new Error(`Failed to load learning material: ${moduleId}`);
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
      
      if (!response.data) {
        throw new Error('No quiz data received from server');
      }
      
      if (!response.data.questions || !Array.isArray(response.data.questions) || response.data.questions.length === 0) {
        throw new Error('Server returned quiz with no questions');
      }
      
      console.log(`✅ Quiz generated successfully with ${response.data.questions.length} questions`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to generate quiz:', error);
      throw new Error('Failed to generate AI quiz. Please try again.');
    }
  }

  /**
   * Get quiz for a learning material
   */
  async getQuiz(materialId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${materialId}/quiz`, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.data) {
        return null;
      }

      if (!response.data.questions || !Array.isArray(response.data.questions)) {
        throw new Error('Invalid quiz data format from server');
      }

      console.log(`✅ Quiz retrieved successfully with ${response.data.questions.length} questions`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch quiz:', error);
      throw new Error('Failed to load quiz from server');
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

      if (!response.data) {
        throw new Error('No submission result received from server');
      }

      console.log(`✅ Quiz submitted successfully, score: ${response.data.score}/${response.data.totalPoints}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to submit quiz:', error);
      throw new Error('Failed to submit quiz answers. Please try again.');
    }
  }

  /**
   * Get user's quiz attempts for a material
   */
  async getQuizAttempts(materialId: string): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/${materialId}/quiz/attempts`);

      if (!response.data) {
        return [];
      }

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid attempts data format from server');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch quiz attempts:', error);
      throw new Error('Failed to load quiz attempts');
    }
  }

  // ============== TRANSFORM METHODS ==============

  private transformBackendToUserModules(backendData: any[]): UserLearningModule[] {
    if (!backendData || !Array.isArray(backendData)) {
      throw new Error('Invalid backend data format');
    }

    return backendData.map((item: any): UserLearningModule => {
      if (!item.materialId && !item.id) {
        throw new Error('Learning material missing ID');
      }

      return {
        id: item.materialId || item.id,
        title: item.title,
        description: item.description || '',
        category: this.transformCategory(item.category),
        duration: item.estimatedDuration || '15 min',
        lessons: 1,
        difficulty: this.mapDifficulty(item.difficulty || 'Beginner'),
        rating: item.rating || 0,
        students: item.students || 0,
        isPremium: Boolean(item.isPremium),
        progress: typeof item.progress === 'number' ? item.progress : 0,
        isCompleted: Boolean(item.isCompleted),
        isLocked: Boolean(item.isLocked),
        lastAccessed: item.lastAccessed,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdByOrganisation: item.createdByOrganisation,
        targetOrganisation: item.targetOrganisation,
        isPublic: item.isPublic,
        resourceUrl: item.resourceUrl,
        fileName: item.fileName,
        type: item.type,
        openedAt: item.openedAt,
        finishedAt: item.finishedAt,
        quizStartedAt: item.quizStartedAt,
        quizPassedAt: item.quizPassedAt,
        quizAttempts: item.quizAttempts || 0,
        lastQuizScore: item.lastQuizScore,
        lastQuizTotalQuestions: item.lastQuizTotalQuestions,
        lastQuizPercentage: item.lastQuizPercentage,
      };
    });
  }

  private mapDifficulty(difficulty: string): string {
    const map: Record<string, string> = {
      BEGINNER: 'Beginner',
      INTERMEDIATE: 'Intermediate',
      ADVANCED: 'Advanced',
    };
    return map[(difficulty || '').toUpperCase()] || 'Beginner';
  }

  private transformCategory(backendCategory: string): string {
    if (!backendCategory) {
      throw new Error('Learning material missing category');
    }
    return this.normalizeCategory(backendCategory);
  }

  async uploadLearningMaterial(
    file: File,
    metadata: {
      title: string;
      description?: string;
      category?: string;
      creatorEmail?: string;
      targetOrganisation?: string;
      isPublic?: boolean;
    }
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.creatorEmail) formData.append('creatorEmail', metadata.creatorEmail);
      if (metadata.targetOrganisation) formData.append('targetOrganisation', metadata.targetOrganisation);
      if (metadata.isPublic !== undefined) formData.append('isPublic', String(metadata.isPublic));

      const res = await axiosClient.post(`${this.baseUrl}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!res.data) {
        throw new Error('No upload confirmation received');
      }

      return res.data;
    } catch (error) {
      console.error('❌ Failed to upload learning material:', error);
      throw new Error('Failed to upload learning material');
    }
  }

  async createUrlMaterial(materialData: any): Promise<any> {
    try {
      const response = await axiosClient.post(`${this.baseUrl}`, materialData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create learning material:', error);
      throw new Error('Failed to create learning material');
    }
  }

  async deleteLearningMaterial(materialId: string): Promise<boolean> {
    try {
      const res = await axiosClient.delete(`${this.baseUrl}/${encodeURIComponent(materialId)}`);
      return res.status === 204 || res.status === 200;
    } catch (error) {
      console.error('❌ Failed to delete learning material:', error);
      throw new Error('Failed to delete learning material');
    }
  }

  async getMaterialsByOrganisation(organisation: string): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/admin/organisation/${organisation}`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch materials by organisation:', error);
      throw new Error('Failed to fetch materials by organisation');
    }
  }

  async getPublicMaterials(): Promise<UserLearningModule[]> {
    try {
      const response = await axiosClient.get(`${this.baseUrl}/public`);
      return this.transformBackendToUserModules(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch public materials:', error);
      throw new Error('Failed to fetch public materials');
    }
  }
}

export const learningService = new LearningService();