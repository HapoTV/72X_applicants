import React from 'react';
import { Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const MentorFilterChips: React.FC<Props> = ({ categories, selectedCategory, onSelectCategory }) => (
  <>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Filter by Expertise</h3>
      <Filter className="w-5 h-5 text-gray-500" />
    </div>
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          type="button"
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
  </>
);

export default MentorFilterChips;
