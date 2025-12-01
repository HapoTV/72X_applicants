// src/services/MentorshipService.ts
import axiosClient from '../api/axiosClient';
import type { 
  MentorshipFormData, 
  AdminMentorshipItem, 
  UserMentorshipItem, 
  MentorshipApiResponse, 
  MentorshipRequest 
} from '../interfaces/MentorshipData';

/**
 * Service layer for handling all mentorship-related operations
 */
class MentorshipService {
  
  // ==================== ADMIN OPERATIONS ====================

  /**
   * Get all mentors (Admin only)
   */
  async getAllMentorship(): Promise<AdminMentorshipItem[]> {
    try {
      const response = await axiosClient.get('/mentors');
      return response.data.map((mentorship: MentorshipApiResponse) => 
        this.transformToAdminMentorshipItem(mentorship)
      );
    } catch (error) {
      console.error('Error fetching all mentors:', error);
      throw new Error('Failed to fetch mentors');
    }
  }

  /**
   * Create a new mentor (Admin only)
   */
  async createMentorship(mentorshipData: MentorshipFormData, createdBy: string): Promise<AdminMentorshipItem> {
    try {
      const mentorshipRequest: MentorshipRequest = this.transformToMentorshipRequest(mentorshipData, createdBy);
      const response = await axiosClient.post('/mentors', mentorshipRequest);
      return this.transformToAdminMentorshipItem(response.data);
    } catch (error) {
      console.error('Error creating mentor:', error);
      throw new Error('Failed to create mentor');
    }
  }

  /**
   * Update an existing mentor (Admin only)
   */
  async updateMentorship(mentorshipId: string, mentorshipData: MentorshipFormData, createdBy: string): Promise<AdminMentorshipItem> {
    try {
      const mentorshipRequest: MentorshipRequest = this.transformToMentorshipRequest(mentorshipData, createdBy);
      const response = await axiosClient.put(`/mentors/${mentorshipId}`, mentorshipRequest);
      return this.transformToAdminMentorshipItem(response.data);
    } catch (error) {
      console.error('Error updating mentor:', error);
      throw new Error('Failed to update mentor');
    }
  }

  /**
   * Delete a mentor (Admin only)
   */
  async deleteMentorship(mentorshipId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/mentors/${mentorshipId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting mentor:', error);
      throw new Error('Failed to delete mentor');
    }
  }

  /**
   * Get mentor by ID
   */
  async getMentorById(mentorshipId: string): Promise<AdminMentorshipItem> {
    try {
      const response = await axiosClient.get(`/mentors/${mentorshipId}`);
      return this.transformToAdminMentorshipItem(response.data);
    } catch (error) {
      console.error('Error fetching mentor by ID:', error);
      throw new Error('Failed to fetch mentor');
    }
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Get all mentors for users
   */
  async getActiveMentorship(): Promise<UserMentorshipItem[]> {
    try {
      const response = await axiosClient.get('/mentors');
      return response.data.map((mentorship: MentorshipApiResponse) => 
        this.transformToUserMentorshipItem(mentorship)
      );
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw new Error('Failed to fetch mentors');
    }
  }

  /**
   * Get mentors by expertise
   */
  async getMentorsByExpertise(expertise: string): Promise<UserMentorshipItem[]> {
    try {
      const response = await axiosClient.get(`/mentors/expertise/${expertise}`);
      return response.data.map((mentorship: MentorshipApiResponse) => 
        this.transformToUserMentorshipItem(mentorship)
      );
    } catch (error) {
      console.error('Error fetching mentors by expertise:', error);
      throw new Error('Failed to fetch mentors by expertise');
    }
  }

  /**
   * Search mentors
   */
  async searchMentorship(query: string): Promise<UserMentorshipItem[]> {
    try {
      const response = await axiosClient.get('/mentors/search', {
        params: { query }
      });
      return response.data.map((mentorship: MentorshipApiResponse) => 
        this.transformToUserMentorshipItem(mentorship)
      );
    } catch (error) {
      console.error('Error searching mentors:', error);
      throw new Error('Failed to search mentors');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminMentorshipItem
   */
  private transformToAdminMentorshipItem(apiMentorship: MentorshipApiResponse): AdminMentorshipItem {
    return {
      id: apiMentorship.mentorshipId,
      mentorName: apiMentorship.mentorName,
      mentorTitle: apiMentorship.mentorTitle,
      mentorEmail: apiMentorship.mentorEmail,
      expertise: apiMentorship.expertise,
      experience: apiMentorship.experience,
      background: apiMentorship.background,
      availability: apiMentorship.availability,
      rating: apiMentorship.rating,
      sessionsCompleted: apiMentorship.sessionsCompleted,
      bio: apiMentorship.bio,
      sessionDuration: apiMentorship.sessionDuration,
      sessionPrice: apiMentorship.sessionPrice,
      languages: apiMentorship.languages,
      createdBy: apiMentorship.createdBy
    };
  }

  /**
   * Transform API response to UserMentorshipItem
   */
  private transformToUserMentorshipItem(apiMentorship: MentorshipApiResponse): UserMentorshipItem {
    return {
      id: apiMentorship.mentorshipId,
      mentorName: apiMentorship.mentorName,
      mentorTitle: apiMentorship.mentorTitle,
      expertise: apiMentorship.expertise,
      experience: apiMentorship.experience,
      background: apiMentorship.background,
      rating: apiMentorship.rating,
      sessionsCompleted: apiMentorship.sessionsCompleted,
      sessionDuration: apiMentorship.sessionDuration,
      sessionPrice: apiMentorship.sessionPrice,
      languages: apiMentorship.languages,
      availability: apiMentorship.availability,
      isAvailable: this.isMentorAvailable(apiMentorship.availability)
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToMentorshipRequest(formData: MentorshipFormData, createdBy: string): MentorshipRequest {
    return {
      mentorName: formData.mentorName,
      mentorTitle: formData.mentorTitle,
      mentorEmail: formData.mentorEmail || undefined,
      expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
      experience: formData.experience || undefined,
      background: formData.background || undefined,
      availability: formData.availability || undefined,
      rating: formData.rating || undefined,
      sessionsCompleted: formData.sessionsCompleted || undefined,
      bio: formData.bio || undefined,
      sessionDuration: formData.sessionDuration || undefined,
      sessionPrice: formData.sessionPrice || undefined,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
      createdBy: createdBy
    };
  }

  /**
   * Transform AdminMentorshipItem back to form data for editing
   */
  transformToFormData(mentorship: AdminMentorshipItem): MentorshipFormData {
    return {
      mentorName: mentorship.mentorName,
      mentorTitle: mentorship.mentorTitle,
      mentorEmail: mentorship.mentorEmail || '',
      expertise: mentorship.expertise.join(', '),
      experience: mentorship.experience || '',
      background: mentorship.background || '',
      availability: mentorship.availability || '',
      rating: mentorship.rating || 0,
      sessionsCompleted: mentorship.sessionsCompleted || 0,
      bio: mentorship.bio || '',
      sessionDuration: mentorship.sessionDuration || '',
      sessionPrice: mentorship.sessionPrice || '',
      languages: mentorship.languages ? mentorship.languages.join(', ') : ''
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if mentor is available based on availability string
   */
  private isMentorAvailable(availability?: string): boolean {
    if (!availability) return false;
    const availableKeywords = ['available', 'open', 'accepting', 'weekdays', 'weekends'];
    return availableKeywords.some(keyword => 
      availability.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Format expertise array for display
   */
  formatExpertise(expertise: string[]): string[] {
    return expertise.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
  }

  /**
   * Format rating for display
   */
  formatRating(rating?: number): string {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  }

  /**
   * Format sessions count for display
   */
  formatSessionsCount(sessions?: number): string {
    if (!sessions) return '0 sessions';
    return sessions === 1 ? '1 session' : `${sessions} sessions`;
  }

  /**
   * Validate mentorship form data
   */
  validateMentorshipForm(formData: MentorshipFormData): string | null {
    if (!formData.mentorName.trim()) {
      return 'Mentor name is required';
    }
    if (!formData.mentorTitle.trim()) {
      return 'Mentor title is required';
    }
    if (!formData.expertise.trim()) {
      return 'Expertise is required';
    }
    
    if (formData.mentorEmail && !this.isValidEmail(formData.mentorEmail)) {
      return 'Please enter a valid email address';
    }
    
    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      return 'Rating must be between 0 and 5';
    }
    
    if (formData.sessionsCompleted && formData.sessionsCompleted < 0) {
      return 'Sessions completed cannot be negative';
    }
    
    return null; // No errors
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get mentor initials for avatar
   */
  getMentorInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
}

// Export as singleton instance
export const mentorshipService = new MentorshipService();
export default mentorshipService;
