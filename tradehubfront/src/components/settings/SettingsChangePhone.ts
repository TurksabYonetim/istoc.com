/**
 * SettingsChangePhone Component
 * Phone change form — verifies password then updates phone via backend API.
 * Uses Alpine.js x-data="settingsChangePhone" for form state.
 * Calls tradehub_core.api.v1.identity.change_phone endpoint.
 */

import { t } from '../../i18n';

const ICONS = {
  checkActive: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#22c55e"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export function SettingsChangePhone(): string {
  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4" x-data="settingsChangePhone">
      <h2 class="text-xl max-sm:text-base font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.changePhone')}</h2>
      <p class="text-sm max-sm:text-[13px] mb-7 max-sm:mb-4 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.changePhoneDesc')}</p>

      <!-- Step 1: Phone Form -->
      <div x-show="step === 1">
        <div class="max-w-[640px] mx-auto">
          <!-- Current phone (read-only info) -->
          <div class="mb-4 max-sm:mb-3" x-show="currentPhone" x-cloak>
            <label class="block text-[13px] max-sm:text-xs font-medium mb-1.5" style="color:var(--color-text-muted, #666666)">${t('settings.currentPhoneLabel') || 'Mevcut Telefon'}</label>
            <div class="py-2.5 px-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50" style="color:var(--color-text-body, #333333)" x-text="currentPhone"></div>
          </div>

          <div class="mb-4 max-sm:mb-3">
            <label class="block text-[13px] max-sm:text-xs font-medium mb-1.5" style="color:var(--color-text-muted, #666666)">${t('settings.newPhoneLabel') || 'Yeni Telefon Numarası'}</label>
            <input type="tel" class="w-full max-w-[360px] max-sm:max-w-full py-2.5 px-3.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" x-ref="newPhone" autocomplete="off" placeholder="+90 5XX XXX XX XX" />
          </div>

          <div class="mb-4 max-sm:mb-3">
            <label class="block text-[13px] max-sm:text-xs font-medium mb-1.5" style="color:var(--color-text-muted, #666666)">${t('settings.currentPassword')}</label>
            <input type="password" class="w-full max-w-[360px] max-sm:max-w-full py-2.5 px-3.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" x-ref="phonePassword" autocomplete="off" placeholder="${t('settings.currentPassword')}" />
            <p class="text-xs mt-1.5 m-0" style="color:var(--color-text-placeholder, #999999)">${t('settings.passwordRequiredForSecurity') || 'Güvenlik için mevcut şifrenizi girin.'}</p>
          </div>

          <p class="text-[13px] text-red-500 mb-3" x-show="error" x-text="error" x-cloak></p>

          <button class="th-btn max-sm:w-full disabled:opacity-50" type="button" @click="savePhone()" :disabled="loading">
            <span x-show="!loading">${t('settings.privacySave')}</span>
            <span x-show="loading" x-cloak class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ${t('common.loading')}
            </span>
          </button>
        </div>
      </div>

      <!-- Step 2: Success -->
      <div x-show="step === 2" x-cloak>
        <div class="max-w-[640px] mx-auto text-center py-4 max-sm:py-2">
          <div class="mb-4">${ICONS.checkActive}</div>
          <h3 class="text-lg max-sm:text-base font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.phoneUpdated')}</h3>
          <p class="text-sm max-sm:text-[13px] mb-6 max-sm:mb-4 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.newPhoneSaved')}</p>
          <a href="#" class="th-btn no-underline inline-flex max-sm:w-full max-sm:justify-center">${t('settings.backToSettings')}</a>
        </div>
      </div>
    </div>
  `;
}

/** @deprecated No-op — Alpine handles all interactivity */
export function initSettingsChangePhone(): void { /* no-op */ }
