import { useState } from 'react';

interface AdminEventItem {
    id: string;
    title: string;
    date: string;
    time: string;
    location?: string;
}

export default function EventsTab() {
    const [eventsAdmin, setEventsAdmin] = useState<AdminEventItem[]>([]);
    const [showAddEventAdmin, setShowAddEventAdmin] = useState(false);
    const [newEvent, setNewEvent] = useState<{ title: string; date: string; time: string; location: string }>({ title: '', date: '', time: '', location: '' });
    const [editEventId, setEditEventId] = useState<string | null>(null);
    const [showViewEvent, setShowViewEvent] = useState(false);
    const [viewEvent, setViewEvent] = useState<AdminEventItem | null>(null);

    const handleAddOrUpdateEvent = () => {
        if (!newEvent.title || !newEvent.date || !newEvent.time) {
            alert('Please fill title, date and time');
            return;
        }
        
        if (editEventId) {
            setEventsAdmin(prev => prev.map(ev => 
                ev.id === editEventId 
                    ? { ...ev, title: newEvent.title, date: newEvent.date, time: newEvent.time, location: newEvent.location } 
                    : ev
            ));
        } else {
            setEventsAdmin(prev => [...prev, {
                id: String(Date.now()),
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time,
                location: newEvent.location
            }]);
        }
        
        setShowAddEventAdmin(false);
        setEditEventId(null);
        setNewEvent({ title: '', date: '', time: '', location: '' });
    };

    const handleEditEvent = (event: AdminEventItem) => {
        setEditEventId(event.id);
        setNewEvent({ 
            title: event.title, 
            date: event.date, 
            time: event.time, 
            location: event.location || '' 
        });
        setShowAddEventAdmin(true);
    };

    const handleViewEvent = (event: AdminEventItem) => {
        setViewEvent(event);
        setShowViewEvent(true);
    };

    const resetForm = () => {
        setShowAddEventAdmin(false);
        setEditEventId(null);
        setNewEvent({ title: '', date: '', time: '', location: '' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                <button 
                    onClick={() => setShowAddEventAdmin(true)} 
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                    Add Event
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {eventsAdmin.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-600">
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
                                        <td className="px-6 py-3 text-sm">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800 mr-4"
                                                onClick={() => handleViewEvent(event)}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className="text-green-600 hover:text-green-800"
                                                onClick={() => handleEditEvent(event)}
                                            >
                                                Edit
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
                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                <input 
                                    value={newEvent.title} 
                                    onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        value={newEvent.date} 
                                        onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Time</label>
                                    <input 
                                        type="time" 
                                        value={newEvent.time} 
                                        onChange={e => setNewEvent({...newEvent, time: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
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