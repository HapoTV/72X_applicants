import type { AdminTab } from '../AdminSidebar';

const ADMIN_BASE = '/admin/dashboard/';
const COC_BASE = '/cocadmin/dashboard/';

export const VALID_ADMIN_TABS = [
  'applicants',
  'events',
  'learning',
  'mentorship',
  'funding',
  'ad',
  'profile',
  'monitoring',
  'payments',
  'organisation',
  'admins',
  'business-ref',
] as const satisfies readonly AdminTab[];

export const getDashboardBaseFromPathname = (pathname: string): string => {
  return pathname.startsWith(COC_BASE) ? COC_BASE : ADMIN_BASE;
};

export const getActiveTabFromPathname = (pathname: string): AdminTab | null => {
  const base = getDashboardBaseFromPathname(pathname);
  if (!pathname.startsWith(base)) return null;

  const segment = pathname.slice(base.length).split('/')[0];
  if (!segment) return null;

  if ((VALID_ADMIN_TABS as readonly string[]).includes(segment)) {
    return segment as AdminTab;
  }

  return null;
};
