import { User, Bell, Shield } from 'lucide-react';

export const PROFILE_TABS = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]['id'];

export const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'];
export const EMPLOYEE_SIZES = ['1-10', '10-50', '50-100', '100+'];

// Re-export from shared utils so existing imports keep working
export { calculateYearsInBusiness, syncUserInLocalStorage, getNotificationStorageKey } from '../../utils/userHelpers';
export { checkPasswordRequirements, validatePasswordChange as validatePasswordData, EMPTY_PASSWORD_REQUIREMENTS } from '../../utils/passwordHelpers';
export type { PasswordRequirements } from '../../utils/passwordHelpers';

export const buildUserDataCsv = (profileData: Record<string, string>, userKey: string): string => {
  const rows: { key: string; value: string }[] = [];
  const addRow = (key: string, value: unknown) => {
    if (value == null) return;
    rows.push({ key, value: typeof value === 'string' ? value : JSON.stringify(value) });
  };

  Object.entries(profileData).forEach(([k, v]) => addRow(k, v));
  ['monthlyRevenue', 'activeCustomers', 'growthRate', 'goalsAchieved'].forEach((k) =>
    addRow(k, localStorage.getItem(k))
  );
  addRow('registrationData', localStorage.getItem('registrationData'));
  addRow('notificationPreferences', localStorage.getItem(`notificationPreferences:${userKey}`));

  const escape = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return ['Key,Value', ...rows.map((r) => `${escape(r.key)},${escape(r.value)}`)].join('\r\n');
};
