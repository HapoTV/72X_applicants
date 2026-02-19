// src/pages/adminDashboard/tabs/components/UserFilters.tsx
import React from 'react';
import { Filter } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  organisationFilter: string;
  onOrganisationChange: (value: string) => void;
  organisations: string[];
  isSuperAdmin: boolean;
  filteredCount: number;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  organisationFilter,
  onOrganisationChange,
  organisations,
  isSuperAdmin,
  filteredCount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Filters ({filteredCount} users match)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            placeholder="Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>

        {/* Status filter */}
        <select
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        {/* Role filter */}
        <select
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="USER">Users</option>
          <option value="ADMIN">Admins</option>
          {isSuperAdmin && <option value="SUPER_ADMIN">Super Admins</option>}
        </select>

        {/* Organisation filter - super admin only */}
        {isSuperAdmin && (
          <select
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={organisationFilter}
            onChange={(e) => onOrganisationChange(e.target.value)}
          >
            <option value="all">All Organisations ({organisations.length})</option>
            {organisations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};