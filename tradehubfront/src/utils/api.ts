import { getBaseUrl } from './url'

const BASE_URL = import.meta.env.VITE_API_URL || ''

function getCsrfToken(): string {
  const match = document.cookie.match(/csrf_token=([^;]+)/) || document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : 'Guest';
}

/** Extract a human-readable error message from a Frappe JSON error body. */
function extractFrappeError(raw: string): string {
  try {
    const body = JSON.parse(raw)
    if (body._server_messages) {
      const msgs = JSON.parse(body._server_messages)
      const first = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0]
      if (first.message) return first.message
    }
    if (body.message) return body.message
  } catch { /* not JSON or unexpected structure */ }
  return ''
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': getCsrfToken(),
      ...options.headers,
    },
  })

  if (res.status === 401 || res.status === 403) {
    window.location.href = `${getBaseUrl()}pages/auth/login.html`
    throw new Error('Unauthorized')
  }

  if (res.status === 429) {
    throw new Error('RATE_LIMIT')
  }

  if (!res.ok) {
    const raw = await res.text()
    const msg = extractFrappeError(raw)
    throw new Error(msg || `HTTP ${res.status}`)
  }

  return res.json()
}

// ─── Frappe API Helpers ───────────────────────────────────────────────────────

/**
 * Frappe whitelist endpoint'i çağırır (cookie session + CSRF).
 *
 * @param method  - tam method yolu: 'tradehub_core.api.seller.get_my_profile'
 * @param params  - GET parametreleri veya POST body
 * @param post    - true ise POST, false ise GET (varsayılan: false)
 *
 * @example
 *   const user = await callMethod('tradehub_core.api.auth.get_current_user')
 *   const result = await callMethod('tradehub_core.api.seller.become_seller', { seller_name: 'Test' }, true)
 */
export async function callMethod<T = unknown>(
  method: string,
  params: Record<string, unknown> = {},
  post = false
): Promise<T> {
  const url = `${BASE_URL}/method/${method}`
  const csrf = getCsrfToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Frappe-CSRF-Token': csrf,
  }

  let res: Response
  if (post) {
    res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(params),
    })
  } else {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      )
    ).toString()
    res = await fetch(qs ? `${url}?${qs}` : url, {
      method: 'GET',
      credentials: 'include',
      headers,
    })
  }

  if (res.status === 403) {
    window.location.href = `${getBaseUrl()}pages/auth/login.html`
    throw new Error('Oturum süresi doldu')
  }

  if (!res.ok) {
    const raw = await res.text()
    const msg = extractFrappeError(raw)
    throw new Error(msg || `HTTP ${res.status}`)
  }

  const data = await res.json() as { message: T }
  return data.message
}

/** Frappe native login endpoint'i */
export async function frappeLogin(email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/method/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usr: email, pwd: password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message || 'Giriş başarısız')
  }
}

/** Frappe native logout endpoint'i */
export async function frappeLogout(): Promise<void> {
  await fetch(`${BASE_URL}/method/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-Frappe-CSRF-Token': getCsrfToken() },
  })
}
