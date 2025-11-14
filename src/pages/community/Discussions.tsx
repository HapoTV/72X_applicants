import React, { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Plus, Heart, MessageCircle, Share } from 'lucide-react';

const Discussions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'startup', name: 'Startup Advice' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'finance', name: 'Finance & Funding' },
    { id: 'operations', name: 'Operations' },
    { id: 'tech', name: 'Technology' },
    { id: 'legal', name: 'Legal & Compliance' }
  ];

  const discussions = [
    {
      id: 1,
      title: 'How to validate your business idea before investing?',
      author: 'Sarah Chen',
      avatar: 'SC',
      category: 'startup',
      replies: 23,
      likes: 45,
      timeAgo: '2 hours ago',
      isHot: true,
      preview: 'I have a SaaS idea but want to make sure there\'s real demand before building...'
    },
    {
      id: 2,
      title: 'Best practices for remote team management',
      author: 'Mike Rodriguez',
      avatar: 'MR',
      category: 'operations',
      replies: 18,
      likes: 32,
      timeAgo: '4 hours ago',
      isHot: false,
      preview: 'Our team has grown to 15 people, all remote. Looking for advice on...'
    },
    {
      id: 3,
      title: 'Funding options for early-stage startups in 2024',
      author: 'Jennifer Park',
      avatar: 'JP',
      category: 'finance',
      replies: 41,
      likes: 78,
      timeAgo: '6 hours ago',
      isHot: true,
      preview: 'With the current market conditions, what are the best funding options...'
    },
    {
      id: 4,
      title: 'Social media marketing on a tight budget',
      author: 'David Kim',
      avatar: 'DK',
      category: 'marketing',
      replies: 15,
      likes: 28,
      timeAgo: '8 hours ago',
      isHot: false,
      preview: 'We have less than R500/month for marketing. What strategies work best...',
    },
    {
      id: 5,
      title: 'Legal structure: LLC vs Corporation for tech startups',
      author: 'Amanda Foster',
      avatar: 'AF',
      category: 'legal',
      replies: 29,
      likes: 52,
      timeAgo: '1 day ago',
      isHot: false,
      preview: 'Trying to decide between LLC and C-Corp for my tech startup...'
    }
  ];

  type CategoryType = 'startup' | 'marketing' | 'finance' | 'operations' | 'tech' | 'legal' | string;
  
  const getCategoryColor = (category: CategoryType) => {
    const colors: Record<CategoryType, string> = {
      startup: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      finance: 'bg-purple-100 text-purple-800',
      operations: 'bg-orange-100 text-orange-800',
      tech: 'bg-indigo-100 text-indigo-800',
      legal: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredDiscussions = discussions.filter(discussion =>
    selectedCategory === 'all' || discussion.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Forum</h1>
        <p className="text-gray-600">Connect with fellow entrepreneurs, share experiences, and grow together</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">12,847</h3>
              <p className="text-gray-600 text-sm">Active Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">3,421</h3>
              <p className="text-gray-600 text-sm">Discussions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">156</h3>
              <p className="text-gray-600 text-sm">Expert Mentors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters and New Discussion Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>

        {/* Discussions List */}
        <div className="space-y-4 mt-6">
          {filteredDiscussions.map(discussion => (
            <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{discussion.avatar}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                        {discussion.title}
                        {discussion.isHot && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Hot
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">by {discussion.author}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(discussion.category)}`}>
                          {categories.find(c => c.id === discussion.category)?.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{discussion.preview}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{discussion.likes} likes</span>
                    </div>
                    <button className="flex items-center space-x-1 hover:text-primary-600">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discussions;
