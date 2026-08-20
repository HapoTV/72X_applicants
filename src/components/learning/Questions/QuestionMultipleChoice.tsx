import React from 'react';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface QuestionMultipleChoiceProps {
  options: string[];
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  feedback: FeedbackState;
}

const QuestionMultipleChoice: React.FC<QuestionMultipleChoiceProps> = ({
  options,
  selectedAnswer,
  onAnswerSelect,
  feedback,
}) => {
  return (
    <div className="space-y-3">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onAnswerSelect(idx)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            feedback !== 'idle'
              ? selectedAnswer === idx
                ? feedback === 'correct'
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-orange-500 bg-orange-50 text-orange-900'
                : 'border-gray-200 bg-white text-gray-700'
              : selectedAnswer === idx
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}
          disabled={feedback !== 'idle'}
        >
          <span className="font-medium">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default QuestionMultipleChoice;
