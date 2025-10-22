import React, { useState, useEffect } from 'react';
import { TrendingUp, Banknote, Users, Target, Award, Flame, Star, ChevronRight } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import DailyTip from '../components/DailyTip';
import GamificationPanel from '../components/GamificationPanel.tsx';
import { supabase } from '../lib/supabaseClient';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showChallenges, setShowChallenges] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // On load, hydrate metrics and community updates from Supabase if available
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user;
        if (!user) return;

        const { data: metricsRow } = await supabase
          .from('metrics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (metricsRow) {
          localStorage.setItem('monthlyRevenue', metricsRow.monthly_revenue ?? '--');
          localStorage.setItem('activeCustomers', metricsRow.active_customers ?? '--');
          localStorage.setItem('growthRate', metricsRow.growth_rate ?? '--');
          localStorage.setItem('goalsAchieved', metricsRow.goals_achieved ?? '--');
        }

        const { data: highlights } = await supabase
          .from('community_highlights')
          .select('initials,title,message,timestamp')
          .order('timestamp', { ascending: false })
          .limit(20);
        if (highlights) {
          localStorage.setItem('communityUpdates', JSON.stringify(highlights));
        }
      } catch {
        // ignore fetch errors
      }
    })();
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'zu', name: 'isiZulu' },
    { code: 'xh', name: 'isiXhosa' },
    { code: 'st', name: 'Sesotho' },
    { code: 'tn', name: 'Setswana' },
  ];

  const translations = {
    en: {
      welcome: "Welcome to SeventyTwoX",
      subtitle: "Empowering South African entrepreneurs to build thriving businesses",
      monthlyRevenue: "Monthly Revenue",
      activeCustomers: "Active Customers",
      growthRate: "Growth Rate",
      goalsAchieved: "Goals Achieved",
      dailyChallenge: "Today's Challenge",
      yourProgress: "Your Progress",
      quickActions: "Quick Actions"
    },
    af: {
      welcome: "Welkom by SeventyTwoX",
      subtitle: "Bemagtiging van Suid-Afrikaanse entrepreneurs om florerende besighede te bou",
      monthlyRevenue: "Maandelikse Inkomste",
      activeCustomers: "Aktiewe Kliënte",
      growthRate: "Groeikoers",
      goalsAchieved: "Doelwitte Bereik",
      dailyChallenge: "Vandag se Uitdaging",
      yourProgress: "Jou Vordering",
      quickActions: "Vinnige Aksies"
    },
    zu: {
      welcome: "Siyakwamukela ku-SeventyTwoX",
      subtitle: "Sinikeza amandla osomabhizinisi baseNingizimu Afrika ukuthi bakhe amabhizinisi aphumelelayo",
      monthlyRevenue: "Imali Yenyanga",
      activeCustomers: "Amakhasimende Asebenzayo",
      growthRate: "Izinga Lokukhula",
      goalsAchieved: "Izinjongo Ezifinyelelwe",
      dailyChallenge: "Inselelo Yanamuhla",
      yourProgress: "Inqubekelaphambili Yakho",
      quickActions: "Izenzo Ezisheshayo"
    }
  };

  const t = translations[selectedLanguage] || translations.en;

  const readMetric = (key: string) => {
    const v = (localStorage.getItem(key) || '').trim();
    return v || '--';
  };

  const metrics = [
    {
      title: t.monthlyRevenue,
      value: readMetric('monthlyRevenue'),
      change: '',
      trend: 'up' as const,
      icon: Banknote,
    },
    {
      title: t.activeCustomers,
      value: readMetric('activeCustomers'),
      change: '',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: t.growthRate,
      value: readMetric('growthRate'),
      change: '',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      title: t.goalsAchieved,
      value: readMetric('goalsAchieved'),
      change: '',
      trend: 'up' as const,
      icon: Target,
    },
  ];

  // Platform-aligned challenge catalog (progress intentionally empty for now)
  type Challenge = { id: string; title: string; description: string; reward: string; total: number };
  const challenges: Challenge[] = [
    {
      id: 'marketplace_post',
      title: "Post 3 products on the marketplace",
      description: "Increase visibility by showcasing your best products.",
      reward: "50 XP + Visibility Badge",
      total: 3
    },
    {
      id: 'learning_module',
      title: "Complete 1 learning module",
      description: "Boost your skills in Business Planning, Marketing, Finance, Ops or Leadership.",
      reward: "100 XP + Knowledge Badge",
      total: 1
    },
    {
      id: 'funding_apply',
      title: "Shortlist 2 funding opportunities",
      description: "Use Funding Finder to bookmark suitable grants/loans/investors.",
      reward: "40 XP + Funding Ready",
      total: 2
    },
    {
      id: 'mentorship_message',
      title: "Send 1 question to a mentor",
      description: "Start a conversation in Mentorship Hub to get advice.",
      reward: "60 XP + Networker Badge",
      total: 1
    },
    {
      id: 'data_input_update',
      title: "Update today's sales/customers",
      description: "Record your daily numbers in Data Input so analytics can track growth.",
      reward: "35 XP + Consistency Streak",
      total: 1
    },
    {
      id: 'analytics_review',
      title: "Review your analytics",
      description: "Open the Analytics page to review trends and insights.",
      reward: "25 XP + Insightful",
      total: 1
    },
    {
      id: 'roadmap_task',
      title: "Complete 1 roadmap task",
      description: "Tick off a task in your AI roadmap to move your business forward.",
      reward: "80 XP + Momentum",
      total: 1
    },
    {
      id: 'community_reply',
      title: "Reply to 2 community posts",
      description: "Help peers or share your experience in Community discussions.",
      reward: "40 XP + Helper Badge",
      total: 2
    },
    {
      id: 'profile_complete',
      title: "Complete your profile",
      description: "Add/update business info so recommendations are more accurate.",
      reward: "30 XP + Profile Pro",
      total: 1
    },
    {
      id: 'schedule_event',
      title: "Add 1 business event to your calendar",
      description: "Schedule a key activity to stay on track.",
      reward: "20 XP + Planner",
      total: 1
    },
    {
      id: 'expert_session',
      title: "Watch 1 expert session clip",
      description: "Learn a tactic from the Experts page and jot one takeaway.",
      reward: "30 XP + Learner",
      total: 1
    },
    {
      id: 'funding_apply_draft',
      title: "Draft 1 funding application answer",
      description: "Prepare your company overview for a funding application.",
      reward: "50 XP + Funding Ready",
      total: 1
    }
  ];

  // Auto-rotate today's challenge once per day (localStorage scaffold)
  const getTodayChallenge = (): Challenge => {
    const today = new Date();
    const keyDate = 'challengeDate';
    const keyIdx = 'challengeIndex';
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const storedDate = localStorage.getItem(keyDate);
    let idx = Number(localStorage.getItem(keyIdx));
    if (!Number.isInteger(idx)) idx = -1;

    if (storedDate !== todayStr) {
      idx = (idx + 1 + challenges.length) % challenges.length;
      localStorage.setItem(keyIdx, String(idx));
      localStorage.setItem(keyDate, todayStr);
    }
    return challenges[idx >= 0 ? idx : 0];
  };

  const todayChallenge = getTodayChallenge();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (selectedLanguage === 'zu') {
      if (hour < 12) return 'Sawubona';
      if (hour < 17) return 'Sanibonani';
      return 'Sawubona';
    } else if (selectedLanguage === 'af') {
      if (hour < 12) return 'Goeie môre';
      if (hour < 17) return 'Goeie middag';
      return 'Goeie aand';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFirstName = () => {
    const stored = (localStorage.getItem('firstName') || localStorage.getItem('userFirstName') || '').trim();
    if (stored) return stored.split(' ')[0];
    const email = (localStorage.getItem('userEmail') || '').trim();
    if (email && email.includes('@')) {
      const prefix = email.split('@')[0];
      const guess = prefix.split(/[._-]/)[0];
      if (guess) return guess.charAt(0).toUpperCase() + guess.slice(1);
    }
    return 'User';
  };

  return (
    <div className="space-y-3 animate-fade-in px-2 sm:px-0">
      {/* Language Selector */}
      <div className="flex justify-end mb-2">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Challenges Modal */}
      {showChallenges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">All Challenges</h3>
              <button
                onClick={() => setShowChallenges(false)}
                className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
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

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-3 sm:p-4 text-white">
        <h1 className="text-lg sm:text-xl font-bold mb-1">
          {getGreeting()}, {getFirstName()}! 🚀
        </h1>
        <h2 className="text-base sm:text-lg font-semibold mb-1">{t.welcome}</h2>
        <p className="text-primary-100 mb-2 text-xs sm:text-sm">
          {t.subtitle}
        </p>
        <div className="text-xs text-primary-200">
          {currentTime.toLocaleDateString('en-ZA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Gamification Panel */}
      <GamificationPanel />

      {/* Daily Tip & Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DailyTip language={selectedLanguage} />
        
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-sm text-gray-900">{t.dailyChallenge}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1 text-xs">{todayChallenge.title}</h4>
              <p className="text-gray-600 text-xs mb-1">{todayChallenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">0/{todayChallenge.total}</span>
                </div>
                <span className="text-xs text-orange-600 font-medium">{todayChallenge.reward}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowChallenges(true)}
            className="w-full mt-2 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            View All Challenges
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <QuickActions />
        <RecentActivity />
      </div>

      {/* Community Highlights */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900">Community Highlights</h3>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">NM</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Nomsa shared a success story</p>
              <p className="text-xs text-gray-600">"Increased sales by 40% using digital marketing tips!"</p>
            </div>
            <Star className="w-3 h-3 text-yellow-500" />
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">SP</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Sipho is offering mentorship</p>
              <p className="text-xs text-gray-600">Retail business expert - 5 years experience</p>
            </div>
            <Award className="w-3 h-3 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;