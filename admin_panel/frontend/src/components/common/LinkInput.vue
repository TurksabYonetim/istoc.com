<template>
  <div class="relative">
    <input
      :value="modelValue"
      type="text"
      class="form-input pr-8"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput($event.target.value)"
      @focus="onInput(modelValue)"
      @blur="scheduleClose"
    />
    <AppIcon name="search" :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <div
      v-if="show"
      class="absolute z-30 w-full mt-1 bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl max-h-52 overflow-y-auto"
    >
      <div v-if="loading" class="px-3 py-3 text-xs text-gray-400 flex items-center gap-2">
        <AppIcon name="loader" :size="12" class="animate-spin" /> Aranıyor...
      </div>
      <div v-else-if="results.length === 0" class="px-3 py-3 text-xs text-gray-400">Sonuç bulunamadı</div>
      <div
        v-for="r in results" :key="r.value"
        class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
        @mousedown.prevent="select(r.value)"
      >
        {{ r.value }}
        <span v-if="r.description" class="text-xs text-gray-400 ml-2">{{ r.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/utils/api'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  doctype: { type: String, required: true },
  placeholder: { type: String, default: 'Ara...' },
})
const emit = defineEmits(['update:modelValue'])

const show = ref(false)
const loading = ref(false)
const results = ref([])
let timer = null

function onInput(val) {
  emit('update:modelValue', val)
  clearTimeout(timer)
  show.value = true
  loading.value = true
  timer = setTimeout(async () => {
    try {
      const res = await api.searchLink(props.doctype, val || '')
      results.value = res.results || []
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

function select(val) {
  emit('update:modelValue', val)
  show.value = false
}

function scheduleClose() {
  setTimeout(() => { show.value = false }, 200)
}
</script>
