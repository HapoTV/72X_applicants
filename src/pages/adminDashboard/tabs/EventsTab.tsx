// pages/adminDashboard/tabs/EventsTab.tsx
import { useState, useEffect } from 'react';
import { eventService } from '../../../services/EventService';
import { useAuth } from '../../../context/AuthContext';
import type { AdminEventItem, EventFormData} from '../../../interfaces/EventData';
import { DEFAULT_EVENT_TYPE, EventTypeOptions } from '../../../interfaces/EventData';
import { Building2, Crown } from 'lucide-react';

export default function EventsTab() {
  const { user, isSuperAdmin, userOrganisation } = useAuth();
  const [eventsAdmin, setEventsAdmin] = useState<AdminEventItem[]>([]);
  const [showAddEventAdmin, setShowAddEventAdmin] = useState(false);
  const [newEvent, setNewEvent] = useState<EventFormData>({ 
    title: '', 
    date: '', 
    time: '', 
    location: '',
    description: '',
    eventType: DEFAULT_EVENT_TYPE
  });
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [showViewEvent, setShowViewEvent] = useState(false);
  const [viewEvent, setViewEvent] = useState<AdminEventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminEmail = user?.email || '';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await eventService.getAllEvents();
      // Filter events by organisation if not super admin
      const filteredEvents = isSuperAdmin 
        ? events 
        : events.filter(event => event.organisation === userOrganisation);
      setEventsAdmin(filteredEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateEvent = async () => {
    // Validate form data
    const validationError = eventService.validateEventForm(newEvent);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    if (!adminEmail) {
      setError('Admin email not found');
      return;
    }
    
    try {
      setError(null);
      
      if (editEventId) {
        await eventService.updateEvent(editEventId, newEvent, adminEmail);
      } else {
        await eventService.createEvent(newEvent, adminEmail);
      }
      
      await fetchEvents(); // Refresh the list
      resetForm();
    } catch (err) {
      setError('Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setError(null);
        await eventService.deleteEvent(eventId);
        await fetchEvents(); // Refresh the list
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleEditEvent = (event: AdminEventItem) => {
    setEditEventId(event.id);
    setNewEvent(eventService.transformToFormData(event));
    setShowAddEventAdmin(true);
  };

  const handleViewEvent = (event: AdminEventItem) => {
    setViewEvent(event);
    setShowViewEvent(true);
  };

  const resetForm = () => {
    setShowAddEventAdmin(false);
    setEditEventId(null);
    setNewEvent({ 
      title: '', 
      date: '', 
      time: '', 
      location: '',
      description: '',
      eventType: DEFAULT_EVENT_TYPE
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            {!isSuperAdmin && userOrganisation && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {userOrganisation}
              </span>
            )}
            {isSuperAdmin && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Super Admin
              </span>
            )}
          </div>
          <p className="text-gray-600">
            {isSuperAdmin 
              ? 'Manage events across all organisations' 
              : `Manage events for ${userOrganisation || 'your organisation'}`}
          </p>
        </div>
        <button 
          onClick={() => setShowAddEventAdmin(true)} 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
        >
          Add Event
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORGANISATION</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 7 : 6} className="px-6 py-6 text-center text-sm text-gray-600">
                    Loading events...
                  </td>
                </tr>
              ) : eventsAdmin.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 7 : 6} className="px-6 py-6 text-center text-sm text-gray-600">
                    No events yet
                  </td>
                </tr>
              ) : (
                eventsAdmin.map(event => (
                  <tr key={event.id}>
                    <td className="px-6 py-3 text-sm text-gray-900">{event.title}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{event.date}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{event.time}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{event.location || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{event.eventType || '—'}</td>
                    {isSuperAdmin && (
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {event.organisation ? (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                            {event.organisation}
                          </div>
                        ) : '—'}
                      </td>
                    )}
                    <td className="px-6 py-3 text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        onClick={() => handleViewEvent(event)}
                      >
                        View
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800 mr-4"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddEventAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editEventId ? 'Edit Event' : 'Add Event'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title *</label>
                <input 
                  value={newEvent.title} 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg" 
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date} 
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time *</label>
                  <input 
                    type="time" 
                    value={newEvent.time} 
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Location</label>
                <input 
                  value={newEvent.location} 
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea 
                  value={newEvent.description} 
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg" 
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Event Type</label>
                <select 
                  value={newEvent.eventType} 
                  onChange={e => setNewEvent({...newEvent, eventType: e.target.value as any})} 
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {EventTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddOrUpdateEvent}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                >
                  {editEventId ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {showViewEvent && viewEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><span className="font-medium">Title:</span> {viewEvent.title}</div>
              <div><span className="font-medium">Date:</span> {viewEvent.date}</div>
              <div><span className="font-medium">Time:</span> {viewEvent.time}</div>
              <div><span className="font-medium">Location:</span> {viewEvent.location || '—'}</div>
              {viewEvent.organisation && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Organisation:</span>
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                    {viewEvent.organisation}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                className="px-4 py-2 border rounded-lg" 
                onClick={() => { setShowViewEvent(false); setViewEvent(null); }}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                onClick={() => { 
                  setShowViewEvent(false); 
                  handleEditEvent(viewEvent);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}