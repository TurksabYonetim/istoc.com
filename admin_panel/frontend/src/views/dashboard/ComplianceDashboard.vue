<template>
  <div>
    <GlobalFilterBar />
    <DashboardGrid>
      <KpiCard title="KYC Tamamlama" value="%94.2" icon="fas fa-shield-halved" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="3.1" :changePositive="true" />
      <KpiCard title="Bekleyen KYC" value="18" icon="fas fa-file-shield" iconBg="bg-amber-50" iconColor="text-amber-500" change="5" :changePositive="false" changeLabel="artış" />
      <KpiCard title="Risk Skoru Ort." value="28/100" icon="fas fa-gauge" iconBg="bg-blue-50" iconColor="text-blue-500" change="4.2" :changePositive="true" changeLabel="iyileşme" />
      <KpiCard title="Moderasyon Bekleyen" value="7" icon="fas fa-eye" iconBg="bg-red-50" iconColor="text-red-500" change="2" :changePositive="true" changeLabel="azaldı" />
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="KYC Durumu Dağılımı" subtitle="Tüm satıcılar" size="lg">
        <BaseChart :option="kycDonutOption" height="320px" />
      </WidgetWrapper>
      <WidgetWrapper title="Risk Değerlendirmesi" subtitle="Satıcı risk skoru dağılımı" size="lg">
        <BaseChart :option="riskScatterOption" height="320px" />
      </WidgetWrapper>
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Sertifika Süreleri" subtitle="Yaklaşan son kullanma tarihleri" size="xl">
        <BaseChart :option="certBarOption" height="280px" />
      </WidgetWrapper>
      <WidgetWrapper title="Uyum Skoru" subtitle="Platform geneli" size="md">
        <BaseChart :option="complianceGaugeOption" height="280px" />
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
import { CHART_PALETTE } from '@/constants/dashboard'
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()
const isDark = computed(() => currentTheme.value === 'dark')

const kycDonutOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie', radius: ['52%', '78%'], center: ['50%', '42%'],
    itemStyle: { borderRadius: 6, borderWidth: 3, borderColor: isDark.value ? '#1a1a28' : '#ffffff' },
    label: { show: true, position: 'center', formatter: '{total|847}\n{sub|Toplam}',
      rich: { total: { fontSize: 22, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', lineHeight: 32 }, sub: { fontSize: 11, color: '#9ca3af', lineHeight: 18 } } },
    data: [
      { value: 798, name: 'Onaylı', itemStyle: { color: '#10b981' } },
      { value: 18, name: 'Beklemede', itemStyle: { color: '#f59e0b' } },
      { value: 31, name: 'Reddedildi/Eksik', itemStyle: { color: '#ef4444' } },
    ],
  }],
}))

const riskScatterOption = computed(() => {
  const genData = (count, minR, maxR) => Array.from({ length: count }, () => [
    Math.random() * 100, Math.random() * 5, Math.random() * (maxR - minR) + minR,
  ])
  return {
    tooltip: { formatter: (p) => 'Risk: ' + p.data[0].toFixed(0) + '<br/>Puan: ' + p.data[1].toFixed(1) },
    grid: { top: 20, right: 16, bottom: 24, left: 48 },
    xAxis: { name: 'Risk Skoru', min: 0, max: 100 },
    yAxis: { name: 'Satıcı Puanı', min: 0, max: 5 },
    series: [
      { name: 'Düşük Risk', type: 'scatter', data: genData(40, 5, 12), symbolSize: (d) => d[2], itemStyle: { color: 'rgba(16,185,129,0.6)', borderColor: '#10b981' } },
      { name: 'Orta Risk', type: 'scatter', data: genData(15, 8, 15), symbolSize: (d) => d[2], itemStyle: { color: 'rgba(245,158,11,0.6)', borderColor: '#f59e0b' } },
      { name: 'Yüksek Risk', type: 'scatter', data: genData(5, 10, 20), symbolSize: (d) => d[2], itemStyle: { color: 'rgba(239,68,68,0.6)', borderColor: '#ef4444' } },
    ],
  }
})

const certBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 30, bottom: 10, left: 8, containLabel: true },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['ISO 9001', 'TSE', 'CE', 'REACH', 'GMP', 'HACCP'], inverse: true },
  series: [{
    type: 'bar', data: [12, 8, 15, 5, 3, 7], barWidth: 14,
    itemStyle: { borderRadius: [0, 6, 6, 0],
      color: (p) => p.data <= 5 ? '#ef4444' : p.data <= 10 ? '#f59e0b' : '#10b981' },
    label: { show: true, position: 'right', formatter: '{c} gün', fontSize: 10, fontWeight: 600 },
  }],
}))

const complianceGaugeOption = computed(() => ({
  series: [{
    type: 'gauge', startAngle: 200, endAngle: -20, min: 0, max: 100,
    axisLine: { lineStyle: { width: 14, color: [[0.6, '#ef4444'], [0.85, '#f59e0b'], [1, '#10b981']] } },
    axisTick: { show: false }, splitLine: { show: false },
    axisLabel: { distance: 14, fontSize: 10 },
    pointer: { length: '60%', width: 5, itemStyle: { color: '#6c5dd3' } },
    anchor: { show: true, size: 10, itemStyle: { color: '#6c5dd3', borderWidth: 2 } },
    title: { show: true, offsetCenter: [0, '72%'], fontSize: 12, fontWeight: 600 },
    detail: { valueAnimation: true, fontSize: 28, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', offsetCenter: [0, '45%'], formatter: '{value}%' },
    data: [{ value: 94.2, name: 'Uyum Skoru' }],
  }],
}))
</script>
