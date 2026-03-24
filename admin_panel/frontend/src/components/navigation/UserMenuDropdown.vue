<template>
  <Transition name="dropdown">
    <div
      v-if="open"
      class="absolute bottom-2 left-[78px] w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 z-[60]"
      @click.stop
    >
      <div class="p-4 flex items-center gap-3 border-b border-gray-100">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {{ tenant.activeTenant?.initials || 'AK' }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ tenant.activeTenant?.name || 'Admin' }}</p>
            <span class="text-[9px] font-bold uppercase bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded flex-shrink-0">Pro</span>
          </div>
          <p class="text-[11px] text-gray-400 truncate mt-0.5">{{ auth.user?.email || 'admin@tradehub.com' }}</p>
        </div>
      </div>
      <div class="py-1.5">
        <a href="#" class="dd-item" @click.prevent="emit('navigate', '/settings/profile')">Profilim</a>
        <a href="#" class="dd-item" @click.prevent="emit('navigate', '/settings')">Hesabım</a>
        <a href="#" class="dd-item" @click.prevent="emit('navigate', '/subscription')">Aboneliğim</a>
      </div>
      <div class="border-t border-gray-100 py-1.5">
        <div class="dd-item justify-between cursor-default">
          <span>Tema</span>
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              class="flex items-center justify-center w-7 h-7 rounded-md text-[12px] transition-all"
              :class="currentTheme === 'light' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              @click.stop="emit('set-theme', 'light')"
            >
              <AppIcon name="sun" :size="12" />
            </button>
            <button
              class="flex items-center justify-center w-7 h-7 rounded-md text-[12px] transition-all"
              :class="currentTheme === 'dark' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              @click.stop="emit('set-theme', 'dark')"
            >
              <AppIcon name="moon" :size="12" />
            </button>
          </div>
        </div>
        <div class="dd-item justify-between cursor-default">
          <span>Dil</span>
          <span class="text-xs text-gray-400 flex items-center gap-1">Türkçe 🇹🇷</span>
        </div>
      </div>
      <div class="border-t border-gray-100 py-1.5">
        <a href="#" class="dd-item text-red-500" @click.prevent="emit('logout')">Oturumu Kapat</a>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useTenantStore } from '@/stores/tenant'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  open: { type: Boolean, default: false },
  currentTheme: { type: String, default: 'light' },
})
const emit = defineEmits(['navigate', 'logout', 'set-theme'])

const tenant = useTenantStore()
const auth = useAuthStore()
</script>
