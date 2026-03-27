/**
 * Categories Page — Entry Point
 * Assembles header, Amazon-style category grid, and footer.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'

// Header components
import { TopBar, initMobileDrawer, SubHeader, initStickyHeaderSearch, MegaMenu, initMegaMenu, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'

// Footer components
import { FooterLinks } from '../components/footer'

// Floating components
import { FloatingPanel } from '../components/floating'

// Alpine.js
import { startAlpine } from '../alpine'

// Shared components
import { Breadcrumb } from '../components/shared/Breadcrumb'

// Categories components
import { renderCategoryPage, CategoryFilterSidebar, initCategoryFilters } from '../components/categories'

// Category data (type only — no longer used for rendering)
import type { CategorySection } from '../data/categories'

// API utility
import { callMethod } from '../utils/api'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'

// API response type from get_mega_menu
interface ApiCat {
  id: string; name: string; slug: string; image?: string; icon_class?: string;
  children: { id: string; name: string; slug: string; image?: string }[];
}

function mapApiToSections(cats: ApiCat[]): CategorySection[] {
  return cats.map(cat => ({
    title: cat.name,
    slug: cat.slug,
    categories: cat.children.map(ch => ({
      id: ch.id,
      name: ch.name,
      href: `/pages/products.html?cat=${ch.slug}`,
      image: ch.image || '',
      subcategories: [],
    })),
  }));
}

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.innerHTML = `
  <!-- Sticky Header -->
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>

  ${MegaMenu()}

  <!-- Main Content -->
  <main>
    <section class="py-4 lg:py-8" style="background: var(--products-bg, #f9fafb);">
      <div class="container-boxed">
        ${Breadcrumb([{ label: t('drawer.categories') }])}

        <!-- Page Header -->
        <div class="mb-4">
          <h1 class="text-lg sm:text-2xl font-bold text-gray-900" data-i18n="subheader.allCategories">${t('subheader.allCategories')}</h1>
          <p class="text-xs sm:text-sm text-gray-500 mt-1" data-i18n="drawer.browseCategories">${t('drawer.browseCategories')}</p>
        </div>

        <!-- Main layout: Filter Sidebar + Category Grid -->
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <!-- Filter Sidebar (hidden on mobile) -->
          <div id="cat-sidebar-container" class="hidden lg:block">
            <div class="w-56 shrink-0"><div class="sticky top-24"><div class="bg-white rounded-lg border border-gray-200 p-4 h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Yükleniyor…</div></div></div>
          </div>

          <!-- Category Grid -->
          <div id="cat-grid-container" class="flex-1 min-w-0">
            <div class="py-16 text-center text-gray-400 animate-pulse">Kategoriler yükleniyor…</div>
          </div>
        </div>
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

// Initialize custom component behaviors
initMegaMenu();
initFlowbite();
startAlpine();
initStickyHeaderSearch();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initAnimatedPlaceholder('#topbar-compact-search-input');
initCategoryFilters();

// Fetch categories from the same API as MegaMenu and render dynamically
(async () => {
  try {
    const apiCats = await callMethod('tradehub_core.api.category.get_mega_menu') as ApiCat[];
    const sections = mapApiToSections(apiCats);

    const sidebarEl = document.getElementById('cat-sidebar-container');
    const gridEl = document.getElementById('cat-grid-container');
    if (sidebarEl) sidebarEl.innerHTML = CategoryFilterSidebar(sections);
    if (gridEl) gridEl.innerHTML = renderCategoryPage(sections);

    initCategoryFilters();
  } catch (err) {
    console.error('Kategori verisi alınamadı:', err);
    const gridEl = document.getElementById('cat-grid-container');
    if (gridEl) gridEl.innerHTML = `<div class="py-16 text-center text-red-400">Kategoriler yüklenemedi.</div>`;
  }
})();
