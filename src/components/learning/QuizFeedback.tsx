import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface QuizFeedbackProps {
  feedback: FeedbackState;
  score: number;
  totalQuestions: number;
  streak: number;
  explanation?: string;
  revealedExplanation: boolean;
  onToggleExplanation: () => void;
  onNext: () => void;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  feedback,
  score,
  totalQuestions,
  streak,
  explanation,
  revealedExplanation,
  onToggleExplanation,
  onNext,
}) => {
  if (feedback === 'idle') return null;

  return (
    <div
      className={`mt-5 rounded-xl border p-4 ${
        feedback === 'correct' ? 'border-green-300 bg-green-50' : 'border-orange-300 bg-orange-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-800' : 'text-orange-900'}`}>
            {feedback === 'correct' ? 'Correct! Keep going.' : 'Almost there — review and try again!'}
          </h4>
          <p className={`mt-1 text-sm ${feedback === 'correct' ? 'text-green-800' : 'text-orange-900'}`}>
            {feedback === 'correct'
              ? `+${10 + Math.min(20, streak * 2)} XP earned. Your streak grows!`
              : 'No correct answer is revealed. You must demonstrate mastery to pass.'}
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-800 bg-white/70 border border-white/60 rounded-full px-3 py-1">
          Score {score}/{totalQuestions}
        </div>
      </div>

      {feedback === 'correct' && explanation && (
        <div className="mt-4">
          <button
            onClick={onToggleExplanation}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/70 border border-white/60 rounded-lg text-sm font-semibold text-gray-900 hover:bg-white"
          >
            {revealedExplanation ? 'Hide why this is correct' : 'Why is this correct?'}
            {revealedExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {revealedExplanation && <div className="mt-3 p-4 bg-white/70 border border-white/60 rounded-xl text-gray-900">{explanation}</div>}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onNext} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black">
          Next Card
        </button>
      </div>
    </div>
  );
};

export default QuizFeedback;
