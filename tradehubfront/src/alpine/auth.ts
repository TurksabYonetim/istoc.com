import Alpine from 'alpinejs'
import { t } from '../i18n'
import { showToast } from '../utils/toast'
import {
  initAccountTypeSelector,
  getSelectedAccountType,
  type AccountType,
} from '../components/auth/AccountTypeSelector'
import {
  EmailVerification,
  initEmailVerification,
  cleanupEmailVerification,
  type EmailVerificationState,
} from '../components/auth/EmailVerification'
import {
  AccountSetupForm,
  initAccountSetupForm,
  type AccountSetupFormData,
} from '../components/auth/AccountSetupForm'
import {
  escapeHtml,
  type RegisterStep,
} from '../components/auth/RegisterPage'
import {
  maskEmail,
  type ForgotPasswordStep,
} from '../components/auth/ForgotPasswordPage'
import {
  checkEmailExists,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  register,
  login,
  getSessionUser,
  getRedirectUrl,
  forgotPassword,
  resetPassword,
  registerSupplier,
} from '../utils/auth'
import {
  SupplierSetupForm,
  initSupplierSetupForm,
  type SupplierSetupFormData,
} from '../components/auth/SupplierSetupForm'

const COUNTRY_CODE_MAP: Record<string, string> = {
  TR: 'Turkey', US: 'United States', DE: 'Germany', GB: 'United Kingdom',
  FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands', BE: 'Belgium',
  AT: 'Austria', CH: 'Switzerland', PL: 'Poland', SE: 'Sweden', NO: 'Norway',
  DK: 'Denmark', FI: 'Finland', RU: 'Russia', CN: 'China', JP: 'Japan',
  KR: 'South Korea', IN: 'India', AE: 'United Arab Emirates', SA: 'Saudi Arabia',
  AU: 'Australia', CA: 'Canada', BR: 'Brazil', MX: 'Mexico',
}
function countryCodeToEnglish(code?: string): string {
  return (code && COUNTRY_CODE_MAP[code]) || 'Turkey'
}
import { validatePassword, isPasswordValid } from '../utils/password-validation'

/* ── Register Page ──────────────────────────────────── */

Alpine.data('registerPage', () => ({
  currentStep: 'account-type' as RegisterStep,
  accountType: 'buyer' as AccountType | null,
  email: '',
  emailValid: false,
  emailError: false,
  emailExistsError: false,
  emailDisabledError: false,
  loading: false,
  otpState: null as EmailVerificationState | null,
  registration_token: '',
  seller_application: '',
  _setupData: {} as Record<string, string>,

  init() {
    // Read initial step from data attribute if provided
    const initialStep = (this.$el as HTMLElement).dataset.initialStep as RegisterStep | undefined;
    if (initialStep && initialStep !== 'account-type') {
      this.currentStep = initialStep;
    }

    // Check URL for ?type=supplier to pre-select supplier
    const urlType = new URLSearchParams(window.location.search).get('type');
    const defaultType: AccountType = urlType === 'supplier' ? 'supplier' : 'buyer';

    // Initialize account type selector (child component delegation)
    initAccountTypeSelector({
      defaultType,
      onTypeSelect: (type: AccountType) => {
        this.accountType = type;
      }
    });
    this.accountType = getSelectedAccountType() || defaultType;

    // Listen for programmatic navigation via navigateToStep()
    (this.$el as HTMLElement).addEventListener('register-navigate', ((e: CustomEvent) => {
      this.goToStep(e.detail.step as RegisterStep);
    }) as EventListener);
  },

  validateEmail() {
    const input = (this.$refs as Record<string, HTMLInputElement>).emailInput;
    const value = input?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = emailRegex.test(value);
    if (this.emailValid) {
      this.emailError = false;
      this.emailExistsError = false;
      this.emailDisabledError = false;
    }
  },

  async submitEmail() {
    if (this.loading) return; // Prevent double submit

    const input = (this.$refs as Record<string, HTMLInputElement>).emailInput;
    const value = input?.value.trim() || '';

    if (!this.emailValid) {
      this.emailError = true;
      return;
    }

    this.email = value;
    this.loading = true;
    this.emailExistsError = false;
    this.emailDisabledError = false;

    try {
      // 1. Check if email already registered
      const { exists, disabled } = await checkEmailExists(value);
      if (exists) {
        if (disabled) {
          this.emailDisabledError = true;
        } else {
          this.emailExistsError = true;
        }
        this.loading = false;
        return;
      }

      // 2. Send OTP to email
      await sendRegistrationOtp(value);

      // 3. Navigate to OTP step
      this.goToStep('otp');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'RATE_LIMIT') {
        showToast({ message: t('common.rateLimitError'), type: 'error' });
      } else {
        showToast({ message: msg || t('common.error'), type: 'error' });
      }
    } finally {
      this.loading = false;
    }
  },

  goToStep(step: RegisterStep) {
    // Cleanup OTP state when leaving OTP step
    if (this.currentStep === 'otp' && this.otpState) {
      cleanupEmailVerification(this.otpState);
      this.otpState = null;
    }

    this.currentStep = step;

    // Notify external listeners via custom event
    this.$dispatch('register-step-change', { step });

    this.$nextTick(() => {
      switch (step) {
        case 'email': {
          const input = (this.$refs as Record<string, HTMLInputElement>).emailInput;
          input?.focus();
          break;
        }
        case 'otp': {
          // Dynamically render OTP content (child component needs fresh DOM each time)
          const container = (this.$refs as Record<string, HTMLElement>).otpContainer;
          if (container) {
            container.innerHTML = EmailVerification(escapeHtml(this.email));
          }
          this.otpState = initEmailVerification({
            email: this.email,
            onVerify: async (otp: string) => {
              // Verify OTP against backend and get registration_token
              const result = await verifyRegistrationOtp(this.email, otp);
              this.registration_token = result.registration_token;
              this.goToStep('setup');
            },
            onResend: async () => {
              try {
                await sendRegistrationOtp(this.email);
                showToast({ message: t('auth.otpResent'), type: 'success' });
              } catch (err) {
                const msg = err instanceof Error ? err.message : t('common.error');
                showToast({ message: msg, type: 'error' });
              }
            },
            onBack: () => {
              this.goToStep('email');
            }
          });
          break;
        }
        case 'setup': {
          // Dynamically render setup form (child component needs fresh DOM each time)
          const container = (this.$refs as Record<string, HTMLElement>).setupContainer;
          if (container) {
            container.innerHTML = AccountSetupForm('TR');
          }
          initAccountSetupForm({
            defaultCountry: 'TR',
            onSubmit: async (formData: AccountSetupFormData) => {
              if (!this.accountType) return;

              if (this.accountType === 'supplier') {
                // Supplier: do NOT create account yet — store data and go to form
                this._setupData = {
                  email: this.email,
                  password: formData.password,
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  registration_token: this.registration_token,
                };
                this.goToStep('supplier-setup');
                return;
              }

              // Buyer: create account immediately
              try {
                await register({
                  email: this.email,
                  password: formData.password,
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  account_type: 'buyer',
                  phone: formData.phone || '',
                  country: countryCodeToEnglish(formData.country?.code) || 'Turkey',
                  accept_terms: true,
                  accept_kvkk: true,
                  registration_token: this.registration_token,
                });

                await login(this.email, formData.password);
                const user = await getSessionUser();
                window.location.href = user ? getRedirectUrl(user) : '/';
              } catch (err) {
                const msg = err instanceof Error ? err.message : t('common.error');
                showToast({ message: msg, type: 'error' });
              }
            }
          });
          break;
        }
        case 'supplier-setup': {
          const container = (this.$refs as Record<string, HTMLElement>).supplierSetupContainer;
          if (container) {
            container.innerHTML = SupplierSetupForm();
          }
          initSupplierSetupForm({
            onSubmit: async (formData: SupplierSetupFormData) => {
              try {
                // Register supplier atomically — account + application in one call
                await registerSupplier({
                  ...this._setupData,
                  account_type: 'supplier',
                  phone: formData.contact_phone,
                  accept_terms: true,
                  accept_kvkk: true,
                  ...formData,
                });

                // Auto-login and redirect
                await login(this._setupData.email, this._setupData.password);
                window.location.href = '/pages/seller/application-pending.html';
              } catch (err) {
                const msg = err instanceof Error ? err.message : t('common.error');
                showToast({ message: msg, type: 'error' });
                const btn = document.getElementById('ss-next-btn') as HTMLButtonElement | null;
                if (btn) {
                  btn.disabled = false;
                  btn.textContent = t('auth.supplierSetup.submit');
                }
              }
            }
          });
          break;
        }
      }
    });
  },
}));

/* ── Forgot Password Page ───────────────────────────── */

Alpine.data('forgotPasswordPage', () => ({
  step: 'find-account' as ForgotPasswordStep,
  email: '',
  loading: false,

  get maskedEmail(): string {
    return maskEmail(this.email);
  },

  async submitFindAccount() {
    const trimmed = this.email.trim();
    if (!trimmed) return;

    this.loading = true;

    try {
      // Always returns success (email enumeration protection)
      await forgotPassword(trimmed);
      this.step = 'link-sent';
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('common.error');
      showToast({ message: msg, type: 'error' });
    } finally {
      this.loading = false;
    }
  },

  async resendLink() {
    if (this.loading) return;
    this.loading = true;

    try {
      await forgotPassword(this.email.trim());
      showToast({ message: t('auth.forgot.linkResent'), type: 'success' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('common.error');
      showToast({ message: msg, type: 'error' });
    } finally {
      this.loading = false;
    }
  },
}));

/* ── Reset Password Page ────────────────────────────── */

Alpine.data('resetPasswordPage', () => ({
  step: 'form' as 'form' | 'success' | 'error',
  key: '',
  showPassword: false,
  passwordValid: false,
  loading: false,
  error: '',
  reqMinLength: null as boolean | null,
  reqUppercase: null as boolean | null,
  reqLowercase: null as boolean | null,
  reqNumber: null as boolean | null,

  init() {
    // Read key from URL
    const params = new URLSearchParams(window.location.search);
    this.key = params.get('key') || '';

    if (!this.key) {
      this.error = t('auth.reset.invalidLinkDesc');
      this.step = 'error';
    }
  },

  onPasswordInput() {
    const pw = (this.$refs as Record<string, HTMLInputElement>).newPassword?.value || '';
    const touched = pw.length > 0;
    const v = validatePassword(pw);

    this.reqMinLength = touched ? v.minLength : null;
    this.reqUppercase = touched ? v.hasUppercase : null;
    this.reqLowercase = touched ? v.hasLowercase : null;
    this.reqNumber = touched ? v.hasNumber : null;

    this.passwordValid = isPasswordValid(pw);
  },

  reqStyle(valid: boolean | null): string {
    if (valid === null) return '';
    return valid ? 'color: #16a34a' : 'color: #dc2626';
  },

  async submitReset() {
    if (!this.passwordValid || this.loading) return;

    const pw = (this.$refs as Record<string, HTMLInputElement>).newPassword?.value || '';
    this.loading = true;
    this.error = '';

    try {
      await resetPassword(this.key, pw);
      this.step = 'success';
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('auth.reset.genericError');
      this.error = msg;
      this.step = 'error';
    } finally {
      this.loading = false;
    }
  },
}));
