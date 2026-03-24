/**
 * SettingsChangeEmail Component
 * Email change — currently disabled (coming soon).
 */

import { t } from '../../i18n';

export function SettingsChangeEmail(): string {
  return `
    <div class="flex justify-center">
      <div class="w-full max-w-[640px]">
        <div class="bg-white rounded-xl p-8 shadow-sm max-md:p-6 max-sm:px-4 max-sm:py-5 text-center">
          <div class="mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#f3f4f6"/><path d="M16 20l8 6 8-6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="12" y="16" width="24" height="16" rx="3" stroke="#9ca3af" stroke-width="2"/></svg>
          </div>
          <h2 class="text-xl max-sm:text-lg font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.changeEmailNav')}</h2>
          <p class="text-sm max-sm:text-[13px] mb-2 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.featureComingSoon')}</p>
          <p class="text-[13px] mb-6 m-0" style="color:var(--color-text-placeholder, #999999)">${t('settings.featureComingSoonDesc')}</p>
          <a href="#" class="th-btn no-underline inline-flex max-sm:w-full max-sm:justify-center">${t('settings.backToSettings')}</a>
        </div>
      </div>
    </div>
  `;
}

/** @deprecated No-op — Alpine handles all interactivity */
export function initSettingsChangeEmail(): void { /* no-op */ }
