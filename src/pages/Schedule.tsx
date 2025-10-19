import React, { useState } from 'react';
import { Calendar, Clock, Plus, Video, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'session' | 'deadline' | 'reminder';
  description?: string;
  location?: string;
}

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events
  const events: Event[] = [
    {
      id: 1,
      title: 'Marketing Strategy Meeting',
      date: '2025-10-16',
      time: '10:00 AM',
      type: 'meeting',
      description: 'Discuss Q4 marketing campaigns',
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'Expert Session: Financial Planning',
      date: '2025-10-16',
      time: '2:00 PM',
      type: 'session',
      description: 'Learn about cash flow management',
      location: 'Virtual'
    },
    {
      id: 3,
      title: 'Business Plan Submission',
      date: '2025-10-18',
      time: '5:00 PM',
      type: 'deadline',
      description: 'Submit updated business plan'
    },
    {
      id: 4,
      title: 'Team Standup',
      date: '2025-10-17',
      time: '9:00 AM',
      type: 'meeting',
      location: 'Office'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'session':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'session':
        return <Video className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate > today;
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Schedule</h1>
            </div>
            <p className="text-primary-100">
              Manage your meetings, sessions, and important deadlines
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5; // Adjust based on first day of month
              const isToday = day === new Date().getDate() && 
                             currentDate.getMonth() === new Date().getMonth();
              const hasEvent = events.some(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === day && 
                       eventDate.getMonth() === currentDate.getMonth();
              });

              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${
                    day > 0 && day <= 31
                      ? isToday
                        ? 'bg-primary-500 text-white font-bold'
                        : hasEvent
                        ? 'bg-primary-50 text-primary-700 font-medium hover:bg-primary-100'
                        : 'hover:bg-gray-50 text-gray-700'
                      : 'text-gray-300'
                  }`}
                >
                  {day > 0 && day <= 31 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Events */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex items-start space-x-2">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs mt-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </p>
                        {event.location && (
                          <p className="text-xs mt-1 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No events scheduled for today</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                  >
                    <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
