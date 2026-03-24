/**
 * TailoredSelections Component
 * Alibaba-style: Swiper slider with curated collection cards.
 * Each card has a title, views subtitle, two product images side by side, and prices.
 */

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import { searchListings } from '../../services/listingService';
import { initCurrency } from '../../services/currencyService';

interface CollectionProduct {
  name: string;
  price: string;
  imageSrc: string;
}

interface TailoredCollection {
  title: string;
  titleKey: string;
  views: string;
  viewsCount: string;
  href: string;
  products: [CollectionProduct, CollectionProduct];
}

// Empty — populated from API in initTailoredSelections()
const tailoredCollections: TailoredCollection[] = [];

function renderProductImage(product: CollectionProduct): string {
  return `
    <div class="relative h-full w-full overflow-hidden rounded-md bg-gray-100" aria-hidden="true">
      <img
        src="${product.imageSrc}"
        alt="${product.name}"
        loading="lazy"
        class="w-full h-full object-cover"
      />
    </div>
  `;
}

function renderCollectionSlide(collection: TailoredCollection): string {
  const [product1, product2] = collection.products;
  return `
    <div class="swiper-slide tailored-slide">
      <a
        href="${collection.href}"
        class="group/col flex flex-col h-full rounded-md overflow-hidden cursor-pointer"
        style="background: var(--tailored-card-bg, #ffffff); padding: var(--space-card-padding, 16px);"
        aria-label="${t(collection.titleKey)}"
      >
        <!-- Title -->
        <h3
          class="truncate font-bold leading-tight"
          style="color: var(--tailored-collection-title-color, #222222); font-size: var(--text-product-price, 20px);"
        ><span data-i18n="${collection.titleKey}">${t(collection.titleKey)}</span></h3>

        <!-- Views subtitle -->
        <p
          class="truncate"
          style="color: var(--tailored-views-color, #767676); font-size: var(--text-product-meta, 16px); margin: 0 0 12px;"
        ><span data-i18n="tailored.views" data-i18n-options='${JSON.stringify({ count: collection.viewsCount })}'>${t('tailored.views', { count: collection.viewsCount })}</span></p>

        <!-- Product images side by side — 164x164 each -->
        <div class="flex gap-2 flex-1">
          <div class="flex-1 flex flex-col">
            <div class="aspect-square w-full">
              ${renderProductImage(product1)}
            </div>
            <p
              class="font-bold leading-none truncate"
              style="color: var(--tailored-price-color, #222222); font-size: var(--text-product-price, 20px); margin-top: 8px;"
            >${formatPrice(product1.price)}</p>
          </div>
          <div class="flex-1 flex flex-col">
            <div class="aspect-square w-full">
              ${renderProductImage(product2)}
            </div>
            <p
              class="font-bold leading-none truncate"
              style="color: var(--tailored-price-color, #222222); font-size: var(--text-product-price, 20px); margin-top: 8px;"
            >${formatPrice(product2.price)}</p>
          </div>
        </div>
      </a>
    </div>
  `;
}

export function initTailoredSelections(): void {
  const el = document.querySelector<HTMLElement>('.tailored-swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [Navigation],
    spaceBetween: 8,
    navigation: {
      nextEl: '.tailored-next',
      prevEl: '.tailored-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 8,
      },
      480: {
        slidesPerView: 1.5,
        spaceBetween: 8,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 8,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 8,
      },
    },
  });

  // Load real products grouped by category
  initCurrency().then(() => searchListings({ page_size: 20 })).then(result => {
    if (result.products.length >= 4) {
      // Group products by category
      const groups: Record<string, typeof result.products> = {};
      for (const p of result.products) {
        const cat = (p as any).category || 'Diger';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(p);
      }

      const collections: TailoredCollection[] = [];
      for (const [cat, products] of Object.entries(groups)) {
        if (products.length >= 2) {
          collections.push({
            title: cat,
            titleKey: '',
            views: `${Math.floor(Math.random() * 50 + 10)}K+ views`,
            viewsCount: '',
            href: `/pages/products.html?category=${encodeURIComponent(cat)}`,
            products: products.slice(0, 2).map(p => ({
              name: p.name,
              price: p.price,
              imageSrc: p.imageSrc || '',
            })) as [CollectionProduct, CollectionProduct],
          });
        }
      }

      if (collections.length > 0) {
        // Hide empty state
        const emptyState = document.getElementById('tailored-empty');
        if (emptyState) emptyState.style.display = 'none';

        const wrapper = document.querySelector('#tailored-swiper .swiper-wrapper');
        if (wrapper) {
          wrapper.innerHTML = collections.map(c => renderCollectionSlide(c)).join('');
          const swiperEl = document.querySelector('#tailored-swiper') as HTMLElement;
          if (swiperEl && (swiperEl as any).swiper) {
            (swiperEl as any).swiper.update();
          }
        }
      }
    }
  }).catch(err => console.warn('[TailoredSelections] API load failed:', err));
}

export function TailoredSelections(): string {
  return `
    <section class="py-4 lg:py-6" aria-label="Tailored Selections" style="margin-top: 28px;">
      <div class="container-boxed">
        <div class="rounded-md" style="background-color: var(--tailored-bg, #F5F5F5); padding: var(--space-card-padding, 16px);">
          <!-- Section header -->
          <div class="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                class="text-[20px] sm:text-[22px] font-bold leading-tight"
                style="color: var(--tailored-title-color, #111827);"
              ><span data-i18n="tailored.title">${t('tailored.title')}</span></h2>
            </div>
            <a
              href="/pages/tailored-selections.html"
              class="flex-shrink-0 text-[13px] font-semibold transition-colors duration-150 hover:underline"
              style="color: var(--tailored-link-color, #111827);"
            ><span data-i18n="common.viewMore">${t('common.viewMore')}</span> &gt;</a>
          </div>

          <!-- Swiper slider -->
          <div class="group/tailored relative">
            <div id="tailored-swiper" class="swiper tailored-swiper overflow-hidden" aria-label="Tailored selection collections">
              <div class="swiper-wrapper">
                ${tailoredCollections.length > 0 ? tailoredCollections.map(c => renderCollectionSlide(c)).join('') : ''}
              </div>
            </div>
            ${tailoredCollections.length === 0 ? `
            <div id="tailored-empty" class="flex items-center justify-center py-12">
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
              aria-label="Previous collections"
              class="tailored-prev absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/tailored:opacity-100 group-hover/tailored:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <button
              aria-label="Next collections"
              class="tailored-next absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all duration-200 hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/tailored:opacity-100 group-hover/tailored:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none"
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
