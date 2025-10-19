import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Events with dates (sample data)
  const eventsData = [
    { date: '2025-10-16', title: 'Team Meeting', hasReminder: true },
    { date: '2025-10-17', title: 'Workshop', hasReminder: false },
    { date: '2025-10-18', title: 'Networking Event', hasReminder: true },
    { date: '2025-10-20', title: 'Quarterly Review', hasReminder: true },
    { date: '2025-10-25', title: 'Client Call', hasReminder: false },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasEvent = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventsData.find(event => event.date === dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Calendar and Event Reminders Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-1">
              <button
                onClick={previousMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
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
              const event = hasEvent(day);
              const isToday = day === new Date().getDate() && 
                             currentDate.getMonth() === new Date().getMonth() &&
                             currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={day}
                  className={`aspect-square p-1.5 rounded-lg border transition-all cursor-pointer relative ${
                    isToday
                      ? 'bg-primary-100 border-primary-500 font-bold'
                      : event
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs text-gray-900">{day}</div>
                  {event && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events with Reminders */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Reminders</h3>
          
          <div className="space-y-3">
            {eventsData.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    event.hasReminder
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                  title={event.hasReminder ? 'Reminder enabled' : 'Enable reminder'}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend - Compact inline version */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
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
      </div>
    </div>
  );
};

export default Calendar;
