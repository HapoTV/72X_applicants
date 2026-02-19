// src/components/dashboard/components/AdCarousel.tsx
import React from 'react';
import type { AdDTO } from '../../../interfaces/AdData';
import { useAdCarousel } from '../hooks/useAdCarousel';
import { Info } from 'lucide-react';

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
    clickHintTitle: "Tip",
    clickHintText: "Click the ad for more information",
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
    clickHintTitle: "Wenk",
    clickHintText: "Klik op die advertensie vir meer inligting",
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
    clickHintTitle: "Ithiphu",
    clickHintText: "Chofoza isikhangiso ukuze uthole olunye ulwazi",
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
  const t = translations[selectedLanguage];

  const {
    currentAd,
    currentAdIndex,
    setCurrentAdIndex,
    isTransitioning,
    adClickLoading,
    cooldownRemaining,
    aspectRatio,
    nextAd,
    prevAd,
    handleVideoEnd,
    handleVideoPlay,
    handleAdClick,
    registerVideoRef,
  } = useAdCarousel({ ads, onAdClick });

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
      {/* Removed border/background to blend with app */}
      <div className="overflow-hidden">{content}</div>
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
    if (!currentAd) return null;
    const isClicking = adClickLoading === currentAd.adId;

    return renderSlot(
      t.advertiseWithUs,
      <div className="overflow-hidden sm:flex">
        <div className="hidden sm:flex w-56 flex-shrink-0 items-center justify-center bg-white">
          <div className="pointer-events-none mx-3 flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-2 text-xs text-primary-700 shadow-sm">
            <span className="inline-flex items-center justify-center rounded-full bg-primary-50 p-1">
              <Info className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">{t.clickHintTitle}:</span>
            <span className="text-primary-700/90">{t.clickHintText}</span>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
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
            className="relative w-full"
            style={{
              aspectRatio,
              minHeight: '14rem',
              maxHeight: '26rem',
              transform: isTransitioning ? 'translateX(100%)' : 'translateX(0)',
              transition: 'transform 300ms ease'
            }}
            onClick={() => handleAdClick(currentAd)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAdClick(currentAd);
              }
            }}
          >
            {currentAd.mediaType === 'IMAGE' && currentAd.bannerUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <video
                  ref={(el) => {
                    registerVideoRef(currentAd.adId, el);
                  }}
                  src={currentAd.bannerUrl}
                  className="w-full h-full object-contain"
                  muted
                  playsInline
                  autoPlay
                  loop={false}
                  onEnded={() => handleVideoEnd()}
                  onPlay={() => handleVideoPlay()}
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
      </div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!ads || ads.length === 0) return renderEmpty();
  return renderCarousel();
};

export default AdCarousel;