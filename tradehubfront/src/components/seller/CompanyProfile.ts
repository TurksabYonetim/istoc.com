import { t } from '../../i18n';
// Currency formatting via window.csFormatPrice / window.csFormatPriceRange (set by currencyService)


// Mock Review Data Type (to be added to types/seller/types.ts)
export interface SellerReview {
  id: string;
  reviewerName: string;
  country: string;
  countryFlag: string;
  date: string;
  comment: string;
  productName: string;
  productImage: string;
  productPrice: string;
}

export interface SellerPerformanceStats {
  rating: number;
  reviewCount: number;
  responseTime: string;
  onTimeDeliveryRate: string;
  transactions: number;
  supplierServiceScore: number;
  onTimeShipmentScore: number;
  productQualityScore: number;
}

function ContactSidebar(): string {
  return `
    <div class="company-profile__sidebar sticky top-[100px] bg-white rounded-(--radius-md) border border-gray-200 p-4 sm:p-6" x-show="activeTab !== 'contact'" x-transition>
      <h3 class="text-[18px] font-bold text-gray-900 mb-4">${t('seller.sf.contactSupplier')}</h3>

      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 flex items-center justify-center rounded overflow-hidden shadow-sm border border-gray-100 p-1 bg-gray-50">
          <img x-show="seller?.logo" :src="seller?.logo" :alt="seller?.seller_name || ''" class="w-full h-full object-contain" />
          <svg x-show="!seller?.logo" class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        </div>
        <div>
          <h4 class="text-[14px] font-medium text-gray-900 leading-tight line-clamp-2" x-text="seller?.seller_name || '—'"></h4>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button @click="setTab('contact')" class="w-full th-btn th-btn-pill company-profile__contact-btn">
          ${t('seller.sf.contactNow')}
        </button>
        <button @click="setTab('contact')" class="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium py-2.5 px-4 rounded-full transition-colors text-[14px] company-profile__inquiry-btn">
          ${t('seller.sf.sendInquiry')}
        </button>
      </div>
    </div>
  `;
}

// ─── Overview Tab (Genel Bakış) ────────────────────────────────
function OverviewTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'overview'" x-transition.opacity.duration.300ms id="tab-overview">
      
      <!-- Performance Section -->
      <section class="bg-white rounded-(--radius-md) border border-gray-200 p-6 mb-6">
        <h3 class="text-[18px] font-bold text-gray-900 mb-6">${t('seller.sf.performance')}</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          <!-- Stats -->
          <div>
            <div class="flex items-end gap-2 mb-4">
              <span class="text-[32px] font-bold leading-none text-gray-900" x-text="seller?.average_rating ? seller.average_rating.toFixed(1) : '—'"></span>
              <span class="text-[14px] text-gray-500 mb-1">/5</span>
              <div class="ml-2">
                <span class="block text-[12px] text-gray-900 font-medium">${t('seller.sf.satisfactory')}</span>
                <button type="button" @click="setTab('reviews')" class="text-[12px] text-blue-600 hover:underline cursor-pointer">
                  <span x-text="seller?.total_reviews || 0"></span> ${t('seller.sf.reviews')}
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-100">
              <template x-if="seller?.city || seller?.country">
                <ul class="space-y-1 text-[13px] text-gray-600 mb-4">
                  <template x-if="seller?.city">
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span x-text="sellerLocation"></span>
                    </li>
                  </template>
                  <template x-if="seller?.website">
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                      <a :href="seller.website" target="_blank" rel="noopener" class="hover:text-blue-600 transition-colors truncate" x-text="seller.website"></a>
                    </li>
                  </template>
                </ul>
              </template>
            </div>
          </div>

          <!-- Banner image -->
          <div class="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
            <template x-if="seller?.cover_image">
              <img :src="seller.cover_image" :alt="seller.seller_name" class="w-full h-full object-cover" />
            </template>
            <div x-show="!seller?.cover_image" class="w-full h-full flex items-center justify-center text-gray-200">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>
            </div>
          </div>

        </div>
      </section>

      <!-- Main Products Section -->
      <section class="bg-white rounded-(--radius-md) border border-gray-200 p-6"
        x-data="{
          sellerCode: new URLSearchParams(window.location.search).get('seller') || '',
          products: [],
          loading: true,
          async init() {
            if (!this.sellerCode) { this.loading = false; return; }
            const apiBase = window.API_BASE || '/api';
            const res = await fetch(
              apiBase + '/method/tradehub_core.api.seller.get_seller_products?seller_code=' + this.sellerCode + '&page_size=8',
              { credentials: 'omit' }
            ).then(r => r.json());
            this.products = res.message?.products || [];
            this.loading = false;
          },
          formatPrice(p) {
            if (!p.price_min) return '';
            const min = parseFloat(p.price_min);
            const max = p.price_max ? parseFloat(p.price_max) : 0;
            if (max > min) return window.csFormatPriceRange(min, max, 'USD');
            return window.csFormatPrice(min, 'USD');
          }
        }"
      >
        <h3 class="text-[18px] font-bold text-gray-900 mb-6 uppercase">${t('seller.sf.mainProducts')}</h3>

        <!-- Loading -->
        <div x-show="loading" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          <template x-for="i in 8">
            <div class="animate-pulse bg-gray-100 rounded-lg aspect-square"></div>
          </template>
        </div>

        <!-- Empty -->
        <div x-show="!loading && products.length === 0" class="text-gray-400 text-[14px] py-8 text-center">
          Henüz ürün eklenmemiş.
        </div>

        <!-- Products -->
        <div x-show="!loading && products.length > 0" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 product-grid">
          <template x-for="(p, idx) in products" :key="p.name">
            <a :href="'/pages/product-detail.html?id=' + encodeURIComponent(p.name)" class="product-card flex flex-col gap-2 overflow-hidden text-sm text-start no-underline group">
              <div class="product-card__image-area relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                <img x-show="p.image" :src="p.image" :alt="p.product_name" class="product-card__img block w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div x-show="!p.image" class="w-full h-full flex items-center justify-center text-gray-200">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-6 6 6"/></svg>
                </div>
                <div class="product-card__lens-wrap absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 0 1 2-2h2l1-2h8l1 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><circle cx="12" cy="13" r="3"/></svg>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <div class="product-card__title line-clamp-2 text-[13px] leading-snug text-gray-800" x-text="p.product_name"></div>
                <div class="product-card__price font-semibold text-[14px] text-gray-900" x-text="formatPrice(p)"></div>
                <div x-show="p.moq" class="text-[12px] text-gray-500">
                  <span x-text="p.moq + ' ' + (p.moq_unit || 'Adet')"></span>
                  <span class="text-gray-300 mx-1">·</span>
                  <span>0 adet satıldı</span>
                </div>
              </div>
            </a>
          </template>
        </div>
      </section>

    </div>
  `;
}

// ─── Reviews Tab (Yorumlar) ────────────────────────────────────
function ReviewsTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'reviews'" x-transition.opacity.duration.300ms id="tab-reviews"
      x-data="{
        sellerCode: new URLSearchParams(window.location.search).get('seller') || '',
        seller: null,
        reviews: [],
        total: 0,
        loading: true,
        async init() {
          if (!this.sellerCode) { this.loading = false; return; }
          const apiBase = window.API_BASE || '/api';
          const [sellerRes, reviewRes] = await Promise.all([
            fetch(apiBase + '/method/tradehub_core.api.seller.get_seller?slug=' + this.sellerCode, {credentials:'omit'}).then(r=>r.json()),
            fetch(apiBase + '/method/tradehub_core.api.seller.get_reviews?seller_code=' + this.sellerCode + '&page_size=10', {credentials:'omit'}).then(r=>r.json())
          ]);
          this.seller = sellerRes.message || null;
          this.reviews = reviewRes.message?.reviews || [];
          this.total = reviewRes.message?.total || 0;
          this.loading = false;
        },
        formatDate(d) {
          if (!d) return '';
          return new Date(d).toLocaleDateString('tr-TR', {day:'2-digit', month:'short', year:'numeric'});
        },
        maskName(n) {
          if (!n) return '—';
          if (n.length <= 2) return n;
          return n[0] + '*'.repeat(Math.min(n.length - 2, 8)) + n[n.length - 1];
        },
        ratingPct(r) { return r ? ((r / 5) * 100) + '%' : '0%'; }
      }"
    >
      <section class="bg-white rounded-(--radius-md) border border-gray-200 p-6">

        <!-- Loading -->
        <div x-show="loading" class="space-y-4 animate-pulse">
          <div class="h-6 bg-gray-100 rounded w-1/3"></div>
          <div class="h-16 bg-gray-100 rounded"></div>
          <div class="h-24 bg-gray-100 rounded"></div>
          <div class="h-24 bg-gray-100 rounded"></div>
        </div>

        <template x-if="!loading">
          <div>
            <h3 class="text-[18px] font-bold text-gray-900 mb-8">${t('seller.sf.companyReviews')} (<span x-text="total"></span>)</h3>

            <!-- Score Breakdown -->
            <div class="flex flex-col md:flex-row gap-12 mb-10 pb-10 border-b border-gray-100">
              <div class="flex flex-col">
                <div class="text-[48px] font-bold text-gray-900 leading-none">
                  <span x-text="seller?.average_rating ? seller.average_rating.toFixed(1) : '—'"></span>
                  <span class="text-[16px] text-gray-500 font-normal">/5</span>
                </div>
                <div class="text-[14px] text-gray-600 font-medium mt-1">${t('seller.sf.satisfied')}</div>
              </div>

              <div class="flex-1 max-w-md">
                <div x-show="total === 0" class="text-[14px] text-gray-400 py-4">
                  Henüz değerlendirme yok.
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div x-show="reviews.length === 0" class="text-center py-12 text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <p class="text-[14px]">Henüz değerlendirme eklenmemiş.</p>
            </div>

            <!-- Reviews List -->
            <div x-show="reviews.length > 0" class="space-y-8">
              <template x-for="review in reviews" :key="review.name">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <div class="w-full sm:w-48 flex-shrink-0">
                    <div class="flex items-center gap-2 text-[13px] font-medium text-gray-900 mb-1">
                      <span x-text="maskName(review.reviewer_name)"></span>
                      <template x-if="review.verified_purchase">
                        <span class="text-[11px] text-green-600 font-normal bg-green-50 px-1.5 py-0.5 rounded">✓ Doğrulanmış</span>
                      </template>
                    </div>
                    <div class="text-[12px] text-gray-400" x-text="formatDate(review.creation)"></div>
                    <template x-if="review.rating">
                      <div class="flex gap-0.5 mt-1">
                        <template x-for="i in 5" :key="i">
                          <svg :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-200'" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </template>
                      </div>
                    </template>
                  </div>

                  <div class="flex-1">
                    <p class="text-[14px] text-gray-700 mb-3" x-text="review.comment"></p>
                    <template x-if="review.product_name">
                      <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <div class="w-10 h-10 bg-gray-200 rounded shrink-0 flex items-center justify-center text-gray-400">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        </div>
                        <span class="text-[12px] text-gray-600 line-clamp-2" x-text="review.product_name"></span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>

            <div x-show="reviews.length > 0" class="mt-8 text-center">
              <button class="px-6 py-2 border border-gray-300 rounded-full text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                ${t('seller.sf.browseAllReviews')}
              </button>
            </div>
          </div>
        </template>

      </section>
    </div>
  `;
}

// ─── Products Tab (Ürünler) ────────────────────────────────────
function ProductsTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'products'" x-transition.opacity.duration.300ms id="tab-products"
      @store:nav-category.window="prodCat = String($event.detail.id)"
      x-data="{
        sellerCode: new URLSearchParams(window.location.search).get('seller') || '',
        prodCat: 'all',
        categories: [],
        products: [],
        loading: true,
        async init() {
          const apiBase = window.API_BASE || '/api';
          const [catRes, prodRes] = await Promise.all([
            fetch(apiBase + '/method/tradehub_core.api.seller.get_seller_categories?seller_code=' + this.sellerCode, {credentials:'omit'}).then(r=>r.json()),
            fetch(apiBase + '/method/tradehub_core.api.seller.get_seller_products?seller_code=' + this.sellerCode + '&page_size=80', {credentials:'omit'}).then(r=>r.json())
          ]);
          this.categories = catRes.message?.categories || [];
          this.products = prodRes.message?.products || [];
          this.loading = false;
        },
        filteredProducts() {
          if (this.prodCat === 'all') return this.products;
          if (this.prodCat === 'featured') return this.products.filter(p => p.is_featured);
          return this.products.filter(p => String(p.category) === String(this.prodCat));
        },
        formatPrice(p) {
          if (!p.price_min) return '';
          const min = parseFloat(p.price_min);
          const max = p.price_max ? parseFloat(p.price_max) : 0;
          if (max > min) return window.csFormatPriceRange(min, max, 'USD');
          return window.csFormatPrice(min, 'USD');
        }
      }"
    >
      <div class="flex bg-white rounded-(--radius-md) border border-gray-200 overflow-hidden min-h-[500px]">

        <!-- Sol Sidebar: Kategoriler -->
        <aside class="hidden md:flex flex-col w-[180px] xl:w-[220px] shrink-0 border-r border-gray-200">
          <button
            @click="prodCat = 'featured'"
            :class="prodCat === 'featured' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'text-gray-700 hover:bg-gray-50'"
            class="flex items-center gap-2.5 px-4 py-3.5 text-[13px] font-semibold border-b border-gray-100 transition-colors"
          >
            <span class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-base shrink-0">⭐</span>
            İlk Seçilenler
          </button>
          <div class="px-4 pt-4 pb-2">
            <span class="text-[12px] font-bold text-[var(--color-primary-500)] border-b-2 border-[var(--color-primary-500)] pb-1 block">Ürün Kategorileri</span>
          </div>
          <button
            @click="prodCat = 'all'"
            :class="prodCat === 'all' ? 'text-[var(--color-primary-600)] font-semibold bg-[var(--color-primary-50)]' : 'text-gray-700 hover:bg-gray-50'"
            class="text-left text-[13px] px-4 py-2 transition-colors"
          >Tümü</button>
          <template x-for="cat in categories" :key="cat.name">
            <button
              @click="prodCat = String(cat.name)"
              :class="String(prodCat) === String(cat.name) ? 'text-[var(--color-primary-600)] font-semibold bg-[var(--color-primary-50)]' : 'text-gray-700 hover:bg-gray-50'"
              class="text-left text-[13px] px-4 py-2 truncate transition-colors"
              x-text="cat.category_name"
            ></button>
          </template>
        </aside>

        <!-- Sağ: Ürün Alanı -->
        <div class="flex-1 min-w-0 p-4 xl:p-6">
          <!-- Mobil kategori seçici -->
          <div class="md:hidden flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            <button @click="prodCat='all'" :class="prodCat==='all'?'bg-gray-900 text-white':'bg-white text-gray-700 border border-gray-300'" class="whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-medium shrink-0">Tümü</button>
            <template x-for="cat in categories" :key="cat.name">
              <button @click="prodCat=String(cat.name)" :class="String(prodCat)===String(cat.name)?'bg-gray-900 text-white':'bg-white text-gray-700 border border-gray-300'" class="whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-medium shrink-0" x-text="cat.category_name"></button>
            </template>
          </div>

          <!-- Başlık -->
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-[16px] font-bold text-gray-900" x-text="prodCat === 'all' ? 'Tüm ürünler' : prodCat === 'featured' ? 'İlk Seçilenler' : (categories.find(c=>String(c.name)===String(prodCat))?.category_name || '')"></h3>
          </div>

          <!-- Loading -->
          <div x-show="loading" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            <template x-for="i in 8">
              <div class="animate-pulse bg-gray-100 rounded-lg aspect-square"></div>
            </template>
          </div>

          <!-- Ürünler -->
          <div x-show="!loading">
            <div x-show="filteredProducts().length === 0" class="text-gray-400 text-[14px] py-12 text-center">Bu kategoride ürün bulunamadı.</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4 product-grid">
              <template x-for="(p, idx) in filteredProducts()" :key="p.name">
                <a :href="'/pages/product-detail.html?id=' + encodeURIComponent(p.name)" class="product-card flex flex-col gap-2 overflow-hidden text-sm text-start no-underline">
                  <div class="product-card__image-area relative">
                    <div class="product-card__image-wrap relative w-full overflow-hidden rounded-md bg-gray-100">
                      <img x-show="p.image" :src="p.image" :alt="p.product_name" class="product-card__img block w-full h-full object-cover" loading="lazy" />
                      <div x-show="!p.image" class="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-6 6 6"/></svg>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="product-card__title line-clamp-2 text-[13px] leading-snug" x-text="p.product_name"></div>
                    <div class="product-card__price font-semibold text-[13px]" x-text="formatPrice(p)"></div>
                    <div x-show="p.moq" class="product-card__moq-line text-[12px] text-gray-500">
                      <span x-text="p.moq + ' ' + (p.moq_unit || 'Adet')"></span>
                    </div>
                  </div>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── Categories Tab (Kategoriler) ────────────────────────────────────
function CategoriesTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'categories'" x-transition.opacity.duration.300ms id="tab-categories"
      x-data="{
        sellerCode: new URLSearchParams(window.location.search).get('seller') || '',
        categories: [],
        loading: true,
        async init() {
          const apiBase = window.API_BASE || '/api';
          const res = await fetch(apiBase + '/method/tradehub_core.api.seller.get_seller_categories?seller_code=' + this.sellerCode, {credentials:'omit'}).then(r=>r.json());
          this.categories = res.message?.categories || [];
          this.loading = false;
        }
      }"
    >
      <div class="bg-white rounded-(--radius-md) border border-gray-200 p-6">
        <!-- Loading -->
        <div x-show="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <template x-for="i in 6">
            <div class="animate-pulse bg-gray-100 rounded-xl aspect-[4/3]"></div>
          </template>
        </div>

        <!-- Boş durum -->
        <div x-show="!loading && categories.length === 0" class="text-center py-16 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          <p class="text-[14px]">Henüz kategori eklenmemiş.</p>
        </div>

        <!-- Kategori grid -->
        <div x-show="!loading && categories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <template x-for="(cat, i) in categories" :key="cat.name">
            <div
              class="relative overflow-hidden rounded-xl cursor-pointer group"
              :style="'background:' + ['#d4e157','#90caf9','#bdbdbd','#80deea','#a5d6a7','#ffcc80','#f48fb1','#ce93d8'][i % 8]"
              @click="$dispatch('store:category-click', {id: cat.name})"
            >
              <div class="aspect-[4/3] flex flex-col justify-between p-3 sm:p-4">
                <p class="text-[11px] sm:text-[13px] font-bold text-gray-800 uppercase leading-tight" x-text="cat.category_name"></p>
                <img
                  x-show="cat.image"
                  :src="cat.image"
                  :alt="cat.category_name"
                  class="w-[55%] ml-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div x-show="!cat.image" class="w-[55%] ml-auto h-16 bg-white/20 rounded flex items-center justify-center">
                  <svg class="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  `;
}

// ─── Company Info Tab (Şirket Bilgileri) ─────────────────────────────
function CompanyTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'company'" x-transition.opacity.duration.300ms id="tab-company">
      <div class="bg-white rounded-(--radius-md) border border-gray-200 p-6 mb-6">
        <h3 class="text-[18px] font-bold text-gray-900 mb-6">${t('seller.sf.companyProfile')}</h3>

        <template x-if="seller">
          <div class="space-y-4 text-[14px] text-gray-700">
            <div x-show="seller?.seller_name" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Şirket Adı</span>
              <span x-text="seller.seller_name"></span>
            </div>
            <div x-show="seller?.city || seller?.country" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Konum</span>
              <span x-text="sellerLocation"></span>
            </div>
            <div x-show="seller?.email" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">E-posta</span>
              <a :href="'mailto:' + seller.email" class="hover:text-[var(--color-primary-500)]" x-text="seller.email"></a>
            </div>
            <div x-show="seller?.phone" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Telefon</span>
              <a :href="'tel:' + seller.phone" class="hover:text-[var(--color-primary-500)]" x-text="seller.phone"></a>
            </div>
            <div x-show="seller?.website" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Web Sitesi</span>
              <a :href="seller.website" target="_blank" rel="noopener" class="hover:text-[var(--color-primary-500)] truncate" x-text="seller.website"></a>
            </div>
            <div x-show="seller?.description" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Hakkında</span>
              <span x-text="seller.description"></span>
            </div>
            <div x-show="seller?.joined_at" class="flex gap-2">
              <span class="font-semibold text-gray-500 w-32 shrink-0">Katılım Tarihi</span>
              <span x-text="seller.joined_at ? new Date(seller.joined_at).toLocaleDateString('tr-TR') : ''"></span>
            </div>
          </div>
        </template>

        <div x-show="!seller" class="text-gray-400 text-[14px] py-8 text-center">
          Şirket bilgisi yükleniyor...
        </div>
      </div>
    </div>
  `;
}

// ─── Contact Info Tab (İletişim) ─────────────────────────────────────
function ContactTab(): string {
  return `
    <div class="company-profile__tab-content" x-show="activeTab === 'contact'" x-transition.opacity.duration.300ms id="tab-contact"
      x-data="{
        sellerCode: new URLSearchParams(window.location.search).get('seller') || '',
        seller: null,
        loading: true,
        msgText: '',
        msgSent: false,
        msgError: '',
        shareCard: true,
        sending: false,
        async init() {
          const apiBase = window.API_BASE || '/api';
          const res = await fetch(apiBase + '/method/tradehub_core.api.seller.get_seller?slug=' + this.sellerCode, {credentials:'omit'}).then(r=>r.json());
          this.seller = res.message || null;
          this.loading = false;
        },
        async sendMsg() {
          if (!this.msgText || this.msgText.trim().length < 10) return;
          this.sending = true;
          this.msgError = '';
          try {
            const apiBase = window.API_BASE || '/api';
            const params = new URLSearchParams({
              seller_code: this.sellerCode,
              message: this.msgText.trim(),
              share_business_card: this.shareCard ? '1' : '0'
            });
            const res = await fetch(apiBase + '/method/tradehub_core.api.seller.send_inquiry', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              credentials: 'omit',
              body: params.toString()
            }).then(r => r.json());
            if (res.exc) throw new Error(res._error_message || 'Gönderilemedi');
            this.msgSent = true;
            this.msgText = '';
          } catch(e) {
            this.msgError = 'Mesaj gönderilemedi. Lütfen tekrar deneyin.';
          }
          this.sending = false;
        }
      }"
    >
      <section id="contact-form" class="contact-form py-12" aria-label="${t('seller.sf.contactFormLabel')}">
        <div class="max-w-[800px] sm:max-w-full mx-auto px-8 sm:px-6 xs:px-4">
          <div class="contact-form__card bg-white dark:bg-gray-800 border border-(--card-border-color) dark:border-gray-700 rounded-(--radius-lg) shadow-md dark:shadow-lg p-8 sm:p-6 xs:p-4">

            <!-- Loading -->
            <div x-show="loading" class="space-y-3 animate-pulse">
              <div class="h-6 bg-gray-100 rounded w-2/3 mx-auto"></div>
              <div class="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>

            <template x-if="!loading">
              <div>
                <!-- Title -->
                <h2 class="contact-form__title text-[18px] font-bold text-[#111827] dark:text-gray-50 text-center mb-6">
                  ${t('seller.sf.sendMessageToSupplier')}
                </h2>

                <!-- Seller contact info -->
                <div x-show="seller" class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                  <template x-if="seller?.email">
                    <div class="flex items-center gap-2 text-gray-700">
                      <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      <a :href="'mailto:' + seller.email" class="hover:text-[var(--color-primary-500)] transition-colors" x-text="seller.email"></a>
                    </div>
                  </template>
                  <template x-if="seller?.phone">
                    <div class="flex items-center gap-2 text-gray-700">
                      <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      <a :href="'tel:' + seller.phone" class="hover:text-[var(--color-primary-500)] transition-colors" x-text="seller.phone"></a>
                    </div>
                  </template>
                  <template x-if="seller?.website">
                    <div class="flex items-center gap-2 text-gray-700">
                      <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                      <a :href="seller.website" target="_blank" rel="noopener" class="hover:text-[var(--color-primary-500)] transition-colors truncate" x-text="seller.website"></a>
                    </div>
                  </template>
                  <template x-if="seller?.city">
                    <div class="flex items-center gap-2 text-gray-700">
                      <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span x-text="seller.city"></span>
                    </div>
                  </template>
                </div>

                <!-- Recipient -->
                <div class="contact-form__recipient flex items-center gap-2 mb-4">
                  <span class="text-[14px] text-[#6b7280] dark:text-gray-400">${t('seller.sf.to')}</span>
                  <span class="text-[14px] text-[#111827] dark:text-gray-50 font-semibold" x-text="seller?.seller_name || '—'"></span>
                </div>

                <!-- Success message -->
                <div x-show="msgSent" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-[14px] text-green-700 text-center">
                  Mesajınız başarıyla gönderildi!
                </div>

                <!-- Error message -->
                <div x-show="msgError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[14px] text-red-700 text-center" x-text="msgError"></div>

                <!-- Message Area -->
                <div x-show="!msgSent" class="contact-form__message-wrapper mb-4">
                  <label class="text-[14px] text-[#6b7280] dark:text-gray-400 mb-1 block" for="contact-textarea">
                    <span class="text-red-500">*</span> ${t('seller.sf.message')}
                  </label>
                  <div class="relative">
                    <textarea
                      id="contact-textarea"
                      x-model="msgText"
                      class="contact-form__textarea w-full border border-(--input-border-color) dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-(--radius-input) p-3 text-[14px] text-[#374151] min-h-[120px] sm:min-h-[100px] xs:min-h-[80px] resize-y focus:border-(--input-focus-border-color) focus:outline-none focus:ring-2 focus:ring-[#cc9900]/20 transition-colors"
                      placeholder="${t('seller.sf.enterInquiryDetails')}"
                      maxlength="8000"
                      aria-required="true"
                      rows="5"
                    ></textarea>
                    <span class="contact-form__counter absolute right-3 bottom-3 text-[12px] text-[#9ca3af] dark:text-gray-500" x-text="msgText.length + '/8000'"></span>
                  </div>
                </div>

                <!-- Send Button -->
                <div x-show="!msgSent" class="flex justify-center mb-4">
                  <button @click="sendMsg()" :disabled="sending || !msgText || msgText.trim().length < 10" class="contact-form__send th-btn xs:w-full disabled:opacity-50 disabled:cursor-not-allowed">
                    <span x-show="!sending">${t('seller.sf.send')}</span>
                    <span x-show="sending">Gönderiliyor...</span>
                  </button>
                </div>

                <!-- Business Card Checkbox -->
                <div x-show="!msgSent" class="contact-form__checkbox flex items-center gap-2 justify-center">
                  <input type="checkbox" id="business-card" x-model="shareCard"
                         class="w-4 h-4 text-[var(--color-primary-500)] border-[#d1d5db] rounded focus:ring-[var(--color-primary-500)]" />
                  <label for="business-card" class="text-[13px] text-[#6b7280] dark:text-gray-400">
                    ${t('seller.sf.agreeBusinessCard')}
                  </label>
                </div>
              </div>
            </template>

          </div>
        </div>
      </section>
    </div>
  `;
}

// ─── Main Wrapper ──────────────────────────────────────────────
export function CompanyProfileComponent(): string {
  return `
    <section class="company-profile bg-[#f9fafb] py-8 min-h-screen" aria-label="${t('seller.sf.sellerProfile')}">
      <div class="max-w-(--container-xl) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

          <!-- Left Content Area (Tabs) -->
          <div class="lg:col-span-3">
            ${OverviewTab()}
            ${ReviewsTab()}
            ${ProductsTab()}
            ${CategoriesTab()}
            ${CompanyTab()}
            ${ContactTab()}
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 border-l border-gray-100 lg:pl-2">
            ${ContactSidebar()}
          </div>

        </div>
      </div>
    </section>
  `;
}
