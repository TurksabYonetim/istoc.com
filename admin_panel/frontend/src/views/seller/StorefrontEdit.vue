<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/dashboard')" class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div class="min-w-0">
          <h1 class="text-[15px] font-bold text-gray-900">Vitrin Düzenle</h1>
          <p class="text-xs text-gray-400">Mağaza vitrin bilgilerinizi düzenleyin</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <button class="hdr-btn-outlined" @click="$router.push('/dashboard')">İptal</button>
        <button class="hdr-btn-primary" :disabled="saving" @click="saveForm">
          <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-floppy-disk'" class="mr-1.5 text-xs"></i>
          {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <i class="fas fa-spinner fa-spin text-2xl text-violet-500"></i>
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- No Storefront -->
    <div v-else-if="!hasStorefront" class="card text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
        <i class="fas fa-store text-2xl text-gray-500"></i>
      </div>
      <h3 class="text-sm font-bold text-gray-700 mb-1">Henüz vitrininiz yok</h3>
      <p class="text-xs text-gray-400">Vitrin oluşturmak için satıcı profilinizi tamamlayın</p>
    </div>

    <template v-else>
      <!-- Tabs -->
      <div class="flex items-center gap-0.5 border-b border-gray-200 mb-5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="detail-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="tab.icon" class="mr-1.5 text-[10px]"></i>{{ tab.label }}
        </button>
      </div>

      <!-- Tab 1: Şirket Profili -->
      <div v-if="activeTab === 'company'">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          <div class="xl:col-span-2 space-y-5">
            <!-- Logo Upload -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-image text-violet-500 mr-2"></i>Şirket Logosu</h3>
              <div class="flex items-center gap-5">
                <div class="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover" alt="Logo">
                  <i v-else class="fas fa-building text-2xl text-gray-300"></i>
                </div>
                <div>
                  <button class="hdr-btn-outlined text-xs" @click="$refs.logoInput.click()">
                    <i class="fas fa-cloud-arrow-up mr-1.5"></i>Logo Yükle
                  </button>
                  <input ref="logoInput" type="file" class="hidden" accept="image/*" @change="handleLogoUpload">
                  <p class="text-[10px] text-gray-400 mt-1.5">PNG, JPG, WEBP - Maks 5MB</p>
                </div>
              </div>
            </div>

            <!-- Company Info -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-building text-blue-500 mr-2"></i>Şirket Bilgileri</h3>
              <p class="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                <i class="fas fa-info-circle text-blue-400"></i>
                Bu bilgiler satıcı profilinizden alınır.
                <a href="/app/settings" class="text-blue-600 underline hover:text-blue-800">Profil ayarlarından düzenleyin</a>
              </p>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Görünen Ad</label>
                  <input v-model="form.display_name" type="text" class="form-input bg-gray-50 cursor-not-allowed" placeholder="Şirket görünen adı" disabled>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Şehir</label>
                    <select v-model="form.city" class="form-input bg-gray-50 cursor-not-allowed" disabled>
                      <option value="">Şehir seçin</option>
                      <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Ülke</label>
                    <select v-model="form.country" class="form-input bg-gray-50 cursor-not-allowed" disabled>
                      <option value="">Ülke seçin</option>
                      <option v-for="country in countryOptions" :key="country" :value="country">{{ country }}</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">İletişim E-postası</label>
                    <input v-model="form.contact_email" type="email" class="form-input" placeholder="info@sirket.com">
                  </div>
                  <div>
                    <label class="form-label">Web Sitesi</label>
                    <input v-model="form.website" type="url" class="form-input bg-gray-50 cursor-not-allowed" placeholder="https://sirket.com" disabled>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-5">
            <!-- Preferred Categories -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-folder-tree text-amber-500 mr-2"></i>Tercih Edilen Kategoriler</h3>
              <p class="text-xs text-gray-400 mb-3">
                <i class="fas fa-info-circle mr-1"></i>Kategoriler satıcı profilinizden alınır.
              </p>
              <div class="space-y-2">
                <label v-for="cat in categoryOptions" :key="cat" class="flex items-center gap-2 opacity-60 cursor-not-allowed">
                  <input type="checkbox" class="form-checkbox rounded text-violet-600" :value="cat" v-model="form.preferred_categories" disabled>
                  <span class="text-xs text-gray-700">{{ cat }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Görünüm & Banner -->
      <div v-if="activeTab === 'branding'">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          <div class="xl:col-span-2 space-y-5">
            <!-- Banner Upload -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4">
                <i class="fas fa-image text-blue-500 mr-2"></i>Ana Banner
              </h3>
              <div
                class="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                @click="$refs.bannerInput.click()"
              >
                <img v-if="form.banner" :src="form.banner" class="w-full h-40 object-cover" alt="Banner">
                <div v-else class="p-8 text-center">
                  <i class="fas fa-image text-3xl text-gray-300 mb-2 block"></i>
                  <p class="text-sm text-gray-400">Banner resmi yükleyin (1200x300px önerilen)</p>
                </div>
                <input ref="bannerInput" type="file" class="hidden" accept="image/*" @change="handleBannerUpload">
              </div>
              <button v-if="form.banner" class="mt-2 text-xs text-red-500 hover:text-red-700" @click="form.banner = ''">
                <i class="fas fa-trash mr-1"></i>Kaldır
              </button>
            </div>
            <!-- Tagline & Description -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4">
                <i class="fas fa-pen text-violet-500 mr-2"></i>Mağaza Açıklaması
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Slogan / Tagline</label>
                  <input v-model="form.tagline" type="text" class="form-input" placeholder="Kısa ve akılda kalıcı bir slogan...">
                </div>
                <div>
                  <label class="form-label">Kısa Açıklama</label>
                  <textarea v-model="form.short_description" class="form-input" rows="3" placeholder="Mağazanızı kısaca tanıtın..."></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-3"><i class="fas fa-info-circle text-blue-400 mr-2"></i>Önizleme</h3>
              <p class="text-xs text-gray-400">Mağaza sayfasında görünecek şekilde ayarlayın.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Slider -->
      <div v-if="activeTab === 'slider'">
        <div class="card">
          <h3 class="text-sm font-bold text-gray-900 mb-4">
            <i class="fas fa-images text-blue-500 mr-2"></i>Slider Görselleri
          </h3>
          <p class="text-xs text-gray-400 mb-4">Mağaza ana sayfasında otomatik geçişli slider için görseller ekleyin (1200x450px önerilen).</p>
          <!-- Upload area -->
          <div
            class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-400 transition-colors cursor-pointer mb-4"
            @click="$refs.sliderInput.click()"
            @dragover.prevent
            @drop.prevent="handleSliderDrop"
          >
            <input ref="sliderInput" type="file" class="hidden" multiple accept="image/*" @change="handleSliderFiles">
            <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 flex items-center justify-center">
              <i class="fas fa-cloud-arrow-up text-xl text-gray-500"></i>
            </div>
            <p class="text-sm font-medium text-gray-600 mb-1">Slider görselleri yükleyin</p>
            <p class="text-xs text-gray-400">PNG, JPG, WEBP - Maks 10MB per image</p>
          </div>
          <!-- Slider images preview -->
          <div v-if="form.slider_images.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="(img, i) in form.slider_images" :key="i" class="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img :src="img.preview || img.image" class="w-full h-28 object-cover">
              <div class="p-2">
                <input v-model="img.title" type="text" class="w-full text-xs border border-gray-200 rounded px-2 py-1 mb-1" placeholder="Başlık (opsiyonel)">
              </div>
              <button @click="form.slider_images.splice(i, 1)" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">
                <i class="fas fa-xmark"></i>
              </button>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-400">
            <i class="fas fa-images text-2xl mb-2 block"></i>
            <p class="text-sm">Henüz slider görseli yok</p>
          </div>
        </div>
      </div>

      <!-- Tab 4: Fabrika & Kapasite -->
      <div v-if="activeTab === 'factory'">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          <div class="xl:col-span-2 space-y-5">
            <!-- Factory Info -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-industry text-violet-500 mr-2"></i>Fabrika Bilgileri</h3>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label class="form-label">Çalışan Sayısı</label>
                  <input v-model="form.employee_count" type="text" class="form-input" placeholder="100+">
                </div>
                <div>
                  <label class="form-label">Fabrika Alanı (m²)</label>
                  <input v-model="form.factory_area" type="text" class="form-input" placeholder="10.000+">
                </div>
                <div>
                  <label class="form-label">Yıllık Gelir</label>
                  <input v-model="form.annual_revenue" type="text" class="form-input" placeholder="$70 B+">
                </div>
              </div>
            </div>

            <!-- Factory Images -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-images text-blue-500 mr-2"></i>Fabrika Görselleri</h3>
              <div
                class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-400 transition-colors cursor-pointer"
                @click="$refs.factoryInput.click()"
                @dragover.prevent
                @drop.prevent="handleFactoryDrop"
              >
                <input ref="factoryInput" type="file" class="hidden" multiple accept="image/*" @change="handleFactoryFiles">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 flex items-center justify-center">
                  <i class="fas fa-cloud-arrow-up text-xl text-gray-500"></i>
                </div>
                <p class="text-sm font-medium text-gray-600 mb-1">Fabrika görsellerini sürükleyin veya tıklayın</p>
                <p class="text-xs text-gray-400">PNG, JPG, WEBP - Maks 10MB</p>
              </div>
              <!-- Preview -->
              <div v-if="form.factory_images.length" class="flex gap-3 mt-4 flex-wrap">
                <div v-for="(img, i) in form.factory_images" :key="i" class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img :src="img.preview || img.url" class="w-full h-full object-cover">
                  <button @click="form.factory_images.splice(i, 1)" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">
                    <i class="fas fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Factory Video -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-video text-rose-500 mr-2"></i>Fabrika Videosu</h3>
              <div>
                <label class="form-label">Video URL</label>
                <input v-model="form.factory_video_url" type="url" class="form-input" placeholder="https://youtube.com/watch?v=...">
                <p class="text-[10px] text-gray-400 mt-1">YouTube veya Vimeo video bağlantısı</p>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-5">
            <!-- Certificates -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-shield-check text-teal-500 mr-2"></i>Sertifikalar</h3>
              <div class="space-y-2">
                <label v-for="cert in certificateOptions" :key="cert" class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded text-violet-600" :value="cert" v-model="form.certificates">
                  <span class="text-xs text-gray-700">{{ cert }}</span>
                </label>
              </div>
            </div>

            <!-- Capabilities -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-gear text-orange-500 mr-2"></i>Yetenekler</h3>
              <div class="space-y-2">
                <label v-for="cap in capabilityOptions" :key="cap" class="flex items-center gap-2">
                  <input type="checkbox" class="form-checkbox rounded text-violet-600" :value="cap" v-model="form.capabilities">
                  <span class="text-xs text-gray-700">{{ cap }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 5: Ürünler -->
      <div v-if="activeTab === 'products'">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-gray-900">
              <i class="fas fa-box text-violet-500 mr-2"></i>Ürünlerim
            </h3>
            <a href="/app/listing/new-listing-1" class="hdr-btn-primary text-xs" target="_blank">
              <i class="fas fa-plus mr-1.5"></i>Yeni Ürün Ekle
            </a>
          </div>
          <div v-if="loadingProducts" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-violet-500"></i>
          </div>
          <div v-else-if="sellerProducts.length === 0" class="text-center py-8 text-gray-400">
            <i class="fas fa-box-open text-2xl mb-2 block"></i>
            <p class="text-sm">Henüz ürün eklenmemiş</p>
            <p class="text-xs mt-1">Yeni ürün ekleyerek mağazanızı zenginleştirin</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            <div v-for="product in sellerProducts" :key="product.name" class="border border-gray-200 rounded-lg overflow-hidden hover:border-violet-300 transition-colors">
              <div class="aspect-square bg-gray-100 overflow-hidden">
                <img v-if="product.primary_image" :src="product.primary_image" class="w-full h-full object-cover" :alt="product.title">
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-image text-2xl text-gray-300"></i>
                </div>
              </div>
              <div class="p-2">
                <p class="text-xs font-medium text-gray-800 truncate">{{ product.title }}</p>
                <p class="text-xs text-gray-400">{{ product.status }}</p>
              </div>
            </div>
          </div>
          <p v-if="sellerProductsTotal > sellerProducts.length" class="text-xs text-center text-gray-400 mt-3">
            {{ sellerProducts.length }} / {{ sellerProductsTotal }} ürün gösteriliyor
          </p>
        </div>
      </div>

      <!-- Tab 6: Vitrin Ayarları -->
      <div v-if="activeTab === 'settings'">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          <div class="xl:col-span-2 space-y-5">
            <!-- Store Info -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-store text-violet-500 mr-2"></i>Mağaza Bilgileri</h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Vitrin URL (Slug)</label>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-400 flex-shrink-0">/store/</span>
                    <input :value="form.storefront_slug" type="text" class="form-input bg-gray-50" readonly>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1">Vitrin URL'si otomatik oluşturulur ve değiştirilemez</p>
                </div>
                <div>
                  <label class="form-label">Mağaza Adı <span class="text-red-500">*</span></label>
                  <input v-model="form.store_name" type="text" class="form-input" placeholder="Mağaza adı">
                </div>
              </div>
            </div>

            <!-- Campaigns Placeholder -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-bullhorn text-amber-500 mr-2"></i>Kampanyalar</h3>
              <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 flex items-center justify-center">
                  <i class="fas fa-bullhorn text-xl text-gray-300"></i>
                </div>
                <p class="text-sm font-medium text-gray-500 mb-1">Kampanya yönetimi yakında</p>
                <p class="text-xs text-gray-400">Bu alan ileride kampanya tanımlama için kullanılacaktır</p>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-5">
            <!-- Publish Status -->
            <div class="card">
              <h3 class="text-sm font-bold text-gray-900 mb-4"><i class="fas fa-circle-check text-emerald-500 mr-2"></i>Yayın Durumu</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-semibold text-gray-700">Vitrini Yayınla</p>
                    <p class="text-[10px] text-gray-400">Vitrininizi herkese açık hale getirin</p>
                  </div>
                  <button
                    @click="togglePublish"
                    class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    :class="form.is_published ? 'bg-emerald-500' : 'bg-gray-300'"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      :class="form.is_published ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
                <div class="flex items-center gap-2 p-2.5 rounded-lg" :class="form.is_published ? 'bg-emerald-50' : 'bg-gray-50'">
                  <i :class="form.is_published ? 'fas fa-globe text-emerald-500' : 'fas fa-eye-slash text-gray-400'" class="text-xs"></i>
                  <span class="text-xs font-medium" :class="form.is_published ? 'text-emerald-700' : 'text-gray-500'">
                    {{ form.is_published ? 'Yayında' : 'Yayında Değil' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import api from '@/utils/api'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const hasStorefront = ref(true)
const activeTab = ref('company')
const storefrontName = ref('')

const loadingProducts = ref(false)
const sellerProducts = ref([])
const sellerProductsTotal = ref(0)

const tabs = [
  { key: 'company', label: 'Şirket Profili', icon: 'fas fa-building' },
  { key: 'branding', label: 'Görünüm & Banner', icon: 'fas fa-palette' },
  { key: 'slider', label: 'Slider', icon: 'fas fa-images' },
  { key: 'factory', label: 'Fabrika & Kapasite', icon: 'fas fa-industry' },
  { key: 'products', label: 'Ürünler', icon: 'fas fa-box' },
  { key: 'settings', label: 'Vitrin Ayarları', icon: 'fas fa-cog' },
]

const cityOptions = [
  'Adana', 'Ankara', 'Antalya', 'Bursa', 'Denizli', 'Diyarbakır',
  'Eskişehir', 'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli',
  'Konya', 'Manisa', 'Mersin', 'Sakarya', 'Samsun', 'Tekirdağ', 'Trabzon',
]

const countryOptions = [
  'Türkiye', 'Almanya', 'Fransa', 'İngiltere', 'İtalya', 'İspanya',
  'Hollanda', 'Belçika', 'ABD', 'Çin', 'Japonya', 'Güney Kore',
]

const categoryOptions = [
  'Elektrik Sayaçları', 'Su Sayaçları', 'Gaz Sayaçları', 'Kimyasallar',
  'Solventler', 'Reçineler', 'Yapıştırıcılar', 'Endüstriyel',
  'Tekstil', 'Gıda', 'Otomotiv', 'İnşaat',
]

const certificateOptions = ['ISO', 'CE', 'CPC', 'RoHS', 'FCC']

const capabilityOptions = [
  'Küçük özelleştirme',
  'Çizime göre özelleştirme',
  'Numunelerden özelleştirme',
  'Nihai ürün denetimi',
  'Garanti seçenekleri mevcut',
  'Kalite kontrol sertifikalı',
]

const form = reactive({
  logo: '',
  display_name: '',
  city: '',
  country: '',
  contact_email: '',
  website: '',
  preferred_categories: [],
  employee_count: '',
  factory_area: '',
  annual_revenue: '',
  factory_images: [],
  factory_video_url: '',
  certificates: [],
  capabilities: [],
  storefront_slug: '',
  store_name: '',
  is_published: false,
  banner: '',
  tagline: '',
  short_description: '',
  slider_images: [],
})

async function loadStorefront() {
  loading.value = true
  try {
    const res = await api.callMethod('tr_tradehub.api.v1.seller.get_storefront')
    const data = res.message
    if (!data || !data.has_storefront) {
      hasStorefront.value = false
      return
    }
    storefrontName.value = data.name || ''
    form.logo = data.logo || ''
    form.display_name = data.display_name || data.store_name || ''
    form.city = data.city || ''
    form.country = data.country || ''
    form.contact_email = data.public_email || data.contact_email || ''
    form.website = data.website || ''
    form.preferred_categories = data.preferred_categories || []
    form.employee_count = data.employee_count || ''
    form.factory_area = data.factory_area || ''
    form.annual_revenue = data.annual_revenue || ''
    form.factory_video_url = data.factory_video_url || ''
    form.storefront_slug = data.slug || ''
    form.store_name = data.store_name || ''
    form.is_published = data.is_published === 1 || data.is_published === true
    form.banner = data.banner || ''
    form.tagline = data.tagline || ''
    form.short_description = data.short_description || ''

    // Load certificates from child table
    if (data.certificates && Array.isArray(data.certificates)) {
      form.certificates = data.certificates.map(c => c.certificate_type || c)
    }
    // Load capabilities from child table
    if (data.capabilities && Array.isArray(data.capabilities)) {
      form.capabilities = data.capabilities.map(c => c.capability_name || c)
    }
    // Load factory images from child table
    if (data.factory_images && Array.isArray(data.factory_images)) {
      form.factory_images = data.factory_images.map(img => ({
        url: typeof img === 'string' ? img : img.image,
        preview: typeof img === 'string' ? img : img.image,
        name: typeof img === 'string' ? '' : (img.name || ''),
      }))
    }
    // Load slider images
    if (data.slider_images && Array.isArray(data.slider_images)) {
      form.slider_images = data.slider_images.map(img => ({
        image: typeof img === 'string' ? img : img.image,
        preview: typeof img === 'string' ? img : img.image,
        title: img.title || '',
        subtitle: img.subtitle || '',
        link_url: img.link_url || '',
        sort_order: img.sort_order || 0,
        name: img.name || '',
      }))
    }
  } catch {
    hasStorefront.value = false
  } finally {
    loading.value = false
  }
}

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('is_private', '0')
  formData.append('doctype', 'Storefront')
  formData.append('docname', storefrontName.value)

  const csrf = getCookie('csrf_token') || 'None'
  const response = await fetch('/api/method/upload_file', {
    method: 'POST',
    headers: {
      'X-Frappe-CSRF-Token': csrf,
    },
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Dosya yükleme başarısız')
  }

  const result = await response.json()
  return result.message?.file_url || ''
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return ''
}

async function handleLogoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const url = await uploadFile(file)
    if (url) {
      form.logo = url
      toast.success('Logo yüklendi')
    }
  } catch {
    toast.error('Logo yüklenirken hata oluştu')
  }
}

function handleBannerUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadFile(file).then(url => {
    if (url) form.banner = url
  }).catch(() => toast.error('Banner yüklenirken hata oluştu'))
}

function handleFactoryFiles(e) {
  const files = e.target.files
  for (const file of files) {
    form.factory_images.push({ file, preview: URL.createObjectURL(file) })
  }
}

function handleFactoryDrop(e) {
  const files = e.dataTransfer.files
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      form.factory_images.push({ file, preview: URL.createObjectURL(file) })
    }
  }
}

function handleSliderFiles(e) {
  const files = e.target.files
  for (const file of files) {
    form.slider_images.push({ file, image: '', preview: URL.createObjectURL(file), title: '', subtitle: '', link_url: '', sort_order: form.slider_images.length })
  }
}

function handleSliderDrop(e) {
  const files = e.dataTransfer.files
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      form.slider_images.push({ file, image: '', preview: URL.createObjectURL(file), title: '', subtitle: '', link_url: '', sort_order: form.slider_images.length })
    }
  }
}

async function getCurrentSellerName() {
  const res = await api.callMethod('tr_tradehub.api.v1.identity.get_current_user_info')
  return res.message?.seller_name || ''
}

async function loadSellerProducts() {
  loadingProducts.value = true
  try {
    const sellerName = await getCurrentSellerName()
    const res = await api.callMethod('tr_tradehub.api.v1.seller.get_storefront_products', {
      seller_name: sellerName,
    })
    sellerProducts.value = res.message?.data || []
    sellerProductsTotal.value = res.message?.total || 0
  } catch {
    // silently fail
  } finally {
    loadingProducts.value = false
  }
}

async function togglePublish() {
  const action = form.is_published
    ? 'tr_tradehub.api.v1.seller.unpublish_storefront'
    : 'tr_tradehub.api.v1.seller.publish_storefront'
  try {
    await api.callMethod(action, { storefront_name: storefrontName.value })
    form.is_published = !form.is_published
    toast.success(form.is_published ? 'Vitrin yayınlandı' : 'Vitrin yayından kaldırıldı')
  } catch {
    toast.error('Yayın durumu değiştirilemedi')
  }
}

async function saveForm() {
  if (!form.store_name && !form.display_name) {
    toast.error('Mağaza adı veya görünen ad zorunludur')
    return
  }

  saving.value = true
  try {
    // Upload pending factory images
    const uploadedImages = []
    for (const img of form.factory_images) {
      if (img.file) {
        const url = await uploadFile(img.file)
        if (url) uploadedImages.push({ image: url })
      } else if (img.url) {
        uploadedImages.push({ image: img.url, name: img.name || '' })
      }
    }

    // Upload pending slider images
    const uploadedSliderImages = []
    for (const img of form.slider_images) {
      if (img.file) {
        const url = await uploadFile(img.file)
        if (url) uploadedSliderImages.push({
          image: url,
          title: img.title || '',
          subtitle: img.subtitle || '',
          link_url: img.link_url || '',
          sort_order: img.sort_order || 0,
        })
      } else if (img.image) {
        uploadedSliderImages.push({
          image: img.image,
          title: img.title || '',
          subtitle: img.subtitle || '',
          link_url: img.link_url || '',
          sort_order: img.sort_order || 0,
          name: img.name || '',
        })
      }
    }

    // Build certificates child table data
    const certificates = form.certificates.map(cert => ({
      certificate_type: cert,
      certificate_name: cert,
    }))

    // Build capabilities child table data
    const capabilities = form.capabilities.map(cap => ({
      capability_name: cap,
      capability_type: cap,
    }))

    await api.callMethod('tr_tradehub.api.v1.seller.update_storefront', {
      storefront_name: storefrontName.value,
      store_name: form.store_name,
      logo: form.logo,
      public_email: form.contact_email,
      factory_video_url: form.factory_video_url,
      employee_count: form.employee_count,
      factory_area: form.factory_area,
      annual_revenue: form.annual_revenue,
      factory_images: uploadedImages,
      certificates: certificates,
      capabilities: capabilities,
      banner: form.banner,
      tagline: form.tagline,
      short_description: form.short_description,
      slider_images: uploadedSliderImages,
    })

    toast.success('Vitrin başarıyla güncellendi')
  } catch {
    toast.error('Vitrin güncellenirken hata oluştu')
  } finally {
    saving.value = false
  }
}

watch(activeTab, (val) => {
  if (val === 'products' && sellerProducts.value.length === 0) {
    loadSellerProducts()
  }
})

onMounted(loadStorefront)
</script>
