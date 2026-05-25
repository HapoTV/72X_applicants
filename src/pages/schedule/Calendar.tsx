// src/pages/schedule/Calendar.tsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/EventService';
import { useAuth } from '../../context/AuthContext';
import type { CalendarEventItem, UserEventItem } from '../../interfaces/EventData';
import CalendarSkeleton from './components/CalendarSkeleton';
import CalendarHeader from './components/CalendarHeader';
import CalendarMonth from './components/CalendarMonth';
import EventReminders from './components/EventReminders';
import CalendarLegend from './components/CalendarLegend';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  const {
    data,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<{ calendarEvents: CalendarEventItem[]; userEvents: UserEventItem[] }>(
    {
      queryKey: ['calendar', user?.email, monthKey],
      queryFn: async () => {
        const [calendarData, userEventsData] = await Promise.all([
          eventService.getCalendarEvents(),
          eventService.getUserEvents(),
        ]);
        return { calendarEvents: calendarData, userEvents: userEventsData };
      },
      staleTime: 3 * 60 * 1000,
      enabled: !!user?.email,
    }
  );

  const calendarEvents = data?.calendarEvents ?? [];
  const userEvents = data?.userEvents ?? [];
  const error = isError ? 'Failed to load calendar data' : null;

  const fetchCalendarData = () => {
    refetch();
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

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const toggleReminder = async (eventId: string, currentStatus: boolean) => {
    try {
      console.log(`Toggling reminder for event ${eventId} to ${!currentStatus}`);
      fetchCalendarData();
    } catch (err) {
      console.error('Error toggling reminder:', err);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

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
    return <CalendarSkeleton />;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <CalendarHeader
            monthName={monthNames[month]}
            year={year}
            onPrevious={previousMonth}
            onNext={nextMonth}
          />
          <CalendarMonth
            monthName={monthNames[month]}
            year={year}
            month={month}
            dayNames={dayNames}
            startingDayOfWeek={startingDayOfWeek}
            daysInMonth={daysInMonth}
            getEventsForDay={getEventsForDay}
          />
        </div>

        <EventReminders userEvents={userEvents} toggleReminder={toggleReminder} />
      </div>

      <CalendarLegend />
    </div>
  );
};

export default Calendar;
