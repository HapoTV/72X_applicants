// src/services/EventService.ts

import axiosClient from '../api/axiosClient';
import type { 
  EventFormData, 
  AdminEventItem, 
  UserEventItem, 
  EventApiResponse, 
  EventRequest,
  EventType,
  CalendarEventItem
} from '../interfaces/EventData';
import { 
  DEFAULT_EVENT_TYPE,
  EventTypeDisplay
} from '../interfaces/EventData';

/**
 * Service layer for handling all event-related operations
 * Provides centralized API calls and data transformation
 */
class EventService {
  
  // ==================== ADMIN OPERATIONS ====================

  /**
   * Get all events (Admin only)
   */
  async getAllEvents(): Promise<AdminEventItem[]> {
    try {
      const response = await axiosClient.get('/events/all');
      return response.data.map((event: EventApiResponse) => 
        this.transformToAdminEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Create a new event (Admin only)
   */
  async createEvent(eventData: EventFormData, createdBy: string): Promise<AdminEventItem> {
    try {
      const eventRequest: EventRequest = this.transformToEventRequest(eventData, createdBy);
      const response = await axiosClient.post('/events', eventRequest);
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
      const response = await axiosClient.put(`/events/${eventId}`, eventRequest);
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
      await axiosClient.delete(`/events/${eventId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Get events for a specific user
   */
  async getUserEvents(userEmail: string): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/my-events', {
        params: { userEmail }
      });
      return response.data.map((event: EventApiResponse) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw new Error('Failed to fetch user events');
    }
  }

  /**
   * Get today's events for a user
   */
  async getTodayEvents(userEmail: string): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/today', {
        params: { userEmail }
      });
      return response.data.map((event: EventApiResponse) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      throw new Error('Failed to fetch today\'s events');
    }
  }

  /**
   * Get upcoming events for a user
   */
  async getUpcomingEvents(userEmail: string): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/upcoming', {
        params: { userEmail }
      });
      return response.data.map((event: EventApiResponse) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  /**
   * Get events for calendar view
   */
  async getCalendarEvents(userEmail: string): Promise<CalendarEventItem[]> {
    try {
      const userEvents = await this.getUserEvents(userEmail);
      return userEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: this.formatDateForCalendar(event.date),
        hasReminder: event.hasReminder
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminEventItem
   */
  private transformToAdminEventItem(apiEvent: EventApiResponse): AdminEventItem {
    const date = new Date(apiEvent.dateTime);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: apiEvent.location,
      description: apiEvent.description,
      eventType: apiEvent.eventType,
      createdBy: apiEvent.createdBy
    };
  }

  /**
   * Transform API response to UserEventItem
   */
  private transformToUserEventItem(apiEvent: EventApiResponse): UserEventItem {
    const date = new Date(apiEvent.dateTime);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: apiEvent.location,
      type: this.getEventTypeDisplay(apiEvent.eventType as EventType),
      hasReminder: false // This would come from a separate reminders API
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToEventRequest(formData: EventFormData, createdBy: string): EventRequest {
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    return {
      title: formData.title,
      dateTime: dateTime.toISOString(),
      location: formData.location,
      description: formData.description,
      eventType: formData.eventType,
      createdBy: createdBy,
      invitees: [] // Empty for now, can be extended later
    };
  }

  /**
   * Transform AdminEventItem back to form data for editing
   */
  transformToFormData(event: AdminEventItem): EventFormData {
    // Parse the formatted date back to input format
    const [month, day, year] = event.date.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return {
      title: event.title,
      date: date.toISOString().split('T')[0],
      time: event.time,
      location: event.location || '',
      description: event.description || '',
      eventType: (event.eventType as EventType) || DEFAULT_EVENT_TYPE
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get display name for event type
   */
  getEventTypeDisplay(eventType: EventType): string {
    return EventTypeDisplay[eventType] || eventType;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Format time for display
   */
  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Format date for calendar (YYYY-MM-DD)
   */
  formatDateForCalendar(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if event is today
   */
  isEventToday(dateString: string): boolean {
    const eventDate = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  }

  /**
   * Check if event is upcoming (future date)
   */
  isEventUpcoming(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    return eventDate > today;
  }

  /**
   * Validate event form data
   */
  validateEventForm(formData: EventFormData): string | null {
    if (!formData.title.trim()) {
      return 'Event title is required';
    }
    if (!formData.date) {
      return 'Event date is required';
    }
    if (!formData.time) {
      return 'Event time is required';
    }
    
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      return 'Event must be in the future';
    }
    
    return null; // No errors
  }
}

// Export as singleton instance
export const eventService = new EventService();
export default eventService;