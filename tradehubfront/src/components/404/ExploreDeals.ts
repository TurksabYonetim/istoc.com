/**
 * 404 Page — Explore Top Deals Section
 * Fetches featured products from API and groups them by category.
 * Falls back to empty state if API is unavailable.
 */

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { searchListings } from '../../services/listingService';
import { initCurrency } from '../../services/currencyService';
import type { ProductListingCard } from '../../types/productListing';

/* ── Types ── */

interface ExploreProduct {
  name: string;
  href: string;
  price: string;
  moq: string;
  imageSrc: string;
  badge?: string;
}

interface ExploreCategory {
  label: string;
  products: ExploreProduct[];
}

/* ── Render helpers ── */

function renderProductImage(p: ExploreProduct): string {
  if (!p.imageSrc) {
    return `
      <div class="w-full h-full bg-gray-100 rounded-md flex items-center justify-center" aria-hidden="true">
        <svg class="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      </div>
    `;
  }
  return `
    <div class="relative w-full h-full overflow-hidden rounded-md bg-gray-100" aria-hidden="true">
      <img
        src="${p.imageSrc}"
        alt="${p.name}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
      />
    </div>
  `;
}

function renderProductCard(p: ExploreProduct): string {
  return `
    <div class="swiper-slide">
      <a href="${p.href}" class="group/card relative flex flex-col min-w-0" aria-label="${p.name}">
        ${p.badge ? `<span class="absolute top-2 left-2 z-10 inline-flex items-center rounded-sm text-[10px] font-bold leading-none px-1.5 py-0.5 text-white" style="background-color:#DE0505">${p.badge}</span>` : ''}
        <div class="aspect-square w-full mb-2 flex-shrink-0">
          ${renderProductImage(p)}
        </div>
        <p class="text-sm sm:text-[15px] font-bold leading-tight truncate" style="color:var(--color-error-600, #dc2626)">${p.price}</p>
        <p class="mt-1 text-xs sm:text-[13px] font-medium leading-none truncate text-secondary-700 dark:text-secondary-300">MOQ: ${p.moq}</p>
      </a>
    </div>
  `;
}

function renderNavArrows(index: number): string {
  return `
    <button aria-label="Onceki" class="explore-prev-${index} absolute left-0 top-[calc(50%-40px)] z-10 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-all hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/explore:opacity-100 group-hover/explore:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button aria-label="Sonraki" class="explore-next-${index} absolute right-0 top-[calc(50%-40px)] z-10 hidden h-9 w-9 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-all hover:text-gray-900 opacity-0 pointer-events-none md:flex group-hover/explore:opacity-100 group-hover/explore:pointer-events-auto disabled:opacity-0 disabled:pointer-events-none">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  `;
}

/* ── Map API response to component model ── */

function mapToExploreProduct(p: ProductListingCard): ExploreProduct {
  return {
    name: p.name,
    href: p.href || `/pages/product-detail.html?id=${p.id}`,
    price: p.price,
    moq: p.moq || '1 adet',
    imageSrc: p.imageSrc || '',
    badge: p.sellingPoint || undefined,
  };
}

function groupByCategory(products: ProductListingCard[]): ExploreCategory[] {
  const allProducts = products.map(mapToExploreProduct);

  // "Tümünü Gör" tab always first with all products
  const categories: ExploreCategory[] = [
    { label: 'Tümünü Gör', products: allProducts },
  ];

  // Group remaining by category (first category string from each product)
  const grouped = new Map<string, ExploreProduct[]>();
  for (const p of products) {
    const catName = p.category || '';
    if (!catName) continue;
    if (!grouped.has(catName)) grouped.set(catName, []);
    grouped.get(catName)!.push(mapToExploreProduct(p));
  }

  for (const [label, prods] of grouped) {
    if (prods.length > 0) {
      categories.push({ label, products: prods });
    }
  }

  return categories;
}

/* ── Exported component ── */

export function ExploreDeals(): string {
  return `
    <section id="explore-deals" class="py-6 sm:py-8 lg:py-10 border-t border-secondary-100 dark:border-secondary-800">
      <div class="container-boxed">
        <h2 class="text-lg sm:text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          En iyi fırsatları keşfedin
        </h2>

        <!-- Category tabs (populated from API) -->
        <div id="explore-tabs" class="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide mb-6 border-b border-secondary-100 dark:border-secondary-800">
        </div>

        <!-- Product sliders (populated from API) -->
        <div id="explore-panels">
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p class="text-sm text-gray-400">Ürünler yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── Init: fetch products, render tabs + sliders, wire up interactions ── */

export function initExploreDeals(): void {
  initCurrency()
    .then(() => searchListings({ is_featured: true, page_size: 20 }))
    .then(result => {
      if (result.products.length === 0) {
        showEmptyState();
        return;
      }

      const categories = groupByCategory(result.products);
      renderTabs(categories);
      renderPanels(categories);
      const swipers = initSwipers(categories);
      initTabSwitching(swipers);
    })
    .catch(err => {
      console.warn('[ExploreDeals] API load failed:', err);
      showEmptyState();
    });
}

function showEmptyState(): void {
  const panels = document.getElementById('explore-panels');
  if (!panels) return;
  panels.innerHTML = `
    <div class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="text-sm text-gray-400">Yakında yeni ürünler eklenecek</p>
      </div>
    </div>
  `;
}

function renderTabs(categories: ExploreCategory[]): void {
  const tabsContainer = document.getElementById('explore-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = categories.map((cat, i) => `
    <button
      type="button"
      class="explore-tab whitespace-nowrap px-1 pb-2 text-sm font-medium transition-colors duration-150 border-b-2 ${i === 0 ? 'text-primary-600 border-primary-500' : 'text-secondary-500 border-transparent hover:text-secondary-700'}"
      data-tab-index="${i}"
    >${cat.label}</button>
  `).join('');
}

function renderPanels(categories: ExploreCategory[]): void {
  const panelsContainer = document.getElementById('explore-panels');
  if (!panelsContainer) return;

  panelsContainer.innerHTML = categories.map((cat, i) => `
    <div class="explore-panel ${i === 0 ? '' : 'hidden'}" data-panel-index="${i}">
      <div class="group/explore relative">
        <div class="swiper explore-swiper-${i} overflow-hidden" aria-label="${cat.label} ürünleri">
          <div class="swiper-wrapper">
            ${cat.products.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
        ${renderNavArrows(i)}
      </div>
    </div>
  `).join('');
}

function initSwipers(categories: ExploreCategory[]): Swiper[] {
  const swipers: Swiper[] = [];

  categories.forEach((_, i) => {
    const el = document.querySelector<HTMLElement>(`.explore-swiper-${i}`);
    if (!el) return;

    swipers.push(
      new Swiper(el, {
        modules: [Navigation],
        spaceBetween: 10,
        navigation: {
          nextEl: `.explore-next-${i}`,
          prevEl: `.explore-prev-${i}`,
        },
        breakpoints: {
          0: { slidesPerView: 2.3, spaceBetween: 8 },
          400: { slidesPerView: 2.8, spaceBetween: 10 },
          480: { slidesPerView: 3.3, spaceBetween: 10 },
          640: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 4.5, spaceBetween: 12 },
          1024: { slidesPerView: 5.5, spaceBetween: 14 },
          1280: { slidesPerView: 6.5, spaceBetween: 16 },
        },
      })
    );
  });

  return swipers;
}

function initTabSwitching(swipers: Swiper[]): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.explore-tab');
  const panels = document.querySelectorAll<HTMLElement>('.explore-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.tabIndex;
      if (!idx) return;

      tabs.forEach(t => {
        t.classList.remove('text-primary-600', 'border-primary-500');
        t.classList.add('text-secondary-500', 'border-transparent');
      });
      tab.classList.remove('text-secondary-500', 'border-transparent');
      tab.classList.add('text-primary-600', 'border-primary-500');

      panels.forEach(p => p.classList.add('hidden'));
      const target = document.querySelector<HTMLElement>(`[data-panel-index="${idx}"]`);
      target?.classList.remove('hidden');

      const swiperIdx = parseInt(idx, 10);
      if (swipers[swiperIdx]) {
        swipers[swiperIdx].update();
      }
    });
  });
}
