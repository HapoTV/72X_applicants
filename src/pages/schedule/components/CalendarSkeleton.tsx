import React from 'react';

const CalendarSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in px-2 sm:px-0">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(42)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-50 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CalendarSkeleton;
