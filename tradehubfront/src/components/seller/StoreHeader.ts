/**
 * C1: Store Profile Header — Alpine-driven, no static data
 */
import { t } from '../../i18n';

export function StoreHeader(): string {
  return `
    <section id="store-header" class="store-header relative bg-white dark:bg-gray-800 border-b border-(--color-border-default) dark:border-gray-700 transition-opacity duration-200" aria-label="${t('seller.sf.storeProfileHeader')}">
      <div class="store-header__container max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] py-4 lg:px-6 lg:py-5 xl:px-8 xl:py-5 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 overflow-hidden">

        <!-- Loading skeleton -->
        <div x-show="loading" class="flex items-start gap-4 animate-pulse w-full">
          <div class="w-[80px] h-[48px] bg-gray-100 rounded shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-100 rounded w-1/2"></div>
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Left: Logo + Info -->
        <div x-show="!loading" class="store-header__info flex items-start gap-3 lg:gap-5 min-w-0">
          <!-- Logo -->
          <template x-if="seller?.logo">
            <img
              :src="seller.logo"
              :alt="seller.seller_name || ''"
              class="store-header__logo w-[80px] max-h-[48px] lg:max-h-[52px] xl:w-[100px] xl:max-h-[60px] object-contain flex-shrink-0 hover:scale-105 transition-transform duration-200"
              onerror="this.style.display='none'"
            />
          </template>

          <div class="store-header__details flex flex-col gap-1 min-w-0">
            <!-- Company Name -->
            <div class="store-header__name-row flex items-center gap-2">
              <h1
                class="store-header__name text-[18px] lg:text-[20px] xl:text-[22px] font-bold text-(--color-text-primary) dark:text-gray-50 leading-tight"
                x-text="seller?.seller_name || ''"
              ></h1>
              <svg class="store-header__chevron w-4 h-4 text-(--color-text-tertiary) cursor-pointer transition-transform hover:text-(--color-text-secondary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- Badge Row -->
            <div class="store-header__badges flex items-center gap-2 flex-wrap">
              <template x-if="seller?.verified">
                <span class="store-header__badge store-header__badge--verified flex items-center gap-1 text-[13px] text-[#2563eb]">
                  <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#2563eb"/>
                    <path d="M5.5 8.5l2 2 4-4" stroke="#fff" stroke-width="1.5" fill="none"/>
                  </svg>
                  <span x-text="seller.verification_status || 'Verified'"></span>
                </span>
              </template>
              <template x-if="sellerYears">
                <span>
                  <span class="store-header__separator text-(--color-border-strong)">&middot;</span>
                  <span class="store-header__years text-[13px] text-(--color-text-tertiary) dark:text-gray-400" x-text="sellerYears"></span>
                </span>
              </template>
              <template x-if="sellerLocation">
                <span>
                  <span class="store-header__separator text-(--color-border-strong)">&middot;</span>
                  <span class="store-header__location text-[13px] text-(--color-text-tertiary) dark:text-gray-400" x-text="sellerLocation"></span>
                </span>
              </template>
            </div>

            <!-- Description / Main Categories -->
            <template x-if="seller?.description">
              <p class="store-header__categories text-[13px] text-(--color-text-tertiary) dark:text-gray-400 break-words" x-text="seller.short_description || seller.description"></p>
            </template>

            <!-- Email -->
            <template x-if="seller?.email">
              <p class="store-header__email text-[13px] text-(--color-text-tertiary) dark:text-gray-400 flex items-center gap-1">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M2 4l6 5 6-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
                <span x-text="seller.email"></span>
              </p>
            </template>

            <!-- Badges -->
            <div class="store-header__tags flex flex-wrap items-center gap-2 mt-1">
              <template x-if="seller?.is_top_seller">
                <span class="store-header__assessment-badge inline-flex items-center text-[12px] text-(--color-text-tertiary) gap-1">
                  <span class="w-2 h-2 rounded-full bg-[#2563eb] inline-block"></span>
                  Sertifikalı Tedarikçi
                </span>
              </template>
            </div>

            <!-- Joined date -->
            <template x-if="seller?.joined_at">
              <p class="store-header__tuv text-[11px] text-(--color-text-muted) dark:text-gray-500 mt-1">
                Verified by TÜVRheinland &mdash;
                <span x-text="new Date(seller.joined_at).toLocaleDateString('tr-TR')"></span>
                <span class="inline-block ml-1 cursor-help">&oplus;</span>
              </p>
            </template>
          </div>
        </div>

        <!-- Right: CTA Buttons -->
        <div x-show="!loading" class="store-header__actions flex flex-col w-full gap-2 mt-3 lg:flex-row lg:w-auto lg:gap-3 lg:mt-0 flex-shrink-0">
          <button class="store-header__contact-btn w-full lg:w-auto th-btn"
                  onclick="document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})">
            ${t('seller.sf.contactSupplierBtn')}
          </button>
          <button class="store-header__chat-btn w-full lg:w-auto th-btn-outline">
            ${t('seller.sf.chatNow')}
          </button>
        </div>

      </div>

      <!-- Tab Navigation -->
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <div class="flex items-center gap-4 sm:gap-8 border-t border-gray-100">

          <button @click="setTab('overview')" :class="activeTab === 'overview' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'" class="py-3.5 text-[14px] transition-colors whitespace-nowrap">${t('seller.sf.myAccount')}</button>

          <button @click="setTab('reviews')" :class="activeTab === 'reviews' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'" class="py-3.5 text-[14px] transition-colors whitespace-nowrap">${t('seller.sf.reviewsTab')}</button>

          <!-- Ürünler dropdown -->
          <div class="relative self-stretch flex items-center" x-data="{ open: false }" @mouseenter="open = true" @mouseleave="open = false">
            <button @click="setTab('products')"
              :class="activeTab === 'products' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'"
              class="py-3.5 text-[14px] transition-colors whitespace-nowrap flex items-center gap-1">
              ${t('seller.sf.productsTab')}
              <svg class="w-3.5 h-3.5 transition-transform duration-150" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <!-- Dropdown -->
            <div x-show="open" x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-1"
              class="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[180px] py-1.5"
              style="display:none;">
              <button @click="setTab('products'); open = false" class="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Tüm Ürünler
              </button>
              <template x-if="navCategories.length > 0">
                <div>
                  <div class="mx-3 my-1 border-t border-gray-100"></div>
                  <div class="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Kategoriler</div>
                  <template x-for="cat in navCategories" :key="cat.name">
                    <button
                      @click="setTab('products'); $dispatch('store:nav-category', {id: cat.name}); open = false"
                      class="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors truncate"
                      x-text="cat.category_name">
                    </button>
                  </template>
                </div>
              </template>
              <template x-if="navCategories.length === 0">
                <p class="px-4 py-2 text-[12px] text-gray-400">Kategori bulunamadı</p>
              </template>
            </div>
          </div>

          <button @click="setTab('categories')" :class="activeTab === 'categories' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'" class="py-3.5 text-[14px] transition-colors whitespace-nowrap">${t('seller.sf.categoriesTab')}</button>
          <button @click="setTab('company')" :class="activeTab === 'company' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'" class="py-3.5 text-[14px] transition-colors whitespace-nowrap">${t('seller.sf.companyProfile')}</button>
          <button @click="setTab('contact')" :class="activeTab === 'contact' ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent'" class="py-3.5 text-[14px] transition-colors whitespace-nowrap">${t('seller.sf.contactTab')}</button>

        </div>
      </div>

    </section>
  `;
}
