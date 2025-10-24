import React from 'react';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';

const Events: React.FC = () => {

  const todayEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00 AM",
      location: "Conference Room A",
      type: "meeting"
    },
    {
      id: 2,
      title: "Client Presentation",
      time: "2:00 PM",
      location: "Online - Zoom",
      type: "presentation"
    }
  ];

  const upcomingEvents = [
    {
      id: 3,
      title: "Workshop: Digital Marketing",
      date: "Tomorrow",
      time: "9:00 AM",
      location: "Training Center",
      type: "workshop"
    },
    {
      id: 4,
      title: "Networking Event",
      date: "Oct 18, 2025",
      time: "6:00 PM",
      location: "Business Hub",
      type: "networking"
    },
    {
      id: 5,
      title: "Quarterly Review",
      date: "Oct 20, 2025",
      time: "11:00 AM",
      location: "Office",
      type: "meeting"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">

      {/* Today's Events */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
        
        {todayEvents.length > 0 ? (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-blue-50 border border-blue-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
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
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal removed: events are admin-managed only */}
    </div>
  );
};

export default Events;
