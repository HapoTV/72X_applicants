// src/services/MessageServices.ts
import axiosClient from '../api/axiosClient';
import type { Message, MessageSendRequest, Conversation } from '../interfaces/MessageData';
import type { User } from '../interfaces/UserData';

class MessageServices {
  
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getCurrentUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user.userId || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return '';
  }

  // Send a message
  async sendMessage(messageData: MessageSendRequest): Promise<Message> {
    try {
      const senderId = this.getCurrentUserId();
      const messageRequest = {
        ...messageData,
        senderId: senderId
      };
      
      const response = await axiosClient.post('/messaging/send', messageRequest, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages between two users
  async getMessagesBetweenUsers(receiverId: string): Promise<Message[]> {
    try {
      const response = await axiosClient.get(`/messaging/messages/${receiverId}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get conversations for current user
  async getUserConversations(): Promise<Conversation[]> {
    try {
      const response = await axiosClient.get('/messaging/conversations', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(senderId: string): Promise<void> {
    try {
      await axiosClient.post(`/messaging/mark-read/${senderId}`, {}, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count for current user
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosClient.get('/messaging/unread-count', {
        headers: this.getAuthHeader()
      });
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Get recent messages for current user
  async getRecentMessages(limit: number = 10): Promise<Message[]> {
    try {
      const response = await axiosClient.get('/messaging/recent', {
        params: { limit },
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }
  }

  // Get all users for chat
  async getChatUsers(): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat users:', error);
      // If endpoint doesn't exist, return empty array
      return [];
    }
  }

  // Search users for chat 
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER', {
        params: { query: searchTerm },
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      // If endpoint doesn't exist, return empty array
      return [];
    }
  }

  // Alternative method to get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await axiosClient.get(`/users/${userId}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}

export default new MessageServices();