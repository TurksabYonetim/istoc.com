/**
 * C13: Floating Action Buttons
 * Fixed right-side Contact Supplier + Chat Now buttons
 * Mobile bottom bar transformation via CSS (see seller-storefront.css)
 */
import type { FloatingActionsData } from '../../types/seller/types';
import { t } from '../../i18n';

/**
 * Renders floating action buttons (Contact Supplier + Chat Now)
 * Desktop: fixed right-0 top-[40%], vertical stack, w-[56px] h-[80px]
 * Tablet (480-768px): w-[44px] h-[60px], icon-only (CSS handles span hide)
 * Mobile (<480px): bottom bar, horizontal, full-width, h-[48px] (CSS handles transform)
 */
export function FloatingActions(data: FloatingActionsData): string {
  return `
    <div id="floating-actions"
         class="floating-actions fixed right-0 top-[40%] z-(--z-fixed) flex flex-col"
         aria-label="${t('seller.sf.quickAccessButtons')}"
         role="group">
      ${data.buttons.map((btn, index) => {
        const isFirst = index === 0;
        const isLast = index === data.buttons.length - 1;

        // Spec: Contact (first) gets rounded-tl + rounded-bl, Chat (last only) gets rounded-bl only
        let roundedClasses = '';
        if (isFirst && isLast) {
          roundedClasses = 'rounded-tl-(--radius-md) rounded-bl-(--radius-md)';
        } else if (isFirst) {
          roundedClasses = 'rounded-tl-(--radius-md)';
        } else if (isLast) {
          roundedClasses = 'rounded-bl-(--radius-md)';
        }

        // Split label for 2-line display on desktop (hidden on tablet via CSS, inline on mobile via CSS)
        const labelParts = btn.label.split(' ');
        const labelHtml = labelParts.length > 1
          ? `${labelParts[0]}<br/>${labelParts.slice(1).join(' ')}`
          : btn.label;

        return `
          <button class="floating-actions__btn floating-actions__btn--${btn.id} ${btn.bgColor} ${btn.hoverColor} text-white w-[56px] h-[80px] ${roundedClasses} flex flex-col items-center justify-center gap-1 transition-colors shadow-lg dark:shadow-xl cursor-pointer border-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  aria-label="${btn.ariaLabel}"
                  data-action="${btn.action}">
            ${btn.icon}
            <span class="text-[9px] font-medium leading-tight text-center">${labelHtml}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Floating Button Click Handlers (C13)
 * Contact Supplier → C12'ye scroll, Chat Now → chat widget (placeholder)
 */
export function initFloatingActions(): void {
  const contactBtn = document.querySelector('.floating-actions__btn--contact');
  const chatBtn = document.querySelector('.floating-actions__btn--chat');

  // Contact Supplier — C12 Contact Form'a smooth scroll
  contactBtn?.addEventListener('click', () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Chat Now — placeholder
  chatBtn?.addEventListener('click', () => {
    // Placeholder: canlı sohbet widget'ı açılır
    // Gerçek implementasyonda chat SDK entegrasyonu
  });
}
