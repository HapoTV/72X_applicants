export const checkPasswordRequirements = (password: string) => ({
  minLength: password.length >= 8,
  hasNumber: /\d/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export type PasswordRequirements = ReturnType<typeof checkPasswordRequirements>;

export const EMPTY_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: false,
  hasNumber: false,
  hasUppercase: false,
  hasLowercase: false,
  hasSpecialChar: false,
};

/** Validates a change-password form (current + new + confirm). */
export const validatePasswordChange = (
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

/** Validates a new-password-only form (no current password). */
export const validateNewPassword = (
  password: string,
  confirmPassword: string,
  reqs: PasswordRequirements
): string | null => {
  if (password !== confirmPassword) return 'Passwords do not match';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!reqs.hasNumber || !reqs.hasUppercase || !reqs.hasLowercase || !reqs.hasSpecialChar)
    return 'Password does not meet all requirements';
  return null;
};
