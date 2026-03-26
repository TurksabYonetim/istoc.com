import { getBaseUrl } from './url'
import { getSessionUser, getRedirectUrl } from './auth'

const LOGIN_URL = `${getBaseUrl()}pages/auth/login.html`

/**
 * Install bfcache guard — re-checks session when browser restores a page
 * from back/forward cache. Calls onInvalid() if session state changed.
 */
function installBfcacheGuard(onInvalid: (user: ReturnType<typeof getSessionUser>) => void): void {
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      onInvalid(getSessionUser())
    }
  })
}

/**
 * Redirect to login if no active session.
 * Also guards against bfcache (back/forward navigation after logout).
 */
export async function requireAuth(): Promise<void> {
  const user = await getSessionUser()
  if (!user) {
    window.location.replace(LOGIN_URL)
    await new Promise(() => {})
  }

  installBfcacheGuard((check) => {
    check.then(u => {
      if (!u) window.location.replace(LOGIN_URL)
    })
  })
}

/** Redirect based on seller status */
export async function requireSeller(): Promise<void> {
  const user = await getSessionUser()
  if (!user) {
    window.location.replace(LOGIN_URL)
    await new Promise(() => {})
  }
  if (user!.pending_seller_application || user!.rejected_seller_application) {
    window.location.href = '/pages/seller/application-pending.html'
    return
  }
  if (!user!.is_seller || !user!.has_seller_profile) {
    window.location.href = '/'
  }

  installBfcacheGuard((check) => {
    check.then(u => {
      if (!u) window.location.replace(LOGIN_URL)
    })
  })
}

/** Redirect admin to Frappe Desk */
export async function blockAdmin(): Promise<void> {
  const user = await getSessionUser()
  if (user?.is_admin) {
    window.location.href = getRedirectUrl(user)
  }
}

/**
 * Redirect away from login/register pages if already logged in.
 * Prevents logged-in users from seeing auth pages via back button.
 */
export async function requireGuest(): Promise<void> {
  const user = await getSessionUser()
  if (user) {
    window.location.replace(getRedirectUrl(user))
    await new Promise(() => {})
  }

  installBfcacheGuard((check) => {
    check.then(u => {
      if (u) window.location.replace(getRedirectUrl(u))
    })
  })
}
