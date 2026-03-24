/**
 * C3: Hero Banner Carousel
 * Full-width Swiper.js carousel with text overlays and dot pagination
 * BEM Block: store-hero
 */
import type { HeroBannerData, HeroSlide } from '../../types/seller/types';
import { t } from '../../i18n';

function renderSlide(slide: HeroSlide): string {
  const hasText = !!slide.title;
  const imgClasses = 'w-full h-[180px] sm:h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] object-cover';

  if (!hasText) {
    return `
      <div class="swiper-slide store-hero__slide relative" data-slide-id="${slide.id}">
        <img src="${slide.image}" alt="Banner" class="${imgClasses}" loading="lazy"
             onerror="this.parentElement.style.background='linear-gradient(135deg,#1e3a5f,#2563eb)'" />
      </div>
    `;
  }

  const isWhite = slide.textColor === 'white';
  const titleColor = isWhite ? 'text-white' : 'text-(--color-text-primary)';
  const subtitleColor = isWhite ? 'text-white/80' : 'text-(--color-text-secondary)';

  // Position classes based on textPosition
  let alignClasses = 'items-start';
  if (slide.textPosition === 'center') {
    alignClasses = 'items-center text-center';
  } else if (slide.textPosition === 'right') {
    alignClasses = 'items-end text-right';
  }

  // Handle multi-line titles (newline separated)
  const titleHtml = (slide.title || '').split('\n').map(line =>
    `<span class="block">${line}</span>`
  ).join('');

  const subtitleHtml = slide.subtitle
    ? `<p class="store-hero__subtitle text-[13px] sm:text-[13px] md:text-[14px] lg:text-[18px] ${subtitleColor} mt-2 lg:mt-3 drop-shadow-md max-w-[600px] whitespace-pre-line line-clamp-2 sm:line-clamp-none">${slide.subtitle}</p>`
    : '';

  const ctaHtml = slide.ctaText
    ? `<a href="${slide.ctaLink || '#'}" class="store-hero__cta inline-block mt-3 lg:mt-6 px-5 lg:px-8 py-2 lg:py-3 bg-(--store-accent) text-white font-semibold text-[13px] lg:text-(--btn-font-size) rounded-(--radius-button) hover:bg-(--store-accent-hover) transition-colors shadow-(--shadow-md)">
        ${slide.ctaText}
      </a>`
    : '';

  return `
    <div class="swiper-slide store-hero__slide relative" data-slide-id="${slide.id}">
      <img src="${slide.image}" alt="${slide.title || 'Banner'}" class="${imgClasses}" loading="lazy"
           onerror="this.parentElement.style.background='linear-gradient(135deg,#1e3a5f,#2563eb)'" />
      <!-- Text Overlay -->
      <div class="store-hero__overlay absolute inset-0 flex flex-col justify-center px-4 sm:px-4 md:px-6 lg:px-10 xl:px-12 ${alignClasses}">
        <h2 class="store-hero__title text-[18px] sm:text-[20px] md:text-[24px] lg:text-[32px] xl:text-[42px] font-black ${titleColor} leading-tight drop-shadow-lg">
          ${titleHtml}
        </h2>
        ${subtitleHtml}
        ${ctaHtml}
      </div>
    </div>
  `;
}

export function HeroBanner(data: HeroBannerData): string {
  if (!data.slides.length) return '';

  return `
    <section id="store-hero" class="store-hero" aria-label="${t('seller.sf.storeHeroBanner')}">
      <div class="store-hero__swiper swiper w-full">
        <div class="swiper-wrapper">
          ${data.slides.map(slide => renderSlide(slide)).join('')}
        </div>
        ${data.showPagination !== false ? `
          <div class="store-hero__pagination swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
        ` : ''}
      </div>
    </section>
  `;
}
