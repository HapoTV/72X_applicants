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
  targetOrganisation?: string;
  timestamp: string;
  createdAt: string;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
  organisation?: string;
  createdByUserId?: string;
  createdByUserEmail?: string;
  createdByUserName?: string;
  isBroadcast?: boolean;
  sentAt?: string;
  scheduledFor?: string;
  readAt?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ANNOUNCEMENT' | 'UPDATE' | 'ALERT' | 'MAINTENANCE';
  targetOrganisation?: string;
}

export interface MarkAsReadRequest {
  ids: string[];
  read: boolean;
}

class NotificationService {
  private baseURL = '/notifications';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ==================== USER METHODS ====================
  
  async getUserNotifications(unreadOnly: boolean = false): Promise<Notification[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}`, {
        params: { unreadOnly },
        headers: this.getAuthHeader()
      });
      // The backend returns a list directly
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  async markAsRead(ids: string[], read: boolean = true): Promise<void> {
    try {
      // Use the correct endpoint for marking individual notifications as read
      // Since the backend expects a single notification ID per request
      for (const id of ids) {
        await axiosClient.put(`${this.baseURL}/${id}/read`, {}, {
          headers: this.getAuthHeader()
        });
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axiosClient.put(`${this.baseURL}/read-all`, {}, {
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

  async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/unread/count`, {
        headers: this.getAuthHeader()
      });
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // ==================== ADMIN METHODS ====================
  
  async createNotification(request: CreateNotificationRequest): Promise<void> {
    try {
      console.log('Sending create notification request:', request);
      
      // Determine which endpoint to use based on targetOrganisation
      if (request.targetOrganisation) {
        // Use the organisation endpoint (works for ADMIN and SUPER_ADMIN)
        const orgRequest = {
          organisation: request.targetOrganisation,
          title: request.title,
          message: request.message,
          type: request.type
        };
        
        console.log('Using organisation endpoint with data:', orgRequest);
        await axiosClient.post(`${this.baseURL}/organisation`, orgRequest, {
          headers: this.getAuthHeader()
        });
      } else {
        // Use the all-users endpoint (SUPER_ADMIN only)
        const globalRequest = {
          title: request.title,
          message: request.message,
          type: request.type
        };
        
        console.log('Using global endpoint with data:', globalRequest);
        await axiosClient.post(`${this.baseURL}/all-users`, globalRequest, {
          headers: this.getAuthHeader()
        });
      }
      
      console.log('Notification created successfully');
    } catch (error: any) {
      console.error('Error creating notification:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
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

  getTypeIcon(type: string): string {
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
    if (!timestamp) return '';
    
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