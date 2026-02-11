// src/components/connections/ConnectionsList.tsx
import React from 'react';
import { BriefcaseBusiness, MapPin, MessageCircle, Phone, Video } from 'lucide-react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';

interface Props {
  users: ConnectionUser[];
  conversationMetaByUserId: Record<string, { unread: number; lastTimeMs: number }>;
  onStartChat: (user: ConnectionUser) => void;
}

const ConnectionsList: React.FC<Props> = ({ users, conversationMetaByUserId, onStartChat }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {users.map((user) => {
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
                    onClick={() => onStartChat(user)}
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
  );
};

export default ConnectionsList;
