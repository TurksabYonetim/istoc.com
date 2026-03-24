<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-[15px] font-bold text-gray-900 dark:text-gray-100">Siparişlerim</h1>
        <p class="text-xs text-gray-400 mt-0.5">Siparişleri takip edin ve ödeme onaylayın</p>
      </div>
      <button @click="loadOrders" class="hdr-btn-outlined flex items-center gap-1.5">
        <AppIcon name="refresh-cw" :size="13" />
        Yenile
      </button>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id; loadOrders()"
        class="px-4 py-1.5 text-xs font-medium rounded-full border transition-colors"
        :class="activeTab === tab.id
          ? 'bg-violet-600 text-white border-violet-600'
          : 'bg-white text-gray-600 border-gray-300 dark:bg-[#1e1e2a] dark:text-gray-400 dark:border-[#2a2a35] hover:border-violet-400'"
      >
        {{ tab.label }}
        <span v-if="tab.id === 'unpaid' && unpaidCount > 0" class="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ unpaidCount }}</span>
        <span v-if="tab.id === 'refund' && refundCount > 0" class="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ refundCount }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card text-center py-12">
      <AppIcon name="loader" :size="24" class="text-violet-500 animate-spin mx-auto" />
      <p class="text-sm text-gray-400 mt-3">Yükleniyor...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="card text-center py-12">
      <AppIcon name="package" :size="32" class="text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-400">Bu durumda sipariş bulunamadı.</p>
    </div>

    <!-- Orders Table -->
    <div v-else class="card overflow-hidden p-0">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 dark:border-[#2a2a35] bg-gray-50 dark:bg-[#1a1a25]">
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Sipariş No</th>
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Tarih</th>
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Alıcı</th>
            <th class="text-left text-xs font-semibold text-gray-500 px-4 py-3">Ürünler</th>
            <th class="text-right text-xs font-semibold text-gray-500 px-4 py-3">Tutar</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">Durum</th>
            <th class="text-center text-xs font-semibold text-gray-500 px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-[#2a2a35]">
          <tr v-for="order in orders" :key="order.name" class="hover:bg-gray-50 dark:hover:bg-[#1e1e2a] transition-colors">
            <!-- Order Number -->
            <td class="px-4 py-3">
              <span class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">{{ order.order_number }}</span>
            </td>
            <!-- Date -->
            <td class="px-4 py-3 text-xs text-gray-500">
              {{ formatDate(order.order_date) }}
            </td>
            <!-- Buyer -->
            <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
              {{ order.buyer_name || order.buyer }}
            </td>
            <!-- Products -->
            <td class="px-4 py-3">
              <div class="space-y-0.5">
                <p v-for="item in order.items" :key="item.product_name" class="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                  {{ item.product_name }} × {{ item.quantity }}
                </p>
              </div>
            </td>
            <!-- Total -->
            <td class="px-4 py-3 text-right">
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ order.currency }} {{ Number(order.total || 0).toFixed(2) }}
              </span>
            </td>
            <!-- Status -->
            <td class="px-4 py-3 text-center">
              <span
                class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
                :class="statusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </td>
            <!-- Action -->
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center gap-1.5">
                <!-- Receipt link -->
                <a
                  v-if="order.receipt_url"
                  :href="order.receipt_url"
                  target="_blank"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                  title="Dekontu görüntüle"
                >
                  <AppIcon name="file-text" :size="11" />
                  Dekont
                </a>
                <!-- Confirm payment -->
                <button
                  v-if="order.status === 'Ödeme Bekleniyor'"
                  @click="confirmPayment(order)"
                  :disabled="confirmingOrder === order.name"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <AppIcon v-if="confirmingOrder === order.name" name="loader" :size="11" class="animate-spin" />
                  <AppIcon v-else name="check-circle" :size="11" />
                  Ödemeyi Onayla
                </button>
                <!-- Refund request badge + actions -->
                <template v-if="order.refund_status === 'Pending'">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full">
                    <AppIcon name="alert-circle" :size="9" />
                    İade Talebi
                  </span>
                  <div class="flex gap-1 mt-0.5">
                    <button @click="handleRefund(order, 'approve')"
                      class="px-2 py-1 text-[10px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded border-none cursor-pointer transition-colors">
                      Onayla
                    </button>
                    <button @click="handleRefund(order, 'reject')"
                      class="px-2 py-1 text-[10px] font-medium text-white bg-red-600 hover:bg-red-700 rounded border-none cursor-pointer transition-colors">
                      Reddet
                    </button>
                  </div>
                </template>
                <span v-if="order.refund_status === 'Approved'" class="text-[10px] text-emerald-600 font-medium">İade Onaylandı</span>
                <span v-if="order.refund_status === 'Rejected'" class="text-[10px] text-red-500 font-medium">İade Reddedildi</span>
                <span v-if="!order.receipt_url && order.status !== 'Ödeme Bekleniyor' && !order.refund_status" class="text-xs text-gray-400">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="total > pageSize" class="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>Toplam {{ total }} sipariş</span>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page <= 1" class="px-3 py-1 border rounded disabled:opacity-40">← Önceki</button>
        <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="nextPage" :disabled="page >= Math.ceil(total / pageSize)" class="px-3 py-1 border rounded disabled:opacity-40">Sonraki →</button>
      </div>
    </div>

    <!-- Refund detail in order row tooltip (shown inline, not modal) -->

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="showConfirmModal = false"></div>
      <div class="relative bg-white dark:bg-[#1e1e2a] rounded-xl shadow-xl p-6 w-[400px] max-w-[calc(100vw-32px)]">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Ödemeyi Onayla</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <strong>{{ pendingOrder?.order_number }}</strong> numaralı sipariş için ödeme onaylanacak.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Alıcı: <strong>{{ pendingOrder?.buyer_name }}</strong> —
          Tutar: <strong>{{ pendingOrder?.currency }} {{ Number(pendingOrder?.total || 0).toFixed(2) }}</strong>
        </p>
        <!-- Receipt preview in confirm modal -->
        <div v-if="pendingOrder?.receipt_url" class="mb-4 p-3 bg-gray-50 dark:bg-[#16161f] border border-gray-200 dark:border-[#2a2a35] rounded-lg">
          <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Alıcının yüklediği dekont:</p>
          <a :href="pendingOrder.receipt_url" target="_blank"
            class="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:underline font-medium">
            <AppIcon name="external-link" :size="12" />
            Dekontu Görüntüle
          </a>
          <p v-if="pendingOrder.remittance_sender" class="text-xs text-gray-500 mt-1">
            Gönderen: <strong>{{ pendingOrder.remittance_sender }}</strong>
            <span v-if="pendingOrder.remittance_amount"> — Tutar: <strong>{{ pendingOrder.currency }} {{ Number(pendingOrder.remittance_amount).toFixed(2) }}</strong></span>
          </p>
        </div>
        <p class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
          Onayladığınızda sipariş "Onaylanıyor" durumuna geçecek ve ürünü hazırlayıp gönderebileceksiniz.
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="showConfirmModal = false" class="hdr-btn-outlined">İptal</button>
          <button @click="doConfirmPayment" :disabled="confirmingOrder !== null" class="hdr-btn-primary">
            <AppIcon v-if="confirmingOrder" name="loader" :size="13" class="animate-spin" />
            Onayla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

const toast = useToast()

const orders = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const activeTab = ref('all')
const confirmingOrder = ref(null)
const showConfirmModal = ref(false)
const pendingOrder = ref(null)

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'unpaid', label: 'Ödeme Bekliyor' },
  { id: 'confirming', label: 'Onaylanıyor' },
  { id: 'delivering', label: 'Kargoda' },
  { id: 'completed', label: 'Tamamlandı' },
  { id: 'refund', label: 'İade Talepleri' },
]

const unpaidCount = computed(() =>
  orders.value.filter(o => o.status === 'Ödeme Bekleniyor').length
)

const refundCount = computed(() =>
  orders.value.filter(o => o.refund_status === 'Pending').length
)

async function loadOrders() {
  loading.value = true
  try {
    const apiStatus = activeTab.value === 'refund' ? 'all' : activeTab.value
    const res = await api.callMethod('tradehub_core.api.order.get_seller_orders', {
      status: apiStatus,
      page: page.value,
      page_size: pageSize,
    })
    let fetchedOrders = res.message?.orders || []
    if (activeTab.value === 'refund') {
      fetchedOrders = fetchedOrders.filter(o => o.refund_status === 'Pending')
    }
    orders.value = fetchedOrders
    total.value = activeTab.value === 'refund' ? fetchedOrders.length : (res.message?.total || 0)
  } catch (err) {
    toast.error(err.message || 'Siparişler yüklenemedi')
  } finally {
    loading.value = false
  }
}

function confirmPayment(order) {
  pendingOrder.value = order
  showConfirmModal.value = true
}

async function doConfirmPayment() {
  if (!pendingOrder.value) return
  confirmingOrder.value = pendingOrder.value.name
  try {
    await api.callMethod('tradehub_core.api.order.seller_confirm_payment', {
      order_number: pendingOrder.value.name,
    })
    toast.success('Ödeme onaylandı! Sipariş "Onaylanıyor" durumuna geçti.')
    showConfirmModal.value = false
    pendingOrder.value = null
    await loadOrders()
  } catch (err) {
    toast.error(err.message || 'Onaylama başarısız')
  } finally {
    confirmingOrder.value = null
  }
}

function statusClass(status) {
  const map = {
    'Ödeme Bekleniyor': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Onaylanıyor': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Kargoda': 'bg-green-50 text-green-700 border border-green-200',
    'Tamamlandı': 'bg-gray-100 text-gray-600 border border-gray-200',
    'İptal Edildi': 'bg-red-50 text-red-600 border border-red-200',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function handleRefund(order, action) {
  try {
    await api.callMethod('tradehub_core.api.order.seller_handle_refund', {
      order_number: order.name,
      action,
    }, true)
    const label = action === 'approve' ? 'onaylandı' : 'reddedildi'
    toast.success(`İade talebi ${label}.`)
    await loadOrders()
  } catch (err) {
    toast.error(err.message || 'İşlem başarısız')
  }
}

function prevPage() {
  if (page.value > 1) { page.value--; loadOrders() }
}

function nextPage() {
  if (page.value < Math.ceil(total.value / pageSize)) { page.value++; loadOrders() }
}

onMounted(loadOrders)
</script>
