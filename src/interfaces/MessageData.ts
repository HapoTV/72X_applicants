<<<<<<< HEAD
=======
// src/interfaces/MessageData.ts
>>>>>>> caaa3d1841a66dee031dc2aec0bf8a81bac8f137
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

export interface UserMentorshipItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  expertise: string[];
  experience?: string;
  background?: string;
  rating?: number;
  sessionsCompleted?: number;
  isAvailable: boolean;
  profileImageUrl?: string;
  bio?: string;
  yearsOfExperience?: number;
  specialization?: string;
  menteeCount?: number;
}