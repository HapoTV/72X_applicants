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

class EventService {
  
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getCurrentUserEmail(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.email || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return '';
  }

  // ==================== ADMIN OPERATIONS ====================

  async getAllEvents(): Promise<AdminEventItem[]> {
    try {
      const response = await axiosClient.get('/events/all', {
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToAdminEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  async createEvent(eventData: EventFormData, createdBy: string): Promise<AdminEventItem> {
    try {
      const eventRequest: EventRequest = this.transformToEventRequest(eventData, createdBy);
      const response = await axiosClient.post('/events', eventRequest, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminEventItem(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  async updateEvent(eventId: string, eventData: EventFormData, createdBy: string): Promise<AdminEventItem> {
    try {
      const eventRequest: EventRequest = this.transformToEventRequest(eventData, createdBy);
      const response = await axiosClient.put(`/events/${eventId}`, eventRequest, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminEventItem(response.data);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await axiosClient.delete(`/events/${eventId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // ==================== USER OPERATIONS ====================

  async getUserEvents(): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/my-events', {
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw new Error('Failed to fetch user events');
    }
  }

  async getTodayEvents(): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/today', {
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      throw new Error('Failed to fetch today\'s events');
    }
  }

  async getUpcomingEvents(): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/upcoming', {
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  async getCalendarEvents(): Promise<CalendarEventItem[]> {
    try {
      const userEvents = await this.getUserEvents();
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

  async getEventsByType(eventType: string): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get(`/events/type/${eventType}`, {
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error fetching events by type:', error);
      throw new Error('Failed to fetch events by type');
    }
  }

  async searchEvents(query: string): Promise<UserEventItem[]> {
    try {
      const response = await axiosClient.get('/events/search', {
        params: { query },
        headers: this.getAuthHeader()
      });
      return response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  private transformToAdminEventItem(apiEvent: any): AdminEventItem {
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

  private transformToUserEventItem(apiEvent: any): UserEventItem {
    const date = new Date(apiEvent.dateTime);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: apiEvent.location,
      type: this.getEventTypeDisplay(apiEvent.eventType as EventType),
      hasReminder: false
    };
  }

  private transformToEventRequest(formData: EventFormData, createdBy: string): EventRequest {
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    return {
      title: formData.title,
      dateTime: dateTime.toISOString(),
      location: formData.location,
      description: formData.description,
      eventType: formData.eventType,
      createdBy: createdBy,
      invitees: []
    };
  }

  transformToFormData(event: AdminEventItem): EventFormData {
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

  getEventTypeDisplay(eventType: EventType): string {
    return EventTypeDisplay[eventType] || eventType;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDateForCalendar(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  isEventToday(dateString: string): boolean {
    const eventDate = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  }

  isEventUpcoming(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate > today;
  }

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
    
    return null;
  }
}

export const eventService = new EventService();
export default eventService;