<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">Kategori Yönetimi</h1>
        <p class="text-xs text-gray-400 mt-0.5">Platform kategori ağacını yönetin</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="loadRoots" class="hdr-btn-outlined flex items-center gap-1.5">
          <AppIcon name="refresh-cw" :size="13" />
          Yenile
        </button>
        <button @click="openImportModal" class="hdr-btn-outlined flex items-center gap-1.5">
          <AppIcon name="upload" :size="13" />
          JSON İçe Aktar
        </button>
        <button @click="openAddModal(null)" class="hdr-btn-primary flex items-center gap-1.5">
          <AppIcon name="plus" :size="13" />
          Kök Kategori Ekle
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="nodes.length === 0" class="card text-center py-12">
      <AppIcon name="folder-open" :size="32" class="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p class="text-sm text-gray-400">Henüz kategori yok</p>
    </div>

    <!-- Tree Table -->
    <div v-else class="card overflow-hidden p-0">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 dark:border-[#2a2a35] bg-gray-50 dark:bg-[#1a1a25]">
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Kategori Adı</th>
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">URL Slug</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Aktif</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Alt</th>
            <th class="text-right text-xs font-semibold text-gray-500 px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-[#2a2a35]">
          <tr v-for="node in nodes" :key="node.id"
              class="hover:bg-gray-50 dark:hover:bg-[#1e1e2a] transition-colors">
            <!-- Name with indent -->
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-1.5" :style="{ paddingLeft: (node.depth * 18) + 'px' }">
                <button
                  v-if="node.child_count > 0 || node.expanded"
                  @click="toggleExpand(node)"
                  class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <AppIcon v-if="node.loadingChildren" name="loader" :size="11" class="animate-spin" />
                  <AppIcon v-else-if="node.expanded" name="chevron-down" :size="12" />
                  <AppIcon v-else name="chevron-right" :size="12" />
                </button>
                <span v-else class="w-5 flex-shrink-0"></span>
                <AppIcon name="folder" :size="13" :class="node.is_active ? 'text-violet-400' : 'text-gray-300'" class="flex-shrink-0" />
                <span class="font-medium text-xs text-gray-800 dark:text-gray-200">{{ node.name }}</span>
              </div>
            </td>
            <!-- URL Slug -->
            <td class="px-4 py-2.5 hidden md:table-cell">
              <span class="text-xs text-gray-400 font-mono">{{ node.url_slug || '—' }}</span>
            </td>
            <!-- Active toggle -->
            <td class="px-4 py-2.5 text-center">
              <button
                @click="toggleActive(node)"
                :class="node.is_active ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-gray-400'"
                class="transition-colors"
                :title="node.is_active ? 'Aktif — tıkla pasife al' : 'Pasif — tıkla aktife al'"
              >
                <AppIcon :name="node.is_active ? 'circle-check' : 'circle'" :size="14" />
              </button>
            </td>
            <!-- Child count -->
            <td class="px-4 py-2.5 text-center">
              <span class="text-xs text-gray-500">{{ node.child_count }}</span>
            </td>
            <!-- Actions -->
            <td class="px-4 py-2.5">
              <div class="flex items-center justify-end gap-0.5">
                <button
                  @click="openAddModal(node.id)"
                  class="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded transition-colors"
                  title="Alt kategori ekle"
                >
                  <AppIcon name="folder-plus" :size="13" />
                </button>
                <button
                  @click="openEditModal(node)"
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Düzenle"
                >
                  <AppIcon name="pencil" :size="13" />
                </button>
                <button
                  @click="confirmDelete(node)"
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Sil"
                >
                  <AppIcon name="trash-2" :size="13" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Add/Edit Modal ── -->
    <div v-if="formModal.show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="formModal.show = false"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[440px] max-w-[calc(100vw-32px)]">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ formModal.isEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}
        </h3>
        <div v-if="formModal.parentName" class="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <AppIcon name="folder" :size="12" />
          Üst kategori: <strong class="text-gray-700 dark:text-gray-300">{{ formModal.parentName }}</strong>
        </div>
        <div class="space-y-3">
          <div>
            <label class="form-label">Kategori Adı *</label>
            <input v-model="formModal.name" class="form-input" placeholder="ör: Elektronik" @keyup.enter="saveCategory" />
          </div>
          <div>
            <label class="form-label">URL Slug <span class="text-gray-400 font-normal">(boş bırakırsanız otomatik)</span></label>
            <input v-model="formModal.url_slug" class="form-input" placeholder="ör: elektronik" />
          </div>
          <div>
            <label class="form-label">Icon Class <span class="text-gray-400 font-normal">(ör: bi bi-laptop)</span></label>
            <input v-model="formModal.icon_class" class="form-input" placeholder="ör: bi bi-laptop" />
          </div>
          <!-- Image upload -->
          <div>
            <label class="form-label">Kategori Resmi</label>
            <div class="flex items-center gap-3">
              <div
                class="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                :class="formModal.image ? 'border-violet-300' : 'border-gray-200 dark:border-[#2a2a35]'"
                @click="catImageInput.click()"
              >
                <img v-if="formModal.image" :src="formModal.image" class="w-full h-full object-cover" />
                <AppIcon v-else name="image-plus" :size="20" class="text-gray-300" />
              </div>
              <div class="flex-1">
                <button type="button" @click="catImageInput.click()" class="hdr-btn-outlined text-xs flex items-center gap-1.5">
                  <AppIcon v-if="formModal.imageUploading" name="loader" :size="12" class="animate-spin" />
                  <AppIcon v-else name="upload" :size="12" />
                  {{ formModal.image ? 'Değiştir' : 'Resim Yükle' }}
                </button>
                <button v-if="formModal.image" type="button" @click="formModal.image = ''" class="ml-2 text-xs text-red-400 hover:text-red-600">Kaldır</button>
                <p class="text-[11px] text-gray-400 mt-1">PNG, JPG — 1:1 oran önerilir</p>
              </div>
            </div>
            <input ref="catImageInput" type="file" accept="image/*" class="hidden" @change="handleCatImageUpload" />
          </div>
          <div>
            <label class="form-label">Sıra</label>
            <input v-model.number="formModal.sort_order" type="number" class="form-input" />
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="formModal.is_active" id="modal-active" class="form-checkbox" />
            <label for="modal-active" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Aktif</label>
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-5">
          <button @click="formModal.show = false" class="hdr-btn-outlined">İptal</button>
          <button @click="saveCategory" :disabled="formModal.saving" class="hdr-btn-primary flex items-center gap-1.5">
            <AppIcon v-if="formModal.saving" name="loader" :size="13" class="animate-spin" />
            {{ formModal.isEdit ? 'Güncelle' : 'Ekle' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Delete Confirm Modal ── -->
    <div v-if="deleteModal.show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="deleteModal.show = false"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[400px] max-w-[calc(100vw-32px)]">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Kategoriyi Sil</h3>
        <p class="text-sm text-gray-500 mb-1">
          <strong class="text-gray-800 dark:text-gray-200">{{ deleteModal.node?.name }}</strong>
          kategorisi silinecek.
        </p>
        <p v-if="deleteModal.node?.child_count > 0" class="text-xs text-red-500 mb-3">
          Bu kategorinin {{ deleteModal.node.child_count }} alt kategorisi var. Silmeden önce onları kaldırın.
        </p>
        <p v-else class="text-xs text-gray-400 mb-3">Bu işlem geri alınamaz.</p>
        <div class="flex gap-3 justify-end">
          <button @click="deleteModal.show = false" class="hdr-btn-outlined">İptal</button>
          <button
            @click="deleteCategory"
            :disabled="deleteModal.deleting || deleteModal.node?.child_count > 0"
            class="hdr-btn-danger flex items-center gap-1.5"
          >
            <AppIcon v-if="deleteModal.deleting" name="loader" :size="13" class="animate-spin" />
            Sil
          </button>
        </div>
      </div>
    </div>

    <!-- ── Import Modal ── -->
    <div v-if="importModal.show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="!importModal.importing && (importModal.show = false)"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[480px] max-w-[calc(100vw-32px)]">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">JSON İçe Aktar</h3>
        <p class="text-xs text-gray-400 mb-4">
          Beklenen format: <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">[{"id": "...", "name": "...", "parent_id": "..."}]</code>
        </p>

        <!-- Upload area -->
        <div v-if="!importModal.result">
          <div
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
            :class="importModal.data ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/10' : 'border-gray-200 dark:border-[#2a2a35] hover:border-violet-400'"
            @click="fileInput.click()"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <AppIcon :name="importModal.data ? 'circle-check' : 'upload-cloud'" :size="28"
              :class="importModal.data ? 'text-violet-500' : 'text-gray-300'"
              class="mx-auto mb-2" />
            <p class="text-sm" :class="importModal.data ? 'text-violet-700 dark:text-violet-400 font-medium' : 'text-gray-500'">
              {{ importModal.fileName || 'JSON dosyası seçin veya sürükleyin' }}
            </p>
            <p v-if="importModal.data" class="text-xs text-gray-400 mt-1">{{ importModal.data.length }} kayıt okundu</p>
          </div>
          <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileSelect" />

          <div class="flex gap-3 justify-end mt-4">
            <button @click="importModal.show = false" class="hdr-btn-outlined">İptal</button>
            <button
              @click="runImport"
              :disabled="!importModal.data || importModal.importing"
              class="hdr-btn-primary flex items-center gap-1.5"
            >
              <AppIcon v-if="importModal.importing" name="loader" :size="13" class="animate-spin" />
              {{ importModal.importing ? 'İçe aktarılıyor...' : 'İçe Aktar' }}
            </button>
          </div>
        </div>

        <!-- Result -->
        <div v-else class="text-center py-2">
          <AppIcon name="circle-check" :size="36" class="text-emerald-400 mx-auto mb-3" />
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">İçe aktarma tamamlandı</p>
          <div class="grid grid-cols-3 gap-3 text-center mb-5">
            <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <p class="text-xl font-bold text-emerald-600">{{ importModal.result.inserted }}</p>
              <p class="text-xs text-gray-500 mt-0.5">Eklendi</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p class="text-xl font-bold text-blue-600">{{ importModal.result.updated }}</p>
              <p class="text-xs text-gray-500 mt-0.5">Güncellendi</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p class="text-xl font-bold text-gray-500">{{ importModal.result.skipped }}</p>
              <p class="text-xs text-gray-500 mt-0.5">Atlandı</p>
            </div>
          </div>
          <button @click="closeImportAndReload" class="hdr-btn-primary">Tamam</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

const toast = useToast()
const loading = ref(false)
const nodes = ref([])

// ── Helpers ───────────────────────────────────────────

function toNode(c, depth) {
  return {
    id: c.name,
    name: c.category_name,
    url_slug: c.url_slug || '',
    image: c.image || '',
    icon_class: c.icon_class || '',
    is_active: !!c.is_active,
    sort_order: c.sort_order || 0,
    child_count: c.child_count || 0,
    parent_id: c.parent_product_category || null,
    depth,
    expanded: false,
    loadingChildren: false,
  }
}

// ── Tree loading ──────────────────────────────────────

async function loadRoots() {
  loading.value = true
  try {
    const res = await api.callMethod('tradehub_core.api.category.get_category_tree', { parent: null })
    nodes.value = (res.message || []).map(c => toNode(c, 0))
  } catch (err) {
    toast.error(err.message || 'Kategoriler yüklenemedi')
  } finally {
    loading.value = false
  }
}

async function toggleExpand(node) {
  if (node.expanded) {
    collapseNode(node)
    return
  }
  node.loadingChildren = true
  try {
    const res = await api.callMethod('tradehub_core.api.category.get_category_tree', { parent: node.id })
    const children = (res.message || []).map(c => toNode(c, node.depth + 1))
    const idx = nodes.value.findIndex(n => n.id === node.id)
    nodes.value.splice(idx + 1, 0, ...children)
    node.expanded = true
  } catch (err) {
    toast.error(err.message || 'Alt kategoriler yüklenemedi')
  } finally {
    node.loadingChildren = false
  }
}

function collapseNode(node) {
  const idx = nodes.value.findIndex(n => n.id === node.id)
  let end = idx + 1
  while (end < nodes.value.length && nodes.value[end].depth > node.depth) end++
  nodes.value.splice(idx + 1, end - idx - 1)
  node.expanded = false
}

// ── Add/Edit Modal ────────────────────────────────────

const catImageInput = ref(null)

const formModal = ref({
  show: false, isEdit: false, saving: false,
  id: null, parentId: null, parentName: null,
  name: '', url_slug: '', icon_class: '', sort_order: 0, is_active: true,
  image: '', imageUploading: false,
})

function openAddModal(parentId) {
  const parentNode = parentId ? nodes.value.find(n => n.id === parentId) : null
  formModal.value = {
    show: true, isEdit: false, saving: false,
    id: null, parentId,
    parentName: parentNode?.name || null,
    name: '', url_slug: '', icon_class: '', sort_order: 0, is_active: true,
    image: '', imageUploading: false,
  }
}

function openEditModal(node) {
  const parentNode = node.parent_id ? nodes.value.find(n => n.id === node.parent_id) : null
  formModal.value = {
    show: true, isEdit: true, saving: false,
    id: node.id, parentId: node.parent_id,
    parentName: parentNode?.name || null,
    name: node.name, url_slug: node.url_slug, icon_class: node.icon_class || '',
    sort_order: node.sort_order, is_active: node.is_active,
    image: node.image || '', imageUploading: false,
  }
}

async function handleCatImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  formModal.value.imageUploading = true
  try {
    const fileUrl = await api.uploadFile(file, 'Home')
    formModal.value.image = fileUrl
    toast.success('Resim yüklendi')
  } catch (err) {
    toast.error('Resim yüklenemedi: ' + (err.message || ''))
  } finally {
    formModal.value.imageUploading = false
    e.target.value = ''
  }
}

async function saveCategory() {
  const fm = formModal.value
  if (!fm.name.trim()) { toast.error('Kategori adı zorunlu'); return }
  fm.saving = true
  try {
    if (fm.isEdit) {
      await api.callMethod('tradehub_core.api.category.update_category', {
        name: fm.id,
        category_name: fm.name,
        url_slug: fm.url_slug || null,
        icon_class: fm.icon_class || null,
        sort_order: fm.sort_order,
        is_active: fm.is_active ? 1 : 0,
        image: fm.image || null,
      }, true)
      const node = nodes.value.find(n => n.id === fm.id)
      if (node) {
        node.name = fm.name
        node.url_slug = fm.url_slug
        node.icon_class = fm.icon_class
        node.sort_order = fm.sort_order
        node.is_active = fm.is_active
        node.image = fm.image
      }
      toast.success('Kategori güncellendi')
    } else {
      await api.callMethod('tradehub_core.api.category.create_category', {
        category_name: fm.name,
        parent_id: fm.parentId || null,
        url_slug: fm.url_slug || null,
        icon_class: fm.icon_class || null,
        sort_order: fm.sort_order,
        is_active: fm.is_active ? 1 : 0,
        image: fm.image || null,
      }, true)
      toast.success('Kategori eklendi')
      if (fm.parentId) {
        const parent = nodes.value.find(n => n.id === fm.parentId)
        if (parent) {
          parent.child_count++
          if (parent.expanded) {
            collapseNode(parent)
            await toggleExpand(parent)
          }
        }
      } else {
        await loadRoots()
      }
    }
    formModal.value.show = false
  } catch (err) {
    toast.error(err.message || 'İşlem başarısız')
  } finally {
    formModal.value.saving = false
  }
}

// ── Delete ────────────────────────────────────────────

const deleteModal = ref({ show: false, node: null, deleting: false })

function confirmDelete(node) {
  deleteModal.value = { show: true, node, deleting: false }
}

async function deleteCategory() {
  const dm = deleteModal.value
  dm.deleting = true
  try {
    await api.callMethod('tradehub_core.api.category.delete_category', { name: dm.node.id }, true)
    toast.success(`"${dm.node.name}" silindi`)
    const idx = nodes.value.findIndex(n => n.id === dm.node.id)
    if (idx !== -1) nodes.value.splice(idx, 1)
    if (dm.node.parent_id) {
      const parent = nodes.value.find(n => n.id === dm.node.parent_id)
      if (parent) parent.child_count = Math.max(0, parent.child_count - 1)
    }
    deleteModal.value.show = false
  } catch (err) {
    toast.error(err.message || 'Silinemedi')
  } finally {
    dm.deleting = false
  }
}

// ── Active Toggle ─────────────────────────────────────

async function toggleActive(node) {
  const newVal = !node.is_active
  try {
    await api.callMethod('tradehub_core.api.category.update_category', {
      name: node.id,
      is_active: newVal ? 1 : 0,
    }, true)
    node.is_active = newVal
    toast.success(newVal ? 'Aktif edildi' : 'Pasif yapıldı')
  } catch (err) {
    toast.error(err.message || 'Güncelleme başarısız')
  }
}

// ── Import ────────────────────────────────────────────

const fileInput = ref(null)
const importModal = ref({
  show: false, importing: false,
  fileName: null, data: null, result: null,
})

function openImportModal() {
  importModal.value = { show: true, importing: false, fileName: null, data: null, result: null }
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) readJsonFile(file)
}

function handleFileDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) readJsonFile(file)
}

function readJsonFile(file) {
  importModal.value.fileName = file.name
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      importModal.value.data = JSON.parse(ev.target.result)
    } catch {
      toast.error('Geçersiz JSON dosyası')
      importModal.value.data = null
    }
  }
  reader.readAsText(file)
}

async function runImport() {
  const im = importModal.value
  if (!im.data) return
  im.importing = true
  try {
    const res = await api.callMethod('tradehub_core.api.category.import_categories', {
      json_data: JSON.stringify(im.data),
    }, true)
    im.result = res.message
    if (res.message?.warning) {
      toast.error(res.message.warning)
    }
  } catch (err) {
    toast.error(err.message || 'İçe aktarma başarısız')
    im.importing = false
  }
}

async function closeImportAndReload() {
  importModal.value.show = false
  await loadRoots()
}

onMounted(loadRoots)
</script>
