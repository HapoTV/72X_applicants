// src/pages/MyConnections.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConnections, DEFAULT_VISIBLE_CONNECTIONS } from './hooks/useConnections';
import type { ConnectionUser } from './hooks/useConnections';
import ConnectionsFilters from '../components/connections/ConnectionsFilters';
import ConnectionsList from '../components/connections/ConnectionsList';
import PendingRequestsPanel from '../components/connections/PendingRequestsPanel';
import ChatDialog from '../components/connections/ChatDialog';
import Spinner from '../components/Spinner';

const MyConnections: React.FC = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConnectionUser | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [autoSend, setAutoSend] = useState<boolean | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  const {
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
    refetch,
    refreshConversations,
    refreshConnectionStatuses,
  } = useConnections(authUser?.userId);

  // Handle auto-open chat from URL params (e.g. from marketplace "Contact Seller")
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUserId = params.get('userId') || '';
    const message = params.get('message') || '';
    const autoSendRaw = params.get('autoSend');
    const shouldAutoSend = autoSendRaw === '1' || autoSendRaw?.toLowerCase() === 'true';

    if (!targetUserId || !users || users.length === 0) return;

    const match = users.find((u) => u.userId === targetUserId);
    if (!match) return;

    setSelectedUser(match);
    setChatOpen(true);
    setInitialMessage(message || undefined);
    setAutoSend(shouldAutoSend || undefined);
    navigate('/connections', { replace: true });
  }, [location.search, navigate, users]);

  const handleStartChat = (user: ConnectionUser) => {
    setSelectedUser(user);
    setChatOpen(true);
    setInitialMessage(undefined);
    setAutoSend(undefined);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
    setInitialMessage(undefined);
    setAutoSend(undefined);
    refreshConversations();
  };

  const handleConnectionStatusChange = () => {
    refreshConnectionStatuses();
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <Spinner size="md" color="blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="text-red-600">{error}</div>
        <button
          onClick={refetch}
          className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">Connect with fellow entrepreneurs, share experiences, and grow together</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Users
          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{users.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Requests
          {pendingRequestsCount > 0 && (
            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'pending' ? (
        <PendingRequestsPanel
          requests={pendingRequests}
          onStatusChange={handleConnectionStatusChange}
        />
      ) : (
        <>
          {/* Search and Filter Bar */}
          <ConnectionsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedOrganisation={selectedOrganisation}
            onOrganisationChange={setSelectedOrganisation}
            industries={industries}
            locations={locations}
            organisations={organisations}
            onClearFilters={clearFilters}
          />

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {visibleUsers.length} of {sortedFilteredUsers.length} users
            </div>
            <div className="flex gap-2">
              {pendingRequestsCount > 0 && (
                <button
                  onClick={() => setActiveTab('pending')}
                  className="text-xs px-2.5 py-1 rounded-full border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  {pendingRequestsCount} pending request{pendingRequestsCount > 1 ? 's' : ''}
                </button>
              )}
              <div className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                {users.length} total users
              </div>
            </div>
          </div>

          {/* Users List */}
          {sortedFilteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-base font-semibold text-gray-700">No users found matching your criteria</div>
              <div className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</div>
              <button
                onClick={clearFilters}
                className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <ConnectionsList
              users={visibleUsers}
              conversationMetaByUserId={conversationMetaByUserId}
              connectionStatusByUserId={connectionStatusByUserId}
              onStartChat={handleStartChat}
              onConnectionStatusChange={handleConnectionStatusChange}
            />
          )}

          {sortedFilteredUsers.length > visibleCount && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + DEFAULT_VISIBLE_CONNECTIONS)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Show more users
              </button>
            </div>
          )}
        </>
      )}

      {/* Chat Dialog */}
      <ChatDialog
        selectedUser={selectedUser}
        isOpen={chatOpen}
        onClose={handleCloseChat}
        onMarkAsRead={refreshConversations}
        initialMessage={initialMessage}
        autoSend={autoSend}
      />
    </div>
  );
};

export default MyConnections;
