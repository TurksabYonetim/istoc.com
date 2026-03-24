/**
 * Product Detail Page — Entry Point
 * Assembles header, product detail sections, and footer.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'

// Header components (reuse from main page)
import { TopBar, initMobileDrawer, SubHeader, MegaMenu, initMegaMenu, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'

// Footer components
import { FooterLinks } from '../components/footer'

// Browsing history
import { saveToBrowsingHistory } from '../services/browsingHistoryService'

// Floating components
import { FloatingPanel } from '../components/floating'

// Alpine.js
import { startAlpine } from '../alpine'

// Shared components
import { Breadcrumb } from '../components/shared/Breadcrumb'

// Product detail components
import {
  ProductTitleBar,
  ProductImageGallery,
  ProductInfo,
  initProductInfo,
  ProductTabs,
  initProductTabs,
  initReviews,
  RelatedProducts,
  initRelatedProducts,
  initAttributesTab,
  ReviewsModal,
  LoginModal, showLoginModal,
  ShippingModal,
  initShippingModal,
  MobileProductLayout,
  initMobileLayout,
  CartDrawer,
  initCartDrawer,
} from '../components/product'
// Product data
import { getCurrentProduct, loadProduct } from '../alpine/product'
import { initCurrency } from '../services/currencyService'

// Utilities
import { initAnimatedPlaceholder } from '../utils/animatedPlaceholder'
import { t } from '../i18n'
import { isLoggedIn } from '../utils/auth'

// Favorites
import { openFavoritesDropdown, updateFavoriteButtons } from '../components/favorites/FavoritesDropdown'

// Read listing ID from URL
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('id');

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');

// Show loading state immediately
appEl.innerHTML = `
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>
  ${MegaMenu()}
  <main>
    <div class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-sm text-text-muted">Ürün yükleniyor...</span>
      </div>
    </div>
  </main>
  <footer>${FooterLinks()}</footer>
`;

// Initialize header immediately
initMegaMenu();
initFlowbite();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initAnimatedPlaceholder('#topbar-compact-search-input');

// Load product from API, then render the full page
async function renderProductPage() {
  // Initialize currency settings first
  await initCurrency();

  // Load real data from API
  if (listingId) {
    await loadProduct(listingId);
  }

  const product = getCurrentProduct();

  // Save to browsing history
  if (product.id && product.images.length > 0) {
    const priceRange = product.priceMin && product.priceMax
      ? `${product.priceMin.toFixed(2)}-${product.priceMax.toFixed(2)}`
      : product.priceMin
        ? `${product.priceMin.toFixed(2)}`
        : '';
    saveToBrowsingHistory({
      id: product.id,
      image: product.images[0].src,
      title: product.title,
      href: `/pages/product-detail.html?id=${product.id}`,
      price: product.priceMin ?? 0,
      currency: product.baseCurrency === 'USD' ? '$' : product.baseCurrency,
      minOrder: product.moq ? `Min. order: ${product.moq} ${product.unit || 'Pcs'}` : '',
      priceRange: priceRange ? `$${priceRange}` : '',
    });
  }

  // If no product loaded (no ID or API failed), show empty state
  if (!product.id) {
    appEl.innerHTML = `
      <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
        ${TopBar()}
        ${SubHeader()}
      </div>
      ${MegaMenu()}
      <main>
        <div class="flex items-center justify-center py-32">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            <h2 class="text-xl font-semibold text-gray-600 mb-2">Ürün bulunamadı</h2>
            <p class="text-gray-400 mb-4">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            <a href="/pages/products.html" class="text-primary hover:underline font-medium">Ürünlere gözat</a>
          </div>
        </div>
      </main>
      <footer>${FooterLinks()}</footer>
    `;
    initMegaMenu();
    initFlowbite();
    initHeaderCart();
    initMobileDrawer();
    initLanguageSelector();
    startAlpine();
    return;
  }

  // Build breadcrumb
  const pdCrumbs = product.category.slice(1).map((label: string, i: number, arr: string[]) => ({
    label,
    ...(i < arr.length - 1 ? { href: `products.html?q=${encodeURIComponent(label)}` } : {}),
  }));

  // Update page title
  document.title = product.title || 'iSTOC';

  // Render full product page
  appEl.innerHTML = `
    <!-- Sticky Header -->
    <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
      ${TopBar()}
      ${SubHeader()}
    </div>

    ${MegaMenu()}

    <!-- Main Content -->
    <main>
      <!-- DESKTOP LAYOUT -->
      <div id="pd-desktop-layout" class="hidden xl:block">
        <section style="background: var(--pd-bg, #ffffff);">
          <div class="container-boxed">
            <div id="pd-hero-grid" class="flex flex-col gap-5 pt-3 xl:grid xl:grid-cols-[1fr_340px] xl:gap-5 xl:items-start 2xl:grid-cols-[1fr_380px] 2xl:gap-6 3xl:grid-cols-[1fr_407px] 3xl:gap-7">
              <div id="pd-hero-left" class="w-full min-w-0">
                ${Breadcrumb(pdCrumbs)}
                ${ProductTitleBar()}
                <div id="pd-hero-gallery" class="w-full">
                  ${ProductImageGallery()}
                </div>
                ${RelatedProducts()}
                ${ProductTabs()}
              </div>
              <div id="pd-hero-info" class="w-full xl:flex xl:flex-col">
                ${ProductInfo()}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- MOBILE LAYOUT -->
      <div id="pd-mobile-layout" class="xl:hidden pb-20">
        ${MobileProductLayout()}
      </div>
    </main>

    <!-- Footer -->
    <footer>${FooterLinks()}</footer>

    <!-- Floating Panel -->
    ${FloatingPanel()}

    <!-- Modals / Drawers -->
    ${ReviewsModal()}
    ${LoginModal()}
    ${CartDrawer()}
    ${ShippingModal()}

    <!-- Mobile Sticky Bottom Bar -->
    <div id="pd-mobile-bar" class="xl:hidden grid grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-4 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] fixed bottom-0 left-0 right-0 z-100 bg-surface border-t border-border-default shadow-[0_-2px_10px_rgba(0,0,0,0.08)] overflow-hidden">
      <button type="button" id="pdm-bar-chat" class="pdm-bar-chat-btn w-12 h-11 border border-border-medium rounded-[22px] bg-surface flex items-center justify-center cursor-pointer text-text-body p-0" aria-label="Sohbet">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </button>
      <button type="button" id="pdm-bar-cart" data-add-to-cart="${product.id}" class="pdm-bar-cart-btn h-11 border border-[#222] rounded-[22px] bg-surface text-sm font-semibold text-text-heading cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis min-w-0">${t('product.addToCart')}</button>
      <button type="button" id="pdm-bar-order" class="pdm-bar-order-btn th-btn-dark th-btn-pill h-11 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">${t('product.startOrder')}</button>
    </div>
  `;

  // Re-initialize all behaviors after render
  initMegaMenu();
  initFlowbite();
  initHeaderCart();
  initMobileDrawer();
  initLanguageSelector();
  initAnimatedPlaceholder('#topbar-compact-search-input');

  // Product-specific inits
  initCartDrawer();
  initProductInfo();
  initProductTabs();
  initAttributesTab();
  initReviews();
  initShippingModal();
  initRelatedProducts();
  initMobileLayout();

  // Favorites
  initFavorites(product);

  // Start Alpine LAST
  startAlpine();

  console.info('[product-detail] Rendered product:', product.id, product.title);
}

// Execute render
renderProductPage();

/* ── Favorites logic ── */
function initFavorites(product = getCurrentProduct()): void {
  const productId = product.id;
  const productData = {
    id: productId,
    image: product.images[0]?.src || '',
    title: product.title,
    priceRange: `$${product.priceTiers[0]?.price || 0}`,
    minOrder: `Min. order: ${product.moq} ${product.unit}`,
  };

  updateFavoriteButtons(productId);

  document.querySelectorAll<HTMLButtonElement>('[data-favorite-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isLoggedIn()) {
        showLoginModal();
        return;
      }

      openFavoritesDropdown(btn, productData);
    });
  });

  window.addEventListener('favorites-changed', () => {
    updateFavoriteButtons(productId);
  });
}
