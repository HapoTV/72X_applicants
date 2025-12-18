import React from 'react';
import { CheckCircle, Trophy, Star, Sparkles } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  moduleTitle: string;
  onClose: () => void;
  onStartQuiz: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ 
  isOpen, 
  moduleTitle, 
  onClose, 
  onStartQuiz 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 scale-100">
        {/* Animated celebration icons */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Congratulations! 🎉
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            You've completed <span className="font-semibold text-primary-600">"{moduleTitle}"</span>!
          </p>
          <p className="text-gray-600 mb-4">
            Amazing progress! Ready to test your knowledge?
          </p>
        </div>

        {/* Achievement badges */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-1 bg-green-100 px-3 py-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Completed</span>
          </div>
          <div className="flex items-center space-x-1 bg-blue-100 px-3 py-2 rounded-full">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">+10 XP</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Continue to the next learning material by completing a quick quiz to prove your understanding!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onStartQuiz}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
