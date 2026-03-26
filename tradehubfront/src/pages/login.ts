/**
 * Login Page — Entry Point
 * Assembles AuthLayout with LoginPage content for the login flow.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { startAlpine } from '../alpine'
import { t } from '../i18n'
import { requireGuest } from '../utils/auth-guard'

// Auth components
import { AuthLayout, initAuthLayout, LoginPage, initLoginPage } from '../components/auth'

// If already logged in, redirect away from login page
await requireGuest()

/* ── App Setup ───────────────────────────────────────── */

const appEl = document.querySelector<HTMLDivElement>('#app')!
appEl.innerHTML = AuthLayout(LoginPage(), {
  title: t('auth.login.title'),
  showBackButton: true,
})

/* ── Initialize Behaviors ─────────────────────────────── */

// Initialize Flowbite components (dropdowns, modals, etc.)
initFlowbite()

// Initialize auth layout (back button handler)
initAuthLayout()

// Initialize login page interactivity (social buttons, links)
initLoginPage()

// Start Alpine AFTER innerHTML is set so it can find all x-data directives in the DOM
startAlpine()
