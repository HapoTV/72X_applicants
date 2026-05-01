import React from 'react';
import { Brain, X } from 'lucide-react';

interface QuizHeaderProps {
  onClose: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <Brain className="w-6 h-6 text-primary-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
          <p className="text-sm text-gray-600">Complete this checkpoint to continue your learning journey.</p>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default QuizHeader;
