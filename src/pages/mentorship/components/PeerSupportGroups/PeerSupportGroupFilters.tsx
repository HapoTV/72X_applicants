import React from "react";
import { Plus, Search, Filter, X } from "lucide-react";

interface PeerSupportGroupFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  searchLoading: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearchGroups: () => void;
  onClearSearch: () => void;
  onSelectCategory: (category: string) => void;
  onOpenCreateModal: () => void;
}

const PeerSupportGroupFilters: React.FC<PeerSupportGroupFiltersProps> = ({
  searchQuery,
  selectedCategory,
  categories,
  searchLoading,
  onSearchQueryChange,
  onSearchGroups,
  onClearSearch,
  onSelectCategory,
  onOpenCreateModal,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchGroups()}
            placeholder="Search groups by name, description, or location..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onSearchGroups}
          disabled={searchLoading}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {searchLoading ? (
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

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerSupportGroupFilters;
