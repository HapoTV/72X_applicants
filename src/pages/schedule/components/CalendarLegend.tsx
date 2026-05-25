import React from 'react';

const CalendarLegend: React.FC = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-primary-100 border-2 border-primary-500 rounded"></div>
      <span>Today</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
      </div>
      <span>Has Event</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
      <span>Reminder Set</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
      <span>No Reminder</span>
    </div>
  </div>
);

export default CalendarLegend;
