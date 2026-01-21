// src/services/QuizAttemptService.ts
import axiosClient from '../api/axiosClient';
import type { QuizAttempt, QuizAttemptCreateRequest } from '../interfaces/QuizAttemptData';

class QuizAttemptService {
  private baseUrl = '/learning-materials';

  /**
   * Records a quiz attempt event for a learning material.
   *
   * This is implemented as a safe call: if the backend endpoint does not exist yet,
   * the method will not throw (to avoid breaking the app).
   */
  async recordAttempt(request: QuizAttemptCreateRequest): Promise<QuizAttempt | null> {
    try {
      // Proposed endpoint (backend can implement): POST /learning-materials/progress/event
      // We reuse the same event pipe as learning progress.
      const response = await axiosClient.post(`${this.baseUrl}/progress/event`, {
        userEmail: request.userEmail,
        materialId: request.materialId,
        event: request.status === 'STARTED' ? 'QUIZ_STARTED' : request.status === 'PASSED' ? 'QUIZ_PASSED' : 'QUIZ_FAILED',
        occurredAt: request.occurredAt,
        score: request.score,
        totalQuestions: request.totalQuestions,
        percentage: request.percentage,
      });
      return response.data as QuizAttempt;
    } catch (error) {
      console.warn('QuizAttemptService.recordAttempt failed (safe to ignore until backend supports it):', error);
      return null;
    }
  }
}

export const quizAttemptService = new QuizAttemptService();
export default quizAttemptService;
