// src/interfaces/QuizAttemptData.ts

export type QuizAttemptStatus = 'STARTED' | 'PASSED' | 'FAILED';

export interface QuizAttempt {
  id?: string;
  userEmail: string;
  materialId: string;
  status: QuizAttemptStatus;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface QuizAttemptCreateRequest {
  userEmail: string;
  materialId: string;
  status: QuizAttemptStatus;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  occurredAt?: string;
}
