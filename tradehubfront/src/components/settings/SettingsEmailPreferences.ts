/**
 * SettingsEmailPreferences Component
 * Email notification preferences with master toggles and sub-checkboxes.
 * localStorage CRUD: tradehub_email_preferences
 */

import { t } from '../../i18n';

const STORAGE_KEY = 'tradehub_email_preferences';

export interface EmailCategory {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  items: EmailItem[];
}

export interface EmailItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

function getDefaultCategories(): EmailCategory[] {
  return [
    {
      id: 'notification',
      title: t('settings.allNotificationEmails'),
      description: t('settings.notificationEmailsDesc'),
      enabled: true,
      items: [
        {
          id: 'general_notification',
          title: t('settings.generalNotificationEmails'),
          description: t('settings.generalNotificationEmailsDesc'),
          checked: true,
        },
        {
          id: 'dispute_updates',
          title: t('settings.disputeUpdates'),
          description: t('settings.disputeUpdatesDesc'),
          checked: true,
        },
      ],
    },
    {
      id: 'marketing',
      title: t('settings.allMarketingEmails'),
      description: t('settings.marketingEmailsDesc'),
      enabled: true,
      items: [
        {
          id: 'general_marketing',
          title: t('settings.generalMarketingEmails'),
          description: t('settings.generalMarketingEmailsDesc'),
          checked: true,
        },
        {
          id: 'surveys',
          title: t('settings.surveys'),
          description: t('settings.surveysDesc'),
          checked: true,
        },
      ],
    },
  ];
}

// ── CRUD ─────────────────────────────────────────────────────────

interface SavedEmailPrefs {
  toggles: Record<string, boolean>;
  checks: Record<string, boolean>;
}

function readEmailPrefs(): EmailCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: SavedEmailPrefs = JSON.parse(raw);
      const defaults = getDefaultCategories();
      return defaults.map(cat => ({
        ...cat,
        enabled: saved.toggles[cat.id] ?? cat.enabled,
        items: cat.items.map(item => ({
          ...item,
          checked: saved.checks[item.id] ?? item.checked,
        })),
      }));
    }
  } catch { /* ignore */ }
  return getDefaultCategories().map(cat => ({ ...cat, items: cat.items.map(i => ({ ...i })) }));
}

function saveEmailPrefs(): void {
  const toggles: Record<string, boolean> = {};
  const checks: Record<string, boolean> = {};

  document.querySelectorAll<HTMLInputElement>('[data-cat-toggle]').forEach(el => {
    toggles[el.dataset.catToggle!] = el.checked;
  });
  document.querySelectorAll<HTMLInputElement>('[data-email-check]').forEach(el => {
    checks[el.dataset.emailCheck!] = el.checked;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ toggles, checks }));
}

// ── Renderers ────────────────────────────────────────────────────

function renderEmailItem(item: EmailItem): string {
  return `
    <div class="email-pref__item flex items-start gap-3 py-4 px-6 border-b border-(--color-border-light,#f0f0f0) last:border-b-0 max-md:px-4 max-md:py-3 max-sm:px-3">
      <label class="email-pref__checkbox relative inline-flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5 cursor-pointer">
        <input type="checkbox" data-email-check="${item.id}" ${item.checked ? 'checked' : ''} class="opacity-0 w-0 h-0 absolute" />
        <span class="email-pref__checkmark w-[18px] h-[18px] border-2 border-gray-300 rounded bg-white transition-all flex items-center justify-center"></span>
      </label>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold mb-1 m-0" style="color:var(--color-text-heading, #111827)">${item.title}</h4>
        <p class="text-[13px] leading-normal m-0" style="color:var(--color-text-muted, #666666)">${item.description}</p>
      </div>
    </div>
  `;
}

function renderCategory(cat: EmailCategory): string {
  return `
    <div class="email-pref__category">
      <div class="flex items-center justify-between gap-6 py-5 px-6 bg-surface-muted border border-border-default border-b-0 rounded-t-lg max-md:flex-col max-md:items-start max-md:gap-3 max-md:px-4 max-sm:px-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-[15px] max-sm:text-sm font-bold mb-1 m-0" style="color:var(--color-text-heading, #111827)">${cat.title}</h3>
          <p class="text-[13px] max-sm:text-xs m-0" style="color:var(--color-text-muted, #666666)">${cat.description}</p>
        </div>
        <label class="relative inline-flex w-12 h-[26px] flex-shrink-0 cursor-pointer">
          <input type="checkbox" data-cat-toggle="${cat.id}" ${cat.enabled ? 'checked' : ''} class="opacity-0 w-0 h-0 absolute" />
          <span class="email-pref__toggle-slider absolute inset-0 rounded-[13px] transition-colors" style="background:var(--color-border-medium)"></span>
        </label>
      </div>
      <div class="border border-border-default border-t-0 rounded-b-lg">
        ${cat.items.map(renderEmailItem).join('')}
      </div>
    </div>
  `;
}

export function SettingsEmailPreferences(): string {
  const categories = readEmailPrefs();
  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:p-3.5">
      <p class="text-[13px] max-sm:text-xs mb-2 m-0" style="color:var(--color-text-muted, #666666)">${t('settings.emailServices')}</p>
      <h2 class="text-2xl max-sm:text-xl font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.emailPreferences')}</h2>
      <p class="text-sm max-sm:text-[13px] mb-4 m-0" style="color:var(--color-text-placeholder, #999999)">${t('settings.emailPreferencesDesc')}</p>
      <p class="text-sm max-sm:text-[13px] mb-6 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.emailPreferencesFor')} <strong x-text="userEmail || '...'" class="font-semibold"></strong></p>
      <div class="flex flex-col gap-5 max-sm:gap-4">
        ${categories.map(renderCategory).join('')}
      </div>
      <div class="mt-5">
        <a href="#" class="text-[13px] text-blue-600 no-underline hover:underline">${t('settings.unsubscribeAll')}</a>
      </div>
    </div>
  `;
}

export function initSettingsEmailPreferences(): void {
  document.querySelectorAll<HTMLInputElement>('[data-cat-toggle], [data-email-check]').forEach(input => {
    input.addEventListener('change', () => {
      saveEmailPrefs();
    });
  });

  document.querySelectorAll<HTMLInputElement>('[data-cat-toggle]').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const category = toggle.closest('.email-pref__category');
      if (category) {
        category.querySelectorAll<HTMLInputElement>('[data-email-check]').forEach(cb => {
          cb.checked = toggle.checked;
        });
        saveEmailPrefs();
      }
    });
  });
}
