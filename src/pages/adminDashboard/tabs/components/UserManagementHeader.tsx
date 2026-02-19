// src/pages/adminDashboard/tabs/components/UserManagementHeader.tsx
import React from 'react';
import { Users, Shield, Building2, UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  isSuperAdmin: boolean;
  userOrganisation: string | null;
  totalUsers: number;
  totalOrganisations: number;
  statsTotalUsers: number;
  onAddUser: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  isSuperAdmin,
  userOrganisation,
  totalUsers,
  totalOrganisations,
  statsTotalUsers,
  onAddUser
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          User Management
          {isSuperAdmin ? (
            <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Viewing All {totalUsers} Users
            </span>
          ) : (
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {userOrganisation || 'Admin'} • {statsTotalUsers} Users
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-1">
          {isSuperAdmin 
            ? `Managing ${totalUsers} total users across ${totalOrganisations} organisations`
            : `Managing ${statsTotalUsers} users in ${userOrganisation || 'your organisation'}`}
        </p>
      </div>
      
      <div className="flex gap-2">
        {/* Add Admin Button - Only for admins/super admins */}
        {(isSuperAdmin) && (
          <button
            onClick={onAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add {isSuperAdmin ? 'Admin/User' : 'User'}
          </button>
        )}
      </div>
    </div>
  );
};