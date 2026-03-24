<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0"><AppIcon name="arrow-left" :size="14" /></button>
        <span class="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10 px-2.5 py-1 rounded-md">{{ docName }}</span>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{{ doc.seller || 'Satıcı Metrikleri' }}</h1>
      </div>
    </div>

    <div v-if="loading" class="card text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-violet-500"></i><p class="text-sm text-gray-400 mt-3">Yükleniyor...</p></div>

    <template v-else>
      <!-- Quick KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-violet-600">{{ doc.total_orders || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Sipariş</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ formatCurrency(doc.total_sales_amount) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Satış</p>
        </div>
        <div class="card !p-4 text-center">
          <div class="flex items-center justify-center gap-1">
            <i class="fas fa-star text-yellow-400 text-sm"></i>
            <p class="text-2xl font-black text-gray-800">{{ (doc.avg_rating || 0).toFixed(1) }}</p>
          </div>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Ortalama Puan</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black" :style="{ color: rateColor(doc.on_time_delivery_rate, true) }">%{{ (doc.on_time_delivery_rate || 0).toFixed(1) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Zamanında Teslimat</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black" :style="{ color: rateColor(doc.return_rate, false) }">%{{ (doc.return_rate || 0).toFixed(1) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">İade Oranı</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-0.5 border-b border-gray-200 mb-5">
        <button v-for="tab in tabs" :key="tab.key" class="detail-tab" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
          <i :class="tab.icon" class="mr-1.5 text-[10px]"></i>{{ tab.label }}
        </button>
      </div>

      <!-- Tab: Detaylar -->
      <div v-if="activeTab === 'details'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-info-circle text-violet-500 mr-2"></i>Temel Bilgiler</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Satıcı</label><input :value="doc.seller" class="form-input" readonly></div>
            <div><label class="form-label">Satıcı Adı</label><input :value="doc.seller_name || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Hesaplama Tarihi</label><input :value="formatDate(doc.calculation_date)" class="form-input" readonly></div>
            <div><label class="form-label">Son Sipariş</label><input :value="formatDate(doc.last_order_date)" class="form-input" readonly></div>
          </div>
        </div>
        <div class="card">
          <h3 class="section-title"><i class="fas fa-chart-pie text-blue-500 mr-2"></i>Genel Durum</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Doğrulama Durumu</label><input :value="doc.verification_status || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Premium Satıcı</label><input :value="doc.premium_seller ? 'Evet' : 'Hayır'" class="form-input" readonly></div>
            <div><label class="form-label">Aktif Gün</label><input :value="doc.active_days || 0" class="form-input" readonly></div>
            <div><label class="form-label">Ort. Yanıt Süresi (saat)</label><input :value="(doc.avg_response_time_hours || 0).toFixed(1)" class="form-input" readonly></div>
          </div>
        </div>
      </div>

      <!-- Tab: Performans -->
      <div v-if="activeTab === 'performance'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-gauge-high text-emerald-500 mr-2"></i>Performans Metrikleri</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="m in perfMetrics" :key="m.field" class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i :class="m.icon" class="text-xs" :style="{ color: m.color }"></i>
                <span class="text-xs font-semibold text-gray-600">{{ m.label }}</span>
              </div>
              <p class="text-lg font-bold text-gray-900">
                {{ m.format === 'percent' ? '%' + (doc[m.field] || 0).toFixed(1) : (m.format === 'currency' ? formatCurrency(doc[m.field]) : (doc[m.field] || 0)) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Değerlendirmeler -->
      <div v-if="activeTab === 'reviews'">
        <div class="card">
          <h3 class="section-title"><i class="fas fa-star text-yellow-500 mr-2"></i>Değerlendirmeler</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">{{ (doc.avg_rating || 0).toFixed(1) }}</p>
              <div class="flex items-center justify-center gap-0.5 mt-1">
                <i v-for="s in 5" :key="s" class="text-[10px]" :class="s <= Math.round(doc.avg_rating || 0) ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-500 dark:text-gray-300'"></i>
              </div>
              <p class="text-[10px] text-gray-400 mt-1">Ort. Puan</p>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-xl">
              <p class="text-xl font-black text-blue-600">{{ doc.total_reviews || 0 }}</p>
              <p class="text-[10px] text-gray-500">Toplam Yorum</p>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-xl">
              <p class="text-xl font-black text-emerald-600">%{{ (doc.positive_review_rate || 0).toFixed(1) }}</p>
              <p class="text-[10px] text-gray-500">Olumlu Yorum</p>
            </div>
            <div class="text-center p-3 bg-amber-50 rounded-xl">
              <p class="text-xl font-black text-amber-600">%{{ (doc.repeat_customer_rate || 0).toFixed(1) }}</p>
              <p class="text-[10px] text-gray-500">Tekrar Müşteri</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const doc = ref({})
const activeTab = ref('details')
const docName = computed(() => decodeURIComponent(route.params.name || ''))

const tabs = [
  { key: 'details', label: 'Detaylar', icon: 'fas fa-file-lines' },
  { key: 'performance', label: 'Performans', icon: 'fas fa-gauge-high' },
  { key: 'reviews', label: 'Değerlendirmeler', icon: 'fas fa-star' },
]

const perfMetrics = [
  { field: 'total_orders', label: 'Toplam Sipariş', icon: 'fas fa-cart-shopping', color: '#6366f1', format: 'number' },
  { field: 'total_sales_amount', label: 'Toplam Satış', icon: 'fas fa-coins', color: '#10b981', format: 'currency' },
  { field: 'on_time_delivery_rate', label: 'Zamanında Teslimat', icon: 'fas fa-truck-fast', color: '#3b82f6', format: 'percent' },
  { field: 'cancellation_rate', label: 'İptal Oranı', icon: 'fas fa-ban', color: '#f59e0b', format: 'percent' },
  { field: 'return_rate', label: 'İade Oranı', icon: 'fas fa-rotate-left', color: '#ef4444', format: 'percent' },
  { field: 'complaint_rate', label: 'Şikayet Oranı', icon: 'fas fa-comment-exclamation', color: '#ef4444', format: 'percent' },
  { field: 'listing_count', label: 'Toplam İlan', icon: 'fas fa-list', color: '#8b5cf6', format: 'number' },
  { field: 'active_listing_count', label: 'Aktif İlan', icon: 'fas fa-check-circle', color: '#22c55e', format: 'number' },
  { field: 'avg_response_time_hours', label: 'Ort. Yanıt (saat)', icon: 'fas fa-clock', color: '#6366f1', format: 'number' },
]

function goBack() { router.push('/app/seller-metrics-list') }

async function loadDoc() {
  loading.value = true
  try { const res = await api.getDoc('Seller Metrics', docName.value); doc.value = res.data || {} }
  catch { doc.value = { name: docName.value } }
  finally { loading.value = false }
}

function formatCurrency(v) { if (v == null) return '-'; return Number(v).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }) }
function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('tr-TR') }
function rateColor(v, higherBetter) { if (higherBetter) return v >= 90 ? '#10b981' : v >= 70 ? '#f59e0b' : '#ef4444'; return v <= 5 ? '#10b981' : v <= 15 ? '#f59e0b' : '#ef4444' }

watch(() => route.params.name, loadDoc)
onMounted(loadDoc)
</script>

<style scoped>
.section-title { font-size: 12px; font-weight: 700; color: #1f2937; display: flex; align-items: center; }
.detail-tab { font-size: 12px; font-weight: 500; padding: 10px 16px; color: #9ca3af; border-bottom: 2px solid transparent; transition: all 0.2s; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; }
.detail-tab:hover { color: #6b7280; }
.detail-tab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 600; }
.perf-card { padding: 14px; background: var(--th-surface-elevated, #f9fafb); border-radius: 12px; border: 1px solid var(--th-surface-border, #f3f4f6); }
</style>
