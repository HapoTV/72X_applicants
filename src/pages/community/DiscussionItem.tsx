import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communityService } from '../../services/CommunityService';
import type { UserDiscussionItem } from '../../interfaces/CommunityData';

interface DiscussionItemProps {
  discussion: UserDiscussionItem;
  categoryColor: string;
  categoryName?: string;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({
  discussion,
  categoryColor,
  categoryName
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.max(0, discussion.likes ?? 0));
  const [isLiking, setIsLiking] = useState(false);

  const localStorageLikeKey = `discussion_like_${discussion.id}_${user?.email ?? 'guest'}`;

  useEffect(() => {
    setLikeCount(Math.max(0, discussion.likes ?? 0));
    if (user?.email) {
      setLiked(localStorage.getItem(localStorageLikeKey) === 'true');
    } else {
      setLiked(false);
    }
  }, [discussion.likes, localStorageLikeKey, user?.email]);

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!user?.email) {
      alert('Please login to like a discussion');
      return;
    }

    const nextLiked = !liked;
    const nextLikeCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikeCount(nextLikeCount);
    setIsLiking(true);

    try {
      // Save to local storage immediately (source of truth)
      localStorage.setItem(localStorageLikeKey, nextLiked ? 'true' : 'false');

      // Backend sync is best-effort - local storage is already updated
      if (nextLiked) {
        await communityService.likeDiscussion(discussion.id, user.email);
      } else {
        await communityService.unlikeDiscussion(discussion.id, user.email);
      }
      console.log('Like status updated successfully');
    } catch (error) {
      // Backend error is not critical since local storage is already updated
      console.warn('Backend like sync failed (local update succeeded):', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/community/discussions/${discussion.id}`)}
      role="button"
      tabIndex={0}
      onKeyPress={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          navigate(`/community/discussions/${discussion.id}`);
        }
      }}
    >
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{discussion.author?.charAt(0) || 'U'}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                {discussion.title}
                {discussion.isHot && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Hot
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">by {discussion.author || 'Anonymous'}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${categoryColor}`}>
                  {categoryName}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{discussion.preview}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLikeClick}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors ${
                  liked
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'hover:bg-gray-100'
                }`}
                disabled={isLiking}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
              </button>
              <div className="inline-flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{discussion.replies} replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionItem;
