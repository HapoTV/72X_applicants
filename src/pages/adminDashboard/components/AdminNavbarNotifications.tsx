import type React from 'react';
import { Bell, BellRing } from 'lucide-react';
import NotificationPopup from '../../../components/NotificationPopup';

interface AdminNavbarNotificationsProps {
  unreadCount: number;
  notificationPopupOpen: boolean;
  notificationButtonRef: React.RefObject<HTMLButtonElement | null>;
  onToggle: (event: React.MouseEvent) => void;
  onClose: () => void;
}

export function AdminNavbarNotifications({
  unreadCount,
  notificationPopupOpen,
  notificationButtonRef,
  onToggle,
  onClose,
}: AdminNavbarNotificationsProps) {
  return (
    <>
      <button
        ref={notificationButtonRef}
        onClick={onToggle}
        className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        title="Notifications"
      >
        {unreadCount > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPopup
        isOpen={notificationPopupOpen}
        onClose={onClose}
        anchorEl={notificationButtonRef as React.RefObject<HTMLElement>}
      />
    </>
  );
}
