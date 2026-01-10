// src/services/LearningService.ts
import axiosClient from '../api/axiosClient';
import type { 
  UserLearningModule, 
  LearningStats,
  LearningModuleFilter
} from '../interfaces/LearningData';

class LearningService {
  private baseUrl = '/learning-materials';

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
      
      // Apply category filter if specified
      if (filter?.category && filter.category !== 'all') {
        allModules = allModules.filter(module => module.category === filter.category);
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
    // Backend returns lowercase hyphenated format, return as-is for frontend
    return backendCategory;
  }

}

export const learningService = new LearningService();
