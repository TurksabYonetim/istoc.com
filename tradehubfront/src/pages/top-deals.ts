/**
 * Top Deals Page — Entry Point
 * Assembles header, hero banner, promo bar, category tabs, sub-filters,
 * product grid, and footer for the Top Deals landing page.
 */

import '../style.css'
import Alpine from 'alpinejs'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'

// Header components
import { TopBar, initMobileDrawer, SubHeader, MegaMenu, initMegaMenu, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'

// Shared components
import { Breadcrumb } from '../components/shared/Breadcrumb'

// Footer components
import { FooterLinks } from '../components/footer'

// Floating components
import { FloatingPanel } from '../components/floating'

// Alpine.js
import { startAlpine } from '../alpine'

// Top Deals components
import {
  TopDealsHero,
  TopDealsMobileHeader,
  TopDealsStickyMobileHeader,
  TopDealsPromoBar,
  TopDealsCategoryTabs,
  TopDealsSubFilters,
  TopDealsGrid,
  initCategoryTabs,
} from '../components/top-deals'
import { renderTopDealCard } from '../components/top-deals/TopDealsGrid'

// Services
import { searchListings } from '../services/listingService'
import { initCurrency } from '../services/currencyService'

// Data (types only)
import type { TopDealsProduct } from '../types/topDeals'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'

/* ── Alpine Data Registration ── */

const allProducts: TopDealsProduct[] = [];
const ITEMS_PER_PAGE = 20;

Alpine.data('topDealsPage', () => ({
  activeCategory: 'all',
  activeSubFilter: 'all',
  visibleCount: ITEMS_PER_PAGE,
  canScrollLeft: false,
  canScrollRight: true,
  showCategorySheet: false,
  allProducts: allProducts,

  get subFilters(): { id: string; labelKey: string }[] {
    return [];
  },

  get filteredProducts(): TopDealsProduct[] {
    let products = this.allProducts;

    // Filter by category
    if (this.activeCategory === 'free-shipping') {
      products = products.filter(p => p.featureTags?.includes('Free shipping'));
    } else if (this.activeCategory !== 'all') {
      products = products.filter(p => p.category === this.activeCategory);
    }

    // Filter by sub-filter
    if (this.activeSubFilter !== 'all') {
      products = products.filter(p => p.subCategory === this.activeSubFilter);
    }

    return products;
  },

  get visibleProducts(): TopDealsProduct[] {
    return this.filteredProducts.slice(0, this.visibleCount);
  },

  setCategory(categoryId: string) {
    this.activeCategory = categoryId;
    this.activeSubFilter = 'all';
    this.visibleCount = ITEMS_PER_PAGE;
  },

  setSubFilter(filterId: string) {
    this.activeSubFilter = filterId;
    this.visibleCount = ITEMS_PER_PAGE;
  },

  loadMore() {
    this.visibleCount += ITEMS_PER_PAGE;
  },

  renderCard(product: TopDealsProduct): string {
    return renderTopDealCard(product);
  },

  scrollTabs(direction: 'left' | 'right') {
    const el = (this.$refs as Record<string, HTMLElement>).tabsScroll;
    if (!el) return;
    const scrollAmount = 200;
    el.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
  },

  updateScrollState() {
    const el = (this.$refs as Record<string, HTMLElement>).tabsScroll;
    if (!el) return;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
  },

  // i18n helper for Alpine templates
  $t(key: string): string {
    return t(key);
  },
}));

/* ── Page Assembly ── */

const breadcrumbItems = [
  { label: t('common.home'), href: '/' },
  { label: t('topDealsPage.breadcrumb') },
];

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Header (desktop only on this page — mobile uses compact hero header) -->
  <div id="sticky-header" class="hidden md:block z-[30]" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>

  ${MegaMenu()}

  <!-- Sticky compact mobile header (appears on scroll) -->
  ${TopDealsStickyMobileHeader()}

  <!-- Main Content -->
  <main x-data="topDealsPage">
    <!-- Mobile compact hero header (full-width, orange gradient) -->
    <div id="td-mobile-hero-sentinel">
      ${TopDealsMobileHeader()}
    </div>

    <!-- Hero + Promo (non-sticky, scrolls away) -->
    <section class="md:pt-6 lg:pt-8" style="background: var(--products-bg, #f9fafb);">
      <div class="container-boxed">
        <div class="hidden md:block">
          ${Breadcrumb(breadcrumbItems)}
        </div>
        ${TopDealsHero()}
        <div class="hidden md:block">
          ${TopDealsPromoBar()}
        </div>
      </div>
    </section>

    <!-- Sticky tabs + sub-filters bar (full-width, sticks below header) -->
    <div id="sticky-tabs" class="sticky top-0 z-20 bg-white transition-shadow duration-200">
      <div class="container-boxed">
        ${TopDealsCategoryTabs()}
        ${TopDealsSubFilters()}
      </div>
    </div>

    <!-- Product Grid -->
    <section class="pb-8 lg:pb-12" style="background: var(--products-bg, #f9fafb);">
      <div class="container-boxed">
        ${TopDealsGrid()}
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    ${FooterLinks()}
  </footer>

  <!-- Floating Panel -->
  ${FloatingPanel()}
`;

// Initialize
initMegaMenu();
initFlowbite();
startAlpine();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initCategoryTabs();
initAnimatedPlaceholder('#topbar-compact-search-input');

// Load products from API
initCurrency().then(() => searchListings({ page_size: 20 })).then(result => {
  if (result.products.length > 0) {
    // Update Alpine reactive data
    const mainEl = document.querySelector<HTMLElement>('[x-data="topDealsPage"]');
    if (mainEl && (mainEl as any)._x_dataStack) {
      const data = (mainEl as any)._x_dataStack[0];
      if (data) {
        data.allProducts = result.products.map(p => ({
          id: p.id || '',
          name: p.name,
          href: p.href || `/pages/product-detail.html?id=${p.id}`,
          price: p.price,
          imageKind: 'jewelry' as const,
          imageSrc: p.imageSrc || undefined,
          moq: p.moq || '1 adet',
          category: 'all',
        }));
      }
    }
  }
}).catch(err => console.warn('[TopDeals Page] API load failed:', err));

// Show/hide sticky compact mobile header based on hero visibility
const mobileHeroSentinel = document.getElementById('td-mobile-hero-sentinel');
const stickyMobileHeader = document.getElementById('td-sticky-mobile-header');
if (mobileHeroSentinel && stickyMobileHeader) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Hero is visible — hide sticky header
        stickyMobileHeader.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        stickyMobileHeader.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
      } else {
        // Hero scrolled away — show sticky header
        stickyMobileHeader.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        stickyMobileHeader.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      }
    },
    { threshold: 0 }
  );
  heroObserver.observe(mobileHeroSentinel);
}

// Add bottom border to sticky tabs when they become stuck
const stickyTabs = document.getElementById('sticky-tabs');
if (stickyTabs) {
  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  sentinel.style.width = '100%';
  sentinel.style.pointerEvents = 'none';
  stickyTabs.parentElement?.insertBefore(sentinel, stickyTabs);

  const observer = new IntersectionObserver(
    ([entry]) => {
      const isStuck = !entry.isIntersecting;
      stickyTabs.classList.toggle('shadow-sm', isStuck);
      stickyTabs.classList.toggle('border-b', isStuck);
      stickyTabs.classList.toggle('border-gray-200', isStuck);
    },
    { threshold: 0 }
  );
  observer.observe(sentinel);
}
