// src/pages/adminDashboard/AdminNotifications.tsx
import React, { useState } from 'react';
import { Bell, Plus, Trash2, Edit, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'update' | 'alert' | 'maintenance';
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: Date;
  scheduledFor?: Date;
  sentAt?: Date;
}

interface CreateNotificationForm {
  title: string;
  message: string;
  type: 'announcement' | 'update' | 'alert' | 'maintenance';
  recipientType: 'all' | 'specific';
  recipients: string[];
  scheduleNow: boolean;
  scheduledTime?: string;
}

const AdminNotifications: React.FC = () => {
  
  const [notifications, setNotifications] = useState<NotificationRecord[]>([

    
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateNotificationForm>({
    title: '',
    message: '',
    type: 'announcement',
    recipientType: 'all',
    recipients: [],
    scheduleNow: true,
    scheduledTime: '',
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'update':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-50 border-blue-200';
      case 'update':
        return 'bg-green-50 border-green-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'maintenance':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateNotification = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newNotification: NotificationRecord = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      recipientCount: formData.recipientType === 'all' ? 5320 : formData.recipients.length,
      status: formData.scheduleNow ? 'sent' : 'scheduled',
      createdAt: new Date(),
      sentAt: formData.scheduleNow ? new Date() : undefined,
      scheduledFor: !formData.scheduleNow && formData.scheduledTime ? new Date(formData.scheduledTime) : undefined,
    };

    setNotifications(prev => [newNotification, ...prev]);
    resetForm();
    setShowCreateForm(false);
    alert(`Notification ${formData.scheduleNow ? 'sent' : 'scheduled'} successfully!`);
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      recipientType: 'all',
      recipients: [],
      scheduleNow: true,
      scheduledTime: '',
    });
  };

  

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
          <p className="text-gray-600 mt-1">Create and manage user notifications, announcements, and updates</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Notification</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Notification</h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Feature Available"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your notification message..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="announcement">Announcement</option>
                <option value="update">Update</option>
                <option value="alert">Alert</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Recipients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={formData.recipientType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recipientType: e.target.value as 'all' | 'specific',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Users (5,320)</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>

              {formData.recipientType === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Recipients
                  </label>
                  <select
                    multiple
                    value={formData.recipients}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipients: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="premium">Premium Users (1,200)</option>
                    <option value="essential">Essential Users (2,100)</option>
                    <option value="trial">Trial Users (2,020)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="border-t pt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.scheduleNow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduleNow: e.target.checked,
                      scheduledTime: '',
                    })
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Send Now</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck to schedule for a later time
              </p>
            </div>

            {!formData.scheduleNow && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduledTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleCreateNotification}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
                <span>{formData.scheduleNow ? 'Send Notification' : 'Schedule Notification'}</span>
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${getTypeColor(
                notification.type
              )} hover:shadow-md`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 pt-1">{getTypeIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            notification.status
                          )}`}
                        >
                          {notification.status.charAt(0).toUpperCase() +
                            notification.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                        <span>📊 {notification.recipientCount.toLocaleString()} recipients</span>
                        <span>📅 Created: {formatDate(notification.createdAt)}</span>
                        {notification.status === 'sent' && notification.sentAt && (
                          <span>✓ Sent: {formatDate(notification.sentAt)}</span>
                        )}
                        {notification.status === 'scheduled' && notification.scheduledFor && (
                          <span>⏰ Scheduled: {formatDate(notification.scheduledFor)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {notification.status === 'draft' && (
                    <button
                      onClick={() => {
                        setShowCreateForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications created</h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first notification to communicate with users
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Notification</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Sent</p>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.status === 'sent').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Scheduled</p>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Drafts</p>
          <p className="text-2xl font-bold text-gray-900">
            {notifications.filter(n => n.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Recipients</p>
          <p className="text-2xl font-bold text-gray-900">
            {notifications
              .filter(n => n.status === 'sent')
              .reduce((sum, n) => sum + n.recipientCount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
