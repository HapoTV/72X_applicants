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

  private parseUsersResponse(data: unknown): User[] {
    if (Array.isArray(data)) return data;

    if (data && typeof data === 'object') {
      const payload = data as Record<string, unknown>;

      if (Array.isArray(payload.data)) return payload.data as User[];
      if (Array.isArray(payload.users)) return payload.users as User[];
      if (Array.isArray(payload.result)) return payload.result as User[];
      if (Array.isArray(payload.payload)) return payload.payload as User[];
      if (payload.data && typeof payload.data === 'object') {
        const nested = payload.data as Record<string, unknown>;
        if (Array.isArray(nested.users)) return nested.users as User[];
        if (Array.isArray(nested.result)) return nested.result as User[];
      }
    }

    return [];
  }

  // Send a message
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

  // Get messages between two users
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

  // Get conversations for current user
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

  // Mark messages as read
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
    const endpoints = [
      '/users/role/USER',
      '/users/role/user',
      '/users?role=USER',
      '/users?role=user',
    ];

    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const response = await axiosClient.get(endpoint, {
          headers: this.getAuthHeader(),
        });

        const parsedUsers = this.parseUsersResponse(response.data);
        const isWrappedResponse =
          response.data &&
          typeof response.data === 'object' &&
          (Array.isArray((response.data as any).data) ||
            Array.isArray((response.data as any).users) ||
            Array.isArray((response.data as any).result) ||
            Array.isArray((response.data as any).payload));

        if (Array.isArray(response.data) || isWrappedResponse) {
          return parsedUsers;
        }

        if (parsedUsers.length > 0) {
          return parsedUsers;
        }

        // If the endpoint returned an object with no user array, keep trying alternates.
      } catch (error: unknown) {
        lastError = error;
        const status = (error as any)?.response?.status;
        if (status === 404 || status === 400) {
          continue;
        }
        console.error(`Error fetching chat users from ${endpoint}:`, error);
        throw error;
      }
    }

    console.error('Error fetching chat users after fallback attempts:', lastError);
    throw lastError ?? new Error('Failed to fetch chat users.');
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
      return [];
    }
  }

  // Get user by ID
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
