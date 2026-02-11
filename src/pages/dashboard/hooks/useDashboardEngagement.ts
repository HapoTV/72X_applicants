import { useCallback, useEffect, useState } from 'react';
import { adService } from '../../../services/AdService';

export const useDashboardEngagement = () => {
  const [engagementData, setEngagementData] = useState<any>(null);
  const [loadingEngagement, setLoadingEngagement] = useState<boolean>(true);

  const loadEngagementData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadEngagementData();
  }, [loadEngagementData]);

  return {
    engagementData,
    loadingEngagement,
    refreshEngagementData: loadEngagementData,
  };
};
