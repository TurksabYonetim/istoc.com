/**
 * PaymentLayout Component
 * Internal left-nav with grouped sections:
 *   Özet: Ödeme yönetimi, İşlemler
 *   T/T: Havale hesapları, Havale Takibi
 *   Ek hizmetler: Alibaba.com Kartı, Pay Later for Business
 *
 * Modals: "Yeni bir kart ekle", "Tedarikçinin hesabını doğrula"
 * Inline view: "Havale dekontu yükle"
 */

import { paymentCardStore } from './state/PaymentCardStore';
import { getCurrencyCode } from '../../utils/currency';
import { t } from '../../i18n';

/* ────────────────────────────────────────
   NAV STRUCTURE
   ──────────────────────────────────────── */
interface PayNavGroup {
  title: string;
  items: { id: string; label: string }[];
}

const NAV_GROUPS: PayNavGroup[] = [
  {
    title: t('payment.navSummary'),
    items: [
      { id: 'payment-management', label: t('payment.paymentManagement') },
      { id: 'transactions', label: t('payment.transactions') },
    ],
  },
  {
    title: t('payment.navTT'),
    items: [
      { id: 'tt-accounts', label: t('payment.ttAccounts') },
      { id: 'tt-tracking', label: t('payment.ttTracking') },
    ],
  },
  {
    title: t('payment.navAdditionalServices'),
    items: [
      { id: 'alibaba-card', label: t('payment.alibabaCard') },
      { id: 'pay-later', label: t('payment.payLater') },
    ],
  },
];

/* ────────────────────────────────────────
   SHARED ICONS
   ──────────────────────────────────────── */
const SEARCH_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#666" stroke-width="1.3"/><path d="M11 11l3 3" stroke="#666" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const CALENDAR_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#999" stroke-width="1.2"/><path d="M2 6h12M5 1v3M11 1v3" stroke="#999" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const RECEIPT_ICON = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="10" y="4" width="28" height="36" rx="3" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="1"/><rect x="16" y="12" width="16" height="2.5" rx="1.25" fill="#D1D5DB"/><rect x="16" y="18" width="12" height="2.5" rx="1.25" fill="#D1D5DB"/><rect x="16" y="24" width="14" height="2.5" rx="1.25" fill="#D1D5DB"/><path d="M10 40l3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5V4H10v36z" fill="#E5E7EB"/></svg>`;

/* ────────────────────────────────────────
   SECTION: Ödeme yönetimi
   ──────────────────────────────────────── */
function renderPaymentManagement(): string {
  const cards = paymentCardStore.getCards();
  const savedCardsHtml = cards.length > 0 ? cards.map(c => `
      <div data-card-id="${c.id}" class="relative shrink-0 w-[200px] max-sm:w-[160px] h-[120px] max-sm:h-[100px] rounded-xl p-4 max-sm:p-3 flex flex-col justify-between group cursor-default"
           style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); box-shadow: 0 4px 12px rgba(0,0,0,0.18);">
        <div class="flex items-center justify-between">
          <span class="text-[10px] max-sm:text-[8px] font-bold tracking-widest text-white/50 uppercase">TradeHub</span>
          <span class="text-[11px] max-sm:text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded"
                style="background: rgba(255,255,255,0.15); color: white;">${c.brand}</span>
        </div>
        <div>
          <div class="text-sm max-sm:text-xs font-mono font-bold text-white tracking-widest mb-1 truncate">${c.cardNumber}</div>
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <div class="text-[9px] max-sm:text-[8px] text-white/40 uppercase tracking-wide">${t('payment.nameLabel')}</div>
              <div class="text-[11px] max-sm:text-[10px] text-white font-medium truncate">${c.cardholderName}</div>
            </div>
            <div class="text-right shrink-0 ml-2">
              <div class="text-[9px] max-sm:text-[8px] text-white/40 uppercase tracking-wide">${t('payment.lastUsedLabel')}</div>
              <div class="text-[11px] max-sm:text-[10px] text-white font-medium">${c.expiry || '—'}</div>
            </div>
          </div>
        </div>
        <!-- Sil button -->
        <button class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white bg-red-500/70 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer text-[10px] font-bold"
                onclick="this.closest('[data-card-id]').remove(); if(window.removeSavedCard) window.removeSavedCard('${c.id}')" title="${t('payment.deleteBtn')}">
          &times;
        </button>
      </div>
  `).join('') : '';

  // Add-card button as a card-shaped tile
  const addCardTile = `
    <div id="pay-add-card-btn" class="pay-add-card shrink-0 w-[200px] max-sm:w-[160px] h-[120px] max-sm:h-[100px] rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer transition-[border-color,background] duration-200"
         style="border-color: var(--color-border-strong, #ccc); background: transparent;"
         data-action="open-card-modal"
         onmouseenter="this.style.borderColor='var(--btn-bg, #ff6600)'; this.style.background='var(--color-primary-50, #fff9f5)';"
         onmouseleave="this.style.borderColor='var(--color-border-strong, #ccc)'; this.style.background='transparent';">
      <span style="font-size: 28px; line-height: 1; color: var(--color-text-secondary, #888);">+</span>
      <span class="text-xs font-medium text-center px-2" style="color: var(--color-text-primary, #333);">${t('payment.addNewCard')}</span>
    </div>
  `;

  return `
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.paymentManagementTitle')}</h1></div>

    <!-- Kayıtlı kartlar -->
    <div class="mb-8">
      <h2 class="text-base font-semibold text-text-primary mb-4">${t('payment.savedCardsTitle')}</h2>
      <div class="flex gap-4 max-sm:gap-3 overflow-x-auto pb-3" style="scrollbar-width: thin; scrollbar-color: var(--color-border-strong, #ccc) transparent;">
        ${savedCardsHtml}
        ${addCardTile}
      </div>
    </div>

    <!-- İşlemler -->
    <div class="mb-8">
      <h2 class="text-base font-semibold text-text-primary mb-4">${t('payment.transactionsTitle')}</h2>
      <div class="pay-tabs flex border-b border-border-default overflow-x-auto" data-tabgroup="pay-mgmt">
        <button class="pay-tabs__tab pay-tabs__tab--active py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-mgmt-payments">${t('payment.paymentsTab')}</button>
        <button class="pay-tabs__tab py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-mgmt-refunds">${t('payment.refundsTab')}</button>
      </div>
      <div class="pay-tab-content pay-tab-content--active" data-content="pay-mgmt-payments">
        <div class="pay-empty flex flex-col items-center justify-center py-12 px-6 text-center">
          <div class="opacity-50 mb-4">${RECEIPT_ICON}</div>
          <p class="text-sm text-text-tertiary m-0">${t('payment.noPaymentRecord')}</p>
        </div>
      </div>
      <div class="pay-tab-content" data-content="pay-mgmt-refunds">
        <div class="pay-empty flex flex-col items-center justify-center py-12 px-6 text-center">
          <div class="opacity-50 mb-4">${RECEIPT_ICON}</div>
          <p class="text-sm text-text-tertiary m-0">${t('payment.noRefundRecord')}</p>
        </div>
      </div>
    </div>

    <!-- Modal: Yeni bir kart ekle -->
    <div class="pay-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="pay-card-modal">
      <div class="pay-modal__overlay fixed inset-0 bg-black/45 z-[1]"></div>
      <div class="pay-modal__dialog relative z-[2] bg-surface rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto animate-[payModalIn_200ms_ease-out]">
        <div class="flex items-center justify-between px-6 max-sm:px-4 pt-5 pb-4 border-b border-[#f0f0f0]">
          <h3 class="text-lg max-sm:text-base font-bold text-text-primary m-0 truncate mr-2">${t('payment.addCardModalTitle')}</h3>
          <button class="pay-modal__close flex items-center justify-center w-8 h-8 shrink-0 bg-transparent border-none rounded-md cursor-pointer transition-[background] duration-150 hover:bg-surface-raised" aria-label="${t('payment.closeBtn')}">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="#333" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="pay-modal__body px-6 max-sm:px-4 py-5" x-data="{
          ccNum: '',
          get brand() {
             if (!this.ccNum) return '';
             const first = this.ccNum[0];
             return first === '4' ? 'VISA' : first === '5' ? 'MC' : first === '3' ? 'AMEX' : '';
          },
          formatCard() {
             let v = this.ccNum.replace(/\\D/g, '').substring(0, 16);
             this.ccNum = v.match(/.{1,4}/g)?.join(' ') || '';
             // Sync back to underlying element for the vanilla JS save handler
             $refs.numInput.value = this.ccNum;
          }
        }">
          <div class="flex gap-2 flex-wrap mb-5">
            <!-- VISA -->
            <div class="h-7 px-2 border rounded flex items-center justify-center bg-white transition-opacity" :class="brand && brand !== 'VISA' ? 'opacity-30' : 'opacity-100'" style="border-color: var(--color-border-default, #e5e5e5);">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" class="h-3 object-contain" alt="Visa" />
            </div>
            <!-- Mastercard -->
            <div class="h-7 px-2 border rounded flex items-center justify-center bg-white transition-opacity" :class="brand && brand !== 'MC' ? 'opacity-30' : 'opacity-100'" style="border-color: var(--color-border-default, #e5e5e5);">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" class="h-4 object-contain" alt="Mastercard" />
            </div>
            <!-- AMEX -->
            <div class="h-7 px-2 border rounded flex items-center justify-center bg-white transition-opacity" :class="brand && brand !== 'AMEX' ? 'opacity-30' : 'opacity-100'" style="border-color: var(--color-border-default, #e5e5e5);">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" class="h-4 object-contain" alt="Amex" />
            </div>
            <!-- Diğer logolar (Görsel tutarlılık için) -->
            <div class="h-7 px-2 border rounded flex items-center justify-center bg-white transition-opacity text-[10px] font-bold text-[#ff6000]" :class="brand ? 'opacity-30' : 'opacity-100'" style="border-color: var(--color-border-default, #e5e5e5);">Discover</div>
            <div class="h-7 px-2 border rounded flex items-center justify-center bg-white transition-opacity text-[10px] font-bold text-[#0e4c96]" :class="brand ? 'opacity-30' : 'opacity-100'" style="border-color: var(--color-border-default, #e5e5e5);">JCB</div>
          </div>
          <div class="mb-4">
            <input id="pay-card-num" x-ref="numInput" x-model="ccNum" @input="formatCard" type="text" class="w-full py-2.5 px-3.5 text-sm border border-border-strong rounded-lg outline-none text-text-primary transition-[border-color] duration-150 focus:border-[#999]" placeholder="${t('payment.cardNumberPlaceholder')}" maxlength="19" />
          </div>
          <div class="flex gap-3 mb-4">
            <input id="pay-card-fn" type="text" class="flex-1 py-2.5 px-3.5 text-sm border border-border-strong rounded-lg outline-none text-text-primary transition-[border-color] duration-150 focus:border-[#999]" placeholder="${t('payment.firstNamePlaceholder')}" />
            <input id="pay-card-ln" type="text" class="flex-1 py-2.5 px-3.5 text-sm border border-border-strong rounded-lg outline-none text-text-primary transition-[border-color] duration-150 focus:border-[#999]" placeholder="${t('payment.lastNamePlaceholder')}" />
          </div>
          <div class="flex gap-3 max-sm:gap-2 mb-4 items-center flex-wrap">
            <select id="pay-card-month" class="py-2.5 px-3.5 max-sm:py-2 max-sm:px-2.5 text-sm max-sm:text-xs border border-border-strong rounded-lg outline-none text-text-primary bg-surface cursor-pointer min-w-[80px] max-sm:min-w-[60px]"><option value="">${t('payment.monthPlaceholder')}</option>${Array.from({ length: 12 }, (_, i) => `<option value="${String(i + 1).padStart(2, '0')}">${String(i + 1).padStart(2, '0')}</option>`).join('')}</select>
            <span class="text-base text-text-tertiary px-0.5">/</span>
            <select id="pay-card-year" class="py-2.5 px-3.5 max-sm:py-2 max-sm:px-2.5 text-sm max-sm:text-xs border border-border-strong rounded-lg outline-none text-text-primary bg-surface cursor-pointer min-w-[90px] max-sm:min-w-[70px]"><option value="">${t('payment.yearPlaceholder')}</option>${Array.from({ length: 10 }, (_, i) => `<option value="${2025 + i}">${2025 + i}</option>`).join('')}</select>
            <div class="flex items-center gap-2 ml-auto">
              <input type="text" class="w-[100px] max-sm:w-[80px] py-2.5 px-3.5 max-sm:py-2 max-sm:px-2.5 text-sm max-sm:text-xs border border-border-strong rounded-lg outline-none text-text-primary transition-[border-color] duration-150 focus:border-[#999]" placeholder="CVV/CVC *" maxlength="4" />
              <div class="flex gap-1 opacity-60 max-sm:hidden">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="#999" stroke-width="1.2"/><path d="M2 7h12" stroke="#999" stroke-width="1.2"/></svg>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#999" stroke-width="1.2"/><path d="M8 5v3m0 2.5h.01" stroke="#999" stroke-width="1.2" stroke-linecap="round"/></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2.5 px-6 max-sm:px-4 pb-5 pt-4 border-t border-[#f0f0f0]">
          <button class="pay-modal__btn--primary th-btn-dark max-sm:w-full">${t('payment.saveBtn')}</button>
        </div>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: İşlemler (Tüm İşlemler)
   ──────────────────────────────────────── */
function renderTransactions(): string {
  return `
    <div class="text-[13px] text-text-tertiary mb-2">${t('payment.breadcrumbTransactions')}</div>
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.allTransactions')}</h1></div>

    <div class="pay-tabs flex border-b border-border-default overflow-x-auto" data-tabgroup="pay-trans">
      <button class="pay-tabs__tab pay-tabs__tab--active py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-trans-payments">${t('payment.paymentTab')}</button>
      <button class="pay-tabs__tab py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-trans-refunds">${t('payment.refundTab')}</button>
    </div>

    <div class="pay-tab-content pay-tab-content--active" data-content="pay-trans-payments">
      <!-- Status pills -->
      <div class="flex items-center gap-3 py-4 flex-wrap">
        <span class="text-[13px] font-semibold text-text-primary whitespace-nowrap">${t('payment.statusLabel')}</span>
        <div class="pay-pills flex flex-wrap gap-2">
          <button class="pay-pill pay-pill--active py-1.5 px-3.5 text-xs rounded-2xl border cursor-pointer whitespace-nowrap transition-all duration-150 text-white bg-[#222] border-[#222]">${t('payment.statusAll')}</button>
          <button class="pay-pill py-1.5 px-3.5 text-xs rounded-2xl border cursor-pointer whitespace-nowrap transition-all duration-150 text-text-secondary bg-surface-raised border-border-default hover:border-[#bbb] hover:bg-[#eee]">${t('payment.paymentsNotArrived')}</button>
          <button class="pay-pill py-1.5 px-3.5 text-xs rounded-2xl border cursor-pointer whitespace-nowrap transition-all duration-150 text-text-secondary bg-surface-raised border-border-default hover:border-[#bbb] hover:bg-[#eee]">${t('payment.pendingSupplierMatch')}</button>
          <button class="pay-pill py-1.5 px-3.5 text-xs rounded-2xl border cursor-pointer whitespace-nowrap transition-all duration-150 text-text-secondary bg-surface-raised border-border-default hover:border-[#bbb] hover:bg-[#eee]">${t('payment.completed')}</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center justify-between gap-3 py-3 flex-wrap max-md:flex-col max-md:items-start">
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="relative flex items-center gap-1.5">
            <input type="text" class="py-2 px-3 text-[13px] border border-border-strong rounded-md outline-none text-text-primary min-w-[160px] max-sm:min-w-0 max-sm:w-full transition-[border-color] duration-150 pr-8 focus:border-[#999]" placeholder="${t('payment.selectTime')}" readonly />
            <span class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">${CALENDAR_ICON}</span>
          </div>
          <input type="text" class="py-2 px-3 text-[13px] border border-border-strong rounded-md outline-none text-text-primary min-w-[160px] max-sm:min-w-0 max-sm:w-full transition-[border-color] duration-150 focus:border-[#999]" placeholder="${t('payment.searchByAmount')}" />
          <select class="py-2 px-3 text-[13px] border border-border-strong rounded-md outline-none text-text-primary bg-surface cursor-pointer min-w-[120px]"><option>${t('payment.currencyLabel')}</option><option>USD</option><option>EUR</option><option>TRY</option></select>
          <a href="#" class="text-[13px] text-text-secondary no-underline whitespace-nowrap transition-[color] duration-150 hover:text-text-primary hover:underline">${t('payment.removeFilters')}</a>
        </div>
        <button class="th-btn-dark inline-flex items-center gap-1.5 whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${t('payment.exportDetails')}
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto mt-2">
        <table class="w-full border-collapse text-[13px]">
          <thead><tr>
            <th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSendTime')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSupplier')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thPaymentMethod')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thAmount')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thTransactionFee')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thStatus')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thActions')}</th>
          </tr></thead>
          <tbody><tr><td colspan="7" class="text-center text-text-tertiary !py-12 px-4">Henüz bir ödeme kaydı bulunmamaktadır</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="pay-tab-content" data-content="pay-trans-refunds">
      <div class="pay-empty flex flex-col items-center justify-center py-12 px-6 text-center">
        <div class="opacity-50 mb-4">${RECEIPT_ICON}</div>
        <p class="text-sm text-text-tertiary m-0">${t('payment.noRefundRecord')}</p>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: Havale hesapları (Banka Havalesi Hesapları)
   ──────────────────────────────────────── */
function renderTTAccounts(): string {
  return `
    <div class="text-[13px] text-text-tertiary mb-2">${t('payment.breadcrumbTTAccounts')}</div>
    <div class="flex items-center justify-between flex-wrap gap-3 mb-6 max-md:flex-col max-md:items-start">
      <h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.bankWireTransferAccounts')}</h1>
      <div class="flex items-center gap-2 relative max-md:flex-wrap max-sm:w-full">
        <button class="inline-flex items-center gap-1.5 py-2 px-4 max-sm:px-3 text-[13px] max-sm:text-xs text-text-primary bg-surface border border-border-strong rounded-full cursor-pointer transition-[border-color,background] duration-150 whitespace-nowrap hover:border-[#999] hover:bg-surface-muted max-sm:flex-1" data-action="open-verify-modal">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="#333" stroke-width="1.2"/><path d="M6 8l2 2 4-4" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="truncate">${t('payment.verifySupplierAccount')}</span>
        </button>
        <button class="inline-flex items-center gap-1.5 py-2 px-4 max-sm:px-3 text-[13px] max-sm:text-xs text-text-primary bg-surface border border-border-strong rounded-full cursor-pointer transition-[border-color,background] duration-150 whitespace-nowrap hover:border-[#999] hover:bg-surface-muted max-sm:flex-1" data-action="show-upload">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#333" stroke-width="1.2"/><path d="M8 5v6M5 8h6" stroke="#333" stroke-width="1.2" stroke-linecap="round"/></svg>
          <span class="truncate">${t('payment.uploadWireReceipt')}</span>
        </button>
        <button class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-border-strong rounded-full cursor-pointer transition-[border-color,background] duration-150 hover:border-[#999] hover:bg-surface-muted" aria-label="Bilgi" data-action="toggle-tooltip">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#666" stroke-width="1.2"/><path d="M8 5v3m0 2.5h.01" stroke="#666" stroke-width="1.2" stroke-linecap="round"/></svg>
        </button>
        <div class="pay-tooltip hidden absolute top-full right-0 mt-2 py-3.5 px-4.5 bg-surface border border-border-default rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-[13px] text-text-secondary leading-normal min-w-[280px] max-w-[360px] z-[100] max-md:right-auto max-md:left-0 max-md:min-w-[220px]" id="pay-tt-tooltip">
          ${t('payment.tooltipVerify')}
          <button class="pay-tooltip__close absolute top-2 right-2.5 bg-transparent border-none text-lg text-text-tertiary cursor-pointer leading-none hover:text-text-primary" aria-label="${t('payment.closeBtn')}">&times;</button>
        </div>
      </div>
    </div>

    <div class="pay-tabs flex border-b border-border-default overflow-x-auto" data-tabgroup="pay-tt">
      <button class="pay-tabs__tab pay-tabs__tab--active py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-tt-all">${t('payment.allTab')}</button>
      <button class="pay-tabs__tab py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-tt-pending">${t('payment.pendingMatchTab')}</button>
      <button class="pay-tabs__tab py-3 px-5 max-sm:py-2.5 max-sm:px-3 text-[13px] max-sm:text-xs font-medium text-text-secondary bg-transparent border-none border-b-2 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px whitespace-nowrap hover:text-text-primary" data-tab="pay-tt-matched">${t('payment.matchedTab')}</button>
    </div>

    <!-- Search + Filters -->
    <div class="flex items-center justify-between gap-4 py-4 flex-wrap max-md:flex-col max-md:items-start">
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="flex items-stretch border border-border-strong rounded-md overflow-hidden">
          <input type="text" class="py-2 px-3 text-[13px] border-none rounded-none outline-none text-text-primary min-w-[200px] max-sm:min-w-0 max-sm:w-full" placeholder="${t('payment.searchSupplierEmail')}" />
          <button class="flex items-center justify-center px-2.5 bg-transparent border-none border-l border-border-default cursor-pointer transition-[background] duration-150 hover:bg-surface-raised">${SEARCH_ICON}</button>
        </div>
        <div class="relative flex items-center gap-1.5">
          <input type="text" class="py-2 px-3 text-[13px] border border-border-strong rounded-md outline-none text-text-primary min-w-[160px] max-sm:min-w-0 max-sm:w-full transition-[border-color] duration-150 pr-8 focus:border-[#999]" placeholder="${t('payment.selectTime')}" readonly />
          <span class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">${CALENDAR_ICON}</span>
        </div>
        <a href="#" class="text-[13px] text-text-secondary no-underline whitespace-nowrap transition-[color] duration-150 hover:text-text-primary hover:underline">${t('payment.removeFilters')}</a>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-[13px] text-text-secondary whitespace-nowrap">${t('payment.totalWireAmount')}: <strong class="text-text-primary font-semibold">${getCurrencyCode()} 0.00</strong></span>
        <span class="text-[13px] text-text-secondary whitespace-nowrap">${t('payment.pendingMatchAmount')}: <strong class="text-text-primary font-semibold">${getCurrencyCode()} 0.00</strong></span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto mt-2">
      <table class="w-full border-collapse text-[13px]">
        <thead><tr>
          <th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thLastArrivalTime')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSupplierInfo')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSupplierTTAccount')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thTotalWireAmount')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thStatus')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thActions')}</th>
        </tr></thead>
        <tbody><tr><td colspan="6" class="text-center text-text-tertiary !py-12 px-4">Henüz bir ödeme kaydı bulunmamaktadır</td></tr></tbody>
      </table>
    </div>

    <!-- Modal: Tedarikçinin hesabını doğrula -->
    <div class="pay-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="pay-verify-modal">
      <div class="pay-modal__overlay fixed inset-0 bg-black/45 z-[1]"></div>
      <div class="pay-modal__dialog relative z-[2] bg-surface rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto animate-[payModalIn_200ms_ease-out]">
        <div class="flex items-center justify-between px-6 max-sm:px-4 pt-5 pb-4 border-b border-[#f0f0f0]">
          <h3 class="text-lg max-sm:text-base font-bold text-text-primary m-0 truncate mr-2">${t('payment.verifyModalTitle')}</h3>
          <button class="pay-modal__close flex items-center justify-center w-8 h-8 shrink-0 bg-transparent border-none rounded-md cursor-pointer transition-[background] duration-150 hover:bg-surface-raised" aria-label="${t('payment.closeBtn')}">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="#333" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="pay-modal__body px-6 max-sm:px-4 py-5">
          <div class="flex items-center gap-2.5 py-3 px-4 bg-[#FEF3C7] rounded-lg text-[13px] text-primary-800 mb-4">
            <span class="w-2 h-2 rounded-full bg-warning-500 shrink-0"></span>
            <span>${t('payment.verifyWarning')}</span>
          </div>
          <p class="text-[13px] text-text-secondary leading-relaxed mb-4">${t('payment.verifyDescription')}</p>
          <div class="mb-4">
            <input type="text" class="w-full py-2.5 px-3.5 text-sm border border-border-strong rounded-lg outline-none text-text-primary transition-[border-color] duration-150 focus:border-[#999]" placeholder="${t('payment.supplierAccountPlaceholder')}" />
          </div>
        </div>
        <div class="flex justify-between gap-2.5 px-6 max-sm:px-4 pb-5 pt-4 border-t border-[#f0f0f0] max-sm:flex-col-reverse">
          <button class="pay-modal__btn--cancel py-2.5 px-6 text-sm max-sm:text-xs font-medium rounded-lg border border-border-strong bg-surface text-text-secondary cursor-pointer transition-all duration-150 hover:border-[#999] hover:bg-surface-muted max-sm:w-full">${t('payment.cancelBtn')}</button>
          <button class="pay-modal__btn--primary th-btn-dark inline-flex items-center justify-center gap-1.5 max-sm:w-full">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${t('payment.verifyBtn')}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: Havale Takibi
   ──────────────────────────────────────── */
function renderTTTracking(): string {
  return `
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.ttTrackingTitle')}</h1></div>
    <div class="flex items-center justify-between gap-4 py-4 flex-wrap max-md:flex-col max-md:items-start">
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="flex items-stretch border border-border-strong rounded-md overflow-hidden">
          <input type="text" class="py-2 px-3 text-[13px] border-none rounded-none outline-none text-text-primary min-w-[200px] max-sm:min-w-0 max-sm:w-full" placeholder="${t('payment.searchRefNumber')}" />
          <button class="flex items-center justify-center px-2.5 bg-transparent border-none border-l border-border-default cursor-pointer transition-[background] duration-150 hover:bg-surface-raised">${SEARCH_ICON}</button>
        </div>
        <div class="relative flex items-center gap-1.5">
          <input type="text" class="py-2 px-3 text-[13px] border border-border-strong rounded-md outline-none text-text-primary min-w-[160px] max-sm:min-w-0 max-sm:w-full transition-[border-color] duration-150 pr-8 focus:border-[#999]" placeholder="${t('payment.selectTime')}" readonly />
          <span class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">${CALENDAR_ICON}</span>
        </div>
        <a href="#" class="text-[13px] text-text-secondary no-underline whitespace-nowrap transition-[color] duration-150 hover:text-text-primary hover:underline">${t('payment.removeFilters')}</a>
      </div>
    </div>
    <div class="overflow-x-auto mt-2">
      <table class="w-full border-collapse text-[13px]">
        <thead><tr>
          <th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thRefNo')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSupplier')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thWireAmount')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thSendDate')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thStatus')}</th><th class="text-left py-3 px-4 font-semibold text-text-secondary bg-surface-muted border-b border-border-default whitespace-nowrap">${t('payment.thActions')}</th>
        </tr></thead>
        <tbody><tr><td colspan="6" class="text-center text-text-tertiary !py-12 px-4">${t('payment.noTrackingRecord')}</td></tr></tbody>
      </table>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: Alibaba.com Kartı
   ──────────────────────────────────────── */
function renderAlibabaCard(): string {
  return `
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.alibabaCardTitle')}</h1></div>
    <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div class="opacity-50 mb-4">${RECEIPT_ICON}</div>
      <p class="text-sm text-text-tertiary m-0">${t('payment.comingSoon')}</p>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: Pay Later for Business
   ──────────────────────────────────────── */
function renderPayLater(): string {
  return `
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.payLaterTitle')}</h1></div>
    <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div class="opacity-50 mb-4">${RECEIPT_ICON}</div>
      <p class="text-sm text-text-tertiary m-0">${t('payment.comingSoon')}</p>
    </div>
  `;
}

/* ────────────────────────────────────────
   UPLOAD VIEW (inline, replaces content)
   ──────────────────────────────────────── */
function renderUpload(): string {
  return `
    <div class="mb-6"><h1 class="text-[22px] font-bold text-text-primary m-0 max-sm:text-lg truncate">${t('payment.uploadReceiptTitle')}</h1></div>
    <div class="mt-2">
      <p class="text-[13px] text-text-secondary leading-normal mb-5"><span class="text-error-500 font-semibold">*</span> ${t('payment.uploadDescription')} <a href="#" class="text-[#2563eb] no-underline hover:underline">${t('payment.viewExamples')}</a></p>
      <div class="flex gap-8 items-start p-6 border-2 border-dashed border-border-strong rounded-lg bg-surface-muted max-md:flex-col max-md:items-center max-md:text-center">
        <div class="shrink-0">
          <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
            <rect x="4" y="4" width="112" height="152" rx="4" fill="#F9FAFB" stroke="#D1D5DB" stroke-width="1" stroke-dasharray="4 4"/>
            <rect x="16" y="20" width="88" height="8" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="36" width="60" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="50" width="70" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="64" width="50" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="84" width="88" height="1" fill="#E5E7EB"/>
            <rect x="16" y="96" width="60" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="110" width="40" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="16" y="126" width="70" height="6" rx="2" fill="#E5E7EB"/>
          </svg>
        </div>
        <div class="flex-1 text-[13px] text-text-secondary leading-[1.7] [&_p]:m-0 [&_p]:mb-1.5 [&_strong]:text-text-primary">
          <p><strong>${t('payment.ensureDetails')}</strong></p>
          <p>${t('payment.fileSizeLimit')}</p>
          <p>${t('payment.supportedFormats')}</p>
          <p>Ayrıca manuel olarak <a href="#" class="text-[#2563eb] no-underline hover:underline">${t('payment.manualEntry')}</a></p>
          <button class="th-btn-dark inline-flex items-center gap-2 mt-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0-8l-3 3m3-3l3 3M3 12h10" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${t('payment.uploadFile')}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION MAP
   ──────────────────────────────────────── */
const SECTIONS: Record<string, () => string> = {
  'payment-management': renderPaymentManagement,
  'transactions': renderTransactions,
  'tt-accounts': renderTTAccounts,
  'tt-tracking': renderTTTracking,
  'alibaba-card': renderAlibabaCard,
  'pay-later': renderPayLater,
  'upload-receipt': renderUpload,
};

function getActiveSection(): string {
  const hash = window.location.hash.replace('#', '');
  return SECTIONS[hash] ? hash : 'payment-management';
}

/* ────────────────────────────────────────
   NAV RENDERER
   ──────────────────────────────────────── */
function renderNav(activeId: string): string {
  return NAV_GROUPS.map(group => {
    const items = group.items.map(item => {
      const active = item.id === activeId ? 'pay-nav__link--active font-semibold text-text-primary !border-l-[#222] bg-[#f9f9f9] max-md:!border-l-transparent max-md:!border-b-[#222]' : '';
      return `<a href="#${item.id}" class="pay-nav__link block py-2 px-5 text-sm text-text-primary no-underline border-l-[3px] border-transparent transition-[color,background,border-color] duration-150 leading-[1.4] hover:bg-surface-muted hover:text-text-primary max-md:border-l-0 max-md:border-b-2 max-md:border-transparent max-md:py-1.5 max-md:px-3 max-md:text-[13px] max-md:truncate ${active}" data-nav="${item.id}">${item.label}</a>`;
    }).join('');
    return `
      <div class="pay-nav__group mb-2 max-md:flex max-md:items-center max-md:mb-0 max-md:min-w-0">
        <span class="block py-2 px-5 text-xs font-semibold text-text-tertiary uppercase tracking-wide max-md:py-1 max-md:px-2 max-md:text-[11px] max-md:shrink-0 max-md:whitespace-nowrap">${group.title}</span>
        ${items}
      </div>
    `;
  }).join('');
}

/* ────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────── */
export function PaymentLayout(): string {
  const activeId = getActiveSection();
  const renderFn = SECTIONS[activeId] ?? renderPaymentManagement;

  return `
    <div class="pay-layout flex bg-surface rounded-lg min-h-[calc(100vh-80px)] overflow-hidden max-md:flex-col">
      <aside class="pay-nav w-[220px] shrink-0 border-r border-[#f0f0f0] py-6 sticky top-0 self-start max-h-[calc(100vh-80px)] overflow-y-auto max-md:w-full max-md:static max-md:max-h-none max-md:border-r-0 max-md:border-b max-md:border-[#f0f0f0] max-md:py-4 max-md:flex max-md:flex-wrap max-md:items-center max-md:overflow-x-auto">
        <h2 class="text-base font-bold text-text-primary px-5 pb-4 max-md:w-full max-md:px-4 max-md:pb-2">${t('payment.paymentTitle')}</h2>
        ${renderNav(activeId)}
      </aside>
      <div class="pay-content flex-1 min-w-0 py-6 px-7 max-md:py-4 max-md:px-5 max-sm:py-3 max-sm:px-3" id="pay-content">
        ${renderFn()}
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   INIT
   ──────────────────────────────────────── */
export function initPaymentLayout(): void {
  const contentEl = document.getElementById('pay-content');
  if (!contentEl) return;

  function navigate(): void {
    const activeId = getActiveSection();
    const renderFn = SECTIONS[activeId] ?? renderPaymentManagement;
    contentEl!.innerHTML = renderFn();

    document.querySelectorAll<HTMLAnchorElement>('.pay-nav__link').forEach(link => {
      const isActive = link.dataset.nav === activeId;
      link.classList.toggle('pay-nav__link--active', isActive);
      link.classList.toggle('font-semibold', isActive);
      link.classList.toggle('!border-l-[#222]', isActive);
      link.classList.toggle('bg-[#f9f9f9]', isActive);
    });

    initPayTabs();
    initPayModals();
    initPayPills();
    initPayTooltip();
  }

  window.addEventListener('hashchange', navigate);

  // Nav link clicks
  document.querySelectorAll<HTMLAnchorElement>('.pay-nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.nav ?? 'payment-management';
      window.location.hash = id;
    });
  });

  initPayTabs();
  initPayModals();
  initPayPills();
  initPayTooltip();
}

function initPayTabs(): void {
  document.querySelectorAll<HTMLElement>('.pay-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.pay-tabs__tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;
        tabs.forEach(t => {
          t.classList.remove('pay-tabs__tab--active');
          t.classList.remove('!text-text-primary', '!font-semibold', '!border-b-[#222]');
        });
        tab.classList.add('pay-tabs__tab--active');
        tab.classList.add('!text-text-primary', '!font-semibold', '!border-b-[#222]');
        const parent = tabGroup.parentElement;
        if (!parent) return;
        parent.querySelectorAll<HTMLElement>('.pay-tab-content').forEach(panel => {
          panel.classList.toggle('pay-tab-content--active', panel.dataset.content === targetId);
        });
      });
    });
  });

  // Apply active styles to initially active tabs
  document.querySelectorAll<HTMLButtonElement>('.pay-tabs__tab--active').forEach(tab => {
    tab.classList.add('!text-text-primary', '!font-semibold', '!border-b-[#222]');
  });
}

function initPayPills(): void {
  document.querySelectorAll<HTMLElement>('.pay-pills').forEach(group => {
    const pills = group.querySelectorAll<HTMLButtonElement>('.pay-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => {
          p.classList.remove('pay-pill--active');
          p.classList.remove('!text-white', '!bg-[#222]', '!border-[#222]');
          p.classList.add('text-text-secondary', 'bg-surface-raised', 'border-border-default');
        });
        pill.classList.add('pay-pill--active');
        pill.classList.add('!text-white', '!bg-[#222]', '!border-[#222]');
        pill.classList.remove('text-text-secondary', 'bg-surface-raised', 'border-border-default');
      });
    });
  });
}

function openPayModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closePayModal(modal: HTMLElement): void {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function initPayModals(): void {
  // Card modal
  document.querySelector<HTMLElement>('[data-action="open-card-modal"]')?.addEventListener('click', () => openPayModal('pay-card-modal'));

  // Verify modal
  document.querySelector<HTMLElement>('[data-action="open-verify-modal"]')?.addEventListener('click', () => openPayModal('pay-verify-modal'));

  // Upload view
  document.querySelector<HTMLElement>('[data-action="show-upload"]')?.addEventListener('click', () => {
    window.location.hash = 'upload-receipt';
  });

  // Close handlers for all modals
  document.querySelectorAll<HTMLElement>('.pay-modal').forEach(modal => {
    modal.querySelector('.pay-modal__overlay')?.addEventListener('click', () => closePayModal(modal));
    modal.querySelector('.pay-modal__close')?.addEventListener('click', () => closePayModal(modal));
    const cancelBtn = modal.querySelector('.pay-modal__btn--cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => closePayModal(modal));
  });

  // Save card button in card modal
  const cardModal = document.getElementById('pay-card-modal');
  if (cardModal) {
    const saveBtn = cardModal.querySelector<HTMLElement>('.pay-modal__btn--primary');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const numEl = document.getElementById('pay-card-num') as HTMLInputElement;
        const fnEl = document.getElementById('pay-card-fn') as HTMLInputElement;
        const lnEl = document.getElementById('pay-card-ln') as HTMLInputElement;
        const monthEl = document.getElementById('pay-card-month') as HTMLSelectElement;
        const yearEl = document.getElementById('pay-card-year') as HTMLSelectElement;

        const cardNumber = numEl?.value?.trim();
        const firstName = fnEl?.value?.trim();
        const lastName = lnEl?.value?.trim();
        const month = monthEl?.value;
        const year = yearEl?.value;

        if (!cardNumber || !firstName) {
          numEl?.classList.toggle('!border-red-400', !cardNumber);
          fnEl?.classList.toggle('!border-red-400', !firstName);
          return;
        }

        const cardholderName = `${firstName} ${lastName}`.trim();
        const expiry = month && year ? `${month}/${year}` : '';
        // Detect brand from first digit
        const firstDigit = cardNumber[0];
        const brand = firstDigit === '4' ? 'VISA' : firstDigit === '5' ? 'MC' : firstDigit === '3' ? 'AMEX' : 'CARD';

        // Save to store
        paymentCardStore.addCard({ cardNumber, expiry, cardholderName, brand });

        // Get the masked card (last 4 digits)
        const masked = cardNumber.replace(/\d(?=\d{4})/g, '*');

        // Dynamically insert card row before the add-card button
        const addBtn = document.getElementById('pay-add-card-btn');
        if (addBtn) {
          const savedId = Math.random().toString(36).substr(2, 9);
          const cardRow = document.createElement('div');
          cardRow.className = 'relative shrink-0 w-[200px] max-sm:w-[160px] h-[120px] max-sm:h-[100px] rounded-xl p-4 max-sm:p-3 flex flex-col justify-between group cursor-default';
          cardRow.style.cssText = 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); box-shadow: 0 4px 12px rgba(0,0,0,0.18);';
          cardRow.dataset.cardId = savedId;
          cardRow.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="text-[10px] max-sm:text-[8px] font-bold tracking-widest uppercase" style="color: rgba(255,255,255,0.5);">TradeHub</span>
              <span class="text-[11px] max-sm:text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded" style="background: rgba(255,255,255,0.15); color: white;">${brand}</span>
            </div>
            <div>
              <div class="text-sm max-sm:text-xs font-mono font-bold text-white tracking-widest mb-1 truncate">${masked}</div>
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <div class="text-[9px] max-sm:text-[8px] uppercase tracking-wide" style="color: rgba(255,255,255,0.4);">${t('payment.nameLabel')}</div>
                  <div class="text-[11px] max-sm:text-[10px] text-white font-medium truncate">${cardholderName}</div>
                </div>
                <div class="text-right shrink-0 ml-2">
                  <div class="text-[9px] max-sm:text-[8px] uppercase tracking-wide" style="color: rgba(255,255,255,0.4);">${t('payment.lastUsedLabel')}</div>
                  <div class="text-[11px] max-sm:text-[10px] text-white font-medium">${expiry || '—'}</div>
                </div>
              </div>
            </div>
            <button class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer text-[10px] font-bold"
                    style="background: rgba(239,68,68,0.7);"
                    onmouseenter="this.style.background='rgb(239,68,68)'" onmouseleave="this.style.background='rgba(239,68,68,0.7)'"
                    onclick="this.closest('[data-card-id]').remove(); if(window.removeSavedCard) window.removeSavedCard('${savedId}')" title="${t('payment.deleteBtn')}">
              &times;
            </button>
          `;
          addBtn.parentElement?.insertBefore(cardRow, addBtn);
        }

        // Clear inputs and close modal
        if (numEl) numEl.value = '';
        if (fnEl) fnEl.value = '';
        if (lnEl) lnEl.value = '';
        if (monthEl) monthEl.selectedIndex = 0;
        if (yearEl) yearEl.selectedIndex = 0;
        closePayModal(cardModal);
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector<HTMLElement>('.pay-modal:not(.hidden)');
      if (open) closePayModal(open);
    }
  });
}

function initPayTooltip(): void {
  const toggleBtn = document.querySelector<HTMLElement>('[data-action="toggle-tooltip"]');
  const tooltip = document.getElementById('pay-tt-tooltip');
  if (!toggleBtn || !tooltip) return;

  toggleBtn.addEventListener('click', () => {
    tooltip.classList.toggle('hidden');
  });

  tooltip.querySelector('.pay-tooltip__close')?.addEventListener('click', () => {
    tooltip.classList.add('hidden');
  });
}
