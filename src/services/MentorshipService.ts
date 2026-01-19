// src/services/MentorshipService.ts
import axiosClient from '../api/axiosClient';
import type { 
  Mentor,
  MentorshipFormData,
  PeerSupportGroup,
  PeerSupportGroupFormData,
  Connection,
  Conversation,
  Message,
  GroupMember,
  GroupMessage,
  GroupConversation,
  MentorMessage ,
  MentorConversation
} from '../interfaces/MentorshipData';

class MentorshipService {
  
  // ==================== MENTOR OPERATIONS ====================

  async getAllMentors(): Promise<Mentor[]> {
    try {
      const response = await axiosClient.get('/mentors');
      return response.data.map((mentor: any) => this.transformToMentor(mentor));
    } catch (error) {
      console.error('Error fetching all mentors:', error);
      return [];
    }
  }

  async createMentor(mentorData: MentorshipFormData, userEmail: string): Promise<Mentor | null> {
    try {
      const mentorRequest = this.transformToMentorRequest(mentorData);
      
      const response = await axiosClient.post('/mentors', mentorRequest, {
        params: { userEmail }
      });
      
      return this.transformToMentor(response.data);
    } catch (error) {
      console.error('Error creating mentor:', error);
      throw new Error('Failed to create mentor');
    }
  }

  async getMentorById(mentorId: string): Promise<Mentor | null> {
    try {
      const response = await axiosClient.get(`/mentors/${mentorId}`);
      return this.transformToMentor(response.data);
    } catch (error) {
      console.error('Error fetching mentor by ID:', error);
      return null;
    }
  }

  async getMentorsByExpertise(expertise: string): Promise<Mentor[]> {
    try {
      const response = await axiosClient.get(`/mentors/expertise/${encodeURIComponent(expertise)}`);
      return response.data.map((mentor: any) => this.transformToMentor(mentor));
    } catch (error) {
      console.error('Error fetching mentors by expertise:', error);
      return [];
    }
  }

  async searchMentors(query: string): Promise<Mentor[]> {
    try {
      const response = await axiosClient.get('/mentors/search', {
        params: { query }
      });
      return response.data.map((mentor: any) => this.transformToMentor(mentor));
    } catch (error) {
      console.error('Error searching mentors:', error);
      return [];
    }
  }

  async deleteMentor(mentorId: string, userEmail: string): Promise<boolean> {
    try {
      await axiosClient.delete(`/mentors/${mentorId}`, {
        params: { userEmail }
      });
      return true;
    } catch (error) {
      console.error('Error deleting mentor:', error);
      throw new Error('Failed to delete mentor');
    }
  }

  // ==================== PEER SUPPORT GROUPS ====================

  async getPeerSupportGroups(userId: string): Promise<PeerSupportGroup[]> {
    try {
      console.log('Fetching peer groups for user:', userId);
      
      if (!userId || userId.trim() === '') {
        console.error('Invalid userId:', userId);
        return [];
      }
      
      const response = await axiosClient.get('/peer-support/groups/public', {
        params: { 
          currentUserId: userId 
        }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        return [];
      }
      
      return response.data.map((group: any) => this.transformToPeerGroup(group));
      
    } catch (error: any) {
      console.error('Error fetching peer groups:', error);
      return [];
    }
  }

  async getGroupsByCategory(category: string, userId: string): Promise<PeerSupportGroup[]> {
    try {
      const response = await axiosClient.get(`/peer-support/groups/category/${encodeURIComponent(category)}`, {
        params: { currentUserId: userId }
      });
      return response.data.map((group: any) => this.transformToPeerGroup(group));
    } catch (error) {
      console.error('Error fetching groups by category:', error);
      return [];
    }
  }

  async getMyGroups(userId: string): Promise<PeerSupportGroup[]> {
    try {
      const response = await axiosClient.get('/peer-support/groups/my', {
        params: { userId }
      });
      return response.data.map((group: any) => this.transformToPeerGroup(group));
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  }

  async createPeerGroup(groupData: PeerSupportGroupFormData, creatorId: string): Promise<PeerSupportGroup> {
    try {
      const groupRequest = {
        ...groupData,
        maxMembers: groupData.maxMembers || 100,
        isPublic: groupData.isPublic !== false
      };
      
      const response = await axiosClient.post('/peer-support/groups', groupRequest, {
        params: { creatorId }
      });
      return this.transformToPeerGroup(response.data);
    } catch (error) {
      console.error('Error creating peer group:', error);
      throw new Error('Failed to create peer group');
    }
  }

  async joinPeerGroup(groupId: string, userId: string): Promise<GroupMember> {
    try {
      const response = await axiosClient.post(`/peer-support/groups/${groupId}/join`, {
        userId
      });
      return this.transformToGroupMember(response.data);
    } catch (error) {
      console.error('Error joining peer group:', error);
      throw new Error('Failed to join peer group');
    }
  }

  async leavePeerGroup(groupId: string, userId: string): Promise<void> {
    try {
      await axiosClient.post(`/peer-support/groups/${groupId}/leave`, {
        userId
      });
    } catch (error) {
      console.error('Error leaving peer group:', error);
      throw new Error('Failed to leave peer group');
    }
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const response = await axiosClient.get(`/peer-support/groups/${groupId}/members`);
      return response.data.map((member: any) => this.transformToGroupMember(member));
    } catch (error) {
      console.error('Error fetching group members:', error);
      return [];
    }
  }

  async searchGroups(query: string, userId: string): Promise<PeerSupportGroup[]> {
    try {
      const response = await axiosClient.get('/peer-support/groups/search', {
        params: { query, currentUserId: userId }
      });
      return response.data.map((group: any) => this.transformToPeerGroup(group));
    } catch (error) {
      console.error('Error searching groups:', error);
      return [];
    }
  }

  async getTrendingGroups(userId: string): Promise<PeerSupportGroup[]> {
    try {
      const response = await axiosClient.get('/peer-support/groups/trending', {
        params: { currentUserId: userId }
      });
      return response.data.map((group: any) => this.transformToPeerGroup(group));
    } catch (error) {
      console.error('Error fetching trending groups:', error);
      return [];
    }
  }

  // ==================== MESSAGING & CONNECTIONS ====================

  async sendMessage(messageData: Message): Promise<Message> {
    try {
      if (!messageData.senderId || !messageData.receiverId) {
        throw new Error('Sender and receiver IDs are required');
      }

      const messageRequest = {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.content,
        messageType: messageData.messageType || 'TEXT'
      };
      
      const response = await axiosClient.post('/messaging/send', messageRequest);
      return this.transformToMessage(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await axiosClient.get(`/messaging/conversations/${userId}`);
      return response.data.map((conv: any) => this.transformToConversation(conv));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    try {
      if (!userId1 || !userId2 || userId1 === 'undefined' || userId2 === 'undefined') {
        console.error('Invalid user IDs:', userId1, userId2);
        return [];
      }
      
      const response = await axiosClient.get(`/messaging/messages/${userId1}/${userId2}`);
      return response.data.map((msg: any) => this.transformToMessage(msg));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    try {
      await axiosClient.post(`/messaging/mark-read/${senderId}/${receiverId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const response = await axiosClient.get(`/messaging/unread-count/${userId}`);
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async getRecentMessages(userId: string, limit: number = 10): Promise<Message[]> {
    try {
      const response = await axiosClient.get(`/messaging/recent/${userId}`, {
        params: { limit }
      });
      return response.data.map((msg: any) => this.transformToMessage(msg));
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      return [];
    }
  }

  // ==================== USER LOOKUP METHODS ====================

  async getUserIdFromEmail(email: string): Promise<string | null> {
    try {
      console.log('Looking up user by email:', email);
      const response = await axiosClient.get(`/users/email/${encodeURIComponent(email)}`);
      
      // Extract user ID from response
      const userId = response.data.userId || response.data.id || response.data.user_id;
      
      if (!userId) {
        console.error('User ID not found in response:', response.data);
        return null;
      }
      
      console.log('Found user ID:', userId, 'for email:', email);
      return userId;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('User not found with email:', email);
      } else {
        console.error('Error getting user ID from email:', error);
      }
      return null;
    }
  }

  async getUserIdFromMentor(mentorId: string): Promise<string | null> {
    try {
      const mentor = await this.getMentorById(mentorId);
      if (!mentor || !mentor.createdBy) {
        return null;
      }
      
      return await this.getUserIdFromEmail(mentor.createdBy);
    } catch (error) {
      console.error('Error getting user ID from mentor:', error);
      return null;
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  private transformToMentor(apiMentor: any): Mentor {
    return {
      mentorId: apiMentor.mentorId || apiMentor.id || '',
      name: apiMentor.name || '',
      expertise: apiMentor.expertise || '',
      contactInfo: apiMentor.contactInfo || '',
      experience: apiMentor.experience || '',
      background: apiMentor.background || '',
      availability: apiMentor.availability || '',
      rating: apiMentor.rating || 4.0,
      sessionsCompleted: apiMentor.sessionsCompleted || 0,
      bio: apiMentor.bio || 'No bio available',
      sessionDuration: apiMentor.sessionDuration || '60 minutes',
      sessionPrice: apiMentor.sessionPrice || 'Free',
      languages: apiMentor.languages || '',
      imageUrl: apiMentor.imageUrl,
      createdBy: apiMentor.createdBy || apiMentor.createdByEmail || '',
      createdById: apiMentor.createdById || apiMentor.createdByUserId || '',
      createdAt: apiMentor.createdAt,
      updatedAt: apiMentor.updatedAt
    };
  }

  private transformToPeerGroup(apiGroup: any): PeerSupportGroup {
    const currentUser = this.getCurrentUser();
    const currentUserId = currentUser?.userId || '';
    
    const createdByName = apiGroup.createdByName || 'Unknown';
    const createdByEmail = apiGroup.createdByEmail || '';
    const createdById = apiGroup.createdById || apiGroup.createdByUserId || '';
    const createdBy = createdByName || createdByEmail || createdById || 'Unknown';
    const isOwner = createdById === currentUserId || apiGroup.isOwner === true;
    const isMember = apiGroup.isMember === true;
    
    return {
      groupId: apiGroup.groupId || apiGroup.id || '',
      name: apiGroup.name || '',
      description: apiGroup.description || '',
      category: apiGroup.category || 'General Business',
      location: apiGroup.location || 'Online',
      maxMembers: apiGroup.maxMembers || 100,
      createdBy: createdBy,
      createdById: createdById,
      isPublic: apiGroup.isPublic !== false,
      isActive: apiGroup.isActive !== false,
      memberCount: apiGroup.memberCount || 0,
      recentActivity: apiGroup.recentActivity || 'No recent activity',
      imageUrl: apiGroup.imageUrl,
      createdAt: apiGroup.createdAt,
      updatedAt: apiGroup.updatedAt,
      isMember: isMember,
      isOwner: isOwner,
      joinedAt: apiGroup.joinedAt
    };
  }

  private transformToGroupMember(apiMember: any): GroupMember {
    const user = apiMember.user || {};
    
    return {
      memberId: apiMember.memberId || apiMember.id || '',
      groupId: apiMember.groupId || '',
      userId: apiMember.userId || user.id || user.userId || '',
      userName: user.name || user.fullName || user.userName || 'Unknown',
      userEmail: user.email || user.userEmail || '',
      role: apiMember.role || 'MEMBER',
      joinedAt: apiMember.joinedAt,
      lastActiveAt: apiMember.lastActiveAt
    };
  }

  private transformToMessage(apiMsg: any): Message {
    const sender = apiMsg.sender || {};
    const receiver = apiMsg.receiver || {};
    
    return {
      messageId: apiMsg.messageId || apiMsg.id || '',
      senderId: sender.id || sender.userId || apiMsg.senderId || '',
      senderName: sender.name || sender.fullName || apiMsg.senderName,
      senderEmail: sender.email || apiMsg.senderEmail,
      receiverId: receiver.id || receiver.userId || apiMsg.receiverId || '',
      receiverName: receiver.name || receiver.fullName || apiMsg.receiverName,
      receiverEmail: receiver.email || apiMsg.receiverEmail,
      content: apiMsg.content || '',
      messageType: apiMsg.messageType || 'TEXT',
      timestamp: apiMsg.createdAt || apiMsg.timestamp || new Date().toISOString(),
      isRead: apiMsg.isRead || false,
      readAt: apiMsg.readAt
    };
  }

  private transformToConversation(apiConv: any): Conversation {
    const user1 = apiConv.user1 || {};
    const user2 = apiConv.user2 || {};
    
    return {
      conversationId: apiConv.conversationId || apiConv.id || '',
      user1Id: user1.id || user1.userId || apiConv.user1Id || '',
      user2Id: user2.id || user2.userId || apiConv.user2Id || '',
      lastMessage: apiConv.lastMessage,
      lastMessageAt: apiConv.lastMessageAt,
      unreadCountUser1: apiConv.unreadCountUser1 || 0,
      unreadCountUser2: apiConv.unreadCountUser2 || 0,
      createdAt: apiConv.createdAt,
      updatedAt: apiConv.updatedAt,
      user1Name: user1.name || user1.fullName || apiConv.user1Name,
      user2Name: user2.name || user2.fullName || apiConv.user2Name,
      user1Email: user1.email || apiConv.user1Email,
      user2Email: user2.email || apiConv.user2Email
    };
  }

  private transformToMentorRequest(formData: MentorshipFormData): any {
    return {
      name: formData.name,
      expertise: formData.expertise,
      contactInfo: formData.contactInfo,
      experience: formData.experience,
      background: formData.background,
      availability: formData.availability,
      rating: parseFloat(formData.rating.toString()),
      sessionsCompleted: parseInt(formData.sessionsCompleted.toString()),
      bio: formData.bio,
      sessionDuration: formData.sessionDuration,
      sessionPrice: formData.sessionPrice,
      languages: formData.languages,
      imageUrl: formData.imageUrl || this.getDefaultImage(formData.name)
    };
  }

  // ==================== UTILITY METHODS ====================

  getDefaultImage(name: string): string {
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = (nameHash % 3) + 1;
    
    const defaultImages = [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    
    return defaultImages[imageIndex];
  }

  getUserImageUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  formatDateRelative(dateString: string): string {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
        }
        return `${diffHours}h ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}w ago`;
      } else {
        return this.formatDate(dateString);
      }
    } catch (error) {
      return 'Invalid date';
    }
  }

  formatRating(rating?: number): string {
    return rating ? rating.toFixed(1) : 'N/A';
  }

  formatSessionsCount(sessions?: number): string {
    return sessions ? `${sessions} sessions` : 'No sessions';
  }

  isMentorAvailable(availability?: string): boolean {
    if (!availability) return false;
    const availableKeywords = ['available', 'open', 'accepting'];
    return availableKeywords.some(keyword => 
      availability.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  hasGroupAvailability(group: PeerSupportGroup): boolean {
    return group.memberCount < group.maxMembers;
  }

  getCurrentUser(): { userId: string; name: string; email: string } | null {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      const userData = JSON.parse(user);
      return {
        userId: userData.userId || userData.id || userData._id || '',
        name: userData.name || userData.fullName || userData.username || 'User',
        email: userData.email || ''
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }





// New Mentor Messaging Methods
async sendMentorMessage(mentorId: string, messageData: MentorMessage): Promise<MentorMessage> {
  try {
    if (!mentorId || !messageData.senderId) {
      throw new Error('Mentor ID and sender ID are required');
    }

    const messageRequest = {
      mentorId,
      senderId: messageData.senderId,
      content: messageData.content,
      messageType: messageData.messageType || 'TEXT'
    };
    
    console.log('Sending mentor message:', messageRequest);
    
    const response = await axiosClient.post('/messaging/mentor/send', messageRequest);
    return this.transformToMentorMessage(response.data);
  } catch (error) {
    console.error('Error sending mentor message:', error);
    throw new Error('Failed to send message to mentor');
  }
}

async getMentorMessages(mentorId: string, userId: string): Promise<MentorMessage[]> {
  try {
    if (!mentorId || !userId) {
      console.error('Cannot fetch messages: missing mentorId or userId');
      return [];
    }
    
    const response = await axiosClient.get(`/messaging/mentor/messages/${mentorId}/${userId}`);
    return response.data.map((msg: any) => this.transformToMentorMessage(msg));
  } catch (error) {
    console.error('Error fetching mentor messages:', error);
    return [];
  }
}

async getMentorConversations(userId: string): Promise<MentorConversation[]> {
  try {
    const response = await axiosClient.get(`/messaging/mentor/conversations/${userId}`);
    return response.data.map((conv: any) => this.transformToMentorConversation(conv));
  } catch (error) {
    console.error('Error fetching mentor conversations:', error);
    return [];
  }
}

async markMentorMessagesAsRead(mentorId: string, userId: string): Promise<void> {
  try {
    await axiosClient.post(`/messaging/mentor/mark-read/${mentorId}/${userId}`);
  } catch (error) {
    console.error('Error marking mentor messages as read:', error);
    throw new Error('Failed to mark mentor messages as read');
  }
}

// Transformation methods
private transformToMentorMessage(apiMsg: any): MentorMessage {
  const sender = apiMsg.sender || {};
  
  return {
    messageId: apiMsg.messageId || apiMsg.id || '',
    mentorId: apiMsg.mentorId || '',
    senderId: sender.id || sender.userId || apiMsg.senderId || '',
    senderName: sender.name || sender.fullName || apiMsg.senderName,
    senderEmail: sender.email || apiMsg.senderEmail,
    content: apiMsg.content || '',
    messageType: apiMsg.messageType || 'TEXT',
    timestamp: apiMsg.createdAt || apiMsg.timestamp || new Date().toISOString(),
    isRead: apiMsg.isRead || false,
    readAt: apiMsg.readAt
  };
}

private transformToMentorConversation(apiConv: any): MentorConversation {
  const mentor = apiConv.mentor || {};
  
  return {
    conversationId: apiConv.conversationId || apiConv.id || '',
    mentorId: mentor.id || mentor.mentorId || apiConv.mentorId || '',
    mentorName: mentor.name || apiConv.mentorName || '',
    mentorEmail: mentor.contactInfo || mentor.email || apiConv.mentorEmail,
    userId: apiConv.userId || '',
    userName: apiConv.userName,
    lastMessage: apiConv.lastMessage,
    lastMessageAt: apiConv.lastMessageAt,
    unreadCount: apiConv.unreadCount || 0,
    createdAt: apiConv.createdAt,
    updatedAt: apiConv.updatedAt
  };
}
}

export const mentorshipService = new MentorshipService();
export default mentorshipService;