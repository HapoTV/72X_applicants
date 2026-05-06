// src/pages/hooks/useConnections.ts
import { useEffect, useMemo, useState, useCallback } from 'react';
import MessageServices from '../../services/MessageServices';
import ConnectionRequestService from '../../services/ConnectionRequestService';
import type { Conversation } from '../../interfaces/MessageData';
import type { ConnectionStatusDTO, ConnectionRequestDTO } from '../../services/ConnectionRequestService';

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
  subscriptionType?: string;
}

interface ConversationMeta {
  unread: number;
  lastMessageAt: string;
  conversationId: string;
  lastMessage: string;
}

export const DEFAULT_VISIBLE_CONNECTIONS = 10;
const USERS_CACHE_KEY = 'connections_users_cache';

const readCachedUsers = (): ConnectionUser[] => {
  try {
    const raw = localStorage.getItem(USERS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function useConnections(authUserId?: string) {
  const [users, setUsers] = useState<ConnectionUser[]>(() => readCachedUsers());
  const [filteredUsers, setFilteredUsers] = useState<ConnectionUser[]>(() => readCachedUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [organisations, setOrganisations] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_CONNECTIONS);
  const [conversationMetaByUserId, setConversationMetaByUserId] = useState<Record<string, ConversationMeta>>({});
  const [connectionStatusByUserId, setConnectionStatusByUserId] = useState<Record<string, ConnectionStatusDTO>>({});
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequestDTO[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all users ────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
          isOnline: u.availabilityStatus === 'ONLINE',
          lastSeen: u.lastSeenAt || null,
          subscriptionType: u.subscriptionType || null,
        };
      });

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(mappedUsers));

      setIndustries(Array.from(new Set(mappedUsers.map((u) => u.industry).filter(Boolean))) as string[]);
      setLocations(Array.from(new Set(mappedUsers.map((u) => u.location).filter(Boolean))) as string[]);
      setOrganisations(Array.from(new Set(mappedUsers.map((u) => u.organisation).filter(Boolean))) as string[]);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch conversations ────────────────────────────────────────────────────

  const loadConversations = useCallback(async () => {
    if (!authUserId) return;
    try {
      const conversations: Conversation[] = await MessageServices.getUserConversations();
      const meta: Record<string, ConversationMeta> = {};
      for (const c of conversations) {
        const otherUserId = c.user1Id === authUserId ? c.user2Id : c.user1Id;
        meta[otherUserId] = {
          unread: c.unreadCount || 0,
          lastMessageAt: c.lastMessageAt,
          conversationId: c.conversationId,
          lastMessage: c.lastMessage || '',
        };
      }
      setConversationMetaByUserId(meta);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [authUserId]);

  // ─── Fetch connection statuses ──────────────────────────────────────────────

  const loadConnectionStatuses = useCallback(async () => {
    if (!authUserId) return;
    try {
      const statusMap = await ConnectionRequestService.getBulkStatus();
      setConnectionStatusByUserId(statusMap);
    } catch (error) {
      console.error('Error loading connection statuses:', error);
    }
  }, [authUserId]);

  // ─── Fetch pending requests ─────────────────────────────────────────────────

  const loadPendingRequests = useCallback(async () => {
    if (!authUserId) return;
    try {
      const [received, count] = await Promise.all([
        ConnectionRequestService.getPendingReceived(),
        ConnectionRequestService.countPendingReceived(),
      ]);
      setPendingRequests(received);
      setPendingRequestsCount(count);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  }, [authUserId]);

  // ─── Initial load ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!authUserId || users.length === 0) return;
    loadConversations();
    loadConnectionStatuses();
    loadPendingRequests();

    const interval = window.setInterval(() => {
      loadConversations();
      loadConnectionStatuses();
      loadPendingRequests();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [authUserId, users.length, loadConversations, loadConnectionStatuses, loadPendingRequests]);

  // ─── Reset visible count on filter change ──────────────────────────────────

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE_CONNECTIONS);
  }, [searchTerm, selectedIndustry, selectedLocation, selectedOrganisation]);

  // ─── Filter users ───────────────────────────────────────────────────────────

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.industry?.toLowerCase().includes(term) ||
          user.location?.toLowerCase().includes(term) ||
          user.organisation?.toLowerCase().includes(term)
      );
    }

    if (selectedIndustry !== 'all') filtered = filtered.filter((u) => u.industry === selectedIndustry);
    if (selectedLocation !== 'all') filtered = filtered.filter((u) => u.location === selectedLocation);
    if (selectedOrganisation !== 'all') filtered = filtered.filter((u) => u.organisation === selectedOrganisation);

    setFilteredUsers(filtered);
  }, [searchTerm, selectedIndustry, selectedLocation, selectedOrganisation, users]);

  // ─── Sort: connected first, then pending received, then pending sent, then others ──

  const sortedFilteredUsers = useMemo(() => {
    const connected: ConnectionUser[] = [];
    const pendingSent: ConnectionUser[] = [];
    const pendingReceived: ConnectionUser[] = [];
    const others: ConnectionUser[] = [];

    filteredUsers.forEach((user) => {
      const status = connectionStatusByUserId[user.userId]?.status;
      if (status === 'ACCEPTED') connected.push(user);
      else if (status === 'PENDING_SENT') pendingSent.push(user);
      else if (status === 'PENDING_RECEIVED') pendingReceived.push(user);
      else others.push(user);
    });

    connected.sort((a, b) => {
      const ta = conversationMetaByUserId[a.userId]?.lastMessageAt
        ? new Date(conversationMetaByUserId[a.userId].lastMessageAt).getTime() : 0;
      const tb = conversationMetaByUserId[b.userId]?.lastMessageAt
        ? new Date(conversationMetaByUserId[b.userId].lastMessageAt).getTime() : 0;
      return tb - ta;
    });

    const alpha = (u: ConnectionUser) => `${u.firstName || ''} ${u.lastName || ''}`.trim().toLowerCase();
    pendingSent.sort((a, b) => alpha(a).localeCompare(alpha(b)));
    pendingReceived.sort((a, b) => alpha(a).localeCompare(alpha(b)));
    others.sort((a, b) => alpha(a).localeCompare(alpha(b)));

    return [...connected, ...pendingReceived, ...pendingSent, ...others];
  }, [filteredUsers, connectionStatusByUserId, conversationMetaByUserId]);

  const visibleUsers = useMemo(
    () => sortedFilteredUsers.slice(0, visibleCount),
    [sortedFilteredUsers, visibleCount]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSelectedOrganisation('all');
  };

  const refreshConversations = async () => { await loadConversations(); };
  const refreshConnectionStatuses = async () => {
    await Promise.all([loadConnectionStatuses(), loadPendingRequests()]);
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
    connectionStatusByUserId,
    pendingRequests,
    pendingRequestsCount,
    visibleCount,
    setVisibleCount,
    setSearchTerm,
    setSelectedIndustry,
    setSelectedLocation,
    setSelectedOrganisation,
    clearFilters,
    refetch: fetchUsers,
    refreshConversations,
    refreshConnectionStatuses,
  };
}
