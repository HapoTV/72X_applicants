import { useCallback, useEffect, useState } from 'react';
import { adService } from '../../../services/AdService';
import type { AdDTO } from '../../../interfaces/AdData';

export const useDashboardAds = () => {
  const [ads, setAds] = useState<AdDTO[]>([]);
  const [loadingAds, setLoadingAds] = useState<boolean>(true);
  const [adError, setAdError] = useState<string | null>(null);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());

  const loadAds = useCallback(async () => {
    try {
      setLoadingAds(true);
      setAdError(null);

      const fetchedAds = await adService.getAdsForUser();

      if (fetchedAds && Array.isArray(fetchedAds) && fetchedAds.length > 0) {
        // Filter only active ads
        const activeAds = fetchedAds.filter((ad) => {
          const isStatusActive = ad.status === 'ACTIVE';
          const isActive = ad.isActive === true;
          const isEndDateValid = !ad.endDate || new Date(ad.endDate) > new Date();
          const isStartDateValid = !ad.startDate || new Date(ad.startDate) <= new Date();

          return isStatusActive && isActive && isEndDateValid && isStartDateValid;
        });

        // Sort by priority (highest first)
        const sortedAds = activeAds.sort((a, b) => {
          // First by priority
          const priorityDiff = (b.priority || 0) - (a.priority || 0);
          if (priorityDiff !== 0) return priorityDiff;

          return 0;
        });

        const uniqueAds: AdDTO[] = [];
        const seenAdIds = new Set<string>();
        for (const ad of sortedAds) {
          if (!ad?.adId) continue;
          if (seenAdIds.has(ad.adId)) continue;
          seenAdIds.add(ad.adId);
          uniqueAds.push(ad);
        }

        setAds(uniqueAds);

        // Record impression for first ad if exists
        if (uniqueAds.length > 0) {
          const firstAd = uniqueAds[0];
          if (!adImpressions.has(firstAd.adId)) {
            await adService.recordAdImpression(firstAd.adId);
            setAdImpressions((prev) => new Set(prev).add(firstAd.adId));
          }
        }
      } else {
        setAds([]);
      }
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
  }, [loadAds]);

  return {
    ads,
    loadingAds,
    adError,
    refreshAds: loadAds,
  };
};
