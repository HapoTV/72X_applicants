// src/components/dashboard/Overview.tsx
import React, { useState } from 'react';
import DailyTip from '../../components/DailyTip';
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
import { useDashboardEngagement } from './hooks/useDashboardEngagement';
import { buildAdRequestMailto } from './utils/buildAdRequestMailto';

type Language = 'en' | 'af' | 'zu';

const Overview: React.FC = () => {
  const currentTime = useCurrentTime(1000);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [showAdRequestModal, setShowAdRequestModal] = useState<boolean>(false);

  const { ads, loadingAds, adError, refreshAds } = useDashboardAds();
  const { engagementData, loadingEngagement, refreshEngagementData } = useDashboardEngagement();

  const handleAdRequestSubmit = async (requestData: { 
    businessName: string; 
    email: string; 
    phone: string; 
    description: string;
    infoLink: string;
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
      alert('Failed to open email client. Please contact admin@seventytwox.com directly with your advertising request.');
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
        <LeaderboardPreview engagementData={engagementData} />
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