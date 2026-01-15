import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Clock, Star, BookOpen, Lock, X } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule, LearningStats } from '../interfaces/LearningData';
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
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openMaterial, setOpenMaterial] = useState<UserLearningModule | null>(null);
  const [finishedMaterialIds, setFinishedMaterialIds] = useState<string[]>([]);
  const [quizPassedMaterialIds, setQuizPassedMaterialIds] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizMaterial, setQuizMaterial] = useState<UserLearningModule | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

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
    const questions = QuizService.generateQuizQuestions(material.title, material.description || '', material.category);
    console.log(
      'Generated quiz questions:',
      questions.length,
      questions.map((q) => ({ id: q.id, type: (q as any).type }))
    );
    setQuizQuestions(questions);
    setQuizMaterial(material);
    setShowQuiz(true);
  };

  const handleQuizPass = (score: number, totalQuestions: number, percentage: number) => {
    setShowQuiz(false);

    if (quizMaterial) {
      setQuizPassedMaterialIds((prev) => (prev.includes(quizMaterial.id) ? prev : [...prev, quizMaterial.id]));
      const message = QuizService.getPerformanceMessage(score, totalQuestions);
      alert(`${message} Score: ${score}/${totalQuestions} (${percentage}%)`);
    }

    setQuizMaterial(null);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setQuizMaterial(null);
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
      const filter = { category: selectedCategory };
      const modulesData = await learningService.getUserModules(user.email, filter);
      console.log('Fetched modules:', modulesData);
      setModules(modulesData);
      const statsData = await learningService.getUserStats(user.email);
      setLearningStats(statsData);
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
                  {modules.filter(m => m.progress === 100).length}
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
                  {modules.filter(m => m.progress > 0 && m.progress < 100).length}
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
                  setOpenMaterial(demoMaterial);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 text-sm font-semibold"
              >
                Preview Quiz Gate
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img src={module.thumbnail} alt={module.title} className="w-full h-48 object-cover" />
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
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-sm font-semibold text-blue-900">{gateText}</div>
                        </div>
                      )}

                      <button
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          module.isLocked || isLocked || finishedMaterialIds.includes(module.id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={module.isLocked || isLocked || finishedMaterialIds.includes(module.id)}
                        onClick={() => setOpenMaterial(module)}
                      >
                        {module.isLocked || isLocked || finishedMaterialIds.includes(module.id) ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              <div className="text-sm text-gray-700">
                This is a placeholder viewer. In production you would render:
              </div>
              <div className="mt-3 text-sm text-gray-700">
                - PDFs in an embedded PDF viewer
              </div>
              <div className="text-sm text-gray-700">- Videos in a video player</div>
              <div className="text-sm text-gray-700">- Articles/URLs in an in-app reader</div>
              {openMaterial.resourceUrl && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Resource:</span>{' '}
                  <a
                    className="text-blue-600 hover:underline break-all"
                    href={openMaterial.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {openMaterial.resourceUrl}
                  </a>
                </div>
              )}
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
                  beginQuizForMaterial(openMaterial);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Mark as Finished → Take Quiz
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
