/**
 * TailoredSelectionsHero Component
 * Dark hero section with Swiper coverflow carousel of category cards.
 * Dimensions match the Alibaba reference exactly:
 *   – Section height: ~419px (desktop)
 *   – Title wrapper: 1440px max-width, ~100px height
 *   – Swiper coverflow height: 291px
 *   – Center card: ~520×291, padding 16px
 *   – Side cards: ~442×247, scaled down via coverflow
 */

import Swiper from 'swiper';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { t } from '../../i18n';
import type { TailoredCategory } from '../../types/tailoredSelections';

function renderCategorySlide(category: TailoredCategory, index: number): string {
  return `
    <div class="swiper-slide" style="height: auto;" data-bg-color="${category.bgColor}">
      <div
        class="list-card-container relative rounded-xl overflow-hidden h-full group cursor-pointer"
        style="--list-card-background-color: ${category.bgColor}; --list-card-border-color: #6a6145; --list-card-description-max-lines: 2; background-color: var(--list-card-background-color); border: 1px solid var(--list-card-border-color); padding: 16px;"
      >
        <!-- Background image (--background-image) -->
        <img
          src="${category.imageSrc}"
          alt="${category.title}"
          loading="${index <= 2 ? 'eager' : 'lazy'}"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <!-- Dynamic Gradient overlay -->
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to top, var(--list-card-background-color) 10%, transparent 80%);"
        ></div>

        <!-- Content overlay -->
        <div class="relative z-10 flex flex-col justify-end h-full">
          <h3 class="list-card-header-title text-white font-bold text-base sm:text-lg leading-tight mb-1">
            ${category.title}
          </h3>
          <p class="list-card-content text-white/80 text-[13px] leading-[1.4] mb-2" style="display:-webkit-box;-webkit-line-clamp:var(--list-card-description-max-lines, 2);-webkit-box-orient:vertical;overflow:hidden;">
            ${category.description}
          </p>
          <a
            href="/pages/tailored-selections.html"
            class="full-report inline-flex items-center gap-1.5 text-white text-sm font-medium hover:underline"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
            </svg>
            <span data-i18n="tailoredPage.insights">${t('tailoredPage.insights')}</span> &gt;
          </a>
        </div>
      </div>
    </div>
  `;
}

export function initTailoredSelectionsHero(): void {
  const el = document.querySelector<HTMLElement>('.ts-hero-swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [Navigation, EffectCoverflow],
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
      scale: 0.85,
    },
    centeredSlides: true,
    loop: true,
    navigation: {
      nextEl: '.ts-hero-next',
      prevEl: '.ts-hero-prev',
    },
    on: {
      slideChange: function (swiper) {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
          const bgColor = activeSlide.getAttribute('data-bg-color');
          if (bgColor) {
            const heroSection = document.getElementById('ts-hero-section');
            if (heroSection) {
              heroSection.style.setProperty('--floor-background-color', bgColor);
            }
          }
        }
      },
    },
    breakpoints: {
      0: { slidesPerView: 1.15 },
      480: { slidesPerView: 1.3 },
      768: { slidesPerView: 1.6 },
      1024: { slidesPerView: 2.2 },
      1200: { slidesPerView: 2.6 },
      1440: { slidesPerView: 2.8 },
    },
  });
}

export function TailoredSelectionsHero(categories: TailoredCategory[]): string {
  const initialBg = categories.length > 0 ? categories[0].bgColor : '#373224';
  return `
    <section
      id="ts-hero-section"
      class="alimod-sourcing-list-switch-floor relative overflow-hidden h-[320px] sm:h-[350px] md:h-[380px] xl:h-[419px]"
      style="--floor-background-color: ${initialBg}; --list-card-border-color: #6a6145; background-color: var(--floor-background-color); transition: background-color 0.5s ease;"
    >

      <!-- Title wrapper: max-width 1440px -->
      <div class="page-title-wrapper flex items-center justify-center mx-auto h-[60px] sm:h-[70px] xl:h-[100px]" style="max-width: 1440px; margin: 0 auto;">
        <h1 class="page-title text-white text-center font-semibold whitespace-nowrap hidden xl:block" style="font-size: 32px; line-height: 42px;">
          <span data-i18n="tailoredPage.title">${t('tailoredPage.title')}</span>
        </h1>
      </div>

      <!-- Coverflow Slider -->
      <div class="hugo5-coverflow-slider relative flex mx-auto overflow-hidden" style="max-width: 1440px; min-width: 0;">
        <div class="group/hero relative w-full">
          <div class="swiper ts-hero-swiper overflow-hidden h-[230px] sm:h-[250px] md:h-[270px] xl:h-[291px]" aria-label="Tailored selection categories">
            <div class="swiper-wrapper" style="align-items: stretch;">
              ${categories.map((c, i) => renderCategorySlide(c, i)).join('')}
            </div>
          </div>

          <!-- Navigation arrows (hidden on mobile — swipe works) -->
          <button
            aria-label="Previous categories"
            class="ts-hero-prev swiper-button absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 hidden md:flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-all duration-200 hover:bg-white hover:text-gray-900 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <button
            aria-label="Next categories"
            class="ts-hero-next swiper-button absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 hidden md:flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-all duration-200 hover:bg-white hover:text-gray-900 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>


      <!-- Triangle indicator -->
      <div class="triangle-indicator absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end">
        <svg fill="none" height="15" viewBox="0 0 32 15" width="32" xmlns="http://www.w3.org/2000/svg" class="block">
          <path d="M14.683 1.25513C15.437 0.595339 16.5631 0.595338 17.317 1.25513L30.9322 13.1683C32.115 14.2033 31.396 16.1423 29.8322 16.1423H2.16788C0.604044 16.1423 -0.114946 14.2033 1.0678 13.1683L14.683 1.25513Z" fill="white"/>
        </svg>
      </div>
    </section>
  `;
}
