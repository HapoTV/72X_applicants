import React from 'react';
import type { TimeRange } from '../analyticsHelpers';

interface AnalyticsHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ timeRange, onTimeRangeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Analytics</h1>
        <p className="text-gray-600">Track your business performance and growth metrics</p>
      </div>
      
      <div className="mt-4 sm:mt-0">
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="3months">Last 3 months</option>
          <option value="6months">Last 6 months</option>
          <option value="1year">Last year</option>
        </select>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
