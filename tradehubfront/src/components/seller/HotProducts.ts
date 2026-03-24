/**
 * C5: Hot Products / Featured Products
 * Orange title + 3-col product grid with Buy Now buttons
 * BEM Block: hot-products
 */
import type { SimpleProduct } from '../../types/seller/types';
import { t } from '../../i18n';

export function HotProducts(products: SimpleProduct[]): string {
  if (!products.length) return '';

  return `
    <section id="hot-products" class="hot-products py-12" aria-label="${t('seller.sf.popularProducts')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <h2 class="hot-products__title text-[clamp(1.5rem,1.2rem+1.5vw,3.375rem)] font-black text-[var(--color-primary-500)] uppercase text-center tracking-tight mb-6 md:mb-10">
          ${t('seller.sf.hotProductsTitle')}
        </h2>
        <div class="hot-products__grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[clamp(0.75rem,0.5rem+0.5vw,1.25rem)]">
          ${products.map(product => `
            <div class="hot-products__card bg-white dark:bg-gray-800 border border-(--card-border-color) dark:border-gray-700 rounded-(--radius-card) p-6 flex flex-col items-center text-center hover:shadow-md dark:hover:shadow-lg transition-shadow duration-300">
              <div class="hot-products__image-wrapper w-full h-[200px] flex items-center justify-center mb-4 overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain" loading="lazy"
                     onerror="this.parentElement.innerHTML='<div class=\\'w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center\\'><svg class=\\'w-8 h-8 text-gray-300\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'" />
              </div>
              <h3 class="hot-products__product-name text-[15px] text-[#222222] dark:text-gray-50 font-normal leading-snug mb-3 line-clamp-2">${product.name}</h3>
              <a href="${product.link}" class="hot-products__buy-btn mt-auto th-btn th-btn-sm inline-block">
                ${t('seller.sf.buyNow')}
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
