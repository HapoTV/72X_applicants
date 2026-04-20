import React from 'react';

interface QuizSubmitProps {
  onSubmit: () => void;
  disabled: boolean;
  passPercentage: number;
}

const QuizSubmit: React.FC<QuizSubmitProps> = ({ onSubmit, disabled, passPercentage }) => {
  return (
    <div className="mt-5 flex items-center justify-between">
      <div className="text-sm text-gray-600">Pass mark: {passPercentage}%</div>
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`px-6 py-2 rounded-lg transition-all ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
        }`}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizSubmit;
