import type { NewUserData, UserWithSubscription } from './types';

export const doesUserMatchSearchTerm = (u: UserWithSubscription, searchTerm: string) => {
  if (!searchTerm) return true;
  const searchLower = searchTerm.toLowerCase();
  return (
    u.fullName?.toLowerCase().includes(searchLower) ||
    u.email?.toLowerCase().includes(searchLower) ||
    u.mobileNumber?.toLowerCase().includes(searchLower) ||
    u.organisation?.toLowerCase().includes(searchLower) ||
    u.userId?.toLowerCase().includes(searchLower) ||
    u.businessReference?.toLowerCase().includes(searchLower)
  );
};

export const doesUserMatchStatusFilter = (u: UserWithSubscription, statusFilter: string) => {
  if (statusFilter === 'All') return true;

  if (statusFilter === 'Active') return u.status === 'ACTIVE' || u.status === 'active';
  if (statusFilter === 'Inactive') return u.status === 'INACTIVE' || u.status === 'inactive';
  if (statusFilter === 'Pending') return u.status === 'PENDING' || u.status === 'pending' || u.status === 'PENDING_PASSWORD';
  if (statusFilter === 'Online') return u.isOnline;
  if (statusFilter === 'Offline') return !u.isOnline;

  return true;
};

export const doesUserMatchRoleFilter = (u: UserWithSubscription, roleFilter: string) => {
  return roleFilter === 'All' || u.role === roleFilter;
};

export const doesUserMatchOrganisationFilter = (u: UserWithSubscription, organisationFilter: string) => {
  return organisationFilter === 'all' || u.organisation === organisationFilter;
};

export const formatUserLastSeen = (lastSeenAt: string): string => {
  if (!lastSeenAt) return '-';

  const lastSeen = new Date(lastSeenAt);
  if (Number.isNaN(lastSeen.getTime())) return '-';

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

export const getInitialNewAdminData = (userOrganisation: string | null): NewUserData => {
  return {
    fullName: '',
    email: '',
    mobileNumber: '',
    organisation: userOrganisation || '',
    role: 'ADMIN',
    status: 'PENDING_PASSWORD'
  };
};
