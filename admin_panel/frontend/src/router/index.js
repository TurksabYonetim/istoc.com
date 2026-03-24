import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layout
import AppLayout from '@/layouts/AppLayout.vue'

// Views (lazy-loaded)
const LoginView = () => import('@/views/auth/LoginView.vue')
const DocTypeListView = () => import('@/views/doctype/DocTypeListView.vue')
const SellerOrdersView = () => import('@/views/seller/SellerOrdersView.vue')
const ListingModerationView = () => import('@/views/products/ListingModerationView.vue')
const CategoryModerationView = () => import('@/views/products/CategoryModerationView.vue')
const SellerListingsView = () => import('@/views/seller/SellerListingsView.vue')
const SellerCategoriesView = () => import('@/views/seller/SellerCategoriesView.vue')
const ListingFormView = () => import('@/views/seller/ListingFormView.vue')

// Dashboard — simplified for current doctypes
const PlatformOverview = () => import('@/views/dashboard/PlatformOverview.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: PlatformOverview,
        meta: { title: 'Genel Bakış', breadcrumb: 'Genel Bakış', section: 'dashboard' },
      },
      {
        path: 'seller-orders',
        name: 'SellerOrders',
        component: SellerOrdersView,
        meta: { title: 'Siparişlerim', breadcrumb: 'Siparişlerim', section: 'orders' },
      },
      {
        path: 'listing-moderation',
        name: 'ListingModeration',
        component: ListingModerationView,
        meta: { title: 'Ürün Moderasyonu', breadcrumb: 'Ürün Moderasyonu', section: 'catalog' },
      },
      {
        path: 'seller-listings',
        name: 'SellerListings',
        component: SellerListingsView,
        meta: { title: 'Ürünlerim', breadcrumb: 'Ürünlerim', section: 'products' },
      },
      {
        path: 'category-moderation',
        name: 'CategoryModeration',
        component: CategoryModerationView,
        meta: { title: 'Kategori Moderasyonu', breadcrumb: 'Kategori Moderasyonu', section: 'catalog' },
      },
      {
        path: 'seller-categories',
        name: 'SellerCategories',
        component: SellerCategoriesView,
        meta: { title: 'Kategorilerim', breadcrumb: 'Kategorilerim', section: 'products' },
      },
      // Listing için özel form (tab'lı, child table editörlü)
      {
        path: 'app/Listing/:name',
        name: 'ListingForm',
        component: ListingFormView,
        meta: { title: 'Ürün', breadcrumb: 'Ürün', section: 'products' },
      },
      // Generic DocType list/form — works for any existing DocType
      {
        path: 'app/:doctype',
        name: 'DocTypeList',
        component: DocTypeListView,
        meta: { title: 'Liste', breadcrumb: 'Liste', section: 'management' },
      },
      {
        path: 'app/:doctype/:name',
        name: 'DocTypeForm',
        component: () => import('@/views/doctype/DocTypeFormView.vue'),
        meta: { title: 'Detay', breadcrumb: 'Detay', section: 'management' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Storefront URL for redirect
const STOREFRONT_URL = 'http://localhost:5173/'

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated && !to.meta.guest) {
    try { await auth.fetchUser() } catch { }
  }
  if (!to.meta.guest && !auth.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return next('/dashboard')
  }
  // Admins and sellers can access the panel
  if (!to.meta.guest && auth.isAuthenticated && !auth.isAdmin && !auth.isSeller) {
    window.location.href = STOREFRONT_URL
    return
  }
  next()
})

export default router
