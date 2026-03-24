import Alpine from 'alpinejs'
import { t } from '../i18n'
import { addToFavorites } from '../stores/favorites'
import { cartStore } from '../components/cart/state/CartStore'
import { showFavoriteToast, showCartError } from '../components/cart/page/CartPage'
import { sanitizeHtml } from '../utils/sanitize'
import { formatCurrency, formatPrice, getSelectedCurrency, convertPrice } from '../services/currencyService'
import { getBaseUrl } from '../components/auth/AuthLayout'
import { apiUpdateCartItem, apiRemoveCartItem } from '../services/cartService'
import { isLoggedIn } from '../utils/auth'

Alpine.data('cartPage', () => ({
  init() {
    cartStore.subscribe(() => {
      this.syncSummary();
      this.syncBatchBar();
      this.syncSupplierTotals();
      this.syncMoqRestrictions();
      this.checkEmptyCart();
    });

    // Initial render synchronization
    this.syncSummary();
    this.syncBatchBar();
    this.syncSupplierTotals();
    this.syncMoqRestrictions();

    // Thumbnail slider for summary section
    this.initThumbnailSlider();

    // View All modal
    this.initViewAllModal();
  },

  /**
   * Sync a checkbox's DOM state and Alpine Checkbox component state.
   * Directly manipulates DOM elements for reliable visual updates instead of
   * relying solely on Alpine reactivity (_x_dataStack may not trigger re-render).
   */
  syncCheckbox(input: HTMLInputElement, checked: boolean, indeterminate: boolean = false) {
    input.checked = checked;
    input.indeterminate = indeterminate;

    const wrapper = input.closest<HTMLElement>('.next-checkbox-wrapper');
    if (!wrapper) return;

    // Update Alpine reactive state
    const dataStack = (wrapper as any)._x_dataStack; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (dataStack?.[0]) {
      dataStack[0].checked = checked;
      dataStack[0].indeterminate = indeterminate;
    }

    // Direct DOM update for reliable visual state (Alpine may not re-render immediately)
    const boxSpan = wrapper.querySelector<HTMLElement>('.next-checkbox');
    const checkSvg = wrapper.querySelector<HTMLElement>('.next-checkbox-check');
    const dashSpan = wrapper.querySelector<HTMLElement>('.next-checkbox-dash');

    if (boxSpan) {
      if (checked || indeterminate) {
        boxSpan.classList.add('bg-cta-primary', 'border-transparent', 'text-white');
        boxSpan.classList.remove('bg-surface', 'border-border-strong', 'text-transparent');
        boxSpan.style.backgroundColor = '';
        boxSpan.style.borderColor = '';
        boxSpan.style.color = '';
      } else {
        boxSpan.classList.remove('bg-cta-primary', 'border-transparent', 'text-white');
        boxSpan.classList.add('bg-surface', 'border-border-strong', 'text-transparent');
        boxSpan.style.backgroundColor = '';
        boxSpan.style.borderColor = '';
        boxSpan.style.color = '';
      }
    }

    if (checkSvg) {
      checkSvg.classList.toggle('block', checked);
      checkSvg.classList.toggle('hidden', !checked);
    }

    if (dashSpan) {
      dashSpan.classList.toggle('block', indeterminate && !checked);
      dashSpan.classList.toggle('hidden', !(indeterminate && !checked));
    }
  },

  handleBatchSelectToggle(event: CustomEvent) {
    const checked = event.detail?.selectAll ?? false;
    cartStore.toggleAll(checked);

    const el = this.$el as HTMLElement;
    el.querySelectorAll<HTMLInputElement>('.next-checkbox-input').forEach((input) => {
      this.syncCheckbox(input, checked);
    });
  },

  handleSupplierSelect(event: CustomEvent) {
    const supplierId = event.detail?.supplierId as string | undefined;
    const selected = event.detail?.selected ?? false;
    if (!supplierId) return;

    cartStore.toggleSupplierSelection(supplierId, selected);

    const el = this.$el as HTMLElement;
    const supplierCard = el.querySelector<HTMLElement>(`[data-supplier-id="${supplierId}"]`);
    if (!supplierCard) return;

    supplierCard.querySelectorAll<HTMLInputElement>('.next-checkbox-input').forEach((input) => {
      this.syncCheckbox(input, selected);
    });
  },

  handleCheckboxChange(event: CustomEvent) {
    const target = event.target as HTMLElement;
    const skuRow = target.closest<HTMLElement>('[data-sku-id]');
    const productRow = target.closest<HTMLElement>('[data-product-id]');
    const checked = event.detail?.checked ?? false;

    if (skuRow) {
      const skuId = skuRow.dataset.skuId;
      if (!skuId) return;
      cartStore.toggleSkuSelection(skuId, checked);
      this.updateParentCheckboxStates(skuRow);
      return;
    }

    if (productRow) {
      const productId = productRow.dataset.productId;
      if (!productId) return;

      cartStore.toggleProductSelection(productId, checked);
      productRow.querySelectorAll<HTMLInputElement>('.sc-c-sku-container-new .next-checkbox-input').forEach((input) => {
        this.syncCheckbox(input, checked);
      });

      const supplierCard = productRow.closest<HTMLElement>('[data-supplier-id]');
      if (supplierCard) {
        const supplierId = supplierCard.dataset.supplierId;
        if (supplierId) {
          const supplierCheck = supplierCard.querySelector<HTMLInputElement>(`#supplier-checkbox-${supplierId}`);
          if (supplierCheck) {
            const productChecks = supplierCard.querySelectorAll<HTMLInputElement>('.sc-c-spu-container-new > .flex .next-checkbox-input');
            const allSelected = Array.from(productChecks).every((checkbox) => checkbox.checked);
            const someSelected = Array.from(productChecks).some((checkbox) => checkbox.checked || checkbox.indeterminate);
            this.syncCheckbox(supplierCheck, allSelected, someSelected && !allSelected);
          }
        }
      }
    }
  },

  handleQuantityChange(event: CustomEvent) {
    const inputId = event.detail?.id as string | undefined;
    const value = event.detail?.value as number;
    if (!inputId) return;

    const skuId = inputId.replace('sku-qty-', '');
    const prevQty = cartStore.getSku(skuId)?.sku.quantity ?? value;
    cartStore.updateSkuQuantity(skuId, value);

    if (isLoggedIn()) {
      apiUpdateCartItem(skuId, value).catch((err: Error) => {
        // Backend'de yoksa (local-only item) sessizce geç
        if (err.message?.includes('bulunamadı')) return;
        cartStore.updateSkuQuantity(skuId, prevQty);
        this.syncSkuQuantityInput(skuId, prevQty);
        showCartError(err.message || t('cart.stockError'));
      });
    }
  },

  handleSkuFillMin(event: CustomEvent) {
    const skuId = event.detail?.skuId as string | undefined;
    if (!skuId) return;

    const snapshot = cartStore.getSku(skuId);
    if (!snapshot) return;

    const prevQty = snapshot.sku.quantity;
    cartStore.fillSkuToMinQty(skuId);

    const updatedSku = cartStore.getSku(skuId)?.sku;
    if (updatedSku) {
      this.syncSkuQuantityInput(skuId, updatedSku.quantity);
      if (isLoggedIn()) {
        apiUpdateCartItem(skuId, updatedSku.quantity).catch((err: Error) => {
          if (err.message?.includes('bulunamadı')) return;
          cartStore.updateSkuQuantity(skuId, prevQty);
          this.syncSkuQuantityInput(skuId, prevQty);
          showCartError(err.message || t('cart.stockError'));
        });
      }
    }
  },

  handleSkuDelete(event: CustomEvent) {
    const skuId = event.detail?.skuId as string | undefined;
    if (!skuId) return;

    const snapshot = cartStore.getSku(skuId);
    const productId = snapshot?.product.id;
    const supplierId = snapshot?.supplier.id;
    const productSkuCount = snapshot?.product.skus.length ?? 0;
    const supplierProductCount = snapshot?.supplier.products.length ?? 0;

    cartStore.deleteSku(skuId);

    if (isLoggedIn()) {
      apiRemoveCartItem(skuId).catch(() => { /* silent */ });
    }

    const el = this.$el as HTMLElement;
    el.querySelector(`[data-sku-id="${skuId}"]`)?.remove();

    if (productSkuCount <= 1 && productId) {
      el.querySelector(`[data-product-id="${productId}"]`)?.remove();
      if (supplierProductCount <= 1 && supplierId) {
        el.querySelector(`[data-supplier-id="${supplierId}"]`)?.remove();
      }
    }
  },

  handleProductDelete(event: CustomEvent) {
    const productId = event.detail?.productId as string | undefined;
    if (!productId) return;

    const snapshot = cartStore.getProduct(productId);
    const supplierId = snapshot?.supplier.id;
    const supplierProductCount = snapshot?.supplier.products.length ?? 0;

    // Collect sku ids before deletion for API calls
    const skuIds = snapshot?.product.skus.map(s => s.id) ?? [];

    cartStore.deleteProduct(productId);

    if (isLoggedIn()) {
      skuIds.forEach(id => apiRemoveCartItem(id).catch(() => { /* silent */ }));
    }

    const el = this.$el as HTMLElement;
    el.querySelector(`[data-product-id="${productId}"]`)?.remove();

    if (supplierProductCount <= 1 && supplierId) {
      el.querySelector(`[data-supplier-id="${supplierId}"]`)?.remove();
    }
  },

  handleBatchDelete() {
    const selectedIds = new Set(cartStore.getSelectedSkus().map((sku) => sku.id));
    cartStore.deleteSelected();

    if (isLoggedIn()) {
      selectedIds.forEach(id => apiRemoveCartItem(id).catch(() => { /* silent */ }));
    }

    const el = this.$el as HTMLElement;
    selectedIds.forEach((skuId) => {
      el.querySelector(`[data-sku-id="${skuId}"]`)?.remove();
    });

    el.querySelectorAll<HTMLElement>('[data-product-id]').forEach((product) => {
      if (!product.querySelector('[data-sku-id]')) product.remove();
    });

    el.querySelectorAll<HTMLElement>('[data-supplier-id]').forEach((supplier) => {
      if (!supplier.querySelector('[data-product-id]')) supplier.remove();
    });
  },

  handleProductFavorite(event: CustomEvent) {
    const productId = event.detail?.productId as string | undefined;
    if (!productId) return;

    const snapshot = cartStore.getProduct(productId);
    if (!snapshot) return;

    // Save to favorites store
    addToFavorites({
      id: productId,
      image: snapshot.product.skus[0]?.skuImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      title: snapshot.product.title,
      priceRange: formatPrice(snapshot.product.skus[0]?.unitPrice || 0, snapshot.product.skus[0]?.baseCurrency || 'USD'),
      minOrder: snapshot.product.moqLabel || 'Min. order: 1 piece'
    });

    showFavoriteToast();

    const supplierId = snapshot.supplier.id;
    const supplierProductCount = snapshot.supplier.products.length;

    cartStore.deleteProduct(productId);
    const el = this.$el as HTMLElement;
    el.querySelector(`[data-product-id="${productId}"]`)?.remove();

    if (supplierProductCount <= 1 && supplierId) {
      el.querySelector(`[data-supplier-id="${supplierId}"]`)?.remove();
    }
  },

  handleCheckoutSupplier(event: CustomEvent) {
    const supplierId = event.detail?.supplierId as string | undefined;
    if (!supplierId) return;

    // First, uncheck all selected skus globally
    cartStore.toggleAll(false);

    // Then, select only the specific supplier
    cartStore.toggleSupplierSelection(supplierId, true);

    // Finally, redirect to checkout with supplier flag
    window.location.href = `${getBaseUrl()}pages/order/checkout.html?supplier=1`;
  },

  updateParentCheckboxStates(skuRow: Element) {
    const productRow = skuRow.closest<HTMLElement>('[data-product-id]');
    if (!productRow) return;

    const productId = productRow.dataset.productId;
    const productCheckbox = productId ? productRow.querySelector<HTMLInputElement>(`#product-checkbox-${productId}`) : null;
    const skuChecks = Array.from(productRow.querySelectorAll<HTMLInputElement>('.sc-c-sku-container-new .next-checkbox-input'));

    if (productCheckbox && skuChecks.length > 0) {
      const all = skuChecks.every((checkbox) => checkbox.checked);
      const some = skuChecks.some((checkbox) => checkbox.checked || checkbox.indeterminate);
      this.syncCheckbox(productCheckbox, all, some && !all);
    }

    const supplier = productRow.closest<HTMLElement>('[data-supplier-id]');
    if (!supplier) return;

    const supplierId = supplier.dataset.supplierId;
    const supplierCheckbox = supplierId ? supplier.querySelector<HTMLInputElement>(`#supplier-checkbox-${supplierId}`) : null;
    const productChecks = Array.from(supplier.querySelectorAll<HTMLInputElement>('.sc-c-spu-container-new > .flex .next-checkbox-input'));

    if (supplierCheckbox && productChecks.length > 0) {
      const all = productChecks.every((checkbox) => checkbox.checked);
      const some = productChecks.some((checkbox) => checkbox.checked || checkbox.indeterminate);
      this.syncCheckbox(supplierCheckbox, all, some && !all);
    }
  },

  syncSkuQuantityInput(skuId: string, quantity: number) {
    const el = this.$el as HTMLElement;
    const input = el.querySelector<HTMLInputElement>(`#sku-qty-${skuId}`);
    if (input) input.value = String(quantity);

    const picker = input?.closest<HTMLElement>('.number-picker');
    if (!picker) return;

    const dataStack = (picker as any)._x_dataStack; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (dataStack?.[0]) {
      dataStack[0].value = quantity;
    }
  },

  syncMoqRestrictions() {
    const el = this.$el as HTMLElement;
    const violations = cartStore.getSelectedSkuMoqViolations();
    const violationsBySkuId = new Map(violations.map((violation) => [violation.skuId, violation]));

    el.querySelectorAll<HTMLElement>('[data-sku-id]').forEach((skuRow) => {
      const skuId = skuRow.dataset.skuId;
      if (!skuId) return;

      const violation = violationsBySkuId.get(skuId);
      const warning = skuRow.querySelector<HTMLElement>('.sc-c-sku-moq-warning');
      const missingEl = skuRow.querySelector<HTMLElement>('.sc-c-sku-moq-missing');
      const quantityPicker = skuRow.querySelector<HTMLElement>('.number-picker');

      if (violation) {
        skuRow.style.backgroundColor = '#fff1f1';
        if (quantityPicker) quantityPicker.style.borderColor = '#ef4444';
        if (missingEl) missingEl.textContent = String(violation.missingQty);
        warning?.classList.remove('hidden');
      } else {
        skuRow.style.backgroundColor = '';
        if (quantityPicker) quantityPicker.style.borderColor = '';
        warning?.classList.add('hidden');
      }
    });

    const checkoutBtn = el.querySelector<HTMLAnchorElement>('.sc-summary-checkout-btn');
    const checkoutWarning = el.querySelector<HTMLElement>('.sc-summary-checkout-warning');
    const summary = cartStore.getSummary();
    const canCheckout = summary.selectedCount > 0 && violations.length === 0;

    if (checkoutBtn) {
      if (canCheckout) {
        checkoutBtn.setAttribute('href', '/pages/order/checkout.html');
        checkoutBtn.removeAttribute('aria-disabled');
        checkoutBtn.style.pointerEvents = '';
        checkoutBtn.style.cursor = '';
        checkoutBtn.style.opacity = '';
        checkoutBtn.style.backgroundColor = '';
      } else {
        checkoutBtn.removeAttribute('href');
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.pointerEvents = 'none';
        checkoutBtn.style.cursor = 'not-allowed';
        checkoutBtn.style.opacity = '0.55';
        checkoutBtn.style.backgroundColor = '#9ca3af';
      }
    }

    if (checkoutWarning) {
      if (violations.length > 0) {
        checkoutWarning.textContent = t('cart.moqWarning');
        checkoutWarning.classList.remove('hidden');
      } else if (summary.selectedCount === 0) {
        checkoutWarning.textContent = t('cart.selectAtLeastOne');
        checkoutWarning.classList.remove('hidden');
      } else {
        checkoutWarning.textContent = '';
        checkoutWarning.classList.add('hidden');
      }
    }
  },

  syncSummary() {
    const el = this.$el as HTMLElement;
    const summary = cartStore.getSummary();

    const countEl = el.querySelector<HTMLElement>('.sc-summary-selected-count');
    if (countEl) countEl.textContent = String(summary.selectedCount);

    const subtotalEl = el.querySelector<HTMLElement>('.sc-summary-product-subtotal');
    const cur = getSelectedCurrency();
    if (subtotalEl) subtotalEl.textContent = formatCurrency(summary.productSubtotal, cur);

    const discountRow = el.querySelector<HTMLElement>('.sc-summary-discount-row');
    const discountEl = el.querySelector<HTMLElement>('.sc-summary-discount');
    const banner = el.querySelector<HTMLElement>('.sc-summary-savings-banner');

    if (summary.discount > 0) {
      const formatted = `- ${formatCurrency(summary.discount, cur)}`;
      discountRow?.classList.remove('hidden');
      if (discountEl) discountEl.textContent = formatted;
      if (banner) {
        banner.classList.remove('hidden');
        banner.innerHTML = sanitizeHtml(t('cart.youSaved', { amount: `<strong>${formatCurrency(summary.discount, cur)}</strong>` }));
      }
    } else {
      discountRow?.classList.add('hidden');
      banner?.classList.add('hidden');
    }

    const totalEl = el.querySelector<HTMLElement>('.sc-summary-subtotal');
    if (totalEl) totalEl.textContent = formatCurrency(summary.subtotal, cur);

    this.updateThumbnailGrid(summary.items);
  },

  syncSupplierTotals() {
    const el = this.$el as HTMLElement;

    el.querySelectorAll<HTMLElement>('.sc-c-supplier-container').forEach((container) => {
      const supplierId = container.dataset.supplierId;
      if (!supplierId) return;

      const supplier = cartStore.getSupplier(supplierId);
      if (!supplier) return;

      let subtotal = 0;
      supplier.products.forEach(product => {
        product.skus.forEach(sku => {
          if (sku.selected) {
            const converted = convertPrice(sku.unitPrice, sku.baseCurrency || 'USD');
            subtotal += converted * sku.quantity;
          }
        });
      });

      const totalEl = container.querySelector<HTMLElement>('.sc-c-supplier-total-text');
      if (totalEl) {
        if (subtotal > 0) {
          totalEl.textContent = `Toplam: ${formatCurrency(subtotal, getSelectedCurrency())}`;
        } else {
          totalEl.textContent = '';
        }
      }
    });
  },

  syncBatchBar() {
    const el = this.$el as HTMLElement;

    const total = cartStore.getTotalSkuCount();
    const selected = cartStore.getSelectedSkuCount();

    const count = el.querySelector<HTMLElement>('.sc-c-batch-count');
    if (count) count.textContent = `(${total})`;

    const deleteBtn = el.querySelector<HTMLButtonElement>('.sc-c-batch-delete-btn');
    if (deleteBtn) deleteBtn.disabled = selected === 0;

    const selectAll = el.querySelector<HTMLInputElement>('#batch-select-all');
    if (selectAll) {
      this.syncCheckbox(selectAll, total > 0 && selected === total, selected > 0 && selected < total);
    }
  },

  updateThumbnailGrid(items: { image: string; quantity: number }[]) {
    const track = document.querySelector<HTMLElement>('.checkout-items-images');
    if (!track) return;

    track.innerHTML = items.map((item) => `
      <div class="relative w-16 h-16 rounded-md overflow-hidden border border-border-default shrink-0">
        <img src="${item.image}" alt="SKU" class="w-full h-full object-cover" />
        <span class="absolute right-0 bottom-0 px-1 py-[2px] rounded-tl bg-black/65 text-white text-[11px] font-bold leading-none">${item.quantity}</span>
      </div>
    `).join('');

    track.dispatchEvent(new Event('scroll'));
  },

  initThumbnailSlider() {
    const wrapper = document.querySelector<HTMLElement>('.checkout-items-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector<HTMLElement>('.checkout-items-images');
    const left = wrapper.querySelector<HTMLButtonElement>('[data-dir="left"]');
    const right = wrapper.querySelector<HTMLButtonElement>('[data-dir="right"]');
    if (!track || !left || !right) return;

    const updateVisibility = () => {
      const overflows = track.scrollWidth > track.clientWidth + 1;
      left.classList.toggle('!hidden', !overflows);
      right.classList.toggle('!hidden', !overflows);

      if (!overflows) return;

      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

      left.classList.toggle('!opacity-0', atStart);
      left.classList.toggle('!pointer-events-none', atStart);
      right.classList.toggle('!opacity-0', atEnd);
      right.classList.toggle('!pointer-events-none', atEnd);
    };

    wrapper.querySelectorAll<HTMLButtonElement>('.checkout-items-arrow').forEach((button) => {
      button.addEventListener('click', () => {
        const dir = button.dataset.dir;
        track.scrollBy({ left: dir === 'left' ? -140 : 140, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    updateVisibility();
  },

  initViewAllModal() {
    const viewAllBtn = document.querySelector<HTMLButtonElement>('.sc-view-all-items');
    if (!viewAllBtn) return;

    // Modal'ı body'ye ekle (sticky parent fixed positioning'i bozuyor)
    let modal = document.getElementById('cart-view-all-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cart-view-all-modal';
      modal.className = 'fixed inset-0 z-[9999] hidden items-center justify-center';
      modal.innerHTML = `
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" data-modal-backdrop></div>
        <div class="relative bg-white rounded-xl shadow-2xl w-[90vw] max-w-[480px] max-h-[80vh] flex flex-col overflow-hidden" style="animation: modalSlideUp 0.25s ease-out;">
          <div class="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
            <h3 class="text-base font-bold text-[#222]"><span>${t('cart.orderSummary')}</span> — <span class="sc-modal-item-count text-[#f59e0b]"></span></h3>
            <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors" data-close-view-all aria-label="${t('common.close')}">
              <svg class="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="overflow-y-auto p-5 flex-1 sc-modal-suppliers-content"></div>
        </div>`;
      document.body.appendChild(modal);
    }

    const openModal = () => {
      this.updateViewAllModal();
      modal!.classList.remove('hidden');
      modal!.classList.add('flex');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal!.classList.add('hidden');
      modal!.classList.remove('flex');
      document.body.style.overflow = '';
    };

    viewAllBtn.addEventListener('click', openModal);

    modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', closeModal);
    modal.querySelector('[data-close-view-all]')?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal!.classList.contains('hidden')) closeModal();
    });
  },

  updateViewAllModal() {
    const modal = document.getElementById('cart-view-all-modal');
    if (!modal) return;

    const suppliers = cartStore.getSuppliers();
    const summary = cartStore.getSummary();

    const countEl = modal.querySelector<HTMLElement>('.sc-modal-item-count');
    if (countEl) countEl.textContent = `${summary.selectedCount} ${t('common.item')}`;

    const content = modal.querySelector<HTMLElement>('.sc-modal-suppliers-content');
    if (!content) return;

    const sections = suppliers
      .filter((s) => s.products.some((p) => p.skus.some((sk) => sk.selected)))
      .map((supplier) => {
        const selectedSkus = supplier.products.flatMap((p) =>
          p.skus.filter((sk) => sk.selected).map((sk) => ({
            image: sk.skuImage,
            quantity: sk.quantity,
            price: sk.unitPrice,
            currency: sk.currency,
          }))
        );
        if (selectedSkus.length === 0) return '';

        const skuCards = selectedSkus
          .map(
            (sk) => `
            <div class="flex flex-col items-center gap-1.5 w-[72px] flex-shrink-0">
              <div class="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-[#e5e5e5]">
                <img src="${sk.image}" alt="" class="w-full h-full object-cover" />
                <span class="absolute bottom-0 right-0 bg-black/60 text-white rounded-tl text-[11px] font-bold leading-4 px-1 py-px">${sk.quantity}</span>
              </div>
              <span class="text-[11px] leading-[14px] text-[#666] text-center line-clamp-2 w-full">${sk.currency}${sk.price.toFixed(2)}</span>
            </div>`
          )
          .join('');

        return `
          <div class="mb-4 last:mb-0">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-5 h-5 rounded-full bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
              </div>
              <span class="text-[13px] font-semibold text-[#222] truncate">${supplier.name}</span>
              <span class="text-[11px] text-[#999] flex-shrink-0">(${selectedSkus.length})</span>
            </div>
            <div class="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">${skuCards}</div>
          </div>`;
      })
      .join('');

    content.innerHTML = sections || `<p class="text-sm text-[#999] text-center py-8">${t('cart.selectAtLeastOne')}</p>`;
  },

  checkEmptyCart() {
    if (cartStore.getTotalSkuCount() > 0) return;

    const el = this.$el as HTMLElement;
    el.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="text-text-tertiary mb-6">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 class="text-2xl font-bold text-text-heading mb-2">${t('cart.empty')}</h2>
        <p class="text-base text-text-secondary mb-8 max-w-md">${t('cart.emptyDesc')}</p>
        <a href="/pages/products.html" class="inline-flex items-center justify-center th-btn-dark th-btn-pill no-underline">
          ${t('cart.continueShopping')}
        </a>
      </div>
    `;
  },
}));
