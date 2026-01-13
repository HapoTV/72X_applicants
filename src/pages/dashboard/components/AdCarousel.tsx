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
  },
  af: {
    sponsored: "Borg",
    ad: "Advertensie",
    learnMore: "Klik om meer te wete te kom",
    clicks: "klieke",
    advertiseWithUs: "Bevorder jou besigheid hier. Kontak ons vir advertensiegeleenthede.",
    advertisingSpace: "Advertensieruimte",
    requestAdSpace: "Versoek Advertensieruimte",
  },
  zu: {
    sponsored: "Ixhaswe",
    ad: "Isikhangiso",
    learnMore: "Chofoza ukufunda okuningi",
    clicks: "ukuchofoza",
    advertiseWithUs: "Phakamisa ibhizinisi lakho lapha. Sithinte ngezikhathi zokukhangisa.",
    advertisingSpace: "Isikhala Sokukhangisa",
    requestAdSpace: "Cela Isikhala Sokukhangisa",
  }
};

const AdCarousel: React.FC<AdCarouselProps> = ({
  ads,
  loading,
  error,
  selectedLanguage,
  onAdClick,
  onAdvertiseClick,
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [adClickLoading, setAdClickLoading] = useState<string | null>(null);
  const [adImpressions, setAdImpressions] = useState<Set<string>>(new Set());
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[selectedLanguage];

  useEffect(() => {
    if (ads.length > 1) {
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
      nextAd();
    }, 10000); // Rotate every 10 seconds
  };

  const nextAd = async () => {
    if (ads.length <= 1) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentAdIndex(prev => {
      const nextIndex = (prev + 1) % ads.length;
      
      // Record impression for the new ad if not already recorded
      if (ads[nextIndex] && !adImpressions.has(ads[nextIndex].adId)) {
        adService.recordAdImpression(ads[nextIndex].adId);
        setAdImpressions(prev => new Set(prev).add(ads[nextIndex].adId));
      }
      
      return nextIndex;
    });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const prevAd = async () => {
    if (ads.length <= 1) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentAdIndex(prev => {
      const prevIndex = prev === 0 ? ads.length - 1 : prev - 1;
      
      if (ads[prevIndex] && !adImpressions.has(ads[prevIndex].adId)) {
        adService.recordAdImpression(ads[prevIndex].adId);
        setAdImpressions(prev => new Set(prev).add(ads[prevIndex].adId));
      }
      
      return prevIndex;
    });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleAdClick = async (ad: AdDTO) => {
    if (adClickLoading === ad.adId) return;
    
    try {
      setAdClickLoading(ad.adId);
      
      await adService.recordAdClick(ad.adId);
      await adService.recordEngagement('AD_CLICK', 5, `Clicked ad: ${ad.title}`, ad.adId);
      
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

    return (
      <div className="relative overflow-hidden rounded-lg">
        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={prevAd}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Previous advertisement"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextAd}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Next advertisement"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          onClick={() => !isClicking && handleAdClick(currentAd)}
          onKeyPress={(e) => e.key === 'Enter' && !isClicking && handleAdClick(currentAd)}
          aria-label={`Advertisement: ${currentAd.title}. Click to learn more.`}
        >
          <div className="p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {t.sponsored}
              </span>
              <span className="text-xs opacity-80">{t.ad}</span>
            </div>
            
            <h3 className="text-sm font-semibold mb-1 line-clamp-2">
              {currentAd.title}
            </h3>
            
            {currentAd.description && (
              <p className="text-xs opacity-90 mb-2 line-clamp-2">
                {currentAd.description}
              </p>
            )}
            
            {currentAd.mediaType === 'IMAGE' && currentAd.bannerUrl && (
              <div className="mt-2 relative">
                <img 
                  src={currentAd.bannerUrl} 
                  alt={currentAd.title}
                  className="w-full h-32 object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load ad image:', currentAd.bannerUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {isClicking && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            )}
            
            {currentAd.mediaType === 'VIDEO' && currentAd.bannerUrl && (
              <div className="mt-2 relative">
                <video 
                  src={currentAd.bannerUrl}
                  className="w-full h-32 object-cover rounded-lg"
                  muted
                  playsInline
                  autoPlay
                  loop
                  onError={(e) => {
                    console.error('Failed to load ad video:', currentAd.bannerUrl);
                    (e.target as HTMLVideoElement).style.display = 'none';
                  }}
                />
                {isClicking && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center">
                <span className="opacity-80">
                  {isClicking ? 'Opening...' : t.learnMore}
                </span>
                {isClicking && (
                  <svg className="w-3 h-3 ml-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </div>
              <span className="opacity-80">
                {currentAd.totalClicks || 0} {t.clicks}
              </span>
            </div>
            
            {/* Progress Indicator */}
            {ads.length > 1 && (
              <div className="flex justify-center space-x-1 mt-3">
                {ads.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentAdIndex 
                        ? 'w-4 bg-white' 
                        : 'w-1 bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Carousel Counter */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentAdIndex + 1} / {ads.length}
          </div>
        )}
      </div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!ads || ads.length === 0) return renderEmpty();
  return renderCarousel();
};

export default AdCarousel;