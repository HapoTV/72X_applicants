// src/pages/mentorship/PeerSupportGroups.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, Filter, X, MessageSquare, Calendar, MapPin, Globe } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { PeerSupportGroup, PeerSupportGroupFormData } from '../../interfaces/MentorshipData';

interface PeerSupportGroupsProps {
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onOpenGroupChat: (groupId: string, groupName: string) => void;
}

const PeerSupportGroups: React.FC<PeerSupportGroupsProps> = ({
  onJoinGroup,
  onLeaveGroup,
  onOpenGroupChat
}) => {
  const [groups, setGroups] = useState<PeerSupportGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<PeerSupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState<PeerSupportGroupFormData>({
    name: '',
    description: '',
    category: 'General Business',
    location: '',
    maxMembers: 100,
    isPublic: true,
    imageUrl: ''
  });
  const [userId, setUserId] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);

  const categories = [
    'all',
    'General Business',
    'Women Entrepreneurs',
    'Young Entrepreneurs',
    'Tech Startups',
    'Agriculture',
    'Retail',
    'Manufacturing',
    'Services'
  ];

  // Function to extract user ID from localStorage
  const extractUserId = (): string | null => {
    try {
      // Try to get user from localStorage
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        console.log('No user data found in localStorage');
        return null;
      }

      const userData = JSON.parse(userDataString);
      console.log('User data from localStorage:', userData);

      // Try different possible user ID properties
      const userId = userData.userId || userData.id || userData._id || userData.user_id;
      
      if (userId) {
        console.log('Extracted user ID:', userId);
        return userId;
      } else {
        console.warn('No user ID found in user data. Available keys:', Object.keys(userData));
        return null;
      }
    } catch (error) {
      console.error('Error extracting user ID:', error);
      return null;
    }
  };

  useEffect(() => {
    // Extract user ID on component mount
    const extractedUserId = extractUserId();
    if (extractedUserId) {
      setUserId(extractedUserId);
    } else {
      setLoading(false);
      setError('Please login to view groups');
    }
  }, []);

  useEffect(() => {
    // Fetch groups when userId is available
    if (userId) {
      console.log('User ID available, fetching groups:', userId);
      fetchGroups();
    }
  }, [userId]);

  useEffect(() => {
    // Filter groups whenever dependencies change
    filterGroups();
  }, [searchQuery, selectedCategory, groups]);

  const fetchGroups = async () => {
    if (!userId) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }

    console.log('Starting to fetch groups for user:', userId);
    
    setLoading(true);
    setError(null);
    
    try {
      const groupsData = await mentorshipService.getPeerSupportGroups(userId);
      console.log('Fetched groups data:', groupsData);
      
      if (groupsData && Array.isArray(groupsData)) {
        setGroups(groupsData);
        console.log(`Successfully loaded ${groupsData.length} groups`);
      } else {
        console.warn('Received invalid groups data:', groupsData);
        setGroups([]);
      }
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load groups. Please try again later.';
      setError(errorMessage);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = groups;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(group => 
        group.category && group.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group =>
        (group.name && group.name.toLowerCase().includes(query)) ||
        (group.description && group.description.toLowerCase().includes(query)) ||
        (group.category && group.category.toLowerCase().includes(query)) ||
        (group.location && group.location.toLowerCase().includes(query))
      );
    }

    setFilteredGroups(filtered);
    console.log(`Filtered ${filtered.length} groups from ${groups.length} total`);
  };

  const handleOpenGroupChat = (groupId: string, groupName: string) => {
  if (!window.confirm('Open group chat? You need to be a member to participate.')) {
    return;
  }
  
  // Check if user is a member
  const group = groups.find(g => g.groupId === groupId);
  if (group && !group.isMember) {
    alert('You need to join the group first to participate in the chat.');
    return;
  }
  
  onOpenGroupChat(groupId, groupName);
};

  const handleSearchGroups = async () => {
    if (!searchQuery.trim()) {
      fetchGroups();
      return;
    }

    if (!userId) {
      alert('Please login to search groups');
      return;
    }

    setSearchLoading(true);
    setError(null);
    try {
      const searchResults = await mentorshipService.searchGroups(searchQuery, userId);
      setGroups(searchResults);
    } catch (err) {
      setError('Failed to search groups. Please try again.');
      console.error('Error searching groups:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!userId) {
      alert('Please login to create a group');
      return;
    }

    try {
      const createdGroup = await mentorshipService.createPeerGroup(newGroup, userId);
      
      // Add the created group to the list
      setGroups(prev => [createdGroup, ...prev]);
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        description: '',
        category: 'General Business',
        location: '',
        maxMembers: 100,
        isPublic: true,
        imageUrl: ''
      });

      alert(`Group "${newGroup.name}" created successfully!`);
    } catch (error: any) {
      console.error('Error creating group:', error);
      alert(`Failed to create group: ${error.message}`);
    }
  };

  const handleJoinGroupRequest = async (groupId: string) => {
    if (!userId) {
      alert('Please login to join a group');
      return;
    }

    try {
      await mentorshipService.joinPeerGroup(groupId, userId);
      
      // Update local state
      setGroups(prev => 
        prev.map(group => {
          if (group.groupId === groupId) {
            return {
              ...group,
              isMember: true,
              memberCount: group.memberCount + 1,
              joinedAt: new Date().toISOString()
            };
          }
          return group;
        })
      );
      
      // Call parent handler
      onJoinGroup(groupId);
      alert('Successfully joined the group!');
    } catch (error: any) {
      console.error('Error joining group:', error);
      alert(`Failed to join group: ${error.message}`);
    }
  };

  const handleLeaveGroupRequest = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    if (!userId) {
      alert('Please login to leave a group');
      return;
    }

    try {
      await mentorshipService.leavePeerGroup(groupId, userId);
      
      // Update local state
      setGroups(prev => 
        prev.map(group => {
          if (group.groupId === groupId) {
            return {
              ...group,
              isMember: false,
              memberCount: Math.max(0, group.memberCount - 1),
              joinedAt: undefined
            };
          }
          return group;
        })
      );
      
      // Call parent handler
      onLeaveGroup(groupId);
      alert('Successfully left the group.');
    } catch (error: any) {
      console.error('Error leaving group:', error);
      alert(`Failed to leave group: ${error.message}`);
    }
  };

  const getAvailabilityStatus = (group: PeerSupportGroup) => {
    if (group.memberCount >= group.maxMembers) {
      return { text: 'Full', color: 'bg-red-100 text-red-800' };
    }
    const percentage = (group.memberCount / group.maxMembers) * 100;
    if (percentage >= 90) return { text: 'Almost Full', color: 'bg-red-100 text-red-800' };
    if (percentage >= 75) return { text: 'Limited Spots', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Open', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            You need to login to view and join peer support groups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchGroups()}
              placeholder="Search groups by name, description, or location..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchGroups();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearchGroups}
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
          <button
            onClick={fetchGroups}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {filteredGroups.length} of {groups.length} groups
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </div>
      )}

      {/* Groups Grid */}
      {filteredGroups.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No groups found matching "${searchQuery}". Try a different search term.`
              : selectedCategory !== 'all'
              ? `No groups found in ${selectedCategory}. Try another category.`
              : 'No groups available at the moment. Be the first to create one!'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create First Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGroups.map(group => {
            const availability = getAvailabilityStatus(group);
            const isFull = group.memberCount >= group.maxMembers;
            const groupImage = group.imageUrl || mentorshipService.getDefaultImage(group.name);
            
            return (
              <div key={group.groupId} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={groupImage}
                    alt={group.name}
                    className="w-12 h-12 object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = mentorshipService.getDefaultImage(group.name);
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{group.name}</h3>
                    <p className="text-gray-600 text-xs">{group.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${availability.color}`}>
                    {availability.text}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{group.memberCount} / {group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{mentorshipService.formatDateRelative(group.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{group.location || 'Online'}</span>
                    </div>
                    {group.isPublic && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs">Public</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">By {group.createdBy || 'Unknown'}</span>
                    {group.isMember && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {group.isOwner ? 'Owner' : 'Member'}
                      </span>
                    )}
                  </div>
                  {group.recentActivity && (
                    <p className="text-xs text-green-600">{group.recentActivity}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {group.isMember ? (
                    <>
                      <button 
                        onClick={() => handleLeaveGroupRequest(group.groupId)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                      >
                        Leave Group
                      </button>
                      <button 
                        onClick={() => handleOpenGroupChat(group.groupId, group.name)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleJoinGroupRequest(group.groupId)}
                      disabled={isFull}
                      className={`w-full py-2 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2 ${
                        isFull 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{isFull ? 'Group Full' : 'Join Group'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Support Group</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Group Name *</label>
                  <input 
                    value={newGroup.name} 
                    onChange={e => setNewGroup({...newGroup, name: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="e.g., Soweto Entrepreneurs Circle"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Category *</label>
                  <select 
                    value={newGroup.category} 
                    onChange={e => setNewGroup({...newGroup, category: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Location</label>
                  <input 
                    value={newGroup.location} 
                    onChange={e => setNewGroup({...newGroup, location: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="e.g., Soweto, Johannesburg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Members</label>
                  <input 
                    type="number"
                    min="2"
                    max="500"
                    value={newGroup.maxMembers} 
                    onChange={e => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value) || 100})} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description *</label>
                <textarea 
                  value={newGroup.description} 
                  onChange={e => setNewGroup({...newGroup, description: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  rows={3}
                  placeholder="Describe your group's purpose, goals, and who should join..."
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="isPublic"
                  checked={newGroup.isPublic}
                  onChange={e => setNewGroup({...newGroup, isPublic: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this group public (visible to everyone)
                </label>
              </div>
              <div className="flex gap-2 pt-2 justify-end">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                  disabled={!userId}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerSupportGroups;