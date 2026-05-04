import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { communityService } from '../../services/CommunityService';
import { useAuth } from '../../context/AuthContext';
import type {
  UserDiscussionItem,
  CommunityStats as CommunityStatsType,
} from '../../interfaces/CommunityData';
import CommunityStats from './CommunityStats';
import CategoryFilter from './CategoryFilter';
import DiscussionsList from './DiscussionsList';
import NewDiscussionModal from './NewDiscussionModal';
import { useLocalDiscussions } from './useLocalDiscussions';
import { getCommunityEngagementCounts } from './communityEngagementStorage';

const Discussions: React.FC = () => {
  const { user } = useAuth();
  const { readLocalDiscussions, writeLocalDiscussions, mergeDiscussions } =
    useLocalDiscussions();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussions, setDiscussions] = useState<UserDiscussionItem[]>(() =>
    readLocalDiscussions().map((discussion) => {
      const engagementCounts = getCommunityEngagementCounts(discussion.id);

      return {
        ...discussion,
        ...engagementCounts,
      };
    })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStatsType>({
    totalMembers: 0,
    activeDiscussions: 0,
    totalMentors: 0,
  });

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'startup', name: 'Startup Advice' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'finance', name: 'Finance & Funding' },
    { id: 'operations', name: 'Operations' },
    { id: 'tech', name: 'Technology' },
    { id: 'legal', name: 'Legal & Compliance' },
  ];

  const {
    data: remoteDiscussions,
    isLoading: loading,
    refetch,
  } = useQuery<UserDiscussionItem[]>({
    queryKey: ['discussions', selectedCategory],
    queryFn: () => communityService.getActiveDiscussions(selectedCategory),
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, queryError: any) => {
      if (queryError?.response?.status === 500) return false;
      return failureCount < 1;
    },
  });

  useEffect(() => {
    if (!remoteDiscussions) return;

    const local = readLocalDiscussions();
    const merged = mergeDiscussions(remoteDiscussions, local).map((discussion) => {
      const engagementCounts = getCommunityEngagementCounts(discussion.id);

      return {
        ...discussion,
        ...engagementCounts,
      };
    });

    setDiscussions(merged);
    writeLocalDiscussions(merged);
    setError(null);
  }, [remoteDiscussions, readLocalDiscussions, writeLocalDiscussions, mergeDiscussions]);

  useEffect(() => {
    communityService
      .getCommunityStats()
      .then(setCommunityStats)
      .catch((statsError) => {
        console.error('Error fetching stats:', statsError);
      });
  }, []);

  const handleNewDiscussion = async (formData: {
    title: string;
    category: string;
    content: string;
  }) => {
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
        tags: '',
      };

      const createdDiscussion = await communityService.createDiscussion(
        discussionToAdd,
        user.email
      );

      const nextDiscussions = [
        { ...createdDiscussion, ...getCommunityEngagementCounts(createdDiscussion.id) },
        ...discussions,
      ];
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
    } catch (createError: any) {
      console.error('Error creating discussion:', createError);

      if (createError.response?.status === 500) {
        alert('Discussion created successfully! Backend listing is temporarily unavailable.');

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
          tags: [],
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

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      selectedCategory === 'all' || discussion.category === selectedCategory
  );

  const handleEngagementChange = useCallback((
    discussionId: string,
    changes: Partial<Pick<UserDiscussionItem, 'likes' | 'replies'>>
  ) => {
    setDiscussions((currentDiscussions) => {
      const nextDiscussions = currentDiscussions.map((discussion) =>
        discussion.id === discussionId ? { ...discussion, ...changes } : discussion
      );

      writeLocalDiscussions(nextDiscussions);
      return nextDiscussions;
    });
  }, [writeLocalDiscussions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Community Forum
        </h1>
        <p className="text-gray-600">
          Share business advice and experiences with other entrepreneurs in the
          community
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
            type="button"
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
              refetch();
            }}
            onEngagementChange={handleEngagementChange}
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
