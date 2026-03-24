/**
 * MessageList Component (Alpine.js)
 * Center panel: header with filter dropdown + reactive conversation list.
 */

import { t } from '../../i18n';

/* TradeHub logo SVG for platform messages */
const TRADEHUB_AVATAR = `<svg class="w-full h-full" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#FFF2E8"/>
  <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="600" fill="#E67A00">T</text>
</svg>`;

export function MessageList(): string {
  return `
    <div class="w-[360px] max-2xl:w-full max-2xl:max-h-none flex-shrink-0 border-r border-(--color-border-light,#f0f0f0) max-2xl:border-r-0 flex flex-col bg-(--color-surface,#ffffff)"
         :class="{ 'max-2xl:hidden': selectedConversation }">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 max-sm:px-3 border-b border-(--color-border-light,#f0f0f0)">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-bold text-(--color-text-heading,#111827)" x-text="activeCategory === 'all' ? '${t('common.all')}' : '${t('messages.unread')}'"></h3>
          <span class="text-xs text-(--color-text-placeholder,#999999) bg-(--color-surface-muted,#fafafa) px-1.5 py-0.5 rounded-full" x-text="getFilteredConversations().length"></span>
        </div>

        <!-- Filter dropdown -->
        <div class="relative">
          <button @click="toggleFilter()"
                  class="flex items-center justify-center w-7 h-7 border-none bg-transparent cursor-pointer rounded transition-colors duration-150"
                  :class="filterType !== 'all' ? 'text-(--color-cta-primary,#cc9900)' : 'text-(--color-text-placeholder,#999999) hover:text-(--color-text-body,#333333)'"
                  aria-label="${t('messages.filter')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </button>

          <!-- Filter dropdown menu -->
          <div x-show="filterOpen"
               x-transition:enter="transition ease-out duration-150"
               x-transition:enter-start="opacity-0 -translate-y-1"
               x-transition:enter-end="opacity-100 translate-y-0"
               x-transition:leave="transition ease-in duration-100"
               x-transition:leave-start="opacity-100"
               x-transition:leave-end="opacity-0"
               @click.away="filterOpen = false"
               class="absolute right-0 top-full mt-1 w-40 bg-(--color-surface,#ffffff) rounded-lg shadow-lg border border-(--color-border-light,#f0f0f0) py-1 z-20">
            <button @click="setFilter('all')"
                    class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left border-none bg-transparent cursor-pointer hover:bg-(--color-surface-muted,#fafafa) transition-colors"
                    :class="filterType === 'all' ? 'text-(--color-cta-primary,#cc9900) font-semibold' : 'text-(--color-text-body,#333333)'">
              <svg class="w-3.5 h-3.5" :class="filterType === 'all' ? 'opacity-100' : 'opacity-0'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ${t('common.all')}
            </button>
            <button @click="setFilter('unread')"
                    class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left border-none bg-transparent cursor-pointer hover:bg-(--color-surface-muted,#fafafa) transition-colors"
                    :class="filterType === 'unread' ? 'text-(--color-cta-primary,#cc9900) font-semibold' : 'text-(--color-text-body,#333333)'">
              <svg class="w-3.5 h-3.5" :class="filterType === 'unread' ? 'opacity-100' : 'opacity-0'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ${t('messages.unread')}
            </button>
            <button @click="setFilter('read')"
                    class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left border-none bg-transparent cursor-pointer hover:bg-(--color-surface-muted,#fafafa) transition-colors"
                    :class="filterType === 'read' ? 'text-(--color-cta-primary,#cc9900) font-semibold' : 'text-(--color-text-body,#333333)'">
              <svg class="w-3.5 h-3.5" :class="filterType === 'read' ? 'opacity-100' : 'opacity-0'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ${t('messages.read')}
            </button>
          </div>
        </div>
      </div>

      <!-- Active filter badge -->
      <div x-show="filterType !== 'all' || searchQuery.length > 0"
           x-transition
           class="flex items-center gap-2 px-5 max-sm:px-3 py-2 border-b border-(--color-border-light,#f0f0f0) bg-(--color-surface-muted,#fafafa)">
        <template x-if="filterType !== 'all'">
          <span class="inline-flex items-center gap-1 text-xs bg-(--color-cta-primary,#cc9900)/10 text-(--color-cta-primary,#cc9900) px-2 py-0.5 rounded-full">
            <span x-text="filterType === 'unread' ? '${t('messages.unread')}' : '${t('messages.read')}'"></span>
            <button @click="setFilter('all')" class="border-none bg-transparent cursor-pointer text-(--color-cta-primary,#cc9900) p-0 leading-none">&times;</button>
          </span>
        </template>
        <template x-if="searchQuery.length > 0">
          <span class="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            "<span x-text="searchQuery"></span>"
            <button @click="searchQuery = ''" class="border-none bg-transparent cursor-pointer text-blue-600 p-0 leading-none">&times;</button>
          </span>
        </template>
      </div>

      <!-- Conversations -->
      <div class="flex-1 overflow-y-auto">
        <template x-for="conv in getFilteredConversations()" :key="conv.id">
          <button @click="selectConversation(conv)"
                  class="w-full flex items-start gap-3 px-5 py-3.5 max-sm:px-3 max-sm:py-3 text-left border-none border-b border-(--color-surface-raised,#f5f5f5) cursor-pointer transition-[background] duration-150 hover:bg-(--color-surface-muted,#fafafa) bg-transparent"
                  :class="selectedConversation?.id === conv.id ? 'bg-(--color-surface-raised,#f5f5f5)!' : ''">
            <!-- Avatar -->
            <div class="relative w-10 h-10 flex-shrink-0 rounded-full overflow-visible">
              <template x-if="conv.avatar">
                <img :src="conv.avatar" :alt="conv.name" class="w-10 h-10 rounded-full object-cover" loading="lazy" />
              </template>
              <template x-if="!conv.avatar">
                ${TRADEHUB_AVATAR}
              </template>
              <template x-if="conv.unreadCount > 0">
                <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[11px] font-semibold text-(--color-surface) bg-red-500 rounded-full border-2 border-(--color-surface) leading-none" x-text="conv.unreadCount"></span>
              </template>
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between gap-2 mb-0.5">
                <span class="text-sm font-semibold text-(--color-text-heading,#111827) whitespace-nowrap overflow-hidden text-ellipsis" x-text="conv.name"></span>
                <span class="text-xs text-(--color-text-placeholder,#999999) whitespace-nowrap flex-shrink-0" x-text="conv.date"></span>
              </div>
              <p x-show="conv.company" class="text-[13px] text-(--color-text-placeholder,#999999) whitespace-nowrap overflow-hidden text-ellipsis mb-0.5" x-text="conv.company"></p>
              <p class="text-[13px] text-(--color-text-placeholder,#999999) whitespace-nowrap overflow-hidden text-ellipsis" x-text="conv.preview"></p>
            </div>
          </button>
        </template>

        <!-- Empty state -->
        <div x-show="getFilteredConversations().length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
          <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-sm text-(--color-text-placeholder,#999999)" data-i18n="messages.noResults">${t('messages.noResults')}</p>
          <button @click="searchQuery = ''; filterType = 'all'"
                  class="mt-2 text-xs text-(--color-cta-primary,#cc9900) border-none bg-transparent cursor-pointer hover:underline">
            <span data-i18n="messages.clearFilters">${t('messages.clearFilters')}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
