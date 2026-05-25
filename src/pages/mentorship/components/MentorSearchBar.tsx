import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

const MentorSearchBar: React.FC<Props> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onClearSearch,
  isSearching,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Search mentors by name, expertise, or experience..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={isSearching}
        type="button"
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSearching ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Search</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default MentorSearchBar;
