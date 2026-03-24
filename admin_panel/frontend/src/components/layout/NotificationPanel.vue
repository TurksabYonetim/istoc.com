<template>
  <Transition name="dropdown">
    <div
      v-if="activeOverlay === 'notifications'"
      id="notificationPanel"
      class="fixed top-[60px] right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[380px] bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/5 z-50 overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h3 class="text-sm font-bold text-gray-800">Bildirimler</h3>
        <button
          @click="handleMarkAllRead"
          class="text-[11px] text-violet-600 hover:text-violet-700 font-medium"
        >
          Tümünü Okundu İşaretle
        </button>
      </div>

      <!-- Category Tabs -->
      <div class="flex items-center gap-0 border-b border-gray-100 px-3 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in categoryTabs"
          :key="tab.key"
          class="notif-tab"
          :class="{ active: activeCategory === tab.key }"
          @click="activeCategory = tab.key"
        >
          <AppIcon :name="tab.icon" :size="10" class="mr-1" />
          {{ tab.label }}
          <span v-if="getCategoryCount(tab.key)" class="notif-tab-badge">{{ getCategoryCount(tab.key) }}</span>
        </button>
      </div>

      <!-- Notification List -->
      <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
        <div
          v-for="n in filteredNotifications"
          :key="n.id"
          class="notif-item"
          :class="{ unread: !n.read }"
          @click="notifications.markRead(n.id)"
        >
          <div :class="`notif-dot-${n.dot}`"></div>
          <div class="flex-1">
            <p class="text-xs text-gray-800" v-html="n.message"></p>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ n.time }}</p>
          </div>
        </div>
        <div v-if="filteredNotifications.length === 0" class="py-8 text-center">
          <AppIcon name="bell-off" :size="20" class="text-gray-300 mb-2" />
          <p class="text-xs text-gray-400">Bu kategoride bildirim yok</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-gray-100 text-center">
        <router-link to="/messaging/notifications" class="text-xs font-medium text-violet-600 hover:text-violet-700">
          Tüm Bildirimleri Gör
        </router-link>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useToast } from '@/composables/useToast'
import { useOverlay } from '@/composables/useOverlay'
import AppIcon from '@/components/common/AppIcon.vue'

const notifications = useNotificationStore()
const toast = useToast()
const { active: activeOverlay } = useOverlay()

const activeCategory = ref('all')

const categoryTabs = [
  { key: 'all', label: 'Tümü', icon: 'bell' },
  { key: 'order', label: 'Siparişler', icon: 'shopping-cart' },
  { key: 'rfq', label: 'Teklifler', icon: 'file-text' },
  { key: 'stock', label: 'Stok', icon: 'package' },
]

const filteredNotifications = computed(() => {
  if (activeCategory.value === 'all') return notifications.notifications
  return notifications.notifications.filter(n => n.category === activeCategory.value)
})

function getCategoryCount(key) {
  if (key === 'all') return notifications.unreadCount
  return notifications.notifications.filter(n => n.category === key && !n.read).length
}

function handleMarkAllRead() {
  notifications.markAllRead()
  toast.success('Tüm bildirimler okundu')
}
</script>

<style scoped>
.notif-tab {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 8px 10px;
  color: #9ca3af;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  transition: all 0.15s;
}
.notif-tab:hover {
  color: #6b7280;
}
.notif-tab.active {
  color: #7c3aed;
  border-bottom-color: #7c3aed;
  font-weight: 600;
}
.notif-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  margin-left: 4px;
  background: #ef4444;
  color: white;
  line-height: 1;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>