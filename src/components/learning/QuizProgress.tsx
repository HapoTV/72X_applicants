import React from 'react';
import QuizStats from './QuizStats';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  progressPercentage: number;
  xp: number;
  streak: number;
  quizStarted: boolean;
  completed: boolean;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  progressPercentage,
  xp,
  streak,
  quizStarted,
  completed,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>
          {quizStarted && !completed ? `Question ${currentQuestion} of ${totalQuestions}` : 'Checkpoint'}
        </span>
        <QuizStats xp={xp} streak={streak} />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};

export default QuizProgress;
