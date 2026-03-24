/**
 * Tailored Selections Page — Entry Point
 * Assembles header, hero carousel, product grid, and footer for the
 * Tailored Selections landing page (opened from homepage "View more" link).
 */

import '../style.css'
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

// Tailored Selections components
import { TailoredSelectionsHero, initTailoredSelectionsHero, TailoredProductGrid, renderTailoredProductCard } from '../components/tailored-selections'

// Services
import { searchListings } from '../services/listingService'
import { initCurrency } from '../services/currencyService'

// Data
import { getTailoredCategories } from '../data/mockTailoredSelections'
import type { TailoredProduct } from '../types/tailoredSelections'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'

/* ── Data ── */

// Hero categories are editorial content (curated images, descriptions, colors) — kept static
const categories = getTailoredCategories();
// Products are loaded from API below
const products: TailoredProduct[] = [];

/* ── Category Pills HTML ── */

const categoryPillsHtml = categories.map(cat => `
  <button class="ts-cat-pill flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 shrink-0 transition-colors" data-cat-id="${cat.id}">
    <img src="${cat.imageSrc}" alt="" class="w-7 h-7 rounded object-cover" loading="lazy" />
    <span class="whitespace-nowrap">${cat.title}</span>
  </button>
`).join('');

/* ── Breadcrumb ── */

const breadcrumbItems = [
  { label: t('tailoredPage.breadcrumbHome'), href: '/' },
  { label: t('tailoredPage.breadcrumb') },
];

/* ── Page Assembly ── */

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Scoped CSS for mobile header scroll states -->
  <style>
    /* Default: transparent header with white text/icons */
    #ts-mobile-header {
      background-color: transparent;
      border-bottom: 1px solid transparent;
    }
    #ts-mobile-header .ts-hdr-title { color: #fff; }
    #ts-mobile-header .ts-hdr-icon { color: #fff; }

    /* Scrolled: white header with dark text/icons */
    #ts-mobile-header.is-scrolled {
      background-color: #fff !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    #ts-mobile-header.is-scrolled .ts-hdr-title { color: #111827 !important; }
    #ts-mobile-header.is-scrolled .ts-hdr-icon { color: #374151 !important; }
  </style>

  <!-- Mobile Sticky Container (visible below xl:1280px) -->
  <div id="ts-mobile-sticky" class="sticky top-0 z-[30] xl:hidden">
    <!-- Mobile Header Bar -->
    <div id="ts-mobile-header" class="flex items-center justify-between px-3 py-2.5 lg:px-5 lg:py-3 transition-all duration-300">
      <a href="/" class="flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full transition-colors" aria-label="Back">
        <svg class="ts-hdr-icon w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </a>
      <h1 class="ts-hdr-title text-base lg:text-xl font-semibold transition-colors duration-300" data-i18n="tailoredPage.title">${t('tailoredPage.title')}</h1>
      <button class="flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full transition-colors" aria-label="Search">
        <svg class="ts-hdr-icon w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>
    </div>

    <!-- Category Pills (hidden initially, revealed on scroll past hero) -->
    <div id="ts-category-pills" class="overflow-x-auto bg-white border-b border-gray-200 scrollbar-hide" style="display:none;">
      <div class="flex gap-2 px-3 py-2">
        ${categoryPillsHtml}
      </div>
    </div>
  </div>

  <!-- Desktop Header (visible at xl:1280px+) -->
  <div id="sticky-header" class="sticky top-0 z-[30] hidden xl:block" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>

  ${MegaMenu()}

  <!-- Main Content -->
  <main>
    <!-- Hero Section with Category Carousel -->
    ${TailoredSelectionsHero(categories)}

    <!-- Products area: rounded top corners, overlaps hero bottom -->
    <div class="relative z-10 -mt-3 rounded-t-2xl" style="background: var(--products-bg, #f5f5f5);">
      <!-- Breadcrumb (desktop only) -->
      <div class="container-boxed pt-5 pb-2 hidden xl:block">
        ${Breadcrumb(breadcrumbItems)}
      </div>

      <!-- Product Grid -->
      ${TailoredProductGrid(products)}
    </div>
  </main>

  <!-- Footer -->
  <footer>
    ${FooterLinks()}
  </footer>

  <!-- Floating Panel -->
  ${FloatingPanel()}
`;

/* ── Initialization ── */

initMegaMenu();
initFlowbite();
startAlpine();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initTailoredSelectionsHero();
initAnimatedPlaceholder('#topbar-compact-search-input');
initTailoredScrollBehavior();

// Load products from API
initCurrency().then(() => searchListings({ page_size: 20 })).then(result => {
  if (result.products.length > 0) {
    // Hide empty state
    const emptyState = document.getElementById('ts-product-grid-empty');
    if (emptyState) emptyState.style.display = 'none';

    const grid = document.getElementById('ts-product-grid');
    if (grid) {
      grid.classList.remove('hidden');
      grid.innerHTML = result.products.map((p, i) => {
        const product: TailoredProduct = {
          id: p.id || '',
          name: p.name,
          href: p.href || `/pages/product-detail.html?id=${p.id}`,
          price: p.price,
          originalPrice: p.originalPrice || undefined,
          discountPercent: p.discount ? parseInt(p.discount) : undefined,
          moqCount: parseInt(p.moq) || 1,
          moqUnit: 'pcs',
          imageSrc: p.imageSrc || '',
          soldCount: p.stats?.replace(/[^\d.+K]/gi, '') || undefined,
          verifiedBadge: p.verified,
        };
        return renderTailoredProductCard(product, i);
      }).join('');
    }
  }
}).catch(err => console.warn('[TailoredSelections Page] API load failed:', err));

/* ── Scroll-based header & category pills behavior ── */

function initTailoredScrollBehavior(): void {
  const mobileHeader = document.getElementById('ts-mobile-header');
  const categoryPills = document.getElementById('ts-category-pills');
  const heroSection = document.getElementById('ts-hero-section');

  if (!mobileHeader || !categoryPills || !heroSection) return;

  // Pull hero section behind the transparent header so dark bg shows through
  const applyHeroOverlap = () => {
    if (window.innerWidth < 1280) {
      const headerH = mobileHeader.offsetHeight;
      heroSection.style.marginTop = `-${headerH}px`;
    } else {
      heroSection.style.marginTop = '0';
    }
  };

  applyHeroOverlap();
  window.addEventListener('resize', applyHeroOverlap);

  // Track states to avoid redundant DOM updates
  let wasScrolled = false;
  let werePillsVisible = false;

  const applyScrollState = () => {
    // Use getBoundingClientRect for reliable scroll detection
    const heroRect = heroSection.getBoundingClientRect();
    const headerH = mobileHeader.offsetHeight;

    // Header turns white as soon as hero starts scrolling up
    const isScrolled = heroRect.top < -10;
    // Category pills appear when hero is fully behind the header
    const showPills = heroRect.bottom <= headerH + 5;

    if (isScrolled !== wasScrolled) {
      wasScrolled = isScrolled;
      mobileHeader.classList.toggle('is-scrolled', isScrolled);
    }

    if (showPills !== werePillsVisible) {
      werePillsVisible = showPills;
      categoryPills.style.display = showPills ? '' : 'none';
    }
  };

  window.addEventListener('scroll', applyScrollState, { passive: true });
  applyScrollState(); // Initial check
}
