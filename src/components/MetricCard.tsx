import React from 'react';
import { Icon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: Icon;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div className="p-1 sm:p-1.5 bg-primary-50 rounded-lg">
          <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
        </div>
        <div className={`flex items-center space-x-1 text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span className="font-medium">{change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">{value}</h3>
        <p className="text-gray-600 text-xs">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;