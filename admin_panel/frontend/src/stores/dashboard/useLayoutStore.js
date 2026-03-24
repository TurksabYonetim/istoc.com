/**
 * useLayoutStore — Widget layout persistence
 *
 * Stores widget positions and visibility per dashboard module.
 * Persists to localStorage for per-user layout preferences.
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'th-dashboard-layouts'

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch {
        return {}
    }
}

export const useLayoutStore = defineStore('dashboardLayout', () => {
    const layouts = ref(loadFromStorage())

    // Persist on change
    watch(layouts, (val) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
        } catch { /* quota exceeded fallback */ }
    }, { deep: true })

    /**
     * Get widget order for a module
     * @param {string} moduleId
     * @returns {string[]} Array of widget IDs in order
     */
    function getWidgetOrder(moduleId) {
        return layouts.value[moduleId]?.order || null
    }

    /**
     * Save widget order for a module
     * @param {string} moduleId
     * @param {string[]} widgetIds
     */
    function setWidgetOrder(moduleId, widgetIds) {
        if (!layouts.value[moduleId]) {
            layouts.value[moduleId] = {}
        }
        layouts.value[moduleId] = { ...layouts.value[moduleId], order: [...widgetIds] }
    }

    /**
     * Reset layout for a module to default
     * @param {string} moduleId
     */
    function resetLayout(moduleId) {
        const newLayouts = { ...layouts.value }
        delete newLayouts[moduleId]
        layouts.value = newLayouts
    }

    function resetAll() {
        layouts.value = {}
        localStorage.removeItem(STORAGE_KEY)
    }

    return {
        layouts,
        getWidgetOrder,
        setWidgetOrder,
        resetLayout,
        resetAll,
    }
})
