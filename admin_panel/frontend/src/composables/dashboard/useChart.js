/**
 * useChart — ECharts lifecycle composable
 *
 * Handles init, dispose, resize, theme switching, and lazy viewport init.
 *
 * @param {import('vue').Ref<HTMLElement|null>} elRef - Template ref for chart container
 * @param {import('vue').ComputedRef<Object>} optionRef - Computed ECharts option
 * @param {Object} [config] - Configuration
 * @param {string} [config.height='300px'] - Chart height
 * @param {boolean} [config.lazyInit=true] - Only init when in viewport
 * @returns {{ chart: import('vue').ShallowRef, isReady: import('vue').Ref<boolean> }}
 */
import { shallowRef, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'

/** @type {import('echarts').EChartsType | null} */
const chart = shallowRef(null)

export function useChart(elRef, optionRef, config = {}) {
    const { height = '300px', lazyInit = true } = config
    const { currentTheme } = useTheme()

    const chartInstance = shallowRef(null)
    const isReady = ref(false)

    let resizeObserver = null
    let intersectionObserver = null
    let echarts = null

    function getThemeName() {
        return currentTheme.value === 'dark' ? 'tradehub-dark' : 'tradehub-light'
    }

    async function initChart() {
        if (!elRef.value || chartInstance.value) return

        // Dynamic import for code splitting
        const mod = await import('@/plugins/echarts')
        echarts = mod.echarts

        await nextTick()
        if (!elRef.value) return

        // Set height
        elRef.value.style.height = height

        const instance = echarts.init(elRef.value, getThemeName())
        chartInstance.value = instance
        isReady.value = true

        // Set initial option
        if (optionRef.value) {
            instance.setOption(optionRef.value, { notMerge: true })
        }

        // ResizeObserver for responsive reflow
        resizeObserver = new ResizeObserver(() => {
            instance.resize()
        })
        resizeObserver.observe(elRef.value)
    }

    function disposeChart() {
        if (resizeObserver) {
            resizeObserver.disconnect()
            resizeObserver = null
        }
        if (intersectionObserver) {
            intersectionObserver.disconnect()
            intersectionObserver = null
        }
        if (chartInstance.value) {
            chartInstance.value.dispose()
            chartInstance.value = null
            isReady.value = false
        }
    }

    // Watch option changes → update chart
    watch(
        () => optionRef.value,
        (newOption) => {
            if (chartInstance.value && newOption) {
                chartInstance.value.setOption(newOption, { notMerge: true })
            }
        },
        { deep: false }
    )

    // Watch theme changes → re-init with new theme
    watch(currentTheme, async () => {
        if (!elRef.value || !echarts) return
        const oldOption = chartInstance.value?.getOption()
        disposeChart()
        await nextTick()
        if (!elRef.value) return

        const instance = echarts.init(elRef.value, getThemeName())
        chartInstance.value = instance
        isReady.value = true

        if (optionRef.value) {
            instance.setOption(optionRef.value, { notMerge: true })
        }

        resizeObserver = new ResizeObserver(() => instance.resize())
        resizeObserver.observe(elRef.value)
    })

    onMounted(() => {
        if (lazyInit && 'IntersectionObserver' in window) {
            intersectionObserver = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        initChart()
                        intersectionObserver?.disconnect()
                        intersectionObserver = null
                    }
                },
                { threshold: 0.1 }
            )
            if (elRef.value) {
                intersectionObserver.observe(elRef.value)
            }
        } else {
            initChart()
        }
    })

    onBeforeUnmount(() => {
        disposeChart()
    })

    return {
        chart: chartInstance,
        isReady,
    }
}
