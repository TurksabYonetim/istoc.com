/**
 * ProductInfo Component
 * Right sticky card (Alibaba layout-stick style).
 * Contains: price tiers, variations, shipping, CTAs.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';
import { formatCurrency, getSelectedCurrency } from '../../services/currencyService';
import type { PriceTier, ProductVariant } from '../../types/product';
import { openShippingModal, openCartDrawer } from './CartDrawer';

function renderPriceTiers(tiers: PriceTier[]): string {
  const mockProduct = getCurrentProduct();
  return `
    <div id="pd-price-tiers">
      ${tiers.map((tier, i) => {
    const qtyLabel = tier.maxQty
      ? `${tier.minQty} - ${tier.maxQty} ${mockProduct.unit}`
      : `>= ${tier.minQty} ${mockProduct.unit}`;
    return `
          <div class="pd-price-tier ${i === 0 ? 'active' : ''}" data-tier-index="${i}">
            <span class="pd-price-tier-qty">${qtyLabel}</span>
            <span class="pd-price-tier-price shrink-0">${formatCurrency(tier.price, getSelectedCurrency())}</span>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function renderVariant(variant: ProductVariant): string {
  const selectedOpt = variant.options.find(o => o.available) || variant.options[0];

  if (variant.type === 'color') {
    return `
      <div class="variant-group" data-variant-type="${variant.type}" data-variant-label="${variant.label}">
        <h4 class="pd-variant-label"><strong>${variant.label}:</strong> <span class="variant-selected-label">${selectedOpt.label}</span></h4>
        <div class="pd-color-thumbs">
          ${variant.options.map((opt, i) => `
            <button
              type="button"
              class="variant-option pd-color-thumb ${i === 0 && opt.available ? 'active' : ''} ${opt.available ? '' : 'pd-color-thumb-disabled'}"
              data-variant-id="${opt.id}"
              data-variant-label="${opt.label}"
              data-variant-image="${opt.thumbnail || ''}"
              data-variant-value="${opt.value}"
              ${opt.price ? `data-variant-price="${opt.price}"` : ''}
              ${opt.available ? '' : 'disabled'}
              aria-label="${opt.label}"
              title="${opt.label}"
            >
              <img src="${opt.thumbnail || ''}" alt="${opt.label}" style="background:${opt.value};">
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="variant-group" data-variant-type="${variant.type}" data-variant-label="${variant.label}">
      <h4 class="pd-variant-label"><strong>${variant.label}:</strong> <span class="variant-selected-label">${selectedOpt.label}</span></h4>
      <div class="flex flex-wrap gap-2 mt-2">
        ${variant.options.map((opt, i) => `
          <button
            type="button"
            class="variant-option pd-variant-btn ${i === 0 && opt.available ? 'active' : ''} ${opt.available ? '' : 'opacity-40 cursor-not-allowed'}"
            data-variant-id="${opt.id}"
            data-variant-label="${opt.label}"
            ${opt.price ? `data-variant-price="${opt.price}"` : ''}
            ${opt.available ? '' : 'disabled'}
          >
            ${opt.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export function ProductInfo(): string {
  const mockProduct = getCurrentProduct();
  const p = mockProduct;

  return `
    <div id="product-info">
      <div id="pd-info-scrollable">
        <!-- Wholesale / Customization Tabs -->
        <div id="pd-card-tabs">
          <button type="button" class="pd-card-tab active">${t('product.wholesaleSales')}</button>
          <button type="button" class="pd-card-tab">${t('product.customization')}</button>
        </div>

        <!-- Ready to Ship Badge -->
        <span id="pd-ready-badge" class="th-badge">${t('product.readyToShip')}</span>

        <!-- Price Tiers -->
        ${renderPriceTiers(p.priceTiers)}

        <!-- Sample Price -->
        ${p.samplePrice ? `
        <div id="pd-sample-price" class="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg mb-5" style="background: var(--color-surface-raised, #f5f5f5);">
          <div class="flex items-center gap-2 text-sm min-w-0" style="color: var(--color-text-body, #333333);">
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            <span class="truncate">${t('product.samplePrice')}: <strong class="shrink-0">${formatCurrency(p.samplePrice, getSelectedCurrency())}</strong></span>
          </div>
          <button type="button" data-order-sample="${mockProduct.id}" class="pd-sample-btn shrink-0 cursor-pointer">${t('cart.orderSample')}</button>
        </div>
        ` : ''}

        <!-- Variations Header -->
        <div id="pd-variations-section" class="pb-4" style="border-bottom: 1px solid var(--color-border-light, #f0f0f0);">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base font-bold m-0" style="color: var(--pd-title-color, #111827);">${t('product.variants')}</h3>
            <a href="#" class="text-sm font-medium no-underline hover:underline" style="color: var(--pd-breadcrumb-link-color, #cc9900);">${t('product.makeSelection')}</a>
          </div>

          <!-- Variant Groups -->
          ${p.variants.map(v => renderVariant(v)).join('')}
        </div>

        <!-- Supplier Customization -->
        <div class="py-5" style="border-bottom: 1px solid var(--color-border-light, #f0f0f0);">
          <h3 class="text-sm font-bold mb-3 flex items-center gap-1.5 m-0" style="color: var(--pd-title-color, #111827);">
            ${t('product.supplierCustomization')}
            <span class="inline-flex items-center gap-[3px] text-xs font-semibold" style="color: #16a34a;">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style="color: #16a34a;"><path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              Verified
            </span>
          </h3>
          <ul class="list-disc pl-[18px] m-0 text-[13px] leading-[1.8]" style="color: var(--pd-title-color, #111827);">
            <li>${t('product.drawingCustomization')}</li>
            <li>${t('product.sampleCustomization')}</li>
            <li>${t('product.fullCustomization')}</li>
          </ul>
        </div>

        <!-- Shipping -->
        <div class="py-5" style="border-bottom: 1px solid var(--color-border-light, #f0f0f0);">
          <h3 class="text-sm font-bold mb-3 flex items-center gap-1.5 m-0" style="color: var(--pd-title-color, #111827);">${t('product.shippingLabel')}</h3>
          <div class="flex items-center justify-between gap-3 mt-3 px-3.5 py-3 rounded-lg border min-w-0" id="pd-shipping-card" style="background: var(--pd-spec-header-bg, #f9fafb); border-color: var(--color-border-default, #e5e5e5);">
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-sm font-semibold truncate" id="pd-ship-card-method" style="color: var(--pd-title-color, #111827);">${p.shipping[0]?.method || t('product.shippingLabel')}</span>
              <span class="pd-shipping-card-detail text-xs truncate" style="color: var(--pd-rating-text-color, #6b7280);">${p.shipping[0] ? t('product.shippingCost', { cost: p.shipping[0].cost, days: p.shipping[0].estimatedDays }) : ''}</span>
            </div>
            <a href="javascript:void(0)" class="text-[13px] font-medium no-underline whitespace-nowrap cursor-pointer" id="pd-ship-card-change" style="color: var(--pd-price-color, #cc9900);">${t('product.changeLabel')} ›</a>
          </div>
        </div>

        <!-- Trade Assurance / Order Protection -->
        <div id="pd-trade-assurance">
          <div class="flex items-center justify-between cursor-pointer mb-3.5">
            <h4 class="text-sm font-bold m-0 flex items-center gap-1.5" style="color: var(--color-text-heading, #111827);">
              <svg viewBox="0 0 20 20" fill="currentColor" style="color:#16a34a; width:16px; height:16px;"><path fill-rule="evenodd" d="M10 1a.75.75 0 01.65.378l1.855 3.27 3.69.53a.75.75 0 01.416 1.279l-2.668 2.6.63 3.67a.75.75 0 01-1.088.79L10 11.347l-3.485 1.832a.75.75 0 01-1.088-.79l.63-3.67-2.668-2.6a.75.75 0 01.416-1.28l3.69-.53L9.35 1.379A.75.75 0 0110 1z" clip-rule="evenodd"/></svg>
              ${t('product.orderProtectionTitle')}
            </h4>
            <svg class="w-4 h-4 transition-transform" style="color: var(--color-text-placeholder, #999999);" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/></svg>
          </div>

          <div class="flex items-start gap-2.5 mb-3.5">
            <svg class="flex-shrink-0 w-5 h-5 mt-px" style="color: #16a34a;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <div>
              <h5 class="text-[13px] font-semibold m-0 mb-1" style="color: var(--color-text-heading, #111827);">${t('product.securePaymentTitle')}</h5>
              <p class="text-xs m-0 leading-normal" style="color: var(--color-text-muted, #666666);">${t('product.securePaymentDesc')}</p>
              <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
                ${['VISA', 'MC', 'PayPal', 'Apple Pay', 'GPay'].map(icon => `
                  <span class="h-5 px-1.5 rounded-[3px] border text-[10px] font-bold inline-flex items-center shrink-0" style="border-color: var(--color-border-default, #e5e5e5); color: var(--color-text-body, #333333); background: var(--color-surface, #ffffff);">${icon}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <svg class="flex-shrink-0 w-5 h-5 mt-px" style="color: #16a34a;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <div>
              <h5 class="text-[13px] font-semibold m-0 mb-1" style="color: var(--color-text-heading, #111827);">${t('product.moneyBackTitle')}</h5>
              <p class="text-xs m-0 leading-normal" style="color: var(--color-text-muted, #666666);">${t('product.moneyBackDesc')}</p>
            </div>
          </div>

          <div class="inline-flex items-center gap-1 mt-3 px-2.5 py-1.5 rounded-md text-xs font-semibold" style="background: #f0fdf4; color: #16a34a;">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1a.75.75 0 01.65.378l1.855 3.27 3.69.53a.75.75 0 01.416 1.279l-2.668 2.6.63 3.67a.75.75 0 01-1.088.79L10 11.347l-3.485 1.832a.75.75 0 01-1.088-.79l.63-3.67-2.668-2.6a.75.75 0 01.416-1.28l3.69-.53L9.35 1.379A.75.75 0 0110 1z" clip-rule="evenodd"/></svg>
            ${t('product.tradeAssurance')}
          </div>
        </div>

        <!-- CTA Buttons -->
        <div id="pd-cta-buttons">
          <button type="button" id="pd-add-to-cart" data-add-to-cart="${mockProduct.id}" class="th-btn-dark th-btn-pill">
            ${t('product.addToCart')}
          </button>
          <button type="button" id="pd-chat-now" class="th-btn-outline th-btn-pill">
            ${t('product.startChat')}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initProductInfo(): void {
  // Card tab switching (Toptan Satış / Özelleştirme)
  const cardTabs = document.querySelectorAll<HTMLButtonElement>('.pd-card-tab');
  cardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cardTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // "Seçim yap" link → open cart drawer
  const makeSelectionLink = document.querySelector<HTMLAnchorElement>('#pd-variations-section a[href="#"]');
  if (makeSelectionLink) {
    makeSelectionLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Find the currently selected color variant label
      const activeColorBtn = document.querySelector<HTMLButtonElement>('.variant-group[data-variant-type="color"] .variant-option.active');
      const colorLabel = activeColorBtn?.getAttribute('data-variant-label') || '';
      openCartDrawer(colorLabel);
    });
  }

  // Variant selection — updates active state, label, gallery image
  const variantGroups = document.querySelectorAll<HTMLElement>('.variant-group');
  variantGroups.forEach(group => {
    const buttons = group.querySelectorAll<HTMLButtonElement>('.variant-option:not([disabled])');
    const labelEl = group.querySelector<HTMLElement>('.variant-selected-label');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update label text (e.g., "Renk: Altın" → "Renk: Gümüş")
        const variantLabel = btn.getAttribute('data-variant-label');
        if (labelEl && variantLabel) {
          labelEl.textContent = variantLabel;
        }

        // Navigate gallery slider to the variant's image
        const variantImage = btn.getAttribute('data-variant-image');
        if (variantImage) {
          const thumbList = document.querySelector<HTMLElement>('[x-ref="thumbList"]');
          if (thumbList) {
            const thumbs = thumbList.querySelectorAll<HTMLElement>('.gallery-thumb, [data-thumb-index]');
            thumbs.forEach((thumb, idx) => {
              const thumbImg = thumb.querySelector<HTMLImageElement>('img');
              if (thumbImg && thumbImg.src.includes(variantImage.replace('/files/', ''))) {
                document.dispatchEvent(new CustomEvent('gallery-go-to', { detail: { index: idx } }));
              }
            });
          }
        }

        // Open cart drawer with the selected variant pre-selected
        const clickedLabel = btn.getAttribute('data-variant-label') || '';
        openCartDrawer(clickedLabel);
      });
    });
  });

  // Sticky card: add .pd-sticky once user scrolls past the card's bottom
  const heroInfo = document.getElementById('pd-hero-info');
  if (heroInfo && window.matchMedia('(min-width: 1024px)').matches) {
    const stickyTop = 130;
    const cardBottom = heroInfo.getBoundingClientRect().bottom + window.scrollY;

    const onScroll = () => {
      heroInfo.classList.toggle('pd-sticky', window.scrollY + stickyTop >= cardBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Shipping card change ──────────────────────────

  const pdShipChangeBtn = document.getElementById('pd-ship-card-change');
  if (pdShipChangeBtn) {
    pdShipChangeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openShippingModal();
    });
  }

  // Listen for shipping changes from shared modal
  document.addEventListener('shipping-change', ((e: CustomEvent) => {
    const { method, costStr, estimatedDays } = e.detail;
    const methodEl = document.getElementById('pd-ship-card-method');
    if (methodEl) methodEl.textContent = method;
    const detailEl = document.querySelector('#pd-shipping-card .pd-shipping-card-detail');
    if (detailEl) detailEl.textContent = `${t('product.shippingCost', { cost: costStr, days: estimatedDays })}`;
  }) as EventListener);
}
