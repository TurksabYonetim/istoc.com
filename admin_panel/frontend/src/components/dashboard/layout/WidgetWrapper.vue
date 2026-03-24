<template>
  <div class="th-widget" :class="sizeClass">
    <!-- Header -->
    <div v-if="title" class="th-widget-header">
      <div>
        <h3 class="th-widget-title">{{ title }}</h3>
        <p v-if="subtitle" class="th-widget-subtitle">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="th-widget-loading">
      <div class="flex flex-col items-center gap-3">
        <i class="fas fa-spinner fa-spin text-lg" style="color: var(--th-brand-500)"></i>
        <span class="text-xs">Yükleniyor...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="th-widget-error">
      <i class="fas fa-exclamation-triangle text-xl"></i>
      <p class="text-xs">{{ error }}</p>
      <button class="th-retry-btn" @click="$emit('retry')">
        <i class="fas fa-redo text-[10px] mr-1"></i> Tekrar Dene
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="empty" class="th-widget-empty">
      <i class="fas fa-inbox text-2xl opacity-40"></i>
      <p>Veri bulunamadı</p>
      <slot name="empty" />
    </div>

    <!-- Content -->
    <div v-else>
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="mt-4 pt-3 border-t" style="border-color: var(--th-surface-border)">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Widget title */
  title: { type: String, default: '' },
  /** Widget subtitle */
  subtitle: { type: String, default: '' },
  /** Widget size: sm | md | lg | xl | full */
  size: { type: String, default: 'md' },
  /** Loading state */
  loading: { type: Boolean, default: false },
  /** Error message */
  error: { type: String, default: null },
  /** Empty state flag */
  empty: { type: Boolean, default: false },
})

defineEmits(['retry'])

const sizeClass = computed(() => {
  const map = {
    sm: 'th-widget-sm',
    md: 'th-widget-md',
    lg: 'th-widget-lg',
    xl: 'th-widget-xl',
    full: 'th-widget-full',
  }
  return map[props.size] || 'th-widget-md'
})
</script>
