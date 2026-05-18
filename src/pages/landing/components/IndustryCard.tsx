import React from 'react';
import type { LucideIcon } from 'lucide-react';

type IndustryDetail = {
  title: string;
  desc: string;
  points: string[];
  icon: LucideIcon;
  color: string;
};

interface IndustryCardProps {
  industry: IndustryDetail;
  index: number;
  isFlipped: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  imageUrl: string;
  isFlipcardIndustry: boolean;
}

const IndustryCard: React.FC<IndustryCardProps> = ({
  industry,
  index,
  isFlipped,
  onMouseEnter,
  onMouseLeave,
  imageUrl,
  isFlipcardIndustry,
}) => {
  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col min-w-[260px] max-w-xs ${
        isFlipcardIndustry ? 'industry-card' : ''
      } ${isFlipped ? 'industry-card--flipped' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isFlipcardIndustry ? (
        <div className="p-4 flex-1 flex flex-col industry-card-inner">
          <div className="industry-card-face industry-card-face--front">
            <div className="w-full h-full flex items-center justify-center">
              <img src={imageUrl} alt={industry.title} className="w-full h-full object-cover" />
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
  );
};

export default IndustryCard;