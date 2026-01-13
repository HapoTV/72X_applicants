// src/components/dashboard/components/EngagementSection.tsx
import React from 'react';

type Language = 'en' | 'af' | 'zu';

interface EngagementSectionProps {
  engagementData: any;
  loading: boolean;
  selectedLanguage: Language;
}

const translations = {
  en: {
    engagement: "Engagement",
    myEngagement: "My engagement",
    dayStreak: "day streak",
    badges: "badges",
  },
  af: {
    engagement: "Betrokkenheid",
    myEngagement: "My betrokkenheid",
    dayStreak: "dag reeks",
    badges: "kentekens",
  },
  zu: {
    engagement: "Ukuzibandakanya",
    myEngagement: "Ukuzibandakanya kwami",
    dayStreak: "ilanga lezinsuku",
    badges: "amabheji",
  }
};

const EngagementSection: React.FC<EngagementSectionProps> = ({ 
  engagementData, 
  loading, 
  selectedLanguage 
}) => {
  const t = translations[selectedLanguage];

  if (loading && !engagementData) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 sm:p-4 text-white animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-white bg-opacity-20 rounded w-24"></div>
          <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-2">
            <div className="h-4 bg-white bg-opacity-20 rounded w-32"></div>
            <div className="flex space-x-3">
              <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
              <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-6 bg-white bg-opacity-20 rounded w-20"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-24"></div>
          </div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2"></div>
      </div>
    );
  }

  const data = engagementData || JSON.parse(localStorage.getItem('engagement') || 'null');

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 sm:p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{t.engagement}</h3>
        <span className="text-xs opacity-80">{t.myEngagement}</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          {data ? (
            <>
              <h3 className="text-sm font-semibold">{data.levelTitle || 'Newbie'}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs">
                    {data.streakLabel || '0 day streak'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs">
                    {data.badgesLabel || '0 badges'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-semibold">Newbie</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs">0 {t.dayStreak}</span>
                <span className="text-xs">0 {t.badges}</span>
              </div>
            </>
          )}
        </div>
        {data ? (
          <div className="text-right">
            <div className="text-lg font-bold">{data.xpLabel || '0 XP'}</div>
            <div className="text-xs opacity-80">{data.nextLevelLabel || 'Start engaging!'}</div>
          </div>
        ) : (
          <div className="text-right">
            <div className="text-lg font-bold">0 XP</div>
            <div className="text-xs opacity-80">Start engaging!</div>
          </div>
        )}
      </div>
      <div className="mb-3">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${data?.progressPercent || 0}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>
      </div>
      
      {/* Additional Engagement Stats */}
      {data?.stats && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white border-opacity-20">
          <div className="text-center">
            <div className="text-sm font-bold">{data.stats.adClicks || 0}</div>
            <div className="text-xs opacity-80">Ad Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">{data.stats.adViews || 0}</div>
            <div className="text-xs opacity-80">Ad Views</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">{data.stats.totalEngagements || 0}</div>
            <div className="text-xs opacity-80">Total</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementSection;