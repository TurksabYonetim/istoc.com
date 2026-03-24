<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">Ürünlerim</h1>
        <p class="text-xs text-gray-400 mt-0.5">Ürünlerinizin durumunu takip edin ve yönetin</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="loadListings" class="hdr-btn-outlined flex items-center gap-1.5">
          <AppIcon name="refresh-cw" :size="13" />
          Yenile
        </button>
        <button @click="goToNewListing" class="hdr-btn-primary flex items-center gap-1.5">
          <AppIcon name="plus" :size="13" />
          Yeni Ekle
        </button>
      </div>
    </div>

    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <div v-else-if="listings.length === 0" class="card text-center py-12">
      <AppIcon name="package" :size="32" class="text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-400">Henüz ürün eklenmemiş.</p>
    </div>

    <div v-else class="card overflow-hidden p-0">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 dark:border-[#2a2a35] bg-gray-50 dark:bg-[#1a1a25]">
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Ürün</th>
            <th class="text-right text-xs font-semibold text-gray-500 px-4 py-3">Fiyat</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Stok</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Durum</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-[#2a2a35]">
          <tr v-for="listing in listings" :key="listing.name"
              class="hover:bg-gray-50 dark:hover:bg-[#1e1e2a] transition-colors cursor-pointer"
              @click.self="goToListing(listing.name)">
            <td class="px-4 py-3 cursor-pointer" @click="goToListing(listing.name)">
              <p class="font-medium text-gray-800 dark:text-gray-200 text-xs hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{{ listing.title }}</p>
              <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ listing.listing_code }}</p>
            </td>
            <td class="px-4 py-3 text-right text-xs font-semibold text-gray-800 dark:text-gray-200">
              {{ listing.currency }} {{ Number(listing.selling_price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2}) }}
            </td>
            <td class="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
              {{ listing.available_qty || 0 }} / {{ listing.stock_qty || 0 }}
            </td>
            <td class="px-4 py-3 text-center">
              <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full" :class="statusClass(listing.status)">
                {{ statusLabel(listing.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <!-- Onaylanmamış: değişiklik yapılamaz -->
              <span v-if="!isApproved(listing.status)" class="text-xs text-gray-400 italic">
                {{ listing.status === 'Pending' ? 'Onay bekleniyor' : 'Reddedildi' }}
              </span>
              <!-- Onaylanmış: durum değiştirme -->
              <div v-else class="flex items-center justify-center gap-1">
                <select
                  :value="listing.status"
                  @change="changeStatus(listing, $event.target.value)"
                  :disabled="changingId === listing.name"
                  class="text-xs border border-gray-200 dark:border-[#2a2a35] rounded-lg px-2 py-1 bg-white dark:bg-[#16161f] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-400 disabled:opacity-60"
                >
                  <option value="Active">Aktif</option>
                  <option value="Paused">Duraklatıldı</option>
                  <option value="Out of Stock">Stok Yok</option>
                </select>
                <AppIcon v-if="changingId === listing.name" name="loader" :size="13" class="animate-spin text-violet-500" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total > pageSize" class="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>Toplam {{ total }} ürün</span>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page <= 1" class="px-3 py-1 border rounded disabled:opacity-40">← Önceki</button>
        <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="nextPage" :disabled="page >= Math.ceil(total / pageSize)" class="px-3 py-1 border rounded disabled:opacity-40">Sonraki →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

const router = useRouter()
const toast = useToast()
const listings = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const changingId = ref(null)

const APPROVED_STATUSES = new Set(['Active', 'Paused', 'Out of Stock'])

function isApproved(status) {
  return APPROVED_STATUSES.has(status)
}

function statusLabel(status) {
  const map = {
    Pending: 'Onay Bekliyor',
    Draft: 'Taslak',
    Active: 'Aktif',
    Paused: 'Duraklatıldı',
    'Out of Stock': 'Stok Yok',
    Archived: 'Arşivlendi',
    Rejected: 'Reddedildi',
  }
  return map[status] || status
}

function statusClass(status) {
  const map = {
    Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    Draft: 'bg-gray-100 text-gray-600 border border-gray-200',
    Active: 'bg-green-50 text-green-700 border border-green-200',
    Paused: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'Out of Stock': 'bg-red-50 text-red-600 border border-red-200',
    Archived: 'bg-gray-100 text-gray-500 border border-gray-200',
    Rejected: 'bg-red-50 text-red-700 border border-red-200',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

async function loadListings() {
  loading.value = true
  try {
    const res = await api.callMethod('tradehub_core.api.listing.get_seller_listings', {
      page: page.value,
      page_size: pageSize,
    })
    listings.value = res.message?.listings || []
    total.value = res.message?.total || 0
  } catch (err) {
    toast.error(err.message || 'Ürünler yüklenemedi')
  } finally {
    loading.value = false
  }
}

async function changeStatus(listing, newStatus) {
  if (newStatus === listing.status) return
  changingId.value = listing.name
  try {
    await api.callMethod('tradehub_core.api.listing.update_listing_status', {
      listing_name: listing.name,
      status: newStatus,
    }, true)
    listing.status = newStatus
    toast.success('Durum güncellendi.')
  } catch (err) {
    toast.error(err.message || 'Durum güncellenemedi')
  } finally {
    changingId.value = null
  }
}

function goToNewListing() {
  router.push({ path: '/app/Listing/new', query: { returnTo: '/seller-listings' } })
}

function goToListing(name) {
  router.push({ path: `/app/Listing/${encodeURIComponent(name)}`, query: { returnTo: '/seller-listings' } })
}

function prevPage() {
  if (page.value > 1) { page.value--; loadListings() }
}
function nextPage() {
  if (page.value < Math.ceil(total.value / pageSize)) { page.value++; loadListings() }
}

onMounted(loadListings)
</script>
