// src/components/Calendar/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell, BellOff } from 'lucide-react';
import { eventService } from '../../services/EventService';
import { useAuth } from '../../context/AuthContext';
import type { CalendarEventItem, UserEventItem } from '../../interfaces/EventData';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [userEvents, setUserEvents] = useState<UserEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchCalendarData();
    }
  }, [currentDate, user?.email]);

  const fetchCalendarData = async () => {
    if (!user?.email) {
      setError('User email not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [calendarData, userEventsData] = await Promise.all([
        eventService.getCalendarEvents(user.email),
        eventService.getUserEvents(user.email)
      ]);
      
      setCalendarEvents(calendarData);
      setUserEvents(userEventsData);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasEvent = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.find(event => event.date === dateStr);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const toggleReminder = async (eventId: string, currentStatus: boolean) => {
    try {
      // This would call a reminder service to toggle reminder status
      console.log(`Toggling reminder for event ${eventId} to ${!currentStatus}`);
      // await reminderService.toggleReminder(eventId, user.email);
      
      // Refresh data to show updated reminder status
      fetchCalendarData();
    } catch (err) {
      console.error('Error toggling reminder:', err);
      setError('Failed to update reminder');
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!user?.email) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Bell className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-700">Please log in to view your calendar.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Skeleton */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(42)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Events Skeleton */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={fetchCalendarData}
              className="text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* User Info Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">My Calendar</h2>
            <p className="text-sm text-gray-600">Events for {user.email}</p>
          </div>
          <button 
            onClick={fetchCalendarData}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh Calendar
          </button>
        </div>
      </div>

      {/* Calendar and Event Reminders Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[month]} {year}
            </h3>
            <div className="flex space-x-1">
              <button
                onClick={previousMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              const isToday = day === new Date().getDate() && 
                             month === new Date().getMonth() &&
                             year === new Date().getFullYear();
              
              return (
                <div
                  key={day}
                  className={`aspect-square p-1.5 rounded-lg border transition-all cursor-pointer relative ${
                    isToday
                      ? 'bg-primary-100 border-primary-500 font-bold'
                      : hasEvents
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  title={hasEvents ? `${dayEvents.length} event(s)` : 'No events'}
                >
                  <div className="text-xs text-gray-900">{day}</div>
                  {hasEvents && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`w-1 h-1 rounded-full ${
                            event.hasReminder ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events with Reminders */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Event Reminders</h3>
            <div className="text-sm text-gray-500">
              {userEvents.length} events
            </div>
          </div>
          
          {userEvents.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{event.time}</p>
                      {event.location && (
                        <>
                          <span className="text-gray-400">•</span>
                          <p className="text-sm text-gray-600 truncate">{event.location}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleReminder(event.id, event.hasReminder || false)}
                    className={`ml-3 p-2 rounded-lg transition-colors flex-shrink-0 ${
                      event.hasReminder
                        ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                    title={event.hasReminder ? 'Disable reminder' : 'Enable reminder'}
                  >
                    {event.hasReminder ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No events with reminders</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-100 border-2 border-primary-500 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <span>Has Event</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
          <span>Reminder Set</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <span>No Reminder</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;