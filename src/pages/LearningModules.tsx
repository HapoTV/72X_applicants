import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Clock, Star, BookOpen, Lock, X } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { quizAttemptService } from '../services/QuizAttemptService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule } from '../interfaces/LearningData';
import FlipCardQuizModal from '../components/learning/FlipCardQuizModal';
import QuizService from '../services/QuizService';

const LearningModules: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>(searchParams.get('category') || 'business-plan');
  
  useEffect(() => {
    console.log('Current URL search params:', searchParams.toString());
    console.log('Selected category from URL:', selectedCategory);
    console.log('Current categories:', categories);
  }, [searchParams, selectedCategory]);

  useEffect(() => {
    const categoryFromParams = searchParams.get('category') || 'business-plan';
    console.log('Updating selectedCategory from URL:', categoryFromParams);
    setSelectedCategory(categoryFromParams);
  }, [searchParams]);

  const [modules, setModules] = useState<UserLearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openMaterial, setOpenMaterial] = useState<UserLearningModule | null>(null);
  const [startedMaterialIds, setStartedMaterialIds] = useState<string[]>([]);
  const [finishedMaterialIds, setFinishedMaterialIds] = useState<string[]>([]);
  const [quizStartedMaterialIds, setQuizStartedMaterialIds] = useState<string[]>([]);
  const [quizPassedMaterialIds, setQuizPassedMaterialIds] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizMaterial, setQuizMaterial] = useState<UserLearningModule | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const [materialReadyForQuiz, setMaterialReadyForQuiz] = useState(false);
  const [readTimerDone, setReadTimerDone] = useState(false);

  const orderedModules = useMemo(() => modules, [modules]);

  const getIsLockedByGate = (moduleId: string): { isLocked: boolean; gateText: string } => {
    const idx = orderedModules.findIndex((m) => m.id === moduleId);
    if (idx <= 0) return { isLocked: false, gateText: '' };
    const prevId = orderedModules[idx - 1]?.id;
    const isLocked = prevId ? !quizPassedMaterialIds.includes(prevId) : false;
    return {
      isLocked,
      gateText: prevId ? 'To continue to the next learning material, you must first answer this quiz.' : '',
    };
  };

  const beginQuizForMaterial = (material: UserLearningModule) => {
    console.log('Begin quiz for material:', {
      id: material.id,
      title: material.title,
      category: material.category,
    });
    const questions = QuizService.generateQuizQuestions(
      material.title,
      [material.description || '', material.fileName || '', material.type || ''].filter(Boolean).join('\n'),
      material.category
    );
    console.log(
      'Generated quiz questions:',
      questions.length,
      questions.map((q) => ({ id: q.id, type: (q as any).type }))
    );
    setQuizQuestions(questions);
    setQuizMaterial(material);
    setShowQuiz(true);
    setQuizStartedMaterialIds((prev) => (prev.includes(material.id) ? prev : [...prev, material.id]));

    if (user?.email) {
      void learningService.recordQuizStarted(user.email, material.id);
      void quizAttemptService.recordAttempt({
        userEmail: user.email,
        materialId: material.id,
        status: 'STARTED',
        occurredAt: new Date().toISOString(),
      });
    }
  };

  const handleQuizPass = (score: number, totalQuestions: number, percentage: number) => {
    setShowQuiz(false);

    if (quizMaterial) {
      setQuizPassedMaterialIds((prev) => (prev.includes(quizMaterial.id) ? prev : [...prev, quizMaterial.id]));
      const message = QuizService.getPerformanceMessage(score, totalQuestions);
      alert(`${message} Score: ${score}/${totalQuestions} (${percentage}%)`);

      if (user?.email) {
        void learningService.recordQuizPassed(user.email, quizMaterial.id, score, totalQuestions, percentage);
        void quizAttemptService.recordAttempt({
          userEmail: user.email,
          materialId: quizMaterial.id,
          status: 'PASSED',
          score,
          totalQuestions,
          percentage,
          occurredAt: new Date().toISOString(),
        });
      }
    }

    setQuizMaterial(null);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setQuizMaterial(null);
  };

  const openMaterialAndTrack = (material: UserLearningModule) => {
    setOpenMaterial(material);
    setStartedMaterialIds((prev) => (prev.includes(material.id) ? prev : [...prev, material.id]));

    if (user?.email) {
      void learningService.recordOpened(user.email, material.id);
    }
  };

  const completedMaterialIdSet = useMemo(() => {
    const ids = new Set<string>([...quizPassedMaterialIds, ...quizStartedMaterialIds]);
    if (showQuiz && quizMaterial?.id) ids.add(quizMaterial.id);
    return ids;
  }, [quizPassedMaterialIds, quizStartedMaterialIds, showQuiz, quizMaterial?.id]);

  const inProgressCount = useMemo(() => {
    const startedSet = new Set<string>(startedMaterialIds);
    if (openMaterial?.id) startedSet.add(openMaterial.id);

    const fromBackend = modules.filter((m) => m.progress > 0 && m.progress < 100).map((m) => m.id);
    for (const id of fromBackend) startedSet.add(id);

    let count = 0;
    for (const m of modules) {
      if (!startedSet.has(m.id)) continue;
      if (completedMaterialIdSet.has(m.id)) continue;
      count += 1;
    }
    return count;
  }, [modules, startedMaterialIds, openMaterial?.id, completedMaterialIdSet]);

  const completedCount = useMemo(() => {
    let count = 0;
    for (const m of modules) {
      if (completedMaterialIdSet.has(m.id) || m.progress === 100) count += 1;
    }
    return count;
  }, [modules, completedMaterialIdSet]);

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

    if (isVideo) return;

    const timer = window.setTimeout(() => setReadTimerDone(true), 12000);
    return () => window.clearTimeout(timer);
  }, [openMaterial]);

  const detectViewerKind = (material: UserLearningModule): 'video' | 'pdf' | 'doc' | 'url' | 'unknown' => {
    const type = (material.type || '').toLowerCase();
    const url = material.resourceUrl || '';
    if (type.includes('video') || /\.(mp4|webm|ogg)$/i.test(url)) return 'video';
    if (type.includes('pdf') || /\.(pdf)$/i.test(url)) return 'pdf';
    if (type.includes('doc') || /\.(doc|docx)$/i.test(url)) return 'doc';
    if (type.includes('url') || /^https?:\/\//i.test(url)) return 'url';
    return 'unknown';
  };

  const categories = [
    { id: 'business-plan', name: 'Business Planning' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'finance', name: 'Financial Management' },
    { id: 'operations', name: 'Operations' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'standardbank', name: 'Standard Bank' }
  ];

  useEffect(() => {
    if (user?.email) {
      fetchLearningData();
    } else {
      setLoading(false);
    }
  }, [user?.email, selectedCategory]);

  const fetchLearningData = async () => {
    if (!user?.email) {
      setError('User email not found');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching learning data for category:', selectedCategory);
      const filter = { category: selectedCategory as any };
      const modulesData = await learningService.getUserModules(user.email, filter);
      console.log('Fetched modules:', modulesData);
      setModules(modulesData);

      // Initialize local UI tracking from backend progress fields (if available)
      try {
        const started = new Set<string>();
        const finished = new Set<string>();
        const quizStarted = new Set<string>();
        const quizPassed = new Set<string>();

        for (const m of modulesData) {
          if (m.openedAt || (typeof m.progress === 'number' && m.progress > 0)) started.add(m.id);
          if (m.finishedAt || m.progress === 100) finished.add(m.id);
          if (m.quizStartedAt) quizStarted.add(m.id);
          if (m.quizPassedAt) quizPassed.add(m.id);
        }

        setStartedMaterialIds((prev) => Array.from(new Set([...prev, ...Array.from(started)])));
        setFinishedMaterialIds((prev) => Array.from(new Set([...prev, ...Array.from(finished)])));
        setQuizStartedMaterialIds((prev) => Array.from(new Set([...prev, ...Array.from(quizStarted)])));
        setQuizPassedMaterialIds((prev) => Array.from(new Set([...prev, ...Array.from(quizPassed)])));
      } catch {
        // ignore
      }

    } catch (err) {
      setError('Failed to load learning materials');
      console.error('Error fetching learning data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                <p className="text-2xl font-bold text-green-800">
                  {completedCount}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-purple-800">
                  {inProgressCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
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

          <div className="mt-8 max-w-xl mx-auto text-left bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-blue-900">
              To continue to the next learning material, you must first answer this quiz.
            </div>
            <div className="text-xs text-blue-800 mt-1">
              Quiz Development: simulate completing a material and unlock the next by passing a flip-card checkpoint (50%).
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  const demoMaterial: UserLearningModule = {
                    id: 'demo-material-001',
                    title: 'Business Planning: Executive Summary',
                    description: 'A short demo material used to preview the quiz gate flow.',
                    category: selectedCategory,
                    duration: '5 min',
                    lessons: 1,
                    difficulty: 'Beginner',
                    rating: 0,
                    students: 0,
                    isPremium: false,
                    progress: 0,
                    thumbnail: 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400',
                    isCompleted: false,
                    isLocked: false,
                    type: 'URL',
                    resourceUrl: 'https://example.com',
                  };
                  openMaterialAndTrack(demoMaterial);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 text-sm font-semibold"
              >
                Preview Quiz Gate
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img src={module.thumbnail} alt={module.title} className="w-full h-32 object-cover" />
                {module.isPremium && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    Premium
                  </div>
                )}
                {finishedMaterialIds.includes(module.id) && (
                  <div className="absolute bottom-2 left-2 bg-green-100 border border-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Finished
                  </div>
                )}
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

                {(() => {
                  const { isLocked, gateText } = getIsLockedByGate(module.id);

                  return (
                    <>
                      {isLocked && (
                        <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <div className="text-xs font-semibold text-blue-900">{gateText}</div>
                        </div>
                      )}

                      <button
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          module.isLocked || isLocked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={module.isLocked || isLocked}
                        onClick={() => openMaterialAndTrack(module)}
                      >
                        {module.isLocked || isLocked ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Locked
                          </span>
                        ) : (
                          'Open Material'
                        )}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {openMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{openMaterial.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{openMaterial.type || 'Material'}</p>
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

                if (kind === 'doc') {
                  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
                  return (
                    <div>
                      <iframe
                        title="Document Viewer"
                        src={officeUrl}
                        className="w-full h-[72vh] rounded-lg bg-white"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-600">
                          Read for a moment, then confirm when finished to unlock the quiz.
                        </div>
                        <button
                          onClick={() => setMaterialReadyForQuiz(true)}
                          disabled={!readTimerDone}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            readTimerDone ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          I finished reading
                        </button>
                      </div>
                      <div className="mt-2 text-xs">
                        <a className="text-blue-600 hover:underline break-all" href={url} target="_blank" rel="noreferrer">
                          Open in new tab
                        </a>
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
                        onEnded={() => setMaterialReadyForQuiz(true)}
                      >
                        <source src={url} />
                      </video>
                      <div className="mt-2 text-xs text-gray-600">
                        Watch until the end to unlock the quiz.
                      </div>
                    </div>
                  );
                }

                if (kind === 'pdf') {
                  return (
                    <div>
                      <iframe
                        title="PDF Viewer"
                        src={url}
                        className="w-full h-[72vh] rounded-lg bg-white"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-600">
                          Read for a moment, then confirm when finished to unlock the quiz.
                        </div>
                        <button
                          onClick={() => setMaterialReadyForQuiz(true)}
                          disabled={!readTimerDone}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            readTimerDone ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          I finished reading
                        </button>
                      </div>
                      <div className="mt-2 text-xs">
                        <a className="text-blue-600 hover:underline break-all" href={url} target="_blank" rel="noreferrer">
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  );
                }

                if (kind === 'url') {
                  return (
                    <div>
                      <iframe
                        title="Article Viewer"
                        src={url}
                        className="w-full h-[72vh] rounded-lg bg-white"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-600">
                          Read for a moment, then confirm when finished to unlock the quiz.
                        </div>
                        <button
                          onClick={() => setMaterialReadyForQuiz(true)}
                          disabled={!readTimerDone}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            readTimerDone ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          I finished reading
                        </button>
                      </div>
                      <div className="mt-2 text-xs">
                        <a className="text-blue-600 hover:underline break-all" href={url} target="_blank" rel="noreferrer">
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="text-sm text-gray-700">
                    Unsupported material type. You can still open the resource:
                    <div className="mt-2 text-sm">
                      <a className="text-blue-600 hover:underline break-all" href={url} target="_blank" rel="noreferrer">
                        {url}
                      </a>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => setMaterialReadyForQuiz(true)}
                        disabled={!readTimerDone}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                          readTimerDone ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        I finished
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setOpenMaterial(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setFinishedMaterialIds((prev) => (prev.includes(openMaterial.id) ? prev : [...prev, openMaterial.id]));
                  setOpenMaterial(null);

                  if (user?.email) {
                    void learningService.recordFinished(user.email, openMaterial.id);
                  }

                  beginQuizForMaterial(openMaterial);
                }}
                disabled={!materialReadyForQuiz && !finishedMaterialIds.includes(openMaterial.id)}
                className={`px-6 py-3 rounded-lg ${
                  materialReadyForQuiz || finishedMaterialIds.includes(openMaterial.id)
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <FlipCardQuizModal
        isOpen={showQuiz}
        moduleTitle={quizMaterial?.title || ''}
        questions={quizQuestions}
        passPercentage={50}
        onClose={handleCloseQuiz}
        onPass={handleQuizPass}
      />
    </div>
  );
};

export default LearningModules;
