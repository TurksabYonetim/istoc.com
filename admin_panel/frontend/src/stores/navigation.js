import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  adminPanelSections, adminSectionTitles,
  sellerPanelSections, sellerSectionTitles,
} from '@/data/navigation'
import { useSidebarStore } from '@/stores/sidebar'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY = 'th_nav_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveState(section, groups) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      section,
      groups: [...groups],
    }))
  } catch { /* ignore */ }
}

export const useNavigationStore = defineStore('navigation', () => {
  const saved = loadState()

  const activeSection = ref(saved?.section || 'dashboard')
  const activePanelItem = ref(null)
  const openGroups = ref(new Set(saved?.groups || []))

  // Role-aware panel sections — auth store'dan dinamik okuma
  function getActiveSections() {
    const auth = useAuthStore()
    return auth.isSeller && !auth.isAdmin ? sellerPanelSections : adminPanelSections
  }

  function getActiveSectionTitles() {
    const auth = useAuthStore()
    return auth.isSeller && !auth.isAdmin ? sellerSectionTitles : adminSectionTitles
  }

  const sectionTitle = computed(() => getActiveSectionTitles()[activeSection.value] || 'TradeHub')

  const currentGroups = computed(() => getActiveSections()[activeSection.value] || [])

  // İlk açılışta kaydedilmiş grup yoksa ilk grubu aç
  if (!saved?.groups?.length) {
    const sections = getActiveSections()
    const groups = sections[activeSection.value] || []
    const first = groups.find(g => g.title)
    if (first) openGroups.value.add(first.title)
  }

  // URL'e göre aktif grubu ve section'ı geri yükle
  function restoreFromUrl(path) {
    const sections = getActiveSections()
    const groups = sections[activeSection.value] || []
    for (const group of groups) {
      if (!group.title) continue
      for (const item of group.items) {
        const itemRoute = item.route || (item.doctype ? `/app/${encodeURIComponent(item.doctype)}` : null)
        if (itemRoute && path.startsWith(itemRoute)) {
          openGroups.value.add(group.title)
          openGroups.value = new Set(openGroups.value)
          activePanelItem.value = item.doctype || item.report || item.route
          saveState(activeSection.value, openGroups.value)
          return
        }
      }
    }
  }

  function switchSection(sectionId) {
    activeSection.value = sectionId
    openGroups.value = new Set()
    const sections = getActiveSections()
    const groups = sections[sectionId] || []
    const firstCollapsible = groups.find(g => g.title)
    if (firstCollapsible) {
      openGroups.value.add(firstCollapsible.title)
    }
    saveState(sectionId, openGroups.value)
    useSidebarStore().openPanel()
  }

  function setActiveItem(itemKey) {
    activePanelItem.value = itemKey
  }

  function toggleGroup(groupTitle) {
    if (openGroups.value.has(groupTitle)) {
      openGroups.value.delete(groupTitle)
    } else {
      openGroups.value.add(groupTitle)
    }
    openGroups.value = new Set(openGroups.value)
    saveState(activeSection.value, openGroups.value)
  }

  function isGroupOpen(groupTitle) {
    return openGroups.value.has(groupTitle)
  }

  return {
    activeSection,
    activePanelItem,
    openGroups,
    sectionTitle,
    currentGroups,
    switchSection,
    setActiveItem,
    toggleGroup,
    isGroupOpen,
    restoreFromUrl,
  }
})
