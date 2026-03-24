# TR TradeHub — AI Kodlama Kuralları
## Bu dosyayı AI asistanına (Claude, Cursor, Copilot vb.) her kod yazdırırken context olarak ver.

---

## 🚫 YASAKLAR (Bunları ASLA yapma)

### CSS Yasakları
```
❌ media query yazma              → ✅ md: lg: xl: 2xl: prefix kullan
❌ display: flex yazma             → ✅ class="flex" kullan
❌ display: grid yazma             → ✅ class="grid" kullan
❌ align-items: center yazma       → ✅ class="items-center" kullan
❌ justify-content: between yazma  → ✅ class="justify-between" kullan
❌ gap: 16px yazma                 → ✅ class="gap-4" kullan
❌ padding: 24px yazma             → ✅ class="p-6" kullan
❌ margin-bottom: 16px yazma       → ✅ class="mb-4" kullan
❌ font-size: 14px yazma           → ✅ class="text-sm" veya fluid token kullan
❌ font-weight: 600 yazma          → ✅ class="font-semibold" kullan
❌ border-radius: 8px yazma        → ✅ class="rounded-md" kullan
❌ color: #cc9900 yazma            → ✅ class="text-cta-primary" veya var(--color-cta-primary)
❌ background: #ffffff yazma       → ✅ class="bg-surface" veya var(--color-surface)
❌ border: 1px solid #e5e5e5 yazma → ✅ class="border border-border-default"
❌ cursor: pointer yazma           → ✅ class="cursor-pointer" kullan
❌ overflow: hidden yazma          → ✅ class="overflow-hidden" kullan
❌ position: relative yazma        → ✅ class="relative" kullan
❌ width: 100% yazma               → ✅ class="w-full" kullan
❌ height: auto yazma              → ✅ class="h-auto" kullan
❌ opacity: 0.5 yazma              → ✅ class="opacity-50" kullan
❌ transition: all 0.2s yazma      → ✅ class="transition-all duration-200" kullan
❌ text-align: center yazma        → ✅ class="text-center" kullan
❌ z-index: 50 yazma               → ✅ class="z-50" kullan
❌ font-size: 20px (sabit)         → ✅ font-size: var(--text-product-price) (fluid token)
❌ padding: 16px (sabit, dar ekranda taşar) → ✅ padding: var(--space-page-x) (fluid)
❌ width: 150px (kart görseli sabit) → ✅ w-[120px] sm:w-[150px] lg:w-[180px]
❌ metin taşıyor, bırak            → ✅ truncate veya line-clamp-2 ekle
❌ flex item'da min-w yok          → ✅ min-w-0 ekle (truncate çalışması için)
```

### Hardcoded Renk Yasakları
```
❌ #111827, #222222  → ✅ var(--color-text-heading)   veya class="text-text-heading"
❌ #333333           → ✅ var(--color-text-body)       veya class="text-text-body"
❌ #666666           → ✅ var(--color-text-muted)      veya class="text-text-muted"
❌ #999999           → ✅ var(--color-text-placeholder) veya class="text-text-placeholder"
❌ #e5e5e5           → ✅ var(--color-border-default)  veya class="border-border-default"
❌ #d1d5db           → ✅ var(--color-border-medium)
❌ #f0f0f0           → ✅ var(--color-border-light)
❌ #f5f5f5           → ✅ var(--color-surface-raised)  veya class="bg-surface-raised"
❌ #fafafa           → ✅ var(--color-surface-muted)   veya class="bg-surface-muted"
❌ #cc9900           → ✅ var(--color-cta-primary)     veya class="bg-cta-primary"
❌ #b38600           → ✅ var(--color-cta-primary-hover)
❌ #ffffff           → ✅ var(--color-surface)         veya class="bg-surface"
❌ #16a34a           → ✅ var(--color-success)         veya class="text-success"
❌ #dc2626           → ✅ var(--color-error)           veya class="text-error"
❌ #f59e0b           → ✅ var(--color-warning)
❌ #2563eb           → ✅ var(--color-info)
```

### Dark Mode Yasakları
```
❌ @media (prefers-color-scheme: dark) { }  → ✅ dark: prefix kullan
❌ .dark .element { color: white; }         → ✅ class="dark:text-white" kullan
❌ tailwind.config.js'de darkMode ayarı     → ✅ @custom-variant dark (&:where(.dark, .dark *));
```

### Yapı Yasakları
```
❌ tailwind.config.js kullanma  → ✅ @theme { } CSS bloğu kullan (v4)
❌ @tailwind base/components    → ✅ @import "tailwindcss" kullan (v4)
❌ theme() fonksiyonu           → ✅ var(--token-name) kullan (v4)
```

---

## ✅ ZORUNLU KURALLAR

### Kural 1: Responsive Design = Tailwind Breakpoint Prefix'leri

```html
<!-- ❌ YANLIŞ -->
<style>
  .card-grid { display: grid; grid-template-columns: 1fr; }
  @media (min-width: 768px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .card-grid { grid-template-columns: repeat(4, 1fr); } }
</style>
<div class="card-grid">...</div>

<!-- ✅ DOĞRU -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">...</div>
```

Breakpoint prefix'leri:
```
sm:   → 640px+   (küçük tablet)
md:   → 768px+   (tablet)
lg:   → 1024px+  (laptop)
xl:   → 1280px+  (masaüstü)
2xl:  → 1536px+  (geniş ekran)
```

### Kural 2: Her Görsel Değer Token'dan Gelmeli

Bir componentin rengi, radius'u, border'ı, gölgesi asla hardcoded yazılmaz.

```css
/* ❌ YANLIŞ */
.product-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

/* ✅ DOĞRU — component token'ları kullan */
.product-card {
  background: var(--product-card-bg);
  border-radius: var(--product-card-radius);
  border: var(--product-card-border-width) solid var(--product-card-border-color);
}
```

### Kural 3: Layout = Tailwind, Tema = Token

| Ne yapılıyor? | Nerede? | Nasıl? |
|---------------|---------|--------|
| Flex/Grid düzeni | HTML class | `flex items-center gap-4` |
| Padding/Margin | HTML class | `p-6 mb-4` |
| Responsive layout | HTML class | `md:grid-cols-2 lg:grid-cols-4` |
| Hover/Focus state | HTML class | `hover:bg-primary-600 focus:ring-2` |
| Renk | Token → class veya var() | `bg-cta-primary` veya `var(--color-cta-primary)` |
| Border radius | Token → class veya var() | `rounded-md` veya `var(--product-card-radius)` |
| Gölge | Token → class veya var() | `shadow-card` veya `var(--shadow-card)` |
| Font boyutu | Fluid token | `text-(length:--text-product-price)` |
| Sayfa kenar boşluğu | Fluid token | `px-(--space-page-x)` |
| Component class (`.card`) | `@layer components` | CSS'te `var()` + `--spacing()` kullan |
| Custom utility | `@utility` directive | CSS'te `@utility content-auto { }` |
| Pseudo-element (::before) | CSS dosyası | Custom CSS + `@layer components` |
| Karmaşık animasyon | CSS dosyası | Custom CSS gerekli |
| Scroll-snap | CSS dosyası | Custom CSS gerekli |

### Kural 4: Tailwind v4 Syntax Kullan

```css
/* Ana CSS dosyası yapısı — TAM ŞABLON */
@import "tailwindcss";

/* Dark mode stratejisi */
@custom-variant dark (&:where(.dark, .dark *));

/* Design token'lar — utility class üretir */
@theme {
  --color-primary-500: oklch(0.70 0.16 85);
  --radius-md: 8px;
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08);
}

/* Component token'lar — utility class ÜRETMEZ, sadece var() ile erişilir */
:root {
  --btn-bg: var(--color-cta-primary);
  --btn-radius: var(--radius-md);
  --product-card-padding: 12px;
  --text-product-price: clamp(0.9375rem, 0.875rem + 0.25vw, 1.25rem);
}

/* Dark mode override'ları */
@layer theme {
  :root, :host {
    @variant dark {
      --color-surface: #0f172a;
      --color-text-heading: #f1f5f9;
      --product-card-bg: #1e293b;
    }
  }
}

/* Base HTML stiller */
@layer base {
  h1 { font-size: var(--text-2xl); }
  h2 { font-size: var(--text-xl); }
}

/* Component class'ları — utility ile override edilebilir */
@layer components {
  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-card);
  }
}

/* Custom utility'ler */
@utility scrollbar-hidden {
  &::-webkit-scrollbar { display: none; }
}
```

### Kural 5: `@theme` vs `:root` Ayrımı

```
@theme { }  → Tailwind namespace'leri → utility class üretir
             --color-*   → bg-*, text-*, border-* 
             --radius-*  → rounded-*
             --shadow-*  → shadow-*
             --font-*    → font-*
             --spacing-* → p-*, m-*, gap-*, w-*, h-*

:root { }   → Component token'lar → utility class ÜRETMEZ
             --btn-bg, --btn-radius
             --product-card-padding
             --input-border-color
             --text-product-price (fluid font token'ları)
             --space-page-x (fluid spacing token'ları)
             Panel'den JS ile runtime'da değiştirilebilir
```

### Kural 6: `@theme inline` Kullanımı

Başka bir CSS variable'a referans veren theme token'larda `inline` zorunlu:

```css
/* ❌ YANLIŞ — runtime'da resolve olmaz */
@theme {
  --color-brand: var(--user-brand-color);
}

/* ✅ DOĞRU */
@theme inline {
  --color-brand: var(--user-brand-color);
}
```

---

### Kural 7: v4 CSS Variable Kısayol Syntax'ı

v4'te CSS variable referansı için `var()` yazmak yerine parantez kısayolu kullan:

```html
<!-- ❌ ESKİ — uzun syntax -->
<div class="bg-[var(--my-color)]">
<div class="fill-[var(--brand-color)]">
<div class="text-[length:var(--text-product-price)]">

<!-- ✅ YENİ v4 — kısayol syntax (otomatik var() ekler) -->
<div class="bg-(--my-color)">
<div class="fill-(--brand-color)">
<div class="text-(length:--text-product-price)">
```

**Tip hint'leri:** Aynı prefix farklı CSS property'lere map olabilir. `text-` hem `font-size` hem `color` olabilir:

```html
<!-- Belirsiz: text- font-size mı, color mı? -->
<div class="text-(--my-var)">            <!-- ❓ Belirsiz -->

<!-- Tip belirt: -->
<div class="text-(length:--my-var)">     <!-- ✅ font-size olarak -->
<div class="text-(color:--my-var)">      <!-- ✅ color olarak -->
```

**Sık kullanılan tip hint'leri:**
```
length:     → px, rem, em, vw (font-size, width, padding)
color:      → renk değeri
integer:    → tam sayı (z-index, order)
number:     → ondalık sayı (opacity, scale)
percentage: → yüzde değeri
```

### Kural 8: `@layer components` — Component Class'ları

Tekrarlayan component pattern'leri için `@layer components` kullan. Bu class'lar utility class'larla override edilebilir:

```css
/* ✅ DOĞRU — v4 resmi yöntem */
@layer components {
  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: --spacing(6);              /* ← v4 spacing fonksiyonu! */
    box-shadow: var(--shadow-card);
  }

  .btn-primary {
    background-color: var(--btn-bg);
    color: var(--btn-text);
    border-radius: var(--btn-radius);
    padding: var(--btn-padding-y) var(--btn-padding-x);
    font-size: var(--btn-font-size);
    font-weight: var(--btn-font-weight);
  }

  /* 3. parti widget override'ları da burada */
  .select2-dropdown {
    border-radius: var(--radius-md);
  }
}
```

**Avantaj:** `@layer components` içindeki class, HTML'de utility ile override edilebilir:

```html
<!-- .card rounded-lg ama burada rounded-none ile override -->
<div class="card rounded-none">...</div>
```

**`--spacing()` fonksiyonu:** Tailwind'in spacing scale'ine erişir:

```css
@layer components {
  .card {
    padding: --spacing(6);          /* = 1.5rem (24px) */
    margin-bottom: --spacing(4);    /* = 1rem (16px) */
    gap: --spacing(3);              /* = 0.75rem (12px) */
  }
}
```

### Kural 9: `@utility` — Custom Utility Tanımlama

Tailwind'de olmayan CSS property'leri için `@utility` kullan:

```css
/* Basit utility */
@utility content-auto {
  content-visibility: auto;
}

/* Karmaşık utility (nested) */
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Fonksiyonel utility (değer alır) — tab-2, tab-4, tab-github gibi */
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
```

**Kullanım:**

```html
<div class="content-auto">...</div>
<div class="scrollbar-hidden overflow-y-auto">...</div>
<pre class="tab-4">...</pre>
<div class="hover:content-auto">...</div>  <!-- variant'larla çalışır! -->
```

### Kural 10: `@variant` — Custom CSS İçinde Variant Kullanımı

Custom CSS yazarken Tailwind variant'larını `@variant` ile kullan:

```css
/* ❌ YANLIŞ — manual media query / selector */
.my-element { background: white; }
@media (prefers-color-scheme: dark) {
  .my-element { background: black; }
}

/* ✅ DOĞRU — @variant kullan */
.my-element {
  background: var(--color-surface);

  @variant dark {
    background: var(--color-surface-dark);
  }

  @variant hover {
    background: var(--color-surface-raised);
  }
}

/* İç içe variant'lar */
.my-element {
  @variant dark {
    @variant hover {
      background: var(--color-surface-raised);
    }
  }
}
```

### Kural 11: `@layer base` — Temel HTML Stilleri

HTML elementlerine default stil vermek için `@layer base` kullan:

```css
@layer base {
  h1 { font-size: var(--text-2xl); }
  h2 { font-size: var(--text-xl); }
  a  { color: var(--color-cta-primary); }
}
```

**Veya** base stilleri HTML'de class olarak ver (tercih edilen):

```html
<html lang="tr" class="bg-surface font-sans text-text-body">
```

### Kural 12: Arbitrary Properties & Variants

Tailwind'de utility olmayan CSS property'leri için köşeli parantez:

```html
<!-- Arbitrary property -->
<div class="[mask-type:luminance]">
<div class="hover:[mask-type:alpha]">

<!-- CSS variable ayarlama — responsive! -->
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">

<!-- Arbitrary variant — özel selector -->
<li class="lg:[&:nth-child(-n+3)]:hover:underline">

<!-- Grid'de boşluk — underscore = space -->
<div class="grid grid-cols-[1fr_500px_2fr]">
```

---

## 📱 Kural 13: 320px Mobil Uyumluluk — Fluid Typography & Spacing

### Minimum desteklenen genişlik: 320px (iPhone SE, küçük Android)

320px'te ASLA taşma olmamalı. Tüm font ve spacing değerleri `clamp()` ile fluid olmalı.

### Fluid Font Token'ları

```css
/* :root içinde tanımlanır — clamp(min, preferred, max) */
:root {
  /* Sayfa başlığı: "32 products for travel suitcase" */
  --text-page-title:       clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
  /*                        18px @320      ↔ fluid ↔     24px @1280 */

  /* Ürün kartı başlığı: "Paslanmaz Ucu Altin..." */
  --text-product-title:    clamp(0.8125rem, 0.75rem + 0.25vw, 0.9375rem);
  /*                        13px @320       ↔ fluid ↔       15px @1280 */

  /* Ürün fiyatı: "$1.80-2.50" */
  --text-product-price:    clamp(0.9375rem, 0.875rem + 0.25vw, 1.25rem);
  /*                        15px @320       ↔ fluid ↔        20px @1280 */

  /* Alt bilgi: "Yiwu Jinghao", "5 yıl", "Minimum si..." */
  --text-product-meta:     clamp(0.6875rem, 0.65rem + 0.15vw, 0.8125rem);
  /*                        11px @320       ↔ fluid ↔        13px @1280 */

  /* Badge: "Free shipping available", "180 gün e..." */
  --text-badge:            clamp(0.6875rem, 0.65rem + 0.15vw, 0.8125rem);
  /*                        11px @320       ↔ fluid ↔        13px @1280 */

  /* Breadcrumb: "Ana Sayfa > Ürünler > travel suitcase" */
  --text-breadcrumb:       clamp(0.6875rem, 0.625rem + 0.2vw, 0.8125rem);
  /*                        11px @320       ↔ fluid ↔        13px @1280 */

  /* Filter / Sort label */
  --text-filter:           clamp(0.8125rem, 0.75rem + 0.25vw, 0.9375rem);
  /*                        13px @320       ↔ fluid ↔        15px @1280 */

  /* Genel body text */
  --text-body:             clamp(0.8125rem, 0.78rem + 0.15vw, 1rem);
  /*                        13px @320       ↔ fluid ↔        16px @1280 */
}
```

### Fluid Spacing Token'ları

```css
:root {
  /* Sayfa kenar boşluğu (sol + sağ) */
  --space-page-x:          clamp(0.75rem, 0.5rem + 1vw, 1.5rem);
  /*                        12px @320     ↔ fluid ↔    24px @1280 */

  /* Kart iç padding */
  --space-card-padding:    clamp(0.5rem, 0.4rem + 0.4vw, 1rem);
  /*                        8px @320     ↔ fluid ↔     16px @1280 */

  /* Kartlar arası boşluk */
  --space-card-gap:        clamp(0.5rem, 0.4rem + 0.4vw, 1rem);
  /*                        8px @320     ↔ fluid ↔     16px @1280 */

  /* Section arası boşluk */
  --space-section-gap:     clamp(1rem, 0.8rem + 0.8vw, 2rem);
  /*                        16px @320    ↔ fluid ↔     32px @1280 */
}
```

### Font Size Referans Tablosu

| Element | 320px | 480px | 768px | 1280px | Token |
|---------|-------|-------|-------|--------|-------|
| Sayfa Başlığı | 18px | 20px | 22px | 24px | `--text-page-title` |
| Ürün Başlığı | 13px | 14px | 14px | 15px | `--text-product-title` |
| Ürün Fiyatı | 15px | 17px | 18px | 20px | `--text-product-price` |
| Meta Bilgi | 11px | 12px | 12px | 13px | `--text-product-meta` |
| Badge | 11px | 12px | 12px | 13px | `--text-badge` |
| Breadcrumb | 11px | 12px | 12px | 13px | `--text-breadcrumb` |
| Filter Label | 13px | 14px | 14px | 15px | `--text-filter` |
| Body Text | 13px | 14px | 15px | 16px | `--text-body` |

### Fluid Token Kullanımı — HTML'de

```html
<!-- Sayfa container — dar ekranda padding azalır -->
<div class="px-(--space-page-x)">

  <!-- Breadcrumb — küçük font, truncate -->
  <nav class="text-(length:--text-breadcrumb) text-text-muted truncate mb-2">
    Ana Sayfa › Ürünler › travel suitcase
  </nav>

  <!-- Sayfa Başlığı — fluid font -->
  <h1 class="text-(length:--text-page-title) font-bold text-text-heading mb-3">
    <span class="text-text-muted font-normal">32</span> products for
    <span class="text-cta-primary">"travel suitcase"</span>
  </h1>

  <!-- Badge — kompakt -->
  <div class="flex items-center gap-1.5 
              bg-success/10 text-success 
              text-(length:--text-badge) 
              rounded-md px-3 py-1.5 mb-3">
    <svg class="w-4 h-4 shrink-0">...</svg>
    <span>Free shipping available</span>
  </div>

  <!-- Filter + Sort — 320'de sığmalı -->
  <div class="flex items-center gap-2 mb-3">
    <button class="flex items-center gap-1.5 
                   text-(length:--text-filter)
                   border border-border-default rounded-md 
                   px-3 py-1.5 shrink-0">
      Filters
    </button>
    <button class="flex items-center gap-1.5 
                   text-(length:--text-filter)
                   border border-border-default rounded-md 
                   px-3 py-1.5 ml-auto">
      Sort by: <strong>Best Match</strong>
    </button>
  </div>

  <!-- Ürün Kartı — Yatay Layout -->
  <div class="flex gap-3 
              p-(--space-card-padding) 
              bg-(--product-card-bg) 
              rounded-(--product-card-radius)
              border border-(--product-card-border-color)">
    
    <!-- Görsel — sabit genişlik, responsive -->
    <div class="w-[120px] sm:w-[150px] shrink-0 
                aspect-square 
                rounded-(--product-image-radius) 
                overflow-hidden">
      <img class="w-full h-full object-cover" src="..." alt="...">
    </div>

    <!-- Bilgi — min-w-0 ile taşma engeli -->
    <div class="flex flex-col min-w-0 flex-1">
      <h3 class="text-(length:--text-product-title) 
                 font-medium text-text-heading 
                 line-clamp-2 mb-1">
        Paslanmaz Ucu Altin Kaplama Bileklik
      </h3>
      <div class="text-(length:--text-product-price) 
                  font-bold text-text-heading mb-1">
        $1.80-2.50
      </div>
      <div class="text-(length:--text-product-meta) 
                  text-text-muted truncate">
        Minimum sipariş: 100 adet
      </div>
      <div class="flex items-center gap-1 
                  text-(length:--text-product-meta) 
                  text-text-muted mt-auto pt-1">
        <span class="truncate">Yiwu Jinghao</span>
        <span class="shrink-0">·</span>
        <span class="shrink-0">⭐ 5 yıl</span>
        <span class="shrink-0">🇨🇳 CN</span>
      </div>
    </div>
  </div>
</div>
```

### 320px Taşma Önleme — Zorunlu Class'lar

```html
<!-- 1. Metin taşmasını engelle -->
<span class="truncate">        <!-- Tek satır, ... ile kes -->
<p class="line-clamp-2">       <!-- 2 satırla sınırla -->
<div class="break-words">      <!-- Uzun kelimeyi kır -->

<!-- 2. Flex item'ın küçülmesini engelle (ikon, fiyat, bayrak) -->
<svg class="shrink-0">
<span class="shrink-0">$1.80</span>

<!-- 3. Flex item'ın taşmasını engelle (text alanı) -->
<div class="flex-1 min-w-0">   <!-- min-w-0 olmadan truncate ÇALIŞMAZ -->

<!-- 4. Görsel sabit boyut + responsive -->
<div class="w-[120px] sm:w-[150px] shrink-0 aspect-square">

<!-- 5. Sayfa seviyesinde yatay taşmayı engelle -->
<body class="overflow-x-hidden">

<!-- 6. Responsive gizle/göster -->
<div class="hidden sm:flex">    <!-- 320'de gizli, 640+ görünür -->
<div class="sm:hidden">         <!-- 320'de görünür, 640+ gizli -->
```

---

## 📐 Sık Kullanılan Tailwind Dönüşüm Tablosu

### Spacing (4px = 1 birim)
```
4px  → 1     8px  → 2     12px → 3     16px → 4
20px → 5     24px → 6     28px → 7     32px → 8
36px → 9     40px → 10    48px → 12    64px → 16
```

### Font Size
```
12px → text-xs      14px → text-sm      16px → text-base
18px → text-lg      20px → text-xl      24px → text-2xl
30px → text-3xl     36px → text-4xl
```

### Font Weight
```
300 → font-light    400 → font-normal   500 → font-medium
600 → font-semibold 700 → font-bold     800 → font-extrabold
```

### Border Radius
```
0    → rounded-none  2px → rounded-sm    4px → rounded
6px  → rounded-md    8px → rounded-lg    12px → rounded-xl
16px → rounded-2xl   9999px → rounded-full
```

### Yaygın Layout Pattern'leri
```html
<!-- Yatay hizalama, arası boşluk -->
<div class="flex items-center gap-2">

<!-- Dikey hizalama, ortalı -->
<div class="flex flex-col items-center gap-4">

<!-- İki uçta hizalama -->
<div class="flex items-center justify-between">

<!-- Grid layout, responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

<!-- Sayfa container -->
<div class="mx-auto max-w-7xl px-(--space-page-x) lg:px-8">

<!-- Gizle / göster responsive -->
<div class="hidden md:block">   <!-- mobilde gizli, tablet+ görünür -->
<div class="block md:hidden">   <!-- mobilde görünür, tablet+ gizli -->

<!-- Tam ekran overlay -->
<div class="fixed inset-0 z-50 bg-black/50">

<!-- Ortalanmış modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center">

<!-- Sticky header -->
<header class="sticky top-0 z-40 bg-surface">

<!-- Scroll area -->
<div class="overflow-y-auto max-h-96">

<!-- Truncate text -->
<p class="truncate">  <!-- veya line-clamp-2, line-clamp-3 -->

<!-- Hover + transition -->
<button class="transition-colors duration-200 hover:bg-primary-600">

<!-- Focus ring -->
<input class="focus:outline-none focus:ring-2 focus:ring-primary-500">

<!-- Dark mode -->
<div class="bg-surface text-text-body dark:bg-surface-dark dark:text-text-inverse">
```

---

## 🧩 Component Yazarken Template

Yeni bir component oluştururken bu template'i kullan:

```html
<!-- 
  Component: [İsim]
  Tokens: --[component]-bg, --[component]-radius, --[component]-border-*
  Fluid: --text-[element], --space-[element]
  Responsive: mobile-first (320px base), md: ve lg: breakpoint'leri
  320px: truncate, line-clamp, shrink-0, min-w-0 kontrol edildi
-->
<div class="
  {/* Layout — Tailwind class */}
  flex items-center gap-3 p-(--space-card-padding)
  
  {/* Responsive — Tailwind prefix */}
  md:gap-4 md:p-4
  
  {/* Tema — v4 shorthand syntax */}
  bg-(--component-bg) 
  rounded-(--component-radius)
  border border-(--component-border-color)
  
  {/* State — Tailwind variant */}
  hover:shadow-lg
  transition-shadow duration-200
  
  {/* Dark mode — Tailwind dark: prefix */}
  dark:bg-surface-dark dark:border-border-medium
">
  <!-- Görsel: sabit genişlik -->
  <div class="w-[120px] sm:w-[150px] shrink-0 aspect-square overflow-hidden rounded-md">
    <img class="w-full h-full object-cover" />
  </div>
  
  <!-- İçerik: esnek genişlik, taşma korumalı -->
  <div class="flex-1 min-w-0">
    <h3 class="text-(length:--text-product-title) font-medium line-clamp-2">...</h3>
    <p class="text-(length:--text-product-meta) text-text-muted truncate">...</p>
  </div>
</div>
```

**Veya** component'i CSS'te `@layer components` ile tanımla:

```css
@layer components {
  .product-card {
    display: flex;
    gap: --spacing(3);
    padding: var(--space-card-padding);
    background: var(--product-card-bg);
    border-radius: var(--product-card-radius);
    border: var(--product-card-border-width) solid var(--product-card-border-color);

    @variant dark {
      background: var(--product-card-bg);  /* dark token otomatik devreye girer */
    }
  }
}
```

```html
<!-- Temiz HTML, override mümkün -->
<div class="product-card md:gap-4 md:p-4">...</div>
```

---

## ⚠️ Custom CSS Yazma Rehberi

### Tercih sırası (en iyiden en kötüye):

```
1. Tailwind utility class    → class="flex items-center gap-4"
2. @utility directive        → @utility scrollbar-hidden { ... }
3. @layer components         → @layer components { .card { ... } }
4. @layer base               → @layer base { h1 { ... } }
5. Plain CSS (son çare)      → .my-element { ... }
```

### Custom CSS SADECE bu durumlar için yazılır:

1. **Pseudo-element** → `@layer components` içinde, `::before`, `::after` içerik
2. **Karmaşık animasyon** → multi-step keyframes
3. **Scroll-snap** → carousel davranışı  
4. **State machine** → `.is-open`, `.is-expanded` gibi JS toggle class'ları
5. **3. parti override** → Frappe/ERPNext widget'ları → `@layer components` içinde

Bu durumlarda bile renk ve radius token'dan gelmelidir, dark mode için `@variant` kullanılmalıdır:

```css
/* Custom CSS'te bile token + @variant kullan */
@layer components {
  .mega-menu::before {
    content: "";
    position: absolute;
    background: var(--color-surface);           /* ✅ Token */
    border-radius: var(--radius-md);            /* ✅ Token */
    box-shadow: var(--shadow-dropdown);         /* ✅ Token */

    @variant dark {
      background: var(--color-surface-dark);    /* ✅ @variant dark */
    }
  }
}
```

---

## 📝 Özet: AI'a Söylenecek Tek Cümle

> "Tailwind CSS v4 kullan. Layout ve responsive için HTML class'ları yaz, asla CSS'te media query veya display/flex/grid yazma. CSS variable referansında v4 kısayol syntax'ı kullan: bg-(--token) şeklinde, bg-[var(--token)] değil. Renkler ve radius için projede tanımlı token'ları kullan, asla hardcoded hex değer yazma. Font boyutları için fluid token'ları text-(length:--text-*) ile kullan, sabit px yazma. Component class'larını @layer components içinde tanımla, spacing için --spacing() fonksiyonunu kullan. Custom utility'ler için @utility directive kullan. Dark mode'u custom CSS'te @variant dark ile uygula. 320px minimum genişliğe göre tasarla — truncate, line-clamp-2, min-w-0, shrink-0 class'larını kullan, metin taşmasına izin verme."
