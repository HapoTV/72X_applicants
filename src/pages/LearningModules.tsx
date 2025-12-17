import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Clock, Star, BookOpen, Lock } from 'lucide-react';
import { learningService } from '../services/LearningService';
import { useAuth } from '../context/AuthContext';
import type { UserLearningModule, LearningStats } from '../interfaces/LearningData';

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

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    module.isLocked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={module.isLocked}
                >
                  {module.isLocked ? 'Locked' : 'Start Learning'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      </div>
  );
};

export default LearningModules;
