# TR TradeHub — Buyer Dashboard Mega Prompt

> **Versiyon:** 1.0  
> **Tarih:** 2026-02-24  
> **Hedef:** Alibaba.com alıcı kontrol panelinin birebir klonu — TR TradeHub markası altında

---

## 📋 İÇİNDEKİLER

1. [Proje Tanımı ve Hedef](#1-proje-tanımı-ve-hedef)
2. [Teknoloji Yığını](#2-teknoloji-yığını)
3. [Mimari Prensipler](#3-mimari-prensipler)
4. [Sayfa Genel Layout'u](#4-sayfa-genel-layoutu)
5. [Bileşen A — Top Navigation Header (TNH)](#5-bileşen-a--top-navigation-header-tnh)
6. [Bileşen B — Sidebar Navigasyon](#6-bileşen-b--sidebar-navigasyon)
7. [Bileşen C — NewBuyerInfo (Kullanıcı Bilgi Kartı + Slider)](#7-bileşen-c--newbuyerinfo)
8. [Bileşen D — Siparişler (Orders Section)](#8-bileşen-d--siparişler-orders-section)
9. [Bileşen E — Sağ Panel (Buyer Info Panel)](#9-bileşen-e--sağ-panel-buyer-info-panel)
10. [Global Stil Mimarisi (style.css)](#10-global-stil-mimarisi)
11. [Dosya ve Klasör Yapısı](#11-dosya-ve-klasör-yapısı)
12. [TypeScript Veri Arayüzleri (Interfaces)](#12-typescript-veri-arayüzleri)
13. [Responsive Strateji](#13-responsive-strateji)
14. [Erişilebilirlik (a11y)](#14-erişilebilirlik)
15. [Kabul Kriterleri (Acceptance Checklist)](#15-kabul-kriterleri)

---

## 1. Proje Tanımı ve Hedef

**TR TradeHub**, Alibaba.com'un alıcı (buyer) kontrol panelini birebir referans alan bir B2B marketplace platformudur. Bu mega prompt, alıcı dashboard sayfasının **tüm görünür bileşenlerini** tek bir tutarlı doküman altında tanımlar.

### Referans Görseller

Ekte verilen iki ekran görüntüsü **tek kaynak doğruluk noktası (single source of truth)** olarak kabul edilecektir:

- **Görsel 1 (Varsayılan Durum):** Sidebar kapalı, tüm bileşenler normal durumda — üst navigasyon, sol sidebar (expanded), orta alan (NewBuyerInfo + Siparişler), sağ panel (Favoriler + Göz Atma Geçmişi + Promosyon)
- **Görsel 2 (Flyout Açık Durum):** "Kaydettiklerim ve geçmişim" menü öğesine hover yapıldığında flyout submenu açık — Favorilerim, Göz atma geçmişiniz alt linkleri görünür

> ⚠️ **KRİTİK KURAL:** Görseldeki piksel düzeni, renk tonları, aralıklar ve hiyerarşi her zaman spec metninden önceliklidir. Spec ile görsel arasında çelişki varsa, **görsele sadık kal.**

### Alibaba → TR TradeHub Marka Dönüşümü

| Orijinal (Alibaba) | Dönüşüm (TR TradeHub) |
|---|---|
| Alibaba.com logosu | TR TradeHub logosu (prop ile alınır) |
| "Alibabam" metni | Tamamen kaldırılır |
| "Alibaba.com deneyiminizi kişiselleştirin" | "TR TradeHub deneyiminizi kişiselleştirin" |
| Alibaba domain referansları | TR TradeHub domain'i ile değiştirilir |
| "Trade Assurance" | "Güvenli Ticaret" olarak Türkçeleştirilir |

Bunun dışında tüm UI yapısı, renkler, boyutlar ve davranışlar Alibaba.com ile **birebir aynı** kalır.

---

## 2. Teknoloji Yığını

| Teknoloji | Versiyon | Kullanım Amacı |
|---|---|---|
| **Vanilla TypeScript** | `~5.9.3` | Ana geliştirme dili — Framework YOK (React/Vue/Angular yok) |
| **Vite** | `7.3+` | Build tool ve dev server |
| **Tailwind CSS** | `^4.1.18` | Utility-first CSS framework |
| `@tailwindcss/vite` | `^4.1.18` | Vite entegrasyonu |
| **Flowbite** | `^4.0.1` | UI bileşen kütüphanesi (dropdown, tooltip, badge) |
| **Swiper** | `^12.1.0` | Slider/carousel kütüphanesi |

### Tailwind CSS v4 Notları

- Import syntax: `@import "tailwindcss";` (v3'teki `@tailwind base/components/utilities` DEĞİL)
- Tema tanımları: `@theme` direktifi ile custom değişkenler
- JIT modu varsayılan olarak aktif
- Swiper CSS import'ları `style.css` içinde yapılmalı

---

## 3. Mimari Prensipler

### 3.1. Dinamik ve Modüler Mimari

Her bileşen dışarıdan **yapılandırma nesneleri (props/options)** alarak kendi kendini render eden Vanilla TypeScript fonksiyonları veya sınıfları olarak tasarlanmalıdır. Statik, hardcoded HTML blokları **YASAKTIR**.

**Bileşen Üretim Paterni:**

```
function createComponent(container: HTMLElement, props: ComponentProps): void
```

veya

```
class Component {
  constructor(container: HTMLElement, props: ComponentProps) {}
  render(): void {}
  destroy(): void {}
}
```

### 3.2. DRY (Don't Repeat Yourself)

Kod tekrarını önlemek **en büyük önceliktir**. Kurallar:

- Benzer UI elemanları (kart, başlık, boş durum göstergesi vb.) için **tek bir reusable bileşen** oluştur, farklılıkları props ile yönet
- Aynı padding/radius/renk kombinasyonu birden fazla yerde hardcode edilmemeli — CSS Custom Properties veya props kullan
- Dropdown menüler için tek bir `DropdownFactory` veya `createDropdown()` fonksiyonu oluştur; her dropdown'ın içeriği konfigürasyon nesnesi ile beslenir
- Sidebar menü öğeleri, tablar, istatistik kartları gibi tekrarlanan öğeler mutlaka döngü (loop) ile üretilmeli

### 3.3. Dinamik Stil Yönetimi

| Stil Türü | Yönetim Yeri |
|---|---|
| Yapısal layout (flex, grid, gap, overflow) | Tailwind utility class'ları — doğrudan HTML/TS'de |
| Dinamik değerler (renk, boyut, radius — prop'tan gelen) | Inline `style` veya `style.setProperty()` ile |
| Özel durumlar, override'lar, animasyonlar | `style.css` içinde CSS custom properties ile |
| Tema değişkenleri (tüm renkler, boyutlar, geçişler) | `:root` seviyesinde CSS custom properties |

### 3.4. Kütüphane Entegrasyonu

- **Swiper:** İlgili DOM elemanı render edildikten sonra `new Swiper()` ile izole şekilde başlatılmalı
- **Flowbite:** Dropdown'lar Flowbite API ile hover-trigger'a özelleştirilmeli (varsayılan click-trigger'ı override et)
- Kütüphane konfigürasyonları ilgili bileşen dosyasında tutulmalı, global scope'a sızmamalı

### 3.5. Tek CSS Dosyası Kuralı

**Tüm custom CSS kuralları tek bir `src/style.css` dosyasında toplanmalıdır.** Bileşen bazlı ayrı `.css` dosyası **OLUŞTURULMAMALIDIR**. Dosya içi organizasyon, yorum blokları ve section ayırıcıları ile sağlanır.

---

## 4. Sayfa Genel Layout'u

### Wireframe (Görsele Göre)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION HEADER (TNH)                              │
│  [Logo]                    [Teslimat] [Dil] [Satış] [💬] [📋] [🛒8] [24h] [👤] │
├──────────┬──────────────────────────────────────────────────┬────────────────┤
│          │  ┌─ E-posta Doğrulama Banner ──────────────┐    │                │
│          │  └──────────────────────────────────────────┘    │                │
│ SIDEBAR  │  ┌─ NewBuyerInfo ─────────────────────────┐     │  SAĞ PANEL    │
│          │  │ [Avatar] Kullanıcı Adı  [Çevrimiçi Destek]│  │  ┌──────────┐ │
│ Kontrol  │  │         Profil                           │   │  │Favoriler │ │
│ panelim  │  ├────────┬────────┬────────────────────────┤   │  └──────────┘ │
│          │  │   7    │   0    │         0              │   │  ┌──────────┐ │
│ ──────── │  │Okunmam.│Yeni fi.│     Kuponlar           │   │  │Göz atma  │ │
│ Çevr.tic.│  ├────────┴────────┴────────────────────────┤   │  │geçmişi   │ │
│ Mesajlar │  │ [Slider: Vergiden muaf... | E-postayı...] │   │  └──────────┘ │
│ Sipariş. │  │                  ● ● ◉                   │   │  ┌──────────┐ │
│ Ödeme    │  └──────────────────────────────────────────┘   │  │Promosyon │ │
│ Kaydet.. │  ┌─ Siparişler ───────────────────────────┐    │  │          │ │
│ ──────── │  │ Siparişler            Tümünü görüntüle >│    │  └──────────┘ │
│ Ekl.hiz. │  │ [Tümü][Onaylanıyor][Ödeme bek.][...]    │    │                │
│ Abonelik │  │ ┌────────────────────────────────────┐  │    │                │
│ Lojistik │  │ │ ░░░░ Gradient Arka Plan ░░░░░░░░░░ │  │    │                │
│ Stoksuz  │  │ │         📄                          │  │    │                │
│ Diğer    │  │ │   Henüz sipariş yok                 │  │    │                │
│ ──────── │  │ │   [Tedarik etmeye başla]             │  │    │                │
│ Ayarlar  │  │ └────────────────────────────────────┘  │    │                │
│ Hesap ay.│  └──────────────────────────────────────────┘   │                │
│          │                                                  │                │
│ ──────── │                                                  │                │
│ Satıcı.. │                                                  │                │
└──────────┴──────────────────────────────────────────────────┴────────────────┘
```

### Genel Layout Kuralları

| Özellik | Değer |
|---|---|
| Sayfa arka planı | `#F5F5F5` (açık gri) |
| Maksimum içerik genişliği | `1425px`, `margin: 0 auto` ile ortalanmış |
| Ana layout | 3 sütunlu — Sidebar + Orta İçerik + Sağ Panel |
| Sidebar genişliği | `260px` (expanded), `56px` (collapsed) |
| Sağ panel genişliği | `~380px` |
| Orta alan | Kalan genişlik (`flex: 1` veya `flex-grow`) |
| Sütunlar arası boşluk | `14px` (`gap-3.5`) |
| Dikey bileşen arası boşluk (orta alan) | `14px` (`mt-3.5`) |

---

## 5. Bileşen A — Top Navigation Header (TNH)

### Genel Yapı

Tam genişlik, sabit üst bar. Sayfa scroll edildiğinde sabit kalır (`sticky top-0` veya `fixed`).

### Konteyner

| Özellik | Değer |
|---|---|
| Genişlik | `w-full` (tam genişlik) |
| İç yükseklik | `32px` içerik alanı |
| Arka plan | `#2B2B2B` (koyu antrasit — saf siyah DEĞİL) |
| Yazı rengi | `#FFFFFF` (beyaz) |
| Font boyutu | `12px` |
| Z-index | `1000` |

### İç Sarmalayıcı

| Özellik | Değer |
|---|---|
| Maksimum genişlik | `1425px` |
| Yükseklik | `60px` (padding dahil) |
| Padding | `0px 40px` (sol-sağ) |
| Hizalama | `margin: 0 auto`, `flex`, `justify-between`, `items-center` |

### Sol Taraf — Logo

- TR TradeHub logosu (Alibaba logosu ve "Alibabam" metni **KALDIRILIR**)
- Logo yüksekliği: `28-32px`
- `<a>` etiketi içinde, `href="/"` ile ana sayfaya yönlendirir
- Logo `src` değeri dışarıdan prop/konfigürasyon ile alınabilir olmalı

### Sağ Taraf — 8 Öğe (soldan sağa)

Öğeler arası boşluk: `16-20px`. Tüm ikonlar **SVG, outlined/stroke, beyaz, 18-20px, stroke-width: 1.5px, renk: `currentColor`**.

| # | Öğe | İkon | Metin | Dropdown | Veri Kaynağı |
|---|---|---|---|---|---|
| 1 | Teslimat Adresi | 🇹🇷 bayrak (16px) | `Teslimat adresi: TR` | ✅ Hover — ülke/bölge seçimi | Dinamik (API/store) |
| 2 | Dil ve Para Birimi | Globe SVG (18px) | `Türkçe-USD` | ✅ Hover — dil + para birimi | Dinamik |
| 3 | Satışa Başlayın | Storefront SVG (18px) | `Satışa başlayın` | ❌ | Sabit link |
| 4 | Mesajlar | Chat-bubble SVG (18px) | — | ❌ (tooltip) | — |
| 5 | Siparişlerim | Clipboard SVG (18px) | — | ✅ Hover — Trade Assurance bilgi paneli | — |
| 6 | Sepet | Shopping-cart SVG (18px) | — | ✅ Hover (opsiyonel) | Dinamik (badge sayısı) |
| 7 | 24h Destek | "24h" rozet SVG (20px) | — | ✅ Hover — Yardım Merkezi menüsü | — |
| 8 | Profil | User-circle SVG (20px) | — | ✅ Hover — Kullanıcı menüsü | Dinamik (kullanıcı adı) |

### Sepet Badge

| Özellik | Değer |
|---|---|
| Arka plan | `#FF4747` (kırmızı) |
| Metin | `#FFFFFF`, `10-11px`, bold |
| Boyut | `16-18px` çap |
| Pozisyon | Sepet ikonunun sağ üstünde |
| İçerik | Sepetteki ürün sayısı (dinamik) |

### Dropdown İçerikleri

#### 5.1. Siparişlerim Dropdown

- Başlık: "Siparişlerim" (bold, `#000000`)
- "Güvenli Ticaret" logosu (sarı `#FFB400` daire + `$` sembolü + bold metin)
- Alt metin: "Ödemeden teslimata kadar korumanın tadını çıkarın" (gri, küçük)
- 4 madde: ✅ Güvenli ödemeler, 💰 Para iade, 🚚 Kargo/lojistik, 🔧 Satış sonrası
- Alt link: "Daha fazla bilgi alın" (`#FF6A00`, turuncu)
- Boyut: `min-width: 320px`, `padding: 20px`

#### 5.2. Yardım Merkezi Dropdown

- 5 öğe: Yardım Merkezi, Politika ve Kurallar, Bir itirazda bulunun, IPR ihlali bildirin, Kötüye kullanımı bildirin
- Öğeler arası: `1px solid #E5E5E5`
- Her öğe: `padding: 12px 20px`
- Hover: `background: #F5F5F5`
- Boyut: `min-width: 220px`

#### 5.3. Kullanıcı Menüsü Dropdown

- Başlık: "Merhaba, {kullanıcıAdı}" (bold)
- Öğeler: Siparişlerim, Mesajlarım, Fiyat Teklifi Taleplerim (RFQ), Favorilerim, Hesap Bilgilerim
- Separator: Öğeler arası `1px #E5E5E5`, "Çıkış yap" kalın separator ile ayrılmış
- Boyut: `min-width: 260px`

### Dropdown Ortak Stilleri

| Özellik | Değer |
|---|---|
| Arka plan | `#FFFFFF` |
| Border-radius | `8px` |
| Box-shadow | `0 4px 12px rgba(0,0,0,0.15)` |
| Metin rengi | `#333333` |
| Hover arka plan | `#F5F5F5` |
| Z-index | `1001` |
| Açılma animasyonu | `opacity 0→1`, `translateY(-4px)→translateY(0)`, `150ms ease` |
| Üçgen işaret | İlgili ikonun altında `8px` CSS triangle |
| Kapanma gecikmesi | `100-150ms` (hover bridge tekniği) |
| Tetikleme | **Hover** ile (click DEĞİL) |

### Responsive

| Breakpoint | Davranış |
|---|---|
| Desktop `≥1024px` | Tam görünüm — metin etiketleri + ikonlar |
| Tablet `768-1023px` | Metin gizlenir, sadece ikonlar, logo küçülür |
| Mobil `<768px` | Logo + sepet + hamburger menü, dropdown'lar dokunma ile |

### TNH Props Interface

```
TopNavHeaderProps {
  logo: { src: string; alt: string; href: string }
  user: { isLoggedIn: boolean; name?: string }
  cart: { itemCount: number }
  delivery: { countryCode: string; countryFlag: string }
  locale: { language: string; currency: string }
}
```

---

## 6. Bileşen B — Sidebar Navigasyon

### Genel Yapı

Sol tarafta dikey navigasyon menüsü. İki modda çalışır: **Expanded** (metin + ikon) ve **Collapsed** (sadece ikon). Menü öğelerinin üzerine gelindiğinde sağa doğru **flyout submenu** paneli açılır.

### Boyutlar

| Mod | Genişlik | Breakpoint |
|---|---|---|
| Expanded | `260px` | `≥1024px` |
| Collapsed | `56px` | `<1024px` |

### Konteyner Stilleri

| Özellik | Değer |
|---|---|
| Arka plan | `#FFFFFF` |
| Border-right | `1px solid #E5E7EB` |
| Yükseklik | `100vh` veya parent'a göre, scroll edilebilir |
| Padding (expanded) | Sol-sağ `16px`, üst `16px` |
| Padding (collapsed) | `8px` |
| Overflow | `overflow-y: auto` (ince scrollbar) |
| Geçiş animasyonu | `width 200ms ease-in-out` |

### Menü Yapısı (Yukarıdan Aşağıya)

#### Dashboard (Bağımsız — submenu yok)

| Özellik | Değer |
|---|---|
| İkon | Dashboard grid SVG |
| Metin | "Kontrol panelim" |
| Davranış | Tıkla → doğrudan yönlendir, flyout YOK |

#### Bölüm: `Çevrimiçi ticaret`

| # | Menü Öğesi | Chevron | Flyout Başlık | Flyout Linkleri |
|---|---|---|---|---|
| 2 | Mesajlarım | `>` | Mesajlarım | Tedarikçi mesajlarım, Ürün sorularım ve RFQ, Kişilerim |
| 3 | Siparişlerim | `>` | Siparişlerim | Tüm siparişlerim, Para iadesi ve satış sonrası, Değerlendirmelerim, Kupon ve kredilerim, Vergi bilgilerim |
| 4 | Ödeme | `>` | Ödeme | **Özet:** Ödeme yönetimi, İşlemler · **T/T:** Havale hesapları, Havale takibi · **Ek hizmetler:** Alibaba.com Kartı, Pay Later for Business |
| 5 | Kaydettiklerim ve geçmişim | `>` | Kaydettiklerim ve geçmişim | Favorilerim, Göz atma geçmişiniz |

#### Bölüm: `Eklenti hizmetleri`

| # | Menü Öğesi | Chevron | Badge | Flyout |
|---|---|---|---|---|
| 6 | Abonelik | ❌ | 🔴 "New" (`#FF4D4F`, 12px) | YOK — doğrudan link |
| 7 | Lojistik hizmetlerim | `>` | — | Lojistik siparişlerim, Lojistik siparişi değerlendirmelerim |
| 8 | Stoksuz Satış | `>` | — | Ürünleri bulun, Siparişleri yönet |
| 9 | Diğer hizmetlerim | `>` | — | Esnek ödeme koşulları: 30/60 gün, Ürün denetimi |

#### Bölüm: `Ayarlar`

| # | Menü Öğesi | Chevron | Flyout |
|---|---|---|---|
| 10 | Hesap ayarları | `>` (opsiyonel) | — |

#### Alt Kısım (Ayrı / Sticky Bottom)

| # | Menü Öğesi | İkon |
|---|---|---|
| 11 | Satıcı Sitesini Keşfedin | Çift pencere grid SVG |

### Renk Paleti (Sidebar)

| Kullanım | Renk |
|---|---|
| Metin varsayılan | `#222222` |
| Bölüm başlığı | `#999999` veya `#8C8C8C` |
| SVG ikon fill | `#222222` |
| Hover arka plan | `#F5F5F5` |
| Aktif arka plan | `#F0FFF0` (açık yeşil tint) |
| Aktif sol border | `3px solid #00B96B` (yeşil) |
| "New" badge | `#FF4D4F` |
| Flyout panel arka plan | `#FFFFFF` |
| Flyout gölge | `0 4px 12px rgba(0,0,0,0.12)` |
| Flyout border | `1px solid #E8E8E8` |
| Submenu link hover | `#FF6A00` (turuncu) |
| Chevron | `#BFBFBF` |

### Menü Öğesi Stilleri

| Özellik | Değer |
|---|---|
| Padding | `py-2.5 px-3` (`10px 12px`) |
| Font-size | `14px` |
| Font-weight | `400` |
| Border-radius | `rounded-md` (`6px`) |
| İkon boyutu | `20px` |
| İkon-metin arası boşluk | `12px` |
| Hover | arka plan `#F5F5F5`, `transition: 150ms` |
| Aktif | sol `3px #00B96B` border + `#F0FFF0` arka plan |

### Flyout Panel

| Özellik | Değer |
|---|---|
| Pozisyon | `absolute`, `left: 100%`, sidebar'ın sağına yapışık |
| Min-width | `200px` |
| Padding | `20px` |
| Border-radius | `rounded-lg` (`8px`) — sağ taraf köşeleri |
| Box-shadow | `0 4px 12px rgba(0,0,0,0.12)` |
| Link font | `14px`, `#222222` veya `#374151` |
| Link hover | `#FF6A00` veya underline |
| Alt bölüm başlığı | `12px`, `#9CA3AF`, `pt-3 mb-1` |

### Flyout Etkileşim Kuralları

- Mouse menü öğesinin üzerindeyken açılır
- Mouse flyout panele geçtiğinde **açık kalır**
- Mouse hem öğeden hem flyout'tan ayrıldığında **kapanır** (`~150ms` delay)
- Aynı anda sadece **bir** flyout açık olabilir
- Kapanma `setTimeout(150ms)` + `clearTimeout` ile yönetilir

### Collapsed Mod (Tablet / <1024px)

- Sadece SVG ikonlar görünür, metin/chevron/"New" badge/bölüm başlıkları **GİZLENİR**
- İkon kutusu: `40x40px`, `flex items-center justify-center`, `rounded-md`, `mx-auto`
- Hover'da: arka plan `#F5F5F5`, submenu varsa flyout sağa açılır
- Submenu yoksa tooltip gösterilir (Flowbite tooltip)
- Aktif öğe: aynı yeşil sol border + açık yeşil arka plan
- Geçiş: `width 200ms ease-in-out`, metin `opacity 150ms fade-in/out`

### Sidebar Veri Yapısı

```
SidebarMenuItem {
  id: string
  label: string
  icon: string          // SVG string
  href?: string
  badge?: string
  badgeColor?: string
  chevron: boolean
  submenu?: {
    title: string
    sections: { title?: string; items: { label: string; href: string }[] }[]
  }
}

SidebarSection {
  label?: string        // Bölüm başlığı
  items: SidebarMenuItem[]
}

SidebarData = SidebarSection[]

SidebarState {
  mode: 'expanded' | 'collapsed'
  activeItemId: string | null
  hoveredItemId: string | null
  flyoutOpen: boolean
}
```

---

## 7. Bileşen C — NewBuyerInfo

E-posta doğrulama banner'ının hemen altında, orta alanın üst kısmında yer alır. İki katmandan oluşur, tek beyaz kart içinde.

### Konteyner

| Özellik | Değer |
|---|---|
| Arka plan | `#FFFFFF` |
| Padding | `20px` |
| Border-radius | `rounded-lg` (`8px`) |
| Toplam boyut | `~816 x 242px` (responsive) |

### Katman 1 — Kullanıcı Bilgi Kartı

#### Üst Satır

```
[Avatar 48x48]  Kullanıcı Adı (bold, #333)     [🔴24H Çevrimiçi destek]
                Profil (mavi link, #2563EB)
```

- **Avatar:** `48x48px`, yuvarlak/kare
- **Kullanıcı Adı:** Bold, `#333333`
- **Profil Linki:** Altında, mavi `#2563EB`, tıklanabilir
- **Çevrimiçi Destek:** Sağ üst köşe, ikon + "24H" badge + "Çevrimiçi destek" metni

#### İstatistik Grid

3 eşit sütun, dikey `1px solid #E5E7EB` ayırıcı çizgilerle ayrılmış:

| Sütun | Sayı | Açıklama |
|---|---|---|
| 1 | `7` (veya dinamik) | Okunmamış mesajlar |
| 2 | `0` | Yeni fiyat teklifleri |
| 3 | `0` | Kuponlar |

- Sayı: `text-xl` veya `text-2xl`, `font-bold`, `#333333`
- Açıklama: `text-sm`, `#999999`
- Sütunlar: `divide-x divide-gray-200`, `text-center`

### Katman 2 — İşlem/Bildirim Slider'ı (Swiper)

| Özellik | Değer |
|---|---|
| Boyut | `~776 x 40px` |
| Arka plan | `#F4F4F4` |
| Padding | `10px` |
| Border-radius | `4px` |

#### Slide İçeriği

Her slide: Sol tarafta bildirim metni, sağ tarafta aksiyon linki (`justify-between`)

**Örnek slide verileri:**
1. "Vergiden muaf statüsü için hesabınızı doğrulatın" → "E-postayı doğrulayın >"
2. "TR TradeHub deneyiminizi kişiselleştirin" → "Profilinizi tamamlayın >"
3. "İlk siparişinizde %10 indirim kazanın" → "Hemen başlayın >"

#### Swiper Konfigürasyonu

| Parametre | Değer |
|---|---|
| `slidesPerView` | `1` |
| `loop` | `true` |
| `autoplay` | `{ delay: 5000 }` (opsiyonel) |
| `navigation` | `{ nextEl, prevEl }` — custom ok butonları |
| `pagination` | `{ el, clickable: true, type: 'bullets' }` |

#### Ok Butonları (Arrows)

- **Varsayılan:** Gizli (`opacity: 0`, `pointer-events: none`)
- **Hover'da:** Görünür (`opacity: 1`, `pointer-events: auto`)
- Tamamen CSS ile yönetilir — `group-hover` veya parent hover selector
- Geçiş: `opacity var(--transition-speed) var(--transition-easing)`

#### Pagination Bullets

- 3 nokta, ortalanmış, slider'ın altında
- Aktif: `#333333`, `16px × 8px`, oval (`border-radius: 4px`)
- Pasif: `#D1D5DB`, `8px × 8px`, yuvarlak

### NewBuyerInfo Props

```
NewBuyerInfoProps {
  user: {
    name: string
    avatarUrl: string
    profileHref: string
  }
  stats: {
    unreadMessages: number
    newQuotations: number
    coupons: number
  }
  notifications: {
    text: string
    actionText: string
    actionHref: string
  }[]
}
```

---

## 8. Bileşen D — Siparişler (Orders Section)

NewBuyerInfo'nun hemen altında, `mt-3.5` (14px) boşluk ile.

### Konteyner

| Özellik | Değer |
|---|---|
| Arka plan | `#FFFFFF` |
| Border-radius | `rounded-lg` |
| Box-shadow | `shadow-sm` |
| Min-height | `540px` |
| Padding | `24px` (`p-6`) |

### Header

- Sol: "Siparişler" — `text-xl font-semibold text-gray-900`
- Sağ: "Tümünü görüntüle >" — `text-sm text-blue-600 hover:underline`
- Layout: `flex items-center justify-between`
- Alt boşluk: `mb-4`

### Tab Bar (3 Ana Tab)

Layout: `flex items-center gap-3`, `mb-6`

| # | Label | Dropdown |
|---|---|---|
| 1 | Teslimat sürecinde | ❌ |
| 2 | Para iadeleri ve satış sonrası işlemler | ❌ |
| 3 | Tamamlandı ve değerlendiriliyor | ✅ Chevron ▼ |

#### Tab Stilleri

- **Inactive:** `border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 bg-white hover:border-gray-400`
- **Active:** `border-2 border-gray-900 rounded-full px-4 py-2 text-sm font-semibold text-gray-900 bg-white`
- Son tab'da chevron: `w-4 h-4 ml-1.5`, dropdown açıkken `rotate-180 transition-transform`

### Dropdown Menüsü (Son Tab)

- Tetikleme: **Click** (hover değil)
- Pozisyon: `absolute right-0 top-full mt-2`
- Stil: `bg-white rounded-lg shadow-lg border border-gray-100 min-w-[280px] py-2 z-50`

**7 Menü Öğesi:**
1. Tümü
2. Onaylanıyor
3. Ödeme bekleniyor
4. Gönderime hazırlanıyor
5. Teslimat sürecinde
6. Para iadeleri ve satış sonrası işlemler
7. Tamamlandı ve değerlendiriliyor

- Default: `px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50`
- Aktif: `text-orange-500 font-medium` + solda turuncu `✓` check ikonu
- Pasif öğelerde: `pl-6` ile hizalama boşluğu

### Dropdown Seçim Davranışı

1. Dropdown kapanır
2. Seçilen öğe aktif filtre olur
3. Tab label'ları **DEĞİŞMEZ** — 3 ana tab sabit kalır
4. Eşleşen tab varsa aktif görünür
5. İçerik alanında loading → sonuç gösterilir

### İçerik Alanı

#### Arka Plan

`background: linear-gradient(180deg, #EBF5FF 0%, #F0F7FF 50%, #FFFFFF 100%)`  
`rounded-lg`, `min-h-[380px]`

#### Empty State

- Layout: `flex flex-col items-center justify-center`
- İkon: Katlanmış köşeli kağıt SVG, `96x96px`, soluk mavi (`#93C5FD`)
- Metin: "Henüz sipariş yok" — `text-base text-gray-400 mt-4`
- Buton: "Tedarik etmeye başla" — çerçeveli (`border`), `rounded-full`, tıklanabilir

### Tab Geçiş Davranışı

1. Tab tıklanır → anında aktif stiline geçer
2. İçerik alanı kısa loading gösterir (`300-500ms`)
3. Loading görseli empty state ile birebir aynı
4. Sonra gerçek içerik veya empty state render edilir

### Orders State Interface

```
OrdersState {
  activeTabId: string
  activeFilterId: string
  isDropdownOpen: boolean
  isLoading: boolean
}
```

---

## 9. Bileşen E — Sağ Panel (Buyer Info Panel)

Sayfanın sağ tarafında, `~380px` genişlikte dikey panel. 3 section'dan oluşur, aralarında `10px` boşluk, sayfa arka planı (`#F5F5F5`) ile ayrılır.

### Ortak SectionCard Bileşeni (Reusable)

| Özellik | Değer |
|---|---|
| Arka plan | `#FFFFFF` |
| Padding | `20px` |
| Border-radius | `0px` (section seviyesinde) |
| Border | yok |
| Box-shadow | yok |

### Ortak SectionHeader Bileşeni (Reusable)

| Özellik | Değer |
|---|---|
| Layout | `flex justify-between items-center` |
| Başlık font | `18px`, bold (`700`), `#000000` |
| Aksiyon link font | `13px`, `#666666`, sağda `>` ikon |
| Alt margin | `16px` |

### 9.1. Favoriler Bölümü

- Header: "Favoriler" (aksiyon link yok)
- İçerik: **Empty State** (boş durum)
  - İkon: Kargo kutusu + pembe kalp (📦💗), `48x48px`
  - Metin: "Henüz favoriniz yok" — `14px`, `#333333`
  - Link: "Keşfedin" — `13px`, `#E67A00` (turuncu)
  - Min-height: `150px`, `flex-col items-center justify-center`
- Toplam yükseklik: `~242px`

### 9.2. Göz Atma Geçmişi Bölümü

- Header: "Göz atma geçmişi" + "Tümünü görüntüle >" (sağda)
- İçerik: **Yatay scroll ürün listesi**

#### ProductCard Bileşeni (Reusable)

| Özellik | Değer |
|---|---|
| Genişlik | `169.5px` |
| Görsel | `100%` genişlik, `~120px` yükseklik, `cover`, `rounded-lg` (`8px`) |
| Fiyat | `14px`, bold, `#000000`, `mt-2` |
| Min. sipariş | `12px`, `#999999`, `mt-0.5` |
| Element | `<a>` (tıklanabilir), `cursor-pointer` |
| Hover | `opacity: 0.85`, `transition: 150ms` |

#### Ürün Listesi

- Layout: `flex gap-3`, `overflow-x: auto`, scrollbar gizli
- Lazy load: `loading="lazy"` attribute

#### Örnek Ürün Verileri

| Görsel | Fiyat | Min. Sipariş |
|---|---|---|
| Renkli kıyafet | `$24,99-26,99` | `Min. sipariş: 100 Adet` |
| Siyah spor ayakkabı | `$14,22-18,81` | `Min. sipariş: 2 Adet` |

### 9.3. Promosyon Bölümü

- Header: "Promosyon" (aksiyon link yok)
- İçerik: **Carousel** (Swiper veya custom)

#### PromotionBanner Bileşeni (Reusable)

| Özellik | Değer |
|---|---|
| Genişlik | `340px` |
| Yükseklik | `~88px` |
| Border-radius | `12px` |
| Padding | `16px` |
| Layout | `flex row justify-between items-center` |

Sol: Başlık (`14px`, bold) + Alt metin (`12px`, `#333`, ` >` suffix), `max-width: 65-70%`  
Sağ: Görsel/logo (`48-64px`, `contain`)

#### Carousel Yapısı

- Her slide: 2 banner dikey yığılmış (`gap: 10px`), son slide 1 banner olabilir
- Geçiş: `translateX`, `300ms ease`
- Dot indicator: `6px` noktalar, aktif `8x6px` oval `#333333`, pasif `#CCCCCC`

#### Banner Verileri

**Slide 1:**
1. "Fikirlerinizi bir web sitesine dönüştürün" | `#FFF0EB` | WIX logo
2. "Tekrar eden alıcıların favori seçimlerini tedarik edin" | `#FFF3E0` | Turuncu grafik

**Slide 2:**
3. "Tedarik sürecinizi satışa çevirin" | `#E8F5E9` | "1000" rozet
4. "BEDAVA kargo" | `#FFF8E1` | Kırmızı kamyon

**Slide 3:**
5. "Bir arkadaşınızı davet edin" | `#F3E5F5` | Kişi ikonları

---

## 10. Global Stil Mimarisi

### style.css Dosya Organizasyonu

```
/* ========================================
   1. IMPORTS & TAILWIND BASE
   ======================================== */
@import "tailwindcss";
@import "swiper/css";
@import "swiper/css/navigation";
@import "swiper/css/pagination";

/* ========================================
   2. CSS CUSTOM PROPERTIES
   ======================================== */
:root { ... }

/* ========================================
   3. GLOBAL / RESET
   ======================================== */

/* ========================================
   4. TOP NAVIGATION HEADER (TNH)
   ======================================== */

/* ========================================
   5. SIDEBAR NAVİGASYON
   ======================================== */

/* ========================================
   6. BUYER DASHBOARD — NewBuyerInfo
   ======================================== */
/* 6.1 User Info Card */
/* 6.2 Operation Slider */
/* 6.3 Slider Arrows (Hover ile Görünür) */

/* ========================================
   7. SİPARİŞLER (ORDERS) SECTION
   ======================================== */

/* ========================================
   8. SAĞ PANEL (BUYER INFO PANEL)
   ======================================== */
/* 8.1 Favoriler */
/* 8.2 Göz Atma Geçmişi */
/* 8.3 Promosyon Carousel */

/* ========================================
   9. RESPONSIVE OVERRIDES
   ======================================== */
```

### CSS Custom Properties (Root Variables)

```
:root {
  /* ── Genel Renkler ── */
  --color-page-bg: #F5F5F5;
  --color-card-bg: #FFFFFF;
  --color-text-primary: #333333;
  --color-text-secondary: #999999;
  --color-text-heading: #111827;
  --color-link-blue: #2563EB;
  --color-link-orange: #FF6A00;
  --color-link-action: #E67A00;
  --color-divider: #E5E7EB;

  /* ── Header ── */
  --color-header-bg: #2B2B2B;
  --color-header-text: #FFFFFF;
  --color-badge-bg: #FF4747;
  --color-badge-text: #FFFFFF;

  /* ── Sidebar ── */
  --color-sidebar-text: #222222;
  --color-sidebar-section: #999999;
  --color-sidebar-hover-bg: #F5F5F5;
  --color-sidebar-active-bg: #F0FFF0;
  --color-sidebar-active-border: #00B96B;
  --color-sidebar-badge: #FF4D4F;
  --color-sidebar-chevron: #BFBFBF;
  --color-flyout-border: #E8E8E8;

  /* ── Dropdown ── */
  --color-dropdown-bg: #FFFFFF;
  --color-dropdown-text: #333333;
  --color-dropdown-hover: #F5F5F5;
  --color-dropdown-separator: #E5E5E5;
  --color-dropdown-shadow: 0 4px 12px rgba(0,0,0,0.15);

  /* ── Slider ── */
  --color-slider-bg: #F4F4F4;
  --color-bullet-active: #333333;
  --color-bullet-inactive: #D1D5DB;
  --color-arrow-bg: rgba(255, 255, 255, 0.85);

  /* ── Orders ── */
  --color-tab-inactive-border: #D1D5DB;
  --color-tab-active-border: #111827;
  --color-tab-inactive-text: #4B5563;
  --color-tab-active-text: #111827;
  --color-dropdown-active: #F97316;
  --color-empty-icon: #93C5FD;
  --color-empty-text: #9CA3AF;
  --gradient-orders-bg: linear-gradient(180deg, #EBF5FF 0%, #F0F7FF 50%, #FFFFFF 100%);

  /* ── Sağ Panel ── */
  --color-dot-active: #333333;
  --color-dot-inactive: #CCCCCC;

  /* ── Boyutlar ── */
  --max-content-width: 1425px;
  --sidebar-expanded-width: 260px;
  --sidebar-collapsed-width: 56px;
  --sidebar-collapse-breakpoint: 1024px;
  --right-panel-width: 380px;
  --header-height: 60px;
  --card-padding: 20px;
  --slider-padding: 10px;
  --avatar-size: 48px;

  /* ── Geçişler ── */
  --transition-speed: 0.25s;
  --transition-fast: 0.15s;
  --transition-easing: ease-in-out;

  /* ── Border Radius ── */
  --radius-card: 8px;
  --radius-slider: 4px;
  --radius-dropdown: 8px;
  --radius-banner: 12px;
  --radius-tab: 9999px;
}
```

### BEM-Light Naming Convention

Tüm custom CSS sınıfları bileşen bazlı prefix ile:

| Prefix | Bileşen |
|---|---|
| `.tnh-*` | Top Navigation Header |
| `.sidebar-*` | Sidebar |
| `.new-buyer-info*` | NewBuyerInfo |
| `.operation-slider*` | Operation Slider |
| `.orders-*` | Siparişler |
| `.section-card*` | Sağ panel ortak kart |
| `.promo-*` | Promosyon |
| `.product-*` | Ürün kartı |

Syntax: `.bileşen__eleman` (double underscore), `.bileşen--modifier` (double dash)

---

## 11. Dosya ve Klasör Yapısı

```
src/
├── components/
│   ├── top-nav-header/
│   │   ├── TopNavHeader.ts             # Ana header bileşeni
│   │   ├── TopNavDropdown.ts           # Generic dropdown factory
│   │   ├── navItems.ts                 # Sağ taraf öğe verileri
│   │   └── navIcons.ts                 # SVG ikon string'leri
│   │
│   ├── sidebar/
│   │   ├── Sidebar.ts                  # Ana sidebar (expanded + collapsed)
│   │   ├── SidebarMenuItem.ts          # Tek menü öğesi bileşeni
│   │   ├── SidebarFlyout.ts            # Flyout submenu paneli
│   │   ├── SidebarResponsive.ts        # Breakpoint dinleyici, mod geçişi
│   │   ├── sidebarData.ts              # Menü veri yapısı (config nesnesi)
│   │   └── sidebarIcons.ts             # SVG ikonları
│   │
│   ├── buyer-dashboard/
│   │   ├── NewBuyerInfo.ts             # Ana konteyner
│   │   ├── UserInfoCard.ts             # Avatar, isim, profil, destek, istatistikler
│   │   └── OperationSlider.ts          # Swiper slider (bildirim çubuğu)
│   │
│   ├── orders/
│   │   ├── OrdersSection.ts            # Ana siparişler kartı
│   │   ├── OrdersTabs.ts               # Tab bar + dropdown
│   │   ├── OrdersContent.ts            # İçerik alanı + empty state
│   │   └── ordersData.ts               # Tab ve dropdown konfigürasyonu
│   │
│   ├── right-panel/
│   │   ├── FavoritesSection.ts         # Favoriler
│   │   ├── BrowsingHistorySection.ts   # Göz atma geçmişi
│   │   ├── PromotionSection.ts         # Promosyon carousel
│   │   └── rightPanelData.ts           # Mock veri (ürünler, banner'lar)
│   │
│   └── shared/
│       ├── SectionCard.ts              # Reusable beyaz kart wrapper
│       ├── SectionHeader.ts            # Reusable başlık bileşeni
│       ├── EmptyState.ts               # Reusable boş durum göstergesi
│       ├── ProductCard.ts              # Reusable ürün kartı
│       ├── PromotionBanner.ts          # Reusable promosyon banner
│       ├── DotIndicator.ts             # Reusable sayfa noktaları
│       └── DropdownMenu.ts             # Generic dropdown menü bileşeni
│
├── types/
│   └── index.ts                        # Tüm TypeScript interface'leri
│
├── data/
│   └── mock.ts                         # Tüm mock veriler (ürünler, banner'lar, kullanıcı)
│
├── style.css                           # TEK CSS DOSYASI — tüm stiller burada
├── main.ts                             # Entry point — tüm bileşenleri mount eder
└── index.html                          # Ana HTML şablonu
```

---

## 12. TypeScript Veri Arayüzleri (Interfaces)

Tüm interface'ler `src/types/index.ts` dosyasında tanımlanır. Her bileşen kendi props interface'ine sahip olmalıdır.

### Global / Shared

```
// Ortak kart wrapper
SectionCardProps {
  padding?: string          // default: "20px"
  background?: string       // default: "#FFFFFF"
  borderRadius?: string     // default: "0px"
  className?: string
}

// Ortak başlık
SectionHeaderProps {
  title: string
  actionText?: string | null
  onActionClick?: (() => void) | null
}

// Boş durum
EmptyStateProps {
  iconHtml: string          // SVG string
  iconSize?: string         // default: "48px"
  title: string
  linkText?: string
  linkHref?: string
  linkColor?: string        // default: "#E67A00"
  minHeight?: string
}

// Ürün kartı
ProductCardProps {
  imageUrl: string
  priceRange: string
  minOrder: string
  href?: string
  borderRadius?: string     // default: "8px"
}

// Promosyon banner
PromotionBannerProps {
  title: string
  subtitle: string
  backgroundColor: string
  image?: string | null
  imageSize?: string
  href?: string
  borderRadius?: string     // default: "12px"
  textColor?: string
}

// Dot indicator
DotIndicatorProps {
  totalSlides: number
  activeIndex: number
  activeColor?: string
  inactiveColor?: string
}
```

### Top Nav Header

```
TopNavHeaderProps {
  logo: { src: string; alt: string; href: string }
  user: { isLoggedIn: boolean; name?: string }
  cart: { itemCount: number }
  delivery: { countryCode: string; countryFlag: string }
  locale: { language: string; currency: string }
}
```

### Sidebar

```
SubMenuItem { label: string; href: string }
SubMenuSection { title?: string; items: SubMenuItem[] }

SidebarMenuItem {
  id: string
  label: string
  icon: string
  href?: string
  badge?: string
  badgeColor?: string
  chevron: boolean
  submenu?: { title: string; sections: SubMenuSection[] }
}

SidebarSection { label?: string; items: SidebarMenuItem[] }

SidebarState {
  mode: 'expanded' | 'collapsed'
  activeItemId: string | null
  hoveredItemId: string | null
  flyoutOpen: boolean
}
```

### NewBuyerInfo

```
StatItem { value: number; label: string }

NotificationSlide {
  text: string
  actionText: string
  actionHref: string
}

NewBuyerInfoProps {
  user: { name: string; avatarUrl: string; profileHref: string }
  stats: StatItem[]
  notifications: NotificationSlide[]
}
```

### Orders

```
Tab { id: string; label: string; hasDropdown: boolean }
DropdownItem { id: string; label: string }

OrdersState {
  activeTabId: string
  activeFilterId: string
  isDropdownOpen: boolean
  isLoading: boolean
}
```

---

## 13. Responsive Strateji

### Breakpoint'ler

| Breakpoint | Ad | Etki |
|---|---|---|
| `≥1024px` | Desktop | Tam görünüm — tüm bileşenler |
| `768-1023px` | Tablet | Sidebar collapsed (56px), TNH ikon-only |
| `<768px` | Mobil | TNH minimal, sidebar gizli/hamburger, sağ panel alt alta |

### Bileşen Bazlı Responsive Davranış

| Bileşen | Desktop | Tablet | Mobil |
|---|---|---|---|
| TNH | Tam metin + ikon | Sadece ikon | Logo + sepet + hamburger |
| Sidebar | Expanded (260px) | Collapsed (56px) | Gizli / hamburger ile açılır |
| NewBuyerInfo | Tam genişlik | Esner | 3 sütun korunur, font küçülür |
| Orders | Tab bar yatay | Aynı | Tablar yatay scroll (`overflow-x-auto`) |
| Sağ Panel | Sabit genişlik (380px) | Aynı | Orta alanın altına düşer, full width |

### CSS Responsive Yaklaşımı

Responsive breakpoint'ler **doğrudan `style.css` içinde `@media` query'leri** ile yazılmalı, Tailwind responsive prefix'leri (`sm:`, `md:`, `lg:`) de kullanılabilir ama custom/override kurallar `style.css`'te olmalı.

---

## 14. Erişilebilirlik (a11y)

| Kural | Uygulama |
|---|---|
| ARIA label | Tüm ikonlar ve tıklanabilir elemanlar `aria-label` taşımalı |
| ARIA role | Navigasyon: `role="navigation"`, menüler: `role="menu"`, öğeler: `role="menuitem"` |
| Klavye navigasyonu | `Tab` ile gezilebilir, `Enter/Space` ile açılır, `Escape` ile kapanır |
| Focus ring | `outline: 2px solid #FF6A00` (turuncu ring) |
| Görseller | `alt` attribute zorunlu, `loading="lazy"` önerilir |
| Renk kontrastı | WCAG AA minimum 4.5:1 metin kontrastı |

---

## 15. Kabul Kriterleri (Acceptance Checklist)

### TNH (Top Navigation Header)

- [ ] Header arka planı `#2B2B2B`, tam genişlik, sticky
- [ ] İç konteyner max 1425px, padding 0 40px, ortalanmış
- [ ] Sol: TR TradeHub logosu (Alibaba logosu ve "Alibabam" YOK)
- [ ] Sağ: 8 öğe doğru sırada
- [ ] Tüm ikonlar SVG, outlined, beyaz, 18-20px
- [ ] Sepet badge kırmızı, dinamik sayı
- [ ] 5 hover dropdown çalışıyor (hover bridge, 150ms animasyon)
- [ ] Dropdown'lar beyaz, 8px radius, shadow
- [ ] Responsive: desktop tam, tablet ikon-only, mobil minimal

### Sidebar

- [ ] Expanded: 260px, tüm 11 öğe doğru sırada, doğru ikonlar
- [ ] Bölüm başlıkları doğru yerlerde
- [ ] Hover → flyout submenu açılır, doğru içerik
- [ ] Aktif öğe yeşil sol border + açık yeşil arka plan
- [ ] "New" badge Abonelik'te, kırmızı
- [ ] Flyout 150ms delay ile kapanır
- [ ] Ödeme flyout'u alt bölüm başlıkları ile gruplanmış
- [ ] Collapsed (<1024px): 56px, sadece ikon, flyout çalışır
- [ ] Expanded↔Collapsed geçişi 200ms animasyonlu

### NewBuyerInfo

- [ ] Beyaz kart, 20px padding, 8px radius
- [ ] Avatar 48px, kullanıcı adı bold, profil linki mavi
- [ ] Çevrimiçi destek sağ üstte, 24H badge
- [ ] 3 sütun istatistik, dikey ayırıcı çizgiler
- [ ] Swiper slider çalışıyor, loop mode
- [ ] Ok butonları hover'da görünür (CSS ile)
- [ ] Pagination bullet'lar doğru stil

### Siparişler

- [ ] Beyaz kart, shadow, 24px padding
- [ ] Header: "Siparişler" + "Tümünü görüntüle >"
- [ ] 3 tab, doğru active/inactive stilleri
- [ ] Son tab dropdown çalışıyor (click ile)
- [ ] Dropdown 7 öğe, seçili öğe turuncu check
- [ ] Tab geçişinde kısa loading state
- [ ] Empty state: gradient arka plan, belge ikonu, "Henüz sipariş yok"
- [ ] "Tedarik etmeye başla" butonu

### Sağ Panel

- [ ] 3 section: Favoriler, Göz Atma Geçmişi, Promosyon
- [ ] Ortak SectionCard ve SectionHeader reusable
- [ ] Favoriler empty state: ikon + "Henüz favoriniz yok" + "Keşfedin"
- [ ] Göz atma: yatay scroll ürün listesi, 2 ürün kartı
- [ ] Promosyon carousel: 3 slide, dot indicator, banner'lar doğru renk/içerik
- [ ] PromotionBanner ve ProductCard reusable

### Mimari

- [ ] Vanilla TypeScript — framework yok
- [ ] Tüm bileşenler props-driven
- [ ] DRY: Kod tekrarı yok, shared bileşenler kullanılmış
- [ ] Tek `style.css` dosyası, bileşen bazlı section'lar ile organize
- [ ] CSS Custom Properties `:root`'ta tanımlı
- [ ] BEM-light naming convention
- [ ] Swiper DOM render sonrası izole şekilde initialize edilmiş
- [ ] Flowbite dropdown hover-trigger'a özelleştirilmiş
- [ ] TypeScript strict mode, doğru tip atamaları
- [ ] Tüm interface'ler `types/index.ts`'de

---

## ⚠️ KRİTİK KURALLAR (Son Hatırlatma)

1. **Görsele sadık kal** — Spec ile görsel çelişirse görsel kazanır
2. **Tek CSS dosyası** — `style.css` dışında CSS dosyası OLUŞTURMA
3. **DRY** — Aynı bileşeni 2 kez yazma, props ile yönet
4. **Statik HTML yasak** — Her bileşen dinamik, konfigürasyon nesnesi ile çalışır
5. **Framework yasak** — React, Vue, Angular, Svelte kullanma
6. **Alibaba markası kaldır** — Logo, "Alibabam", domain referansları → TR TradeHub
7. **Tailwind v4 syntax** — `@import "tailwindcss"` kullan, eski syntax'ı kullanma
8. **TypeScript strict** — `any` tipi kullanma, tüm elementlere doğru tip ata
9. **Swiper > Flowbite carousel** — Slider için kesinlikle Swiper kullan
10. **Bu dokümanda kod yazma** — Bu prompt spesifikasyon dokümanıdır, implementasyon ayrı dosyalarda yapılır
