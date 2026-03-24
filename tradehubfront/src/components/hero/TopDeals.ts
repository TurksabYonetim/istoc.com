/**
 * TopDeals Component
 * Alibaba-style: Swiper slider with individual product cards, spacing between them,
 * and prev/next navigation arrows.
 */

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { t } from '../../i18n';
import { formatStartingPrice } from '../../utils/currency';
import { searchListings } from '../../services/listingService';
import { initCurrency } from '../../services/currencyService';

interface TopDealCard {
  name: string;
  href: string;
  price: string;
  originalPrice: string;
  moqCount: number;
  moqUnitKey: string;
  badge?: string;
  badgeKey?: string;
  imageSrc: string;
  /** Numeric starting price for display (already converted to selected currency) */
  startingPrice?: string;
}

// Empty — populated from API in initTopDeals()
const topDealCards: TopDealCard[] = [];

function renderDealImage(card: TopDealCard): string {
  return `
    <div class="relative w-full h-full overflow-hidden rounded-md bg-gray-100" aria-hidden="true">
      <img
        src="${card.imageSrc}"
        alt="${card.name}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/deal:scale-110"
      />
    </div>
  `;
}

function lightningBoltIcon(): string {
  return `
    <svg class="h-4 w-auto flex-shrink-0" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5948 30.1888L0.735054 19.2232C0.221831 18.5826 0.604285 17.5239 1.34894 17.5239L6.20746 17.5239C6.77424 10.7461 10.1716 2.20349 20.7371 0.585977C21.9772 0.396125 23.4376 0.585405 24.5 0.585787C16.6194 3.93595 16.33 12.2572 16.2123 17.5239L21.5078 17.5239C22.2623 17.5239 22.6405 18.6069 22.1072 19.2408L11.8082 30.2064C11.4715 30.6066 10.9232 30.5987 10.5948 30.1888Z" fill="url(#paint0_linear_topdeals)"/>
      <defs>
        <linearGradient id="paint0_linear_topdeals" x1="11.4284" y1="30.5016" x2="11.2898" y2="-0.282995" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF988C"/>
          <stop offset="1" stop-color="#FFECEB"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

function renderDealSlide(card: TopDealCard): string {
  return `
    <div class="swiper-slide">
      <a
        href="${card.href}"
        class="group/deal relative flex flex-col min-w-0"
        aria-label="${card.name}"
      >
        ${card.badgeKey ? `
          <span
            class="absolute top-2 left-2 z-10 inline-flex items-center rounded-sm text-[10px] font-bold leading-none"
            style="background-color: var(--topdeals-badge-bg, #DE0505); color: var(--topdeals-badge-text, #ffffff); padding: 2px 4px;"
          ><span data-i18n="${card.badgeKey}">${t(card.badgeKey)}</span></span>
        ` : ''}

        <!-- Square image area -->
        <div class="aspect-square w-full mb-3 flex-shrink-0">
          ${renderDealImage(card)}
        </div>

        <!-- Price row -->
        <div class="flex items-center gap-1.5 min-w-0">
          <span
            class="inline-flex items-center gap-0.5 rounded-sm shrink-0"
            style="background: var(--topdeals-price-bg, #FFEDED); padding: 2px 12px 2px 4px;"
          >
            ${lightningBoltIcon()}
            <span
              class="text-(length:--text-product-price) font-bold leading-none"
              style="color: var(--topdeals-price-color, #dc2626); font-size: var(--text-product-price, 15px);"
            >${card.startingPrice || card.price}</span>
          </span>
        </div>

        <!-- MOQ -->
        <p
          class="mt-1.5 font-medium leading-none truncate"
          style="color: var(--topdeals-moq-color, #222222); font-size: var(--text-product-meta, 14px);"
        ><span data-i18n="topDeals.moq" data-i18n-options='${JSON.stringify({ count: card.moqCount, unit: t(card.moqUnitKey) })}'>${t('topDeals.moq', { count: card.moqCount, unit: t(card.moqUnitKey) })}</span></p>
      </a>
    </div>
  `;
}

export function initTopDeals(): void {
  const el = document.querySelector<HTMLElement>('.topdeals-swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [Navigation],
    spaceBetween: 12,
    navigation: {
      nextEl: '.topdeals-next',
      prevEl: '.topdeals-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 2.3,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 3.3,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 4.5,
        spaceBetween: 12,
      },
      1024: {
        slidesPerView: 5.5,
        spaceBetween: 14,
      },
      1280: {
        slidesPerView: 6.5,
        spaceBetween: 16,
      },
    },
  });

  // Load real products from API
  initCurrency().then(() => searchListings({ is_featured: true, page_size: 8 })).then(result => {
    if (result.products.length > 0) {
      // Hide empty state
      const emptyState = document.getElementById('top-deals-empty');
      if (emptyState) emptyState.style.display = 'none';

      const wrapper = document.querySelector('#top-deals-swiper .swiper-wrapper');
      if (wrapper) {
        wrapper.innerHTML = result.products.map(p => {
          const card: TopDealCard = {
            name: p.name,
            href: p.href || `/pages/product-detail.html?id=${p.id}`,
            price: p.price,
            startingPrice: formatStartingPrice(p.price),
            originalPrice: p.originalPrice || '',
            moqCount: parseInt(p.moq) || 1,
            moqUnitKey: 'topDeals.pieces',
            badge: p.sellingPoint || undefined,
            badgeKey: undefined,
            imageSrc: p.imageSrc || '',
          };
          return renderDealSlide(card);
        }).join('');
        // Reinit swiper
        const swiperEl = document.querySelector('#top-deals-swiper') as HTMLElement;
        if (swiperEl && (swiperEl as any).swiper) {
          (swiperEl as any).swiper.update();
        }
      }
    }
  }).catch(err => console.warn('[TopDeals] API load failed:', err));
}

export function TopDeals(): string {
  return `
    <section class="py-4 lg:py-6" aria-label="Top Deals" style="margin-top: 28px;">
      <div class="container-boxed">
        <div class="rounded-md" style="background-color: var(--topdeals-bg, #F8F8F8); padding: var(--space-card-padding, 16px);">
        <!-- Section header -->
        <div class="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              class="text-[20px] sm:text-[22px] font-bold leading-tight"
              style="color: var(--topdeals-title-color, #111827);"
            ><span data-i18n="topDeals.title">${t('topDeals.title')}</span></h2>
            <p
              class="mt-0.5 text-[13px]"
              style="color: var(--topdeals-subtitle-color, #6b7280);"
            ><span data-i18n="topDeals.subtitle">${t('topDeals.subtitle')}</span></p>
          </div>
          <a
            href="/pages/top-deals.html"
            class="flex-shrink-0 text-[13px] font-semibold transition-colors duration-150 hover:underline"
            style="color: var(--topdeals-link-color, #111827);"
          ><span data-i18n="common.viewMore">${t('common.viewMore')}</span> &gt;</a>
        </div>

        <!-- Swiper slider -->
        <div class="group/topdeals relative">
          <div id="top-deals-swiper" class="swiper topdeals-swiper overflow-hidden" aria-label="Top deal products">
            <div class="swiper-wrapper">
              ${topDealCards.length > 0 ? topDealCards.map(card => renderDealSlide(card)).join('') : ''}
            </div>
          </div>
          ${topDealCards.length === 0 ? `
          <div id="top-deals-empty" class="flex items-center justify-center py-12">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p class="text-sm text-gray-400">Yak\u0131nda yeni \u00fcr\u00fcnler eklenecek</p>
            </div>
          </div>
          ` : ''}

          <!-- Navigation arrows -->
          <button
            aria-label="Previous deals"
            class="topdeals-prev absolute left-0 top-[94px] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/topdeals:opacity-100 group-hover/topdeals:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <button
            aria-label="Next deals"
            class="topdeals-next absolute right-0 top-[94px] z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/topdeals:opacity-100 group-hover/topdeals:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        </div>
      </div>
    </section>
  `;
}
