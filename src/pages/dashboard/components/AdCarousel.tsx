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
  
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const adDebugRef = useRef<HTMLDivElement>(null);

  const t = translations[selectedLanguage];

  // Debug log for ads
  useEffect(() => {
    console.log('🎯 AdCarousel Debug - Ads:', {
      totalAds: ads?.length || 0,
      currentIndex: currentAdIndex,
      currentAd: ads?.[currentAdIndex],
      allAds: ads?.map(ad => ({
        id: ad.adId,
        title: ad.title,
        mediaType: ad.mediaType,
        status: ad.status,
        priority: ad.priority,
        clicks: ad.totalClicks
      }))
    });

    if (adDebugRef.current && ads?.length > 0) {
      adDebugRef.current.innerHTML = `
        <div style="background: rgba(0,0,0,0.1); padding: 5px; border-radius: 4px; font-size: 11px;">
          <strong>Ad Debug:</strong> Showing ${ads.length} ads<br/>
          Current: ${currentAdIndex + 1}/${ads.length}<br/>
          Type: ${ads[currentAdIndex]?.mediaType}<br/>
          Duration: ${ads[currentAdIndex]?.mediaType === 'VIDEO' ? 'Video' : '10s'}
        </div>
      `;
    }
  }, [ads, currentAdIndex]);

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

  const renderLoading = () => (
    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white animate-pulse overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-white bg-opacity-20 rounded w-32"></div>
          <div className="h-3 bg-white bg-opacity-20 rounded w-48"></div>
        </div>
        <div className="h-8 bg-white bg-opacity-20 rounded w-20"></div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.advertisingSpace}</h3>
          <p className="text-xs opacity-80 mt-1">
            {error}
          </p>
        </div>
        <button 
          onClick={onAdvertiseClick}
          className="px-3 py-1 bg-white text-yellow-600 text-xs font-semibold rounded-lg hover:bg-yellow-50 transition-colors"
        >
          {t.requestAdSpace}
        </button>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.advertisingSpace}</h3>
          <p className="text-xs opacity-80 mt-1 max-w-md">
            {t.advertiseWithUs}
          </p>
        </div>
        <button 
          onClick={onAdvertiseClick}
          className="px-3 py-1 bg-white text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          {t.requestAdSpace}
        </button>
      </div>
      
      <div className="mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
        <div className="flex items-center justify-center h-24">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs opacity-70">Your ad could appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCarousel = () => {
    const currentAd = ads[currentAdIndex];
    const isClicking = adClickLoading === currentAd.adId;
    const canClick = adService.canClickAd(currentAd.adId);
    const cooldownRemaining = adService.getCooldownRemaining(currentAd.adId);
    const isVideo = currentAd.mediaType === 'VIDEO';

    return (
      <div className="relative overflow-hidden rounded-lg">
        {/* Debug Info - Remove in production */}
        <div ref={adDebugRef} className="absolute top-2 left-2 z-20 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
          Debug: {ads.length} ads
        </div>

        {/* Navigation Arrows - Always Visible if Multiple Ads */}
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
        
        {/* Ad Content */}
        <div 
          className={`bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg overflow-hidden transform transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
          }`}
          role="button"
          tabIndex={0}
          onClick={() => !isClicking && canClick && handleAdClick(currentAd)}
          onKeyPress={(e) => e.key === 'Enter' && !isClicking && canClick && handleAdClick(currentAd)}
          aria-label={`Advertisement: ${currentAd.title}. Click to learn more.`}
        >
          <div className="p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {t.sponsored}
              </span>
              <span className="text-xs opacity-80">{t.ad}</span>
            </div>
            
            <h3 className="text-sm font-semibold mb-3 line-clamp-1">
              {currentAd.title}
            </h3>
            
            {/* Media Section - Increased Size */}
            {currentAd.mediaType === 'IMAGE' && currentAd.bannerUrl && (
              <div className="mt-2 relative bg-black bg-opacity-20 rounded-lg overflow-hidden">
                <img 
                  src={currentAd.bannerUrl} 
                  alt={currentAd.title}
                  className="w-full h-48 object-contain rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load ad image:', currentAd.bannerUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {isClicking && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Opening...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {currentAd.mediaType === 'VIDEO' && currentAd.bannerUrl && (
              <div className="mt-2 relative bg-black bg-opacity-20 rounded-lg overflow-hidden">
                <video 
                  ref={(el) => {
                    if (el) {
                      videoRefs.current.set(currentAd.adId, el);
                    }
                  }}
                  src={currentAd.bannerUrl}
                  className="w-full h-48 object-contain rounded-lg"
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
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {t.videoPlaying}
                </div>
                {isClicking && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Opening...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="flex items-center">
                <span className={`opacity-80 ${!canClick ? 'line-through' : ''}`}>
                  {isClicking ? 'Opening...' : 
                   canClick ? t.learnMore : t.cooldown}
                </span>
                {isClicking && (
                  <svg className="w-3 h-3 ml-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {cooldownRemaining > 0 && !isClicking && (
                  <span className="ml-2 text-xs opacity-70">
                    ({Math.ceil(cooldownRemaining / 60000)}m)
                  </span>
                )}
              </div>
              <span className="opacity-80">
                {currentAd.totalClicks || 0} {t.clicks}
              </span>
            </div>
            
            {/* Media Type Indicator */}
            <div className="absolute top-12 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {isVideo ? 'VIDEO' : 'IMAGE'}
            </div>
            
            {/* Progress Indicator */}
            {ads.length > 1 && (
              <div className="flex justify-center space-x-1 mt-3">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentAdIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      index === currentAdIndex 
                        ? 'w-6 bg-white' 
                        : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-70'
                    }`}
                    aria-label={`Go to ad ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Ad Counter */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentAdIndex + 1} / {ads.length}
          </div>
        )}
        
        {/* Refresh Button */}
        <button
          onClick={onRefreshAds}
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center"
          title="Refresh ads"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    );
  };

  // Show debug info in console
  useEffect(() => {
    if (ads && ads.length > 0) {
      console.group('📊 Ad Carousel Status');
      console.log(`Total Ads: ${ads.length}`);
      console.log(`Current Ad Index: ${currentAdIndex}`);
      console.log(`Current Ad:`, ads[currentAdIndex]);
      console.log(`Media Type: ${ads[currentAdIndex]?.mediaType}`);
      console.log(`Video Ended: ${videoEnded}`);
      console.log(`Cooldowns:`, Object.fromEntries(clickCooldowns));
      console.groupEnd();
    }
  }, [ads, currentAdIndex, videoEnded, clickCooldowns]);

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!ads || ads.length === 0) return renderEmpty();
  return renderCarousel();
};

export default AdCarousel;