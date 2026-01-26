// src/components/dashboard/components/AdCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { adService } from '../../../services/AdService';
import type { AdDTO } from '../../../interfaces/AdData';

type Language = 'en' | 'af' | 'zu';

interface AdCarouselProps {
  ads: AdDTO[];
  loading: boolean;
  error: string | null;
  selectedLanguage: Language;
  onAdClick: () => void;
  onAdvertiseClick: () => void;
  onRefreshAds: () => void;
}

const translations = {
  en: {
    sponsored: "Sponsored",
    ad: "Ad",
    learnMore: "Click to learn more",
    clicks: "clicks",
    advertiseWithUs: "Promote your business here. Contact us for advertising opportunities.",
    advertisingSpace: "Advertising Space",
    requestAdSpace: "Request Ad Space",
    cooldown: "Come back later to click again",
    videoPlaying: "Video playing...",
    nextAd: "Next ad",
    prevAd: "Previous ad",
  },
  af: {
    sponsored: "Borg",
    ad: "Advertensie",
    learnMore: "Klik om meer te wete te kom",
    clicks: "klieke",
    advertiseWithUs: "Bevorder jou besigheid hier. Kontak ons vir advertensiegeleenthede.",
    advertisingSpace: "Advertensieruimte",
    requestAdSpace: "Versoek Advertensieruimte",
    cooldown: "Kom later terug om weer te klik",
    videoPlaying: "Video speel...",
    nextAd: "Volgende advertensie",
    prevAd: "Vorige advertensie",
  },
  zu: {
    sponsored: "Ixhaswe",
    ad: "Isikhangiso",
    learnMore: "Chofoza ukufunda okuningi",
    clicks: "ukuchofoza",
    advertiseWithUs: "Phakamisa ibhizinisi lakho lapha. Sithinte ngezikhathi zokukhangisa.",
    advertisingSpace: "Isikhala Sokukhangisa",
    requestAdSpace: "Cela Isikhala Sokukhangisa",
    cooldown: "Buyela emuva ukuchofoza futhi",
    videoPlaying: "Ividiyo iyadlala...",
    nextAd: "Isikhangiso esilandelayo",
    prevAd: "Isikhangiso esedlule",
  }
};

const AdCarousel: React.FC<AdCarouselProps> = ({
  ads,
  loading,
  error,
  selectedLanguage,
  onAdClick,
  onAdvertiseClick,
  onRefreshAds,
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [adClickLoading, setAdClickLoading] = useState<string | null>(null);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [clickCooldowns, setClickCooldowns] = useState<Map<string, number>>(new Map());
  const [aspectRatioByAdId, setAspectRatioByAdId] = useState<Record<string, number>>({});

  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const t = translations[selectedLanguage];

  useEffect(() => {
    // Initialize cooldowns
    if (ads && ads.length > 0) {
      const cooldowns = new Map();
      ads.forEach(ad => {
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
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current);
      }
    };
  }, [ads]);

  useEffect(() => {
    const currentAd = ads?.[currentAdIndex];
    if (!currentAd?.adId || !currentAd?.bannerUrl) return;
    if (aspectRatioByAdId[currentAd.adId]) return;

    if (currentAd.mediaType === 'IMAGE') {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 0;
        const h = img.naturalHeight || 0;
        if (w > 0 && h > 0) {
          setAspectRatioByAdId((prev) => ({ ...prev, [currentAd.adId]: w / h }));
        }
      };
      img.src = currentAd.bannerUrl;
    }

    if (currentAd.mediaType === 'VIDEO') {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        const w = v.videoWidth || 0;
        const h = v.videoHeight || 0;
        if (w > 0 && h > 0) {
          setAspectRatioByAdId((prev) => ({ ...prev, [currentAd.adId]: w / h }));
        }
      };
      v.src = currentAd.bannerUrl;
    }
  }, [ads, currentAdIndex, aspectRatioByAdId]);

  const startCarousel = () => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
    }

    carouselTimerRef.current = setInterval(() => {
      const currentAd = ads[currentAdIndex];
      
      // Check if current ad is a video
      if (currentAd?.mediaType === 'VIDEO') {
        const videoElement = videoRefs.current.get(currentAd.adId);
        if (videoElement && !videoElement.ended && !videoEnded) {
          console.log('⏸️ Video still playing, skipping auto-advance');
          return; // Don't advance if video is still playing
        }
      }
      
      nextAd();
    }, 10000); // Rotate every 10 seconds for images
  };

  const nextAd = async () => {
    if (!ads || ads.length <= 1) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentAdIndex(prev => {
      const nextIndex = (prev + 1) % ads.length;
      
      // Record impression for the new ad if not already recorded
      if (ads[nextIndex] && !adImpressions.has(ads[nextIndex].adId)) {
        console.log('📸 Recording impression for ad:', ads[nextIndex].title);
        adService.recordAdImpression(ads[nextIndex].adId);
        setAdImpressions(prev => new Set(prev).add(ads[nextIndex].adId));
      }
      
      // Reset video ended state
      setVideoEnded(false);
      
      return nextIndex;
    });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const prevAd = async () => {
    if (!ads || ads.length <= 1) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentAdIndex(prev => {
      const prevIndex = prev === 0 ? ads.length - 1 : prev - 1;
      
      if (ads[prevIndex] && !adImpressions.has(ads[prevIndex].adId)) {
        console.log('📸 Recording impression for ad:', ads[prevIndex].title);
        adService.recordAdImpression(ads[prevIndex].adId);
        setAdImpressions(prev => new Set(prev).add(ads[prevIndex].adId));
      }
      
      // Reset video ended state
      setVideoEnded(false);
      
      return prevIndex;
    });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleVideoEnd = (adId: string) => {
    console.log('🎬 Video ended for ad:', adId);
    setVideoEnded(true);
    
    // Auto-advance after video ends (2 second delay)
    setTimeout(() => {
      if (ads && ads.length > 1) {
        nextAd();
      }
    }, 2000);
  };

  const handleVideoPlay = (adId: string) => {
    console.log('▶️ Video started playing for ad:', adId);
    setVideoEnded(false);
    
    // Stop auto-advance while video is playing
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
    }
  };

  const handleAdClick = async (ad: AdDTO) => {
    if (adClickLoading === ad.adId) return;
    
    // Check cooldown
    if (!adService.canClickAd(ad.adId)) {
      const remaining = adService.getCooldownRemaining(ad.adId);
      const minutes = Math.ceil(remaining / 60000);
      alert(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before clicking this ad again.`);
      return;
    }
    
    try {
      setAdClickLoading(ad.adId);
      
      // Record click
      const clickCounted = await adService.recordAdClick(ad.adId);
      
      if (clickCounted) {
        // Record engagement
        await adService.recordEngagement('AD_CLICK', 5, `Clicked ad: ${ad.title}`, ad.adId);
        
        // Update cooldown state
        setClickCooldowns(prev => {
          const newMap = new Map(prev);
          newMap.set(ad.adId, adService.CLICK_COOLDOWN);
          return newMap;
        });
        
        console.log('✅ Click counted for ad:', ad.title);
      } else {
        console.log('⏳ Click not counted (cooldown)');
      }
      
      // Open ad URL
      window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
      onAdClick();
      
    } catch (error) {
      console.error('Error handling ad click:', error);
      window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setAdClickLoading(null);
    }
  };

  const renderHeader = (subtitle: string) => (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{t.advertisingSpace}</h3>
        <p className="text-xs text-gray-600 mt-1 max-w-md">{subtitle}</p>
      </div>
      <button
        onClick={onAdvertiseClick}
        className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {t.requestAdSpace}
      </button>
    </div>
  );

  const renderSlot = (subtitle: string, content: React.ReactNode) => (
    <div className="space-y-3">
      {renderHeader(subtitle)}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">{content}</div>
    </div>
  );

  const renderLoading = () => (
    <div className="animate-pulse">
      {renderSlot(
        t.advertiseWithUs,
        <div className="h-64 p-4">
          <div className="h-full bg-gray-100 rounded" />
        </div>
      )}
    </div>
  );

  const renderError = () => (
    renderSlot(
      typeof error === 'string' ? error : t.advertiseWithUs,
      <div className="flex items-center justify-center h-64 p-4">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xs text-gray-500">Your ad could appear here</p>
        </div>
      </div>
    )
  );

  const renderEmpty = () => (
    renderSlot(
      t.advertiseWithUs,
      <div className="flex items-center justify-center h-64 p-4">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xs text-gray-500">Your ad could appear here</p>
        </div>
      </div>
    )
  );

  const renderCarousel = () => {
    const currentAd = ads[currentAdIndex];
    const isClicking = adClickLoading === currentAd.adId;
    const canClick = adService.canClickAd(currentAd.adId);
    const cooldownRemaining = adService.getCooldownRemaining(currentAd.adId);
    const aspectRatio = aspectRatioByAdId[currentAd.adId] || 1920 / 400;

    return renderSlot(
      t.advertiseWithUs,
      <div className="relative overflow-hidden">
        {ads.length > 1 && (
          <>
            <button
              onClick={prevAd}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label={t.prevAd}
              title={t.prevAd}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextAd}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label={t.nextAd}
              title={t.nextAd}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <div
          className="relative w-full bg-white"
          style={{ aspectRatio, minHeight: '14rem', maxHeight: '26rem' }}
        >
          {currentAd.mediaType === 'IMAGE' && currentAd.bannerUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <img
                src={currentAd.bannerUrl}
                alt={currentAd.title}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load ad image:', currentAd.bannerUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {currentAd.mediaType === 'VIDEO' && currentAd.bannerUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <video
                ref={(el) => {
                  if (el) {
                    videoRefs.current.set(currentAd.adId, el);
                  }
                }}
                src={currentAd.bannerUrl}
                className="w-full h-full object-contain"
                muted
                playsInline
                autoPlay
                loop={false}
                onEnded={() => handleVideoEnd(currentAd.adId)}
                onPlay={() => handleVideoPlay(currentAd.adId)}
                onError={(e) => {
                  console.error('Failed to load ad video:', currentAd.bannerUrl);
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {isClicking && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Opening...</p>
              </div>
            </div>
          )}

          {cooldownRemaining > 0 && !isClicking && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-40 text-white text-[11px] px-2 py-1 rounded">
              {t.cooldown} ({Math.ceil(cooldownRemaining / 60000)}m)
            </div>
          )}

          {ads.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAdIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                    index === currentAdIndex ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {ads.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentAdIndex + 1} / {ads.length}
          </div>
        )}

        <button
          onClick={onRefreshAds}
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center"
          title="Refresh ads"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!ads || ads.length === 0) return renderEmpty();
  return renderCarousel();
};

export default AdCarousel;