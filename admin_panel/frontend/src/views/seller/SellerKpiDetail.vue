<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0">
          <AppIcon name="arrow-left" :size="14" />
        </button>
        <span class="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10 px-2.5 py-1 rounded-md">{{ docName }}</span>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{{ doc.kpi_type || 'Seller KPI' }}</h1>
      </div>
      <span class="kpi-status-badge" :class="getKpiStatusCls(doc.status)">
        <span class="kst-dot"></span>
        {{ getKpiStatusLabel(doc.status) }}
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
            <div
              v-if="i > 0"
              class="stepper-line"
              :class="i <= currentStepIndex ? 'bg-violet-500' : 'bg-gray-700'"
            ></div>
            <div
              class="stepper-circle"
              :class="getStepClass(step, i)"
            >
              <i v-if="isStepDone(i)" class="fas fa-check text-[10px]"></i>
              <span v-else class="text-[11px]">{{ i + 1 }}</span>
            </div>
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
          <p class="text-2xl font-black" :style="{ color: getPctColor(doc.percentage_of_target) }">%{{ formatScore(doc.percentage_of_target) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Başarı</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-blue-600">{{ formatVal(doc.target_value) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Hedef</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ formatVal(doc.actual_value) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Gerçek</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black" :class="getTrendColor(doc.value_trend)">{{ getTrendLabel(doc.value_trend) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Trend</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-purple-600">{{ doc.performance_grade || '-' }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Derece</p>
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
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-info-circle text-violet-500 mr-2"></i>Temel Bilgiler</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Satıcı *</label>
              <input :value="doc.seller" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">KPI Kodu</label>
              <input :value="doc.name" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">KPI Tipi</label>
              <input :value="doc.kpi_type" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">KPI Kategorisi</label>
              <input :value="getCategoryLabel(doc.kpi_category)" type="text" class="form-input" readonly>
            </div>
          </div>
        </div>

        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-calendar-check text-emerald-500 mr-2"></i>Dönem Bilgileri</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Dönem Tipi</label>
              <input :value="doc.period_type" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Dönem Etiketi</label>
              <input :value="doc.period_label || doc.evaluation_period || '-'" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Başlangıç</label>
              <input :value="formatDate(doc.period_start)" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Bitiş</label>
              <input :value="formatDate(doc.period_end)" type="text" class="form-input" readonly>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title"><i class="fas fa-clock text-amber-500 mr-2"></i>Durum & Zaman</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Durum</label>
              <div class="mt-1">
                <span class="kpi-status-badge" :class="getKpiStatusCls(doc.status)">
                  <span class="kst-dot"></span>
                  {{ getKpiStatusLabel(doc.status) }}
                </span>
              </div>
            </div>
            <div>
              <label class="form-label">Son Hesaplama</label>
              <input :value="formatDateTime(doc.last_calculated_at)" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Oluşturan</label>
              <input :value="doc.created_by || doc.owner" type="text" class="form-input" readonly>
            </div>
            <div>
              <label class="form-label">Hesaplama Yöntemi</label>
              <input :value="doc.calculation_method || '-'" type="text" class="form-input" readonly>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Hedef & Eşikler -->
      <div v-if="activeTab === 'targets'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-bullseye text-blue-500 mr-2"></i>Hedef & Gerçekleşme</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="m in targetMetrics" :key="m.field" class="score-card">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-gray-600">{{ m.label }}</span>
                <span class="text-sm font-bold" :style="{ color: m.color || '#6366f1' }">{{ formatVal(doc[m.field]) }}</span>
              </div>
              <div v-if="m.max" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: getBarPercent(doc[m.field], m.max) + '%', background: m.color || '#6366f1' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title"><i class="fas fa-sliders text-amber-500 mr-2"></i>Eşik Değerleri</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-3 bg-emerald-50 rounded-xl">
              <p class="text-xl font-black text-emerald-600">{{ formatVal(doc.minimum_threshold) }}</p>
              <p class="text-[10px] text-gray-500 mt-1">Min Eşik</p>
            </div>
            <div class="text-center p-3 bg-amber-50 rounded-xl">
              <p class="text-xl font-black text-amber-600">{{ formatVal(doc.warning_threshold) }}</p>
              <p class="text-[10px] text-gray-500 mt-1">Uyarı Eşiği</p>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-xl">
              <p class="text-xl font-black text-red-600">{{ formatVal(doc.critical_threshold) }}</p>
              <p class="text-[10px] text-gray-500 mt-1">Kritik Eşik</p>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-xl">
              <p class="text-xl font-black text-blue-600">{{ formatVal(doc.maximum_threshold) }}</p>
              <p class="text-[10px] text-gray-500 mt-1">Maks Eşik</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Kıyaslama -->
      <div v-if="activeTab === 'benchmark'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-ranking-star text-purple-500 mr-2"></i>Kıyaslama & Sıralama</h3>
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-users text-xs text-blue-500"></i>
                <span class="text-xs font-semibold text-gray-600">Emsal Ortalaması</span>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ formatVal(doc.peer_average) }}</p>
            </div>
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-trophy text-xs text-amber-500"></i>
                <span class="text-xs font-semibold text-gray-600">Emsal Sırası</span>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ doc.peer_rank || '-' }}</p>
            </div>
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-chart-bar text-xs text-violet-500"></i>
                <span class="text-xs font-semibold text-gray-600">Persentil</span>
              </div>
              <p class="text-lg font-bold text-gray-900">%{{ formatScore(doc.peer_percentile) }}</p>
            </div>
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-layer-group text-xs text-emerald-500"></i>
                <span class="text-xs font-semibold text-gray-600">Katman Ortalaması</span>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ formatVal(doc.tier_average) }}</p>
            </div>
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-tag text-xs text-cyan-500"></i>
                <span class="text-xs font-semibold text-gray-600">Kategori Ortalaması</span>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ formatVal(doc.category_average) }}</p>
            </div>
            <div class="perf-card">
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-globe text-xs text-rose-500"></i>
                <span class="text-xs font-semibold text-gray-600">Platform Ortalaması</span>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ formatVal(doc.platform_average) }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title"><i class="fas fa-chart-line text-gray-500 mr-2"></i>İstatistik</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">{{ doc.sample_size || 0 }}</p>
              <p class="text-[10px] text-gray-400 mt-1">Örneklem</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">{{ doc.data_points_count || 0 }}</p>
              <p class="text-[10px] text-gray-400 mt-1">Veri Noktası</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">%{{ formatScore(doc.confidence_level) }}</p>
              <p class="text-[10px] text-gray-400 mt-1">Güven Düzeyi</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-xl font-black text-gray-800">{{ formatVal(doc.standard_deviation) }}</p>
              <p class="text-[10px] text-gray-400 mt-1">Std. Sapma</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Aksiyonlar -->
      <div v-if="activeTab === 'actions'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-bell text-red-500 mr-2"></i>Uyarılar</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Uyarılar Aktif</p>
                  <p class="text-sm font-bold mt-1" :class="doc.alerts_enabled ? 'text-emerald-600' : 'text-gray-400'">{{ doc.alerts_enabled ? 'Evet' : 'Hayır' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Uyarı Sayısı</p>
                  <p class="text-sm font-bold text-gray-800 mt-1">{{ doc.alert_count || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Son Uyarı</p>
                  <p class="text-sm font-bold text-gray-800 mt-1">{{ formatDateTime(doc.last_alert_sent) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Hedef Altı Gün</p>
                  <p class="text-sm font-bold text-red-600 mt-1">{{ doc.days_below_target || 0 }}</p>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Riskli Gün</p>
                  <p class="text-sm font-bold text-amber-600 mt-1">{{ doc.days_at_risk || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Ardışık Düşük Dönem</p>
                  <p class="text-sm font-bold text-red-600 mt-1">{{ doc.consecutive_periods_below || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Skor Katkısı</p>
                  <p class="text-sm font-bold text-violet-600 mt-1">{{ formatVal(doc.score_contribution) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Sapma</p>
                  <p class="text-sm font-bold text-gray-800 mt-1">{{ formatVal(doc.deviation_from_target) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-clipboard-check text-blue-500 mr-2"></i>Aksiyon</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Aksiyon Gerekli</label>
              <div class="mt-1">
                <span class="text-sm font-bold" :class="doc.action_required ? 'text-red-600' : 'text-emerald-600'">{{ doc.action_required ? 'Evet' : 'Hayır' }}</span>
              </div>
            </div>
            <div>
              <label class="form-label">Son Tarih</label>
              <input :value="formatDate(doc.action_deadline)" type="text" class="form-input" readonly>
            </div>
            <div class="lg:col-span-2">
              <label class="form-label">Önerilen Aksiyon</label>
              <div class="p-3 bg-gray-50 rounded-lg min-h-[48px]">
                <p class="text-xs text-gray-600">{{ doc.recommended_action || '-' }}</p>
              </div>
            </div>
            <div class="lg:col-span-2">
              <label class="form-label">Alınan Aksiyon</label>
              <div class="p-3 bg-gray-50 rounded-lg min-h-[48px]">
                <p class="text-xs text-gray-600">{{ doc.action_taken || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title"><i class="fas fa-note-sticky text-gray-500 mr-2"></i>Notlar</h3>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg min-h-[80px]">
            <p class="text-xs text-gray-600 whitespace-pre-wrap">{{ doc.notes || 'Not eklenmemiş.' }}</p>
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
  { key: 'targets', label: 'Hedef & Eşik', icon: 'fas fa-bullseye' },
  { key: 'benchmark', label: 'Kıyaslama', icon: 'fas fa-ranking-star' },
  { key: 'actions', label: 'Aksiyonlar', icon: 'fas fa-clipboard-check' },
]

const workflowSteps = [
  { value: 'Draft', label: 'Taslak' },
  { value: 'Active', label: 'Aktif' },
  { value: 'On Track', label: 'Yolunda' },
  { value: 'Exceeding', label: 'Aşıyor' },
  { value: 'Calculated', label: 'Hesaplandı' },
]

const currentStepIndex = computed(() => {
  const status = doc.value.status
  const idx = workflowSteps.findIndex(s => s.value === status)
  return idx >= 0 ? idx : -1
})

const targetMetrics = [
  { field: 'target_value', label: 'Hedef Değer', color: '#3b82f6' },
  { field: 'actual_value', label: 'Gerçek Değer', color: '#10b981', max: 'target_value' },
  { field: 'previous_value', label: 'Önceki Değer', color: '#8b5cf6' },
  { field: 'value_change', label: 'Değişim', color: '#f59e0b' },
  { field: 'improvement_target', label: 'İyileştirme Hedefi', color: '#ec4899' },
  { field: 'score_contribution', label: 'Skor Katkısı', color: '#6366f1' },
]

function isStepDone(i) { return i < currentStepIndex.value }

function getStepClass(step, i) {
  if (i === currentStepIndex.value) return 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-200'
  if (i < currentStepIndex.value) return 'bg-violet-100 border-violet-400 text-violet-600'
  return 'bg-white border-gray-200 text-gray-400'
}

function goBack() {
  router.push('/app/seller-kpi-list')
}

async function loadDoc() {
  loading.value = true
  try {
    const res = await api.getDoc('Seller KPI', docName.value)
    doc.value = res.data || {}
  } catch {
    doc.value = { name: docName.value }
  } finally {
    loading.value = false
  }
}

function formatScore(val) {
  if (val == null) return '-'
  return Number(val).toFixed(1)
}

function formatVal(v) {
  if (v == null) return '-'
  return Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 2 })
}

function formatDate(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('tr-TR')
}

function formatDateTime(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleString('tr-TR')
}

function getPctColor(pct) {
  if (pct >= 90) return '#10b981'
  if (pct >= 70) return '#3b82f6'
  if (pct >= 50) return '#f59e0b'
  return '#ef4444'
}

function getTrendLabel(t) {
  const m = { Improving: 'Yükseliş', Stable: 'Sabit', Declining: 'Düşüş', Volatile: 'Değişken', New: 'Yeni' }
  return m[t] || t || '-'
}

function getTrendColor(t) {
  const m = { Improving: 'text-emerald-600', Stable: 'text-blue-600', Declining: 'text-red-600', Volatile: 'text-amber-600', New: 'text-purple-600' }
  return m[t] || 'text-gray-500'
}

function getCategoryLabel(cat) {
  const m = { Fulfillment: 'Karşılama', Delivery: 'Teslimat', Quality: 'Kalite', Service: 'Hizmet', Compliance: 'Uyumluluk', Engagement: 'Etkileşim', Financial: 'Finansal' }
  return m[cat] || cat || '-'
}

function getKpiStatusCls(st) {
  const m = {
    Draft: 'kst-draft', Active: 'kst-active', 'On Track': 'kst-ontrack',
    'At Risk': 'kst-atrisk', 'Below Target': 'kst-below', Critical: 'kst-critical',
    Exceeding: 'kst-exceeding', Paused: 'kst-paused', Expired: 'kst-expired', Calculated: 'kst-calculated',
  }
  return m[st] || 'kst-draft'
}

function getKpiStatusLabel(st) {
  const m = {
    Draft: 'Taslak', Active: 'Aktif', 'On Track': 'Yolunda', 'At Risk': 'Riskli',
    'Below Target': 'Hedef Altı', Critical: 'Kritik', Exceeding: 'Aşıyor',
    Paused: 'Duraklatıldı', Expired: 'Süresi Doldu', Calculated: 'Hesaplandı',
  }
  return m[st] || st || '-'
}

function getBarPercent(val, maxField) {
  const maxVal = doc.value[maxField] || 100
  return Math.min(100, ((val || 0) / maxVal) * 100)
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

/* KPI Status badges — global vars */
.kpi-status-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  white-space: nowrap;
}
.kpi-status-badge .kst-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}
.kst-draft          { background: var(--th-kpi-draft-bg);      color: var(--th-kpi-draft-fg); }
.kst-draft .kst-dot { background: var(--th-kpi-draft-dot); }
.kst-active          { background: var(--th-kpi-active-bg);    color: var(--th-kpi-active-fg); }
.kst-active .kst-dot { background: var(--th-kpi-active-dot); }
.kst-ontrack          { background: var(--th-kpi-ontrack-bg);  color: var(--th-kpi-ontrack-fg); }
.kst-ontrack .kst-dot { background: var(--th-kpi-ontrack-dot); }
.kst-atrisk          { background: var(--th-kpi-atrisk-bg);    color: var(--th-kpi-atrisk-fg); }
.kst-atrisk .kst-dot { background: var(--th-kpi-atrisk-dot); }
.kst-below          { background: var(--th-kpi-below-bg);      color: var(--th-kpi-below-fg); }
.kst-below .kst-dot { background: var(--th-kpi-below-dot); }
.kst-critical          { background: var(--th-kpi-critical-bg);  color: var(--th-kpi-critical-fg); }
.kst-critical .kst-dot { background: var(--th-kpi-critical-dot); }
.kst-exceeding          { background: var(--th-kpi-exceeding-bg); color: var(--th-kpi-exceeding-fg); }
.kst-exceeding .kst-dot { background: var(--th-kpi-exceeding-dot); }
.kst-paused          { background: var(--th-kpi-paused-bg);    color: var(--th-kpi-paused-fg); }
.kst-paused .kst-dot { background: var(--th-kpi-paused-dot); }
.kst-expired          { background: var(--th-kpi-expired-bg);  color: var(--th-kpi-expired-fg); }
.kst-expired .kst-dot { background: var(--th-kpi-expired-dot); }
.kst-calculated          { background: var(--th-kpi-calculated-bg); color: var(--th-kpi-calculated-fg); }
.kst-calculated .kst-dot { background: var(--th-kpi-calculated-dot); }
</style>
