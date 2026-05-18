// src/components/connections/ConnectionsList.tsx
import React from 'react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';
import ConnectionItem from './ConnectionItem';

interface Props {
  users: ConnectionUser[];
  conversationMetaByUserId: Record<string, { unread: number; lastMessageAt: string; lastMessage: string }>;
  onStartChat: (user: ConnectionUser) => void;
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

const ConnectionsList: React.FC<Props> = ({ users, conversationMetaByUserId, onStartChat }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {users.map((user) => (
          <ConnectionItem
            key={user.userId}
            user={user}
            meta={conversationMetaByUserId[user.userId]}
            onStartChat={onStartChat}
            formatLastSeen={formatLastSeen}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsList;
