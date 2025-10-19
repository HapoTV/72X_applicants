import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import DailyTip from '../../components/DailyTip';
import QuickActions from '../../components/QuickActions';

const Overview: React.FC = () => {
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
    },
    af: {
      welcome: "Welkom by SeventyTwoX",
      subtitle: "Bemagtiging van Suid-Afrikaanse entrepreneurs om florerende besighede te bou",
    },
    zu: {
      welcome: "Siyakwamukela ku-SeventyTwoX",
      subtitle: "Sinikeza amandla osomabhizinisi baseNingizimu Afrika ukuthi bakhe amabhizinisi aphumelelayo",
    }
  };

  const t = translations[selectedLanguage] || translations.en;

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
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 sm:p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold">Level 7 - Bronze Entrepreneur</h3>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs">12 day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">8 badges</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">2450 XP</div>
            <div className="text-xs opacity-80">550 to next level</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: '82%' }}
            />
          </div>
        </div>
      </div>

      {/* Daily Tip & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DailyTip language={selectedLanguage} />
        <QuickActions />
      </div>
    </div>
  );
};

export default Overview;
