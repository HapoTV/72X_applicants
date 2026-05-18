// pages/adminDashboard/tabs/EventsTab.tsx
import { useState, useEffect } from 'react';
import { eventService } from '../../../services/EventService';
import { useAuth } from '../../../context/AuthContext';
import type { AdminEventItem, EventFormData} from '../../../interfaces/EventData';
import { DEFAULT_EVENT_TYPE } from '../../../interfaces/EventData';
import { EventsManagementHeader } from './components/EventsManagementHeader';
import { EventsTable } from './components/EventsTable';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailsModal } from './components/EventDetailsModal';

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

  const closeViewEvent = () => {
    setShowViewEvent(false);
    setViewEvent(null);
  };

  const handleEditViewedEvent = (event: AdminEventItem) => {
    closeViewEvent();
    handleEditEvent(event);
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
    <div className="w-full">
      <EventsManagementHeader
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        onAddEvent={() => setShowAddEventAdmin(true)}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <EventsTable
        events={eventsAdmin}
        loading={loading}
        isSuperAdmin={isSuperAdmin}
        onView={handleViewEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {showAddEventAdmin && (
        <EventFormModal
          event={newEvent}
          isEditing={Boolean(editEventId)}
          onEventChange={setNewEvent}
          onCancel={resetForm}
          onSubmit={handleAddOrUpdateEvent}
        />
      )}

      {showViewEvent && viewEvent && (
        <EventDetailsModal event={viewEvent} onClose={closeViewEvent} onEdit={handleEditViewedEvent} />
      )}
    </div>
  );
}