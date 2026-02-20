// src/pages/LearningModules.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Star, BookOpen, Lock, X, Brain, CheckCircle } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { adService } from '../services/AdService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule } from '../interfaces/LearningData';
import { EngagementType } from '../interfaces/AdData';
import FlipCardQuizModal from '../components/learning/FlipCardQuizModal';
// import CelebrationModal from '../components/learning/CelebrationModal';

const LearningModules: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('BUSINESS_PLANNING');
  const [modules, setModules] = useState<UserLearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMaterial, setOpenMaterial] = useState<UserLearningModule | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [, setShowCelebration] = useState(false);
  const [quizMaterial, setQuizMaterial] = useState<UserLearningModule | null>(null);
  const [, setCompletedModule] = useState<UserLearningModule | null>(null);
  const [startedMaterialIds, setStartedMaterialIds] = useState<string[]>([]);
  const [quizPassedMaterialIds, setQuizPassedMaterialIds] = useState<string[]>([]);
  const [materialReadyForQuiz, setMaterialReadyForQuiz] = useState(false);
  const [readTimerDone, setReadTimerDone] = useState(false);

  const categories = [
    { id: 'BUSINESS_PLANNING', name: 'Business Planning' },
    { id: 'MARKETING_SALES', name: 'Marketing & Sales' },
    { id: 'FINANCIAL_MANAGEMENT', name: 'Financial Management' },
    { id: 'OPERATIONS', name: 'Operations' },
    { id: 'LEADERSHIP', name: 'Leadership' },
    { id: 'TECHNICAL', name: 'Technical' }
  ];

  // Update selected category from URL params
  // In LearningModules.tsx, update the useEffect that reads from URL params:

useEffect(() => {
  const category = searchParams.get('category') || 'BUSINESS_PLANNING';
  
  // Normalize the category to match backend expectations
  let normalizedCategory = category;
  
  // Handle legacy lowercase formats
  const categoryMap: Record<string, string> = {
    'business-plan': 'BUSINESS_PLANNING',
    'marketing': 'MARKETING_SALES',
    'finance': 'FINANCIAL_MANAGEMENT',
    'operations': 'OPERATIONS',
    'leadership': 'LEADERSHIP',
    'technical': 'TECHNICAL',
    'standardbank': 'TECHNICAL'
  };
  
  if (categoryMap[category.toLowerCase()]) {
    normalizedCategory = categoryMap[category.toLowerCase()];
  }
  
  if (normalizedCategory !== selectedCategory) {
    setSelectedCategory(normalizedCategory);
  }
}, [searchParams, selectedCategory]);

  // Memoized values
  const completedCount = useMemo(() => {
    return modules.filter(m => quizPassedMaterialIds.includes(m.id) || m.progress === 100).length;
  }, [modules, quizPassedMaterialIds]);

  const inProgressCount = useMemo(() => {
    const startedSet = new Set<string>(startedMaterialIds);
    if (openMaterial?.id) startedSet.add(openMaterial.id);
  
    const passedSet = new Set<string>(quizPassedMaterialIds);
  
    let count = 0;
    for (const m of modules) {
      if (!startedSet.has(m.id)) continue;
      if (passedSet.has(m.id)) continue;
      count += 1;
    }
    return count;
  }, [modules, startedMaterialIds, openMaterial?.id, quizPassedMaterialIds]);

  // Fetch learning data
  const fetchLearningData = useCallback(async () => {
    if (!user?.email) {
      setError('User email not found');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const filter = { category: selectedCategory as any };
      const modulesData = await learningService.getUserModules(user.email, filter);
      setModules(modulesData);

      const started = new Set<string>();
      const quizPassed = new Set<string>();

      modulesData.forEach(m => {
        if (m.openedAt || (m.progress && m.progress > 0)) started.add(m.id);
        if (m.quizPassedAt) quizPassed.add(m.id);
      });

      setStartedMaterialIds(Array.from(started));
      setQuizPassedMaterialIds(Array.from(quizPassed));

    } catch (err) {
      setError('Failed to load learning materials');
      console.error('Error fetching learning data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email, selectedCategory]);

  useEffect(() => {
    if (user?.email) {
      fetchLearningData();
    }
  }, [user?.email, fetchLearningData]);

  // Timer effect for reading materials
  useEffect(() => {
    if (!openMaterial) {
      setMaterialReadyForQuiz(false);
      setReadTimerDone(false);
      return;
    }

    setMaterialReadyForQuiz(false);
    setReadTimerDone(false);

    const type = (openMaterial.type || '').toLowerCase();
    const url = openMaterial.resourceUrl || '';
    const isVideo = type.includes('video') || /\.(mp4|webm|ogg)$/i.test(url);

    if (!isVideo) {
      const timer = window.setTimeout(() => setReadTimerDone(true), 15000);
      return () => window.clearTimeout(timer);
    }
  }, [openMaterial]);

  const handleModuleCompletion = useCallback((module: UserLearningModule) => {
    if (module.progress === 100 && !quizPassedMaterialIds.includes(module.id)) {
      setCompletedModule(module);
      setShowCelebration(true);
    }
  }, [quizPassedMaterialIds]);

  const getIsLockedByGate = useCallback((moduleId: string): { isLocked: boolean; gateText: string } => {
    const idx = modules.findIndex((m) => m.id === moduleId);
    if (idx <= 0) return { isLocked: false, gateText: '' };
    const prevId = modules[idx - 1]?.id;
    const isLocked = prevId ? !quizPassedMaterialIds.includes(prevId) : false;
    return {
      isLocked,
      gateText: prevId ? 'To continue to the next learning material, you must first pass the knowledge check.' : '',
    };
  }, [modules, quizPassedMaterialIds]);

  const openMaterialAndTrack = useCallback((material: UserLearningModule) => {
    setOpenMaterial(material);
    setStartedMaterialIds(prev => 
      prev.includes(material.id) ? prev : [...prev, material.id]
    );
    setMaterialReadyForQuiz(false);
    setReadTimerDone(false);

    if (user?.email) {
      learningService.recordOpened(user.email, material.id);
    }

    handleModuleCompletion(material);
  }, [user?.email, handleModuleCompletion]);

  const mapQuestionType = useCallback((type: string): string => {
    const typeMap: Record<string, string> = {
      'MULTIPLE_CHOICE': 'multiple_choice',
      'TRUE_FALSE': 'multiple_choice',
      'FILL_BLANK': 'fill_blank',
      'MATCHING': 'match_pairs',
      'MATCH_WORDING': 'match_pairs',
      'ORDERING': 'order_steps',
      'CATEGORIZE': 'categorize',
      'DRAG_AND_DROP': 'categorize'
    };
    return typeMap[type] || 'multiple_choice';
  }, []);

  const transformBackendQuestionsToFlipCardFormat = useCallback((backendQuestions: any[]): any[] => {
    if (!Array.isArray(backendQuestions) || backendQuestions.length === 0) {
      return [];
    }
    
    return backendQuestions.map((q, index) => {
      const questionType = q.questionType || 'MULTIPLE_CHOICE';
      
      const baseQuestion: any = {
        id: q.id || `q${index + 1}`,
        type: mapQuestionType(questionType),
        question: q.questionText || 'Sample question',
        explanation: q.explanation || 'Review the material to understand this concept better.',
        correctAnswer: q.correctAnswerIndex || 0,
      };

      switch (questionType) {
        case 'MULTIPLE_CHOICE':
        case 'TRUE_FALSE':
          baseQuestion.options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
          break;
        case 'FILL_BLANK':
          baseQuestion.template = q.questionText || '______ is a key concept.';
          baseQuestion.wordBank = [q.correctAnswerText || 'answer', 'concept', 'process', 'method', 'strategy'];
          baseQuestion.correctWord = q.correctAnswerText || 'answer';
          break;
        case 'MATCH_WORDING':
          baseQuestion.pairs = Array.isArray(q.pairs) ? q.pairs : [];
          baseQuestion.options = [];
          break;
        case 'DRAG_AND_DROP':
          baseQuestion.categories = Array.isArray(q.categories) ? q.categories : [];
          baseQuestion.items = Array.isArray(q.items) ? q.items : [];
          baseQuestion.options = [];
          break;
        default:
          baseQuestion.options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
      }

      return baseQuestion;
    });
  }, [mapQuestionType]);

  const recordMaterialFinished = useCallback(async (material: UserLearningModule) => {
    try {
      if (user?.email) {
        await learningService.recordFinished(user.email, material.id);
      }
    } catch {
      // non-critical
    }

    try {
      await adService.recordEngagement(
        EngagementType.ACTION_COMPLETED,
        5,
        `Finished learning material: ${material.title}`
      );
    } catch {
      // non-critical
    }
  }, [user?.email]);

  const beginQuizForMaterial = useCallback(async (material: UserLearningModule) => {
    setQuizLoading(true);
    setError(null);
    
    try {
      let quiz = await learningService.getQuiz(material.id);
      
      if (!quiz) {
        quiz = await learningService.generateQuiz(material.id, 20);
      }
      
      if (!quiz?.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        throw new Error('Server returned invalid quiz data');
      }
      
      const transformedQuestions = transformBackendQuestionsToFlipCardFormat(quiz.questions);
      
      if (transformedQuestions.length === 0) {
        throw new Error('Failed to transform quiz questions');
      }
      
      setQuizQuestions(transformedQuestions);
      setQuizMaterial(material);
      setShowQuiz(true);
      
      if (user?.email) {
        await learningService.recordQuizStarted(user.email, material.id);
      }

      try {
        await adService.recordEngagement(
          EngagementType.ACTION_COMPLETED,
          5,
          `Started knowledge check: ${material.title}`
        );
      } catch {
        // non-critical
      }
      
      console.log(`✅ Quiz ready with ${transformedQuestions.length} questions`);
      
    } catch (error) {
      console.error('❌ Failed to start quiz:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate quiz. Please try again.';
      setError(message);
    } finally {
      setQuizLoading(false);
    }
  }, [user?.email, transformBackendQuestionsToFlipCardFormat]);

  const handleQuizPass = useCallback(async (score: number, totalQuestions: number, percentage: number) => {
    if (!quizMaterial) return;
    
    try {
      if (user?.email) {
        await learningService.recordQuizPassed(
          user.email,
          quizMaterial.id,
          score,
          totalQuestions,
          percentage
        );
      }

      try {
        await adService.recordEngagement(
          EngagementType.ACHIEVEMENT_UNLOCKED,
          50,
          `Passed knowledge check: ${quizMaterial.title} (${Math.round(percentage)}%)`
        );
      } catch {
        // non-critical
      }
      

      setQuizPassedMaterialIds(prev => 
        prev.includes(quizMaterial.id) ? prev : [...prev, quizMaterial.id]
      );
      
      setModules(prevModules => 
        prevModules.map(m => 
          m.id === quizMaterial.id 
            ? { ...m, progress: 100, isCompleted: true, quizPassedAt: new Date().toISOString() }
            : m
        )
      );

    } catch (error) {
      console.error('Error recording quiz pass:', error);
    } finally {
      setShowQuiz(false);
      setShowCelebration(false);
      setQuizMaterial(null);
      setQuizQuestions([]);
      setCompletedModule(null);
    }
  }, [user?.email, quizMaterial]);

  const handleCloseQuiz = useCallback(() => {
    setShowQuiz(false);
    setQuizMaterial(null);
    setQuizQuestions([]);
  }, []);

  const detectViewerKind = useCallback((material: UserLearningModule): 'video' | 'pdf' | 'doc' | 'url' | 'unknown' => {
    const type = (material.type || '').toLowerCase();
    const url = material.resourceUrl || '';
    if (type.includes('video') || /\.(mp4|webm|ogg)$/i.test(url)) return 'video';
    if (type.includes('pdf') || /\.(pdf)$/i.test(url)) return 'pdf';
    if (type.includes('doc') || /\.(doc|docx)$/i.test(url)) return 'doc';
    if (type.includes('url') || /^https?:\/\//i.test(url)) return 'url';
    return 'unknown';
  }, []);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
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
      {/* Category Metrics Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {categories.find(cat => cat.id === selectedCategory)?.name || 'Learning'} Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Modules</p>
                <p className="text-2xl font-bold text-blue-800">{modules.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">{completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-purple-800">{inProgressCount}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Modules Grid */}
      {modules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No modules found</h3>
          <p className="text-gray-500">No learning materials available for this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => {
            const { isLocked, gateText } = getIsLockedByGate(module.id);
            const hasPassedQuiz = quizPassedMaterialIds.includes(module.id);
            
            return (
              <div key={module.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative bg-gray-50 h-16">
                  {hasPassedQuiz && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passed
                    </div>
                  )}
                  {module.isPremium && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                      Premium
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>Progress</span>
                        <span className="font-semibold">{hasPassedQuiz ? 100 : module.progress}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-1 mt-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${hasPassedQuiz ? 100 : module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1 line-clamp-1">{module.title}</h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{module.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{module.rating}</span>
                    </div>
                  </div>

                  {isLocked && (
                    <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {gateText}
                      </div>
                    </div>
                  )}

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] ${
                      module.isLocked || isLocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : hasPassedQuiz
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                    disabled={module.isLocked || isLocked}
                    onClick={() => openMaterialAndTrack(module)}
                  >
                    {module.isLocked || isLocked ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Locked
                      </span>
                    ) : hasPassedQuiz ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Review Material
                      </span>
                    ) : (
                      'Start Learning'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Material Viewer Modal */}
      {openMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{openMaterial.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{openMaterial.type || 'Learning Material'}</p>
              </div>
              <button
                onClick={() => setOpenMaterial(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              {(() => {
                const kind = detectViewerKind(openMaterial);
                const url = openMaterial.resourceUrl;

                if (!url) {
                  return (
                    <div className="text-sm text-gray-700">
                      No resource URL found for this material.
                    </div>
                  );
                }

                if (kind === 'pdf' || kind === 'doc') {
                  return (
                    <div>
                      <iframe
                        title="Document Viewer"
                        src={kind === 'doc' 
                          ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
                          : url
                        }
                        className="w-full h-[72vh] rounded-lg bg-white"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-600">
                          Read for a moment, then confirm when finished to unlock the knowledge check.
                        </div>
                        <button
                          onClick={async () => {
                            setMaterialReadyForQuiz(true);
                            await recordMaterialFinished(openMaterial);
                          }}
                          disabled={!readTimerDone}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            readTimerDone 
                              ? 'bg-primary-600 text-white hover:bg-primary-700' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          I finished reading
                        </button>
                      </div>
                    </div>
                  );
                }

                if (kind === 'video') {
                  return (
                    <div>
                      <video
                        className="w-full rounded-lg bg-black"
                        controls
                        controlsList="nodownload"
                        onEnded={async () => {
                          setMaterialReadyForQuiz(true);
                          await recordMaterialFinished(openMaterial);
                        }}
                      >
                        <source src={url} />
                      </video>
                      <div className="mt-2 text-xs text-gray-600">
                        Watch until the end to unlock the knowledge check.
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="text-sm text-gray-700">
                    <p>Click the link below to open the material:</p>
                    <a 
                      className="text-primary-600 hover:underline break-all mt-2 inline-block" 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      {url}
                    </a>
                    <div className="mt-4">
                      <button
                        onClick={async () => {
                          setMaterialReadyForQuiz(true);
                          await recordMaterialFinished(openMaterial);
                        }}
                        disabled={!readTimerDone}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          readTimerDone 
                            ? 'bg-primary-600 text-white hover:bg-primary-700' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        I finished reviewing
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setOpenMaterial(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setOpenMaterial(null);
                  beginQuizForMaterial(openMaterial);
                }}
                disabled={!materialReadyForQuiz && !quizPassedMaterialIds.includes(openMaterial.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  materialReadyForQuiz || quizPassedMaterialIds.includes(openMaterial.id)
                    ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {quizPassedMaterialIds.includes(openMaterial.id) 
                  ? 'Retake Knowledge Check' 
                  : 'Take Knowledge Check'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flip Card Quiz Modal */}
      <FlipCardQuizModal
        isOpen={showQuiz}
        moduleTitle={quizMaterial?.title || ''}
        questions={quizQuestions}
        passPercentage={70}
        onClose={handleCloseQuiz}
        onPass={handleQuizPass}
      />

      {/* Loading Overlay for Quiz Generation */}
      {quizLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-12 text-center max-w-md">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Generating AI Knowledge Check</h3>
            <p className="text-gray-600 mb-2">
              Analyzing your learning material to create personalized questions...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModules;