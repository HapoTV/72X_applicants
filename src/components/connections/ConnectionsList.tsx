// src/components/connections/ConnectionsList.tsx
import React from 'react';
import { BriefcaseBusiness, MapPin, MessageCircle, Building2, MessageSquare } from 'lucide-react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';

interface Props {
  users: ConnectionUser[];
  conversationMetaByUserId: Record<string, { unread: number; lastMessageAt: string; lastMessage: string }>;
  onStartChat: (user: ConnectionUser) => void;
}

const ConnectionsList: React.FC<Props> = ({ users, conversationMetaByUserId, onStartChat }) => {
  if (users.length === 0) {
    return null;
  }

  const formatLastSeen = (lastSeen?: string): string => {
    if (!lastSeen) return 'Offline';
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return lastSeenDate.toLocaleDateString();
  };

  // Debug: Log the conversation data to see what's coming in
  console.log('Conversation Meta Data:', conversationMetaByUserId);
  console.log('Users with unread:', Object.entries(conversationMetaByUserId)
    .filter(([_, meta]) => meta.unread > 0)
    .map(([userId, meta]) => ({ userId, unread: meta.unread })));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {users.map((user) => {
          const meta = conversationMetaByUserId[user.userId];
          const unread = meta?.unread || 0;
          const lastMessage = meta?.lastMessage || '';

          // Debug: Log each user's unread status
          if (unread > 0) {
            console.log(`User ${user.firstName} ${user.lastName} has ${unread} unread messages`);
          }

          return (
            <div 
              key={user.userId} 
              className={`p-4 hover:bg-gray-50 transition-colors ${
                unread > 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-700 ${
                      unread > 0 ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                    }`}>
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
                    
                    {/* Online/Offline indicator */}
                    {user.isOnline ? (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white" />
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-gray-400 ring-2 ring-white" />
                    )}
                    
                    {/* Unread badge on avatar - this is the key part! */}
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                          {unread > 9 ? '9+' : unread}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`font-semibold text-gray-900 truncate ${
                        unread > 0 ? 'text-blue-900' : ''
                      }`}>
                        {user.firstName} {user.lastName}
                      </div>
                      
                      {/* Unread count badge next to name */}
                      {unread > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {unread} new
                        </span>
                      )}
                      
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.isOnline 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 truncate">{user.email}</div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {user.organisation && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {user.organisation}
                        </span>
                      )}
                      {user.industry && (
                        <span className="inline-flex items-center gap-1">
                          <BriefcaseBusiness className="w-3.5 h-3.5" />
                          {user.industry}
                        </span>
                      )}
                      {user.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {user.location}
                        </span>
                      )}
                    </div>

                    {/* Last message preview */}
                    {lastMessage && (
                      <div className={`mt-2 text-sm truncate flex items-center gap-1 ${
                        unread > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
                      }`}>
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{lastMessage}</span>
                        {unread > 0 && (
                          <span className="ml-1 text-xs font-bold text-blue-600">
                            (unread)
                          </span>
                        )}
                      </div>
                    )}

                    {!user.isOnline && user.lastSeen && (
                      <div className="mt-1 text-xs text-gray-400">
                        Last seen: {formatLastSeen(user.lastSeen)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:ml-auto flex items-center gap-2">
                  <button
                    onClick={() => onStartChat(user)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all ${
                      unread > 0 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 animate-pulse' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {unread > 0 ? `Message (${unread})` : 'Message'}
                  </button>
                </div>
              </div>

              {user.bio && (
                <div className={`mt-2 text-sm ${
                  unread > 0 ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionsList;