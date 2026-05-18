import React from 'react';
import IndustryCard from './IndustryCard';
import type { LucideIcon } from 'lucide-react';

type IndustryDetail = {
  title: string;
  desc: string;
  points: string[];
  icon: LucideIcon;
  color: string;
};

interface IndustryCardsRowProps {
  industryDetails: IndustryDetail[];
  isRetailFlipped: boolean;
  isHospitalityFlipped: boolean;
  isProfessionalFlipped: boolean;
  isManufacturingFlipped: boolean;
  isAgricultureFlipped: boolean;
  isTransportFlipped: boolean;
  setIsRetailFlipped: (v: boolean) => void;
  setIsHospitalityFlipped: (v: boolean) => void;
  setIsProfessionalFlipped: (v: boolean) => void;
  setIsManufacturingFlipped: (v: boolean) => void;
  setIsAgricultureFlipped: (v: boolean) => void;
  setIsTransportFlipped: (v: boolean) => void;
  retailImg: string;
  tourismImg: string;
  professionalImg: string;
  manufacturingImg: string;
  agricultureImg: string;
  transportImg: string;
}

const IndustryCardsRow: React.FC<IndustryCardsRowProps> = ({
  industryDetails,
  isRetailFlipped,
  isHospitalityFlipped,
  isProfessionalFlipped,
  isManufacturingFlipped,
  isAgricultureFlipped,
  isTransportFlipped,
  setIsRetailFlipped,
  setIsHospitalityFlipped,
  setIsProfessionalFlipped,
  setIsManufacturingFlipped,
  setIsAgricultureFlipped,
  setIsTransportFlipped,
  retailImg,
  tourismImg,
  professionalImg,
  manufacturingImg,
  agricultureImg,
  transportImg,
}) => {
  const flipStates = [
    isRetailFlipped,
    isHospitalityFlipped,
    isProfessionalFlipped,
    isManufacturingFlipped,
    isAgricultureFlipped,
    isTransportFlipped,
  ];

  const setFlipFunctions = [
    setIsRetailFlipped,
    setIsHospitalityFlipped,
    setIsProfessionalFlipped,
    setIsManufacturingFlipped,
    setIsAgricultureFlipped,
    setIsTransportFlipped,
  ];

  const imageUrls = [retailImg, tourismImg, professionalImg, manufacturingImg, agricultureImg, transportImg];

  const anyFlipped = flipStates.some((v) => v);

  return (
    <div className={`overflow-hidden relative h-72 ${anyFlipped ? 'industries-paused' : ''}`}>
      <div className="flex space-x-6 industry-row-track-1">
        {industryDetails.map((industry, index) => (
          <IndustryCard
            key={`${industry.title}-track1-${index}`}
            industry={industry}
            index={index}
            isFlipped={flipStates[index] || false}
            onMouseEnter={() => {
              if (index < 6) {
                setFlipFunctions[index](true);
              }
            }}
            onMouseLeave={() => {
              if (index < 6) {
                setFlipFunctions[index](false);
              }
            }}
            imageUrl={imageUrls[index] || ''}
            isFlipcardIndustry={[0, 1, 2, 3, 4, 5].includes(index)}
          />
        ))}
      </div>

      <div className="flex space-x-6 ml-6 industry-row-track-2" aria-hidden="true">
        {industryDetails.map((industry, index) => (
          <IndustryCard
            key={`${industry.title}-track2-${index}`}
            industry={industry}
            index={index}
            isFlipped={flipStates[index] || false}
            onMouseEnter={() => {
              if (index < 6) {
                setFlipFunctions[index](true);
              }
            }}
            onMouseLeave={() => {
              if (index < 6) {
                setFlipFunctions[index](false);
              }
            }}
            imageUrl={imageUrls[index] || ''}
            isFlipcardIndustry={[0, 1, 2, 3, 4, 5].includes(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default IndustryCardsRow;