import React from 'react';
import { Flame, Star } from 'lucide-react';

interface QuizStatsProps {
  xp: number;
  streak: number;
}

const QuizStats: React.FC<QuizStatsProps> = ({ xp, streak }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
        <Star className="w-4 h-4" />
        <span className="text-xs font-semibold">XP {xp}</span>
      </span>
      <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-800 px-2 py-1 rounded-full">
        <Flame className="w-4 h-4" />
        <span className="text-xs font-semibold">Streak {streak}</span>
      </span>
    </div>
  );
};

export default QuizStats;
