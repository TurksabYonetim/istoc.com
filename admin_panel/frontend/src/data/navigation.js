// ======================================================
// TradeHub B2B - Navigation Data
// Gerçek Frappe backend doctypelarına göre (tradehub_core)
// Rol bazlı: admin ve satıcı ayrı navigasyon
// ======================================================

// ══════════════════════════════════════════════════════
// ADMİN NAVİGASYON
// ══════════════════════════════════════════════════════

export const adminRailSections = [
  { id: 'dashboard',  icon: 'house',        label: 'Ana Sayfa' },
  { id: 'catalog',    icon: 'package',      label: 'Katalog' },
  { id: 'commerce',   icon: 'shopping-cart', label: 'Ticaret' },
  { id: 'sellers',    icon: 'store',        label: 'Satıcılar' },
  { id: 'system',     icon: 'settings',     label: 'Sistem' },
]

export const adminSectionTitles = {
  dashboard: 'Genel Bakış',
  catalog:   'Ürün Katalogu',
  commerce:  'Ticaret & Siparişler',
  sellers:   'Satıcı Yönetimi',
  system:    'Sistem & Kullanıcılar',
}

export const adminPanelSections = {
  // ── ANA SAYFA ─────────────────────────────────────
  dashboard: [
    {
      title: null,
      color: '#7c3aed',
      items: [
        { label: 'Genel Bakış', icon: 'layout-grid', route: '/dashboard' },
      ],
    },
  ],

  // ── ÜRÜN KATALOGU ─────────────────────────────────
  catalog: [
    {
      title: 'Listinglar',
      color: '#7c3aed',
      items: [
        { label: 'Listinglar',       icon: 'list',         doctype: 'Listing' },
        { label: 'Ürün Moderasyonu',     icon: 'shield-check', route: '/listing-moderation' },
        { label: 'Kategori Moderasyonu', icon: 'folder-check', route: '/category-moderation' },
        { label: 'Kategori Yönetimi',   icon: 'folder-tree',  route: '/category-management' },
      ],
    },
    {
      title: 'Finans',
      color: '#8b5cf6',
      items: [
        { label: 'Kuponlar',         icon: 'ticket',       doctype: 'Coupon' },
        { label: 'Döviz Kurları',    icon: 'refresh-cw',   doctype: 'Currency Rate' },
      ],
    },
    {
      title: 'Kargo',
      color: '#06b6d4',
      items: [
        { label: 'Kargo Yöntemleri', icon: 'truck',        doctype: 'Shipping Method' },
      ],
    },
  ],

  // ── TİCARET & SİPARİŞLER ──────────────────────────
  commerce: [
    {
      title: 'Siparişler',
      color: '#10b981',
      items: [
        { label: 'Satıcı Siparişleri', icon: 'package',      route: '/seller-orders' },
        { label: 'Tüm Siparişler',     icon: 'shopping-bag', doctype: 'Order' },
      ],
    },
    {
      title: 'Sepetler',
      color: '#3b82f6',
      items: [
        { label: 'Sepetler',           icon: 'shopping-cart', doctype: 'Cart' },
      ],
    },
  ],

  // ── SATICI YÖNETİMİ ────────────────────────────────
  sellers: [
    {
      title: 'Başvuru & Profil',
      color: '#f59e0b',
      items: [
        { label: 'Satıcı Başvuruları', icon: 'file-text',    doctype: 'Seller Application' },
        { label: 'Satıcı Profilleri',  icon: 'user-check',   doctype: 'Seller Profile' },
        { label: 'Mağazalar',          icon: 'store',        doctype: 'Admin Seller Profile' },
        { label: 'Tedarikçi Profili',  icon: 'building-2',   doctype: 'Supplier Profile' },
        { label: 'KYB Doğrulama',    icon: 'shield-check', doctype: 'KYB Verification' },
      ],
    },
    {
      title: 'Finans & Performans',
      color: '#f59e0b',
      items: [
        { label: 'Satıcı Bakiyeleri',  icon: 'wallet',       doctype: 'Seller Balance' },
      ],
    },
    {
      title: 'Müşteri & Sosyal',
      color: '#8b5cf6',
      items: [
        { label: 'Satıcı Yorumları',   icon: 'star',         doctype: 'Seller Review' },
        { label: 'Satıcı Soruları',    icon: 'message-circle', doctype: 'Seller Inquiry' },
        { label: 'Satıcı Kategorileri',icon: 'folder',       doctype: 'Seller Category' },
        { label: 'Galeri',             icon: 'image',        doctype: 'Seller Gallery Image' },
      ],
    },
  ],

  // ── SİSTEM & KULLANICILAR ──────────────────────────
  system: [
    {
      title: 'Kullanıcılar',
      color: '#6b7280',
      items: [
        { label: 'Alıcı Profilleri',   icon: 'user',         doctype: 'Buyer Profile' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SATICI NAVİGASYON
// ══════════════════════════════════════════════════════

export const sellerRailSections = [
  { id: 'dashboard', icon: 'house',         label: 'Ana Sayfa' },
  { id: 'products',  icon: 'package',       label: 'Ürünlerim' },
  { id: 'orders',    icon: 'shopping-bag',  label: 'Siparişler' },
  { id: 'store',     icon: 'store',         label: 'Mağazam' },
]

export const sellerSectionTitles = {
  dashboard: 'Genel Bakış',
  products:  'Ürünlerim',
  orders:    'Siparişlerim',
  store:     'Mağazam',
}

export const sellerPanelSections = {
  // ── ANA SAYFA ─────────────────────────────────────
  dashboard: [
    {
      title: null,
      color: '#7c3aed',
      items: [
        { label: 'Genel Bakış', icon: 'layout-grid', route: '/dashboard' },
      ],
    },
  ],

  // ── ÜRÜNLERİM ─────────────────────────────────────
  products: [
    {
      title: 'Ürünler',
      color: '#7c3aed',
      items: [
        { label: 'Ürünlerim',     icon: 'list',   route: '/seller-listings' },
        { label: 'Kategorilerim', icon: 'folder', route: '/seller-categories' },
      ],
    },
  ],

  // ── SİPARİŞLERİM ──────────────────────────────────
  orders: [
    {
      title: 'Siparişler',
      color: '#10b981',
      items: [
        { label: 'Siparişlerim', icon: 'shopping-bag', route: '/seller-orders' },
      ],
    },
  ],

  // ── MAĞAZAM ───────────────────────────────────────
  store: [
    {
      title: 'Profil & Finans',
      color: '#f59e0b',
      items: [
        { label: 'Profilim',     icon: 'user-check',   doctype: 'Seller Profile',      sellerOwned: true },
        { label: 'KYB Doğrulama', icon: 'shield-check', doctype: 'KYB Verification',   sellerOwned: true },
        { label: 'Bakiyem',      icon: 'wallet',        doctype: 'Seller Balance',      sellerOwned: true },
      ],
    },
    {
      title: 'Müşteri & Sosyal',
      color: '#8b5cf6',
      items: [
        { label: 'Yorumlarım',   icon: 'star',          doctype: 'Seller Review',       sellerOwned: true },
        { label: 'Sorularım',    icon: 'message-circle', doctype: 'Seller Inquiry',     sellerOwned: true },
        { label: 'Kategorilerim',icon: 'folder',        doctype: 'Seller Category',     sellerOwned: true },
        { label: 'Galerим',      icon: 'image',         doctype: 'Seller Gallery Image', sellerOwned: true },
      ],
    },
  ],
}

// ── Geriye dönük uyum (admin default olarak export) ──

export const railSections = adminRailSections
export const sectionTitles = adminSectionTitles
export const panelSections = adminPanelSections

// ── Yardımcı fonksiyonlar ────────────────────────────

/** GlobalSearch için düz arama indeksi (admin) */
export const searchData = Object.entries(adminPanelSections).flatMap(([sectionId, groups]) =>
  groups.flatMap(group =>
    group.items.map(item => ({
      label: item.label,
      icon: item.icon,
      section: sectionId,
      sectionLabel: adminSectionTitles[sectionId] || sectionId,
      route: item.route || (item.doctype ? `/app/${encodeURIComponent(item.doctype)}` : null),
      doctype: item.doctype || null,
    }))
  )
)

/** Route, doctype veya report ile navigasyon öğesi ara */
export function lookupNavItem(value, type = 'route', sections = adminPanelSections) {
  const titles = sections === sellerPanelSections ? sellerSectionTitles : adminSectionTitles
  for (const [sectionId, groups] of Object.entries(sections)) {
    for (const group of groups) {
      for (const item of group.items) {
        if (type === 'route' && item.route === value) {
          return { ...item, section: sectionId, sectionTitle: titles[sectionId] }
        }
        if (type === 'doctype' && item.doctype === value) {
          return { ...item, section: sectionId, sectionTitle: titles[sectionId] }
        }
      }
    }
  }
  return null
}

/** Belirtilen section için ilk navigable route'u döndür */
export function getFirstSectionRoute(sectionId, sections = adminPanelSections) {
  const groups = sections[sectionId]
  if (!groups) return '/dashboard'
  for (const group of groups) {
    for (const item of group.items) {
      if (item.route) return item.route
      if (item.doctype) return `/app/${encodeURIComponent(item.doctype)}`
    }
  }
  return '/dashboard'
}
