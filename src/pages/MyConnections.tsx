// src/pages/MyConnections.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConnections, DEFAULT_VISIBLE_CONNECTIONS } from './hooks/useConnections';
import type { ConnectionUser } from './hooks/useConnections';
import ConnectionsFilters from '../components/connections/ConnectionsFilters';
import ConnectionsList from '../components/connections/ConnectionsList';
import ChatDialog from '../components/connections/ChatDialog';

const MyConnections: React.FC = () => {
  const { user: authUser } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConnectionUser | null>(null);

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
    visibleCount,
    setVisibleCount,
    setSearchTerm,
    setSelectedIndustry,
    setSelectedLocation,
    setSelectedOrganisation,
    clearFilters,
    refetch,
  } = useConnections(authUser?.userId);

  const handleStartChat = (user: ConnectionUser) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connections</h1>
        <p className="text-gray-600">Connect with fellow entrepreneurs, share experiences, and grow together</p>
      </div>

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
      <div className="mb-3 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {visibleUsers.length} of {sortedFilteredUsers.length} users
        </div>
        <div className="flex gap-2">
          <div className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-700 bg-blue-50">
            {Object.keys(conversationMetaByUserId).length} conversations
          </div>
          <div className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
            {users.length} total users
          </div>
        </div>
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
        <ConnectionsList
          users={visibleUsers}
          conversationMetaByUserId={conversationMetaByUserId}
          onStartChat={handleStartChat}
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

      {/* Chat Dialog */}
      <ChatDialog selectedUser={selectedUser} isOpen={chatOpen} onClose={handleCloseChat} />
    </div>
  );
};

export default MyConnections;