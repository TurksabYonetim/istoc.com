import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isLoading = computed(() => loading.value)

  const userInitials = computed(() => {
    if (!user.value?.full_name) return '??'
    return user.value.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })

  const userName = computed(() => user.value?.full_name || user.value?.email || '')

  const isSeller = computed(() => !!user.value?.is_seller)
  const isAdmin = computed(() => !!user.value?.is_admin)

  async function login(email, password) {
    loading.value = true
    error.value = null
    successMessage.value = null
    try {
      await api.login(email, password)
      await fetchUser()
    } catch (err) {
      error.value = err.message || 'Giriş başarısız'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    try {
      const res = await api.getSessionUser()
      const session = res.message
      if (session?.logged_in && session?.user) {
        user.value = session.user
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    }
  }

  async function logout() {
    try {
      await api.logout()
    } finally {
      user.value = null
      error.value = null
      successMessage.value = null
    }
  }

  async function register(email, fullName) {
    loading.value = true
    error.value = null
    successMessage.value = null
    try {
      await api.register(email, fullName)
      successMessage.value = 'Kayıt başarılı! E-postanızı kontrol edin.'
    } catch (err) {
      error.value = err.message || 'Kayıt başarısız'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    successMessage.value = null
    try {
      await api.forgotPassword(email)
      successMessage.value = 'Şifre sıfırlama bağlantısı e-postanıza gönderildi.'
    } catch (err) {
      error.value = err.message || 'İşlem başarısız'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    successMessage,
    isAuthenticated,
    isLoading,
    userInitials,
    userName,
    isSeller,
    isAdmin,
    login,
    fetchUser,
    logout,
    register,
    forgotPassword,
  }
})
