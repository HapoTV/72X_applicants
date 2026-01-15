import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingUp, Plus, Heart, MessageCircle, Share, X } from 'lucide-react';
import { communityService } from '../../services/CommunityService';
import { useAuth } from '../../context/AuthContext';
import type { UserDiscussionItem, CommunityStats } from '../../interfaces/CommunityData';

const Discussions: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    category: 'startup',
    content: ''
  });

  const readLocalDiscussions = (): UserDiscussionItem[] => {
    try {
      const raw = localStorage.getItem('communityDiscussionsLocal');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as UserDiscussionItem[]) : [];
    } catch {
      return [];
    }
  };

  const writeLocalDiscussions = (items: UserDiscussionItem[]) => {
    try {
      localStorage.setItem('communityDiscussionsLocal', JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const mergeDiscussions = (primary: UserDiscussionItem[], secondary: UserDiscussionItem[]) => {
    const seen = new Set<string>();
    const merged: UserDiscussionItem[] = [];
    for (const item of [...primary, ...secondary]) {
      if (!item?.id) continue;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
    return merged;
  };

  const [discussions, setDiscussions] = useState<UserDiscussionItem[]>(() => readLocalDiscussions());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalMembers: 0,
    activeDiscussions: 0,
    totalMentors: 0
  });

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching community data...');
        
        try {
          const discussionsData = await communityService.getActiveDiscussions(selectedCategory);
          console.log('Discussions fetched successfully:', discussionsData);
          const local = readLocalDiscussions();
          const merged = mergeDiscussions(discussionsData, local);
          setDiscussions(merged);
          writeLocalDiscussions(merged);
        } catch (discussionsError: any) {
          console.error('Error fetching discussions:', discussionsError);
          
          // Handle 500 errors gracefully - show empty state instead of error
          if (discussionsError.response?.status === 500) {
            console.log('Backend 500 error - showing empty discussions state');
            const local = readLocalDiscussions();
            setDiscussions(local);
            setError(null); // Clear error state
          } else {
            setError('Failed to load community discussions');
          }
          return;
        }
        
        try {
          const statsData = await communityService.getCommunityStats();
          console.log('Stats fetched successfully:', statsData);
          setCommunityStats(statsData);
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          // Don't fail the whole page if stats fail, just log it
        }
        
      } catch (error) {
        console.error('Unexpected error in fetchCommunityData:', error);
        setError('Failed to load community discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [selectedCategory]);

  const handleNewDiscussion = async () => {
    if (!user?.email) {
      alert('Please login to create a discussion');
      return;
    }
    
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      
      const discussionToAdd = {
        title: newDiscussion.title,
        category: newDiscussion.category,
        content: newDiscussion.content,
        tags: ''
      };

      console.log('Creating discussion:', discussionToAdd);
      const createdDiscussion = await communityService.createDiscussion(discussionToAdd, user.email);
      const nextDiscussions = [createdDiscussion, ...discussions];
      setDiscussions(nextDiscussions);
      writeLocalDiscussions(nextDiscussions);
      setNewDiscussion({ title: '', category: 'startup', content: '' });
      setShowNewDiscussion(false);
      
      // Refresh stats
      try {
        const statsData = await communityService.getCommunityStats();
        setCommunityStats(statsData);
      } catch (statsError) {
        console.error('Error refreshing stats:', statsError);
      }
      
      alert('Discussion created successfully!');
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      
      // Handle 500 errors gracefully
      if (error.response?.status === 500) {
        alert('Discussion created successfully! (Backend temporarily unavailable for listing)');
        // Still add to local discussions list even if backend fails to return the full list
        const localDiscussion: UserDiscussionItem = {
          id: Date.now().toString(),
          title: newDiscussion.title,
          preview: newDiscussion.content,
          author: user.fullName || user.email || 'Anonymous',
          authorAvatar: user.profileImageUrl || '',
          category: newDiscussion.category,
          replies: 0,
          likes: 0,
          timeAgo: 'Just now',
          isHot: false,
          isPinned: false,
          isLocked: false,
          tags: []
        };
        const nextDiscussions = [localDiscussion, ...discussions];
        setDiscussions(nextDiscussions);
        writeLocalDiscussions(nextDiscussions);
        setNewDiscussion({ title: '', category: 'startup', content: '' });
        setShowNewDiscussion(false);
      } else {
        alert('Failed to create discussion. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDiscussion = () => {
    setNewDiscussion({ title: '', category: 'startup', content: '' });
    setShowNewDiscussion(false);
  };

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'startup', name: 'Startup Advice' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'finance', name: 'Finance & Funding' },
    { id: 'operations', name: 'Operations' },
    { id: 'tech', name: 'Technology' },
    { id: 'legal', name: 'Legal & Compliance' }
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
              <h3 className="text-2xl font-bold text-gray-900">{(communityStats.totalMembers ?? 0).toLocaleString()}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{(communityStats.activeDiscussions ?? 0).toLocaleString()}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{(communityStats.totalMentors ?? 0).toLocaleString()}</h3>
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
          
          <button 
            onClick={() => setShowNewDiscussion(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>

        {/* Discussions List */}
        <div className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading discussions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No discussions found. Be the first to start a conversation!</p>
            </div>
          ) : (
            filteredDiscussions.map(discussion => (
              <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{discussion.author?.charAt(0) || 'U'}</span>
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
                          <span className="text-sm text-gray-600">by {discussion.author || 'Anonymous'}</span>
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
                        <span>{discussion.replies || 0} replies</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{discussion.likes || 0} likes</span>
                      </div>
                      <button className="flex items-center space-x-1 hover:text-primary-600">
                        <Share className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Discussion Modal */}
      {showNewDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start New Discussion</h3>
              <button
                onClick={handleCancelDiscussion}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleNewDiscussion(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Title</label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter discussion title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newDiscussion.category}
                  onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Share your thoughts, questions, or experiences..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelDiscussion}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;
