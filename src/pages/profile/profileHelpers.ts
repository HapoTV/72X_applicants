import { User, Bell, Shield } from 'lucide-react';

export const PROFILE_TABS = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]['id'];

export const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'];

export const EMPLOYEE_SIZES = ['1-10', '10-50', '50-100', '100+'];

export const calculateYearsInBusiness = (founded: string): string => {
  if (!founded?.trim()) return '';
  const currentYear = new Date().getFullYear();
  const asNumber = Number(founded);
  // Plain year e.g. "2021"
  if (Number.isFinite(asNumber) && asNumber >= 1800 && asNumber <= currentYear)
    return String(Math.max(0, currentYear - Math.floor(asNumber)));
  // Direct years-in-operation number e.g. "3" (small number, not a year)
  if (Number.isFinite(asNumber) && asNumber >= 0 && asNumber < 200)
    return String(Math.floor(asNumber));
  // ISO date string e.g. "2021-03-15T00:00:00"
  const parsed = new Date(founded);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  if (year < 1800 || year > currentYear) return '';
  return String(Math.max(0, currentYear - year));
};

export const checkPasswordRequirements = (password: string) => ({
  minLength: password.length >= 8,
  hasNumber: /\d/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export type PasswordRequirements = ReturnType<typeof checkPasswordRequirements>;

export const validatePasswordData = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  reqs: PasswordRequirements
): string | null => {
  if (!currentPassword) return 'Current password is required';
  if (!newPassword) return 'New password is required';
  if (newPassword !== confirmPassword) return 'Passwords do not match';
  if (newPassword.length < 8) return 'Password must be at least 8 characters long';
  if (!reqs.hasNumber || !reqs.hasUppercase || !reqs.hasLowercase || !reqs.hasSpecialChar)
    return 'Password does not meet all requirements';
  if (currentPassword === newPassword) return 'New password must be different from current password';
  return null;
};

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
