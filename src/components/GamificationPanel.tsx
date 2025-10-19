import React from 'react';
import { Award, Star, Trophy, Zap, Target, TrendingUp } from 'lucide-react';

const GamificationPanel: React.FC = () => {
  const userStats = {
    level: 7,
    xp: 2450,
    xpToNext: 3000,
    streak: 12,
    badges: 8,
    rank: 'Bronze Entrepreneur'
  };

  const recentBadges = [
    { name: 'First Sale', icon: Trophy, color: 'text-yellow-500', earned: true },
    { name: 'Social Media Pro', icon: Star, color: 'text-blue-500', earned: true },
    { name: 'Finance Guru', icon: TrendingUp, color: 'text-green-500', earned: false },
    { name: 'Community Helper', icon: Award, color: 'text-purple-500', earned: true },
  ];

  const weeklyGoals = [
    { task: 'Complete 3 learning modules', progress: 2, total: 3, xp: 150 },
    { task: 'Post 5 products to marketplace', progress: 3, total: 5, xp: 100 },
    { task: 'Help 2 community members', progress: 1, total: 2, xp: 75 },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-2 sm:p-3 text-white">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-md font-medium">Level {userStats.level} - {userStats.rank}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-0.5">
              <Zap className="w-3 h-3" />
              <span className="text-xs">{userStats.streak} day streak</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <Award className="w-3 h-3" />
              <span className="text-xs">{userStats.badges} badges</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{userStats.xp} XP</div>
          <div className="text-xs opacity-80">{userStats.xpToNext - userStats.xp} to next level</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
          />
        </div>
      </div>

      {/* Recent Badges */}
      <div className="mb-2">
        <h4 className="font-medium mb-1">Recent Achievements</h4>
        <div className="flex space-x-1 overflow-x-auto">
          {recentBadges.map((badge, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 p-1 rounded-lg ${
                badge.earned ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'
              }`}
            >
              <badge.icon className={`w-4 h-4 ${badge.earned ? badge.color : 'text-gray-400'}`} />
              <div className="text-xs mt-0.5 text-center">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Goals */}
      <div>
        <h4 className="font-medium mb-1">Weekly Goals</h4>
        <div className="space-y-1">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="bg-white bg-opacity-10 rounded-lg p-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs">{goal.task}</span>
                <span className="text-xs">+{goal.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex-1 bg-white bg-opacity-20 rounded-full h-1.5">
                  <div 
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(goal.progress / goal.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs">{goal.progress}/{goal.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;