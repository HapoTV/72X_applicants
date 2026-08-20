import React from 'react';

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
