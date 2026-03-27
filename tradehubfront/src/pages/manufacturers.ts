import '../style.css'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'

// Header components
import { TopBar, MobileSearchTabs, initMobileDrawer, initStickyHeaderSearch, MegaMenu, initMegaMenu, PromoBanner, initPromoBanner } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'

// Shared components
import { Breadcrumb } from '../components/shared/Breadcrumb'

// Footer components
import { FooterLinks } from '../components/footer'

// Floating components
import { FloatingPanel } from '../components/floating'

// Alpine.js
import { startAlpine } from '../alpine'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'
import { initCurrency } from '../services/currencyService'

// Manufacturers specific components
import { ManufacturersLayout, initHorizontalCategoryBar, initCategoryFlyout, initFactorySliders } from '../components/manufacturers'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');

appEl.innerHTML = `
  <!-- Promo Banner -->
  ${PromoBanner()}

  <!-- Sticky Header (global, stays sticky across full page) -->
  <div id="sticky-header" class="sticky top-0 z-(--z-header) transition-colors duration-200" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
  </div>

  <!-- Mobile Search Tabs (Products | Manufacturers) — non-sticky -->
  ${MobileSearchTabs('manufacturers')}

  <!-- Mega Menu (fixed overlay, positioned by JS) -->
  ${MegaMenu()}

  <!-- Main Content -->
  <main class="flex-1 min-w-0 bg-[#f0f2f5] dark:bg-gray-900 pb-12">
    <div class="container-boxed">
      ${Breadcrumb([{ label: t('search.manufacturers') }])}
    </div>
    ${ManufacturersLayout()}
  </main>

  <!-- Footer Section -->
  <footer class="mt-auto">
    ${FooterLinks()}
  </footer>

  <!-- Floating Panel -->
  ${FloatingPanel()}
`

// Initialize promo banner
initPromoBanner();

// Initialize custom component behaviors FIRST (before Flowbite can interfere)
initMegaMenu();

// Initialize Flowbite for other interactive components
initFlowbite();

// Initialize Alpine.js (FloatingPanel is now Alpine-driven)
initCurrency();
startAlpine();

// Initialize remaining custom behaviors
initStickyHeaderSearch();
initMobileDrawer();
initLanguageSelector();
initAnimatedPlaceholder('#topbar-compact-search-input');

// Initialize Manufacturers specific behaviors if any
initHorizontalCategoryBar();
initCategoryFlyout();
initFactorySliders(); // async — satıcıları API'den çeker
