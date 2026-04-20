import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityService } from '../../services/CommunityService';
import type { AdminDiscussionItem } from '../../interfaces/CommunityData';

const DiscussionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<AdminDiscussionItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
=======
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [isDeletingReplyId, setIsDeletingReplyId] = useState<string | null>(null);

  const replySectionRef = useRef<HTMLDivElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const getLocalLikeKey = (discussionId: string, userEmail: string) => `discussion_like_${discussionId}_${userEmail}`;
  const getLocalReplyKey = (discussionId: string) => `discussion_replies_${discussionId}`;

  const readLocalReplies = (discussionId: string) => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem(getLocalReplyKey(discussionId));
    try {
      return saved ? (JSON.parse(saved) as DiscussionReply[]) : [];
    } catch {
      return [];
    }
  };

  const saveLocalReplies = (discussionId: string, items: DiscussionReply[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getLocalReplyKey(discussionId), JSON.stringify(items));
  };

  const getDeletedReplyKey = (discussionId: string) => `discussion_deleted_replies_${discussionId}`;

  const readDeletedReplies = (discussionId: string) => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem(getDeletedReplyKey(discussionId));
    try {
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  };

  const saveDeletedReplies = (discussionId: string, ids: string[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getDeletedReplyKey(discussionId), JSON.stringify(ids));
  };

  const addDeletedReply = (discussionId: string, replyId: string) => {
    const existing = readDeletedReplies(discussionId);
    const next = Array.from(new Set([...existing, replyId]));
    saveDeletedReplies(discussionId, next);
  };

  const saveLocalLike = (discussionId: string, userEmail: string, liked: boolean) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getLocalLikeKey(discussionId, userEmail), liked ? 'true' : 'false');
  };
>>>>>>> de53e04 (Reset community likes and comments)

  const clearDiscussionEngagement = (discussionId: string, userEmail?: string) => {
    if (typeof window === 'undefined') return;

    window.localStorage.removeItem(getLocalReplyKey(discussionId));
    window.localStorage.removeItem(getDeletedReplyKey(discussionId));

    if (userEmail) {
      window.localStorage.removeItem(getLocalLikeKey(discussionId, userEmail));
    }
  };

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
<<<<<<< HEAD
        setDiscussion(details);
<<<<<<< HEAD
=======
        setDiscussion({
          ...details,
          likes: 0,
          replies: 0
        });
        setLikesCount(0);
>>>>>>> de53e04 (Reset community likes and comments)
=======
        setLikesCount(Math.max(0, details.likes ?? 0));
>>>>>>> 511f5bf (Fix community flows and improve page responsiveness)
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
              replies: 0,
              likes: 0,
              isHot: foundDiscussion.isHot,
              isPinned: foundDiscussion.isPinned,
              isLocked: foundDiscussion.isLocked,
              tags: foundDiscussion.tags,
              createdBy: foundDiscussion.author,
<<<<<<< HEAD
            });
=======
            };
            setDiscussion(fallbackDiscussion);
<<<<<<< HEAD
            setLikesCount(0);
>>>>>>> de53e04 (Reset community likes and comments)
=======
            setLikesCount(Math.max(0, foundDiscussion.likes ?? 0));
>>>>>>> 511f5bf (Fix community flows and improve page responsiveness)
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

<<<<<<< HEAD
    loadDiscussion();
  }, [id]);

=======
    const fetchReplies = async () => {
      if (!id) return;
      try {
        await communityService.getDiscussionReplies(id);
        clearDiscussionEngagement(id, user?.email);
        setReplies([]);
        saveLocalReplies(id, []);
        setDiscussion((prev) => (prev ? { ...prev, replies: 0 } : prev));
      } catch (repliesError) {
        console.error('Error loading replies:', repliesError);
        clearDiscussionEngagement(id, user?.email);
        setReplies([]);
        saveLocalReplies(id, []);
        setDiscussion((prev) => (prev ? { ...prev, replies: 0 } : prev));
      }
    };

    fetchDiscussion();
    fetchReplies();
  }, [id, user?.email]);

  useEffect(() => {
    if (!id || !user?.email) {
      setIsLiked(false);
      return;
    }

    clearDiscussionEngagement(id, user.email);
    setIsLiked(false);
  }, [id, user?.email]);

  const handleToggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!id) return;
    if (!user?.email) {
      alert('Please login to like this advice.');
      return;
    }

    const nextLiked = !isLiked;
    const nextLikesCount = Math.max(0, likesCount + (nextLiked ? 1 : -1));

    setIsLiked(nextLiked);
    setLikesCount(nextLikesCount);
    setDiscussion((prev) => (
      prev
        ? { ...prev, likes: Math.max(0, (prev.likes ?? 0) + (nextLiked ? 1 : -1)) }
        : prev
    ));
    setIsLiking(true);

    try {
      // Save to local storage immediately (source of truth)
      saveLocalLike(id, user.email, nextLiked);

      // Backend sync is best-effort - local storage is already updated
      if (nextLiked) {
        await communityService.likeDiscussion(id, user.email);
      } else {
        await communityService.unlikeDiscussion(id, user.email);
      }
      console.log('Like status updated successfully');
    } catch (likeError) {
      // Backend error is not critical since local storage is already updated
      console.warn('Backend like sync failed (local update succeeded):', likeError);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFocusReply = () => {
    replySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    replyInputRef.current?.focus();
  };

  const handleAddReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    if (!user?.email) {
      alert('Please login to post a comment.');
      return;
    }

    const trimmedContent = commentText.trim();
    if (!trimmedContent) return;

    const optimisticReply: DiscussionReply = {
      replyId: `local-${Date.now()}`,
      discussionId: id,
      content: trimmedContent,
      author: user.fullName || user.email || 'Anonymous',
      authorAvatar: user.profileImageUrl || undefined,
      likes: 0,
      isAnswer: false,
      createdAt: new Date().toISOString(),
      createdBy: user.email,
    };

    setReplies((previousReplies) => {
      const nextReplies = [optimisticReply, ...previousReplies];
      saveLocalReplies(id, nextReplies);
      return nextReplies;
    });

    setDiscussion((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : prev));
    setCommentText('');
    setIsPostingReply(true);

    try {
      const savedReply = await communityService.addReply(id, { content: trimmedContent, isAnswer: false }, user.email);
      setReplies((previousReplies) => {
        const nextReplies = previousReplies.map((reply) =>
          reply.replyId === optimisticReply.replyId ? savedReply : reply
        );
        saveLocalReplies(id, nextReplies);
        return nextReplies;
      });
    } catch (replyError) {
      console.error('Error posting reply:', replyError);
      setReplies((previousReplies) => {
        const nextReplies = previousReplies.filter((reply) => reply.replyId !== optimisticReply.replyId);
        saveLocalReplies(id, nextReplies);
        return nextReplies;
      });
      setDiscussion((prev) => (prev ? { ...prev, replies: Math.max(prev.replies - 1, 0) } : prev));
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!id) return;
    if (!user?.email) {
      alert('Please login to delete a comment.');
      return;
    }

    const confirmed = window.confirm('Delete this comment? This action cannot be undone.');
    if (!confirmed) return;

    const existingReply = replies.find((reply) => reply.replyId === replyId);
    if (!existingReply) return;

    // Prevent duplicate deletion attempts
    if (isDeletingReplyId) return;
    setIsDeletingReplyId(replyId);

    // Optimistically remove from UI and local storage
    setReplies((previousReplies) => {
      const nextReplies = previousReplies.filter((reply) => reply.replyId !== replyId);
      saveLocalReplies(id, nextReplies);
      return nextReplies;
    });
    setDiscussion((prev) => (prev ? { ...prev, replies: Math.max(prev.replies - 1, 0) } : prev));
    addDeletedReply(id, replyId);

    try {
      await communityService.deleteReply(id, replyId, user.email);
      console.log('Comment deleted successfully');
    } catch (deleteError) {
      console.warn('Backend deletion failed (comment still hidden locally):', deleteError);
    } finally {
      setIsDeletingReplyId(null);
    }
  };

>>>>>>> de53e04 (Reset community likes and comments)
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
