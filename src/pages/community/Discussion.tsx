import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { communityService } from '../../services/CommunityService';
import { useAuth } from '../../context/AuthContext';
import type { UserDiscussionItem, CommunityStats as CommunityStatsType } from '../../interfaces/CommunityData';
import CommunityStats from './CommunityStats';
import CategoryFilter from './CategoryFilter';
import DiscussionsList from './DiscussionsList';
import NewDiscussionModal from './NewDiscussionModal';
import { useLocalDiscussions } from './useLocalDiscussions';

const Discussions: React.FC = () => {
  const { user } = useAuth();
  const { readLocalDiscussions, writeLocalDiscussions, mergeDiscussions } = useLocalDiscussions();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussions, setDiscussions] = useState<UserDiscussionItem[]>(() => readLocalDiscussions());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStatsType>({
    totalMembers: 0,
    activeDiscussions: 0,
    totalMentors: 0
  });

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'startup', name: 'Startup Advice' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'finance', name: 'Finance & Funding' },
    { id: 'operations', name: 'Operations' },
    { id: 'tech', name: 'Technology' },
    { id: 'legal', name: 'Legal & Compliance' }
  ];

  const getDeletedReplyCount = useCallback((discussionId: string) => {
    try {
      const raw = localStorage.getItem(`discussion_deleted_replies_${discussionId}`);
      if (!raw) return 0;
      const ids = JSON.parse(raw) as string[];
      return Array.isArray(ids) ? ids.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const adjustDiscussionReplyCount = useCallback((discussion: UserDiscussionItem) => {
    const deletedCount = getDeletedReplyCount(discussion.id);
    return {
      ...discussion,
      replies: Math.max(0, discussion.replies - deletedCount)
    };
  }, [getDeletedReplyCount]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const discussionsData = await communityService.getActiveDiscussions(selectedCategory);
          const local = readLocalDiscussions();

          const merged = mergeDiscussions(discussionsData, local)
            .map(adjustDiscussionReplyCount);

          setDiscussions(merged);
          writeLocalDiscussions(merged);
        } catch (discussionsError: any) {
          if (discussionsError.response?.status === 500) {
            const local = readLocalDiscussions().map(adjustDiscussionReplyCount);
            setDiscussions(local);
            setError(null);
          } else {
            setError('Failed to load community discussions');
          }
          return;
        }

        try {
          const statsData = await communityService.getCommunityStats();
          setCommunityStats(statsData);
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
        }

      } catch (error) {
        setError('Failed to load community discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [
    selectedCategory,
    readLocalDiscussions,
    writeLocalDiscussions,
    mergeDiscussions,
    adjustDiscussionReplyCount
  ]);

  const handleNewDiscussion = async (formData: { title: string; category: string; content: string }) => {
    if (!user?.email) {
      alert('Please login to create a discussion');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);

      const discussionToAdd = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags: ''
      };

      const createdDiscussion = await communityService.createDiscussion(discussionToAdd, user.email);
      const nextDiscussions = [createdDiscussion, ...discussions];

      setDiscussions(nextDiscussions);
      writeLocalDiscussions(nextDiscussions);
      setShowNewDiscussion(false);

      try {
        const statsData = await communityService.getCommunityStats();
        setCommunityStats(statsData);
      } catch (statsError) {
        console.error('Error refreshing stats:', statsError);
      }

      alert('Discussion created successfully!');
    } catch (error: any) {
      if (error.response?.status === 500) {
        const localDiscussion: UserDiscussionItem = {
          id: Date.now().toString(),
          title: formData.title,
          preview: formData.content,
          author: user.fullName || user.email || 'Anonymous',
          authorAvatar: user.profileImageUrl || '',
          category: formData.category,
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
        setShowNewDiscussion(false);

        alert('Discussion created successfully! (Offline mode)');
      } else {
        alert('Failed to create discussion. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    selectedCategory === 'all' || discussion.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Forum</h1>
        <p className="text-gray-600">
          Share business advice and experiences with other entrepreneurs in the community
        </p>
      </div>

      <CommunityStats stats={communityStats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <button
            onClick={() => setShowNewDiscussion(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Business Advice</span>
          </button>
        </div>

        <div className="mt-6">
          <DiscussionsList
            discussions={filteredDiscussions}
            categories={categories}
            loading={loading}
            error={error}
            onRetry={() => {
              setError(null);
              window.location.reload();
            }}
          />
        </div>
      </div>

      <NewDiscussionModal
        isOpen={showNewDiscussion}
        categories={categories}
        onSubmit={handleNewDiscussion}
        onCancel={() => setShowNewDiscussion(false)}
        isLoading={loading}
      />
    </div>
  );
};

export default Discussions;