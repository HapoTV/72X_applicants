import type { User } from '../interfaces/UserData';

export const calculateYearsInBusiness = (founded: string): string => {
  if (!founded?.trim()) return '';
  const currentYear = new Date().getFullYear();
  const asNumber = Number(founded);
  if (Number.isFinite(asNumber) && asNumber >= 1800 && asNumber <= currentYear)
    return String(Math.max(0, currentYear - Math.floor(asNumber)));
  if (Number.isFinite(asNumber) && asNumber >= 0 && asNumber < 200)
    return String(Math.floor(asNumber));
  const parsed = new Date(founded);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  if (year < 1800 || year > currentYear) return '';
  return String(Math.max(0, currentYear - year));
};

export const syncUserInLocalStorage = (partialUser: User): void => {
  try {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : {};
    localStorage.setItem('user', JSON.stringify({ ...parsed, ...partialUser }));
    window.dispatchEvent(new CustomEvent('user-updated'));
  } catch {
    // ignore localStorage errors
  }
};

export const getNotificationStorageKey = (
  user: { userId?: string; email?: string } | null
): string => {
  const key = user?.userId || user?.email || localStorage.getItem('userEmail') || 'anonymous';
  return `notificationPreferences:${key}`;
};
