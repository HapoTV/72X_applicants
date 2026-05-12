// src/pages/admin/AdminNotifications.tsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Send, 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationService from '../../services/NotificationService';
import type { 
  Notification, 
  CreateNotificationRequest
} from '../../services/NotificationService';
import { useAuth } from '../../context/AuthContext';
import {
  CreateNotificationModal,
  NotificationManagementHeader,
  NotificationsList,
} from './components/AdminNotificationComponents';

const formatNotificationTime = (timestamp: string) => {
  return NotificationService.formatTimestamp(timestamp);
};

const getInitialNotificationFormData = (isSuperAdmin: boolean, userOrganisation?: string | null): CreateNotificationRequest => {
  return {
    title: '',
    message: '',
    type: 'INFO',
    targetOrganisation: !isSuperAdmin ? (userOrganisation ?? undefined) : undefined
  };
};

const AdminNotifications: React.FC = () => {
  const { user, isSuperAdmin, userOrganisation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateNotificationRequest>(() => {
    return getInitialNotificationFormData(isSuperAdmin, userOrganisation);
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Get all notifications for this user (admin sees all their created + received)
      const data = await NotificationService.getUserNotifications(false);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCreateNotification = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);
    
    try {
      // Validate form
      if (!formData.title || !formData.message) {
        setCreateError('Title and message are required');
        return;
      }

      let payload: CreateNotificationRequest = { ...formData };

      // For regular admins, ensure organisation is set
      if (!isSuperAdmin && !payload.targetOrganisation) {
        payload = { ...payload, targetOrganisation: userOrganisation ?? undefined };
      }
      
      await NotificationService.createNotification(payload);
      
      // Show success message
      setCreateSuccess(true);
      
      // Close form after 2 seconds
      setTimeout(() => {
        setShowCreateForm(false);
        setCreateSuccess(false);
        // Refresh notifications
        fetchNotifications();
        // Reset form
        setFormData(getInitialNotificationFormData(isSuperAdmin, userOrganisation));
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating notification:', error);
      setCreateError(error.message || 'Failed to create notification');
    }
  }, [formData, isSuperAdmin, userOrganisation, fetchNotifications]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await NotificationService.deleteNotification(id);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsRead([id], true);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [fetchNotifications]);

  const handleCloseCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setCreateError(null);
    setCreateSuccess(false);
  }, []);

  // Check if user has admin access
  const effectiveRole = (user?.role || localStorage.getItem('userRole') || '').toUpperCase();
  if (!effectiveRole || (effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPER_ADMIN' && effectiveRole !== 'COC_ADMIN')) {
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

  const backToDashboardPath = useMemo(() => {
    const isCocAdminPath = location.pathname.startsWith('/cocadmin/');
    return isCocAdminPath ? '/cocadmin/dashboard/applicants' : '/admin/dashboard/applicants';
  }, [location.pathname]);

  return (
    <div className="space-y-6 animate-fade-in">
      <NotificationManagementHeader
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        onBack={() => navigate(backToDashboardPath)}
      />

      {/* Create Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Create Notification
        </button>
      </div>

      <CreateNotificationModal
        isOpen={showCreateForm}
        isSuperAdmin={isSuperAdmin}
        formData={formData}
        createSuccess={createSuccess}
        createError={createError}
        onClose={handleCloseCreateForm}
        onSubmit={handleCreateNotification}
        onFormChange={setFormData}
      />

      <NotificationsList
        loading={loading}
        notifications={notifications}
        currentUserId={user?.userId}
        formatNotificationTime={formatNotificationTime}
        onMarkAsRead={markAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminNotifications;