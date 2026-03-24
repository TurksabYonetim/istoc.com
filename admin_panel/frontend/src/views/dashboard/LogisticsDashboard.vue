<template>
  <div>
    <GlobalFilterBar />
    <DashboardGrid>
      <KpiCard title="Aktif Gönderi" value="1,247" icon="fas fa-truck" iconBg="bg-blue-50" iconColor="text-blue-500" change="9.4" :changePositive="true" />
      <KpiCard title="Ort. Teslimat Süresi" value="2.8 gün" icon="fas fa-clock" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="0.3" :changePositive="true" changeLabel="iyileşme" />
      <KpiCard title="SLA İhlali" value="14" icon="fas fa-exclamation-triangle" iconBg="bg-red-50" iconColor="text-red-500" change="4" :changePositive="false" changeLabel="artış" />
      <KpiCard title="Kargo Firması" value="8" icon="fas fa-truck-fast" iconBg="bg-violet-50" iconColor="text-violet-500" change="2" :changePositive="true" changeLabel="yeni eklendi" />
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Teslimat Bölge Dağılımı" subtitle="İl bazlı gönderi sayısı (Heatmap)" size="lg">
        <BaseChart :option="deliveryHeatmapOption" height="320px" />
      </WidgetWrapper>
      <WidgetWrapper title="Kargo Firması Performansı" subtitle="Zamanında teslimat oranı" size="lg">
        <BaseChart :option="carrierBarOption" height="320px" />
      </WidgetWrapper>
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Gönderi Durumu Akışı" subtitle="Son 7 gün" size="xl">
        <BaseChart :option="shipmentTrendOption" height="280px" />
      </WidgetWrapper>
      <WidgetWrapper title="Teslimat SLA" subtitle="Anlık performans" size="md">
        <BaseChart :option="slaGaugeOption" height="280px" />
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
import { CHART_PALETTE, DAYS_TR, HOURS } from '@/constants/dashboard'
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()
const isDark = computed(() => currentTheme.value === 'dark')

const deliveryHeatmapOption = computed(() => {
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya']
  const data = []
  for (let i = 0; i < cities.length; i++) {
    for (let j = 0; j < DAYS_TR.length; j++) {
      data.push([j, i, Math.floor(Math.random() * 80 + 10)])
    }
  }
  return {
    tooltip: { position: 'top', formatter: (p) => cities[p.data[1]] + ' · ' + DAYS_TR[p.data[0]] + '<br/><b>' + p.data[2] + ' gönderi</b>' },
    grid: { top: 10, right: 16, bottom: 36, left: 80 },
    xAxis: { type: 'category', data: DAYS_TR, splitArea: { show: false } },
    yAxis: { type: 'category', data: cities, splitArea: { show: false } },
    visualMap: { min: 0, max: 90, calculable: false, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 12, itemHeight: 100, inRange: { color: ['#f0edff', '#c4b5fd', '#8b7fe8', '#6c5dd3', '#4c3db3'] } },
    series: [{ type: 'heatmap', data, label: { show: false }, itemStyle: { borderRadius: 3, borderWidth: 2 } }],
  }
})

const carrierBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 30, bottom: 10, left: 8, containLabel: true },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  yAxis: { type: 'category', data: ['Yurtiçi Kargo', 'Aras Kargo', 'MNG Kargo', 'PTT Kargo', 'Sürat Kargo', 'UPS', 'DHL', 'FedEx'], inverse: true },
  series: [{
    type: 'bar', data: [96, 94, 92, 89, 87, 95, 97, 93], barWidth: 14,
    itemStyle: { borderRadius: [0, 6, 6, 0], color: (p) => p.data >= 95 ? '#10b981' : p.data >= 90 ? '#f59e0b' : '#ef4444' },
    label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10, fontWeight: 600 },
  }],
}))

const shipmentTrendOption = computed(() => {
  const days = Array.from({ length: 7 }, (_, i) => DAYS_TR[i])
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
    grid: { top: 20, right: 16, bottom: 40, left: 48 },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      { name: 'Oluşturulan', type: 'bar', stack: 'total', data: [180, 195, 210, 188, 205, 120, 85], itemStyle: { color: CHART_PALETTE[3], borderRadius: [4, 4, 0, 0] } },
      { name: 'Teslim Edilen', type: 'bar', stack: 'delivered', data: [165, 178, 190, 175, 192, 110, 72], itemStyle: { color: CHART_PALETTE[1], borderRadius: [4, 4, 0, 0] } },
      { name: 'Geciken', type: 'bar', stack: 'delivered', data: [8, 12, 15, 10, 9, 5, 3], itemStyle: { color: CHART_PALETTE[8], borderRadius: [4, 4, 0, 0] } },
    ],
  }
})

const slaGaugeOption = computed(() => ({
  series: [{
    type: 'gauge', startAngle: 200, endAngle: -20, min: 0, max: 100,
    axisLine: { lineStyle: { width: 14, color: [[0.7, '#ef4444'], [0.9, '#f59e0b'], [1, '#10b981']] } },
    axisTick: { show: false }, splitLine: { show: false },
    axisLabel: { distance: 14, fontSize: 10 },
    pointer: { length: '60%', width: 5, itemStyle: { color: '#6c5dd3' } },
    anchor: { show: true, size: 10, itemStyle: { color: '#6c5dd3', borderWidth: 2 } },
    title: { show: true, offsetCenter: [0, '72%'], fontSize: 12, fontWeight: 600 },
    detail: { valueAnimation: true, fontSize: 28, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', offsetCenter: [0, '45%'], formatter: '{value}%' },
    data: [{ value: 94.2, name: 'SLA Uyumu' }],
  }],
}))
</script>
