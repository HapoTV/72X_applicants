// src/interfaces/MentorshipData.ts
export interface Mentor {
  mentorId: string;
  name: string;
  expertise: string;
  contactInfo?: string;
  experience?: string;
  background?: string;
  availability?: string;
  rating?: number;
  sessionsCompleted?: number;
  bio?: string;
  sessionDuration?: string;
  sessionPrice?: string;
  languages?: string;
  imageUrl?: string;
  createdBy: string; // User email
  createdById?: string; // User ID who created the mentor
  createdByUserId?: string; // User ID who created the mentor (alias)
  organisation?: string; // New field: Organisation that can see this mentor
  isPublic?: boolean; // New field: If true, visible to all organisations
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorshipFormData {
  name: string;
  expertise: string;
  contactInfo: string;
  experience: string;
  background: string;
  availability: string;
  rating: number;
  sessionsCompleted: number;
  bio: string;
  sessionDuration: string;
  sessionPrice: string;
  languages: string;
  imageUrl?: string;
  organisation?: string; // New field
  isPublic?: boolean; // New field
}

export interface PeerSupportGroup {
  groupId: string;
  name: string;
  description: string;
  category: string;
  location: string;
  maxMembers: number;
  createdBy: string;  
  createdById: string; // Added: User ID of creator
  isPublic: boolean;
  isActive: boolean;
  memberCount: number;
  recentActivity?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isMember?: boolean;
  isOwner?: boolean;
  joinedAt?: string;
}

export interface PeerSupportGroupFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  maxMembers: number;
  isPublic: boolean;
  imageUrl?: string;
}

export interface GroupMember {
  memberId: string;
  groupId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
  lastActiveAt?: string;
}

export interface Connection {
  id: string;
  userId: string;
  name: string;
  email: string;
  type: 'Mentor' | 'Peer' | 'Mentee';
  lastContact: string;
  nextSession?: string;
  status: 'Active' | 'Connected' | 'Pending' | 'Inactive';
  conversationId?: string;
  groupId?: string;
  mentorId?: string; // Added for mentor connections
}

export interface Conversation {
  conversationId: string;
  user1Id: string;
  user2Id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCountUser1?: number;
  unreadCountUser2?: number;
  createdAt: string;
  updatedAt?: string;
  user1Name?: string;
  user2Name?: string;
  user1Email?: string;
  user2Email?: string;
}

export interface Message {
  messageId: string;
  senderId: string;
  senderName?: string;
  senderEmail?: string;
  receiverId: string;
  receiverName?: string;
  receiverEmail?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO_CALL_INVITE' | 'AUDIO_CALL_INVITE';
  timestamp: string;
  isRead: boolean;
  readAt?: string;
}

export interface GroupConversation {
  groupConversationId: string;
  groupId: string;
  groupName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface GroupMessage {
  messageId: string;
  groupId: string;
  senderId: string;
  senderName?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  isRead: boolean;
}

export interface MentorMessage {
  messageId: string;
  mentorId: string;
  senderId: string;
  senderName?: string;
  senderEmail?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  isRead: boolean;
  readAt?: string;
}

export interface MentorConversation {
  conversationId: string;
  mentorId: string;
  mentorName: string;
  mentorEmail?: string;
  userId: string;
  userName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt?: string;
}