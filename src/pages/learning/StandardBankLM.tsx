import React, { useState } from 'react';
import { Play, Clock, BookOpen, CheckCircle, Lock, Award, Flame } from 'lucide-react';

const StandardBankLM: React.FC = () => {
  const [completedModules] = useState(['1']);
  
  // Additional progress metrics
  const totalTimeSpent = 30; // minutes
  const learningStreak = 2; // days
  const certificatesEarned = 0;

  const allModules = [
    { id: '1', title: 'Introduction to StandardBank LM', description: 'Get started with StandardBank Learning Management basics', category: 'standardbank', duration: '30 min', lessons: 5, difficulty: 'Beginner', rating: 4.8, students: 1500, isPremium: false, progress: 100, thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', title: 'Advanced Banking Operations', description: 'Master complex banking operations and workflows', category: 'standardbank', duration: '45 min', lessons: 8, difficulty: 'Advanced', rating: 4.7, students: 800, isPremium: true, progress: 0, thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', title: 'Customer Service Excellence', description: 'Enhance your customer service skills for banking', category: 'standardbank', duration: '40 min', lessons: 6, difficulty: 'Intermediate', rating: 4.9, students: 1200, isPremium: false, progress: 0, thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const modules = allModules.filter(m => m.category === 'standardbank');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div><h1 className="text-2xl font-bold text-gray-900 mb-2">StandardBank</h1><p className="text-gray-600">Master banking operations and customer service excellence with StandardBank Learning Management</p></div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-xl font-semibold text-gray-900">{totalTimeSpent}m</p>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Learning Streak</p>
              <p className="text-xl font-semibold text-gray-900">{learningStreak} days</p>
            </div>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">{completedModules.length}/{modules.length}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certificates</p>
              <p className="text-xl font-semibold text-gray-900">{certificatesEarned}</p>
            </div>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video w-full h-32 bg-gray-200 flex items-center justify-center relative">
              <BookOpen className="w-8 h-8 text-gray-400" />
              {module.isPremium && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Premium</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{module.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {module.lessons} lessons
                </span>
                <span>{module.duration}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {module.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{module.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({module.students} students)</span>
                </div>
              </div>

              {/* Progress Bar */}
              {module.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${module.progress}%` }}></div>
                  </div>
                </div>
              )}

              <button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                completedModules.includes(module.id) 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : module.isPremium 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {completedModules.includes(module.id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                ) : module.isPremium ? (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Upgrade to Access
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Learning
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardBankLM;
