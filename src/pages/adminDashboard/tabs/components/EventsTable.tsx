import { Building2 } from 'lucide-react';
import type { AdminEventItem } from '../../../../interfaces/EventData';

interface EventsTableProps {
  events: AdminEventItem[];
  loading: boolean;
  isSuperAdmin: boolean;
  onView: (event: AdminEventItem) => void;
  onEdit: (event: AdminEventItem) => void;
  onDelete: (eventId: string) => void;
}

export function EventsTable({ events, loading, isSuperAdmin, onView, onEdit, onDelete }: EventsTableProps) {
  return (
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
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 7 : 6} className="px-6 py-6 text-center text-sm text-gray-600">
                  No events yet
                </td>
              </tr>
            ) : (
              events.map((event) => (
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
                    <button className="text-blue-600 hover:text-blue-800 mr-4" onClick={() => onView(event)}>
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800 mr-4" onClick={() => onEdit(event)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(event.id)}>
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
  );
}
