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
  GroupMember
} from '../interfaces/MentorshipData';

/**
 * Service layer for handling all mentorship-related operations
 */
class MentorshipService {
  
  // ==================== MENTOR OPERATIONS ====================

  /**
   * Get all mentors
   */
  async getAllMentors(): Promise<Mentor[]> {
    try {
      const response = await axiosClient.get('/mentors');
      return response.data.map((mentor: any) => this.transformToMentor(mentor));
    } catch (error) {
      console.error('Error fetching all mentors:', error);
      return []; // Return empty array instead of throwing
    }
  }

  /**
   * Create a new mentor
   */
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

  /**
   * Get mentor by ID
   */
  async getMentorById(mentorId: string): Promise<Mentor | null> {
    try {
      const response = await axiosClient.get(`/mentors/${mentorId}`);
      return this.transformToMentor(response.data);
    } catch (error) {
      console.error('Error fetching mentor by ID:', error);
      return null;
    }
  }

  /**
   * Get mentors by expertise
   */
  async getMentorsByExpertise(expertise: string): Promise<Mentor[]> {
    try {
      const response = await axiosClient.get(`/mentors/expertise/${encodeURIComponent(expertise)}`);
      return response.data.map((mentor: any) => this.transformToMentor(mentor));
    } catch (error) {
      console.error('Error fetching mentors by expertise:', error);
      return [];
    }
  }

  /**
   * Search mentors
   */
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

  /**
   * Delete a mentor
   */
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

  /**
   * Get all public peer support groups
   */
  async getPeerSupportGroups(userId: string): Promise<PeerSupportGroup[]> {
    try {
      console.log('Fetching peer groups for user:', userId);
      
      // Make sure userId is properly formatted
      if (!userId || userId.trim() === '') {
        console.error('Invalid userId:', userId);
        return [];
      }
      
      const response = await axiosClient.get('/peer-support/groups/public', {
        params: { 
          currentUserId: userId 
        }
      });
      
      console.log('API Response for peer groups:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        return [];
      }
      
      const groups = response.data.map((group: any) => this.transformToPeerGroup(group));
      console.log('Transformed groups:', groups);
      return groups;
      
    } catch (error: any) {
      console.error('Error fetching peer groups:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      
      return [];
    }
  }

  /**
   * Get groups by category
   */
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

  /**
   * Get user's groups
   */
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

  /**
   * Create a new peer support group
   */
  async createPeerGroup(groupData: PeerSupportGroupFormData, creatorId: string): Promise<PeerSupportGroup> {
    try {
      const groupRequest = {
        ...groupData,
        name: groupData.name,
        description: groupData.description,
        category: groupData.category,
        location: groupData.location,
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

  /**
   * Join a peer support group
   */
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

  /**
   * Leave a peer support group
   */
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

  /**
   * Get group members
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const response = await axiosClient.get(`/peer-support/groups/${groupId}/members`);
      return response.data.map((member: any) => this.transformToGroupMember(member));
    } catch (error) {
      console.error('Error fetching group members:', error);
      return [];
    }
  }

  /**
   * Search groups
   */
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

  /**
   * Get trending groups
   */
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

  /**
   * Send a message
   */
  async sendMessage(messageData: Message): Promise<Message> {
    try {
      const messageRequest = {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.content,
        messageType: messageData.messageType || 'text'
      };
      
      const response = await axiosClient.post('/messaging/send', messageRequest);
      return this.transformToMessage(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get conversations for user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await axiosClient.get(`/messaging/conversations/${userId}`);
      return response.data.map((conv: any) => this.transformToConversation(conv));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get messages between users
   */
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const response = await axiosClient.get(`/messaging/messages/${userId1}/${userId2}`);
      return response.data.map((msg: any) => this.transformToMessage(msg));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    try {
      await axiosClient.post(`/messaging/mark-read/${senderId}/${receiverId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const response = await axiosClient.get(`/messaging/unread-count/${userId}`);
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Get recent messages
   */
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

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to Mentor
   */
  private transformToMentor(apiMentor: any): Mentor {
    return {
      mentorId: apiMentor.mentorId || apiMentor.id,
      name: apiMentor.name,
      expertise: apiMentor.expertise || '',
      contactInfo: apiMentor.contactInfo,
      experience: apiMentor.experience,
      background: apiMentor.background,
      availability: apiMentor.availability,
      rating: apiMentor.rating || 4.0,
      sessionsCompleted: apiMentor.sessionsCompleted || 0,
      bio: apiMentor.bio || 'No bio available',
      sessionDuration: apiMentor.sessionDuration || '60 minutes',
      sessionPrice: apiMentor.sessionPrice || 'Free',
      languages: apiMentor.languages || '',
      imageUrl: apiMentor.imageUrl,
      createdBy: apiMentor.createdBy?.name || apiMentor.createdBy,
      createdAt: apiMentor.createdAt,
      updatedAt: apiMentor.updatedAt
    };
  }

  /**
   * Transform API response to PeerSupportGroup
   */
  private transformToPeerGroup(apiGroup: any): PeerSupportGroup {
    console.log('Transforming group data:', apiGroup);
    
    // Get current user ID for member/owner check
    const currentUser = localStorage.getItem('user');
    let currentUserId = '';
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        currentUserId = userData.userId || userData.id || userData._id || '';
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }
    
    // Handle createdBy - backend returns createdByName, createdByEmail, createdById
    const createdByName = apiGroup.createdByName || 'Unknown';
    const createdByEmail = apiGroup.createdByEmail || '';
    const createdById = apiGroup.createdById || '';
    
    // Create display string
    const createdBy = createdByName || createdByEmail || createdById || 'Unknown';
    
    // Check if current user is owner (compare with createdById from backend)
    const isOwner = createdById === currentUserId || apiGroup.isOwner === true;
    
    // Check if current user is member (use isMember flag from backend)
    const isMember = apiGroup.isMember === true;
    
    return {
      groupId: apiGroup.groupId,
      name: apiGroup.name || '',
      description: apiGroup.description || '',
      category: apiGroup.category || 'General Business',
      location: apiGroup.location || 'Online',
      maxMembers: apiGroup.maxMembers || 100,
      createdBy: createdBy,
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

  /**
   * Transform API response to GroupMember
   */
  private transformToGroupMember(apiMember: any): GroupMember {
    const user = apiMember.user || {};
    
    return {
      memberId: apiMember.memberId || apiMember.id,
      groupId: apiMember.groupId,
      userId: apiMember.userId || user.id,
      userName: user.name || 'Unknown',
      userEmail: user.email,
      role: apiMember.role || 'MEMBER',
      joinedAt: apiMember.joinedAt,
      lastActiveAt: apiMember.lastActiveAt
    };
  }

  /**
   * Transform API response to Message
   */
  private transformToMessage(apiMsg: any): Message {
    return {
      messageId: apiMsg.messageId || apiMsg.id,
      senderId: apiMsg.sender?.id || apiMsg.senderId,
      receiverId: apiMsg.receiver?.id || apiMsg.receiverId,
      content: apiMsg.content,
      messageType: apiMsg.messageType || 'TEXT',
      timestamp: apiMsg.createdAt || apiMsg.timestamp,
      isRead: apiMsg.isRead || false,
      readAt: apiMsg.readAt
    };
  }

  /**
   * Transform API response to Conversation
   */
  private transformToConversation(apiConv: any): Conversation {
    const user1 = apiConv.user1 || {};
    const user2 = apiConv.user2 || {};
    
    return {
      conversationId: apiConv.conversationId || apiConv.id,
      user1Id: user1.id || apiConv.user1Id,
      user2Id: user2.id || apiConv.user2Id,
      lastMessage: apiConv.lastMessage,
      lastMessageAt: apiConv.lastMessageAt,
      unreadCountUser1: apiConv.unreadCountUser1 || 0,
      unreadCountUser2: apiConv.unreadCountUser2 || 0,
      createdAt: apiConv.createdAt,
      updatedAt: apiConv.updatedAt,
      user1Name: user1.name,
      user2Name: user2.name,
      user1Email: user1.email,
      user2Email: user2.email
    };
  }

  /**
   * Transform form data to API request format
   */
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

  /**
   * Get default image URL
   */
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

  /**
   * Get group image URL
   */
  getGroupImageUrl(group: PeerSupportGroup): string {
    return group.imageUrl || this.getDefaultImage(group.name);
  }

  /**
   * Get user image URL
   */
  getUserImageUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`;
  }

  /**
   * Format date for display
   */
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

  /**
   * Format date-time for display
   */
  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  /**
   * Format relative time (e.g., "2 days ago")
   */
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

  /**
   * Format rating for display
   */
  formatRating(rating?: number): string {
    return rating ? rating.toFixed(1) : 'N/A';
  }

  /**
   * Format sessions count for display
   */
  formatSessionsCount(sessions?: number): string {
    return sessions ? `${sessions} sessions` : 'No sessions';
  }

  /**
   * Validate mentorship form data
   */
  validateMentorshipForm(formData: MentorshipFormData): string | null {
    if (!formData.name.trim()) {
      return 'Mentor name is required';
    }
    if (!formData.expertise.trim()) {
      return 'Expertise is required';
    }
    
    if (formData.contactInfo && !this.isValidEmail(formData.contactInfo)) {
      return 'Please enter a valid email address';
    }
    
    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      return 'Rating must be between 0 and 5';
    }
    
    if (formData.sessionsCompleted && formData.sessionsCompleted < 0) {
      return 'Sessions completed cannot be negative';
    }
    
    return null;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if mentor is available
   */
  isMentorAvailable(availability?: string): boolean {
    if (!availability) return false;
    const availableKeywords = ['available', 'open', 'accepting'];
    return availableKeywords.some(keyword => 
      availability.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Check if group has available spots
   */
  hasGroupAvailability(group: PeerSupportGroup): boolean {
    return group.memberCount < group.maxMembers;
  }
}

// Export as singleton instance
export const mentorshipService = new MentorshipService();
export default mentorshipService;