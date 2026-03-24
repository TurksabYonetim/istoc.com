/**
 * ForgotPasswordPage Component
 * 2-step password reset flow (email link based):
 *   Step 1: "Hesabınızı bulun" — Email input
 *   Step 2: "Email Gönderildi" — Confirmation with resend option
 *
 * Uses Alpine.js x-data="forgotPasswordPage" for step navigation and form state.
 * Uses a minimal layout (logo header + centered card on gray bg).
 */

import { getBaseUrl } from './AuthLayout';
import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export type ForgotPasswordStep = 'find-account' | 'link-sent';

export interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  loading: boolean;
}

/* ── Helper ─────────────────────────────────────────── */

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 3)}***@${domain}`;
}

const supportLink = `
  <a href="javascript:void(0)" class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
    </svg>
    <span data-i18n="auth.forgot.contactSupport">${t('auth.forgot.contactSupport')}</span>
  </a>
`;

/* ── Layout ─────────────────────────────────────────── */

/** Minimal header with logo + language selector */
function ForgotPasswordHeader(): string {
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

/** Wrap step content in a centered card */
function ForgotPasswordCard(content: string): string {
  return `
    <div class="min-h-[calc(100vh-58px)] bg-gray-100 flex items-start justify-center pt-8 sm:pt-12 pb-12 px-2 sm:px-4">
      <div class="w-full max-w-xl bg-white rounded-xl shadow-sm p-5 sm:p-8 md:p-12">
        ${content}
      </div>
    </div>
  `;
}

/* ── Step 1: Hesabınızı bulun ───────────────────────── */

function StepFindAccount(): string {
  return `
    <div x-show="step === 'find-account'">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="auth.forgot.findAccount">${t('auth.forgot.findAccount')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="auth.forgot.findAccountDesc">${t('auth.forgot.findAccountDesc')}</p>

      <form @submit.prevent="submitFindAccount()" class="space-y-5">
        <div>
          <label for="fp-email" class="sr-only" data-i18n="auth.forgot.usernameOrEmail">${t('auth.forgot.usernameOrEmail')}</label>
          <input
            type="text"
            id="fp-email"
            name="email"
            x-model="email"
            class="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 auth-input-focus transition-colors"
            placeholder="${t('auth.forgot.usernameOrEmail')}" data-i18n-placeholder="auth.forgot.usernameOrEmail"
            required
            autocomplete="email"
          />
        </div>

        <button
          type="submit"
          :disabled="!email.trim() || loading"
          disabled
          class="w-full h-12 th-btn th-btn-pill disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span x-show="!loading" data-i18n="auth.forgot.continue">${t('auth.forgot.continue')}</span>
          <span x-show="loading" x-cloak class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span data-i18n="common.loading">${t('common.loading')}</span>
          </span>
        </button>
      </form>

      <div class="mt-16 flex justify-end">
        ${supportLink}
      </div>
    </div>
  `;
}

/* ── Step 2: Email Gönderildi ───────────────────────── */

function StepLinkSent(): string {
  const baseUrl = getBaseUrl();
  return `
    <div x-show="step === 'link-sent'" x-cloak>
      <div class="text-center">
        <!-- Email sent icon -->
        <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-3" data-i18n="auth.forgot.emailSentTitle">${t('auth.forgot.emailSentTitle')}</h1>
        <p class="text-sm text-gray-500 mb-2" data-i18n="auth.forgot.emailSentDesc">${t('auth.forgot.emailSentDesc')}</p>
        <p class="text-sm font-bold text-gray-900 mb-8" x-text="maskedEmail"></p>

        <!-- Back to login -->
        <a
          href="${baseUrl}pages/auth/login.html"
          class="inline-block w-full h-12 leading-[3rem] text-center th-btn th-btn-pill no-underline"
        >
          <span data-i18n="auth.forgot.backToLogin">${t('auth.forgot.backToLogin')}</span>
        </a>

        <!-- Resend link -->
        <div class="mt-6">
          <button
            type="button"
            @click="resendLink()"
            :disabled="loading"
            class="text-sm font-medium text-gray-900 underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span data-i18n="auth.forgot.resendEmail">${t('auth.forgot.resendEmail')}</span>
          </button>
        </div>
      </div>

      <div class="mt-12 flex justify-end">
        ${supportLink}
      </div>
    </div>
  `;
}

/* ── Main Component ─────────────────────────────────── */

/** Render the full forgot-password page */
export function ForgotPasswordPage(): string {
  return `
    <div id="forgot-password-page" x-data="forgotPasswordPage">
      ${ForgotPasswordHeader()}
      ${ForgotPasswordCard(`
        ${StepFindAccount()}
        ${StepLinkSent()}
      `)}
    </div>
  `;
}

/* ── Init Logic ─────────────────────────────────────── */

/** @deprecated No-op — Alpine handles all interactivity */
export function initForgotPasswordPage(): void { /* no-op */ }
