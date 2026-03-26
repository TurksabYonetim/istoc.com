<template>
  <div class="w-full flex-shrink-0 border-b sidebar-rail-border relative">
    <div
      class="w-full flex flex-col items-center justify-center h-[68px] gap-1"
    >
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 bg-gradient-to-br"
        :class="tenant.activeTenant?.gradient || 'from-violet-500 to-indigo-600'"
      >
        <span class="text-white text-[11px] font-extrabold">{{ tenant.activeTenant?.initials || '??' }}</span>
      </div>
      <span class="text-[9px] font-semibold tenant-switcher-label truncate max-w-[58px]">{{ tenant.shortName }}</span>
    </div>
  </div>
</template>

<script setup>
import { useTenantStore } from '@/stores/tenant'
const tenant = useTenantStore()
</script>
