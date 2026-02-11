import React from 'react';
import 'boxicons';
import reactSvg from '../assets/react.png';
import retailImg from '../assets/retail.svg';
import tourismImg from '../assets/tourism.svg';
import professionalImg from '../assets/professional.svg';
import transportImg from '../assets/Transport.svg';
import manufacturingImg from '../assets/manufacturing.svg';
import agricultureImg from '../assets/Agriculture.svg';
import educationImg from '../assets/education.svg';
import estateImg from '../assets/estate.svg';
import eventsImg from '../assets/events.svg';
import financeImg from '../assets/finance.svg';
import ngoImg from '../assets/NGO.svg';
import healthcareImg from '../assets/healthcare.svg';
import AdRequestModal from './dashboard/components/AdRequestModal';
import { useLandingPage } from './landing/hooks/useLandingPage';
import LandingHeader from './landing/components/LandingHeader';
import HeroSection from './landing/components/HeroSection';
import TrustBar from './landing/components/TrustBar';
import FeaturesSection from './landing/components/FeaturesSection';
import AdvertisingSection from './landing/components/AdvertisingSection';
import AudiencePartnersSection from './landing/components/AudiencePartnersSection';
import IndustriesSection from './landing/components/IndustriesSection';
import AppsSection from './landing/components/AppsSection';
import CommunitySection from './landing/components/CommunitySection';
import HelpSection from './landing/components/HelpSection';
import CtaSection from './landing/components/CtaSection';
import LandingFooter from './landing/components/LandingFooter';

const LandingPage: React.FC = () => {
  const {
    navigate,
    productDropdownOpen,
    setProductDropdownOpen,
    productDropdownRef,
    showAllApps,
    setShowAllApps,
    showAdRequestModal,
    setShowAdRequestModal,
    handleAdRequestSubmit,
    productCategories,
    handleProductItemClick,
    features,
    activeFeatureIdx,
    setActiveFeatureIdx,
    featurePanels,
    rotatingUsers,
    userWordIdx,
    typedHeadline,
    industryDetails,
    additionalIndustries,
    isRetailFlipped,
    setIsRetailFlipped,
    isHospitalityFlipped,
    setIsHospitalityFlipped,
    isProfessionalFlipped,
    setIsProfessionalFlipped,
    isManufacturingFlipped,
    setIsManufacturingFlipped,
    isAgricultureFlipped,
    setIsAgricultureFlipped,
    isTransportFlipped,
    setIsTransportFlipped,
    additionalFlipped,
    setAdditionalFlipped,
  } = useLandingPage();

  console.log('LandingPage rendered - Product dropdown available');

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <LandingHeader
        navigate={navigate}
        productDropdownOpen={productDropdownOpen}
        setProductDropdownOpen={setProductDropdownOpen}
        productDropdownRef={productDropdownRef}
        productCategories={productCategories}
        onProductItemClick={handleProductItemClick}
      />

      <main className="flex-1">
        <HeroSection typedHeadline={typedHeadline} onGetStarted={() => navigate('/signup')} />

        {/* Ad Request Modal for Landing (same as dashboard) */}
        <AdRequestModal
          isOpen={showAdRequestModal}
          onClose={() => setShowAdRequestModal(false)}
          onSubmit={handleAdRequestSubmit}
          language={'en'}
        />

        <TrustBar reactSvg={reactSvg} />

        <FeaturesSection
          features={features}
          activeFeatureIdx={activeFeatureIdx}
          setActiveFeatureIdx={setActiveFeatureIdx}
          featurePanels={featurePanels}
        />

        <AdvertisingSection
          onRequestAdSpace={() => {
            const to = 'admin@hapogroup.co.za';
            const subject = 'Request ad space';
            window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
          }}
        />

        <AudiencePartnersSection rotatingUsers={rotatingUsers} userWordIdx={userWordIdx} />

        <IndustriesSection
          industryDetails={industryDetails}
          additionalIndustries={additionalIndustries}
          setIsRetailFlipped={setIsRetailFlipped}
          setIsHospitalityFlipped={setIsHospitalityFlipped}
          setIsProfessionalFlipped={setIsProfessionalFlipped}
          setIsManufacturingFlipped={setIsManufacturingFlipped}
          setIsAgricultureFlipped={setIsAgricultureFlipped}
          setIsTransportFlipped={setIsTransportFlipped}
          isRetailFlipped={isRetailFlipped}
          isHospitalityFlipped={isHospitalityFlipped}
          isProfessionalFlipped={isProfessionalFlipped}
          isManufacturingFlipped={isManufacturingFlipped}
          isAgricultureFlipped={isAgricultureFlipped}
          isTransportFlipped={isTransportFlipped}
          additionalFlipped={additionalFlipped}
          setAdditionalFlipped={setAdditionalFlipped}
          retailImg={retailImg}
          tourismImg={tourismImg}
          professionalImg={professionalImg}
          manufacturingImg={manufacturingImg}
          agricultureImg={agricultureImg}
          transportImg={transportImg}
          educationImg={educationImg}
          healthcareImg={healthcareImg}
          estateImg={estateImg}
          eventsImg={eventsImg}
          financeImg={financeImg}
          ngoImg={ngoImg}
        />

        <AppsSection showAllApps={showAllApps} setShowAllApps={setShowAllApps} />

        <CommunitySection />

        <HelpSection />

        <CtaSection onGetStarted={() => navigate('/signup')} onScheduleDemo={() => navigate('/request-demo')} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
