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
  bio?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ConversationMeta {
  unread: number;
  lastTimeMs: number;
}

export const DEFAULT_VISIBLE_CONNECTIONS = 10;

export function useConnections(authUserId?: string) {
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ConnectionUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_CONNECTIONS);
  const [conversationMetaByUserId, setConversationMetaByUserId] = useState<Record<string, ConversationMeta>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE_CONNECTIONS);
  }, [searchTerm, selectedIndustry, selectedLocation]);

  useEffect(() => {
    if (!authUserId) return;

    const loadConversations = async () => {
      try {
        const conversations: Conversation[] = await MessageServices.getUserConversations();
        const meta: Record<string, ConversationMeta> = {};
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
          profileImage: u.profileImageUrl,
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

      setIndustries(uniqueIndustries);
      setLocations(uniqueLocations);
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
        user.location?.toLowerCase().includes(term),
      );
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter((user) => user.industry === selectedIndustry);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((user) => user.location === selectedLocation);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedIndustry, selectedLocation, users]);

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

  const visibleUsers = useMemo(
    () => sortedFilteredUsers.slice(0, visibleCount),
    [sortedFilteredUsers, visibleCount],
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
  };

  return {
    users,
    visibleUsers,
    sortedFilteredUsers,
    industries,
    locations,
    searchTerm,
    selectedIndustry,
    selectedLocation,
    loading,
    error,
    conversationMetaByUserId,
    visibleCount,
    setVisibleCount,
    setSearchTerm,
    setSelectedIndustry,
    setSelectedLocation,
    clearFilters,
    refetch: fetchUsers,
  };
}
