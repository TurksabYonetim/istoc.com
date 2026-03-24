/**
 * RelatedProducts Component
 * Horizontal Swiper slider of related product cards.
 * Loads data from API via getRelatedListings().
 */

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import { getRelatedListings } from '../../services/listingService';
import { getCurrentProduct } from '../../alpine/product';

interface RelatedProduct {
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

function renderRelatedSlide(card: RelatedProduct): string {
  const safeName = card.name.replace(/"/g, '&quot;');
  const unitLabel = card.moqUnit === 'kg' ? t('productGrid.kg') : t('productGrid.pcs');
  const moqText = `${card.moqCount} ${unitLabel}`;
  const soldText = card.soldCount ? t('productGrid.unitsSold', { count: card.soldCount }) : '';
  const discountText = card.discountPercent
    ? t('productGrid.discount', { percent: card.discountPercent })
    : '';
  const supplierYearsText = card.supplierYearCount
    ? `${card.supplierYearCount} ${t('productGrid.yr')}`
    : '';

  return `
    <div class="swiper-slide">
      <a
        class="flex flex-col h-full rounded-lg overflow-hidden bg-white border border-gray-100 transition-shadow hover:shadow-md"
        href="${card.href}"
        aria-label="${safeName}"
      >
        <!-- Image -->
        <div class="relative">
          <div class="aspect-square w-full overflow-hidden bg-gray-50">
            ${card.imageSrc
              ? `<img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" src="${card.imageSrc}" alt="${safeName}" loading="lazy" />`
              : `<div class="w-full h-full flex items-center justify-center text-gray-300"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`
            }
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col flex-1 gap-1.5 p-3">
          <!-- Title -->
          <p class="text-[13px] leading-[1.4] line-clamp-3 text-gray-800" title="${safeName}">${card.name}</p>

          <!-- Price + discount -->
          <div class="flex flex-wrap items-baseline gap-x-2">
            <span class="text-sm font-bold text-gray-900">${formatPrice(card.price)}</span>
            ${discountText ? `<span class="text-xs font-medium text-red-500">${discountText}</span>` : ''}
          </div>

          <!-- MOQ + sold -->
          <div class="text-xs text-gray-500 truncate">
            <span class="mr-1.5 font-medium text-gray-600">${moqText}</span>
            ${soldText ? `<span>${soldText}</span>` : ''}
          </div>

          <!-- Supplier info -->
          <div class="mt-auto flex items-center gap-1.5 text-xs text-gray-400">
            ${supplierYearsText ? `<span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">${supplierYearsText}</span>` : ''}
            ${card.supplierCountry ? `<span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">${card.supplierCountry}</span>` : ''}
          </div>
        </div>
      </a>
    </div>
  `;
}

export function RelatedProducts(): string {
  return `
    <section class="related-products-section max-[374px]:px-3 max-[374px]:py-4" style="background: var(--pd-related-bg, #f8f8f8);">
        <div class="flex items-center justify-between mb-4 max-[374px]:mb-3">
          <h2 class="text-lg font-bold max-[374px]:text-base" style="color: var(--pd-title-color, #111827);">${t('product.similarProducts')}</h2>
          <a href="/pages/products.html" class="text-sm font-medium hover:underline max-[374px]:text-xs" style="color: var(--pd-breadcrumb-link-color, #cc9900);">${t('product.viewAllProducts')} →</a>
        </div>

        <div class="group/related-slider relative">
          <div class="swiper related-products-swiper overflow-hidden">
            <div class="swiper-wrapper" id="related-products-slides">
              <!-- Populated dynamically from API -->
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            aria-label="${t('product.previousProducts')}"
            class="related-prev absolute left-0 top-[35%] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/related-slider:opacity-100 group-hover/related-slider:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            aria-label="${t('product.nextProducts')}"
            class="related-next absolute right-0 top-[35%] z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/related-slider:opacity-100 group-hover/related-slider:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
    </section>
  `;
}

export function initRelatedProducts(): void {
  const product = getCurrentProduct();
  if (!product.id) return;

  // Fetch related products from API
  getRelatedListings(product.id, 8).then(listings => {
    const container = document.getElementById('related-products-slides');
    if (!container) return;

    if (listings.length === 0) {
      // Hide the section if no related products
      const section = container.closest('.related-products-section');
      if (section) (section as HTMLElement).style.display = 'none';
      return;
    }

    const relatedProducts: RelatedProduct[] = listings.map(listing => ({
      name: listing.name,
      href: listing.href || `/pages/product-detail.html?id=${listing.id}`,
      price: listing.price,
      discountPercent: listing.discount ? parseInt(listing.discount) : undefined,
      moqCount: parseInt(listing.moq) || 1,
      moqUnit: 'pcs' as const,
      soldCount: listing.stats?.replace(/[^\d.,+K]/gi, '') || '',
      imageSrc: listing.imageSrc || '',
      supplierYearCount: listing.supplierYears,
      supplierCountry: listing.supplierCountry,
    }));

    container.innerHTML = relatedProducts.map(p => renderRelatedSlide(p)).join('');

    // Initialize Swiper after content is loaded
    const el = document.querySelector<HTMLElement>('.related-products-swiper');
    if (el) {
      new Swiper(el, {
        modules: [Navigation],
        spaceBetween: 12,
        navigation: {
          nextEl: '.related-next',
          prevEl: '.related-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1.4, spaceBetween: 8 },
          375: { slidesPerView: 2.3, spaceBetween: 10 },
          480: { slidesPerView: 3.3, spaceBetween: 10 },
          640: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 4, spaceBetween: 12 },
          1024: { slidesPerView: 3.5, spaceBetween: 14 },
          1280: { slidesPerView: 4, spaceBetween: 16 },
        },
      });
    }
  }).catch(err => {
    console.warn('[RelatedProducts] Failed to load:', err);
    // Hide section on error
    const section = document.querySelector('.related-products-section');
    if (section) (section as HTMLElement).style.display = 'none';
  });
}
