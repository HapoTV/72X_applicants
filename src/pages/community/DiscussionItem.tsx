import React from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
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
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{discussion.author?.charAt(0) || 'U'}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
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

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{discussion.replies || 0} replies</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{discussion.likes || 0} likes</span>
            </div>
            <button className="flex items-center space-x-1 hover:text-primary-600">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionItem;