import { useCallback, useEffect, useState } from 'react';
import NotificationService from '../../../services/NotificationService';

export function useAdminNavbarNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      try {
        const notifications = await NotificationService.getUserNotifications(true);
        setUnreadCount(notifications.length);
      } catch (fallbackError) {
        console.error('Error fetching unread count:', fallbackError);
      }
    }
  }, []);

  useEffect(() => {
    void fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    const handleNotificationsUpdated = () => {
      void fetchUnreadCount();
    };

    window.addEventListener('notifications-updated', handleNotificationsUpdated as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', handleNotificationsUpdated as EventListener);
    };
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    notificationPopupOpen,
    setNotificationPopupOpen,
  };
}
