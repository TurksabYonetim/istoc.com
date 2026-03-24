<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">Ürün Moderasyonu</h1>
        <p class="text-xs text-gray-400 mt-0.5">Onay bekleyen listing'leri inceleyin ve onaylayın</p>
      </div>
      <button @click="loadListings" class="hdr-btn-outlined flex items-center gap-1.5">
        <AppIcon name="refresh-cw" :size="13" />
        Yenile
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="listings.length === 0" class="card text-center py-12">
      <AppIcon name="check-circle" :size="32" class="text-emerald-400 mx-auto mb-3" />
      <p class="text-sm text-gray-400">Onay bekleyen ürün bulunmuyor.</p>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden p-0">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 dark:border-[#2a2a35] bg-gray-50 dark:bg-[#1a1a25]">
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Ürün</th>
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Satıcı</th>
            <th class="text-right text-xs font-semibold text-gray-500 px-4 py-3">Fiyat</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Stok</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Tarih</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-[#2a2a35]">
          <tr v-for="listing in listings" :key="listing.name"
              class="hover:bg-gray-50 dark:hover:bg-[#1e1e2a] transition-colors">
            <!-- Product -->
            <td class="px-4 py-3">
              <p class="font-medium text-gray-800 dark:text-gray-200 text-xs">{{ listing.title }}</p>
              <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ listing.listing_code }}</p>
            </td>
            <!-- Seller -->
            <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
              {{ listing.seller_name }}
            </td>
            <!-- Price -->
            <td class="px-4 py-3 text-right text-xs font-semibold text-gray-800 dark:text-gray-200">
              {{ listing.currency }} {{ Number(listing.selling_price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2}) }}
            </td>
            <!-- Stock -->
            <td class="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
              {{ listing.stock_qty || 0 }}
            </td>
            <!-- Date -->
            <td class="px-4 py-3 text-center text-xs text-gray-500">
              {{ formatDate(listing.creation) }}
            </td>
            <!-- Actions -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openDetail(listing)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <AppIcon name="eye" :size="11" />
                  İncele
                </button>
                <button
                  @click="handleAction(listing, 'approve')"
                  :disabled="processingId === listing.name"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  <AppIcon v-if="processingId === listing.name" name="loader" :size="11" class="animate-spin" />
                  <AppIcon v-else name="check" :size="11" />
                  Onayla
                </button>
                <button
                  @click="openRejectModal(listing)"
                  :disabled="processingId === listing.name"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  <AppIcon name="x" :size="11" />
                  Reddet
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="total > pageSize" class="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>Toplam {{ total }} listing</span>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page <= 1" class="px-3 py-1 border rounded disabled:opacity-40">← Önceki</button>
        <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="nextPage" :disabled="page >= Math.ceil(total / pageSize)" class="px-3 py-1 border rounded disabled:opacity-40">Sonraki →</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedListing" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="selectedListing = null"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[520px] max-w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Listing Detayı</h3>
          <button @click="selectedListing = null" class="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
            <AppIcon name="x" :size="18" />
          </button>
        </div>
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-400 mb-1">Başlık</p>
              <p class="font-medium text-gray-800 dark:text-gray-200">{{ selectedListing.title }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Satıcı</p>
              <p class="font-medium text-gray-800 dark:text-gray-200">{{ selectedListing.seller_name }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Fiyat</p>
              <p class="font-medium text-gray-800 dark:text-gray-200">
                {{ selectedListing.currency }} {{ Number(selectedListing.selling_price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2}) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Stok</p>
              <p class="font-medium text-gray-800 dark:text-gray-200">{{ selectedListing.stock_qty || 0 }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Kod</p>
              <p class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ selectedListing.listing_code }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Eklenme Tarihi</p>
              <p class="text-gray-600 dark:text-gray-400">{{ formatDate(selectedListing.creation) }}</p>
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-end mt-6">
          <button @click="selectedListing = null" class="hdr-btn-outlined">Kapat</button>
          <button @click="handleAction(selectedListing, 'reject'); selectedListing = null" class="hdr-btn-danger">Reddet</button>
          <button @click="handleAction(selectedListing, 'approve'); selectedListing = null" class="hdr-btn-primary">Onayla</button>
        </div>
      </div>
    </div>

    <!-- Reject Reason Modal -->
    <div v-if="rejectModal.show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="rejectModal.show = false"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[420px] max-w-[calc(100vw-32px)]">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Reddetme Sebebi</h3>
        <textarea
          v-model="rejectModal.reason"
          rows="3"
          placeholder="İsteğe bağlı — satıcıya bildirilecek..."
          class="w-full border border-gray-200 dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#16161f] text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
        ></textarea>
        <div class="flex gap-3 justify-end mt-4">
          <button @click="rejectModal.show = false" class="hdr-btn-outlined">İptal</button>
          <button @click="confirmReject" :disabled="processingId !== null" class="hdr-btn-danger">
            <AppIcon v-if="processingId" name="loader" :size="13" class="animate-spin" />
            Reddet
          </button>
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

const listings = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const processingId = ref(null)
const selectedListing = ref(null)
const rejectModal = ref({ show: false, listing: null, reason: '' })

async function loadListings() {
  loading.value = true
  try {
    const res = await api.callMethod('tradehub_core.api.listing.get_pending_listings', {
      page: page.value,
      page_size: pageSize,
    })
    listings.value = res.message?.listings || []
    total.value = res.message?.total || 0
  } catch (err) {
    toast.error(err.message || 'Listing\'ler yüklenemedi')
  } finally {
    loading.value = false
  }
}

async function handleAction(listing, action, rejectReason = '') {
  processingId.value = listing.name
  try {
    await api.callMethod('tradehub_core.api.listing.approve_listing', {
      listing_name: listing.name,
      action,
      reject_reason: rejectReason,
    }, true)
    const label = action === 'approve' ? 'onaylandı' : 'reddedildi'
    toast.success(`"${listing.title}" ${label}.`)
    await loadListings()
  } catch (err) {
    toast.error(err.message || 'İşlem başarısız')
  } finally {
    processingId.value = null
  }
}

function openDetail(listing) {
  selectedListing.value = listing
}

function openRejectModal(listing) {
  rejectModal.value = { show: true, listing, reason: '' }
}

async function confirmReject() {
  const { listing, reason } = rejectModal.value
  rejectModal.value.show = false
  await handleAction(listing, 'reject', reason)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function prevPage() {
  if (page.value > 1) { page.value--; loadListings() }
}
function nextPage() {
  if (page.value < Math.ceil(total.value / pageSize)) { page.value++; loadListings() }
}

onMounted(loadListings)
</script>
