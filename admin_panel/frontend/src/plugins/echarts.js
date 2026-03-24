/**
 * ECharts Plugin — Tree-shaking registration & theme
 *
 * Usage:
 *   import { echarts } from '@/plugins/echarts'
 *   const chart = echarts.init(el, 'tradehub-dark')
 */
import * as echarts from 'echarts/core'

// Renderers
import { CanvasRenderer } from 'echarts/renderers'

// Charts
import {
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    HeatmapChart,
    GaugeChart,
    RadarChart,
    FunnelChart,
    SankeyChart,
    TreemapChart,
} from 'echarts/charts'

// Components
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    MarkLineComponent,
    MarkPointComponent,
    GraphicComponent,
} from 'echarts/components'

// Register all
echarts.use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    HeatmapChart,
    GaugeChart,
    RadarChart,
    FunnelChart,
    SankeyChart,
    TreemapChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    MarkLineComponent,
    MarkPointComponent,
    GraphicComponent,
])

// ── TradeHub Dark Theme ─────────────────────────────────────
const tradehubDark = {
    color: [
        '#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#EC4899',
        '#8B5CF6', '#14B8A6', '#F97316', '#EF4444', '#84CC16',
        '#06B6D4', '#A78BFA',
    ],
    backgroundColor: 'transparent',
    textStyle: {
        fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
        color: '#9CA3AF',
        textBorderWidth: 0,
        textShadowBlur: 0,
    },
    title: {
        textStyle: { color: '#F9FAFB', fontSize: 14, fontWeight: 600, textBorderWidth: 0 },
    },
    legend: {
        textStyle: { color: '#9CA3AF', textBorderWidth: 0 },
        icon: 'roundRect',
    },
    tooltip: {
        backgroundColor: '#1F1F2A',
        borderColor: '#2A2A38',
        textStyle: { color: '#F9FAFB', fontSize: 12, textBorderWidth: 0 },
        extraCssText: 'box-shadow:0 8px 32px rgba(0,0,0,.5);border-radius:8px;',
    },
    categoryAxis: {
        axisLine: { lineStyle: { color: '#2A2A38' } },
        axisTick: { show: false },
        axisLabel: { color: '#6B7280', fontSize: 11, textBorderWidth: 0 },
        splitLine: { lineStyle: { color: '#1F1F2A', type: 'dashed' } },
    },
    valueAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6B7280', fontSize: 11, textBorderWidth: 0 },
        splitLine: { lineStyle: { color: '#1F1F2A', type: 'dashed' } },
    },
    line: { label: { textBorderWidth: 0 } },
    bar: { label: { textBorderWidth: 0 } },
    pie: { label: { textBorderWidth: 0 } },
    scatter: { label: { textBorderWidth: 0 } },
    gauge: { title: { textBorderWidth: 0 }, detail: { textBorderWidth: 0 } },
    sankey: { label: { textBorderWidth: 0, color: '#d1d5db' } },
    radar: { label: { textBorderWidth: 0 } },
    funnel: { label: { textBorderWidth: 0 } },
    treemap: { label: { textBorderWidth: 0 } },
}

// ── TradeHub Light Theme ────────────────────────────────────
const tradehubLight = {
    color: [
        '#6c5dd3', '#10B981', '#F59E0B', '#3B82F6', '#EC4899',
        '#8B5CF6', '#14B8A6', '#F97316', '#EF4444', '#84CC16',
        '#06B6D4', '#A78BFA',
    ],
    backgroundColor: 'transparent',
    textStyle: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#6B7280',
    },
    title: {
        textStyle: { color: '#1F2937', fontSize: 14, fontWeight: 600 },
    },
    legend: {
        textStyle: { color: '#6B7280' },
        icon: 'roundRect',
    },
    tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 12 },
        extraCssText: 'box-shadow:0 4px 16px rgba(0,0,0,.1);border-radius:8px;',
    },
    categoryAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 11 },
        splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
    },
    valueAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 11 },
        splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
    },
}

echarts.registerTheme('tradehub-dark', tradehubDark)
echarts.registerTheme('tradehub-light', tradehubLight)

export { echarts }
export default echarts
