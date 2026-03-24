/**
 * TopDealsCategoryTabs Component
 * Horizontal scrollable category tab bar with arrow navigation
 * Mobile: chevron opens a bottom sheet for category selection
 * Desktop: arrow buttons for scroll navigation
 */

import { t } from '../../i18n';
import { getTopDealCategories } from '../../data/mockTopDeals';

export function TopDealsCategoryTabs(): string {
  const categories = getTopDealCategories();

  const tabsHtml = categories.map(cat => `
    <button
      type="button"
      class="top-deals-tab flex-shrink-0 whitespace-nowrap px-4 py-3 text-sm transition-colors border-b-[3px] border-transparent"
      :class="activeCategory === '${cat.id}'
        ? '!border-[#222] !text-[#222] font-semibold'
        : 'text-[#666] hover:text-[#222]'"
      @click="setCategory('${cat.id}')"
      data-i18n="${cat.labelKey}"
    >${t(cat.labelKey)}</button>
  `).join('');

  // Bottom sheet category list items
  const sheetItemsHtml = categories.map(cat => `
    <button
      type="button"
      class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
      @click="setCategory('${cat.id}'); showCategorySheet = false"
    >
      <span
        class="flex-1 text-[15px]"
        :class="activeCategory === '${cat.id}' ? 'font-semibold text-gray-900' : 'text-gray-600'"
        data-i18n="${cat.labelKey}"
      >${t(cat.labelKey)}</span>
      <span
        class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="activeCategory === '${cat.id}' ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
      >
        <span
          class="w-2 h-2 rounded-full transition-colors"
          :class="activeCategory === '${cat.id}' ? 'bg-white' : 'bg-transparent'"
        ></span>
      </span>
    </button>
  `).join('');

  return `
    <div class="relative flex items-center" x-ref="tabsContainer">
      <!-- Left arrow (desktop only) -->
      <button
        type="button"
        class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white shadow border border-gray-200 text-gray-500 hover:text-gray-900 transition-all"
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
        class="flex-1 flex overflow-x-auto scrollbar-hide border-b border-gray-200"
        x-ref="tabsScroll"
        @scroll="updateScrollState()"
        style="scroll-behavior: smooth;"
      >
        ${tabsHtml}
      </div>

      <!-- Mobile chevron → opens bottom sheet -->
      <button
        type="button"
        class="md:hidden flex-shrink-0 flex items-center justify-center w-9 self-stretch border-b border-gray-200 bg-white text-gray-500"
        @click="showCategorySheet = !showCategorySheet"
        aria-label="All categories"
      >
        <svg
          class="w-4 h-4 transition-transform duration-200"
          :class="showCategorySheet ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      <!-- Right arrow (desktop only) -->
      <button
        type="button"
        class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white shadow border border-gray-200 text-gray-500 hover:text-gray-900 transition-all"
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

    <!-- Mobile Category Bottom Sheet -->
    <!-- Backdrop -->
    <div
      class="md:hidden fixed inset-0 z-[99] bg-black/50 transition-opacity duration-300"
      :class="showCategorySheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click="showCategorySheet = false"
      x-effect="document.body.style.overflow = showCategorySheet ? 'hidden' : ''"
    ></div>

    <!-- Sheet Panel -->
    <div
      class="md:hidden fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out"
      :class="showCategorySheet ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Drag Handle -->
        <div class="flex-shrink-0 flex items-center justify-center pt-3 pb-2">
          <div class="w-9 h-1 rounded-full bg-gray-300"></div>
        </div>

        <!-- Category List -->
        <div class="overflow-y-auto flex-1 pb-6 overscroll-contain">
          ${sheetItemsHtml}
        </div>
      </div>
    </div>
  `;
}

export function initCategoryTabs(): void {
  setTimeout(() => {
    const scrollEl = document.querySelector<HTMLElement>('[x-ref="tabsScroll"]');
    if (scrollEl) {
      scrollEl.dispatchEvent(new Event('scroll'));
    }
  }, 100);
}
