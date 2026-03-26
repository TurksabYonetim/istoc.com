/**
 * Cart Page — Entry Point
 * Assembles header, cart content, and footer.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { initStickyHeights } from '../utils/stickyHeights'
import { initCurrency, getSelectedCurrencyInfo } from '../services/currencyService'

// Header components (reuse from main page)
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

// Cart components
import { CartPage, initCartPage } from '../components/cart/page/CartPage'
import { cartStore } from '../components/cart/state/CartStore'
import { fetchCart, apiMergeGuestCart } from '../services/cartService'
import { getSessionUser } from '../utils/auth'
import { getMockAssuranceItems } from '../data/mockCart'

const assuranceItems = getMockAssuranceItems();

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');

function renderPage(suppliers: ReturnType<typeof cartStore.getSuppliers>, summary: ReturnType<typeof cartStore.getSummary>) {
  appEl.innerHTML = `
    <!-- Header -->
    <div id="sticky-header" class="relative bg-white border-b border-[#e5e5e5] w-full z-40">
      <div class="relative z-50 bg-white">
        ${TopBar()}
        ${SubHeader()}
      </div>
    </div>

    ${MegaMenu()}

    <!-- Main Content -->
    <main class="min-h-screen bg-surface relative z-10 pt-4 flex flex-col">
      <div class="container-boxed">
        ${Breadcrumb([{ label: 'Sepetim' }])}
      </div>

      <!-- Client-side Cart Container -->
      ${CartPage({ suppliers, summary, assuranceItems })}
    </main>

    <!-- Footer -->
    <footer class="relative z-10 mt-12 border-t border-border-default pt-12 pb-8 bg-white">
      <div class="container-boxed">
        ${FooterLinks()}
      </div>
    </footer>

    <!-- Floating Panel -->
    ${FloatingPanel()}
  `;

  initMegaMenu();
  initFlowbite();
  initMobileDrawer();
  initLanguageSelector();
  initStickyHeights();

  initCurrency().then(() => {
    initCartPage();
    initHeaderCart();
  });

  startAlpine();
}

function renderCartSkeleton(): void {
  const pulse = 'bg-gray-200 animate-pulse rounded';
  const skuRow = `
    <div class="grid grid-cols-[auto_92px_minmax(0,1fr)] gap-3 items-start p-3">
      <div class="pt-9"><div class="w-5 h-5 ${pulse}"></div></div>
      <div class="w-[92px] h-[92px] ${pulse}"></div>
      <div class="min-w-0 pt-1 space-y-2">
        <div class="h-4 ${pulse} w-2/3"></div>
        <div class="h-3 ${pulse} w-1/3"></div>
        <div class="mt-3 flex items-end justify-between gap-3">
          <div class="h-6 ${pulse} w-20"></div>
          <div class="h-10 ${pulse} w-[136px] rounded-full"></div>
        </div>
      </div>
    </div>`;

  appEl.innerHTML = `
    <!-- Header placeholder -->
    <div class="relative bg-white border-b border-[#e5e5e5] w-full z-40 h-[60px] flex items-center px-4 gap-4">
      <div class="h-8 w-24 ${pulse}"></div>
      <div class="flex-1 h-9 ${pulse} rounded-full max-w-xl"></div>
      <div class="flex gap-3 ml-auto">
        <div class="w-8 h-8 ${pulse} rounded-full"></div>
        <div class="w-8 h-8 ${pulse} rounded-full"></div>
        <div class="w-8 h-8 ${pulse} rounded-full"></div>
      </div>
    </div>

    <!-- Cart skeleton -->
    <main class="min-h-screen bg-surface relative z-10 pt-4 flex flex-col">
      <div class="max-w-[1640px] mx-auto px-(--space-page-x) py-4 sm:py-6 w-full">

        <!-- Title -->
        <div class="h-8 ${pulse} w-36 mb-5"></div>

        <!-- Batch bar -->
        <div class="h-12 ${pulse} rounded-lg mb-4"></div>

        <!-- Content -->
        <div class="flex flex-col xl:flex-row gap-5 items-start">

          <!-- Left: supplier cards -->
          <section class="w-full xl:min-w-0 xl:flex-1 space-y-4">
            <div class="rounded-3xl border border-[#e5e5e5] bg-white overflow-hidden">
              <!-- Supplier header -->
              <div class="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5]">
                <div class="w-5 h-5 ${pulse}"></div>
                <div class="h-5 ${pulse} w-28"></div>
                <div class="ml-auto h-9 ${pulse} rounded-full w-36"></div>
              </div>
              <!-- Product + SKUs -->
              <div class="px-5 pb-1">
                <div class="py-5">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-5 h-5 ${pulse} mt-1 shrink-0"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-5 ${pulse} w-48"></div>
                      <div class="h-3 ${pulse} w-24"></div>
                    </div>
                  </div>
                  ${skuRow}${skuRow}
                </div>
              </div>
            </div>
          </section>

          <!-- Right: summary -->
          <section class="w-full xl:w-[425px] self-start">
            <div class="p-8 bg-white border border-[#e5e5e5] rounded-lg space-y-4">
              <div class="h-6 ${pulse} w-44"></div>
              <div class="flex gap-2">
                <div class="w-16 h-16 ${pulse}"></div>
                <div class="w-16 h-16 ${pulse}"></div>
                <div class="w-16 h-16 ${pulse}"></div>
              </div>
              <div class="space-y-3 pt-2">
                <div class="flex justify-between">
                  <div class="h-4 ${pulse} w-28"></div>
                  <div class="h-4 ${pulse} w-20"></div>
                </div>
                <div class="flex justify-between">
                  <div class="h-4 ${pulse} w-20"></div>
                  <div class="h-4 ${pulse} w-16"></div>
                </div>
              </div>
              <div class="h-px bg-gray-200"></div>
              <div class="flex justify-between">
                <div class="h-5 ${pulse} w-32"></div>
                <div class="h-5 ${pulse} w-24"></div>
              </div>
              <div class="h-12 ${pulse} rounded-full w-full"></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  `;
}

async function initCartPage_async() {
  // 1) localStorage'dan yükle (hızlı, fallback)
  cartStore.load();
  const localSkuCount = cartStore.getTotalSkuCount();

  // Skeleton'ı hemen göster
  renderCartSkeleton();

  // 2) Para birimini yükle
  await initCurrency();
  const currencySymbol = getSelectedCurrencyInfo().symbol;

  try {
    // 3) Oturum kontrolü
    const sessionUser = await getSessionUser();

    if (sessionUser) {
      const apiCart = await fetchCart();

      if (apiCart.suppliers.length > 0) {
        // Backend'deki listing ID'leri
        const backendListingIds = new Set(
          apiCart.suppliers.flatMap(s => s.products.map(p => p.id))
        );

        // localStorage'da olup backend'de olmayan ürünler
        const localOnlyItems = cartStore.getSuppliers().flatMap(s =>
          s.products
            .filter(p => !backendListingIds.has(p.id))
            .flatMap(p =>
              p.skus.map(sku => ({
                listing: p.id,
                quantity: sku.quantity,
                ...(sku.listingVariant ? { listing_variant: sku.listingVariant } : {}),
              }))
            )
        );

        if (localOnlyItems.length > 0) {
          const merged = await apiMergeGuestCart(localOnlyItems);
          const mergedSkuCount = merged.suppliers.reduce(
            (acc, s) => acc + s.products.reduce((sum, p) => sum + p.skus.length, 0), 0
          );
          // Merge sonucu daha az SKU dönerse localStorage verisini koru
          if (mergedSkuCount >= localSkuCount) {
            cartStore.init(merged.suppliers, 0, currencySymbol, 0);
          }
        } else {
          cartStore.init(apiCart.suppliers, 0, currencySymbol, 0);
        }
      } else if (localSkuCount > 0) {
        // Backend boş, localStorage'da ürün var → merge et
        const localItems = cartStore.getSuppliers().flatMap(s =>
          s.products.flatMap(p =>
            p.skus.map(sku => ({
              listing: p.id,
              quantity: sku.quantity,
              ...(sku.listingVariant ? { listing_variant: sku.listingVariant } : {}),
            }))
          )
        );
        const merged = await apiMergeGuestCart(localItems);
        const mergedSkuCount = merged.suppliers.reduce(
          (acc, s) => acc + s.products.reduce((sum, p) => sum + p.skus.length, 0), 0
        );
        // Merge sonucu daha az SKU dönerse localStorage verisini koru
        if (mergedSkuCount >= localSkuCount) {
          cartStore.init(merged.suppliers, 0, currencySymbol, 0);
        }
      }
    }
  } catch {
    // API erişilemez ya da misafir kullanıcı — localStorage verisiyle devam et
  }

  renderPage(cartStore.getSuppliers(), cartStore.getSummary());
}

initCartPage_async();
