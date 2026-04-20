import React from 'react';
import AdvertisingBadge from './AdvertisingBadge';
import AdvertisingHeader from './AdvertisingHeader';
import FeatureCards from './FeatureCards';
import RequestButton from './RequestButton';
import AdPreview from './AdPreview';

interface AdvertisingSectionProps {
  onRequestAdSpace: () => void;
}

const AdvertisingSection: React.FC<AdvertisingSectionProps> = ({ onRequestAdSpace }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <AdvertisingBadge />
            <AdvertisingHeader />
            <FeatureCards />
            <RequestButton onRequestAdSpace={onRequestAdSpace} />
          </div>
          <AdPreview />
        </div>
      </div>
    </section>
  );
};

export default AdvertisingSection;
