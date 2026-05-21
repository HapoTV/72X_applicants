import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { roadmapService } from '../../services/RoadmapService';
import type { FormData } from '../roadmapHelpers';

interface SavedRoadmap {
  id: string;
  title: string;
  formData: FormData;
  createdAt: string;
  isExpanded?: boolean;
}

interface RoadmapHistoryProps {
  roadmapHistory: SavedRoadmap[];
  showHistory: boolean;
  onToggleHistory: () => void;
  onLoadRoadmap: (formData: FormData) => void;
  onDeleteRoadmap: (roadmapId: string) => void;
}

const RoadmapHistory: React.FC<RoadmapHistoryProps> = ({
  roadmapHistory,
  showHistory,
  onToggleHistory,
  onLoadRoadmap,
  onDeleteRoadmap
}) => {
  if (roadmapHistory.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recently Generated</h2>
        <button
          onClick={onToggleHistory}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {showHistory ? 'Hide' : 'Show'} ({roadmapHistory.length})
        </button>
      </div>
      
      {showHistory && (
        <div className="space-y-3">
          {roadmapHistory.map((savedRoadmap) => (
            <div key={savedRoadmap.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{savedRoadmap.title}</h3>
                    <p className="text-sm text-gray-600">
                      {roadmapService.formatDate(savedRoadmap.createdAt)} • 
                      {savedRoadmap.formData.businessType} • {savedRoadmap.formData.stage}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onLoadRoadmap(savedRoadmap.formData)}
                    className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                  >
                    Reuse
                  </button>
                  <button
                    onClick={() => onDeleteRoadmap(savedRoadmap.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapHistory;
