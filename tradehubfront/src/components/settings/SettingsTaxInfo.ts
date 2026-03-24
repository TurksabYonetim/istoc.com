/**
 * SettingsTaxInfo Component
 * Tax information page with tabs.
 */

import { t } from '../../i18n';

const ICONS = {
  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#2563eb" stroke-width="1.2"/><path d="M8 7v4M8 5h0" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

export interface TaxSection {
  title: string;
  description: string;
  buttonLabel: string;
}

function getDefaultSections(): TaxSection[] {
  return [
    {
      title: t('settings.taxUsTitle'),
      description: t('settings.taxUsDesc'),
      buttonLabel: t('settings.taxUsBtn'),
    },
    {
      title: t('settings.taxEuTitle'),
      description: t('settings.taxEuDesc'),
      buttonLabel: t('settings.taxEuBtn'),
    },
    {
      title: t('settings.taxCaTitle'),
      description: t('settings.taxCaDesc'),
      buttonLabel: t('settings.taxCaBtn'),
    },
  ];
}

export interface FaqItem {
  title: string;
  description: string;
  linkText?: string;
}

function getDefaultFaqs(): FaqItem[] {
  return [
    {
      title: t('settings.faqNoTaxInfoTitle'),
      description: t('settings.faqNoTaxInfoDesc'),
      linkText: t('settings.faqNoTaxInfoLink'),
    },
    {
      title: t('settings.faqNotApprovedTitle'),
      description: t('settings.faqNotApprovedDesc'),
      linkText: t('settings.faqNotApprovedLink'),
    },
    {
      title: t('settings.faqRefundTitle'),
      description: t('settings.faqRefundDesc'),
      linkText: t('settings.faqRefundLink'),
    },
  ];
}

function renderTaxSection(section: TaxSection): string {
  return `
    <div class="flex items-center justify-between gap-5 p-6 max-sm:p-4 border border-border-default rounded-lg max-md:flex-col max-md:items-start max-md:gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-[15px] max-sm:text-sm font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${section.title}</h3>
        <p class="text-[13px] max-sm:text-xs leading-normal m-0" style="color:var(--color-text-muted, #666666)">${section.description}</p>
      </div>
      <button class="th-btn-outline th-btn-pill th-btn-sm flex-shrink-0 text-[13px] whitespace-normal text-center" type="button">${section.buttonLabel}</button>
    </div>
  `;
}

function renderFaqCard(faq: FaqItem): string {
  return `
    <div class="p-5 max-sm:p-4 border border-border-default rounded-lg">
      <h4 class="text-sm max-sm:text-[13px] font-bold mb-2 m-0" style="color:var(--color-text-heading, #111827)">${faq.title}</h4>
      <p class="text-[13px] max-sm:text-xs leading-normal mb-2 m-0" style="color:var(--color-text-muted, #666666)">${faq.description}</p>
      ${faq.linkText ? `<a href="#" class="text-[13px] max-sm:text-xs text-blue-600 underline">${faq.linkText}</a>` : ''}
    </div>
  `;
}

export function SettingsTaxInfo(sections?: TaxSection[], faqs?: FaqItem[]): string {
  const taxSections = sections || getDefaultSections();
  const faqItems = faqs || getDefaultFaqs();

  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:p-3.5">
      <h2 class="text-xl max-sm:text-lg font-bold mb-5 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.taxInfoTitle')}</h2>

      <div class="flex border-b-2 border-border-default mb-5">
        <button class="tax-info__tab py-2.5 px-5 max-sm:px-3 text-sm max-sm:text-[13px] font-medium bg-none border-none border-b-2 -mb-[2px] cursor-pointer transition-all" style="color:var(--color-text-heading, #111827); border-bottom-color:var(--color-text-heading)" data-tab="vergi">${t('settings.taxInfoTab')}</button>
        <button class="tax-info__tab py-2.5 px-5 max-sm:px-3 text-sm max-sm:text-[13px] font-medium bg-none border-none border-b-2 border-transparent -mb-[2px] cursor-pointer transition-all" style="color:var(--color-text-muted, #666666)" data-tab="gumruk">${t('settings.customsTab')}</button>
      </div>

      <div class="flex items-start gap-2.5 py-3 px-4 max-sm:px-3 bg-blue-50 rounded-md text-[13px] max-sm:text-xs text-blue-800 mb-6 max-sm:mb-4">
        <span class="flex-shrink-0 mt-0.5">${ICONS.info}</span>
        <div class="flex-1 min-w-0">
          <span>${t('settings.taxBannerText')}</span>
          <a href="#" class="text-blue-600 font-medium no-underline hover:underline ml-1">${t('settings.taxBannerLink')}</a>
        </div>
      </div>

      <div class="flex flex-col gap-4 mb-8" id="tax-tab-vergi">
        ${taxSections.map(renderTaxSection).join('')}
      </div>

      <div class="flex flex-col gap-4 mb-8" id="tax-tab-gumruk" style="display:none">
        <div class="p-10 text-center text-sm" style="color:var(--color-text-placeholder, #999999)">${t('settings.customsPlaceholder')}</div>
      </div>

      <h3 class="text-lg max-sm:text-base font-bold mb-4 m-0" style="color:var(--color-text-heading, #111827)">${t('settings.faqTitle')}</h3>
      <div class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-sm:gap-3">
        ${faqItems.map(renderFaqCard).join('')}
      </div>
    </div>
  `;
}

export function initSettingsTaxInfo(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tax-info__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.style.color = 'var(--color-text-muted, #666666)';
        t.style.borderBottomColor = 'transparent';
      });
      tab.style.color = 'var(--color-text-heading, #111827)';
      tab.style.borderBottomColor = 'var(--color-text-heading)';
      const target = tab.dataset.tab;
      document.getElementById('tax-tab-vergi')!.style.display = target === 'vergi' ? '' : 'none';
      document.getElementById('tax-tab-gumruk')!.style.display = target === 'gumruk' ? '' : 'none';
    });
  });
}
