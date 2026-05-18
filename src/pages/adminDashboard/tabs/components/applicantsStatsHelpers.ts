import type { StatsData, UserWithSubscription } from './types';

export const calculateApplicantsStats = (
  usersList: UserWithSubscription[],
  isSuperAdmin: boolean
): StatsData => {
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

  return {
    totalUsers: relevantUsers.length,
    activeUsers: activeUsers.length,
    onlineUsers: onlineUsers.length,
    offlineUsers: relevantUsers.length - onlineUsers.length,
    inactiveUsers: relevantUsers.filter(u => u.status === 'INACTIVE' || u.status === 'inactive').length,
    freeTrialUsers: freeTrialUsers.length,
    totalOrganisations: uniqueOrgs.length,
    adminsCount: relevantUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'COC_ADMIN').length,
    usersCount: relevantUsers.filter(u => u.role === 'USER').length
  };
};
