/**
 * AccountSetupForm Component
 * Registration form with country/region dropdown, first/last name inputs,
 * and password field with requirements display.
 * Used after email verification in the registration flow.
 */

import { t } from '../../i18n';
import { validatePassword, isPasswordValid, type PasswordValidation } from '../../utils/password-validation';

// Re-export for backward compatibility
export { validatePassword, isPasswordValid };
export type PasswordRequirements = PasswordValidation;

/* ── Types ──────────────────────────────────────────── */

export interface CountryOption {
  /** ISO country code */
  code: string;
  /** Country display name */
  name: string;
  /** Flag emoji */
  flag: string;
}

export interface AccountSetupFormOptions {
  /** Container element ID */
  containerId?: string;
  /** Pre-selected country code */
  defaultCountry?: string;
  /** Callback when form is submitted */
  onSubmit?: (data: AccountSetupFormData) => void;
  /** Callback when country changes */
  onCountryChange?: (country: CountryOption) => void;
}

export interface AccountSetupFormData {
  /** Selected country */
  country: CountryOption | null;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Phone number (optional) */
  phone: string;
  /** Password */
  password: string;
}

export interface AccountSetupFormState {
  /** Current form data */
  data: AccountSetupFormData;
  /** Password requirements validation state */
  passwordRequirements: PasswordRequirements;
  /** Whether form is valid */
  isValid: boolean;
}

/* ── Country Options ────────────────────────────────── */

/** Country code + flag pairs (name is resolved via i18n at render time) */
const countryEntries: { code: string; flag: string }[] = [
  { code: 'TR', flag: '🇹🇷' },
  { code: 'US', flag: '🇺🇸' },
  { code: 'DE', flag: '🇩🇪' },
  { code: 'GB', flag: '🇬🇧' },
  { code: 'FR', flag: '🇫🇷' },
  { code: 'IT', flag: '🇮🇹' },
  { code: 'ES', flag: '🇪🇸' },
  { code: 'NL', flag: '🇳🇱' },
  { code: 'BE', flag: '🇧🇪' },
  { code: 'AT', flag: '🇦🇹' },
  { code: 'CH', flag: '🇨🇭' },
  { code: 'PL', flag: '🇵🇱' },
  { code: 'SE', flag: '🇸🇪' },
  { code: 'NO', flag: '🇳🇴' },
  { code: 'DK', flag: '🇩🇰' },
  { code: 'FI', flag: '🇫🇮' },
  { code: 'RU', flag: '🇷🇺' },
  { code: 'CN', flag: '🇨🇳' },
  { code: 'JP', flag: '🇯🇵' },
  { code: 'KR', flag: '🇰🇷' },
  { code: 'IN', flag: '🇮🇳' },
  { code: 'AE', flag: '🇦🇪' },
  { code: 'SA', flag: '🇸🇦' },
  { code: 'AU', flag: '🇦🇺' },
  { code: 'CA', flag: '🇨🇦' },
  { code: 'BR', flag: '🇧🇷' },
  { code: 'MX', flag: '🇲🇽' },
];

/** Build country options with i18n-resolved names (call at render time for correct locale) */
export function getCountryOptions(): CountryOption[] {
  return countryEntries.map(({ code, flag }) => ({
    code,
    name: t(`countries.${code}`),
    flag,
  }));
}

/**
 * @deprecated Use getCountryOptions() instead. Kept for backward-compat;
 * evaluates once at import time so the name reflects the language active at that moment.
 */
export const countryOptions: CountryOption[] = countryEntries.map(({ code, flag }) => ({
  code,
  name: t(`countries.${code}`),
  flag,
}));

/* ── Component HTML ─────────────────────────────────── */

/**
 * AccountSetupForm Component
 * Renders the account setup form with country, name, and password fields
 *
 * @param defaultCountry - Default selected country code (e.g., 'TR')
 * @returns HTML string for the account setup form
 */
export function AccountSetupForm(defaultCountry: string = 'TR'): string {
  const selectedCountry = countryOptions.find(c => c.code === defaultCountry) || countryOptions[0];

  return `
    <div id="account-setup-form" class="w-full">
      <!-- Header -->
      <div class="mb-6 text-center lg:text-left">
        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ${t('auth.setupTitle')}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          ${t('auth.setupSubtitle')}
        </p>
      </div>

      <form id="account-setup-form-element" class="space-y-5" novalidate>
        <!-- Country/Region Dropdown -->
        <div class="auth-form-field relative">
          <label for="country-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-i18n="auth.setup.countryRegion">
            ${t('auth.setup.countryRegion')}
          </label>
          <div class="relative">
            <button
              type="button"
              id="country-select-btn"
              class="flex items-center justify-between w-full px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-controls="country-dropdown"
            >
              <span id="country-selected-display" class="flex items-center gap-2">
                <span class="text-lg">${selectedCountry.flag}</span>
                <span>${selectedCountry.name}</span>
              </span>
              <svg class="w-5 h-5 text-gray-400 transition-transform" id="country-dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <input type="hidden" id="country-input" name="country" value="${selectedCountry.code}" />

            <!-- Dropdown Panel -->
            <div
              id="country-dropdown"
              class="absolute z-50 hidden w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="${t('auth.setup.selectCountry')}" data-i18n-aria-label="auth.setup.selectCountry"
            >
              ${renderCountryOptions(selectedCountry.code)}
            </div>
          </div>
        </div>

        <!-- Name Fields (stacked on small screens, side by side on sm+) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- First Name -->
          <div class="auth-form-field relative">
            <label for="first-name-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-i18n="auth.setup.firstName">
              ${t('auth.setup.firstName')}
            </label>
            <input
              type="text"
              id="first-name-input"
              name="firstName"
              placeholder="${t('auth.setup.firstNamePlaceholder')}" data-i18n-placeholder="auth.setup.firstNamePlaceholder"
              autocomplete="given-name"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
              required
            />
          </div>

          <!-- Last Name -->
          <div class="auth-form-field relative">
            <label for="last-name-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-i18n="auth.setup.lastName">
              ${t('auth.setup.lastName')}
            </label>
            <input
              type="text"
              id="last-name-input"
              name="lastName"
              placeholder="${t('auth.setup.lastNamePlaceholder')}" data-i18n-placeholder="auth.setup.lastNamePlaceholder"
              autocomplete="family-name"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
              required
            />
          </div>
        </div>

        <!-- Phone Field -->
        <div class="auth-form-field relative">
          <label for="phone-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            ${t('auth.setup.phone') || 'Telefon'}
          </label>
          <input
            type="tel"
            id="phone-input"
            name="phone"
            placeholder="05XX XXX XX XX"
            autocomplete="tel"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
          />
          <p id="phone-error" class="text-xs text-red-500 mt-1 hidden"></p>
        </div>

        <!-- Password Field -->
        <div class="auth-form-field relative">
          <label for="password-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" data-i18n="auth.setup.password">
            ${t('auth.setup.password')}
          </label>
          <div class="relative">
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder="${t('auth.setup.passwordPlaceholder')}" data-i18n-placeholder="auth.setup.passwordPlaceholder"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
              required
            />
            <button
              type="button"
              id="password-toggle-btn"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="${t('auth.forgot.showHidePassword')}" data-i18n-aria-label="auth.forgot.showHidePassword"
            >
              <!-- Eye icon (show) -->
              <svg id="password-eye-show" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <!-- Eye-off icon (hide) - hidden by default -->
              <svg id="password-eye-hide" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>

          <!-- Password Requirements -->
          <div id="password-requirements" class="auth-password-requirements flex flex-col gap-1.5 mt-3">
            <div class="auth-password-req-item flex items-center gap-2 text-[13px] transition-colors" data-requirement="minLength">
              <svg class="auth-password-req-icon shrink-0 w-2 h-2 transition-all" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3"/>
              </svg>
              <span data-i18n="auth.setup.minChars">${t('auth.setup.minChars')}</span>
            </div>
            <div class="auth-password-req-item flex items-center gap-2 text-[13px] transition-colors" data-requirement="hasUppercase">
              <svg class="auth-password-req-icon shrink-0 w-2 h-2 transition-all" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3"/>
              </svg>
              <span data-i18n="auth.setup.uppercase">${t('auth.setup.uppercase')}</span>
            </div>
            <div class="auth-password-req-item flex items-center gap-2 text-[13px] transition-colors" data-requirement="hasLowercase">
              <svg class="auth-password-req-icon shrink-0 w-2 h-2 transition-all" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3"/>
              </svg>
              <span data-i18n="auth.setup.lowercase">${t('auth.setup.lowercase')}</span>
            </div>
            <div class="auth-password-req-item flex items-center gap-2 text-[13px] transition-colors" data-requirement="hasNumber">
              <svg class="auth-password-req-icon shrink-0 w-2 h-2 transition-all" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3"/>
              </svg>
              <span data-i18n="auth.setup.number">${t('auth.setup.number')}</span>
            </div>
          </div>
        </div>

        <!-- Terms Agreement -->
        <div class="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms-checkbox"
            name="terms"
            class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800"
            required
          />
          <label for="terms-checkbox" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <a href="/pages/legal/terms.html" class="text-orange-600 dark:text-orange-400 hover:underline" data-i18n="auth.setup.termsOfUse">${t('auth.setup.termsOfUse')}</a> ${t('auth.and')}
            <a href="/pages/legal/privacy.html" class="text-orange-600 dark:text-orange-400 hover:underline" data-i18n="auth.setup.privacyPolicy">${t('auth.setup.privacyPolicy')}</a><span data-i18n="auth.setup.agreeTerms">${t('auth.setup.agreeTerms')}</span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="account-setup-submit-btn"
          class="th-btn th-btn-pill w-full py-3 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          disabled
        >
          <span data-i18n="auth.setup.createAccount">${t('auth.setup.createAccount')}</span>
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <span data-i18n="auth.register.alreadyHave">${t('auth.register.alreadyHave')}</span>
        <a href="/pages/auth/login.html" class="ml-1 font-medium text-orange-600 dark:text-orange-400 hover:underline">
          <span data-i18n="auth.register.signIn">${t('auth.register.signIn')}</span>
        </a>
      </div>
    </div>
  `;
}

/**
 * Renders the country dropdown options
 */
function renderCountryOptions(selectedCode: string): string {
  return countryOptions.map(country => `
    <button
      type="button"
      class="flex items-center gap-2 w-full px-4 py-2.5 text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${country.code === selectedCode ? 'bg-orange-50 dark:bg-orange-900/20' : ''}"
      data-country-code="${country.code}"
      data-country-name="${country.name}"
      data-country-flag="${country.flag}"
      role="option"
      aria-selected="${country.code === selectedCode ? 'true' : 'false'}"
    >
      <span class="text-lg">${country.flag}</span>
      <span>${country.name}</span>
      ${country.code === selectedCode ? `
        <svg class="w-4 h-4 ml-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      ` : ''}
    </button>
  `).join('');
}

/* ── Helper Functions ────────────────────────────────── */

/**
 * Get a country by its code
 */
export function getCountryByCode(code: string): CountryOption | undefined {
  return countryOptions.find(c => c.code === code);
}

/* ── Init Logic ──────────────────────────────────────── */

/**
 * Initialize AccountSetupForm interactivity
 * Sets up form validation, password requirements, and country dropdown
 */
export function initAccountSetupForm(options: AccountSetupFormOptions = {}): AccountSetupFormState {
  const { defaultCountry = 'TR', onSubmit, onCountryChange } = options;

  // Initialize state
  const state: AccountSetupFormState = {
    data: {
      country: getCountryByCode(defaultCountry) || countryOptions[0],
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
    },
    passwordRequirements: {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
    },
    isValid: false,
  };

  const container = document.getElementById('account-setup-form');
  if (!container) return state;

  // Get form elements
  const form = document.getElementById('account-setup-form-element') as HTMLFormElement | null;
  const countryBtn = document.getElementById('country-select-btn');
  const countryDropdown = document.getElementById('country-dropdown');
  const countryInput = document.getElementById('country-input') as HTMLInputElement | null;
  const countryDisplay = document.getElementById('country-selected-display');
  const dropdownIcon = document.getElementById('country-dropdown-icon');
  const firstNameInput = document.getElementById('first-name-input') as HTMLInputElement | null;
  const lastNameInput = document.getElementById('last-name-input') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password-input') as HTMLInputElement | null;
  const passwordToggleBtn = document.getElementById('password-toggle-btn');
  const passwordEyeShow = document.getElementById('password-eye-show');
  const passwordEyeHide = document.getElementById('password-eye-hide');
  const termsCheckbox = document.getElementById('terms-checkbox') as HTMLInputElement | null;
  const submitBtn = document.getElementById('account-setup-submit-btn') as HTMLButtonElement | null;
  const requirementsContainer = document.getElementById('password-requirements');

  // Country dropdown handlers
  if (countryBtn && countryDropdown) {
    // Toggle dropdown
    countryBtn.addEventListener('click', () => {
      const isOpen = !countryDropdown.classList.contains('hidden');
      toggleCountryDropdown(!isOpen);
    });

    // Handle country selection
    countryDropdown.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('[data-country-code]') as HTMLElement | null;

      if (button) {
        const code = button.getAttribute('data-country-code') || '';
        const name = button.getAttribute('data-country-name') || '';
        const flag = button.getAttribute('data-country-flag') || '';

        state.data.country = { code, name, flag };

        // Update display
        if (countryDisplay) {
          countryDisplay.innerHTML = `
            <span class="text-lg">${flag}</span>
            <span>${name}</span>
          `;
        }

        // Update hidden input
        if (countryInput) {
          countryInput.value = code;
        }

        // Update dropdown options (highlight selected)
        countryDropdown.innerHTML = renderCountryOptions(code);

        // Close dropdown
        toggleCountryDropdown(false);

        // Callback
        if (onCountryChange) {
          onCountryChange(state.data.country);
        }

        // Re-validate form
        updateFormValidity();
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!countryBtn.contains(target) && !countryDropdown.contains(target)) {
        toggleCountryDropdown(false);
      }
    });

    // Close dropdown on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !countryDropdown.classList.contains('hidden')) {
        toggleCountryDropdown(false);
        countryBtn.focus();
      }
    });
  }

  function toggleCountryDropdown(open: boolean): void {
    if (!countryDropdown || !countryBtn || !dropdownIcon) return;

    if (open) {
      countryDropdown.classList.remove('hidden');
      countryBtn.setAttribute('aria-expanded', 'true');
      dropdownIcon.classList.add('rotate-180');
    } else {
      countryDropdown.classList.add('hidden');
      countryBtn.setAttribute('aria-expanded', 'false');
      dropdownIcon.classList.remove('rotate-180');
    }
  }

  // Name input handlers
  if (firstNameInput) {
    firstNameInput.addEventListener('input', () => {
      state.data.firstName = firstNameInput.value.trim();
      updateFormValidity();
    });
  }

  if (lastNameInput) {
    lastNameInput.addEventListener('input', () => {
      state.data.lastName = lastNameInput.value.trim();
      updateFormValidity();
    });
  }

  // Phone input handler
  const phoneInput = document.getElementById('phone-input') as HTMLInputElement | null;
  const phoneError = document.getElementById('phone-error');

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      state.data.phone = phoneInput.value.trim();
      // Validate only if user has typed something
      if (state.data.phone) {
        const cleaned = state.data.phone.replace(/[\s\-\(\)]/g, '');
        const isValid = /^(\+90|0)?5\d{9}$/.test(cleaned);
        if (phoneError) {
          if (!isValid) {
            phoneError.textContent = t('auth.supplierSetup.invalidPhone') || 'Geçerli bir telefon numarası girin (05XX XXX XX XX)';
            phoneError.classList.remove('hidden');
          } else {
            phoneError.classList.add('hidden');
          }
        }
      } else if (phoneError) {
        phoneError.classList.add('hidden');
      }
      updateFormValidity();
    });
  }

  // Password input handler
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      state.data.password = passwordInput.value;
      state.passwordRequirements = validatePassword(passwordInput.value);
      updatePasswordRequirementsUI();
      updateFormValidity();
    });
  }

  // Password toggle visibility
  if (passwordToggleBtn && passwordInput && passwordEyeShow && passwordEyeHide) {
    passwordToggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      passwordEyeShow.classList.toggle('hidden', !isPassword);
      passwordEyeHide.classList.toggle('hidden', isPassword);
    });
  }

  // Terms checkbox handler
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      updateFormValidity();
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (state.isValid && onSubmit) {
        onSubmit(state.data);
      }
    });
  }

  // Update password requirements UI
  function updatePasswordRequirementsUI(): void {
    if (!requirementsContainer) return;

    const requirements = state.passwordRequirements;

    Object.entries(requirements).forEach(([key, isValid]) => {
      const item = requirementsContainer.querySelector(`[data-requirement="${key}"]`);
      if (item) {
        item.classList.remove('valid', 'invalid');
        if (state.data.password.length > 0) {
          item.classList.add(isValid ? 'valid' : 'invalid');
        }
      }
    });
  }

  // Update overall form validity
  function updateFormValidity(): void {
    const hasValidPassword = isPasswordValid(state.data.password);
    const hasFirstName = state.data.firstName.length > 0;
    const hasLastName = state.data.lastName.length > 0;
    const hasCountry = state.data.country !== null;
    const hasAcceptedTerms = termsCheckbox?.checked ?? false;
    // Phone is optional but if entered must be valid
    const phoneOk = !state.data.phone || /^(\+90|0)?5\d{9}$/.test(state.data.phone.replace(/[\s\-\(\)]/g, ''));

    state.isValid = hasValidPassword && hasFirstName && hasLastName && hasCountry && hasAcceptedTerms && phoneOk;

    if (submitBtn) {
      submitBtn.disabled = !state.isValid;
    }
  }

  return state;
}

/**
 * Get current form data
 */
export function getAccountSetupFormData(): AccountSetupFormData | null {
  const container = document.getElementById('account-setup-form');
  if (!container) return null;

  const countryInput = document.getElementById('country-input') as HTMLInputElement | null;
  const firstNameInput = document.getElementById('first-name-input') as HTMLInputElement | null;
  const lastNameInput = document.getElementById('last-name-input') as HTMLInputElement | null;
  const phoneInput = document.getElementById('phone-input') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password-input') as HTMLInputElement | null;

  const countryCode = countryInput?.value || 'TR';
  const country = getCountryByCode(countryCode) || countryOptions[0];

  return {
    country,
    firstName: firstNameInput?.value.trim() || '',
    lastName: lastNameInput?.value.trim() || '',
    phone: phoneInput?.value.trim() || '',
    password: passwordInput?.value || '',
  };
}

/**
 * Reset the form to initial state
 */
export function resetAccountSetupForm(): void {
  const form = document.getElementById('account-setup-form-element') as HTMLFormElement | null;
  if (form) {
    form.reset();
  }

  // Reset password requirements UI
  const requirementsContainer = document.getElementById('password-requirements');
  if (requirementsContainer) {
    requirementsContainer.querySelectorAll('.auth-password-req-item').forEach(item => {
      item.classList.remove('valid', 'invalid');
    });
  }

  // Reset submit button
  const submitBtn = document.getElementById('account-setup-submit-btn') as HTMLButtonElement | null;
  if (submitBtn) {
    submitBtn.disabled = true;
  }
}

/**
 * Set form field error state
 */
export function setFieldError(fieldId: string, errorMessage?: string): void {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add('border-red-500', 'focus:border-red-500');
  field.classList.remove('border-gray-200', 'focus:border-orange-500');

  // Add error message if provided
  if (errorMessage) {
    const errorEl = document.createElement('p');
    errorEl.className = 'mt-1 text-sm text-red-500';
    errorEl.id = `${fieldId}-error`;
    errorEl.textContent = errorMessage;

    const existingError = document.getElementById(`${fieldId}-error`);
    if (existingError) {
      existingError.remove();
    }

    field.parentElement?.appendChild(errorEl);
  }
}

/**
 * Clear form field error state
 */
export function clearFieldError(fieldId: string): void {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove('border-red-500', 'focus:border-red-500');
  field.classList.add('border-gray-200', 'focus:border-orange-500');

  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) {
    errorEl.remove();
  }
}
