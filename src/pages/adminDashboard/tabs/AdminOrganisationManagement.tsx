// src/pages/adminDashboard/tabs/AdminOrganisationManagement.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Users, Search, Plus, Edit, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import AdminUserService from '../../../services/AdminUserService';

interface Organisation {
  name: string;
  userCount: number;
  adminCount: number;
  createdAt: string;
}

const AdminOrganisationManagement: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganisations();
    }
  }, [isSuperAdmin]);

  const fetchOrganisations = async () => {
    try {
      setLoading(true);
      // This would be a real API call
      const data = await AdminUserService.getAllOrganisations();
      setOrganisations(data);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only Super Admins can access organisation management.</p>
      </div>
    );
  }

  const filteredOrgs = organisations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-primary-600" />
            Organisation Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all organisations and their admins</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" />
          <span>Add Organisation</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search organisations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Organisations</p>
          <p className="text-2xl font-bold text-gray-900">{organisations.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {organisations.reduce((sum, org) => sum + org.userCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-gray-600 text-sm">Total Admins</p>
          <p className="text-2xl font-bold text-gray-900">
            {organisations.reduce((sum, org) => sum + org.adminCount, 0)}
          </p>
        </div>
      </div>

      {/* Organisations List */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organisations...</p>
        </div>
      ) : filteredOrgs.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrgs.map((org) => (
                <tr key={org.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{org.userCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{org.adminCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 mr-3">
                      <Edit className="w-4 h-4" />
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
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organisations found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try a different search term' : 'Start by adding your first organisation'}
          </p>
          {!searchQuery && (
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" />
              <span>Add Organisation</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrganisationManagement;