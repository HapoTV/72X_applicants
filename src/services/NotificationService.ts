// src/services/NotificationService.ts
import axiosClient from '../api/axiosClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ANNOUNCEMENT' | 'UPDATE' | 'ALERT' | 'MAINTENANCE';
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
  read: boolean;
  actionUrl?: string;
  targetOrganisation?: string; // NEW
  timestamp: string;
  createdAt: string;
  userId?: string;
  sentAt?: string;
  scheduledFor?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ANNOUNCEMENT' | 'UPDATE' | 'ALERT' | 'MAINTENANCE';
  status?: 'DRAFT' | 'SCHEDULED' | 'SENT';
  actionUrl?: string;
  scheduledFor?: string;
  broadcast?: boolean;
  targetOrganisation?: string; // NEW: Target specific organisation
  userIds?: string[];
  subscriptionTypes?: Array<'START_UP' | 'ESSENTIAL' | 'PREMIUM'>;
  userRoles?: string[];
  targetAdmins?: boolean;
  targetAllUsers?: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  organisation?: string; // NEW
  isSuperAdmin?: boolean; // NEW
}

export interface MarkAsReadRequest {
  ids: string[];
  read: boolean;
}

export interface NotificationStats {
  totalNotifications: number;
  totalUnread: number;
  notificationsByType: Record<string, number>;
  notificationsByStatus: Record<string, number>;
  broadcastNotifications: number;
  userSpecificNotifications: number;
  recentNotificationsCount: number;
  organisation?: string; // NEW
  isSuperAdmin?: boolean; // NEW
}

class NotificationService {
  private baseURL = '/notifications';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ==================== USER METHODS ====================
  
  async getUserNotifications(unreadOnly: boolean = false): Promise<NotificationResponse> {
    try {
      const response = await axiosClient.get(`${this.baseURL}`, {
        params: { unreadOnly },
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(ids: string[], read: boolean = true): Promise<void> {
    try {
      const request: MarkAsReadRequest = { ids, read };
      await axiosClient.put(`${this.baseURL}/mark-read`, request, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axiosClient.put(`${this.baseURL}/mark-all-read`, {}, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await axiosClient.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // ==================== ADMIN METHODS ====================
  
  async createNotification(request: CreateNotificationRequest): Promise<Notification[]> {
    try {
      console.log('Sending create notification request:', request);
      const response = await axiosClient.post(`${this.baseURL}/admin/create`, request, {
        headers: this.getAuthHeader()
      });
      console.log('Create notification response:', response.data);
      return response.data.notifications || [];
    } catch (error: any) {
      console.error('Error creating notification:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async getAllNotifications(status?: string): Promise<{ notifications: Notification[], organisation?: string, isSuperAdmin?: boolean }> {
    try {
      const url = status 
        ? `${this.baseURL}/admin/all?status=${status}`
        : `${this.baseURL}/admin/all`;
      const response = await axiosClient.get(url, {
        headers: this.getAuthHeader()
      });
      return {
        notifications: response.data.notifications || [],
        organisation: response.data.organisation,
        isSuperAdmin: response.data.isSuperAdmin
      };
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  }

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admin/stats`, {
        headers: this.getAuthHeader()
      });
      return response.data.stats || {};
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================
  
  getTypeColor(type: string): string {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'ERROR':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'ANNOUNCEMENT':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'ALERT':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'MAINTENANCE':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'UPDATE':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'INFO':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  getTypeIcon(type: string): React.ReactNode {
    switch (type) {
      case 'SUCCESS':
        return '✓';
      case 'WARNING':
        return '⚠';
      case 'ERROR':
        return '✗';
      case 'ANNOUNCEMENT':
        return '📢';
      case 'ALERT':
        return '🚨';
      case 'MAINTENANCE':
        return '🔧';
      case 'UPDATE':
        return '🔄';
      case 'INFO':
      default:
        return 'ℹ';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
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
  }
}

export default new NotificationService();