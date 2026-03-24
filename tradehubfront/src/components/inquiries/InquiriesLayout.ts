/**
 * InquiriesLayout Component
 * "Ürün sorularım ve Fiyat Teklifi Taleplerim (RFQ)" page.
 * Tabs + action bar + content area (empty state).
 */

import { t } from '../../i18n';

export interface InquiriesTab {
  id: string;
  label: string;
}

function getTabs(): InquiriesTab[] {
  return [
    { id: 'inquiries', label: t('inquiries.myInquiries') },
    { id: 'rfq', label: t('inquiries.rfqRequests') },
  ];
}

function renderEmptyState(): string {
  return `
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="w-[140px] h-[120px]">
        <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
          <!-- Folder -->
          <rect x="20" y="30" width="80" height="60" rx="4" fill="#FFECD2"/>
          <path d="M20 38c0-4.4 3.6-8 8-8h20l8 8h36c4.4 0 8 3.6 8 8v44c0 4.4-3.6 8-8 8H28c-4.4 0-8-3.6-8-8V38z" fill="#FFD8A8" stroke="#F7A84B" stroke-width="1"/>
          <rect x="30" y="50" width="60" height="4" rx="2" fill="#F7A84B" opacity="0.3"/>
          <rect x="30" y="60" width="45" height="4" rx="2" fill="#F7A84B" opacity="0.3"/>
          <rect x="30" y="70" width="50" height="4" rx="2" fill="#F7A84B" opacity="0.3"/>
          <!-- Person -->
          <circle cx="110" cy="50" r="8" fill="#FFD8A8"/>
          <rect x="104" y="60" width="12" height="20" rx="4" fill="#F7A84B" opacity="0.6"/>
          <rect x="101" y="62" width="6" height="14" rx="3" fill="#F7A84B" opacity="0.4"/>
          <rect x="113" y="62" width="6" height="14" rx="3" fill="#F7A84B" opacity="0.4"/>
          <rect x="104" y="80" width="5" height="12" rx="2" fill="#F7A84B" opacity="0.5"/>
          <rect x="111" y="80" width="5" height="12" rx="2" fill="#F7A84B" opacity="0.5"/>
        </svg>
      </div>
      <p class="text-sm text-(--color-text-muted,#666666)">${t('inquiries.emptyState')}</p>
    </div>
  `;
}

export function InquiriesLayout(): string {
  const TABS = getTabs();
  return `
    <div class="bg-(--color-surface,#ffffff) rounded-lg min-h-[calc(100vh-80px)] flex flex-col">
      <!-- Tabs -->
      <div class="flex border-b border-(--color-border-default,#e5e5e5) overflow-x-auto">
        ${TABS.map((tab, i) => `
          <button class="inq-tabs__tab px-6 max-md:px-3 py-3.5 max-md:py-2.5 text-[13px] max-md:text-xs font-normal text-(--color-text-muted,#666666) bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 whitespace-nowrap hover:text-(--color-text-heading,#111827) ${i === 0 ? 'inq-tabs__tab--active !text-(--color-text-heading,#111827) !font-semibold !border-b-(--color-text-heading)' : ''}" data-tab="${tab.id}">
            ${tab.label}
          </button>
        `).join('')}
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between px-5 max-md:px-3 py-3 max-md:py-2 border-b border-(--color-border-light,#f0f0f0) gap-3 max-md:gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center gap-1 px-3 max-md:px-2 py-1.5 text-[13px] max-md:text-xs text-(--color-text-muted,#666666) border border-(--color-border-medium,#d1d5db) rounded cursor-pointer bg-(--color-surface,#ffffff) transition-[border-color] duration-150 hover:border-(--color-text-placeholder)">
            <span>${t('inquiries.moveTo')}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <button class="px-4 max-md:px-2.5 py-1.5 text-[13px] max-md:text-xs text-(--color-cta-primary,#333333) border border-(--color-cta-primary,#333333) rounded bg-transparent cursor-pointer transition-[background,color] duration-150 hover:bg-(--color-secondary-50,#f5f5f5)">${t('inquiries.deleteBtn')}</button>
        </div>
        <div class="flex items-center gap-3 max-md:gap-2 flex-wrap">
          <label class="inline-flex items-center gap-1.5 text-[13px] max-md:text-xs text-(--color-text-muted,#666666) cursor-pointer">
            <input type="checkbox" class="w-3.5 h-3.5 accent-(--color-cta-primary,#cc9900)" />
            <span>${t('inquiries.newReply')}</span>
          </label>
          <div class="inline-flex items-center gap-1 px-3.5 max-md:px-2.5 py-1.5 text-[13px] max-md:text-xs text-(--color-text-heading,#111827) border border-(--color-border-medium,#d1d5db) rounded-full cursor-pointer bg-(--color-surface,#ffffff) transition-[border-color] duration-150 hover:border-(--color-text-placeholder)">
            <span>${t('inquiries.allRequests')}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <div class="inq-actions__search inline-flex items-center border border-(--color-border-medium,#d1d5db) rounded overflow-hidden">
            <input type="text" placeholder="${t('inquiries.searchPlaceholder')}" class="inq-actions__search-input w-40 max-lg:w-[120px] max-md:w-[80px] h-8 max-md:h-7 px-2.5 max-md:px-2 text-[13px] max-md:text-xs text-(--color-text-body,#333333) border-none outline-none bg-(--color-surface,#ffffff) placeholder:text-(--color-text-placeholder,#999999) focus:shadow-[inset_0_0_0_1px_var(--color-cta-primary,#cc9900)]" />
            <button class="flex items-center justify-center w-8 max-md:w-7 h-8 max-md:h-7 border-none border-l border-l-(--color-border-medium,#d1d5db) bg-(--color-surface-muted,#fafafa) text-(--color-text-muted,#666666) cursor-pointer transition-[background,color] duration-150 hover:bg-(--color-border-light) hover:text-(--color-text-heading,#111827)" aria-label="${t('inquiries.searchPlaceholder')}">
              <svg class="w-4 h-4 max-md:w-3.5 max-md:h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 flex items-center justify-center min-h-[400px]" id="inq-content">
        ${renderEmptyState()}
      </div>
    </div>
  `;
}

export function initInquiriesLayout(): void {
  /* Tab switching */
  const tabs = document.querySelectorAll<HTMLButtonElement>('.inq-tabs__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('inq-tabs__tab--active', '!text-(--color-text-heading,#111827)', '!font-semibold', '!border-b-(--color-text-heading)');
      });
      tab.classList.add('inq-tabs__tab--active', '!text-(--color-text-heading,#111827)', '!font-semibold', '!border-b-(--color-text-heading)');
    });
  });
}
