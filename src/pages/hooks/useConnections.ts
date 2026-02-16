// src/pages/hooks/useConnections.ts
import { useEffect, useMemo, useState } from 'react';
import MessageServices from '../../services/MessageServices';
import type { Conversation } from '../../interfaces/MessageData';

export interface ConnectionUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  location?: string;
  industry?: string;
  organisation?: string;
  bio?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ConversationMeta {
  unread: number;
  lastMessageAt: string;
  conversationId: string;
  lastMessage: string;
}

export const DEFAULT_VISIBLE_CONNECTIONS = 10;

export function useConnections(authUserId?: string) {
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ConnectionUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [organisations, setOrganisations] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_CONNECTIONS);
  const [conversationMetaByUserId, setConversationMetaByUserId] = useState<Record<string, ConversationMeta>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE_CONNECTIONS);
  }, [searchTerm, selectedIndustry, selectedLocation, selectedOrganisation]);

  useEffect(() => {
    if (!authUserId) return;

    const loadConversations = async () => {
      try {
        const conversations: Conversation[] = await MessageServices.getUserConversations();
        const meta: Record<string, ConversationMeta> = {};
        
        for (const c of conversations) {
          // Determine which user is the other participant
          const otherUserId = c.user1Id === authUserId ? c.user2Id : c.user1Id;
          const otherUserName = c.user1Id === authUserId ? c.user2Name : c.user1Name;
          const otherUserEmail = c.user1Id === authUserId ? c.user2Email : c.user1Email;
          
          meta[otherUserId] = {
            unread: c.unreadCount || 0,
            lastMessageAt: c.lastMessageAt,
            conversationId: c.conversationId,
            lastMessage: c.lastMessage || ''
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
  }, [authUserId]);

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
          organisation: u.organisation,
          profileImage: u.profileImageUrl,
          isOnline: Math.random() > 0.5, // This should come from a real online status service
          lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString()
        };
      });

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);

      const uniqueIndustries = Array.from(
        new Set(mappedUsers.map((user) => user.industry).filter(Boolean)),
      ) as string[];

      const uniqueLocations = Array.from(
        new Set(mappedUsers.map((user) => user.location).filter(Boolean)),
      ) as string[];

      const uniqueOrganisations = Array.from(
        new Set(mappedUsers.map((user) => user.organisation).filter(Boolean)),
      ) as string[];

      setIndustries(uniqueIndustries);
      setLocations(uniqueLocations);
      setOrganisations(uniqueOrganisations);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.industry?.toLowerCase().includes(term) ||
        user.location?.toLowerCase().includes(term) ||
        user.organisation?.toLowerCase().includes(term)
      );
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter((user) => user.industry === selectedIndustry);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((user) => user.location === selectedLocation);
    }

    if (selectedOrganisation !== 'all') {
      filtered = filtered.filter((user) => user.organisation === selectedOrganisation);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedIndustry, selectedLocation, selectedOrganisation, users]);

  const sortedFilteredUsers = useMemo(() => {
    const copy = [...filteredUsers];
    
    // Split users into those with conversations and those without
    const withConversations: ConnectionUser[] = [];
    const withoutConversations: ConnectionUser[] = [];
    
    copy.forEach(user => {
      if (conversationMetaByUserId[user.userId]) {
        withConversations.push(user);
      } else {
        withoutConversations.push(user);
      }
    });
    
    // Sort users with conversations by lastMessageAt (most recent first)
    withConversations.sort((a, b) => {
      const ma = conversationMetaByUserId[a.userId];
      const mb = conversationMetaByUserId[b.userId];
      
      const ta = ma?.lastMessageAt ? new Date(ma.lastMessageAt).getTime() : 0;
      const tb = mb?.lastMessageAt ? new Date(mb.lastMessageAt).getTime() : 0;
      
      return tb - ta; // Descending (most recent first)
    });
    
    // Sort users without conversations alphabetically
    withoutConversations.sort((a, b) => {
      const an = `${a.firstName || ''} ${a.lastName || ''}`.trim();
      const bn = `${b.firstName || ''} ${b.lastName || ''}`.trim();
      return an.localeCompare(bn);
    });
    
    // Return combined array: users with conversations first, then users without
    return [...withConversations, ...withoutConversations];
  }, [filteredUsers, conversationMetaByUserId]);

  const visibleUsers = useMemo(
    () => sortedFilteredUsers.slice(0, visibleCount),
    [sortedFilteredUsers, visibleCount],
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSelectedOrganisation('all');
  };

  return {
    users,
    visibleUsers,
    sortedFilteredUsers,
    industries,
    locations,
    organisations,
    searchTerm,
    selectedIndustry,
    selectedLocation,
    selectedOrganisation,
    loading,
    error,
    conversationMetaByUserId,
    visibleCount,
    setVisibleCount,
    setSearchTerm,
    setSelectedIndustry,
    setSelectedLocation,
    setSelectedOrganisation,
    clearFilters,
    refetch: fetchUsers,
  };
}