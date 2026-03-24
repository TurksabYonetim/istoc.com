/**
 * InboxPanel Component (Alpine.js)
 * Left panel: search bar, "Gelen Kutusu" heading, category tabs with real filtering.
 */

import { t } from '../../i18n';

export function InboxPanel(): string {
  return `
    <aside class="w-[240px] max-2xl:w-full flex-shrink-0 border-r border-(--color-border-light,#f0f0f0) max-2xl:border-r-0 max-2xl:border-b flex flex-col bg-(--color-surface,#ffffff)"
           :class="{ 'max-2xl:hidden': selectedConversation }">
      <!-- Search -->
      <div class="relative px-4 pt-4 pb-3 max-sm:px-3">
        <svg class="absolute left-7 max-sm:left-6 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-(--color-text-placeholder,#999999) pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text"
               x-model.debounce.300ms="searchQuery"
               class="w-full h-9 pl-9 pr-3 border border-(--color-border-default,#e5e5e5) rounded-full text-[13px] text-(--color-text-body,#333333) bg-(--color-surface-muted,#fafafa) outline-none transition-[border-color] duration-150 placeholder:text-(--color-text-placeholder,#999999) focus:border-(--color-cta-primary,#cc9900) focus:bg-(--color-surface,#ffffff)"
               placeholder="${t('common.search')}" />
        <!-- Clear -->
        <button x-show="searchQuery.length > 0"
                x-transition
                @click="searchQuery = ''"
                class="absolute right-7 max-sm:right-6 top-1/2 -translate-y-1/2 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 cursor-pointer border-none"
                aria-label="${t('common.clear')}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Heading -->
      <h2 class="text-[15px] font-bold text-(--color-text-heading,#111827) px-4 max-sm:px-3 pb-3" data-i18n="messages.inbox">${t('messages.inbox')}</h2>

      <!-- Category Tabs -->
      <nav class="flex flex-col max-2xl:flex-row max-2xl:overflow-x-auto gap-0.5 px-2" aria-label="${t('messages.categories')}">
        <template x-for="cat in categories" :key="cat.id">
          <button @click="setCategory(cat.id)"
                  class="flex items-center gap-2 px-3 py-2 border-none bg-transparent rounded-md text-[13px] text-(--color-text-muted,#666666) cursor-pointer transition-[background,color] duration-150 hover:bg-(--color-surface-raised,#f5f5f5) max-2xl:flex-shrink-0 max-2xl:whitespace-nowrap"
                  :class="activeCategory === cat.id ? 'msg-inbox__cat--active' : ''"
            <!-- Chat icon -->
            <template x-if="cat.icon === 'chat'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </template>
            <!-- Eye icon -->
            <template x-if="cat.icon === 'eye'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
            <span x-text="cat.label"></span>
            <span x-show="cat.id === 'unread'"
                  x-text="getUnreadTotal()"
                  class="ml-auto text-xs text-(--color-text-placeholder,#999999) font-normal"></span>
          </button>
        </template>
      </nav>

      <!-- Bottom toolbar (desktop only) -->
      <div class="mt-auto flex items-center gap-2 px-4 py-3 border-t border-(--color-border-light,#f0f0f0) max-2xl:hidden">
        <span class="text-xs text-(--color-text-placeholder,#999999)">
          <span x-text="getFilteredConversations().length"></span> <span data-i18n="messages.conversations">${t('messages.conversations')}</span>
        </span>
      </div>
    </aside>
  `;
}
