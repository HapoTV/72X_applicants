// src/components/dashboard/Overview.tsx
import React, { useState } from 'react';
import DailyTip from '../../components/DailyTip';
import MetricCard from '../../components/MetricCard';
import QuickActions from '../../components/QuickActions';
import { adService } from '../../services/AdService';
import AdCarousel from './components/AdCarousel';
import EngagementSection from './components/EngagementSection';
import WelcomeSection from './components/WelcomeSection';
import AdRequestModal from './components/AdRequestModal';
import LanguageSelector from './components/LanguageSelector';
import LeaderboardPreview from './components/LeaderboardPreview';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useDashboardAds } from './hooks/useDashboardAds';
import { Banknote, AlertTriangle, Users, Target } from 'lucide-react';
import { useDashboardEngagement } from './hooks/useDashboardEngagement';
import { buildAdRequestMailto } from './utils/buildAdRequestMailto';
import { useNavigate } from 'react-router-dom';

type Language = 'en' | 'af' | 'zu';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const currentTime = useCurrentTime(1000);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [showAdRequestModal, setShowAdRequestModal] = useState<boolean>(false);

  const { ads, loadingAds, adError, refreshAds } = useDashboardAds();
  const { engagementData, loadingEngagement, refreshEngagementData } = useDashboardEngagement();

  const handleAdRequestSubmit = async (requestData: { 
    businessName: string; 
    email: string; 
    phone: string; 
    adLink: string;
    message: string 
  }) => {
    try {
      const mailtoLink = buildAdRequestMailto(requestData);
      
      // Open default email client
      window.location.href = mailtoLink;

      // Also record engagement for making a request
      await adService.recordEngagement(
        'ACTION_COMPLETED', 
        15, 
        'Requested advertising space'
      );
      
      // Close modal
      setShowAdRequestModal(false);

      // Show success message
      alert('Email client opened. Please send the email to submit your advertising request. Our team will contact you within 24 hours.');
      
      // Refresh engagement data
      setTimeout(() => {
        refreshEngagementData();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting ad request:', error);
      alert('Failed to open email client. Please contact admin@hapogroup.co.za directly with your advertising request.');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const handleAdvertiseClick = () => {
    setShowAdRequestModal(true);
  };

  const handleAdClick = () => {
    refreshEngagementData();
  };

  const readStat = (key: string, defaultValue = '--') => {
    const value = localStorage.getItem(key);
    return value && value.trim() !== '' ? value : defaultValue;
  };

  const dashboardStats = [
    {
      title: 'Revenue this month',
      value: `R ${readStat('monthlyRevenue')}`,
      icon: Banknote,
    },
    {
      title: 'Outstanding',
      value: readStat('outstanding'),
      icon: AlertTriangle,
    },
    {
      title: 'Active leads',
      value: readStat('activeLeads'),
      icon: Users,
    },
    {
      title: 'Goals achieved',
      value: readStat('goalsAchieved'),
      icon: Target,
    },
  ];

  return (
    <>
      <div className="space-y-3 animate-fade-in px-2 sm:px-0">
        {/* Language Selector */}
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />

        {/* Welcome Section */}
        <WelcomeSection 
          currentTime={currentTime}
          selectedLanguage={selectedLanguage}
        />

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {dashboardStats.map((stat) => (
            <MetricCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change=""
              trend="up"
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Assistant CTA */}
        <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm border border-indigo-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-indigo-700 mb-1">
                Ask your 72X AI
              </div>
              <p className="text-sm text-slate-600">
                "How is my business doing this month?" — your AI reads across every app you have active.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/business-analyst')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition"
            >
              Open assistant
            </button>
          </div>
        </div>

        {/* Engagement Section */}
        <EngagementSection 
          engagementData={engagementData}
          loading={loadingEngagement}
          selectedLanguage={selectedLanguage}
        />

        {/* Ads Banner Section */}
        <AdCarousel 
          ads={ads}
          loading={loadingAds}
          error={adError}
          selectedLanguage={selectedLanguage}
          onAdClick={handleAdClick}
          onAdvertiseClick={handleAdvertiseClick}
          onRefreshAds={refreshAds}
        />

        {/* Daily Tip & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <DailyTip language={selectedLanguage as 'en' | 'af' | 'zu'} />
          <QuickActions />
        </div>

        {/* Leaderboard Preview */}
          <LeaderboardPreview />
      </div>

      {/* Ad Request Modal */}
      <AdRequestModal
        isOpen={showAdRequestModal}
        onClose={() => setShowAdRequestModal(false)}
        onSubmit={handleAdRequestSubmit}
        language={selectedLanguage}
      />
    </>
  );
};

export default Overview;