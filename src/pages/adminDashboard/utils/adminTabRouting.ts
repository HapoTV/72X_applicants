import type { AdminTab } from '../AdminSidebar';

const ADMIN_DASHBOARD_PREFIX = '/admin/dashboard/';
const COC_DASHBOARD_PREFIX = '/cocadmin/dashboard/';

export const VALID_ADMIN_TABS = [
  'applicants',
  'events',
  'learning',
  'mentorship',
  'funding',
  'programmes',
  'programme-applications',
  'ad',
  'profile',
  'monitoring',
  'payments',
  'organisation',
  'admins',
  'business-ref',
] as const satisfies readonly AdminTab[];

const normalizeAdminPath = (pathname: string): string => {
  if (pathname.startsWith(COC_DASHBOARD_PREFIX)) {
    return pathname.slice(COC_DASHBOARD_PREFIX.length);
  }
  if (pathname.startsWith(ADMIN_DASHBOARD_PREFIX)) {
    return pathname.slice(ADMIN_DASHBOARD_PREFIX.length);
  }
  if (pathname.startsWith('/admin/')) {
    return pathname.slice('/admin/'.length);
  }
  if (pathname.startsWith('/cocadmin/')) {
    return pathname.slice('/cocadmin/'.length);
  }
  return pathname.replace(/^\/+/, '');
};

export const getActiveTabFromPathname = (pathname: string): AdminTab | null => {
  const normalizedPath = normalizeAdminPath(pathname);
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0] === 'dashboard' ? segments[1] : segments[0];
  if (!firstSegment) {
    return null;
  }

  if ((VALID_ADMIN_TABS as readonly string[]).includes(firstSegment)) {
    return firstSegment as AdminTab;
  }

  return null;
};
