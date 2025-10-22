import React from 'react';
import { Award, Zap } from 'lucide-react';

const GamificationPanel: React.FC = () => {
  const engagement = (() => {
    try { return JSON.parse(localStorage.getItem('engagement') || 'null'); } catch { return null; }
  })();

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-2 sm:p-3 text-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Engagement</h3>
        <span className="text-xs opacity-80">This week</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div>
          {engagement ? (
            <>
              <h3 className="text-md font-medium">{engagement.levelTitle || 'Engagement'}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-0.5">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">{engagement.streakLabel || ''}</span>
                </div>
                <div className="flex items-center space-x-0.5">
                  <Award className="w-3 h-3" />
                  <span className="text-xs">{engagement.badgesLabel || ''}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-4" />
          )}
        </div>
        {engagement ? (
          <div className="text-right">
            <div className="text-xl font-bold">{engagement.xpLabel || ''}</div>
            <div className="text-xs opacity-80">{engagement.nextLevelLabel || ''}</div>
          </div>
        ) : (
          <div className="text-right" />
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${engagement ? engagement.progressPercent || 0 : 0}%` }}
          />
        </div>
      </div>
      {/* Optional: Extend with real badges/goals when available */}
    </div>
  );
};

export default GamificationPanel;