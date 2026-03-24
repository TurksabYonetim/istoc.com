<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0"><AppIcon name="arrow-left" :size="14" /></button>
        <span class="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10 px-2.5 py-1 rounded-md">{{ doc.template_code || docName }}</span>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{{ doc.template_name || doc.name || 'KPI Şablonu' }}</h1>
      </div>
      <span class="tpl-status-badge" :class="getTplStatusCls(doc.status)">
        <span class="tpl-dot"></span>{{ getTplStatusLabel(doc.status) }}
      </span>
    </div>

    <div v-if="loading" class="card text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-violet-500"></i></div>

    <template v-else>
      <!-- Quick Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-violet-600">{{ doc.weight || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Ağırlık</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-blue-600">{{ doc.passing_score || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Geçme Puanı</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ doc.total_weight || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Toplam Ağırlık</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-amber-600">{{ doc.usage_count || 0 }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Kullanım</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-2xl font-black text-purple-600">{{ (doc.average_score || 0).toFixed(1) }}</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Ort. Skor</p>
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
            <div><label class="form-label">Şablon Adı</label><input :value="doc.template_name || doc.name" class="form-input" readonly></div>
            <div><label class="form-label">Şablon Kodu</label><input :value="doc.template_code || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Hedef Tipi</label><input :value="doc.target_type || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Durum</label>
              <div class="mt-1"><span class="tpl-status-badge" :class="getTplStatusCls(doc.status)"><span class="tpl-dot"></span>{{ getTplStatusLabel(doc.status) }}</span></div>
            </div>
            <div><label class="form-label">Versiyon</label><input :value="doc.version || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Varsayılan mı?</label><input :value="doc.is_default ? 'Evet' : 'Hayır'" class="form-input" readonly></div>
          </div>
        </div>
        <div class="card">
          <h3 class="section-title"><i class="fas fa-sliders text-blue-500 mr-2"></i>Değerlendirme Ayarları</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Değerlendirme Dönemi</label><input :value="getPeriodLabel(doc.evaluation_period)" class="form-input" readonly></div>
            <div><label class="form-label">Değerlendirme Sıklığı</label><input :value="getFreqLabel(doc.evaluation_frequency)" class="form-input" readonly></div>
            <div><label class="form-label">Min. Sipariş</label><input :value="doc.min_orders_required || 0" class="form-input" readonly></div>
            <div><label class="form-label">Min. Aktif Gün</label><input :value="doc.min_days_active || 0" class="form-input" readonly></div>
            <div><label class="form-label">Puanlama Eğrisi</label><input :value="doc.scoring_curve || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Otomatik Değerlendirme</label><input :value="doc.auto_evaluate ? 'Evet' : 'Hayır'" class="form-input" readonly></div>
          </div>
        </div>
      </div>

      <!-- Tab: Bildirimler -->
      <div v-if="activeTab === 'notifications'">
        <div class="card">
          <h3 class="section-title"><i class="fas fa-bell text-amber-500 mr-2"></i>Bildirim Ayarları</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div><label class="form-label">Değerlendirmede Bildir</label><input :value="doc.notify_on_evaluation ? 'Evet' : 'Hayır'" class="form-input" readonly></div>
            <div><label class="form-label">Eşik Aşımında Bildir</label><input :value="doc.notify_on_threshold_breach ? 'Evet' : 'Hayır'" class="form-input" readonly></div>
            <div><label class="form-label">Bildirim Alıcıları</label><input :value="doc.notification_recipients || '-'" class="form-input" readonly></div>
            <div><label class="form-label">Son Değerlendirme</label><input :value="formatDateTime(doc.last_evaluated_at)" class="form-input" readonly></div>
          </div>
        </div>
      </div>

      <!-- Tab: Açıklama -->
      <div v-if="activeTab === 'description'">
        <div class="card">
          <h3 class="section-title"><i class="fas fa-note-sticky text-gray-500 mr-2"></i>Açıklama</h3>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg min-h-[80px]">
            <p class="text-xs text-gray-600 whitespace-pre-wrap">{{ doc.description || 'Açıklama eklenmemiş.' }}</p>
          </div>
          <div class="mt-4" v-if="doc.applicable_levels">
            <label class="form-label">Uygulanabilir Seviyeler</label>
            <p class="text-xs text-gray-600 mt-1">{{ doc.applicable_levels }}</p>
          </div>
          <div class="mt-4" v-if="doc.applicable_categories">
            <label class="form-label">Uygulanabilir Kategoriler</label>
            <p class="text-xs text-gray-600 mt-1">{{ doc.applicable_categories }}</p>
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
  { key: 'notifications', label: 'Bildirimler', icon: 'fas fa-bell' },
  { key: 'description', label: 'Açıklama', icon: 'fas fa-note-sticky' },
]

function goBack() { router.push('/app/kpi-template-list') }

async function loadDoc() {
  loading.value = true
  try { const res = await api.getDoc('KPI Template', docName.value); doc.value = res.data || {} }
  catch { doc.value = { name: docName.value } }
  finally { loading.value = false }
}

function getTplStatusCls(s) { return { Active: 'tpl-active', Inactive: 'tpl-inactive', Deprecated: 'tpl-deprecated' }[s] || 'tpl-inactive' }
function getTplStatusLabel(s) { return { Active: 'Aktif', Inactive: 'Pasif', Deprecated: 'Kullanım Dışı' }[s] || s || '-' }
function getPeriodLabel(p) { return { Daily: 'Günlük', Weekly: 'Haftalık', Monthly: 'Aylık', Quarterly: 'Çeyreklik', Yearly: 'Yıllık' }[p] || p || '-' }
function getFreqLabel(f) { return { Daily: 'Günlük', Weekly: 'Haftalık', Monthly: 'Aylık', Quarterly: 'Çeyreklik' }[f] || f || '-' }
function formatDateTime(dt) { if (!dt) return '-'; return new Date(dt).toLocaleString('tr-TR') }

watch(() => route.params.name, loadDoc)
onMounted(loadDoc)
</script>

<style scoped>
.section-title { font-size: 12px; font-weight: 700; color: #1f2937; display: flex; align-items: center; }
.detail-tab { font-size: 12px; font-weight: 500; padding: 10px 16px; color: #9ca3af; border-bottom: 2px solid transparent; transition: all 0.2s; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; }
.detail-tab:hover { color: #6b7280; }
.detail-tab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 600; }
.tpl-status-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 6px; white-space: nowrap; }
.tpl-status-badge .tpl-dot { width: 7px; height: 7px; border-radius: 50%; margin-right: 6px; flex-shrink: 0; }
.tpl-active { background: var(--th-kpi-active-bg); color: var(--th-kpi-active-fg); }
.tpl-active .tpl-dot { background: var(--th-kpi-active-dot); }
.tpl-inactive { background: var(--th-kpi-draft-bg); color: var(--th-kpi-draft-fg); }
.tpl-inactive .tpl-dot { background: var(--th-kpi-draft-dot); }
.tpl-deprecated { background: var(--th-kpi-critical-bg); color: var(--th-kpi-critical-fg); }
.tpl-deprecated .tpl-dot { background: var(--th-kpi-critical-dot); }
</style>
