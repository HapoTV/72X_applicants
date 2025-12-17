// src/interfaces/MentorshipData.ts
export interface Mentor {
  mentorId: string;  // Changed from mentorshipId
  name: string;      // Changed from mentorName
  expertise: string; // Changed from mentorTitle
  contactInfo?: string; // Changed from mentorEmail
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
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorshipFormData {
  name: string;           // Changed from mentorName
  expertise: string;      // Changed from expertise (array to string)
  contactInfo: string;    // Changed from mentorEmail
  experience: string;
  background: string;
  availability: string;
  rating: number;
  sessionsCompleted: number;
  bio: string;
  sessionDuration: string;
  sessionPrice: string;
  languages: string;      // Changed from array to string
  imageUrl?: string;
}

export interface PeerSupportGroup {
  groupId: string;
  name: string;
  description: string;
  category: string;
  location: string;
  maxMembers: number;
  createdBy: string;  
  isActive: boolean;
  memberCount: number;
  recentActivity: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
  isMember?: boolean;     // Added as optional
  isOwner?: boolean;      // Added as optional
  joinedAt?: string;      // Added as optional
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
  userName?: string;      // Added as optional
  userEmail?: string;     // Added as optional
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'; // Changed case
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
  groupId?: string;       // Added for group connections
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
  user1Name?: string;     // Added for display
  user2Name?: string;     // Added for display
  user1Email?: string;    // Added for display
  user2Email?: string;    // Added for display
}

export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO_CALL_INVITE' | 'AUDIO_CALL_INVITE'; // Changed case
  timestamp: string;
  isRead: boolean;
  readAt?: string;
}

// Group message would be separate if needed
export interface GroupMessage {
  messageId: string;
  groupId: string;
  senderId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  isRead: boolean;
}