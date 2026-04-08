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

  // Parse CAT datetime correctly - backend sends "2026-04-07 13:00:00" as CAT
  private parseCATDateTime(dateTimeString: string): Date {
    // Replace space with T to make ISO format
    const isoString = dateTimeString.replace(' ', 'T') + '+02:00'; // Add CAT timezone offset
    console.log(`Parsing CAT datetime: ${dateTimeString} -> ${isoString}`);
    return new Date(isoString);
  }

  // Format date for display in CAT without conversion
  private formatDateForDisplay(dateTimeString: string): string {
    // Extract date part directly from the string to avoid timezone conversion
    const datePart = dateTimeString.split(' ')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY format
    }
    return datePart;
  }

  // Format time for display - extract directly from string
  private formatTimeForDisplay(dateTimeString: string): string {
    // Extract time part directly from the string
    const timePart = dateTimeString.split(' ')[1];
    if (timePart) {
      // Convert 24-hour to 12-hour format if needed
      const [hours, minutes] = timePart.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return timePart || '';
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
        date: this.formatDateForCalendar(event.rawDateTime || event.date),
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
    const dateTimeStr = apiEvent.dateTime || apiEvent.date_time;
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: this.formatDateForDisplay(dateTimeStr),
      time: this.formatTimeForDisplay(dateTimeStr),
      location: apiEvent.location,
      description: apiEvent.description,
      eventType: apiEvent.eventType || apiEvent.type,
      organisation: apiEvent.organisation,
      createdBy: apiEvent.createdBy
    };
  }

  private transformToUserEventItem(apiEvent: any): UserEventItem {
    const dateTimeStr = apiEvent.dateTime || apiEvent.date_time;
    console.log('Transforming event with dateTimeStr:', dateTimeStr);
    
    return {
      id: apiEvent.eventId,
      title: apiEvent.title,
      date: this.formatDateForDisplay(dateTimeStr),
      time: this.formatTimeForDisplay(dateTimeStr),
      location: apiEvent.location,
      type: this.getEventTypeDisplay(apiEvent.eventType || apiEvent.type as EventType),
      organisation: apiEvent.organisation,
      hasReminder: false,
      rawDateTime: dateTimeStr
    };
  }

  private transformToEventRequest(formData: EventFormData, createdBy: string): EventRequest {
    // Format datetime as expected by backend (YYYY-MM-DD HH:MM:SS) in CAT
    const formattedDateTime = `${formData.date} ${formData.time}:00`;
    
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
    // Parse date from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = event.date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Extract time from format like "2:30 PM" to "14:30"
    let time24 = event.time;
    if (event.time.includes('PM') || event.time.includes('AM')) {
      const [time, period] = event.time.split(' ');
      let [hours, minutes] = time.split(':');
      let hour = parseInt(hours, 10);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      time24 = `${String(hour).padStart(2, '0')}:${minutes}`;
    }
    
    return {
      title: event.title,
      date: formattedDate,
      time: time24,
      location: event.location || '',
      description: event.description || '',
      eventType: (event.eventType as EventType) || DEFAULT_EVENT_TYPE
    };
  }

  // ==================== UTILITY METHODS ====================

  getEventTypeDisplay(eventType: EventType): string {
    return EventTypeDisplay[eventType] || eventType;
  }

  formatDate(dateTimeString: string): string {
    return this.formatDateForDisplay(dateTimeString);
  }

  formatTime(dateTimeString: string): string {
    return this.formatTimeForDisplay(dateTimeString);
  }

  formatDateForCalendar(dateTimeString: string): string {
    // Extract just the date part YYYY-MM-DD
    return dateTimeString.split(' ')[0];
  }

  isEventToday(dateTimeString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const eventDate = dateTimeString.split(' ')[0];
    return eventDate === today;
  }

  isEventUpcoming(dateTimeString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const eventDate = dateTimeString.split(' ')[0];
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
