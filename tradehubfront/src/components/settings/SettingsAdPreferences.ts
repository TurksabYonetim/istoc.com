/**
 * SettingsAdPreferences Component
 * Data preferences with toggle switches for personalized ads/recommendations.
 * localStorage CRUD: tradehub_ad_preferences
 */

import { t } from '../../i18n';

const STORAGE_KEY = 'tradehub_ad_preferences';

export interface AdPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

function getDefaultPreferences(): AdPreference[] {
  return [
    {
      id: 'personalized_ads',
      title: t('settings.adAllPersonalizedAds'),
      description: t('settings.adAllPersonalizedAdsDesc'),
      enabled: false,
    },
    {
      id: 'personalized_recommendations',
      title: t('settings.adAllPersonalizedRecs'),
      description: t('settings.adAllPersonalizedRecsDesc'),
      enabled: false,
    },
  ];
}

function readPreferences(): AdPreference[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: Record<string, boolean> = JSON.parse(raw);
      const defaults = getDefaultPreferences();
      return defaults.map(p => ({ ...p, enabled: saved[p.id] ?? p.enabled }));
    }
  } catch { /* ignore */ }
  return getDefaultPreferences().map(p => ({ ...p }));
}

function savePreferences(prefs: Record<string, boolean>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function renderToggle(pref: AdPreference): string {
  return `
    <div class="flex items-start justify-between gap-6 py-6 border-b border-(--color-border-light,#f0f0f0) last:border-b-0">
      <div class="flex-1 min-w-0">
        <h3 class="text-[15px] font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${pref.title}</h3>
        <p class="text-[13px] leading-relaxed m-0" style="color:var(--color-text-placeholder, #999999)">${pref.description}</p>
      </div>
      <label class="relative inline-flex w-12 h-[26px] flex-shrink-0 cursor-pointer">
        <input type="checkbox" data-pref-id="${pref.id}" ${pref.enabled ? 'checked' : ''} class="opacity-0 w-0 h-0 absolute" />
        <span class="ad-pref__toggle-slider absolute inset-0 rounded-[13px] transition-colors" style="background:var(--color-border-medium)"></span>
      </label>
    </div>
  `;
}

export function SettingsAdPreferences(): string {
  const prefs = readPreferences();
  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:p-3.5">
      <h2 class="text-xl max-sm:text-lg font-bold mb-6 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.dataPreferences')}</h2>
      <div class="flex flex-col">
        ${prefs.map(renderToggle).join('')}
      </div>
      <div class="mt-12 flex justify-center">
        <a href="#" class="ad-pref__back-btn inline-flex items-center justify-center py-3 px-20 max-sm:px-10 max-sm:w-full border border-gray-300 rounded-3xl text-sm font-medium no-underline transition-all hover:bg-surface-raised hover:border-gray-400" style="color:var(--color-text-heading, #111827)">${t('settings.adBack')}</a>
      </div>
    </div>
  `;
}

export function initSettingsAdPreferences(): void {
  document.querySelectorAll<HTMLInputElement>('[data-pref-id]').forEach(input => {
    input.addEventListener('change', () => {
      const prefs: Record<string, boolean> = {};
      document.querySelectorAll<HTMLInputElement>('[data-pref-id]').forEach(cb => {
        prefs[cb.dataset.prefId!] = cb.checked;
      });
      savePreferences(prefs);
    });
  });

  const backBtn = document.querySelector<HTMLAnchorElement>('.ad-pref__back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '';
    });
  }
}
