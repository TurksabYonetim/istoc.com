/**
 * ApplicationPendingPage Component
 * Shows seller application status based on current state.
 * Displays different content for Draft, Submitted, Under Review, Rejected.
 * Redirects to Seller Panel if already Approved.
 *
 * Uses Alpine.js x-data="applicationPendingPage" for state.
 */

import { getBaseUrl } from '../auth/AuthLayout';
import { t } from '../../i18n';

/* ── Layout ─────────────────────────────────────────── */

function PageHeader(): string {
  const baseUrl = getBaseUrl();
  return `
    <header class="bg-white border-b-2" style="border-color: var(--auth-header-border, #FF6600)">
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="${baseUrl}" aria-label="iSTOC Ana Sayfa">
          <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-7" />
        </a>
        <button
          @click="doLogout()"
          class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span data-i18n="sellerApplication.logout">${t('sellerApplication.logout')}</span>
        </button>
      </div>
    </header>
  `;
}

/* ── Status: Draft ──────────────────────────────────── */

function StatusDraft(): string {
  return `
    <div x-show="status === 'Draft'" x-cloak>
      <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="sellerApplication.draft.title">${t('sellerApplication.draft.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="sellerApplication.draft.desc">${t('sellerApplication.draft.desc')}</p>
      <a
        href="/pages/seller/supplier-setup.html"
        class="block w-full h-12 leading-[3rem] text-center th-btn th-btn-pill no-underline"
      >
        <span data-i18n="sellerApplication.draft.cta">${t('sellerApplication.draft.cta')}</span>
      </a>
    </div>
  `;
}

/* ── Status: Submitted ──────────────────────────────── */

function StatusSubmitted(): string {
  return `
    <div x-show="status === 'Submitted'" x-cloak>
      <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="sellerApplication.submitted.title">${t('sellerApplication.submitted.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="sellerApplication.submitted.desc">${t('sellerApplication.submitted.desc')}</p>
      ${ProgressIndicator('submitted')}
    </div>
  `;
}

/* ── Status: Under Review ───────────────────────────── */

function StatusUnderReview(): string {
  return `
    <div x-show="status === 'Under Review'" x-cloak>
      <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="sellerApplication.underReview.title">${t('sellerApplication.underReview.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="sellerApplication.underReview.desc">${t('sellerApplication.underReview.desc')}</p>
      ${ProgressIndicator('underReview')}
    </div>
  `;
}

/* ── Status: Rejected ───────────────────────────────── */

function StatusRejected(): string {
  return `
    <div x-show="status === 'Rejected'" x-cloak>
      <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="sellerApplication.rejected.title">${t('sellerApplication.rejected.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="sellerApplication.rejected.desc">${t('sellerApplication.rejected.desc')}</p>
      <a
        href="mailto:destek@istoc.com"
        class="block w-full h-12 leading-[3rem] text-center th-btn th-btn-pill no-underline mb-3"
      >
        <span data-i18n="sellerApplication.rejected.cta">${t('sellerApplication.rejected.cta')}</span>
      </a>
    </div>
  `;
}

/* ── Progress Indicator ─────────────────────────────── */

function ProgressIndicator(activeStep: 'submitted' | 'underReview'): string {
  const submittedActive = activeStep === 'submitted' || activeStep === 'underReview';
  const reviewActive = activeStep === 'underReview';

  return `
    <div class="flex items-center justify-center gap-2 mt-6 mb-4">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full ${submittedActive ? 'bg-green-500' : 'bg-gray-300'}"></div>
        <span class="text-xs text-gray-500">Submitted</span>
      </div>
      <div class="w-8 h-px ${reviewActive ? 'bg-green-500' : 'bg-gray-300'}"></div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full ${reviewActive ? 'bg-indigo-500' : 'bg-gray-300'}"></div>
        <span class="text-xs text-gray-500">Review</span>
      </div>
      <div class="w-8 h-px bg-gray-300"></div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-gray-300"></div>
        <span class="text-xs text-gray-500">Approved</span>
      </div>
    </div>
  `;
}

/* ── Status: Approved ────────────────────────────────── */

function StatusApproved(): string {
  return `
    <div x-show="status === 'Approved'" x-cloak>
      <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-3" data-i18n="sellerApplication.approved.title">${t('sellerApplication.approved.title')}</h1>
      <p class="text-sm text-gray-500 text-center mb-8" data-i18n="sellerApplication.approved.desc">${t('sellerApplication.approved.desc')}</p>
    </div>
  `;
}

/* ── Loading ────────────────────────────────────────── */

function StatusLoading(): string {
  return `
    <div x-show="status === 'loading'">
      <div class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    </div>
  `;
}

/* ── Main Component ─────────────────────────────────── */

export function ApplicationPendingPage(): string {
  const baseUrl = getBaseUrl();
  return `
    <div id="application-pending-page" x-data="applicationPendingPage">
      ${PageHeader()}
      <div class="min-h-[calc(100vh-58px)] bg-gray-100 flex items-start justify-center pt-8 sm:pt-12 pb-12 px-2 sm:px-4">
        <div class="w-full max-w-xl bg-white rounded-xl shadow-sm p-5 sm:p-8 md:p-12 text-center">
          ${StatusLoading()}
          ${StatusDraft()}
          ${StatusSubmitted()}
          ${StatusUnderReview()}
          ${StatusRejected()}
          ${StatusApproved()}

          <!-- Back to home link -->
          <div x-show="status !== 'loading'" x-cloak class="mt-6">
            <a href="${baseUrl}" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <span data-i18n="sellerApplication.backToHome">${t('sellerApplication.backToHome')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
