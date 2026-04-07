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

  // Helper method to parse CAT datetime correctly
  private parseCATDateTime(dateTimeString: string): Date {
    // The backend returns datetime in format "2026-04-07 13:00:00" (CAT)
    // Replace space with T to make it ISO-like
    const isoString = dateTimeString.replace(' ', 'T');
    // Create date assuming it's already in CAT (UTC+2)
    const date = new Date(isoString);
    
    // Log for debugging
    console.log(`Parsing CAT datetime: ${dateTimeString} -> ${date.toLocaleString()}`);
    
    return date;
  }

  // Format date for display in CAT
  private formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString('en-ZA', {
      timeZone: 'Africa/Maputo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Format time for display in CAT
  private formatTimeForDisplay(date: Date): string {
    return date.toLocaleTimeString('en-ZA', {
      timeZone: 'Africa/Maputo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Check if event is today in CAT
  private isEventTodayInCAT(dateTimeString: string): boolean {
    const eventDate = this.parseCATDateTime(dateTimeString);
    const now = new Date();
    
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth();
    const eventDay = eventDate.getDate();
    
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDay = now.getDate();
    
    return eventYear === todayYear && eventMonth === todayMonth && eventDay === todayDay;
  }

  // Check if event is upcoming (future date) in CAT
  private isEventUpcomingInCAT(dateTimeString: string): boolean {
    const eventDate = this.parseCATDateTime(dateTimeString);
    const now = new Date();
    
    // Reset time to midnight for date comparison
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return eventDateOnly > nowOnly;
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
      const events = response.data.map((event: any) => 
        this.transformToUserEventItem(event)
      );
      console.log('All user events:', events);
      return events;
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
      
      console.log('Raw today events response:', response.data);
      
      // Filter events that are actually today in CAT
      const events = response.data
        .map((event: any) => this.transformToUserEventItem(event))
        .filter(event => this.isEventTodayInCAT(event.rawDateTime));
      
      console.log('Filtered today events (CAT):', events);
      return events;
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
      
      console.log('Raw upcoming events response:', response.data);
      
      // Filter events that are upcoming (future dates) in CAT
      const events = response.data
        .map((event: any) => this.transformToUserEventItem(event))
        .filter(event => this.isEventUpcomingInCAT(event.rawDateTime));
      
      console.log('Filtered upcoming events (CAT):', events);
      return events;
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
        date: this.formatDateForCalendar(event.rawDateTime),
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
    const date = this.parseCATDateTime(apiEvent.dateTime);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: this.formatDateForDisplay(date),
      time: this.formatTimeForDisplay(date),
      location: apiEvent.location,
      description: apiEvent.description,
      eventType: apiEvent.type || apiEvent.eventType,
      organisation: apiEvent.organisation,
      createdBy: apiEvent.createdBy
    };
  }

  private transformToUserEventItem(apiEvent: any): UserEventItem {
    const date = this.parseCATDateTime(apiEvent.dateTime);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: this.formatDateForDisplay(date),
      time: this.formatTimeForDisplay(date),
      location: apiEvent.location,
      type: this.getEventTypeDisplay(apiEvent.type || apiEvent.eventType as EventType),
      organisation: apiEvent.organisation,
      hasReminder: false,
      rawDateTime: apiEvent.dateTime // Store raw for filtering
    };
  }

  private transformToEventRequest(formData: EventFormData, createdBy: string): EventRequest {
    // Create datetime in CAT timezone
    const dateTimeStr = `${formData.date}T${formData.time}:00`;
    const dateTime = new Date(dateTimeStr);
    
    // Format as expected by backend (YYYY-MM-DD HH:MM:SS)
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getSeconds()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return {
      title: formData.title,
      dateTime: formattedDateTime,
      location: formData.location,
      description: formData.description,
      eventType: formData.eventType,
      createdBy: createdBy,
      invitees: []
    };
  }

  transformToFormData(event: AdminEventItem): EventFormData {
    // Parse the date from the event
    const [day, month, year] = event.date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    
    return {
      title: event.title,
      date: formattedDate,
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
    const date = this.parseCATDateTime(dateString);
    return this.formatDateForDisplay(date);
  }

  formatTime(dateString: string): string {
    const date = this.parseCATDateTime(dateString);
    return this.formatTimeForDisplay(date);
  }

  formatDateForCalendar(dateTimeString: string): string {
    const date = this.parseCATDateTime(dateTimeString);
    return date.toISOString().split('T')[0];
  }

  isEventToday(dateTimeString: string): boolean {
    return this.isEventTodayInCAT(dateTimeString);
  }

  isEventUpcoming(dateTimeString: string): boolean {
    return this.isEventUpcomingInCAT(dateTimeString);
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
    const now = new Date();
    
    if (eventDateTime <= now) {
      return 'Event must be in the future';
    }
    
    return null;
  }
}

export const eventService = new EventService();
export default eventService;
