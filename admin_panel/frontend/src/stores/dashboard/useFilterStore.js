/**
 * useFilterStore — Global dashboard filter state
 *
 * Central filter store that all dashboard composables and widgets reference.
 * Changes here reactively propagate to all subscribed charts/tables.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFilterStore = defineStore('dashboardFilter', () => {
    // ── State ──────────────────────────────────────────────────
    const dateRange = ref({
        start: null,
        end: null,
        preset: '30d', // '7d' | '30d' | '90d' | 'custom'
    })

    const selectedModule = ref('all') // 'all' | 'orders' | 'payments' | ...
    const selectedEntity = ref(null) // For drill-down filtering (seller, buyer, etc.)
    const searchQuery = ref('')

    // ── Getters ────────────────────────────────────────────────

    /** Convert current filters to Frappe filter array format */
    const asFrappeFilters = computed(() => {
        const filters = []

        if (dateRange.value.start && dateRange.value.end) {
            filters.push(['creation', 'between', [dateRange.value.start, dateRange.value.end]])
        } else if (dateRange.value.preset) {
            const now = new Date()
            const presetDays = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }
            const days = presetDays[dateRange.value.preset]
            if (days) {
                const start = new Date(now)
                start.setDate(start.getDate() - days)
                filters.push(['creation', '>=', start.toISOString().split('T')[0]])
            }
        }

        return filters
    })

    const presetLabel = computed(() => {
        const labels = {
            '7d': 'Son 7 Gün',
            '30d': 'Son 30 Gün',
            '90d': 'Son 90 Gün',
            '365d': 'Son 1 Yıl',
            'custom': 'Özel Aralık',
        }
        return labels[dateRange.value.preset] || 'Son 30 Gün'
    })

    // ── Actions ────────────────────────────────────────────────
    function setPreset(preset) {
        dateRange.value = { start: null, end: null, preset }
    }

    function setCustomRange(start, end) {
        dateRange.value = { start, end, preset: 'custom' }
    }

    function setModule(module) {
        selectedModule.value = module
    }

    function setEntity(entity) {
        selectedEntity.value = entity
    }

    function clearEntity() {
        selectedEntity.value = null
    }

    function resetAll() {
        dateRange.value = { start: null, end: null, preset: '30d' }
        selectedModule.value = 'all'
        selectedEntity.value = null
        searchQuery.value = ''
    }

    return {
        dateRange,
        selectedModule,
        selectedEntity,
        searchQuery,
        asFrappeFilters,
        presetLabel,
        setPreset,
        setCustomRange,
        setModule,
        setEntity,
        clearEntity,
        resetAll,
    }
})
