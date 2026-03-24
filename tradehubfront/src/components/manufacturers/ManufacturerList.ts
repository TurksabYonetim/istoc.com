import { t } from '../../i18n';

export function ManufacturerList(): string {
  return `
    <div
      x-data="{
        sellers: [],
        loading: true,
        async init() {
          const apiBase = window.API_BASE || '/api';
          const res = await fetch(
            apiBase + '/method/tradehub_core.api.seller.get_sellers?page_size=20',
            { credentials: 'omit' }
          ).then(r => r.json());
          this.sellers = res.message?.sellers || [];
          this.loading = false;
        }
      }"
    >
      <!-- Loading skeletons -->
      <div x-show="loading" class="flex flex-col gap-2 mb-2">
        <template x-for="i in 3" :key="i">
          <div class="bg-white rounded-lg p-5 mb-3 animate-pulse h-56"></div>
        </template>
      </div>

      <!-- Empty state -->
      <div x-show="!loading && sellers.length === 0" class="bg-white rounded-lg p-12 text-center text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <p class="text-[14px]">Henüz satıcı bulunamadı.</p>
      </div>

      <!-- Seller cards -->
      <div x-show="!loading" class="flex flex-col">
        <template x-for="(seller, idx) in sellers" :key="seller.seller_code">
          <div class="bg-white rounded-lg p-3 mb-2 lg:p-5 lg:mb-5">

            <!-- Desktop Layout -->
            <div class="hidden lg:flex flex-col">
              <!-- Title Row -->
              <div class="flex xl:flex-row flex-col gap-4 xl:gap-0 justify-between items-start mb-6">
                <div class="flex items-start min-w-0">
                  <div class="w-[50px] h-[50px] border border-[#ddd] rounded overflow-hidden shrink-0 mr-3 bg-gray-50 flex items-center justify-center">
                    <img
                      x-show="seller.logo"
                      :src="seller.logo"
                      :alt="seller.seller_name"
                      class="w-full h-full object-contain p-1"
                    />
                    <svg x-show="!seller.logo" class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <a
                      :href="'/pages/seller/seller-storefront.html?seller=' + seller.seller_code"
                      class="text-[15px] xl:text-[16px] font-bold text-[#222] hover:text-[#1a66ff] transition-colors truncate max-w-[440px] block"
                      x-text="seller.seller_name"
                    ></a>
                    <div class="flex flex-wrap items-center gap-1 xl:gap-1.5 mt-1 text-[12px] xl:text-[14px] text-[#222]">
                      <template x-if="seller.verified">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4 text-[#1a66ff]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                          <span class="text-[#1a66ff] font-bold">${t('mfr.list.verified')}</span>
                        </span>
                      </template>
                      <template x-if="seller.city">
                        <span>· <span x-text="seller.city"></span></span>
                      </template>
                      <template x-if="seller.country">
                        <span class="text-gray-400">· <span x-text="seller.country"></span></span>
                      </template>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 xl:gap-3 shrink-0">
                  <button type="button" class="text-gray-400 hover:text-red-500 transition-colors" aria-label="${t('mfr.list.addToFavorites')}">
                    <svg class="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <a
                    :href="'/pages/seller/seller-storefront.html?seller=' + seller.seller_code"
                    class="h-9 xl:h-10 px-3 xl:px-4 border border-[#222] rounded-full text-[12px] xl:text-[14px] font-bold text-[#222] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap inline-flex items-center"
                  >${t('mfr.list.contactUs')}</a>
                </div>
              </div>

              <!-- Content Row -->
              <div class="flex gap-4 items-stretch">
                <!-- Left: Stats -->
                <div class="w-[200px] xl:w-[244px] shrink-0 pr-3">
                  <h4 class="text-[13px] xl:text-[14px] font-normal text-[#222] mb-1">${t('mfr.list.rankingsAndReviews')}</h4>
                  <div class="mb-4 text-[13px] xl:text-[14px]">
                    <strong class="text-[#222]" x-text="seller.rating ? seller.rating.toFixed(1) : '—'"></strong>
                    <span class="text-[#222]">/5</span>
                    <span class="text-[#222] ml-1" x-text="'(' + (seller.review_count || 0) + ')'"></span>
                  </div>
                  <template x-if="seller.short_description">
                    <p class="text-[12px] xl:text-[13px] text-gray-500 line-clamp-4" x-text="seller.short_description"></p>
                  </template>
                </div>

                <!-- Middle: Product cards (max 3) -->
                <div class="flex-1 min-w-0 h-[165px] xl:h-[220px] flex items-stretch gap-3">
                  <template x-if="!seller.products || seller.products.length === 0">
                    <div class="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-200">
                      <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                  </template>
                  <template x-for="(p, i) in (seller.products || []).slice(0, 3)" :key="p.name">
                    <div class="flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden w-[140px] xl:w-[180px] flex-shrink-0">
                      <div class="bg-gray-50 flex-1 overflow-hidden">
                        <img x-show="p.image" :src="p.image" :alt="p.product_name" class="w-full h-full object-cover" />
                        <div x-show="!p.image" class="w-full h-full flex items-center justify-center text-gray-200">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        </div>
                      </div>
                      <div class="p-2 flex-shrink-0">
                        <p class="text-[12px] text-gray-800 font-medium leading-tight line-clamp-2 mb-1" x-text="p.product_name"></p>
                        <p x-show="p.price_min" class="text-[12px] font-bold text-gray-900" x-text="p.price_max && p.price_max > p.price_min ? window.csFormatPriceRange(parseFloat(p.price_min), parseFloat(p.price_max), 'USD') : window.csFormatPrice(parseFloat(p.price_min), 'USD')"></p>
                        <p x-show="p.moq" class="text-[11px] text-gray-400 mt-0.5" x-text="p.moq + ' ' + (p.moq_unit || 'Adet')"></p>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Right: Gallery panel -->
                <template x-if="seller.gallery_images && seller.gallery_images.length > 0">
                  <div
                    class="w-[165px] xl:w-[220px] shrink-0 h-[165px] xl:h-[220px] rounded-lg overflow-hidden relative cursor-pointer group"
                    x-data="{ activeIdx: 0 }"
                  >
                    <img
                      :src="seller.gallery_images[activeIdx]"
                      :alt="seller.seller_name + ' galeri'"
                      class="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <!-- Photo count badge -->
                    <div class="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span x-text="(activeIdx + 1) + '/' + seller.gallery_images.length"></span>
                    </div>
                    <!-- Navigation arrows (visible on hover) -->
                    <template x-if="seller.gallery_images.length > 1">
                      <div class="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          class="w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                          @click.prevent="activeIdx = (activeIdx - 1 + seller.gallery_images.length) % seller.gallery_images.length"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button
                          type="button"
                          class="w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                          @click.prevent="activeIdx = (activeIdx + 1) % seller.gallery_images.length"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>

            <!-- Mobile Layout -->
            <div class="lg:hidden flex flex-col gap-2">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-[28px] h-[28px] rounded-sm shrink-0 border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img x-show="seller.logo" :src="seller.logo" :alt="seller.seller_name" class="w-full h-full object-contain" />
                  <svg x-show="!seller.logo" class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </div>
                <a
                  :href="'/pages/seller/seller-storefront.html?seller=' + seller.seller_code"
                  class="text-[14px] font-bold text-[#222] truncate flex-1"
                  x-text="seller.seller_name"
                ></a>
                <template x-if="seller.city">
                  <span class="text-[11px] text-gray-400 shrink-0 ml-auto" x-text="seller.city"></span>
                </template>
              </div>
              <div class="text-[11px] text-[#222] flex items-center gap-1">
                <strong x-text="seller.rating ? seller.rating.toFixed(1) : '—'"></strong>
                <span>/5</span>
                <span class="mx-1 text-gray-300">|</span>
                <span x-text="(seller.review_count || 0) + ' değerlendirme'"></span>
              </div>
              <template x-if="seller.cover_image || (seller.product_images && seller.product_images.length > 0)">
                <img :src="seller.cover_image || seller.product_images[0]" :alt="seller.seller_name" class="w-full h-[120px] object-cover rounded" />
              </template>
            </div>

          </div>
        </template>
      </div>
    </div>
  `;
}

// Kept for backwards-compat export — no-op since cards are now Alpine-rendered
export function initFactorySliders(): void {}
