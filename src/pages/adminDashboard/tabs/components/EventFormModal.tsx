import type { EventFormData } from '../../../../interfaces/EventData';
import { EventTypeOptions } from '../../../../interfaces/EventData';

interface EventFormModalProps {
  event: EventFormData;
  isEditing: boolean;
  onEventChange: (event: EventFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function EventFormModal({ event, isEditing, onEventChange, onCancel, onSubmit }: EventFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Event' : 'Add Event'}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title *</label>
            <input
              value={event.title}
              onChange={(e) => onEventChange({ ...event, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => onEventChange({ ...event, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => onEventChange({ ...event, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Location</label>
            <input
              value={event.location}
              onChange={(e) => onEventChange({ ...event, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              value={event.description}
              onChange={(e) => onEventChange({ ...event, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Event Type</label>
            <select
              value={event.eventType}
              onChange={(e) => onEventChange({ ...event, eventType: e.target.value as EventFormData['eventType'] })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {EventTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button onClick={onSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
              {isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
