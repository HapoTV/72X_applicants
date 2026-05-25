import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  monthName: string;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<Props> = ({ monthName, year, onPrevious, onNext }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
      {monthName} {year}
    </h3>
    <div className="flex space-x-1">
      <button
        onClick={onPrevious}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      <button
        onClick={onNext}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Next month"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  </div>
);

export default CalendarHeader;
