// src/pages/adminDashboard/tabs/AdminManagement.tsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import AdminUserService from '../../../services/AdminUserService';
import { AdminManagementView } from './components/AdminManagementView';

interface AdminUser {
  userId: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  organisation?: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
}

const doesAdminMatchSearchQuery = (admin: AdminUser, searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  return admin.fullName.toLowerCase().includes(query) || admin.email.toLowerCase().includes(query);
};

const doesAdminMatchOrganisationFilter = (admin: AdminUser, selectedOrg: string) => {
  return selectedOrg === 'all' || admin.organisation === selectedOrg;
};

const formatAdminCreatedDate = (createdAt: string) => {
  return new Date(createdAt).toLocaleDateString();
};

const getAdminRoleBadgeClassName = (role: AdminUser['role']) => {
  return role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';
};

const getAdminStatusBadgeClassName = (status: string) => {
  return status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
};

const AdminManagement: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      // This would be a real API call
      const data = await AdminUserService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [fetchAdmins, isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only Super Admins can manage admin users.</p>
      </div>
    );
  }

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch = doesAdminMatchSearchQuery(admin, searchQuery);
      const matchesOrg = doesAdminMatchOrganisationFilter(admin, selectedOrg);
      return matchesSearch && matchesOrg;
    });
  }, [admins, searchQuery, selectedOrg]);

  const organisations = useMemo(() => {
    return [...new Set(admins.map(a => a.organisation).filter(Boolean))];
  }, [admins]);

  const stats = useMemo(() => {
    const superAdmins = admins.filter(a => a.role === 'SUPER_ADMIN').length;
    return { superAdmins };
  }, [admins]);

  return (
    <AdminManagementView
      loading={loading}
      searchQuery={searchQuery}
      selectedOrg={selectedOrg}
      organisations={organisations as string[]}
      adminsCount={admins.length}
      superAdminsCount={stats.superAdmins}
      organisationsCount={organisations.length}
      filteredAdmins={filteredAdmins}
      onSearchChange={setSearchQuery}
      onOrganisationChange={setSelectedOrg}
      formatAdminCreatedDate={formatAdminCreatedDate}
      getAdminRoleBadgeClassName={getAdminRoleBadgeClassName}
      getAdminStatusBadgeClassName={getAdminStatusBadgeClassName}
    />
  );
};

export default AdminManagement;