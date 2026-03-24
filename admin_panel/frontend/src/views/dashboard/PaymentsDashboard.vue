<template>
  <div>
    <GlobalFilterBar />

    <!-- KPI Row -->
    <DashboardGrid>
      <KpiCard title="Toplam Gelir" value="₺12,847,390" icon="fas fa-turkish-lira-sign" iconBg="bg-violet-50" iconColor="text-violet-500" change="18.4" :changePositive="true" />
      <KpiCard title="Escrow Bakiye" value="₺3,245,200" icon="fas fa-lock" iconBg="bg-blue-50" iconColor="text-blue-500" change="8.2" :changePositive="true" />
      <KpiCard title="Komisyon Geliri" value="₺892,120" icon="fas fa-percent" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="22.3" :changePositive="true" />
      <KpiCard title="İade Oranı" value="%2.1" icon="fas fa-rotate-left" iconBg="bg-amber-50" iconColor="text-amber-500" change="0.5" :changePositive="true" changeLabel="iyileşme" />
    </DashboardGrid>

    <!-- Charts Row 1: Revenue Stacked Area + Payment Methods Donut -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Ödeme Yöntemi Dağılımı" subtitle="Son 90 gün" size="xl">
        <BaseChart :option="stackedAreaOption" height="320px" />
      </WidgetWrapper>

      <WidgetWrapper title="Ödeme Durumu" subtitle="Bu ay" size="md">
        <BaseChart :option="paymentStatusDonut" height="320px" />
      </WidgetWrapper>
    </DashboardGrid>

    <!-- Charts Row 2: Escrow Waterfall + Gauge -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Escrow Yaşam Döngüsü" subtitle="Aylık escrow akışı" size="lg">
        <BaseChart :option="escrowBarOption" height="300px" />
      </WidgetWrapper>

      <WidgetWrapper title="Ödeme Başarı Oranları" subtitle="Anlık performans göstergeleri" size="lg">
        <BaseChart :option="paymentGaugeOption" height="300px" />
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
import { MONTHS_TR } from '@/constants/dashboard'
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()
const isDark = computed(() => currentTheme.value === 'dark')

const stackedAreaOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  grid: { top: 20, right: 16, bottom: 40, left: 48 },
  xAxis: { type: 'category', data: MONTHS_TR },
  yAxis: { type: 'value', axisLabel: { formatter: '₺{value}K' } },
  series: [
    { name: 'Kredi Kartı', type: 'line', stack: 'total', areaStyle: { opacity: 0.4 }, smooth: true, data: [420, 380, 450, 480, 520, 490, 530, 560, 580, 610, 640, 680] },
    { name: 'Havale/EFT', type: 'line', stack: 'total', areaStyle: { opacity: 0.4 }, smooth: true, data: [280, 310, 290, 320, 350, 340, 360, 380, 400, 420, 450, 470] },
    { name: 'Escrow', type: 'line', stack: 'total', areaStyle: { opacity: 0.4 }, smooth: true, data: [120, 140, 130, 160, 180, 175, 190, 210, 230, 245, 260, 280] },
    { name: 'Taksitli', type: 'line', stack: 'total', areaStyle: { opacity: 0.4 }, smooth: true, data: [80, 90, 85, 95, 110, 105, 115, 125, 135, 145, 155, 165] },
  ],
}))

const paymentStatusDonut = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['52%', '78%'], center: ['50%', '42%'],
    itemStyle: { borderRadius: 6, borderWidth: 3, borderColor: isDark.value ? '#1e1e2e' : '#ffffff' },
    label: { show: true, position: 'center',
      formatter: '{total|₺12.8M}\n{sub|Toplam}',
      rich: { total: { fontSize: 22, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', lineHeight: 32 }, sub: { fontSize: 11, color: '#9ca3af', lineHeight: 18 } },
    },
    data: [
      { value: 10240, name: 'Başarılı', itemStyle: { color: '#10b981' } },
      { value: 1840, name: 'Beklemede', itemStyle: { color: '#f59e0b' } },
      { value: 420, name: 'Başarısız', itemStyle: { color: '#ef4444' } },
      { value: 347, name: 'İade', itemStyle: { color: '#8b5cf6' } },
    ],
  }],
}))

const escrowBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 10 },
  grid: { top: 30, right: 16, bottom: 24, left: 48 },
  xAxis: { type: 'category', data: MONTHS_TR.slice(-6) },
  yAxis: { type: 'value', axisLabel: { formatter: '₺{value}K' } },
  series: [
    { name: 'Açılan', type: 'bar', stack: 'escrow', data: [320, 380, 420, 460, 510, 540], itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } },
    { name: 'Serbest Bırakılan', type: 'bar', stack: 'release', data: [280, 340, 390, 430, 470, 500], itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] } },
    { name: 'İade', type: 'bar', stack: 'release', data: [40, 40, 30, 30, 40, 40], itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] } },
  ],
}))

const paymentGaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge', center: ['25%', '55%'], radius: '70%',
      startAngle: 200, endAngle: -20, min: 0, max: 100,
      axisLine: { lineStyle: { width: 12, color: [[0.5, '#ef4444'], [0.8, '#f59e0b'], [1, '#10b981']] } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { distance: 12, fontSize: 9 },
      pointer: { length: '60%', width: 4, itemStyle: { color: '#6c5dd3' } },
      anchor: { show: true, size: 8, itemStyle: { color: '#6c5dd3', borderWidth: 2 } },
      title: { show: true, offsetCenter: [0, '72%'], fontSize: 11, fontWeight: 600 },
      detail: { valueAnimation: true, fontSize: 22, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', offsetCenter: [0, '45%'], formatter: '{value}%' },
      data: [{ value: 96.8, name: 'Başarı Oranı' }],
    },
    {
      type: 'gauge', center: ['75%', '55%'], radius: '70%',
      startAngle: 200, endAngle: -20, min: 0, max: 100,
      axisLine: { lineStyle: { width: 12, color: [[0.5, '#ef4444'], [0.8, '#f59e0b'], [1, '#10b981']] } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { distance: 12, fontSize: 9 },
      pointer: { length: '60%', width: 4, itemStyle: { color: '#6c5dd3' } },
      anchor: { show: true, size: 8, itemStyle: { color: '#6c5dd3', borderWidth: 2 } },
      title: { show: true, offsetCenter: [0, '72%'], fontSize: 11, fontWeight: 600 },
      detail: { valueAnimation: true, fontSize: 22, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', offsetCenter: [0, '45%'], formatter: '{value}%' },
      data: [{ value: 88.5, name: '3DS Oranı' }],
    },
  ],
}))
</script>
