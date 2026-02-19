// src/components/NotificationPopup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Clock,
  Globe,
  Building2,
  Crown,
  X,
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';
import type { Notification } from '../services/NotificationService';
import { useAuth } from '../context/AuthContext';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: React.RefObject<HTMLElement>;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose, anchorEl }) => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, userOrganisation } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewAllHovered, setViewAllHovered] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUnreadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        anchorEl.current &&
        !anchorEl.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, anchorEl, onClose]);

  const fetchUnreadNotifications = async () => {
    try {
      setLoading(true);
      // Fetch only unread notifications
      const unreadNotifications = await NotificationService.getUserNotifications(true);
      
      // Ensure we're working with an array
      const notificationsArray = Array.isArray(unreadNotifications) ? unreadNotifications : [];
      
      // Sort by timestamp (newest first) and take first 5
      const sorted = [...notificationsArray].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setNotifications(sorted.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await NotificationService.markAsRead([notification.id], true);
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
    onClose();
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await NotificationService.markAllAsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleViewAll = () => {
    // Navigate based on user role
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || isSuperAdmin) {
      navigate('/admin/notifications');
    } else {
      navigate('/notifications');
    }
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'ANNOUNCEMENT':
        return <Bell className="w-4 h-4 text-purple-500" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'MAINTENANCE':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'UPDATE':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50';
      case 'WARNING':
        return 'bg-yellow-50';
      case 'ERROR':
        return 'bg-red-50';
      case 'ANNOUNCEMENT':
        return 'bg-purple-50';
      case 'ALERT':
        return 'bg-orange-50';
      case 'MAINTENANCE':
        return 'bg-gray-50';
      case 'UPDATE':
        return 'bg-blue-50';
      case 'INFO':
      default:
        return 'bg-blue-50';
    }
  };

  const formatTime = (timestamp: string) => {
    return NotificationService.formatTimestamp(timestamp);
  };

  const unreadCount = notifications.length;

  if (!isOpen) return null;

  const getPosition = () => {
    if (!anchorEl.current) return { top: 60, right: 20 };
    
    const rect = anchorEl.current.getBoundingClientRect();
    return {
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right
    };
  };

  const position = getPosition();

  const getPopupMaxHeight = () => {
    if (notifications.length === 0) return 'auto';
    const itemHeight = 100;
    const headerHeight = 60;
    const footerHeight = 60;
    const orgBadgeHeight = userOrganisation ? 40 : 0;
    const totalHeight = Math.min(notifications.length * itemHeight, 5 * itemHeight) + headerHeight + footerHeight + orgBadgeHeight;
    return `${Math.min(totalHeight, 500)}px`;
  };

  return (
    <div
      ref={popupRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 w-96 z-[1000] overflow-hidden animate-slide-down"
      style={{
        top: position.top,
        right: position.right,
        maxHeight: getPopupMaxHeight()
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BellRing className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Unread Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors group relative"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Organisation Badge (if applicable) */}
      {userOrganisation && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-blue-700 font-medium flex-1">
            {userOrganisation}
          </span>
          {isSuperAdmin && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Super Admin
            </span>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="overflow-y-auto" style={{ maxHeight: notifications.length > 0 ? '400px' : '200px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${getTypeColor(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                      <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.targetOrganisation && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 flex items-center gap-0.5">
                              <Building2 className="w-3 h-3" />
                              {notification.targetOrganisation}
                            </span>
                          </>
                        )}
                      </div>
                      {notification.isBroadcast && (
                        <span className="text-gray-400" title="Broadcast">
                          <Globe className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    
                    {/* Show creator info for admins (optional) */}
                    {notification.createdByUserName && isSuperAdmin && (
                      <div className="text-xs text-gray-400 mt-1">
                        From: {notification.createdByUserName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length >= 5 && (
              <div className="px-4 py-2 text-center border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing 5 of {unreadCount} unread notifications
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No unread notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleViewAll}
            onMouseEnter={() => setViewAllHovered(true)}
            onMouseLeave={() => setViewAllHovered(false)}
            className="w-full flex items-center justify-center space-x-1 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
          >
            <span>View All Notifications</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
              viewAllHovered ? 'translate-x-0.5' : ''
            }`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;