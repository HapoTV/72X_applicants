import React from 'react';

interface QuestionFillBlankProps {
  wordBank: string[];
  fillBlankSelected: string | null;
  onFillBlankSelect: (word: string | null) => void;
}

const QuestionFillBlank: React.FC<QuestionFillBlankProps> = ({
  wordBank,
  fillBlankSelected,
  onFillBlankSelect,
}) => {
  const handleSelect = (word: string) => {
    // ✅ Toggle selection (better UX)
    if (fillBlankSelected === word) {
      onFillBlankSelect(null);
    } else {
      onFillBlankSelect(word);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-2">
          Word bank
        </div>

        <div className="flex flex-wrap gap-2">
          {wordBank.map((w) => {
            const isSelected = fillBlankSelected === w;

            return (
              <button
                key={w}
                onClick={() => handleSelect(w)}
                className={`px-3 py-2 rounded-lg border text-sm transition ${
                  isSelected
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
              >
                {w}
              </button>
            );
          })}

          <button
            onClick={() => onFillBlankSelect(null)}
            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionFillBlank;