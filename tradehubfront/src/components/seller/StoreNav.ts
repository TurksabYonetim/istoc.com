/**
 * C2: Store Navigation Bar (Sticky)
 * Orange sticky nav with dropdowns, search, mobile hamburger
 */
import type { StoreNavData } from '../../types/seller/types';
import { t } from '../../i18n';

export function StoreNav(data: StoreNavData): string {
  const menuItems = data.items.map(item => {
    if (item.dropdownType === 'products') {
      return `
        <li class="relative group" x-data="{ open: false }" @mouseenter="open = true" @mouseleave="open = false">
          <button @click.prevent="setTab('products')" class="store-nav__item store-nav__item--dropdown flex items-center gap-1 px-5 py-3 text-(--store-nav-text) text-[14px] font-normal cursor-pointer bg-transparent border-none transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                  :aria-expanded="open" aria-haspopup="true">
            ${item.label}
            <svg class="w-3 h-3 text-white/70 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="store-nav__dropdown store-nav__dropdown--products absolute top-full left-0 bg-white shadow-(--shadow-md) rounded-b-(--radius-md) min-w-[280px] max-h-[400px] overflow-y-auto z-(--z-dropdown)"
               x-show="open" x-transition.opacity.duration.200ms style="display: none;"
               role="menu"
               aria-label="${t('seller.sf.productCategories')}">
            <div class="store-nav__dropdown-header bg-[#f3f4f6] px-4 py-1.5 text-[13px] font-bold text-[#374151]">
              ${t('seller.sf.productsDropdownHeader')}
            </div>
            <a href="#categories" @click.prevent="setTab('categories'); open = false;" class="store-nav__dropdown-link block px-4 py-2 text-[13px] text-(--store-accent) font-medium hover:bg-[#f3f4f6] transition-colors" role="menuitem">
              ${t('seller.sf.seeAllCategories')}
            </a>
            ${data.productCategories.map(cat => `
              <a href="#products" @click.prevent="setTab('products'); open = false;" class="store-nav__dropdown-item flex items-center justify-between px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors" role="menuitem">
                ${cat.name}
                ${cat.hasSubcategories ? `
                  <svg class="w-3 h-3 text-(--color-text-muted)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                ` : ''}
              </a>
            `).join('')}
          </div>
        </li>
      `;
    }

    if (item.dropdownType === 'company') {
      return `
        <li class="relative group" x-data="{ open: false }" @mouseenter="open = true" @mouseleave="open = false">
          <button @click.prevent="setTab('company')" class="store-nav__item store-nav__item--dropdown flex items-center gap-1 px-5 py-3 text-(--store-nav-text) text-[14px] font-normal cursor-pointer bg-transparent border-none transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                  :aria-expanded="open" aria-haspopup="true">
            ${item.label}
            <svg class="w-3 h-3 text-white/70 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="store-nav__dropdown store-nav__dropdown--company absolute top-full left-0 bg-white shadow-(--shadow-md) rounded-b-(--radius-md) min-w-[200px] z-(--z-dropdown)"
               x-show="open" x-transition.opacity.duration.200ms style="display: none;"
               role="menu"
               aria-label="${t('seller.sf.companyProfileMenu')}">
            ${data.companyProfileLinks.map(link => {
        const tabTarget = link.href.startsWith('#') ? link.href.substring(1) : '';
        const clickAction = tabTarget ? `@click.prevent="setTab('${tabTarget}'); open = false;"` : '';
        return `
              <a href="${link.href}" ${clickAction} class="store-nav__dropdown-item block px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors" role="menuitem">
                ${link.label}
              </a>
            `}).join('')}
          </div>
        </li>
      `;
    }

    // Regular menu item
    const rootTabTarget = item.href.startsWith('#') ? item.href.substring(1) : '';
    const clickAction = rootTabTarget ? `@click.prevent="setTab('${rootTabTarget}')"` : '';

    return `
      <li>
        <a href="${item.href}" ${clickAction}
           :class="activeTab === '${rootTabTarget}' ? 'store-nav__item store-nav__item--active block px-6 py-3 text-(--store-nav-text) text-[14px] font-semibold bg-(--store-nav-active-overlay) transition-colors' : 'store-nav__item block px-5 py-3 text-(--store-nav-text) text-[14px] font-normal transition-colors hover:bg-[rgba(255,255,255,0.1)]'"
           :aria-current="activeTab === '${rootTabTarget}' ? 'page' : undefined">
          ${item.label}
        </a>
      </li>
    `;
  }).join('');

  // Mobile menu items
  const mobileMenuItems = data.items.map(item => {
    if (item.dropdownType === 'products') {
      return `
        <li x-data="{ open: false }">
          <button @click="open = !open" class="store-nav__item store-nav__item--dropdown w-full flex items-center justify-between px-6 py-3 text-white text-[15px] font-normal bg-transparent border-none cursor-pointer"
                  :aria-expanded="open" aria-haspopup="true">
            ${item.label}
            <svg class="w-4 h-4 text-white/70 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="store-nav__dropdown store-nav__dropdown--products bg-white/10" x-show="open" x-collapse>
            <a href="#categories" @click.prevent="setTab('categories'); toggleMobileMenu();" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">${t('seller.sf.seeAllCategories')}</a>
            ${data.productCategories.map(cat => `
              <a href="#products" @click.prevent="setTab('products'); toggleMobileMenu();" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">${cat.name}</a>
            `).join('')}
          </div>
        </li>
      `;
    }
    if (item.dropdownType === 'company') {
      return `
        <li x-data="{ open: false }">
          <button @click="open = !open" class="store-nav__item store-nav__item--dropdown w-full flex items-center justify-between px-6 py-3 text-white text-[15px] font-normal bg-transparent border-none cursor-pointer"
                  :aria-expanded="open" aria-haspopup="true">
            ${item.label}
            <svg class="w-4 h-4 text-white/70 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="store-nav__dropdown store-nav__dropdown--company bg-white/10" x-show="open" x-collapse>
            ${data.companyProfileLinks.map(link => {
        const tabTarget = link.href.startsWith('#') ? link.href.substring(1) : '';
        const clickAction = tabTarget ? `@click.prevent="setTab('${tabTarget}'); toggleMobileMenu();"` : '';
        return `
              <a href="${link.href}" ${clickAction} class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">${link.label}</a>
            `}).join('')}
          </div>
        </li>
      `;
    }

    // Regular mobile menu item
    const rootTabTarget = item.href.startsWith('#') ? item.href.substring(1) : '';
    const clickAction = rootTabTarget ? `@click.prevent="setTab('${rootTabTarget}'); toggleMobileMenu();"` : '';
    return `
      <li>
        <a href="${item.href}" ${clickAction} 
           :class="activeTab === '${rootTabTarget}' ? 'store-nav__item store-nav__item--active block px-6 py-3 text-white text-[15px] font-semibold bg-(--store-nav-active-overlay)' : 'store-nav__item block px-6 py-3 text-white text-[15px] font-normal hover:bg-white/5'" 
           class="transition-colors"
           :aria-current="activeTab === '${rootTabTarget}' ? 'page' : undefined">
          ${item.label}
        </a>
      </li>
    `;
  }).join('');

  return `
    <nav id="store-nav" class="store-nav sticky top-0 z-(--z-sticky) bg-(--store-nav-bg) transition-shadow duration-200" aria-label="${t('seller.sf.storeNavigation')}">
      <div class="store-nav__container max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8 flex items-center justify-between">

        <!-- Hamburger (mobile/tablet) -->
        <button class="store-nav__hamburger xl:hidden text-white p-2 bg-transparent border-none cursor-pointer"
                @click="toggleMobileMenu()"
                aria-label="${t('seller.sf.toggleMenu')}" :aria-expanded="mobileMenuOpen" aria-controls="store-nav-mobile-menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Desktop Menu -->
        <ul class="store-nav__menu hidden xl:flex items-center list-none m-0 p-0">
          ${menuItems}
        </ul>

        <!-- Desktop Search -->
        <div class="store-nav__search relative hidden xl:block">
          <input type="text"
                 class="store-nav__search-input bg-gray-50 border border-gray-300 rounded-full px-4 py-1.5 pr-9 text-[13px] text-[#374151] placeholder-gray-400 w-[250px] outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                 placeholder="${data.searchPlaceholder}"
                 aria-label="${t('seller.sf.storeSearch')}" />
          <svg class="store-nav__search-icon absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-primary-500 transition-colors"
               fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

      <!-- Mobile Panel -->
      <div id="store-nav-mobile-menu" x-show="mobileMenuOpen" x-transition.opacity.duration.300ms style="display: none;" class="store-nav__mobile-menu xl:hidden bg-(--store-nav-bg) border-t border-white/10">
        <!-- Mobile Search -->
        <div class="store-nav__mobile-search px-4 py-3">
          <div class="relative w-full">
            <input type="text"
                   class="store-nav__search-input w-full bg-gray-50 border border-gray-300 rounded-full px-4 py-2 pr-9 text-[14px] text-[#374151] placeholder-gray-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                   placeholder="${data.searchPlaceholder}"
                   aria-label="${t('seller.sf.storeSearch')}" />
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                 fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>
        <!-- Mobile Menu Items -->
        <ul class="store-nav__mobile-list list-none m-0 p-0">
          ${mobileMenuItems}
        </ul>
      </div>
    </nav>
  `;
}
