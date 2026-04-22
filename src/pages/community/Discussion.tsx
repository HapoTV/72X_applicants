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

const COMMUNITY_STATS_CACHE_KEY = 'communityStatsCache';

const Discussions: React.FC = () => {
  const { user } = useAuth();
  const { readLocalDiscussions, writeLocalDiscussions, mergeDiscussions } = useLocalDiscussions();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussions, setDiscussions] = useState<UserDiscussionItem[]>(() => readLocalDiscussions());
  const [loading, setLoading] = useState(() => readLocalDiscussions().length === 0);
  const [error, setError] = useState<string | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStatsType>(() => {
    try {
      const raw = localStorage.getItem(COMMUNITY_STATS_CACHE_KEY);
      if (!raw) {
        return {
          totalMembers: 0,
          activeDiscussions: 0,
          totalMentors: 0
        };
      }
      const parsed = JSON.parse(raw) as CommunityStatsType;
      return {
        totalMembers: parsed.totalMembers || 0,
        activeDiscussions: parsed.activeDiscussions || 0,
        totalMentors: parsed.totalMentors || 0,
        monthlyActiveUsers: parsed.monthlyActiveUsers,
        newMembersThisMonth: parsed.newMembersThisMonth,
        totalEvents: parsed.totalEvents,
        upcomingEvents: parsed.upcomingEvents,
      };
    } catch {
      return {
        totalMembers: 0,
        activeDiscussions: 0,
        totalMentors: 0
      };
    }
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

  const fetchCommunityData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [discussionsResult, statsResult] = await Promise.allSettled([
      communityService.getActiveDiscussions(selectedCategory),
      communityService.getCommunityStats()
    ]);

    if (discussionsResult.status === 'fulfilled') {
      const local = readLocalDiscussions();
      const merged = mergeDiscussions(discussionsResult.value, local)
        .map(adjustDiscussionReplyCount);

      setDiscussions(merged);
      writeLocalDiscussions(merged);
    } else {
      const local = readLocalDiscussions().map(adjustDiscussionReplyCount);

      if (local.length > 0) {
        setDiscussions(local);
      } else {
        setError('Failed to load community discussions');
      }
    }

    if (statsResult.status === 'fulfilled') {
      setCommunityStats(statsResult.value);
      localStorage.setItem(COMMUNITY_STATS_CACHE_KEY, JSON.stringify(statsResult.value));
    } else {
      console.error('Error fetching stats:', statsResult.reason);
    }

    setLoading(false);
  }, [
    selectedCategory,
    readLocalDiscussions,
    writeLocalDiscussions,
    mergeDiscussions,
    adjustDiscussionReplyCount
  ]);

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

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
              fetchCommunityData();
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
