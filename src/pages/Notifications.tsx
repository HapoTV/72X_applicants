// src/pages/Notifications.tsx
import React, { useState } from 'react';
import { Bell, Trash2, Archive, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Daily Motivation Quote',
      message: 'Your daily motivation quote is ready! Check out this inspiring insight for your business journey.',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      title: 'AI Insights Available',
      message: 'New AI-generated insights about your business data are now available in the Analytics section.',
      type: 'success',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      title: 'Data Analysis Complete',
      message: 'Your data input analysis has been completed. Review the results in the Data Input page.',
      type: 'success',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      title: 'New Learning Module',
      message: 'A new advanced business strategy module has been added to your Learning path.',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '5',
      title: 'Community Post Engagement',
      message: 'Your recent post in the Community section received 5 new comments!',
      type: 'success',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredNotifications = notifications
    .filter(notif => filterType === 'all' || !notif.read)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const archiveNotification = (id: string) => {
    deleteNotification(id);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Bell className="w-8 h-8 text-primary-600" />
          <span>Notifications</span>
        </h1>
        <p className="text-gray-600 mt-1">
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
            : 'All notifications read'}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Filter
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'unread')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${
                notification.read
                  ? 'bg-white border-gray-100'
                  : `${getTypeColor(notification.type)} border`
              } hover:shadow-md`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 pt-1">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3
                        className={`font-medium text-gray-900 ${
                          !notification.read ? 'font-semibold' : ''
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {!notification.read ? (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsUnread(notification.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Mark as unread"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => archiveNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filterType === 'unread'
                ? 'You are all caught up! Mark some notifications as unread to see them here.'
                : 'You have no notifications yet. Stay tuned for updates!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
