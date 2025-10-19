import React from 'react';
import { ChevronRight, Star, Award } from 'lucide-react';
import RecentActivity from '../../components/RecentActivity';

const CommunityFeed: React.FC = () => {
  return (
    <div className="space-y-3 animate-fade-in px-2 sm:px-0">
      {/* Recent Activity */}
      <RecentActivity />

      {/* Community Highlights */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900">Community Highlights</h3>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">NM</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Nomsa shared a success story</p>
              <p className="text-xs text-gray-600">"Increased sales by 40% using digital marketing tips!"</p>
            </div>
            <Star className="w-3 h-3 text-yellow-500" />
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">SP</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Sipho is offering mentorship</p>
              <p className="text-xs text-gray-600">Retail business expert - 5 years experience</p>
            </div>
            <Award className="w-3 h-3 text-green-500" />
          </div>

          <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
            <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">TM</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Thandi completed a milestone</p>
              <p className="text-xs text-gray-600">Reached 100 customers this month!</p>
            </div>
            <Star className="w-3 h-3 text-purple-500" />
          </div>

          <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">LK</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Lerato launched new product</p>
              <p className="text-xs text-gray-600">Check out the handmade jewelry collection</p>
            </div>
            <Award className="w-3 h-3 text-orange-500" />
          </div>
        </div>

        <button className="w-full mt-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          View All Community Updates
        </button>
      </div>
    </div>
  );
};

export default CommunityFeed;
