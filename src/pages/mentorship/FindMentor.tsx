// src/pages/mentorship/FindMentor.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Star, MessageSquare, Users, Clock, Globe } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { Mentor } from '../../interfaces/MentorshipData';

interface FindMentorProps {
  onStartChat: (mentorId: string) => void;
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

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Retail', name: 'Retail & Trading' },
    { id: 'Agriculture', name: 'Agriculture' },
    { id: 'Services', name: 'Services' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Food', name: 'Food & Hospitality' }
  ];

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [selectedCategory, searchQuery, mentors]);

  const fetchMentors = async () => {
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
  };

  const filterMentors = () => {
    let filtered = mentors;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mentor => {
        // Check if expertise string contains the category (case-insensitive)
        return mentor.expertise?.toLowerCase().includes(selectedCategory.toLowerCase()) || false;
      });
    }

    // Apply search filter
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
  };

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
      // Show success message or update UI
    } catch (error) {
      console.error('Error connecting to mentor:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search mentors by name, expertise, or experience..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter by Expertise</h3>
        <Filter className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
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
            {filteredMentors.map(mentor => {
              const availability = mentorshipService.isMentorAvailable(mentor.availability);
              const ratingText = mentorshipService.formatRating(mentor.rating);
              const sessionsText = mentorshipService.formatSessionsCount(mentor.sessionsCompleted);
              
              return (
                <div key={mentor.mentorId} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={mentor.imageUrl || mentorshipService.getUserImageUrl(mentor.name)}
                      alt={mentor.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{mentor.name}</h3>
                      <p className="text-gray-600 text-xs">{mentor.expertise}</p>
                      {mentor.experience && (
                        <p className="text-gray-500 text-xs">{mentor.experience}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      availability
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {availability ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  {mentor.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
                  )}
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise && (
                        <>
                          {mentor.expertise.split(',').slice(0, 2).map((skill: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {skill.trim()}
                            </span>
                          ))}
                          {mentor.expertise.split(',').length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{mentor.expertise.split(',').length - 2} more
                            </span>
                          )}
                        </>
                      )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      {mentor.languages && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{mentor.languages.split(',')[0].trim()}</span>
                        </div>
                      )}
                      {mentor.availability && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{mentor.availability.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-600 text-xs">{ratingText}</span>
                      </div>
                      <span className="text-gray-600 text-xs">{sessionsText}</span>
                      {mentor.sessionPrice && (
                        <span className="text-gray-600 text-xs">{mentor.sessionPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleConnectRequest(mentor.mentorId)}
                      className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs"
                    >
                      Connect
                    </button>
                    <button 
                      onClick={() => onStartChat(mentor.mentorId)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FindMentor;