import React, { useCallback, useState, useEffect } from 'react';
import { Calendar, Clock, Video, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/EventService';
import { useAuth } from '../context/AuthContext';
import type { UserEventItem } from '../interfaces/EventData';
import type { EventFormData } from '../interfaces/EventData';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog';
import { DEFAULT_EVENT_TYPE, EventTypeOptions } from '../interfaces/EventData';
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'session' | 'deadline' | 'reminder';
  description?: string;
  location?: string;
}

type ViewMode = 'calendar' | 'events';

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Fetch events from backend
  const {
    data,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<{ today: UserEventItem[]; upcoming: UserEventItem[] }>({
    queryKey: ['events', user?.email],
    queryFn: async () => {
      const [today, upcoming] = await Promise.all([
        eventService.getTodayEvents(user!.email),
        eventService.getUpcomingEvents(user!.email),
      ]);
      return { today, upcoming };
    },
    staleTime: 3 * 60 * 1000,
    enabled: !!user?.email,
  });

  const todayEventsList = data?.today ?? [];
  const upcomingEventsList = data?.upcoming ?? [];
  const error = isError ? 'Failed to load events' : null;

  // Local user events fetched from backend (used for calendar and lists)
  const [userEvents, setUserEvents] = useState<UserEventItem[]>([]);

  // Local state for Add Event dialog/form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    location: '',
    description: '',
    eventType: DEFAULT_EVENT_TYPE,
  });

  const loadLocalEvents = useCallback((): UserEventItem[] => {
    try {
      const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw) as UserEventItem[];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.error('Failed to parse local events', e);
      return [];
    }
  }, []);

  const fetchUserEvents = useCallback(async () => {
    try {
      const ev = await eventService.getUserEvents();
      const local = loadLocalEvents();
      setUserEvents([...ev, ...local]);
    } catch (e) {
      console.error('Failed to load user events for calendar', e);
    }
  }, [loadLocalEvents]);

  useEffect(() => {
    if (user?.email) {
      void fetchUserEvents();
    }
  }, [fetchUserEvents, user?.email]);

  // ensure we pick up any local events if service not available yet
  useEffect(() => {
    const local = loadLocalEvents();
    if (local.length > 0) setUserEvents(prev => [...prev, ...local.filter(l => !prev.find(p => p.id === l.id))]);
  }, [loadLocalEvents]);

  const queryClient = useQueryClient();

  const LOCAL_EVENTS_KEY = 'local_user_events';

  const saveLocalEvent = (ev: UserEventItem) => {
    try {
      const existing = loadLocalEvents();
      const next = [...existing, ev];
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save local event', e);
    }
  };

  const handleFormChange = (key: keyof EventFormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Save locally for now
    const rawDateTime = `${form.date} ${form.time}:00`;
    const newEvent: UserEventItem = {
      id: Date.now().toString(),
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      type: form.eventType,
      organisation: undefined,
      hasReminder: false,
      rawDateTime,
    };

    try {
      saveLocalEvent(newEvent);
      setUserEvents(prev => [...prev, newEvent]);
      setIsAddOpen(false);
      setForm({
        title: '',
        date: new Date().toISOString().slice(0, 10),
        time: '09:00',
        location: '',
        description: '',
        eventType: DEFAULT_EVENT_TYPE,
      });
      // Trigger refetch for server lists if present
      queryClient.invalidateQueries(['events', user?.email]);
    } catch (err) {
      console.error('Failed to save event locally', err);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return { bg: 'bg-blue-500', text: 'text-white', badge: 'bg-blue-600 text-white' };
      case 'session':
        return { bg: 'bg-purple-500', text: 'text-white', badge: 'bg-purple-600 text-white' };
      case 'deadline':
        return { bg: 'bg-red-500', text: 'text-white', badge: 'bg-red-600 text-white' };
      case 'reminder':
        return { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-600 text-white' };
      default:
        return { bg: 'bg-gray-500', text: 'text-white', badge: 'bg-gray-600 text-white' };
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

  // Get events for a specific date (from backend user events)
  const getEventsForDate = (day: number) => {
    if (day <= 0 || day > 31) return [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return userEvents
      .filter(ev => {
        const raw = ev.rawDateTime || '';
        const datePart = raw.split(' ')[0]; // YYYY-MM-DD
        if (!datePart) return false;
        const d = new Date(datePart + 'T00:00:00');
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
      })
      .map(ev => ({
        id: Number(ev.id) || Math.floor(Math.random() * 100000),
        title: ev.title,
        date: ev.rawDateTime ? ev.rawDateTime.split(' ')[0] : ev.date,
        time: ev.time,
        type: (ev.type || 'meeting').toLowerCase() as Event['type'],
        description: ev?.description,
        location: ev.location,
      } as Event));
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

  const todayEvents = userEvents.filter(ev => {
    const raw = ev.rawDateTime || '';
    const datePart = raw.split(' ')[0] || ev.date;
    const d = new Date(datePart + 'T00:00:00');
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const upcomingEvents = userEvents
    .filter(ev => {
      const raw = ev.rawDateTime || '';
      const datePart = raw.split(' ')[0] || ev.date;
      const d = new Date(datePart + 'T00:00:00');
      const today = new Date();
      return d > today;
    })
    .slice(0, 5);

  // Merge server lists (from query) with local events so Events view shows both
  const combinedTodayList = [...todayEventsList, ...todayEvents];
  const combinedUpcomingList = [...upcomingEventsList, ...upcomingEvents];

  if (!user?.email) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          </div>
          <p className="text-gray-600">
            Manage your meetings, sessions, and important deadlines
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-700">Please log in to view your schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-2">
            Manage your meetings, sessions, and important deadlines
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 py-4 px-6 font-medium transition-colors text-center ${
              viewMode === 'calendar'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('events')}
            className={`flex-1 py-4 px-6 font-medium transition-colors text-center ${
              viewMode === 'events'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events List
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <div className="lg:col-span-2">
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
                    const dayEvents = getEventsForDate(day);

                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 rounded-lg border-2 transition-colors ${
                          day > 0 && day <= 31
                            ? isToday
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            : 'border-gray-100 bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          {day > 0 && day <= 31 ? day : ''}
                        </div>
                        {day > 0 && day <= 31 && dayEvents.length > 0 && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const colors = getEventTypeColor(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs px-2 py-1 rounded font-medium ${colors.badge} truncate cursor-pointer hover:shadow-sm transition-shadow`}
                                  title={event.title}
                                >
                                  {event.time.split(' ')[0]} {event.title.substring(0, 12)}
                                </div>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-600 px-2 py-1 font-medium">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Events Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
                  {todayEvents.length > 0 ? (
                    <div className="space-y-3">
                      {todayEvents.map(event => {
                        const colors = getEventTypeColor(event.type);
                        return (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-l-4 ${colors.badge} bg-opacity-10`}
                          >
                            <div className="flex items-start space-x-2">
                              <div className={`p-2 rounded ${colors.bg}`}>
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                                <p className="text-xs mt-1 flex items-center space-x-1 text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  <span>{event.time}</span>
                                </p>
                                {event.location && (
                                  <p className="text-xs mt-1 flex items-center space-x-1 text-gray-600">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.location}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No events scheduled for today</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingEvents.map(event => {
                        const colors = getEventTypeColor(event.type);
                        return (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors`}
                          >
                            <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 mb-2">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </p>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>
                              {event.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No upcoming events</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events List View */}
        {viewMode === 'events' && (
          <div className="p-6">
            <div className="space-y-6 animate-fade-in">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-red-700 text-sm">{error}</p>
                    <button 
                      onClick={() => refetch()}
                      className="text-red-700 hover:text-red-800 text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Today's Events */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Events</h3>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => refetch()}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Refresh
                        </button>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                          <DialogTrigger asChild>
                            <button className="bg-primary-600 text-white text-sm px-3 py-2 rounded-md hover:bg-primary-700">Add Event</button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Personal Event</DialogTitle>
                              <DialogDescription>Add an event to your personal schedule</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required value={form.title} onChange={e => handleFormChange('title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Date</label>
                                  <input required type="date" value={form.date} onChange={e => handleFormChange('date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Time</label>
                                  <input required type="time" value={form.time} onChange={e => handleFormChange('time', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input value={form.location} onChange={e => handleFormChange('location', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={form.eventType} onChange={e => handleFormChange('eventType', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200">
                                  {EventTypeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea value={form.description} onChange={e => handleFormChange('description', e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
                              </div>
                              <DialogFooter className="flex items-center justify-end space-x-2">
                                <DialogClose asChild>
                                  <button type="button" className="px-3 py-2 rounded-md border">Cancel</button>
                                </DialogClose>
                                <button type="submit" className="px-3 py-2 rounded-md bg-primary-600 text-white">Create</button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    {combinedTodayList.length > 0 ? (
                      <div className="space-y-3">
                        {combinedTodayList.map((event) => {
                          const colors = getEventTypeColor(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg border-l-4 ${colors.badge} bg-opacity-10 hover:shadow-md transition-shadow`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
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
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colors.badge}`}>
                                  {event.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No events scheduled for today</p>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                      <span className="text-sm text-gray-500">
                        {upcomingEventsList.length} events
                      </span>
                    </div>
                    
                    {combinedUpcomingList.length > 0 ? (
                      <div className="space-y-3">
                        {combinedUpcomingList.map((event) => {
                          const colors = getEventTypeColor(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50 hover:shadow-md transition-shadow`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-4 h-4" />
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
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colors.badge}`}>
                                  {event.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No upcoming events</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
