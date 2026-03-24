/**
 * Payment Failed Page
 * Shows error state with retry options.
 */
import '../style.css';
import { t } from '../i18n';
import { initLinkRewriter } from '../utils/url';

initLinkRewriter();

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const orderNumbers = params.get('orderNumbers') || '';
  const retryQuery = orderNumbers ? `?orderNumbers=${encodeURIComponent(orderNumbers)}` : '';

  const appEl = document.getElementById('app');
  if (!appEl) return;

  appEl.innerHTML = `
    <div class="flex flex-col items-center gap-6">
      <!-- Error Icon with animation -->
      <div class="w-20 h-20 rounded-full border-[3px] border-[#dc2626] flex items-center justify-center animate-[bounceIn_0.5s_ease-out]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>

      <!-- Title & Message -->
      <div>
        <h1 class="text-2xl md:text-[28px] font-bold text-[#222] mb-3"><span data-i18n="paymentStatus.failedTitle">${t('paymentStatus.failedTitle')}</span></h1>
        <p class="text-[#666] text-sm md:text-[15px] max-w-sm mx-auto">
          <span data-i18n="paymentStatus.failedMessage">${t('paymentStatus.failedMessage')}</span>
        </p>
      </div>

      <!-- Error details card -->
      <div class="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4 w-full max-w-sm">
        <div class="flex items-start gap-3 text-sm text-[#991b1b]">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div class="text-left">
            <p class="font-medium mb-1"><span data-i18n="paymentStatus.whatYouCanDo">${t('paymentStatus.whatYouCanDo')}</span></p>
            <ul class="text-xs text-[#b91c1c] space-y-1 list-disc list-inside">
              <li><span data-i18n="paymentStatus.checkCard">${t('paymentStatus.checkCard')}</span></li>
              <li><span data-i18n="paymentStatus.useDifferent">${t('paymentStatus.useDifferent')}</span></li>
              <li><span data-i18n="paymentStatus.contactBank">${t('paymentStatus.contactBank')}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col gap-3 w-full max-w-[320px]">
        <a href="/pages/order/checkout.html${retryQuery}"
          class="w-full bg-[#d24600] hover:bg-[#b03b00] text-white font-bold py-3 px-6 rounded-full transition-colors text-[15px] text-center block no-underline">
          <span data-i18n="paymentStatus.tryAgainBtn">${t('paymentStatus.tryAgainBtn')}</span>
        </a>
        <a href="/pages/order/checkout.html${retryQuery}"
          class="w-full bg-white border border-[#ccc] hover:border-[#999] hover:bg-gray-50 text-[#333] font-bold py-3 px-6 rounded-full transition-all text-center block text-[15px] no-underline">
          <span data-i18n="paymentStatus.useDifferentBtn">${t('paymentStatus.useDifferentBtn')}</span>
        </a>
        <a href="/pages/dashboard/orders.html"
          class="w-full text-[#666] hover:text-[#333] font-medium py-2 px-6 text-sm text-center block no-underline transition-colors">
          <span data-i18n="paymentStatus.viewAllOrders">${t('paymentStatus.viewAllOrders')}</span>
        </a>
      </div>
    </div>
  `;
});
