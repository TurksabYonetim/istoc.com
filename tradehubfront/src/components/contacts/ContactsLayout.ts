/**
 * ContactsLayout Component
 * "Kişilerim" page — 2-panel: contact list (left) + contact detail (right).
 * Alibaba-style with search, sort dropdown, and empty states.
 */

import { t } from '../../i18n';

export function ContactsLayout(): string {
  return `
    <div class="flex flex-col min-h-[calc(100vh-80px)]">
      <!-- Info Banner -->
      <div class="flex items-center gap-2 px-5 py-2.5 bg-(--color-surface,#ffffff) border-b border-(--color-border-light,#f0f0f0) rounded-t-lg" id="contacts-banner">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="#2563EB" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path stroke-linecap="round" d="M12 16v-4m0-4h.01"/>
        </svg>
        <span class="text-[13px] text-(--color-text-body,#333333)">
          ${t('contacts.helpBanner')}
          <a href="#feedback" class="text-[#2563EB] no-underline ml-1 hover:underline">${t('contacts.clickHere')}</a>
        </span>
      </div>

      <!-- Panels -->
      <div class="flex flex-1 bg-(--color-surface,#ffffff) rounded-b-lg overflow-hidden max-md:flex-col">
        <!-- Left: Contact List -->
        <aside class="w-[300px] max-md:w-full shrink-0 border-r max-md:border-r-0 max-md:border-b border-(--color-border-light,#f0f0f0) flex flex-col p-4">
          <!-- Header -->
          <div class="mb-3">
            <button class="inline-flex items-center gap-1.5 text-sm font-normal text-(--color-text-heading,#111827) bg-transparent border-none cursor-pointer p-0 hover:text-(--color-cta-primary,#333333)">
              ${t('contacts.allContacts')}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="flex items-center border border-(--color-border-medium,#d1d5db) rounded mb-3 overflow-hidden">
            <input type="text" class="contacts-list__search-input flex-1 h-8 px-2.5 text-[13px] text-(--color-text-body,#333333) border-none outline-none bg-(--color-surface,#ffffff) placeholder:text-(--color-text-placeholder,#999999) focus:shadow-[inset_0_0_0_1px_var(--color-cta-primary,#cc9900)]" placeholder="${t('contacts.searchPlaceholder')}" />
            <button class="flex items-center justify-center w-8 h-8 border-none border-l border-l-(--color-border-medium,#d1d5db) bg-(--color-surface-muted,#fafafa) text-(--color-text-muted,#666666) cursor-pointer hover:bg-(--color-border-light) hover:text-(--color-text-heading,#111827)" aria-label="${t('inquiries.searchPlaceholder')}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          <!-- Sort -->
          <div class="mb-6">
            <button class="inline-flex items-center gap-1 text-[13px] text-(--color-text-muted,#666666) bg-transparent border-none cursor-pointer p-0 hover:text-(--color-text-heading,#111827)">
              ${t('contacts.sortByTime')}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- Empty State -->
          <div class="flex flex-col items-center gap-2 py-10">
            <svg class="w-10 h-10 text-(--color-border-medium)" fill="none" stroke="#999" stroke-width="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path stroke-linecap="round" d="M12 16v-4m0-4h.01"/>
            </svg>
            <span class="text-[13px] text-(--color-text-placeholder,#999999)">${t('contacts.noResults')}</span>
          </div>
        </aside>

        <!-- Right: Contact Detail -->
        <div class="flex-1 flex items-center justify-center relative bg-(--color-surface-muted,#fafafa) min-h-[500px] max-md:min-h-[300px]">
          <div class="flex items-center gap-6 max-md:flex-col max-md:text-center">
            <!-- Illustration: person at server/file cabinet -->
            <div class="w-[180px] h-[140px] shrink-0">
              <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
                <!-- Server/Cabinet -->
                <rect x="30" y="20" width="60" height="100" rx="4" fill="#E8EDF3" stroke="#C5CED8" stroke-width="1"/>
                <rect x="35" y="28" width="50" height="14" rx="2" fill="#D1D9E3"/>
                <rect x="35" y="48" width="50" height="14" rx="2" fill="#D1D9E3"/>
                <rect x="35" y="68" width="50" height="14" rx="2" fill="#D1D9E3"/>
                <rect x="35" y="88" width="50" height="14" rx="2" fill="#D1D9E3"/>
                <circle cx="42" cy="35" r="2" fill="#93A3B5"/>
                <circle cx="42" cy="55" r="2" fill="#93A3B5"/>
                <circle cx="42" cy="75" r="2" fill="#93A3B5"/>
                <circle cx="42" cy="95" r="2" fill="#93A3B5"/>
                <!-- Person -->
                <circle cx="115" cy="42" r="10" fill="#FBBF24"/>
                <rect x="107" y="55" width="16" height="30" rx="4" fill="#1E3A5F"/>
                <rect x="103" y="58" width="8" height="22" rx="3" fill="#1E3A5F"/>
                <rect x="119" y="58" width="12" height="4" rx="2" fill="#D4A574"/>
                <rect x="107" y="85" width="7" height="18" rx="3" fill="#1E3A5F"/>
                <rect x="116" y="85" width="7" height="18" rx="3" fill="#1E3A5F"/>
                <!-- Spray/water effect -->
                <path d="M131 62 Q145 55 140 70 Q135 80 148 75" stroke="#BFD4E8" stroke-width="1" fill="none" opacity="0.6"/>
                <path d="M131 65 Q142 60 138 73 Q134 82 145 78" stroke="#BFD4E8" stroke-width="1" fill="none" opacity="0.4"/>
                <!-- Floor shadow -->
                <ellipse cx="100" cy="110" rx="50" ry="6" fill="#E8EDF3" opacity="0.5"/>
              </svg>
            </div>
            <p class="text-sm text-(--color-text-muted,#666666) max-w-[260px]">${t('contacts.notFoundMsg')}</p>
          </div>

          <!-- Top-right compose button -->
          <button class="absolute top-4 right-4 flex items-center justify-center w-10 h-10 border-none bg-(--color-border-light) rounded-md text-(--color-text-muted,#666666) cursor-pointer transition-[background,color] duration-150 hover:bg-[#e5e7eb] hover:text-(--color-text-heading,#111827)" aria-label="${t('contacts.newMessage')}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initContactsLayout(): void {
  /* Banner dismiss (optional) */
  const banner = document.getElementById('contacts-banner');
  if (banner) {
    banner.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) return;
    });
  }
}
