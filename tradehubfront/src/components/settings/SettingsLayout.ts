/**
 * SettingsLayout Component
 * Account settings page with profile header and settings cards.
 * Uses Alpine.js x-data="settingsLayout" for hash-based section routing.
 * Supports hash routing for sub-sections:
 *   #profilim, #vergi, #bagli-hesaplar, #gizlilik, #reklam, #eposta, #sifre, #eposta-degistir, #telefon
 */

import { t } from '../../i18n';
import { SettingsAccountEdit, initSettingsAccountEdit } from './SettingsAccountEdit';
import { SettingsTaxInfo, initSettingsTaxInfo } from './SettingsTaxInfo';
import { SettingsLinkedAccounts, initSettingsLinkedAccounts } from './SettingsLinkedAccounts';
import { SettingsPrivacy, initSettingsPrivacy } from './SettingsPrivacy';
import { SettingsAdPreferences, initSettingsAdPreferences } from './SettingsAdPreferences';
import { SettingsEmailPreferences, initSettingsEmailPreferences } from './SettingsEmailPreferences';
import { SettingsChangePassword, initSettingsChangePassword } from './SettingsChangePassword';
import { SettingsChangeEmail, initSettingsChangeEmail } from './SettingsChangeEmail';
import { SettingsChangePhone, initSettingsChangePhone } from './SettingsChangePhone';
import { SettingsDeleteAccount, initSettingsDeleteAccount } from './SettingsDeleteAccount';
import { SettingsMyAccount, initSettingsMyAccount } from './SettingsMyAccount';

// ── SVG Icons ────────────────────────────────────────────────────

const ICONS = {
  accountInfo: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 17c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  security: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1.5L3 4.5v4c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10v-4L10 1.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  preferences: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="5" r="1.5" fill="currentColor"/><circle cx="13" cy="10" r="1.5" fill="currentColor"/><circle cx="9" cy="15" r="1.5" fill="currentColor"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12l-4-4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  google: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92a8.78 8.78 0 002.68-6.62z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z" fill="#34A853"/><path d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/></svg>`,
  camera: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 3L4.5 4.5H2.5a1 1 0 00-1 1v6a1 1 0 001 1h11a1 1 0 001-1v-6a1 1 0 00-1-1h-2l-1-1.5h-4z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/></svg>`,
  edit: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 1.5l2 2L4.5 11.5H2.5v-2l8-8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 9.5v-7a1 1 0 011-1h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
};

// ── Settings Item Renderer ───────────────────────────────────────

interface SettingsItem {
  label: string;
  href: string;
  rightIcon?: string;
  rightText?: string;
}

function renderSettingsItem(item: SettingsItem): string {
  const rightContent = item.rightIcon
    ? `<span class="flex items-center">${item.rightIcon}</span>`
    : item.rightText
      ? `<span class="text-[13px]" style="color:var(--color-text-placeholder, #999999)">${item.rightText}</span>`
      : '';

  return `
    <a href="${item.href}" class="flex items-center justify-between py-3 no-underline transition-colors rounded -mx-2 px-2 hover:bg-(--color-surface-muted,#fafafa) group">
      <span class="text-sm max-sm:text-[13px]" style="color:var(--color-text-body, #333333); group-hover:color:var(--color-text-heading, #111827)">${item.label}</span>
      <span class="flex items-center gap-2 flex-shrink-0">
        ${rightContent}
        ${ICONS.chevron}
      </span>
    </a>
  `;
}

// ── Settings Card Renderer ───────────────────────────────────────

interface SettingsCard {
  icon: string;
  title: string;
  items: SettingsItem[];
}

function renderSettingsCard(card: SettingsCard): string {
  return `
    <div class="bg-white rounded-lg p-6 max-sm:p-3.5">
      <div class="flex items-center gap-2.5">
        <span class="flex items-center justify-center" style="color:var(--color-text-body, #333333)">${card.icon}</span>
        <h2 class="text-base max-sm:text-[15px] font-bold m-0" style="color:var(--color-text-heading, #111827)">${card.title}</h2>
      </div>
      <div class="h-px bg-gray-200 my-4 max-sm:my-3"></div>
      <div class="flex flex-col">
        ${card.items.map(renderSettingsItem).join('')}
      </div>
    </div>
  `;
}

// ── Profile Header ───────────────────────────────────────────────

function renderProfileHeader(): string {
  return `
    <div class="flex items-center justify-between gap-6 bg-white rounded-lg py-6 px-8 max-lg:flex-col max-lg:items-start max-lg:px-5 max-lg:py-5 max-sm:px-3 max-sm:py-3 max-lg:gap-4">
      <div class="flex items-center gap-5 max-sm:flex-col max-sm:items-start min-w-0">
        <div class="relative flex-shrink-0">
          <div class="w-[72px] h-[72px] max-sm:w-[60px] max-sm:h-[60px] rounded-full flex items-center justify-center border-3 border-primary-200" style="background:linear-gradient(135deg, var(--color-primary-400, #e6b212) 0%, var(--color-primary-500, #cc9900) 100%)">
            <span class="text-[32px] max-sm:text-[26px] font-bold text-white lowercase leading-none" x-text="userInitial || '?'"></span>
          </div>
          <button class="absolute -bottom-0.5 -left-0.5 w-7 h-7 max-sm:w-6 max-sm:h-6 rounded-full bg-white border border-border-default flex items-center justify-center cursor-pointer transition-all hover:bg-surface-raised" style="color:var(--color-text-muted, #666666)" title="${t('settings.changePhoto')}">
            ${ICONS.camera}
          </button>
        </div>
        <div class="flex flex-col gap-1 min-w-0">
          <h2 class="text-lg max-sm:text-base font-bold mb-1 m-0" style="color:var(--color-text-heading, #111827)" x-text="userName || '...'"></h2>
          <div class="flex items-center gap-2 text-[13px] max-sm:text-xs flex-wrap">
            <span class="min-w-[110px] max-sm:min-w-0 flex-shrink-0" style="color:var(--color-text-placeholder, #999999)">${t('settings.emailLayoutLabel')}</span>
            <span class="font-mono truncate" style="color:var(--color-text-body, #333333)" x-text="userEmail || '...'"></span>
            <button class="inline-flex items-center justify-center w-6 h-6 border-none bg-none rounded cursor-pointer transition-all hover:bg-surface-raised flex-shrink-0" style="color:var(--color-text-placeholder, #999999)" title="${t('settings.changeEmailNav')}">${ICONS.edit}</button>
          </div>
          <div class="flex items-center gap-2 text-[13px] max-sm:text-xs flex-wrap">
            <span class="min-w-[110px] max-sm:min-w-0 flex-shrink-0" style="color:var(--color-text-placeholder, #999999)">${t('settings.membershipNumber')}</span>
            <span class="font-mono truncate" style="color:var(--color-text-body, #333333)" x-text="memberId || '...'"></span>
            <button x-ref="copyBtn" @click="copyMemberId()" class="inline-flex items-center justify-center w-6 h-6 border-none bg-none rounded cursor-pointer transition-all hover:bg-surface-raised flex-shrink-0" style="color:var(--color-text-placeholder, #999999)" title="${t('settings.copyTooltip')}">${ICONS.copy}</button>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 flex-shrink-0 max-lg:w-full">
        <a href="#profilim" class="inline-flex items-center justify-center px-6 max-sm:px-3 h-10 rounded-full text-sm max-sm:text-[13px] font-semibold no-underline transition-all whitespace-nowrap text-white max-lg:flex-1 max-lg:text-center" style="background:var(--color-text-heading)">${t('settings.editProfile')}</a>
        <button @click="handleLogout()" class="inline-flex items-center justify-center px-6 max-sm:px-3 h-10 rounded-full text-sm max-sm:text-[13px] font-semibold no-underline transition-all whitespace-nowrap bg-none hover:underline max-lg:flex-1 max-lg:text-center cursor-pointer border-none" style="color:var(--color-text-body, #333333)">${t('settings.signOut')}</button>
      </div>
    </div>
  `;
}

// ── Card Data ────────────────────────────────────────────────────

function getAccountInfoCard(): SettingsCard {
  return {
    icon: ICONS.accountInfo,
    title: t('settings.accountInfoCardTitle'),
    items: [
      { label: t('settings.myProfile'), href: '#profilim' },
      { label: t('settings.myAccountNav') || t('settings.myMembership'), href: '#hesabim' },
      { label: t('settings.linkedAccountsNav'), href: '#bagli-hesaplar', rightIcon: ICONS.google },
      { label: t('settings.taxInfoNav'), href: '#vergi' },
    ],
  };
}

function getSecurityCard(): SettingsCard {
  return {
    icon: ICONS.security,
    title: t('settings.accountSecurityTitle'),
    items: [
      { label: t('settings.changePasswordNav'), href: '#sifre' },
      { label: t('settings.changeEmailNav'), href: '#eposta-degistir' },
      { label: t('settings.changePhoneNav'), href: '#telefon' },
      { label: t('settings.deleteAccountNav'), href: '#hesabi-sil' },
    ],
  };
}

function getPreferencesCard(): SettingsCard {
  return {
    icon: ICONS.preferences,
    title: t('settings.preferencesCardTitle'),
    items: [
      { label: t('settings.privacySettingsNav'), href: '#gizlilik' },
      { label: t('settings.emailPreferencesNav'), href: '#eposta' },
      { label: t('settings.adPreferencesNav'), href: '#reklam' },
    ],
  };
}

// ── Sub-section back header ──────────────────────────────────────

function renderBackHeader(): string {
  return `
    <a href="#" class="inline-flex items-center gap-1.5 text-[13px] text-blue-600 no-underline font-medium mb-4 transition-colors hover:text-blue-700">
      ${ICONS.back}
      <span>${t('settings.backToAccountSettings')}</span>
    </a>
  `;
}

// ── Default View (cards) ─────────────────────────────────────────

function renderDefaultView(): string {
  return `
    ${renderProfileHeader()}
    <div class="flex gap-5 items-start max-lg:flex-col mt-5">
      <div class="flex-1 min-w-0 flex flex-col gap-5 max-lg:w-full">
        ${renderSettingsCard(getAccountInfoCard())}
        ${renderSettingsCard(getPreferencesCard())}
      </div>
      <div class="flex-1 min-w-0 max-lg:w-full">
        ${renderSettingsCard(getSecurityCard())}
      </div>
    </div>
  `;
}

// ── Hash-section mapping ─────────────────────────────────────────

function getSectionMap(): Record<string, { title: string; render: () => string }> {
  return {
    '#profilim': { title: t('settings.myProfile'), render: () => SettingsAccountEdit() },
    '#hesabim': { title: t('settings.myAccountNav') || 'Hesabım', render: () => SettingsMyAccount() },
    '#vergi': { title: t('settings.taxInfoNav'), render: () => SettingsTaxInfo() },
    '#bagli-hesaplar': { title: t('settings.linkedAccountsNav'), render: () => SettingsLinkedAccounts() },
    '#gizlilik': { title: t('settings.privacySettingsNav'), render: () => SettingsPrivacy() },
    '#reklam': { title: t('settings.adPreferencesNav'), render: () => SettingsAdPreferences() },
    '#eposta': { title: t('settings.emailPreferencesNav'), render: () => SettingsEmailPreferences() },
    '#sifre': { title: t('settings.changePasswordNav'), render: () => SettingsChangePassword() },
    '#eposta-degistir': { title: t('settings.changeEmailNav'), render: () => SettingsChangeEmail() },
    '#telefon': { title: t('settings.changePhoneNav'), render: () => SettingsChangePhone() },
    '#hesabi-sil': { title: t('settings.deleteAccountNav'), render: () => SettingsDeleteAccount() },
  };
}

const INIT_MAP: Record<string, () => void> = {
  '#profilim': initSettingsAccountEdit,
  '#hesabim': initSettingsMyAccount,
  '#vergi': initSettingsTaxInfo,
  '#bagli-hesaplar': initSettingsLinkedAccounts,
  '#gizlilik': initSettingsPrivacy,
  '#reklam': initSettingsAdPreferences,
  '#eposta': initSettingsEmailPreferences,
  '#sifre': initSettingsChangePassword,
  '#eposta-degistir': initSettingsChangeEmail,
  '#telefon': initSettingsChangePhone,
  '#hesabi-sil': initSettingsDeleteAccount,
};

// ── Main Layout ──────────────────────────────────────────────────

export function SettingsLayout(): string {
  const sectionMap = getSectionMap();
  const sectionEntries = Object.entries(sectionMap);
  const validHashes = Object.keys(sectionMap).map(s => `'${s}'`).join(',');
  const currentHash = window.location.hash;
  const hasSubSection = Object.keys(sectionMap).includes(currentHash);

  return `
    <div class="flex flex-col gap-5 py-4" id="settings-root"
      x-data="settingsLayout"
      @hashchange.window="currentSection = window.location.hash">

      <div x-show="![${validHashes}].includes(currentSection)"${hasSubSection ? ' x-cloak' : ''}>
        ${renderDefaultView()}
      </div>

      ${sectionEntries.map(([hash, section]) => `
        <div x-show="currentSection === '${hash}'"${currentHash !== hash ? ' x-cloak' : ''}>
          ${renderBackHeader()}
          ${section.render()}
        </div>
      `).join('')}
    </div>
  `;
}

// ── Init ─────────────────────────────────────────────────────────

/**
 * Transitional bridge: lazily initialize sub-section event listeners.
 * These init functions will become no-ops as their components are migrated to Alpine.
 * Copy button is now handled by Alpine @click="copyMemberId()" in the template.
 */
export function initSettingsLayout(): void {
  const initialized = new Set<string>();

  const initCurrent = () => {
    const hash = window.location.hash;
    if (hash && INIT_MAP[hash] && !initialized.has(hash)) {
      INIT_MAP[hash]();
      initialized.add(hash);
    }
  };

  initCurrent();
  window.addEventListener('hashchange', initCurrent);
}
