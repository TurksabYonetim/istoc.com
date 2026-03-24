<template>
  <aside
    id="sidePanel"
    class="sidebar-panel border-r sidebar-panel-border flex flex-col transition-all duration-200 sticky top-0 h-screen flex-shrink-0 overflow-hidden"
    :style="{ width: sidebar.panelVisible ? '290px' : '0px' }"
  >
    <!-- Panel Header -->
    <div class="flex items-center justify-between h-[56px] px-4 border-b sidebar-panel-border flex-shrink-0">
      <span class="sidebar-panel-title tracking-tight truncate">{{ nav.sectionTitle }}</span>
      <button
        class="rounded-md flex items-center justify-center sidebar-panel-close-btn transition-all flex-shrink-0"
        @click="sidebar.togglePanel()"
        title="Paneli Kapat"
      >
        <AppIcon name="chevrons-left" :size="14" />
      </button>
    </div>

    <!-- Panel Content -->
    <div class="flex-1 overflow-y-auto panel-scroll py-3">
      <template v-for="(group, idx) in nav.currentGroups" :key="idx">
        <!-- Group Title (clickable accordion header) -->
        <div
          v-if="group.title"
          class="panel-group-title"
          :style="{ '--group-color': group.color || '#7c3aed' }"
          @click="nav.toggleGroup(group.title)"
        >
          <div class="panel-group-title-left">
            <div class="panel-group-color-bar"></div>
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">{{ group.title }}</span>
          </div>
          <div class="panel-group-title-right">
            <span class="pg-count" :style="{ '--group-color': group.color || '#7c3aed' }">{{ group.items.length }}</span>
            <svg
              class="panel-group-chevron"
              :class="{ open: nav.isGroupOpen(group.title) }"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <!-- Group Items -->
        <div
          class="panel-group"
          :class="{
            collapsible: !!group.title,
            open: !group.title || nav.isGroupOpen(group.title)
          }"
        >
          <router-link
            v-for="item in group.items"
            :key="item.label"
            :to="getItemRoute(item)"
            class="panel-item"
            :class="{ active: isItemActive(item) }"
            @click="handleItemClick(item)"
          >
            <AppIcon :name="item.icon" :size="15" class="panel-item-icon" />
            {{ item.label }}
          </router-link>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'
import { useSidebarStore } from '@/stores/sidebar'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

const nav = useNavigationStore()
const sidebar = useSidebarStore()
const route = useRoute()

function getItemRoute(item) {
  if (item.route) return item.route
  if (item.doctype) return `/app/${encodeURIComponent(item.doctype)}`
  if (item.report) return `/app/report/${encodeURIComponent(item.report)}`
  return '#'
}

function isItemActive(item) {
  const currentPath = route.path
  const itemPath = getItemRoute(item)
  return currentPath === itemPath
}

function handleItemClick(item) {
  nav.setActiveItem(item.doctype || item.report || item.route)
}
</script>
