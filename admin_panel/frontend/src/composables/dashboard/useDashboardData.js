/**
 * useDashboardData — Generic data fetching composable for dashboard widgets
 *
 * Uses the existing api.js wrapper to fetch data from Frappe backend.
 * Provides loading, error, and data refs with auto-refresh capability.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {Object} [options] - Configuration options
 * @param {number} [options.refreshInterval=0] - Auto-refresh interval in ms (0 = disabled)
 * @param {boolean} [options.immediate=true] - Fetch immediately on mount
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useDashboardData(fetchFn, options = {}) {
    const { refreshInterval = 0, immediate = true } = options

    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    let refreshTimer = null

    async function fetch() {
        loading.value = true
        error.value = null
        try {
            const result = await fetchFn()
            data.value = result
        } catch (err) {
            error.value = err.message || 'Veri yüklenirken hata oluştu'
            console.error('[Dashboard Data Error]', err)
        } finally {
            loading.value = false
        }
    }

    async function refresh() {
        // Silent refresh (no loading state)
        try {
            const result = await fetchFn()
            data.value = result
        } catch (err) {
            console.warn('[Dashboard Data Refresh Error]', err)
        }
    }

    function startAutoRefresh() {
        if (refreshInterval > 0) {
            refreshTimer = setInterval(refresh, refreshInterval)
        }
    }

    function stopAutoRefresh() {
        if (refreshTimer) {
            clearInterval(refreshTimer)
            refreshTimer = null
        }
    }

    onMounted(() => {
        if (immediate) {
            fetch()
        }
        startAutoRefresh()
    })

    onBeforeUnmount(() => {
        stopAutoRefresh()
    })

    return {
        data,
        loading,
        error,
        fetch,
        refresh,
    }
}
