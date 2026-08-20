import { Building2 } from 'lucide-react';

interface EventsManagementHeaderProps {
  isSuperAdmin: boolean;
  userOrganisation?: string | null;
  onAddEvent: () => void;
}

export function EventsManagementHeader({ isSuperAdmin, userOrganisation, onAddEvent }: EventsManagementHeaderProps) {
  return (
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
        </div>
        <p className="text-gray-600">
          {isSuperAdmin ? 'Manage events across all organisations' : `Manage events for ${userOrganisation || 'your organisation'}`}
        </p>
      </div>
      <button onClick={onAddEvent} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
        Add Event
      </button>
    </div>
  );
}
