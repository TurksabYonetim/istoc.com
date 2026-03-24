/**
 * ProductGrid Component
 * Themeable product card grid with Tailwind layout + CSS variable theming.
 */
import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import { searchListings } from '../../services/listingService';
import { initCurrency } from '../../services/currencyService';

interface ProductCard {
  name: string;
  href: string;
  price: string;
  discountPercent?: number;
  moqCount: number;
  moqUnit: 'pcs' | 'kg';
  soldCount: string;
  imageSrc: string;
  supplierYearCount?: number;
  supplierCountry?: string;
}

const productCardSeed: ProductCard[] = [];

function lensIcon(): string {
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M3 9a2 2 0 0 1 2-2h2l1-2h8l1 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  `;
}

function renderProductCard(card: ProductCard, index: number): string {
  const safeName = card.name.replace(/"/g, '&quot;');
  const unitLabel = card.moqUnit === 'kg' ? t('productGrid.kg') : t('productGrid.pcs');
  const moqText = `${card.moqCount} ${unitLabel}`;
  const soldText = t('productGrid.unitsSold', { count: card.soldCount });
  const discountText = card.discountPercent
    ? t('productGrid.discount', { percent: card.discountPercent })
    : '';
  const supplierYearsText = card.supplierYearCount
    ? `${card.supplierYearCount} ${t('productGrid.yr')}`
    : '';

  return `
    <a
      class="product-card flex flex-col relative w-full gap-2 overflow-hidden text-sm leading-[18px] text-start no-underline animate-fade-slide-up"
      style="animation-delay: ${index * 60}ms;"
      href="${card.href}"
      target="_blank"
      aria-label="${safeName}"
    >
      <!-- Image area -->
      <div class="product-card__image-area relative">
        <div class="product-card__image-wrap relative w-full h-full min-w-0 min-h-0 overflow-hidden leading-[0]">
          <img
            class="product-card__img block w-full max-w-full h-full object-cover origin-center"
            src="${card.imageSrc}"
            alt="${safeName}"
            loading="lazy"
          />
        </div>
        <div class="product-card__lens-wrap absolute">
          <div
            class="product-card__lens flex relative items-center justify-center w-full h-full rounded-full"
            role="button"
            aria-label="${t('productGrid.findSimilar')}"
            data-i18n-aria-label="productGrid.findSimilar"
            tabindex="0"
          >
            ${lensIcon()}
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class="flex flex-col gap-2 w-full min-h-[126px]">
        <div class="flex flex-col gap-2">
          <!-- Title (3 lines) -->
          <div class="product-card__title-wrap h-[54px] overflow-hidden">
            <div class="product-card__title line-clamp-3 h-[54px]">
              <span title="${safeName}">${card.name}</span>
            </div>
          </div>

          <div class="flex flex-col gap-px">
            <!-- Price + discount -->
            <div class="flex flex-wrap items-center gap-1 min-h-[26px] overflow-hidden">
              <div class="product-card__price overflow-hidden">${formatPrice(card.price)}</div>
              ${discountText ? `<div class="product-card__discount">${discountText}</div>` : ''}
            </div>

            <!-- MOQ + sold -->
            <div class="product-card__moq-line overflow-hidden h-[18px] leading-[18px]">
              <div class="product-card__moq inline mr-1"><bdi>${moqText}</bdi></div>
              <span class="product-card__stats" title="${soldText}">${soldText}</span>
            </div>

            <!-- Supplier info -->
            <div class="product-card__supplier flex items-center min-h-[18px] pt-0.5 leading-4">
              ${supplierYearsText ? `<span class="product-card__supplier-text block overflow-hidden text-ellipsis">${supplierYearsText}</span>` : ''}
              ${card.supplierCountry ? `<span class="product-card__supplier-text block overflow-hidden text-ellipsis">${card.supplierCountry}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    </a>
  `;
}

/** Load real products from API and re-render the grid. */
export function initProductGrid(): void {
  initCurrency().then(() => searchListings({ page_size: 12 })).then(result => {
    if (result.products.length > 0) {
      // Hide empty state
      const emptyState = document.getElementById('product-grid-empty');
      if (emptyState) emptyState.style.display = 'none';

      const grid = document.getElementById('home-product-grid');
      if (grid) {
        grid.innerHTML = result.products.map((p, i) => {
          const card: ProductCard = {
            name: p.name,
            href: p.href || `/pages/product-detail.html?id=${p.id}`,
            price: p.price,
            discountPercent: p.discount ? parseInt(p.discount) : undefined,
            moqCount: parseInt(p.moq) || 1,
            moqUnit: 'pcs',
            soldCount: p.stats?.replace(/[^\d.]/g, '') || '0',
            imageSrc: p.imageSrc || '',
            supplierYearCount: p.supplierYears,
            supplierCountry: p.supplierCountry,
          };
          return renderProductCard(card, i);
        }).join('');
      }
    }
  }).catch(err => console.warn('[ProductGrid] API load failed:', err));
}

export function ProductGrid(): string {
  return `
    <section
      data-theme-section="productgrid"
      aria-label="Recommended Products"
      style="background-color: var(--product-bg, #f4f4f4); padding-top: 28px; padding-bottom: 28px;"
    >
      <div class="container-wide">
        <div id="home-product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 product-grid home-product-grid" style="gap: var(--product-grid-gap, 8px);" role="list" aria-label="Product listings">
          ${productCardSeed.length > 0 ? productCardSeed.map((card, index) => renderProductCard(card, index)).join('') : `
          <div id="product-grid-empty" class="col-span-full flex items-center justify-center py-12">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p class="text-sm text-gray-400">Yak\u0131nda yeni \u00fcr\u00fcnler eklenecek</p>
            </div>
          </div>
          `}
        </div>
      </div>
    </section>
  `;
}
