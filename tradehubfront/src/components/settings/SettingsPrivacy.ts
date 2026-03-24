/**
 * SettingsPrivacy Component
 * Privacy settings with radio group sections.
 */

import { t } from '../../i18n';

export interface PrivacyOption {
  value: string;
  label: string;
  tooltip?: string;
}

export interface PrivacySection {
  id: string;
  title: string;
  tooltip?: boolean;
  options: PrivacyOption[];
  selected: string;
}

function getShareOptions(): PrivacyOption[] {
  return [
    { value: 'hide', label: t('settings.optionHide') },
    { value: 'verified', label: t('settings.optionShareVerified'), tooltip: '?' },
    { value: 'all', label: t('settings.optionShareAll'), tooltip: '?' },
  ];
}

function getShareOptionsExtended(): PrivacyOption[] {
  return [
    { value: 'hide', label: t('settings.optionHide') },
    { value: 'verified', label: t('settings.optionShareVerified'), tooltip: '?' },
    { value: 'verified-extended', label: t('settings.optionShareVerifiedExtended') },
    { value: 'all', label: t('settings.optionShareAll'), tooltip: '?' },
  ];
}

function getContactOptions(): PrivacyOption[] {
  return [
    { value: 'exchanged', label: t('settings.optionExchangedOnly') },
    { value: 'verified-extended', label: t('settings.optionExchangedExtended') },
  ];
}

function getDefaultSections(): PrivacySection[] {
  const shareOptions = getShareOptions();
  const shareOptionsExtended = getShareOptionsExtended();
  const contactOptions = getContactOptions();

  return [
    { id: 'basic', title: t('settings.sectionBasicInfo'), tooltip: true, options: shareOptionsExtended, selected: 'all' },
    { id: 'contact', title: t('settings.sectionContactInfo'), tooltip: true, options: contactOptions, selected: 'verified-extended' },
    { id: 'spam', title: t('settings.sectionSpam'), tooltip: true, options: shareOptions, selected: 'all' },
    { id: 'sourcing', title: t('settings.sectionSourcingInfo'), tooltip: true, options: shareOptions, selected: 'all' },
    { id: 'activity', title: t('settings.sectionActivity'), tooltip: true, options: shareOptions, selected: 'verified' },
    { id: 'industries', title: t('settings.sectionIndustries'), tooltip: true, options: shareOptions, selected: 'verified' },
    { id: 'keywords', title: t('settings.sectionTopKeywords'), tooltip: true, options: shareOptions, selected: 'hide' },
    { id: 'recent', title: t('settings.sectionRecentKeywords'), tooltip: true, options: shareOptions, selected: 'verified' },
    { id: 'transaction', title: t('settings.sectionTransaction'), tooltip: true, options: shareOptionsExtended, selected: 'hide' },
    { id: 'details', title: t('settings.sectionActivityDetails'), tooltip: true, options: shareOptions, selected: 'verified' },
  ];
}

function renderPrivacySection(section: PrivacySection): string {
  const optionsHtml = section.options.map(opt => `
    <label class="privacy__radio flex items-center gap-2 text-sm max-sm:text-[13px] cursor-pointer leading-normal" style="color:var(--color-text-body, #333333)">
      <input type="radio" name="privacy-${section.id}" value="${opt.value}" class="m-0 flex-shrink-0" style="accent-color:var(--color-primary-500, #cc9900)" ${opt.value === section.selected ? 'checked' : ''} />
      <span class="flex-1 min-w-0">${opt.label}</span>
      ${opt.tooltip ? `<span class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 text-[10px] cursor-help flex-shrink-0" style="color:var(--color-text-placeholder, #999999)" title="${t('settings.moreInfo')}">?</span>` : ''}
    </label>
  `).join('');

  return `
    <div>
      <h3 class="text-sm max-sm:text-[13px] font-bold mb-3 max-sm:mb-2 m-0 flex items-center gap-1.5" style="color:var(--color-text-heading, #111827)">
        ${section.title}
        ${section.tooltip ? `<span class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 text-[10px] cursor-help flex-shrink-0" style="color:var(--color-text-placeholder, #999999)" title="${t('settings.moreInfo')}">?</span>` : ''}
      </h3>
      <div class="flex flex-col gap-2 max-sm:gap-1.5 pl-1">
        ${optionsHtml}
      </div>
    </div>
  `;
}

export function SettingsPrivacy(sections?: PrivacySection[]): string {
  const items = sections || getDefaultSections();

  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4">
      <h2 class="text-xl max-sm:text-lg font-bold m-0" style="color:var(--color-text-heading, #111827)">${t('settings.privacyTitle')}</h2>
      <div class="h-px bg-gray-200 mt-4 mb-6 max-sm:mt-3 max-sm:mb-4"></div>
      <div class="flex flex-col gap-7 max-sm:gap-5">
        ${items.map(renderPrivacySection).join('')}
      </div>
      <div class="mt-8 max-sm:mt-5">
        <button class="privacy__save-btn th-btn-dark disabled:opacity-60 disabled:cursor-default max-sm:w-full" type="button">${t('settings.privacySave')}</button>
      </div>
    </div>
  `;
}

const PRIVACY_STORAGE_KEY = 'tradehub_privacy_settings';

function readPrivacyData(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function savePrivacyData(data: Record<string, string>): void {
  localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(data));
}

export function initSettingsPrivacy(): void {
  const saved = readPrivacyData();
  for (const [name, value] of Object.entries(saved)) {
    const radio = document.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
  }

  const saveBtn = document.querySelector<HTMLButtonElement>('.privacy__save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const data: Record<string, string> = {};
      document.querySelectorAll<HTMLInputElement>('.privacy__radio input[type="radio"]:checked').forEach(r => {
        if (r.name) data[r.name] = r.value;
      });
      savePrivacyData(data);

      saveBtn.textContent = t('settings.privacySaved');
      saveBtn.disabled = true;
      setTimeout(() => {
        saveBtn.textContent = t('settings.privacySave');
        saveBtn.disabled = false;
      }, 2000);
    });
  }
}
