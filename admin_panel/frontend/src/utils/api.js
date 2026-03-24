// Relative URL kullan - Vite proxy üzerinden Frappe backend'e ulaşır
const BASE_URL = ''

async function request(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Frappe-CSRF-Token': getCookie('csrf_token') || 'None',
    },
    credentials: 'include',
  }
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data)
  }

  const url = `${BASE_URL}${endpoint}`
  let response
  try {
    response = await fetch(url, options)
  } catch (err) {
    throw new Error('Sunucuya bağlanılamadı. Lütfen Frappe backend\'in çalıştığından emin olun.')
  }

  // Handle non-JSON responses gracefully
  const contentType = response.headers.get('content-type') || ''
  let result
  if (contentType.includes('application/json')) {
    try {
      result = await response.json()
    } catch {
      throw new Error(`Sunucudan geçersiz JSON yanıtı alındı (HTTP ${response.status})`)
    }
  } else {
    const text = await response.text()
    if (!response.ok) {
      throw new Error(`Sunucu hatası: HTTP ${response.status}`)
    }
    // Some Frappe endpoints return text (e.g. login returns "Logged In")
    result = { message: text }
  }

  if (!response.ok) {
    // Frappe hata mesajını düzgün çözümle
    let msg = result?.message || ''

    // _server_messages: JSON-encoded array of JSON-encoded message objects
    if (!msg && result?._server_messages) {
      try {
        const msgs = JSON.parse(result._server_messages)
        const first = msgs?.[0]
        if (first) {
          const parsed = typeof first === 'string' ? JSON.parse(first) : first
          msg = parsed?.message || parsed?.title || String(first)
        }
      } catch { /* ignore */ }
    }

    // exception field (stack trace summary)
    if (!msg && result?.exception) {
      msg = result.exception.split('\n').pop()?.trim() || result.exception
    }

    msg = msg || result?.exc_type || `HTTP ${response.status}`
    throw new Error(msg)
  }
  return result
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return ''
}

export default {
  // Auth
  async login(usr, pwd) {
    return request('POST', '/api/method/login', { usr, pwd })
  },
  async logout() {
    return request('POST', '/api/method/logout')
  },
  async getLoggedUser() {
    const res = await request('GET', '/api/method/frappe.auth.get_logged_user')
    const email = res.message
    if (!email || email === 'Guest') {
      throw new Error('Oturum açılmamış')
    }
    const userRes = await request('GET', `/api/resource/User/${encodeURIComponent(email)}`)
    return userRes.data
  },

  // Registration
  async register(email, fullName) {
    return request('POST', '/api/method/frappe.core.doctype.user.user.sign_up', {
      email,
      full_name: fullName,
      redirect_to: '/',
    })
  },

  // Forgot password
  async forgotPassword(email) {
    return request('POST', '/api/method/frappe.core.doctype.user.user.reset_password', {
      user: email,
    })
  },

  // Generic CRUD
  async getList(doctype, params = {}) {
    const qs = new URLSearchParams({
      fields: JSON.stringify(params.fields || ['*']),
      filters: JSON.stringify(params.filters || []),
      order_by: params.order_by || 'modified desc',
      limit_start: params.limit_start || 0,
      limit_page_length: params.limit_page_length || 20,
    })
    return request('GET', `/api/resource/${encodeURIComponent(doctype)}?${qs}`)
  },
  async getDoc(doctype, name) {
    return request('GET', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`)
  },
  async createDoc(doctype, data) {
    return request('POST', `/api/resource/${encodeURIComponent(doctype)}`, data)
  },
  async updateDoc(doctype, name, data) {
    return request('PUT', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, data)
  },
  async deleteDoc(doctype, name) {
    return request('DELETE', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`)
  },
  async callMethod(method, args = {}) {
    return request('POST', `/api/method/${method}`, args)
  },
  async getCount(doctype, filters = []) {
    const qs = new URLSearchParams({ filters: JSON.stringify(filters) })
    return request('GET', `/api/method/frappe.client.get_count?doctype=${encodeURIComponent(doctype)}&${qs}`)
  },
  async getSessionUser() {
    return request('GET', '/api/method/tradehub_core.api.v1.auth.get_session_user')
  },
  async getMeta(doctype) {
    // frappe.desk.form.load.getdoctype — tüm authenticated user'lar için çalışır
    // Yanıt formatı: { "docs": [{ name, fields, ... }], "message": null }
    const qs = new URLSearchParams({ doctype, with_parent: 0, cached_timestamp: '' })
    const res = await request('GET', `/api/method/frappe.desk.form.load.getdoctype?${qs}`)
    // docs top-level'da gelir, message içinde değil
    const meta = res.docs?.[0] || res.message?.docs?.[0] || {}
    return { message: meta }
  },

  /** Link alanı için bağlı DocType'ta arama yapar */
  async searchLink(doctype, query = '', filters = []) {
    const qs = new URLSearchParams({
      doctype,
      txt: query,
      page_length: 10,
      filters: JSON.stringify(filters),
    })
    return request('GET', `/api/method/frappe.desk.search.search_link?${qs}`)
  },
}
