// src/components/connections/ConnectionsList.tsx
import React, { useState } from 'react';
import {
  BriefcaseBusiness,
  MapPin,
  MessageCircle,
  MessageSquare,
  Building2,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  X,
} from 'lucide-react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';
import type { ConnectionStatusDTO } from '../../services/ConnectionRequestService';
import ConnectionRequestService from '../../services/ConnectionRequestService';

interface Props {
  users: ConnectionUser[];
  conversationMetaByUserId: Record<string, { unread: number; lastMessageAt: string; lastMessage: string }>;
  connectionStatusByUserId: Record<string, ConnectionStatusDTO>;
  onStartChat: (user: ConnectionUser) => void;
  onConnectionStatusChange: () => void;
}

const ConnectionsList: React.FC<Props> = ({
  users,
  conversationMetaByUserId,
  connectionStatusByUserId,
  onStartChat,
  onConnectionStatusChange,
}) => {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [connectMessage, setConnectMessage] = useState<Record<string, string>>({});
  const [showMessageInput, setShowMessageInput] = useState<string | null>(null);

  const isFreeTrialUser = localStorage.getItem('userStatus') === 'FREE_TRIAL';

  if (users.length === 0) return null;

  const formatLastSeen = (lastSeen?: string): string => {
    if (!lastSeen) return 'Offline';
    const diff = Date.now() - new Date(lastSeen).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return new Date(lastSeen).toLocaleDateString();
  };

  const handleSendRequest = async (user: ConnectionUser) => {
    setLoadingUserId(user.userId);
    try {
      const msg = connectMessage[user.userId] || undefined;
      await ConnectionRequestService.sendRequest(user.userId, msg);
      setShowMessageInput(null);
      setConnectMessage((prev) => ({ ...prev, [user.userId]: '' }));
      onConnectionStatusChange();
    } catch (err: any) {
      console.error('Error sending connection request:', err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleCancelRequest = async (requestId: string, userId: string) => {
    setLoadingUserId(userId);
    try {
      await ConnectionRequestService.cancelRequest(requestId);
      onConnectionStatusChange();
    } catch (err) {
      console.error('Error cancelling request:', err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleRemoveConnection = async (requestId: string, userId: string) => {
    if (!window.confirm('Remove this connection?')) return;
    setLoadingUserId(userId);
    try {
      await ConnectionRequestService.removeConnection(requestId);
      onConnectionStatusChange();
    } catch (err) {
      console.error('Error removing connection:', err);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {users.map((user) => {
          const meta = conversationMetaByUserId[user.userId];
          const unread = meta?.unread || 0;
          const lastMessage = meta?.lastMessage || '';
          const connStatus = connectionStatusByUserId[user.userId];
          const status = connStatus?.status ?? 'NONE';
          const requestId = connStatus?.requestId ?? null;
          const isLoading = loadingUserId === user.userId;
          const isConnected = status === 'ACCEPTED';

          return (
            <div
              key={user.userId}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                unread > 0 && isConnected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Avatar */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-700 ${
                        unread > 0 && isConnected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                      }`}
                    >
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </span>
                      )}
                    </div>

                    {/* Online indicator */}
                    {user.isOnline ? (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white" />
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-gray-400 ring-2 ring-white" />
                    )}

                    {/* Unread badge — only for connected users */}
                    {unread > 0 && isConnected && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                          {unread > 9 ? '9+' : unread}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-semibold text-gray-900 truncate ${
                          unread > 0 && isConnected ? 'text-blue-900' : ''
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </span>

                      {/* Subscription badge */}
                      {(() => {
                        const sub = user.subscriptionType;
                        const label = sub === 'PREMIUM' ? 'premium'
                          : sub === 'ESSENTIAL' ? 'essential'
                          : sub === 'START_UP' ? 'start up'
                          : sub === 'FREE_TRIAL' ? 'free trial'
                          : 'inactive';
                        const style = sub === 'PREMIUM'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : sub === 'ESSENTIAL'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : sub === 'START_UP'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : sub === 'FREE_TRIAL'
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200';
                        return (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}>
                            {label}
                          </span>
                        );
                      })()}

                      {/* Connection status badge */}
                      {isConnected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <UserCheck className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                      {status === 'PENDING_SENT' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3" />
                          Request sent
                        </span>
                      )}
                      {status === 'PENDING_RECEIVED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <UserPlus className="w-3 h-3" />
                          Wants to connect
                        </span>
                      )}

                      {/* Unread badge */}
                      {unread > 0 && isConnected && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {unread} new
                        </span>
                      )}

                      {/* Online status */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          user.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>

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

                    {/* Last message preview — only for connected users */}
                    {isConnected && lastMessage && (
                      <div
                        className={`mt-2 text-sm truncate flex items-center gap-1 ${
                          unread > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{lastMessage}</span>
                      </div>
                    )}

                    {!user.isOnline && user.lastSeen && (
                      <div className="mt-1 text-xs text-gray-400">
                        Last seen: {formatLastSeen(user.lastSeen)}
                      </div>
                    )}

                    {/* Optional connect message input */}
                    {showMessageInput === user.userId && status === 'NONE' && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a note (optional)..."
                          value={connectMessage[user.userId] || ''}
                          onChange={(e) =>
                            setConnectMessage((prev) => ({ ...prev, [user.userId]: e.target.value }))
                          }
                          maxLength={500}
                          className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendRequest(user);
                            if (e.key === 'Escape') setShowMessageInput(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => setShowMessageInput(null)}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="sm:ml-auto flex items-center gap-2 flex-shrink-0">
                  {/* CONNECTED: Message + Remove */}
                  {isConnected && (
                    <>
                      <button
                        onClick={() => onStartChat(user)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all ${
                          unread > 0
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {unread > 0 ? `Message (${unread})` : 'Message'}
                      </button>
                      {requestId && (
                        <button
                          onClick={() => handleRemoveConnection(requestId, user.userId)}
                          disabled={isLoading}
                          title="Remove connection"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}

                  {/* PENDING RECEIVED: Accept + Decline */}
                  {status === 'PENDING_RECEIVED' && requestId && (
                    <>
                      <div className="relative group">
                        <button
                          onClick={isFreeTrialUser ? undefined : async () => {
                            setLoadingUserId(user.userId);
                            try {
                              await ConnectionRequestService.acceptRequest(requestId);
                              onConnectionStatusChange();
                            } finally {
                              setLoadingUserId(null);
                            }
                          }}
                          disabled={isLoading || isFreeTrialUser}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            isFreeTrialUser
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          Accept
                        </button>
                        {isFreeTrialUser && (
                          <div className="pointer-events-none absolute -top-10 left-0 hidden group-hover:block">
                            <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                              Free Trial users cannot accept connection requests. Subscribe to connect.
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          setLoadingUserId(user.userId);
                          try {
                            await ConnectionRequestService.declineRequest(requestId);
                            onConnectionStatusChange();
                          } finally {
                            setLoadingUserId(null);
                          }
                        }}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <UserX className="w-4 h-4" />
                        Decline
                      </button>
                    </>
                  )}

                  {/* PENDING SENT: Cancel */}
                  {status === 'PENDING_SENT' && requestId && (
                    <button
                      onClick={() => handleCancelRequest(requestId, user.userId)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" />
                      {isLoading ? 'Cancelling...' : 'Pending'}
                    </button>
                  )}

                  {/* NOT CONNECTED: Connect button */}
                  {status === 'NONE' && (
                    <div className="relative group">
                      <button
                        onClick={isFreeTrialUser ? undefined : () => {
                          if (showMessageInput === user.userId) {
                            handleSendRequest(user);
                          } else {
                            setShowMessageInput(user.userId);
                          }
                        }}
                        disabled={isLoading || isFreeTrialUser}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          isFreeTrialUser
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                        style={isFreeTrialUser ? {} : { backgroundColor: '#2563eb' }}
                      >
                        <UserPlus className="w-4 h-4" />
                        {isLoading ? 'Sending...' : 'Connect'}
                      </button>
                      {isFreeTrialUser && (
                        <div className="pointer-events-none absolute -top-10 right-0 hidden group-hover:block">
                          <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                            Free Trial users cannot send connection requests. Subscribe to connect.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <div className="mt-2 text-sm text-gray-600">
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
