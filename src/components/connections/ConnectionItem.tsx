import { MessageCircle } from 'lucide-react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';
import ConnectionAvatar from './ConnectionAvatar';
import ConnectionDetails from './ConnectionDetails';

interface Props {
  user: ConnectionUser;
  meta?: { unread: number; lastMessageAt: string; lastMessage: string };
  onStartChat: (user: ConnectionUser) => void;
  formatLastSeen: (lastSeen?: string) => string;
}

const ConnectionItem: React.FC<Props> = ({ user, meta, onStartChat, formatLastSeen }) => {
  const unread = meta?.unread || 0;

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${unread > 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <ConnectionAvatar user={user} unread={unread} />
          <ConnectionDetails user={user} unread={unread} formatLastSeen={formatLastSeen} />
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
        <div className={`mt-2 text-sm ${unread > 0 ? 'text-blue-700' : 'text-gray-600'}`}>
          {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
        </div>
      )}
    </div>
  );
};

export default ConnectionItem;
