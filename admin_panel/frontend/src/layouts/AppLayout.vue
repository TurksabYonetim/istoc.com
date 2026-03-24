<template>
  <div class="h-full font-sans bg-[#f6f6f9] text-gray-800 antialiased">
    <div class="flex h-full">
      <!-- IconRail: always visible -->
      <IconRail />

      <!-- SidePanel: toggle open/close at all sizes -->
      <SidePanel />

      <!-- Main content: flex-1 fills remaining space -->
      <div class="flex-1 min-w-0 flex flex-col min-h-screen">
        <AppHeader />
        <NotificationPanel />

        <main class="flex-1 p-4 xl:p-6 page-content">
          <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </main>

        <AppFooter />
      </div>
    </div>

    <ToastContainer />

    <!-- Floating Storefront Button (Satıcı / Admin kullanıcılar için) -->
    <a
      v-if="showStorefrontBtn"
      :href="storefrontUrl"
      target="_blank"
      rel="noopener noreferrer"
      title="Mağazaya Git"
      class="th-goto-storefront-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" style="flex-shrink:0;margin-top:1px">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
      </svg>
      <span>Mağaza</span>
    </a>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useAuthStore } from '@/stores/auth'
import IconRail from '@/components/layout/IconRail.vue'
import SidePanel from '@/components/layout/SidePanel.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import NotificationPanel from '@/components/layout/NotificationPanel.vue'
import ToastContainer from '@/components/layout/ToastContainer.vue'

const route = useRoute()
const nav = useNavigationStore()
const auth = useAuthStore()

const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173/'
const showStorefrontBtn = computed(() => auth.isSeller || auth.isAdmin)

onMounted(() => {
  nav.restoreFromUrl(route.path)
})
</script>

<style scoped>
.th-goto-storefront-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #2c3e50;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: background 0.15s ease;
  line-height: 1;
}
.th-goto-storefront-btn:hover {
  background: #1a252f;
}
</style>
