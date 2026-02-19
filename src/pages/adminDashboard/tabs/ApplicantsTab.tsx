// src/pages/adminDashboard/tabs/ApplicantsTab.tsx
import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';

import { UserManagementHeader } from './components/UserManagementHeader';
import { UserStats } from './components/UserStats';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { AddUserModal } from './components/AddUserModal';

import type { User } from '../../../interfaces/UserData';
import type { UserWithSubscription, StatsData, NewUserData } from './components/types';

export default function ApplicantsTab() {
  const { isSuperAdmin, userOrganisation, user, updateUserOrganisation } = useAuth();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [organisationFilter, setOrganisationFilter] = useState<string>('all');

  const [organisations, setOrganisations] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeUsers: 0,
    onlineUsers: 0,
    offlineUsers: 0,
    inactiveUsers: 0,
    freeTrialUsers: 0,
    totalOrganisations: 0,
    adminsCount: 0,
    usersCount: 0
  });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState<NewUserData>({
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    organisation: '',
    employees: '',
    founded: '',
    industry: '',
    location: '',
    role: 'ADMIN',
    status: 'ACTIVE'
  });
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Fetch current user's organisation if missing
  useEffect(() => {
    const fetchCurrentUserOrganisation = async () => {
      if (!isSuperAdmin && !userOrganisation && user) {
        try {
          console.log('🔍 Fetching current user organisation...');
          const response = await axiosClient.get('/users/me');
          const currentUser = response.data;
          
          if (currentUser.organisation) {
            console.log('✅ Fetched organisation:', currentUser.organisation);
            updateUserOrganisation(currentUser.organisation);
          } else {
            console.error('❌ User has no organisation in backend');
            setFetchError('Your account has no organisation assigned. Please contact support.');
          }
        } catch (error) {
          console.error('❌ Failed to fetch current user:', error);
          setFetchError('Failed to load your profile. Please try refreshing.');
        }
      }
    };

    fetchCurrentUserOrganisation();
  }, [isSuperAdmin, userOrganisation, user, updateUserOrganisation]);

  useEffect(() => {
    if (!isSuperAdmin && !userOrganisation) {
      // Wait for organisation to be fetched
      console.log('⏳ Waiting for organisation to be fetched...');
      return;
    }
    
    fetchAllUsers();
  }, [isSuperAdmin, userOrganisation]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      console.log("Current auth state:", {
        isSuperAdmin,
        userOrganisation,
        userRole: user?.role,
        userEmail: user?.email
      });
      
      let response;
      let allUsers: User[] = [];
      
      if (isSuperAdmin) {
        // Super admin - fetch all users
        console.log('👑 Super admin fetching all users...');
        response = await axiosClient.get('/users/admin/all');
        allUsers = response.data;
        console.log(`✅ Super Admin fetched ${allUsers.length} users from backend`);
      } else {
        // Regular admin - fetch users from their organisation only
        if (userOrganisation) {
          console.log(`👤 Admin fetching users for organisation: ${userOrganisation}`);
          
          try {
            // Try the organisation-specific endpoint first
            response = await axiosClient.get(`/users/organisation/${userOrganisation}`);
            allUsers = response.data;
            console.log(`✅ Admin fetched ${allUsers.length} users for organisation: ${userOrganisation}`);
          } catch (orgError: any) {
            console.warn('⚠️ Organisation endpoint failed, falling back to filtering:', orgError.message);
            
            // Fallback: fetch all and filter
            response = await axiosClient.get('/users/admin/all');
            const allUsersData = response.data;
            allUsers = allUsersData.filter((u: User) => 
              u.organisation === userOrganisation
            );
            console.log(`✅ Admin fetched and filtered ${allUsers.length} users for organisation: ${userOrganisation}`);
          }
        } else {
          console.error('❌ No organisation found for admin');
          setFetchError('Your account has no organisation assigned. Please contact support.');
          setLoading(false);
          return;
        }
      }
      
      // Filter out SUPER_ADMIN users for non-super admins
      if (!isSuperAdmin) {
        allUsers = allUsers.filter(u => u.role !== 'SUPER_ADMIN');
        console.log(`🔍 Filtered out super admins, remaining: ${allUsers.length} users`);
      }
      
      // Enhance users with subscription and online status
      const enhancedUsers = await Promise.all(
        allUsers.map(async (userData) => {
          try {
            let subscription = null;
            try {
              // You can implement bulk subscription fetch here
              // subscription = await userSubscriptionService.getUserPackage(userData.userId);
            } catch (error) {
              // Silently fail
            }
            
            const isOnline = checkUserOnlineStatus(userData);
            
            return {
              ...userData,
              subscription,
              isOnline,
              lastActive: userData.lastSeenAt || userData.updatedAt || new Date().toISOString()
            };
          } catch (error) {
            return {
              ...userData,
              subscription: null,
              isOnline: false,
              lastActive: userData.lastSeenAt || userData.updatedAt || new Date().toISOString()
            };
          }
        })
      );

      setUsers(enhancedUsers);
      
      // Extract unique organisations (for super admin only)
      if (isSuperAdmin) {
        const uniqueOrgs = [...new Set(enhancedUsers
          .map(u => u.organisation)
          .filter((org): org is string => org !== undefined && org !== null && org !== '')
        )];
        setOrganisations(uniqueOrgs);
      }
      
      calculateStats(enhancedUsers);
      
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setFetchError(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkUserOnlineStatus = (userData: User): boolean => {
    if (userData.availabilityStatus === 'ONLINE') return true;
    
    if (userData.lastSeenAt) {
      const lastSeen = new Date(userData.lastSeenAt).getTime();
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;
      return (now - lastSeen) < fiveMinutes;
    }
    
    return false;
  };

  const calculateStats = (usersList: UserWithSubscription[]) => {
    // No need to filter again since usersList is already filtered
    const relevantUsers = usersList;

    const activeUsers = relevantUsers.filter(u => 
      u.status === 'ACTIVE' || u.status === 'active'
    );
    
    const onlineUsers = relevantUsers.filter(u => u.isOnline);
    
    const freeTrialUsers = relevantUsers.filter(u => 
      u.subscription?.subscriptionType === 'START_UP' && 
      u.subscription?.trialEndsAt && 
      new Date(u.subscription.trialEndsAt) > new Date()
    );
    
    const uniqueOrgs = isSuperAdmin 
      ? [...new Set(usersList.map(u => u.organisation).filter(Boolean))]
      : [];

    setStats({
      totalUsers: relevantUsers.length,
      activeUsers: activeUsers.length,
      onlineUsers: onlineUsers.length,
      offlineUsers: relevantUsers.length - onlineUsers.length,
      inactiveUsers: relevantUsers.filter(u => u.status === 'INACTIVE' || u.status === 'inactive').length,
      freeTrialUsers: freeTrialUsers.length,
      totalOrganisations: uniqueOrgs.length,
      adminsCount: relevantUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
      usersCount: relevantUsers.filter(u => u.role === 'USER').length
    });
  };

  useEffect(() => {
    let filtered = [...users];

    // For non-super admins, ensure filtering is applied correctly
    if (!isSuperAdmin && userOrganisation) {
      filtered = filtered.filter(u => u.organisation === userOrganisation);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.fullName?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.mobileNumber?.toLowerCase().includes(searchLower) ||
        u.companyName?.toLowerCase().includes(searchLower) ||
        u.organisation?.toLowerCase().includes(searchLower) ||
        u.userId?.toLowerCase().includes(searchLower) ||
        u.businessReference?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(u => {
        if (statusFilter === 'Active') return u.status === 'ACTIVE' || u.status === 'active';
        if (statusFilter === 'Inactive') return u.status === 'INACTIVE' || u.status === 'inactive';
        if (statusFilter === 'Pending') return u.status === 'PENDING' || u.status === 'pending' || u.status === 'PENDING_PASSWORD';
        if (statusFilter === 'Online') return u.isOnline;
        if (statusFilter === 'Offline') return !u.isOnline;
        return true;
      });
    }

    if (roleFilter !== 'All') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (isSuperAdmin && organisationFilter !== 'all') {
      filtered = filtered.filter(u => u.organisation === organisationFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter, organisationFilter, isSuperAdmin, userOrganisation]);

  const handleAddAdmin = async () => {
    if (!newAdminData.email || !newAdminData.fullName) {
      alert('Please fill in required fields');
      return;
    }
    
    setAddingAdmin(true);
    try {
      await axiosClient.post('/users/admin', {
        ...newAdminData,
        organisation: newAdminData.organisation || userOrganisation || '',
        role: newAdminData.role,
        status: 'ACTIVE'
      });
      
      alert(`${newAdminData.role} created successfully.`);
      setShowAddAdminModal(false);
      setNewAdminData({
        fullName: '',
        email: '',
        mobileNumber: '',
        companyName: '',
        organisation: '',
        employees: '',
        founded: '',
        industry: '',
        location: '',
        role: 'ADMIN',
        status: 'ACTIVE'
      });
      
      fetchAllUsers();
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      alert(`Error creating user: ${error.response?.data || error.message}`);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteUser = async (userId: string, userRole: string, userOrg?: string) => {
    if (!isSuperAdmin && userRole === 'SUPER_ADMIN') {
      alert('You cannot delete a super admin.');
      return;
    }
    
    if (!isSuperAdmin && userRole === 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      if (userOrg !== userOrganisation) {
        alert('You can only delete users from your own organisation.');
        return;
      }
    }
    
    if (userId === user?.userId) {
      alert('You cannot delete your own account.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axiosClient.delete(`/users/admin/${userId}`);
        alert('User deleted successfully');
        fetchAllUsers();
      } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(`Error deleting user: ${error.response?.data || error.message}`);
      }
    }
  };

  const formatLastSeen = (lastSeenAt: string): string => {
    const lastSeen = new Date(lastSeenAt);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const handleViewDetails = (user: UserWithSubscription) => {
    // Implement view details logic
    console.log('View details for user:', user);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setRoleFilter('All');
    if (isSuperAdmin) setOrganisationFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || 
    statusFilter !== 'All' || 
    roleFilter !== 'All' || 
    (isSuperAdmin && organisationFilter !== 'all');

  // Show error state
  if (fetchError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600">{fetchError}</p>
          <button
            onClick={() => {
              setFetchError(null);
              fetchAllUsers();
            }}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UserManagementHeader
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        totalUsers={users.length}
        totalOrganisations={stats.totalOrganisations}
        statsTotalUsers={stats.totalUsers}
        onAddUser={() => setShowAddAdminModal(true)}
      />

      <UserStats stats={stats} isSuperAdmin={isSuperAdmin} />

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        organisationFilter={organisationFilter}
        onOrganisationChange={setOrganisationFilter}
        organisations={organisations}
        isSuperAdmin={isSuperAdmin}
        filteredCount={filteredUsers.length}
      />

      <UserTable
        users={users}
        filteredUsers={filteredUsers}
        loading={loading}
        isSuperAdmin={isSuperAdmin}
        currentUser={user}
        userOrganisation={userOrganisation}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteUser}
        formatLastSeen={formatLastSeen}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <AddUserModal
        isOpen={showAddAdminModal}
        onClose={() => {
          setShowAddAdminModal(false);
          setNewAdminData({
            fullName: '',
            email: '',
            mobileNumber: '',
            companyName: '',
            organisation: '',
            employees: '',
            founded: '',
            industry: '',
            location: '',
            role: 'ADMIN',
            status: 'ACTIVE'
          });
        }}
        onAdd={handleAddAdmin}
        newUserData={newAdminData}
        setNewUserData={setNewAdminData}
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        adding={addingAdmin}
      />
    </div>
  );
}