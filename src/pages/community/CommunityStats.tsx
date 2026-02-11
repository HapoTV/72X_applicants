import React from 'react';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';
import type { CommunityStats as CommunityStatsType } from '../../interfaces/CommunityData';

interface CommunityStatsProps {
  stats: CommunityStatsType;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{(stats.totalMembers ?? 0).toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Active Members</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{(stats.activeDiscussions ?? 0).toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Discussions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{(stats.totalMentors ?? 0).toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Expert Mentors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;