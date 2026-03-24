/**
 * RecommendationSlider Component
 * Product recommendation cards in a Swiper carousel.
 * Loads products dynamically from API.
 */

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { t } from '../../i18n';
import { searchListings } from '../../services/listingService';
import { initCurrency } from '../../services/currencyService';
import { formatStartingPrice } from '../../utils/currency';

interface RecommendationCard {
  title: string;
  subtitle?: string;
  href: string;
  imageSrc: string;
  price?: string;
}

function renderCardImage(card: RecommendationCard): string {
  if (!card.imageSrc) {
    return `
      <div class="relative h-full w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center" aria-hidden="true">
        <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    `;
  }
  return `
    <div class="relative h-full w-full overflow-hidden rounded-md bg-gray-100" aria-hidden="true">
      <img
        src="${card.imageSrc}"
        alt="${card.title}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105 group-focus-visible/card:scale-105"
      />
    </div>
  `;
}

function renderCard(card: RecommendationCard): string {
  const safeName = card.title.replace(/"/g, '&quot;');

  return `
    <div class="swiper-slide recommendation-slide h-full xl:!w-[240px]">
      <a
        href="${card.href}"
        aria-label="${safeName}"
        title="${safeName}"
        class="th-card group/card mx-auto flex h-full w-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-1 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-400"
        style="background-color:var(--hero-card-bg);border-color:var(--hero-card-border-color);border-radius:var(--hero-card-radius)"
      >
        <div class="mb-2">
          <h3 class="text-[14px] sm:text-[16px] font-bold leading-tight truncate dark:text-white" style="color:var(--hero-title-color)">${card.title}</h3>
          ${card.price ? `<p class="mt-0.5 truncate text-[12px] sm:text-[13px] font-semibold leading-tight text-red-500">${formatStartingPrice(card.price)}</p>` : ''}
        </div>
        <div class="min-h-0 flex-1">
          ${renderCardImage(card)}
        </div>
      </a>
    </div>
  `;
}

export function RecommendationSlider(): string {
  return `
    <div class="group/recommendation relative recommendation-slider-wrapper h-[200px] sm:h-[260px] xl:h-[300px] px-2 sm:px-4 xl:px-0">
      <div class="swiper recommendation-swiper h-full" aria-label="${t('recommendation.frequentlySearched')}">
        <div class="swiper-wrapper h-full" id="recommendation-slides">
          <!-- Populated from API -->
        </div>
      </div>

      <div class="reco-pagination mt-3 flex justify-center hidden"></div>

      <button
        aria-label="Previous recommendations"
        class="rec-swiper-prev absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/recommendation:opacity-100 group-hover/recommendation:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-0 disabled:pointer-events-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-white"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        aria-label="Next recommendations"
        class="rec-swiper-next absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/recommendation:opacity-100 group-hover/recommendation:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-0 disabled:pointer-events-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-white"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  `;
}

let swiperInstance: Swiper | null = null;

function initSwiper(): void {
  const sliderElement = document.querySelector<HTMLElement>('.recommendation-swiper');
  if (!sliderElement) return;

  if (swiperInstance) {
    swiperInstance.update();
    return;
  }

  swiperInstance = new Swiper(sliderElement, {
    modules: [Autoplay, Navigation, Pagination],
    loop: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 8,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.rec-swiper-next',
      prevEl: '.rec-swiper-prev',
    },
    pagination: {
      el: '.reco-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 12 },
      640: { slidesPerView: 1, spaceBetween: 16 },
      960: { slidesPerView: 2, spaceBetween: 20 },
      1280: { slidesPerView: 3, spaceBetween: 20 },
    },
  });
}

export function initRecommendationSlider(): void {
  // Load products from API
  initCurrency().then(() => searchListings({ page_size: 9 })).then(result => {
    const container = document.getElementById('recommendation-slides');
    if (!container) return;

    if (result.products.length === 0) return;

    const cards: RecommendationCard[] = result.products.map(p => ({
      title: p.name,
      href: p.href || `/pages/product-detail.html?id=${p.id}`,
      imageSrc: p.imageSrc || '',
      price: p.price,
    }));

    container.innerHTML = cards.map(card => renderCard(card)).join('');
    initSwiper();
  }).catch(err => {
    console.warn('[RecommendationSlider] API load failed:', err);
  });
}
