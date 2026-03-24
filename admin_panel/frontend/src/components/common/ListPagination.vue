<template>
  <div class="list-pagination">
    <span class="list-pagination-info">
      {{ rangeStart }}–{{ rangeEnd }} / {{ total }}
    </span>
    <div class="list-pagination-pages">
      <button
        class="list-pagination-btn"
        :disabled="modelValue <= 1"
        @click="$emit('update:modelValue', modelValue - 1)"
      >
        <AppIcon name="chevron-left" :size="14" />
      </button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="list-pagination-btn"
        :class="{ active: p === modelValue }"
        @click="$emit('update:modelValue', p)"
      >
        {{ p }}
      </button>
      <button
        class="list-pagination-btn"
        :disabled="modelValue >= totalPages"
        @click="$emit('update:modelValue', modelValue + 1)"
      >
        <AppIcon name="chevron-right" :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  total: { type: Number, default: 0 },
  pageSize: { type: Number, default: 20 },
})

defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const rangeStart = computed(() => {
  if (props.total === 0) return 0
  return (props.modelValue - 1) * props.pageSize + 1
})

const rangeEnd = computed(() => {
  return Math.min(props.modelValue * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const tp = totalPages.value
  const cur = props.modelValue
  if (tp <= 5) return Array.from({ length: tp }, (_, i) => i + 1)
  if (cur <= 3) return [1, 2, 3, 4, 5]
  if (cur >= tp - 2) return [tp - 4, tp - 3, tp - 2, tp - 1, tp]
  return [cur - 2, cur - 1, cur, cur + 1, cur + 2]
})
</script>
