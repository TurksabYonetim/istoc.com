<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 dark:bg-[#2a2a35] dark:text-gray-300 dark:hover:bg-[#35354a] transition-colors flex-shrink-0">
          <AppIcon name="arrow-left" :size="14" />
        </button>
        <div class="min-w-0">
          <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">
            {{ isNew ? `Yeni ${doctypeLabel}` : docName }}
          </h1>
          <p class="text-xs text-gray-400">{{ doctypeLabel }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button class="hdr-btn-outlined" @click="goBack">Geri</button>
        <button v-if="canEdit" class="hdr-btn-primary" :disabled="saving" @click="saveDoc">
          <AppIcon v-if="saving" name="loader" :size="13" class="animate-spin" />
          <AppIcon v-else name="save" :size="13" />
          <span>{{ isNew ? 'Oluştur' : 'Kaydet' }}</span>
        </button>
        <span v-else class="text-xs text-gray-400 italic">Salt okunur görünüm</span>
      </div>
    </div>

    <!-- Quick Actions (doctype-specific, e.g. Seller Application) -->
    <div v-if="quickActions.length > 0 && !isNew && !loading" class="card mb-5">
      <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
        <AppIcon name="zap" :size="12" class="text-amber-500" />
        Hızlı İşlemler
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="action in quickActions"
          :key="action.key"
          @click="runQuickAction(action)"
          :disabled="action.disabled || actionLoading"
          :class="['hdr-btn-outlined text-sm transition-colors', action.class, action.disabled ? 'opacity-40 cursor-not-allowed' : '']"
        >
          <AppIcon :name="actionLoading && pendingAction === action.key ? 'loader' : action.icon" :size="13" :class="actionLoading && pendingAction === action.key ? 'animate-spin' : ''" />
          <span>{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Document Fields -->
    <div v-else class="space-y-5">

      <!-- Field Sections (split by Section Break) -->
      <div v-for="(section, si) in fieldSections" :key="section.id" class="card">
        <!-- Section header -->
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2" :class="si > 0 ? 'pb-3 border-b border-gray-100 dark:border-white/5' : ''">
          <AppIcon :name="si === 0 ? 'file-text' : 'layout-list'" :size="14" class="text-violet-500" />
          {{ section.label || (si === 0 ? 'Döküman Bilgileri' : 'Detaylar') }}
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <template v-for="field in section.fields" :key="field.fieldname">
            <!-- Column Break → next field starts in right column -->
            <div v-if="field.fieldtype === 'Column Break'" class="hidden lg:block" aria-hidden="true"></div>

            <!-- Regular field -->
            <div v-else>
              <label class="form-label">
                {{ field.label }}
                <span v-if="field.reqd" class="text-red-500 ml-0.5">*</span>
                <span v-if="isReadOnly(field)" class="ml-1 text-xs text-gray-400 font-normal">(salt okunur)</span>
              </label>

              <!-- ── READONLY ── -->
              <input
                v-if="isReadOnly(field)"
                :value="formatReadOnly(field, formData[field.fieldname])"
                type="text"
                class="form-input bg-gray-50 dark:bg-white/3 opacity-70 cursor-not-allowed select-none"
                readonly
                tabindex="-1"
              />

              <!-- ── TEXT AREA ── -->
              <textarea
                v-else-if="isTextarea(field)"
                v-model="formData[field.fieldname]"
                rows="3"
                class="form-input resize-none"
                :placeholder="field.label"
              />

              <!-- ── CHECKBOX ── -->
              <div v-else-if="field.fieldtype === 'Check'" class="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  :checked="!!formData[field.fieldname]"
                  @change="formData[field.fieldname] = $event.target.checked ? 1 : 0"
                  class="form-checkbox rounded text-violet-600 w-4 h-4"
                />
                <span class="text-xs text-gray-500">{{ field.label }}</span>
              </div>

              <!-- ── SELECT ── -->
              <select
                v-else-if="field.fieldtype === 'Select'"
                v-model="formData[field.fieldname]"
                class="form-input"
              >
                <option value="">Seçiniz...</option>
                <option v-for="opt in parseOptions(field.options)" :key="opt" :value="opt">{{ opt }}</option>
              </select>

              <!-- ── LINK (autocomplete) ── -->
              <div v-else-if="field.fieldtype === 'Link'" class="relative">
                <input
                  v-model="formData[field.fieldname]"
                  type="text"
                  class="form-input pr-8"
                  :placeholder="`${field.options || 'Kayıt'} ara...`"
                  autocomplete="off"
                  @input="onLinkInput(field, $event.target.value)"
                  @focus="onLinkInput(field, formData[field.fieldname])"
                  @blur="scheduleCloseLinkDropdown(field.fieldname)"
                />
                <AppIcon name="search" :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <div
                  v-if="linkDropdowns[field.fieldname]?.show"
                  class="absolute z-30 w-full mt-1 bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl max-h-52 overflow-y-auto"
                >
                  <div
                    v-if="linkDropdowns[field.fieldname]?.loading"
                    class="px-3 py-3 text-xs text-gray-400 flex items-center gap-2"
                  >
                    <AppIcon name="loader" :size="12" class="animate-spin" /> Aranıyor...
                  </div>
                  <div
                    v-else-if="linkDropdowns[field.fieldname]?.results?.length === 0"
                    class="px-3 py-3 text-xs text-gray-400"
                  >
                    Sonuç bulunamadı
                  </div>
                  <div
                    v-for="result in linkDropdowns[field.fieldname]?.results"
                    :key="result.value"
                    class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    @mousedown.prevent="selectLink(field.fieldname, result.value)"
                  >
                    {{ result.value }}
                    <span v-if="result.description" class="text-xs text-gray-400 ml-2">{{ result.description }}</span>
                  </div>
                </div>
              </div>

              <!-- ── DATE ── -->
              <input
                v-else-if="field.fieldtype === 'Date'"
                v-model="formData[field.fieldname]"
                type="date"
                class="form-input"
              />

              <!-- ── DATETIME ── -->
              <input
                v-else-if="field.fieldtype === 'Datetime'"
                v-model="formData[field.fieldname]"
                type="datetime-local"
                class="form-input"
              />

              <!-- ── NUMBER ── -->
              <input
                v-else-if="isNumberField(field)"
                v-model.number="formData[field.fieldname]"
                type="number"
                class="form-input"
                :placeholder="field.label"
              />

              <!-- ── ATTACH / ATTACH IMAGE ── -->
              <div v-else-if="isAttachField(field)">
                <!-- Mevcut dosya / görsel önizleme -->
                <div v-if="formData[field.fieldname]" class="mb-2 flex items-center gap-3">
                  <img
                    v-if="field.fieldtype === 'Attach Image'"
                    :src="formData[field.fieldname]"
                    class="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-white/10"
                    alt="önizleme"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-500 truncate">{{ formData[field.fieldname] }}</p>
                    <button
                      type="button"
                      class="text-xs text-red-500 hover:text-red-700 mt-1"
                      @click="formData[field.fieldname] = ''"
                    >Kaldır</button>
                  </div>
                </div>
                <!-- Upload alanı -->
                <label
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors"
                  :class="uploadingField === field.fieldname ? 'opacity-60 pointer-events-none' : ''"
                >
                  <AppIcon
                    :name="uploadingField === field.fieldname ? 'loader' : (field.fieldtype === 'Attach Image' ? 'image' : 'paperclip')"
                    :size="14"
                    :class="uploadingField === field.fieldname ? 'animate-spin text-violet-500' : 'text-gray-400'"
                  />
                  <span class="text-xs text-gray-500">
                    {{ uploadingField === field.fieldname ? 'Yükleniyor...' : (formData[field.fieldname] ? 'Değiştir' : 'Dosya seç') }}
                  </span>
                  <input
                    type="file"
                    class="hidden"
                    :accept="field.fieldtype === 'Attach Image' ? 'image/*' : '*'"
                    @change="uploadFile(field, $event.target.files[0])"
                  />
                </label>
              </div>

              <!-- ── PASSWORD ── -->
              <input
                v-else-if="field.fieldtype === 'Password'"
                v-model="formData[field.fieldname]"
                type="password"
                class="form-input"
                :placeholder="field.label"
              />

              <!-- ── DEFAULT (Data / other) ── -->
              <input
                v-else
                v-model="formData[field.fieldname]"
                type="text"
                class="form-input"
                :placeholder="field.label"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- Fallback: meta yüklenemezse ham veriler -->
      <div v-if="fieldSections.length === 0 && !isNew" class="card">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
          <AppIcon name="file-text" :size="14" class="text-violet-500 inline mr-2" />
          Döküman Bilgileri
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div v-for="(value, key) in docData" :key="key">
            <label class="form-label">{{ formatFieldLabel(key) }}</label>
            <input
              :value="value"
              type="text"
              class="form-input"
              :class="READONLY_FIELDS.includes(key) ? 'opacity-60 cursor-not-allowed' : ''"
              :readonly="READONLY_FIELDS.includes(key)"
            />
          </div>
        </div>
      </div>

      <!-- Child Tables -->
      <div v-for="table in childTableFields" :key="table.fieldname" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AppIcon name="table-2" :size="14" class="text-violet-500" />
            {{ table.label }}
          </h3>
          <span class="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
            {{ (childTableData[table.fieldname] || []).length }} satır
          </span>
        </div>
        <div class="overflow-x-auto">
          <table v-if="(childTableData[table.fieldname] || []).length > 0" class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-100 dark:border-white/5">
                <th class="tbl-th w-8">#</th>
                <th v-for="col in getChildTableColumns(table.options)" :key="col.fieldname" class="tbl-th">{{ col.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in childTableData[table.fieldname]"
                :key="row.name || idx"
                class="border-b border-gray-50 dark:border-white/3 hover:bg-gray-50 dark:hover:bg-white/2"
              >
                <td class="tbl-td text-gray-400">{{ idx + 1 }}</td>
                <td v-for="col in getChildTableColumns(table.options)" :key="col.fieldname" class="tbl-td">
                  {{ row[col.fieldname] ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-8 text-xs text-gray-400">
            <AppIcon name="inbox" :size="20" class="mx-auto mb-2 opacity-50" />
            Henüz kayıt yok
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useDocTypeStore } from '@/stores/doctype'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

// ── Sabit listeler ────────────────────────────────────────────────────────────
const READONLY_FIELDS = [
  'name', 'creation', 'modified', 'modified_by', 'owner',
  'docstatus', 'idx', 'parent', 'parenttype', 'parentfield',
  'naming_series', 'amended_from',
]

const SKIP_FIELDTYPES = [
  'Section Break', 'Tab Break', 'HTML', 'Button', 'Fold',
  'Heading', 'Break',
]

const TEXTAREA_TYPES = ['Text', 'Long Text', 'Small Text', 'Code', 'Text Editor']
const NUMBER_TYPES   = ['Int', 'Float', 'Currency', 'Percent']
const ATTACH_TYPES   = ['Attach', 'Attach Image']

// ── Composables & Stores ──────────────────────────────────────────────────────
const route        = useRoute()
const router       = useRouter()
const toast        = useToast()
const doctypeStore = useDocTypeStore()
const authStore    = useAuthStore()

// ── State ─────────────────────────────────────────────────────────────────────
const loading     = ref(false)
const saving      = ref(false)
const actionLoading = ref(false)
const pendingAction = ref(null)
const docData     = ref({})
const formData    = ref({})
const metaFields  = ref([])
const childTableMeta = reactive({})   // { doctype: fields[] }
const childTableData = reactive({})   // { fieldname: rows[] }
const linkDropdowns  = reactive({})   // { fieldname: { show, loading, results[] } }
const linkTimers     = {}
const uploadingField = ref(null)       // fieldname being uploaded

// ── Computed ──────────────────────────────────────────────────────────────────
const doctype      = computed(() => decodeURIComponent(route.params.doctype || ''))
const doctypeLabel = computed(() => doctype.value || 'Döküman')
const docName      = computed(() => decodeURIComponent(route.params.name || ''))
const isNew        = computed(() => docName.value === 'new')

/**
 * Alanları Section Break'e göre gruplara böler.
 * Column Break alanları grubun içinde bırakılır (grid sütun ayırıcı olarak).
 */
const fieldSections = computed(() => {
  const sections = []
  let current = { id: 'section-0', label: '', fields: [], isFirst: true }

  for (const field of metaFields.value) {
    if (field.hidden) continue
    if (!field.fieldname) continue

    if (field.fieldtype === 'Section Break') {
      if (current.fields.length > 0) sections.push(current)
      current = {
        id: `section-${sections.length}`,
        label: field.label || '',
        fields: [],
        isFirst: false,
      }
    } else if (field.fieldtype === 'Tab Break') {
      // Tab break'ler bölüm olarak kabul edilir
      if (current.fields.length > 0) sections.push(current)
      current = {
        id: `tab-${sections.length}`,
        label: field.label || '',
        fields: [],
        isFirst: false,
      }
    } else if (SKIP_FIELDTYPES.includes(field.fieldtype)) {
      // Skip these
    } else if (field.fieldtype === 'Table' || field.fieldtype === 'Table MultiSelect') {
      // Child tables are handled separately
    } else {
      current.fields.push(field)
    }
  }
  if (current.fields.length > 0) sections.push(current)
  return sections
})

/** Child table alanları (Table ve Table MultiSelect) */
const childTableFields = computed(() =>
  metaFields.value.filter(f =>
    !f.hidden && (f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect')
  )
)

// Sadece admin görebilecek doctype'lar (form view koruması)
const ADMIN_ONLY_DOCTYPES = new Set([
  'Buyer Profile', 'Cart', 'Admin Seller Profile', 'Supplier Profile',
  'Currency Rate', 'Seller Application',
])

// Satıcılar için sadece okuma modundaki doctypelar (yazma yetkileri yok)
const SELLER_READONLY_DOCTYPES = new Set([
  'Seller Balance', 'Seller Review', 'Seller Gallery Image',
])

// Satıcı bu doctype'ı düzenleyebilir mi?
const canEdit = computed(() => {
  if (authStore.isAdmin) return true
  if (!authStore.isSeller) return false
  return !SELLER_READONLY_DOCTYPES.has(doctype.value)
})

/** Doctype'a özel hızlı işlem butonları — yalnızca adminler görebilir */
const quickActions = computed(() => {
  if (!authStore.isAdmin) return []
  if (doctype.value === 'Seller Application') {
    const status = formData.value.status || ''
    return [
      {
        key: 'approve',
        label: 'Onayla',
        icon: 'check-circle',
        class: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950',
        disabled: status === 'Approved',
        newStatus: 'Approved',
      },
      {
        key: 'reviewing',
        label: 'İnceleniyor',
        icon: 'clock',
        class: 'text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950',
        disabled: status === 'Under Review',
        newStatus: 'Under Review',
      },
      {
        key: 'reject',
        label: 'Reddet',
        icon: 'x-circle',
        class: 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950',
        disabled: status === 'Rejected',
        newStatus: 'Rejected',
      },
    ]
  }

  if (doctype.value === 'Seller Profile') {
    const status = formData.value.status || ''
    return [
      {
        key: 'activate',
        label: 'Aktif Et',
        icon: 'check-circle',
        class: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50',
        disabled: status === 'Active',
        newStatus: 'Active',
      },
      {
        key: 'suspend',
        label: 'Askıya Al',
        icon: 'pause-circle',
        class: 'text-amber-600 border-amber-200 hover:bg-amber-50',
        disabled: status === 'Suspended',
        newStatus: 'Suspended',
      },
      {
        key: 'deactivate',
        label: 'Deaktif Et',
        icon: 'x-circle',
        class: 'text-red-600 border-red-200 hover:bg-red-50',
        disabled: status === 'Inactive',
        newStatus: 'Inactive',
      },
    ]
  }

  return []
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function isAttachField(field) { return ATTACH_TYPES.includes(field.fieldtype) }

async function uploadFile(field, file) {
  if (!file) return
  uploadingField.value = field.fieldname
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('is_private', '0')
    if (!isNew.value) {
      fd.append('doctype', doctype.value)
      fd.append('docname', docName.value)
      fd.append('fieldname', field.fieldname)
    }
    const res = await fetch('/api/method/upload_file', {
      method: 'POST',
      headers: {
        'X-Frappe-CSRF-Token': document.cookie.match(/csrf_token=([^;]+)/)?.[1] || 'None',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: fd,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`)
    const fileUrl = json.message?.file_url || json.message
    formData.value[field.fieldname] = fileUrl
    toast.success('Dosya yüklendi')
  } catch (err) {
    toast.error(err.message || 'Dosya yüklenemedi')
  } finally {
    uploadingField.value = null
  }
}

function isReadOnly(field) {
  if (READONLY_FIELDS.includes(field.fieldname)) return true
  // Admin kullanıcılar quick-action alanlarını düzenleyebilir
  if (field.read_only && !authStore.isAdmin) return true
  return false
}

function isTextarea(field)     { return TEXTAREA_TYPES.includes(field.fieldtype) }
function isNumberField(field)  { return NUMBER_TYPES.includes(field.fieldtype) }
function parseOptions(options) { return (options || '').split('\n').filter(Boolean) }

function formatReadOnly(field, value) {
  if (value === null || value === undefined) return ''
  if (field.fieldtype === 'Check') return value ? 'Evet' : 'Hayır'
  if (field.fieldtype === 'Datetime' && value) {
    return new Date(value).toLocaleString('tr-TR')
  }
  return String(value)
}

function formatFieldLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getChildTableColumns(childDoctype) {
  const meta = childTableMeta[childDoctype]
  if (!meta) return []
  return meta.filter(f =>
    !f.hidden &&
    f.in_list_view &&
    f.fieldname &&
    !SKIP_FIELDTYPES.includes(f.fieldtype) &&
    f.fieldtype !== 'Table'
  ).slice(0, 6)
}

// ── Link field autocomplete ───────────────────────────────────────────────────
function onLinkInput(field, value) {
  clearTimeout(linkTimers[field.fieldname])
  if (!linkDropdowns[field.fieldname]) {
    linkDropdowns[field.fieldname] = { show: false, loading: false, results: [] }
  }
  linkDropdowns[field.fieldname].show = true
  linkDropdowns[field.fieldname].loading = true

  linkTimers[field.fieldname] = setTimeout(async () => {
    try {
      const res = await api.searchLink(field.options, value || '')
      linkDropdowns[field.fieldname].results = res.results || []
    } catch {
      linkDropdowns[field.fieldname].results = []
    } finally {
      linkDropdowns[field.fieldname].loading = false
    }
  }, 300)
}

function selectLink(fieldname, value) {
  formData.value[fieldname] = value
  if (linkDropdowns[fieldname]) linkDropdowns[fieldname].show = false
}

function scheduleCloseLinkDropdown(fieldname) {
  setTimeout(() => {
    if (linkDropdowns[fieldname]) linkDropdowns[fieldname].show = false
  }, 200)
}

// ── Quick Actions ─────────────────────────────────────────────────────────────
async function runQuickAction(action) {
  if (action.disabled || actionLoading.value) return
  actionLoading.value = true
  pendingAction.value = action.key
  try {
    formData.value.status = action.newStatus
    await api.updateDoc(doctype.value, docName.value, { status: action.newStatus })
    toast.success(`Durum güncellendi: ${action.newStatus}`)
    await loadDoc()
  } catch (err) {
    toast.error(err.message || 'İşlem başarısız')
    formData.value.status = docData.value.status || ''
  } finally {
    actionLoading.value = false
    pendingAction.value = null
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(`/app/${encodeURIComponent(doctype.value)}`)
  }
}

// ── Data Loading ──────────────────────────────────────────────────────────────
async function loadMeta() {
  try {
    const meta = await doctypeStore.getMeta(doctype.value)
    metaFields.value = meta.fields || []

    // Child table meta'larını arka planda yükle
    for (const field of metaFields.value) {
      if ((field.fieldtype === 'Table' || field.fieldtype === 'Table MultiSelect') && field.options) {
        loadChildTableMeta(field.options)
      }
    }

    // Boş form objesi oluştur
    const empty = {}
    for (const f of metaFields.value) {
      if (!f.fieldname || SKIP_FIELDTYPES.includes(f.fieldtype)) continue
      if (f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect') continue
      empty[f.fieldname] = f.default ?? (f.fieldtype === 'Check' ? 0 : '')
    }
    return empty
  } catch {
    return {}
  }
}

async function loadChildTableMeta(childDoctype) {
  if (childTableMeta[childDoctype]) return
  try {
    const meta = await doctypeStore.getMeta(childDoctype)
    childTableMeta[childDoctype] = meta.fields || []
  } catch {
    childTableMeta[childDoctype] = []
  }
}

async function loadChildTableData(fieldname, childDoctype) {
  if (!docName.value || docName.value === 'new') return
  try {
    const res = await api.getList(childDoctype, {
      filters: [['parent', '=', docName.value]],
      fields: ['*'],
      limit_page_length: 100,
    })
    childTableData[fieldname] = res.data || []
  } catch {
    childTableData[fieldname] = []
  }
}

async function loadDoc() {
  // Satıcı admin-only doctype'a erişmeye çalışıyorsa dashboard'a yönlendir
  if (!authStore.isAdmin && authStore.isSeller && ADMIN_ONLY_DOCTYPES.has(doctype.value)) {
    router.push('/dashboard')
    return
  }

  loading.value = true
  try {
    const emptyFromMeta = await loadMeta()

    if (isNew.value) {
      formData.value = emptyFromMeta
    } else {
      try {
        const res = await api.getDoc(doctype.value, docName.value)
        docData.value = res.data || {}
        formData.value = { ...emptyFromMeta, ...docData.value }

        // Child table verilerini yükle
        for (const field of childTableFields.value) {
          loadChildTableData(field.fieldname, field.options)
        }
      } catch {
        docData.value = { name: docName.value, doctype: doctype.value }
        formData.value = { ...docData.value }
      }
    }
  } finally {
    loading.value = false
  }
}

// ── Save ──────────────────────────────────────────────────────────────────────
async function saveDoc() {
  // Zorunlu alanları client-side doğrula
  const missingFields = metaFields.value.filter(f =>
    f.reqd &&
    !f.hidden &&
    !READONLY_FIELDS.includes(f.fieldname) &&
    !['Table', 'Table MultiSelect', 'Section Break', 'Column Break', 'Tab Break'].includes(f.fieldtype) &&
    (formData.value[f.fieldname] === '' || formData.value[f.fieldname] === null || formData.value[f.fieldname] === undefined)
  )
  if (missingFields.length > 0) {
    toast.error(`Zorunlu alanlar eksik: ${missingFields.map(f => f.label || f.fieldname).join(', ')}`)
    return
  }

  saving.value = true
  try {
    // Sadece yazılabilir alanları gönder
    const payload = {}
    for (const f of metaFields.value) {
      if (!f.fieldname || SKIP_FIELDTYPES.includes(f.fieldtype)) continue
      if (f.fieldtype === 'Table' || f.fieldtype === 'Table MultiSelect') continue
      if (READONLY_FIELDS.includes(f.fieldname)) continue
      // Admin olmayan kullanıcılar read_only alanları göndermesin
      if (f.read_only && !authStore.isAdmin) continue
      payload[f.fieldname] = formData.value[f.fieldname]
    }

    if (isNew.value) {
      const res = await api.createDoc(doctype.value, payload)
      const newName = res.data?.name
      toast.success(`${doctypeLabel.value} oluşturuldu`)
      const returnTo = route.query.returnTo
      if (returnTo) {
        router.push(returnTo)
      } else if (newName) {
        router.replace(`/app/${encodeURIComponent(doctype.value)}/${encodeURIComponent(newName)}`)
      } else {
        router.push(`/app/${encodeURIComponent(doctype.value)}`)
      }
    } else {
      await api.updateDoc(doctype.value, docName.value, payload)
      toast.success('Kayıt güncellendi')
      await loadDoc()
    }
  } catch (err) {
    toast.error(err.message || 'Kayıt sırasında hata oluştu')
  } finally {
    saving.value = false
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
watch(() => route.params.name, loadDoc)
onMounted(loadDoc)
</script>
