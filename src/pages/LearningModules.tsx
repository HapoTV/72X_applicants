// src/pages/LearningModules.tsx
import React from 'react';
import { BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, useLearningModules } from './learning/useLearningModules';
import LearningStatsBar from './learning/LearningStatsBar';
import LearningModuleCard from './learning/LearningModuleCard';
import LearningMaterialViewer from './learning/LearningMaterialViewer';
import FlipCardQuizModal from '../components/learning/FlipCardQuizModal';

// Map category IDs to URL parameters
const CATEGORY_URL_MAP: Record<string, string> = {
  'BUSINESS_PLANNING': 'business-plan',
  'MARKETING_SALES': 'marketing',
  'FINANCIAL_MANAGEMENT': 'finance',
  'OPERATIONS': 'operations',
  'LEADERSHIP': 'leadership',
  'TECHNICAL': 'technical',
};

const LearningModules: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedCategory,
    modules, openMaterial, quizQuestions, quizLoading, showQuiz, quizMaterial,
    quizPassedMaterialIds, materialReadyForQuiz, setMaterialReadyForQuiz,
    readTimerDone, setReadTimerDone,
    completedCount, inProgressCount,
    loading, error,
    toAbsoluteResourceUrl, getCardCoverKind, getCoverPreviewSrc, detectViewerKind, getIsLockedByGate,
    openMaterialAndTrack, closeMaterial, recordMaterialFinished,
    beginQuizForMaterial, handleQuizPass, handleCloseQuiz,
  } = useLearningModules();

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (!user?.email) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-700">Please log in to view your learning modules.</p>
        </div>
      </div>
    );
  }

  if (loading && modules.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="text-center py-12">
          <Spinner size="xl" color="blue" className="mx-auto mb-6" />
          <p className="mt-4 text-gray-600">Loading learning materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning</h1>
          <p className="text-gray-600 mt-2">
            Master essential skills with curated courses and materials
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              const urlParam = CATEGORY_URL_MAP[cat.id];
              navigate(`/learning?category=${urlParam}`);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <LearningStatsBar
        selectedCategory={selectedCategory}
        totalModules={modules.length}
        completedCount={completedCount}
        inProgressCount={inProgressCount}
      />

      {/* Module grid */}
      {modules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No modules found</h3>
          <p className="text-gray-500">No learning materials available for this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map(module => {
            const { isLocked, gateText } = getIsLockedByGate(module.id);
            return (
              <LearningModuleCard
                key={module.id}
                module={module}
                hasPassedQuiz={quizPassedMaterialIds.includes(module.id)}
                isLocked={isLocked}
                gateText={gateText}
                coverKind={getCardCoverKind(module)}
                coverSrc={getCoverPreviewSrc(module)}
                onOpen={openMaterialAndTrack}
              />
            );
          })}
        </div>
      )}

      {/* Material viewer modal */}
      {openMaterial && (
        <LearningMaterialViewer
          material={openMaterial}
          modules={modules}
          materialReadyForQuiz={materialReadyForQuiz}
          readTimerDone={readTimerDone}
          quizPassedMaterialIds={quizPassedMaterialIds}
          userEmail={user.email}
          toAbsoluteResourceUrl={toAbsoluteResourceUrl}
          detectViewerKind={detectViewerKind}
          getIsLockedByGate={getIsLockedByGate}
          onClose={closeMaterial}
          onContinue={openMaterialAndTrack}
          onFinished={recordMaterialFinished}
          onStartQuiz={(m) => { closeMaterial(); beginQuizForMaterial(m); }}
          setMaterialReadyForQuiz={setMaterialReadyForQuiz}
          setReadTimerDone={setReadTimerDone}
        />
      )}

      {/* Quiz modal */}
      <FlipCardQuizModal
        isOpen={showQuiz}
        moduleTitle={quizMaterial?.title || ''}
        questions={quizQuestions}
        passPercentage={70}
        materialId={quizMaterial?.id}
        onClose={handleCloseQuiz}
        onPass={handleQuizPass}
      />

      {/* Quiz generation overlay */}
      {quizLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-12 text-center max-w-md">
            <div className="relative">
              <Spinner size="xl" color="primary" className="mx-auto mb-6" />
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Generating AI Knowledge Check</h3>
            <p className="text-gray-600 mb-2">Analyzing your learning material to create personalized questions...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModules;
