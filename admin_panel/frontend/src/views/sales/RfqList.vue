<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">RFQ (Teklif Talepleri)</h1>
        <p class="text-xs text-gray-400">{{ totalCount }} kayıt bulundu</p>
      </div>
      <div class="flex items-center gap-2">
        <ViewModeToggle v-model="viewMode" />
        <button class="hdr-btn-outlined" @click="loadData()"><AppIcon name="refresh-cw" :size="14" /><span>Yenile</span></button>
        <button class="hdr-btn-primary"><AppIcon name="plus" :size="14" /><span>Yeni Ekle</span></button>
      </div>
    </div>

    <!-- Status Filter Pills -->
    <div class="flex items-center gap-2 flex-wrap mb-4">
      <button v-for="s in statusFilters" :key="s.value" class="status-pill" :class="{ active: activeStatus === s.value }" @click="activeStatus = s.value; currentPage = 1; loadData()">
        <span class="w-2 h-2 rounded-full mr-2" :class="s.dot"></span>{{ s.label }}
      </button>
    </div>

    <!-- Search & Sort -->
    <div class="card mb-5 !p-3">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative flex-1 min-w-0">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="RFQ ara..." class="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-100 dark:placeholder:text-gray-500">
        </div>
        <select v-model="sortBy" class="form-input-sm w-auto" @change="currentPage = 1; loadData()">
          <option value="modified desc">Son Düzenlenen</option>
          <option value="deadline desc">Son Tarih (Yeni)</option>
          <option value="budget_max desc">Bütçe (Yüksek)</option>
          <option value="quote_count desc">En Çok Teklif</option>
        </select>
      </div>
    </div>

    <!-- Loading / Empty -->
    <div v-if="loading" class="card text-center py-12"><AppIcon name="loader" :size="24" class="text-violet-500 animate-spin" /></div>
    <div v-else-if="items.length === 0" class="card text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center"><AppIcon name="inbox" :size="24" class="text-gray-400 dark:text-gray-500" /></div>
      <h3 class="text-sm font-bold text-gray-700 mb-1">Henüz kayıt yok</h3>
    </div>

    <!-- Table -->
    <div v-else class="card p-0 overflow-hidden">
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="tbl-th">RFQ</th>
              <th class="tbl-th">DURUM</th>
              <th class="tbl-th">ALICI</th>
              <th class="tbl-th text-center">MİKTAR</th>
              <th class="tbl-th text-center">BÜTÇE</th>
              <th class="tbl-th text-center">TEKLİF</th>
              <th class="tbl-th">SON TARİH</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.name"
              class="tbl-row border-b border-gray-50 cursor-pointer transition-colors hover:bg-violet-50/30"
              @click="$router.push(`/app/rfq/${encodeURIComponent(item.name)}`)"
            >
              <td class="tbl-td">
                <div class="min-w-0">
                  <p class="text-xs font-semibold truncate max-w-[200px]">{{ item.title || item.name }}</p>
                  <p class="text-[10px] text-gray-400 font-mono">{{ item.name }}</p>
                </div>
              </td>
              <td class="tbl-td">
                <span class="rfq-status-badge" :class="getRfqStatusCls(item.status)">
                  <span class="rfq-dot"></span>{{ getRfqStatusLabel(item.status) }}
                </span>
              </td>
              <td class="tbl-td">
                <span class="text-xs text-gray-500 dark:text-gray-300 truncate block max-w-[120px]">{{ item.buyer || '-' }}</span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-300">{{ item.quantity || 0 }} {{ item.unit || '' }}</span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-bold text-emerald-500">{{ formatBudget(item.budget_min, item.budget_max) }}</span>
              </td>
              <td class="tbl-td text-center">
                <span class="text-xs font-bold px-2 py-0.5 rounded" :class="item.quote_count > 0 ? 'text-violet-400 bg-violet-50' : 'text-gray-400'">{{ item.quote_count || 0 }}</span>
              </td>
              <td class="tbl-td">
                <span class="text-[10px] text-gray-500">{{ formatDate(item.deadline) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- LIST VIEW -->
      <div v-else-if="viewMode === 'list'">
        <div v-for="item in items" :key="item.name" class="list-compact-item" @click="$router.push(`/app/rfq/${encodeURIComponent(item.name)}`)">
          <span class="list-compact-name">{{ item.title || item.name }}</span>
          <span class="rfq-status-badge" :class="getRfqStatusCls(item.status)"><span class="rfq-dot"></span>{{ getRfqStatusLabel(item.status) }}</span>
          <span class="list-compact-date">{{ formatDate(item.deadline) }}</span>
        </div>
      </div>

      <!-- GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="list-grid">
        <div v-for="item in items" :key="item.name" class="list-grid-card" @click="$router.push(`/app/rfq/${encodeURIComponent(item.name)}`)">
          <div class="flex items-center justify-between mb-3">
            <span class="list-grid-card-title">{{ item.title || item.name }}</span>
            <span class="rfq-status-badge text-[10px]" :class="getRfqStatusCls(item.status)"><span class="rfq-dot"></span>{{ getRfqStatusLabel(item.status) }}</span>
          </div>
          <div class="list-grid-card-meta">
            <span>{{ item.buyer || '-' }}</span>
            <span>{{ formatBudget(item.budget_min, item.budget_max) }}</span>
            <span>{{ formatDate(item.deadline) }}</span>
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
            <div v-for="item in col.items" :key="item.name" class="kanban-card" @click="$router.push(`/app/rfq/${encodeURIComponent(item.name)}`)">
              <div class="kanban-card-title">{{ item.title || item.name }}</div>
              <div class="kanban-card-meta">{{ item.buyer || '-' }} · {{ formatDate(item.deadline) }}</div>
            </div>
            <div v-if="col.items.length === 0" class="text-center py-6 text-xs text-gray-400 dark:text-gray-500">Kayıt yok</div>
          </div>
        </div>
      </div>

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
const sortBy = ref('modified desc')
const currentPage = ref(1)
const pageSize = 12
const viewMode = ref('table')

const kanbanColumns = computed(() => {
  const cols = [
    { status: 'Draft', label: 'Taslak', color: '#9ca3af', items: [] },
    { status: 'Published', label: 'Yayında', color: '#3b82f6', items: [] },
    { status: 'Quoting', label: 'Teklif Alınıyor', color: '#06b6d4', items: [] },
    { status: 'Negotiation', label: 'Müzakere', color: '#f59e0b', items: [] },
    { status: 'Accepted', label: 'Kabul Edildi', color: '#10b981', items: [] },
    { status: 'Ordered', label: 'Sipariş Verildi', color: '#22c55e', items: [] },
    { status: 'Closed', label: 'Kapatıldı', color: '#6b7280', items: [] },
    { status: 'Cancelled', label: 'İptal', color: '#ef4444', items: [] },
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
  { value: 'Published', label: 'Yayında', dot: 'bg-blue-400' },
  { value: 'Quoting', label: 'Teklif Alınıyor', dot: 'bg-cyan-400' },
  { value: 'Negotiation', label: 'Müzakere', dot: 'bg-amber-400' },
  { value: 'Accepted', label: 'Kabul Edildi', dot: 'bg-emerald-400' },
  { value: 'Ordered', label: 'Sipariş Verildi', dot: 'bg-green-500' },
  { value: 'Closed', label: 'Kapatıldı', dot: 'bg-gray-500' },
  { value: 'Cancelled', label: 'İptal', dot: 'bg-red-400' },
]

const listFields = ['name','title','status','buyer','buyer_name','budget_min','budget_max','currency','deadline','quantity','unit','quote_count','modified']

async function loadData() {
  loading.value = true
  try {
    const filters = []
    if (activeStatus.value) filters.push(['status', '=', activeStatus.value])
    if (searchQuery.value) filters.push(['name', 'like', `%${searchQuery.value}%`])
    const res = await api.getList('RFQ', { fields: listFields, filters, order_by: sortBy.value, limit_start: (currentPage.value - 1) * pageSize, limit_page_length: pageSize })
    items.value = res.data || []
    const c = await api.getCount('RFQ', filters)
    totalCount.value = c.message || 0
  } catch { items.value = []; totalCount.value = 0 } finally { loading.value = false }
}

function getRfqStatusCls(s) {
  return { Draft: 'rfq-draft', Published: 'rfq-published', Quoting: 'rfq-quoting', Negotiation: 'rfq-negotiation', Accepted: 'rfq-accepted', Ordered: 'rfq-ordered', Closed: 'rfq-closed', Cancelled: 'rfq-cancelled' }[s] || 'rfq-draft'
}
function getRfqStatusLabel(s) {
  return { Draft: 'Taslak', Published: 'Yayında', Quoting: 'Teklif Alınıyor', Negotiation: 'Müzakere', Accepted: 'Kabul Edildi', Ordered: 'Sipariş Verildi', Closed: 'Kapatıldı', Cancelled: 'İptal' }[s] || s || '-'
}
function formatBudget(min, max) {
  if (!min && !max) return '-'
  const fmt = v => Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
  if (min && max) return `₺${fmt(min)} - ₺${fmt(max)}`
  return `₺${fmt(min || max)}`
}
function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('tr-TR') }

let t; watch(searchQuery, () => { clearTimeout(t); t = setTimeout(() => { currentPage.value = 1; loadData() }, 400) })
onMounted(loadData)
</script>

<style scoped>
.status-pill { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s; background: var(--th-surface-card, #1e1e2e); color: var(--th-text-secondary, #9ca3af); border: 1px solid var(--th-surface-border, #2d2d3d); }
.status-pill:hover { border-color: #a78bfa; color: #c4b5fd; }
.status-pill.active { background: #7c3aed; color: white; border-color: #7c3aed; }

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
