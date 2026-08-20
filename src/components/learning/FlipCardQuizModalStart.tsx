import React from 'react';
import { Sparkles } from 'lucide-react';

interface FlipCardQuizModalStartProps {
  moduleTitle: string;
  onStart: () => void;
}

const FlipCardQuizModalStart: React.FC<FlipCardQuizModalStartProps> = ({ moduleTitle, onStart }) => {
  return (
    <div className="text-center py-10">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Checkpoint: Knowledge Gate</h3>
      <p className="text-gray-600 mb-2">You finished:</p>
      <p className="text-gray-900 font-semibold mb-6">"{moduleTitle}"</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left max-w-lg mx-auto mb-6">
        <p className="text-blue-900 font-semibold">Complete this quiz to continue to the next learning material.</p>
        <p className="text-blue-800 text-sm mt-1">No answers are revealed on incorrect attempts. You must demonstrate mastery.</p>
      </div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 text-lg font-semibold"
      >
        Start Knowledge Check
      </button>
    </div>
  );
};

export default FlipCardQuizModalStart;
