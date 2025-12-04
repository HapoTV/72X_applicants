// src/services/LearningService.ts
import type { 
  UserLearningModule, 
  LearningStats,
  LearningModuleFilter
} from '../interfaces/LearningData';

class LearningService {
  private baseUrl = '/api/learning-materials';

  /**
   * Get all learning materials
   */
  async getAllLearningMaterials(): Promise<UserLearningModule[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch learning materials');
      }
      
      const data = await response.json();
      return this.transformBackendToUserModules(data);
    } catch (error) {
      console.error('Error fetching learning materials:', error);
      return this.getMockUserModules();
    }
  }

  /**
   * Get learning materials by category
   */
  async getLearningMaterialsByCategory(category: string): Promise<UserLearningModule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch learning materials by category');
      }
      
      const data = await response.json();
      return this.transformBackendToUserModules(data);
    } catch (error) {
      console.error('Error fetching learning materials by category:', error);
      return this.getMockUserModules({ category: category as any });
    }
  }

  /**
   * Get learning materials by creator (user-specific)
   */
  async getLearningMaterialsByCreator(userEmail: string): Promise<UserLearningModule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/creator/${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch learning materials by creator');
      }
      
      const data = await response.json();
      return this.transformBackendToUserModules(data);
    } catch (error) {
      console.error('Error fetching learning materials by creator:', error);
      return this.getMockUserModules();
    }
  }

  /**
   * Search learning materials
   */
  async searchLearningMaterials(query: string): Promise<UserLearningModule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search learning materials');
      }
      
      const data = await response.json();
      return this.transformBackendToUserModules(data);
    } catch (error) {
      console.error('Error searching learning materials:', error);
      return this.getMockUserModules({ search: query });
    }
  }

  /**
   * Get learning modules for a user (combines creator and filtering)
   */
  async getUserModules(_userEmail: string, filter?: LearningModuleFilter): Promise<UserLearningModule[]> {
    try {
      // Use the creator endpoint to get materials created by user
      // or get all materials and filter client-side
      let response;
      
      if (filter?.category && filter.category !== 'all') {
        if (filter?.search) {
          response = await fetch(`${this.baseUrl}/category/${filter.category}/search?query=${encodeURIComponent(filter.search)}`);
        } else {
          response = await fetch(`${this.baseUrl}/category/${filter.category}`);
        }
      } else if (filter?.search) {
        response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(filter.search)}`);
      } else {
        response = await fetch(`${this.baseUrl}`);
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch learning modules');
      }
      
      const data = await response.json();
      const modules = this.transformBackendToUserModules(data);
      
      // Apply additional client-side filtering if needed
      return this.applyClientSideFilters(modules, filter);
    } catch (error) {
      console.error('Error fetching user learning modules:', error);
      return this.getMockUserModules(filter as any);
    }
  }

  /**
   * Get learning statistics for a user (mock implementation)
   * Note: Backend doesn't have stats endpoint, so this returns mock data
   */
  async getLearningStats(_userEmail: string): Promise<LearningStats> {
    // Backend doesn't have a stats endpoint, return mock data
    return this.getMockLearningStats();
  }

  /**
   * Get learning material by ID
   */
  async getModuleById(moduleId: string): Promise<UserLearningModule | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch learning material');
      }
      
      const data = await response.json();
      const modules = this.transformBackendToUserModules([data]);
      return modules[0] || null;
    } catch (error) {
      console.error('Error fetching learning material:', error);
      const mockModules = this.getMockUserModules();
      return mockModules.find(module => module.id === moduleId) || null;
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
      category: item.category?.toLowerCase() || 'general',
      duration: item.estimatedDuration || '60 min',
      lessons: 1, // Backend doesn't have lessons, default to 1
      difficulty: 'Beginner', // Backend doesn't have difficulty, default to Beginner
      rating: 0, // Backend doesn't have rating, default to 0
      students: 0, // Backend doesn't have students count, default to 0
      isPremium: false, // Backend doesn't have premium flag, default to false
      progress: 0, // Backend doesn't track progress, default to 0
      thumbnail: item.thumbnailUrl,
      isCompleted: false,
      isLocked: false
    }));
  }

  /**
   * Apply client-side filtering for properties not supported by backend
   */
  private applyClientSideFilters(modules: UserLearningModule[], filter?: LearningModuleFilter): UserLearningModule[] {
    let filteredModules = modules;

    if (filter?.difficulty && filter.difficulty !== 'all') {
      filteredModules = filteredModules.filter(module => module.difficulty === filter.difficulty);
    }

    if (filter?.isPremium !== undefined && filter.isPremium !== 'all') {
      filteredModules = filteredModules.filter(module => module.isPremium === filter.isPremium);
    }

    if (filter?.sortBy) {
      filteredModules.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filter.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'students':
            aValue = a.students;
            bValue = b.students;
            break;
          case 'duration':
            aValue = parseInt(a.duration);
            bValue = parseInt(b.duration);
            break;
          case 'progress':
            aValue = a.progress;
            bValue = b.progress;
            break;
          default:
            return 0;
        }

        if (filter.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    return filteredModules;
  }

  /**
   * Mock data for development
   */
  private getMockUserModules(filter?: LearningModuleFilter): UserLearningModule[] {
    const mockModules: UserLearningModule[] = [
      {
        id: '1',
        title: 'How to Create a Winning Business Plan',
        description: 'Learn to craft a comprehensive business plan that attracts investors and guides your growth.',
        category: 'business-plan',
        duration: '45 min',
        lessons: 8,
        difficulty: 'Beginner',
        rating: 4.8,
        students: 2340,
        isPremium: false,
        progress: 100,
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        isCompleted: true,
        isLocked: false,
        lastAccessed: '2024-12-01T10:30:00Z'
      },
      {
        id: '2',
        title: 'Mastering Social Media Advertising',
        description: 'Advanced strategies for Facebook, Instagram, and LinkedIn advertising that drive real results.',
        category: 'marketing',
        duration: '1h 20min',
        lessons: 12,
        difficulty: 'Intermediate',
        rating: 4.9,
        students: 1890,
        isPremium: true,
        progress: 0,
        thumbnail: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400',
        isCompleted: false,
        isLocked: true
      },
      {
        id: '3',
        title: 'Financial Planning for Small Business',
        description: 'Master budgeting, cash flow management, and financial forecasting for sustainable growth.',
        category: 'finance',
        duration: '55 min',
        lessons: 10,
        difficulty: 'Beginner',
        rating: 4.7,
        students: 3120,
        isPremium: false,
        progress: 100,
        thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
        isCompleted: false,
        isLocked: false,
        lastAccessed: '2024-12-02T09:45:00Z'
      },
      {
        id: '5',
        title: 'Leadership Skills for Entrepreneurs',
        description: 'Develop essential leadership skills to inspire your team and drive business success.',
        category: 'leadership',
        duration: '50 min',
        lessons: 7,
        difficulty: 'Intermediate',
        rating: 4.6,
        students: 2100,
        isPremium: false,
        progress: 0,
        thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
        isCompleted: false,
        isLocked: false
      },
      {
        id: '6',
        title: 'Digital Marketing Fundamentals',
        description: 'Complete guide to SEO, content marketing, email campaigns, and analytics.',
        category: 'marketing',
        duration: '2h 15min',
        lessons: 15,
        difficulty: 'Beginner',
        rating: 4.8,
        students: 4200,
        isPremium: false,
        progress: 60,
        thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
        isCompleted: false,
        isLocked: false,
        lastAccessed: '2024-11-30T16:20:00Z'
      }
    ];

    // Apply filters
    let filteredModules = mockModules;

    if (filter?.category && filter.category !== 'all') {
      filteredModules = filteredModules.filter(module => module.category === filter.category);
    }

    if (filter?.difficulty && filter.difficulty !== 'all') {
      filteredModules = filteredModules.filter(module => module.difficulty === filter.difficulty);
    }

    if (filter?.isPremium !== undefined && filter.isPremium !== 'all') {
      filteredModules = filteredModules.filter(module => module.isPremium === filter.isPremium);
    }

    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredModules = filteredModules.filter(module => 
        module.title.toLowerCase().includes(searchTerm) ||
        module.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filter?.sortBy) {
      filteredModules.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filter.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'students':
            aValue = a.students;
            bValue = b.students;
            break;
          case 'duration':
            aValue = parseInt(a.duration);
            bValue = parseInt(b.duration);
            break;
          case 'progress':
            aValue = a.progress;
            bValue = b.progress;
            break;
          default:
            return 0;
        }

        if (filter.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    return filteredModules;
  }

  private getMockLearningStats(): LearningStats {
    return {
      totalModules: 6,
      completedModules: 2,
      inProgressModules: 2,
      totalProgress: 47,
      timeSpent: 245,
      averageRating: 4.8,
      byCategory: {
        'business-plan': 1,
        'marketing': 2,
        'finance': 1,
        'operations': 1,
        'leadership': 1
      },
      byDifficulty: {
        'Beginner': 2,
        'Intermediate': 3,
        'Advanced': 1
      }
    };
  }
}

export const learningService = new LearningService();
