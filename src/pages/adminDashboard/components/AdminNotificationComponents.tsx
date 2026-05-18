import React from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Building2,
  Trash2,
  X,
  Crown,
  ArrowLeft
} from 'lucide-react';
import type { CreateNotificationRequest, Notification } from '../../../services/NotificationService';

const getNotificationTypeIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'WARNING':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'ERROR':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'ANNOUNCEMENT':
      return <Bell className="w-5 h-5 text-purple-500" />;
    case 'ALERT':
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case 'MAINTENANCE':
      return <Calendar className="w-5 h-5 text-gray-500" />;
    case 'UPDATE':
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    case 'INFO':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

export const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return 'bg-green-50 border-green-200';
    case 'WARNING':
      return 'bg-yellow-50 border-yellow-200';
    case 'ERROR':
      return 'bg-red-50 border-red-200';
    case 'ANNOUNCEMENT':
      return 'bg-purple-50 border-purple-200';
    case 'ALERT':
      return 'bg-orange-50 border-orange-200';
    case 'MAINTENANCE':
      return 'bg-gray-50 border-gray-200';
    case 'UPDATE':
      return 'bg-blue-50 border-blue-200';
    case 'INFO':
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

type CreateNotificationModalProps = {
  isOpen: boolean;
  isSuperAdmin: boolean;
  formData: CreateNotificationRequest;
  createSuccess: boolean;
  createError: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (next: CreateNotificationRequest) => void;
};

export function CreateNotificationModal({
  isOpen,
  isSuperAdmin,
  formData,
  createSuccess,
  createError,
  onClose,
  onSubmit,
  onFormChange,
}: CreateNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create New Notification</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {createSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">✓ Notification created successfully!</p>
          </div>
        )}

        {createError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Error: {createError}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={createSuccess}
              placeholder="e.g., System Maintenance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              required
              disabled={createSuccess}
              placeholder="Enter notification message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => onFormChange({ ...formData, type: e.target.value as CreateNotificationRequest['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={createSuccess}
            >
              <option value="INFO">Information</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="UPDATE">Update</option>
              <option value="ALERT">Alert</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Organisation</label>
              <input
                type="text"
                value={formData.targetOrganisation || ''}
                onChange={(e) => onFormChange({ ...formData, targetOrganisation: e.target.value })}
                placeholder="Leave empty for all users"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={createSuccess}
              />
              <p className="text-xs text-gray-500 mt-1">
                If specified, only users in this organisation will receive the notification
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={createSuccess}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSuccess}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSuccess ? 'Created!' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type NotificationCardProps = {
  notification: Notification;
  currentUserId?: string;
  formatNotificationTime: (timestamp: string) => string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationCard({
  notification,
  currentUserId,
  formatNotificationTime,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${getNotificationTypeColor(notification.type)} hover:shadow-md`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">{getNotificationTypeIcon(notification.type)}</div>

        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                {!notification.read && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">Unread</span>
                )}
                {notification.targetOrganisation && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {notification.targetOrganisation}
                  </span>
                )}
                {notification.isBroadcast && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600">Broadcast</span>
                )}
                {notification.createdByUserName && notification.createdByUserId === currentUserId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">Created by you</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2 flex-wrap gap-2">
                <span>Received: {formatNotificationTime(notification.timestamp)}</span>
                {notification.sentAt && <span>Sent: {formatNotificationTime(notification.sentAt)}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-2">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Mark as read"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

type NotificationManagementHeaderProps = {
  isSuperAdmin: boolean;
  userOrganisation?: string | null;
  onBack: () => void;
};

export function NotificationManagementHeader({
  isSuperAdmin,
  userOrganisation,
  onBack,
}: NotificationManagementHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Back to Admin Dashboard"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Bell className="w-8 h-8 text-primary-600" />
            <span>Notification Management</span>
          </h1>
          {!isSuperAdmin && userOrganisation && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {userOrganisation}
            </span>
          )}
          {isSuperAdmin && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Super Admin
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-600 mt-1">
        {isSuperAdmin
          ? 'Create notifications for specific organisations or all users'
          : `Create notifications for ${userOrganisation || 'your organisation'}`}
      </p>
    </div>
  );
}

type NotificationsListProps = {
  loading: boolean;
  notifications: Notification[];
  currentUserId?: string;
  formatNotificationTime: (timestamp: string) => string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationsList({
  loading,
  notifications,
  currentUserId,
  formatNotificationTime,
  onMarkAsRead,
  onDelete,
}: NotificationsListProps) {
  return (
    <div className="space-y-3">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            currentUserId={currentUserId}
            formatNotificationTime={formatNotificationTime}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-600">Create your first notification using the button above</p>
        </div>
      )}
    </div>
  );
}
