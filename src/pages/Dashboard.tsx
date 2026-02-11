import { Flame, Star, ChevronRight, Award } from 'lucide-react';
import { useDashboard } from './dashboard/hooks/useDashboard';
import type { Language, Challenge } from './dashboard/hooks/useDashboard';

// Import components
import MetricCard from '../components/MetricCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import DailyTip from '../components/DailyTip';
import GamificationPanel from '../components/GamificationPanel';

const Dashboard = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    showChallenges,
    setShowChallenges,
    currentTime,
    metrics,
    challenges,
    todayChallenge,
    t,
    getGreeting,
    getFirstName,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {getFirstName()}
            </h1>
            <p className="text-sm text-gray-500">
              {t('welcome')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Challenges Modal */}
      {showChallenges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dailyChallenge')}
              </h3>
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
        <h2 className="text-base sm:text-lg font-semibold mb-1">{t('welcome')}</h2>
        <p className="text-primary-100 mb-2 text-xs sm:text-sm">
          {t('subtitle')}
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
            <h3 className="font-semibold text-sm text-gray-900">{t('dailyChallenge')}</h3>
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