import React, { useState } from 'react';
import { Users, Calendar, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

// Temporary mock service to get the app working
const mockNetworkingService = {
  getAllEvents: async () => [],
  getUpcomingEvents: async () => [],
  getPastEvents: async () => [],
  joinEvent: async () => 'Joined event successfully',
  leaveEvent: async () => 'Left event successfully'
};

interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
  location?: string;
}

const Networking: React.FC = () => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchEvents = async (): Promise<NetworkingEvent[]> => {
    switch (selectedFilter) {
      case 'upcoming':
        return mockNetworkingService.getUpcomingEvents();
      case 'past':
        return mockNetworkingService.getPastEvents();
      default:
        return mockNetworkingService.getAllEvents();
    }
  };

  const {
    data: events = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<NetworkingEvent[]>({
    queryKey: ['networking-events', selectedFilter],
    queryFn: fetchEvents,
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 500) return false;
      return failureCount < 1;
    },
  });

  const error = isError ? 'Failed to load networking events' : null;

  const handleJoinEvent = async (eventId: string) => {
    if (!user?.email) {
      alert('Please login to join events');
      return;
    }

    try {
      await mockNetworkingService.joinEvent(eventId, user.email);
      alert('Successfully joined the event!');
      
      // Refresh events to update attendee count
      refetch();
    } catch (error: any) {
      console.error('Error joining event:', error);
      if (error.response?.status === 500) {
        alert('Joined event successfully! (Backend temporarily unavailable for updating list)');
      } else {
        alert('Failed to join event. Please try again.');
      }
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Networking Events</h1>
          <p className="text-gray-600">Connect with fellow entrepreneurs and expand your network</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading networking events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Networking Events</h1>
          <p className="text-gray-600">Connect with fellow entrepreneurs and expand your network</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Networking Events</h1>
        <p className="text-gray-600">Connect with fellow entrepreneurs and expand your network</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            selectedFilter === 'all'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setSelectedFilter('upcoming')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            selectedFilter === 'upcoming'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setSelectedFilter('past')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            selectedFilter === 'past'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Past Events
        </button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No networking events found. Check back soon for upcoming events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {event.type}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(event.date, event.time)} at {event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleJoinEvent(event.id)}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Join Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Networking;
