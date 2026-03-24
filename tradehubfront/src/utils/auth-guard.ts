import { getBaseUrl } from './url'
import { getSessionUser, getRedirectUrl } from './auth'

const LOGIN_URL = `${getBaseUrl()}pages/auth/login.html`

/**
 * Redirect to login if no active session.
 * Also installs a `pageshow` listener so that when the browser restores
 * this page from bfcache (back/forward navigation), the session is
 * re-checked immediately — preventing stale logged-in pages from showing.
 */
export async function requireAuth(): Promise<void> {
  const user = await getSessionUser()
  if (!user) {
    // Replace current history entry so pressing "forward" won't come back here
    window.location.replace(LOGIN_URL)
    // Halt script execution — page is navigating away
    await new Promise(() => {})
  }

  // Guard against bfcache: when the user logs out and presses "back",
  // the browser restores this page from memory without running the module
  // again.  The `pageshow` event fires in that case with persisted=true.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      // Page was restored from bfcache — re-check session
      getSessionUser().then(u => {
        if (!u) window.location.replace(LOGIN_URL)
      })
    }
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
}

/** Redirect admin to Frappe Desk */
export async function blockAdmin(): Promise<void> {
  const user = await getSessionUser()
  if (user?.is_admin) {
    window.location.href = getRedirectUrl(user)
  }
}
