<template>
  <Teleport to="body">
    <Transition name="slide-over">
      <div v-if="visible" class="th-slide-overlay" :class="{ visible }" @click.self="$emit('close')">
        <div class="th-slide-panel" :class="{ visible }">
          <!-- Panel Header -->
          <div class="flex items-center justify-between p-5 border-b" style="border-color: var(--th-surface-border)">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="subtitle" class="text-xs mt-0.5" style="color: var(--th-neutral)">{{ subtitle }}</p>
            </div>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              @click="$emit('close')"
              aria-label="Kapat"
            >
              <i class="fas fa-xmark text-gray-400"></i>
            </button>
          </div>

          <!-- Panel Content -->
          <div class="p-5">
            <slot />
          </div>

          <!-- Panel Footer -->
          <div v-if="$slots.footer" class="p-5 border-t" style="border-color: var(--th-surface-border)">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  /** Whether the panel is visible */
  visible: { type: Boolean, default: false },
  /** Panel title */
  title: { type: String, default: '' },
  /** Panel subtitle */
  subtitle: { type: String, default: '' },
})

const emit = defineEmits(['close'])

// Lock body scroll when panel is open
watch(() => props.visible, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : ''
})
</script>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition: opacity var(--th-duration-normal) var(--th-ease-standard);
}
.slide-over-enter-active .th-slide-panel,
.slide-over-leave-active .th-slide-panel {
  transition: transform var(--th-duration-slow) var(--th-ease-standard);
}
.slide-over-enter-from,
.slide-over-leave-to {
  opacity: 0;
}
.slide-over-enter-from .th-slide-panel,
.slide-over-leave-to .th-slide-panel {
  transform: translateX(100%);
}
</style>
