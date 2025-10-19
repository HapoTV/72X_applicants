import React, { useState } from 'react';
import { DollarSign, Users, TrendingUp, Target, Flame } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

const Metrics: React.FC = () => {
  const [selectedLanguage] = useState('en');

  const translations = {
    en: {
      monthlyRevenue: "Monthly Revenue",
      activeCustomers: "Active Customers",
      growthRate: "Growth Rate",
      goalsAchieved: "Goals Achieved",
      dailyChallenge: "Today's Challenge"
    },
  };

  const t = translations[selectedLanguage] || translations.en;

  const metrics = [
    {
      title: t.monthlyRevenue,
      value: 'R12,450',
      change: '+15.2%',
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      title: t.activeCustomers,
      value: '247',
      change: '+8.7%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: t.growthRate,
      value: '18.3%',
      change: '+3.1%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      title: t.goalsAchieved,
      value: '6/10',
      change: '60%',
      trend: 'up' as const,
      icon: Target,
    },
  ];

  const dailyChallenges = [
    {
      title: "Post 3 products on the marketplace",
      description: "Increase your visibility by showcasing your best products",
      reward: "50 XP + Visibility Badge",
      progress: 1,
      total: 3
    },
    {
      title: "Complete Financial Planning module",
      description: "Learn essential budgeting skills for your business",
      reward: "100 XP + Finance Expert Badge",
      progress: 0,
      total: 1
    },
    {
      title: "Connect with 2 mentors",
      description: "Expand your network and get valuable advice",
      reward: "75 XP + Networker Badge",
      progress: 0,
      total: 2
    }
  ];

  return (
    <div className="space-y-11 animate-fade-in px-2 sm:px-0">
      {/* Today's Challenge */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="font-semibold text-sm text-gray-900">{t.dailyChallenge}</h3>
        </div>
        
        <div className="space-y-2">
          {dailyChallenges.slice(0, 1).map((challenge, index) => (
            <div key={index} className="p-2 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1 text-xs">{challenge.title}</h4>
              <p className="text-gray-600 text-xs mb-1">{challenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{challenge.progress}/{challenge.total}</span>
                </div>
                <span className="text-xs text-orange-600 font-medium">{challenge.reward}</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-2 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          View All Challenges
        </button>
      </div>

      {/* Metrics Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default Metrics;
