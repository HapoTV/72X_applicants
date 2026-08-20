import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AnalyticsMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  title,
  value,
  change,
  changeColor,
  icon: Icon,
  iconBgColor,
  iconColor
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className={`text-sm font-medium ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        {value}
      </h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

export default AnalyticsMetricCard;
