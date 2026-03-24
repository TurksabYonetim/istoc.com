<template>
  <header class="app-header">
    <!-- Left: Hamburger + Breadcrumb -->
    <div class="hdr-left">
      <!-- Hamburger: visible when panel is collapsed -->
      <button
        v-if="!sidebar.panelVisible"
        class="hdr-hamburger"
        @click="sidebar.togglePanel()"
      >
        <AppIcon name="menu" :size="16" />
      </button>

      <!-- Dynamic Breadcrumb -->
      <nav class="hdr-breadcrumb" aria-label="Breadcrumb">
        <router-link to="/dashboard" class="hdr-crumb-link">Ana Sayfa</router-link>

        <!-- Section (clickable) -->
        <template v-if="sectionLabel && sectionLabel !== 'Ana Sayfa'">
          <AppIcon name="chevron-right" :size="10" class="hdr-crumb-sep" />
          <router-link :to="sectionRoute" class="hdr-crumb-link" @click="onSectionClick">{{ sectionLabel }}</router-link>
        </template>

        <!-- Group title (not clickable) -->
        <template v-if="groupLabel">
          <AppIcon name="chevron-right" :size="10" class="hdr-crumb-sep" />
          <span class="hdr-crumb-text">{{ groupLabel }}</span>
        </template>

        <!-- Parent item (clickable on form views) -->
        <template v-if="parentLabel">
          <AppIcon name="chevron-right" :size="10" class="hdr-crumb-sep" />
          <router-link v-if="parentRoute" :to="parentRoute" class="hdr-crumb-link">{{ parentLabel }}</router-link>
          <span v-else class="hdr-crumb-text">{{ parentLabel }}</span>
        </template>

        <!-- Current page -->
        <template v-if="currentLabel && currentLabel !== sectionLabel">
          <AppIcon name="chevron-right" :size="10" class="hdr-crumb-sep" />
          <span class="hdr-crumb-current">{{ currentLabel }}</span>
        </template>
      </nav>
    </div>

    <!-- Right: Search + Raporlar -->
    <div class="hdr-right">
      <!-- Search -->
      <div class="hdr-search-wrap">
        <AppIcon name="search" :size="13" class="hdr-search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Ara.. (⌘K)"
          class="hdr-search-input"
          @focus="showSearchResults = true"
          @blur="hideSearchResults"
          @keydown.escape="showSearchResults = false"
        >
        <GlobalSearch
          v-if="showSearchResults && searchQuery.length >= 2"
          :query="searchQuery"
          @select="handleSearchSelect"
        />
      </div>

      <!-- Raporlar -->
      <button class="hdr-btn-outlined" @click="navigateTo('/app/report/general')" title="Raporlar">
        <AppIcon name="clipboard-list" :size="14" />
        <span>Raporlar</span>
      </button>

      <!-- Notifications -->
      <button class="hdr-icon-btn relative" @click.stop="handleNotificationClick" title="Bildirimler">
        <AppIcon name="bell" :size="15" />
        <span
          v-if="notifications.hasUnread"
          class="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"
        ></span>
      </button>

      <!-- Quick Links -->
      <div class="relative">
        <button class="hdr-icon-btn" @click.stop="toggleQuickLinks" title="Quick Links">
          <AppIcon name="grid-3x3" :size="15" />
        </button>
        <Transition name="dropdown">
          <div
            v-if="activeOverlay === 'headerQuickLinks'"
            class="absolute top-[calc(100%+8px)] right-0 w-[300px] bg-white border border-gray-200 rounded-lg shadow-2xl shadow-black/12 z-[60] overflow-hidden"
            @click.stop
          >
            <div class="flex flex-col items-center justify-center py-5 bg-gradient-to-r from-violet-600 to-indigo-700 relative">
              <h3 class="text-white font-semibold text-sm">Quick Links</h3>
              <span class="inline-block mt-1.5 text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-md font-medium">Hızlı Erişim</span>
            </div>
            <div class="grid grid-cols-2">
              <a href="#" class="flex flex-col items-center gap-2 py-5 border-r border-b border-gray-100 hover:bg-gray-50 transition-colors" @click.prevent="navigateTo('/app/accounting')">
                <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><AppIcon name="file-text" :size="18" class="text-violet-600" /></div>
                <div class="text-center"><p class="text-xs font-semibold text-gray-800">Muhasebe</p><p class="text-[10px] text-gray-400">Hesaplar</p></div>
              </a>
              <a href="#" class="flex flex-col items-center gap-2 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors" @click.prevent="navigateTo('/app/admin')">
                <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><AppIcon name="shield" :size="18" class="text-violet-600" /></div>
                <div class="text-center"><p class="text-xs font-semibold text-gray-800">Yönetim</p><p class="text-[10px] text-gray-400">Konsol</p></div>
              </a>
              <a href="#" class="flex flex-col items-center gap-2 py-5 border-r border-gray-100 hover:bg-gray-50 transition-colors" @click.prevent="navigateTo('/app/projects')">
                <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><AppIcon name="folder-open" :size="18" class="text-violet-600" /></div>
                <div class="text-center"><p class="text-xs font-semibold text-gray-800">Projeler</p><p class="text-[10px] text-gray-400">Görevler</p></div>
              </a>
              <a href="#" class="flex flex-col items-center gap-2 py-5 hover:bg-gray-50 transition-colors" @click.prevent="navigateTo('/app/support')">
                <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><AppIcon name="headphones" :size="18" class="text-violet-600" /></div>
                <div class="text-center"><p class="text-xs font-semibold text-gray-800">Destek</p><p class="text-[10px] text-gray-400">Talepler</p></div>
              </a>
            </div>
            <div class="px-4 py-2.5 border-t border-gray-100 text-center">
              <a href="#" class="text-xs font-medium text-gray-400 hover:text-violet-600 transition-colors" @click.prevent="navigateTo('/dashboard')">
                Tümünü Gör <AppIcon name="chevron-right" :size="8" class="ml-0.5 inline" />
              </a>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { useNotificationStore } from '@/stores/notification'
import { useOverlay } from '@/composables/useOverlay'
import { sectionTitles, lookupNavItem, getFirstSectionRoute } from '@/data/navigation'
import { useNavigationStore } from '@/stores/navigation'
import GlobalSearch from '@/components/common/GlobalSearch.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const sidebar = useSidebarStore()
const notifications = useNotificationStore()
const nav = useNavigationStore()
const { active: activeOverlay, toggle: toggleOverlay, close: closeOverlays } = useOverlay()

const searchQuery = ref('')
const showSearchResults = ref(false)

// ── Breadcrumb computed ─────────────────────────────────────
// Unified nav lookup — works for ALL route types (named + generic)
const dynamicNav = computed(() => {
  const routeName = route.name

  // 1. Named routes: lookup by route path (ör: /app/rfq-list → sales/RFQ)
  let found = lookupNavItem(route.path, 'route')
  if (found) return found

  // 2. Named detail routes: lookup by parent route (ör: /app/rfq/:name → parent /app/rfq-list)
  if (route.meta?.breadcrumbParentRoute) {
    found = lookupNavItem(route.meta.breadcrumbParentRoute, 'route')
    if (found) return found
  }

  // 3. Generic DocTypeList / DocTypeForm
  if (routeName === 'DocTypeList' || routeName === 'DocTypeForm') {
    const dt = route.params.doctype
    if (dt) {
      found = lookupNavItem(decodeURIComponent(dt), 'doctype')
      if (found) return found
    }
  }

  // 4. ReportView
  if (routeName === 'ReportView') {
    const rpt = route.params.report
    if (rpt) {
      found = lookupNavItem(decodeURIComponent(rpt), 'report')
      if (found) return found
    }
  }

  return null
})

// Is this a form/detail view? (needs parent item as clickable link)
const isFormView = computed(() => {
  const n = route.name
  return n === 'DocTypeForm' || !!route.meta?.breadcrumbParent
})

// Section: full title from sectionTitles (not short rail label)
const sectionLabel = computed(() => {
  if (dynamicNav.value) return dynamicNav.value.sectionTitle
  const section = route.meta?.section
  if (!section) return null
  return sectionTitles[section] || null
})

// Section click target: first item route of that section
const sectionRoute = computed(() => {
  const sectionId = dynamicNav.value?.sectionId || route.meta?.section
  if (!sectionId) return '/dashboard'
  return getFirstSectionRoute(sectionId)
})

// Group title (new breadcrumb level)
const groupLabel = computed(() => {
  return dynamicNav.value?.groupTitle || null
})

// Parent item label (shown on form views as clickable link back to list)
const parentLabel = computed(() => {
  if (!isFormView.value) return null
  if (dynamicNav.value) return dynamicNav.value.itemLabel
  return route.meta?.breadcrumbParent || null
})

// Parent item route (list page for the current form)
const parentRoute = computed(() => {
  if (!isFormView.value) return null
  if (route.name === 'DocTypeForm' && route.params.doctype) {
    return `/app/${encodeURIComponent(route.params.doctype)}`
  }
  return route.meta?.breadcrumbParentRoute || null
})

// Current page label (last crumb, not clickable)
const currentLabel = computed(() => {
  // Form views: show record name or meta breadcrumb
  if (isFormView.value) {
    if (route.name === 'DocTypeForm') {
      return route.params.name ? decodeURIComponent(route.params.name) : null
    }
    return route.meta?.breadcrumb || route.meta?.title || null
  }
  // List/report views: show item label from nav lookup
  if (dynamicNav.value) return dynamicNav.value.itemLabel
  return route.meta?.breadcrumb || route.meta?.title || null
})

// Section click handler: also switch sidebar to matching section
function onSectionClick() {
  const sectionId = dynamicNav.value?.sectionId || route.meta?.section
  if (sectionId) nav.switchSection(sectionId)
}

// ── Handlers ────────────────────────────────────────────────
function handleNotificationClick() {
  toggleOverlay('notifications')
}

function toggleQuickLinks() {
  toggleOverlay('headerQuickLinks')
}

function navigateTo(path) {
  closeOverlays()
  router.push(path)
}

function hideSearchResults() {
  setTimeout(() => { showSearchResults.value = false }, 200)
}

function handleSearchSelect(item) {
  searchQuery.value = ''
  showSearchResults.value = false
}

function handleOutsideClick(e) {
  if (!e.target.closest('.hdr-icon-btn') &&
      !e.target.closest('#notificationPanel') &&
      !e.target.closest('.rail-icon') &&
      !e.target.closest('.rail-avatar-btn') &&
      !e.target.closest('[class*="absolute bottom"]')) {
    closeOverlays()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
