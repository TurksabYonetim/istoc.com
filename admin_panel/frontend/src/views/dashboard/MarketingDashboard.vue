<template>
  <div>
    <GlobalFilterBar />
    <DashboardGrid>
      <KpiCard title="Aktif Kampanya" value="12" icon="fas fa-bullhorn" iconBg="bg-violet-50" iconColor="text-violet-500" change="3" :changePositive="true" changeLabel="yeni" />
      <KpiCard title="Kupon Kullanımı" value="8,420" icon="fas fa-ticket" iconBg="bg-blue-50" iconColor="text-blue-500" change="28.5" :changePositive="true" />
      <KpiCard title="Kampanya ROI" value="%342" icon="fas fa-chart-line" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="15.2" :changePositive="true" />
      <KpiCard title="Churn Oranı" value="%4.2" icon="fas fa-user-minus" iconBg="bg-red-50" iconColor="text-red-500" change="0.8" :changePositive="true" changeLabel="iyileşme" />
    </DashboardGrid>
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Kampanya Performansı" subtitle="ROI karşılaştırma" size="xl">
        <BaseChart :option="campaignOption" height="320px" />
      </WidgetWrapper>
      <WidgetWrapper title="Kupon Dağılımı" size="md">
        <BaseChart :option="couponOption" height="320px" />
      </WidgetWrapper>
    </DashboardGrid>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DashboardGrid from '@/components/dashboard/layout/DashboardGrid.vue'
import WidgetWrapper from '@/components/dashboard/layout/WidgetWrapper.vue'
import KpiCard from '@/components/dashboard/widgets/KpiCard.vue'
import BaseChart from '@/components/dashboard/charts/BaseChart.vue'
import GlobalFilterBar from '@/components/dashboard/filters/GlobalFilterBar.vue'
import { CHART_PALETTE, MONTHS_TR } from '@/constants/dashboard'
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()
const isDark = computed(() => currentTheme.value === 'dark')

const campaignOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { top: 0, right: 0 },
  grid: { top: 30, right: 16, bottom: 24, left: 48 },
  xAxis: { type: 'category', data: MONTHS_TR.slice(-6) },
  yAxis: [{ type: 'value', axisLabel: { formatter: '{value}K' } }, { type: 'value', axisLabel: { formatter: '{value}%' } }],
  series: [
    { name: 'Harcama', type: 'bar', data: [45, 52, 48, 62, 58, 72], itemStyle: { borderRadius: [4,4,0,0], color: CHART_PALETTE[0] } },
    { name: 'Gelir', type: 'bar', data: [120, 145, 138, 185, 178, 246], itemStyle: { borderRadius: [4,4,0,0], color: CHART_PALETTE[1] } },
    { name: 'ROI', type: 'line', yAxisIndex: 1, data: [267, 279, 288, 298, 307, 342], smooth: true },
  ],
}))

const couponOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie', radius: ['52%', '78%'], center: ['50%', '42%'],
    itemStyle: { borderRadius: 6, borderWidth: 3, borderColor: isDark.value ? '#1e1e2e' : '#ffffff' },
    label: { show: true, position: 'center', formatter: '{total|8,420}\n{sub|Kullanım}',
      rich: { total: { fontSize: 20, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', lineHeight: 32 }, sub: { fontSize: 11, color: '#9ca3af', lineHeight: 18 } } },
    data: [
      { value: 3890, name: 'Yüzde İndirim', itemStyle: { color: CHART_PALETTE[0] } },
      { value: 2340, name: 'Sabit Tutar', itemStyle: { color: CHART_PALETTE[1] } },
      { value: 1450, name: 'Kargo Bedava', itemStyle: { color: CHART_PALETTE[3] } },
      { value: 740, name: 'Toplu Alım', itemStyle: { color: CHART_PALETTE[6] } },
    ],
  }],
}))
</script>
