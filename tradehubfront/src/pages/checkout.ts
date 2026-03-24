/**
 * Checkout Page — Entry Point
 * Assembles header, checkout content, and footer.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'
import { getBaseUrl } from '../utils/url'
import { initCurrency } from '../services/currencyService'
import { isLoggedIn } from '../utils/auth'
import { apiCreateOrder, apiValidateCoupon, fetchShippingMethodsForListing } from '../services/cartService'
import type { ListingShippingMethod } from '../services/cartService'
import { showToast } from '../utils/toast'

// Header components (reuse from main page)
import { TopBar, initMobileDrawer, SubHeader, initStickyHeaderSearch, MegaMenu, initMegaMenu, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'

// Shared components
import { Breadcrumb } from '../components/shared/Breadcrumb'

// Footer components
import { FooterLinks } from '../components/footer'

// Floating components
import { FloatingPanel } from '../components/floating'

// Alpine.js
import { startAlpine } from '../alpine'

// Checkout components
import { CheckoutHeader, CheckoutLayout, ShippingAddressForm, OrderSummary, PaymentMethodSection, ItemsDeliverySection, OrderProtectionModal, OrderReviewModal } from '../components/checkout'
import { protectionSummaryItems, tradeAssuranceText, modalSections, paymentIcons, infoBoxBullets } from '../data/mockCheckout'
import { cartStore } from '../components/cart/state/CartStore'
import { getSelectedCurrencyInfo } from '../services/currencyService'
import type { OrderSummary as OrderSummaryData } from '../types/checkout'
import type { CartProduct, CartSku, CartShippingMethod } from '../types/cart'
import type { CheckoutDeliveryOrderGroup, CheckoutDeliveryMethod } from '../components/checkout'
import { initStickyHeights } from '../utils/stickyHeights'
import { orderStore } from '../components/orders/state/OrderStore'
import type { Order } from '../types/order'

// Expose coupon validator for Alpine component
(window as unknown as Record<string, unknown>).__validateCoupon = apiValidateCoupon;

// Sample mode detection
const isSampleMode = new URLSearchParams(window.location.search).get('mode') === 'sample';

interface SampleOrderData {
  productId: string;
  title: string;
  supplierName: string;
  samplePrice: number;
  unit: string;
  color: { id: string; label: string; imageUrl?: string } | null;
  quantity: number;
  shippingMethods?: CartShippingMethod[];
}

let sampleOrderData: SampleOrderData | null = null;

if (isSampleMode) {
  try {
    const raw = localStorage.getItem('tradehub_sample_order');
    if (raw) sampleOrderData = JSON.parse(raw) as SampleOrderData;
  } catch { /* ignore */ }
  if (!sampleOrderData) {
    window.location.replace('/');
  }
}

// CartStore'dan checkout order summary oluştur
cartStore.load();
if (cartStore.hasSelectedSkuMoqViolation()) {
  window.location.replace('/pages/cart.html');
}

const cartSummary = cartStore.getSummary();

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function buildProductCard(product: CartProduct): { card: CheckoutDeliveryOrderGroup['products'][number] | null; subtotal: number } {
  const selectedSkus = product.skus.filter((sku) => sku.selected);
  if (selectedSkus.length === 0) return { card: null, subtotal: 0 };

  const skuLines = selectedSkus.map((sku: CartSku) => ({
    id: sku.id,
    image: sku.skuImage,
    variantText: sku.variantText,
    unitPrice: sku.unitPrice,
    quantity: sku.quantity,
    listingVariant: sku.listingVariant,
  }));

  const subtotal = selectedSkus.reduce((sum, sku) => sum + (sku.unitPrice * sku.quantity), 0);
  const image = selectedSkus[0]?.skuImage || '';

  return {
    subtotal,
    card: {
      id: product.id,
      title: product.title,
      moqLabel: product.moqLabel,
      image,
      skuLines,
    },
  };
}

/** Backend'den her tedarikçinin listing kargo yöntemlerini çekip supplierShippingMethods'u doldurur */
async function enrichMissingShippingMethods(): Promise<void> {
  if (isSampleMode) return;

  const suppliers = cartStore.getSuppliers();
  const selectedSuppliers = suppliers.filter((s) =>
    s.products.some((p) => p.skus.some((sku) => sku.selected))
  );

  await Promise.all(
    selectedSuppliers.map(async (supplier) => {
      const selectedProducts = supplier.products.filter((p) =>
        p.skus.some((sku) => sku.selected)
      );

      // Her listing için kargo yöntemlerini paralel çek
      const allMethodsPerListing = await Promise.all(
        selectedProducts.map((p) =>
          fetchShippingMethodsForListing(p.id).catch(() => [] as ListingShippingMethod[])
        )
      );

      // Aynı method id'si için max maliyet al (birden fazla listing varsa birleştir)
      const methodMap = new Map<string, ListingShippingMethod>();
      for (const methods of allMethodsPerListing) {
        for (const m of methods) {
          const existing = methodMap.get(m.id);
          if (!existing || m.cost > existing.cost) {
            methodMap.set(m.id, m);
          }
        }
      }

      if (methodMap.size === 0) return; // Kargo tanımlanmamış → fallback devreye girer

      const now = new Date();
      const deliveryMethods: CheckoutDeliveryMethod[] = Array.from(methodMap.values()).map((m, i) => {
        let etaLabel: string;
        if (m.minDays && m.maxDays) {
          const start = addDays(now, m.minDays);
          const end = addDays(now, m.maxDays);
          etaLabel = `${m.method} – Estimated delivery by ${formatMonthDay(start)}-${formatMonthDay(end)}`;
        } else {
          etaLabel = m.method;
        }
        return {
          id: `method-${supplier.id}-${m.id}`,
          etaLabel,
          shippingFee: m.cost,
          isDefault: i === 0,
        };
      });

      supplierShippingMethods[supplier.id] = deliveryMethods;
    })
  );
}

/** Build delivery orders for sample mode checkout */
function buildSampleDeliveryOrders(): CheckoutDeliveryOrderGroup[] {
  if (!sampleOrderData) return [];
  const now = new Date();
  return [{
    orderId: 'order-sample-1',
    orderLabel: 'Sample Order',
    sellerId: '',
    sellerName: sampleOrderData.supplierName,
    methods: sampleOrderData.shippingMethods?.map((sm, i) => ({
      id: sm.id || `sample-method-${i}`,
      etaLabel: `${sm.method} (${sm.estimatedDays})`,
      shippingFee: sm.baseCost,
      isDefault: i === 0,
    })) ?? [{
      id: 'sample-method-default',
      etaLabel: `Estimated delivery by ${formatMonthDay(addDays(now, 10))}-${formatMonthDay(addDays(now, 20))}`,
      shippingFee: 5,
      isDefault: true,
    }],
    products: [{
      id: sampleOrderData.productId,
      title: sampleOrderData.title,
      moqLabel: '1 pc',
      image: sampleOrderData.color?.imageUrl || '',
      skuLines: [{
        id: `sample-sku-${sampleOrderData.productId}`,
        image: sampleOrderData.color?.imageUrl || '',
        variantText: sampleOrderData.color?.label || '',
        unitPrice: sampleOrderData.samplePrice,
        quantity: sampleOrderData.quantity,
      }],
    }],
  }];
}

function buildDeliveryOrders(): CheckoutDeliveryOrderGroup[] {
  const suppliers = cartStore.getSuppliers();
  const selectedSuppliers = suppliers
    .map((supplier) => {
      const products = supplier.products
        .map((product) => buildProductCard(product))
        .filter((row): row is { card: CheckoutDeliveryOrderGroup['products'][number]; subtotal: number } => Boolean(row.card));

      const subtotal = products.reduce((sum, row) => sum + row.subtotal, 0);
      return {
        supplier,
        subtotal,
        products: products.map((row) => row.card),
      };
    })
    .filter((row) => row.subtotal > 0 && row.products.length > 0);

  if (selectedSuppliers.length === 0) return [];

  const subtotalTotal = selectedSuppliers.reduce((sum, row) => sum + row.subtotal, 0);
  const now = new Date();

  return selectedSuppliers.map((row, index) => {
    // Backend'den çekilen gerçek kargo yöntemlerini kullan; yoksa fallback
    const fetchedMethods = supplierShippingMethods[row.supplier.id];
    let methods: CheckoutDeliveryMethod[];

    if (fetchedMethods && fetchedMethods.length > 0) {
      methods = fetchedMethods;
    } else {
      // Fallback: listing'de kargo tanımlanmamışsa hesaplanmış tahmini değerler
      const shippingShare = subtotalTotal > 0 ? (cartSummary.shippingFee * row.subtotal) / subtotalTotal : 0;
      const method1Fee = Number(Math.max(5, shippingShare).toFixed(2));
      const method2Fee = Number(Math.max(method1Fee + 5, shippingShare * 1.35).toFixed(2));
      const start1 = addDays(now, 10 + (index * 2));
      const end1 = addDays(now, 24 + (index * 2));
      const start2 = addDays(now, 14 + (index * 2));
      const end2 = addDays(now, 24 + (index * 2));
      methods = [
        {
          id: `method-${row.supplier.id}-1`,
          etaLabel: `Estimated delivery by ${formatMonthDay(start1)}-${formatMonthDay(end1)}`,
          shippingFee: method1Fee,
          isDefault: true,
        },
        {
          id: `method-${row.supplier.id}-2`,
          etaLabel: `Estimated delivery by ${formatMonthDay(start2)}-${formatMonthDay(end2)}`,
          shippingFee: method2Fee,
        },
      ];
    }

    return {
      orderId: `order-${index + 1}`,
      orderLabel: `Order ${index + 1}`,
      sellerId: row.supplier.id,
      sellerName: row.supplier.name,
      methods,
      products: row.products,
    };
  });
}

// Tedarikçi bazlı gerçek kargo yöntemleri — enrichMissingShippingMethods ile doldurulur
const supplierShippingMethods: Record<string, CheckoutDeliveryMethod[]> = {};

// Modül düzeyinde tutulan checkout durumu — renderCheckout sonrası doldurulur
let checkoutDeliveryOrders: CheckoutDeliveryOrderGroup[] = [];
let currentDefaultShippingFee = 0;
let currentCheckoutOrderSummary: OrderSummaryData | null = null;

// Seçili kargo yöntemi ve kargo ücreti takibi
let selectedShippingMethodByOrderId: Record<string, string> = {};
let currentShippingFee = 0;
window.addEventListener('checkout:shipping-updated', (e: Event) => {
  const detail = (e as CustomEvent<{ shippingFee?: number; selectedMethodByOrderId?: Record<string, string> }>).detail;
  if (typeof detail?.shippingFee === 'number') currentShippingFee = detail.shippingFee;
  if (detail?.selectedMethodByOrderId) selectedShippingMethodByOrderId = { ...detail.selectedMethodByOrderId };
});

// Kupon takibi — Alpine'ın checkout:coupon-updated event'inden güncellenir
let currentCouponApplied: { code: string; type: string; value: number; description: string } | null = null;
let currentCouponDiscount = 0;
window.addEventListener('checkout:coupon-updated', (e: Event) => {
  const detail = (e as CustomEvent<{ coupon: typeof currentCouponApplied; couponDiscount: number }>).detail;
  currentCouponApplied = detail?.coupon ?? null;
  currentCouponDiscount = detail?.couponDiscount ?? 0;
});

// Tedarikçi notları takibi — Alpine'ın checkout:notes-updated event'inden güncellenir
let currentSupplierNotes: Record<string, string> = {};
window.addEventListener('checkout:notes-updated', (e: Event) => {
  const detail = (e as CustomEvent<{ notesByOrderId: Record<string, string> }>).detail;
  if (detail?.notesByOrderId) currentSupplierNotes = { ...detail.notesByOrderId };
});

// Build Order objects from checkout data
function buildOrdersFromCheckout(
  paymentMethod: string,
  shippingAddressStr = '',
  backendOrderNumbers: string[] = [],
): Order[] {
  const now = Date.now();
  const dateStr = new Date().toLocaleDateString('tr-TR', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return checkoutDeliveryOrders.map((deliveryOrder, idx) => {
    const supplier = cartStore.getSupplier(deliveryOrder.sellerId);
    const selectedMethodId = selectedShippingMethodByOrderId[deliveryOrder.orderId];
    const selectedMethod = (selectedMethodId
      ? deliveryOrder.methods.find((m) => m.id === selectedMethodId)
      : null) ?? deliveryOrder.methods.find((m) => m.isDefault) ?? deliveryOrder.methods[0];
    const shippingFee = selectedMethod?.shippingFee ?? 0;

    const products = deliveryOrder.products.map((p) => {
      const totalQty = p.skuLines.reduce((sum, sku) => sum + sku.quantity, 0);
      const totalPrice = p.skuLines.reduce((sum, sku) => sum + sku.unitPrice * sku.quantity, 0);
      return {
        name: p.title,
        variation: p.skuLines.map((s) => s.variantText).filter(Boolean).join(', '),
        unitPrice: (totalPrice / totalQty).toFixed(2),
        quantity: totalQty,
        totalPrice: totalPrice.toFixed(2),
        image: p.image,
      };
    });

    const subtotal = products.reduce((sum, p) => sum + Number(p.totalPrice), 0);
    const grandTotal = subtotal + shippingFee;
    const orderNumber = backendOrderNumbers[idx] ?? `ORD-${(now + idx).toString(36).toUpperCase()}`;

    return {
      id: `ord-${now}-${idx}`,
      orderNumber,
      orderDate: dateStr,
      total: grandTotal.toFixed(2),
      currency: getSelectedCurrencyInfo().code,
      seller: supplier?.name ?? deliveryOrder.sellerName,
      status: 'Waiting for payment',
      statusColor: 'text-amber-600',
      statusDescription: 'Ödemenizi tamamlayın.',
      products,
      shipping: {
        trackingStatus: 'Pending',
        address: shippingAddressStr,
        shipFrom: '',
        method: selectedMethod?.etaLabel ?? '',
        incoterms: '',
      },
      payment: {
        status: 'Unpaid',
        hasRecord: false,
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      },
      supplier: {
        name: supplier?.name ?? deliveryOrder.sellerName,
        contact: '',
        phone: '',
        email: '',
      },
      paymentMethod,
      createdAt: now,
    } as Order;
  });
}

// Gather review data from DOM + module-level state
function gatherReviewData() {
  // Shipping address: try selected address display first, then form fields
  const shippingSection = document.getElementById('shipping-address-section');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingAlpine = shippingSection && ((shippingSection as any)._x_dataStack as Record<string, unknown>[] | undefined)?.[0] as any;
  let shippingAddress = '';
  if (shippingAlpine?.selectedAddressLine) {
    const name = shippingAlpine.selectedAddressName ?? '';
    const phone = shippingAlpine.selectedAddressPhone ?? '';
    const line = shippingAlpine.selectedAddressLine ?? '';
    shippingAddress = [name, phone, line].filter(Boolean).join(', ');
  } else {
    const addrParts: string[] = [];
    const firstNameEl = document.querySelector<HTMLInputElement>('#first-name');
    const streetEl = document.querySelector<HTMLInputElement>('#street-address');
    const postalEl = document.querySelector<HTMLInputElement>('#postal-code');
    if (firstNameEl?.value) addrParts.push(firstNameEl.value);
    if (streetEl?.value) addrParts.push(streetEl.value);
    if (postalEl?.value) addrParts.push(postalEl.value);
    shippingAddress = addrParts.join(', ');
  }
  if (!shippingAddress) shippingAddress = 'Belirtilmedi';

  let paymentLabel = t('checkout.bankTransfer');
  const selected = document.querySelector<HTMLInputElement>('input[name="payment_method"]:checked');
  if (selected) {
    switch (selected.value) {
      case 'elden': paymentLabel = t('checkout.handInstallment'); break;
      case 'anlasmali': paymentLabel = t('checkout.negotiatedWithSupplier'); break;
      case 'banka_havale': paymentLabel = t('checkout.bankTransfer'); break;
      case 'cek_senet': paymentLabel = t('checkout.checkDraft'); break;
      default: paymentLabel = t('checkout.bankTransfer');
    }
  }

  const itemSubtotal = currentCheckoutOrderSummary?.itemSubtotal ?? 0;
  // implicit discount = baked-in cart discount (bulk pricing etc.)
  const implicitDiscount = currentCheckoutOrderSummary
    ? Number((currentCheckoutOrderSummary.itemSubtotal + currentCheckoutOrderSummary.shipping - currentCheckoutOrderSummary.total).toFixed(2))
    : 0;
  const shippingFee = currentShippingFee || currentDefaultShippingFee;
  const couponDiscount = currentCouponDiscount;
  const total = Number((itemSubtotal + shippingFee - implicitDiscount - couponDiscount).toFixed(2));

  return {
    shippingAddress,
    paymentMethod: paymentLabel,
    orders: checkoutDeliveryOrders,
    summary: {
      itemSubtotal: itemSubtotal.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      couponDiscount: couponDiscount.toFixed(2),
      total: total.toFixed(2),
    },
  };
}

// Confirm Order (from review modal) → backend API + redirect — modül düzeyinde bir kez kayıt
window.addEventListener('checkout:confirm-order', () => {
  const orderCount = checkoutDeliveryOrders.length;

  const selected = document.querySelector<HTMLInputElement>('input[name="payment_method"]:checked');
  const selectedPaymentValue = selected?.value || 'banka_havale';

  const paymentMethodMap: Record<string, string> = {
    elden: 'installment',
    anlasmali: 'negotiated',
    cek_senet: 'check_promissory',
    banka_havale: 'bank_transfer',
  };
  const paymentMethod = paymentMethodMap[selectedPaymentValue] || 'bank_transfer';

  const reviewData = gatherReviewData();
  const shippingAddress = reviewData.shippingAddress;

  // Kupon bilgisi — modül düzeyinde event'ten takip edilir
  const couponCode = currentCouponApplied?.code ?? '';
  const couponDiscount = currentCouponDiscount;

  // Backend'e gönderilecek sipariş objeleri — notlar dahil
  const backendOrders = checkoutDeliveryOrders.map((deliveryOrder) => {
    const selectedMethodId = selectedShippingMethodByOrderId[deliveryOrder.orderId];
    const selectedMethod = (selectedMethodId
      ? deliveryOrder.methods.find((m) => m.id === selectedMethodId)
      : null) ?? deliveryOrder.methods.find((m) => m.isDefault) ?? deliveryOrder.methods[0];
    return {
      seller_id: deliveryOrder.sellerId || '',
      seller_name: deliveryOrder.sellerName,
      shipping_fee: selectedMethod?.shippingFee ?? 0,
      shipping_method: selectedMethod?.etaLabel ?? '',
      currency: getSelectedCurrencyInfo().code,
      buyer_note: currentSupplierNotes[deliveryOrder.orderId] || '',
      products: deliveryOrder.products.map((p) => ({
        listing: p.id,
        listing_title: p.title,
        listing_variant: p.skuLines[0]?.listingVariant ?? null,
        variation: p.skuLines.map((s) => s.variantText).filter(Boolean).join(', '),
        unit_price: p.skuLines[0]?.unitPrice ?? 0,
        quantity: p.skuLines.reduce((sum, s) => sum + s.quantity, 0),
        total_price: p.skuLines.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0),
        image: p.image,
      })),
    };
  });

  // Onay butonunu devre dışı bırak (çift tıklama önlemi)
  const confirmBtn = document.getElementById('review-confirm-btn') as HTMLButtonElement | null;
  function setConfirmLoading(loading: boolean) {
    if (confirmBtn) {
      confirmBtn.disabled = loading;
      confirmBtn.style.opacity = loading ? '0.6' : '';
    }
  }

  function redirectToSuccess(orderNumbers: string) {
    if (isSampleMode) localStorage.removeItem('tradehub_sample_order');
    window.location.href = `${getBaseUrl()}pages/order/order-success.html?status=pending&count=${orderCount}&orderNumbers=${encodeURIComponent(orderNumbers)}`;
  }

  if (!isLoggedIn()) {
    // Misafir: frontend üretilen numaralarla devam et
    const newOrders = buildOrdersFromCheckout(paymentMethod, shippingAddress);
    orderStore.load();
    redirectToSuccess(newOrders.map((o) => o.orderNumber).join(','));
    return;
  }

  setConfirmLoading(true);

  apiCreateOrder(backendOrders, shippingAddress, paymentMethod, couponCode, couponDiscount)
    .then((result) => {
      // Backend'den dönen gerçek sipariş numaralarını kullan
      type BackendResult = { order_number?: string; order_name?: string };
      const backendNums = (result.orders as BackendResult[])
        .map((o) => o.order_number ?? o.order_name ?? '')
        .filter(Boolean);

      orderStore.load();

      const orderNumbers = backendNums.join(',');

      redirectToSuccess(orderNumbers);
    })
    .catch((err: unknown) => {
      setConfirmLoading(false);
      const msg = (err as { message?: string })?.message || t('checkout.orderCreateError') || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.';
      showToast({ message: msg, type: 'error', duration: 5000 });
    });
});

// Checkout render'ı async — önce eksik shipping verisi çekilir, sonra sayfa render edilir
async function renderCheckout() {
await initCurrency();

// Auth kontrolü: giriş yapmamış kullanıcıları login sayfasına yönlendir
if (!isLoggedIn()) {
  const { getSessionUser } = await import('../utils/auth');
  const sessionUser = await getSessionUser().catch(() => null);
  if (!sessionUser) {
    window.location.replace(`/pages/auth/login.html?redirect=${encodeURIComponent(window.location.href)}`);
    return;
  }
}

await enrichMissingShippingMethods();

checkoutDeliveryOrders = isSampleMode ? buildSampleDeliveryOrders() : buildDeliveryOrders();
currentDefaultShippingFee = Number(
  checkoutDeliveryOrders.reduce((sum, order) => {
    const defaultMethod = order.methods.find((method) => method.isDefault) ?? order.methods[0];
    return sum + (defaultMethod?.shippingFee ?? 0);
  }, 0).toFixed(2),
);

const sampleSubtotal = sampleOrderData ? sampleOrderData.samplePrice * sampleOrderData.quantity : 0;

currentCheckoutOrderSummary = isSampleMode ? {
  itemCount: 1,
  thumbnails: sampleOrderData?.color?.imageUrl ? [{ image: sampleOrderData.color.imageUrl, quantity: 1 }] : [],
  itemSubtotal: sampleSubtotal,
  shipping: currentDefaultShippingFee,
  subtotal: sampleSubtotal + currentDefaultShippingFee,
  processingFee: 0,
  total: sampleSubtotal + currentDefaultShippingFee,
  currency: getSelectedCurrencyInfo().code,
} : {
  itemCount: cartSummary!.selectedCount || cartSummary!.items.reduce((s, i) => s + i.quantity, 0),
  thumbnails: cartSummary!.items.map(i => ({ image: i.image, quantity: i.quantity })),
  itemSubtotal: cartSummary!.productSubtotal,
  shipping: currentDefaultShippingFee,
  subtotal: cartSummary!.productSubtotal + currentDefaultShippingFee - cartSummary!.discount,
  processingFee: 0,
  total: cartSummary!.productSubtotal + currentDefaultShippingFee - cartSummary!.discount,
  currency: getSelectedCurrencyInfo().code,
};

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Header (Not Sticky for Checkout Page) -->
  <div id="sticky-header" class="relative bg-white border-b border-[#e5e5e5] w-full">
    ${TopBar()}
    ${SubHeader()}
  </div>

  ${MegaMenu()}

  <!-- Main Content -->
  <main>
    <div class="container-boxed">
      ${Breadcrumb([{ label: t('cart.title'), href: '/pages/cart.html' }, { label: t('checkout.paymentMethod') }])}
    </div>
    ${CheckoutLayout({
  leftContent: `
        ${CheckoutHeader()}
        ${ShippingAddressForm()}
        ${PaymentMethodSection({ suppliers: cartStore.getSuppliers().filter(s => s.products.some(p => p.skus.some(sku => sku.selected))), isSupplierCheckout: new URLSearchParams(window.location.search).has('supplier') })}
        ${ItemsDeliverySection({ orders: checkoutDeliveryOrders })}
      `,
  rightContent: `
        ${OrderSummary({ data: currentCheckoutOrderSummary!, protectionItems: protectionSummaryItems, tradeAssuranceText })}
      `
})}
  </main>

  <!-- Footer -->
  <footer>
    ${FooterLinks()}
  </footer>

  <!-- Floating Panel -->
  ${FloatingPanel()}

  <!-- Order Protection Modal -->
  ${OrderProtectionModal({ sections: modalSections, paymentIcons, infoBoxBullets })}

  <!-- Order Review Modal -->
  ${OrderReviewModal()}
`;

// Initialize behaviors
initMegaMenu();
initFlowbite();
startAlpine();
initStickyHeaderSearch();
initMobileDrawer();
initLanguageSelector();
initHeaderCart();
initStickyHeights();

// Place Order → open review modal
const placeOrderBtn = document.getElementById('summary-place-order-btn');
if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', () => {
    // Validate shipping address before opening review
    const shippingSection = document.getElementById('shipping-address-section');
    if (shippingSection) {
      const alpineData = ((shippingSection as any)._x_dataStack as Record<string, unknown>[] | undefined)?.[0] as any;
      if (alpineData) {
        if (alpineData.showAddressForm) {
          alpineData.handleSubmit();
          if (Object.values(alpineData.errors || {}).some(e => e)) {
            return;
          }
        } else if (!alpineData.selectedAddressId) {
          alpineData.showAddressForm = true;
          return;
        }
      }
    }

    const reviewData = gatherReviewData();
    window.dispatchEvent(new CustomEvent('checkout:open-review', { detail: reviewData }));
  });
}

} // renderCheckout sonu

renderCheckout();
