// src/interfaces/LearningData.ts

/**
 * Core Learning Module Interface
 */
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  duration: string; // Duration in minutes or formatted string
  lessons: number;
  difficulty: DifficultyLevel;
  rating: number;
  students: number;
  isPremium: boolean;
  progress: number; // 0-100
  thumbnail?: string;
  instructor?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Learning categories
 */
export type LearningCategory = 
  | 'business-plan'
  | 'marketing'
  | 'finance'
  | 'operations'
  | 'leadership'
  | 'standardbank'
  | 'technology'
  | 'sales'
  | 'strategy';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced';

/**
 * Category display names for UI
 */
export const LearningCategoryDisplay: Record<LearningCategory, string> = {
  'business-plan': 'Business Planning',
  'marketing': 'Marketing & Sales',
  'finance': 'Financial Management',
  'operations': 'Operations',
  'leadership': 'Leadership',
  'standardbank': 'StandardBank',
  'technology': 'Technology',
  'sales': 'Sales',
  'strategy': 'Strategy'
};

/**
 * Category options for dropdowns
 */
export const LearningCategoryOptions: { value: LearningCategory; label: string }[] = [
  { value: 'business-plan', label: 'Business Planning' },
  { value: 'marketing', label: 'Marketing & Sales' },
  { value: 'finance', label: 'Financial Management' },
  { value: 'operations', label: 'Operations' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'standardbank', label: 'StandardBank' },
  { value: 'technology', label: 'Technology' },
  { value: 'sales', label: 'Sales' },
  { value: 'strategy', label: 'Strategy' }
];

/**
 * Difficulty level display names
 */
export const DifficultyLevelDisplay: Record<DifficultyLevel, string> = {
  'Beginner': 'Beginner',
  'Intermediate': 'Intermediate',
  'Advanced': 'Advanced'
};

/**
 * User-specific learning module view
 */
export interface UserLearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  difficulty: string;
  rating: number;
  students: number;
  isPremium: boolean;
  progress: number;
  thumbnail?: string;
  isCompleted: boolean;
  isLocked: boolean;
  lastAccessed?: string;
  // Resource information for file/URL access
  resourceUrl?: string;
  fileName?: string;
  type?: string;

  // Backend-tracked per-user progress (optional)
  openedAt?: string;
  finishedAt?: string;
  quizStartedAt?: string;
  quizPassedAt?: string;
  quizAttempts?: number;
  lastQuizScore?: number;
  lastQuizTotalQuestions?: number;
  lastQuizPercentage?: number;
}

/**
 * Learning progress tracking
 */
export interface LearningProgress {
  moduleId: string;
  userId: string;
  progress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedAt?: string;
}

/**
 * Learning session data
 */
export interface LearningSession {
  id: string;
  moduleId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; //in minutes
  lessonsCompleted: number;
  progressBefore: number;
  progressAfter: number;
}

/**
 * Learning statistics for dashboard
 */
export interface LearningStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalProgress: number;
  timeSpent: number; // total minutes
  averageRating: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
}

/**
 * API Response structure for learning modules
 */
export interface LearningModuleApiResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  difficulty: string;
  rating: number;
  students: number;
  isPremium: boolean;
  progress: number;
  thumbnail?: string;
  instructor?: string;
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating/updating learning modules
 */
export interface LearningModuleRequest {
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  difficulty: string;
  rating: number;
  isPremium: boolean;
  thumbnail?: string;
  instructor?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
}

/**
 * Learning module filter options
 */
export interface LearningModuleFilter {
  category?: LearningCategory | 'all';
  difficulty?: DifficultyLevel | 'all';
  isPremium?: boolean | 'all';
  search?: string;
  sortBy?: 'title' | 'rating' | 'students' | 'duration' | 'progress';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Per-user learning progress DTO (backend sync)
 */
export interface LearningMaterialUserProgress {
  userEmail: string;
  materialId: string;

  openedAt?: string;
  finishedAt?: string;
  quizStartedAt?: string;
  quizPassedAt?: string;

  progress?: number; // 0-100
  attempts?: number;

  lastQuizScore?: number;
  lastQuizTotalQuestions?: number;
  lastQuizPercentage?: number;

  lastAccessed?: string;
}

/**
 * Request payload to record progress events (backend sync)
 */
export interface LearningProgressEventRequest {
  userEmail: string;
  materialId: string;
  event:
    | 'OPENED'
    | 'FINISHED'
    | 'QUIZ_STARTED'
    | 'QUIZ_PASSED'
    | 'QUIZ_FAILED'
    | 'PROGRESS_UPDATED';

  occurredAt?: string;
  progress?: number;

  score?: number;
  totalQuestions?: number;
  percentage?: number;
}
