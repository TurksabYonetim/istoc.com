<template>
  <div class="w-[60px] h-screen sticky top-0 z-50 sidebar-rail flex flex-col items-center border-r sidebar-rail-border flex-shrink-0">
    <TenantSwitcher />

    <div class="flex-1 w-full flex flex-col items-center py-3 gap-1 overflow-y-auto rail-scroll">
      <button
        v-for="section in railSections"
        :key="section.id"
        class="rail-icon"
        :class="{ active: nav.activeSection === section.id }"
        :data-section="section.id"
        @click="nav.switchSection(section.id)"
      >
        <AppIcon :name="section.icon" :size="18" />
        <span class="rail-label">{{ section.label }}</span>
      </button>
    </div>

    <div class="w-full flex flex-col items-center gap-1 py-3 border-t sidebar-rail-border">
      <button class="rail-icon" @click="toast.info('Yardım merkezi açılıyor...')">
        <AppIcon name="circle-question-mark" :size="18" />
        <span class="rail-label">Yardım</span>
      </button>
      <button
        class="rail-icon"
        @click.stop="toggleOverlay('railQuickLinks')"
      >
        <AppIcon name="grid-3x3" :size="18" />
        <span class="rail-label">Linkler</span>
      </button>
      <button
        class="rail-icon rail-avatar-btn"
        @click.stop="toggleOverlay('railUserMenu')"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-transparent hover:ring-[#6c5dd3]/50 transition-all">
          {{ tenant.activeTenant?.initials || 'AK' }}
        </div>
        <span class="rail-label">Hesap</span>
      </button>
    </div>

    <!-- Dropdown Components -->
    <UserMenuDropdown
      :open="activeOverlay === 'railUserMenu'"
      :current-theme="currentTheme"
      @navigate="navigateTo"
      @logout="handleLogout"
      @set-theme="handleSetTheme"
    />
    <QuickLinksDropdown
      :open="activeOverlay === 'railQuickLinks'"
      @navigate="navigateTo"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminRailSections, sellerRailSections } from '@/data/navigation'
import { useNavigationStore } from '@/stores/navigation'
import { useTenantStore } from '@/stores/tenant'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'
import { useOverlay } from '@/composables/useOverlay'
import TenantSwitcher from '@/components/navigation/TenantSwitcher.vue'
import UserMenuDropdown from '@/components/navigation/UserMenuDropdown.vue'
import QuickLinksDropdown from '@/components/navigation/QuickLinksDropdown.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const nav = useNavigationStore()
const tenant = useTenantStore()
const auth = useAuthStore()

// Rol bazlı rail sections
const railSections = computed(() =>
  auth.isSeller && !auth.isAdmin ? sellerRailSections : adminRailSections
)
const toast = useToast()
const router = useRouter()
const { currentTheme, setTheme } = useTheme()
const { active: activeOverlay, toggle: toggleOverlay, close: closeOverlays } = useOverlay()

function handleSetTheme(theme) {
  setTheme(theme)
  closeOverlays()
  toast.info(`Tema: ${theme === 'dark' ? 'Koyu' : 'Açık'}`)
}

function navigateTo(path) {
  closeOverlays()
  router.push(path)
}

async function handleLogout() {
  closeOverlays()
  await auth.logout()
  router.push('/login')
}

function handleOutsideClick(e) {
  const inside = e.target.closest('[class*="absolute bottom"]')
  const rail = e.target.closest('.rail-icon') || e.target.closest('.rail-avatar-btn')
  const header = e.target.closest('.hdr-icon-btn') || e.target.closest('#notificationPanel')
  if (!inside && !rail && !header) closeOverlays()
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>