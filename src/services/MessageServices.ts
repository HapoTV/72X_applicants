// src/services/MessageServices.ts
import axiosClient from '../api/axiosClient'; // Use the configured client
import type { Message, MessageSendRequest, Conversation } from '../interfaces/MessageData';
import type { User } from '../interfaces/UserData';

class MessageServices {
  // Send a message
  async sendMessage(messageData: MessageSendRequest): Promise<Message> {
    try {
      const response = await axiosClient.post('/messaging/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages between two users
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const response = await axiosClient.get(
        `/messaging/messages/${userId1}/${userId2}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get conversations for a user
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await axiosClient.get(`/messaging/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      await axiosClient.put('/messaging/mark-read', {
        messageIds,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await axiosClient.get(`/messaging/unread-count/${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Get all users for chat
  async getChatUsers(): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER'); // Changed endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching chat users:', error);
      throw error;
    }
  }

  // Search users for chat
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const response = await axiosClient.get('/users/role/USER', {
        params: {
          search: searchTerm,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default new MessageServices();