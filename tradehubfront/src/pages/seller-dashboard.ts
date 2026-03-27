/**
 * Seller Dashboard — Satıcı Paneli
 * Satıcının mağazasını yönettiği sayfa
 */
import '../style.css';
// Currency formatting via window.csFormatPrice (set by currencyService)
import { initFlowbite } from 'flowbite';
import { startAlpine } from '../alpine';
import { TopBar } from '../components/header';
import { initLanguageSelector } from '../components/header/TopBar';

const appEl = document.querySelector<HTMLDivElement>('#app')!;

appEl.innerHTML = `
  <!-- Header -->
  <div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    ${TopBar()}
  </div>

  <!-- Dashboard -->
  <div x-data="sellerDashboard" x-init="init()" class="min-h-screen bg-[#f0f2f5]">

    <!-- Auth guard: loading -->
    <div x-show="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin"></div>
        <span class="text-gray-500 text-sm">Yükleniyor...</span>
      </div>
    </div>

    <!-- Auth guard: not logged in -->
    <div x-show="!loading && !isAuthenticated" class="flex items-center justify-center min-h-[60vh]">
      <div class="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200 max-w-sm mx-4">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Giriş Gerekli</h2>
        <p class="text-gray-500 text-sm mb-4">Satıcı paneline erişmek için giriş yapmalısınız.</p>
        <a href="/pages/auth/login.html" class="inline-block w-full py-2.5 bg-[var(--color-primary-500)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--color-primary-600)] transition-colors">Giriş Yap</a>
      </div>
    </div>

    <!-- Auth guard: not seller -->
    <div x-show="!loading && isAuthenticated && !isSeller" class="flex items-center justify-center min-h-[60vh]">
      <div class="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200 max-w-sm mx-4">
        <svg class="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Satıcı Değilsiniz</h2>
        <p class="text-gray-500 text-sm mb-4">Bu sayfaya erişmek için satıcı hesabınız olmalıdır.</p>
        <a href="/pages/seller/sell.html" class="inline-block w-full py-2.5 bg-[var(--color-primary-500)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--color-primary-600)] transition-colors">Satıcı Ol</a>
      </div>
    </div>

    <!-- Dashboard İçeriği -->
    <div x-show="!loading && isAuthenticated && isSeller" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Üst Başlık -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
            <img x-show="profile.logo" :src="profile.logo" :alt="profile.seller_name" class="w-full h-full object-cover" />
            <svg x-show="!profile.logo" class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900" x-text="profile.seller_name || 'Mağazam'"></h1>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs font-mono text-gray-400" x-text="profile.seller_code"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span class="text-xs text-green-600 font-medium">Aktif</span>
            </div>
          </div>
        </div>
        <a :href="'/pages/seller/seller-storefront.html?seller=' + profile.seller_code"
           target="_blank"
           class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          Mağazayı Gör
        </a>
      </div>

      <!-- Tab Navigasyonu -->
      <div class="bg-white rounded-xl border border-gray-200 mb-6 overflow-x-auto">
        <div class="flex items-center px-2 min-w-max">
          <template x-for="tab in tabs" :key="tab.id">
            <button
              @click="activeTab = tab.id"
              :class="activeTab === tab.id
                ? 'border-b-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)] font-bold'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'"
              class="flex items-center gap-2 px-5 py-4 text-sm whitespace-nowrap transition-colors"
            >
              <span x-html="tab.icon"></span>
              <span x-text="tab.label"></span>
            </button>
          </template>
        </div>
      </div>

      <!-- ─── Hesabım Tab ──────────────────────────────────────── -->
      <div x-show="activeTab === 'account'" x-transition.opacity>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Sol: Temel Bilgiler -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5">Temel Bilgiler</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Mağaza Adı *</label>
                  <input x-model="form.account.seller_name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Telefon</label>
                  <input x-model="form.account.phone" type="tel" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Web Sitesi</label>
                  <input x-model="form.account.website" type="url" placeholder="https://" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Şehir</label>
                  <input x-model="form.account.city" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">İlçe</label>
                  <input x-model="form.account.district" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Posta Kodu</label>
                  <input x-model="form.account.postal_code" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Mağaza Sloganı</label>
                  <input x-model="form.account.slogan" type="text" placeholder="Kısa bir slogan..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Mağaza Açıklaması</label>
                  <textarea x-model="form.account.description" rows="4" placeholder="Mağazanız hakkında kısa bir açıklama..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"></textarea>
                </div>
              </div>
              <div class="mt-5 flex justify-end">
                <button @click="saveSection('account')"
                  :disabled="saving.account"
                  class="px-5 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                  <svg x-show="saving.account" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  <span x-text="saving.account ? 'Kaydediliyor...' : 'Kaydet'"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sağ: Logo & Banner -->
          <div class="space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5">Logo & Banner</h2>

              <div class="mb-5">
                <label class="block text-xs font-medium text-gray-600 mb-2">Logo URL</label>
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                    <img x-show="form.account.logo" :src="form.account.logo" class="w-full h-full object-cover" />
                    <svg x-show="!form.account.logo" class="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <input x-model="form.account.logo" type="url" placeholder="https://..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-2">Banner URL</label>
                <div class="w-full h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 mb-2 flex items-center justify-center">
                  <img x-show="form.account.banner_image" :src="form.account.banner_image" class="w-full h-full object-cover" />
                  <svg x-show="!form.account.banner_image" class="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <input x-model="form.account.banner_image" type="url" placeholder="https://..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent" />
              </div>

              <div class="mt-5">
                <button @click="saveSection('account')"
                  :disabled="saving.account"
                  class="w-full py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
                  <span x-text="saving.account ? 'Kaydediliyor...' : 'Görselleri Kaydet'"></span>
                </button>
              </div>
            </div>

            <!-- Performans Kartı -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-4">Performans</h2>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Sağlık Skoru</span>
                  <span class="text-sm font-bold text-green-600" x-text="profile.health_score + '%'"></span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Not</span>
                  <span class="text-sm font-bold text-gray-900" x-text="profile.score_grade"></span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Toplam Sipariş</span>
                  <span class="text-sm font-bold text-gray-900" x-text="profile.total_orders"></span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Puan</span>
                  <span class="text-sm font-bold text-gray-900" x-text="profile.rating > 0 ? profile.rating.toFixed(1) + '/5' : '—'"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Yorumlar Tab ─────────────────────────────────────── -->
      <div x-show="activeTab === 'reviews'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-base font-bold text-gray-900 mb-5">Müşteri Yorumları</h2>
          <div class="text-center py-12 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            <p class="text-sm font-medium text-gray-500">Henüz yorum bulunmuyor</p>
            <p class="text-xs text-gray-400 mt-1">İlk siparişlerinizden sonra yorumlar burada görünecek</p>
          </div>
        </div>
      </div>

      <!-- ─── Ürünler Tab ──────────────────────────────────────── -->
      <div x-show="activeTab === 'products'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200">
          <!-- Başlık + Ekle butonu -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 class="text-base font-bold text-gray-900">Ürünler (<span x-text="products.length"></span>)</h2>
            <button @click="openProductModal(null)"
              class="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Ürün Ekle
            </button>
          </div>

          <!-- Ürün Listesi -->
          <div x-show="products.length === 0" class="text-center py-12 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            <p class="text-sm font-medium text-gray-500">Henüz ürün eklemediniz</p>
            <p class="text-xs text-gray-400 mt-1">İlk ürününüzü ekleyin</p>
          </div>

          <div x-show="products.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 text-left">Ürün</th>
                  <th class="px-4 py-3 text-left">Kategori</th>
                  <th class="px-4 py-3 text-left">Fiyat</th>
                  <th class="px-4 py-3 text-left">Min Sipariş</th>
                  <th class="px-4 py-3 text-left">Durum</th>
                  <th class="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <template x-for="product in products" :key="product.name">
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img x-show="product.image" :src="product.image" class="w-full h-full object-cover" />
                          <div x-show="!product.image" class="w-full h-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></div>
                          </div>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900" x-text="product.product_name"></p>
                          <p class="text-xs text-gray-400 line-clamp-1" x-text="product.description || '—'"></p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600" x-text="getCategoryName(product.category) || '—'"></td>
                    <td class="px-4 py-3 text-gray-900">
                      <span x-text="product.price_min > 0 ? (product.price_max > product.price_min ? window.csFormatPriceRange(product.price_min, product.price_max, product.currency || 'USD') : window.csFormatPrice(product.price_min, product.currency || 'USD')) : '—'"></span>
                    </td>
                    <td class="px-4 py-3 text-gray-600" x-text="product.moq + ' ' + (product.moq_unit || 'Adet')"></td>
                    <td class="px-4 py-3">
                      <span :class="{
                        'bg-green-100 text-green-700': product.status === 'Active',
                        'bg-yellow-100 text-yellow-700': product.status === 'Draft',
                        'bg-gray-100 text-gray-500': product.status === 'Archived'
                      }" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="product.status === 'Active' ? 'Aktif' : product.status === 'Draft' ? 'Taslak' : 'Arşiv'"></span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="openProductModal(product)" class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button @click="deleteProduct(product.name)" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ─── Kategoriler Tab ─────────────────────────────────── -->
      <div x-show="activeTab === 'categories'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 class="text-base font-bold text-gray-900">Kategoriler (<span x-text="categories.length"></span>)</h2>
            <button @click="openCategoryModal(null)"
              class="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Kategori Ekle
            </button>
          </div>

          <div x-show="categories.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <p class="text-sm font-medium text-gray-500">Henüz kategori eklemediniz</p>
          </div>

          <div x-show="categories.length > 0" class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <template x-for="cat in categories" :key="cat.name">
              <div class="border border-gray-200 rounded-xl overflow-hidden group hover:border-[var(--color-primary-400)] hover:shadow-sm transition-all">
                <div class="aspect-video bg-gray-100 overflow-hidden">
                  <img x-show="cat.image" :src="cat.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div x-show="!cat.image" class="w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                </div>
                <div class="p-3 flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900 truncate" x-text="cat.category_name"></span>
                  <div class="flex items-center gap-1 ml-2 shrink-0">
                    <button @click="openCategoryModal(cat)" class="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="deleteCategory(cat.name)" class="p-1 text-gray-400 hover:text-red-500 rounded transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ─── Galeri Tab ──────────────────────────────────────── -->
      <div x-show="activeTab === 'gallery'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 class="text-base font-bold text-gray-900">Fabrika / Mağaza Fotoğrafları</h2>
              <p class="text-xs text-gray-400 mt-0.5">Maksimum 20 fotoğraf (<span x-text="gallery.length"></span>/20)</p>
            </div>
          </div>

          <!-- Yeni fotoğraf ekle -->
          <div x-show="gallery.length < 20" class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p class="text-xs font-medium text-gray-600 mb-3">Fotoğraf Ekle</p>
            <div class="flex gap-3 flex-wrap">
              <input
                x-model="galleryNewUrl"
                type="url"
                placeholder="Görsel URL (https://...)"
                class="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                @keydown.enter.prevent="addGalleryImage()"
              />
              <input
                x-model="galleryNewCaption"
                type="text"
                placeholder="Açıklama (opsiyonel)"
                class="w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              />
              <button
                @click="addGalleryImage()"
                :disabled="galleryAdding || !galleryNewUrl.trim()"
                class="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <svg x-show="galleryAdding" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                <svg x-show="!galleryAdding" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span x-text="galleryAdding ? 'Ekleniyor...' : 'Ekle'"></span>
              </button>
            </div>
            <!-- Önizleme -->
            <template x-if="galleryNewUrl.trim()">
              <div class="mt-3 flex items-center gap-3">
                <img :src="galleryNewUrl" class="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100" />
                <span class="text-xs text-gray-400">Önizleme</span>
              </div>
            </template>
          </div>

          <!-- Fotoğraf limit uyarısı -->
          <div x-show="gallery.length >= 20" class="px-6 py-3 bg-yellow-50 border-b border-yellow-100">
            <p class="text-xs text-yellow-700 font-medium">Maksimum fotoğraf sayısına ulaşıldı (20/20). Yeni eklemek için mevcut fotoğrafları silin.</p>
          </div>

          <!-- Boş galeri -->
          <div x-show="gallery.length === 0" class="text-center py-16">
            <svg class="w-14 h-14 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-sm font-medium text-gray-500">Henüz fotoğraf eklemediniz</p>
            <p class="text-xs text-gray-400 mt-1">Fabrika, atölye veya mağaza fotoğrafları ekleyin</p>
          </div>

          <!-- Fotoğraf grid -->
          <div x-show="gallery.length > 0" class="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <template x-for="(item, idx) in gallery" :key="item.name">
              <div class="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <img :src="item.image" :alt="item.caption || 'Galeri fotoğrafı'" class="w-full h-full object-cover" />
                <!-- Sıra numarası -->
                <div class="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-mono" x-text="idx + 1"></div>
                <!-- Caption -->
                <template x-if="item.caption">
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                    <p class="text-white text-[11px] line-clamp-1" x-text="item.caption"></p>
                  </div>
                </template>
                <!-- Sil butonu (hover'da) -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    @click="removeGalleryImage(item.name)"
                    class="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg"
                    title="Kaldır"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ─── Şirket Profili Tab ────────────────────────────────── -->
      <div x-show="activeTab === 'company'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-base font-bold text-gray-900 mb-5">Şirket Profili</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Şirket Adı</label>
              <input x-model="form.company.company_name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">İşletme Tipi</label>
              <select x-model="form.company.business_type" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
                <option value="Manufacturer">Üretici</option>
                <option value="Wholesaler">Toptancı</option>
                <option value="Retailer">Perakendeci</option>
                <option value="Other">Diğer</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Kuruluş Yılı</label>
              <input x-model="form.company.founded_year" type="text" placeholder="2010" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Personel Sayısı</label>
              <input x-model="form.company.staff_count" type="text" placeholder="100-200" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Yıllık Ciro</label>
              <input x-model="form.company.annual_revenue" type="text" placeholder="$1M+" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Fabrika Büyüklüğü (m²)</label>
              <input x-model="form.company.factory_size" type="text" placeholder="5000+" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Vergi No / TC No</label>
              <input x-model="form.company.tax_id" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Vergi Dairesi</label>
              <input x-model="form.company.tax_office" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Ana Pazarlar</label>
              <input x-model="form.company.main_markets" type="text" placeholder="Türkiye, AB, Orta Doğu..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <button @click="saveSection('company')"
              :disabled="saving.company"
              class="px-5 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
              <svg x-show="saving.company" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span x-text="saving.company ? 'Kaydediliyor...' : 'Kaydet'"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- ─── İletişim Tab ─────────────────────────────────────── -->
      <div x-show="activeTab === 'contact'" x-transition.opacity>
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-base font-bold text-gray-900 mb-5">İletişim Bilgileri</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Telefon</label>
              <input x-model="form.contact.phone" type="tel" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Web Sitesi</label>
              <input x-model="form.contact.website" type="url" placeholder="https://" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Adres</label>
              <input x-model="form.contact.address_line1" type="text" placeholder="Sokak, Mahalle..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Adres 2</label>
              <input x-model="form.contact.address_line2" type="text" placeholder="Sanayi Sitesi, Blok..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Şehir</label>
              <input x-model="form.contact.city" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">İlçe</label>
              <input x-model="form.contact.district" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Posta Kodu</label>
              <input x-model="form.contact.postal_code" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">IBAN</label>
              <input x-model="form.contact.iban" type="text" placeholder="TR..." class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <button @click="saveSection('contact')"
              :disabled="saving.contact"
              class="px-5 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
              <svg x-show="saving.contact" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span x-text="saving.contact ? 'Kaydediliyor...' : 'Kaydet'"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Başarı Toast ───────────────────────────────────────── -->
    <div x-show="toast.show" x-transition.opacity
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
      class="fixed bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium z-[9999]">
      <svg x-show="toast.type === 'success'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      <svg x-show="toast.type === 'error'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      <span x-text="toast.message"></span>
    </div>

    <!-- ─── Ürün Modal ─────────────────────────────────────────── -->
    <div x-show="productModal.open" x-transition class="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div @click.stop class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-bold text-gray-900" x-text="productModal.editId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'"></h3>
          <button @click="productModal.open = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Ürün Adı *</label>
            <input x-model="productModal.data.product_name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Açıklama</label>
            <textarea x-model="productModal.data.description" rows="3" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Görsel URL</label>
            <div class="flex gap-3 items-start">
              <div class="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                <img x-show="productModal.data.image" :src="productModal.data.image" class="w-full h-full object-cover" />
                <svg x-show="!productModal.data.image" class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <input x-model="productModal.data.image" type="url" placeholder="https://..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Min Fiyat ($)</label>
              <input x-model.number="productModal.data.price_min" type="number" step="0.01" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Max Fiyat ($)</label>
              <input x-model.number="productModal.data.price_max" type="number" step="0.01" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Min Sipariş</label>
              <input x-model.number="productModal.data.moq" type="number" min="1" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Birim</label>
              <input x-model="productModal.data.moq_unit" type="text" placeholder="Adet" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
            <select x-model="productModal.data.category" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
              <option value="">Kategori seçin...</option>
              <template x-for="cat in categories" :key="cat.name">
                <option :value="cat.name" x-text="cat.category_name"></option>
              </template>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Durum</label>
            <select x-model="productModal.data.status" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
              <option value="Active">Aktif</option>
              <option value="Draft">Taslak</option>
              <option value="Archived">Arşiv</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input x-model="productModal.data.is_featured" type="checkbox" id="is_featured" class="w-4 h-4 text-[var(--color-primary-500)] rounded border-gray-300" />
            <label for="is_featured" class="text-sm text-gray-700">Öne Çıkan Ürün</label>
          </div>
        </div>
        <div class="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button @click="productModal.open = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">İptal</button>
          <button @click="saveProduct()"
            :disabled="productModal.saving"
            class="flex-1 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
            <span x-text="productModal.saving ? 'Kaydediliyor...' : 'Kaydet'"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Kategori Modal ─────────────────────────────────────── -->
    <div x-show="categoryModal.open" x-transition class="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div @click.stop class="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-bold text-gray-900" x-text="categoryModal.editId ? 'Kategori Düzenle' : 'Yeni Kategori'"></h3>
          <button @click="categoryModal.open = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Kategori Adı *</label>
            <input x-model="categoryModal.data.category_name" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Görsel URL</label>
            <div class="flex gap-3 items-start">
              <div class="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                <img x-show="categoryModal.data.image" :src="categoryModal.data.image" class="w-full h-full object-cover" />
                <svg x-show="!categoryModal.data.image" class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <input x-model="categoryModal.data.image" type="url" placeholder="https://..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Sıralama</label>
            <input x-model.number="categoryModal.data.sort_order" type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
          </div>
        </div>
        <div class="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button @click="categoryModal.open = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">İptal</button>
          <button @click="saveCategory()"
            :disabled="categoryModal.saving"
            class="flex-1 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
            <span x-text="categoryModal.saving ? 'Kaydediliyor...' : 'Kaydet'"></span>
          </button>
        </div>
      </div>
    </div>

  </div>
`;

initFlowbite();
initLanguageSelector();
startAlpine();
