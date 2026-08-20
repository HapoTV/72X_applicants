import React from 'react';
import IndustryCard from './IndustryCard';
import type { LucideIcon } from 'lucide-react';

type AdditionalIndustry = {
  title: string;
  desc: string;
  points?: string[];
  icon?: LucideIcon;
  color?: string;
};

interface AdditionalIndustriesGridProps {
  additionalIndustries: AdditionalIndustry[];
  additionalFlipped: boolean[];
  setAdditionalFlipped: React.Dispatch<React.SetStateAction<boolean[]>>;
  educationImg: string;
  healthcareImg: string;
  estateImg: string;
  financeImg: string;
  ngoImg: string;
  eventsImg: string;
}

const AdditionalIndustriesGrid: React.FC<AdditionalIndustriesGridProps> = ({
  additionalIndustries,
  additionalFlipped,
  setAdditionalFlipped,
  educationImg,
  healthcareImg,
  estateImg,
  financeImg,
  ngoImg,
  eventsImg,
}) => {
  const imageUrls = [educationImg, healthcareImg, estateImg, financeImg, ngoImg, eventsImg];

  const defaultIndustry = {
    points: [],
    icon: undefined,
    color: '#60A5FA',
  };

  return (
    <div className="mt-10">
      <div className={`overflow-hidden relative h-64 ${additionalFlipped.some((v) => v) ? 'industries-paused' : ''}`}>
        <div className="flex space-x-6 industry-row-track-1">
          {additionalIndustries.map((industry, index) => (
            <IndustryCard
              key={`${industry.title}-extra-track1-${index}`}
              industry={{ ...defaultIndustry, ...industry } as any}
              index={index}
              isFlipped={additionalFlipped[index] || false}
              onMouseEnter={() => {
                setAdditionalFlipped((prev) => {
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }}
              onMouseLeave={() => {
                setAdditionalFlipped((prev) => {
                  const next = [...prev];
                  next[index] = false;
                  return next;
                });
              }}
              imageUrl={imageUrls[index] || ''}
              isFlipcardIndustry={true}
            />
          ))}
        </div>

        <div className="flex space-x-6 ml-6 industry-row-track-2" aria-hidden="true">
          {additionalIndustries.map((industry, index) => (
            <IndustryCard
              key={`${industry.title}-extra-track2-${index}`}
              industry={{ ...defaultIndustry, ...industry } as any}
              index={index}
              isFlipped={additionalFlipped[index] || false}
              onMouseEnter={() => {
                setAdditionalFlipped((prev) => {
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }}
              onMouseLeave={() => {
                setAdditionalFlipped((prev) => {
                  const next = [...prev];
                  next[index] = false;
                  return next;
                });
              }}
              imageUrl={imageUrls[index] || ''}
              isFlipcardIndustry={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionalIndustriesGrid;