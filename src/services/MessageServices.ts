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
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return '';
  }

  async sendMessage(messageData: MessageSendRequest): Promise<Message> {
    try {
      const senderId = this.getCurrentUserId();
      const messageRequest = {
        content: messageData.content,
        senderId: senderId,
        receiverId: messageData.receiverId,
        messageType: messageData.messageType || 'TEXT'
      };
      
      console.log('Sending message request:', messageRequest);
      
      const response = await axiosClient.post('/messaging/send', messageRequest, {
        headers: this.getAuthHeader()
      });
      
      console.log('Send message response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessagesBetweenUsers(receiverId: string): Promise<Message[]> {
    try {
      const currentUserId = this.getCurrentUserId();
      console.log('Fetching messages between:', currentUserId, 'and', receiverId);
      
      const response = await axiosClient.get(`/messaging/messages/${receiverId}`, {
        headers: this.getAuthHeader()
      });
      
      console.log('Messages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async getUserConversations(): Promise<Conversation[]> {
    try {
      console.log('Fetching conversations...');
      const response = await axiosClient.get('/messaging/conversations', {
        headers: this.getAuthHeader()
      });
      
      console.log('Conversations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async markMessagesAsRead(senderId: string): Promise<void> {
    try {
      console.log('Marking messages as read from sender:', senderId);
      await axiosClient.post(`/messaging/mark-read/${senderId}`, {}, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

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

  async getChatUsers(): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER', {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat users:', error);
      return [];
    }
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER', {
        params: { query: searchTerm },
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await axiosClient.get(`/users/${userId}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}

export default new MessageServices();
