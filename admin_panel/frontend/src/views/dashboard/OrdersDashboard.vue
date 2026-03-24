<template>
  <div>
    <GlobalFilterBar />

    <!-- KPI Row -->
    <DashboardGrid>
      <KpiCard title="Toplam Sipariş" value="5,248" icon="fas fa-bag-shopping" iconBg="bg-blue-50" iconColor="text-blue-500" change="12.1" :changePositive="true" />
      <KpiCard title="Bekleyen Sipariş" value="384" icon="fas fa-clock" iconBg="bg-amber-50" iconColor="text-amber-500" change="3.2" :changePositive="false" />
      <KpiCard title="Tamamlanan" value="4,691" icon="fas fa-check-circle" iconBg="bg-emerald-50" iconColor="text-emerald-500" change="15.7" :changePositive="true" />
      <KpiCard title="İptal Oranı" value="%1.4" icon="fas fa-ban" iconBg="bg-red-50" iconColor="text-red-500" change="0.3" :changePositive="true" changeLabel="iyileşme" />
    </DashboardGrid>

    <!-- Sankey + Funnel Row -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Sipariş Akış Diyagramı" subtitle="Durum geçişleri (Sankey)" size="lg">
        <BaseChart :option="sankeyOption" height="350px" />
      </WidgetWrapper>

      <WidgetWrapper title="Sipariş Dönüşüm Hunisi" subtitle="Sepetten Teslimata" size="lg">
        <BaseChart :option="funnelOption" height="350px" />
      </WidgetWrapper>
    </DashboardGrid>

    <!-- Timeline + Table Row -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Sipariş Trendi" subtitle="Son 30 günlük sipariş hacmi" size="xl">
        <BaseChart :option="trendOption" height="300px" />
      </WidgetWrapper>

      <WidgetWrapper title="Alt Sipariş Dağılımı" subtitle="Satıcı bazlı alt sipariş sayıları" size="md">
        <BaseChart :option="subOrderBarOption" height="300px" />
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

const sankeyOption = computed(() => ({
  tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  series: [{
    type: 'sankey',
    emphasis: { focus: 'adjacency' },
    lineStyle: { color: 'gradient', opacity: 0.4 },
    nodeGap: 12,
    nodeWidth: 20,
    data: [
      { name: 'Sepet' }, { name: 'Sipariş Oluşturuldu' }, { name: 'Ödeme Onayı' },
      { name: 'Hazırlanıyor' }, { name: 'Kargoda' }, { name: 'Teslim Edildi' },
      { name: 'İptal' }, { name: 'İade' },
    ],
    links: [
      { source: 'Sepet', target: 'Sipariş Oluşturuldu', value: 5248 },
      { source: 'Sipariş Oluşturuldu', target: 'Ödeme Onayı', value: 5100 },
      { source: 'Sipariş Oluşturuldu', target: 'İptal', value: 148 },
      { source: 'Ödeme Onayı', target: 'Hazırlanıyor', value: 4950 },
      { source: 'Ödeme Onayı', target: 'İade', value: 150 },
      { source: 'Hazırlanıyor', target: 'Kargoda', value: 4900 },
      { source: 'Kargoda', target: 'Teslim Edildi', value: 4691 },
      { source: 'Kargoda', target: 'İade', value: 209 },
    ],
  }],
}))

const funnelOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  series: [{
    type: 'funnel',
    sort: 'descending',
    gap: 6,
    label: { position: 'inside', formatter: '{b}\n{c}', fontSize: 11 },
    itemStyle: { borderRadius: 4 },
    data: [
      { value: 8500, name: 'Sepete Ekleme', itemStyle: { color: CHART_PALETTE[0] } },
      { value: 5248, name: 'Sipariş', itemStyle: { color: CHART_PALETTE[1] } },
      { value: 5100, name: 'Ödeme', itemStyle: { color: CHART_PALETTE[3] } },
      { value: 4900, name: 'Hazırlık', itemStyle: { color: CHART_PALETTE[6] } },
      { value: 4691, name: 'Teslimat', itemStyle: { color: CHART_PALETTE[9] } },
    ],
  }],
}))

const trendOption = computed(() => {
  const days = Array.from({ length: 30 }, (_, i) => `${i + 1}.02`)
  const values = Array.from({ length: 30 }, () => Math.floor(Math.random() * 120 + 80))
  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 16, bottom: 24, left: 48 },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [{
      type: 'line', data: values, smooth: 0.3, symbol: 'none',
      lineStyle: { width: 2 },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.2)' }, { offset: 1, color: 'rgba(99,102,241,0)' }] },
      },
      markLine: { data: [{ type: 'average', name: 'Ortalama' }], lineStyle: { type: 'dashed' } },
    }],
  }
})

const subOrderBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 16, bottom: 10, left: 8, containLabel: true },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['Mega Yapı', 'Delta Kimya', 'Atlas Metal', 'Yıldız Plastik', 'Ege Boya'], inverse: true },
  series: [{
    type: 'bar', data: [156, 128, 112, 89, 74], barWidth: 14,
    itemStyle: { borderRadius: [0, 6, 6, 0], color: (p) => CHART_PALETTE[p.dataIndex % CHART_PALETTE.length] },
    label: { show: true, position: 'right', fontSize: 10, fontWeight: 600 },
  }],
}))
</script>
