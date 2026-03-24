/**
 * Register Page — Entry Point
 * Assembles AuthLayout with RegisterPage content for the registration flow.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'

// Auth components
import { AuthLayout, initAuthLayout, RegisterPage, initRegisterPage, getBaseUrl } from '../components/auth'
import { startAlpine } from '../alpine'

/* ── App Setup ───────────────────────────────────────── */

const appEl = document.querySelector<HTMLDivElement>('#app')!
appEl.innerHTML = AuthLayout(RegisterPage(), {
  title: t('auth.register.title'),
  showBackButton: true,
})

/* ── Initialize Behaviors ─────────────────────────────── */

// Initialize Flowbite components (dropdowns, modals, etc.)
initFlowbite()

// Initialize auth layout (back button handler)
initAuthLayout()

// Start Alpine.js (processes x-data, x-show, @click directives in the DOM)
startAlpine()

// Initialize register page interactivity (transitional bridge for callbacks)
initRegisterPage({
  onComplete: (_data) => {
    // In production, this would send data to the backend
    // For now, redirect to homepage after successful registration
    window.location.href = getBaseUrl();
  }
})
