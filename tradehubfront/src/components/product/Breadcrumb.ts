/**
 * Breadcrumb Component
 * Horizontal breadcrumb navigation for product detail page.
 */

import { getCurrentProduct } from '../../alpine/product';

export function Breadcrumb(): string {
  const mockProduct = getCurrentProduct();
  const items = mockProduct.category;
  const crumbs = items.map((label, i) => {
    const isLast = i === items.length - 1;
    if (isLast) {
      return `<span class="text-sm truncate max-w-[200px]" style="color: var(--pd-breadcrumb-color, #6b7280);">${label}</span>`;
    }
    return `
      <a href="#" class="text-sm hover:underline whitespace-nowrap" style="color: var(--pd-breadcrumb-link-color, #cc9900);">${label}</a>
      <svg class="h-3 w-3 flex-shrink-0" style="color: var(--pd-breadcrumb-color, #9ca3af);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    `;
  });

  return `
    <nav aria-label="Breadcrumb" class="py-3">
      <ol class="flex items-center gap-2 flex-wrap">
        ${crumbs.map(c => `<li class="flex items-center gap-2">${c}</li>`).join('')}
      </ol>
    </nav>
  `;
}
