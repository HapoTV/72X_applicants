import React from 'react';

interface QuestionOrderStepProps {
  steps: string[];
  orderedSteps: string[];
  onOrderedStepsChange: (steps: string[]) => void;
  onOrderTouched: (touched: boolean) => void;
}

const QuestionOrderStep: React.FC<QuestionOrderStepProps> = ({
  steps,
  orderedSteps,
  onOrderedStepsChange,
  onOrderTouched,
}) => {
  // ✅ Reusable swap function
  const swap = (from: number, to: number) => {
    const updated = [...orderedSteps];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    onOrderedStepsChange(updated);
    onOrderTouched(true);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-600">
        Arrange the steps in correct order
      </div>

      {orderedSteps.map((step, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === orderedSteps.length - 1;

        return (
          <div
            key={idx} // ✅ safer than step text
            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl"
          >
            {/* Step number */}
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border text-sm font-bold">
              {idx + 1}
            </div>

            {/* Step text */}
            <div className="flex-1 text-sm font-medium text-gray-800">
              {step}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => !isFirst && swap(idx, idx - 1)}
                disabled={isFirst}
                className={`px-3 py-1 text-sm rounded-lg transition ${
                  isFirst
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                ↑
              </button>

              <button
                onClick={() => !isLast && swap(idx, idx + 1)}
                disabled={isLast}
                className={`px-3 py-1 text-sm rounded-lg transition ${
                  isLast
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                ↓
              </button>
            </div>
          </div>
        );
      })}

      {/* ✅ Reset button (important UX fix) */}
      <button
        onClick={() => {
          onOrderedStepsChange([...steps]);
          onOrderTouched(false);
        }}
        className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Reset Order
      </button>
    </div>
  );
};

export default QuestionOrderStep;