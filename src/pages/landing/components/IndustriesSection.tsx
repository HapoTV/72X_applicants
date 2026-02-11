import React from 'react';
import { ArrowDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type IndustryDetail = {
  title: string;
  desc: string;
  points: string[];
  icon: LucideIcon;
  color: string;
};

type AdditionalIndustry = {
  title: string;
  desc: string;
};

interface IndustriesSectionProps {
  industryDetails: IndustryDetail[];
  additionalIndustries: AdditionalIndustry[];
  setIsRetailFlipped: (v: boolean) => void;
  setIsHospitalityFlipped: (v: boolean) => void;
  setIsProfessionalFlipped: (v: boolean) => void;
  setIsManufacturingFlipped: (v: boolean) => void;
  setIsAgricultureFlipped: (v: boolean) => void;
  setIsTransportFlipped: (v: boolean) => void;
  isRetailFlipped: boolean;
  isHospitalityFlipped: boolean;
  isProfessionalFlipped: boolean;
  isManufacturingFlipped: boolean;
  isAgricultureFlipped: boolean;
  isTransportFlipped: boolean;
  additionalFlipped: boolean[];
  setAdditionalFlipped: React.Dispatch<React.SetStateAction<boolean[]>>;
  retailImg: string;
  tourismImg: string;
  professionalImg: string;
  manufacturingImg: string;
  agricultureImg: string;
  transportImg: string;
  educationImg: string;
  healthcareImg: string;
  estateImg: string;
  eventsImg: string;
  financeImg: string;
  ngoImg: string;
}

const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  industryDetails,
  additionalIndustries,
  setIsRetailFlipped,
  setIsHospitalityFlipped,
  setIsProfessionalFlipped,
  setIsManufacturingFlipped,
  setIsAgricultureFlipped,
  setIsTransportFlipped,
  isRetailFlipped,
  isHospitalityFlipped,
  isProfessionalFlipped,
  isManufacturingFlipped,
  isAgricultureFlipped,
  isTransportFlipped,
  additionalFlipped,
  setAdditionalFlipped,
  retailImg,
  tourismImg,
  professionalImg,
  manufacturingImg,
  agricultureImg,
  transportImg,
  educationImg,
  healthcareImg,
  estateImg,
  eventsImg,
  financeImg,
  ngoImg,
}) => {
  return (
    <section id="industries" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transform Your Industry with 72X</h2>
            <p className="text-xl text-gray-700 max-w-3xl">
              Tailored solutions designed to address the unique challenges of South African businesses across all sectors
            </p>
          </div>
          <a
            href="#apps"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#60A5FA] hover:bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 whitespace-nowrap"
          >
            Jump to Apps
            <ArrowDown className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>

      <div
        className={`overflow-hidden relative h-72 ${
          isRetailFlipped ||
          isHospitalityFlipped ||
          isProfessionalFlipped ||
          isManufacturingFlipped ||
          isAgricultureFlipped ||
          isTransportFlipped
            ? 'industries-paused'
            : ''
        }`}
      >
        <div className="flex space-x-6 industry-row-track-1">
          {industryDetails.map((industry, index) => (
            <div
              key={`${industry.title}-track1-${index}`}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col min-w-[260px] max-w-xs ${
                [0, 1, 2, 3, 4, 5].includes(index) ? 'industry-card' : ''
              } ${
                (index === 0 && isRetailFlipped) ||
                (index === 1 && isHospitalityFlipped) ||
                (index === 2 && isProfessionalFlipped) ||
                (index === 3 && isManufacturingFlipped) ||
                (index === 4 && isAgricultureFlipped) ||
                (index === 5 && isTransportFlipped)
                  ? 'industry-card--flipped'
                  : ''
              }`}
              onMouseEnter={
                index === 0
                  ? () => setIsRetailFlipped(true)
                  : index === 1
                    ? () => setIsHospitalityFlipped(true)
                    : index === 2
                      ? () => setIsProfessionalFlipped(true)
                      : index === 3
                        ? () => setIsManufacturingFlipped(true)
                        : index === 4
                          ? () => setIsAgricultureFlipped(true)
                          : index === 5
                            ? () => setIsTransportFlipped(true)
                            : undefined
              }
              onMouseLeave={
                index === 0
                  ? () => setIsRetailFlipped(false)
                  : index === 1
                    ? () => setIsHospitalityFlipped(false)
                    : index === 2
                      ? () => setIsProfessionalFlipped(false)
                      : index === 3
                        ? () => setIsManufacturingFlipped(false)
                        : index === 4
                          ? () => setIsAgricultureFlipped(false)
                          : index === 5
                            ? () => setIsTransportFlipped(false)
                            : undefined
              }
            >
              {[0, 1, 2, 3, 4, 5].includes(index) ? (
                <div className="p-4 flex-1 flex flex-col industry-card-inner">
                  <div className="industry-card-face industry-card-face--front">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={
                          index === 0
                            ? retailImg
                            : index === 1
                              ? tourismImg
                              : index === 2
                                ? professionalImg
                                : index === 3
                                  ? manufacturingImg
                                  : index === 4
                                    ? agricultureImg
                                    : transportImg
                        }
                        alt={industry.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="industry-card-face industry-card-face--back">
                    <div className="flex flex-col h-full items-center justify-center bg-gray-900 rounded-xl p-4 text-center">
                      <h3 className="text-lg font-bold text-white mb-3">{industry.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{industry.desc}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: industry.color }}
                    >
                      <industry.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{industry.title}</h3>
                  </div>

                  <p className="text-sm text-gray-300 mt-3 mb-4 line-clamp-3">{industry.desc}</p>

                  <div className="mt-auto pt-2">
                    <h4 className="text-xs font-semibold text-[#60A5FA] mb-2 uppercase tracking-wider">Key Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.points.slice(0, 2).map((point, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-200 border border-gray-600/50 leading-tight"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mr-1.5 flex-shrink-0"></span>
                          <span className="line-clamp-1">{point.split(':')[0]}</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/30 text-gray-400 border border-gray-600/30">
                        + More
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-6 ml-6 industry-row-track-2" aria-hidden="true">
          {industryDetails.map((industry, index) => (
            <div
              key={`${industry.title}-track2-${index}`}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col min-w-[260px] max-w-xs ${
                [0, 1, 2, 3, 4, 5].includes(index) ? 'industry-card' : ''
              } ${
                (index === 0 && isRetailFlipped) ||
                (index === 1 && isHospitalityFlipped) ||
                (index === 2 && isProfessionalFlipped) ||
                (index === 3 && isManufacturingFlipped) ||
                (index === 4 && isAgricultureFlipped) ||
                (index === 5 && isTransportFlipped)
                  ? 'industry-card--flipped'
                  : ''
              }`}
              onMouseEnter={
                index === 0
                  ? () => setIsRetailFlipped(true)
                  : index === 1
                    ? () => setIsHospitalityFlipped(true)
                    : index === 2
                      ? () => setIsProfessionalFlipped(true)
                      : index === 3
                        ? () => setIsManufacturingFlipped(true)
                        : index === 4
                          ? () => setIsAgricultureFlipped(true)
                          : index === 5
                            ? () => setIsTransportFlipped(true)
                            : undefined
              }
              onMouseLeave={
                index === 0
                  ? () => setIsRetailFlipped(false)
                  : index === 1
                    ? () => setIsHospitalityFlipped(false)
                    : index === 2
                      ? () => setIsProfessionalFlipped(false)
                      : index === 3
                        ? () => setIsManufacturingFlipped(false)
                        : index === 4
                          ? () => setIsAgricultureFlipped(false)
                          : index === 5
                            ? () => setIsTransportFlipped(false)
                            : undefined
              }
            >
              {[0, 1, 2, 3, 4, 5].includes(index) ? (
                <div className="p-4 flex-1 flex flex-col industry-card-inner">
                  <div className="industry-card-face industry-card-face--front">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={
                          index === 0
                            ? retailImg
                            : index === 1
                              ? tourismImg
                              : index === 2
                                ? professionalImg
                                : index === 3
                                  ? manufacturingImg
                                  : index === 4
                                    ? agricultureImg
                                    : transportImg
                        }
                        alt={industry.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="industry-card-face industry-card-face--back">
                    <div className="flex flex-col h-full items-center justify-center bg-gray-900 rounded-xl p-4 text-center">
                      <h3 className="text-lg font-bold text-white mb-3">{industry.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{industry.desc}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: industry.color }}
                    >
                      <industry.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{industry.title}</h3>
                  </div>

                  <p className="text-sm text-gray-300 mt-3 mb-4 line-clamp-3">{industry.desc}</p>

                  <div className="mt-auto pt-2">
                    <h4 className="text-xs font-semibold text-[#60A5FA] mb-2 uppercase tracking-wider">Key Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.points.slice(0, 2).map((point, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-200 border border-gray-600/50 leading-tight"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mr-1.5 flex-shrink-0"></span>
                          <span className="line-clamp-1">{point.split(':')[0]}</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/30 text-gray-400 border border-gray-600/30">
                        + More
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className={`overflow-hidden relative h-64 ${additionalFlipped.some((v) => v) ? 'industries-paused' : ''}`}>
          <div className="flex space-x-6 industry-row-track-1">
            {additionalIndustries.map((industry, index) => (
              <div
                key={`${industry.title}-extra-track1-${index}`}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col min-w-[260px] max-w-xs industry-card ${
                  additionalFlipped[index] ? 'industry-card--flipped' : ''
                }`}
                onMouseEnter={() =>
                  setAdditionalFlipped((prev) => {
                    const next = [...prev];
                    next[index] = true;
                    return next;
                  })
                }
                onMouseLeave={() =>
                  setAdditionalFlipped((prev) => {
                    const next = [...prev];
                    next[index] = false;
                    return next;
                  })
                }
              >
                <div className="p-4 flex-1 flex flex-col industry-card-inner">
                  <div className="industry-card-face industry-card-face--front">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={
                          index === 0
                            ? educationImg
                            : index === 1
                              ? healthcareImg
                              : index === 2
                                ? estateImg
                                : index === 3
                                  ? financeImg
                                  : index === 4
                                    ? ngoImg
                                    : eventsImg
                        }
                        alt={industry.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="industry-card-face industry-card-face--back">
                    <div className="flex flex-col h-full items-center justify-center bg-gray-900 rounded-xl p-4 text-center">
                      <h3 className="text-lg font-bold text-white mb-3">{industry.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{industry.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-6 ml-6 industry-row-track-2" aria-hidden="true">
            {additionalIndustries.map((industry, index) => (
              <div
                key={`${industry.title}-extra-track2-${index}`}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col min-w-[260px] max-w-xs industry-card ${
                  additionalFlipped[index] ? 'industry-card--flipped' : ''
                }`}
                onMouseEnter={() =>
                  setAdditionalFlipped((prev) => {
                    const next = [...prev];
                    next[index] = true;
                    return next;
                  })
                }
                onMouseLeave={() =>
                  setAdditionalFlipped((prev) => {
                    const next = [...prev];
                    next[index] = false;
                    return next;
                  })
                }
              >
                <div className="p-4 flex-1 flex flex-col industry-card-inner">
                  <div className="industry-card-face industry-card-face--front">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={
                          index === 0
                            ? educationImg
                            : index === 1
                              ? healthcareImg
                              : index === 2
                                ? estateImg
                                : index === 3
                                  ? financeImg
                                  : index === 4
                                    ? ngoImg
                                    : eventsImg
                        }
                        alt={industry.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="industry-card-face industry-card-face--back">
                    <div className="flex flex-col h-full items-center justify-center bg-gray-900 rounded-xl p-4 text-center">
                      <h3 className="text-lg font-bold text-white mb-3">{industry.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{industry.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Don't see your industry?</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Our platform is highly customizable to meet the unique needs of any business. Contact us to discuss a tailored solution for your industry.
        </p>
        <button
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
          onClick={() => {
            const to = 'admin@hapogroup.co.za';
            const subject = 'Custom solution request';
            window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
          }}
        >
          Get a Custom Solution
        </button>
      </div>
    </section>
  );
};

export default IndustriesSection;
