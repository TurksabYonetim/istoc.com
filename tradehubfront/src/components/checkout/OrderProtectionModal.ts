/**
 * OrderProtectionModal Component (C6)
 * Scrollable modal with 6 sections, 11 payment icons, backdrop overlay.
 * Close via X button, backdrop click, or ESC key.
 *
 * Reactivity handled by Alpine.js via x-data="orderProtectionModal".
 * Alpine.data('orderProtectionModal') is registered in src/alpine.ts.
 */

import type { ModalSection, PaymentIcon } from '../../types/checkout';

export interface OrderProtectionModalProps {
  sections: ModalSection[];
  paymentIcons: PaymentIcon[];
  infoBoxBullets: { dotColor: string; title: string; description: string }[];
  title?: string;
}

function renderIcon(iconType: string): string {
  const icons: Record<string, string> = {
    info: `<svg class="w-[18px] h-[18px] text-[#6b7280] min-w-[18px]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`,
    check: `<svg class="w-7 h-7 text-[#22c55e] min-w-[28px]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
    truck: `<svg class="w-7 h-7 text-[#22c55e] min-w-[28px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    shield: `<svg class="w-7 h-7 text-[#22c55e] min-w-[28px]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/></svg>`,
    clock: `<svg class="w-7 h-7 text-[#22c55e] min-w-[28px]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clip-rule="evenodd"/></svg>`,
    lock: `<svg class="w-7 h-7 text-[#22c55e] min-w-[28px]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>`,
  };
  return icons[iconType] || '';
}

function renderPaymentIcon(icon: PaymentIcon): string {
  return `
    <div
      class="flex items-center justify-center rounded-sm border border-[#e5e5e5]"
      style="width:40px;height:26px;background-color:${icon.bgColor};color:${icon.textColor}"
      title="${icon.altText}"
      role="img"
      aria-label="${icon.altText}"
    >
      <span class="text-[9px] font-bold leading-none select-none">${icon.name}</span>
    </div>
  `;
}

function renderInfoBox(section: ModalSection, bullets: { dotColor: string; title: string; description: string }[]): string {
  return `
    <div class="checkout-modal__info-box bg-[#f3f4f6] rounded-xl p-4 px-5 mb-6">
      <div class="flex items-center gap-2 mb-3">
        ${renderIcon(section.iconType)}
        <h3 class="text-[15px] font-semibold text-[#111827]">${section.title}</h3>
      </div>
      ${bullets.map(b => `
        <div class="flex items-start gap-3 mt-3">
          <span class="mt-1.5 min-w-[8px] w-2 h-2 rounded-full inline-block" style="background-color:${b.dotColor}"></span>
          <p class="text-sm text-[#6b7280]">
            <strong class="text-[#111827]">${b.title}</strong> ${b.description}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSection(section: ModalSection, paymentIcons: PaymentIcon[], isLast: boolean): string {
  const borderClass = isLast ? '' : 'border-b border-[#e5e5e5]';
  return `
    <div class="checkout-modal__section py-6 ${borderClass}">
      <div class="flex items-start gap-3">
        ${renderIcon(section.iconType)}
        <div class="flex-1">
          <h3 class="text-lg font-bold text-[#111827] mb-2">${section.title}</h3>
          <p class="text-sm text-[#374151] leading-relaxed">${section.description}</p>
          ${section.id === 'secure-payments' ? `
            <div class="flex flex-wrap gap-2 my-4">
              ${paymentIcons.map(i => renderPaymentIcon(i)).join('')}
            </div>
          ` : ''}
          ${section.learnMoreText ? `
            <a href="${section.learnMoreUrl || '#'}" class="text-[13px] text-[#374151] underline hover:text-[#111827] transition-colors">${section.learnMoreText}</a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function OrderProtectionModal({
  sections,
  paymentIcons,
  infoBoxBullets,
  title = 'Alibaba.com order protection',
}: OrderProtectionModalProps): string {
  const infoSection = sections.find(s => s.id === 'info-box');
  const contentSections = sections.filter(s => s.id !== 'info-box');

  return `
    <div
      id="order-protection-modal"
      x-data="orderProtectionModal"
      x-show="open"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click.self="close()"
      @keydown.escape.window="if (open) close()"
      @keydown="if (open) trapFocus($event)"
      @order-protection-modal-show.window="show()"
      class="checkout-modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <!-- Modal Card -->
      <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="checkout-modal__card bg-white rounded-xl shadow-xl max-w-lg w-[calc(100%-2rem)] max-h-[80vh] overflow-y-auto p-7 sm:p-8 relative"
      >
        <!-- Header -->
        <div class="checkout-modal__header flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 z-10">
          <h2 id="modal-title" class="text-xl font-bold text-[#111827]">${title}</h2>
          <button
            type="button"
            @click="close()"
            x-ref="closeBtn"
            class="checkout-modal__close text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer p-1"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Info Box -->
        ${infoSection ? renderInfoBox(infoSection, infoBoxBullets) : ''}

        <!-- Sections -->
        ${contentSections.map((s, i) => renderSection(s, paymentIcons, i === contentSections.length - 1)).join('')}
      </div>
    </div>
  `;
}

/**
 * @deprecated Replaced by Alpine.js x-data="orderProtectionModal" directives.
 * Alpine handles show/hide, click handlers, Escape key, body scroll lock, and focus trap.
 * Remove this call from page entry files and use startAlpine() instead.
 *
 * Transitional bridge: binds the trigger button (outside Alpine scope) to dispatch
 * the custom event that the Alpine component listens for.
 */
export function initOrderProtectionModal(): void {
  const triggerBtn = document.querySelector('[data-modal-target="order-protection-modal"]') as HTMLElement | null;
  triggerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showOrderProtectionModal();
  });
}

/**
 * Show the order protection modal.
 * Dispatches a custom event that the Alpine orderProtectionModal component listens for.
 */
export function showOrderProtectionModal(): void {
  window.dispatchEvent(new CustomEvent('order-protection-modal-show'));
}
