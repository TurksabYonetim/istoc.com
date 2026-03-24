/**
 * SettingsLinkedAccounts Component
 * Third-party account linking.
 */

import { t } from '../../i18n';

export interface LinkedAccount {
  name: string;
  icon: string;
  connected: boolean;
  connectedLabel?: string;
}

const SOCIAL_ICONS = {
  facebook: `<svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#1877F2"/><path d="M22 16h-3.5v-2c0-.8.3-1.5 1.5-1.5H22V9h-2.5C17 9 15.5 10.5 15.5 13v3H13v3.5h2.5V27h3.5v-7.5H22l.5-3.5z" fill="#fff"/></svg>`,
  linkedin: `<svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#0A66C2"/><path d="M10 13h3v10h-3V13zm1.5-4.5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM15 13h2.8l.2 1.4c.8-1 2-1.7 3.5-1.4v2.8c-1.3-.2-2.5.2-3.2 1V23H15V13z" fill="#fff"/></svg>`,
  google: `<svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#fff" stroke="#e5e7eb"/><path d="M25.64 16.2c0-.63-.06-1.25-.16-1.84H16v3.49h5.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92a8.78 8.78 0 002.68-6.62z" fill="#4285F4"/><path d="M16 26c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H7.96v2.33A9 9 0 0016 26z" fill="#34A853"/><path d="M10.96 18.71A5.41 5.41 0 0110.68 17c0-.59.1-1.17.28-1.71v-2.33H7.96A9 9 0 007 17c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05"/><path d="M16 11.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C20.46 8.89 18.43 8 16 8A9 9 0 007.96 12.96l3 2.33C11.67 13.16 13.66 11.58 16 11.58z" fill="#EA4335"/></svg>`,
  twitter: `<svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#1DA1F2"/><path d="M24 11.5c-.6.3-1.2.5-1.8.6.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2 .8a3.2 3.2 0 00-5.5 2.9A9.1 9.1 0 019.4 10a3.2 3.2 0 001 4.3c-.5 0-1-.2-1.4-.4 0 1.6 1.1 2.9 2.6 3.2-.5.1-1 .2-1.4.1.4 1.2 1.5 2 2.8 2A6.4 6.4 0 019 20.8 9.1 9.1 0 0024 11.5z" fill="#fff"/></svg>`,
};

function getDefaultAccounts(): LinkedAccount[] {
  return [
    { name: 'facebook', icon: SOCIAL_ICONS.facebook, connected: false },
    { name: 'linkedin', icon: SOCIAL_ICONS.linkedin, connected: false },
    { name: 'google', icon: SOCIAL_ICONS.google, connected: true, connectedLabel: t('settings.linkedAccounts') },
    { name: 'twitter', icon: SOCIAL_ICONS.twitter, connected: false },
  ];
}

function renderAccountRow(account: LinkedAccount): string {
  const statusHtml = account.connected
    ? `<span class="text-[13px]" style="color:var(--color-text-muted, #666666)">${account.connectedLabel || t('settings.linkedConnected')}</span>
       <a href="#" class="linked-acc__remove text-[13px] font-medium no-underline hover:underline" style="color:var(--color-cta-primary, #333333)">${t('settings.linkedRemove')}</a>`
    : `<span class="text-[13px]" style="color:var(--color-text-placeholder, #999999)">${t('settings.linkedNotConnected')}</span>`;

  return `
    <div class="linked-acc__row flex items-center justify-between py-4 px-6 border-b border-border-default last:border-b-0 max-sm:px-3 max-sm:py-3 max-sm:gap-2">
      <div class="flex items-center gap-3 max-sm:gap-2">
        <span class="flex items-center flex-shrink-0">${account.icon}</span>
        <span class="text-sm max-sm:text-[13px] font-medium" style="color:var(--color-text-heading, #111827)">${account.name}</span>
      </div>
      <div class="linked-acc__right flex items-center gap-4 max-sm:gap-2 flex-shrink-0">
        ${statusHtml}
      </div>
    </div>
  `;
}

export function SettingsLinkedAccounts(accounts?: LinkedAccount[]): string {
  const items = accounts || getDefaultAccounts();

  return `
    <div class="bg-white rounded-lg p-8 max-sm:p-5">
      <h2 class="text-lg font-semibold mb-5 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.linkedAccountsTitle')}</h2>
      <div class="border border-border-default rounded-lg overflow-hidden">
        ${items.map(renderAccountRow).join('')}
      </div>
    </div>
  `;
}

export function initSettingsLinkedAccounts(): void {
  document.querySelectorAll<HTMLAnchorElement>('.linked-acc__remove').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const row = link.closest('.linked-acc__row');
      if (row) {
        const right = row.querySelector('.linked-acc__right');
        if (right) {
          right.innerHTML = `<span class="text-[13px]" style="color:var(--color-text-placeholder, #999999)">${t('settings.linkedNotConnected')}</span>`;
        }
      }
    });
  });
}
