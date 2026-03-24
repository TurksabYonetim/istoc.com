/**
 * LoginPage Component
 * Login page content with email/password login and 'Create account' link.
 * Used within AuthLayout for both desktop and mobile views.
 */

import { getBaseUrl } from './AuthLayout';
import { login, getSessionUser, getRedirectUrl } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export interface LoginPageOptions {
  /** Callback when 'Create account' is clicked */
  onCreateAccount?: () => void;
}

/* ── Component HTML ─────────────────────────────────── */

export function LoginPage(): string {
  const baseUrl = getBaseUrl();

  return `
    <div id="login-page" class="w-full">
      <!-- Header Area -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2" data-i18n="auth.login.title">${t('auth.login.title')}</h1>
      </div>

      <!-- Error message -->
      <p id="login-error" class="text-sm text-red-600 mb-4 hidden"></p>

      <!-- Login Form -->
      <form id="login-form" class="space-y-5">

        <!-- Email Input -->
        <div>
          <label for="email" class="sr-only" data-i18n="auth.login.email">${t('auth.login.email')}</label>
          <input
            type="email"
            id="email"
            name="email"
            class="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 auth-input-focus transition-colors"
            placeholder="${t('auth.login.email')}" data-i18n-placeholder="auth.login.email"
            required
          >
        </div>

        <!-- Password Input -->
        <div class="relative">
          <label for="password" class="sr-only" data-i18n="auth.login.password">${t('auth.login.password')}</label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 auth-input-focus transition-colors"
            placeholder="${t('auth.login.password')}" data-i18n-placeholder="auth.login.password"
            required
          >
          <button
            type="button"
            id="login-password-toggle"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg id="login-eye-show" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg id="login-eye-hide" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>

        <!-- Forgot Password -->
        <div class="text-right">
          <a href="${baseUrl}pages/auth/forgot-password.html" class="text-sm font-medium text-gray-900 dark:text-gray-300 hover:underline">
            <span data-i18n="auth.login.forgotPassword">${t('auth.login.forgotPassword')}</span>
          </a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="login-submit-btn"
          class="w-full h-12 th-btn th-btn-pill disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span id="login-submit-text" data-i18n="auth.login.continue">${t('auth.login.continue')}</span>
          <span id="login-submit-loading" class="hidden items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span data-i18n="common.loading">${t('common.loading')}</span>
          </span>
        </button>

      </form>


      <!-- Create Account Link -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span data-i18n="auth.login.newUser">${t('auth.login.newUser')}</span>
          <a
            href="${baseUrl}pages/auth/register.html"
            id="login-create-account-link"
            class="font-medium text-gray-900 dark:text-white hover:underline ml-1"
          >
            <span data-i18n="auth.login.createAccount">${t('auth.login.createAccount')}</span>
          </a>
        </p>
      </div>

    </div>
  `;
}

/* ── Init Logic ──────────────────────────────────────── */

/**
 * Initialize LoginPage interactivity
 * Sets up form submission with real Frappe API calls
 */
export function initLoginPage(options: LoginPageOptions = {}): void {
  const loginPage = document.getElementById('login-page');
  if (!loginPage) return;

  // Handle 'Create account' link
  const createAccountLink = document.getElementById('login-create-account-link');
  if (createAccountLink && options.onCreateAccount) {
    createAccountLink.addEventListener('click', (e) => {
      e.preventDefault();
      options.onCreateAccount!();
    });
  }

  // Password toggle
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const toggleBtn = document.getElementById('login-password-toggle');
  const eyeShow = document.getElementById('login-eye-show');
  const eyeHide = document.getElementById('login-eye-hide');

  if (toggleBtn && passwordInput && eyeShow && eyeHide) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeShow.classList.toggle('hidden', !isPassword);
      eyeHide.classList.toggle('hidden', isPassword);
    });
  }

  // Form submission
  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  const submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement | null;
  const submitText = document.getElementById('login-submit-text');
  const submitLoading = document.getElementById('login-submit-loading');
  const errorMsg = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = (document.getElementById('email') as HTMLInputElement)?.value;
      const password = (document.getElementById('password') as HTMLInputElement)?.value;

      if (!email || !password) return;

      // Show loading
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.classList.add('hidden');
      if (submitLoading) { submitLoading.classList.remove('hidden'); submitLoading.classList.add('inline-flex'); }
      if (errorMsg) errorMsg.classList.add('hidden');

      try {
        await login(email, password);
        const user = await getSessionUser();

        if (user) {
          // ?redirect= parametresi varsa ve aynı origin'deyse oraya git
          const redirectParam = new URLSearchParams(window.location.search).get('redirect');
          if (redirectParam) {
            try {
              const redirectUrl = new URL(redirectParam);
              if (redirectUrl.origin === window.location.origin) {
                window.location.href = redirectParam;
              } else {
                window.location.href = getRedirectUrl(user);
              }
            } catch {
              window.location.href = redirectParam;
            }
          } else {
            window.location.href = getRedirectUrl(user);
          }
        } else {
          window.location.href = getBaseUrl();
        }
      } catch (err) {
        if (err instanceof Error && err.message === '2FA_REQUIRED') {
          showToast({ message: t('auth.login.2faRequired'), type: 'info' });
        } else if (errorMsg) {
          errorMsg.textContent = t('auth.login.invalidCredentials');
          errorMsg.classList.remove('hidden');
        }
      } finally {
        // Hide loading
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.classList.remove('hidden');
        if (submitLoading) { submitLoading.classList.add('hidden'); submitLoading.classList.remove('inline-flex'); }
      }
    });
  }
}
