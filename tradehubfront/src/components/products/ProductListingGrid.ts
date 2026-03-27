import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
/**
 * ProductListingGrid Component
 * Alibaba-style product listing grid for products page.
 * Responsive grid with hover zoom effect on product images.
 * Uses CSS transitions for smooth 500ms zoom animation.
 */

import type { ProductListingCard, ViewMode } from '../../types/productListing';
// Mock data import removed — grid is now API-driven

// Placeholder images removed — all images come from API now

/**
 * Camera search icon for image search overlay
 */
function cameraSearchIcon(): string {
  return `
    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M3 9a2 2 0 0 1 2-2h2l1-2h8l1 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  `;
}

/**
 * Render image slider for product card (Alibaba-style)
 * - translateX-based horizontal sliding with CSS transition
 * - group/img for hover detection on image area only
 * - Prev/next arrows + dot indicators visible on hover
 * - "${t('products.addToCompare')}" checkbox overlay on hover
 * - Camera icon at bottom-left
 */
function renderImageSlider(card: ProductListingCard): string {
  // Use real image if available, otherwise fallback to category placeholder
  const realImageSrc = card.imageSrc || '';
  const hasRealImage = realImageSrc.length > 0;

  let slidesHtml: string;
  let hasMultiple = false;

  if (hasRealImage) {
    // Use the actual product image from API
    slidesHtml = `
      <div class="w-full h-full flex-shrink-0">
        <img src="${realImageSrc}" alt="${card.name}" class="w-full h-full object-cover" loading="lazy" />
      </div>
    `;
  } else {
    // No image — show placeholder
    slidesHtml = `
      <div class="w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-100">
        <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
        </svg>
      </div>
    `;
  }

  const arrowsHtml = hasMultiple ? `
    <!-- Prev arrow -->
    <button type="button"
      class="product-slider-prev absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-white"
      data-slider-prev="${card.id}" aria-label="Previous">
      <svg class="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    <!-- Next arrow -->
    <button type="button"
      class="product-slider-next absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-white"
      data-slider-next="${card.id}" aria-label="Next">
      <svg class="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  ` : '';

  const dotsHtml = '';

  return `
    <div class="relative aspect-square w-full flex-shrink-0 overflow-hidden group/img">
      <!-- Slides container -->
      <div class="product-slider flex w-full h-full transition-transform duration-300 ease-out"
           data-slider-id="${card.id}"
           style="transform: translateX(0%)">
        ${slidesHtml}
      </div>

      ${arrowsHtml}
      ${dotsHtml}

      <!-- ${t('products.addToCompare')} checkbox (visible on hover) -->
      <label class="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded bg-white/90 shadow-sm text-[11px] text-gray-700 cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity"
             onclick="event.preventDefault(); event.stopPropagation();">
        <input type="checkbox" class="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
               data-compare-id="${card.id}" onclick="event.stopPropagation();" />
        ${t('products.addToCompare')}
      </label>

      <!-- Camera icon (bottom-left) -->
      <div
        class="absolute bottom-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full opacity-60 group-hover/img:opacity-100 transition-opacity"
        style="background: rgba(0,0,0,0.4); color: #ffffff;"
        aria-hidden="true"
      >
        ${cameraSearchIcon()}
      </div>
    </div>
  `;
}

/**
 * Country flag emoji lookup
 */
function countryFlag(code?: string): string {
  const flags: Record<string, string> = {
    CN: '\u{1F1E8}\u{1F1F3}',
    TR: '\u{1F1F9}\u{1F1F7}',
    IN: '\u{1F1EE}\u{1F1F3}',
    BD: '\u{1F1E7}\u{1F1E9}',
    VN: '\u{1F1FB}\u{1F1F3}',
    DE: '\u{1F1E9}\u{1F1EA}',
  };
  return code ? (flags[code] || '') : '';
}

/**
 * Checkmark icon for selling point badge
 */
function checkIcon(): string {
  return `
    <svg class="w-3.5 h-3.5 shrink-0 text-[rgb(34,137,31)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;
}

/**
 * Star icon for supplier rating
 */
function starIcon(): string {
  return `<svg style="width:12px;height:12px;flex-shrink:0;" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
}

/**
 * Render a single product card (fy26 snapshot-matched design)
 */
function renderProductListingCard(card: ProductListingCard): string {
  // Selling point badge
  const sellingPointText = card.sellingPoint || card.promo || '';
  const sellingPointHtml = sellingPointText
    ? `<div class="flex items-center gap-1 h-4 mt-1 text-xs text-[rgb(34,137,31)]">
        ${checkIcon()}
        <span>${sellingPointText}</span>
      </div>`
    : '';

  // MOQ
  const moqHtml = card.moq
    ? `<div class="text-sm font-normal leading-[18px] text-gray-900">${t('products.minOrder', { moq: card.moq })}</div>`
    : '';

  // Sold
  const soldHtml = card.stats
    ? `<div class="text-sm font-normal leading-[18px] text-[#767676]">${card.stats}</div>`
    : '';

  // Supplier name
  const supplierNameHtml = card.supplierName
    ? `<a class="block text-xs font-normal text-[#767676] no-underline whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">${card.supplierName}</a>`
    : '';

  // Supplier info: year, country, rating
  const yearCountryParts: string[] = [];
  if (card.supplierYears) yearCountryParts.push(`<span>${t('products.yearLabel', { count: String(card.supplierYears) })}</span>`);
  if (card.supplierCountry) yearCountryParts.push(`${countryFlag(card.supplierCountry)} <span>${card.supplierCountry}</span>`);

  const yearCountryHtml = yearCountryParts.length > 0
    ? `<a class="text-xs font-normal text-black no-underline">${yearCountryParts.join(' ')}</a>`
    : '';

  const ratingHtml = card.rating
    ? `<span class="text-xs font-normal text-gray-900 leading-4"><span>${card.rating}</span>/5.0${card.reviewCount ? ` <span>(${card.reviewCount.toLocaleString()})</span>` : ''}</span>`
    : '';

  const supplierInfoParts = [yearCountryHtml, ratingHtml].filter(Boolean);
  const supplierContentHtml = (card.supplierYears || card.supplierCountry || card.rating)
    ? `<div class="flex items-center gap-1 text-xs font-normal leading-4 text-black mt-0.5">
        ${starIcon()}
        ${supplierInfoParts.join('')}
      </div>`
    : '';

  return `
    <div class="fy26-product-card-wrapper flex flex-col justify-between w-full rounded-xl overflow-hidden bg-white pb-2 border-0">
      <!-- Image area -->
      <a href="${card.href}" class="searchx-img-area relative mb-2 block">
        ${renderImageSlider(card)}
      </a>

      <!-- Content area -->
      <div class="fy26-product-card-content flex-1 flex flex-col">
        <!-- Title area -->
        <div class="px-1">
          <h2 class="searchx-product-e-title text-sm font-normal leading-[18px] h-[54px] text-[#333] overflow-hidden text-ellipsis line-clamp-3 m-0">
            <a href="${card.href}" target="_blank" class="text-inherit no-underline hover:text-primary-500"><span>${card.name}</span></a>
          </h2>
          ${sellingPointHtml}
        </div>

        <!-- Price area -->
        <div class="px-1 mt-1">
          <div class="fy26-price text-xl font-semibold leading-[26px] text-gray-900">${formatPrice(card.price)}</div>
          <div class="fy26-moq-stats flex gap-1.5 flex-wrap mt-0.5">
            ${moqHtml}
            ${soldHtml}
          </div>
        </div>

        <!-- Supplier area -->
        <div class="px-1 mt-2">
          ${supplierNameHtml}
          ${supplierContentHtml}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="action-area-layout flex gap-2 px-1 items-center">
        <button type="button" class="searchx-product-e-abutton flex items-center justify-center h-9 px-2 sm:px-[15px] border border-[#222] rounded-full text-xs sm:text-sm font-medium text-gray-900 bg-transparent cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-100 min-w-0"
                data-add-to-cart="${card.id}">
          ${t('products.addToCart')}
        </button>
        <button type="button" class="searchx-product-e-abutton flex items-center justify-center h-9 px-2 sm:px-[15px] border border-[#222] rounded-full text-xs sm:text-sm font-medium text-gray-900 bg-transparent cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-100 min-w-0"
                onclick="event.preventDefault(); event.stopPropagation();">
          ${t('products.chat')}
        </button>
      </div>
    </div>
  `;
}

/**
 * No results component for empty state
 */
function renderNoResults(): string {
  return `
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <!-- Search illustration -->
      <div class="relative mb-6">
        <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <!-- Small X badge -->
        <div class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="h-4 w-4 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${t('products.noResults')}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        ${t('products.noResultsDesc')}
      </p>
      <button
        type="button"
        class="th-btn th-btn-pill inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-colors"
        data-filter-action="clear-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
        ${t('products.clearFilters')}
      </button>
    </div>
  `;
}

/** No-op — ProductListingGrid uses CSS grid, no JS initialization needed. */
export function initProductListingGrid(): void { }

/**
 * Navigate a product slider to the given index using translateX.
 * Updates the slider transform and dot indicators.
 */
function navigateSlider(sliderId: string, direction: number): void {
  const slider = document.querySelector<HTMLElement>(`[data-slider-id="${sliderId}"]`);
  if (!slider) return;

  const totalSlides = slider.children.length;
  if (totalSlides <= 1) return;

  // Parse current index from transform
  const currentTransform = slider.style.transform;
  const currentIndex = Math.abs(parseInt(currentTransform.match(/-?(\d+)/)?.[1] || '0')) / 100;

  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = totalSlides - 1;
  if (newIndex >= totalSlides) newIndex = 0;

  slider.style.transform = `translateX(-${newIndex * 100}%)`;

  // Update dots
  const dots = document.querySelectorAll<HTMLElement>(`[data-slider-dot="${sliderId}"]`);
  dots.forEach((dot, i) => {
    if (i === newIndex) {
      dot.classList.remove('bg-white/50');
      dot.classList.add('bg-white');
    } else {
      dot.classList.remove('bg-white');
      dot.classList.add('bg-white/50');
    }
  });
}

/**
 * Navigate a product slider to a specific index (for dot clicks).
 */
function navigateSliderTo(sliderId: string, targetIndex: number): void {
  const slider = document.querySelector<HTMLElement>(`[data-slider-id="${sliderId}"]`);
  if (!slider) return;

  const totalSlides = slider.children.length;
  if (totalSlides <= 1 || targetIndex < 0 || targetIndex >= totalSlides) return;

  slider.style.transform = `translateX(-${targetIndex * 100}%)`;

  // Update dots
  const dots = document.querySelectorAll<HTMLElement>(`[data-slider-dot="${sliderId}"]`);
  dots.forEach((dot, i) => {
    if (i === targetIndex) {
      dot.classList.remove('bg-white/50');
      dot.classList.add('bg-white');
    } else {
      dot.classList.remove('bg-white');
      dot.classList.add('bg-white/50');
    }
  });
}

/**
 * Initialize product image sliders.
 * Uses event delegation on document for prev/next arrows and dot clicks.
 * Prevents navigation events from following the product card link.
 */
export function initProductSliders(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check for prev button
    const prevBtn = target.closest<HTMLElement>('[data-slider-prev]');
    if (prevBtn) {
      e.preventDefault();
      e.stopPropagation();
      const sliderId = prevBtn.getAttribute('data-slider-prev');
      if (sliderId) navigateSlider(sliderId, -1);
      return;
    }

    // Check for next button
    const nextBtn = target.closest<HTMLElement>('[data-slider-next]');
    if (nextBtn) {
      e.preventDefault();
      e.stopPropagation();
      const sliderId = nextBtn.getAttribute('data-slider-next');
      if (sliderId) navigateSlider(sliderId, 1);
      return;
    }

    // Check for dot click
    const dotEl = target.closest<HTMLElement>('[data-dot-index]');
    if (dotEl) {
      e.preventDefault();
      e.stopPropagation();
      const sliderId = dotEl.getAttribute('data-slider-dot');
      const dotIndex = parseInt(dotEl.getAttribute('data-dot-index') ?? '0', 10);
      if (sliderId) navigateSliderTo(sliderId, dotIndex);
    }
  });
}

/**
 * ProductListingGrid Component
 * Renders a responsive grid of product cards with hover zoom effect.
 *
 * @param products - Array of products to display (defaults to mock data)
 * @returns HTML string for the product grid
 *
 * Grid Configuration (per spec):
 * - Mobile (< 768px): 2 columns
 * - Tablet (768px - 1023px): 3 columns
 * - Desktop (1024px+): 4 columns
 * See src/style.css .product-grid for CSS implementation
 *
 * Hover Zoom Effect:
 * - transition-transform duration-500 ease-out
 * - group-hover/product:scale-110 (10% zoom)
 */
export function ProductListingGrid(products: ProductListingCard[] = []): string {
  if (products.length === 0) {
    return `
      <section aria-label="${t('products.productList')}" class="flex-1">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 product-grid"
          style="gap: var(--product-grid-gap, 12px);"
          role="list"
          aria-label="${t('products.productListLabel')}"
        >
          ${renderNoResults()}
        </div>
      </section>
    `;
  }

  return `
    <section aria-label="${t('products.productList')}" class="flex-1">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 product-grid"
        style="gap: var(--product-grid-gap, 12px);"
        role="list"
        aria-label="${t('products.productListLabel')}"
      >
        ${products.map(card => `<div role="listitem" class="flex">${renderProductListingCard(card)}</div>`).join('')}
      </div>
    </section>
  `;
}

/**
 * Re-render the product grid in-place with a new set of products.
 * Called by the filter engine when filters/sort change.
 */
export function rerenderProductGrid(products: ProductListingCard[]): void {
  const grid = document.querySelector<HTMLElement>('.product-grid');
  if (!grid) return;

  // Preserve the current view mode
  const isListView = grid.classList.contains('product-list-mode');

  if (products.length === 0) {
    grid.innerHTML = renderNoResults();
  } else {
    grid.innerHTML = products
      .map(card => `<div role="listitem" class="flex">${renderProductListingCard(card)}</div>`)
      .join('');
  }

  // Re-apply list view classes if it was in list mode
  if (isListView) {
    setGridViewMode('list');
  } else {
    // Ensure all grid classes are correct just in case
    setGridViewMode('grid');
  }
}

/**
 * Export helper to render grid with custom products
 */
export { renderProductListingCard, renderNoResults };

/**
 * Toggle grid between 'grid' and 'list' view modes using Tailwind classes.
 */
export function setGridViewMode(mode: ViewMode): void {
  const grid = document.querySelector<HTMLElement>('.product-grid');
  if (!grid) return;

  // Single class controls entire list layout via CSS (see style.css)
  grid.classList.toggle('product-list-mode', mode === 'list');
}
