// src/components/dashboard/Overview.tsx
import React, { useState, useEffect, useRef } from 'react';
import DailyTip from '../../components/DailyTip';
import QuickActions from '../../components/QuickActions';
import { adService } from '../../services/AdService';
import type { AdDTO } from '../../interfaces/AdData';
import AdCarousel from './components/AdCarousel';
import EngagementSection from './components/EngagementSection';
import WelcomeSection from './components/WelcomeSection';
import AdRequestModal from './components/AdRequestModal';
import LanguageSelector from './components/LanguageSelector';
import LeaderboardPreview from './components/LeaderboardPreview';

type Language = 'en' | 'af' | 'zu';

const Overview: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [ads, setAds] = useState<AdDTO[]>([]);
  const [engagementData, setEngagementData] = useState<any>(null);
  const [loadingEngagement, setLoadingEngagement] = useState<boolean>(true);
  const [loadingAds, setLoadingAds] = useState<boolean>(true);
  const [adError, setAdError] = useState<string | null>(null);
  const [showAdRequestModal, setShowAdRequestModal] = useState<boolean>(false);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Load engagement data
    loadEngagementData();
    
    // Load ads
    loadAds();
    
    return () => {
      clearInterval(timer);
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, []);

  const loadAds = async () => {
    try {
      setLoadingAds(true);
      setAdError(null);
      
      console.group('🚀 Loading Ads Process');
      console.log('📅 Timestamp:', new Date().toISOString());
      
      // Get user info for debugging
      const userId = localStorage.getItem('userId');
      const userIndustry = localStorage.getItem('industry');
      const userPackage = localStorage.getItem('userPackage');
      const userRole = localStorage.getItem('role');
      const businessRef = localStorage.getItem('business_reference');
      
      console.log('👤 User Context:', {
        userId,
        industry: userIndustry,
        userPackage,
        role: userRole,
        businessReference: businessRef
      });
      
      const fetchedAds = await adService.getAdsForUser();
      console.log('📊 Raw API Response:', fetchedAds);
      console.log('📈 Total ads in response:', fetchedAds?.length || 0);
      
      if (fetchedAds && Array.isArray(fetchedAds) && fetchedAds.length > 0) {
        console.log('🔍 Filtering active ads...');
        
        // Filter only active ads
        const activeAds = fetchedAds.filter(ad => {
          const isStatusActive = ad.status === 'ACTIVE';
          const isActive = ad.isActive === true;
          const isEndDateValid = !ad.endDate || new Date(ad.endDate) > new Date();
          const isStartDateValid = !ad.startDate || new Date(ad.startDate) <= new Date();
          
          return isStatusActive && isActive && isEndDateValid && isStartDateValid;
        });
        
        console.log('✅ Active ads after filtering:', activeAds.length);
        console.log('🎯 Filtered ads:');
        activeAds.forEach((ad, index) => {
          console.log(`  ${index + 1}. ${ad.title}`, {
            status: ad.status,
            isActive: ad.isActive,
            priority: ad.priority,
            mediaType: ad.mediaType,
            targeting: ad.targetingType,
            targetValue: ad.targetValue,
            clicks: ad.totalClicks
          });
        });
        
        // Sort by priority (highest first)
        const sortedAds = activeAds.sort((a, b) => {
          // First by priority
          const priorityDiff = (b.priority || 0) - (a.priority || 0);
          if (priorityDiff !== 0) return priorityDiff;

          return 0;
        });
        
        console.log('📊 Final sorted ads:', sortedAds.map(ad => ({
          title: ad.title,
          priority: ad.priority,
          mediaType: ad.mediaType
        })));
        
        setAds(sortedAds);
        
        // Record impression for first ad if exists
        if (sortedAds.length > 0) {
          const firstAd = sortedAds[0];
          if (!adImpressions.has(firstAd.adId)) {
            console.log('📸 Recording impression for first ad:', firstAd.title);
            await adService.recordAdImpression(firstAd.adId);
            setAdImpressions(prev => new Set(prev).add(firstAd.adId));
          }
        }
        
      } else {
        console.log('❌ No ads available for user');
        setAds([]);
      }
      
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Error loading ads:', error);
      console.error('Error details:', error.response?.data || error.message);
      setAdError(`Unable to load advertisements: ${error.message}`);
      setAds([]);
    } finally {
      setLoadingAds(false);
    }
  };

  const loadEngagementData = async () => {
    try {
      setLoadingEngagement(true);
      const data = await adService.getDashboardEngagement();
      
      if (data) {
        setEngagementData(data);
        localStorage.setItem('engagement', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading engagement data:', error);
      try {
        const stored = localStorage.getItem('engagement');
        if (stored) {
          setEngagementData(JSON.parse(stored));
        }
      } catch (parseError) {
        console.error('Error parsing stored engagement:', parseError);
      }
    } finally {
      setLoadingEngagement(false);
    }
  };

  const handleAdRequestSubmit = async (requestData: { 
    businessName: string; 
    email: string; 
    phone: string; 
    message: string 
  }) => {
    try {
      // Get user info from localStorage
      const userId = localStorage.getItem('userId') || 'anonymous';
      const userName = localStorage.getItem('fullName') || requestData.businessName;
      const userEmail = localStorage.getItem('userEmail') || requestData.email;
      const userPhone = localStorage.getItem('mobileNumber') || requestData.phone;
      const companyName = localStorage.getItem('companyName') || requestData.businessName;
      const industry = localStorage.getItem('industry') || 'Not specified';
      const userPackage = localStorage.getItem('userPackage') || 'Free';
      
      // Construct email subject and body
      const subject = `New Advertising Space Request - ${requestData.businessName}`;
      const body = `
NEW ADVERTISING SPACE REQUEST

========================================
BUSINESS DETAILS:
========================================
Business Name: ${requestData.businessName}
Contact Person: ${userName}
Email: ${userEmail}
Phone: ${requestData.phone || userPhone}
Industry: ${industry}
Package: ${userPackage}

========================================
USER DETAILS:
========================================
User ID: ${userId}
Company: ${companyName}
Email (from account): ${localStorage.getItem('userEmail') || 'Not available'}
Phone (from account): ${localStorage.getItem('mobileNumber') || 'Not available'}

========================================
ADVERTISING REQUEST:
========================================
${requestData.message}

========================================
REQUEST DETAILS:
========================================
Request Date: ${new Date().toLocaleString('en-ZA', { 
  timeZone: 'Africa/Johannesburg',
  dateStyle: 'full',
  timeStyle: 'long'
})}

========================================
ACTION REQUIRED:
========================================
1. Review this request
2. Contact the business if needed
3. Create ad campaign in admin panel
4. Notify user when ad is live

ADMIN PANEL: ${window.location.origin}/admin/ads
========================================
      `;
      
      // Create mailto link for admin
      const adminEmail = 'asandilenkala@gmail.com';
      const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
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
        loadEngagementData();
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

  const refreshEngagementData = () => {
    loadEngagementData();
  };

  const refreshAds = () => {
    console.log('🔄 Manually refreshing ads...');
    loadAds();
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