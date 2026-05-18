import { BriefcaseBusiness, MapPin, Building2 } from 'lucide-react';
import type { ConnectionUser } from '../../pages/hooks/useConnections';

interface Props {
  user: ConnectionUser;
  unread: number;
  formatLastSeen: (lastSeen?: string) => string;
}

const ConnectionDetails: React.FC<Props> = ({ user, unread, formatLastSeen }) => {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`font-semibold text-gray-900 truncate ${unread > 0 ? 'text-blue-900' : ''}`}>
          {user.firstName} {user.lastName}
        </div>

        {unread > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            {unread} new
          </span>
        )}

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

      {!user.isOnline && user.lastSeen && (
        <div className="mt-1 text-xs text-gray-400">Last seen: {formatLastSeen(user.lastSeen)}</div>
      )}
    </div>
  );
};

export default ConnectionDetails;
