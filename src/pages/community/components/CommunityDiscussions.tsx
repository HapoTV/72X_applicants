import React from 'react';
import { MessageCircle, Heart, Share, Plus } from 'lucide-react';

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
  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{discussion.avatar}</span>
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
                      <span className="text-sm text-gray-600">by {discussion.author}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          discussion.category,
                        )}`}
                      >
                        {categories.find((c) => c.id === discussion.category)?.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{discussion.preview}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{discussion.likes} likes</span>
                  </div>
                  <button className="flex items-center space-x-1 hover:text-primary-600">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDiscussions;
