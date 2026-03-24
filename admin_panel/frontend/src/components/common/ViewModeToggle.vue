<template>
  <div class="view-mode-toggle">
    <button
      v-for="mode in modes"
      :key="mode.id"
      class="view-mode-btn"
      :class="{ active: modelValue === mode.id }"
      :title="mode.label"
      @click="$emit('update:modelValue', mode.id)"
    >
      <AppIcon :name="mode.icon" :size="15" />
    </button>
  </div>
</template>

<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  modelValue: { type: String, default: 'table' },
})

defineEmits(['update:modelValue'])

const modes = [
  { id: 'table', icon: 'table', label: 'Tablo Görünümü' },
  { id: 'grid', icon: 'layout-grid', label: 'Kart Görünümü' },
  { id: 'kanban', icon: 'columns-3', label: 'Kanban Görünümü' },
  { id: 'list', icon: 'list', label: 'Liste Görünümü' },
]
</script>
