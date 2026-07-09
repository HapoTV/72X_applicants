import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserDiscussionItem } from '../../interfaces/CommunityData';
import {
  getCommunityComments,
  getCommunityLikes,
  setCommunityComments,
  setCommunityLikes,
  type StoredCommunityComment,
} from './communityEngagementStorage';

interface DiscussionItemProps {
  discussion: UserDiscussionItem;
  categoryColor: string;
  categoryName?: string;
  onEngagementChange?: (discussionId: string, changes: Partial<Pick<UserDiscussionItem, 'likes' | 'replies'>>) => void;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({
  discussion,
  categoryColor,
  categoryName,
  onEngagementChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<StoredCommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const currentUserId = user?.email ?? '';
  const currentUserName = user?.fullName || user?.email || 'Anonymous';

  useEffect(() => {
    const savedLikes = getCommunityLikes(discussion.id);
    const savedComments = getCommunityComments(discussion.id);

    setLikeCount(savedLikes.length);
    setLiked(Boolean(currentUserId && savedLikes.some((like) => like.userId === currentUserId)));
    setComments(savedComments);
  }, [currentUserId, discussion.id]);

  const handleLikeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!currentUserId) {
      alert('Please login to like a discussion');
      return;
    }

    const savedLikes = getCommunityLikes(discussion.id);
    const nextLiked = !liked;
    const nextLikes = nextLiked
      ? [
          ...savedLikes.filter((like) => like.userId !== currentUserId),
          {
            userId: currentUserId,
            userName: currentUserName,
            createdAt: new Date().toISOString(),
          },
        ]
      : savedLikes.filter((like) => like.userId !== currentUserId);

    setCommunityLikes(discussion.id, nextLikes);
    setLiked(nextLiked);
    setLikeCount(nextLikes.length);
    onEngagementChange?.(discussion.id, { likes: nextLikes.length });
  };

  const handleDeleteComment = (commentId: string) => {
    const commentToDelete = comments.find((comment) => comment.id === commentId);

    if (!commentToDelete || commentToDelete.userId !== currentUserId) {
      return;
    }

    const nextComments = comments.filter((comment) => comment.id !== commentId);

    setCommunityComments(discussion.id, nextComments);
    setComments(nextComments);
    onEngagementChange?.(discussion.id, { replies: nextComments.length });
  };

  const handleCommentToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowComments((isOpen) => !isOpen);
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    if (!user?.email) {
      alert('Please login to comment on a discussion');
      return;
    }

    const nextComments = [
      ...comments,
      {
        id: `${discussion.id}-${Date.now()}`,
        content: trimmedComment,
        author: currentUserName,
        userId: currentUserId,
        createdAt: new Date().toISOString(),
      },
    ];

    setCommunityComments(discussion.id, nextComments);
    setComments(nextComments);
    setCommentText('');
    onEngagementChange?.(discussion.id, { replies: nextComments.length });
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/community/${discussion.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navigate(`/community/${discussion.id}`);
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {discussion.author?.charAt(0) || 'U'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 text-base">
                {discussion.title}
                {discussion.isHot && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-[10px] rounded-full">
                    Hot
                  </span>
                )}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                <span>
                  by {discussion.author || 'Anonymous'}
                </span>

                {categoryName && (
                  <span className={`px-2 py-1 rounded-full ${categoryColor}`}>
                    {categoryName}
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs text-gray-500">
              {discussion.timeAgo}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
            {discussion.preview}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-100 pt-2" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={handleLikeClick}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors ${
              liked
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'hover:bg-gray-100'
            }`}
            aria-pressed={liked}
          >
            <Heart
              className={`w-4 h-4 ${
                liked ? 'fill-current text-red-500' : 'text-gray-400'
              }`}
            />
            <span>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCommentToggle}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-gray-100 hover:text-primary-600"
            aria-expanded={showComments}
          >
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-2 rounded-lg bg-gray-50 p-2 space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-white px-2 py-1"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-gray-700">{comment.author}</p>
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
                onClick={(event) => event.stopPropagation()}
                placeholder="Add a comment..."
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
  );
};

export default DiscussionItem;
