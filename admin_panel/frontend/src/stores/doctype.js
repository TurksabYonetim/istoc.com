import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useDocTypeStore = defineStore('doctype', () => {
  const metaCache = ref({})
  const loadingMeta = ref(false)

  async function getMeta(doctype) {
    if (metaCache.value[doctype]) return metaCache.value[doctype]
    loadingMeta.value = true
    try {
      let meta = null

      // 1. Önce frappe.desk.form.load.getdoctype dene (tüm authenticated user'lar için açık)
      try {
        const res = await api.getMeta(doctype)
        meta = res.message || null
      } catch (e) {
        // 403 veya başka hata → fallback'e geç
      }

      // 2. Eğer meta gelmezse ve Listing ise custom endpoint kullan
      if ((!meta || !meta.fields?.length) && doctype === 'Listing') {
        try {
          const res = await api.callMethod('tradehub_core.api.listing.get_listing_meta')
          const fields = res.message?.fields || []
          meta = { fields, name: 'Listing' }
        } catch (e2) {
          meta = { fields: [] }
        }
      }

      if (!meta) meta = { fields: [] }
      metaCache.value[doctype] = meta
      return meta
    } finally {
      loadingMeta.value = false
    }
  }

  function clearMeta(doctype) {
    if (doctype) delete metaCache.value[doctype]
    else metaCache.value = {}
  }

  return { metaCache, loadingMeta, getMeta, clearMeta }
})
