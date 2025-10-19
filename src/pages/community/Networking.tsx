import React from 'react';
import { Users, Clock, Plus } from 'lucide-react';

const Networking: React.FC = () => {
  const networkingEvents = [
    {
      id: 1,
      title: 'Virtual Startup Pitch Night',
      date: 'March 15, 2024',
      time: '7:00 PM EST',
      attendees: 45,
      type: 'Virtual Event',
      description: 'Present your startup idea and get feedback from experienced entrepreneurs.'
    },
    {
      id: 2,
      title: 'E-commerce Entrepreneurs Meetup',
      date: 'March 20, 2024',
      time: '6:30 PM EST',
      attendees: 32,
      type: 'Industry Specific',
      description: 'Connect with fellow e-commerce business owners and share strategies.'
    },
    {
      id: 3,
      title: 'Women in Business Leadership Forum',
      date: 'March 25, 2024',
      time: '2:00 PM EST',
      attendees: 67,
      type: 'Community Focus',
      description: 'Empowering women entrepreneurs through networking and mentorship.'
    },
    {
      id: 4,
      title: 'Tech Startup Founders Roundtable',
      date: 'March 28, 2024',
      time: '5:00 PM EST',
      attendees: 28,
      type: 'Industry Specific',
      description: 'Monthly gathering for tech startup founders to discuss challenges and solutions.'
    },
    {
      id: 5,
      title: 'Small Business Networking Mixer',
      date: 'April 2, 2024',
      time: '6:00 PM EST',
      attendees: 52,
      type: 'General Networking',
      description: 'Casual networking event for small business owners across all industries.'
    },
    {
      id: 6,
      title: 'Investor Meetup & Speed Networking',
      date: 'April 5, 2024',
      time: '7:30 PM EST',
      attendees: 41,
      type: 'Funding Focus',
      description: 'Meet potential investors and practice your pitch in a speed networking format.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Networking Events</h1>
        <p className="text-gray-600">Connect with fellow entrepreneurs and expand your network</p>
      </div>

      {/* Create Event Button */}
      <button className="w-full md:w-auto px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
        <Plus className="w-5 h-5" />
        <span>Create Event</span>
      </button>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networkingEvents.map(event => (
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
                <Clock className="w-4 h-4" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
            
            <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
              Join Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Networking;
