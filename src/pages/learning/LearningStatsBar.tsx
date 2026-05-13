// src/pages/learning/LearningStatsBar.tsx
import React from 'react';
import { BookOpen, CheckCircle, Brain } from 'lucide-react';
import { CATEGORIES } from './useLearningModules';

interface Props {
  selectedCategory: string;
  totalModules: number;
  completedCount: number;
  inProgressCount: number;
}

const LearningStatsBar: React.FC<Props> = ({ selectedCategory, totalModules, completedCount, inProgressCount }) => {
  const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name ?? 'Learning';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{categoryName} Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Modules</p>
              <p className="text-2xl font-bold text-blue-800">{totalModules}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-800">{completedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-purple-800">{inProgressCount}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatsBar;
