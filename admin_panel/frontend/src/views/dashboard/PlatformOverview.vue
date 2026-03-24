<template>
  <div>
    <!-- Top KPI Row — Real data from existing DocTypes -->
    <DashboardGrid>
      <KpiCard
        title="Toplam Kullanıcı"
        :value="String(kpi.totalUsers)"
        icon="fas fa-users"
        iconBg="bg-violet-50"
        iconColor="text-violet-500"
        :loading="loading"
      />
      <KpiCard
        title="Alıcı Profilleri"
        :value="String(kpi.buyerProfiles)"
        icon="fas fa-user"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
        :loading="loading"
      />
      <KpiCard
        title="Satıcı Profilleri"
        :value="String(kpi.sellerProfiles)"
        icon="fas fa-store"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
        :loading="loading"
      />
      <KpiCard
        title="Satıcı Başvuruları"
        :value="String(kpi.sellerApplications)"
        icon="fas fa-file-text"
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
        :loading="loading"
      />
    </DashboardGrid>

    <!-- Seller Application Status Breakdown -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Başvuru Durumları" subtitle="Satıcı başvurularının durum dağılımı" size="lg">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div v-for="s in applicationStatuses" :key="s.label" class="th-mini-stat">
            <span class="th-mini-stat-value" :class="s.color">{{ s.count }}</span>
            <span class="th-mini-stat-label">{{ s.label }}</span>
          </div>
        </div>
      </WidgetWrapper>

      <WidgetWrapper title="Profil Durumları" subtitle="Alıcı ve satıcı profil durumları" size="lg">
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-emerald-500">{{ profileStats.buyerActive }}</span>
            <span class="th-mini-stat-label">Alıcı (Aktif)</span>
          </div>
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-red-500">{{ profileStats.buyerDeactivated }}</span>
            <span class="th-mini-stat-label">Alıcı (Deaktif)</span>
          </div>
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-amber-500">{{ profileStats.buyerSuspended }}</span>
            <span class="th-mini-stat-label">Alıcı (Askıda)</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-emerald-500">{{ profileStats.sellerActive }}</span>
            <span class="th-mini-stat-label">Satıcı (Aktif)</span>
          </div>
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-red-500">{{ profileStats.sellerDeactivated }}</span>
            <span class="th-mini-stat-label">Satıcı (Deaktif)</span>
          </div>
          <div class="th-mini-stat">
            <span class="th-mini-stat-value text-amber-500">{{ profileStats.sellerSuspended }}</span>
            <span class="th-mini-stat-label">Satıcı (Askıda)</span>
          </div>
        </div>
      </WidgetWrapper>
    </DashboardGrid>

    <!-- Quick Links -->
    <DashboardGrid class="mt-5">
      <WidgetWrapper title="Hızlı Erişim" subtitle="Sık kullanılan yönetim sayfaları" size="full">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            style="border-color: var(--th-border)"
          >
            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm" :class="link.iconClass">
              <i :class="link.icon"></i>
            </div>
            <div>
              <div class="text-sm font-medium" style="color: var(--th-text-primary)">{{ link.label }}</div>
              <div class="text-[11px]" style="color: var(--th-text-tertiary)">{{ link.count }} kayıt</div>
            </div>
          </router-link>
        </div>
      </WidgetWrapper>
    </DashboardGrid>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/utils/api'
import DashboardGrid from '@/components/dashboard/layout/DashboardGrid.vue'
import WidgetWrapper from '@/components/dashboard/layout/WidgetWrapper.vue'
import KpiCard from '@/components/dashboard/widgets/KpiCard.vue'

const loading = ref(true)

const kpi = reactive({
  totalUsers: 0,
  buyerProfiles: 0,
  sellerProfiles: 0,
  sellerApplications: 0,
})

const applicationStatuses = ref([])

const profileStats = reactive({
  buyerActive: 0,
  buyerDeactivated: 0,
  buyerSuspended: 0,
  sellerActive: 0,
  sellerDeactivated: 0,
  sellerSuspended: 0,
})

const quickLinks = ref([])

async function getCount(doctype, filters = []) {
  try {
    const res = await api.getCount(doctype, filters)
    return res.message || 0
  } catch {
    return 0
  }
}

async function loadDashboard() {
  loading.value = true
  try {
    const [
      totalUsers, buyerProfiles, sellerProfiles, sellerApplications,
      appDraft, appSubmitted, appUnderReview, appApproved, appRejected,
      buyerActive, buyerDeactivated, buyerSuspended,
      sellerActive, sellerDeactivated, sellerSuspended,
    ] = await Promise.all([
      getCount('User', [['user_type', '=', 'Website User']]),
      getCount('Buyer Profile'),
      getCount('Seller Profile'),
      getCount('Seller Application'),
      getCount('Seller Application', [['status', '=', 'Draft']]),
      getCount('Seller Application', [['status', '=', 'Submitted']]),
      getCount('Seller Application', [['status', '=', 'Under Review']]),
      getCount('Seller Application', [['status', '=', 'Approved']]),
      getCount('Seller Application', [['status', '=', 'Rejected']]),
      getCount('Buyer Profile', [['status', '=', 'Active']]),
      getCount('Buyer Profile', [['status', '=', 'Deactivated']]),
      getCount('Buyer Profile', [['status', '=', 'Suspended']]),
      getCount('Seller Profile', [['status', '=', 'Active']]),
      getCount('Seller Profile', [['status', '=', 'Deactivated']]),
      getCount('Seller Profile', [['status', '=', 'Suspended']]),
    ])

    kpi.totalUsers = totalUsers
    kpi.buyerProfiles = buyerProfiles
    kpi.sellerProfiles = sellerProfiles
    kpi.sellerApplications = sellerApplications

    applicationStatuses.value = [
      { label: 'Taslak', count: appDraft, color: 'text-gray-500' },
      { label: 'Gönderildi', count: appSubmitted, color: 'text-blue-500' },
      { label: 'İnceleniyor', count: appUnderReview, color: 'text-indigo-500' },
      { label: 'Onaylandı', count: appApproved, color: 'text-emerald-500' },
      { label: 'Reddedildi', count: appRejected, color: 'text-red-500' },
    ]

    profileStats.buyerActive = buyerActive
    profileStats.buyerDeactivated = buyerDeactivated
    profileStats.buyerSuspended = buyerSuspended
    profileStats.sellerActive = sellerActive
    profileStats.sellerDeactivated = sellerDeactivated
    profileStats.sellerSuspended = sellerSuspended

    quickLinks.value = [
      { label: 'Satıcı Başvuruları', to: '/app/Seller Application', icon: 'fas fa-file-text', iconClass: 'bg-amber-50 text-amber-500', count: sellerApplications },
      { label: 'Satıcı Profilleri', to: '/app/Seller Profile', icon: 'fas fa-store', iconClass: 'bg-emerald-50 text-emerald-500', count: sellerProfiles },
      { label: 'Alıcı Profilleri', to: '/app/Buyer Profile', icon: 'fas fa-user', iconClass: 'bg-blue-50 text-blue-500', count: buyerProfiles },
      { label: 'Kullanıcılar', to: '/app/User', icon: 'fas fa-users', iconClass: 'bg-violet-50 text-violet-500', count: totalUsers },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
