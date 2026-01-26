// src/pages/MyConnections.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search as SearchIcon,
  MapPin,
  BriefcaseBusiness,
  MessageCircle,
  Video,
  Phone,
} from 'lucide-react';

import MessageServices from '../services/MessageServices';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import type { Conversation } from '../interfaces/MessageData';

interface ConnectionUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;

  location?: string;
  industry?: string;
  bio?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

const MyConnections: React.FC = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ConnectionUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConnectionUser | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const DEFAULT_VISIBLE = 10;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE);
  const [conversationMetaByUserId, setConversationMetaByUserId] = useState<Record<string, { unread: number; lastTimeMs: number }>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE);
  }, [searchTerm, selectedIndustry, selectedLocation]);

  useEffect(() => {
    const userId = authUser?.userId;
    if (!userId) return;

    const loadConversations = async () => {
      try {
        const conversations: Conversation[] = await MessageServices.getUserConversations();
        const meta: Record<string, { unread: number; lastTimeMs: number }> = {};
        for (const c of conversations) {
          const lastTimeMs = c.lastMessageTime ? Date.parse(c.lastMessageTime) : 0;
          meta[c.userId] = {
            unread: Number(c.unreadCount || 0),
            lastTimeMs: Number.isFinite(lastTimeMs) ? lastTimeMs : 0,
          };
        }
        setConversationMetaByUserId(meta);
      } catch {
        // ignore; list still works without conversation ordering
      }
    };

    loadConversations();
    const interval = window.setInterval(loadConversations, 15000);
    return () => window.clearInterval(interval);
  }, [authUser?.userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await MessageServices.getChatUsers();
      const mappedUsers: ConnectionUser[] = (response as any[]).map((u) => {
        const fullName = (u.fullName || '').trim();
        const parts = fullName.split(/\s+/).filter(Boolean);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        return {
          userId: u.userId,
          email: u.email,
          firstName,
          lastName,
          role: u.role,
          location: u.location,
          industry: u.industry,
          profileImage: u.profileImageUrl,
        };
      });

      // Don't filter on frontend if backend already filters
      // Let backend handle the filtering based on user role
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);

      // Extract unique industries and locations for filters
      const uniqueIndustries = Array.from(
        new Set(mappedUsers.map((user) => user.industry).filter(Boolean))
      ) as string[];

      const uniqueLocations = Array.from(
        new Set(mappedUsers.map((user) => user.location).filter(Boolean))
      ) as string[];

      setIndustries(uniqueIndustries);
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedIndustry, selectedLocation, users]);

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.industry?.toLowerCase().includes(term) ||
        user.location?.toLowerCase().includes(term)
      );
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(user => user.industry === selectedIndustry);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(user => user.location === selectedLocation);
    }

    setFilteredUsers(filtered);
  };

  const sortedFilteredUsers = useMemo(() => {
    const copy = [...filteredUsers];
    copy.sort((a, b) => {
      const ma = conversationMetaByUserId[a.userId];
      const mb = conversationMetaByUserId[b.userId];

      const ua = ma?.unread || 0;
      const ub = mb?.unread || 0;
      if (ua !== ub) return ub - ua;

      const ta = ma?.lastTimeMs || 0;
      const tb = mb?.lastTimeMs || 0;
      if (ta !== tb) return tb - ta;

      const an = `${a.firstName || ''} ${a.lastName || ''}`.trim();
      const bn = `${b.firstName || ''} ${b.lastName || ''}`.trim();
      return an.localeCompare(bn);
    });
    return copy;
  }, [filteredUsers, conversationMetaByUserId]);

  const visibleUsers = useMemo(() => sortedFilteredUsers.slice(0, visibleCount), [sortedFilteredUsers, visibleCount]);

  const handleStartChat = (user: ConnectionUser) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchUsers}
          className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connections</h1>
        <p className="text-gray-600">Connect with fellow entrepreneurs, share experiences, and grow together</p>
      </div>

      {/* Search and Filter Bar (Marketplace-style) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-3 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {visibleUsers.length} of {sortedFilteredUsers.length} users
        </div>
        {users.length > 0 && (
          <div className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-700 bg-blue-50">
            {users.length} total users
          </div>
        )}
      </div>

      {/* Users List */}
      {sortedFilteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-base font-semibold text-gray-700">
            No users found matching your criteria
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Try adjusting your search or filters
          </div>
          <button
            onClick={clearFilters}
            className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {visibleUsers.map((user) => {
              const meta = conversationMetaByUserId[user.userId];
              const unread = meta?.unread || 0;

              return (
                <div key={user.userId} className="p-1.5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-700">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </span>
                          )}
                        </div>
                        {user.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                          <div className="font-semibold text-gray-900 truncate text-[13px]">
                            {user.firstName} {user.lastName}
                          </div>
                          {unread > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
                              New {unread}
                            </span>
                          )}
                          {user.isOnline ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full">
                              Online
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-500">Last seen: {user.lastSeen || 'Recently'}</span>
                          )}
                        </div>

                        <div className="text-[11px] text-gray-600 truncate leading-tight">{user.email}</div>

                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {user.industry && (
                            <div className="text-[11px] text-gray-700 inline-flex items-center gap-1">
                              <BriefcaseBusiness className="w-3.5 h-3.5 text-gray-500" />
                              <span className="truncate">{user.industry}</span>
                            </div>
                          )}
                          {user.location && (
                            <div className="text-[11px] text-gray-700 inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="sm:ml-auto flex items-center gap-1">
                      <button
                        onClick={() => handleStartChat(user)}
                        className="inline-flex items-center justify-center gap-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-blue-600"
                        aria-label="Video call"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-blue-600"
                        aria-label="Phone call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="mt-1 text-xs text-gray-600">
                      {user.bio.length > 70 ? `${user.bio.substring(0, 70)}...` : user.bio}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sortedFilteredUsers.length > visibleCount && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + DEFAULT_VISIBLE)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Show more users
          </button>
        </div>
      )}

      {/* Chat Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseChat}
            aria-label="Close dialog"
          />
          <div className="relative w-[95vw] max-w-3xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="font-semibold text-gray-900 text-sm">
                Chat with {selectedUser.firstName} {selectedUser.lastName}
              </div>
              <button
                onClick={handleCloseChat}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <ChatWindow
                receiverId={selectedUser.userId}
                receiverName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                receiverEmail={selectedUser.email}
                onClose={handleCloseChat}
                isOpen={chatOpen}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyConnections;