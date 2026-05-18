import React from 'react';
import { Shield, Search, Plus, Edit, Trash2, Crown, User } from 'lucide-react';

type AdminUser = {
  userId: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  organisation?: string;
  status: string;
  createdAt: string;
};

type AdminManagementViewProps = {
  loading: boolean;
  searchQuery: string;
  selectedOrg: string;
  organisations: string[];
  adminsCount: number;
  superAdminsCount: number;
  organisationsCount: number;
  filteredAdmins: AdminUser[];
  onSearchChange: (value: string) => void;
  onOrganisationChange: (value: string) => void;
  formatAdminCreatedDate: (createdAt: string) => string;
  getAdminRoleBadgeClassName: (role: AdminUser['role']) => string;
  getAdminStatusBadgeClassName: (status: string) => string;
};

export function AdminManagementView({
  loading,
  searchQuery,
  selectedOrg,
  organisations,
  adminsCount,
  superAdminsCount,
  organisationsCount,
  filteredAdmins,
  onSearchChange,
  onOrganisationChange,
  formatAdminCreatedDate,
  getAdminRoleBadgeClassName,
  getAdminStatusBadgeClassName,
}: AdminManagementViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" />
            Admin Management
          </h1>
          <p className="text-gray-600 mt-1">Manage administrators and super admins</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedOrg}
            onChange={(e) => onOrganisationChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Organisations</option>
            {organisations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Admins</p>
          <p className="text-2xl font-bold text-gray-900">{adminsCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Super Admins</p>
          <p className="text-2xl font-bold text-purple-600">{superAdminsCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Organisations</p>
          <p className="text-2xl font-bold text-gray-900">{organisationsCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      ) : filteredAdmins.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        {admin.role === 'SUPER_ADMIN' ? (
                          <Crown className="w-4 h-4 text-purple-600" />
                        ) : (
                          <User className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{admin.fullName}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAdminRoleBadgeClassName(admin.role)}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{admin.organisation || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAdminStatusBadgeClassName(admin.status)}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatAdminCreatedDate(admin.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 mr-3">
                      <Crown className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try a different search term' : 'Start by adding your first admin'}
          </p>
          {!searchQuery && (
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" />
              <span>Add Admin</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
