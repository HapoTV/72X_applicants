// src/pages/adminDashboard/tabs/ApplicantsTab.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';
import { cocOrganisationService } from '../../../services/CocOrganisationService';
import OrganisationService from '../../../services/OrganisationService';
import userSubscriptionService from '../../../services/UserSubscriptionService';

import { UserManagementHeader } from './components/UserManagementHeader';
import { UserStats } from './components/UserStats';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { AddUserModal } from './components/AddUserModal';
import { UserDetailsModal } from './components/UserDetailsModal';
import { ApplicantsFetchError } from './components/ApplicantsFetchError';
import {
  doesUserMatchOrganisationFilter,
  doesUserMatchRoleFilter,
  doesUserMatchSearchTerm,
  doesUserMatchStatusFilter,
  formatUserLastSeen,
  getInitialNewAdminData,
} from './components/applicantsHelpers';
import {
  enhanceUsersWithSubscriptionData,
  fetchAllAdminUsers,
  fetchOrganisationUsers,
  filterUsersByAllowedOrganisations,
  getUniqueUserOrganisations,
  removeSuperAdminUsers,
} from './components/applicantsDataHelpers';
import { calculateApplicantsStats } from './components/applicantsStatsHelpers';
import { applyApplicantsVisibilityFilter } from './components/applicantsFilterHelpers';

import type { User } from '../../../interfaces/UserData';
import type { UserWithSubscription, StatsData, NewUserData } from './components/types';

export default function ApplicantsTab() {
  const { isSuperAdmin, userOrganisation, user, updateUserOrganisation } = useAuth();
  const effectiveRole = (user?.role || localStorage.getItem('userRole') || '').toUpperCase();
  const isCocAdmin = effectiveRole === 'COC_ADMIN';
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState<NewUserData>(() => getInitialNewAdminData(userOrganisation));

  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [organisationFilter, setOrganisationFilter] = useState<string>('all');

  const [organisations, setOrganisations] = useState<string[]>([]);
  const [organisationGroups, setOrganisationGroups] = useState<{ organisations: string[]; cocSubOrganisations: string[] }>({ organisations: [], cocSubOrganisations: [] });
  const [cocAllowedOrganisations, setCocAllowedOrganisations] = useState<string[] | null>(null);
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

  const checkUserOnlineStatus = useCallback((userData: User): boolean => {
    return userData.availabilityStatus === 'ONLINE';
  }, []);

  const calculateStats = useCallback((usersList: UserWithSubscription[]) => {
    setStats(calculateApplicantsStats(usersList, isSuperAdmin));
  }, [isSuperAdmin]);

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      console.log("Current auth state:", {
        isSuperAdmin,
        userOrganisation,
        userRole: user?.role,
        userEmail: user?.email
      });
      
      let allUsers: User[] = [];
      
      if (isSuperAdmin) {
        // Super admin - fetch all users
        console.log('👑 Super admin fetching all users...');
        allUsers = await fetchAllAdminUsers();
        console.log(`✅ Super Admin fetched ${allUsers.length} users from backend`);
      } else {
        // Regular admin - fetch users from their organisation only
        if (isCocAdmin) {
          if (!cocAllowedOrganisations) {
            console.log('⏳ Waiting for COC sub-organisations to be fetched...');
            setLoading(false);
            return;
          }

          console.log('👤 COC Admin fetching users for allowed organisations:', cocAllowedOrganisations);

          const allUsersData = await fetchAllAdminUsers();
          allUsers = filterUsersByAllowedOrganisations(allUsersData, cocAllowedOrganisations);
          console.log(`✅ COC Admin fetched and filtered ${allUsers.length} users in allowed organisations`);
        } else if (userOrganisation) {
          console.log(`👤 Admin fetching users for organisation: ${userOrganisation}`);
          
          allUsers = await fetchOrganisationUsers(userOrganisation);
          console.log(`✅ Admin fetched ${allUsers.length} users for organisation: ${userOrganisation}`);
        } else {
          console.error('❌ No organisation found for admin');
          setFetchError('Your account has no organisation assigned. Please contact support.');
          setLoading(false);
          return;
        }
      }
      
      // Filter out SUPER_ADMIN users for non-super admins
      if (!isSuperAdmin) {
        allUsers = removeSuperAdminUsers(allUsers);
        console.log(`🔍 Filtered out super admins, remaining: ${allUsers.length} users`);
      }
      
      // Enhance users with subscription and online status
      const enhancedUsers = await enhanceUsersWithSubscriptionData(
        allUsers,
        checkUserOnlineStatus,
        userSubscriptionService.getUserPackageByUserId
      );

      setUsers(enhancedUsers);
      
      // Extract unique organisations (for super admin only)
      if (isSuperAdmin) {
        const uniqueOrgs = getUniqueUserOrganisations(enhancedUsers);
        setOrganisations(uniqueOrgs);
      }
      
      calculateStats(enhancedUsers);
      
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setFetchError(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [calculateStats, checkUserOnlineStatus, cocAllowedOrganisations, isCocAdmin, isSuperAdmin, updateUserOrganisation, user?.email, user?.role, userOrganisation]);

  useEffect(() => {
    const fetchCocAllowedOrganisations = async () => {
      if (!isCocAdmin) {
        setCocAllowedOrganisations(null);
        return;
      }

      try {
        const items = await cocOrganisationService.listMine();
        const names = items
          .map(i => i.name)
          .filter((n): n is string => !!n && n.trim() !== '')
          .map(n => n.trim());

        const allowed = [...new Set([
          ...(userOrganisation ? [userOrganisation] : []),
          ...names
        ])];

        setCocAllowedOrganisations(allowed);
      } catch (error) {
        console.error('❌ Failed to fetch COC sub-organisations:', error);
        setFetchError('Failed to load COC organisations. Please try refreshing.');
      }
    };

    fetchCocAllowedOrganisations();
  }, [isCocAdmin, userOrganisation]);

  useEffect(() => {
    const fetchOrganisationOptions = async () => {
      if (!isSuperAdmin) {
        setOrganisationGroups({ organisations: [], cocSubOrganisations: [] });
        return;
      }

      try {
        const groups = await OrganisationService.getSignupOrganisationGroups();
        const cleanedOrgs = (groups?.organisations || []).map(n => (n || '').trim()).filter(n => n !== '');
        const cleanedCoc = (groups?.cocSubOrganisations || []).map(n => (n || '').trim()).filter(n => n !== '');
        setOrganisationGroups({
          organisations: cleanedOrgs,
          cocSubOrganisations: cleanedCoc
        });
      } catch (error) {
        console.error('❌ Failed to fetch organisation names:', error);
        setOrganisationGroups({ organisations: [], cocSubOrganisations: [] });
      }
    };

    fetchOrganisationOptions();
  }, [isSuperAdmin]);

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

    if (isCocAdmin && !cocAllowedOrganisations) {
      console.log('⏳ Waiting for COC allowed organisations to be fetched...');
      return;
    }
    
    fetchAllUsers();
  }, [isSuperAdmin, userOrganisation, fetchAllUsers, isCocAdmin, cocAllowedOrganisations]);

  const filteredUsers = useMemo(() => {
    let filtered = applyApplicantsVisibilityFilter({
      users,
      isSuperAdmin,
      isCocAdmin,
      cocAllowedOrganisations,
      userOrganisation,
    });

    filtered = filtered.filter((u) => doesUserMatchSearchTerm(u, searchTerm));
    filtered = filtered.filter((u) => doesUserMatchStatusFilter(u, statusFilter));
    filtered = filtered.filter((u) => doesUserMatchRoleFilter(u, roleFilter));

    if (isSuperAdmin) {
      filtered = filtered.filter((u) => doesUserMatchOrganisationFilter(u, organisationFilter));
    }

    return filtered;
  }, [
    users,
    isSuperAdmin,
    isCocAdmin,
    cocAllowedOrganisations,
    userOrganisation,
    searchTerm,
    statusFilter,
    roleFilter,
    organisationFilter,
  ]);

  const handleAddAdmin = useCallback(async () => {
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
        status: 'PENDING_PASSWORD'
      });
      
      alert(`${newAdminData.role} created successfully. An account setup email has been sent to ${newAdminData.email}.`);
      setShowAddAdminModal(false);
      setNewAdminData(getInitialNewAdminData(null));
      
      fetchAllUsers();
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      alert(`Error creating user: ${error.response?.data || error.message}`);
    } finally {
      setAddingAdmin(false);
    }
  }, [fetchAllUsers, newAdminData, userOrganisation]);

  const handleDeleteUser = useCallback(async (userId: string, userRole: string, userOrg?: string) => {
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
  }, [fetchAllUsers, isSuperAdmin, user?.role, user?.userId, userOrganisation]);

  const handleResendInvite = useCallback(async (userId: string) => {
    if (!isSuperAdmin) {
      alert('Only Super Admins can resend invites.');
      return;
    }

    if (window.confirm('Resend account setup invite to this user?')) {
      try {
        await axiosClient.post(`/users/admin/${userId}/resend-invite`);
        alert('Invite resent successfully');
      } catch (error: any) {
        console.error('Error resending invite:', error);
        alert(`Error resending invite: ${error.response?.data?.message || error.response?.data || error.message}`);
      }
    }
  }, [isSuperAdmin]);

  const formatLastSeen = useCallback((lastSeenAt: string) => {
    return formatUserLastSeen(lastSeenAt);
  }, []);

  const handleViewDetails = useCallback((selected: UserWithSubscription) => {
    setSelectedUser(selected);
  }, []);

  const handleOpenAddUserModal = useCallback(() => {
    setShowAddAdminModal(true);
  }, []);

  const handleCloseAddUserModal = useCallback(() => {
    setShowAddAdminModal(false);
    setNewAdminData(getInitialNewAdminData(null));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All');
    setRoleFilter('All');
    if (isSuperAdmin) setOrganisationFilter('all');
  }, [isSuperAdmin]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      statusFilter !== 'All' ||
      roleFilter !== 'All' ||
      (isSuperAdmin && organisationFilter !== 'all')
    );
  }, [searchTerm, statusFilter, roleFilter, isSuperAdmin, organisationFilter]);

  // Show error state
  if (fetchError) {
    return (
      <ApplicantsFetchError
        message={fetchError}
        onRetry={() => {
          setFetchError(null);
          fetchAllUsers();
        }}
      />
    );
  }

  return (
    <div className="w-full">
      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />

      <UserManagementHeader
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        totalUsers={users.length}
        totalOrganisations={stats.totalOrganisations}
        statsTotalUsers={stats.totalUsers}
        onAddUser={handleOpenAddUserModal}
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
        onResendInvite={handleResendInvite}
        onDelete={handleDeleteUser}
        formatLastSeen={formatLastSeen}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <AddUserModal
        isOpen={showAddAdminModal}
        onClose={handleCloseAddUserModal}
        onAdd={handleAddAdmin}
        newUserData={newAdminData}
        setNewUserData={setNewAdminData}
        isSuperAdmin={isSuperAdmin}
        userOrganisation={userOrganisation}
        organisationGroups={organisationGroups}
        adding={addingAdmin}
      />
    </div>
  );
}