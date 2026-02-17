// src/pages/admin/AdminNotifications.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Send, 
  Calendar,
  Users,
  Filter,
  BarChart3,
  Building2,
  Crown
} from 'lucide-react';
import NotificationService from '../../../services/NotificationService';
import type { 
  Notification, 
  CreateNotificationRequest,
  NotificationStats 
} from '../../../services/NotificationService';
import { useAuth } from '../../../context/AuthContext';

const AdminNotifications: React.FC = () => {
  const { user, isSuperAdmin, userOrganisation } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'sent' | 'scheduled' | 'draft'>('all');
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    type: 'INFO',
    broadcast: false,
    targetAdmins: false,
    targetAllUsers: false,
    subscriptionTypes: [],
    userRoles: [],
    targetOrganisation: !isSuperAdmin ? userOrganisation : undefined // Default to user's organisation for regular admins
  });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filterType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let data: Notification[];
      
      if (filterType === 'all') {
        const response = await NotificationService.getAllNotifications();
        data = response.notifications;
      } else if (filterType === 'unread') {
        // Filter unread from all notifications
        const response = await NotificationService.getAllNotifications();
        data = response.notifications.filter(n => !n.read);
      } else {
        const response = await NotificationService.getAllNotifications(filterType.toUpperCase());
        data = response.notifications;
      }
      
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await NotificationService.getNotificationStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For regular admins, ensure organisation is set
      if (!isSuperAdmin && !formData.targetOrganisation) {
        formData.targetOrganisation = userOrganisation;
      }
      
      await NotificationService.createNotification(formData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        message: '',
        type: 'INFO',
        broadcast: false,
        targetAdmins: false,
        targetAllUsers: false,
        subscriptionTypes: [],
        userRoles: [],
        targetOrganisation: !isSuperAdmin ? userOrganisation : undefined
      });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await NotificationService.deleteNotification(id);
        fetchNotifications();
        fetchStats();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
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

  const formatTime = (timestamp: string) => {
    return NotificationService.formatTimestamp(timestamp);
  };

  // Check if user has admin access (ADMIN or SUPER_ADMIN)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
            ? 'Manage system notifications for all organisations' 
            : `Manage notifications for ${userOrganisation || 'your organisation'}`}
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUnread}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Broadcast</p>
                <p className="text-2xl font-bold text-gray-900">{stats.broadcastNotifications}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Specific</p>
                <p className="text-2xl font-bold text-gray-900">{stats.userSpecificNotifications}</p>
              </div>
              <Filter className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            {/* Organisation Filter (Super Admin only) */}
            {isSuperAdmin && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Organisation
                </label>
                <select
                  value={formData.targetOrganisation || ''}
                  onChange={(e) => setFormData({ ...formData, targetOrganisation: e.target.value || undefined })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Organisations</option>
                  <option value="TechCorp">TechCorp</option>
                  <option value="InnovateLabs">InnovateLabs</option>
                  <option value="StartupHub">StartupHub</option>
                </select>
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      {/* Create Notification Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Notification</h2>
            
            <form onSubmit={handleCreateNotification} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'DRAFT'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="SENT">Send Now</option>
                  </select>
                </div>
              </div>

              {/* Organisation Targeting (Super Admin only) */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Organisation
                  </label>
                  <input
                    type="text"
                    value={formData.targetOrganisation || ''}
                    onChange={(e) => setFormData({ ...formData, targetOrganisation: e.target.value })}
                    placeholder="Leave empty for all organisations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If specified, only users in this organisation will receive the notification
                  </p>
                </div>
              )}

              {/* Scheduling */}
              {formData.status === 'SCHEDULED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Action URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.actionUrl || ''}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              {/* Target Selection */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
                
                <div className="space-y-3">
                  {/* Broadcast */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.broadcast}
                      onChange={(e) => setFormData({ ...formData, broadcast: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Broadcast (All users in organisation)</span>
                  </label>

                  {/* Target Admins */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetAdmins}
                      onChange={(e) => setFormData({ ...formData, targetAdmins: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Admin Users Only</span>
                  </label>

                  {/* Target All Users */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetAllUsers}
                      onChange={(e) => setFormData({ ...formData, targetAllUsers: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">All Users (Individual notifications)</span>
                  </label>

                  {/* Subscription Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subscription Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['START_UP', 'ESSENTIAL', 'PREMIUM'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.subscriptionTypes?.includes(type as any)}
                            onChange={(e) => {
                              const current = formData.subscriptionTypes || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, subscriptionTypes: [...current, type as any] });
                              } else {
                                setFormData({ ...formData, subscriptionTypes: current.filter(t => t !== type) });
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-1 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* User Roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Roles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['ADMIN', 'USER', 'SUPER_ADMIN'].map((role) => (
                        <label key={role} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.userRoles?.includes(role)}
                            onChange={(e) => {
                              const current = formData.userRoles || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, userRoles: [...current, role] });
                              } else {
                                setFormData({ ...formData, userRoles: current.filter(r => r !== role) });
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-1 text-sm text-gray-700">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Create Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${getTypeColor(notification.type)} hover:shadow-md`}
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
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {notification.status}
                        </span>
                        {!notification.read && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                            Unread
                          </span>
                        )}
                        {notification.targetOrganisation && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {notification.targetOrganisation}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2 flex-wrap gap-2">
                        <span>Created: {formatTime(notification.createdAt)}</span>
                        {notification.sentAt && (
                          <span>Sent: {formatTime(notification.sentAt)}</span>
                        )}
                        {notification.userId ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                            User Specific
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded">
                            Broadcast
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(notification.id)}
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
              No notifications found
            </h3>
            <p className="text-gray-600">
              {filterType === 'unread'
                ? 'No unread notifications'
                : 'No notifications match your filter'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;