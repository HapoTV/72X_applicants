import React from 'react';
import { FileText } from 'lucide-react';
import { roadmapService } from '../../services/RoadmapService';
import type { UserRoadmapItem } from '../../interfaces/RoadmapData';

interface SavedRoadmapsListProps {
  userRoadmaps: UserRoadmapItem[];
}

const SavedRoadmapsList: React.FC<SavedRoadmapsListProps> = ({ userRoadmaps }) => {
  if (userRoadmaps.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Saved Roadmaps</h2>
        <div className="text-sm text-gray-600">{userRoadmaps.length} roadmaps</div>
      </div>
      
      <div className="space-y-3">
        {userRoadmaps.slice(0, 3).map((roadmap) => (
          <div key={roadmap.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{roadmap.title}</h3>
                  <p className="text-sm text-gray-600">
                    {roadmap.businessType} • {roadmap.stage} • {roadmapService.formatDate(roadmap.createdAt || '')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${roadmapService.getStatusColor(roadmap.status)}`}>
                  {roadmap.status}
                </span>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {roadmap.progress}% Complete
                </div>
              </div>
            </div>
          </div>
        ))}
        {userRoadmaps.length > 3 && (
          <div className="text-center pt-2">
            <button 
              onClick={() => (window.location.href = '/roadmaps')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all {userRoadmaps.length} roadmaps →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRoadmapsList;
