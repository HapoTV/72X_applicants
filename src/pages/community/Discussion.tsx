import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
=======
  const [loading, setLoading] = useState(() => readLocalDiscussions().length === 0);
>>>>>>> 511f5bf (Fix community flows and improve page responsiveness)
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

  const {
    data: remoteDiscussions,
    isLoading: loading,
  } = useQuery<UserDiscussionItem[]>({
    queryKey: ['discussions', selectedCategory],
    queryFn: () => communityService.getActiveDiscussions(selectedCategory),
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 500) return false;
      return failureCount < 1;
    },
  });

<<<<<<< HEAD
  // Sync remote discussions into local state, merging with locally-created ones
  useEffect(() => {
    if (remoteDiscussions) {
      const local = readLocalDiscussions();
      const merged = mergeDiscussions(remoteDiscussions, local);
      setDiscussions(merged);
      writeLocalDiscussions(merged);
      setError(null);
=======
  const adjustDiscussionReplyCount = useCallback((discussion: UserDiscussionItem) => {
    const deletedCount = getDeletedReplyCount(discussion.id);
    return {
      ...discussion,
      replies: Math.max(0, discussion.replies - deletedCount)
    };
  }, [getDeletedReplyCount]);

<<<<<<< HEAD
  const resetDiscussionEngagement = useCallback((discussion: UserDiscussionItem): UserDiscussionItem => {
    try {
      localStorage.removeItem(`discussion_replies_${discussion.id}`);
      localStorage.removeItem(`discussion_deleted_replies_${discussion.id}`);
    } catch {
      // ignore local reset issues
    }

    return {
      ...discussion,
      likes: 0,
      replies: 0
    };
  }, []);

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
        .map(adjustDiscussionReplyCount)
        .map(resetDiscussionEngagement);

      setDiscussions(merged);
      writeLocalDiscussions(merged);
    } else {
      const local = readLocalDiscussions()
        .map(adjustDiscussionReplyCount)
        .map(resetDiscussionEngagement);

      if (local.length > 0) {
        setDiscussions(local);
        writeLocalDiscussions(local);
      } else {
        setError('Failed to load community discussions');
      }
>>>>>>> de53e04 (Reset community likes and comments)
    }
  }, [remoteDiscussions]);

<<<<<<< HEAD
  // Fetch community stats separately (not cached — lightweight)
=======
=======
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

>>>>>>> 511f5bf (Fix community flows and improve page responsiveness)
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
    adjustDiscussionReplyCount,
    resetDiscussionEngagement
  ]);

<<<<<<< HEAD
>>>>>>> de53e04 (Reset community likes and comments)
  useEffect(() => {
    communityService.getCommunityStats()
      .then(setCommunityStats)
      .catch((err) => console.error('Error fetching stats:', err));
  }, [selectedCategory]);
=======
  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);
>>>>>>> 511f5bf (Fix community flows and improve page responsiveness)

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
      setIsSubmitting(true);

      const discussionToAdd = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags: ''
      };

      console.log('Creating discussion:', discussionToAdd);
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
      console.error('Error creating discussion:', error);

      if (error.response?.status === 500) {
        alert('Discussion created successfully! (Backend temporarily unavailable for listing)');
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
      } else {
        alert('Failed to create discussion. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    selectedCategory === 'all' || discussion.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Forum</h1>
        <p className="text-gray-600">Share business advice and experiences with other entrepreneurs in the community</p>
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
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Discussions;
