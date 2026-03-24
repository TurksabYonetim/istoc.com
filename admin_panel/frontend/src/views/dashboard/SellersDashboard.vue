<template>
  <div>
    <GlobalFilterBar />

    <!-- KPI Row -->
    <DashboardGrid>
      <KpiCard title="Aktif Satıcılar" value="847" icon="fas fa-store" iconBg="bg-violet-50" iconColor="text-violet-500" change="14.2" :changePositive="true" />
      <KpiCard title="Bekleyen Başvuru" value="23" icon="fas fa-file-pen" iconBg="bg-amber-50" iconColor="text-amber-500" change="5" :changePositive="false" changeLabel="yeni başvuru" />
      <KpiCard title="Ortalama Puan" value="4.65" icon="fas fa-star" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="0.8" :changePositive="true" />
      <KpiCard title="Askıya Alınan" value="12" icon="fas fa-ban" iconBg="bg-red-50" iconColor="text-red-500" change="3" :changePositive="true" changeLabel="azaldı" />
    </DashboardGrid>

    <!-- Funnel + Radar Row -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Satıcı Onboarding Hunisi" subtitle="Başvuru → Onay süreci" size="lg">
        <BaseChart :option="onboardingFunnel" height="350px" />
      </WidgetWrapper>

      <WidgetWrapper title="Satıcı Performans Radar" subtitle="6 eksenli performans karşılaştırması" size="lg">
        <BaseChart :option="radarOption" height="350px" />
      </WidgetWrapper>
    </DashboardGrid>

    <!-- Score Trend + Tier Distribution -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Satıcı Puanı Trendi" subtitle="Aylık ortalama puan gelişimi" size="xl">
        <BaseChart :option="scoreTrendOption" height="300px" />
      </WidgetWrapper>

      <WidgetWrapper title="Satıcı Seviye Dağılımı" subtitle="Kademe bazlı satıcı sayıları" size="md">
        <BaseChart :option="tierDonutOption" height="300px" />
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

const onboardingFunnel = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  series: [{
    type: 'funnel', sort: 'descending', gap: 6,
    label: { position: 'inside', formatter: '{b}\n{c}', fontSize: 11 },
    itemStyle: { borderRadius: 4 },
    data: [
      { value: 120, name: 'Başvuru', itemStyle: { color: CHART_PALETTE[0] } },
      { value: 95, name: 'Belge İnceleme', itemStyle: { color: CHART_PALETTE[3] } },
      { value: 78, name: 'KYC Onay', itemStyle: { color: CHART_PALETTE[6] } },
      { value: 65, name: 'Sözleşme', itemStyle: { color: CHART_PALETTE[1] } },
      { value: 52, name: 'Onaylı Satıcı', itemStyle: { color: CHART_PALETTE[9] } },
    ],
  }],
}))

const radarOption = computed(() => ({
  tooltip: {},
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  radar: {
    indicator: [
      { name: 'Teslimat', max: 100 },
      { name: 'Kalite', max: 100 },
      { name: 'Hizmet', max: 100 },
      { name: 'Uyumluluk', max: 100 },
      { name: 'Tedarik', max: 100 },
      { name: 'İletişim', max: 100 },
    ],
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [92, 88, 95, 78, 85, 90],
        name: 'Top Satıcı',
        areaStyle: { opacity: 0.3 },
      },
      {
        value: [75, 72, 70, 68, 71, 74],
        name: 'Platform Ort.',
        lineStyle: { type: 'dashed' },
        areaStyle: { opacity: 0.1 },
      },
    ],
  }],
}))

const scoreTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  grid: { top: 20, right: 16, bottom: 40, left: 48 },
  xAxis: { type: 'category', data: MONTHS_TR },
  yAxis: { type: 'value', min: 3.5, max: 5, axisLabel: { formatter: '{value}' } },
  series: [
    { name: 'Top 10%', type: 'line', data: [4.8, 4.82, 4.85, 4.87, 4.88, 4.9, 4.91, 4.92, 4.93, 4.94, 4.95, 4.96], smooth: true, lineStyle: { width: 2 } },
    { name: 'Ortalama', type: 'line', data: [4.3, 4.35, 4.32, 4.38, 4.4, 4.42, 4.45, 4.48, 4.5, 4.52, 4.55, 4.58], smooth: true, lineStyle: { width: 2, type: 'dashed' } },
    { name: 'Alt 10%', type: 'line', data: [3.6, 3.55, 3.58, 3.62, 3.65, 3.6, 3.63, 3.67, 3.7, 3.72, 3.75, 3.78], smooth: true, lineStyle: { width: 2 } },
  ],
}))

const tierDonutOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['52%', '78%'], center: ['50%', '42%'],
    itemStyle: { borderRadius: 6, borderWidth: 3, borderColor: isDark.value ? '#1e1e2e' : '#ffffff' },
    label: { show: true, position: 'center',
      formatter: '{total|847}\n{sub|Toplam Satıcı}',
      rich: { total: { fontSize: 22, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', lineHeight: 32 }, sub: { fontSize: 11, color: '#9ca3af', lineHeight: 18 } },
    },
    data: [
      { value: 42, name: 'Platin', itemStyle: { color: '#8B5CF6' } },
      { value: 156, name: 'Altın', itemStyle: { color: '#F59E0B' } },
      { value: 312, name: 'Gümüş', itemStyle: { color: '#6B7280' } },
      { value: 337, name: 'Bronz', itemStyle: { color: '#92400E' } },
    ],
  }],
}))
</script>
