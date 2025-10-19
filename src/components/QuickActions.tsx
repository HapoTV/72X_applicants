import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, Users, AppWindow } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  // Only Startup package features
  const actions = [
    {
      title: 'Learning Modules',
      description: 'Build essential business skills',
      icon: GraduationCap,
      action: () => navigate('/learning'),
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      title: 'Schedule',
      description: 'Manage your calendar and events',
      icon: Calendar,
      action: () => navigate('/schedule'),
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
    {
      title: 'Community',
      description: 'Connect with other entrepreneurs',
      icon: Users,
      action: () => navigate('/community'),
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      title: 'Selected Programs',
      description: 'View your applications',
      icon: AppWindow,
      action: () => navigate('/applications'),
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left group"
          >
            <div className={`inline-flex p-1.5 sm:p-2 rounded-lg ${action.color} mb-2 transition-colors`}>
              <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors text-xs sm:text-sm">
              {action.title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;