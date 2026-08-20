import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Plus, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  getCommunityComments,
  getCommunityLikes,
  setCommunityComments,
  setCommunityLikes,
  type StoredCommunityComment,
} from '../communityEngagementStorage';

type Category = { id: string; name: string };

type Discussion = {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  likes: number;
  timeAgo: string;
  isHot: boolean;
  preview: string;
};

interface CommunityDiscussionsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  filteredDiscussions: Discussion[];
  getCategoryColor: (category: string) => string;
}

const CommunityDiscussions: React.FC<CommunityDiscussionsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  filteredDiscussions,
  getCategoryColor,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likedDiscussions, setLikedDiscussions] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, StoredCommunityComment[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const currentUserId = user?.email ?? '';
  const currentUserName = user?.fullName || user?.email || 'Anonymous';

  useEffect(() => {
    const nextLikedDiscussions: Record<number, boolean> = {};
    const nextLikeCounts: Record<number, number> = {};
    const nextComments: Record<number, StoredCommunityComment[]> = {};

    filteredDiscussions.forEach((discussion) => {
      const postId = discussion.id.toString();
      const savedLikes = getCommunityLikes(postId);
      const savedComments = getCommunityComments(postId);

      nextLikedDiscussions[discussion.id] = Boolean(
        currentUserId && savedLikes.some((like) => like.userId === currentUserId)
      );
      nextLikeCounts[discussion.id] = savedLikes.length;
      nextComments[discussion.id] = savedComments;
    });

    setLikedDiscussions(nextLikedDiscussions);
    setLikeCounts(nextLikeCounts);
    setComments(nextComments);
  }, [currentUserId, filteredDiscussions]);

  const getLikeCount = (discussion: Discussion) =>
    likeCounts[discussion.id] ?? 0;

  const getComments = (discussion: Discussion) => comments[discussion.id] ?? [];

  const handleLikeClick = (discussion: Discussion) => {
    if (!currentUserId) {
      alert('Please login to like a discussion');
      return;
    }

    const postId = discussion.id.toString();
    const savedLikes = getCommunityLikes(postId);
    const isLiked = Boolean(likedDiscussions[discussion.id]);
    const nextLiked = !isLiked;
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

    setCommunityLikes(postId, nextLikes);
    setLikedDiscussions((current) => ({ ...current, [discussion.id]: nextLiked }));
    setLikeCounts((current) => ({ ...current, [discussion.id]: nextLikes.length }));
  };

  const handleDeleteComment = (discussionId: number, commentId: string) => {
    const currentComments = comments[discussionId] ?? [];
    const commentToDelete = currentComments.find((comment) => comment.id === commentId);

    if (!commentToDelete || commentToDelete.userId !== currentUserId) {
      return;
    }

    const nextComments = currentComments.filter((comment) => comment.id !== commentId);

    setCommunityComments(discussionId.toString(), nextComments);
    setComments((current) => ({
      ...current,
      [discussionId]: nextComments,
    }));
  };

  const handleCommentToggle = (discussionId: number) => {
    setShowComments((current) => ({
      ...current,
      [discussionId]: !current[discussionId],
    }));
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>, discussionId: number) => {
    event.preventDefault();

    const draft = commentDrafts[discussionId]?.trim();
    if (!draft) return;

    if (!currentUserId) {
      alert('Please login to comment on a discussion');
      return;
    }

    const nextComments = [
      ...(comments[discussionId] ?? []),
      {
        id: `${discussionId}-${Date.now()}`,
        content: draft,
        author: currentUserName,
        userId: currentUserId,
        createdAt: new Date().toISOString(),
      },
    ];

    setCommunityComments(discussionId.toString(), nextComments);
    setComments((current) => ({
      ...current,
      [discussionId]: nextComments,
    }));
    setCommentDrafts((current) => ({
      ...current,
      [discussionId]: '',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Categories + Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
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

        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            onClick={() => navigate(`/community/${discussion.id}`)}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {discussion.avatar}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                      {discussion.title}
                      {discussion.isHot && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Hot
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">
                        by {discussion.author}
                      </span>

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          discussion.category
                        )}`}
                      >
                        {
                          categories.find(
                            (c) => c.id === discussion.category
                          )?.name
                        }
                      </span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-500">
                    {discussion.timeAgo}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {discussion.preview}
                </p>
              </div>
            </div>

            <div
              className="mt-4 border-t border-gray-100 pt-3"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <button
                  type="button"
                  onClick={() => handleLikeClick(discussion)}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors ${
                    likedDiscussions[discussion.id]
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'hover:bg-gray-100'
                  }`}
                  aria-pressed={Boolean(likedDiscussions[discussion.id])}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedDiscussions[discussion.id] ? 'fill-current text-red-500' : 'text-gray-400'
                    }`}
                  />
                  <span>
                    {getLikeCount(discussion)} {getLikeCount(discussion) === 1 ? 'Like' : 'Likes'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCommentToggle(discussion.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-gray-100 hover:text-primary-600"
                  aria-expanded={Boolean(showComments[discussion.id])}
                >
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span>
                    {getComments(discussion).length}{' '}
                    {getComments(discussion).length === 1 ? 'comment' : 'comments'}
                  </span>
                </button>
              </div>

              {showComments[discussion.id] && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3 space-y-2">
                  {getComments(discussion).map((comment) => (
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
                          onClick={() => handleDeleteComment(discussion.id, comment.id)}
                          className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <form
                    onSubmit={(event) => handleCommentSubmit(event, discussion.id)}
                    className="flex flex-col gap-2 sm:flex-row"
                  >
                    <input
                      type="text"
                      value={commentDrafts[discussion.id] ?? ''}
                      onChange={(event) =>
                        setCommentDrafts((current) => ({
                          ...current,
                          [discussion.id]: event.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                    <button
                      type="submit"
                      disabled={!commentDrafts[discussion.id]?.trim()}
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
        ))}
      </div>
    </div>
  );
};

export default CommunityDiscussions;
