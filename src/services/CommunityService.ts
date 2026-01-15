// src/services/CommunityService.ts
import axiosClient from '../api/axiosClient';
import type { 
  DiscussionFormData,
  AdminDiscussionItem,
  UserDiscussionItem,
  DiscussionApiResponse,
  DiscussionRequest,
  EventFormData,
  AdminEventItem,
  UserEventItem,
  EventApiResponse,
  EventRequest,
  Category,
  CommunityStats,
  DiscussionReply,
  ReplyFormData,
  ReplyRequest
} from '../interfaces/CommunityData';

/**
 * Service layer for handling all community-related operations
 */
class CommunityService {
  
  // ==================== DISCUSSION OPERATIONS ====================

  /**
   * Get all discussions (Admin only)
   */
  async getAllDiscussions(): Promise<AdminDiscussionItem[]> {
    try {
      const response = await axiosClient.get('/community/discussions');
      return response.data.map((discussion: DiscussionApiResponse) => 
        this.transformToAdminDiscussionItem(discussion)
      );
    } catch (error) {
      console.error('Error fetching all discussions:', error);
      throw new Error('Failed to fetch discussions');
    }
  }

  /**
   * Get active discussions for users
   */
  async getActiveDiscussions(category?: string): Promise<UserDiscussionItem[]> {
    try {
      if (category && category !== 'all') {
        const response = await axiosClient.get(`/community/discussions/category/${category}`);
        return response.data.map((discussion: DiscussionApiResponse) => 
          this.transformToUserDiscussionItem(discussion)
        );
      } else {
        const response = await axiosClient.get('/community/discussions');
        return response.data.map((discussion: DiscussionApiResponse) => 
          this.transformToUserDiscussionItem(discussion)
        );
      }
    } catch (error) {
      console.error('Error fetching active discussions:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
        console.error('Response headers:', axiosError.response?.headers);

        // If backend can't serialize discussions yet (common when lazy-loaded relations
        // like tags/replies are returned), don't break the UI.
        if (axiosError.response?.status === 500) {
          return [];
        }
      }
      throw new Error('Failed to fetch discussions');
    }
  }

  /**
   * Get hot discussions
   */
  async getHotDiscussions(): Promise<UserDiscussionItem[]> {
    try {
      const response = await axiosClient.get('/community/discussions/hot');
      return response.data.map((discussion: DiscussionApiResponse) => 
        this.transformToUserDiscussionItem(discussion)
      );
    } catch (error) {
      console.error('Error fetching hot discussions:', error);
      throw new Error('Failed to fetch hot discussions');
    }
  }

  /**
   * Create a new discussion
   */
  async createDiscussion(discussionData: DiscussionFormData, createdBy: string): Promise<UserDiscussionItem> {
    try {
      // Map frontend categories to backend enum values
      const categoryMapping: { [key: string]: string } = {
        'startup': 'STARTUP',
        'marketing': 'MARKETING',
        'finance': 'FINANCE',
        'legal': 'LEGAL',
        'operations': 'OPERATIONS',
        'business': 'BUSINESS'
      };

      // Simplify the request payload to match typical Spring Boot expectations
      const discussionRequest = {
        title: discussionData.title,
        content: discussionData.content,
        category: categoryMapping[discussionData.category] || 'STARTUP', // Default to STARTUP if not found
        createdBy: createdBy
        // Omit tags for now to see if this is causing the issue
      };
      
      console.log('Creating discussion with data:', JSON.stringify(discussionRequest, null, 2));
      console.log('Request URL:', '/community/discussions');
      
      const response = await axiosClient.post('/community/discussions', discussionRequest, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Discussion created successfully:', response.data);
      return this.transformToUserDiscussionItem(response.data);
    } catch (error) {
      console.error('Error creating discussion:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
        console.error('Response headers:', axiosError.response?.headers);
      }
      throw new Error('Failed to create discussion');
    }
  }

  /**
   * Update an existing discussion (Admin only)
   */
  async updateDiscussion(discussionId: string, discussionData: DiscussionFormData, createdBy: string): Promise<AdminDiscussionItem> {
    try {
      const discussionRequest: DiscussionRequest = this.transformToDiscussionRequest(discussionData, createdBy);
      const response = await axiosClient.put(`/community/discussions/${discussionId}?userEmail=${createdBy}`, discussionRequest);
      return this.transformToAdminDiscussionItem(response.data);
    } catch (error) {
      console.error('Error updating discussion:', error);
      throw new Error('Failed to update discussion');
    }
  }

  /**
   * Delete a discussion (Admin only)
   */
  async deleteDiscussion(discussionId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/community/discussions/${discussionId}?userEmail=${userEmail}`);
    } catch (error) {
      console.error('Error deleting discussion:', error);
      throw new Error('Failed to delete discussion');
    }
  }

  // ==================== EVENT OPERATIONS ====================

  /**
   * Get all events (Admin only)
   */
  async getAllEvents(): Promise<AdminEventItem[]> {
    try {
      const response = await axiosClient.get('/community/events');
      return response.data.map((event: EventApiResponse) => 
        this.transformToAdminEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Get upcoming events for users
   */
  async getUpcomingEvents(): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/community/events/upcoming');
      return response.data.map((event: EventApiResponse) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Get past events
   */
  async getPastEvents(): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/community/events/past');
      return response.data.map((event: EventApiResponse) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching past events:', error);
      throw new Error('Failed to fetch past events');
    }
  }

  /**
   * Create a new event (Admin only)
   */
  async createEvent(eventData: EventFormData, createdBy: string): Promise<AdminEventItem> {
    try {
      const eventRequest: EventRequest = this.transformToEventRequest(eventData, createdBy);
      const response = await axiosClient.post('/community/events', eventRequest);
      return this.transformToAdminEventItem(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  /**
   * Update an existing event (Admin only)
   */
  async updateEvent(eventId: string, eventData: EventFormData, createdBy: string): Promise<AdminEventItem> {
    try {
      const eventRequest: EventRequest = this.transformToEventRequest(eventData, createdBy);
      const response = await axiosClient.put(`/community/events/${eventId}`, eventRequest);
      return this.transformToAdminEventItem(response.data);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  /**
   * Delete an event (Admin only)
   */
  async deleteEvent(eventId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/community/events/${eventId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  /**
   * Join an event
   */
  async joinEvent(eventId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.post(`/community/events/${eventId}/join`, {
        userEmail
      });
    } catch (error) {
      console.error('Error joining event:', error);
      throw new Error('Failed to join event');
    }
  }

  // ==================== CATEGORY OPERATIONS ====================

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axiosClient.get('/community/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // ==================== STATS OPERATIONS ====================

  /**
   * Get community statistics
   */
  async getCommunityStats(): Promise<CommunityStats> {
    try {
      const response = await axiosClient.get('/community/discussions/stats');
      const data = response.data as any;

      // Backend may return a different stats shape (e.g. totalUsers/totalDiscussions).
      // Normalize it to the UI's CommunityStats contract.
      return {
        totalMembers:
          typeof data?.totalMembers === 'number'
            ? data.totalMembers
            : typeof data?.totalUsers === 'number'
              ? data.totalUsers
              : 0,
        activeDiscussions:
          typeof data?.activeDiscussions === 'number'
            ? data.activeDiscussions
            : typeof data?.totalDiscussions === 'number'
              ? data.totalDiscussions
              : 0,
        totalMentors:
          typeof data?.totalMentors === 'number'
            ? data.totalMentors
            : typeof data?.totalMentorsCount === 'number'
              ? data.totalMentorsCount
              : typeof data?.mentors === 'number'
                ? data.mentors
                : typeof data?.totalExperts === 'number'
                  ? data.totalExperts
                  : 0,
        monthlyActiveUsers: typeof data?.monthlyActiveUsers === 'number' ? data.monthlyActiveUsers : undefined,
        newMembersThisMonth: typeof data?.newMembersThisMonth === 'number' ? data.newMembersThisMonth : undefined,
        totalEvents: typeof data?.totalEvents === 'number' ? data.totalEvents : undefined,
        upcomingEvents: typeof data?.upcomingEvents === 'number' ? data.upcomingEvents : undefined,
      };
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw new Error('Failed to fetch community stats');
    }
  }

  // ==================== REPLY OPERATIONS ====================

  /**
   * Get replies for a discussion
   */
  async getDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
    try {
      const response = await axiosClient.get(`/community/discussions/${discussionId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching discussion replies:', error);
      throw new Error('Failed to fetch replies');
    }
  }

  /**
   * Add a reply to a discussion
   */
  async addReply(discussionId: string, replyData: ReplyFormData, createdBy: string): Promise<DiscussionReply> {
    try {
      const replyRequest: ReplyRequest = {
        content: replyData.content,
        discussionId,
        isAnswer: replyData.isAnswer,
        createdBy
      };
      const response = await axiosClient.post(`/community/discussions/${discussionId}/replies`, replyRequest);
      return response.data;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw new Error('Failed to add reply');
    }
  }

  /**
   * Like a discussion
   */
  async likeDiscussion(discussionId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.post(`/community/discussions/${discussionId}/like?userEmail=${userEmail}`);
    } catch (error) {
      console.error('Error liking discussion:', error);
      throw new Error('Failed to like discussion');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminDiscussionItem
   */
  private transformToAdminDiscussionItem(apiDiscussion: DiscussionApiResponse): AdminDiscussionItem {
    return {
      id: apiDiscussion.discussionId,
      title: apiDiscussion.title,
      content: apiDiscussion.content,
      author: apiDiscussion.author,
      authorAvatar: apiDiscussion.authorAvatar,
      category: apiDiscussion.category,
      replies: apiDiscussion.replies,
      likes: apiDiscussion.likes,
      shares: apiDiscussion.shares,
      views: apiDiscussion.views,
      isHot: apiDiscussion.isHot,
      isPinned: apiDiscussion.isPinned,
      isLocked: apiDiscussion.isLocked,
      tags: apiDiscussion.tags,
      createdAt: apiDiscussion.createdAt,
      createdBy: apiDiscussion.createdBy
    };
  }

  /**
   * Transform API response to UserDiscussionItem
   */
  private transformToUserDiscussionItem(apiDiscussion: DiscussionApiResponse): UserDiscussionItem {
    const preview = this.generatePreview(apiDiscussion.content);
    const timeAgo = this.formatTimeAgo(apiDiscussion.createdAt);
    const normalizedCategory = typeof apiDiscussion.category === 'string'
      ? apiDiscussion.category.toLowerCase()
      : apiDiscussion.category;
    
    return {
      id: apiDiscussion.discussionId,
      title: apiDiscussion.title,
      preview: preview,
      author: apiDiscussion.author,
      authorAvatar: apiDiscussion.authorAvatar,
      category: normalizedCategory,
      replies: apiDiscussion.replies,
      likes: apiDiscussion.likes,
      timeAgo: timeAgo,
      isHot: apiDiscussion.isHot,
      isPinned: apiDiscussion.isPinned,
      isLocked: apiDiscussion.isLocked,
      tags: apiDiscussion.tags
    };
  }

  /**
   * Transform API response to AdminEventItem
   */
  private transformToAdminEventItem(apiEvent: EventApiResponse): AdminEventItem {
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      description: apiEvent.description,
      date: apiEvent.date,
      time: apiEvent.time,
      duration: apiEvent.duration,
      type: apiEvent.type,
      location: apiEvent.location,
      isVirtual: apiEvent.isVirtual,
      maxAttendees: apiEvent.maxAttendees,
      currentAttendees: apiEvent.currentAttendees,
      price: apiEvent.price,
      isFree: apiEvent.isFree,
      tags: apiEvent.tags,
      organizerName: apiEvent.organizerName,
      organizerEmail: apiEvent.organizerEmail,
      agenda: apiEvent.agenda,
      createdAt: apiEvent.createdAt,
      createdBy: apiEvent.createdBy
    };
  }

  /**
   * Transform API response to UserEventItem
   */
  private transformToUserEventItem(apiEvent: EventApiResponse): UserEventItem {
    const eventDate = new Date(apiEvent.date);
    const today = new Date();
    const isUpcoming = eventDate >= today;
    const isPast = eventDate < today;
    const spotsLeft = apiEvent.maxAttendees ? apiEvent.maxAttendees - apiEvent.currentAttendees : undefined;
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      description: apiEvent.description,
      date: apiEvent.date,
      time: apiEvent.time,
      type: apiEvent.type,
      attendees: apiEvent.currentAttendees,
      isVirtual: apiEvent.isVirtual,
      isFree: apiEvent.isFree,
      price: apiEvent.price,
      formattedDate: this.formatEventDate(apiEvent.date),
      isUpcoming: isUpcoming,
      isPast: isPast,
      spotsLeft: spotsLeft
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToDiscussionRequest(formData: DiscussionFormData, createdBy: string): DiscussionRequest {
    return {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags && formData.tags.trim() 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [],
      createdBy: createdBy
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToEventRequest(formData: EventFormData, createdBy: string): EventRequest {
    return {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration || undefined,
      type: formData.type,
      location: formData.location || undefined,
      isVirtual: formData.isVirtual,
      maxAttendees: formData.maxAttendees || undefined,
      price: formData.price || undefined,
      isFree: formData.isFree,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      organizerName: formData.organizerName || undefined,
      organizerEmail: formData.organizerEmail || undefined,
      agenda: formData.agenda ? formData.agenda.split('\n').map(item => item.trim()).filter(item => item.length > 0) : undefined,
      createdBy: createdBy
    };
  }

  /**
   * Transform AdminDiscussionItem back to form data for editing
   */
  transformToDiscussionFormData(discussion: AdminDiscussionItem): DiscussionFormData {
    return {
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
      tags: discussion.tags ? discussion.tags.join(', ') : ''
    };
  }

  /**
   * Transform AdminEventItem back to form data for editing
   */
  transformToEventFormData(event: AdminEventItem): EventFormData {
    return {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration || '',
      type: event.type,
      location: event.location || '',
      isVirtual: event.isVirtual || false,
      maxAttendees: event.maxAttendees || 0,
      price: event.price || '',
      isFree: event.isFree || false,
      tags: event.tags ? event.tags.join(', ') : '',
      agenda: event.agenda ? event.agenda.join('\n') : '',
      organizerName: event.organizerName || '',
      organizerEmail: event.organizerEmail || ''
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generate preview text from content
   */
  private generatePreview(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  /**
   * Format time ago
   */
  private formatTimeAgo(dateString?: string): string {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Format event date for display
   */
  private formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  /**
   * Validate discussion form data
   */
  validateDiscussionForm(formData: DiscussionFormData): string | null {
    if (!formData.title.trim()) {
      return 'Discussion title is required';
    }
    if (!formData.content.trim()) {
      return 'Discussion content is required';
    }
    if (!formData.category.trim()) {
      return 'Category is required';
    }
    
    return null; // No errors
  }

  /**
   * Validate event form data
   */
  validateEventForm(formData: EventFormData): string | null {
    if (!formData.title.trim()) {
      return 'Event title is required';
    }
    if (!formData.description.trim()) {
      return 'Event description is required';
    }
    if (!formData.date) {
      return 'Event date is required';
    }
    if (!formData.time) {
      return 'Event time is required';
    }
    if (!formData.type.trim()) {
      return 'Event type is required';
    }
    
    // Validate date is not in the past
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    if (eventDate <= new Date()) {
      return 'Event date and time must be in the future';
    }
    
    return null; // No errors
  }

  /**
   * Get category color for display
   */
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      startup: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      finance: 'bg-purple-100 text-purple-800',
      operations: 'bg-orange-100 text-orange-800',
      tech: 'bg-indigo-100 text-indigo-800',
      legal: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
}

// Export as singleton instance
export const communityService = new CommunityService();
export default communityService;
