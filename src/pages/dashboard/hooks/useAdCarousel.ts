import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adService } from '../../../services/AdService';
import type { AdDTO } from '../../../interfaces/AdData';

export const useAdCarousel = (params: {
  ads: AdDTO[];
  onAdClick: () => void;
}) => {
  const { ads, onAdClick } = params;

  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [adClickLoading, setAdClickLoading] = useState<string | null>(null);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [clickCooldowns, setClickCooldowns] = useState<Map<string, number>>(new Map());
  const [aspectRatioByAdId, setAspectRatioByAdId] = useState<Record<string, number>>({});

  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const currentAdIndexRef = useRef<number>(0);
  const videoEndedRef = useRef<boolean>(false);

  const currentAd = useMemo(() => ads?.[currentAdIndex], [ads, currentAdIndex]);

  useEffect(() => {
    currentAdIndexRef.current = currentAdIndex;
  }, [currentAdIndex]);

  useEffect(() => {
    videoEndedRef.current = videoEnded;
  }, [videoEnded]);

  useEffect(() => {
    if (!ads || ads.length === 0) {
      if (currentAdIndex !== 0) setCurrentAdIndex(0);
      return;
    }

    if (currentAdIndex < 0 || currentAdIndex >= ads.length) {
      setCurrentAdIndex(0);
    }
  }, [ads, ads?.length, currentAdIndex]);

  const stopCarousel = useCallback(() => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
      carouselTimerRef.current = null;
    }
  }, []);

  const nextAd = useCallback(async () => {
    if (!ads || ads.length <= 1) return;

    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCurrentAdIndex((prev) => {
      const nextIndex = (prev + 1) % ads.length;

      if (ads[nextIndex] && !adImpressions.has(ads[nextIndex].adId)) {
        adService.recordAdImpression(ads[nextIndex].adId);
        setAdImpressions((prevSet) => new Set(prevSet).add(ads[nextIndex].adId));
      }

      setVideoEnded(false);
      return nextIndex;
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [adImpressions, ads]);

  const startCarousel = useCallback(() => {
    stopCarousel();

    if (!ads || ads.length <= 1) return;

    carouselTimerRef.current = setInterval(() => {
      const index = currentAdIndexRef.current;
      const ad = ads[index];

      if (ad?.mediaType === 'VIDEO') {
        const videoElement = videoRefs.current.get(ad.adId);
        if (videoElement && !videoElement.ended && !videoEndedRef.current) {
          return;
        }
      }

      void nextAd();
    }, 10000);
  }, [ads, nextAd, stopCarousel]);

  useEffect(() => {
    if (ads && ads.length > 0) {
      const cooldowns = new Map<string, number>();
      ads.forEach((ad) => {
        const remaining = adService.getCooldownRemaining(ad.adId);
        if (remaining > 0) {
          cooldowns.set(ad.adId, remaining);
        }
      });
      setClickCooldowns(cooldowns);
    }

    if (ads && ads.length > 1) {
      startCarousel();
    }

    return () => {
      stopCarousel();
    };
  }, [ads, startCarousel, stopCarousel]);

  useEffect(() => {
    const ad = currentAd;
    if (!ad?.adId || !ad?.bannerUrl) return;
    if (aspectRatioByAdId[ad.adId]) return;

    if (ad.mediaType === 'IMAGE') {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 0;
        const h = img.naturalHeight || 0;
        if (w > 0 && h > 0) {
          setAspectRatioByAdId((prev) => ({ ...prev, [ad.adId]: w / h }));
        }
      };
      img.src = ad.bannerUrl;
    }

    if (ad.mediaType === 'VIDEO') {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        const w = v.videoWidth || 0;
        const h = v.videoHeight || 0;
        if (w > 0 && h > 0) {
          setAspectRatioByAdId((prev) => ({ ...prev, [ad.adId]: w / h }));
        }
      };
      v.src = ad.bannerUrl;
    }
  }, [aspectRatioByAdId, currentAd]);

  const prevAd = useCallback(async () => {
    if (!ads || ads.length <= 1) return;

    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCurrentAdIndex((prev) => {
      const prevIndex = prev === 0 ? ads.length - 1 : prev - 1;

      if (ads[prevIndex] && !adImpressions.has(ads[prevIndex].adId)) {
        adService.recordAdImpression(ads[prevIndex].adId);
        setAdImpressions((prevSet) => new Set(prevSet).add(ads[prevIndex].adId));
      }

      setVideoEnded(false);
      return prevIndex;
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [adImpressions, ads]);

  const handleVideoEnd = useCallback(
    () => {
      setVideoEnded(true);

      setTimeout(() => {
        if (ads && ads.length > 1) {
          void nextAd();
        }
      }, 2000);
    },
    [ads, nextAd]
  );

  const handleVideoPlay = useCallback(() => {
    setVideoEnded(false);
    stopCarousel();
  }, [stopCarousel]);

  const handleAdClick = useCallback(
    async (ad: AdDTO) => {
      if (adClickLoading === ad.adId) return;

      if (!adService.canClickAd(ad.adId)) {
        const remaining = adService.getCooldownRemaining(ad.adId);
        const minutes = Math.ceil(remaining / 60000);
        alert(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before clicking this ad again.`);
        return;
      }

      try {
        setAdClickLoading(ad.adId);

        const clickCounted = await adService.recordAdClick(ad.adId);

        if (clickCounted) {
          await adService.recordEngagement('AD_CLICK', 5, `Clicked ad: ${ad.title}`, ad.adId);

          setClickCooldowns((prev) => {
            const newMap = new Map(prev);
            newMap.set(ad.adId, adService.CLICK_COOLDOWN);
            return newMap;
          });
        }

        window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
        onAdClick();
      } catch (error) {
        console.error('Error handling ad click:', error);
        window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
      } finally {
        setAdClickLoading(null);
      }
    },
    [adClickLoading, onAdClick]
  );

  const registerVideoRef = useCallback((adId: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(adId, el);
    }
  }, []);

  const aspectRatio = useMemo(() => {
    if (!currentAd?.adId) return 1920 / 400;
    return aspectRatioByAdId[currentAd.adId] || 1920 / 400;
  }, [aspectRatioByAdId, currentAd?.adId]);

  const cooldownRemaining = useMemo(() => {
    if (!currentAd?.adId) return 0;
    return adService.getCooldownRemaining(currentAd.adId);
  }, [currentAd?.adId, clickCooldowns]);

  const canClick = useMemo(() => {
    if (!currentAd?.adId) return true;
    return adService.canClickAd(currentAd.adId);
  }, [currentAd?.adId, clickCooldowns]);

  return {
    currentAd,
    currentAdIndex,
    setCurrentAdIndex,
    isTransitioning,
    adClickLoading,
    clickCooldowns,
    canClick,
    cooldownRemaining,
    aspectRatio,
    nextAd,
    prevAd,
    handleVideoEnd,
    handleVideoPlay,
    handleAdClick,
    registerVideoRef,
  };
};
