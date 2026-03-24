/**
 * ResetPasswordPage Component
 * New password form shown when user clicks the reset link from their email.
 * URL contains ?key=... parameter used to authorize the password reset.
 *
 * Uses Alpine.js x-data="resetPasswordPage" for form state.
 * Layout follows ForgotPasswordPage pattern (header + centered card).
 */

import { getBaseUrl } from './AuthLayout';
import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export type ResetPasswordStep = 'form' | 'success' | 'error';

/* ── Layout (reuses ForgotPasswordPage pattern) ────── */

function ResetPasswordHeader(): string {
  const baseUrl = getBaseUrl();
  return `
    <header class="bg-white border-b-2" style="border-color: var(--auth-header-border, #FF6600)">
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <a href="${baseUrl}" aria-label="iSTOC Ana Sayfa">
          <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-7" />
        </a>
        <div class="relative">
          <select class="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 bg-white appearance-none pr-6 cursor-pointer auth-input-focus">
            <option>${t('common.turkish')}</option>
            <option>${t('common.english')}</option>
          </select>
          <svg class="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/></svg>
        </div>
      </div>
    </header>
  `;
}

function ResetPasswordCard(content: string): string {
  return `
    <div class="min-h-[calc(100vh-58px)] bg-gray-100 flex items-start justify-center pt-8 sm:pt-12 pb-12 px-2 sm:px-4">
      <div class="w-full max-w-xl bg-white rounded-xl shadow-sm p-5 sm:p-8 md:p-12">
        ${content}
      </div>
    </div>
  `;
}

/* ── Step: Password Form ────────────────────────────── */

function StepForm(): string {
  return `
    <div x-show="step === 'form'">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="auth.reset.title">${t('auth.reset.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="auth.reset.subtitle">${t('auth.reset.subtitle')}</p>

      <form @submit.prevent="submitReset()" class="space-y-5">
        <!-- New Password -->
        <div class="relative">
          <label for="rp-new-password" class="sr-only" data-i18n="auth.reset.newPassword">${t('auth.reset.newPassword')}</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="rp-new-password"
            name="new-password"
            x-ref="newPassword"
            @input="onPasswordInput()"
            class="w-full h-12 px-4 pr-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 auth-input-focus transition-colors"
            placeholder="${t('auth.reset.newPassword')}" data-i18n-placeholder="auth.reset.newPassword"
            required
            autocomplete="new-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="${t('auth.forgot.showHidePassword')}" data-i18n-aria-label="auth.forgot.showHidePassword"
          >
            <svg x-show="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
            </svg>
            <svg x-show="showPassword" x-cloak class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
          </button>
        </div>

        <!-- Password Requirements -->
        <ul class="space-y-1.5 text-sm text-gray-500 list-disc pl-5">
          <li :style="reqStyle(reqMinLength)" data-i18n="auth.setup.minChars">${t('auth.setup.minChars')}</li>
          <li :style="reqStyle(reqUppercase)" data-i18n="auth.setup.uppercase">${t('auth.setup.uppercase')}</li>
          <li :style="reqStyle(reqLowercase)" data-i18n="auth.setup.lowercase">${t('auth.setup.lowercase')}</li>
          <li :style="reqStyle(reqNumber)" data-i18n="auth.setup.number">${t('auth.setup.number')}</li>
        </ul>

        <!-- Error message -->
        <p class="text-sm text-red-600 text-center" x-show="error" x-text="error" x-cloak></p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="!passwordValid || loading"
          disabled
          class="w-full h-12 th-btn th-btn-pill disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span x-show="!loading" data-i18n="auth.reset.submit">${t('auth.reset.submit')}</span>
          <span x-show="loading" x-cloak class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span data-i18n="common.loading">${t('common.loading')}</span>
          </span>
        </button>
      </form>
    </div>
  `;
}

/* ── Step: Success ──────────────────────────────────── */

function StepSuccess(): string {
  const baseUrl = getBaseUrl();
  return `
    <div x-show="step === 'success'" x-cloak>
      <div class="text-center">
        <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3" data-i18n="auth.reset.successTitle">${t('auth.reset.successTitle')}</h1>
        <p class="text-sm text-gray-500 mb-8" data-i18n="auth.reset.successDesc">${t('auth.reset.successDesc')}</p>
        <a
          href="${baseUrl}pages/auth/login.html"
          class="inline-block w-full h-12 leading-[3rem] text-center th-btn th-btn-pill no-underline"
        >
          <span data-i18n="auth.reset.goToLogin">${t('auth.reset.goToLogin')}</span>
        </a>
      </div>
    </div>
  `;
}

/* ── Step: Invalid Link Error ───────────────────────── */

function StepError(): string {
  const baseUrl = getBaseUrl();
  return `
    <div x-show="step === 'error'" x-cloak>
      <div class="text-center">
        <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3" data-i18n="auth.reset.invalidLinkTitle">${t('auth.reset.invalidLinkTitle')}</h1>
        <p class="text-sm text-gray-500 mb-8" x-text="error || '${t('auth.reset.invalidLinkDesc')}'"></p>
        <a
          href="${baseUrl}pages/auth/forgot-password.html"
          class="inline-block w-full h-12 leading-[3rem] text-center th-btn th-btn-pill no-underline"
        >
          <span data-i18n="auth.reset.requestNewLink">${t('auth.reset.requestNewLink')}</span>
        </a>
      </div>
    </div>
  `;
}

/* ── Main Component ─────────────────────────────────── */

/** Render the full reset-password page */
export function ResetPasswordPage(): string {
  return `
    <div id="reset-password-page" x-data="resetPasswordPage">
      ${ResetPasswordHeader()}
      ${ResetPasswordCard(`
        ${StepForm()}
        ${StepSuccess()}
        ${StepError()}
      `)}
    </div>
  `;
}

/** @deprecated No-op — Alpine handles all interactivity */
export function initResetPasswordPage(): void { /* no-op */ }
