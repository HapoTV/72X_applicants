import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityService } from '../../services/CommunityService';
import type { AdminDiscussionItem, UserDiscussionItem } from '../../interfaces/CommunityData';

const DiscussionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<AdminDiscussionItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiscussion = async () => {
      if (!id) {
        setError('Invalid discussion selected.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await communityService.getDiscussionById(id);
        setDiscussion(details);
      } catch (detailsError) {
        console.error('Error loading discussion details by ID:', detailsError);

        try {
          const discussions = await communityService.getActiveDiscussions();
          const foundDiscussion = discussions.find((item) => item.id === id);

          if (foundDiscussion) {
            setDiscussion({
              id: foundDiscussion.id,
              title: foundDiscussion.title,
              content: foundDiscussion.preview,
              author: foundDiscussion.author,
              authorAvatar: foundDiscussion.authorAvatar,
              category: foundDiscussion.category,
              replies: foundDiscussion.replies,
              likes: foundDiscussion.likes,
              isHot: foundDiscussion.isHot,
              isPinned: foundDiscussion.isPinned,
              isLocked: foundDiscussion.isLocked,
              tags: foundDiscussion.tags,
              createdBy: foundDiscussion.author,
            });
          } else {
            throw new Error('Discussion not found from active discussions.');
          }
        } catch (fallbackError) {
          console.error('Fallback failed while loading discussion details:', fallbackError);
          setError('Unable to load discussion details.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <p className="text-gray-600">Loading discussion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/community/discussions')}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
        </button>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!discussion) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/community/discussions')}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                {discussion.category}
              </span>
              <span>{discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{discussion.title}</h1>
            <p className="text-sm text-gray-600 mt-2">
              Posted by {discussion.author || 'Anonymous'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="inline-flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{discussion.likes} likes</span>
            </div>
            <div className="inline-flex items-center gap-1">
              <span className="font-semibold">{discussion.replies}</span>
              replies
            </div>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{discussion.content || 'No discussion content is available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetails;
