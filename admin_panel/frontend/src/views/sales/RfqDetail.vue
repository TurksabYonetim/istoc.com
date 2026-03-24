<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0"><AppIcon name="arrow-left" :size="14" /></button>
        <span class="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10 px-2.5 py-1 rounded-md">{{ docName }}</span>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{{ doc.title || 'RFQ Detay' }}</h1>
      </div>
      <span class="rfq-status-badge" :class="getRfqStatusCls(doc.status)">
        <span class="rfq-dot"></span>{{ getRfqStatusLabel(doc.status) }}
      </span>
    </div>

    <div v-if="loading" class="card text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-violet-500"></i></div>

    <template v-else>
      <!-- Stepper -->
      <div class="card mb-5 !py-5 !px-8">
        <div class="stepper-container">
          <div v-for="(step, i) in workflowSteps" :key="step.value" class="stepper-step">
            <div v-if="i > 0" class="stepper-line" :class="i <= currentStepIndex ? 'bg-violet-500' : 'bg-gray-700'"></div>
            <div class="stepper-circle" :class="getStepClass(i)">
              <i v-if="i < currentStepIndex" class="fas fa-check text-[10px]"></i>
              <span v-else class="text-[11px]">{{ i + 1 }}</span>
            </div>
            <span class="stepper-label" :class="currentStepIndex >= i ? 'text-violet-400 font-semibold' : 'text-gray-500'">{{ step.label }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ formatBudget(doc.budget_min, doc.budget_max) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Bütçe</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-blue-600">{{ doc.quantity || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Miktar</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-violet-600">{{ doc.quote_count || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Teklif</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-amber-600">{{ formatDate(doc.deadline) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Son Tarih</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-gray-600">{{ doc.current_views || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Görüntülenme</p>
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
            <div><label class="form-label">RFQ Kodu</label><input :value="doc.name" class="form-input" readonly></div>
            <div><label class="form-label">Başlık</label><input :value="doc.title || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Alıcı</label><input :value="doc.buyer || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Alıcı Şirket</label><input :value="doc.buyer_company || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Kategori</label><input :value="doc.category || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Durum</label>
              <div class="mt-1"><span class="rfq-status-badge" :class="getRfqStatusCls(doc.status)"><span class="rfq-dot"></span>{{ getRfqStatusLabel(doc.status) }}</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="section-title"><i class="fas fa-align-left text-gray-500 mr-2"></i>Açıklama</h3>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg min-h-[60px]">
            <p class="text-xs text-gray-600 whitespace-pre-wrap">{{ doc.description || 'Açıklama eklenmemiş.' }}</p>
          </div>
        </div>
      </div>

      <!-- Tab: Şartlar -->
      <div v-if="activeTab === 'terms'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-coins text-emerald-500 mr-2"></i>Bütçe & Miktar</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Min. Bütçe</label><input :value="formatCurrency(doc.budget_min)" class="form-input" readonly></div>
            <div><label class="form-label">Maks. Bütçe</label><input :value="formatCurrency(doc.budget_max)" class="form-input" readonly></div>
            <div><label class="form-label">Miktar</label><input :value="(doc.quantity || 0) + ' ' + (doc.unit || doc.uom || '')" class="form-input" readonly></div>
            <div><label class="form-label">Para Birimi</label><input :value="doc.currency || 'TRY'" class="form-input" readonly></div>
          </div>
        </div>
        <div class="card">
          <h3 class="section-title"><i class="fas fa-calendar text-blue-500 mr-2"></i>Tarihler & Teslimat</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Son Tarih</label><input :value="formatDate(doc.deadline)" class="form-input" readonly></div>
            <div><label class="form-label">Teslim Tarihi</label><input :value="formatDate(doc.delivery_date)" class="form-input" readonly></div>
            <div><label class="form-label">Teslimat Konumu</label><input :value="doc.delivery_location || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Oluşturulma</label><input :value="formatDate(doc.created_date)" class="form-input" readonly></div>
          </div>
        </div>
      </div>

      <!-- Tab: Ayarlar -->
      <div v-if="activeTab === 'settings'">
        <div class="card mb-5">
          <h3 class="section-title"><i class="fas fa-cog text-gray-500 mr-2"></i>Teklif Ayarları</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="grid grid-cols-2 gap-3">
                <div><p class="text-xs text-gray-500">NDA Gerekli</p><p class="text-sm font-bold mt-1" :class="doc.requires_nda ? 'text-red-600' : 'text-emerald-600'">{{ doc.requires_nda ? 'Evet' : 'Hayır' }}</p></div>
                <div><p class="text-xs text-gray-500">Kısmi Teklif</p><p class="text-sm font-bold mt-1" :class="doc.allow_partial_quotes ? 'text-emerald-600' : 'text-gray-400'">{{ doc.allow_partial_quotes ? 'Evet' : 'Hayır' }}</p></div>
                <div><p class="text-xs text-gray-500">Tüm Kalemler Zorunlu</p><p class="text-sm font-bold mt-1" :class="doc.require_all_items ? 'text-red-600' : 'text-gray-400'">{{ doc.require_all_items ? 'Evet' : 'Hayır' }}</p></div>
                <div><p class="text-xs text-gray-500">Görüntüleme Limiti</p><p class="text-sm font-bold mt-1" :class="doc.is_view_limited ? 'text-amber-600' : 'text-gray-400'">{{ doc.is_view_limited ? 'Evet' : 'Hayır' }}</p></div>
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="grid grid-cols-2 gap-3">
                <div><p class="text-xs text-gray-500">Maks Görüntüleme</p><p class="text-sm font-bold text-gray-800 mt-1">{{ doc.max_views || '-' }}</p></div>
                <div><p class="text-xs text-gray-500">Kalan Görüntüleme</p><p class="text-sm font-bold text-gray-800 mt-1">{{ doc.views_remaining || '-' }}</p></div>
                <div><p class="text-xs text-gray-500">Teklif Sayısı</p><p class="text-sm font-bold text-violet-600 mt-1">{{ doc.quote_count || 0 }}</p></div>
                <div><p class="text-xs text-gray-500">Hedef Tip</p><p class="text-sm font-bold text-gray-800 mt-1">{{ doc.target_type || '-' }}</p></div>
              </div>
            </div>
          </div>
        </div>
        <div class="card" v-if="doc.closed_reason">
          <h3 class="section-title"><i class="fas fa-lock text-red-500 mr-2"></i>Kapatma Bilgileri</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Kapatma Tarihi</label><input :value="formatDate(doc.closed_at)" class="form-input" readonly></div>
            <div><label class="form-label">Kabul Edilen Teklif</label><input :value="doc.accepted_quote || '-'" class="form-input" readonly></div>
            <div class="lg:col-span-2"><label class="form-label">Kapatma Nedeni</label>
              <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xs text-gray-600">{{ doc.closed_reason }}</p></div>
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
  { key: 'terms', label: 'Şartlar', icon: 'fas fa-coins' },
  { key: 'settings', label: 'Ayarlar', icon: 'fas fa-cog' },
]

const workflowSteps = [
  { value: 'Draft', label: 'Taslak' },
  { value: 'Published', label: 'Yayında' },
  { value: 'Quoting', label: 'Teklif' },
  { value: 'Negotiation', label: 'Müzakere' },
  { value: 'Accepted', label: 'Kabul' },
]

const currentStepIndex = computed(() => {
  const idx = workflowSteps.findIndex(s => s.value === doc.value.status)
  return idx >= 0 ? idx : -1
})

function getStepClass(i) {
  if (i === currentStepIndex.value) return 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-200'
  if (i < currentStepIndex.value) return 'bg-violet-100 border-violet-400 text-violet-600'
  return 'bg-white border-gray-200 text-gray-400'
}

function goBack() { router.push('/app/rfq-list') }

async function loadDoc() {
  loading.value = true
  try { const res = await api.getDoc('RFQ', docName.value); doc.value = res.data || {} }
  catch { doc.value = { name: docName.value } }
  finally { loading.value = false }
}

function getRfqStatusCls(s) {
  return { Draft: 'rfq-draft', Published: 'rfq-published', Quoting: 'rfq-quoting', Negotiation: 'rfq-negotiation', Accepted: 'rfq-accepted', Ordered: 'rfq-ordered', Closed: 'rfq-closed', Cancelled: 'rfq-cancelled' }[s] || 'rfq-draft'
}
function getRfqStatusLabel(s) {
  return { Draft: 'Taslak', Published: 'Yayında', Quoting: 'Teklif Alınıyor', Negotiation: 'Müzakere', Accepted: 'Kabul Edildi', Ordered: 'Sipariş Verildi', Closed: 'Kapatıldı', Cancelled: 'İptal' }[s] || s || '-'
}
function formatBudget(min, max) {
  if (!min && !max) return '-'
  const f = v => Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
  if (min && max) return `₺${f(min)}-${f(max)}`
  return `₺${f(min || max)}`
}
function formatCurrency(v) { if (v == null) return '-'; return Number(v).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }) }
function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('tr-TR') }

watch(() => route.params.name, loadDoc)
onMounted(loadDoc)
</script>

<style scoped>
.stepper-container { display: flex; align-items: flex-start; }
.stepper-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.stepper-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; border: 2px solid; transition: all 0.2s; position: relative; z-index: 2; flex-shrink: 0; }
.stepper-line { position: absolute; top: 15px; height: 2px; z-index: 1; right: calc(50% + 18px); left: calc(-50% + 18px); }
.stepper-label { font-size: 10px; margin-top: 6px; text-align: center; white-space: nowrap; }
.section-title { font-size: 12px; font-weight: 700; color: #1f2937; display: flex; align-items: center; }
.detail-tab { font-size: 12px; font-weight: 500; padding: 10px 16px; color: #9ca3af; border-bottom: 2px solid transparent; transition: all 0.2s; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; }
.detail-tab:hover { color: #6b7280; }
.detail-tab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 600; }

.rfq-status-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 6px; white-space: nowrap; }
.rfq-status-badge .rfq-dot { width: 7px; height: 7px; border-radius: 50%; margin-right: 6px; flex-shrink: 0; }
.rfq-draft { background: var(--th-kpi-draft-bg); color: var(--th-kpi-draft-fg); }
.rfq-draft .rfq-dot { background: var(--th-kpi-draft-dot); }
.rfq-published { background: var(--th-kpi-active-bg); color: var(--th-kpi-active-fg); }
.rfq-published .rfq-dot { background: var(--th-kpi-active-dot); }
.rfq-quoting { background: var(--th-kpi-calculated-bg); color: var(--th-kpi-calculated-fg); }
.rfq-quoting .rfq-dot { background: var(--th-kpi-calculated-dot); }
.rfq-negotiation { background: var(--th-kpi-atrisk-bg); color: var(--th-kpi-atrisk-fg); }
.rfq-negotiation .rfq-dot { background: var(--th-kpi-atrisk-dot); }
.rfq-accepted { background: var(--th-kpi-ontrack-bg); color: var(--th-kpi-ontrack-fg); }
.rfq-accepted .rfq-dot { background: var(--th-kpi-ontrack-dot); }
.rfq-ordered { background: var(--th-kpi-exceeding-bg); color: var(--th-kpi-exceeding-fg); }
.rfq-ordered .rfq-dot { background: var(--th-kpi-exceeding-dot); }
.rfq-closed { background: var(--th-kpi-expired-bg); color: var(--th-kpi-expired-fg); }
.rfq-closed .rfq-dot { background: var(--th-kpi-expired-dot); }
.rfq-cancelled { background: var(--th-kpi-critical-bg); color: var(--th-kpi-critical-fg); }
.rfq-cancelled .rfq-dot { background: var(--th-kpi-critical-dot); }
</style>
