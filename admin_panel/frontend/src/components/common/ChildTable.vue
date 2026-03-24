<template>
  <div>
    <div v-if="modelValue.length > 0" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/8 mb-3">
      <table class="w-full text-xs">
        <thead>
          <tr class="bg-gray-50 dark:bg-white/3 border-b border-gray-200 dark:border-white/8">
            <th class="w-8 px-2 py-2 text-gray-400 font-medium text-center">#</th>
            <th v-for="col in columns" :key="col.key" class="px-3 py-2 text-left text-gray-500 font-medium whitespace-nowrap">
              {{ col.label }}<span v-if="col.reqd" class="text-red-400 ml-0.5">*</span>
            </th>
            <th class="w-8 px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in modelValue" :key="idx"
            class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/2"
          >
            <td class="px-2 py-1.5 text-center text-gray-400">{{ idx + 1 }}</td>
            <td v-for="col in columns" :key="col.key" class="px-2 py-1.5">
              <input
                v-model="row[col.key]"
                :type="col.type === 'number' ? 'number' : 'text'"
                :step="col.type === 'number' ? 'any' : undefined"
                :placeholder="col.placeholder || col.label"
                class="w-full min-w-[80px] bg-transparent border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 placeholder-gray-400"
              />
            </td>
            <td class="px-2 py-1.5 text-center">
              <button @click="remove(idx)" class="text-red-400 hover:text-red-600 transition-colors p-0.5 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-6 text-xs text-gray-400 bg-gray-50 dark:bg-white/2 rounded-lg border border-dashed border-gray-200 dark:border-white/8 mb-3">
      Henüz kayıt yok
    </div>
    <button
      type="button"
      @click="addRow"
      class="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {{ addLabel || 'Satır Ekle' }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  childDoctype: { type: String, default: '' },
  addLabel: { type: String, default: 'Satır Ekle' },
})
const emit = defineEmits(['update:modelValue'])

function addRow() {
  const row = {}
  props.columns.forEach(col => {
    row[col.key] = col.type === 'number' ? 0 : ''
  })
  emit('update:modelValue', [...props.modelValue, row])
}

function remove(idx) {
  const updated = props.modelValue.filter((_, i) => i !== idx)
  emit('update:modelValue', updated)
}
</script>
