<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">Seller KPI</h1>
        <p class="text-xs text-gray-400">{{ totalCount }} kayıt bulundu</p>
      </div>
      <div class="flex items-center gap-2">
        <ViewModeToggle v-model="viewMode" />
        <button class="hdr-btn-outlined" @click="loadData()"><AppIcon name="refresh-cw" :size="14" /><span>Yenile</span></button>
        <button class="hdr-btn-primary"><AppIcon name="plus" :size="14" /><span>Yeni Ekle</span></button>
      </div>
    </div>

    <!-- Status Filter Tabs -->
    <div class="flex items-center gap-2 flex-wrap mb-4">
      <button
        v-for="s in statusFilters"
        :key="s.value"
        class="status-pill"
        :class="{ active: activeStatus === s.value }"
        @click="activeStatus = s.value; currentPage = 1; loadData()"
      >
        <span class="w-2 h-2 rounded-full mr-2" :class="s.dot"></span>
        {{ s.label }}
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="card mb-5 !p-3">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative flex-1 min-w-0">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="KPI ara..."
            class="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-100 dark:placeholder:text-gray-500"
          >
        </div>
        <select v-model="categoryFilter" class="form-input-sm w-auto" @change="currentPage = 1; loadData()">
          <option value="">Tüm Kategoriler</option>
          <option v-for="c in categories" :key="c" :value="c">{{ getCategoryLabel(c) }}</option>
        </select>
        <select v-model="sortBy" class="form-input-sm w-auto" @change="currentPage = 1; loadData()">
          <option value="modified desc">Son Düzenlenen</option>
          <option value="percentage_of_target desc">En Yüksek Yüzde</option>
          <option value="percentage_of_target asc">En Düşük Yüzde</option>
          <option value="actual_value desc">En Yüksek Değer</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="card text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
        <AppIcon name="inbox" :size="24" class="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-sm font-bold text-gray-700 mb-1">Henüz kayıt yok</h3>
      <p class="text-xs text-gray-400">Bu filtrelere uygun KPI kaydı bulunamadı</p>
    </div>

    <!-- Rich Table -->
    <div v-else class="card p-0 overflow-hidden">
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="tbl-th">SATICI</th>
              <th class="tbl-th">KPI TİPİ</th>
              <th class="tbl-th">KATEGORİ</th>
              <th class="tbl-th">DURUM</th>
              <th class="tbl-th text-center">HEDEF</th>
              <th class="tbl-th text-center">GERÇEK</th>
              <th class="tbl-th text-center">% BAŞARI</th>
              <th class="tbl-th text-center">TREND</th>
              <th class="tbl-th">DÖNEM</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.name"
              class="tbl-row border-b border-gray-50 cursor-pointer transition-colors hover:bg-violet-50/30"
              @click="$router.push(`/app/seller-kpi/${encodeURIComponent(item.name)}`)"
            >
              <td class="tbl-td">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" :class="getSellerColor(item.seller)">
                    {{ (item.seller || '?')[0] }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold truncate">{{ item.seller }}</p>
                    <p class="text-[10px] text-gray-400 truncate">{{ item.period_label || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="tbl-td">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-300 truncate block max-w-[160px]">{{ item.kpi_type }}</span>
              </td>
              <td class="tbl-td">
                <span class="cat-badge" :class="'cat-' + (item.kpi_category || '').toLowerCase()">
                  {{ getCategoryLabel(item.kpi_category) }}
                </span>
              </td>
              <td class="tbl-td">
                <span class="kpi-status-badge" :class="getKpiStatusCls(item.status)">
                  <span class="kst-dot"></span>
                  {{ getKpiStatusLabel(item.status) }}
                </span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-semibold text-gray-400">{{ formatVal(item.target_value) }}</span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ formatVal(item.actual_value) }}</span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-bold px-2 py-0.5 rounded" :style="{ color: getPctColor(item.percentage_of_target) }">
                  %{{ (item.percentage_of_target || 0).toFixed(1) }}
                </span>
              </td>
              <td class="tbl-td text-center">
                <span class="trend-badge" :class="'trend-' + (item.value_trend || 'new').toLowerCase()">
                  <AppIcon :name="getTrendIcon(item.value_trend)" :size="10" class="mr-0.5" />
                  {{ getTrendLabel(item.value_trend) }}
                </span>
              </td>
              <td class="tbl-td">
                <span class="text-[10px] text-gray-500">{{ item.period_type }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- LIST VIEW -->
      <div v-else-if="viewMode === 'list'">
        <div v-for="item in items" :key="item.name" class="list-compact-item" @click="$router.push(`/app/seller-kpi/${encodeURIComponent(item.name)}`)">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" :class="getSellerColor(item.seller)">{{ (item.seller || '?')[0] }}</div>
          <span class="list-compact-name">{{ item.seller }} — {{ item.kpi_type }}</span>
          <span class="kpi-status-badge" :class="getKpiStatusCls(item.status)"><span class="kst-dot"></span>{{ getKpiStatusLabel(item.status) }}</span>
          <span class="text-xs font-bold flex-shrink-0" :style="{ color: getPctColor(item.percentage_of_target) }">%{{ (item.percentage_of_target || 0).toFixed(1) }}</span>
          <span class="list-compact-date">{{ item.period_type }}</span>
        </div>
      </div>

      <!-- GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="list-grid">
        <div v-for="item in items" :key="item.name" class="list-grid-card" @click="$router.push(`/app/seller-kpi/${encodeURIComponent(item.name)}`)">
          <div class="flex items-center justify-between mb-3">
            <span class="list-grid-card-title">{{ item.seller }}</span>
            <span class="kpi-status-badge text-[10px]" :class="getKpiStatusCls(item.status)"><span class="kst-dot"></span>{{ getKpiStatusLabel(item.status) }}</span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ item.kpi_type }}</div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400">Hedef: {{ formatVal(item.target_value) }}</span>
            <span class="text-sm font-bold" :style="{ color: getPctColor(item.percentage_of_target) }">%{{ (item.percentage_of_target || 0).toFixed(1) }}</span>
          </div>
          <div class="list-grid-card-meta mt-2">
            <span>{{ getCategoryLabel(item.kpi_category) }}</span>
            <span>{{ item.period_type }}</span>
          </div>
        </div>
      </div>

      <!-- KANBAN VIEW -->
      <div v-else-if="viewMode === 'kanban'" class="list-kanban">
        <div v-for="col in kanbanColumns" :key="col.status" class="kanban-col">
          <div class="kanban-col-header" :style="{ borderColor: col.color }">
            <span>{{ col.label }}</span>
            <span class="kanban-col-count">{{ col.items.length }}</span>
          </div>
          <div class="kanban-col-body">
            <div v-for="item in col.items" :key="item.name" class="kanban-card" @click="$router.push(`/app/seller-kpi/${encodeURIComponent(item.name)}`)">
              <div class="kanban-card-title">{{ item.seller }}</div>
              <div class="kanban-card-meta">{{ item.kpi_type }} · %{{ (item.percentage_of_target || 0).toFixed(1) }}</div>
            </div>
            <div v-if="col.items.length === 0" class="text-center py-6 text-xs text-gray-400 dark:text-gray-500">Kayıt yok</div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ListPagination v-model="currentPage" :total="totalCount" :page-size="pageSize" @update:model-value="loadData()" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import ViewModeToggle from '@/components/common/ViewModeToggle.vue'

const items = ref([])
const totalCount = ref(0)
const loading = ref(false)
const searchQuery = ref('')
const activeStatus = ref('')
const categoryFilter = ref('')
const sortBy = ref('modified desc')
const currentPage = ref(1)
const pageSize = 12
const viewMode = ref('table')

const kanbanColumns = computed(() => {
  const cols = [
    { status: 'Draft', label: 'Taslak', color: '#9ca3af', items: [] },
    { status: 'Active', label: 'Aktif', color: '#3b82f6', items: [] },
    { status: 'On Track', label: 'Yolunda', color: '#10b981', items: [] },
    { status: 'At Risk', label: 'Riskli', color: '#f59e0b', items: [] },
    { status: 'Below Target', label: 'Hedef Altı', color: '#f97316', items: [] },
    { status: 'Critical', label: 'Kritik', color: '#ef4444', items: [] },
    { status: 'Exceeding', label: 'Aşıyor', color: '#22c55e', items: [] },
  ]
  for (const item of items.value) {
    const col = cols.find(c => c.status === item.status)
    if (col) col.items.push(item)
    else cols[0].items.push(item)
  }
  return cols
})

const statusFilters = [
  { value: '', label: 'Tümü', dot: 'bg-violet-400' },
  { value: 'Draft', label: 'Taslak', dot: 'bg-gray-400' },
  { value: 'Active', label: 'Aktif', dot: 'bg-blue-400' },
  { value: 'On Track', label: 'Yolunda', dot: 'bg-emerald-400' },
  { value: 'At Risk', label: 'Riskli', dot: 'bg-amber-400' },
  { value: 'Below Target', label: 'Hedef Altı', dot: 'bg-orange-400' },
  { value: 'Critical', label: 'Kritik', dot: 'bg-red-400' },
  { value: 'Exceeding', label: 'Aşıyor', dot: 'bg-green-400' },
  { value: 'Paused', label: 'Duraklatıldı', dot: 'bg-gray-400' },
  { value: 'Expired', label: 'Süresi Doldu', dot: 'bg-gray-500' },
]

const categories = ['Fulfillment', 'Delivery', 'Quality', 'Service', 'Compliance', 'Engagement', 'Financial']

const listFields = [
  'name', 'seller', 'kpi_type', 'kpi_category', 'status',
  'period_type', 'period_label', 'target_value', 'actual_value',
  'percentage_of_target', 'value_trend', 'modified',
]

async function loadData() {
  loading.value = true
  try {
    const filters = []
    if (activeStatus.value) filters.push(['status', '=', activeStatus.value])
    if (categoryFilter.value) filters.push(['kpi_category', '=', categoryFilter.value])
    if (searchQuery.value) filters.push(['name', 'like', `%${searchQuery.value}%`])

    const res = await api.getList('Seller KPI', {
      fields: listFields,
      filters,
      order_by: sortBy.value,
      limit_start: (currentPage.value - 1) * pageSize,
      limit_page_length: pageSize,
    })
    items.value = res.data || []

    const countRes = await api.getCount('Seller KPI', filters)
    totalCount.value = countRes.message || 0
  } catch {
    items.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

function formatVal(v) {
  if (v == null) return '-'
  return Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 2 })
}

function getPctColor(pct) {
  if (pct >= 90) return '#10b981'
  if (pct >= 70) return '#3b82f6'
  if (pct >= 50) return '#f59e0b'
  return '#ef4444'
}

function getSellerColor(seller) {
  const c = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500']
  return c[(seller || '').charCodeAt((seller || '').length - 1 || 0) % c.length]
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

function getTrendIcon(t) {
  return { Improving: 'trending-up', Stable: 'minus', Declining: 'trending-down', Volatile: 'activity', New: 'sparkles' }[t] || 'minus'
}

function getTrendLabel(t) {
  const m = { Improving: 'Yükseliş', Stable: 'Sabit', Declining: 'Düşüş', Volatile: 'Değişken', New: 'Yeni' }
  return m[t] || t || '-'
}

let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; loadData() }, 400)
})

onMounted(loadData)
</script>

<style scoped>
/* Status filter pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--th-surface-card, #1e1e2e);
  color: var(--th-text-secondary, #9ca3af);
  border: 1px solid var(--th-surface-border, #2d2d3d);
}
.status-pill:hover {
  border-color: #a78bfa;
  color: #c4b5fd;
}
.status-pill.active {
  background: #7c3aed;
  color: white;
  border-color: #7c3aed;
}

/* Category badges — global vars */
.cat-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}
.cat-fulfillment { background: var(--th-cat-fulfillment-bg); color: var(--th-cat-fulfillment-fg); }
.cat-delivery    { background: var(--th-cat-delivery-bg);    color: var(--th-cat-delivery-fg); }
.cat-quality     { background: var(--th-cat-quality-bg);     color: var(--th-cat-quality-fg); }
.cat-service     { background: var(--th-cat-service-bg);     color: var(--th-cat-service-fg); }
.cat-compliance  { background: var(--th-cat-compliance-bg);  color: var(--th-cat-compliance-fg); }
.cat-engagement  { background: var(--th-cat-engagement-bg);  color: var(--th-cat-engagement-fg); }
.cat-financial   { background: var(--th-cat-financial-bg);   color: var(--th-cat-financial-fg); }

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

/* Trend badges */
.trend-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  white-space: nowrap;
}
.trend-improving { background: var(--th-kpi-ontrack-bg); color: var(--th-kpi-ontrack-fg); }
.trend-stable    { background: var(--th-kpi-active-bg);  color: var(--th-kpi-active-fg); }
.trend-declining { background: var(--th-kpi-critical-bg); color: var(--th-kpi-critical-fg); }
.trend-volatile  { background: var(--th-kpi-atrisk-bg);  color: var(--th-kpi-atrisk-fg); }
.trend-new       { background: var(--th-kpi-calculated-bg); color: var(--th-kpi-calculated-fg); }
</style>
