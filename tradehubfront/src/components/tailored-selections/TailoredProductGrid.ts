/**
 * TailoredProductGrid Component
 * 5-column responsive product grid for the Tailored Selections page.
 * Includes badges, price tags, MOQ, ratings, views, and special labels.
 */

import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import type { TailoredProduct } from '../../types/tailoredSelections';

function renderStarRating(rating: number, count: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.3;
    let starsHtml = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHtml += `<svg class="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        } else if (i === fullStars && hasHalf) {
            starsHtml += `<svg class="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-${rating}"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs><path fill="url(#half-${rating})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        } else {
            starsHtml += `<svg class="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        }
    }

    return `
    <div class="flex items-center gap-0.5">
      ${starsHtml}
      <span class="text-xs text-gray-500 ml-0.5">${count}</span>
    </div>
  `;
}

export function renderProductCard(product: TailoredProduct, index: number): string {
    const safeName = product.name.replace(/"/g, '&quot;');
    const moqText = `MOQ: ${product.moqCount}`;

    return `
    <a
      class="ts-product-card flex flex-col relative w-full overflow-hidden text-sm leading-snug text-start no-underline group animate-fade-slide-up"
      style="animation-delay: ${index * 40}ms;"
      href="${product.href}"
      target="_blank"
      aria-label="${safeName}"
    >
      <!-- Image area -->
      <div class="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-2">
        <img
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src="${product.imageSrc}"
          alt="${safeName}"
          loading="lazy"
        />
        ${product.verifiedBadge ? `
          <span class="absolute top-2 left-2 inline-flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            GS
          </span>
        ` : ''}
        ${product.customBadge ? `
          <div class="absolute top-0 left-0 bg-white/95 rounded-br-lg p-2 text-[9px] leading-tight shadow-sm">
            <div class="flex items-center gap-1 mb-0.5">
              <span class="text-lg">🎨</span>
              <span class="font-bold text-gray-900">CUSTOM</span>
            </div>
            <div class="space-y-0.5 text-gray-600">
              <div class="flex items-center gap-0.5">✓ OUTSOLE MOLDING</div>
              <div class="flex items-center gap-0.5">✓ FULL DESIGN</div>
              <div class="flex items-center gap-0.5">✓ MATERIAL</div>
              <div class="flex items-center gap-0.5">✓ COLOR</div>
              <div class="flex items-center gap-0.5">✓ LOGO</div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Content area -->
      <div class="flex flex-col gap-1 w-full min-h-0">
        <!-- Title -->
        <div class="h-[36px] overflow-hidden">
          <p class="text-[13px] leading-[18px] text-gray-800 line-clamp-2" title="${safeName}">
            ${product.verifiedBadge && !product.customBadge ? `
              <span class="inline-flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1 py-px rounded mr-0.5 align-middle">
                <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                GS
              </span>
            ` : ''}
            ${product.name}
          </p>
        </div>

        <!-- Price row -->
        <div class="flex flex-wrap items-baseline gap-1.5">
          <span class="text-base font-bold text-gray-900">${formatPrice(product.price)}</span>
          <span class="text-xs text-gray-500">${moqText}</span>
        </div>

        <!-- Original price + discount -->
        ${product.originalPrice ? `
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            ${product.discountPercent ? `
              <span class="text-xs font-semibold text-orange-600">${product.discountPercent}% off</span>
            ` : ''}
          </div>
        ` : ''}

        <!-- Tags section -->
        <div class="flex flex-col gap-0.5 mt-0.5">
          ${product.lowestPriceTag ? `
            <div class="flex items-center gap-1 text-[11px] text-orange-600 font-medium">
              <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
              180-day lowest prices
            </div>
          ` : ''}
          ${product.lowerThanSimilar ? `
            <div class="flex items-center gap-1 text-[11px] text-orange-600 font-medium">
              <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Lower priced than similar
            </div>
          ` : ''}
          ${product.bestReviewedLabel ? `
            <div class="text-[11px] text-blue-600 font-medium truncate">
              ${product.bestReviewedLabel}
            </div>
          ` : ''}
        </div>

        <!-- Rating + sold -->
        ${product.starRating ? `
          <div class="flex items-center gap-2 mt-0.5">
            ${renderStarRating(product.starRating, product.ratingCount || 0)}
            ${product.soldCount ? `<span class="text-[11px] text-gray-500">${product.soldCount} sold</span>` : ''}
          </div>
        ` : (product.soldCount ? `
          <div class="text-[11px] text-gray-500 mt-0.5">${product.soldCount} sold</div>
        ` : '')}

        <!-- View count -->
        ${product.viewCount ? `
          <div class="text-[11px] text-gray-400 mt-0.5">${product.viewCount} views</div>
        ` : ''}
      </div>
    </a>
  `;
}

export function TailoredProductGrid(products: TailoredProduct[]): string {
    return `
    <section class="pt-4 pb-8 lg:pb-12">
      <div class="container-boxed">
        ${products.length === 0 ? `
        <div id="ts-product-grid-empty" class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p class="text-sm text-gray-400">Yak\u0131nda yeni \u00fcr\u00fcnler eklenecek</p>
          </div>
        </div>
        ` : ''}
        <div
          id="ts-product-grid"
          class="grid grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5${products.length === 0 ? ' hidden' : ''}"
          role="list"
          aria-label="Tailored selection products"
        >
          ${products.map((p, i) => renderProductCard(p, i)).join('')}
        </div>

        <!-- Load More Button -->
        <div id="ts-load-more-wrap" class="flex justify-center mt-8">
          <button
            id="ts-load-more-btn"
            class="px-8 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:shadow-md"
            style="color: var(--color-primary-700, #92400e); border-color: var(--color-primary-300, #fcd34d); background: white;"
            x-data="{ loading: false }"
            @click="
              loading = true;
              setTimeout(() => {
                const grid = document.getElementById('ts-product-grid');
                const btn = document.getElementById('ts-load-more-btn');
                const wrap = document.getElementById('ts-load-more-wrap');
                if (grid && wrap) {
                  const currentCount = grid.children.length;
                  if (currentCount >= 40) {
                    wrap.style.display = 'none';
                    return;
                  }
                  const existing = grid.innerHTML;
                  grid.innerHTML = existing + existing;
                }
                loading = false;
              }, 600);
            "
          >
            <span x-show="!loading" data-i18n="common.loadMore">${t('common.loadMore')}</span>
            <span x-show="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          </button>
        </div>
      </div>
    </section>
  `;
}
