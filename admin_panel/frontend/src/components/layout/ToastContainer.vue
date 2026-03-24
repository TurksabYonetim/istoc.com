<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast-${t.type}`"
      >
        <AppIcon :name="toastIcon(t.type)" :size="14" />
        <span class="text-xs flex-1">{{ t.message }}</span>
        <button @click="remove(t.id)" class="toast-close">
          <AppIcon name="x" :size="12" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/common/AppIcon.vue'

const { toasts, remove } = useToast()

function toastIcon(type) {
  if (type === 'success') return 'check-circle'
  if (type === 'error') return 'alert-circle'
  return 'info'
}
</script>