<template>
  <component
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    :class="className"
  />
</template>

<script setup>
/**
 * AppIcon — Central Lucide icon wrapper
 *
 * Usage:
 *   <AppIcon name="bell" />
 *   <AppIcon name="home" :size="20" class="text-red-500" />
 *
 * Icons use `currentColor` by default so they inherit text color from parent.
 */
import { computed } from 'vue'
import { icons } from 'lucide-vue-next'

const props = defineProps({
  /** Lucide icon name in kebab-case, e.g. 'shopping-cart', 'house' */
  name: { type: String, required: true },
  /** Icon size in pixels */
  size: { type: [Number, String], default: 16 },
  /** SVG stroke-width */
  strokeWidth: { type: [Number, String], default: 2 },
  /** Additional CSS classes */
  class: { type: String, default: '' },
})

// Convert kebab-case to PascalCase for Lucide component lookup
function toPascalCase(str) {
  return str
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

const iconComponent = computed(() => {
  const name = toPascalCase(props.name)
  return icons[name] || null
})

const className = computed(() => props.class)
</script>
