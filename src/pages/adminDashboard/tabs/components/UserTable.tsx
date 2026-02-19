// src/pages/adminDashboard/tabs/components/UserTable.tsx
import React from 'react';
import { Users } from 'lucide-react';
import { UserTableRow } from './UserTableRow';
import type { UserWithSubscription } from './types';

interface UserTableProps {
  users: UserWithSubscription[];
  filteredUsers: UserWithSubscription[];
  loading: boolean;
  isSuperAdmin: boolean;
  currentUser: any;
  userOrganisation: string | null;
  onViewDetails: (user: UserWithSubscription) => void;
  onDelete: (userId: string, userRole: string, userOrg?: string) => void;
  formatLastSeen: (lastSeen: string) => string;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  filteredUsers,
  loading,
  isSuperAdmin,
  currentUser,
  userOrganisation,
  onViewDetails,
  onDelete,
  formatLastSeen,
  onClearFilters,
  hasActiveFilters
}) => {
  const columnCount = isSuperAdmin ? 9 : 8; // Added subscription column

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-500">Loading users from database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLE</th>
              {isSuperAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORGANISATION</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ONLINE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBSCRIPTION</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST SEEN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserTableRow
                  key={user.userId}
                  user={user}
                  isSuperAdmin={isSuperAdmin}
                  currentUser={currentUser}
                  userOrganisation={userOrganisation}
                  onViewDetails={onViewDetails}
                  onDelete={onDelete}
                  formatLastSeen={formatLastSeen}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columnCount} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {hasActiveFilters
                        ? 'No users match your search criteria.'
                        : 'There are no users to display.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={onClearFilters}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer with count */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} total users
          {!isSuperAdmin && userOrganisation && ` in ${userOrganisation}`}
        </p>
      </div>
    </div>
  );
};