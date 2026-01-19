// src/interfaces/MessageInterface.ts
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
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  userProfileImage?: string;
}

export interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  onClose: () => void;
  isOpen: boolean;
}