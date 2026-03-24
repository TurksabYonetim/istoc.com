/**
 * TopRankingCategoryTabs Component
 * Horizontal scrollable category tab bar with arrow navigation
 * Mobile: chevron opens a bottom sheet for category selection
 * Desktop: arrow buttons for scroll navigation
 */

import { t } from '../../i18n';
import { getRankingTabs } from '../../data/mockTopRanking';

export function TopRankingCategoryTabs(): string {
  const tabs = getRankingTabs();

  const tabsHtml = tabs.map(tab => `
    <button
      type="button"
      class="top-ranking-tab flex-shrink-0 whitespace-nowrap px-[10px] sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm transition-colors border-b-[3px] border-transparent"
      :class="activeTab === '${tab.id}'
        ? '!border-secondary-800 !text-text-primary font-semibold'
        : 'text-text-tertiary hover:text-text-primary'"
      @click="setTab('${tab.id}')"
      data-i18n="${tab.labelKey}"
    >${t(tab.labelKey)}</button>
  `).join('');

  // Bottom sheet tab list items
  const sheetItemsHtml = tabs.map(tab => `
    <button
      type="button"
      class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
      @click="setTab('${tab.id}'); showTabSheet = false"
    >
      <span
        class="flex-1 text-[15px]"
        :class="activeTab === '${tab.id}' ? 'font-semibold text-gray-900' : 'text-gray-600'"
        data-i18n="${tab.labelKey}"
      >${t(tab.labelKey)}</span>
      <span
        class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="activeTab === '${tab.id}' ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
      >
        <span
          class="w-2 h-2 rounded-full transition-colors"
          :class="activeTab === '${tab.id}' ? 'bg-white' : 'bg-transparent'"
        ></span>
      </span>
    </button>
  `).join('');

  return `
    <div class="relative flex items-center" x-ref="tabsContainer">
      <!-- Left arrow (desktop only) -->
      <button
        type="button"
        class="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-surface shadow border border-border-default text-text-tertiary hover:text-text-primary transition-all"
        x-show="canScrollLeft"
        x-transition
        @click="scrollTabs('left')"
        aria-label="Scroll left"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <!-- Tabs container -->
      <div
        class="flex-1 flex overflow-x-auto scrollbar-hide border-b border-border-default"
        x-ref="tabsScroll"
        @scroll="updateScrollState()"
        style="scroll-behavior: smooth;"
      >
        ${tabsHtml}
      </div>

      <!-- Mobile chevron -> opens bottom sheet -->
      <button
        type="button"
        class="lg:hidden flex-shrink-0 flex items-center justify-center w-9 self-stretch border-b border-border-default bg-surface text-text-tertiary"
        @click="showTabSheet = !showTabSheet"
        aria-label="All categories"
      >
        <svg
          class="w-4 h-4 transition-transform duration-200"
          :class="showTabSheet ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      <!-- Right arrow (desktop only) -->
      <button
        type="button"
        class="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-surface shadow border border-border-default text-text-tertiary hover:text-text-primary transition-all"
        x-show="canScrollRight"
        x-transition
        @click="scrollTabs('right')"
        aria-label="Scroll right"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Tab Bottom Sheet -->
    <!-- Backdrop -->
    <div
      class="lg:hidden fixed inset-0 z-[99] bg-black/50 transition-opacity duration-300"
      :class="showTabSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click="showTabSheet = false"
      x-effect="if(showTabSheet) document.body.style.overflow = 'hidden'; else if(!showRegionSheet && !showCategorySheet) document.body.style.overflow = ''"
    ></div>

    <!-- Sheet Panel -->
    <div
      class="lg:hidden fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out"
      :class="showTabSheet ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Drag Handle -->
        <div class="flex-shrink-0 flex items-center justify-center pt-3 pb-2">
          <div class="w-9 h-1 rounded-full bg-gray-300"></div>
        </div>

        <!-- Tab List -->
        <div class="overflow-y-auto flex-1 pb-6 overscroll-contain">
          ${sheetItemsHtml}
        </div>
      </div>
    </div>
  `;
}

export function initRankingCategoryTabs(): void {
  setTimeout(() => {
    const scrollEl = document.querySelector<HTMLElement>('[x-ref="tabsScroll"]');
    if (scrollEl) {
      scrollEl.dispatchEvent(new Event('scroll'));
    }
  }, 100);
}
