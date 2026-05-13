// src/pages/learning/LearningModuleCard.tsx
import React from 'react';
import { Clock, Star, Lock, CheckCircle } from 'lucide-react';
import type { UserLearningModule } from '../../interfaces/LearningData';
import CardThumbnail from './CardThumbnail';

interface Props {
  module: UserLearningModule;
  hasPassedQuiz: boolean;
  isLocked: boolean;
  gateText: string;
  coverKind: 'pdf' | 'office' | 'image' | 'other';
  coverSrc?: string;
  onOpen: (module: UserLearningModule) => void;
}

const LearningModuleCard: React.FC<Props> = ({
  module, hasPassedQuiz, isLocked, gateText, coverKind, coverSrc, onOpen,
}) => {
  const isDisabled = module.isLocked || isLocked;
  const hasCompletedReading = module.progress === 100 || Boolean(module.finishedAt);

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDisabled ? 'opacity-70' : ''}`}
    >
      <CardThumbnail
        module={module}
        hasPassedQuiz={hasPassedQuiz}
        coverKind={coverKind}
        coverSrc={coverSrc}
      />

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
          {module.title}
        </h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
          {module.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{module.duration}</span>
          </div>
          {module.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-700">{module.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-gray-400 capitalize text-xs">{module.difficulty}</span>
        </div>

        {/* Progress text */}
        {module.progress > 0 && module.progress < 100 && (
          <div className="text-xs text-gray-500 mb-2">{module.progress}% complete</div>
        )}

        {/* Gate warning */}
        {isLocked && (
          <div className="mb-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="text-xs font-semibold text-blue-900 flex items-center gap-1">
              <Lock className="w-3 h-3 flex-shrink-0" />
              {gateText}
            </div>
          </div>
        )}

        {/* CTA button */}
        <button
          className={`mt-auto w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : hasPassedQuiz
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                : hasCompletedReading
                  ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                  : module.progress > 0
                    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          disabled={isDisabled}
          onClick={() => onOpen(module)}
        >
          {isDisabled ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Locked
            </span>
          ) : hasPassedQuiz ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Review Material
            </span>
          ) : hasCompletedReading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          ) : module.progress > 0 ? (
            'Continue Learning'
          ) : (
            'Start Learning'
          )}
        </button>
      </div>
    </div>
  );
};

export default LearningModuleCard;
