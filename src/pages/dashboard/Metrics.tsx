import React, { useState, useMemo } from 'react';
import { Banknote, Users, TrendingUp, Target, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

type Language = 'en' | 'af' | 'zu';

interface TranslationKeys {
  monthlyRevenue: string;
  activeCustomers: string;
  growthRate: string;
  goalsAchieved: string;
  dailyChallenge: string;
  [key: string]: string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    monthlyRevenue: "Monthly Revenue",
    activeCustomers: "Active Customers",
    growthRate: "Growth Rate",
    goalsAchieved: "Goals Achieved",
    dailyChallenge: "Today's Challenge"
  },
  af: {
    monthlyRevenue: "Maandelikse Inkomste",
    activeCustomers: "Aktiewe Kliënte",
    growthRate: "Groei Koers",
    goalsAchieved: "Doelwitte Bereik",
    dailyChallenge: "Vandag se Uitdaging"
  },
  zu: {
    monthlyRevenue: "Iholo lenyanga",
    activeCustomers: "Amakhasimende asebenzayo",
    growthRate: "Izinga lokukhula",
    goalsAchieved: "Izinhloso ezifeziwe",
    dailyChallenge: "Inselele yanamuhla"
  }
};

const Metrics: React.FC = () => {
  const [selectedLanguage] = useState<Language>('en');
  const [showChallenges, setShowChallenges] = useState(false);

  const t = useMemo(() => translations[selectedLanguage], [selectedLanguage]);

  const readMetric = (key: string) => (localStorage.getItem(key) || '').trim() || '--';
  const metrics = useMemo(() => [
    { 
      title: t.monthlyRevenue, 
      value: readMetric('monthlyRevenue'), 
      change: '', 
      trend: 'up' as const, 
      icon: Banknote as LucideIcon,
      changeType: 'increase' as const,
      link: '#'
    },
    { 
      title: t.activeCustomers, 
      value: readMetric('activeCustomers'), 
      change: '', 
      trend: 'up' as const, 
      icon: Users as LucideIcon,
      changeType: 'increase' as const,
      link: '#'
    },
    { 
      title: t.growthRate, 
      value: readMetric('growthRate'), 
      change: '', 
      trend: 'up' as const, 
      icon: TrendingUp as LucideIcon,
      changeType: 'increase' as const,
      link: '#'
    },
    { 
      title: t.goalsAchieved, 
      value: readMetric('goalsAchieved'), 
      change: '', 
      trend: 'up' as const, 
      icon: Target as LucideIcon,
      changeType: 'increase' as const,
      link: '#'
    },
  ], [t]);

  type Challenge = { id: string; title: string; description: string; reward: string; total: number };
  const challenges: Challenge[] = [
    { id: 'marketplace_post', title: 'Post 3 products on the marketplace', description: 'Increase visibility by showcasing your best products.', reward: '50 XP + Visibility Badge', total: 3 },
    { id: 'learning_module', title: 'Complete 1 learning module', description: 'Boost your skills in Business Planning, Marketing, Finance, Ops or Leadership.', reward: '100 XP + Knowledge Badge', total: 1 },
    { id: 'funding_apply', title: 'Shortlist 2 funding opportunities', description: 'Use Funding Finder to bookmark suitable grants/loans/investors.', reward: '40 XP + Funding Ready', total: 2 },
    { id: 'mentorship_message', title: 'Send 1 question to a mentor', description: 'Start a conversation in Mentorship Hub to get advice.', reward: '60 XP + Networker Badge', total: 1 },
    { id: 'data_input_update', title: "Update today's sales/customers", description: 'Record your daily numbers in Data Input so analytics can track growth.', reward: '35 XP + Consistency Streak', total: 1 },
    { id: 'analytics_review', title: 'Review your analytics', description: 'Open the Analytics page to review trends and insights.', reward: '25 XP + Insightful', total: 1 },
    { id: 'roadmap_task', title: 'Complete 1 roadmap task', description: 'Tick off a task in your AI roadmap to move your business forward.', reward: '80 XP + Momentum', total: 1 },
    { id: 'community_reply', title: 'Reply to 2 community posts', description: 'Help peers or share your experience in Community discussions.', reward: '40 XP + Helper Badge', total: 2 },
    { id: 'profile_complete', title: 'Complete your profile', description: 'Add/update business info so recommendations are more accurate.', reward: '30 XP + Profile Pro', total: 1 },
    { id: 'schedule_event', title: 'Add 1 business event to your calendar', description: 'Schedule a key activity to stay on track.', reward: '20 XP + Planner', total: 1 },
    { id: 'expert_session', title: 'Watch 1 expert session clip', description: 'Learn a tactic from the Experts page and jot one takeaway.', reward: '30 XP + Learner', total: 1 },
    { id: 'funding_apply_draft', title: 'Draft 1 funding application answer', description: 'Prepare your company overview for a funding application.', reward: '50 XP + Funding Ready', total: 1 },
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
          <div className="p-2 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1 text-xs">{challenges[0].title}</h4>
            <p className="text-gray-600 text-xs mb-1">{challenges[0].description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: '0%' }} />
                </div>
                <span className="text-xs text-gray-600">0/{challenges[0].total}</span>
              </div>
              <span className="text-xs text-orange-600 font-medium">{challenges[0].reward}</span>
            </div>
          </div>
        </div>
        
        <button onClick={() => setShowChallenges(true)} className="w-full mt-2 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          View All Challenges
        </button>
      </div>

      {/* Metrics Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Challenges Modal */}
      {showChallenges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">All Challenges</h3>
              <button onClick={() => setShowChallenges(false)} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {challenges.map((challenge: Challenge, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{challenge.title}</h4>
                    <span className="text-xs text-orange-600 font-medium">{challenge.reward}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-xs text-gray-600">0/{challenge.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
