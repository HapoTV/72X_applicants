import React from 'react';
import { Trophy } from 'lucide-react';

interface FlipCardQuizModalCompletionProps {
  passed: boolean;
  score: number;
  totalQuestions: number;
  percentage: number;
  onPass: () => void;
  onRetry: () => void;
  onClose: () => void;
}

const FlipCardQuizModalCompletion: React.FC<FlipCardQuizModalCompletionProps> = ({
  passed,
  score,
  totalQuestions,
  percentage,
  onPass,
  onRetry,
  onClose,
}) => {
  return (
    <div
      className={`text-center py-8 transition-all duration-500 ${
        passed ? 'bg-gradient-to-b from-green-50 to-white' : 'bg-gradient-to-b from-blue-50 to-white'
      }`}
    >
      {passed ? (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-green-800 mb-3">Awesome! 🎉</h3>
            <p className="text-green-700 mb-2 text-lg">You've passed with {percentage}%!</p>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Great job! You've unlocked the next learning material.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onPass}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue Learning →
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <div className="text-4xl">💡</div>
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-3">Keep Going! 🌱</h3>
            <p className="text-blue-700 mb-2">You scored {score} out of {totalQuestions} ({percentage}%)</p>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You're making progress! Review the material and try again. Every attempt helps you learn.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-3 border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              ↻ Try Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Review Material
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlipCardQuizModalCompletion;
