<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">{{ doctypeLabel }}</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ totalCount }} kayıt bulundu</p>
      </div>
      <div class="flex items-center gap-2">
        <ViewModeToggle v-model="viewMode" />
        <button class="hdr-btn-outlined" @click="refreshList">
          <AppIcon name="refresh-cw" :size="14" />
          <span>Yenile</span>
        </button>
        <button v-if="canCreate" class="hdr-btn-primary" @click="createNew">
          <AppIcon name="plus" :size="14" />
          <span>Yeni Ekle</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="card mb-5 !p-3">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-0 sm:min-w-[200px]">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`${doctypeLabel} ara...`"
            class="w-full pl-9 pr-3 py-2 text-[13px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          >
        </div>
        <div class="flex items-center gap-2">
          <AppIcon name="filter" :size="13" class="text-gray-400 dark:text-gray-500" />
          <select v-model="statusFilter" class="form-input-sm w-auto">
            <option value="">Tüm Durumlar</option>
            <template v-if="statusOptions.length > 0">
              <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
            </template>
            <template v-else>
              <option value="Active">Aktif</option>
              <option value="Draft">Taslak</option>
              <option value="Disabled">Pasif</option>
            </template>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <AppIcon name="arrow-down-wide-narrow" :size="13" class="text-gray-400 dark:text-gray-500" />
          <select v-model="sortBy" class="form-input-sm w-auto">
            <option value="modified desc">Son Düzenlenen</option>
            <option value="creation desc">Son Oluşturulan</option>
            <option value="name asc">İsim (A-Z)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="card text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
        <AppIcon name="inbox" :size="24" class="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Henüz kayıt yok</h3>
      <p class="text-xs text-gray-400 mb-4">{{ canCreate ? `İlk ${doctypeLabel} kaydınızı oluşturun` : `Henüz ${doctypeLabel} kaydı yok` }}</p>
      <button v-if="canCreate" class="hdr-btn-primary" @click="createNew">
        <AppIcon name="plus" :size="14" />
        <span>Yeni Ekle</span>
      </button>
    </div>

    <!-- Content -->
    <div v-else class="card p-0 overflow-hidden">

      <!-- TABLE VIEW -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-white/10">
              <th class="tbl-th w-8"><input type="checkbox" class="form-checkbox rounded text-violet-600"></th>
              <th class="tbl-th">İSİM</th>
              <th v-for="col in listViewFields" :key="col.fieldname" class="tbl-th">
                {{ col.label.toUpperCase() }}
              </th>
              <th v-if="!hasStatusField" class="tbl-th">DURUM</th>
              <th class="tbl-th">OLUŞTURULMA</th>
              <th class="tbl-th">DÜZENLEME</th>
              <th class="tbl-th w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.name"
              class="tbl-row border-b border-gray-50 dark:border-white/5 cursor-pointer"
              @click="openDoc(item.name)"
            >
              <td class="tbl-td" @click.stop><input type="checkbox" class="form-checkbox rounded text-violet-600"></td>
              <td class="tbl-td font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td v-for="col in listViewFields" :key="col.fieldname" class="tbl-td">
                <template v-if="col.fieldtype === 'Select' || col.fieldname === 'status'">
                  <span class="badge" :class="getStatusClass(item[col.fieldname])">
                    {{ item[col.fieldname] || '—' }}
                  </span>
                </template>
                <template v-else-if="col.fieldtype === 'Check'">
                  <AppIcon :name="item[col.fieldname] ? 'check-circle' : 'circle'" :size="14" :class="item[col.fieldname] ? 'text-emerald-500' : 'text-gray-300'" />
                </template>
                <template v-else-if="col.fieldtype === 'Currency' || col.fieldtype === 'Float' || col.fieldtype === 'Int'">
                  <span class="text-gray-700 dark:text-gray-300">{{ formatNumber(item[col.fieldname], col.fieldtype) }}</span>
                </template>
                <template v-else-if="col.fieldtype === 'Date' || col.fieldtype === 'Datetime'">
                  <span class="text-gray-400">{{ formatDate(item[col.fieldname]) }}</span>
                </template>
                <template v-else>
                  <span class="text-gray-700 dark:text-gray-300">{{ item[col.fieldname] || '—' }}</span>
                </template>
              </td>
              <td v-if="!hasStatusField" class="tbl-td">
                <span class="badge" :class="getDocstatusClass(item.docstatus)">
                  {{ getDocstatusLabel(item.docstatus) }}
                </span>
              </td>
              <td class="tbl-td text-gray-400">{{ formatDate(item.creation) }}</td>
              <td class="tbl-td text-gray-400">{{ formatDate(item.modified) }}</td>
              <td class="tbl-td">
                <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click.stop>
                  <AppIcon name="more-vertical" :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- LIST VIEW (compact) -->
      <div v-else-if="viewMode === 'list'">
        <div
          v-for="item in items"
          :key="item.name"
          class="list-compact-item"
          @click="openDoc(item.name)"
        >
          <input type="checkbox" class="form-checkbox rounded text-violet-600 flex-shrink-0" @click.stop>
          <span class="list-compact-name">{{ item.name }}</span>
          <!-- Primary status badge -->
          <template v-if="hasStatusField">
            <span class="badge" :class="getStatusClass(item[statusFieldName])">
              {{ item[statusFieldName] || '—' }}
            </span>
          </template>
          <template v-else>
            <span class="badge" :class="getDocstatusClass(item.docstatus)">
              {{ getDocstatusLabel(item.docstatus) }}
            </span>
          </template>
          <!-- Extra in_list_view fields (skip status, already shown) -->
          <template v-for="col in listViewFields.filter(c => c.fieldname !== statusFieldName && c.fieldtype !== 'Select')" :key="col.fieldname">
            <span class="text-xs text-gray-400 hidden sm:inline">{{ item[col.fieldname] || '' }}</span>
          </template>
          <span class="list-compact-date">{{ formatDate(item.modified) }}</span>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0" @click.stop>
            <AppIcon name="more-vertical" :size="14" />
          </button>
        </div>
      </div>

      <!-- GRID VIEW (cards) -->
      <div v-else-if="viewMode === 'grid'" class="list-grid">
        <div
          v-for="item in items"
          :key="item.name"
          class="list-grid-card"
          @click="openDoc(item.name)"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="list-grid-card-title">{{ item.name }}</span>
            <template v-if="hasStatusField">
              <span class="badge text-[10px]" :class="getStatusClass(item[statusFieldName])">
                {{ item[statusFieldName] || '—' }}
              </span>
            </template>
            <template v-else>
              <span class="badge text-[10px]" :class="getDocstatusClass(item.docstatus)">
                {{ getDocstatusLabel(item.docstatus) }}
              </span>
            </template>
          </div>
          <!-- Extra in_list_view fields -->
          <div v-for="col in listViewFields.filter(c => c.fieldname !== statusFieldName)" :key="col.fieldname" class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span class="font-medium">{{ col.label }}:</span> {{ item[col.fieldname] || '—' }}
          </div>
          <div class="list-grid-card-meta">
            <span>{{ formatDate(item.creation) }}</span>
            <span>{{ formatDate(item.modified) }}</span>
          </div>
        </div>
      </div>

      <!-- KANBAN VIEW -->
      <div v-else-if="viewMode === 'kanban'" class="list-kanban">
        <div
          v-for="col in kanbanColumns"
          :key="col.status"
          class="kanban-col"
        >
          <div class="kanban-col-header" :style="{ borderColor: col.color }">
            <span>{{ col.label }}</span>
            <span class="kanban-col-count">{{ col.items.length }}</span>
          </div>
          <div class="kanban-col-body">
            <div
              v-for="item in col.items"
              :key="item.name"
              class="kanban-card"
              @click="openDoc(item.name)"
            >
              <div class="kanban-card-title">{{ item.name }}</div>
              <div class="kanban-card-meta">{{ formatDate(item.modified) }}</div>
            </div>
            <div v-if="col.items.length === 0" class="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
              Kayıt yok
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ListPagination
        v-model="currentPage"
        :total="totalCount"
        :page-size="pageSize"
        @update:model-value="loadData()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/common/AppIcon.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import ViewModeToggle from '@/components/common/ViewModeToggle.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// ── Satıcı bazlı otomatik filtreler ──────────────────────────────────────────
// Satıcı rolündeki kullanıcı belirli doctype'lara eriştiğinde sadece
// kendi verilerini görmesi için arka plana filtre eklenir.
// admin_seller_profile: { name, seller_code } — auth.py'den geliyor
const SELLER_AUTO_FILTERS = {
  // Listing.seller_profile = Admin Seller Profile.seller_code
  'Listing': (user) => user.admin_seller_profile?.seller_code
    ? [['seller_profile', '=', user.admin_seller_profile.seller_code]]
    : [],
  // Order.seller = Admin Seller Profile.name
  'Order': (user) => user.admin_seller_profile?.name
    ? [['seller', '=', user.admin_seller_profile.name]]
    : [],
  // Seller Profile — sadece kendi profili
  'Seller Profile': (user) => user.seller_profile
    ? [['name', '=', user.seller_profile]]
    : [],
  // KYB Verification — sadece kendi KYB kaydı
  'KYB Verification': (user) => user.email
    ? [['user', '=', user.email]]
    : [],
  // Aşağıdakiler seller = Admin Seller Profile.name
  'Seller Balance': (user) => user.admin_seller_profile?.name
    ? [['seller', '=', user.admin_seller_profile.name]]
    : [],
  'Seller Review': (user) => user.admin_seller_profile?.name
    ? [['seller', '=', user.admin_seller_profile.name]]
    : [],
  'Seller Inquiry': (user) => user.admin_seller_profile?.name
    ? [['seller', '=', user.admin_seller_profile.name]]
    : [],
  'Seller Category': (user) => user.admin_seller_profile?.name
    ? [['seller', '=', user.admin_seller_profile.name]]
    : [],
  'Seller Gallery Image': (user) => user.admin_seller_profile?.name
    ? [['parent', '=', user.admin_seller_profile.name]]
    : [],
}

// Sadece admin görebilecek doctype'lar (satıcı erişemez)
const ADMIN_ONLY_DOCTYPES = new Set([
  'Buyer Profile', 'Cart', 'Admin Seller Profile', 'Supplier Profile',
  'Currency Rate', 'Seller Application',
])

// Satıcının yeni kayıt oluşturamayacağı doctype'lar (sistem tarafından yönetilir)
const NO_CREATE_FOR_SELLER = new Set([
  'Seller Profile', 'Seller Balance', 'Seller Application',
  'Buyer Profile', 'Admin Seller Profile', 'KYB Verification',
])

const canCreate = computed(() => {
  if (auth.isAdmin) return true
  if (NO_CREATE_FOR_SELLER.has(doctype.value)) return false
  return true
})

function getSellerAutoFilter() {
  if (auth.isAdmin || !auth.isSeller) return []
  const filterFn = SELLER_AUTO_FILTERS[doctype.value]
  return filterFn ? filterFn(auth.user) : []
}

const items = ref([])
const totalCount = ref(0)
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('modified desc')
const currentPage = ref(1)
const pageSize = 12
const viewMode = ref('table')

// DocType meta
const metaFields = ref([])
const metaLoaded = ref(false)

const doctype = computed(() => {
  const raw = route.params.doctype || ''
  return decodeURIComponent(raw)
})

const doctypeLabel = computed(() => doctype.value || 'Döküman')

// Fields marked as in_list_view (excluding name/creation/modified/docstatus)
const listViewFields = computed(() => {
  return metaFields.value.filter(f =>
    f.in_list_view &&
    !['name', 'creation', 'modified', 'docstatus', 'owner', 'modified_by'].includes(f.fieldname) &&
    !['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Table', 'Table MultiSelect', 'Button'].includes(f.fieldtype)
  )
})

// Find status Select field
const statusFieldName = computed(() => {
  const field = metaFields.value.find(f => f.fieldname === 'status' && f.fieldtype === 'Select')
  return field ? field.fieldname : null
})

const hasStatusField = computed(() => !!statusFieldName.value)

// Status options from meta
const statusOptions = computed(() => {
  const field = metaFields.value.find(f => f.fieldname === 'status' && f.fieldtype === 'Select')
  if (!field || !field.options) return []
  return field.options.split('\n').map(o => o.trim()).filter(Boolean)
})

// Fields to request from API
const fieldsToFetch = computed(() => {
  const base = ['name', 'creation', 'modified', 'docstatus']
  const listFields = listViewFields.value.map(f => f.fieldname)
  if (statusFieldName.value && !listFields.includes(statusFieldName.value)) {
    listFields.push(statusFieldName.value)
  }
  return [...new Set([...base, ...listFields])]
})

// Kanban: use status field if available, else docstatus
const kanbanColumns = computed(() => {
  if (hasStatusField.value && statusOptions.value.length > 0) {
    const KANBAN_COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899']
    return statusOptions.value.map((status, i) => ({
      status,
      label: status,
      color: KANBAN_COLORS[i % KANBAN_COLORS.length],
      items: items.value.filter(item => item[statusFieldName.value] === status),
    }))
  }
  return [
    { status: 0, label: 'Taslak', color: '#f59e0b', items: items.value.filter(i => i.docstatus === 0) },
    { status: 1, label: 'Onaylı', color: '#10b981', items: items.value.filter(i => i.docstatus === 1) },
    { status: 2, label: 'İptal', color: '#ef4444', items: items.value.filter(i => i.docstatus === 2) },
  ]
})

// Belirli doctype'lar için özel create route'ları
const CUSTOM_CREATE_ROUTES = {
  'Product': '/app/product-add',
}

function createNew() {
  const custom = CUSTOM_CREATE_ROUTES[doctype.value]
  if (custom) {
    router.push(custom)
  } else {
    router.push(`/app/${encodeURIComponent(doctype.value)}/new`)
  }
}

async function loadMeta() {
  metaLoaded.value = false
  metaFields.value = []
  try {
    const res = await api.getMeta(doctype.value)
    metaFields.value = res?.message?.fields || []
  } catch {
    metaFields.value = []
  } finally {
    metaLoaded.value = true
  }
}

async function loadData() {
  // Satıcı admin-only doctype'a erişmeye çalışıyorsa dashboard'a yönlendir
  if (!auth.isAdmin && auth.isSeller && ADMIN_ONLY_DOCTYPES.has(doctype.value)) {
    router.push('/dashboard')
    return
  }

  loading.value = true
  try {
    const filters = []
    if (searchQuery.value) {
      filters.push(['name', 'like', `%${searchQuery.value}%`])
    }
    if (statusFilter.value) {
      const filterField = statusFieldName.value || 'status'
      filters.push([filterField, '=', statusFilter.value])
    }
    // Satıcı için otomatik filtreler ekle
    const sellerFilters = getSellerAutoFilter()
    filters.push(...sellerFilters)

    const res = await api.getList(doctype.value, {
      fields: fieldsToFetch.value,
      filters,
      order_by: sortBy.value,
      limit_start: (currentPage.value - 1) * pageSize,
      limit_page_length: pageSize,
    })
    items.value = res.data || []

    const countRes = await api.getCount(doctype.value, filters)
    totalCount.value = countRes.message || 0
  } catch {
    items.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

async function init() {
  await loadMeta()
  await loadData()
}

function refreshList() {
  currentPage.value = 1
  loadData()
}

function openDoc(name) {
  router.push(`/app/${encodeURIComponent(doctype.value)}/${encodeURIComponent(name)}`)
}

// Status coloring for Select fields
const STATUS_COLOR_MAP = {
  // Green
  'Approved': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Active': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Completed': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Enabled': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Published': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Paid': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  // Amber
  'Draft': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  'Submitted': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  'Pending': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  'Waiting for payment': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  // Blue
  'Under Review': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  'Confirming': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  'Delivering': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  'Processing': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  'In Transit': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  // Red
  'Rejected': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  'Cancelled': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  'Disabled': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  'Suspended': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  'Revoked': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  // Violet
  'Preparing Shipment': 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
}

function getStatusClass(val) {
  if (!val) return 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400'
  return STATUS_COLOR_MAP[val] || 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400'
}

function getDocstatusClass(docstatus) {
  const map = {
    0: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    1: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    2: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
  return map[docstatus] || 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400'
}

function getDocstatusLabel(docstatus) {
  const map = { 0: 'Taslak', 1: 'Aktif', 2: 'İptal' }
  return map[docstatus] || 'Bilinmiyor'
}

function formatDate(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('tr-TR')
}

function formatNumber(val, fieldtype) {
  if (val === null || val === undefined || val === '') return '—'
  if (fieldtype === 'Currency') return Number(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (fieldtype === 'Float') return Number(val).toLocaleString('tr-TR', { maximumFractionDigits: 4 })
  return String(val)
}

watch(() => route.params.doctype, () => {
  currentPage.value = 1
  statusFilter.value = ''
  init()
})

let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadData()
  }, 400)
})

watch([statusFilter, sortBy], () => {
  currentPage.value = 1
  loadData()
})

onMounted(init)
</script>
