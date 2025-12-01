// src/interfaces/EventData.ts

/**
 * Core Event Interface - Used across both admin and user contexts
 */
export interface Event {
  id: string;
  title: string;
  dateTime: string; // ISO string for API compatibility
  location?: string;
  description?: string;
  eventType: EventType;
  createdBy: string;
  invitees: string[]; // Array of email addresses
}

/**
 * Event types supported by the system - using union type instead of enum
 */
export type EventType = 
  | 'MEETING' 
  | 'WORKSHOP' 
  | 'SEMINAR' 
  | 'CONFERENCE' 
  | 'NETWORKING';

/**
 * Event type display names for UI
 */
export const EventTypeDisplay: Record<EventType, string> = {
  MEETING: 'Meeting',
  WORKSHOP: 'Workshop',
  SEMINAR: 'Seminar',
  CONFERENCE: 'Conference',
  NETWORKING: 'Networking'
};

/**
 * Event type options for dropdowns
 */
export const EventTypeOptions: { value: EventType; label: string }[] = [
  { value: 'MEETING', label: 'Meeting' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'NETWORKING', label: 'Networking' }
];

/**
 * Default event type
 */
export const DEFAULT_EVENT_TYPE: EventType = 'MEETING';

/**
 * Form data for creating/editing events
 */
export interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  eventType: EventType;
}

/**
 * Admin-specific event view with additional management data
 */
export interface AdminEventItem {
  id: string;
  title: string;
  date: string; // Formatted date (MM/DD/YYYY)
  time: string; // Formatted time (HH:MM AM/PM)
  location?: string;
  description?: string;
  eventType?: string;
  createdBy: string;
}

/**
 * User-specific event view for calendar and listings
 */
export interface UserEventItem {
  id: string;
  title: string;
  date: string; // Formatted date
  time: string; // Formatted time
  location?: string;
  type: string;
  hasReminder?: boolean;
}

/**
 * Calendar event item for the calendar view
 */
export interface CalendarEventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format for calendar
  hasReminder?: boolean;
}

/**
 * API Response structure for events
 */
export interface EventApiResponse {
  eventId: string;
  title: string;
  dateTime: string;
  location?: string;
  description?: string;
  eventType: string;
  createdBy: string;
  invitees: string[];
}

/**
 * Request payload for creating/updating events
 */
export interface EventRequest {
  title: string;
  dateTime: string;
  location?: string;
  description?: string;
  eventType: string;
  createdBy: string;
  invitees: string[];
}

/**
 * Event statistics for dashboard
 */
export interface EventStats {
  totalEvents: number;
  todayEvents: number;
  upcomingEvents: number;
  byType: Record<string, number>;
}