<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0">
          <AppIcon name="arrow-left" :size="14" />
        </button>
        <span class="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10 px-2.5 py-1 rounded-md">{{ docName }}</span>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{{ doc.score_period || 'Seller Score' }}</h1>
      </div>
      <span class="badge text-xs px-3 py-1" :class="getStatusClass(doc.status)">
        <span class="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" :class="getStatusDot(doc.status)"></span>
        {{ getStatusLabel(doc.status) }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <i class="fas fa-spinner fa-spin text-2xl text-violet-500"></i>
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <template v-else>
      <!-- Workflow Stepper -->
      <div class="card mb-5 !py-5 !px-8">
        <div class="stepper-container">
          <div
            v-for="(step, i) in workflowSteps"
            :key="step.value"
            class="stepper-step"
          >
            <!-- Connector line (before step) -->
            <div
              v-if="i > 0"
              class="stepper-line"
              :class="i <= currentStepIndex ? 'bg-violet-500' : 'bg-gray-700'"
            ></div>
            <!-- Circle -->
            <div
              class="stepper-circle"
              :class="getStepClass(step, i)"
            >
              <i v-if="isStepDone(i)" class="fas fa-check text-[10px]"></i>
              <span v-else class="text-[11px]">{{ i + 1 }}</span>
            </div>
            <!-- Label -->
            <span
              class="stepper-label"
              :class="currentStepIndex >= i ? 'text-violet-400 font-semibold' : 'text-gray-500'"
            >
              {{ step.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black" :style="{ color: getScoreColor(doc.overall_score) }">{{ formatScore(doc.overall_score) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Genel Skor</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-blue-600">{{ formatScore(doc.delivery_score) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Teslimat</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ formatScore(doc.quality_score) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Kalite</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-amber-600">{{ formatScore(doc.service_score) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Hizmet</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-purple-600">{{ doc.score_type || '-' }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Tip</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center gap-0.5 border-b border-gray-200 mb-5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="detail-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="tab.icon" class="mr-1.5 text-[10px]"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Detaylar -->
      <div v-if="activeTab === 'details'">
        <!-- Temel Bilgiler -->
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-info-circle text-violet-500 mr-2"></i>Temel Bilgiler</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Satıcı *</label>
              <input :value="doc.seller" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Skor Kodu</label>
              <input :value="doc.name" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Skor Tipi</label>
              <input :value="doc.score_type" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Skor Dönemi</label>
              <input :value="doc.score_period" type="text" class="form-input" readonly>
            </div>
          </div>
        </div>

        <!-- Durum & Tarih -->
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-calendar-check text-emerald-500 mr-2"></i>Durum & Tarih</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Durum</label>
              <div class="mt-1">
                <span class="badge text-xs px-3 py-1.5" :class="getStatusClass(doc.status)">{{ getStatusLabel(doc.status) }}</span>
              </div>
            </div>
            <div>
              <label class="form-label">Hesaplama Tarihi</label>
              <input :value="formatDate(doc.calculation_date)" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Oluşturan</label>
              <input :value="doc.created_by || doc.owner" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Onaylayan</label>
              <input :value="doc.finalized_by || '-'" type="text" class="form-input" readonly>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Skorlar -->
      <div v-if="activeTab === 'scores'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-chart-radar text-blue-500 mr-2"></i>Kategori Skorları</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="cat in scoreCategories" :key="cat.field" class="score-card">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-gray-600">{{ cat.label }}</span>
                <span class="text-sm font-bold" :style="{ color: getScoreColor(doc[cat.field]) }">{{ formatScore(doc[cat.field]) }}</span>
              </div>
              <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: getScorePercent(doc[cat.field]) + '%', background: getScoreColor(doc[cat.field]) }"></div>
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-[10px] text-gray-400">Ağırlık: %{{ doc[cat.weightField] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Performans -->
      <div v-if="activeTab === 'performance'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-gauge-high text-amber-500 mr-2"></i>Performans Metrikleri</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="m in performanceMetrics" :key="m.field" class="perf-card">
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

        <!-- Ratings -->
        <div class="card">
          <h3 class="section-title"><i class="fas fa-star text-yellow-500 mr-2"></i>Değerlendirmeler</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">{{ doc.average_rating ? Number(doc.average_rating).toFixed(1) : '-' }}</p>
              <div class="flex items-center justify-center gap-0.5 mt-1">
                <i v-for="s in 5" :key="s" class="text-[10px]" :class="s <= Math.round(doc.average_rating || 0) ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-500 dark:text-gray-300'"></i>
              </div>
              <p class="text-[10px] text-gray-400 mt-1">Ort. Puan</p>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-xl">
              <p class="text-xl font-black text-emerald-600">{{ doc.positive_rating_count || 0 }}</p>
              <p class="text-[10px] text-gray-500">Olumlu (4-5 ★)</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-600">{{ doc.neutral_rating_count || 0 }}</p>
              <p class="text-[10px] text-gray-500">Nötr (3 ★)</p>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-xl">
              <p class="text-xl font-black text-red-600">{{ doc.negative_rating_count || 0 }}</p>
              <p class="text-[10px] text-gray-500">Olumsuz (1-2 ★)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Ceza & Bonus -->
      <div v-if="activeTab === 'adjustments'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-scale-balanced text-red-500 mr-2"></i>Ceza & Bonus</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div class="p-4 bg-red-50 rounded-xl border border-red-100">
              <p class="text-[10px] uppercase tracking-wider font-semibold text-red-400 mb-2">Ceza</p>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Ceza Puanı</p>
                  <p class="text-lg font-bold text-red-600">{{ doc.penalty_points || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Ceza Kesintisi</p>
                  <p class="text-lg font-bold text-red-600">{{ doc.penalty_deduction || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Politika İhlali</p>
                  <p class="text-lg font-bold text-red-600">{{ doc.policy_violations || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Geç Kargolar</p>
                  <p class="text-lg font-bold text-red-600">{{ doc.late_shipments || 0 }}</p>
                </div>
              </div>
            </div>
            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p class="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 mb-2">Bonus</p>
              <div>
                <p class="text-xs text-gray-500 mb-1">Bonus Puanı</p>
                <p class="text-xl font-bold text-emerald-600">{{ doc.bonus_points || 0 }}</p>
              </div>
              <div class="mt-3">
                <p class="text-xs text-gray-500 mb-1">Bonus Nedeni</p>
                <p class="text-xs text-gray-700">{{ doc.bonus_reason || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notlar -->
        <div class="card">
          <h3 class="section-title"><i class="fas fa-note-sticky text-gray-500 mr-2"></i>Hesaplama Notları</h3>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg min-h-[80px]">
            <p class="text-xs text-gray-600 whitespace-pre-wrap">{{ doc.calculation_notes || 'Not eklenmemiş.' }}</p>
          </div>
          <div class="mt-4" v-if="doc.manual_adjustments">
            <label class="form-label">Manuel Düzeltmeler</label>
            <p class="text-xs text-gray-600 mt-1">{{ doc.manual_adjustments }}</p>
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
  { key: 'scores', label: 'Skorlar', icon: 'fas fa-chart-radar' },
  { key: 'performance', label: 'Performans', icon: 'fas fa-gauge-high' },
  { key: 'adjustments', label: 'Ceza & Bonus', icon: 'fas fa-scale-balanced' },
]

const workflowSteps = [
  { value: 'Draft', label: 'Taslak' },
  { value: 'Calculating', label: 'Hesaplama' },
  { value: 'Pending Review', label: 'İnceleme' },
  { value: 'Finalized', label: 'Onaylandı' },
  { value: 'Revised', label: 'Revize' },
]

const currentStepIndex = computed(() => {
  const status = doc.value.status
  const idx = workflowSteps.findIndex(s => s.value === status)
  return idx >= 0 ? idx : -1
})

const scoreCategories = [
  { field: 'delivery_score', label: 'Teslimat', weightField: 'delivery_weight' },
  { field: 'quality_score', label: 'Kalite', weightField: 'quality_weight' },
  { field: 'service_score', label: 'Hizmet', weightField: 'service_weight' },
  { field: 'compliance_score', label: 'Uyumluluk', weightField: 'compliance_weight' },
  { field: 'engagement_score', label: 'Etkileşim', weightField: 'engagement_weight' },
  { field: 'fulfillment_weight', label: 'Karşılama', weightField: 'fulfillment_weight' },
]

const performanceMetrics = [
  { field: 'fulfillment_rate', label: 'Karşılama Oranı', icon: 'fas fa-box-check', color: '#10b981', format: 'percent' },
  { field: 'on_time_rate', label: 'Zamanında Teslimat', icon: 'fas fa-truck-fast', color: '#3b82f6', format: 'percent' },
  { field: 'return_rate', label: 'İade Oranı', icon: 'fas fa-rotate-left', color: '#ef4444', format: 'percent' },
  { field: 'cancellation_rate', label: 'İptal Oranı', icon: 'fas fa-ban', color: '#f59e0b', format: 'percent' },
  { field: 'complaint_rate', label: 'Şikayet Oranı', icon: 'fas fa-comment-exclamation', color: '#ef4444', format: 'percent' },
  { field: 'response_time_avg', label: 'Ort. Yanıt Süresi (saat)', icon: 'fas fa-clock', color: '#6366f1', format: 'number' },
  { field: 'orders_evaluated', label: 'Değerlendirilen Sipariş', icon: 'fas fa-clipboard-list', color: '#8b5cf6', format: 'number' },
  { field: 'period_sales_count', label: 'Dönem Satış Adedi', icon: 'fas fa-cart-shopping', color: '#0ea5e9', format: 'number' },
  { field: 'period_sales_amount', label: 'Dönem Satış Tutarı', icon: 'fas fa-coins', color: '#10b981', format: 'currency' },
  { field: 'conversion_rate', label: 'Dönüşüm Oranı', icon: 'fas fa-bullseye', color: '#ec4899', format: 'percent' },
  { field: 'repeat_customer_rate', label: 'Tekrar Müşteri', icon: 'fas fa-users', color: '#14b8a6', format: 'percent' },
  { field: 'avg_order_value', label: 'Ort. Sipariş Değeri', icon: 'fas fa-receipt', color: '#f97316', format: 'currency' },
]

function isStepDone(i) { return i < currentStepIndex.value }

function getStepClass(step, i) {
  if (i === currentStepIndex.value) return 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-200'
  if (i < currentStepIndex.value) return 'bg-violet-100 border-violet-400 text-violet-600'
  return 'bg-white border-gray-200 text-gray-400'
}

function goBack() {
  router.push('/app/seller-score-list')
}

async function loadDoc() {
  loading.value = true
  try {
    const res = await api.getDoc('Seller Score', docName.value)
    doc.value = res.data || {}
  } catch {
    doc.value = { name: docName.value }
  } finally {
    loading.value = false
  }
}

function formatScore(val) {
  if (val == null) return '-'
  return Number(val).toFixed(2).replace(/\.?0+$/, '')
}

function getScoreColor(score) {
  if (score >= 4000) return '#10b981'
  if (score >= 3000) return '#3b82f6'
  if (score >= 2000) return '#f59e0b'
  return '#ef4444'
}

function getScorePercent(score) {
  return Math.min(100, ((score || 0) / 10000) * 100)
}

function getStatusClass(status) {
  const map = {
    Draft: 'bg-gray-100 text-gray-600', Calculating: 'bg-blue-50 text-blue-600',
    'Pending Review': 'bg-amber-50 text-amber-600', Finalized: 'bg-emerald-50 text-emerald-600',
    Revised: 'bg-purple-50 text-purple-600', Appealed: 'bg-red-50 text-red-600',
  }
  return map[status] || 'bg-gray-50 text-gray-500'
}

function getStatusDot(status) {
  const map = {
    Draft: 'bg-gray-400', Calculating: 'bg-blue-400', 'Pending Review': 'bg-amber-400',
    Finalized: 'bg-emerald-400', Revised: 'bg-purple-400', Appealed: 'bg-red-400',
  }
  return map[status] || 'bg-gray-400'
}

function getStatusLabel(status) {
  const map = {
    Draft: 'Taslak', Calculating: 'Hesaplanıyor', 'Pending Review': 'İncelemede',
    Finalized: 'Onaylandı', Revised: 'Revize', Appealed: 'İtiraz',
  }
  return map[status] || status || '-'
}

function formatDate(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('tr-TR')
}

function formatCurrency(val) {
  if (val == null) return '-'
  return Number(val).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
}

watch(() => route.params.name, loadDoc)
onMounted(loadDoc)
</script>

<style scoped>
/* Stepper */
.stepper-container {
  display: flex;
  align-items: flex-start;
}
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}
.stepper-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid;
  transition: all 0.2s;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.stepper-line {
  position: absolute;
  top: 15px;
  height: 2px;
  z-index: 1;
  right: calc(50% + 18px);
  left: calc(-50% + 18px);
}
.stepper-label {
  font-size: 10px;
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
}
.detail-tab {
  font-size: 12px;
  font-weight: 500;
  padding: 10px 16px;
  color: #9ca3af;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
}
.detail-tab:hover { color: #6b7280; }
.detail-tab.active {
  color: #7c3aed;
  border-bottom-color: #7c3aed;
  font-weight: 600;
}
.score-card, .perf-card {
  padding: 14px;
  background: var(--th-surface-elevated, #f9fafb);
  border-radius: 12px;
  border: 1px solid var(--th-surface-border, #f3f4f6);
}
</style>
