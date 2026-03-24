<template>
  <div ref="chartEl" class="th-chart-container" :style="{ height }"></div>
</template>

<script setup>
/**
 * BaseChart — ECharts wrapper component
 *
 * Handles lifecycle, resize, lazy viewport init, and theme.
 * All chart types extend this by passing their computed option.
 */
import { ref, computed, toRef } from 'vue'
import { useChart } from '@/composables/dashboard/useChart'

const props = defineProps({
  /** @type {Object} ECharts option object */
  option: { type: Object, required: true },
  /** Chart container height */
  height: { type: String, default: '300px' },
  /** Loading state */
  loading: { type: Boolean, default: false },
  /** Lazy init when in viewport */
  lazyInit: { type: Boolean, default: true },
})

const emit = defineEmits(['chart-click', 'chart-init'])

const chartEl = ref(null)
const optionRef = computed(() => props.option)

const { chart, isReady } = useChart(chartEl, optionRef, {
  height: props.height,
  lazyInit: props.lazyInit,
})

// Forward chart click events
import { watch } from 'vue'
watch(chart, (instance) => {
  if (instance) {
    instance.on('click', (params) => {
      emit('chart-click', params)
    })
    emit('chart-init', instance)
  }
})

// Expose chart instance for parent access
defineExpose({ chart, isReady })
</script>
