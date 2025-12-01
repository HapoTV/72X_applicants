// src/interfaces/CommunityData.ts

// ==================== DISCUSSIONS ====================
export interface Discussion {
  discussionId: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  replies: number;
  likes: number;
  shares?: number;
  views?: number;
  isHot?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
}

export interface DiscussionFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export interface AdminDiscussionItem {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  replies: number;
  likes: number;
  shares?: number;
  views?: number;
  isHot?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  createdAt?: string;
  createdBy: string;
}

export interface UserDiscussionItem {
  id: string;
  title: string;
  preview: string;
  author: string;
  authorAvatar?: string;
  category: string;
  categoryName?: string;
  replies: number;
  likes: number;
  timeAgo?: string;
  isHot?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
}

// ==================== NETWORKING EVENTS ====================
export interface NetworkingEvent {
  eventId: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
  duration?: string;
  type: string;
  location?: string;
  isVirtual?: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  price?: string;
  isFree?: boolean;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  agenda?: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  type: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  price: string;
  isFree: boolean;
  tags: string;
  agenda: string;
  organizerName: string;
  organizerEmail: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: string;
  type: string;
  location?: string;
  isVirtual?: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  price?: string;
  isFree?: boolean;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  agenda?: string[];
  createdAt?: string;
  createdBy: string;
}

export interface UserEventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
  isVirtual?: boolean;
  isFree?: boolean;
  price?: string;
  formattedDate?: string;
  isUpcoming?: boolean;
  isPast?: boolean;
  spotsLeft?: number;
}

// ==================== CATEGORIES ====================
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  discussionCount?: number;
}

// ==================== COMMUNITY STATS ====================
export interface CommunityStats {
  totalMembers: number;
  activeDiscussions: number;
  totalMentors: number;
  monthlyActiveUsers?: number;
  newMembersThisMonth?: number;
  totalEvents?: number;
  upcomingEvents?: number;
}

// ==================== API RESPONSES ====================
export interface DiscussionApiResponse {
  discussionId: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  replies: number;
  likes: number;
  shares?: number;
  views?: number;
  isHot?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
}

export interface EventApiResponse {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: string;
  type: string;
  location?: string;
  isVirtual?: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  price?: string;
  isFree?: boolean;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  agenda?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
}

// ==================== REQUEST PAYLOADS ====================
export interface DiscussionRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdBy: string;
}

export interface EventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: string;
  type: string;
  location?: string;
  isVirtual?: boolean;
  maxAttendees?: number;
  price?: string;
  isFree?: boolean;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  agenda?: string[];
  createdBy: string;
}

// ==================== REPLY INTERFACES ====================
export interface DiscussionReply {
  replyId: string;
  discussionId: string;
  content: string;
  author: string;
  authorAvatar?: string;
  likes: number;
  isAnswer?: boolean;
  createdAt?: string;
  createdBy: string;
}

export interface ReplyFormData {
  content: string;
  isAnswer?: boolean;
}

export interface ReplyRequest {
  content: string;
  discussionId: string;
  isAnswer?: boolean;
  createdBy: string;
}
