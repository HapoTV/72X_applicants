import axiosClient from '../../../../api/axiosClient';
import type { User } from '../../../../interfaces/UserData';
import type { UserWithSubscription } from './types';

type GetUserSubscriptionByUserId = (userId: string) => Promise<unknown>;

export const enhanceUsersWithSubscriptionData = async (
  users: User[],
  checkUserOnlineStatus: (userData: User) => boolean,
  getUserSubscriptionByUserId: GetUserSubscriptionByUserId
): Promise<UserWithSubscription[]> => {
  return Promise.all(
    users.map(async (userData) => {
      try {
        let subscription = null;
        try {
          subscription = await getUserSubscriptionByUserId(userData.userId);
        } catch {
          // Silently fail to preserve existing behavior.
        }

        const isOnline = checkUserOnlineStatus(userData);
        const lastActive = userData.lastSeenAt || userData.updatedAt || '';

        return {
          ...userData,
          subscription,
          isOnline,
          lastActive
        };
      } catch {
        const lastActive = userData.lastSeenAt || userData.updatedAt || '';
        return {
          ...userData,
          subscription: null,
          isOnline: false,
          lastActive
        };
      }
    })
  );
};

export const getUniqueUserOrganisations = (users: UserWithSubscription[]): string[] => {
  return [
    ...new Set(
      users
        .map(u => u.organisation)
        .filter((org): org is string => org !== undefined && org !== null && org !== '')
    )
  ];
};

export const fetchAllAdminUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get('/users/admin/all');
  return response.data;
};

export const fetchOrganisationUsers = async (organisation: string): Promise<User[]> => {
  try {
    const response = await axiosClient.get(`/users/organisation/${organisation}`);
    return response.data;
  } catch {
    const allUsersData = await fetchAllAdminUsers();
    return allUsersData.filter((u: User) => u.organisation === organisation);
  }
};

export const filterUsersByAllowedOrganisations = (users: User[], allowedOrganisations: string[]): User[] => {
  return users.filter((u: User) => !!u.organisation && allowedOrganisations.includes(u.organisation));
};

export const removeSuperAdminUsers = (users: User[]): User[] => {
  return users.filter((u) => u.role !== 'SUPER_ADMIN');
};
