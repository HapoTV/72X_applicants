// src/components/dashboard/components/LeaderboardPreview.tsx
import React from 'react';

interface LeaderboardPreviewProps {
  engagementData: any;
}

const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({ engagementData }) => {
  if (!engagementData?.leaderboard || engagementData.leaderboard.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Top Engagers This Week</h3>
        <div className="text-[11px] text-primary-700 bg-primary-50 border border-primary-100 px-2 py-1 rounded-full whitespace-nowrap">
          Engage more to reach the Top 3
        </div>
      </div>
      <div className="space-y-2">
        {engagementData.leaderboard.slice(0, 3).map((user: any, index: number) => (
          <div key={user.userId || index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                  index === 1 ? 'bg-gray-100 text-gray-600' : 
                  'bg-orange-100 text-orange-600'}`}>
                {index + 1}
              </span>
              <span className="text-sm text-gray-600 truncate max-w-[120px]">
                {user.userName || `User ${index + 1}`}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {user.totalScore || 0} XP
            </span>
          </div>
        ))}
        {engagementData.rank > 3 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                {engagementData.rank}
              </span>
              <span className="text-sm text-gray-600">You</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {engagementData.totalScore || 0} XP
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPreview;