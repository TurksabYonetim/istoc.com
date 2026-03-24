import './style.css'
import { initFlowbite } from 'flowbite'

// i18n
import { initLanguageSelector } from './components/header/TopBar'

// Header components
import { TopBar, MobileSearchTabs, initMobileDrawer, SubHeader, initStickyHeaderSearch, MegaMenu, initMegaMenu, initHeaderCart } from './components/header'

// Hero components
import {
  CategoryBrowse,
  initCategoryBrowse,
  RecommendationSlider,
  initRecommendationSlider,
  HeroSideBannerSlider,
  initHeroSideBannerSlider,
  MobileCategoryBar,
  initMobileCategoryBar,
  TopDeals,
  initTopDeals,
  TopRanking,
  initTopRanking,
  TailoredSelections,
  initTailoredSelections,
  ProductGrid,
  initProductGrid,
} from './components/hero'

// Footer components
import { FooterLinks } from './components/footer'

// Floating components
import { FloatingPanel } from './components/floating'

// Alpine.js
import { startAlpine } from './alpine'

// Utilities
import { initAnimatedPlaceholder } from './utils/animatedPlaceholder'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Sticky Header (global, stays sticky across full page) -->
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>

  <!-- Mobile Search Tabs (Products | Manufacturers) — non-sticky -->
  ${MobileSearchTabs('products', { hideWorldwide: true })}

  <!-- Mobile Category Bar (Alibaba-style, mobile/tablet only) -->
  ${MobileCategoryBar()}

  <!-- Mega Menu (fixed overlay, positioned by JS) -->
  ${MegaMenu()}

  <!-- Main Content -->
  <main>
    <!-- Hero: Categories + Recommendation Slider + Right Banner Slider -->
    <section class="pt-1 pb-2 xl:py-6" aria-label="Browse categories and recommendations">
      <div class="container-boxed">
        <div class="flex flex-col xl:flex-row gap-(--space-card-gap) items-stretch">
          <div class="hidden xl:block xl:w-[300px] xl:flex-shrink-0">
            ${CategoryBrowse()}
          </div>
          <div class="h-[200px] sm:h-[260px] xl:h-[300px] flex-1 min-w-0">
            ${RecommendationSlider()}
          </div>
          <div class="hidden h-[300px] xl:block xl:w-[340px] xl:flex-shrink-0">
            ${HeroSideBannerSlider()}
          </div>
        </div>
      </div>
    </section>

    <!-- Top Deals Section -->
    ${TopDeals()}

    <!-- Top Ranking Section -->
    ${TopRanking()}

    <!-- Tailored Selections Section -->
    ${TailoredSelections()}

    <!-- Product Grid Section -->
    ${ProductGrid()}
  </main>

  <!-- Footer Section -->
  <footer>
    ${FooterLinks()}
  </footer>

  <!-- Floating Panel -->
  ${FloatingPanel()}

`

// Initialize custom component behaviors FIRST (before Flowbite can interfere)
initMegaMenu();

// Initialize Flowbite for other interactive components
initFlowbite();

// Initialize Alpine.js (FloatingPanel is now Alpine-driven)
startAlpine();

// Initialize remaining custom behaviors
initStickyHeaderSearch();
initCategoryBrowse();
initMobileCategoryBar();
initRecommendationSlider();
initHeroSideBannerSlider();

initTopDeals();
initTopRanking();
initTailoredSelections();
initProductGrid();

initMobileDrawer();
initHeaderCart();
initLanguageSelector();
initAnimatedPlaceholder('#topbar-compact-search-input');
