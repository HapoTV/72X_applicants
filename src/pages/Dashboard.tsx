import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, Award, Flame, Star, ChevronRight } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import DailyTip from '../components/DailyTip';
import GamificationPanel from '../components/GamificationPanel.tsx';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-3 sm:p-4 text-white">
        <h1 className="text-lg sm:text-xl font-bold mb-1">
          {getGreeting()}, Thabo! 🚀
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