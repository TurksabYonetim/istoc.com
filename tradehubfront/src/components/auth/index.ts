/**
 * Auth Components Barrel Export
 * Re-exports all authentication components for easier importing
 */

// Social Login Buttons
export {
  SocialLoginButtons,
  initSocialLoginButtons,
  getSocialLoginButtons,
  type LoginProvider,
  type SocialLoginButtonsOptions
} from './SocialLoginButtons';

// Auth Layout
export {
  AuthLayout,
  initAuthLayout,
  getBaseUrl,
  type AuthLayoutOptions
} from './AuthLayout';

// Login Page
export {
  LoginPage,
  initLoginPage,
  type LoginPageOptions
} from './LoginPage';

// Account Type Selector
export {
  AccountTypeSelector,
  initAccountTypeSelector,
  getSelectedAccountType,
  type AccountType,
  type AccountTypeSelectorOptions
} from './AccountTypeSelector';

// Email Verification
export {
  EmailVerification,
  initEmailVerification,
  showOTPError,
  clearOTPInputs,
  getOTPValue,
  updateVerificationEmail,
  cleanupEmailVerification,
  type EmailVerificationOptions,
  type EmailVerificationState
} from './EmailVerification';

// Account Setup Form
export {
  AccountSetupForm,
  initAccountSetupForm,
  getAccountSetupFormData,
  resetAccountSetupForm,
  setFieldError,
  clearFieldError,
  validatePassword,
  isPasswordValid,
  getCountryByCode,
  countryOptions,
  type CountryOption,
  type AccountSetupFormOptions,
  type AccountSetupFormData,
  type AccountSetupFormState,
  type PasswordRequirements
} from './AccountSetupForm';

// Supplier Setup Form
export {
  SupplierSetupForm,
  initSupplierSetupForm,
  type SupplierSetupFormData,
  type SupplierSetupFormOptions
} from './SupplierSetupForm';

// Forgot Password Page
export {
  ForgotPasswordPage,
  initForgotPasswordPage,
  type ForgotPasswordStep,
  type ForgotPasswordState
} from './ForgotPasswordPage';

// Register Page
export {
  RegisterPage,
  initRegisterPage,
  getCurrentStep,
  navigateToStep,
  type RegisterStep,
  type RegisterPageOptions,
  type RegisterPageData,
  type RegisterPageState
} from './RegisterPage';

// Reset Password Page
export {
  ResetPasswordPage,
  initResetPasswordPage,
  type ResetPasswordStep
} from './ResetPasswordPage';
