/**
 * SearchArea Component
 * Search interface with tabs, two-row search box (input + image search),
 * Deep Search link, AI suggestion chips, and welcome row
 */

import type { SearchTab } from '../../types/navigation';
import { t } from '../../i18n';
import { getSearchSuggestions } from '../../services/listingService';

/** Search tabs configuration */
function getSearchTabs(): SearchTab[] {
  return [
    { id: 'ai-mode', label: t('search.aiMode'), isActive: false },
    { id: 'products', label: t('search.products'), isActive: true },
    { id: 'manufacturers', label: t('search.manufacturers'), isActive: false },
    { id: 'worldwide', label: t('search.worldwide'), isActive: false },
  ];
}


/**
 * Renders the AI sparkle icon
 */
function renderAIIcon(): string {
  return `
    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/>
    </svg>
  `;
}

/**
 * Desktop search tabs: centered with primary color accents + AI Mode tab
 */
function renderSearchTabs(): string {
  const searchTabs = getSearchTabs();
  const tabI18nKeys: Record<string, string> = {
    'ai-mode': 'search.aiMode',
    'products': 'search.products',
    'manufacturers': 'search.manufacturers',
    'worldwide': 'search.worldwide',
  };

  return `
    <div class="flex justify-center items-center mb-3 sm:mb-6 overflow-x-auto">
      <ul class="flex items-center gap-0" role="tablist">
        ${searchTabs.map((tab, index) => `
          ${index > 0 ? '<li class="text-gray-300 dark:text-gray-600 text-lg select-none px-1" aria-hidden="true">|</li>' : ''}
          <li role="presentation">
            <button
              id="search-tab-${tab.id}"
              data-tabs-target="#search-panel-${tab.id}"
              type="button"
              role="tab"
              aria-controls="search-panel-${tab.id}"
              aria-selected="${tab.isActive ? 'true' : 'false'}"
              class="search-tab-btn th-search-tab inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-lg font-semibold border-b-[3px] whitespace-nowrap transition-colors ${tab.isActive
      ? 'th-search-tab--active dark:text-primary-400 dark:border-primary-400'
      : 'border-transparent dark:text-gray-400 dark:hover:text-gray-300'
    }"
            >
              ${tab.id === 'ai-mode' ? `${renderAIIcon()}<span data-i18n="${tabI18nKeys[tab.id]}">${tab.label}</span><span class="text-red-500 text-xs -mt-2 -ml-0.5">*</span>` : `<span data-i18n="${tabI18nKeys[tab.id]}">${tab.label}</span>`}
            </button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Generates the desktop search box with two-row layout:
 * Row 1: text input
 * Row 2: camera "Image Search" link (left) + Search button (right)
 */
function renderDesktopSearchBar(): string {
  return `
    <div class="max-w-3xl mx-auto px-1 sm:px-0" id="search-wrapper">
      <form id="search-form" action="/pages/products.html" method="GET" role="search">
        <div class="relative">
          <!-- Search Box -->
          <div id="search-box" class="flex items-center h-[42px] px-1.5 sm:px-2.5" style="background-color:var(--search-box-bg);border: 2px solid var(--search-input-border-color);border-radius: var(--radius-input)">
            <!-- Text Input -->
            <input
              type="text"
              id="search-input"
              name="q"
              class="flex-1 h-full px-2 text-sm sm:text-base bg-transparent border-0 focus:ring-0 focus:outline-none"
              style="color:var(--search-input-text)"
              placeholder="${t('search.placeholder')}" data-i18n-placeholder="search.placeholder"
              autocomplete="off"
              aria-label="Search products, suppliers, or categories"
            />

            <!-- Image Search + Search Button -->
            <div class="flex items-center h-full py-1 gap-1 sm:gap-2 shrink-0">
              <a href="/image-search" class="th-search-image-link flex items-center justify-center h-full aspect-square transition-colors hover:text-primary-600" style="color:var(--search-image-link-color)" aria-label="${t('header.imageSearch')}">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                </svg>
              </a>

              <!-- Search Button -->
              <button
                type="submit"
                id="search-submit-button"
                class="flex items-center justify-center h-full gap-1.5 px-4 sm:px-6 text-sm font-semibold text-white rounded-full transition-all hover:shadow-lg"
                style="background: linear-gradient(135deg, var(--search-btn-gradient-start) 0%, var(--search-btn-gradient-end) 100%);"
                aria-label="${t('common.search')}"
              >
                ${renderAIIcon()}
                <span class="hidden sm:inline" data-i18n="common.search">${t('common.search')}</span>
              </button>
            </div>
          </div>

          <!-- Search Dropdown (shown on input focus) -->
          <div id="search-dropdown" class="hidden absolute left-0 right-0 z-10 rounded-md px-3 sm:px-5 py-2.5 sm:py-3 shadow-lg mt-2" style="background-color:var(--search-dropdown-bg);border:1px solid var(--search-dropdown-border)">
            <!-- Deep Search Row -->
            <div class="flex items-center justify-between mb-2.5">
              <div class="flex items-center gap-2 text-sm" style="color:var(--search-dropdown-text)">
                <span class="w-2 h-2 rounded-full inline-block flex-shrink-0" style="background-color:var(--search-chip-accent)"></span>
                <span data-i18n="header.deepSearch">${t('header.deepSearch')}</span>
              </div>
              <a href="/pages/legal/terms.html" class="text-xs whitespace-nowrap ml-4 transition-colors" style="color:var(--search-dropdown-muted)" data-i18n="header.termsOfUse">${t('header.termsOfUse')}</a>
            </div>
            <!-- Suggestion Chips (dynamically loaded) -->
            <div id="search-chips-container" class="flex items-center gap-2 flex-wrap">
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
}



/**
 * Renders the Alibaba-style welcome row with action links
 */
function renderWelcomeRow(): string {
  return `
    <div class="hidden md:flex items-center justify-between mt-2 mb-4 sm:mb-7 py-2 sm:py-3 overflow-x-auto" style="background-color:var(--search-welcome-bg); border-bottom:1.5px solid var(--search-welcome-bg); min-height:48px;">
      <div class="container-boxed flex items-center justify-between w-full gap-4">
        <!-- Welcome Text -->
        <h2 class="hidden sm:block text-lg font-bold whitespace-nowrap" style="color:var(--search-welcome-text)">
          <span data-i18n="search.welcomeIstoc">${t('search.welcomeIstoc')}</span>
        </h2>

        <!-- Action Links -->
        <div class="flex items-center gap-3 sm:gap-4 mx-auto sm:mx-0">
          <!-- Request for Quotation -->
          <a href="/rfq/create" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/40">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </span>
            <span class="text-sm font-medium" data-i18n="search.rfq">${t('search.rfq')}</span>
          </a>

          <!-- Separator -->
          <span class="hidden sm:inline text-gray-200 text-lg" aria-hidden="true">|</span>

          <!-- Top Ranking -->
          <a href="/products/top-ranking" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-900/40">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.52.556m0 0a6.023 6.023 0 0 1-2.52-.556" />
              </svg>
            </span>
            <span class="text-sm font-medium" data-i18n="search.topRanking">${t('search.topRanking')}</span>
          </a>

          <!-- Separator -->
          <span class="hidden sm:inline text-gray-200 text-lg" aria-hidden="true">|</span>

          <!-- Fast Customization -->
          <a href="/customize" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-violet-50 dark:bg-violet-900/40">
              <svg class="w-4 h-4 text-violet-600 dark:text-violet-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            </span>
            <span class="text-sm font-medium" data-i18n="search.fastCustomization">${t('search.fastCustomization')}</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * SearchArea Component
 * Renders the search area with:
 * - Search mode tabs (AI Mode, Products, Manufacturers, Worldwide)
 * - Two-row search box (text input + Image Search link + Search button)
 * - Welcome row with action links
 */
export function SearchArea(): string {
  return `
    <section id="hero-search-area" class="relative pt-2 sm:pt-3 md:pt-5 pb-0 dark:bg-gray-900" style="background-color:var(--search-bg)" aria-label="Search area">
      <div class="container-boxed">
        <!-- Desktop Search Tabs (above search bar) -->
        ${renderSearchTabs()}

        <!-- Desktop Search Bar -->
        ${renderDesktopSearchBar()}
      </div>
    </section>

    <!-- Welcome Row (outside search section for independent background) -->
    ${renderWelcomeRow()}
  `;
}

/**
 * Initializes search area interactivity
 */
export function initSearchArea(): void {
  if (typeof document !== 'undefined') {
    const init = (): void => {
      // Desktop tab switching
      const tabButtons = document.querySelectorAll<HTMLButtonElement>('.search-tab-btn');
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          tabButtons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.classList.remove('th-search-tab--active', 'dark:text-primary-400', 'dark:border-primary-400');
            btn.classList.add('border-transparent', 'dark:text-gray-400', 'dark:hover:text-gray-300');
          });
          button.setAttribute('aria-selected', 'true');
          button.classList.remove('border-transparent', 'dark:text-gray-400', 'dark:hover:text-gray-300');
          button.classList.add('th-search-tab--active', 'dark:text-primary-400', 'dark:border-primary-400');
        });
      });

      // Search dropdown show/hide
      const searchInput = document.getElementById('search-input');
      const searchBox = document.getElementById('search-box');
      const searchDropdown = document.getElementById('search-dropdown');
      const searchWrapper = document.getElementById('search-wrapper');

      if (searchInput && searchBox && searchDropdown && searchWrapper) {
        let isDropdownOpen = false;

        const showDropdown = (): void => {
          if (isDropdownOpen) return;
          isDropdownOpen = true;
          searchDropdown.classList.remove('hidden');
        };

        const hideDropdown = (): void => {
          if (!isDropdownOpen) return;
          isDropdownOpen = false;
          searchDropdown.classList.add('hidden');
        };

        // Open dropdown when clicking anywhere on search box
        searchBox.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation();
          showDropdown();
          (searchInput as HTMLInputElement).focus();
        });

        // Keep dropdown open when clicking inside it
        searchDropdown.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation();
        });

        // Also open on input focus (keyboard tab)
        searchInput.addEventListener('focus', showDropdown);

        // Close when clicking outside (mousedown fires before stopPropagation in popovers)
        document.addEventListener('mousedown', (e: MouseEvent) => {
          const target = e.target as Node;
          if (!searchBox.contains(target) && !searchDropdown.contains(target)) {
            hideDropdown();
          }
        });

        // Close on scroll
        window.addEventListener('scroll', () => {
          hideDropdown();
        }, { passive: true });

        // Close when mega menu opens
        document.addEventListener('istoc:close-search', hideDropdown);

        // Load dynamic suggestions
        const chipsContainer = document.getElementById('search-chips-container');

        const bindChipClicks = (): void => {
          const chips = searchDropdown.querySelectorAll('.search-chip');
          chips.forEach(chip => {
            chip.addEventListener('click', () => {
              const text = chip.querySelector('span:last-child')?.textContent || '';
              (searchInput as HTMLInputElement).value = text;
              hideDropdown();
            });
          });
        };

        const loadSuggestions = async (): Promise<void> => {
          if (!chipsContainer) return;
          try {
            const data = await getSearchSuggestions();
            const chipItems = data.chips.length > 0 ? data.chips : data.suggestions.slice(0, 3);
            chipsContainer.innerHTML = chipItems.map(item => `
              <button type="button" class="search-chip flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors max-w-[220px]" style="color:var(--search-chip-text);background-color:var(--search-chip-bg);border:1px solid var(--search-chip-border)">
                <span class="text-xs shrink-0" style="color:var(--search-chip-accent)">&#10022;</span>
                <span class="truncate">${item.text}</span>
              </button>
            `).join('');
            bindChipClicks();
          } catch {
            // Silently fail — chips area stays empty
          }
        };

        loadSuggestions();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
}
