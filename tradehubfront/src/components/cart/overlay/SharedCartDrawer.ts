import type { ProductImageKind } from '../../../types/productListing';
import { cartStore } from '../state/CartStore';
import type { CartSupplier, CartProduct, CartSku } from '../../../types/cart';
import { t } from '../../../i18n';
import { getCurrencySymbol } from '../../../utils/currency';
import { formatCurrency, getSelectedCurrency } from '../../../services/currencyService';
import { isLoggedIn } from '../../../utils/auth';
import { apiCheckStock } from '../../../services/cartService';
import { showCartError } from '../page/CartPage';

export interface CartDrawerTierModel {
  minQty: number;
  maxQty: number | null;
  price: number;
  rawPrice?: number;
  originalPrice?: number;
}

export interface CartDrawerShippingOption {
  id: string;
  method: string;
  estimatedDays: string;
  cost: number;
  costText: string;
}

export interface CartDrawerColorModel {
  id: string;
  label: string;
  colorHex: string;
  imageKind: ProductImageKind;
  imageUrl?: string;
  price?: number;
  rawPrice?: number;
}

export interface CartDrawerItemModel {
  id: string;
  title: string;
  supplierName: string;
  unit: string;
  moq: number;
  imageKind: ProductImageKind;
  priceTiers: CartDrawerTierModel[];
  colors: CartDrawerColorModel[];
  shippingOptions: CartDrawerShippingOption[];
  samplePrice?: number;
  currency?: string;
}

interface DrawerState {
  mode: 'cart' | 'sample';
  item: CartDrawerItemModel | null;
  selectedShippingIndex: number;
  colorQuantities: Map<string, number>;
  previewColorIndex: number;
  footerExpanded: boolean;
}

interface CartMemoryItem {
  item: CartDrawerItemModel;
  colorQuantities: Map<string, number>;
}

interface ProductVisual {
  background: string;
  stroke: string;
  icon: string;
}

const productVisuals: Record<ProductImageKind, ProductVisual> = {
  jewelry: { background: 'linear-gradient(180deg, #fef9e7 0%, #fdf0c3 100%)', stroke: '#8a6800', icon: '<path d="M12 2l2.5 5.5L20 9l-4 4 1 5.5L12 16l-5 2.5 1-5.5-4-4 5.5-1.5Z" /><circle cx="12" cy="10" r="2" />' },
  electronics: { background: 'linear-gradient(180deg, #eef2ff 0%, #dbeafe 100%)', stroke: '#4f5fb3', icon: '<rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 20h10M12 16v4" /><circle cx="12" cy="10" r="2" />' },
  label: { background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)', stroke: '#2d8a5e', icon: '<rect x="4" y="6" width="16" height="12" rx="1" /><path d="M8 10h8M8 13h5" /><circle cx="17" cy="6" r="1.5" />' },
  crafts: { background: 'linear-gradient(180deg, #fdf4ff 0%, #fae8ff 100%)', stroke: '#7e22ce', icon: '<path d="M12 2C8.5 2 6 4.5 6 7c0 3 6 8 6 8s6-5 6-8c0-2.5-2.5-5-6-5Z" /><path d="M8 18h8M9 21h6" />' },
  accessory: { background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)', stroke: '#b45309', icon: '<rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4" /><path d="M4 14h16" />' },
  clothing: { background: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)', stroke: '#a3456e', icon: '<path d="M8 3h8l2 6v12H6V9l2-6Z" /><path d="M12 3v8M8 3 6 9M16 3l2 6" />' },
  tools: { background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)', stroke: '#475569', icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />' },
  packaging: { background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', stroke: '#92700c', icon: '<path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" /><path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" /><path d="M10 12h4" />' },
};

const state: DrawerState = {
  mode: 'cart',
  item: null,
  selectedShippingIndex: 0,
  colorQuantities: new Map(),
  previewColorIndex: 0,
  footerExpanded: false,
};

const cartMemory = new Map<string, CartMemoryItem>();

let initialized = false;
let shippingInitialized = false;
let productsById = new Map<string, CartDrawerItemModel>();
let onItemMissing: ((id: string, mode: 'cart' | 'sample') => Promise<void>) | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderColorThumb(color: CartDrawerColorModel, size = 64): string {
  if (color.imageUrl) {
    return `
      <div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#f5f5f5;">
        <img src="${color.imageUrl}" alt="${escapeHtml(color.label)}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />
      </div>
    `;
  }
  return `
    <div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;flex-shrink:0;background:${color.colorHex};"></div>
  `;
}

function formatTierLabel(tier: CartDrawerTierModel, unit: string): string {
  if (tier.maxQty === null) return `≥ ${tier.minQty.toLocaleString()} ${unit}`;
  return `${tier.minQty.toLocaleString()} - ${tier.maxQty.toLocaleString()} ${unit}`;
}

function getActiveTierIndex(totalQty: number): number {
  if (!state.item) return 0;
  for (let i = state.item.priceTiers.length - 1; i >= 0; i -= 1) {
    if (totalQty >= state.item.priceTiers[i].minQty) return i;
  }
  return 0;
}

function getTotals(): {
  totalQty: number;
  activePrice: number;
  tierIndex: number;
  itemSubtotal: number;
  shippingCost: number;
  grandTotal: number;
  variationCount: number;
} {
  const totalQty = Array.from(state.colorQuantities.values()).reduce((acc, qty) => acc + qty, 0);
  const tierIndex = getActiveTierIndex(totalQty);
  const activeTier = state.item?.priceTiers[tierIndex];
  const activePrice = state.mode === 'sample'
    ? (state.item?.samplePrice ?? 30)
    : (activeTier?.rawPrice ?? activeTier?.price ?? 0);
  let itemSubtotal: number;
  if (state.item && state.item.colors.length > 0) {
    itemSubtotal = state.item.colors.reduce((sum, color) => {
      const qty = state.colorQuantities.get(color.id) ?? 0;
      const price = (color.rawPrice != null && color.rawPrice > 0) ? color.rawPrice : activePrice;
      return sum + price * qty;
    }, 0);
  } else {
    itemSubtotal = activePrice * totalQty;
  }
  const shippingCost = state.item?.shippingOptions[state.selectedShippingIndex]?.cost ?? 0;
  const grandTotal = itemSubtotal + shippingCost;
  const variationCount = Array.from(state.colorQuantities.values()).filter((qty) => qty > 0).length;
  return { totalQty, activePrice, tierIndex, itemSubtotal, shippingCost, grandTotal, variationCount };
}

function getDrawerElements(): {
  overlay: HTMLElement | null;
  drawer: HTMLElement | null;
  body: HTMLElement | null;
  footer: HTMLElement | null;
} {
  return {
    overlay: document.getElementById('shared-cart-overlay'),
    drawer: document.getElementById('shared-cart-drawer'),
    body: document.getElementById('shared-cart-body'),
    footer: document.getElementById('shared-cart-footer'),
  };
}

function applyDrawerTransform(open: boolean): void {
  const { overlay, drawer } = getDrawerElements();
  if (!overlay || !drawer) return;

  const mobile = window.innerWidth < 1280;
  const closedTransform = mobile ? 'translateY(100%)' : 'translateX(100%)';
  const openTransform = 'translateX(0) translateY(0)';

  drawer.style.transform = open ? openTransform : closedTransform;

  if (open) {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  setPreviewVisible(open && !mobile);
}

function setPreviewVisible(visible: boolean): void {
  const preview = document.getElementById('shared-cart-preview');
  if (!preview) return;
  if (visible) {
    preview.classList.remove('hidden');
    preview.classList.add('flex');
  } else {
    preview.classList.remove('flex');
    preview.classList.add('hidden');
  }
}

function updatePreview(): void {
  const image = document.getElementById('shared-cart-preview-image');
  const label = document.getElementById('shared-cart-preview-label');
  if (!image || !label || !state.item) return;

  const color = state.item.colors[state.previewColorIndex];
  if (!color) return;

  if (color.imageUrl) {
    image.innerHTML = `
      <img src="${color.imageUrl}" alt="${escapeHtml(color.label)}" style="width:100%;height:100%;object-fit:cover;" />
    `;
  } else {
    image.innerHTML = `
      <div style="width:100%;height:100%;background:${color.colorHex};"></div>
    `;
  }
  label.textContent = `color : ${color.label}`;
}

function showSampleMaxToast(): void {
  const existing = document.getElementById('sample-max-toast');
  if (existing) return; // already visible

  const toast = document.createElement('div');
  toast.id = 'sample-max-toast';
  toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-start gap-3 bg-[#1a1a1a] text-white text-sm rounded-2xl px-5 py-4 shadow-xl max-w-xs w-max pointer-events-none';
  toast.innerHTML = `
    <svg class="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e05c25" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>${t('cart.sampleMaxQty')}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

function renderPriceSectionHtml(totals: ReturnType<typeof getTotals>): string {
  if (!state.item) return '';
  if (state.mode === 'sample') {
    return `
      <div class="mb-5 pb-5 border-b border-border-default">
        <p class="text-sm text-text-secondary mb-1">${t('cart.sampleMaxNote')}</p>
        <p class="text-[22px] font-bold text-text-heading">${formatCurrency(state.item.samplePrice ?? 30, getSelectedCurrency())} <span class="text-base font-normal text-text-tertiary">${t('cart.perUnit')}</span></p>
      </div>
    `;
  }
  return `
    <div class="grid grid-cols-3 gap-6 pb-5 mb-5 border-b border-border-default">
      ${state.item.priceTiers.map((tier, index) => {
    const activeClass = index === totals.tierIndex ? 'text-error-500' : 'text-text-heading';
    return `<div class="cart-tier-item" data-tier-index="${index}">
          <p class="text-sm text-text-tertiary">${formatTierLabel(tier, state.item!.unit)}</p>
          <p class="mt-1 text-[22px] font-bold ${activeClass}">${formatCurrency(tier.rawPrice ?? tier.price, state.item?.currency || getSelectedCurrency())}</p>
        </div>`;
  }).join('')}
    </div>
  `;
}

function renderDrawerBody(): void {
  const { body } = getDrawerElements();
  if (!body || !state.item) return;

  const totals = getTotals();
  const priceSection = renderPriceSectionHtml(totals);

  body.innerHTML = `
    <h4 class="text-base font-bold text-text-heading leading-tight mb-4">${escapeHtml(state.item.title)}</h4>

    ${priceSection}

    ${state.item.colors.length > 0 ? `
    <div class="mb-5">
      <h5 class="text-base font-bold text-text-heading mb-3">${t('cart.colorLabel')}</h5>
      <div class="divide-y divide-border-default">
        ${state.item.colors.map((color) => {
    const qty = state.colorQuantities.get(color.id) ?? 0;
    const selectedBorder = qty > 0 ? 'border-primary-500' : 'border-border-default';
    const displayPrice = (color.rawPrice != null && color.rawPrice > 0) ? color.rawPrice : totals.activePrice;
    const displayCurrency = state.item?.currency || getSelectedCurrency();
    return `
            <div class="flex items-center gap-4 py-3" data-color-id="${escapeHtml(color.id)}">
              <button type="button" data-preview-color="${escapeHtml(color.id)}" class="shrink-0 rounded-full border-2 ${selectedBorder}">
                ${renderColorThumb(color, 72)}
              </button>
              <div class="flex-1 min-w-0">
                <p class="text-base font-semibold text-text-heading truncate">${escapeHtml(color.label)}</p>
              </div>
              <span class="text-[15px] font-semibold text-text-heading whitespace-nowrap">${formatCurrency(displayPrice, displayCurrency)}</span>
              <div class="inline-flex items-center border border-border-default rounded-full overflow-hidden shrink-0">
                <button type="button" data-qty-action="minus" data-qty-color="${escapeHtml(color.id)}" class="w-9 h-9 bg-surface text-text-secondary hover:bg-surface-raised transition-colors">−</button>
                <input type="number" data-qty-input="${escapeHtml(color.id)}" value="${qty}" min="0" class="w-11 h-9 text-center border-x border-border-default bg-surface text-sm font-semibold text-text-heading [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                <button type="button" data-qty-action="plus" data-qty-color="${escapeHtml(color.id)}" class="w-9 h-9 bg-surface text-text-secondary hover:bg-surface-raised transition-colors">+</button>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
    ` : `
    <div class="mb-5">
      <div class="flex items-center justify-between py-3 border-b border-border-default">
        <span class="text-base font-semibold text-text-heading">${escapeHtml(state.item.title)}</span>
        <span class="text-[15px] font-semibold text-text-heading whitespace-nowrap">${formatCurrency(totals.activePrice, state.item?.currency || getSelectedCurrency())}</span>
        <div class="inline-flex items-center border border-border-default rounded-full overflow-hidden shrink-0">
          <button type="button" data-qty-action="minus" data-qty-color="__no_variant__" class="w-9 h-9 bg-surface text-text-secondary hover:bg-surface-raised transition-colors">−</button>
          <input type="number" data-qty-input="__no_variant__" value="${state.colorQuantities.get('__no_variant__') ?? 0}" min="0" class="w-11 h-9 text-center border-x border-border-default bg-surface text-sm font-semibold text-text-heading [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          <button type="button" data-qty-action="plus" data-qty-color="__no_variant__" class="w-9 h-9 bg-surface text-text-secondary hover:bg-surface-raised transition-colors">+</button>
        </div>
      </div>
    </div>
    `}

    <div class="mt-5 mb-2 rounded-3xl border border-border-default p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h5 class="text-base font-bold text-text-heading">${t('cart.shipping')}</h5>
          <p class="mt-2 text-sm text-text-secondary">${t('cart.shippingNegotiate')}</p>
        </div>
        <button type="button" data-shipping-change class="text-base font-semibold text-cta-primary hover:text-cta-primary-hover hover:underline">${t('cart.changeShipping')} ›</button>
      </div>
    </div>
  `;
}

function renderDrawerFooter(): void {
  const { footer } = getDrawerElements();
  if (!footer || !state.item) return;

  const totals = getTotals();
  const perPiece = totals.totalQty > 0 ? totals.grandTotal / totals.totalQty : 0;
  const itemCurrency = state.item.currency || getSelectedCurrency();

  const details = state.footerExpanded
    ? `
      <div class="mb-4">
        <button type="button" id="shared-cart-footer-toggle" class="w-full flex items-center justify-center gap-1 text-sm font-semibold text-text-heading border-b border-border-default pb-3 mb-3">
          ${t('cart.price')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
        </button>

        <div class="space-y-2 text-sm text-text-secondary">
          <div class="flex items-center justify-between">
            <span>${t('cart.productTotal')} (${t('cart.variationItems', { variation: String(totals.variationCount), items: String(totals.totalQty) })})</span>
            <strong class="text-text-heading">${formatCurrency(totals.itemSubtotal, itemCurrency)}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span>${t('cart.shippingTotal')}</span>
            <span>${escapeHtml(state.item.shippingOptions[state.selectedShippingIndex]?.costText ?? formatCurrency(0, itemCurrency))}</span>
          </div>
          <div class="flex items-center justify-between border-t border-border-default pt-3 mt-3">
            <strong class="text-text-heading">${t('cart.subtotal')}</strong>
            <div class="text-right">
              <strong class="text-base text-cta-primary">${formatCurrency(totals.grandTotal, itemCurrency)}</strong>
              <p class="text-xs text-text-tertiary">(${formatCurrency(perPiece, itemCurrency)}${t('cart.perUnit')})</p>
            </div>
          </div>
        </div>
      </div>
    `
    : `
      <button type="button" id="shared-cart-footer-toggle" class="w-full flex items-center justify-between mb-4">
        <strong class="text-base text-text-heading">${t('cart.subtotal')}</strong>
        <span class="flex items-center gap-1.5">
          <strong class="text-[17px] text-cta-primary">${formatCurrency(totals.grandTotal, itemCurrency)}</strong>
          <span class="text-xs text-text-tertiary">(${formatCurrency(perPiece, itemCurrency)}${t('cart.perUnit')})</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-text-tertiary"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>
    `;

  footer.innerHTML = `
    ${details}
    <button type="button" id="shared-cart-confirm" class="w-full th-btn-dark th-btn-pill h-12 text-lg">${state.mode === 'sample' ? t('cart.orderSample') : t('cart.addToCartBtn')}</button>
  `;
}

function rerenderDrawer(): void {
  renderDrawerBody();
  renderDrawerFooter();
  updatePreview();
}

function updateShippingModal(quantityOverride?: number): void {
  const qtyEl = document.getElementById('shared-cart-shipping-qty');
  const optionsEl = document.getElementById('shared-cart-shipping-options');
  if (!qtyEl || !optionsEl || !state.item) return;

  const totals = getTotals();
  const qty = quantityOverride ?? Math.max(totals.totalQty, state.item.moq);
  qtyEl.textContent = `${qty} ${state.item.unit}`;

  optionsEl.innerHTML = state.item.shippingOptions.map((option, index) => {
    const active = index === state.selectedShippingIndex;
    return `
      <label class="flex items-center justify-between rounded-2xl border px-4 py-3 cursor-pointer transition-colors ${active ? 'border-primary-500 bg-primary-50' : 'border-border-default bg-surface-muted hover:bg-surface'}" data-shipping-option-index="${index}">
        <span class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-full border inline-flex items-center justify-center ${active ? 'border-primary-500 bg-primary-500 text-white' : 'border-border-medium text-transparent'}">
            ${active ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>' : ''}
          </span>
          <span>
            <strong class="block text-base text-text-heading">${escapeHtml(option.method)}</strong>
            <span class="text-sm text-text-secondary">${escapeHtml(option.estimatedDays)}</span>
          </span>
        </span>
        <strong class="text-base text-text-heading">${escapeHtml(option.costText)}</strong>
      </label>
    `;
  }).join('');
}

function setShippingModalOpen(open: boolean): void {
  const modal = document.getElementById('shared-cart-shipping-modal');
  const sheet = document.getElementById('shared-cart-shipping-sheet');
  if (!modal || !sheet) return;

  if (open) {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    sheet.classList.remove('translate-y-4');
  } else {
    modal.classList.add('opacity-0', 'pointer-events-none');
    sheet.classList.add('translate-y-4');
  }
}

function buildGroupedItemsForEvent(): Array<{ supplierName: string; productTitle: string; items: Array<{ label: string; unitPrice: number; qty: number; colorValue: string }> }> {
  const groups = new Map<string, { supplierName: string; productTitle: string; items: Array<{ label: string; unitPrice: number; qty: number; colorValue: string }> }>();

  cartMemory.forEach((memory) => {
    const qty = Array.from(memory.colorQuantities.values()).reduce((acc, value) => acc + value, 0);
    if (qty <= 0) return;

    const tierIndex = getActiveTierIndex(qty);
    const unitPrice = memory.item.priceTiers[tierIndex]?.price ?? memory.item.priceTiers[0]?.price ?? 0;
    const supplierKey = memory.item.supplierName || 'Supplier';

    if (!groups.has(supplierKey)) {
      groups.set(supplierKey, {
        supplierName: memory.item.supplierName,
        productTitle: memory.item.title,
        items: [],
      });
    }

    groups.get(supplierKey)!.items.push({
      label: `${qty} ${memory.item.unit}, ${memory.item.title.length > 40 ? `${memory.item.title.slice(0, 40)}...` : memory.item.title}`,
      unitPrice,
      qty,
      colorValue: productVisuals[memory.item.imageKind].stroke,
    });
  });

  return Array.from(groups.values());
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function syncToCartStore(item: CartDrawerItemModel, colorQuantities: Map<string, number>, unitPrice: number): void {
  const supplierId = toSlug(item.supplierName || 'unknown-supplier');

  // Supplier yoksa oluştur
  if (!cartStore.getSupplier(supplierId)) {
    const supplier: CartSupplier = {
      id: supplierId,
      name: item.supplierName,
      href: `/supplier/${supplierId}`,
      selected: true,
      products: [],
    };
    cartStore.addSupplier(supplier);
  }

  // Product yoksa oluştur
  const productId = item.id;
  if (!cartStore.getProduct(productId)) {
    const product: CartProduct = {
      id: productId,
      title: item.title,
      href: `/product/${productId}`,
      tags: [],
      moqLabel: `${t('product.minOrderLabel')}: ${item.moq} ${item.unit}`,
      favoriteIcon: '♡',
      deleteIcon: '🗑',
      skus: [],
      selected: true,
    };
    cartStore.addProduct(supplierId, product);
  }

  // Her renk/miktar çifti → SKU
  colorQuantities.forEach((qty, colorId) => {
    if (qty <= 0) return;

    const color = item.colors.find((c) => c.id === colorId);
    if (!color) return;

    const skuId = `${item.id}-${colorId}`;
    const existing = cartStore.getSku(skuId);

    if (existing) {
      cartStore.updateSkuQuantity(skuId, existing.sku.quantity + qty);
    } else {
      const isFallbackColor = colorId.startsWith('fallback-');
      const sku: CartSku = {
        id: skuId,
        skuImage: color.imageUrl || 'https://placehold.co/120x120/f5f5f5/999?text=SKU',
        variantText: `${t('cart.colorLabel')}: ${color.label}`,
        unitPrice,
        currency: getCurrencySymbol(),
        unit: item.unit,
        quantity: qty,
        minQty: item.moq,
        maxQty: 9999,
        selected: true,
        baseUnitPrice: unitPrice,
        basePriceAddon: 0,
        baseCurrency: getSelectedCurrency(),
        ...(isFallbackColor ? {} : { listingVariant: colorId }),
      };
      cartStore.addSku(productId, sku);
    }
  });
}

async function dispatchCartAdd(): Promise<boolean> {
  if (!state.item) return false;

  const totals = getTotals();
  if (totals.totalQty <= 0) return false;

  // Giriş yapmışsa backend'e stok kontrolü + ekleme yap
  if (isLoggedIn()) {
    try {
      for (const [colorId, qty] of state.colorQuantities) {
        if (qty <= 0) continue;
        await apiCheckStock(state.item.id, qty, colorId || undefined);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showCartError(msg || t('cart.stockError'));
      return false;
    }
  }

  // CartStore'a kaydet
  syncToCartStore(state.item, state.colorQuantities, totals.activePrice);

  const existing = cartMemory.get(state.item.id);
  if (existing) {
    state.colorQuantities.forEach((qty, colorId) => {
      if (qty > 0) {
        existing.colorQuantities.set(colorId, (existing.colorQuantities.get(colorId) ?? 0) + qty);
      }
    });
  } else {
    const copy = new Map<string, number>();
    state.colorQuantities.forEach((qty, colorId) => {
      if (qty > 0) copy.set(colorId, qty);
    });
    cartMemory.set(state.item.id, { item: state.item, colorQuantities: copy });
  }

  const groupedItems = buildGroupedItemsForEvent();
  const quantity = groupedItems.reduce((sum, group) => sum + group.items.reduce((acc, item) => acc + item.qty, 0), 0);
  const grandTotal = groupedItems.reduce((sum, group) => sum + group.items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0), 0);

  document.dispatchEvent(new CustomEvent('cart-add', {
    detail: {
      productTitle: state.item.title,
      supplierName: state.item.supplierName,
      unitPrice: totals.activePrice,
      quantity,
      itemTotal: totals.itemSubtotal,
      grandTotal,
      groupedItems,
    },
  }));
  return true;
}

function openDrawer(itemId?: string, mode: 'cart' | 'sample' = 'cart'): void {
  const item = itemId ? productsById.get(itemId) : Array.from(productsById.values())[0];
  if (!item) return;

  state.mode = mode;
  state.item = item;
  state.selectedShippingIndex = 0;
  state.previewColorIndex = 0;
  state.footerExpanded = false;
  state.colorQuantities = item.colors.length > 0
    ? new Map(item.colors.map((color) => [color.id, 0]))
    : new Map([['__no_variant__', 0]]);

  const heading = document.getElementById('shared-cart-heading');
  if (heading) {
    heading.textContent = mode === 'sample' ? t('cart.sampleVariations') : t('cart.selectVariation');
  }

  rerenderDrawer();
  applyDrawerTransform(true);
}

function bindShippingEvents(): void {
  if (shippingInitialized) return;
  shippingInitialized = true;

  const modal = document.getElementById('shared-cart-shipping-modal');
  const closeBtn = document.getElementById('shared-cart-shipping-close');
  const options = document.getElementById('shared-cart-shipping-options');
  const applyBtn = document.getElementById('shared-cart-shipping-apply');
  if (!modal || !closeBtn || !options || !applyBtn) return;

  closeBtn.addEventListener('click', () => setShippingModalOpen(false));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) setShippingModalOpen(false);
  });

  options.addEventListener('click', (event) => {
    const row = (event.target as HTMLElement).closest<HTMLElement>('[data-shipping-option-index]');
    if (!row) return;
    const idx = Number(row.dataset.shippingOptionIndex ?? 0);
    state.selectedShippingIndex = Number.isNaN(idx) ? 0 : idx;
    updateShippingModal();
  });

  applyBtn.addEventListener('click', () => {
    if (!state.item) return;

    const selected = state.item.shippingOptions[state.selectedShippingIndex];
    if (selected) {
      document.dispatchEvent(new CustomEvent('shipping-change', {
        detail: {
          index: state.selectedShippingIndex,
          method: selected.method,
          estimatedDays: selected.estimatedDays,
          costStr: selected.costText,
          cost: selected.cost,
        },
      }));
    }

    setShippingModalOpen(false);
    renderDrawerFooter();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('opacity-0')) {
      setShippingModalOpen(false);
    }
  });
}

export function SharedCartDrawer(): string {
  return `
    <div id="shared-cart-overlay" class="fixed inset-0 z-(--z-backdrop,40) bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300">
      <div id="shared-cart-preview" class="hidden fixed left-0 top-0 bottom-0 right-[600px] z-(--z-modal,50) items-center justify-center px-8 pointer-events-none">
        <div class="relative w-full max-w-[760px] h-[78vh] rounded-2xl overflow-hidden pointer-events-auto shadow-2xl bg-surface">
          <button type="button" id="shared-cart-preview-prev" class="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-secondary-700 border border-border-default shadow-md z-20">‹</button>
          <div id="shared-cart-preview-image" class="w-full h-full"></div>
          <button type="button" id="shared-cart-preview-next" class="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-secondary-700 border border-border-default shadow-md z-20">›</button>
          <div id="shared-cart-preview-label" class="absolute left-0 right-0 bottom-0 px-6 py-4 text-white text-xl font-medium bg-gradient-to-t from-black/60 to-transparent">color : -</div>
        </div>
      </div>

      <aside id="shared-cart-drawer" class="fixed right-0 top-0 h-full w-full sm:w-[500px] lg:w-[600px] max-w-full bg-surface shadow-[-8px_0_30px_rgba(0,0,0,0.18)] xl:rounded-l-2xl xl:border-l xl:border-border-default flex flex-col transition-transform duration-300">
        <div class="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0 max-md:px-4 max-md:py-3">
          <h3 id="shared-cart-heading" class="text-lg font-bold text-text-heading">${t('cart.selectVariation')}</h3>
          <button type="button" id="shared-cart-close" class="w-8 h-8 rounded-full text-secondary-400 hover:text-secondary-900 hover:bg-surface-raised transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div id="shared-cart-body" class="flex-1 overflow-y-auto px-6 pt-5 pb-8 max-md:px-4 max-md:pt-4 max-md:pb-6"></div>
        <div id="shared-cart-footer" class="shrink-0 border-t border-border-default bg-surface px-6 pt-4 pb-5 max-md:px-4 max-md:pt-3 max-md:pb-4"></div>
      </aside>
    </div>
  `;
}

export function SharedShippingModal(): string {
  return `
    <div id="shared-cart-shipping-modal" class="fixed inset-0 z-[210] bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300">
      <div id="shared-cart-shipping-sheet" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[min(92vw,760px)] bg-surface rounded-3xl border border-border-default shadow-2xl p-6 translate-y-4 transition-transform duration-300 max-md:w-full max-md:max-w-full max-md:rounded-t-2xl max-md:rounded-b-none max-md:top-auto max-md:bottom-0 max-md:-translate-x-1/2 max-md:-translate-y-0 max-md:p-4">
        <div class="flex items-center justify-between">
          <h4 class="text-xl font-bold text-text-heading">${t('cart.selectShipping')}</h4>
          <button type="button" id="shared-cart-shipping-close" class="w-8 h-8 rounded-full text-secondary-400 hover:text-secondary-900 hover:bg-surface-raised transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <p class="mt-4 text-base text-text-secondary">${t('cart.shippingTo')}: <strong>${t('countries.TR')}</strong> · ${t('cart.shippingQty')}: <span id="shared-cart-shipping-qty">1 ${state.item?.unit ?? 'pc'}</span></p>
        <div id="shared-cart-shipping-options" class="mt-5 space-y-3 max-h-[46vh] overflow-y-auto"></div>

        <button type="button" id="shared-cart-shipping-apply" class="mt-6 w-full th-btn-dark th-btn-pill h-12">${t('common.apply')}</button>
      </div>
    </div>
  `;
}

export function initSharedCartDrawer(items: CartDrawerItemModel[]): void {
  productsById = new Map(items.map((item) => [item.id, item]));

  const { overlay, drawer, body, footer } = getDrawerElements();
  if (!overlay || !drawer || !body || !footer) return;

  bindShippingEvents();

  if (initialized) return;
  initialized = true;

  const closeBtn = document.getElementById('shared-cart-close');
  const previewPrev = document.getElementById('shared-cart-preview-prev');
  const previewNext = document.getElementById('shared-cart-preview-next');

  applyDrawerTransform(false);

  closeBtn?.addEventListener('click', () => applyDrawerTransform(false));

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      applyDrawerTransform(false);
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    const cartTrigger = target.closest<HTMLElement>('[data-add-to-cart]');
    if (cartTrigger) {
      const id = cartTrigger.dataset.addToCart;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'cart');
      } else if (id && onItemMissing) {
        event.preventDefault();
        onItemMissing(id, 'cart');
      }
      return;
    }

    const sampleTrigger = target.closest<HTMLElement>('[data-order-sample]');
    if (sampleTrigger) {
      const id = sampleTrigger.dataset.orderSample;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'sample');
      } else if (id && onItemMissing) {
        event.preventDefault();
        onItemMissing(id, 'sample');
      }
      return;
    }
  });

  body.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    const previewTrigger = target.closest<HTMLElement>('[data-preview-color]');
    if (previewTrigger && state.item) {
      const colorId = previewTrigger.dataset.previewColor;
      const index = state.item.colors.findIndex((color) => color.id === colorId);
      if (index >= 0) {
        state.previewColorIndex = index;
        updatePreview();
        setPreviewVisible(window.innerWidth >= 1280);
      }
      return;
    }

    const qtyTrigger = target.closest<HTMLElement>('[data-qty-action]');
    if (qtyTrigger) {
      const action = qtyTrigger.dataset.qtyAction;
      const colorId = qtyTrigger.dataset.qtyColor ?? '';
      const current = state.colorQuantities.get(colorId) ?? 0;

      if (action === 'plus') {
        if (state.mode === 'sample') {
          const totalQty = Array.from(state.colorQuantities.values()).reduce((a, b) => a + b, 0);
          if (totalQty >= 1) {
            showSampleMaxToast();
            return;
          }
        }
        state.colorQuantities.set(colorId, current + 1);
      }
      if (action === 'minus') {
        state.colorQuantities.set(colorId, Math.max(0, current - 1));
      }

      rerenderDrawer();
      return;
    }

    if (target.closest('[data-shipping-change]')) {
      openSharedShippingModal();
    }
  });

  body.addEventListener('change', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-qty-input]');
    if (!input) return;

    const colorId = input.dataset.qtyInput ?? '';
    let nextValue = Number(input.value);
    if (Number.isNaN(nextValue) || nextValue < 0) nextValue = 0;

    if (state.mode === 'sample') {
      // Sum of other colors + this one cannot exceed 1
      const othersTotal = Array.from(state.colorQuantities.entries())
        .filter(([id]) => id !== colorId)
        .reduce((a, [, b]) => a + b, 0);
      if (othersTotal + nextValue > 1) {
        nextValue = Math.max(0, 1 - othersTotal);
        input.value = String(nextValue);
        showSampleMaxToast();
      }
    }

    state.colorQuantities.set(colorId, nextValue);
    rerenderDrawer();
  });

  footer.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.closest('#shared-cart-footer-toggle')) {
      state.footerExpanded = !state.footerExpanded;
      renderDrawerFooter();
      return;
    }

    if (target.closest('#shared-cart-confirm')) {
      const totals = getTotals();
      if (totals.totalQty <= 0) {
        const confirmBtn = document.getElementById('shared-cart-confirm');
        if (!confirmBtn) return;

        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = t('cart.pleaseSelectQty');
        confirmBtn.classList.add('bg-error-500');

        setTimeout(() => {
          confirmBtn.textContent = originalText;
          confirmBtn.classList.remove('bg-error-500');
        }, 1400);
        return;
      }

      if (state.mode === 'sample') {
        // Sample mode: go directly to checkout (same as Alibaba "Order sample" flow)
        applyDrawerTransform(false);
        const base = (typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : undefined) || '/';
        window.location.href = `${base}pages/order/checkout.html`;
      } else {
        dispatchCartAdd().then(success => {
          if (success) applyDrawerTransform(false);
        });
      }
    }
  });

  previewPrev?.addEventListener('click', () => {
    if (!state.item || state.item.colors.length === 0) return;
    state.previewColorIndex = (state.previewColorIndex - 1 + state.item.colors.length) % state.item.colors.length;
    updatePreview();
  });

  previewNext?.addEventListener('click', () => {
    if (!state.item || state.item.colors.length === 0) return;
    state.previewColorIndex = (state.previewColorIndex + 1) % state.item.colors.length;
    updatePreview();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.classList.contains('opacity-0')) {
      applyDrawerTransform(false);
    }
  });

  window.addEventListener('resize', () => {
    if (!overlay.classList.contains('opacity-0')) {
      applyDrawerTransform(true);
    }
  });
}

export function openSharedCartDrawer(itemId?: string, mode: 'cart' | 'sample' = 'cart'): void {
  openDrawer(itemId, mode);
}

export function setOnItemMissing(cb: ((id: string, mode: 'cart' | 'sample') => Promise<void>) | null): void {
  onItemMissing = cb;
}

export function setSharedCartItems(items: CartDrawerItemModel[]): void {
  productsById = new Map(items.map((item) => [item.id, item]));
}

export function initSharedShippingModal(): void {
  bindShippingEvents();
}

export function openSharedShippingModal(quantity?: number): void {
  if (!state.item) {
    const fallback = Array.from(productsById.values())[0];
    if (!fallback) return;
    state.item = fallback;
    state.selectedShippingIndex = 0;
    state.previewColorIndex = 0;
    state.footerExpanded = false;
    state.colorQuantities = fallback.colors.length > 0
      ? new Map(fallback.colors.map((color) => [color.id, 0]))
      : new Map([['__no_variant__', 0]]);
  }
  updateShippingModal(quantity);
  setShippingModalOpen(true);
}
