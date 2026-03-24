/**
 * OperationSlider Component
 * Swiper-based notification slider with custom arrows (hidden by default, visible on hover
 * via CSS group-hover), pagination bullets (active: oval 16x8 dark, inactive: round 8x8 gray),
 * loop, optional autoplay 5000ms.
 */

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import type { NotificationSlide } from '../../types/buyerDashboard';
import { t } from '../../i18n';

export interface OperationSliderProps {
  notifications: NotificationSlide[];
}

function renderSlide(slide: NotificationSlide): string {
  return `
    <div class="swiper-slide">
      <div class="flex items-center justify-between px-[clamp(0.75rem,0.5rem+1vw,1.25rem)] py-3 min-h-[44px] gap-2 sm:gap-4">
        <span class="text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] font-normal text-(--color-text-heading,#111827) whitespace-nowrap overflow-hidden text-ellipsis min-w-0">${slide.title}</span>
        <a href="${slide.linkHref}" class="text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-(--color-text-heading,#111827) no-underline inline-flex items-center whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-(--color-cta-primary,#333333)">
          ${slide.linkText}
          <svg class="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  `;
}

export function OperationSlider(props: OperationSliderProps): string {
  const { notifications } = props;
  const hasMultiple = notifications.length > 1;

  return `
    <div class="operation-slider group/opslider px-3 pb-3" aria-label="${t('dashboard.notifications')}">
      <div class="relative overflow-hidden bg-(--color-surface-raised,#f5f5f5) rounded-lg">
        <div class="swiper operation-slider__swiper overflow-hidden">
          <div class="swiper-wrapper">
            ${notifications.map(renderSlide).join('')}
          </div>
        </div>

        ${hasMultiple ? `
          <!-- Custom Navigation Arrows -->
          <button
            aria-label="${t('dashboard.prevNotification')}"
            class="operation-slider__prev absolute top-1/2 -translate-y-1/2 left-1 z-10 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm border-none text-(--color-text-muted,#666666) cursor-pointer opacity-0 pointer-events-none transition-all duration-200 group-hover/opslider:opacity-100 group-hover/opslider:pointer-events-auto hover:text-(--color-text-heading,#111827)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            aria-label="${t('dashboard.nextNotification')}"
            class="operation-slider__next absolute top-1/2 -translate-y-1/2 right-1 z-10 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm border-none text-(--color-text-muted,#666666) cursor-pointer opacity-0 pointer-events-none transition-all duration-200 group-hover/opslider:opacity-100 group-hover/opslider:pointer-events-auto hover:text-(--color-text-heading,#111827)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        ` : ''}
      </div>

      ${hasMultiple ? `
        <!-- Custom Pagination -->
        <div class="operation-slider__pagination flex justify-center gap-1.5 pt-2 pb-1"></div>
      ` : ''}
    </div>
  `;
}

export function initOperationSlider(): void {
  const container = document.querySelector<HTMLElement>('.operation-slider__swiper');
  if (!container) return;

  const slides = container.querySelectorAll('.swiper-slide');
  const hasMultiple = slides.length > 1;

  new Swiper(container, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    loop: hasMultiple,
    autoplay: hasMultiple ? { delay: 5000, disableOnInteraction: false } : false,
    navigation: hasMultiple
      ? { nextEl: '.operation-slider__next', prevEl: '.operation-slider__prev' }
      : false,
    pagination: hasMultiple
      ? { el: '.operation-slider__pagination', clickable: true }
      : false,
  });
}
