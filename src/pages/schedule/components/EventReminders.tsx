import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import type { UserEventItem } from '../../../interfaces/EventData';

interface Props {
  userEvents: UserEventItem[];
  toggleReminder: (eventId: string, currentStatus: boolean) => void;
}

const EventReminders: React.FC<Props> = ({ userEvents, toggleReminder }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Event Reminders</h3>
      <div className="text-sm text-gray-500">{userEvents.length} events</div>
    </div>

    {userEvents.length > 0 ? (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {userEvents.map(event => (
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
              {event.hasReminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
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
);

export default EventReminders;
