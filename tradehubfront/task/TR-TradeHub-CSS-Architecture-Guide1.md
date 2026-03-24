# TR TradeHub — CSS Mimari Analizi & Dinamik Component Sistemi
## Tailwind CSS v4.2 Uyumlu

---

## 📊 Mevcut Durum Analizi

### style.css Dosyası — Sorunlar

| Sorun | Detay | Etki |
|-------|-------|------|
| **Aşırı büyüklük** | ~6500+ satır, tek dosyada her şey | Bakım zorluğu, build süresi |
| **Token'lar dinamik ama kullanım statik** | `@theme` altında token var ama component CSS'leri hardcoded değerler kullanıyor | Panel'den değiştirince etki yok |
| **Tailwind kullanımı yetersiz** | `.hFR19`, `.fy26-*`, `.rv-*`, `.sp-*` gibi sınıflar tamamen custom CSS | Tailwind avantajı kaybediliyor |
| **Tekrar eden pattern'ler** | Aynı `display: flex; align-items: center; gap: 8px;` onlarca kez yazılmış | Gereksiz şişme |
| **Sayfa-bazlı CSS tek dosyada** | Dashboard, Orders, Payment, RFQ, Messages hepsi tek CSS'te | Dead CSS yükleniyor |
| **Dark mode boş** | `.dark` override'ları light mode ile aynı değerleri tekrarlıyor | Gerçek dark mode yok |

### Dinamiklik Skoru: **3/10**

Token'lar `@theme` altında tanımlı (iyi), ancak component katmanında bu token'lara referans vermek yerine hardcoded hex değerleri kullanılmış. Örnek:

```css
/* ❌ SORUN — Hardcoded değer, panel'den değişmez */
.rv-card-name { color: #111827; }
.sp-company-name { color: #111827; }

/* ✅ OLMASI GEREKEN — Token referansı, panel'den değişir */
.rv-card-name { color: var(--color-text-heading); }
.sp-company-name { color: var(--color-text-heading); }
```

---

## 🏗️ Tailwind CSS v4 Temel Prensipler

### v4'te Neler Değişti?

Tailwind CSS v4, konfigürasyonu tamamen CSS'e taşıdı. Artık `tailwind.config.js` yok.

```css
/* ✅ v4 — Tek CSS dosyası, her şey burada */
@import "tailwindcss";

@theme {
  --color-primary-500: #cc9900;
  --font-sans: "Roboto", sans-serif;
  --radius-md: 8px;
}
```

### `@theme` vs `:root` — Kritik Fark

| Kullanım | Nerede Tanımlanır | Utility Class Üretir Mi? |
|----------|-------------------|--------------------------|
| **Design token → utility class** | `@theme { }` | ✅ Evet (örn: `bg-primary-500`, `rounded-md`) |
| **Panel-kontrollü component token** | `:root { }` | ❌ Hayır (sadece `var()` ile erişilir) |

**Kural:** `--color-*`, `--radius-*`, `--font-*`, `--shadow-*` gibi **Tailwind namespace**'leri `@theme`'de tanımlanır → otomatik utility class üretir. Component-özel token'lar (örn: `--btn-bg`, `--card-padding`) `:root`'ta tanımlanır → sadece `var()` ile kullanılır.

### `@theme inline` — Değişken Referansı

`@theme` içinde başka bir CSS variable'a referans verirken **`inline`** opsiyonu şart:

```css
/* ❌ YANLIŞ — var() @theme içinde düzgün resolve olmaz */
@theme {
  --color-cta-primary: var(--user-primary);
}

/* ✅ DOĞRU — inline ile var() referansı çalışır */
@theme inline {
  --color-cta-primary: var(--user-primary);
}
```

`inline` kullandığınızda utility class, theme variable yerine doğrudan var() referansını kullanır. Bu da runtime'da değişken değiştiğinde utility class'ların da güncellenmesini sağlar.

### Namespace Referans Tablosu (v4.2)

| Namespace | Ürettiği Utility'ler | Örnek |
|-----------|---------------------|-------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*` vb. | `--color-primary-500` → `bg-primary-500` |
| `--font-*` | `font-*` (family) | `--font-sans` → `font-sans` |
| `--text-*` | `text-*` (size) | `--text-xl` → `text-xl` |
| `--font-weight-*` | `font-*` (weight) | `--font-weight-bold` → `font-bold` |
| `--tracking-*` | `tracking-*` | `--tracking-wide` → `tracking-wide` |
| `--leading-*` | `leading-*` | `--leading-tight` → `leading-tight` |
| `--radius-*` | `rounded-*` | `--radius-md` → `rounded-md` |
| `--shadow-*` | `shadow-*` | `--shadow-card` → `shadow-card` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` vb. | `--spacing-*` tüm spacing utility'leri |
| `--breakpoint-*` | `sm:*`, `md:*` vb. (variant) | `--breakpoint-3xl: 120rem` → `3xl:*` |
| `--ease-*` | `ease-*` | `--ease-snappy` → `ease-snappy` |
| `--animate-*` | `animate-*` | `--animate-spin` → `animate-spin` |
| `--container-*` | `@sm:*` vb. + `max-w-*` | `--container-lg` → `max-w-lg` |

---

## 🏗️ Hedef Mimari

```
src/
├── style.css                  ← Ana giriş: @import + @theme + @custom-variant + :root tokens
├── styles/
│   ├── components/
│   │   ├── buttons.css        ← .th-btn ve varyantları
│   │   ├── cards.css          ← .th-card ve varyantları
│   │   ├── inputs.css         ← .th-input, .th-badge
│   │   ├── navigation.css     ← header, subheader, mega-menu, footer
│   │   ├── gallery.css        ← product gallery, lightbox
│   │   ├── product-card.css   ← hFR19, fy26 kartları
│   │   └── modals.css         ← drawer, bottom-sheet, modal base
│   ├── pages/
│   │   ├── product-detail.css ← PD-specific layout
│   │   ├── dashboard.css      ← Buyer dashboard
│   │   ├── orders.css         ← Orders page
│   │   ├── payment.css        ← Payment page
│   │   ├── messages.css       ← Messages page
│   │   └── auth.css           ← Login, register
│   └── seller/
│       └── seller-storefront.css
└── panel/
    └── theme-editor.ts        ← CSS variable'ları runtime'da değiştirir
```

### Ana Giriş Dosyası (style.css) — v4 Yapısı

```css
/* ══════════════════════════════════════════════════
   TR TradeHub — Ana Style Giriş Dosyası
   Tailwind CSS v4.2
   ══════════════════════════════════════════════════ */

/* 1. Tailwind import */
@import "tailwindcss";

/* 2. Dark mode stratejisi — class-based */
@custom-variant dark (&:where(.dark, .dark *));

/* 3. Design Token'lar — Utility class üreten token'lar */
@theme {
  /* ── Renkler (--color-* → bg-*, text-*, border-* utility'leri) ── */
  --color-primary-50:  oklch(0.98 0.01 85);
  --color-primary-100: oklch(0.95 0.04 85);
  --color-primary-200: oklch(0.90 0.08 85);
  --color-primary-300: oklch(0.83 0.12 85);
  --color-primary-400: oklch(0.76 0.15 85);
  --color-primary-500: oklch(0.70 0.16 85);   /* Ana marka rengi — #cc9900 karşılığı */
  --color-primary-600: oklch(0.60 0.14 85);
  --color-primary-700: oklch(0.50 0.12 85);
  --color-primary-800: oklch(0.40 0.10 85);
  --color-primary-900: oklch(0.30 0.08 85);

  --color-surface:         #ffffff;
  --color-surface-raised:  #f5f5f5;
  --color-surface-muted:   #fafafa;
  --color-surface-dark:    #111827;

  --color-text-heading:     #111827;
  --color-text-body:        #333333;
  --color-text-muted:       #666666;
  --color-text-placeholder: #999999;
  --color-text-inverse:     #ffffff;

  --color-border-default:  #e5e5e5;
  --color-border-medium:   #d1d5db;
  --color-border-light:    #f0f0f0;

  --color-cta-primary:       #cc9900;
  --color-cta-primary-hover: #b38600;

  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-error:   #dc2626;
  --color-info:    #2563eb;

  /* ── Tipografi (--font-* → font-* utility'leri) ── */
  --font-sans: "Roboto", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;

  /* ── Border Radius (--radius-* → rounded-* utility'leri) ── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ── Gölgeler (--shadow-* → shadow-* utility'leri) ── */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08);
  --shadow-dropdown: 0 4px 12px rgb(0 0 0 / 0.12);
  --shadow-modal: 0 20px 60px rgb(0 0 0 / 0.2);

  /* ── Animasyonlar (--animate-* → animate-* utility'leri) ── */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/* 4. Component Token'lar — Utility class ÜRETMEZ, sadece var() ile kullanılır */
/*    Panel editörden runtime'da değiştirilebilir */
:root {
  /* ── Buton Token'ları ── */
  --btn-bg: var(--color-cta-primary);
  --btn-text: #ffffff;
  --btn-radius: var(--radius-md);
  --btn-border-width: 0px;
  --btn-border-color: var(--color-cta-primary);
  --btn-font-size: 0.875rem;
  --btn-font-weight: 600;
  --btn-padding-x: 24px;
  --btn-padding-y: 12px;

  /* ── Ürün Kartı Token'ları ── */
  --product-card-radius: var(--radius-md);
  --product-card-bg: var(--color-surface);
  --product-card-border-width: 0px;
  --product-card-border-color: #e5e7eb;
  --product-card-shadow: var(--shadow-card);
  --product-card-padding: 12px;
  --product-image-radius: var(--radius-md);
  --product-title-size: 14px;
  --product-title-weight: 400;
  --product-price-size: 20px;
  --product-price-color: #0a0a0a;
  --product-price-weight: 700;

  /* ── Input / Form Token'ları ── */
  --input-radius: var(--radius-md);
  --input-border-width: 1px;
  --input-border-color: var(--color-border-default);
  --input-focus-border-color: var(--color-cta-primary);

  /* ── Layout Token'ları ── */
  --header-bg: var(--color-surface);
  --footer-bg: var(--color-surface);
}

/* 5. Dark Mode Override'ları — @layer theme içinde @variant kullanarak */
@layer theme {
  :root, :host {
    @variant dark {
      --color-surface:         #0f172a;
      --color-surface-raised:  #1e293b;
      --color-surface-muted:   #1a2332;

      --color-text-heading:     #f1f5f9;
      --color-text-body:        #cbd5e1;
      --color-text-muted:       #94a3b8;
      --color-text-placeholder: #64748b;

      --color-border-default:  #334155;
      --color-border-medium:   #475569;
      --color-border-light:    #1e293b;

      /* Component token'lar da dark'ta değişir */
      --product-card-bg: #1e293b;
      --product-card-border-color: #334155;
      --product-price-color: #f1f5f9;
      --header-bg: #0f172a;
      --footer-bg: #0f172a;
    }
  }
}

/* 6. Component dosyalarını import et */
/* @import "./styles/components/buttons.css";   */
/* @import "./styles/components/cards.css";     */
/* @import "./styles/components/inputs.css";    */
/* @import "./styles/components/navigation.css";*/
/* @import "./styles/components/product-card.css"; */
/* @import "./styles/pages/dashboard.css";      */
/* ... diğer dosyalar ...                       */
```

---

## 🎯 Dinamik Component Sistemi — Kural Seti

### Kural 1: İki Katmanlı Token Mimarisi

Tailwind v4'te token'lar iki farklı yerde tanımlanır:

```
┌─────────────────────────────────────────────────────┐
│  @theme { }                                          │
│  ─────────                                           │
│  • Tailwind namespace'lerine uyar (--color-*, vb.)   │
│  • Utility class üretir (bg-primary-500, rounded-md) │
│  • Top-level olmalı, selector içine gömülemez        │
│  • Dark mode override YAPILAMAZ (@theme içinde)      │
└─────────────────────────────────────────────────────┘
         ↓ referans verir
┌─────────────────────────────────────────────────────┐
│  :root { }                                           │
│  ────────                                            │
│  • Component-özel token'lar (--btn-bg, --card-radius)│
│  • Utility class ÜRETMEZ                             │
│  • Panel'den runtime'da değiştirilebilir              │
│  • Dark mode override'ları @layer theme + @variant   │
│    ile yapılır                                        │
└─────────────────────────────────────────────────────┘
```

**Panel etkisi:** `document.documentElement.style.setProperty('--btn-radius', '24px')` yapınca tüm butonlar pill shape olur, ama Tailwind utility class'ları etkilenmez — bu istenen davranış.

### Kural 2: Tailwind İlk, Custom CSS Son Çare

Aşağıdaki durumlar **Tailwind ile** yapılmalı:

| Durum | Tailwind v4 | Custom CSS Gerekli Mi? |
|-------|-------------|----------------------|
| Flex layout | `flex items-center gap-2` | ❌ Hayır |
| Padding/margin | `p-4 mb-6` | ❌ Hayır |
| Font size/weight | `text-sm font-semibold` | ❌ Hayır |
| Border radius | `rounded-md` (token'dan) | ❌ Hayır |
| Background color | `bg-primary-500` (token'dan) | ❌ Hayır |
| Hover state | `hover:bg-primary-600` | ❌ Hayır |
| Responsive | `md:grid-cols-4` | ❌ Hayır |
| Dark mode | `dark:bg-surface-dark` | ❌ Hayır |
| Arbitrary value | `p-[var(--btn-padding-y)]` | ❌ Hayır |
| Container query | `@md:grid-cols-4` | ❌ Hayır |
| Pseudo-element `::before` | — | ✅ Evet |
| Karmaşık animation | — | ✅ Evet |
| Scroll-snap carousel | — | ✅ Evet |
| Multi-step transition | — | ✅ Evet |
| State-driven layout (`.is-expanded`) | — | ✅ Evet |

**v4 Bonus:** Arbitrary values ile component token'larına doğrudan erişim:

```html
<!-- Component token'ını Tailwind arbitrary value ile kullan -->
<button class="bg-[var(--btn-bg)] text-[var(--btn-text)] rounded-[var(--btn-radius)]
               px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]
               text-[length:var(--btn-font-size)] font-[number:var(--btn-font-weight)]">
  Satın Al
</button>

<!-- VEYA: @theme token'ından utility class ile -->
<button class="bg-cta-primary text-text-inverse rounded-md px-6 py-3 text-sm font-semibold">
  Satın Al
</button>
```

**Mevcut kodda Tailwind'e taşınabilecek örnekler:**

```css
/* ❌ ÖNCE — Gereksiz custom CSS */
.rv-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

/* ✅ SONRA — Tailwind class, CSS dosyasından kaldır */
/* HTML: <div class="flex items-center gap-2 flex-wrap mb-4"> */
```

```css
/* ❌ ÖNCE */
.sp-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* ✅ SONRA */
/* HTML: <div class="grid grid-cols-3 gap-4 mb-6"> */
```

### Kural 3: Dark Mode — v4 Yöntemi

v4'te dark mode `tailwind.config.js`'den tamamen çıktı. Şimdi CSS-native:

```css
/* ── Yöntem 1: Class-based (panel toggle) ── */
@custom-variant dark (&:where(.dark, .dark *));

/* ── Yöntem 2: data-attribute (çoklu tema) ── */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

/* ── Yöntem 3: Sistem tercihi (default, ek config gerekmez) ── */
/* dark: variant otomatik prefers-color-scheme kullanır */
```

**TR TradeHub için önerilen:** Yöntem 1 (class-based), çünkü panel toggle ile kontrol gerekiyor.

**Dark mode'da token override'ları:**

```css
/* @layer theme içinde @variant kullan */
@layer theme {
  :root, :host {
    @variant dark {
      --color-surface: #0f172a;
      --color-text-heading: #f1f5f9;
      --color-border-default: #334155;
      /* ... tüm dark değerler ... */
    }
  }
}
```

**HTML'de kullanım aynı kalır:**

```html
<!-- Token hem light hem dark'ta doğru rengi verir -->
<h2 class="text-text-heading">Başlık</h2>
<div class="bg-surface border-border-default">İçerik</div>

<!-- VEYA direkt dark: variant ile -->
<h2 class="text-gray-900 dark:text-gray-100">Başlık</h2>
```

### Kural 4: Panel'den Kontrol Edilecek Token Listesi

Aşağıdaki token'lar `:root`'ta tanımlanır ve panelde UI ile kontrol edilir:

#### Butonlar
| Token | Açıklama | Tip | Default |
|-------|----------|-----|---------|
| `--btn-bg` | Ana buton arkaplan | color | `var(--color-cta-primary)` |
| `--btn-text` | Ana buton yazı | color | `#ffffff` |
| `--btn-radius` | Köşe yuvarlaklığı | range (0-9999px) | `var(--radius-md)` |
| `--btn-border-width` | Kenarlık kalınlığı | range (0-4px) | `0px` |
| `--btn-border-color` | Kenarlık rengi | color | `var(--color-cta-primary)` |
| `--btn-font-size` | Font boyutu | select | `0.875rem` |
| `--btn-font-weight` | Font ağırlığı | select | `600` |
| `--btn-padding-x` | Yatay padding | range | `24px` |
| `--btn-padding-y` | Dikey padding | range | `12px` |

#### Kartlar (Ürün)
| Token | Açıklama | Tip | Default |
|-------|----------|-----|---------|
| `--product-card-radius` | Kart radius | range | `var(--radius-md)` |
| `--product-card-bg` | Kart arkaplan | color | `var(--color-surface)` |
| `--product-card-border-width` | Border kalınlık | range | `0px` |
| `--product-card-border-color` | Border rengi | color | `#e5e7eb` |
| `--product-card-shadow` | Gölge | select | `var(--shadow-card)` |
| `--product-card-padding` | İç boşluk | range | `12px` |
| `--product-image-radius` | Görsel radius | range | `var(--radius-md)` |
| `--product-title-size` | Başlık boyutu | select | `14px` |
| `--product-title-weight` | Başlık ağırlığı | select | `400` |
| `--product-price-size` | Fiyat boyutu | select | `20px` |
| `--product-price-color` | Fiyat rengi | color | `#0a0a0a` |

#### Input / Form
| Token | Açıklama | Tip | Default |
|-------|----------|-----|---------|
| `--input-radius` | Input radius | range | `var(--radius-md)` |
| `--input-border-width` | Border kalınlık | range | `1px` |
| `--input-border-color` | Border rengi | color | `var(--color-border-default)` |
| `--input-focus-border-color` | Focus border | color | `var(--color-cta-primary)` |

#### Genel
| Token | Açıklama | Tip | Default |
|-------|----------|-----|---------|
| `--color-cta-primary` ⚡ | Ana CTA rengi (@theme'de) | color | `#cc9900` |
| `--radius-md` ⚡ | Global orta radius (@theme'de) | range | `8px` |
| `--font-sans` ⚡ | Ana font ailesi (@theme'de) | select | `Roboto` |
| `--header-bg` | Header arkaplan | color | `var(--color-surface)` |
| `--footer-bg` | Footer arkaplan | color | `var(--color-surface)` |

> ⚡ işaretli token'lar `@theme`'de tanımlıdır ve utility class da üretir. Panel'den değiştirildiğinde JS ile hem `@theme` CSS variable hem de bağlı component token'ları güncellenir.

### Kural 5: Panel JS Entegrasyonu (v4 Uyumlu)

```typescript
// theme-editor.ts

interface ThemeToken {
  key: string;
  label: string;
  type: 'color' | 'range' | 'select';
  default: string;
  min?: number;
  max?: number;
  unit?: string;
  options?: string[];
  group: 'button' | 'card' | 'input' | 'typography' | 'layout' | 'global';
  isThemeToken?: boolean; // true = @theme'de tanımlı, utility class üretir
}

const root = document.documentElement;

function setToken(key: string, value: string) {
  root.style.setProperty(key, value);
}

function resetToken(key: string) {
  root.style.removeProperty(key);
}

function exportTheme(): Record<string, string> {
  const overrides: Record<string, string> = {};
  for (const prop of root.style) {
    if (prop.startsWith('--')) {
      overrides[prop] = root.style.getPropertyValue(prop);
    }
  }
  return overrides;
}

function applyTheme(overrides: Record<string, string>) {
  Object.entries(overrides).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// Dark mode toggle — v4 class-based
function toggleDarkMode(isDark: boolean) {
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Sayfa yüklendiğinde tema uygula
function initTheme() {
  // Dark mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && prefersDark));

  // Kaydedilmiş token override'larını uygula
  const savedOverrides = localStorage.getItem('theme-overrides');
  if (savedOverrides) {
    applyTheme(JSON.parse(savedOverrides));
  }
}

// Backend'e kaydet
async function saveThemeToBackend(overrides: Record<string, string>) {
  await fetch('/api/theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overrides)
  });
}
```

---

## 🔧 Hızlı Component Çıkarma Stratejisi

### Adım 1: Hardcoded Değerleri Token'a Çevir (En Yüksek ROI)

`style.css` dosyasında arama yap ve aşağıdaki pattern'leri değiştir:

```
#111827  → var(--color-text-heading)
#222222  → var(--color-text-heading)
#333333  → var(--color-text-body)
#666666  → var(--color-text-muted)
#999999  → var(--color-text-placeholder)
#e5e5e5  → var(--color-border-default)
#d1d5db  → var(--color-border-medium)
#f0f0f0  → var(--color-border-light)
#f5f5f5  → var(--color-surface-raised)
#fafafa  → var(--color-surface-muted)
#cc9900  → var(--color-cta-primary)
#b38600  → var(--color-cta-primary-hover)
#ffffff  → var(--color-surface)
```

> Bu tek adım bile dinamikliği **3/10'dan 7/10'a** çıkarır.

### Adım 2: Layout CSS'ini Tailwind v4'e Taşı

Dosyada `display: flex; align-items: center;` gibi pattern'leri bul → HTML'de Tailwind class'ına çevir → CSS'ten sil.

**Öncelik sırası:**
1. Dashboard sayfası (`orders`, `user-info-card`, `operation-slider`) — en çok tekrar
2. Review bölümü (`rv-*`) — 200+ satır sadece flex/grid layout
3. Settings sayfası (`settings-*`, `acc-edit__*`) — form layout'ları
4. Payment sayfası (`pay-*`) — tablo ve filter layout'ları

### Adım 3: Dosya Bölme + v4 @import

v4'te CSS `@import` artık native, ekstra PostCSS pluginine gerek yok:

```css
/* style.css — ana giriş */
@import "tailwindcss";
@import "./styles/components/buttons.css";
@import "./styles/components/product-card.css";
@import "./styles/pages/dashboard.css";
/* ... */
```

Her dosyanın başında hangi component'leri kapsadığını belirt:

```css
/* src/styles/components/product-card.css */
/* Covers: .hFR19, .fy26-product-card-wrapper, .product-grid */
/* Token dependencies: --product-card-*, --product-image-*, --product-title-* */
/* Tailwind equivalents used: rounded-[var(--product-card-radius)] */
```

### Adım 4: Dead CSS + Dark Mode Temizliği

Mevcut sorunlar:
- `.dark` override bloğu: light mode ile aynı değerleri tekrarlıyor → **Silinecek**, yerine `@layer theme` + `@variant dark` kullanılacak
- `@media (prefers-color-scheme: dark)` bloğu auth bölümünde → **Silinecek**, `@custom-variant` ile tek yöntem
- Commented-out `.sidebar`, `.right-panel` sınıfları → **Silinecek**

---

## 📋 Tailwind'e Taşınabilecek En Büyük Kazanımlar

Aşağıdaki CSS blokları tamamen Tailwind'e taşınabilir ve **~1500 satır** azalma sağlar:

| CSS Sınıfı | Satır | Tailwind v4 Karşılığı |
|-----------|-------|----------------------|
| `.rv-filter-row` | 6 | `flex items-center gap-2 flex-wrap mb-4` |
| `.rv-rating-summary` | 6 | `flex gap-8 pb-6 mb-5 border-b border-border-default` |
| `.rv-card-header` | 5 | `flex items-start gap-3 mb-2.5` |
| `.sp-stats-row` | 5 | `grid grid-cols-3 gap-4 mb-6` |
| `.sp-factory-grid` | 5 | `grid grid-cols-4 gap-3 mb-6` |
| `.orders__header` | 5 | `flex items-center justify-between px-5 pt-4 pb-3` |
| `.orders__empty` | 6 | `flex flex-col items-center gap-3 py-8 px-5` |
| `.msg-list__row` | 6 | `flex items-baseline justify-between gap-2 mb-0.5` |
| `.settings-grid` | 4 | `flex gap-5 items-start` |
| `.pay-filter-row` | 6 | `flex items-center justify-between gap-3 py-3 flex-wrap` |
| 100+ benzer | ~1200 | Çeşitli Tailwind class'ları |

---

## 🎨 Örnek: Ürün Kartı Dinamik Hale Getirme (v4)

### Önce (Mevcut)

```css
.hFR19 {
  padding: 12px;                    /* hardcoded */
  background: #ffffff;              /* hardcoded */
  border: 0px solid #e5e7eb;       /* hardcoded */
  border-radius: 8px;              /* hardcoded */
}
.hFR19 .R3Kcz.eg6xk {
  color: #0a0a0a;                  /* hardcoded */
  font-size: 20px;                 /* hardcoded */
  font-weight: 700;               /* hardcoded */
}
```

### Sonra — Yaklaşım A: Custom CSS + var() (Mevcut yapıyı korur)

```css
.hFR19 {
  padding: var(--product-card-padding);
  background: var(--product-card-bg);
  border: var(--product-card-border-width) solid var(--product-card-border-color);
  border-radius: var(--product-card-radius);
  box-shadow: var(--product-card-shadow);
}
.hFR19 .R3Kcz.eg6xk {
  color: var(--product-price-color);
  font-size: var(--product-price-size);
  font-weight: var(--product-price-weight);
}
```

### Sonra — Yaklaşım B: Tailwind v4 Arbitrary Values (Daha temiz)

```html
<div class="p-[var(--product-card-padding)] bg-[var(--product-card-bg)]
            border-[length:var(--product-card-border-width)]
            border-[var(--product-card-border-color)]
            rounded-[var(--product-card-radius)]
            shadow-[var(--product-card-shadow)]">
  <span class="text-[length:var(--product-price-size)]
               text-[var(--product-price-color)]
               font-[number:var(--product-price-weight)]">
    ₺199.99
  </span>
</div>
```

### Sonra — Yaklaşım C: @utility ile Custom Utility (En Temiz, v4 Özelliği)

```css
/* components/product-card.css */
@utility product-card {
  padding: var(--product-card-padding);
  background: var(--product-card-bg);
  border: var(--product-card-border-width) solid var(--product-card-border-color);
  border-radius: var(--product-card-radius);
  box-shadow: var(--product-card-shadow);
}

@utility product-price {
  color: var(--product-price-color);
  font-size: var(--product-price-size);
  font-weight: var(--product-price-weight);
}
```

```html
<div class="product-card">
  <span class="product-price">₺199.99</span>
</div>
```

> **Önerilen:** Yaklaşım A (kademeli geçiş) + zamanla Yaklaşım C'ye evrilme. Yaklaşım B aşırı uzun class'lar üretir.

---

## ⚡ Hızlı Başlangıç Checklist

- [ ] `style.css`'teki tüm hardcoded renkleri `var()` referanslarına çevir
- [ ] `@import "tailwindcss"` + `@custom-variant dark` + `@theme` yapısını kur
- [ ] Component token'ları `:root`'a taşı (utility üretmeyen token'lar)
- [ ] Dark mode override'larını `@layer theme { @variant dark { } }` ile yaz
- [ ] Kullanılmayan/yorum satırı CSS bölümlerini temizle
- [ ] Layout-only CSS sınıflarını Tailwind'e taşı (en az 50 sınıf)
- [ ] `style.css`'i component + page bazında dosyalara böl (v4 `@import`)
- [ ] Panel theme editor prototype'ını oluştur
- [ ] Token değişikliklerini backend'e kaydetme mekanizması kur
- [ ] Renkleri `oklch()` formatına taşı (v4 default, P3 color gamut desteği)

---

## Özet

| Aksiyon | Efor | Etki |
|---------|------|------|
| Hardcoded → `var()` dönüşümü | Düşük (find-replace) | 🔥 En yüksek |
| Layout CSS → Tailwind v4 | Orta (HTML değişikliği) | 🔥 Yüksek |
| `@theme` + `:root` ayrımı (v4) | Düşük (refactor) | 🔥 Yüksek |
| Dark mode → `@custom-variant` + `@layer theme` | Orta | Yüksek |
| Dosya bölme (v4 @import) | Düşük (copy-paste) | Orta |
| `@utility` ile custom utility'ler | Orta | Orta |
| Panel editor | Yüksek | 🔥 En yüksek |

**Öneri:** İlk olarak hardcoded değerleri `var()` referanslarına çevir + `@theme` / `:root` ayrımını kur. Bu en düşük eforla en yüksek dinamiklik kazandırır ve panel entegrasyonu için zemin hazırlar.
