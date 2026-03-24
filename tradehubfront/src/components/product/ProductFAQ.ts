/**
 * ProductFAQ Component
 * FAQ accordion using Flowbite data-accordion pattern.
 */

import { getCurrentProduct } from '../../alpine/product';

export function ProductFAQ(): string {
  const mockProduct = getCurrentProduct();
  const faqs = mockProduct.faq;

  return `
    <div class="py-6">
      <div id="product-faq-accordion" data-accordion="collapse">
        ${faqs.map((faq, i) => {
          const headingId = `faq-heading-${i}`;
          const bodyId = `faq-body-${i}`;
          return `
            <h3 id="${headingId}">
              <button
                type="button"
                class="flex items-center justify-between w-full py-4 px-1 text-sm font-medium text-left gap-3 transition-colors"
                style="color: var(--pd-title-color, #111827); border-bottom: 1px solid var(--pd-faq-border, #e5e5e5);"
                data-accordion-target="#${bodyId}"
                aria-expanded="${i === 0 ? 'true' : 'false'}"
                aria-controls="${bodyId}"
              >
                <span>${faq.question}</span>
                <svg class="w-4 h-4 flex-shrink-0 transition-transform" data-accordion-icon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </h3>
            <div id="${bodyId}" class="${i === 0 ? '' : 'hidden'}" aria-labelledby="${headingId}">
              <div class="py-4 px-1">
                <p class="text-sm leading-relaxed" style="color: var(--pd-rating-text-color, #6b7280);">${faq.answer}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
