import type { UserWithSubscription } from './types';

type VisibilityFilterParams = {
  users: UserWithSubscription[];
  isSuperAdmin: boolean;
  isCocAdmin: boolean;
  cocAllowedOrganisations: string[] | null;
  userOrganisation: string | null;
};

export const applyApplicantsVisibilityFilter = ({
  users,
  isSuperAdmin,
  isCocAdmin,
  cocAllowedOrganisations,
  userOrganisation,
}: VisibilityFilterParams): UserWithSubscription[] => {
  if (isSuperAdmin) return [...users];

  if (isCocAdmin && cocAllowedOrganisations) {
    return users.filter(u => !!u.organisation && cocAllowedOrganisations.includes(u.organisation));
  }

  if (userOrganisation) {
    return users.filter(u => u.organisation === userOrganisation);
  }

  return [...users];
};
