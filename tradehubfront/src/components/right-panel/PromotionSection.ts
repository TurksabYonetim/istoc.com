/**
 * PromotionSection Component
 * Carousel with 3 slides of stacked promotion banners and dot navigation.
 */

import type { PromotionBannerData } from '../../types/buyerDashboard';
import { SectionCard } from '../shared/SectionCard';
import { SectionHeader } from '../shared/SectionHeader';
import { PromotionBanner } from '../shared/PromotionBanner';
import { DotIndicator } from '../shared/DotIndicator';
import { getPromotionConfig } from './rightPanelData';

/**
 * Chunk promotions into slides of 2 banners each.
 */
function chunkBanners(banners: PromotionBannerData[], size: number): PromotionBannerData[][] {
  const chunks: PromotionBannerData[][] = [];
  for (let i = 0; i < banners.length; i += size) {
    chunks.push(banners.slice(i, i + size));
  }
  return chunks;
}

export function PromotionSection(promotions: PromotionBannerData[]): string {
  const slides = chunkBanners(promotions, 2);

  const slidesHtml = slides.map((slide, idx) => {
    const bannersHtml = slide.map((p) =>
      PromotionBanner({
        title: p.title,
        subtitle: p.subtitle,
        image: p.image,
        bgColor: p.bgColor,
        href: p.href,
      })
    ).join('');

    return `
      <div class="min-h-0 flex flex-col gap-3${idx === 0 ? '' : ' hidden'}" data-promo-slide="${idx}">
        ${bannersHtml}
      </div>
    `;
  }).join('');

  return SectionCard({
    children: `
      ${SectionHeader({ title: getPromotionConfig().title })}
      <div class="promotion-carousel" data-promotion-carousel>
        ${slidesHtml}
      </div>
      <div data-promotion-dots>
        ${DotIndicator({ total: slides.length, activeIndex: 0 })}
      </div>
    `,
  });
}

/**
 * Initialize promotion carousel — manual dot navigation.
 */
export function initPromotionSection(): void {
  const carousel = document.querySelector<HTMLElement>('[data-promotion-carousel]');
  const dotsContainer = document.querySelector<HTMLElement>('[data-promotion-dots]');
  if (!carousel || !dotsContainer) return;

  const slides = carousel.querySelectorAll<HTMLElement>('[data-promo-slide]');
  const totalSlides = slides.length;
  let activeIndex = 0;

  function updateSlides(): void {
    slides.forEach((slide, i) => {
      slide.classList.toggle('hidden', i !== activeIndex);
    });
  }

  function updateDots(): void {
    const dots = dotsContainer!.querySelectorAll<HTMLElement>('[data-dot-index]');
    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.className = isActive
        ? 'w-4 h-2 rounded-full bg-[#222] transition-all'
        : 'w-2 h-2 rounded-full bg-[#ccc] transition-all';
    });
  }

  dotsContainer.addEventListener('click', (e) => {
    const dot = (e.target as HTMLElement).closest<HTMLElement>('[data-dot-index]');
    if (!dot) return;
    const idx = Number(dot.dataset.dotIndex);
    if (idx >= 0 && idx < totalSlides && idx !== activeIndex) {
      activeIndex = idx;
      updateSlides();
      updateDots();
    }
  });
}
