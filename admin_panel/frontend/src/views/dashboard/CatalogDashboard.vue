<template>
  <div>
    <GlobalFilterBar />
    <DashboardGrid>
      <KpiCard title="Toplam Ürün" value="12,847" icon="fas fa-cube" iconBg="bg-violet-50" iconColor="text-violet-500" change="8.3" :changePositive="true" />
      <KpiCard title="Aktif Listeleme" value="9,245" icon="fas fa-list" iconBg="bg-blue-50" iconColor="text-blue-500" change="5.1" :changePositive="true" />
      <KpiCard title="Kategori" value="234" icon="fas fa-folder-tree" iconBg="bg-amber-50" iconColor="text-amber-500" change="12" :changePositive="true" changeLabel="yeni eklendi" />
      <KpiCard title="Stok Uyarısı" value="38" icon="fas fa-bell" iconBg="bg-red-50" iconColor="text-red-500" change="7" :changePositive="false" changeLabel="artış" />
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Kategori Ağacı" subtitle="Ürün dağılımı (Treemap)" size="lg">
        <BaseChart :option="treemapOption" height="350px" />
      </WidgetWrapper>
      <WidgetWrapper title="SKU Performans" subtitle="En çok satan ürünler" size="lg">
        <BaseChart :option="skuBarOption" height="350px" />
      </WidgetWrapper>
    </DashboardGrid>

    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Ürün Ekleme Trendi" subtitle="Aylık yeni ürün sayısı" size="xl">
        <BaseChart :option="productTrendOption" height="280px" />
      </WidgetWrapper>
      <WidgetWrapper title="Listeleme Durumu" subtitle="Aktif/Pasif/Draft" size="md">
        <BaseChart :option="listingStatusOption" height="280px" />
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

const treemapOption = computed(() => ({
  tooltip: { formatter: '{b}: {c} ürün' },
  series: [{
    type: 'treemap', roam: false, leafDepth: 2,
    breadcrumb: { show: true, itemStyle: { color: isDark.value ? '#2a2a38' : '#f3f4f6', borderColor: isDark.value ? '#3a3a4a' : '#e5e7eb', textStyle: { color: isDark.value ? '#9ca3af' : '#6b7280' } } },
    levels: [
      { itemStyle: { borderWidth: 2, borderColor: isDark.value ? '#2d2d3d' : '#e5e7eb', gapWidth: 2 } },
      { itemStyle: { borderWidth: 1, borderColor: isDark.value ? '#2d2d3d' : '#e5e7eb', gapWidth: 1 }, upperLabel: { show: true, color: isDark.value ? '#e5e7eb' : '#374151' } },
    ],
    data: [
      { name: 'Kimyasallar', value: 3200, children: [
        { name: 'Solventler', value: 1200 }, { name: 'Reçineler', value: 900 },
        { name: 'Asitler', value: 650 }, { name: 'Bazlar', value: 450 },
      ]},
      { name: 'Yapı Malzemeleri', value: 2800, children: [
        { name: 'Boyalar', value: 1100 }, { name: 'Yapıştırıcılar', value: 850 },
        { name: 'İzolasyon', value: 500 }, { name: 'Kaplama', value: 350 },
      ]},
      { name: 'Ambalaj', value: 1500, children: [
        { name: 'Plastik', value: 600 }, { name: 'Kağıt', value: 500 }, { name: 'Metal', value: 400 },
      ]},
      { name: 'Hammadde', value: 2100, children: [
        { name: 'Polimer', value: 900 }, { name: 'Metal', value: 700 }, { name: 'Tekstil', value: 500 },
      ]},
    ],
  }],
}))

const skuBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 30, bottom: 10, left: 8, containLabel: true },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['SKU-A001', 'SKU-B045', 'SKU-C012', 'SKU-D089', 'SKU-E034', 'SKU-F067', 'SKU-G023'], inverse: true },
  series: [{
    type: 'bar', data: [2450, 1890, 1560, 1340, 1120, 980, 840], barWidth: 14,
    itemStyle: { borderRadius: [0, 6, 6, 0], color: (p) => CHART_PALETTE[p.dataIndex % CHART_PALETTE.length] },
    label: { show: true, position: 'right', fontSize: 10, fontWeight: 600 },
  }],
}))

const productTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { top: 20, right: 16, bottom: 24, left: 48 },
  xAxis: { type: 'category', data: MONTHS_TR },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar', data: [320, 280, 350, 420, 380, 460, 510, 490, 530, 580, 620, 680],
    itemStyle: { borderRadius: [4, 4, 0, 0], color: CHART_PALETTE[0] },
    label: { show: true, position: 'top', fontSize: 10 },
  }],
}))

const listingStatusOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['52%', '78%'], center: ['50%', '42%'],
    itemStyle: { borderRadius: 6, borderWidth: 3, borderColor: isDark.value ? '#1a1a28' : '#ffffff' },
    label: { show: true, position: 'center',
      formatter: '{total|12,847}\n{sub|Toplam Ürün}',
      rich: { total: { fontSize: 20, fontWeight: 700, color: isDark.value ? '#e5e7eb' : '#1f2937', lineHeight: 32 }, sub: { fontSize: 11, color: '#9ca3af', lineHeight: 18 } },
    },
    data: [
      { value: 9245, name: 'Aktif', itemStyle: { color: '#10b981' } },
      { value: 2100, name: 'Pasif', itemStyle: { color: '#6b7280' } },
      { value: 1502, name: 'Draft', itemStyle: { color: '#f59e0b' } },
    ],
  }],
}))
</script>
