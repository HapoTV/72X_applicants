// src/components/Events/Events.tsx
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { eventService } from '../../services/EventService';
import { useAuth } from '../../context/AuthContext';
import type { UserEventItem } from '../../interfaces/EventData';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<UserEventItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UserEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchEvents();
    }
  }, [user?.email]);

  const fetchEvents = async () => {
    if (!user?.email) {
      setError('User email not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [today, upcoming] = await Promise.all([
        eventService.getTodayEvents(user.email),
        eventService.getUpcomingEvents(user.email)
      ]);
      
      setTodayEvents(today);
      setUpcomingEvents(upcoming);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    fetchEvents();
  };

  if (!user?.email) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <CalendarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-700">Please log in to view your events.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
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
              onClick={refreshEvents}
              className="text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Today's Events */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Events</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 text-right">
              for {user.email}
            </span>
            <button 
              onClick={refreshEvents}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
        
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
                  {event.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No events scheduled for today</p>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {upcomingEvents.length} events
            </span>
          </div>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;