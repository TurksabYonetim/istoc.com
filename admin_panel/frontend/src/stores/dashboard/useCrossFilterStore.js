/**
 * useCrossFilterStore — Chart-to-chart interaction state
 *
 * When a user clicks on a chart element, this store captures the
 * filter and propagates it to all other widgets on the dashboard.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCrossFilterStore = defineStore('crossFilter', () => {
    // Map<widgetId, { field, value, label }>
    const activeFilters = ref(new Map())

    const hasFilters = computed(() => activeFilters.value.size > 0)

    const filterCount = computed(() => activeFilters.value.size)

    /** Get all active cross-filters as an array */
    const filterList = computed(() => Array.from(activeFilters.value.entries()).map(
        ([widgetId, filter]) => ({ widgetId, ...filter })
    ))

    /** Convert to Frappe filter format */
    const asFrappeFilters = computed(() =>
        filterList.value.map(f => [f.doctype || '', f.field, '=', f.value])
    )

    function setFilter(widgetId, { field, value, label, doctype }) {
        const newMap = new Map(activeFilters.value)
        newMap.set(widgetId, { field, value, label, doctype })
        activeFilters.value = newMap
    }

    function clearFilter(widgetId) {
        const newMap = new Map(activeFilters.value)
        newMap.delete(widgetId)
        activeFilters.value = newMap
    }

    function clearAll() {
        activeFilters.value = new Map()
    }

    return {
        activeFilters,
        hasFilters,
        filterCount,
        filterList,
        asFrappeFilters,
        setFilter,
        clearFilter,
        clearAll,
    }
})
