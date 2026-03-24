/**
 * MobileCategoryBar Component
 * Alibaba-style horizontal scrollable category tabs + product thumbnails
 * Bottom sheet drawer for category selection
 * Visible only on mobile/tablet (xl:hidden)
 */

import { megaCategories } from '../header';
import { t } from '../../i18n';

/* ──── Bottom Sheet ──── */

function renderBottomSheet(): string {
  return `
    <!-- Bottom Sheet Overlay -->
    <div id="mcb-sheet-overlay" class="fixed inset-0 z-(--z-backdrop) bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 xl:hidden"></div>

    <!-- Bottom Sheet Panel -->
    <div id="mcb-sheet-panel" class="fixed inset-x-0 bottom-0 z-(--z-modal) transition-transform duration-300 ease-out xl:hidden" style="transform: translateY(100%)">
      <div class="bg-white dark:bg-gray-800 rounded-t-md max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Drag Handle + Title (swipe-to-dismiss target) -->
        <div id="mcb-sheet-drag-handle" class="flex-shrink-0">
          <div class="flex items-center justify-center pt-3 pb-2">
            <div class="w-9 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div class="flex items-center px-5 border-b border-gray-100 dark:border-gray-700/50">
            <span class="text-[15px] font-bold text-gray-900 dark:text-white" data-i18n="categoryBrowse.title">${t('categoryBrowse.title')}</span>
            <button
              type="button"
              id="mcb-sheet-close"
              class="ml-auto p-1.5 -mr-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="${t('common.close')}" data-i18n-aria-label="common.close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Category List -->
        <div class="overflow-y-auto flex-1 pb-6">
          ${megaCategories.map((cat, i) => `
            <button
              type="button"
              class="mcb-sheet-item flex items-center w-full px-5 py-4 text-left transition-colors border-b border-gray-50 dark:border-gray-700/50"
              data-mcb-sheet-cat="${cat.id}"
            >
              <span class="flex-1 text-[15px] text-gray-800 dark:text-gray-300">${cat.name}</span>
              <span class="mcb-sheet-radio flex-shrink-0 w-5 h-5 rounded-full border-2 ${i === 0 ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600 bg-transparent'} flex items-center justify-center transition-colors">
                <span class="w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-transparent'} transition-colors"></span>
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ──── HTML ──── */

export function MobileCategoryBar(): string {
  const firstCat = megaCategories[0];

  return `
    <div id="mobile-category-bar" class="xl:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <!-- Row 1: Category Tabs -->
      <div class="relative">
        <div id="mcb-tabs" class="flex overflow-x-auto scrollbar-hide gap-0.5 pr-10">
          ${megaCategories.map((cat, i) => `
            <button
              type="button"
              class="mcb-tab flex-shrink-0 px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                i === 0
                  ? 'font-bold text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                  : 'text-gray-500 dark:text-gray-400 font-normal border-b-2 border-transparent'
              }"
              data-mcb-cat="${cat.id}"
            >${cat.name}</button>
          `).join('')}
        </div>
        <!-- Dropdown button with gradient fade -->
        <div class="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
          <div class="w-12 h-full bg-gradient-to-l from-white dark:from-gray-800 to-transparent"></div>
        </div>
        <button
          type="button"
          id="mcb-dropdown-btn"
          class="absolute right-0 top-0 bottom-0 w-9 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
          aria-label="${t('mobileCategory.allCategories')}" data-i18n-aria-label="mobileCategory.allCategories"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </button>
      </div>

      <!-- Row 2: Product Items -->
      <div id="mcb-products" class="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-3 px-2 sm:px-3 py-2.5">
        ${firstCat.products.slice(0, 10).map(p => renderMobileProduct(p)).join('')}
      </div>
    </div>

    ${renderBottomSheet()}
  `;
}

function renderMobileProduct(product: { name: string; href: string }): string {
  return `
    <a href="${product.href}" class="mcb-product flex-shrink-0 flex flex-col items-center gap-1 w-[52px] sm:w-[60px]">
      <div class="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75Z"/>
        </svg>
      </div>
      <span class="text-[11px] text-gray-600 dark:text-gray-400 text-center leading-tight line-clamp-2 w-full">${product.name}</span>
    </a>
  `;
}

/* ──── Init ──── */

export function initMobileCategoryBar(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.mcb-tab');
  const productsContainer = document.getElementById('mcb-products');
  const dropdownBtn = document.getElementById('mcb-dropdown-btn');
  const sheetOverlay = document.getElementById('mcb-sheet-overlay');
  const sheetPanel = document.getElementById('mcb-sheet-panel');
  const sheetClose = document.getElementById('mcb-sheet-close');
  const sheetItems = document.querySelectorAll<HTMLButtonElement>('.mcb-sheet-item');

  if (!productsContainer || tabs.length === 0) return;

  const TAB_ACT = ['font-bold', 'text-gray-900', 'dark:text-white', 'border-gray-900', 'dark:border-white'];
  const TAB_INACT = ['text-gray-500', 'dark:text-gray-400', 'font-normal', 'border-transparent'];

  /* ── Shared: select a category ── */
  function selectCategory(catId: string): void {

    // Update tab bar
    tabs.forEach(t => {
      t.classList.remove(...TAB_ACT);
      t.classList.add(...TAB_INACT);
    });
    const activeTab = document.querySelector<HTMLButtonElement>(`.mcb-tab[data-mcb-cat="${catId}"]`);
    if (activeTab) {
      activeTab.classList.remove(...TAB_INACT);
      activeTab.classList.add(...TAB_ACT);
      // Scroll tab into view
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Update bottom sheet selected state (bold text + radio for active category)
    sheetItems.forEach(item => {
      const id = item.getAttribute('data-mcb-sheet-cat');
      const label = item.querySelector('span:first-child');
      const radio = item.querySelector('.mcb-sheet-radio') as HTMLElement | null;
      const radioDot = radio?.querySelector('span') as HTMLElement | null;
      if (!label) return;

      if (id === catId) {
        label.className = 'flex-1 text-[15px] font-semibold text-gray-900 dark:text-white';
        if (radio) radio.className = 'mcb-sheet-radio flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary-500 bg-primary-500 flex items-center justify-center transition-colors';
        if (radioDot) radioDot.className = 'w-2 h-2 rounded-full bg-white transition-colors';
      } else {
        label.className = 'flex-1 text-[15px] text-gray-800 dark:text-gray-300';
        if (radio) radio.className = 'mcb-sheet-radio flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-transparent flex items-center justify-center transition-colors';
        if (radioDot) radioDot.className = 'w-2 h-2 rounded-full bg-transparent transition-colors';
      }
    });

    // Update products row
    const cat = megaCategories.find(c => c.id === catId);
    if (cat) {
      productsContainer!.innerHTML = cat.products
        .slice(0, 10)
        .map(p => renderMobileProduct(p))
        .join('');
    }
  }

  /* ── Tab bar clicks ── */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const catId = tab.getAttribute('data-mcb-cat');
      if (catId) selectCategory(catId);
    });
  });

  /* ── Bottom sheet open/close ── */
  function openSheet(): void {
    if (!sheetOverlay || !sheetPanel) return;
    sheetOverlay.style.opacity = '1';
    sheetOverlay.style.pointerEvents = 'auto';
    sheetPanel.style.transform = 'translateY(0)';
    document.body.style.overflow = 'hidden';
  }

  function closeSheet(): void {
    if (!sheetOverlay || !sheetPanel) return;
    sheetOverlay.style.opacity = '0';
    sheetOverlay.style.pointerEvents = 'none';
    sheetPanel.style.transform = 'translateY(100%)';
    document.body.style.overflow = '';
  }

  // Dropdown button → open bottom sheet
  if (dropdownBtn) {
    dropdownBtn.addEventListener('click', openSheet);
  }

  // Close triggers
  if (sheetClose) sheetClose.addEventListener('click', closeSheet);
  if (sheetOverlay) sheetOverlay.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  // Swipe-down-to-dismiss gesture on the bottom sheet
  if (sheetPanel) {
    const headerArea = document.getElementById('mcb-sheet-drag-handle');
    const dragTarget = headerArea || sheetPanel;
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    dragTarget.addEventListener('touchstart', (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentY = startY;
      dragging = true;
      sheetPanel!.style.transition = 'none';
    }, { passive: true });

    dragTarget.addEventListener('touchmove', (e: TouchEvent) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        sheetPanel!.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    dragTarget.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      sheetPanel!.style.transition = '';
      const deltaY = currentY - startY;
      const sheetHeight = sheetPanel!.offsetHeight;
      if (deltaY > sheetHeight * 0.3) {
        closeSheet();
      } else {
        sheetPanel!.style.transform = 'translateY(0)';
      }
    });
  }

  // Sheet item clicks → select category + close sheet
  sheetItems.forEach(item => {
    item.addEventListener('click', () => {
      const catId = item.getAttribute('data-mcb-sheet-cat');
      if (catId) {
        selectCategory(catId);
        closeSheet();
      }
    });
  });
}
