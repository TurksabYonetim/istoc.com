/**
 * SettingsDeleteAccount Component
 * Multi-step account deletion: reason → password verification → confirmation → done.
 * Uses Alpine.js x-data="settingsDeleteAccount" for form state.
 * Calls tradehub_core.api.v1.identity.delete_account endpoint.
 */

import { t } from '../../i18n';

const ICONS = {
  warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trash: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#fef2f2"/><path d="M16 20h16M20 20V16h8v4M18 20v12a2 2 0 002 2h8a2 2 0 002-2V20" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function getReasonOptions(): { value: string; label: string }[] {
  return [
    { value: '', label: t('settings.selectReasonPlaceholder') },
    { value: 'not_using', label: t('settings.reasonNotUsing') },
    { value: 'other_platform', label: t('settings.reasonOtherPlatform') },
    { value: 'privacy', label: t('settings.reasonPrivacy') },
    { value: 'too_many_emails', label: t('settings.reasonTooManyEmails') },
    { value: 'account_issue', label: t('settings.reasonAccountIssue') },
    { value: 'other', label: t('settings.reasonOther') },
  ];
}

export function SettingsDeleteAccount(): string {
  const reasonOptions = getReasonOptions().map(r =>
    `<option value="${r.value}">${r.label}</option>`
  ).join('');

  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4" x-data="settingsDeleteAccount">

      <!-- Step 1: Warning + Reason -->
      <div x-show="step === 1">
        <div class="max-w-[640px] mx-auto">
          <div class="flex justify-center mb-4">${ICONS.trash}</div>
          <h2 class="text-xl max-sm:text-base font-bold mb-3 m-0 text-center" style="color:var(--color-text-heading, #111827)">${t('settings.deleteConfirmTitle')}</h2>
          <p class="text-sm max-sm:text-[13px] mb-5 m-0 text-center" style="color:var(--color-text-muted, #666666)">${t('settings.deleteConfirmDesc')}</p>

          <ul class="list-none p-0 m-0 mb-6 flex flex-col gap-2">
            <li class="flex items-start gap-2 text-sm" style="color:var(--color-text-body, #333333)">
              <span class="text-red-500 mt-0.5 flex-shrink-0">&#8226;</span>
              ${t('settings.deleteItemProfile')}
            </li>
            <li class="flex items-start gap-2 text-sm" style="color:var(--color-text-body, #333333)">
              <span class="text-red-500 mt-0.5 flex-shrink-0">&#8226;</span>
              ${t('settings.deleteItemOrders')}
            </li>
            <li class="flex items-start gap-2 text-sm" style="color:var(--color-text-body, #333333)">
              <span class="text-red-500 mt-0.5 flex-shrink-0">&#8226;</span>
              ${t('settings.deleteItemFavorites')}
            </li>
            <li class="flex items-start gap-2 text-sm" style="color:var(--color-text-body, #333333)">
              <span class="text-red-500 mt-0.5 flex-shrink-0">&#8226;</span>
              ${t('settings.deleteItemMessages')}
            </li>
          </ul>

          <div class="mb-5">
            <label class="block text-[13px] font-medium mb-1.5" style="color:var(--color-text-muted, #666666)">${t('settings.selectReasonLabel')}</label>
            <select class="w-full py-2.5 px-3.5 border border-gray-300 rounded-lg text-sm outline-none bg-white cursor-pointer focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" x-ref="reason">
              ${reasonOptions}
            </select>
          </div>

          <div class="flex items-center gap-3 max-sm:flex-col">
            <button class="th-btn bg-red-600 hover:bg-red-700 max-sm:w-full" type="button" @click="goToStep2()">${t('settings.wantToDelete')}</button>
            <a href="#" class="text-[13px] font-medium no-underline hover:underline max-sm:text-center" style="color:var(--color-text-muted, #666666)">${t('settings.cancelAction')}</a>
          </div>
        </div>
      </div>

      <!-- Step 2: Password verification + Final confirmation -->
      <div x-show="step === 2" x-cloak>
        <div class="max-w-[640px] mx-auto">
          <div class="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            ${ICONS.warning}
            <p class="text-sm m-0 font-medium text-red-700">${t('settings.deleteIrreversible')}</p>
          </div>
          <p class="text-sm mb-5 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.deleteIrreversibleDesc')}</p>

          <div class="mb-4 max-sm:mb-3">
            <label class="block text-[13px] max-sm:text-xs font-medium mb-1.5" style="color:var(--color-text-muted, #666666)">${t('settings.currentPassword')}</label>
            <input type="password" class="w-full max-w-[360px] max-sm:max-w-full py-2.5 px-3.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10" x-ref="deletePassword" placeholder="${t('settings.currentPassword')}" />
          </div>

          <label class="flex items-start gap-2.5 cursor-pointer mb-5">
            <input type="checkbox" class="mt-0.5 w-4 h-4 flex-shrink-0" style="accent-color:#dc2626" x-ref="confirmCheck" />
            <span class="text-sm" style="color:var(--color-text-body, #333333)">${t('settings.confirmDeleteCheck')}</span>
          </label>

          <p class="text-[13px] text-red-500 mb-3" x-show="error" x-text="error" x-cloak></p>

          <div class="flex items-center gap-3 max-sm:flex-col">
            <button class="th-btn bg-red-600 hover:bg-red-700 max-sm:w-full disabled:opacity-50" type="button" @click="confirmDelete()" :disabled="loading">
              <span x-show="!loading">${t('settings.deleteMyAccount')}</span>
              <span x-show="loading" x-cloak class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ${t('common.loading')}
              </span>
            </button>
            <button class="text-[13px] font-medium bg-none border-none cursor-pointer hover:underline max-sm:text-center" style="color:var(--color-text-muted, #666666)" type="button" @click="step = 1">${t('settings.cancelAction')}</button>
          </div>
        </div>
      </div>

      <!-- Step 3: Done -->
      <div x-show="step === 3" x-cloak>
        <div class="max-w-[640px] mx-auto text-center py-4 max-sm:py-2">
          <h3 class="text-lg max-sm:text-base font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.accountDeleted')}</h3>
          <p class="text-sm max-sm:text-[13px] mb-6 max-sm:mb-4 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.accountDeletedDesc')}</p>
          <a href="/pages/auth/login.html" class="th-btn no-underline inline-flex max-sm:w-full max-sm:justify-center">${t('settings.goToLogin')}</a>
        </div>
      </div>
    </div>
  `;
}

/** @deprecated No-op — Alpine handles all interactivity */
export function initSettingsDeleteAccount(): void { /* no-op */ }
