import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityService } from '../../services/CommunityService';
import { useAuth } from '../../context/AuthContext';
import type { AdminDiscussionItem } from '../../interfaces/CommunityData';
import {
  getCommunityComments,
  setCommunityComments,
  type StoredCommunityComment,
} from './communityEngagementStorage';

const DiscussionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState<AdminDiscussionItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<StoredCommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const currentUserId = user?.email ?? '';
  const currentUserName = user?.fullName || user?.email || 'Anonymous';

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

        setDiscussion({
          ...details,
          likes: 0,
          replies: 0,
        });
      } catch (detailsError) {
        console.error('Error loading discussion details:', detailsError);

        try {
          const discussions = await communityService.getActiveDiscussions();
          const foundDiscussion = discussions.find((item) => item.id === id);

          if (!foundDiscussion) {
            throw new Error('Discussion not found.');
          }

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
          });
        } catch (fallbackError) {
          console.error('Fallback failed:', fallbackError);
          setError('Unable to load discussion details.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setComments(getCommunityComments(id));
  }, [id]);

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    if (!id) return;

    if (!currentUserId) {
      alert('Please login to comment on a discussion');
      return;
    }

    const nextComments = [
      ...comments,
      {
        id: `${discussion?.id ?? 'discussion'}-${Date.now()}`,
        content: trimmedComment,
        author: currentUserName,
        userId: currentUserId,
        createdAt: new Date().toISOString(),
      },
    ];

    setCommunityComments(id, nextComments);
    setComments(nextComments);
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!id) return;

    const commentToDelete = comments.find((comment) => comment.id === commentId);

    if (!commentToDelete || commentToDelete.userId !== currentUserId) {
      return;
    }

    const nextComments = comments.filter((comment) => comment.id !== commentId);

    setCommunityComments(id, nextComments);
    setComments(nextComments);
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

  if (!discussion) return null;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/community/discussions')}
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to discussions
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                {discussion.category}
              </span>
              <span>
                {discussion.createdAt
                  ? new Date(discussion.createdAt).toLocaleDateString()
                  : ''}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">
              {discussion.title}
            </h1>

            <p className="text-sm text-gray-600 mt-2">
              Posted by {discussion.author || 'Anonymous'}
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{discussion.content || 'No discussion content is available.'}</p>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setShowComments((isOpen) => !isOpen)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-600"
            aria-expanded={showComments}
          >
            <MessageCircle className="h-4 w-4 text-gray-400" />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </button>

          {showComments && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700">{comment.author}</p>
                    <p className="break-words text-sm text-gray-600">{comment.content}</p>
                  </div>
                  {comment.userId === currentUserId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete comment"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Add a comment..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  <span>Comment</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetails;
