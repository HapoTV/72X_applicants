// src/pages/learning/CardThumbnail.tsx
import React, { useState } from 'react';
import { CheckCircle, BarChart2, Star, Brain, BookOpen } from 'lucide-react';
import type { UserLearningModule } from '../../interfaces/LearningData';
import PdfCover from './PdfCover';
import { getTypeIcon } from './learningUtils';

const CATEGORY_STYLES: Record<string, { gradient: string; icon: React.ReactNode; accent: string }> = {
  BUSINESS_PLANNING:    { gradient: 'from-blue-600 to-blue-800',    icon: <BarChart2 className="w-8 h-8 text-white/80" />,  accent: 'bg-blue-600' },
  MARKETING_SALES:      { gradient: 'from-orange-500 to-pink-600',  icon: <Star className="w-8 h-8 text-white/80" />,       accent: 'bg-orange-500' },
  FINANCIAL_MANAGEMENT: { gradient: 'from-green-600 to-teal-700',   icon: <BarChart2 className="w-8 h-8 text-white/80" />,  accent: 'bg-green-600' },
  OPERATIONS:           { gradient: 'from-purple-600 to-indigo-700',icon: <CheckCircle className="w-8 h-8 text-white/80" />,accent: 'bg-purple-600' },
  LEADERSHIP:           { gradient: 'from-yellow-500 to-orange-600',icon: <Star className="w-8 h-8 text-white/80" />,       accent: 'bg-yellow-500' },
  TECHNICAL:            { gradient: 'from-cyan-600 to-blue-700',    icon: <Brain className="w-8 h-8 text-white/80" />,      accent: 'bg-cyan-600' },
};
const DEFAULT_STYLE = { gradient: 'from-gray-600 to-gray-800', icon: <BookOpen className="w-8 h-8 text-white/80" />, accent: 'bg-gray-600' };

interface Props {
  module: UserLearningModule;
  hasPassedQuiz: boolean;
  coverKind: 'pdf' | 'office' | 'image' | 'other';
  coverSrc?: string;
}

const CardThumbnail: React.FC<Props> = ({ module, hasPassedQuiz, coverKind, coverSrc }) => {
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = module.thumbnailUrl || module.thumbnail;
  const imageSrc = coverKind === 'image' ? (coverSrc || thumbnailUrl) : thumbnailUrl;
  const showImage = imageSrc && !imgError;
  const effectiveProgress = module.progress === 100 || module.finishedAt ? 100 : module.progress;
  const catKey = (module.category || '').toUpperCase().replace(/-/g, '_');
  const style = CATEGORY_STYLES[catKey] || DEFAULT_STYLE;

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
      {coverKind === 'pdf' && coverSrc ? (
        <PdfCover url={coverSrc} materialId={module.id} />
      ) : coverKind === 'office' && coverSrc ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            title="Cover preview"
            src={coverSrc}
            className="absolute inset-0 pointer-events-none"
            style={{ width: 'calc(100% + 18px)', height: 'calc(100% + 18px)', marginLeft: '-9px', marginTop: '-9px', border: 0, overflow: 'hidden' }}
            scrolling="no"
            loading="lazy"
          />
        </div>
      ) : showImage ? (
        <img src={imageSrc} alt={module.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center gap-2 p-4`}>
          {style.icon}
          <span className="text-white font-bold text-sm text-center line-clamp-2 leading-tight px-2">{module.title}</span>
        </div>
      )}

      {/* Type badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        {getTypeIcon(module.type)}
        <span className="capitalize">{(module.type || 'material').toLowerCase()}</span>
      </div>

      {/* Passed badge */}
      {hasPassedQuiz && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          <CheckCircle className="w-3 h-3" /> Passed
        </div>
      )}

      {/* Premium badge */}
      {module.isPremium && !hasPassedQuiz && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
          Premium
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${hasPassedQuiz ? 100 : effectiveProgress}%` }} />
      </div>
    </div>
  );
};

export default CardThumbnail;
