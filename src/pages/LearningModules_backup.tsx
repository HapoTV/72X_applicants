import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Clock, Star, Award, BookOpen, CheckCircle, Lock, Download, ExternalLink } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule, LearningStats } from '../interfaces/LearningData';
import CelebrationModal from '../components/learning/CelebrationModal';
import QuizModal from '../components/learning/QuizModal';
import QuizService from '../services/QuizService';

const LearningModules: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>(searchParams.get('category') || 'business-plan');
  const [modules, setModules] = useState<UserLearningModule[]>([]);
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Gamification states
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedModule, setCompletedModule] = useState<UserLearningModule | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

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
      // If no user, set loading to false to show test button
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
      
      // Use the learning service to get modules for the user with category filter
      const filter = selectedCategory === 'all' ? undefined : { category: selectedCategory as any };
      const modulesData = await learningService.getUserModules(user.email, filter);
      setModules(modulesData);
      
      // Get learning stats
      const statsData = await learningService.getUserStats(user.email);
      setLearningStats(statsData);
      
    } catch (err) {
      setError('Failed to load learning materials');
      console.error('Error fetching learning data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLearningData = () => {
    fetchLearningData();
  };

  const handleModuleAction = async (moduleId: string, action: 'start' | 'continue' | 'review') => {
    if (!user?.email) return;

    try {
      // Find module to get resource information
      const module = modules.find(m => m.id === moduleId);
      
      // Check for module completion and trigger celebration
      if (module) {
        handleModuleCompletion(module);
      }
      
      if (module?.resourceUrl) {
        // For DOCUMENT types, download file
        if (module.type === 'DOCUMENT') {
          // Create a temporary link to download the file
          const link = document.createElement('a');
          link.href = module.resourceUrl;
          link.download = module.fileName || 'document';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
        
        // For other types with URLs, open in new tab
        window.open(module.resourceUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      // For interactive modules, navigate to module page
      console.log(`${action} module: ${moduleId}`);
      // TODO: Navigate to actual learning module page
      window.location.href = `/learning-modules/${moduleId}`;
    } catch (err) {
      console.error('Error starting learning session:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Gamification handlers
  const handleModuleCompletion = (module: UserLearningModule) => {
    if (module.progress === 100 && !module.isCompleted) {
      setCompletedModule(module);
      setShowCelebration(true);
      
      // Generate quiz questions for this module
      const questions = QuizService.generateQuizQuestions(
        module.title, 
        module.description, 
        module.category
      );
      setQuizQuestions(questions);
    }
  };

  const handleStartQuiz = () => {
    setShowCelebration(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setShowQuiz(false);
    
    // Update module completion status
    if (completedModule) {
      const updatedModules = modules.map(m => 
        m.id === completedModule.id 
          ? { ...m, isCompleted: true }
          : m
      );
      setModules(updatedModules);
      
      // Show success message
      const percentage = QuizService.calculateScorePercentage(score, totalQuestions);
      const message = QuizService.getPerformanceMessage(score, totalQuestions);
      
      alert(`${message} Score: ${score}/${totalQuestions} (${percentage}%)`);
    }
    
    setCompletedModule(null);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCompletedModule(null);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setCompletedModule(null);
  };

  if (!user?.email) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Test Button - Always visible */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-lg font-bold">🧪</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-orange-900 mb-1">Test Gamified Q&A System</h3>
                  <p className="text-sm text-orange-700">Simulate completing a Business Planning module to test celebration and quiz flow</p>
                </div>
              </div>
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Click to test complete flow
              </div>
            </div>
            <button
              onClick={() => {
                const testModule: UserLearningModule = {
                  id: 'test-bp-001',
                  title: 'Complete Business Planning Guide',
                  description: 'Master of fundamentals of business planning with this comprehensive guide covering strategy, financial planning, and operational excellence.',
                  category: 'business-plan',
                  duration: '45 min',
                  lessons: 8,
                  difficulty: 'Intermediate',
                  rating: 4.7,
                  students: 1250,
                  isPremium: false,
                  progress: 100,
                  thumbnail: 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400',
                  isCompleted: false,
                  isLocked: false,
                  type: 'ARTICLE',
                  resourceUrl: 'https://example.com/business-planning-guide'
                };
                handleModuleCompletion(testModule);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg text-base font-bold animate-bounce"
            >
              🎯 Test Business Planning Completion
            </button>
          </div>
        </div>

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
        {/* Test Button - Always visible */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-lg font-bold">🧪</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-orange-900 mb-1">Test Gamified Q&A System</h3>
                  <p className="text-sm text-orange-700">Simulate completing a Business Planning module to test celebration and quiz flow</p>
                </div>
              </div>
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Click to test complete flow
              </div>
            </div>
            <button
              onClick={() => {
                const testModule: UserLearningModule = {
                  id: 'test-bp-001',
                  title: 'Complete Business Planning Guide',
                  description: 'Master of fundamentals of business planning with this comprehensive guide covering strategy, financial planning, and operational excellence.',
                  category: 'business-plan',
                  duration: '45 min',
                  lessons: 8,
                  difficulty: 'Intermediate',
                  rating: 4.7,
                  students: 1250,
                  isPremium: false,
                  progress: 100,
                  thumbnail: 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400',
                  isCompleted: false,
                  isLocked: false,
                  type: 'ARTICLE',
                  resourceUrl: 'https://example.com/business-planning-guide'
                };
                handleModuleCompletion(testModule);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg text-base font-bold animate-bounce"
            >
              🎯 Test Business Planning Completion
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={refreshLearningData}
                className="text-red-700 hover:text-red-800 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Test Button - Always visible */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-lg font-bold">🧪</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-orange-900 mb-1">Test Gamified Q&A System</h3>
                <p className="text-sm text-orange-700">Simulate completing a Business Planning module to test celebration and quiz flow</p>
              </div>
            </div>
            <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Click to test complete flow
            </div>
          </div>
          <button
            onClick={() => {
              const testModule: UserLearningModule = {
                id: 'test-bp-001',
                title: 'Complete Business Planning Guide',
                description: 'Master of fundamentals of business planning with this comprehensive guide covering strategy, financial planning, and operational excellence.',
                category: 'business-plan',
                duration: '45 min',
                lessons: 8,
                difficulty: 'Intermediate',
                rating: 4.7,
                students: 1250,
                isPremium: false,
                progress: 100,
                thumbnail: 'https://images.unsplash.com/photo-1560473676-56e936e0f8b3?w=400',
                isCompleted: false,
                isLocked: false,
                type: 'ARTICLE',
                resourceUrl: 'https://example.com/business-planning-guide'
              };
              handleModuleCompletion(testModule);
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg text-base font-bold animate-bounce"
          >
            🎯 Test Business Planning Completion
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Interactive Learning Modules</h1>
        <p className="text-gray-600">Master essential business skills with our bite-sized, interactive courses</p>
      </div>

      {/* Progress Overview */}
      {learningStats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Learning Progress</h3>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                {learningStats.completedModules} modules completed
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${learningStats.totalProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{learningStats.totalProgress}%</span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={module.thumbnail} 
                alt={module.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {module.isPremium ? (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                    Premium
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                    Free
                  </span>
                )}
              </div>
              
              {module.isCompleted && (
                <div className="absolute top-4 left-4">
                  <div className="p-1 bg-green-500 rounded-full">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    const action = module.progress === 0 ? 'start' : 
                                 module.progress === 100 ? 'review' : 'continue';
                    handleModuleAction(module.id, action);
                  }}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  {module.isLocked ? (
                    <Lock className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{module.rating}</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessons} lessons</span>
                  </div>
                </div>
                <span>{module.students.toLocaleString()} students</span>
              </div>

              {module.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs text-gray-600">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  const action = module.progress === 0 ? 'start' : 
                               module.progress === 100 ? 'review' : 'continue';
                  handleModuleAction(module.id, action);
                }}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                {module.resourceUrl ? (
                  module.type === 'DOCUMENT' ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Resource</span>
                    </>
                  )
                ) : module.progress === 0 ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Learning</span>
                  </>
                ) : module.progress === 100 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Review</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later for new content.</p>
        </div>
      )}

      {/* Gamification Modals */}
      <CelebrationModal
        isOpen={showCelebration}
        moduleTitle={completedModule?.title || ''}
        onClose={handleCloseCelebration}
        onStartQuiz={handleStartQuiz}
      />

      <QuizModal
        isOpen={showQuiz}
        moduleTitle={completedModule?.title || ''}
        questions={quizQuestions}
        onClose={handleCloseQuiz}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};

export default LearningModules;
