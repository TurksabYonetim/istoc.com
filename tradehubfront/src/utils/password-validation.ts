/**
 * Centralized password validation
 * Single source of truth for password requirements across all auth screens.
 * Rules match backend: identity.py → PASSWORD_MIN_LENGTH = 8,
 * require_uppercase, require_lowercase, require_digit.
 */

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

/** Validate password against requirements */
export function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

/** Check if all password requirements are met */
export function isPasswordValid(password: string): boolean {
  const v = validatePassword(password);
  return v.minLength && v.hasUppercase && v.hasLowercase && v.hasNumber;
}
