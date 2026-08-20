import { Building2 } from 'lucide-react';
import type { AdminEventItem } from '../../../../interfaces/EventData';

interface EventDetailsModalProps {
  event: AdminEventItem;
  onClose: () => void;
  onEdit: (event: AdminEventItem) => void;
}

export function EventDetailsModal({ event, onClose, onEdit }: EventDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div><span className="font-medium">Title:</span> {event.title}</div>
          <div><span className="font-medium">Date:</span> {event.date}</div>
          <div><span className="font-medium">Time:</span> {event.time}</div>
          <div><span className="font-medium">Location:</span> {event.location || '—'}</div>
          {event.organisation && (
            <div className="flex items-center">
              <span className="font-medium mr-2">Organisation:</span>
              <span className="flex items-center">
                <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                {event.organisation}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 border rounded-lg" onClick={onClose}>
            Close
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg" onClick={() => onEdit(event)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
