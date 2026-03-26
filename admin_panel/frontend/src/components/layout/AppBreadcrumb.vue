<template>
  <div class="flex items-center gap-1.5 px-4 xl:px-6 py-2.5 text-xs text-gray-400 bg-white border-b border-gray-100 dark:bg-[#1a1a2e] dark:border-white/5">
    <router-link to="/dashboard" class="hover:text-violet-600 transition-colors">Ana Sayfa</router-link>
    <template v-if="sectionTitle">
      <i class="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
      <span>{{ sectionTitle }}</span>
    </template>
    <template v-if="parentLabel && parentLink">
      <i class="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
      <router-link :to="parentLink" class="hover:text-violet-600 transition-colors">{{ parentLabel }}</router-link>
    </template>
    <template v-if="currentLabel">
      <i class="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
      <span class="text-gray-600 dark:text-gray-300 font-medium">{{ currentLabel }}</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  lookupNavItem,
  adminPanelSections, sellerPanelSections,
  adminSectionTitles, sellerSectionTitles
} from '@/data/navigation'

const route = useRoute()
const auth = useAuthStore()

const sections = computed(() => auth.isAdmin ? adminPanelSections : sellerPanelSections)
const titles = computed(() => auth.isAdmin ? adminSectionTitles : sellerSectionTitles)

// Find nav item by current route or doctype
const navItem = computed(() => {
  // Try named route first
  if (route.meta?.section) {
    const routePath = route.path
    const byRoute = lookupNavItem(routePath, 'route', sections.value)
    if (byRoute) return byRoute
  }

  // Try doctype (generic DocType list/form)
  if (route.params.doctype) {
    const dt = decodeURIComponent(route.params.doctype)
    const byDoctype = lookupNavItem(dt, 'doctype', sections.value)
    if (byDoctype) return byDoctype
  }

  return null
})

// Section title (e.g., "Mağazam", "Satıcı Yönetimi")
const sectionTitle = computed(() => {
  if (navItem.value?.sectionTitle) return navItem.value.sectionTitle
  if (route.meta?.section) return titles.value[route.meta.section] || null
  return null
})

// Parent label + link (e.g., "Yorumlarım" list page when viewing a form)
const parentLabel = computed(() => {
  if (route.name === 'DocTypeForm' && route.params.doctype) {
    const dt = decodeURIComponent(route.params.doctype)
    const item = lookupNavItem(dt, 'doctype', sections.value)
    return item?.label || dt
  }
  return null
})

const parentLink = computed(() => {
  if (route.name === 'DocTypeForm' && route.params.doctype) {
    return `/app/${route.params.doctype}`
  }
  return null
})

// Current page label
const currentLabel = computed(() => {
  // DocType form → show record name
  if (route.name === 'DocTypeForm' && route.params.name) {
    return decodeURIComponent(route.params.name)
  }

  // DocType list → show nav label or doctype name
  if (route.name === 'DocTypeList' && route.params.doctype) {
    const dt = decodeURIComponent(route.params.doctype)
    const item = lookupNavItem(dt, 'doctype', sections.value)
    return item?.label || dt
  }

  // Named routes → use nav label or route meta
  if (navItem.value?.label) return navItem.value.label
  return route.meta?.breadcrumb || route.meta?.title || null
})
</script>
