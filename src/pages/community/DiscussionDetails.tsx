import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityService } from '../../services/CommunityService';
import { useAuth } from '../../context/AuthContext';
import type { AdminDiscussionItem, DiscussionReply } from '../../interfaces/CommunityData';

const DiscussionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState<AdminDiscussionItem | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const cleanDeletedReplies = (discussionId: string, fetchedReplies: DiscussionReply[]) => {
    const existing = readDeletedReplies(discussionId);
    const stillDeleted = existing.filter((replyId) => fetchedReplies.some((reply) => reply.replyId === replyId));
    if (stillDeleted.length !== existing.length) {
      saveDeletedReplies(discussionId, stillDeleted);
    }
    return stillDeleted;
  };

  const readLocalLike = (discussionId: string, userEmail: string) => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(getLocalLikeKey(discussionId, userEmail)) === 'true';
  };

  const saveLocalLike = (discussionId: string, userEmail: string, liked: boolean) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getLocalLikeKey(discussionId, userEmail), liked ? 'true' : 'false');
  };

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (!id) {
        setError('Invalid discussion selected.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await communityService.getDiscussionById(id);
        setDiscussion(details);
        setLikesCount(Math.max(0, details.likes ?? 0));
      } catch (detailsError) {
        console.error('Error loading discussion details by ID:', detailsError);

        try {
          const discussions = await communityService.getActiveDiscussions();
          const foundDiscussion = discussions.find((item) => item.id === id);

          if (foundDiscussion) {
            const fallbackDiscussion: AdminDiscussionItem = {
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
            };
            setDiscussion(fallbackDiscussion);
            setLikesCount(Math.max(0, foundDiscussion.likes ?? 0));
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

    const fetchReplies = async () => {
      if (!id) return;
      try {
        const fetchedReplies = await communityService.getDiscussionReplies(id);
        const deletedReplyIds = readDeletedReplies(id);
        const filteredReplies = fetchedReplies.filter((reply) => !deletedReplyIds.includes(reply.replyId));
        cleanDeletedReplies(id, fetchedReplies);

        setReplies(filteredReplies);
        saveLocalReplies(id, filteredReplies);
        setDiscussion((prev) => (prev ? { ...prev, replies: filteredReplies.length } : prev));
      } catch (repliesError) {
        console.error('Error loading replies:', repliesError);
        const localReplies = readLocalReplies(id);
        setReplies(localReplies);
        setDiscussion((prev) => (prev ? { ...prev, replies: localReplies.length } : prev));
      }
    };

    fetchDiscussion();
    fetchReplies();
  }, [id]);

  useEffect(() => {
    if (!id || !user?.email) {
      setIsLiked(false);
      return;
    }

    setIsLiked(readLocalLike(id, user.email));
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                {discussion.category}
              </span>
              <span>{discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString() : 'Today'}</span>

            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{discussion.title}</h1>
            <p className="text-sm text-gray-600 mt-2">Posted by {discussion.author || 'Anonymous'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isLiked ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
            <button
              type="button"
              onClick={handleFocusReply}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{discussion.content || 'No discussion content is available.'}</p>
        </div>
      </div>

      <div ref={replySectionRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <p className="text-sm text-gray-500">Share your insight or ask a follow-up question.</p>
          </div>
          <span className="text-sm text-gray-500">{replies.length} {replies.length === 1 ? 'comment' : 'comments'}</span>
        </div>

        <form onSubmit={handleAddReply} className="space-y-4">
          <div>
            <textarea
              ref={replyInputRef}
              rows={4}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Write a helpful comment or answer..."
              aria-label="Write a comment"
              disabled={isPostingReply}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">Your comment will appear below once posted.</p>
            <button
              type="submit"
              disabled={isPostingReply || commentText.trim().length === 0}
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPostingReply ? 'Posting...' : 'Post comment'}
              <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {replies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No comments yet. Be the first to add one.
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.replyId} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
                      {reply.author?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{reply.author || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">{reply.createdAt ? new Date(reply.createdAt).toLocaleString() : 'Just now'}</p>
                    </div>
                  </div>
                  {user?.email === reply.createdBy && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReply(reply.replyId)}
                      disabled={isDeletingReplyId === reply.replyId}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
                        isDeletingReplyId === reply.replyId
                          ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-red-600'
                      }`}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetails;
