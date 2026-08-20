import type { ConnectionUser } from '../../pages/hooks/useConnections';

interface Props {
  user: ConnectionUser;
  unread: number;
}

const ConnectionAvatar: React.FC<Props> = ({ user, unread }) => {
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="relative">
      <div
        className={`w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-700 ${
          unread > 0 ? 'ring-2 ring-blue-400 ring-offset-2' : ''
        }`}
      >
        {user.profileImage ? (
          <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <span
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
          user.isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        </span>
      )}
    </div>
  );
};

export default ConnectionAvatar;
