/**
 * SearchHeader Component
 * Displays search results header with:
 * - Search keyword and total product count
 * - Free shipping banner (when available)
 * - Sorting options dropdown (Alpine.js x-show + @click)
 * - View mode toggle (Alpine.js @click + :class)
 *
 * Uses x-data="searchHeader({...})" registered in alpine.ts.
 * Sort dropdown visibility via x-show="sortOpen".
 * Sort option selection and view mode toggle via @click + $dispatch.
 */

import type { SearchHeaderInfo, SortOption, ViewMode } from '../../types/productListing';

/**
 * Default sort options for product listing
 */
const defaultSortOptions: SortOption[] = [
  { id: 'best-match', label: 'Best Match', value: 'best-match' },
  { id: 'orders', label: 'Orders', value: 'orders' },
  { id: 'newest', label: 'Newest', value: 'newest' },
  { id: 'price-asc', label: 'Price: Low to High', value: 'price-asc' },
  { id: 'price-desc', label: 'Price: High to Low', value: 'price-desc' },
  { id: 'min-order', label: 'Min. Order', value: 'min-order' },
  { id: 'supplier-rating', label: 'Supplier Rating', value: 'supplier-rating' },
];

/**
 * Default search header info for initial render
 */
const defaultSearchHeaderInfo: SearchHeaderInfo = {
  keyword: '',
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  freeShippingAvailable: false,
  sortOptions: defaultSortOptions,
  selectedSort: 'best-match',
};

/**
 * Formats large numbers with commas (e.g., 48562 -> "48,562")
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Renders the free shipping banner
 */
function renderFreeShippingBanner(): string {
  return `
    <div class="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <svg class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.029-.504 1.029-1.125a3.75 3.75 0 0 0-3.75-3.75H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
      <span class="text-sm font-medium text-green-700 dark:text-green-300">
        Free shipping available
      </span>
    </div>
  `;
}

/**
 * Renders the sorting dropdown
 * Uses Alpine.js directives:
 * - @click on toggle button for sortOpen state
 * - x-show on dropdown for visibility
 * - @click.outside to close dropdown
 * - @click on options to call selectSort() + $dispatch('sort-change')
 * - :class on options for reactive active state
 * - x-show on checkmark SVG for reactive display
 * - x-text on sort label for reactive label update
 */
function renderSortingDropdown(options: SortOption[], selectedValue: string): string {
  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  return `
    <div class="relative">
      <button
        id="search-header-sort-btn"
        type="button"
        @click="sortOpen = !sortOpen"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="listbox"
        :aria-expanded="sortOpen"
      >
        <span class="hidden sm:inline">Sort by:</span>
        <span x-text="sortLabel" class="font-semibold truncate max-w-[100px] sm:max-w-none">${selectedOption.label}</span>
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <!-- Sorting Dropdown -->
      <div
        id="search-header-sort-dropdown"
        x-show="sortOpen"
        x-cloak
        @click.outside="sortOpen = false"
        class="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
        role="listbox"
        aria-labelledby="search-header-sort-btn"
      >
        <ul class="py-2">
          ${options.map(option => {
            // Escape single quotes in label for Alpine expression safety
            const safeLabel = option.label.replace(/'/g, "\\'");
            return `
            <li>
              <button
                type="button"
                @click="selectSort('${option.value}', '${safeLabel}')"
                :class="selectedSort === '${option.value}'
                  ? 'text-primary-600 bg-primary-50 font-medium dark:text-primary-400 dark:bg-primary-900/20'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
                class="flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors"
                role="option"
                :aria-selected="selectedSort === '${option.value}'"
              >
                <span>${option.label}</span>
                <svg
                  x-show="selectedSort === '${option.value}'"
                  x-cloak
                  class="w-4 h-4 text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </li>
          `}).join('')}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Renders the view mode toggle (grid/list)
 * Uses Alpine.js directives:
 * - @click to call setViewMode() + $dispatch('view-mode-change')
 * - :class for reactive active/inactive state styling
 * - :aria-pressed for reactive accessibility state
 */
function renderViewModeToggle(_currentMode: ViewMode = 'grid'): string {
  return `
    <div class="flex items-center border border-gray-300 rounded-md overflow-hidden dark:border-gray-600">
      <button
        type="button"
        @click="setViewMode('grid')"
        :class="viewMode === 'grid'
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
          : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
        class="p-2 transition-colors"
        aria-label="Grid view"
        :aria-pressed="viewMode === 'grid'"
      >
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      </button>
      <button
        type="button"
        @click="setViewMode('list')"
        :class="viewMode === 'list'
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
          : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
        class="p-2 border-l border-gray-300 transition-colors dark:border-gray-600"
        aria-label="List view"
        :aria-pressed="viewMode === 'list'"
      >
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </button>
    </div>
  `;
}

/**
 * Renders the mobile filter toggle button
 */
function renderMobileFilterToggle(): string {
  return `
    <button
      type="button"
      id="mobile-filter-toggle"
      data-drawer-target="filter-sidebar-drawer"
      data-drawer-toggle="filter-sidebar-drawer"
      class="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
      aria-label="Open filters"
    >
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
      <span>Filters</span>
    </button>
  `;
}

/**
 * SearchHeader Component
 * Renders the search results header with product count, sorting, and view controls.
 * Uses x-data="searchHeader({...})" for Alpine.js reactive state management.
 *
 * @param info - Search header information including keyword, total products, and sort options
 * @param viewMode - Current view mode (grid or list)
 * @returns HTML string for the search header
 */
export function SearchHeader(
  infoOverrides: Partial<SearchHeaderInfo> = {},
  viewMode: ViewMode = 'grid'
): string {
  const info = { ...defaultSearchHeaderInfo, ...infoOverrides };
  const { keyword, totalProducts, freeShippingAvailable, sortOptions, selectedSort } = info;
  const selectedOption = sortOptions.find(opt => opt.value === selectedSort) || sortOptions[0];
  const safeLabel = selectedOption.label.replace(/'/g, "\\'");

  return `
    <div id="search-header" x-data="searchHeader({ selectedSort: '${selectedSort}', viewMode: '${viewMode}', sortLabel: '${safeLabel}' })" class="mb-4 lg:mb-6">
      <!-- Results count and free shipping banner row -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <!-- Search results count -->
          <h1 class="text-base sm:text-xl font-bold text-gray-900 dark:text-white min-w-0 break-words">
            Showing
            <span id="search-header-count">${formatNumber(totalProducts)}+</span>
            <span class="font-normal text-gray-600 dark:text-gray-400">
              products from global suppliers for
            </span>
            <span class="text-primary-600 dark:text-primary-400">"${keyword}"</span>
          </h1>

          <!-- Free shipping banner (desktop: inline, mobile: below) -->
          ${freeShippingAvailable ? `
            <div class="hidden sm:block">
              ${renderFreeShippingBanner()}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Mobile free shipping banner -->
      ${freeShippingAvailable ? `
        <div class="sm:hidden mb-4">
          ${renderFreeShippingBanner()}
        </div>
      ` : ''}

      <!-- Controls row: mobile filter toggle, sorting, view toggle -->
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-3">
          <!-- Mobile filter toggle -->
          ${renderMobileFilterToggle()}
        </div>

        <div class="flex items-center gap-3">
          <!-- Sorting dropdown -->
          ${renderSortingDropdown(sortOptions, selectedSort)}

          <!-- View mode toggle -->
          <div class="hidden sm:block">
            ${renderViewModeToggle(viewMode)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes SearchHeader interactivity.
 * No-op — Alpine.js handles all interactions via directives:
 * - Sort dropdown toggle: @click + x-show
 * - Sort option selection: @click + $dispatch('sort-change')
 * - View mode toggle: @click + $dispatch('view-mode-change')
 */
export function initSearchHeader(): void {
  // Alpine.js handles sort dropdown, sort selection, and view mode toggle
  // via @click, x-show, :class, and $dispatch directives
}

/**
 * Updates the search header with new information
 *
 * @param info - New search header information
 */
export function updateSearchHeader(info: Partial<SearchHeaderInfo>): void {
  const countEl = document.getElementById('search-header-count');

  if (countEl && info.totalProducts !== undefined) {
    countEl.textContent = formatNumber(info.totalProducts);
  }
}
