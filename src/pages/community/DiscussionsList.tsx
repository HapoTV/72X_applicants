import React from 'react';
import DiscussionItem from './DiscussionItem';
import type { UserDiscussionItem } from '../../interfaces/CommunityData';

interface Category {
  id: string;
  name: string;
}

interface DiscussionsListProps {
  discussions: UserDiscussionItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    startup: 'bg-blue-100 text-blue-800',
    marketing: 'bg-green-100 text-green-800',
    finance: 'bg-purple-100 text-purple-800',
    operations: 'bg-orange-100 text-orange-800',
    tech: 'bg-indigo-100 text-indigo-800',
    legal: 'bg-red-100 text-red-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const DiscussionsList: React.FC<DiscussionsListProps> = ({
  discussions,
  categories,
  loading,
  error,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading discussions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No discussions found. Be the first to start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map(discussion => {
        const category = categories.find(c => c.id === discussion.category);
        return (
          <DiscussionItem
            key={discussion.id}
            discussion={discussion}
            categoryColor={getCategoryColor(discussion.category)}
            categoryName={category?.name}
          />
        );
      })}
    </div>
  );
};

export default DiscussionsList;