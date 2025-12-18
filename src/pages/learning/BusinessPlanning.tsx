import React, { useState } from 'react';
import { Play, Clock, Star, BookOpen, CheckCircle, Lock, Award, Flame, Calendar } from 'lucide-react';
import CelebrationModal from '../../components/learning/CelebrationModal';
import QuizModal from '../../components/learning/QuizModal';
import QuizService from '../../services/QuizService';

const BusinessPlanning: React.FC = () => {
  const [completedModules] = useState(['1']);
  
  // Gamification states
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedModule, setCompletedModule] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  
  // Additional progress metrics
  const totalTimeSpent = 45; // minutes
  const learningStreak = 3; // days
  const certificatesEarned = 1;
  const lastAccessed = 'Today';

  // Gamification handlers
  const handleModuleCompletion = (module: any) => {
    if (module.progress === 100 && !completedModules.includes(module.id)) {
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
      setCompletedModules([...completedModules, completedModule.id]);
      
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

  // Original modules from LearningModules, filtered by business-plan category
  const allModules = [
    {
      id: '1',
      title: 'How to Create a Winning Business Plan',
      description: 'Learn to craft a comprehensive business plan that attracts investors and guides your growth.',
      category: 'business-plan',
      duration: '45 min',
      lessons: 8,
      difficulty: 'Beginner',
      rating: 4.8,
      students: 2340,
      isPremium: false,
      progress: 100,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Mastering Social Media Advertising',
      description: 'Advanced strategies for Facebook, Instagram, and LinkedIn advertising that drive real results.',
      category: 'marketing',
      duration: '1h 20min',
      lessons: 12,
      difficulty: 'Intermediate',
      rating: 4.9,
      students: 1890,
      isPremium: true,
      progress: 0,
      thumbnail: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Financial Planning for Small Business',
      description: 'Master budgeting, cash flow management, and financial forecasting for sustainable growth.',
      category: 'finance',
      duration: '55 min',
      lessons: 10,
      difficulty: 'Beginner',
      rating: 4.7,
      students: 3120,
      isPremium: false,
      progress: 100,
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Scaling Your Business Without Burning Out',
      description: 'Learn sustainable scaling strategies and build systems that work without your constant involvement.',
      category: 'operations',
      duration: '1h 10min',
      lessons: 9,
      difficulty: 'Advanced',
      rating: 4.9,
      students: 1560,
      isPremium: true,
      progress: 25,
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      title: 'Leadership Skills for Entrepreneurs',
      description: 'Develop essential leadership skills to inspire your team and drive business success.',
      category: 'leadership',
      duration: '50 min',
      lessons: 7,
      difficulty: 'Intermediate',
      rating: 4.6,
      students: 2100,
      isPremium: false,
      progress: 0,
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      title: 'Digital Marketing Fundamentals',
      description: 'Complete guide to SEO, content marketing, email campaigns, and analytics.',
      category: 'marketing',
      duration: '2h 15min',
      lessons: 15,
      difficulty: 'Beginner',
      rating: 4.8,
      students: 4200,
      isPremium: false,
      progress: 60,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Filter to show only business-plan category
  const modules = allModules.filter(m => m.category === 'business-plan');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
              const testModule = {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Planning</h1>
        <p className="text-gray-600">Master the essentials of planning and structuring your business</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {modules.filter(m => m.progress === 100).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {modules.filter(m => m.progress > 0 && m.progress < 100).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {modules.filter(m => m.progress === 0).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Not Started</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)}%` }}
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-xs text-gray-600">Time Spent</div>
              <div className="text-sm font-semibold text-gray-900">{totalTimeSpent} min</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-xs text-gray-600">Streak</div>
              <div className="text-sm font-semibold text-gray-900">{learningStreak} days</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <div>
              <div className="text-xs text-gray-600">Certificates</div>
              <div className="text-sm font-semibold text-gray-900">{certificatesEarned}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-xs text-gray-600">Last Accessed</div>
              <div className="text-sm font-semibold text-gray-900">{lastAccessed}</div>
            </div>
          </div>
        </div>

        {/* Estimated Time Remaining */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated Time Remaining</span>
            <span className="text-sm font-medium text-gray-900">
              {modules.filter(m => m.progress < 100).reduce((sum, m) => {
                const duration = parseInt(m.duration);
                return sum + (duration * (100 - m.progress) / 100);
              }, 0).toFixed(0)} min
            </span>
          </div>
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
              
              {completedModules.includes(module.id) && (
                <div className="absolute top-4 left-4">
                  <div className="p-1 bg-green-500 rounded-full">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                  {module.isPremium && module.progress === 0 ? (
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

              <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                {module.progress === 0 ? (
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

export default BusinessPlanning;
