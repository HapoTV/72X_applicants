import React, { useState } from 'react';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import CommunityDiscussions from './community/components/CommunityDiscussions';
import CommunityMentors from './community/components/CommunityMentors';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tabs = [
    { id: 'discussions', name: 'Discussions', icon: MessageSquare },
    { id: 'mentorship', name: 'Mentorship', icon: TrendingUp }
  ];

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
      preview: 'We have less than R500/month for marketing. What strategies work best...'
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

  const mentors = [
    {
      id: 1,
      name: 'Robert Johnson',
      title: 'Serial Entrepreneur & Investor',
      expertise: ['Startup Strategy', 'Fundraising', 'Scaling'],
      experience: '15+ years',
      companies: 'Founded 3 companies, 2 exits',
      rating: 4.9,
      sessions: 127,
      avatar: 'RJ'
    },
    {
      id: 2,
      name: 'Lisa Thompson',
      title: 'Marketing Director & Consultant',
      expertise: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking'],
      experience: '12+ years',
      companies: 'Ex-Google, Ex-Shopify',
      rating: 4.8,
      sessions: 89,
      avatar: 'LT'
    },
    {
      id: 3,
      name: 'Carlos Martinez',
      title: 'Operations & Finance Expert',
      expertise: ['Operations', 'Financial Planning', 'Process Optimization'],
      experience: '10+ years',
      companies: 'Ex-McKinsey, CFO at 2 startups',
      rating: 4.9,
      sessions: 156,
      avatar: 'CM'
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discussions' && (
            <CommunityDiscussions
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              filteredDiscussions={filteredDiscussions}
              getCategoryColor={getCategoryColor}
            />
          )}

          {activeTab === 'mentorship' && (
            <CommunityMentors mentors={mentors} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;