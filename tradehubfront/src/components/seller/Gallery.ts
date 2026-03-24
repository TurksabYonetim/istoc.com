/**
 * C11: Gallery / Factory Photos (Optional)
 * 3-column photo grid with hover overlay (gradient + caption slide-up + image zoom)
 */
import type { GalleryPhoto } from '../../types/seller/types';
import { t } from '../../i18n';

export function Gallery(photos: GalleryPhoto[], title?: string): string {
  if (!photos || !photos.length) return '';

  const sectionTitle = title || 'MORE';

  return `
    <section id="gallery" class="gallery py-12" aria-label="${t('seller.sf.factoryPhotos')}">
      <div class="max-w-(--container-lg) mx-auto px-8 lg:px-6 md:px-4">
        <h2 class="gallery__title text-[28px] md:text-[24px] font-bold text-[#1e3a5f] dark:text-blue-300 uppercase text-center mb-8">
          ${sectionTitle}
        </h2>
        <div class="gallery__grid grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
          ${photos.map(photo => `
            <div class="gallery__item relative rounded-(--radius-md) overflow-hidden aspect-[4/3] group cursor-pointer hover:shadow-md transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[#cc9900] focus-visible:ring-offset-2 outline-none"
                 tabindex="0"
                 role="button"
                 aria-label="${photo.caption || t('seller.sf.factoryPhoto')}">
              <img src="${photo.image}" alt="${photo.caption || ''}"
                   class="gallery__image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                   loading="lazy"
                   onerror="this.parentElement.style.background='#f3f4f6'" />
              <div class="gallery__overlay absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                ${photo.caption ? `
                  <p class="gallery__caption text-white text-[13px] font-medium px-4 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    ${photo.caption}
                  </p>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
