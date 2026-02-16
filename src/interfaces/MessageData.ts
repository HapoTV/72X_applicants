// src/interfaces/MessageData.ts
export interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO_CALL_INVITE' | 'AUDIO_CALL_INVITE';
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface MessageSendRequest {
  content: string;
  senderId: string;
  receiverId: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO_CALL_INVITE' | 'AUDIO_CALL_INVITE';
}

export interface Conversation {
  conversationId: string;
  user1Id: string;
  user1Name: string;
  user1Email: string;
  user2Id: string;
  user2Name: string;
  user2Email: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  onClose: () => void;
  isOpen: boolean;
}