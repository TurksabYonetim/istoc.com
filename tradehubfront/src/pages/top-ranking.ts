/**
 * Top Ranking Page — Entry Point
 * Assembles header, hero banner, filter dropdowns, category tabs,
 * sort pills, ranking grid, and footer for the Top Ranking landing page.
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

// Top Ranking components
import {
  TopRankingHero,
  TopRankingMobileHeader,
  TopRankingStickyMobileHeader,
  TopRankingCategoryTabs,
  TopRankingSortPills,
  TopRankingGrid,
  initRankingCategoryTabs,
} from '../components/top-ranking'
import { renderRankingGroupCard } from '../components/top-ranking/TopRankingGrid'

// Services
import { searchListings } from '../services/listingService'
import { initCurrency } from '../services/currencyService'

// Data (types only)
import type { RankingCategoryGroup } from '../types/topRanking'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'

/* ── Alpine Data Registration ── */

const allGroups: RankingCategoryGroup[] = [];
const GROUPS_PER_PAGE = 12;

Alpine.data('topRankingPage', () => ({
  // Filter state
  activeRegion: 'europe' as string,
  activeTab: 'all',
  activeSort: 'hot-selling',

  // Dropdown state (desktop)
  regionDropdownOpen: false,
  categoryDropdownOpen: false,
  pendingRegion: 'europe' as string,

  // Category dropdown navigation
  categoryDropdownLevel: 1 as 1 | 2,
  selectedMainCategory: null as string | null,
  pendingSubCategory: null as string | null,

  // Mobile bottom sheet state
  showRegionSheet: false,
  showCategorySheet: false,
  showTabSheet: false,

  // Tab scroll state
  canScrollLeft: false,
  canScrollRight: true,

  // Pagination
  visibleGroupCount: GROUPS_PER_PAGE,

  // Static data
  allGroups: allGroups,

  get filteredGroups(): RankingCategoryGroup[] {
    let groups = this.allGroups;

    // Filter by tab
    if (this.activeTab !== 'all') {
      groups = groups.filter(g => g.categoryId === this.activeTab);
    }

    // Filter by selected main category from dropdown
    if (this.selectedMainCategory) {
      groups = groups.filter(g => g.categoryId === this.selectedMainCategory);
    }

    return groups;
  },

  get visibleGroups(): RankingCategoryGroup[] {
    return this.filteredGroups.slice(0, this.visibleGroupCount);
  },

  setTab(tabId: string) {
    this.activeTab = tabId;
    this.visibleGroupCount = GROUPS_PER_PAGE;
  },

  setSort(sortMode: string) {
    this.activeSort = sortMode;
  },

  loadMore() {
    this.visibleGroupCount += GROUPS_PER_PAGE;
  },

  renderGroupCard(group: RankingCategoryGroup): string {
    return renderRankingGroupCard(group);
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

  // Region dropdown
  applyRegion() {
    this.activeRegion = this.pendingRegion;
    this.regionDropdownOpen = false;
  },

  // Category dropdown
  openCategoryLevel2(mainCatId: string) {
    this.selectedMainCategory = mainCatId;
    this.pendingSubCategory = null;
    this.categoryDropdownLevel = 2;
  },

  goBackToLevel1() {
    this.categoryDropdownLevel = 1;
  },

  applyCategoryFilter() {
    this.activeTab = this.selectedMainCategory || 'all';
    this.categoryDropdownOpen = false;
    this.categoryDropdownLevel = 1;
    this.visibleGroupCount = GROUPS_PER_PAGE;
  },

  // i18n helper for Alpine templates
  $t(key: string): string {
    return t(key);
  },
}));

/* ── Page Assembly ── */

const breadcrumbItems = [
  { label: t('topRankingPage.breadcrumb') },
];

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Header (desktop only — mobile uses compact hero header) -->
  <div id="sticky-header" class="hidden lg:block z-[30]" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>

  ${MegaMenu()}

  <!-- Sticky compact mobile header (appears on scroll) -->
  ${TopRankingStickyMobileHeader()}

  <!-- Main Content -->
  <main x-data="topRankingPage">
    <!-- Mobile compact hero header (scrolls with content) -->
    <div id="tr-mobile-hero-sentinel">
      ${TopRankingMobileHeader()}
    </div>

    <!-- Hero (full-width background with breadcrumb inside) -->
    <section class="relative z-20" style="background: linear-gradient(0deg, var(--color-primary-100, #fdf0c3) 1%, var(--color-primary-50, #fef9e7) 100%);">
      <!-- Decorative circles (desktop only) -->
      <div class="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-10 left-[5%] w-48 h-48 rounded-full bg-primary-200/20"></div>
        <div class="absolute top-1/3 right-[3%] w-36 h-36 rounded-full bg-primary-200/15"></div>
      </div>
      <!-- Breadcrumb (desktop only) -->
      <div class="hidden lg:block relative z-10 container-boxed pt-2 lg:pt-3">
        ${Breadcrumb(breadcrumbItems)}
      </div>
      ${TopRankingHero()}
    </section>

    <!-- Category tabs (scrolls away on mobile, sticky on desktop) -->
    <div id="tr-category-tabs" class="bg-surface">
      <div class="container-boxed">
        ${TopRankingCategoryTabs()}
      </div>
    </div>

    <!-- Sort pills (always sticky) -->
    <div id="sticky-tabs" class="sticky top-0 z-10 bg-surface transition-shadow duration-200">
      <div class="container-boxed">
        ${TopRankingSortPills()}
      </div>
    </div>

    <!-- Ranking Grid -->
    <section class="pb-8 lg:pb-12" style="background: var(--products-bg, #f9fafb);">
      <div class="container-boxed">
        ${TopRankingGrid()}
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
initRankingCategoryTabs();
initAnimatedPlaceholder('#topbar-compact-search-input');

// Load products from API and group them into ranking groups
initCurrency().then(() => searchListings({ page_size: 20 })).then(result => {
  if (result.products.length >= 3) {
    // Group products into ranking groups of 3
    const groups: RankingCategoryGroup[] = [];
    for (let i = 0; i + 2 < result.products.length; i += 3) {
      const groupProducts = result.products.slice(i, i + 3);
      const cat = (groupProducts[0] as any).category || 'Diger';
      groups.push({
        id: `rg-api-${i}`,
        name: cat,
        nameKey: '',
        categoryId: 'all',
        products: groupProducts.map((p, idx) => ({
          id: p.id || `rp-${i + idx}`,
          name: p.name,
          href: p.href || `/pages/product-detail.html?id=${p.id}`,
          price: p.price,
          imageSrc: p.imageSrc || '',
          moq: p.moq || '1 adet',
          rank: (idx + 1) as 1 | 2 | 3,
        })),
      });
    }

    if (groups.length > 0) {
      const mainEl = document.querySelector<HTMLElement>('[x-data="topRankingPage"]');
      if (mainEl && (mainEl as any)._x_dataStack) {
        const data = (mainEl as any)._x_dataStack[0];
        if (data) {
          data.allGroups = groups;
        }
      }
    }
  }
}).catch(err => console.warn('[TopRanking Page] API load failed:', err));

// Show/hide sticky compact mobile header based on hero visibility
// Also adjust sort pills sticky position when mobile header appears
const mobileHeroSentinel = document.getElementById('tr-mobile-hero-sentinel');
const stickyMobileHeader = document.getElementById('tr-sticky-mobile-header');
const stickyPills = document.getElementById('sticky-tabs');

if (mobileHeroSentinel && stickyMobileHeader) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Hero is visible — hide sticky header
        stickyMobileHeader.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        stickyMobileHeader.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        // Reset sort pills to top:0
        if (stickyPills && window.innerWidth < 1024) {
          stickyPills.style.top = '0px';
        }
      } else {
        // Hero scrolled away — show sticky header
        stickyMobileHeader.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        stickyMobileHeader.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        // Push sort pills below sticky mobile header
        if (stickyPills && window.innerWidth < 1024) {
          const headerHeight = stickyMobileHeader.offsetHeight;
          stickyPills.style.top = headerHeight + 'px';
        }
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
