import React, { useState, useEffect } from 'react';
import { Play, Clock, Star, Award, BookOpen, CheckCircle, Lock } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule, LearningStats, LearningModuleFilter } from '../interfaces/LearningData';

const LearningModules: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [modules, setModules] = useState<UserLearningModule[]>([]);
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Modules' },
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
      
      const filter: LearningModuleFilter = {
        category: selectedCategory === 'all' ? undefined : selectedCategory as any
      };
      
      const [modulesData, statsData] = await Promise.all([
        learningService.getUserModules(user.email, filter),
        learningService.getLearningStats(user.email)
      ]);
      
      setModules(modulesData);
      setLearningStats(statsData);
    } catch (err) {
      setError('Failed to load learning modules');
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
      // Start a learning session
      await learningService.startSession(user.email, moduleId);
      
      // Navigate to module or start learning (implementation depends on your routing)
      console.log(`${action} module: ${moduleId}`);
      // TODO: Navigate to the actual learning module page
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
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
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

      {modules.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later for new content.</p>
        </div>
      )}
    </div>
  );
};

export default LearningModules;