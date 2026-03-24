/**
 * C8: Certificates Carousel
 * Swiper carousel with Navigation arrows + dot pagination
 * Responsive: 4→3→2→1 slides per view
 * Spec: Section 11 (11.1–11.8)
 */
import type { Certificate } from '../../types/seller/types';
import { t } from '../../i18n';

export function Certificates(certificates: Certificate[]): string {
  if (!certificates || !certificates.length) return '';

  return `
    <section id="certificates" class="certificates py-12" aria-label="${t('seller.sf.certificates')}">
      <div class="max-w-(--container-lg) mx-auto px-8">
        <h2 class="certificates__title text-[28px] font-bold text-[#1e3a5f] dark:text-blue-300 uppercase text-center mb-8">
          ${t('seller.sf.certificates')}
        </h2>

        <div class="certificates__wrapper relative">
          <!-- Swiper -->
          <div class="certificates__swiper swiper">
            <div class="swiper-wrapper">
              ${certificates.map(cert => `
                <div class="swiper-slide">
                  <div class="certificates__card bg-white dark:bg-gray-800 border border-(--card-border-color) dark:border-gray-700 shadow-sm rounded-(--radius-md) p-2 flex items-center justify-center">
                    <img src="${cert.image}" alt="${cert.name}"
                         class="w-full aspect-[3/4] object-contain"
                         loading="lazy"
                         onerror="this.outerHTML='<div class=\\'w-16 h-20 bg-gray-100 rounded flex items-center justify-center\\'><svg class=\\'w-8 h-8 text-gray-300\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\\'/></svg></div>'" />
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button class="certificates__prev absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#e5e5e5] hover:bg-[#d1d5db] dark:bg-gray-700 dark:hover:bg-gray-600 rounded-sm flex items-center justify-center z-10 transition-colors duration-200 border-none cursor-pointer" aria-label="${t('seller.sf.prevCertificate')}">
            <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="certificates__next absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#e5e5e5] hover:bg-[#d1d5db] dark:bg-gray-700 dark:hover:bg-gray-600 rounded-sm flex items-center justify-center z-10 transition-colors duration-200 border-none cursor-pointer" aria-label="${t('seller.sf.nextCertificate')}">
            <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Dot Pagination -->
          <div class="certificates__dots swiper-pagination flex justify-center gap-2 mt-6"></div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Swiper config for Certificates carousel.
 * Usage: import Swiper and modules, then call:
 *   new Swiper('.certificates__swiper', certificatesSwiperConfig);
 */
export const certificatesSwiperConfig = {
  slidesPerView: 4 as number,
  spaceBetween: 16,
  loop: false,
  navigation: {
    nextEl: '.certificates__next',
    prevEl: '.certificates__prev',
  },
  pagination: {
    el: '.certificates__dots',
    clickable: true,
  },
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 8 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
  },
};
