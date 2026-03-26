import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useTenantStore = defineStore('tenant', () => {
  const dropdownOpen = ref(false)

  const activeTenant = computed(() => {
    const auth = useAuthStore()
    const user = auth.user
    if (!user) return null

    const name = user.full_name || user.email || 'Kullanıcı'
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)

    return {
      id: user.email,
      initials,
      name,
      role: user.is_admin ? 'Admin' : user.is_seller ? 'Satıcı' : 'Alıcı',
      gradient: 'from-violet-500 to-indigo-600',
    }
  })

  const tenants = computed(() => {
    const active = activeTenant.value
    return active ? [active] : []
  })

  const activeTenantId = computed(() => activeTenant.value?.id || '')

  const shortName = computed(() => {
    const name = activeTenant.value?.name || ''
    return name.length > 10 ? name.substring(0, 9) + '.' : name
  })

  function switchTenant() {
    dropdownOpen.value = false
  }

  function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
  }

  function closeDropdown() {
    dropdownOpen.value = false
  }

  return {
    tenants,
    activeTenantId,
    activeTenant,
    shortName,
    dropdownOpen,
    switchTenant,
    toggleDropdown,
    closeDropdown,
  }
})
