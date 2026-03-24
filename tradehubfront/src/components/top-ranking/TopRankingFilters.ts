/**
 * TopRankingFilters Component
 * Region + Category dropdown filters (inside hero)
 * Desktop: dropdown popovers
 * Mobile: bottom sheets with Alpine.js state
 * Buttons: bg surface-raised (#f5f5f5), rounded-full, py-3 px-6
 */

import { t } from '../../i18n';
import { getRegionOptions, getRankingMainCategories } from '../../data/mockTopRanking';

export function TopRankingFilters(): string {
  const regions = getRegionOptions();
  const mainCategories = getRankingMainCategories();

  // ── Desktop dropdown: region radios ──
  const regionRadios = regions.map(r => `
    <label
      class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface-raised rounded-lg transition-colors"
      @click="pendingRegion = '${r.id}'"
    >
      <input
        type="radio"
        name="region"
        :checked="pendingRegion === '${r.id}'"
        class="w-4 h-4 text-primary-500 border-border-default focus:ring-primary-400"
      />
      <span class="text-sm text-text-secondary" data-i18n="${r.labelKey}">${t(r.labelKey)}</span>
    </label>
  `).join('');

  // ── Desktop dropdown: category level-1 items ──
  const categoryLevel1Items = mainCategories.map(cat => {
    const hasSubCats = cat.subCategories && cat.subCategories.length > 0;
    return `
      <button
        type="button"
        class="flex items-center justify-between w-full px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-raised rounded-lg transition-colors text-left"
        @click="${hasSubCats ? `openCategoryLevel2('${cat.id}')` : `selectedMainCategory = '${cat.id}'; pendingSubCategory = null; applyCategoryFilter()`}"
      >
        <span data-i18n="${cat.nameKey}">${t(cat.nameKey)}</span>
        ${hasSubCats ? `<svg class="w-4 h-4 text-text-tertiary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>` : ''}
      </button>
    `;
  }).join('');

  // ── Desktop dropdown: category level-2 panels ──
  const categoryLevel2Panels = mainCategories
    .filter(cat => cat.subCategories && cat.subCategories.length > 0)
    .map(cat => {
      const subRadios = cat.subCategories!.map(sub => `
        <label
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface-raised rounded-lg transition-colors"
          @click="pendingSubCategory = '${sub.id}'"
        >
          <input
            type="radio"
            name="subcategory"
            :checked="pendingSubCategory === '${sub.id}'"
            class="w-4 h-4 text-primary-500 border-border-default focus:ring-primary-400"
          />
          <span class="text-sm text-text-secondary" data-i18n="${sub.nameKey}">${t(sub.nameKey)}</span>
        </label>
      `).join('');

      return `
        <div x-show="categoryDropdownLevel === 2 && selectedMainCategory === '${cat.id}'" x-cloak>
          <label
            class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface-raised rounded-lg transition-colors"
            @click="pendingSubCategory = null"
          >
            <input
              type="radio"
              name="subcategory"
              :checked="pendingSubCategory === null"
              class="w-4 h-4 text-primary-500 border-border-default focus:ring-primary-400"
            />
            <span class="text-sm text-text-secondary font-medium">${t('topRankingPage.allCategories')} - ${t(cat.nameKey)}</span>
          </label>
          ${subRadios}
          <div class="flex gap-2 pt-3 mt-2 border-t border-border-default px-4 pb-1">
            <button
              type="button"
              class="flex-1 px-4 py-2 text-sm font-medium text-text-secondary bg-surface-raised rounded-lg hover:bg-secondary-200 transition-colors"
              @click="goBackToLevel1()"
              data-i18n="topRankingPage.back"
            >${t('topRankingPage.back')}</button>
            <button
              type="button"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
              @click="applyCategoryFilter()"
              data-i18n="topRankingPage.apply"
            >${t('topRankingPage.apply')}</button>
          </div>
        </div>
      `;
    }).join('');

  // ── Mobile bottom sheet: region radios ──
  const mobileRegionRadios = regions.map(r => `
    <button
      type="button"
      class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
      @click="pendingRegion = '${r.id}'"
    >
      <span
        class="flex-1 text-[15px]"
        :class="pendingRegion === '${r.id}' ? 'font-semibold text-gray-900' : 'text-gray-600'"
        data-i18n="${r.labelKey}"
      >${t(r.labelKey)}</span>
      <span
        class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="pendingRegion === '${r.id}' ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
      >
        <span
          class="w-2 h-2 rounded-full transition-colors"
          :class="pendingRegion === '${r.id}' ? 'bg-white' : 'bg-transparent'"
        ></span>
      </span>
    </button>
  `).join('');

  // ── Mobile bottom sheet: category level-1 items ──
  const mobileCategoryItems = mainCategories.map(cat => {
    const hasSubCats = cat.subCategories && cat.subCategories.length > 0;
    return `
      <button
        type="button"
        class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
        @click="${hasSubCats ? `openCategoryLevel2('${cat.id}')` : `selectedMainCategory = '${cat.id}'; pendingSubCategory = null; applyCategoryFilter(); showCategorySheet = false`}"
      >
        <span
          class="flex-1 text-[15px]"
          :class="selectedMainCategory === '${cat.id}' ? 'font-semibold text-gray-900' : 'text-gray-600'"
          data-i18n="${cat.nameKey}"
        >${t(cat.nameKey)}</span>
        ${hasSubCats ? `<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>` : ''}
      </button>
    `;
  }).join('');

  // ── Mobile bottom sheet: category level-2 panels ──
  const mobileCategoryLevel2Panels = mainCategories
    .filter(cat => cat.subCategories && cat.subCategories.length > 0)
    .map(cat => {
      const subItems = cat.subCategories!.map(sub => `
        <button
          type="button"
          class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
          @click="pendingSubCategory = '${sub.id}'"
        >
          <span
            class="flex-1 text-[15px]"
            :class="pendingSubCategory === '${sub.id}' ? 'font-semibold text-gray-900' : 'text-gray-600'"
            data-i18n="${sub.nameKey}"
          >${t(sub.nameKey)}</span>
          <span
            class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="pendingSubCategory === '${sub.id}' ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
          >
            <span
              class="w-2 h-2 rounded-full transition-colors"
              :class="pendingSubCategory === '${sub.id}' ? 'bg-white' : 'bg-transparent'"
            ></span>
          </span>
        </button>
      `).join('');

      return `
        <div x-show="categoryDropdownLevel === 2 && selectedMainCategory === '${cat.id}'" x-cloak>
          <!-- "All" option for this category -->
          <button
            type="button"
            class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
            @click="pendingSubCategory = null"
          >
            <span
              class="flex-1 text-[15px]"
              :class="pendingSubCategory === null ? 'font-semibold text-gray-900' : 'text-gray-600'"
            >${t('topRankingPage.allCategories')} - ${t(cat.nameKey)}</span>
            <span
              class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="pendingSubCategory === null ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
            >
              <span
                class="w-2 h-2 rounded-full transition-colors"
                :class="pendingSubCategory === null ? 'bg-white' : 'bg-transparent'"
              ></span>
            </span>
          </button>
          ${subItems}
          <!-- Back + Apply buttons -->
          <div class="flex gap-3 px-5 py-4">
            <button
              type="button"
              class="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              @click="goBackToLevel1()"
              data-i18n="topRankingPage.back"
            >${t('topRankingPage.back')}</button>
            <button
              type="button"
              class="flex-1 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
              @click="applyCategoryFilter(); showCategorySheet = false"
              data-i18n="topRankingPage.apply"
            >${t('topRankingPage.apply')}</button>
          </div>
        </div>
      `;
    }).join('');

  return `
    <div class="flex items-center justify-center gap-2 sm:gap-3 mt-1 lg:mt-5 px-[10px] sm:px-0">
      <!-- Region Dropdown -->
      <div class="relative" @click.outside="regionDropdownOpen = false">
        <button
          type="button"
          class="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-white sm:bg-surface-raised text-[10px] sm:text-sm font-medium text-[#222] hover:bg-secondary-200 transition-colors py-[7px] px-[10px] sm:px-6 sm:py-3"
          @click="if(window.innerWidth >= 1024) { regionDropdownOpen = !regionDropdownOpen; pendingRegion = activeRegion } else { showRegionSheet = true; pendingRegion = activeRegion }"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-secondary-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="mr-[3px] sm:mr-0" x-text="$t('topRankingPage.region' + {global:'Global',us:'US',europe:'Europe'}[activeRegion])">${t('topRankingPage.regionEurope')}</span>
          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-secondary-400 transition-transform flex-shrink-0" :class="regionDropdownOpen && 'rotate-180'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>

        <!-- Desktop dropdown panel -->
        <div
          x-show="regionDropdownOpen"
          x-transition
          x-cloak
          class="hidden lg:block absolute left-0 top-full mt-2 w-64 bg-surface border border-border-default rounded-xl shadow-lg z-30 p-3"
        >
          <div class="space-y-1">
            ${regionRadios}
          </div>
          <div class="pt-3 mt-2 border-t border-border-default">
            <button
              type="button"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
              @click="applyRegion()"
              data-i18n="topRankingPage.apply"
            >${t('topRankingPage.apply')}</button>
          </div>
        </div>
      </div>

      <!-- Category Dropdown -->
      <div class="relative" @click.outside="categoryDropdownOpen = false; categoryDropdownLevel = 1">
        <button
          type="button"
          class="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-white sm:bg-surface-raised text-[10px] sm:text-sm font-medium text-[#222] hover:bg-secondary-200 transition-colors py-[7px] px-[10px] sm:px-6 sm:py-3"
          @click="if(window.innerWidth >= 1024) { categoryDropdownOpen = !categoryDropdownOpen; categoryDropdownLevel = 1 } else { showCategorySheet = true; categoryDropdownLevel = 1 }"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-secondary-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span class="mr-[3px] sm:mr-0" x-text="selectedMainCategory ? $t('topRankingPage.cat' + selectedMainCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')) : $t('topRankingPage.allCategories')">${t('topRankingPage.allCategories')}</span>
          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-secondary-400 transition-transform flex-shrink-0" :class="categoryDropdownOpen && 'rotate-180'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>

        <!-- Desktop dropdown panel -->
        <div
          x-show="categoryDropdownOpen"
          x-transition
          x-cloak
          class="hidden lg:block absolute left-0 top-full mt-2 w-72 bg-surface border border-border-default rounded-xl shadow-lg z-30 p-3"
        >
          <div x-show="categoryDropdownLevel === 1">
            <button
              type="button"
              class="flex items-center w-full px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-raised rounded-lg transition-colors text-left"
              @click="selectedMainCategory = null; pendingSubCategory = null; applyCategoryFilter()"
            >
              <span data-i18n="topRankingPage.allCategories">${t('topRankingPage.allCategories')}</span>
            </button>
            <div class="my-1 border-t border-border-default"></div>
            <div class="space-y-0.5">
              ${categoryLevel1Items}
            </div>
          </div>
          ${categoryLevel2Panels}
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MOBILE BOTTOM SHEETS                           -->
    <!-- ═══════════════════════════════════════════════ -->

    <!-- Region Bottom Sheet — Backdrop -->
    <div
      class="lg:hidden fixed inset-0 z-[99] bg-black/50 transition-opacity duration-300"
      :class="showRegionSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click="showRegionSheet = false"
      x-effect="if(showRegionSheet) document.body.style.overflow = 'hidden'; else if(!showCategorySheet) document.body.style.overflow = ''"
    ></div>

    <!-- Region Bottom Sheet — Panel -->
    <div
      class="lg:hidden fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out"
      :class="showRegionSheet ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Drag handle -->
        <div class="flex-shrink-0 flex items-center justify-center pt-3 pb-2">
          <div class="w-9 h-1 rounded-full bg-gray-300"></div>
        </div>
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-3">
          <h3 class="text-base font-bold text-gray-900">Select ranking scope</h3>
          <button type="button" @click="showRegionSheet = false" class="p-1 text-gray-400 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- Region list -->
        <div class="overflow-y-auto flex-1 overscroll-contain">
          ${mobileRegionRadios}
        </div>
        <!-- Apply button -->
        <div class="p-5 pt-3">
          <button
            type="button"
            class="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-colors"
            @click="applyRegion(); showRegionSheet = false"
            data-i18n="topRankingPage.apply"
          >${t('topRankingPage.apply')}</button>
        </div>
      </div>
    </div>

    <!-- Category Bottom Sheet — Backdrop -->
    <div
      class="lg:hidden fixed inset-0 z-[99] bg-black/50 transition-opacity duration-300"
      :class="showCategorySheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click="showCategorySheet = false"
      x-effect="if(showCategorySheet) document.body.style.overflow = 'hidden'; else if(!showRegionSheet) document.body.style.overflow = ''"
    ></div>

    <!-- Category Bottom Sheet — Panel -->
    <div
      class="lg:hidden fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out"
      :class="showCategorySheet ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Drag handle -->
        <div class="flex-shrink-0 flex items-center justify-center pt-3 pb-2">
          <div class="w-9 h-1 rounded-full bg-gray-300"></div>
        </div>
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-3">
          <h3 class="text-base font-bold text-gray-900">Select category</h3>
          <button type="button" @click="showCategorySheet = false; categoryDropdownLevel = 1" class="p-1 text-gray-400 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- Category list -->
        <div class="overflow-y-auto flex-1 overscroll-contain">
          <!-- Level 1 -->
          <div x-show="categoryDropdownLevel === 1">
            <!-- All categories option -->
            <button
              type="button"
              class="flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 active:bg-gray-50"
              @click="selectedMainCategory = null; pendingSubCategory = null; applyCategoryFilter(); showCategorySheet = false"
            >
              <span
                class="flex-1 text-[15px]"
                :class="!selectedMainCategory ? 'font-semibold text-gray-900' : 'text-gray-600'"
                data-i18n="topRankingPage.allCategories"
              >${t('topRankingPage.allCategories')}</span>
              <span
                class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="!selectedMainCategory ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-transparent'"
              >
                <span
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="!selectedMainCategory ? 'bg-white' : 'bg-transparent'"
                ></span>
              </span>
            </button>
            ${mobileCategoryItems}
          </div>
          <!-- Level 2 -->
          ${mobileCategoryLevel2Panels}
        </div>
      </div>
    </div>
  `;
}
