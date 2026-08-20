// src/pages/mentorship/FindMentor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, X } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import MentorSearchBar from './components/MentorSearchBar';
import MentorFilterChips from './components/MentorFilterChips';
import MentorCard from './components/MentorCard';
import type { Mentor } from '../../interfaces/MentorshipData';

interface FindMentorProps {
    onStartChat: (mentorId: string, mentorName: string, mentorEmail: string) => void;
    onConnect: (mentorId: string) => void;
}

const FindMentor: React.FC<FindMentorProps> = ({ onStartChat, onConnect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Retail', name: 'Retail & Trading' },
    { id: 'Agriculture', name: 'Agriculture' },
    { id: 'Services', name: 'Services' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Food', name: 'Food & Hospitality' }
  ];

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mentorsData = await mentorshipService.getAllMentors();
      setMentors(mentorsData);
    } catch (err) {
      setError('Failed to load mentors. Please try again later.');
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterMentors = useCallback(() => {
    let filtered = mentors;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mentor => {
        return mentor.expertise?.toLowerCase().includes(selectedCategory.toLowerCase()) || false;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mentor => {
        return (
          mentor.name?.toLowerCase().includes(query) ||
          mentor.expertise?.toLowerCase().includes(query) ||
          mentor.experience?.toLowerCase().includes(query) ||
          mentor.background?.toLowerCase().includes(query) ||
          mentor.bio?.toLowerCase().includes(query) ||
          mentor.contactInfo?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredMentors(filtered);
  }, [mentors, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    filterMentors();
  }, [filterMentors]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMentors();
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const searchResults = await mentorshipService.searchMentors(searchQuery);
      setMentors(searchResults);
    } catch (err) {
      setError('Failed to search mentors. Please try again.');
      console.error('Error searching mentors:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchMentors();
  };

  const handleConnectRequest = async (mentorId: string) => {
    try {
      await onConnect(mentorId);
    } catch (error) {
      console.error('Error connecting to mentor:', error);
    }
  };

  const handleChatWithMentor = async (mentor: Mentor) => {
    if (!mentor.contactInfo) {
      alert('This mentor has no contact information available.');
      return;
    }

    console.log('Starting chat with mentor profile:', mentor.name);
    
    // We'll use mentorId for mentor-specific chat
    // Pass the mentor's own contact info, not the creator's
    setChatLoading(mentor.mentorId);
    try {
      await Promise.resolve(onStartChat(mentor.mentorId, mentor.name, mentor.contactInfo));
    } finally {
      setChatLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <MentorSearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      <MentorFilterChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery
              ? `No mentors found matching "${searchQuery}". Try a different search term.`
              : selectedCategory !== 'all'
              ? `No mentors found in ${categories.find(c => c.id === selectedCategory)?.name}. Try another category.`
              : 'No mentors available at the moment. Please check back later.'}
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 text-primary-600 hover:text-primary-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.mentorId}
                mentor={mentor}
                onConnect={handleConnectRequest}
                onChat={handleChatWithMentor}
                chatLoading={chatLoading}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FindMentor;