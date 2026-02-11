import { useCallback, useEffect, useRef, useState } from 'react';
import { adService } from '../../../services/AdService';
import type { AdDTO } from '../../../interfaces/AdData';

export const useDashboardAds = () => {
  const [ads, setAds] = useState<AdDTO[]>([]);
  const [loadingAds, setLoadingAds] = useState<boolean>(true);
  const [adError, setAdError] = useState<string | null>(null);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());

  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loadAds = useCallback(async () => {
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
        businessReference: businessRef,
      });

      const fetchedAds = await adService.getAdsForUser();
      console.log('📊 Raw API Response:', fetchedAds);
      console.log('📈 Total ads in response:', fetchedAds?.length || 0);

      if (fetchedAds && Array.isArray(fetchedAds) && fetchedAds.length > 0) {
        console.log('🔍 Filtering active ads...');

        // Filter only active ads
        const activeAds = fetchedAds.filter((ad) => {
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
            clicks: ad.totalClicks,
          });
        });

        // Sort by priority (highest first)
        const sortedAds = activeAds.sort((a, b) => {
          // First by priority
          const priorityDiff = (b.priority || 0) - (a.priority || 0);
          if (priorityDiff !== 0) return priorityDiff;

          return 0;
        });

        console.log(
          '📊 Final sorted ads:',
          sortedAds.map((ad) => ({
            title: ad.title,
            priority: ad.priority,
            mediaType: ad.mediaType,
          }))
        );

        setAds(sortedAds);

        // Record impression for first ad if exists
        if (sortedAds.length > 0) {
          const firstAd = sortedAds[0];
          if (!adImpressions.has(firstAd.adId)) {
            console.log('📸 Recording impression for first ad:', firstAd.title);
            await adService.recordAdImpression(firstAd.adId);
            setAdImpressions((prev) => new Set(prev).add(firstAd.adId));
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
  }, [adImpressions]);

  useEffect(() => {
    loadAds();

    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [loadAds]);

  return {
    ads,
    loadingAds,
    adError,
    refreshAds: loadAds,
    carouselTimerRef,
  };
};
