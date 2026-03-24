# Satıcı Mağaza Ana Sayfa — Frontend Geliştirme Spesifikasyonu

## 1. Genel Bilgiler

| Alan | Değer |
|------|-------|
| **Sayfa Adı** | Satıcı Mağaza Ana Sayfa |
| **Route** | `/seller/:slug` |
| **Type** | SELLER |
| **Modül** | Mağaza vitrini, banner, tanıtım |
| **Referans Mağazalar** | Calin Meter (standart), Haers (PRO/genişletilmiş) |

### 1.1 Teknoloji Stack

| Teknoloji | Versiyon / Detay |
|-----------|-----------------|
| Build Tool | Vite 7.x |
| Language | TypeScript (strict mode) |
| CSS Framework | TailwindCSS v4 (`@theme` token sistemi) |
| UI Kit | Flowbite (flowbite/plugin) |
| Slider | Swiper.js (ES Module import) |
| Font | Roboto (Google Fonts, Variable 100–900) |
| Module System | ES Modules |

### 1.2 Bağımlılıklar (package.json)

```json
{
  "dependencies": {
    "flowbite": "^2.x",
    "swiper": "^11.x"
  },
  "devDependencies": {
    "vite": "^7.x",
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x"
  }
}
```

### 1.3 Header / Footer Notu

> ⛔ **ANA SİTE HEADER ve FOOTER'a kesinlikle dokunulmayacaktır.**
> HTML çıktısında sadece `<!-- SITE HEADER BURAYA GELİR -->` ve `<!-- SITE FOOTER BURAYA GELİR -->` placeholder'ları kullanılacaktır.
> Satıcı mağazanın **kendi store navigation bar'ı** (C2) bu sayfaya **dahildir** ve kodlanacaktır.

### 1.4 Dinamik Veri Yaklaşımı

- Tüm component'ler **data-driven** olacak — hardcoded text yok
- Her satıcı için farklı içerik JSON'dan gelecek
- Component'ler mock JSON verisi ile doldurulacak şekilde tasarlanacak
- TypeScript interface'leri ile tip güvenliği sağlanacak

### 1.5 Design System Token'ları (style.css @theme bloğu)

```css
@theme {
  /* Primary: Altın/Amber */
  --color-primary-50: #fff9e6;
  --color-primary-100: #fff0b3;
  --color-primary-200: #ffe680;
  --color-primary-300: #ffdb4d;
  --color-primary-400: #e6b800;
  --color-primary-500: #cc9900; /* Ana primary */
  --color-primary-600: #b38600;
  --color-primary-700: #997300;
  --color-primary-800: #806000;
  --color-primary-900: #664d00;
  --color-primary-950: #4d3a00;

  /* Surface */
  --color-surface: #ffffff;
  --color-surface-muted: #f9fafb;
  --color-surface-raised: #ffffff;

  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Border */
  --color-border-default: #e5e5e5;
  --color-border-strong: #d1d5db;
  --color-border-focus: #cc9900;

  /* Typography */
  --font-family-base: 'Roboto', sans-serif;
  --font-size-base: 1.125rem; /* 18px */
  --line-height-base: 1.625;

  /* Spacing (8px grid) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --radius-button: 8px;
  --radius-card: 8px;
  --radius-input: 8px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
  --shadow-card: var(--shadow-sm);

  /* Container */
  --container-lg: 1472px;

  /* Button Tokens */
  --btn-bg: #cc9900;
  --btn-text: #ffffff;
  --btn-font-size: 0.875rem;
  --btn-font-weight: 600;

  /* Card Tokens */
  --card-bg: #ffffff;
  --card-border-color: #e5e5e5;

  /* Input Tokens */
  --input-bg: #ffffff;
  --input-border-color: #e5e5e5;
  --input-focus-border-color: #cc9900;

  /* Z-index Scale */
  --z-dropdown: 30;
  --z-sticky: 20;
  --z-fixed: 40;
  --z-modal: 50;

  /* Store-Specific Colors */
  --store-nav-bg: #e8540c;
  --store-nav-text: #ffffff;
  --store-nav-active-overlay: rgba(0,0,0,0.15);
  --store-accent: #f97316;
  --store-accent-hover: #ea580c;

  /* Breakpoints */
  --breakpoint-xs: 320px;
  --breakpoint-sm: 480px;
  --breakpoint-md: 640px;
  --breakpoint-lg: 768px;
  --breakpoint-xl: 1024px;
  --breakpoint-2xl: 1280px;
  --breakpoint-3xl: 1536px;
}
```

---

## 2. Dosya Yapısı

```
src/
├── pages/
│   └── seller/
│       └── SellerStorefront.ts          # Ana sayfa orchestrator
│
├── components/
│   └── seller/
│       ├── StoreHeader.ts               # C1: Store Profile Header
│       ├── StoreNav.ts                  # C2: Store Navigation Bar
│       ├── HeroBanner.ts               # C3: Hero Banner Carousel
│       ├── CategoryGrid.ts             # C4: Product Category Grid
│       ├── HotProducts.ts              # C5: Hot Products / Featured
│       ├── CategoryProductListing.ts   # C6: Category Product Listing
│       ├── CompanyInfo.ts              # C7: Company Info / About Us
│       ├── Certificates.ts            # C8: Certificates Carousel
│       ├── WhyChooseUs.ts             # C9: Why Choose Us / Advantages
│       ├── CompanyIntroduction.ts     # C10: Company Introduction Detail
│       ├── Gallery.ts                 # C11: Gallery / Factory Photos
│       ├── ContactForm.ts             # C12: Contact / Inquiry Form
│       └── FloatingActions.ts         # C13: Floating Action Buttons
│
├── data/
│   └── seller/
│       └── mockData.ts                 # Tüm mock JSON verisi (Türkçe)
│
├── types/
│   └── seller/
│       └── types.ts                    # TypeScript interface'leri
│
├── styles/
│   └── seller/
│       └── seller-storefront.css       # Component-specific custom CSS
│
├── utils/
│   └── seller/
│       └── interactions.ts             # Swiper init, dropdown, sticky vb.
│
└── style.css                           # Global @theme tokens (mevcut)
```

### 2.1 BEM İsimlendirme Konvansiyonu

Tüm custom CSS class'ları BEM (Block Element Modifier) kuralına uyar:

| Block | Örnekler |
|-------|----------|
| `store-header` | `store-header__logo`, `store-header__name`, `store-header__badge--pro` |
| `store-nav` | `store-nav__item`, `store-nav__item--active`, `store-nav__dropdown` |
| `store-hero` | `store-hero__swiper`, `store-hero__dot`, `store-hero__dot--active` |
| `category-grid` | `category-grid__card`, `category-grid__card--pastel` |
| `hot-products` | `hot-products__card`, `hot-products__title` |
| `category-listing` | `category-listing__banner`, `category-listing__card` |
| `company-info` | `company-info__variant-a`, `company-info__variant-b` |
| `certificates` | `certificates__swiper`, `certificates__card` |
| `why-choose` | `why-choose__icon-card`, `why-choose__feature-bar` |
| `company-intro` | `company-intro__grid`, `company-intro__cell` |
| `gallery` | `gallery__item`, `gallery__overlay` |
| `contact-form` | `contact-form__textarea`, `contact-form__send` |
| `floating-actions` | `floating-actions__btn`, `floating-actions__btn--contact` |

---

## 3. Tam Sayfa HTML İskeleti

```html
<!-- SITE HEADER BURAYA GELİR -->

<main class="seller-storefront" data-seller-slug="">

  <!-- C1: Store Profile Header -->
  <section id="store-header" class="store-header">
    <!-- İçerik: Bölüm 4'te detaylandırılmıştır -->
  </section>

  <!-- C2: Store Navigation Bar (Sticky) -->
  <nav id="store-nav" class="store-nav sticky top-0 z-20">
    <!-- İçerik: Bölüm 5'te detaylandırılmıştır -->
  </nav>

  <!-- C3: Hero Banner Carousel -->
  <section id="store-hero" class="store-hero">
    <!-- İçerik: Bölüm 6'da detaylandırılmıştır -->
  </section>

  <!-- C4: Product Category Grid (Opsiyonel — Haers tipi mağazalarda) -->
  <section id="category-grid" class="category-grid">
    <!-- İçerik: Bölüm 7'de detaylandırılmıştır -->
  </section>

  <!-- C5: Hot Products / Featured Products -->
  <section id="hot-products" class="hot-products">
    <!-- İçerik: Bölüm 8'de detaylandırılmıştır -->
  </section>

  <!-- C6: Category Product Listing (Opsiyonel — Haers tipi mağazalarda) -->
  <section id="category-listing" class="category-listing">
    <!-- İçerik: Bölüm 9'da detaylandırılmıştır -->
  </section>

  <!-- C7: Company Info / About Us -->
  <section id="company-info" class="company-info">
    <!-- İçerik: Bölüm 10'da detaylandırılmıştır -->
  </section>

  <!-- C8: Certificates Carousel -->
  <section id="certificates" class="certificates">
    <!-- İçerik: Bölüm 11'de detaylandırılmıştır -->
  </section>

  <!-- C9: Why Choose Us / Advantages -->
  <section id="why-choose" class="why-choose">
    <!-- İçerik: Bölüm 12'de detaylandırılmıştır -->
  </section>

  <!-- C10: Company Introduction Detail -->
  <section id="company-intro" class="company-intro">
    <!-- İçerik: Bölüm 13'te detaylandırılmıştır -->
  </section>

  <!-- C11: Gallery / Factory Photos -->
  <section id="gallery" class="gallery">
    <!-- İçerik: Bölüm 14'te detaylandırılmıştır -->
  </section>

  <!-- C12: Contact / Inquiry Form -->
  <section id="contact-form" class="contact-form">
    <!-- İçerik: Bölüm 15'te detaylandırılmıştır -->
  </section>

  <!-- C13: Floating Action Buttons (Fixed) -->
  <div id="floating-actions" class="floating-actions fixed right-0 top-[40%] z-40">
    <!-- İçerik: Bölüm 16'da detaylandırılmıştır -->
  </div>

</main>

<!-- SITE FOOTER BURAYA GELİR -->
```

### 3.1 Component Sıralama Notları

| Sıra | Component | Zorunluluk | Notlar |
|------|-----------|------------|--------|
| 1 | C1: Store Header | ✅ Zorunlu | Her mağazada var |
| 2 | C2: Store Nav | ✅ Zorunlu | Sticky, her mağazada var |
| 3 | C3: Hero Banner | ✅ Zorunlu | 1-5 slide, her mağazada var |
| 4 | C4: Category Grid | ⚪ Opsiyonel | Sadece Haers tipi mağazalarda |
| 5 | C5: Hot Products | ✅ Zorunlu | Calin tipi, basit kart |
| 6 | C6: Category Listing | ⚪ Opsiyonel | Haers tipi, detaylı kart |
| 7 | C7: Company Info | ✅ Zorunlu | Variant A veya B |
| 8 | C8: Certificates | ⚪ Opsiyonel | Varsa carousel gösterilir |
| 9 | C9: Why Choose Us | ⚪ Opsiyonel | Variant A (5 ikon) veya B (3 bar) |
| 10 | C10: Company Intro | ⚪ Opsiyonel | Detaylı şirket bilgi kartı |
| 11 | C11: Gallery | ⚪ Opsiyonel | Fabrika fotoğraf grid |
| 12 | C12: Contact Form | ✅ Zorunlu | Her mağazada var |
| 13 | C13: Floating Actions | ✅ Zorunlu | Fixed, her zaman görünür |

---

## 4. Component 1: Store Profile Header (C1)

> **Dosya:** `src/components/seller/StoreHeader.ts`
> **BEM Block:** `store-header`
> **Referans Görseller:** Görsel 1 (Calin — standart), Görsel 11 (Haers — PRO)

Store Profile Header, mağaza sayfasının en üstünde yer alan ve satıcı kimliğini, doğrulama durumunu, iletişim bilgilerini ve CTA butonlarını barındıran zorunlu bileşendir. İki ana varyantı vardır: **Verified (standart)** ve **Verified PRO (genişletilmiş)**.

### 4.1 HTML Yapısı

```html
<section id="store-header" class="store-header bg-white border-b border-[var(--color-border-default)]">
  <div class="store-header__container max-w-[var(--container-lg)] mx-auto px-8 py-5 flex justify-between items-start">

    <!-- Sol: Logo + Bilgiler -->
    <div class="store-header__info flex items-start gap-5">
      <!-- Logo -->
      <img
        class="store-header__logo w-[100px] max-h-[60px] object-contain"
        :src="seller.logo"
        :alt="seller.name"
      />

      <div class="store-header__details flex flex-col gap-1">
        <!-- Şirket Adı + Chevron -->
        <div class="store-header__name-row flex items-center gap-2">
          <h1 class="store-header__name text-[22px] font-bold text-[var(--color-text-primary)] leading-tight">
            {{ seller.name }}
          </h1>
          <svg class="store-header__chevron w-4 h-4 text-[var(--color-text-tertiary)] cursor-pointer transition-transform hover:text-[var(--color-text-secondary)]">
            <!-- chevron down ▾ -->
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Badge Satırı -->
        <div class="store-header__badges flex items-center gap-2 flex-wrap">
          <!-- ─── Standart Varyant: Verified Badge ─── -->
          <span class="store-header__badge store-header__badge--verified flex items-center gap-1 text-[13px] text-[#2563eb]" v-if="seller.verificationBadgeType === 'standard'">
            <svg class="w-4 h-4 text-[#2563eb]">
              <!-- blue checkmark circle icon -->
              <circle cx="8" cy="8" r="7" fill="#2563eb"/>
              <path d="M5.5 8.5l2 2 4-4" stroke="#fff" stroke-width="1.5" fill="none"/>
            </svg>
            {{ seller.verificationType }}
          </span>

          <!-- ─── PRO Varyant: Verified + PRO Badge ─── -->
          <template v-if="seller.verificationBadgeType === 'pro'">
            <span class="store-header__badge store-header__badge--verified flex items-center gap-1 text-[13px] text-[#2563eb]">
              <svg class="w-4 h-4 text-[#2563eb]">
                <!-- blue checkmark circle icon -->
                <circle cx="8" cy="8" r="7" fill="#2563eb"/>
                <path d="M5.5 8.5l2 2 4-4" stroke="#fff" stroke-width="1.5" fill="none"/>
              </svg>
              Verified
            </span>
            <span class="store-header__badge--pro inline-flex items-center gap-1 bg-[var(--store-accent)] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide">
              PRO
            </span>
          </template>

          <span class="store-header__separator text-[var(--color-border-strong)]">·</span>
          <span class="store-header__years text-[13px] text-[var(--color-text-tertiary)]">
            {{ seller.yearsOnPlatform }}yrs
          </span>
          <span class="store-header__separator text-[var(--color-border-strong)]">·</span>
          <span class="store-header__location text-[13px] text-[var(--color-text-tertiary)]">
            {{ seller.location }}
          </span>
        </div>

        <!-- Ana Kategoriler -->
        <p class="store-header__categories text-[13px] text-[var(--color-text-tertiary)]">
          Main categories: {{ seller.mainCategories.join(', ') }}
        </p>

        <!-- E-mail (Opsiyonel — yalnızca PRO varyant) -->
        <p class="store-header__email text-[13px] text-[var(--color-text-tertiary)] flex items-center gap-1"
           v-if="seller.email">
          <svg class="w-4 h-4 text-[var(--color-text-tertiary)]">
            <!-- mail / envelope icon -->
            <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M2 4l6 5 6-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          {{ seller.email }}
        </p>

        <!-- Alt Satır Badge'ler (Delivery Rate + Assessment) -->
        <div class="store-header__tags flex flex-wrap items-center gap-2 mt-1">
          <!-- Delivery Rate Badge (Opsiyonel) -->
          <a class="store-header__delivery-badge inline-flex items-center border border-[var(--color-border-strong)] rounded-sm px-2.5 py-1 text-[12px] text-[#374151] underline hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
             v-if="seller.deliveryBadge"
             :href="'#'">
            {{ seller.deliveryBadge }}
          </a>

          <!-- Assessment Badge (Opsiyonel) -->
          <span class="store-header__assessment-badge inline-flex items-center text-[12px] text-[var(--color-text-tertiary)] gap-1"
                v-if="seller.assessmentBadge">
            <span class="w-2 h-2 rounded-full bg-[#2563eb] inline-block"></span>
            {{ seller.assessmentBadge }}
          </span>
        </div>

        <!-- TÜV Doğrulama Notu -->
        <p class="store-header__tuv text-[11px] text-[var(--color-text-muted)] mt-1">
          Verified by TÜVRheinland — {{ seller.verificationDate }} ⓘ
        </p>
      </div>
    </div>

    <!-- Sağ: CTA Butonlar -->
    <div class="store-header__actions flex items-center gap-3">
      <button class="store-header__contact-btn bg-[var(--store-accent)] hover:bg-[var(--store-accent-hover)] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 shadow-[var(--shadow-sm)] transition-colors cursor-pointer">
        Contact supplier
      </button>
      <button class="store-header__chat-btn bg-transparent border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-text-muted)] text-[#374151] font-medium text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 transition-colors cursor-pointer">
        Chat now
      </button>
    </div>

  </div>
</section>
```

#### 4.1.1 TypeScript Data Interface

```typescript
interface SellerProfile {
  name: string;
  logo: string;
  verificationType: 'Verified' | 'Verified PRO';
  verificationBadgeType: 'standard' | 'pro';
  yearsOnPlatform: number;
  location: string;
  mainCategories: string[];
  email?: string;                // Yalnızca PRO varyantında doldurulur
  deliveryBadge?: string;        // Opsiyonel — standart varyant
  assessmentBadge?: string;      // Opsiyonel — standart varyant
  verificationDate: string;      // Örn: "2025.08.21"
}
```

#### 4.1.2 Mock Data (Calin — Standart)

```json
{
  "seller": {
    "name": "Shenzhen Calinmeter Co., Ltd.",
    "logo": "/assets/mock/calin-logo.png",
    "verificationType": "Verified",
    "verificationBadgeType": "standard",
    "yearsOnPlatform": 10,
    "location": "Guangdong, China",
    "mainCategories": ["Electricity Meter", "Water Meter", "Gas Meter"],
    "deliveryBadge": "#7 highest on-time delivery rate in Electricity Meters",
    "assessmentBadge": "Supplier assessment procedures",
    "verificationDate": "2025.08.21"
  }
}
```

#### 4.1.3 Mock Data (Haers — PRO)

```json
{
  "seller": {
    "name": "Zhejiang Haers Vacuum Containers Co., Ltd.",
    "logo": "/assets/mock/haers-logo.png",
    "verificationType": "Verified PRO",
    "verificationBadgeType": "pro",
    "yearsOnPlatform": 8,
    "location": "Zhejiang, China",
    "mainCategories": ["Water Bottles", "Cups", "Tumblers", "Mugs", "Food Jars"],
    "email": "export@haers.com",
    "deliveryBadge": null,
    "assessmentBadge": "Supplier assessment procedures",
    "verificationDate": "2025.06.15"
  }
}
```

### 4.2 Tailwind / CSS Sınıfları

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Section wrapper | `store-header` | `bg-white border-b border-[var(--color-border-default)]` | Beyaz arka plan, alt border |
| Container | `store-header__container` | `max-w-[var(--container-lg)] mx-auto px-8 py-5 flex justify-between items-start` | 1472px max genişlik, flex row |
| Sol bilgi alanı | `store-header__info` | `flex items-start gap-5` | Logo + detaylar yan yana |
| Logo | `store-header__logo` | `w-[100px] max-h-[60px] object-contain` | Sabit genişlik, orantılı yükseklik |
| Detaylar sarmalayıcı | `store-header__details` | `flex flex-col gap-1` | Dikey stack, 4px aralık |
| İsim satırı | `store-header__name-row` | `flex items-center gap-2` | İsim + chevron yan yana |
| Şirket adı | `store-header__name` | `text-[22px] font-bold text-[var(--color-text-primary)] leading-tight` | Bold, 22px, koyu metin |
| Chevron ikon | `store-header__chevron` | `w-4 h-4 text-[var(--color-text-tertiary)] cursor-pointer transition-transform hover:text-[var(--color-text-secondary)]` | 16×16px, hover efekti |
| Badge satırı | `store-header__badges` | `flex items-center gap-2 flex-wrap` | Yatay badge dizilimi |
| Verified badge | `store-header__badge--verified` | `flex items-center gap-1 text-[13px] text-[#2563eb]` | Mavi checkmark + text |
| PRO badge | `store-header__badge--pro` | `inline-flex items-center gap-1 bg-[var(--store-accent)] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide` | Turuncu dolgu, beyaz metin |
| Ayırıcı nokta | `store-header__separator` | `text-[var(--color-border-strong)]` | `·` separator karakteri |
| Yıl bilgisi | `store-header__years` | `text-[13px] text-[var(--color-text-tertiary)]` | Gri, 13px |
| Konum bilgisi | `store-header__location` | `text-[13px] text-[var(--color-text-tertiary)]` | Gri, 13px |
| Ana kategoriler | `store-header__categories` | `text-[13px] text-[var(--color-text-tertiary)]` | Virgülle ayrılmış liste |
| E-mail (PRO) | `store-header__email` | `text-[13px] text-[var(--color-text-tertiary)] flex items-center gap-1` | Mail ikonu + adres |
| Tag sarmalayıcı | `store-header__tags` | `flex flex-wrap items-center gap-2 mt-1` | Alt satır badge'ler |
| Delivery badge | `store-header__delivery-badge` | `inline-flex items-center border border-[var(--color-border-strong)] rounded-sm px-2.5 py-1 text-[12px] text-[#374151] underline hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer` | Outlined link badge |
| Assessment badge | `store-header__assessment-badge` | `inline-flex items-center text-[12px] text-[var(--color-text-tertiary)] gap-1` | Mavi dot + text |
| Assessment dot | — | `w-2 h-2 rounded-full bg-[#2563eb] inline-block` | 8×8px mavi yuvarlak |
| TÜV notu | `store-header__tuv` | `text-[11px] text-[var(--color-text-muted)] mt-1` | En küçük metin, soluk gri |
| CTA alan | `store-header__actions` | `flex items-center gap-3` | Butonlar yan yana |
| Contact butonu | `store-header__contact-btn` | `bg-[var(--store-accent)] hover:bg-[var(--store-accent-hover)] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 shadow-[var(--shadow-sm)] transition-colors cursor-pointer` | Solid turuncu CTA |
| Chat butonu | `store-header__chat-btn` | `bg-transparent border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-text-muted)] text-[#374151] font-medium text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 transition-colors cursor-pointer` | Outlined gri CTA |

### 4.3 Renk & Token Referansları

| Element | Hex Değer | CSS Token | Kullanım Yeri |
|---------|----------|-----------|--------------|
| Section arka plan | `#ffffff` | `var(--color-surface)` | `store-header` section bg |
| Alt border | `#e5e5e5` | `var(--color-border-default)` | Section alt çizgisi |
| Şirket adı rengi | `#111827` | `var(--color-text-primary)` | H1 başlık metni |
| Yıl / Konum / Kategori rengi | `#6b7280` | `var(--color-text-tertiary)` | Yardımcı metin satırları |
| TÜV notu rengi | `#9ca3af` | `var(--color-text-muted)` | En soluk metin |
| Verified mavi | `#2563eb` | — (hardcoded) | Badge ikonu ve metni |
| Assessment dot mavi | `#2563eb` | — (hardcoded) | 8px yuvarlak nokta |
| PRO badge arka plan | `#f97316` | `var(--store-accent)` | Turuncu PRO etiketi |
| Contact btn arka plan | `#f97316` | `var(--store-accent)` | Birincil CTA |
| Contact btn hover | `#ea580c` | `var(--store-accent-hover)` | Birincil CTA hover |
| Chat btn border | `#d1d5db` | `var(--color-border-strong)` | İkincil CTA kenarlığı |
| Chat btn text | `#374151` | — | İkincil CTA metin rengi |
| Chat btn hover bg | `#f9fafb` | `var(--color-surface-muted)` | İkincil CTA hover arka planı |
| Delivery badge text | `#374151` | — | Tag metin rengi |
| Delivery badge border | `#d1d5db` | `var(--color-border-strong)` | Tag kenarlık rengi |
| Delivery badge hover bg | `#f9fafb` | `var(--color-surface-muted)` | Tag hover arka planı |
| Container max-width | `1472px` | `var(--container-lg)` | İçerik genişliği |
| Buton radius | `8px` | `var(--radius-button)` | Tüm butonlar |
| Buton gölge | `0 1px 2px rgba(0,0,0,0.05)` | `var(--shadow-sm)` | Contact butonu |

### 4.4 Responsive Davranış

| Özellik | Mobile (<768px) | Tablet (768–1024px) | Desktop (>1024px) |
|---------|-----------------|--------------------|--------------------|
| **Layout yönü** | `flex-col` — dikey stack | `flex-row` — yatay, kompakt | `flex-row` — tam layout |
| **Container padding** | `px-4 py-4` | `px-6 py-5` | `px-8 py-5` |
| **Logo genişliği** | `w-[80px]` | `w-[80px]` | `w-[100px]` |
| **Logo max yükseklik** | `max-h-[48px]` | `max-h-[52px]` | `max-h-[60px]` |
| **Şirket adı font** | `text-[18px]` | `text-[20px]` | `text-[22px]` |
| **Badge satırı** | `flex-wrap` — alt satıra kayar | `flex-wrap` | Tek satır |
| **CTA buton alanı** | `flex-col w-full gap-2 mt-3` | `flex-row gap-3` | `flex-row gap-3` |
| **CTA buton genişlik** | `w-full` (her biri tam genişlik) | `auto` | `auto` |
| **Info + Actions ilişkisi** | Bilgiler üstte, butonlar altta | Bilgiler sol, butonlar sağ | Bilgiler sol, butonlar sağ |
| **Delivery badge** | Metin truncate, `max-w-[260px]` | Tam metin | Tam metin |
| **Email satırı (PRO)** | Gösterilir, tek satır | Gösterilir | Gösterilir |

#### 4.4.1 Responsive Tailwind Uygulaması

```html
<!-- Container: Mobile-first responsive padding ve layout -->
<div class="store-header__container max-w-[var(--container-lg)] mx-auto
            px-4 py-4
            lg:px-6 lg:py-5
            xl:px-8 xl:py-5
            flex flex-col
            lg:flex-row lg:justify-between lg:items-start">

  <!-- Sol: Logo + Bilgiler -->
  <div class="store-header__info flex items-start gap-3 lg:gap-5">
    <img class="store-header__logo w-[80px] max-h-[48px] lg:max-h-[52px] xl:w-[100px] xl:max-h-[60px] object-contain" ... />
    <div class="store-header__details flex flex-col gap-1">
      <h1 class="store-header__name text-[18px] lg:text-[20px] xl:text-[22px] font-bold ...">
        ...
      </h1>
      <!-- Badge'ler, kategoriler vb. aynı yapı -->
    </div>
  </div>

  <!-- Sağ: CTA Butonlar — Mobile'da full-width stack -->
  <div class="store-header__actions flex flex-col w-full gap-2 mt-3
              lg:flex-row lg:w-auto lg:gap-3 lg:mt-0">
    <button class="store-header__contact-btn w-full lg:w-auto ...">Contact supplier</button>
    <button class="store-header__chat-btn w-full lg:w-auto ...">Chat now</button>
  </div>
</div>
```

### 4.5 Varyantlar: Verified vs Verified PRO

| Özellik | Standart — Verified (Calin) | PRO — Verified PRO (Haers) |
|---------|---------------------------|---------------------------|
| **Doğrulama badge'i** | Mavi checkmark ikon + "Verified" metni (mavi, 13px) | Mavi checkmark ikon + "Verified" metni + turuncu `PRO` pill badge |
| **PRO pill** | Gösterilmez (`display: none`) | `bg-[#f97316] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm` |
| **E-mail satırı** | Gösterilmez (`v-if="seller.email"` → false) | Gösterilir: mail ikonu + e-posta adresi |
| **Delivery rate badge** | Gösterilir: outlined link tag (ör. "#7 highest on-time…") | Gösterilmez (data'da `null`) |
| **Ana kategoriler** | Electricity Meter, Water Meter, Gas Meter | Water Bottles, Cups, Tumblers, Mugs, Food Jars |
| **Konum** | Guangdong, China | Zhejiang, China |
| **Logo stili** | Sade metin tabanlı logo (CALIN) | Stilize logo + dekoratif dot elemanları (HAERS) |
| **CTA butonlar** | Aynı: Contact supplier (turuncu) + Chat now (outlined) | Aynı: Contact supplier (turuncu) + Chat now (outlined) |
| **TÜV notu** | Gösterilir | Gösterilir |
| **Assessment badge** | Gösterilir (mavi dot + text) | Gösterilir (mavi dot + text) |

#### 4.5.1 Varyant Görsel Karşılaştırma (ASCII)

**Standart Varyant (Calin) — Görsel 1:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  Shenzhen Calinmeter Co., Ltd. ▾              [Contact supplier] │
│  │  CALIN   │  ✓ Verified · 10yrs · Guangdong, China         [  Chat now  ]  │
│  │  (logo)  │  Main categories: Electricity Meter, Water M..                  │
│  └──────────┘  ┌─────────────────────────────────────┐ ● Supplier assessment │
│                │ #7 highest on-time delivery rate ... │                       │
│                └─────────────────────────────────────┘                        │
│                Verified by TÜVRheinland — 2025.08.21 ⓘ                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**PRO Varyant (Haers) — Görsel 11:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  Zhejiang Haers Vacuum Containers Co., Ltd. ▾ [Contact supplier] │
│  │ H A E R S│  ✓ Verified [PRO] · 8yrs · Zhejiang, China    [  Chat now  ]  │
│  │  (logo)  │  Main categories: Water Bottles, Cups, Tumbl..                 │
│  └──────────┘  ✉ export@haers.com                                            │
│                ● Supplier assessment procedures                               │
│                Verified by TÜVRheinland — 2025.06.15 ⓘ                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Şirket adı chevron** tıklama | `.store-header__chevron` | `click` | Şirket detay sayfasına yönlendirme (`/seller/:slug/company-profile`) veya tooltip ile kısa bilgi gösterimi | Chevron ikonu 180° döner (`rotate-180` toggle). İlk implementasyonda placeholder link yeterli. |
| 2 | **Contact supplier** butonu tıklama | `.store-header__contact-btn` | `click` | Sayfa içi smooth scroll → `#contact-form` section'a (`behavior: 'smooth'`) | `document.querySelector('#contact-form').scrollIntoView({ behavior: 'smooth' })` |
| 3 | **Chat now** butonu tıklama | `.store-header__chat-btn` | `click` | Canlı chat widget'ını açar (3. parti chat servisi placeholder) | İlk implementasyonda `console.log('Chat widget triggered')` veya `window.open()` placeholder |
| 4 | **Delivery badge** link tıklama | `.store-header__delivery-badge` | `click` | İlgili teslimat bilgi sayfasına yönlendirme (external link) | `target="_blank" rel="noopener noreferrer"` ile yeni sekmede açılır |
| 5 | **TÜV notu ⓘ** tıklama | `.store-header__tuv` içindeki `ⓘ` | `click` | Tooltip veya modal ile TÜV doğrulama detaylarını gösterir | Flowbite tooltip component kullanılabilir |
| 6 | **Logo** tıklama | `.store-header__logo` | `click` | Mağaza ana sayfasını yeniler veya `#store-header`'a scroll | Opsiyonel — basit `<a href="#">` sarmalayıcı |

#### 4.6.1 JavaScript Etkileşim Kodu

```typescript
// src/utils/seller/interactions.ts — StoreHeader interactions

/**
 * C1: Store Header etkileşimlerini başlatır
 */
export function initStoreHeaderInteractions(): void {

  // 1. Chevron tıklama — şirket detay yönlendirmesi
  const chevron = document.querySelector('.store-header__chevron');
  chevron?.addEventListener('click', () => {
    const slug = document.querySelector('.seller-storefront')?.getAttribute('data-seller-slug');
    if (slug) {
      window.location.href = `/seller/${slug}/company-profile`;
    }
  });

  // 2. Contact supplier — smooth scroll to contact form
  const contactBtn = document.querySelector('.store-header__contact-btn');
  contactBtn?.addEventListener('click', () => {
    const contactSection = document.getElementById('contact-form');
    contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 3. Chat now — chat widget placeholder
  const chatBtn = document.querySelector('.store-header__chat-btn');
  chatBtn?.addEventListener('click', () => {
    // Placeholder: 3. parti chat widget entegrasyonu
    // Gerçek implementasyonda chat SDK çağrılacak
    const chatEvent = new CustomEvent('store:chat-open', { detail: { source: 'header' } });
    document.dispatchEvent(chatEvent);
  });
}
```

#### 4.6.2 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Contact btn | `bg-[#f97316]` | `bg-[#ea580c]` | `ring-2 ring-[#f97316] ring-offset-2` | `bg-[#c2410c]` |
| Chat btn | `bg-transparent border-[#d1d5db]` | `bg-[#f9fafb] border-[#9ca3af]` | `ring-2 ring-[#d1d5db] ring-offset-2` | `bg-[#f3f4f6]` |
| Delivery badge | `bg-transparent` | `bg-[#f9fafb]` | `ring-1 ring-[#d1d5db]` | — |
| Chevron ikon | `text-[#6b7280]` | `text-[#4b5563]` | — | `rotate-180` toggle |
| Logo | — | `opacity-80` | — | — |

#### 4.6.3 Dark Mode Notları

C1 Store Header dark mode'da aşağıdaki değişikliklere uğrar:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Section border | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| Şirket adı | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| Yardımcı metin | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| TÜV notu | `#9ca3af` | `#6b7280` | `dark:text-gray-500` |
| Verified mavi | `#2563eb` | `#2563eb` | Sabit — değişmez |
| PRO badge turuncu | `#f97316` | `#f97316` | Sabit — değişmez |
| Contact btn | `bg-[#f97316]` | `bg-[#f97316]` | Sabit — değişmez |
| Chat btn border | `#d1d5db` | `#4b5563` | `dark:border-gray-600` |
| Chat btn text | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Delivery badge border | `#d1d5db` | `#4b5563` | `dark:border-gray-600` |
| Delivery badge text | `#374151` | `#d1d5db` | `dark:text-gray-300` |

---

## 5. Component 2: Store Navigation Bar — Sticky (C2)

> **Dosya:** `src/components/seller/StoreNav.ts`
> **BEM Block:** `store-nav`
> **Referans Görseller:** Görsel 1–3 (Calin — standart nav + dropdown'lar), Görsel 11–13 (Haers — PRO nav + sticky scroll)

Store Navigation Bar, mağaza header'ının hemen altında konumlanan ve sayfa boyunca sticky olarak üstte kalan turuncu navigasyon çubuğudur. Sol tarafında menü öğeleri (Home, Products, Company Profile, Contacts, Promotion/Custom), sağ tarafında mağaza içi arama kutusu barındırır. Products ve Company Profile sekmelerinde tıklanarak açılan dropdown menüler bulunur. Sayfa kaydırıldığında scroll shadow efekti ile derinlik kazanır.

### 5.1 HTML Yapısı

```html
<nav id="store-nav" class="store-nav sticky top-0 z-[var(--z-sticky)] bg-[var(--store-nav-bg)] transition-shadow duration-200">
  <div class="store-nav__container max-w-[var(--container-lg)] mx-auto px-8 flex items-center justify-between">

    <!-- Mobile Hamburger (xl altında görünür) -->
    <button class="store-nav__hamburger xl:hidden text-white p-2 bg-transparent border-none cursor-pointer"
            aria-label="Menüyü aç/kapa"
            aria-expanded="false"
            aria-controls="store-nav-mobile-menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Sol: Nav Menü Öğeleri (Desktop) -->
    <ul class="store-nav__menu hidden xl:flex items-center list-none m-0 p-0">
      <!-- Home (Active) -->
      <li>
        <a href="#"
           class="store-nav__item store-nav__item--active block px-6 py-3 text-[var(--store-nav-text)] text-[14px] font-semibold bg-[var(--store-nav-active-overlay)] transition-colors"
           aria-current="page">
          Home
        </a>
      </li>

      <!-- Products (Dropdown) -->
      <li class="relative">
        <button class="store-nav__item store-nav__item--dropdown flex items-center gap-1 px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal cursor-pointer bg-transparent border-none transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                aria-expanded="false"
                aria-haspopup="true">
          Products
          <svg class="w-3 h-3 text-white/70 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <!-- Products Dropdown Panel (varsayılan: gizli) -->
        <div class="store-nav__dropdown store-nav__dropdown--products hidden absolute top-full left-0 bg-white shadow-[var(--shadow-md)] rounded-b-[var(--radius-md)] min-w-[280px] max-h-[400px] overflow-y-auto z-[var(--z-dropdown)]"
             role="menu"
             aria-label="Ürün kategorileri">
          <!-- Başlık satırı -->
          <div class="store-nav__dropdown-header bg-[#f3f4f6] px-4 py-1.5 text-[13px] font-bold text-[#374151]">
            Products
          </div>
          <!-- Tüm kategorileri gör linki -->
          <a href="#" class="store-nav__dropdown-link block px-4 py-2 text-[13px] text-[var(--store-accent)] font-medium hover:bg-[#f3f4f6] transition-colors" role="menuitem">
            See all categories
          </a>
          <!-- Kategori listesi — dinamik olarak mock data'dan doldurulur -->
          <template v-for="category in navData.productCategories">
            <a href="#"
               class="store-nav__dropdown-item flex items-center justify-between px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors"
               role="menuitem">
              {{ category.name }}
              <svg class="w-3 h-3 text-[var(--color-text-muted)]"
                   v-if="category.hasSubcategories"
                   fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <!-- chevron right > -->
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </template>
        </div>
      </li>

      <!-- Company Profile (Dropdown) -->
      <li class="relative">
        <button class="store-nav__item store-nav__item--dropdown flex items-center gap-1 px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal cursor-pointer bg-transparent border-none transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                aria-expanded="false"
                aria-haspopup="true">
          Company profile
          <svg class="w-3 h-3 text-white/70 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <!-- Company Profile Dropdown Panel -->
        <div class="store-nav__dropdown store-nav__dropdown--company hidden absolute top-full left-0 bg-white shadow-[var(--shadow-md)] rounded-b-[var(--radius-md)] min-w-[200px] z-[var(--z-dropdown)]"
             role="menu"
             aria-label="Şirket profili menüsü">
          <a href="#" class="store-nav__dropdown-item block px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors" role="menuitem">
            Company Overview
          </a>
          <a href="#" class="store-nav__dropdown-item block px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors" role="menuitem">
            Ratings & Reviews
          </a>
        </div>
      </li>

      <!-- Contacts -->
      <li>
        <a href="#contact-form"
           class="store-nav__item block px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal transition-colors hover:bg-[rgba(255,255,255,0.1)]">
          Contacts
        </a>
      </li>

      <!-- Promotion / Custom Tab -->
      <li>
        <a href="#"
           class="store-nav__item block px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal transition-colors hover:bg-[rgba(255,255,255,0.1)]">
          {{ navData.customTab || 'Promotion' }}
        </a>
      </li>
    </ul>

    <!-- Sağ: Mağaza İçi Arama -->
    <div class="store-nav__search relative hidden xl:block">
      <input
        type="text"
        placeholder="Search in this store"
        class="store-nav__search-input bg-white rounded-[var(--radius-sm)] px-3 py-1.5 pr-9 text-[13px] text-[#374151] placeholder-[var(--color-text-muted)] w-[200px] border-none outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Mağaza içi arama"
      />
      <svg class="store-nav__search-icon absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors"
           fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <!-- search icon -->
        <circle cx="11" cy="11" r="8"/>
        <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
      </svg>
    </div>

  </div>

  <!-- Mobile Menü Paneli (varsayılan: gizli) -->
  <div id="store-nav-mobile-menu"
       class="store-nav__mobile-menu hidden xl:hidden bg-[var(--store-nav-bg)] border-t border-white/10">
    <!-- Arama — Mobile'da tam genişlik üstte -->
    <div class="store-nav__mobile-search px-4 py-3">
      <input
        type="text"
        placeholder="Search in this store"
        class="store-nav__search-input w-full bg-white rounded-[var(--radius-sm)] px-3 py-2 text-[14px] text-[#374151] placeholder-[var(--color-text-muted)] border-none outline-none"
        aria-label="Mağaza içi arama"
      />
    </div>
    <!-- Menü Öğeleri — Dikey Liste -->
    <ul class="store-nav__mobile-list list-none m-0 p-0">
      <li>
        <a href="#" class="store-nav__item store-nav__item--active block px-6 py-3 text-white text-[15px] font-semibold bg-[var(--store-nav-active-overlay)]" aria-current="page">
          Home
        </a>
      </li>
      <li>
        <button class="store-nav__item store-nav__item--dropdown w-full flex items-center justify-between px-6 py-3 text-white text-[15px] font-normal bg-transparent border-none cursor-pointer"
                aria-expanded="false" aria-haspopup="true">
          Products
          <svg class="w-4 h-4 text-white/70 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <!-- Mobile Products alt menüsü -->
        <div class="store-nav__dropdown store-nav__dropdown--products hidden bg-white/10">
          <a href="#" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">See all categories</a>
          <template v-for="category in navData.productCategories">
            <a href="#" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">
              {{ category.name }}
            </a>
          </template>
        </div>
      </li>
      <li>
        <button class="store-nav__item store-nav__item--dropdown w-full flex items-center justify-between px-6 py-3 text-white text-[15px] font-normal bg-transparent border-none cursor-pointer"
                aria-expanded="false" aria-haspopup="true">
          Company profile
          <svg class="w-4 h-4 text-white/70 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div class="store-nav__dropdown store-nav__dropdown--company hidden bg-white/10">
          <a href="#" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">Company Overview</a>
          <a href="#" class="block px-10 py-2 text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors">Ratings & Reviews</a>
        </div>
      </li>
      <li>
        <a href="#contact-form" class="store-nav__item block px-6 py-3 text-white text-[15px] font-normal hover:bg-white/5 transition-colors">
          Contacts
        </a>
      </li>
      <li>
        <a href="#" class="store-nav__item block px-6 py-3 text-white text-[15px] font-normal hover:bg-white/5 transition-colors">
          {{ navData.customTab || 'Promotion' }}
        </a>
      </li>
    </ul>
  </div>
</nav>
```

#### 5.1.1 TypeScript Data Interface

```typescript
interface NavCategory {
  name: string;
  slug: string;
  hasSubcategories: boolean;
}

interface StoreNavData {
  items: Array<{
    label: string;
    href: string;
    isActive: boolean;
    dropdownType?: 'products' | 'company';
  }>;
  productCategories: NavCategory[];
  companyProfileLinks: Array<{
    label: string;
    href: string;
  }>;
  customTab?: string;            // Opsiyonel — varsayılan 'Promotion'
  searchPlaceholder: string;
}
```

#### 5.1.2 Mock Data (Calin — Standart)

```json
{
  "navData": {
    "items": [
      { "label": "Home", "href": "#", "isActive": true },
      { "label": "Products", "href": "#", "isActive": false, "dropdownType": "products" },
      { "label": "Company profile", "href": "#", "isActive": false, "dropdownType": "company" },
      { "label": "Contacts", "href": "#contact-form", "isActive": false },
      { "label": "Promotion", "href": "#", "isActive": false }
    ],
    "productCategories": [
      { "name": "Prepaid Electricity Meter", "slug": "prepaid-electricity-meter", "hasSubcategories": false },
      { "name": "Smart Electricity Meter", "slug": "smart-electricity-meter", "hasSubcategories": true },
      { "name": "CT Electricity Meter", "slug": "ct-electricity-meter", "hasSubcategories": true },
      { "name": "Energy Meter", "slug": "energy-meter", "hasSubcategories": true },
      { "name": "Water Meter", "slug": "water-meter", "hasSubcategories": true },
      { "name": "Gas Meter", "slug": "gas-meter", "hasSubcategories": false }
    ],
    "companyProfileLinks": [
      { "label": "Company Overview", "href": "#company-info" },
      { "label": "Ratings & Reviews", "href": "#ratings" }
    ],
    "searchPlaceholder": "Search in this store"
  }
}
```

#### 5.1.3 Mock Data (Haers — PRO)

```json
{
  "navData": {
    "items": [
      { "label": "Home", "href": "#", "isActive": true },
      { "label": "Products", "href": "#", "isActive": false, "dropdownType": "products" },
      { "label": "Company profile", "href": "#", "isActive": false, "dropdownType": "company" },
      { "label": "Contacts", "href": "#contact-form", "isActive": false },
      { "label": "Customization", "href": "#", "isActive": false }
    ],
    "productCategories": [
      { "name": "Stainless Steel Tumbler & Mugs", "slug": "tumbler-mugs", "hasSubcategories": true },
      { "name": "Tritan Bottles", "slug": "tritan-bottles", "hasSubcategories": false },
      { "name": "Stainless Steel Water Bottles", "slug": "steel-water-bottles", "hasSubcategories": true },
      { "name": "Food Container", "slug": "food-container", "hasSubcategories": true },
      { "name": "Kids Series", "slug": "kids-series", "hasSubcategories": false },
      { "name": "Smart Water Bottle", "slug": "smart-water-bottle", "hasSubcategories": false },
      { "name": "Thermal Carafes", "slug": "thermal-carafes", "hasSubcategories": false }
    ],
    "companyProfileLinks": [
      { "label": "Company Overview", "href": "#company-info" },
      { "label": "Ratings & Reviews", "href": "#ratings" }
    ],
    "customTab": "Customization",
    "searchPlaceholder": "Search in this store"
  }
}
```

### 5.2 Tailwind / CSS Sınıfları

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Nav bar | `store-nav` | `sticky top-0 z-[var(--z-sticky)] bg-[var(--store-nav-bg)] transition-shadow duration-200` | Sticky konumlu, turuncu arka plan, scroll shadow geçişi |
| Container | `store-nav__container` | `max-w-[var(--container-lg)] mx-auto px-8 flex items-center justify-between` | 1472px max genişlik, flex row, sol-sağ dağılım |
| Menü listesi | `store-nav__menu` | `hidden xl:flex items-center list-none m-0 p-0` | Desktop'ta flex, mobil'de gizli |
| Aktif sekme | `store-nav__item--active` | `block px-6 py-3 text-[var(--store-nav-text)] text-[14px] font-semibold bg-[var(--store-nav-active-overlay)]` | Koyu overlay ile vurgulanan aktif tab |
| Normal sekme | `store-nav__item` | `block px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal transition-colors hover:bg-[rgba(255,255,255,0.1)]` | Beyaz metin, hover'da yarı saydam overlay |
| Dropdown tetik | `store-nav__item--dropdown` | `flex items-center gap-1 px-5 py-3 text-[var(--store-nav-text)] text-[14px] font-normal cursor-pointer bg-transparent border-none transition-colors hover:bg-[rgba(255,255,255,0.1)]` | Button elementi, chevron ikonu ile |
| Dropdown chevron | — | `w-3 h-3 text-white/70 transition-transform duration-200` | 12×12px, %70 opaklık, dönme animasyonu |
| Dropdown panel (Products) | `store-nav__dropdown--products` | `hidden absolute top-full left-0 bg-white shadow-[var(--shadow-md)] rounded-b-[var(--radius-md)] min-w-[280px] max-h-[400px] overflow-y-auto z-[var(--z-dropdown)]` | Beyaz panel, alt yuvarlak, scroll destekli |
| Dropdown panel (Company) | `store-nav__dropdown--company` | `hidden absolute top-full left-0 bg-white shadow-[var(--shadow-md)] rounded-b-[var(--radius-md)] min-w-[200px] z-[var(--z-dropdown)]` | Daha dar panel, scroll yok |
| Dropdown başlık | `store-nav__dropdown-header` | `bg-[#f3f4f6] px-4 py-1.5 text-[13px] font-bold text-[#374151]` | Gri arka planlı başlık satırı |
| Dropdown link (See all) | `store-nav__dropdown-link` | `block px-4 py-2 text-[13px] text-[var(--store-accent)] font-medium hover:bg-[#f3f4f6] transition-colors` | Turuncu renkli özel link |
| Dropdown öğe | `store-nav__dropdown-item` | `flex items-center justify-between px-4 py-2 text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors` | Kategori satırı, chevron right opsiyonel |
| Dropdown chevron right | — | `w-3 h-3 text-[var(--color-text-muted)]` | Alt kategori göstergesi (`>`) |
| Arama sarmalayıcı | `store-nav__search` | `relative hidden xl:block` | Desktop'ta görünür, mobilde gizli |
| Arama input | `store-nav__search-input` | `bg-white rounded-[var(--radius-sm)] px-3 py-1.5 pr-9 text-[13px] text-[#374151] placeholder-[var(--color-text-muted)] w-[200px] border-none outline-none focus:ring-2 focus:ring-white/30` | Beyaz, yuvarlak, focus ring efekti |
| Arama ikon | `store-nav__search-icon` | `absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors` | Sağ hizalı büyüteç ikonu |
| Hamburger buton | `store-nav__hamburger` | `xl:hidden text-white p-2 bg-transparent border-none cursor-pointer` | Yalnızca xl altında görünür |
| Mobil menü panel | `store-nav__mobile-menu` | `hidden xl:hidden bg-[var(--store-nav-bg)] border-t border-white/10` | Varsayılan gizli, hamburger ile açılır |
| Mobil arama | `store-nav__mobile-search` | `px-4 py-3` | Tam genişlik arama sarmalayıcı |
| Mobil menü listesi | `store-nav__mobile-list` | `list-none m-0 p-0` | Dikey menü öğeleri |

### 5.3 Dropdown Menü Yapısı

#### 5.3.1 Products Dropdown (Görsel 2, 12)

Ürün kategorilerini listeleyen, en fazla 400px yüksekliğe kadar scroll destekli dropdown paneldir.

```
┌──────────────────────────────┐
│ Products              (bold) │  ← bg #f3f4f6, px-4 py-1.5, font-bold
├──────────────────────────────┤
│ See all categories           │  ← text-[var(--store-accent)], font-medium
│ Prepaid Electricity Meter    │  ← text-[#374151], hover:bg-[#f3f4f6]
│ Smart Electricity Meter    > │  ← chevron right = alt kategorisi var
│ CT Electricity Meter       > │
│ Energy Meter               > │
│ Water Meter                > │
│ Gas Meter                    │  ← chevron yok = alt kategori yok
└──────────────────────────────┘
  min-width: 280px
  max-height: 400px
  overflow-y: auto
  shadow: var(--shadow-md)
  border-radius: 0 0 8px 8px (rounded-b)
```

**Önemli Detaylar:**
- Dropdown üst kenarı nav bar'a flush (düz) — yalnızca alt köşeler yuvarlatılır (`rounded-b-[var(--radius-md)]`)
- Başlık satırı ("Products") gri arka planlı (`#f3f4f6`), bold, ayrıştırıcı
- "See all categories" linki turuncu renkte (`var(--store-accent)`) ve `font-medium`
- Alt kategorisi olan öğeler sağda chevron right (`>`) ikonu gösterir
- Kategori sayısı 6–7'yi aştığında `overflow-y: auto` ile kaydırma çubuğu aktif olur
- Her öğe hover'da `bg-[#f3f4f6]` arka plan alır

#### 5.3.2 Company Profile Dropdown (Görsel 3, 13)

Şirket profiline ait iki sabit link içeren minimal dropdown paneldir.

```
┌──────────────────────────┐
│ Company Overview         │  ← text-[#374151], hover:bg-[#f3f4f6]
│ Ratings & Reviews        │  ← text-[#374151], hover:bg-[#f3f4f6]
└──────────────────────────┘
  min-width: 200px
  shadow: var(--shadow-md)
  border-radius: 0 0 8px 8px (rounded-b)
```

**Önemli Detaylar:**
- Başlık satırı yoktur — doğrudan link öğeleri gösterilir
- Sabit iki link: "Company Overview" ve "Ratings & Reviews"
- Products dropdown'dan daha dar: `min-w-[200px]` vs `min-w-[280px]`
- Aynı shadow ve border-radius stili uygulanır
- `max-height` kısıtlaması yoktur (yalnızca 2 öğe)

### 5.4 Sticky Davranış + Scroll Shadow

Store Navigation Bar sayfa boyunca sticky olarak üstte kalır. Kullanıcı sayfayı aşağı kaydırdığında, nav bar altına ince bir gölge eklenir ve derinlik hissi yaratılır.

#### 5.4.1 CSS Tanımları

```css
/* src/styles/seller/seller-storefront.css */

.store-nav {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky); /* 20 */
  transition: box-shadow 0.2s ease;
}

/* Sayfa kaydırıldığında eklenen shadow sınıfı */
.store-nav--scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

#### 5.4.2 TypeScript Scroll Handler

```typescript
// src/utils/seller/interactions.ts — Sticky Nav scroll handler

/**
 * C2: Store Nav sticky scroll shadow handler.
 * Sayfa 10px'den fazla kaydırıldığında nav bar'a gölge ekler.
 * Passive event listener kullanarak scroll performansını korur.
 */
export function initStickyNav(): void {
  const nav = document.getElementById('store-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.classList.add('store-nav--scrolled');
    } else {
      nav.classList.remove('store-nav--scrolled');
    }
  }, { passive: true });
}
```

**Davranış Detayı:**
- `window.scrollY > 10` eşiği kullanılır — küçük scroll'larda gölge eklenmez
- `{ passive: true }` ile scroll event listener performans dostu çalışır
- Geçiş `transition: box-shadow 0.2s ease` ile yumuşak animasyonludur
- Shadow değeri: `0 2px 8px rgba(0,0,0,0.15)` — orta düzey derinlik
- Sayfa en üste dönüldüğünde (`scrollY ≤ 10`) gölge kaldırılır

### 5.5 Responsive Davranış

| Özellik | Mobile (<768px) | Tablet (768–1024px) | Desktop (>1024px) |
|---------|-----------------|--------------------|--------------------|
| **Menü layout** | Hamburger (☰) → dikey açılır panel | Yatay menü, horizontal scroll aktif | Tüm öğeler + arama tam görünür |
| **Hamburger ikon** | Gösterilir (`xl:hidden`) | Gösterilir (`xl:hidden`) | Gizli |
| **Desktop menü** | Gizli (`hidden xl:flex`) | Gizli (`hidden xl:flex`) | Flex row görünür |
| **Arama kutusu** | Mobil panelde tam genişlik üstte | Mobil panelde tam genişlik üstte | Sağ tarafta `w-[200px]` |
| **Arama genişliği** | `w-full` (mobil panelde) | `w-full` (mobil panelde) | `w-[200px]` |
| **Container padding** | `px-4` | `px-6` | `px-8` |
| **Dropdown'lar** | Menü içinde inline açılır (accordion tarzı) | Menü içinde inline açılır | Absolute panel olarak açılır |
| **Sekme font boyutu** | `text-[15px]` (mobilde daha büyük touch target) | `text-[14px]` | `text-[14px]` |
| **Nav yüksekliği** | `auto` (içerik kadar) | `44px` (tek satır) | `44px` (tek satır) |
| **Sticky davranış** | Aktif — sticky top-0 | Aktif — sticky top-0 | Aktif — sticky top-0 |

#### 5.5.1 Responsive Tailwind Uygulaması

```html
<!-- Container: Mobile-first responsive padding -->
<div class="store-nav__container max-w-[var(--container-lg)] mx-auto
            px-4
            lg:px-6
            xl:px-8
            flex items-center justify-between">

  <!-- Hamburger: xl altında görünür -->
  <button class="store-nav__hamburger xl:hidden text-white p-2 ...">
    <svg class="w-6 h-6"><!-- ☰ hamburger icon --></svg>
  </button>

  <!-- Desktop Menü: xl ve üstünde görünür -->
  <ul class="store-nav__menu hidden xl:flex items-center ...">
    <!-- ... menü öğeleri ... -->
  </ul>

  <!-- Arama: xl ve üstünde görünür -->
  <div class="store-nav__search relative hidden xl:block">
    <!-- ... search input ... -->
  </div>
</div>

<!-- Mobil Panel: xl altında açılır -->
<div id="store-nav-mobile-menu" class="store-nav__mobile-menu hidden xl:hidden bg-[var(--store-nav-bg)] ...">
  <!-- Tam genişlik arama üstte -->
  <div class="store-nav__mobile-search px-4 py-3">
    <input class="... w-full ..." placeholder="Search in this store" />
  </div>
  <!-- Dikey menü listesi -->
  <ul class="store-nav__mobile-list ...">
    <!-- ... öğeler dikey listelenir ... -->
  </ul>
</div>
```

#### 5.5.2 Mobile Hamburger Butonu

```html
<button class="store-nav__hamburger xl:hidden text-white p-2 bg-transparent border-none cursor-pointer"
        aria-label="Menüyü aç/kapa"
        aria-expanded="false"
        aria-controls="store-nav-mobile-menu">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <!-- Hamburger icon (☰) — 3 yatay çizgi -->
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
</button>
```

**Hamburger Davranış:**
- Tıklayınca `#store-nav-mobile-menu` paneli açılır/kapanır (`hidden` toggle)
- `aria-expanded` true/false toggle edilir
- Açıkken ikon animasyonu: hamburger → X (opsiyonel — CSS transform ile)
- Panel açıldığında body scroll'u kilitlenmez (nav yeterince kısa)
- Menü dışına tıklanırsa panel kapanır

### 5.6 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Dropdown toggle** tıklama | `.store-nav__item--dropdown` | `click` | İlgili dropdown panelini aç/kapat. Açmadan önce diğer açık dropdown'ları kapat (`closeAllDropdowns()`) | Aynı anda yalnızca bir dropdown açık olabilir |
| 2 | **Click outside close** | `document` | `click` | Tüm açık dropdown panellerini kapat | Dropdown dışında herhangi bir yere tıklama |
| 3 | **Keyboard Escape** | `document` | `keydown (Escape)` | Tüm açık dropdown panellerini kapat + focus'u tetikleyici butona geri döndür | Erişilebilirlik gereksinimi |
| 4 | **Hover efekti** | `.store-nav__item` (aktif olmayan) | `mouseenter / mouseleave` | Yarı saydam beyaz overlay `bg-[rgba(255,255,255,0.1)]` | Tailwind `hover:` ile yönetilir, JS gerekmez |
| 5 | **Active tab highlight** | `.store-nav__item--active` | — | Koyu overlay `bg-[rgba(0,0,0,0.15)]` + `font-semibold` ile aktif sekme vurgusu | Sayfa değişikliğinde hangi tab aktif olacağı güncellenir |
| 6 | **Hamburger toggle** | `.store-nav__hamburger` | `click` | Mobile menü panelini aç/kapat, `aria-expanded` toggle | Yalnızca xl altında görünür |
| 7 | **Dropdown item hover** | `.store-nav__dropdown-item` | `mouseenter` | Açık gri arka plan `bg-[#f3f4f6]` | Tailwind `hover:` ile CSS-only |
| 8 | **Search input focus** | `.store-nav__search-input` | `focus` | Beyaz/yarı saydam ring efekti `focus:ring-2 focus:ring-white/30` | Görsel focus indicator |
| 9 | **Search submit** | `.store-nav__search-icon` veya Enter tuşu | `click` / `keydown (Enter)` | Mağaza içi arama tetiklenir (placeholder: query parametreli yönlendirme) | İlk implementasyonda console.log yeterli |
| 10 | **Sticky scroll shadow** | `window` | `scroll` | `scrollY > 10` → `store-nav--scrolled` class ekle, `≤ 10` → kaldır | Passive listener, bkz. §5.4 |

#### 5.6.1 JavaScript Etkileşim Kodu

```typescript
// src/utils/seller/interactions.ts — StoreNav interactions

/**
 * C2: Store Nav dropdown toggle, click-outside-close, keyboard Escape.
 * Tüm dropdown etkileşimlerini tek bir fonksiyondan yönetir.
 */
export function initStoreNavDropdowns(): void {
  const dropdownTriggers = document.querySelectorAll('.store-nav__item--dropdown');

  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling as HTMLElement;
    if (!dropdown) return;

    // Toggle on click
    trigger.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('hidden');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
        // Chevron ikonunu döndür (açık durumda)
        const chevron = trigger.querySelector('svg');
        chevron?.classList.add('rotate-180');
      }
    });
  });

  // Close on click outside — tüm dropdown'ları kapat
  document.addEventListener('click', () => closeAllDropdowns());

  // Close on Escape key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      // Focus'u son aktif trigger'a geri döndür (a11y)
      const activeTrigger = document.querySelector('.store-nav__item--dropdown[aria-expanded="true"]') as HTMLElement;
      activeTrigger?.focus();
    }
  });
}

/**
 * Tüm açık dropdown panellerini kapatır ve aria/chevron durumlarını sıfırlar.
 */
function closeAllDropdowns(): void {
  document.querySelectorAll('.store-nav__dropdown').forEach(dd => {
    dd.classList.add('hidden');
  });
  document.querySelectorAll('.store-nav__item--dropdown').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
    // Chevron ikonunu eski haline döndür
    const chevron = trigger.querySelector('svg');
    chevron?.classList.remove('rotate-180');
  });
}

/**
 * C2: Mobile hamburger menü toggle.
 */
export function initMobileNav(): void {
  const hamburger = document.querySelector('.store-nav__hamburger') as HTMLButtonElement;
  const mobileMenu = document.getElementById('store-nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  // Mobil menü dışına tıklayınca kapat
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!hamburger.contains(target) && !mobileMenu.contains(target)) {
      mobileMenu.classList.add('hidden');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * C2: Search input — Enter tuşu ile arama tetikleme.
 */
export function initStoreSearch(): void {
  const searchInputs = document.querySelectorAll('.store-nav__search-input') as NodeListOf<HTMLInputElement>;

  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query.length > 0) {
          // Placeholder: mağaza içi arama yönlendirmesi
          const slug = document.querySelector('.seller-storefront')?.getAttribute('data-seller-slug');
          const searchEvent = new CustomEvent('store:search', {
            detail: { query, slug }
          });
          document.dispatchEvent(searchEvent);
        }
      }
    });
  });

  // Search icon tıklama
  const searchIcons = document.querySelectorAll('.store-nav__search-icon');
  searchIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const input = icon.closest('.store-nav__search')?.querySelector('.store-nav__search-input') as HTMLInputElement;
      if (input) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      }
    });
  });
}
```

#### 5.6.2 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Normal tab | `bg-transparent text-white` | `bg-[rgba(255,255,255,0.1)]` | `ring-2 ring-white/30 ring-inset` | `bg-[rgba(255,255,255,0.15)]` |
| Active tab | `bg-[rgba(0,0,0,0.15)] font-semibold` | Değişmez — zaten vurgulu | `ring-2 ring-white/30 ring-inset` | Değişmez |
| Dropdown trigger | `bg-transparent text-white` | `bg-[rgba(255,255,255,0.1)]` | `ring-2 ring-white/30 ring-inset` | Dropdown açılır |
| Dropdown item | `bg-white text-[#374151]` | `bg-[#f3f4f6]` | `bg-[#f3f4f6] outline-2 outline-[var(--store-accent)]` | `bg-[#e5e7eb]` |
| Dropdown link (See all) | `text-[var(--store-accent)]` | `bg-[#f3f4f6]` | `outline-2 outline-[var(--store-accent)]` | `text-[var(--store-accent-hover)]` |
| Search input | `bg-white text-[#374151]` | Değişmez | `ring-2 ring-white/30` | Değişmez |
| Search icon | `text-[#9ca3af]` | `text-[#4b5563]` | — | — |
| Hamburger button | `text-white` | `bg-white/10` | `ring-2 ring-white/30` | `bg-white/15` |

#### 5.6.3 Renk & Token Referansları

| Element | Hex Değer | CSS Token | Kullanım Yeri |
|---------|----------|-----------|--------------|
| Nav bar arka plan | `#e8540c` | `var(--store-nav-bg)` | Ana turuncu arka plan |
| Nav metin rengi | `#ffffff` | `var(--store-nav-text)` | Tüm menü öğeleri + arama placeholder |
| Aktif tab overlay | `rgba(0,0,0,0.15)` | `var(--store-nav-active-overlay)` | Home (aktif) sekme arka planı |
| Hover overlay | `rgba(255,255,255,0.1)` | — (inline) | Menü öğeleri hover durumu |
| Dropdown arka plan | `#ffffff` | `var(--color-surface)` | Dropdown panel bg |
| Dropdown başlık bg | `#f3f4f6` | — (Tailwind gray-100) | Products dropdown başlık satırı |
| Dropdown metin | `#374151` | — (Tailwind gray-700) | Dropdown öğe metinleri |
| Dropdown hover bg | `#f3f4f6` | — (Tailwind gray-100) | Öğe hover arka planı |
| See all categories renk | `#f97316` | `var(--store-accent)` | Turuncu link rengi |
| Chevron right renk | `#9ca3af` | `var(--color-text-muted)` | Alt kategori göstergesi |
| Arama input bg | `#ffffff` | — | Beyaz input arka planı |
| Arama placeholder | `#9ca3af` | `var(--color-text-muted)` | Gri placeholder metni |
| Scroll shadow | `rgba(0,0,0,0.15)` | — | `store-nav--scrolled` gölgesi |
| Dropdown shadow | — | `var(--shadow-md)` | Dropdown panel gölgesi |
| Dropdown z-index | `30` | `var(--z-dropdown)` | Dropdown paneller |
| Nav z-index | `20` | `var(--z-sticky)` | Sticky nav bar |
| Nav radius (dropdown alt) | `8px` | `var(--radius-md)` | Dropdown alt köşeler |
| Arama radius | `4px` | `var(--radius-sm)` | Input border-radius |
| Container max-width | `1472px` | `var(--container-lg)` | İçerik genişliği |

#### 5.6.4 Dark Mode Notları

C2 Store Navigation Bar dark mode'da aşağıdaki değişikliklere uğrar:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Nav bar bg | `#e8540c` | `#c2410c` (koyu turuncu) | `dark:bg-[#c2410c]` |
| Nav metin | `#ffffff` | `#ffffff` | Sabit — değişmez |
| Aktif tab overlay | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.25)` | `dark:bg-[rgba(0,0,0,0.25)]` |
| Dropdown panel bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Dropdown başlık bg | `#f3f4f6` | `#374151` | `dark:bg-gray-700` |
| Dropdown metin | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Dropdown hover bg | `#f3f4f6` | `#374151` | `dark:hover:bg-gray-700` |
| Dropdown shadow | `var(--shadow-md)` | `0 4px 6px rgba(0,0,0,0.3)` | Daha yoğun gölge |
| Arama input bg | `#ffffff` | `#374151` | `dark:bg-gray-700` |
| Arama metin | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Arama placeholder | `#9ca3af` | `#6b7280` | `dark:placeholder-gray-500` |
| Scroll shadow | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.35)` | Dark mode'da daha yoğun |
| Mobil panel border | `rgba(255,255,255,0.1)` | `rgba(255,255,255,0.05)` | Daha ince ayırıcı |

---

## 6. Component 3: Hero Banner Carousel (C3)

> **Dosya:** `src/components/seller/HeroBanner.ts`
> **BEM Block:** `store-hero`
> **Referans Görseller:** Görsel 1 (Calin — OEM/ODM slide, koyu metin açık arka plan), Görsel 4 (Calin — dot pagination görünümü), Görsel 11 (Haers — YOUR BRAND slide, pastel mavi arka plan), Görsel 13 (Haers — CRAFTED FOR LIFE slide, doğa arka plan)

Hero Banner Carousel, mağaza navigasyon çubuğunun (C2) hemen altında konumlanan tam genişlikli bir görsel karuseldir. Swiper.js kütüphanesi ile çalışır; otomatik geçiş (autoplay), sonsuz döngü (loop) ve tıklanabilir dot pagination sunar. Her slide, arka plan görseli üzerine opsiyonel metin overlay'i (başlık, alt metin, CTA butonu) barındırır. Text overlay konumu (`left`, `center`, `right`) ve rengi (`white`, `dark`) slide verisine göre dinamik olarak belirlenir. Farklı satıcılar için farklı içerik ve görseller JSON verisinden yüklenir.

### 6.1 HTML Yapısı (Swiper markup)

```html
<section id="store-hero" class="store-hero">
  <div class="store-hero__swiper swiper w-full">
    <div class="swiper-wrapper">

      <!-- Slide 1 -->
      <div class="swiper-slide store-hero__slide relative">
        <img
          :src="slide.image"
          :alt="slide.title || 'Banner'"
          class="w-full h-[450px] xl:h-[500px] lg:h-[400px] md:h-[300px] sm:h-[200px] object-cover"
        />
        <!-- Text Overlay (opsiyonel — yalnızca slide.title varsa render edilir) -->
        <div class="store-hero__overlay absolute inset-0 flex flex-col justify-center px-16 xl:px-12 lg:px-10 md:px-6 sm:px-4"
             :class="{
               'items-start': slide.textPosition === 'left',
               'items-center text-center': slide.textPosition === 'center',
               'items-end text-right': slide.textPosition === 'right'
             }"
             v-if="slide.title">
          <h2 class="store-hero__title text-[48px] xl:text-[42px] lg:text-[32px] md:text-[24px] sm:text-[20px] font-black leading-tight drop-shadow-lg"
              :class="{
                'text-white': slide.textColor === 'white',
                'text-[var(--color-text-primary)]': slide.textColor === 'dark'
              }">
            {{ slide.title }}
          </h2>
          <p class="store-hero__subtitle text-[18px] md:text-[14px] sm:text-[13px] mt-3 drop-shadow-md max-w-[600px]"
             :class="{
               'text-white/80': slide.textColor === 'white',
               'text-[var(--color-text-secondary)]': slide.textColor === 'dark'
             }"
             v-if="slide.subtitle">
            {{ slide.subtitle }}
          </p>
          <!-- CTA Butonu (opsiyonel — yalnızca slide.ctaText varsa render edilir) -->
          <a :href="slide.ctaLink || '#'"
             class="store-hero__cta inline-block mt-6 px-8 py-3 bg-[var(--store-accent)] text-white font-semibold text-[var(--btn-font-size)] rounded-[var(--radius-button)] hover:bg-[var(--store-accent-hover)] transition-colors shadow-[var(--shadow-md)]"
             v-if="slide.ctaText">
            {{ slide.ctaText }}
          </a>
        </div>
      </div>

      <!-- Slide 2, 3, ... (dinamik — mock data'dan v-for ile doldurulur) -->

    </div>

    <!-- Dot Pagination -->
    <div class="store-hero__pagination swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
  </div>
</section>
```

#### 6.1.1 HTML Yapı Notları

- `<section id="store-hero">` — Sayfa içi anchor linkleri için ID
- `swiper` ve `swiper-wrapper` sınıfları Swiper.js'in zorunlu markup gereksinimleridir
- Her `swiper-slide` içinde `<img>` + opsiyonel overlay `<div>` bulunur
- Overlay `<div>` yalnızca `slide.title` değeri varsa render edilir (`v-if` kontrolü)
- Text pozisyonu (`left` / `center` / `right`) dinamik olarak `items-start`, `items-center`, `items-end` sınıflarıyla yönetilir
- Text rengi (`white` / `dark`) dinamik olarak Tailwind text sınıflarıyla kontrol edilir
- CTA butonu opsiyoneldir — yalnızca `slide.ctaText` varsa gösterilir
- Dot pagination container'ı Swiper tarafından otomatik olarak bullet elementlerle doldurulur

### 6.2 Tailwind / CSS Sınıfları

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Section wrapper | `store-hero` | — | Tam genişlik section container |
| Swiper container | `store-hero__swiper` | `swiper w-full` | Swiper.js kök elementi, tam genişlik |
| Slide | `store-hero__slide` | `swiper-slide relative` | Relative position — overlay'ler için referans |
| Slide görseli | — | `w-full h-[450px] xl:h-[500px] lg:h-[400px] md:h-[300px] sm:h-[200px] object-cover` | Responsive yükseklik, görsel kırpma ile tam kaplama |
| Overlay container | `store-hero__overlay` | `absolute inset-0 flex flex-col justify-center px-16 xl:px-12 lg:px-10 md:px-6 sm:px-4` | Tam kaplama pozisyon, dikey ortala, responsive padding |
| Overlay — sol hizalı | — | `items-start` | `textPosition === 'left'` durumunda |
| Overlay — ortalanmış | — | `items-center text-center` | `textPosition === 'center'` durumunda |
| Overlay — sağ hizalı | — | `items-end text-right` | `textPosition === 'right'` durumunda |
| Başlık (beyaz) | `store-hero__title` | `text-[48px] xl:text-[42px] lg:text-[32px] md:text-[24px] sm:text-[20px] font-black leading-tight drop-shadow-lg text-white` | Responsive font, extra-bold, gölgeli, beyaz metin |
| Başlık (koyu) | `store-hero__title` | `text-[48px] xl:text-[42px] lg:text-[32px] md:text-[24px] sm:text-[20px] font-black leading-tight drop-shadow-lg text-[var(--color-text-primary)]` | Aynı boyut, koyu metin (açık arka plan için) |
| Alt metin (beyaz) | `store-hero__subtitle` | `text-[18px] md:text-[14px] sm:text-[13px] text-white/80 mt-3 drop-shadow-md max-w-[600px]` | Beyaz, %80 opaklık, max genişlik |
| Alt metin (koyu) | `store-hero__subtitle` | `text-[18px] md:text-[14px] sm:text-[13px] text-[var(--color-text-secondary)] mt-3 drop-shadow-md max-w-[600px]` | Koyu gri metin (#4b5563) |
| CTA butonu | `store-hero__cta` | `inline-block mt-6 px-8 py-3 bg-[var(--store-accent)] text-white font-semibold text-[var(--btn-font-size)] rounded-[var(--radius-button)] hover:bg-[var(--store-accent-hover)] transition-colors shadow-[var(--shadow-md)]` | Turuncu arka plan, beyaz metin, hover geçişi |
| Dot pagination | `store-hero__pagination` | `swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10` | Altta ortalanmış, z-index ile görsel üzerine çıkar |

### 6.3 Swiper.js Konfigürasyonu (tam TypeScript kodu)

```typescript
// src/components/seller/HeroBanner.ts

import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * C3: Hero Banner Carousel — Swiper.js başlatma.
 *
 * Özellikler:
 * - Sonsuz döngü (loop: true) — son slide'dan sonra ilk slide'a geçiş
 * - Otomatik geçiş (autoplay) — 5 saniye aralıkla
 * - Fare üzerine geldiğinde duraklatma (pauseOnMouseEnter)
 * - Kullanıcı etkileşiminden sonra autoplay devam eder (disableOnInteraction: false)
 * - Tıklanabilir dot pagination — özel BEM sınıflarıyla stillendirilir
 * - 600ms slide geçiş süresi (smooth transition)
 */
export function initHeroSwiper(): Swiper {
  return new Swiper('.store-hero__swiper', {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    pagination: {
      el: '.store-hero__pagination',
      clickable: true,
      bulletClass: 'store-hero__dot',
      bulletActiveClass: 'store-hero__dot--active',
    },
  });
}
```

#### 6.3.1 Swiper Konfigürasyon Detayları

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| `modules` | `[Autoplay, Pagination]` | Tree-shakeable modül importları — yalnızca kullanılan modüller dahil edilir |
| `loop` | `true` | Son slide'dan sonra ilk slide'a döngüsel geçiş |
| `autoplay.delay` | `5000` | Slide'lar arası otomatik geçiş süresi: 5 saniye (5000ms) |
| `autoplay.disableOnInteraction` | `false` | Kullanıcı slide'ı sürüklese bile autoplay devam eder |
| `autoplay.pauseOnMouseEnter` | `true` | Fare carousel üzerine geldiğinde autoplay duraklar |
| `effect` | `'slide'` | Standart yatay kayma efekti (fade, cube vb. kullanılmaz) |
| `speed` | `600` | Slide geçiş animasyon süresi: 600ms |
| `pagination.el` | `'.store-hero__pagination'` | Dot pagination container seçicisi |
| `pagination.clickable` | `true` | Dot'lara tıklayarak ilgili slide'a geçiş yapılabilir |
| `pagination.bulletClass` | `'store-hero__dot'` | Her dot elementine atanan BEM sınıfı (Swiper varsayılanını override eder) |
| `pagination.bulletActiveClass` | `'store-hero__dot--active'` | Aktif dot'a atanan BEM sınıfı (Swiper varsayılanını override eder) |

#### 6.3.2 Import Yapısı ve CSS Bağımlılıkları

```typescript
// Swiper core — sadece ES module import
import Swiper from 'swiper';

// Swiper modülleri — tree-shakeable, yalnızca gerekli modüller
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper temel CSS — layout ve yapısal stiller
import 'swiper/css';

// Swiper pagination CSS — dot stilleri (temel, özel CSS ile override edilir)
import 'swiper/css/pagination';
```

> **Not:** Swiper v11+ ES Module formatında import edilir. Bundle size optimizasyonu için yalnızca `Autoplay` ve `Pagination` modülleri dahil edilir. `Navigation` (ok butonları) modülü kullanılmaz — hero banner'da sol/sağ ok navigasyonu yoktur, yalnızca dot pagination ve swipe/drag desteklenir.

### 6.4 Slide İçerik Yapısı

#### 6.4.1 TypeScript Data Interface

```typescript
// src/types/seller/types.ts

/**
 * Hero Banner slide verisi.
 * Her slide bir arka plan görseli ve opsiyonel text overlay içerir.
 */
interface HeroSlide {
  id: string;                                      // Benzersiz slide kimliği (ör. "calin-hero-1")
  image: string;                                   // Arka plan görseli URL'i
  title?: string;                                  // Opsiyonel overlay başlık metni
  subtitle?: string;                               // Opsiyonel overlay alt metin
  ctaText?: string;                                // Opsiyonel CTA buton metni (ör. "Learn More")
  ctaLink?: string;                                // Opsiyonel CTA hedef URL'i
  textPosition?: 'left' | 'center' | 'right';     // Text overlay yatay pozisyonu (varsayılan: 'left')
  textColor?: 'white' | 'dark';                    // Text renk şeması (varsayılan: 'white')
}

/**
 * Hero Banner component verisi.
 */
interface HeroBannerData {
  slides: HeroSlide[];                             // 1–5 arası slide dizisi
  autoplayDelay?: number;                          // Opsiyonel — varsayılan 5000ms
  showPagination?: boolean;                        // Opsiyonel — varsayılan true
}
```

#### 6.4.2 Slide Tipleri (Görsellerden Analiz)

Referans görsellerden tespit edilen dört temel slide tipi:

| # | Slide Tipi | Referans | textPosition | textColor | Arka Plan | Açıklama |
|---|-----------|----------|-------------|-----------|-----------|----------|
| 1 | **OEM/ODM slide** | Görsel 1 — Calin | `left` | `dark` | Açık endüstriyel fabrika görseli | Sol tarafa hizalı büyük "OEM/ODM" başlık + alt metin satırları. Arka plan açık olduğu için koyu metin kullanılır. CALIN watermark görselin parçasıdır (CSS overlay değil). |
| 2 | **YOUR BRAND slide** | Görsel 11 — Haers | `left` | `dark` | Pastel mavi gökyüzü gradyanı + ürün fotoğrafı | Sol hizalı "YOUR BRAND / YOUR COLOR / YOUR WAY" başlık. Açık arka plan üzerine koyu metin. Lifestyle/marka temalı. |
| 3 | **CRAFTED FOR LIFE slide** | Görsel 13 — Haers | `center` | `white` | Doğa/yeşillik arka plan görseli | Ortalanmış metin, koyu arka plan üzerine beyaz yazı. Doğa temalı, yaşam tarzı vurgusu. |
| 4 | **Sadece görsel slide** | Genel | — | — | Tam ekran ürün/fabrika görseli | Text overlay yok — `title` alanı boş bırakılır. Arka plan görseli tüm mesajı taşır. |

> **Önemli Not (Görsel 1 analizi):** Calin mağazasının ilk hero slide'ında "OEM/ODM" metni **koyu/siyah renkte** görünür — arka plan açık endüstriyel görsel olduğu için `textColor: "dark"` kullanılmalıdır. Spec mock data'daki `textColor: "white"` değeri görsel referansla uyuşmamaktadır; ekran görüntüsü esas alınır.

#### 6.4.3 Mock Data (Calin — Standart)

```json
{
  "heroBanner": {
    "slides": [
      {
        "id": "calin-hero-1",
        "image": "/assets/seller/calin/hero-oem-odm.jpg",
        "title": "OEM/ODM",
        "subtitle": "Precision metering · In-house innovation · Global ODM/OEM partnerships",
        "textPosition": "left",
        "textColor": "dark"
      },
      {
        "id": "calin-hero-2",
        "image": "/assets/seller/calin/hero-factory.jpg"
      },
      {
        "id": "calin-hero-3",
        "image": "/assets/seller/calin/hero-products.jpg",
        "title": "Smart Metering Solutions",
        "subtitle": "Industry-leading prepaid and smart electricity meters",
        "ctaText": "View Products",
        "ctaLink": "#hot-products",
        "textPosition": "left",
        "textColor": "white"
      }
    ],
    "autoplayDelay": 5000,
    "showPagination": true
  }
}
```

#### 6.4.4 Mock Data (Haers — PRO)

```json
{
  "heroBanner": {
    "slides": [
      {
        "id": "haers-hero-1",
        "image": "/assets/seller/haers/hero-your-brand.jpg",
        "title": "YOUR BRAND\nYOUR COLOR\nYOUR WAY",
        "subtitle": "Built for any terrain. Design'd for your way.",
        "textPosition": "left",
        "textColor": "dark"
      },
      {
        "id": "haers-hero-2",
        "image": "/assets/seller/haers/hero-crafted.jpg",
        "title": "CRAFTED FOR LIFE",
        "subtitle": "Premium vacuum insulation technology",
        "textPosition": "center",
        "textColor": "white"
      },
      {
        "id": "haers-hero-3",
        "image": "/assets/seller/haers/hero-tumbler.jpg",
        "title": "TUMBLER & MUGS",
        "subtitle": "Stainless steel collection — OEM & ODM welcome",
        "ctaText": "Explore Collection",
        "ctaLink": "#category-grid",
        "textPosition": "center",
        "textColor": "white"
      },
      {
        "id": "haers-hero-4",
        "image": "/assets/seller/haers/hero-lifestyle.jpg"
      }
    ],
    "autoplayDelay": 5000,
    "showPagination": true
  }
}
```

### 6.5 Dot Pagination Custom CSS

Hero banner'ın alt kısmında konumlanan dot pagination, Swiper.js'in varsayılan bullet stillerini override ederek özel BEM sınıflarıyla stillendirilir. Aktif dot turuncu (`var(--store-accent)`), pasif dot'lar yarı saydam beyaz olarak görünür.

```css
/* src/styles/seller/seller-storefront.css — Hero dot pagination */

/**
 * store-hero__dot — Her bir pagination dot'u.
 * Swiper'ın bulletClass parametresiyle atanır.
 * Varsayılan swiper-pagination-bullet stillerini tamamen override eder.
 */
.store-hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;                      /* Tam yuvarlak */
  background: rgba(255, 255, 255, 0.5);       /* Yarı saydam beyaz */
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
  margin: 0 2px;                              /* Dot'lar arası boşluk */
  display: inline-block;
  opacity: 1;                                 /* Swiper varsayılan opacity override */
}

/**
 * store-hero__dot--active — Aktif (mevcut) slide'ın dot'u.
 * Swiper'ın bulletActiveClass parametresiyle atanır.
 */
.store-hero__dot--active {
  background: #f97316;                         /* var(--store-accent) — turuncu */
  transform: scale(1.2);                       /* Aktif dot hafifçe büyür */
}

/**
 * store-hero__dot hover — Pasif dot'larda hover efekti.
 * Aktif dot'ta hover uygulanmaz (zaten vurgulu).
 */
.store-hero__dot:hover:not(.store-hero__dot--active) {
  background: rgba(255, 255, 255, 0.8);       /* Daha opak beyaz */
}
```

#### 6.5.1 Dot Pagination Görsel Referans (Görsel 4)

```
┌─────────────────────────────────────────────────────────┐
│                    Hero Banner Image                     │
│                                                         │
│                                                         │
│                                                         │
│                        ● ○                              │
│                   (active) (inactive)                   │
└─────────────────────────────────────────────────────────┘
                    ↑
               bottom: 16px (bottom-4)
               centered horizontally (left-1/2 -translate-x-1/2)
               gap: 8px (gap-2)
               z-index: 10

  ● Aktif dot: 10px, #f97316 (turuncu), scale(1.2)
  ○ Pasif dot: 10px, rgba(255,255,255,0.5), hover → rgba(255,255,255,0.8)
```

#### 6.5.2 Renk & Token Referansları

| Element | Hex Değer | CSS Token | Kullanım Yeri |
|---------|----------|-----------|--------------|
| Pasif dot bg | `rgba(255,255,255,0.5)` | — (inline) | Aktif olmayan slide dot'ları |
| Aktif dot bg | `#f97316` | `var(--store-accent)` | Mevcut slide'ın dot'u — turuncu |
| Dot hover bg | `rgba(255,255,255,0.8)` | — (inline) | Pasif dot'larda hover efekti |
| Overlay title (beyaz) | `#ffffff` | — | Koyu arka planlı slide'larda başlık |
| Overlay title (koyu) | `#111827` | `var(--color-text-primary)` | Açık arka planlı slide'larda başlık |
| Overlay subtitle (beyaz) | `rgba(255,255,255,0.8)` | — | Koyu arka planlı slide'larda alt metin |
| Overlay subtitle (koyu) | `#4b5563` | `var(--color-text-secondary)` | Açık arka planlı slide'larda alt metin |
| CTA buton bg | `#f97316` | `var(--store-accent)` | CTA buton arka planı |
| CTA buton hover | `#ea580c` | `var(--store-accent-hover)` | CTA buton hover durumu |
| CTA buton text | `#ffffff` | `var(--btn-text)` | CTA buton metin rengi |
| CTA buton radius | `8px` | `var(--radius-button)` | CTA buton köşe yuvarlaklığı |
| CTA buton shadow | — | `var(--shadow-md)` | CTA buton gölgesi |
| Pagination z-index | `10` | — (inline) | Dot'ların görsel üzerinde görünmesi |

### 6.6 Responsive

| Breakpoint | Slide Height | Title Font Size | Subtitle Font Size | Overlay Padding | CTA Görünürlük |
|------------|-------------|----------------|-------------------|-----------------|---------------|
| 2XL Desktop (>1280px) | `500px` | `48px`, `font-black` | `18px` | `px-16` | Gösterilir |
| XL Desktop (1024–1280px) | `450px` | `42px`, `font-black` | `18px` | `px-12` | Gösterilir |
| Tablet (768–1024px) | `400px` | `32px`, `font-black` | `14px` | `px-10` | Gösterilir |
| Mobile (480–768px) | `300px` | `24px`, `font-black` | `14px` | `px-6` | Gösterilir (küçültülmüş) |
| Small Mobile (<480px) | `200px` | `20px`, `font-black` | `13px` | `px-4` | Gizlenebilir (opsiyonel) |

#### 6.6.1 Responsive Tailwind Uygulaması

```html
<!-- Slide görseli: Mobile-first responsive yükseklik -->
<img
  :src="slide.image"
  :alt="slide.title || 'Banner'"
  class="w-full
         h-[450px]
         xl:h-[500px]
         lg:h-[400px]
         md:h-[300px]
         sm:h-[200px]
         object-cover"
/>

<!-- Overlay: Mobile-first responsive padding -->
<div class="store-hero__overlay absolute inset-0 flex flex-col justify-center
            px-16
            xl:px-12
            lg:px-10
            md:px-6
            sm:px-4">
  <!-- Başlık: Mobile-first responsive font-size -->
  <h2 class="store-hero__title
             text-[48px]
             xl:text-[42px]
             lg:text-[32px]
             md:text-[24px]
             sm:text-[20px]
             font-black leading-tight drop-shadow-lg">
    {{ slide.title }}
  </h2>
  <!-- Alt metin: Mobile-first responsive font-size -->
  <p class="store-hero__subtitle
            text-[18px]
            md:text-[14px]
            sm:text-[13px]
            mt-3 drop-shadow-md max-w-[600px]">
    {{ slide.subtitle }}
  </p>
</div>
```

> **Not:** TailwindCSS v4 mobile-first yaklaşımını kullanır. `h-[450px]` varsayılan (desktop) değerdir; `xl:`, `lg:`, `md:`, `sm:` prefix'leri ilgili breakpoint'lerde override yapar.

### 6.7 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Otomatik geçiş** | `.store-hero__swiper` | Swiper autoplay | Her 5 saniyede bir sonraki slide'a geçiş, 600ms animasyonla | `loop: true` — son slide'dan sonra ilk slide'a döner |
| 2 | **Swipe/drag** | `.store-hero__swiper` | `touchmove` / `mousemove` | Kullanıcı parmak veya fare ile slide'ları sürükleyerek değiştirebilir | Swiper yerleşik touch/drag desteği |
| 3 | **Dot tıklama** | `.store-hero__dot` | `click` | Tıklanan dot'un temsil ettiği slide'a doğrudan geçiş | `pagination.clickable: true` ile etkinleştirilir |
| 4 | **Fare üzerine gelme** | `.store-hero__swiper` | `mouseenter` | Autoplay duraklatılır — kullanıcı içeriği inceleyebilir | `pauseOnMouseEnter: true` konfigürasyonu |
| 5 | **Fare ayrılma** | `.store-hero__swiper` | `mouseleave` | Autoplay yeniden başlar — kalan süreden devam eder | Swiper yerleşik davranışı |
| 6 | **CTA tıklama** | `.store-hero__cta` | `click` | Slide verisindeki `ctaLink` URL'ine yönlendirme | Sayfa içi anchor (#) veya tam URL olabilir |
| 7 | **Keyboard navigasyon** | `.store-hero__swiper` | `keydown (←/→)` | Sol/sağ ok tuşları ile slide geçişi | Swiper yerleşik keyboard desteği (focus gerekir) |

#### 6.7.1 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| CTA buton | `bg-[var(--store-accent)]` | `bg-[var(--store-accent-hover)]` | `ring-2 ring-[var(--store-accent)] ring-offset-2` | `bg-[#c2410c]` |
| Pasif dot | `bg-[rgba(255,255,255,0.5)]` | `bg-[rgba(255,255,255,0.8)]` | — | Slide geçişi |
| Aktif dot | `bg-[#f97316] scale-[1.2]` | Değişmez — zaten vurgulu | — | — |
| Slide görseli | — | Autoplay duraklar | — | Drag/swipe başlar |

#### 6.7.2 Dark Mode Notları

C3 Hero Banner Carousel dark mode'da minimal değişikliğe uğrar — büyük arka plan görselleri tema değişiminden etkilenmez:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Pasif dot bg | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.5)` | Sabit — değişmez (görsel üzerinde) |
| Aktif dot bg | `#f97316` | `#f97316` | Sabit — değişmez |
| CTA buton bg | `#f97316` | `#f97316` | Sabit — değişmez |
| Overlay title (white) | `#ffffff` | `#ffffff` | Sabit — değişmez |
| Overlay title (dark) | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| Overlay subtitle (dark) | `#4b5563` | `#d1d5db` | `dark:text-gray-300` |

> **Genel Not:** Hero banner görsel-ağırlıklı bir component olduğundan, dark mode etkisi sınırlıdır. Yalnızca `textColor: "dark"` kullanan slide'larda koyu metin → açık metin dönüşümü yapılır. Görsel üzerindeki beyaz metin ve dot pagination zaten her iki modda da okunabilirdir.

---

## 7. Component 4: Product Category Grid (C4)

> **Dosya:** `src/components/seller/CategoryGrid.ts`
> **BEM Block:** `category-grid`
> **Referans Görseller:** Görsel 14 (Haers — 3+4 pastel renkli kategori kartları)
> **Durum:** ⚪ Opsiyonel — Sadece Haers tipi (PRO) mağazalarda kullanılır.

Product Category Grid, hero banner'ın altında konumlanan ve mağazanın ürün kategorilerini pastel renkli kartlar şeklinde sergileyen opsiyonel bir bileşendir. Üst satırda 3, alt satırda 4 olmak üzere toplam 7 kategori kartı içerir. Her kartta kategori adı (beyaz, büyük harf) sol üstte, ürün görseli sağ altta yer alır. Pastel arka plan renkleri kategori bazında mock data'dan dinamik olarak gelir. Kartlar hover'da hafif büyüme efekti ve gölge kazanır. Yalnızca PRO/genişletilmiş mağazalarda (Haers tipi) render edilir; standart mağazalarda (Calin tipi) bu bileşen atlanır.

### 7.1 HTML Yapısı

```html
<section id="category-grid" class="category-grid py-12 px-8 max-w-[var(--container-lg)] mx-auto">
  <!-- Üst Satır: 3 Kart -->
  <div class="category-grid__row-top grid grid-cols-3 gap-4 mb-4 lg:grid-cols-2 md:grid-cols-1">
    <a href="#" class="category-grid__card relative rounded-[var(--radius-lg)] overflow-hidden min-h-[180px] group cursor-pointer"
       :style="{ backgroundColor: category.bgColor }">
      <span class="category-grid__label absolute top-5 left-5 text-white text-[17px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[60%]">
        {{ category.name }}
      </span>
      <img :src="category.image" :alt="category.name"
           class="absolute right-0 bottom-0 max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
    </a>
    <!-- Kart 2, 3 — aynı yapıda, farklı verilerle (v-for ile doldurulur) -->
  </div>

  <!-- Alt Satır: 4 Kart -->
  <div class="category-grid__row-bottom grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1">
    <a href="#" class="category-grid__card relative rounded-[var(--radius-lg)] overflow-hidden min-h-[160px] group cursor-pointer"
       :style="{ backgroundColor: category.bgColor }">
      <span class="category-grid__label absolute top-4 left-4 text-white text-[15px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[55%]">
        {{ category.name }}
      </span>
      <img :src="category.image" :alt="category.name"
           class="absolute right-0 bottom-0 max-h-[75%] object-contain transition-transform duration-300 group-hover:scale-105" />
    </a>
    <!-- Kart 5, 6, 7 — aynı yapıda, farklı verilerle (v-for ile doldurulur) -->
  </div>
</section>
```

#### 7.1.1 HTML Yapı Notları

- **Üst satır (3 kart):** `grid-cols-3` ile yan yana dizilir. Her kart `min-h-[180px]`, label `text-[17px]`, `max-w-[60%]` ile görselle çakışma önlenir.
- **Alt satır (4 kart):** `grid-cols-4` ile yan yana dizilir. Her kart `min-h-[160px]`, label `text-[15px]`, `max-w-[55%]` ile daha kompakt.
- **Ürün görseli:** `absolute right-0 bottom-0` ile kartın sağ alt köşesine konumlanır, `overflow-hidden` ile kart sınırlarından taşan kısımlar kesilir.
- **`group` + `group-hover:scale-105`:** Kart üzerine gelindiğinde ürün görseli %5 büyür — pure CSS animasyonu, JS gerekmez.
- **`:style="{ backgroundColor: category.bgColor }"`:** Arka plan rengi inline style olarak mock data'dan gelir (Tailwind utility değil).
- **Opsiyonel kontrol:** Template'de `v-if="seller.hasCategoryGrid"` veya benzeri bir koşulla render/skip edilir.

#### 7.1.2 Kart ASCII Layout (Görsel 14)

```
┌──────────────────────────────────────┐
│  STAINLESS STEEL          ┌────────┐ │
│  TUMBLER &                │        │ │  ← Ürün görseli sağ alt
│  MUGS                     │  IMG   │ │     max-h-[80%], object-contain
│                           │        │ │
│  ↑ text-[17px], white     └────────┘ │
│    font-bold, uppercase              │
│    drop-shadow-md                    │
└──────────────────────────────────────┘
  bg: category.bgColor (inline style)
  rounded: 16px (var(--radius-lg))
  min-h: 180px (üst) / 160px (alt)
```

### 7.2 Pastel Arka Plan Renk Sistemi

Her kategori kartı kendine özgü bir pastel arka plan rengine sahiptir. Bu renkler, Görsel 14 referans görselinden çıkartılmış olup mock data JSON'dan `bgColor` alanı ile dinamik olarak uygulanır.

| # | Kategori Adı | Arka Plan Renk | CSS Hex | Renk Ailesi |
|---|-------------|---------------|---------|-------------|
| 1 | STAINLESS STEEL TUMBLER & MUGS | Sarı-yeşil | `#d4e157` / `#e6ee9c` | Lime |
| 2 | TRITAN BOTTLES | Gri | `#bdbdbd` / `#e0e0e0` | Grey |
| 3 | STAINLESS STEEL WATER BOTTLES | Açık mavi | `#90caf9` / `#bbdefb` | Blue |
| 4 | FOOD CONTAINER | Yeşil | `#a5d6a7` / `#c8e6c9` | Green |
| 5 | KIDS SERIES | Pembe | `#f48fb1` / `#f8bbd0` | Pink |
| 6 | SMART WATER BOTTLE | Turkuaz | `#80deea` / `#b2ebf2` | Cyan |
| 7 | THERMAL CARAFES | Bej | `#ffcc80` / `#ffe0b2` | Orange |

> **Not:** Her kategori kartının `bgColor` değeri mock data JSON'dan gelir. Yukarıdaki renkler referans görselden (Görsel 14) çıkartılmıştır. İlk hex değer ana ton, ikinci hex değer açık ton alternatifidir. Tasarımcı tercihi veya ürün görselinin kontrast ihtiyacına göre birinden biri kullanılabilir.

**Data Interface:**

```typescript
interface CategoryCard {
  id: string;
  name: string;
  bgColor: string;   // Pastel arka plan rengi (hex)
  image: string;      // Ürün görseli URL
  link?: string;      // Kategori sayfası linki
}
```

### 7.3 Tailwind / CSS Sınıfları

| Element | Classes | Açıklama |
|---------|---------|----------|
| Section container | `py-12 px-8 max-w-[var(--container-lg)] mx-auto` | 48px dikey, 32px yatay padding, 1472px max genişlik |
| Üst satır grid | `grid grid-cols-3 gap-4 mb-4` | 3 sütunlu grid, 16px gap, 16px alt boşluk |
| Alt satır grid | `grid grid-cols-4 gap-4` | 4 sütunlu grid, 16px gap |
| Kart (üst satır) | `relative rounded-[16px] overflow-hidden min-h-[180px] group cursor-pointer` | Yuvarlak köşe, minimum yükseklik, hover grubu |
| Kart (alt satır) | `relative rounded-[16px] overflow-hidden min-h-[160px] group cursor-pointer` | Alt satır daha kompakt |
| Kategori label (üst) | `absolute top-5 left-5 text-white text-[17px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[60%]` | Sol üst konumlu beyaz metin |
| Kategori label (alt) | `absolute top-4 left-4 text-white text-[15px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[55%]` | Alt satır için daha küçük font ve padding |
| Ürün görseli (üst) | `absolute right-0 bottom-0 max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105` | Sağ alt, hover'da %5 büyüme |
| Ürün görseli (alt) | `absolute right-0 bottom-0 max-h-[75%] object-contain transition-transform duration-300 group-hover:scale-105` | Alt satır görseli biraz daha küçük |

#### 7.3.1 Hover Efektleri

| Efekt | Değer | Tailwind Class | Açıklama |
|-------|-------|---------------|----------|
| Kart hover — görsel büyüme | `scale(1.05)` | `group-hover:scale-105` | Ürün görseli %5 büyür |
| Kart hover — gölge | `shadow-md` | `hover:shadow-md` | Kart hafif gölge kazanır |
| Geçiş süresi | `300ms` | `transition-transform duration-300` | Yumuşak animasyon |
| Geçiş eğrisi | `ease` | Tailwind varsayılan | Standart ease easing |
| Kart hover — ek büyüme (opsiyonel) | `scale(1.03)` | `hover:scale-[1.03]` | Tüm kartın hafif büyümesi (opsiyonel, tasarımcı tercihine bağlı) |

> **Not:** `group-hover:scale-105` ürün görseline uygulanır (kart içi). Opsiyonel olarak kartın kendisine `hover:scale-[1.03]` ve `hover:shadow-md` eklenebilir — bu durumda kart hem gölge kazanır hem de hafifçe büyür. `transition` class'ı karta da eklenmelidir: `transition-all duration-300`.

### 7.4 Responsive

| Breakpoint | Üst Satır | Alt Satır | Kart min-height | Gap | Ek Notlar |
|------------|-----------|-----------|-----------------|-----|-----------|
| Desktop (>1024px) | 3 sütun (`grid-cols-3`) | 4 sütun (`grid-cols-4`) | 180px / 160px | 16px (`gap-4`) | Tam grid layout |
| Tablet (768–1024px) | 2 sütun (`lg:grid-cols-2`) | 2 sütun (`lg:grid-cols-2`) | 160px | 16px (`gap-4`) | Her iki satır da 2'li gruplara düşer |
| Mobile (<768px) | 1 sütun (`md:grid-cols-1`) | 1 sütun (`md:grid-cols-1`) | 140px | 16px (`gap-4`) | Tüm kartlar tek sütun, dikey akış |

> **TailwindCSS v4 breakpoint notu:** TailwindCSS v4'te breakpoint prefix'leri mobile-first (min-width) yerine desktop-first (max-width) çalışır. `lg:grid-cols-2` ≤ 768px altında devreye girer, `md:grid-cols-1` ≤ 640px altında devreye girer. Varsayılan (prefix'siz) class'lar en geniş ekran boyutunu temsil eder.

### 7.5 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Kart hover** | `.category-grid__card` | `mouseenter` | Ürün görseli `scale(1.05)` + opsiyonel kart `scale(1.03)` ve `shadow-md` | Pure CSS — `group-hover` + `transition-transform duration-300` |
| 2 | **Kart hover çıkış** | `.category-grid__card` | `mouseleave` | Görsel ve kart normal boyutuna döner, gölge kaldırılır | CSS transition geri dönüşü |
| 3 | **Kart tıklama** | `.category-grid__card` (`<a>` etiketi) | `click` | İlgili kategori sayfasına yönlendirme (`category.link`) | `<a href>` ile standart link davranışı |
| 4 | **Keyboard focus** | `.category-grid__card` | `focus` | Kart `outline` veya `ring` görünür hale gelir | `focus-visible:ring-2 ring-[var(--store-accent)]` eklenmeli |

> **Not:** C4 Category Grid'in tüm hover animasyonları pure CSS (Tailwind `group-hover` + `transition`) ile yönetilir. JavaScript etkileşimi gerekmez. Kart tıklaması standart `<a>` link davranışıdır.

### 7.6 Dark Mode Notları

C4 Category Grid pastel arka plan renklerini inline style ile aldığından, dark mode'da temel yapı değişmez. Ancak okuma konforunu artırmak için bazı ince ayarlar yapılabilir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent (sayfa arka planı) | Transparent (sayfa arka planı) | Değişmez — üst katmana bağlı |
| Kart bg | `category.bgColor` (pastel inline) | Aynı `category.bgColor` korunur | Değişmez — inline style |
| Kategori label | `text-white` + `drop-shadow-md` | `text-white` + `drop-shadow-md` | Sabit — değişmez (beyaz metin pastel üzerinde her iki modda okunabilir) |
| Hover gölge | `shadow-md` | `dark:shadow-lg` | Opsiyonel — dark'ta daha belirgin gölge |

> **Genel Not:** Category Grid kartları pastel arka planlı ve beyaz metin kullanan görsel-ağırlıklı kartlardır. Pastel renkler dark mode'da da yeterli kontrast sağladığından, arka plan renginde dönüşüm yapılmaz. Bu yaklaşım, her iki modda da tutarlı marka renkleri ve görsel kimlik korur.

---

## 8. Component 5: Hot Products / Featured Products (C5)

> **Dosya:** `src/components/seller/HotProducts.ts`
> **BEM Block:** `hot-products`
> **Referans Görseller:** Görsel 4 (Calin — HOT PRODUCTS grid, dot pagination görünür), Görsel 9 (Calin — ürün kartları detay)
> **Durum:** ✅ Zorunlu — Tüm mağaza tiplerinde (Calin ve Haers) kullanılır.

Hot Products, mağazanın öne çıkan ürünlerini sergileyen zorunlu bir bileşendir. Büyük turuncu "HOT PRODUCTS" başlığı altında 3 sütunlu bir ürün grid'i yer alır. Her ürün kartı basit varyantı kullanır: ürün görseli, ürün adı ve "Buy Now" butonundan oluşur. Bu bileşen Calin tipi standart mağazalarda birincil ürün vitrin alanıdır. Haers tipi PRO mağazalarda ise Category Grid (C4) ve Category Product Listing (C6) bileşenleri ile birlikte kullanılabilir veya bu bileşenlerin yerine geçebilir.

### 8.1 HTML Yapısı

```html
<section id="hot-products" class="hot-products py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <!-- Başlık -->
    <h2 class="hot-products__title text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#f97316] uppercase text-center tracking-tight mb-10">
      HOT PRODUCTS
    </h2>

    <!-- Ürün Grid -->
    <div class="hot-products__grid grid grid-cols-3 gap-5 lg:grid-cols-2 md:grid-cols-1">

      <!-- Ürün Kartı (Basit Varyant) -->
      <div class="hot-products__card bg-white border border-[var(--card-border-color)] rounded-[var(--radius-card)] p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
        <!-- Ürün Görseli -->
        <div class="hot-products__image-wrapper w-full h-[200px] flex items-center justify-center mb-4">
          <img :src="product.image" :alt="product.name"
               class="max-h-full max-w-full object-contain" />
        </div>
        <!-- Ürün Adı -->
        <p class="hot-products__product-name text-[15px] text-[#222222] font-normal leading-snug mb-3 line-clamp-2">
          {{ product.name }}
        </p>
        <!-- Buy Now Buton -->
        <button class="hot-products__buy-btn bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[13px] rounded-[var(--radius-button)] px-6 py-2 mt-auto transition-colors shadow-sm hover:shadow-md">
          Buy Now
        </button>
      </div>

      <!-- Kart 2, 3, ... — aynı yapıda, farklı verilerle (v-for ile doldurulur) -->

    </div>
  </div>
</section>
```

#### 8.1.1 HTML Yapı Notları

- **Başlık (`<h2>`):** `text-[54px]` desktop'ta, `xl:text-[48px]` (≤1024px), `md:text-[36px]` (≤640px) ile responsive. `font-black` (900 weight), `text-[#f97316]` turuncu renk (store accent), `uppercase`, `tracking-tight` dar harf aralığı, `text-center` ortalı, `mb-10` (40px) alt boşluk.
- **Grid:** `grid-cols-3` ile 3 sütunlu düzen, `gap-5` (20px) kart arası boşluk.
- **Kart:** `flex flex-col items-center text-center` ile içerik dikey ve ortalı. `hover:shadow-md transition-shadow` ile hover'da gölge animasyonu.
- **Görsel wrapper:** `h-[200px]` sabit yükseklik, `flex items-center justify-center` ile görsel wrapper içinde ortalanır. `object-contain` ile oranı bozulmaz.
- **Ürün adı:** `line-clamp-2` ile maksimum 2 satır, fazlası `...` ile kesilir. `text-[15px]` boyut, `text-[#222222]` koyu metin.
- **Buy Now butonu:** `mt-auto` ile kartın altına yapışır (flex column sayesinde). `bg-[#f97316]` turuncu, `hover:bg-[#ea580c]` hover'da koyu turuncu, `shadow-sm hover:shadow-md` gölge geçişi.

### 8.2 Ürün Kartı Detay (Basit Varyant)

**Kart ASCII Layout (Görsel 4, 9):**

```
┌─────────────────────────┐
│                         │
│    [Ürün Görseli]       │  ← 200px height, object-fit contain
│                         │     flex items-center justify-center
│                         │
│  Din Rail Prepaid Meter │  ← text-[15px], text-center, #222222
│       with CIU          │     line-clamp-2, font-normal
│                         │
│      ┌─────────┐        │
│      │ Buy Now │        │  ← bg #f97316, text-[13px], font-semibold
│      └─────────┘        │     rounded-[var(--radius-button)], px-6 py-2
│                         │     shadow-sm, hover:shadow-md
└─────────────────────────┘
  bg: #ffffff (var(--card-bg))
  border: 1px solid #e5e5e5 (var(--card-border-color))
  rounded: 8px (var(--radius-card))
  padding: 24px (p-6)
```

**Data Interface:**

```typescript
interface SimpleProduct {
  id: string;
  name: string;
  image: string;
  link: string;
}
```

**Mock Data Örneği (6 ürün):**

```json
{
  "hotProducts": [
    { "id": "hp-1", "name": "Din Rail Prepaid Meter with CIU", "image": "/assets/mock/prod-din-rail.jpg", "link": "#" },
    { "id": "hp-2", "name": "Single Phase Prepaid Dual-source Energy Meter", "image": "/assets/mock/prod-single-phase.jpg", "link": "#" },
    { "id": "hp-3", "name": "Three-phase Prepaid Energy Meter", "image": "/assets/mock/prod-three-phase.jpg", "link": "#" },
    { "id": "hp-4", "name": "Ultrasonic Water Meter DN15-DN300", "image": "/assets/mock/prod-ultrasonic.jpg", "link": "#" },
    { "id": "hp-5", "name": "Smart Prepaid Token Electricity Meter", "image": "/assets/mock/prod-smart-prepaid.jpg", "link": "#" },
    { "id": "hp-6", "name": "Industrial Gas Meter G4-G100", "image": "/assets/mock/prod-gas.jpg", "link": "#" }
  ]
}
```

### 8.3 Tailwind / CSS Sınıfları

| Element | Classes | Açıklama |
|---------|---------|----------|
| Section | `py-12` | 48px dikey padding |
| İç container | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Başlık | `text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#f97316] uppercase text-center tracking-tight mb-10` | Büyük turuncu başlık |
| Ürün grid | `grid grid-cols-3 gap-5 lg:grid-cols-2 md:grid-cols-1` | 3 sütun → 2 → 1 responsive |
| Ürün kartı | `bg-white border border-[var(--card-border-color)] rounded-[var(--radius-card)] p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow` | Beyaz kart, hover gölge |
| Görsel wrapper | `w-full h-[200px] flex items-center justify-center mb-4` | Sabit yükseklik görsel alanı |
| Görsel | `max-h-full max-w-full object-contain` | Oran koruyarak sığdır |
| Ürün adı | `text-[15px] text-[#222222] font-normal leading-snug mb-3 line-clamp-2` | 2 satır limit, koyu metin |
| Buy Now buton | `bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[13px] rounded-[var(--radius-button)] px-6 py-2 mt-auto transition-colors shadow-sm hover:shadow-md` | Turuncu CTA buton |

### 8.4 Responsive

| Breakpoint | Grid | Gap | Kart Padding | Başlık Boyutu |
|------------|------|-----|-------------|---------------|
| Desktop (>1024px) | 3 sütun (`grid-cols-3`) | 20px (`gap-5`) | 24px (`p-6`) | 54px (`text-[54px]`) |
| Tablet (768–1024px) | 2 sütun (`lg:grid-cols-2`) | 20px (`gap-5`) | 20px (`p-5`) | 48px (`xl:text-[48px]`) |
| Mobile (<768px) | 1 sütun (`md:grid-cols-1`) | 20px (`gap-5`) | 16px (`p-4`) | 36px (`md:text-[36px]`) |

> **TailwindCSS v4 responsive notu:** Grid sütun sayısı breakpoint'lere göre `3 → 2 → 1` şeklinde azalır. Gap sabit kalır (`gap-5`), ancak kart padding'i responsive olarak küçültülür. Başlık boyutu da ekran genişliğine göre kademeli olarak azalır.

### 8.5 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Kart hover** | `.hot-products__card` | `mouseenter` | Kart `shadow-md` gölge kazanır | Pure CSS — `hover:shadow-md transition-shadow` |
| 2 | **Kart hover çıkış** | `.hot-products__card` | `mouseleave` | Gölge kaldırılır | CSS transition geri dönüşü |
| 3 | **Buy Now tıklama** | `.hot-products__buy-btn` | `click` | Ürün detay sayfasına yönlendirme (`product.link`) | `<button>` veya `<a>` ile implementasyon; buton hover'da `bg-[#ea580c]` + `shadow-md` |
| 4 | **Buy Now hover** | `.hot-products__buy-btn` | `mouseenter` | Buton rengi `#f97316` → `#ea580c`, gölge `shadow-sm` → `shadow-md` | Pure CSS — `hover:bg-[#ea580c] hover:shadow-md` |
| 5 | **Görsel tıklama** | `.hot-products__image-wrapper` | `click` | Ürün detay sayfasına yönlendirme (`product.link`) | Tüm kart tıklanabilir veya sadece buton — implementasyona bağlı |
| 6 | **Keyboard focus** | `.hot-products__buy-btn` | `focus` | Buton `ring-2 ring-[#f97316] ring-offset-2` outline alır | Erişilebilirlik için focus state |

> **Not:** C5 Hot Products bileşeninin hover animasyonları pure CSS ile yönetilir. JavaScript etkileşimi gerekmez. "Buy Now" butonu standart tıklama/yönlendirme davranışı sunar.

### 8.6 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Ürün kartı | `shadow-none` (border only) | `shadow-md` | — | — |
| Buy Now buton | `bg-[#f97316] shadow-sm` | `bg-[#ea580c] shadow-md` | `ring-2 ring-[#f97316] ring-offset-2` | `bg-[#c2410c]` |
| Ürün görseli | `scale-100` | Opsiyonel `scale-[1.02]` | — | — |

### 8.7 Dark Mode Notları

C5 Hot Products dark mode'da kart arka plan ve border renklerinde değişiklik gerektirir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent | Transparent | Değişmez |
| Başlık rengi | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Kart bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Kart border | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| Ürün adı | `#222222` | `#f9fafb` | `dark:text-gray-50` |
| Buy Now bg | `#f97316` | `#f97316` | Sabit — değişmez |
| Buy Now hover bg | `#ea580c` | `#ea580c` | Sabit — değişmez |
| Kart hover gölge | `shadow-md` | `dark:shadow-lg` | Dark'ta daha belirgin gölge |

> **Genel Not:** Hot Products başlık rengi (turuncu) ve Buy Now buton renkleri her iki modda da sabit kalır — marka renkleri tema değişiminden etkilenmez. Kart arka planı ve border'ı dark mode'da koyu tonlara döner, ürün adı metni ise açık renge geçer.

---

## 9. Component 6: Category Product Listing — Banner + Grid (C6)

> **Dosya:** `src/components/seller/CategoryProductListing.ts`
> **BEM Block:** `category-listing`
> **Referans Görseller:** Görsel 15–17 (Haers — kategori banner, detaylı ürün kartları, badge'ler, fiyatlar, MOQ)
> **Durum:** ⚪ Opsiyonel — Sadece Haers tipi PRO mağazalarda görünür. Birden fazla kategori tekrarlanabilir.

Category Product Listing, Haers tipi PRO mağazalarda kullanılan opsiyonel bir bileşendir. Her kategori için tam genişlikte bir yaşam tarzı banner görseli ve altında 4 sütunlu detaylı ürün kartı grid'i içerir. Bu bileşen standart Calin tipi mağazalarda yer almaz. Birden fazla kategori (`categoryListings` dizisindeki her eleman) için `<section>` bloğu tekrarlanır. Her ürün kartı; ürün görseli (opsiyonel video play ikonu), badge satırı, ürün adı, fiyat aralığı, minimum sipariş adedi (MOQ) ve satış adedini gösterir. Kartlar paylaşımlı border sistemi ile dikişsiz grid görünümü oluşturur: container'da `border-t border-l`, her kartta `border-r border-b`.

### 9.1 HTML Yapısı

```html
<section id="category-listing-{{ category.id }}" class="category-listing mb-12">

  <!-- Kategori Banner -->
  <div class="category-listing__banner relative w-full overflow-hidden">
    <img :src="category.bannerImage" :alt="category.name"
         class="w-full h-[350px] xl:h-[300px] md:h-[200px] sm:h-[160px] object-cover" />
    <div class="absolute inset-0 flex items-center justify-center bg-black/10">
      <h3 class="text-[46px] xl:text-[40px] md:text-[28px] sm:text-[22px] font-black text-white uppercase tracking-tight drop-shadow-xl"
          style="text-shadow: 0 2px 12px rgba(0,0,0,0.4);">
        {{ category.name }}
      </h3>
    </div>
  </div>

  <!-- Ürün Grid (Paylaşımlı Border Sistemi) -->
  <div class="category-listing__grid grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 border-t border-l border-[var(--card-border-color)]">

    <!-- Detaylı Ürün Kartı -->
    <div class="category-listing__card bg-white border-r border-b border-[var(--card-border-color)] p-4 flex flex-col hover:shadow-lg transition-shadow relative group">

      <!-- Ürün Görseli + Video Play İkon -->
      <div class="category-listing__image relative w-full h-[200px] flex items-center justify-center mb-3">
        <img :src="product.image" :alt="product.name"
             class="max-h-full max-w-full object-contain" />
        <!-- Video Play Icon (opsiyonel — sadece product.hasVideo === true ise) -->
        <button v-if="product.hasVideo"
                class="category-listing__play-btn absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Ürün videosunu oynat">
          <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
          </svg>
        </button>
      </div>

      <!-- Badge Satırı -->
      <div class="category-listing__badges flex flex-wrap gap-1 mb-2">
        <span v-for="badge in product.badges"
              class="inline-flex items-center gap-0.5 text-[11px] rounded-sm px-1.5 py-0.5"
              :class="badgeClass(badge.type)">
          {{ badge.label }}
        </span>
      </div>

      <!-- Ürün Adı -->
      <p class="category-listing__name text-[14px] text-[#222222] font-normal leading-snug line-clamp-2 mb-2">
        {{ product.name }}
      </p>

      <!-- Fiyat Aralığı -->
      <p class="category-listing__price text-[16px] text-[#111827] font-bold">
        ${{ product.priceMin }}-{{ product.priceMax }}
      </p>

      <!-- Minimum Sipariş Adedi (MOQ) -->
      <p class="category-listing__moq text-[13px] text-[#6b7280] mt-1">
        Min. Order {{ product.moq }} {{ product.moqUnit }}
      </p>

      <!-- Satış Adedi -->
      <p class="category-listing__sold text-[12px] text-[#9ca3af] mt-0.5">
        {{ product.soldCount }} sold
      </p>

    </div>

    <!-- Kart 2, 3, ... — aynı yapıda, farklı verilerle (v-for ile doldurulur) -->

  </div>

</section>
```

#### 9.1.1 HTML Yapı Notları

- **`<section>` tekrarı:** `categoryListings` dizisindeki her kategori için ayrı bir `<section>` bloğu render edilir. `id` attribute'u `category-listing-{{ category.id }}` ile benzersiz yapılır.
- **Banner (`category-listing__banner`):** `relative w-full overflow-hidden` ile tam genişlikte, taşma gizli. İçindeki `<img>` `object-cover` ile kırpılarak doldurulur. Overlay `absolute inset-0` ile tam kaplayıcı, `bg-black/10` ile hafif karartma. Başlık `drop-shadow-xl` + inline `text-shadow: 0 2px 12px rgba(0,0,0,0.4)` ile güçlü gölge.
- **Banner yüksekliği:** Desktop 350px → Tablet (≤1024px) 300px → Mobile (≤640px) 200px → Küçük mobil (≤480px) 160px.
- **Banner başlık:** `text-[46px]` desktop, `xl:text-[40px]` (≤1024px), `md:text-[28px]` (≤640px), `sm:text-[22px]` (≤480px). `font-black` (900 weight), `text-white`, `uppercase`, `tracking-tight`.
- **Grid (paylaşımlı border):** Container'da `border-t border-l`, her kartta `border-r border-b` ile dikişsiz tablo benzeri görünüm. Bireysel kartlarda `rounded` yok — kesintisiz grid.
- **Ürün kartı:** `p-4` (16px) padding, `flex flex-col` dikey yerleşim, `hover:shadow-lg transition-shadow` ile hover'da gölge efekti, `relative group` ile çocuk öğeler için group-hover kullanımı mümkün.
- **Görsel alanı:** `h-[200px]` sabit yükseklik, `flex items-center justify-center` ile ortalı, `object-contain` ile oran korunur.
- **Video play ikonu:** `absolute inset-0 m-auto` ile tam ortalanmış overlay, sadece `product.hasVideo === true` olduğunda render edilir.
- **Badge satırı:** `flex-wrap gap-1` ile sarmalayan flex, badge yoksa (boş dizi) div boş kalır, layout etkilenmez.
- **Ürün adı:** `line-clamp-2` ile maksimum 2 satır, `text-[14px]` boyut, `leading-snug` sıkı satır aralığı.
- **Fiyat:** `text-[16px] font-bold` ile belirgin, `$min-max` formatında.
- **MOQ:** `text-[13px] text-[#6b7280]` gri, `mt-1` (4px) üst boşluk.
- **Sold count:** `text-[12px] text-[#9ca3af]` daha açık gri, `mt-0.5` (2px) üst boşluk.

### 9.2 Detaylı Ürün Kartı

**Kart ASCII Layout (Görsel 15–17):**

```
┌───────────────────────────┐
│                           │
│   [Ürün Görseli]          │  ← 200px height, object-contain
│        ⏵                  │     flex items-center justify-center
│   (play icon overlay)     │     video play: 40px circle, bg-black/50
│                           │
│ ┌──────────┐ ┌──────────┐ │
│ │Main prod.│ │certified │ │  ← text-[11px], rounded-sm
│ └──────────┘ └──────────┘ │     px-1.5, py-0.5, gap-1
│                           │
│ Custom Vacuum Insulated   │  ← text-[14px], #222222, font-normal
│ 32oz Stainless Steel...   │     line-clamp-2, leading-snug
│                           │
│ $5.45-$6.55               │  ← text-[16px], #111827, font-bold
│ Min. Order 500 pieces     │  ← text-[13px], #6b7280, mt-1
│ 28212 sold                │  ← text-[12px], #9ca3af, mt-0.5
│                           │
└───────────────────────────┘
  bg: #ffffff (white)
  border: 1px solid #e5e5e5 (shared — border-r border-b)
  padding: 16px (p-4)
  NO rounded corners (seamless grid)
```

**Data Interface:**

```typescript
interface DetailedProduct {
  id: string;
  name: string;
  image: string;
  hasVideo: boolean;
  badges: Array<{ type: string; label: string }>;
  priceMin: number;
  priceMax: number;
  moq: number;
  moqUnit: string;     // "pieces", "sets", "cartons" vb.
  soldCount: number;
  link: string;
}

interface ProductCategory {
  id: string;
  name: string;
  bannerImage: string;
  products: DetailedProduct[];
}
```

**Mock Data Örneği (2 kategori, her biri 4 ürün):**

```json
{
  "categoryListings": [
    {
      "id": "cl-1",
      "name": "TUMBLER & MUGS",
      "bannerImage": "/assets/mock/banner-tumbler.jpg",
      "products": [
        {
          "id": "clp-1",
          "name": "Custom Vacuum Insulated 32oz Stainless Steel Tumbler with Handle",
          "image": "/assets/mock/tumbler-1.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Main product" },
            { "type": "fsc-certified", "label": "FSC Certified" }
          ],
          "priceMin": 5.45,
          "priceMax": 6.55,
          "moq": 500,
          "moqUnit": "pieces",
          "soldCount": 28212,
          "link": "#"
        },
        {
          "id": "clp-2",
          "name": "Wholesale Double Wall 20oz Insulated Coffee Tumbler",
          "image": "/assets/mock/tumbler-2.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "certified", "label": "certified" }
          ],
          "priceMin": 3.20,
          "priceMax": 4.80,
          "moq": 300,
          "moqUnit": "pieces",
          "soldCount": 15843,
          "link": "#"
        },
        {
          "id": "clp-3",
          "name": "Custom Logo 40oz Stainless Steel Tumbler with Straw",
          "image": "/assets/mock/tumbler-3.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Main product" }
          ],
          "priceMin": 6.80,
          "priceMax": 8.20,
          "moq": 500,
          "moqUnit": "pieces",
          "soldCount": 12567,
          "link": "#"
        },
        {
          "id": "clp-4",
          "name": "Personalized Insulated Travel Mug 14oz with Flip Lid",
          "image": "/assets/mock/tumbler-4.jpg",
          "hasVideo": false,
          "badges": [],
          "priceMin": 2.90,
          "priceMax": 3.50,
          "moq": 1000,
          "moqUnit": "pieces",
          "soldCount": 8934,
          "link": "#"
        }
      ]
    },
    {
      "id": "cl-2",
      "name": "WATER BOTTLES",
      "bannerImage": "/assets/mock/banner-water.jpg",
      "products": [
        {
          "id": "clp-5",
          "name": "BPA Free Tritan Sports Water Bottle 750ml Leak Proof",
          "image": "/assets/mock/water-1.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "certified", "label": "certified" }
          ],
          "priceMin": 1.80,
          "priceMax": 2.50,
          "moq": 500,
          "moqUnit": "pieces",
          "soldCount": 22456,
          "link": "#"
        },
        {
          "id": "clp-6",
          "name": "Stainless Steel Vacuum Flask 500ml Double Wall Thermos",
          "image": "/assets/mock/water-2.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Main product" },
            { "type": "fsc-certified", "label": "FSC Certified" }
          ],
          "priceMin": 4.50,
          "priceMax": 5.90,
          "moq": 300,
          "moqUnit": "pieces",
          "soldCount": 18923,
          "link": "#"
        },
        {
          "id": "clp-7",
          "name": "Kids Insulated Water Bottle with Straw 350ml Cartoon Design",
          "image": "/assets/mock/water-3.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "main-product", "label": "Main product" }
          ],
          "priceMin": 3.10,
          "priceMax": 4.20,
          "moq": 500,
          "moqUnit": "pieces",
          "soldCount": 9876,
          "link": "#"
        },
        {
          "id": "clp-8",
          "name": "Glass Water Bottle with Silicone Sleeve 550ml Borosilicate",
          "image": "/assets/mock/water-4.jpg",
          "hasVideo": false,
          "badges": [],
          "priceMin": 2.20,
          "priceMax": 3.00,
          "moq": 1000,
          "moqUnit": "pieces",
          "soldCount": 6543,
          "link": "#"
        }
      ]
    }
  ]
}
```

### 9.3 Badge Sistem Tanımı

Detaylı ürün kartlarında kullanılan badge'ler, ürünün özelliklerini (ana ürün, sertifikalı, FSC vb.) küçük etiketlerle belirtir. Her badge tipi farklı arka plan ve metin rengine sahiptir.

| Badge Type | Background | Text Color | Font Size | Border Radius | Padding | Örnek |
|------------|-----------|------------|-----------|---------------|---------|-------|
| `main-product` | `#f3f4f6` (gray-100) | `#374151` (gray-700) | `11px` | `2px` (rounded-sm) | `6px 2px` (px-1.5 py-0.5) | "Main product" |
| `fsc-certified` | `#f0fdf4` (green-50) | `#166534` (green-800) | `11px` | `2px` (rounded-sm) | `6px 2px` (px-1.5 py-0.5) | "FSC Certified" |
| `certified` | `#f0fdf4` (green-50) | `#166534` (green-800) | `11px` | `2px` (rounded-sm) | `6px 2px` (px-1.5 py-0.5) | "✅ certified" |
| `custom` | `#eff6ff` (blue-50) | `#1e40af` (blue-800) | `11px` | `2px` (rounded-sm) | `6px 2px` (px-1.5 py-0.5) | Özel badge |

**Badge Class Mapping Fonksiyonu:**

```typescript
function badgeClass(type: string): string {
  const map: Record<string, string> = {
    'main-product': 'bg-[#f3f4f6] text-[#374151]',
    'fsc-certified': 'bg-[#f0fdf4] text-[#166534]',
    'certified': 'bg-[#f0fdf4] text-[#166534]',
    'custom': 'bg-[#eff6ff] text-[#1e40af]',
  };
  return map[type] || 'bg-[#f3f4f6] text-[#374151]';
}
```

**Badge Ortak CSS Sınıfları:**

```
inline-flex items-center gap-0.5 text-[11px] rounded-sm px-1.5 py-0.5
```

> **Not:** Badge'ler `flex-wrap` ile sarmalanır. Bir ürünün birden fazla badge'i olabilir (ör. "Main product" + "FSC Certified"). Badge yoksa (boş dizi) satır boş kalır ve layout'u etkilemez. `gap-1` (4px) ile badge'ler arası yatay boşluk sağlanır.

### 9.4 Video Play İkon CSS

Opsiyonel video play ikonu, `product.hasVideo === true` olan ürün kartlarında görsel üzerine overlay olarak yerleştirilir.

**CSS Spesifikasyonu:**

| Özellik | Değer | Tailwind Sınıfı |
|---------|-------|-----------------|
| Konumlama | Absolute, tam ortalı | `absolute inset-0 m-auto` |
| Genişlik | 40px | `w-10` |
| Yükseklik | 40px | `h-10` |
| Border Radius | Tam yuvarlak (circle) | `rounded-full` |
| Arka Plan | Semi-transparent siyah (50%) | `bg-black/50` |
| Hover Arka Plan | Semi-transparent siyah (70%) | `hover:bg-black/70` |
| İçerik Hizalama | Ortala (flex) | `flex items-center justify-center` |
| Geçiş | Renk geçişi | `transition-colors` |
| Play İkon | SVG üçgen, beyaz, 16x16 | `w-4 h-4 text-white ml-0.5` |
| Z-index | Görsel üstünde | Varsayılan (relative parent içinde absolute) |

**Play İkon SVG:**

```html
<svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
  <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
</svg>
```

**Play İkon ASCII Detay:**

```
         ┌──────────┐
         │          │
         │  ┌────┐  │  ← 40px × 40px circle
         │  │ ▶  │  │     bg: rgba(0,0,0,0.5)
         │  └────┘  │     hover: rgba(0,0,0,0.7)
         │          │     play SVG: 16px, white
         └──────────┘
  position: absolute, inset-0, m-auto (centered)
  rounded-full, transition-colors
```

> **Görünürlük:** Play ikonu sadece `product.hasVideo === true` olduğunda render edilir (`v-if`). `false` olduğunda DOM'a eklenmez. İkon hover'da opaklık artarak daha belirgin hale gelir (`bg-black/50 → bg-black/70`). Erişilebilirlik için `<button>` elementi kullanılır ve `aria-label="Ürün videosunu oynat"` eklenir.

### 9.5 Tailwind / CSS Sınıfları

| Element | Classes | Açıklama |
|---------|---------|----------|
| Section | `mb-12` | 48px alt boşluk (kategoriler arası mesafe) |
| Banner wrapper | `relative w-full overflow-hidden` | Tam genişlik, taşma gizli |
| Banner görseli | `w-full h-[350px] xl:h-[300px] md:h-[200px] sm:h-[160px] object-cover` | Responsive yükseklik, kırparak doldur |
| Banner overlay | `absolute inset-0 flex items-center justify-center bg-black/10` | Hafif karartma overlay |
| Banner başlık | `text-[46px] xl:text-[40px] md:text-[28px] sm:text-[22px] font-black text-white uppercase tracking-tight drop-shadow-xl` | Büyük beyaz başlık + gölge |
| Ürün grid | `grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 border-t border-l border-[var(--card-border-color)]` | 4 sütun responsive grid, paylaşımlı border |
| Ürün kartı | `bg-white border-r border-b border-[var(--card-border-color)] p-4 flex flex-col hover:shadow-lg transition-shadow relative group` | Dikişsiz kart, hover gölge |
| Görsel wrapper | `relative w-full h-[200px] flex items-center justify-center mb-3` | Sabit yükseklik görsel alanı |
| Görsel | `max-h-full max-w-full object-contain` | Oran koruyarak sığdır |
| Video play butonu | `absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors` | 40px yuvarlak, yarı saydam |
| Badge container | `flex flex-wrap gap-1 mb-2` | Sarmalayan badge satırı |
| Badge | `inline-flex items-center gap-0.5 text-[11px] rounded-sm px-1.5 py-0.5` + tip rengi | Küçük etiket, tipe göre renk |
| Ürün adı | `text-[14px] text-[#222222] font-normal leading-snug line-clamp-2 mb-2` | 2 satır limit, koyu metin |
| Fiyat | `text-[16px] text-[#111827] font-bold` | Kalın fiyat metni |
| MOQ | `text-[13px] text-[#6b7280] mt-1` | Gri MOQ bilgisi |
| Satış adedi | `text-[12px] text-[#9ca3af] mt-0.5` | Açık gri satış sayısı |

### 9.6 Responsive

| Breakpoint | Grid Sütun | Banner Yükseklik | Banner Başlık | Kart Padding | Görsel Yükseklik |
|------------|-----------|-----------------|---------------|-------------|-----------------|
| Desktop (>1280px) | 4 sütun (`grid-cols-4`) | 350px (`h-[350px]`) | 46px (`text-[46px]`) | 16px (`p-4`) | 200px |
| Large (1024–1280px) | 3 sütun (`xl:grid-cols-3`) | 300px (`xl:h-[300px]`) | 40px (`xl:text-[40px]`) | 16px (`p-4`) | 200px |
| Tablet (768–1024px) | 2 sütun (`lg:grid-cols-2`) | 200px (`md:h-[200px]`) | 28px (`md:text-[28px]`) | 12px (`p-3`) | 180px |
| Mobile (<768px) | 1 sütun (`md:grid-cols-1`) | 160px (`sm:h-[160px]`) | 22px (`sm:text-[22px]`) | 12px (`p-3`) | 160px |

> **TailwindCSS v4 responsive notu:** Grid sütun sayısı `4 → 3 → 2 → 1` şeklinde kademeli olarak azalır. Banner yüksekliği ve başlık boyutu da ekrana uygun şekilde küçülür. Kart padding'i tablet ve mobilde `p-3` (12px) olarak azaltılır. Paylaşımlı border sistemi tüm breakpoint'lerde korunur — grid yapısı değişse de border-t/l (container) ve border-r/b (kart) pattern'i aynı kalır.

### 9.7 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Kart hover** | `.category-listing__card` | `mouseenter` | Kart `shadow-lg` gölge kazanır | Pure CSS — `hover:shadow-lg transition-shadow` |
| 2 | **Kart hover çıkış** | `.category-listing__card` | `mouseleave` | Gölge kaldırılır | CSS transition geri dönüşü |
| 3 | **Kart tıklama** | `.category-listing__card` | `click` | Ürün detay sayfasına yönlendirme (`product.link`) | Tüm kart `<a>` ile sarmalanabilir veya JS click handler |
| 4 | **Video play tıklama** | `.category-listing__play-btn` | `click` | Video modal/lightbox açılır veya yeni sayfaya yönlendirme | `event.stopPropagation()` ile kart tıklaması engellenir |
| 5 | **Video play hover** | `.category-listing__play-btn` | `mouseenter` | Buton opaklığı artar: `bg-black/50` → `bg-black/70` | Pure CSS — `hover:bg-black/70 transition-colors` |
| 6 | **Badge tıklama** | `.category-listing__badges span` | `click` | Opsiyonel — badge'e göre filtreleme veya bilgi tooltip | Gelecek implementasyon; şu an statik |
| 7 | **Keyboard focus** | `.category-listing__play-btn` | `focus` | Play butonu `ring-2 ring-white ring-offset-2` outline alır | Erişilebilirlik — tab ile navigasyon |
| 8 | **Banner görsel yükleme** | `.category-listing__banner img` | `load` | Görsel yüklenene kadar placeholder/skeleton gösterilir | `loading="lazy"` attribute eklenebilir |

> **Not:** C6 Category Product Listing bileşeninin etkileşimleri büyük ölçüde pure CSS ile yönetilir. Video play butonu tıklaması, kart tıklamasından bağımsız çalışmalıdır (`stopPropagation`). Banner görseli `loading="lazy"` ile lazy load edilebilir (performans optimizasyonu).

### 9.8 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Ürün kartı | `shadow-none` (border only) | `shadow-lg` | — | — |
| Video play butonu | `bg-black/50` | `bg-black/70` | `ring-2 ring-white ring-offset-2` | `bg-black/80` |
| Badge | Statik (renk sabit) | Opsiyonel `opacity-80` | — | — |
| Ürün görseli | `scale-100` | Opsiyonel `group-hover:scale-[1.02]` | — | — |
| Ürün adı | `text-[#222222]` | Opsiyonel `text-[#111827]` (koyu) | — | — |

### 9.9 Dark Mode Notları

C6 Category Product Listing dark mode'da kart arka plan, border ve metin renklerinde değişiklik gerektirir. Banner görseli ve overlay değişmez.

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Banner görseli | Değişmez | Değişmez | — |
| Banner overlay | `bg-black/10` | `bg-black/20` | `dark:bg-black/20` |
| Banner başlık | `text-white` | `text-white` | Sabit — değişmez |
| Grid border | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| Kart bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Kart border | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| Ürün adı | `#222222` | `#f9fafb` | `dark:text-gray-50` |
| Fiyat | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| MOQ text | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| Sold text | `#9ca3af` | `#6b7280` | `dark:text-gray-500` |
| Badge bg (main-product) | `#f3f4f6` | `#374151` | `dark:bg-gray-700` |
| Badge text (main-product) | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Badge bg (certified) | `#f0fdf4` | `#064e3b` | `dark:bg-emerald-900` |
| Badge text (certified) | `#166534` | `#6ee7b7` | `dark:text-emerald-300` |
| Kart hover gölge | `shadow-lg` | `dark:shadow-xl` | Dark'ta daha belirgin gölge |

> **Genel Not:** Banner görseli ve üzerindeki beyaz başlık her iki modda da sabit kalır — zaten beyaz metin + karanlık overlay her iki temada okunabilir. Kart arka planı ve border'ı dark mode'da koyu tonlara döner. Fiyat ve ürün adı metinleri açık renge geçer, MOQ ve sold count gri tonlarında kalır. Badge'ler dark mode'da koyu arka plan ile tersine çevrilerek kontrast korunur.

---

## 10. Component 7: Company Info / About Us (C7)

> **Dosya:** `src/components/seller/CompanyInfo.ts`
> **BEM Block:** `company-info`
> **Referans Görseller:** Görsel 5 + 8 (Calin — Variant A: verified banner + fabrika görseli + logo + açıklama), Görsel 18 (Haers — Variant B: scrollable metin + carousel + lokasyon kartları)
> **Durum:** ✅ Zorunlu — Tüm mağaza tiplerinde kullanılır. Satıcının mağaza tipine göre Variant A veya Variant B render edilir.

Company Info / About Us, satıcının şirket tanıtımını, fabrika görsellerini ve lokasyon bilgilerini gösteren zorunlu bir bileşendir. İki varyant mevcuttur: **Variant A (Calin tarzı)** — koyu mavi "COMPANY" başlığı, turuncu-kırmızı gradient verified supplier banner'ı (Alibaba.com + TÜV logoları + tarih), 55/45 oranında iki sütunlu içerik (sol: gradient overlay'li büyük fabrika görseli, sağ: logo + uzun açıklama paragrafı) ve altında 3'lü fabrika fotoğraf grid'i içerir. **Variant B (Haers tarzı)** — bej arka plan üzerine 40/60 oranında iki sütunlu layout (sol: kahverengi italic "About us" başlığı + max-height/overflow-y ile scrollable metin alanı + custom scrollbar, sağ: Swiper.js fabrika fotoğraf carousel'i + alt kısımda caption) ve altında 4'lü lokasyon kartları (fotoğraf + koyu overlay + beyaz lokasyon metni) barındırır.

### 10.1 Variant A — Metin + Görsel Yan Yana (Calin tarzı)

**Referans: Görsel 5, 8**

#### 10.1.1 HTML Yapısı

```html
<section id="company-info" class="company-info company-info__variant-a py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <!-- Başlık -->
    <h2 class="text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#1e3a5f] uppercase text-center tracking-tight mb-8">
      COMPANY
    </h2>

    <!-- Verified Supplier Banner -->
    <div class="company-info__verified-banner flex items-center gap-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white px-6 py-3 rounded-t-[var(--radius-md)] text-[13px]">
      <img src="/assets/alibaba-logo-white.svg" alt="Alibaba.com" class="h-5" />
      <span class="font-semibold">Verified Supplier</span>
      <img src="/assets/tuv-logo-white.svg" alt="TÜV Rheinland" class="h-5 ml-auto" />
      <span>{{ seller.verificationDate }}</span>
    </div>

    <!-- İki Sütun İçerik -->
    <div class="company-info__content grid grid-cols-[55%_45%] gap-6 mt-0 lg:grid-cols-1">

      <!-- Sol: Büyük Fabrika Görseli -->
      <div class="company-info__hero-image relative rounded-bl-[var(--radius-md)] overflow-hidden">
        <img :src="company.heroImage" :alt="company.name"
             class="w-full h-[400px] lg:h-[300px] object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h3 class="text-white text-[24px] font-bold">{{ company.heroTitle }}</h3>
          <p class="text-white/80 text-[14px] mt-1">{{ company.heroSubtitle }}</p>
        </div>
      </div>

      <!-- Sağ: Logo + Açıklama -->
      <div class="company-info__description flex flex-col gap-4 py-4">
        <img :src="seller.logo" :alt="seller.name" class="w-[120px] object-contain" />
        <p class="text-[14px] text-[#4b5563] leading-[1.7]">
          {{ company.description }}
        </p>
      </div>

    </div>

    <!-- 3'lü Fabrika Fotoğraf Grid -->
    <div class="company-info__factory-grid grid grid-cols-3 gap-4 mt-6 lg:grid-cols-2 md:grid-cols-1">
      <img v-for="photo in company.factoryPhotos" :key="photo.id"
           :src="photo.image" :alt="photo.caption"
           class="w-full h-[200px] object-cover rounded-[var(--radius-md)]" />
    </div>

  </div>
</section>
```

#### 10.1.2 HTML Yapı Notları (Variant A)

- **Başlık (`<h2>`):** `text-[54px]` desktop'ta, `xl:text-[48px]` (≤1024px), `md:text-[36px]` (≤640px) ile responsive. `font-black` (900 weight), `text-[#1e3a5f]` koyu mavi renk, `uppercase`, `tracking-tight` dar harf aralığı, `text-center` ortalı, `mb-8` (32px) alt boşluk.
- **Verified Banner:** `bg-gradient-to-r from-[#ea580c] to-[#dc2626]` ile turuncu-kırmızı gradient. `flex items-center gap-4` ile yatay hizalı. Sol'da Alibaba.com beyaz logosu, ortada "Verified Supplier" bold beyaz metin, sağ'da TÜV Rheinland logosu + doğrulama tarihi (`ml-auto` ile sağa itilir). `rounded-t-[var(--radius-md)]` ile sadece üst köşeler yuvarlak (8px), alt kenar düz — aşağıdaki iki sütunlu içerikle birleşir. `text-[13px]` kompakt metin boyutu.
- **İki Sütun Grid:** `grid-cols-[55%_45%]` ile sol sütun %55, sağ sütun %45. `mt-0` ile verified banner'a yapışık. `gap-6` (24px) sütunlar arası boşluk. `lg:grid-cols-1` ile tablet altında tek sütuna düşer.
- **Fabrika Hero Görseli:** `h-[400px]` sabit yükseklik (tablet'te `lg:h-[300px]`). `rounded-bl-[var(--radius-md)]` ile sadece sol-alt köşe yuvarlak. Gradient overlay `bg-gradient-to-t from-black/60 to-transparent` alttan yukarıya kararan overlay ile görselin alt kısmında başlık ve alt metin okunabilir hale gelir.
- **Logo + Açıklama:** `flex flex-col gap-4 py-4` ile dikey layout. Logo `w-[120px]` genişliğinde, açıklama metni `text-[14px] text-[#4b5563] leading-[1.7]` ile okunabilir satır yüksekliğinde.
- **Fabrika Grid:** 3 sütunlu grid (`grid-cols-3`), `gap-4` (16px) boşluk. Her fotoğraf `h-[200px] object-cover rounded-[var(--radius-md)]` ile sabit yükseklik ve yuvarlak köşe.

#### 10.1.3 Variant A ASCII Layout (Görsel 5, 8)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                 COMPANY                                      │  ← text-[54px], font-black, #1e3a5f
│                                                                              │     uppercase, tracking-tight, text-center
├──────────────────────────────────────────────────────────────────────────────┤
│  [Alibaba.com logo]  Verified Supplier  ✓       [TÜV logo]  2024-01-15      │  ← bg gradient #ea580c → #dc2626
│                                                                              │     text-white, text-[13px], rounded-t-md
├──────────────────────────────────────────────────────────────────────────────┤
│                         55%                    │            45%               │
│  ┌───────────────────────────────────┐         │  ┌──────────────────┐       │
│  │                                   │         │  │   [CALIN Logo]   │       │  ← w-[120px], object-contain
│  │      [Fabrika Hero Görseli]       │         │  └──────────────────┘       │
│  │                                   │         │                             │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  gap-6 │  Founded in 2004,          │  ← text-[14px], #4b5563
│  │  ▓ Concentration              ▓  │         │  Shenzhen Calinmeter       │     leading-[1.7]
│  │  ▓ Focus on providing tailored▓  │         │  Co., Ltd. is a high-tech  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │         │  enterprise specializing   │
│  └───────────────────────────────────┘         │  in the R&D, manufacturing │
│    h-[400px], object-cover                     │  and sales of smart energy │
│    rounded-bl-md, gradient overlay             │  metering products...      │
│    from-black/60 to-transparent                │                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │              │  │              │  │              │                       │  ← grid-cols-3, gap-4
│  │ [Factory 1]  │  │ [Factory 2]  │  │ [Factory 3]  │                       │     h-[200px], object-cover
│  │              │  │              │  │              │                       │     rounded-[var(--radius-md)]
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 10.1.4 Variant A Renk & Token Tablosu

| Element | Renk / Değer | Token / Not |
|---------|-------------|-------------|
| Section başlık ("COMPANY") | `#1e3a5f` (koyu mavi) | Hardcoded — tüm section başlıklarında ortak |
| Başlık font | `font-black` (900), `text-[54px]` | `uppercase`, `tracking-tight` |
| Verified banner arka plan | gradient `#ea580c → #dc2626` | `bg-gradient-to-r from-[#ea580c] to-[#dc2626]` |
| Verified banner metin | `#ffffff` (beyaz) | `text-white`, `text-[13px]` |
| Banner köşe | Sadece üst köşeler yuvarlak | `rounded-t-[var(--radius-md)]` = 8px |
| Hero görsel yükseklik | 400px (desktop), 300px (tablet) | `h-[400px] lg:h-[300px]` |
| Overlay gradient | alttan yukarı siyah | `bg-gradient-to-t from-black/60 to-transparent` |
| Overlay başlık | beyaz, 24px, bold | `text-white text-[24px] font-bold` |
| Overlay alt metin | beyaz %80, 14px | `text-white/80 text-[14px]` |
| Logo genişliği | 120px | `w-[120px] object-contain` |
| Açıklama metin | `#4b5563` | `var(--color-text-secondary)` |
| Açıklama line-height | 1.7 | `leading-[1.7]`, `text-[14px]` |
| Fabrika grid sütun | 3 sütun | `grid-cols-3` |
| Fabrika fotoğraf yükseklik | 200px | `h-[200px] object-cover` |
| Fabrika fotoğraf köşe | 8px | `rounded-[var(--radius-md)]` |
| Grid boşluk | 16px | `gap-4` |

### 10.2 Variant B — Scrollable Text + Carousel (Haers tarzı)

**Referans: Görsel 18**

> **Not:** Görsel 18 için doğrudan screenshot mevcut değildir. Bu variant spec.md'deki yazılı tanımdan üretilmiştir. Bej arka planlı, scrollable metin + Swiper carousel + lokasyon kartları içerir.

#### 10.2.1 HTML Yapısı

```html
<section id="company-info" class="company-info company-info__variant-b py-12 bg-[#f5f0e8]">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <!-- İki Sütun Layout -->
    <div class="grid grid-cols-[40%_60%] gap-8 lg:grid-cols-1">

      <!-- Sol: Başlık + Scrollable Metin -->
      <div class="company-info__text-panel">
        <h2 class="company-info__title-b text-[28px] font-normal text-[#8b5e3c] mb-6 italic">
          About us
        </h2>
        <div class="company-info__scrollable-text max-h-[300px] overflow-y-auto pr-4 text-[14px] text-[#4b5563] leading-[1.7] scrollbar-thin scrollbar-thumb-[#c4a882] scrollbar-track-[#e8dfd2]">
          {{ company.description }}
        </div>
      </div>

      <!-- Sağ: Fabrika Carousel -->
      <div class="company-info__carousel relative">
        <div class="company-info__carousel-swiper swiper rounded-[var(--radius-md)] overflow-hidden">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="photo in company.carouselPhotos">
              <div class="relative">
                <img :src="photo.image" :alt="photo.caption"
                     class="w-full h-[320px] object-cover" />
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-4 px-6">
                  <p class="text-white text-[14px] font-medium">{{ photo.caption }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Nav Arrows -->
        <button class="company-info__prev absolute left-2 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors">
          <svg class="w-4 h-4 text-[#6b7280]"><!-- left arrow ◀ --></svg>
        </button>
        <button class="company-info__next absolute right-2 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors">
          <svg class="w-4 h-4 text-[#6b7280]"><!-- right arrow ▶ --></svg>
        </button>
      </div>

    </div>

    <!-- 4'lü Lokasyon Kartları -->
    <div class="company-info__locations grid grid-cols-4 gap-3 mt-8 lg:grid-cols-2 md:grid-cols-1">
      <div v-for="loc in company.locations" :key="loc.id"
           class="relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer">
        <img :src="loc.image" :alt="loc.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
          <p class="text-white text-[13px] font-medium">{{ loc.name }}</p>
        </div>
      </div>
    </div>

  </div>
</section>
```

#### 10.2.2 HTML Yapı Notları (Variant B)

- **Section Arka Plan:** `bg-[#f5f0e8]` bej/krem arka plan ile Variant A'dan görsel olarak ayrılır. Bu ton Haers mağazasının sıcak, doğal estetik çizgisine uygundur.
- **İki Sütun Grid:** `grid-cols-[40%_60%]` ile sol sütun %40 (metin paneli), sağ sütun %60 (carousel). `gap-8` (32px) sütunlar arası boşluk. `lg:grid-cols-1` ile tablet altında tek sütuna düşer.
- **Başlık:** `text-[28px] font-normal text-[#8b5e3c] italic` ile Variant A'nın büyük koyu mavi başlığından farklı olarak daha küçük, italik, kahverengi tonunda "About us" başlığı kullanılır. Bu, Haers mağazasının şık ve rahat tasarım diline uyar.
- **Scrollable Metin Alanı:** `max-h-[300px] overflow-y-auto pr-4` ile içerik 300px yüksekliği aştığında dikey scroll aktif olur. `pr-4` (16px) sağ padding ile scrollbar metin üzerine binmez. Tailwind `scrollbar-thin scrollbar-thumb-[#c4a882] scrollbar-track-[#e8dfd2]` ile ince, bej tonlu custom scrollbar sağlanır. Bu sınıflar ek CSS desteği gerektirir (bkz. 10.2.3).
- **Carousel:** Swiper.js ile loop modunda çalışan fabrika fotoğraf carousel'i. Her slide'da `h-[320px]` yüksekliğinde görsel + alttan yukarı gradient overlay + beyaz caption metni. `rounded-[var(--radius-md)]` ile yuvarlak köşeler. Navigation butonları sol/sağda konumlanır.
- **Navigation Butonları:** `absolute left-2 / right-2 top-1/2 -translate-y-1/2` ile carousel'in dikey ortasına sabitlenir. `bg-[#e5e5e5] hover:bg-[#d1d5db]` ile gri arka plan, hover'da koyu gri. `w-8 h-12` dikdörtgen şekil, `rounded-sm` hafif yuvarlak köşe.
- **Lokasyon Kartları:** `grid-cols-4 gap-3 mt-8` ile 4 sütunlu grid, 12px boşluk. Her kart `aspect-[4/3]` sabit oran, `rounded-[var(--radius-md)]` köşe, `overflow-hidden` ile görsel kırpma. Hover'da `group-hover:scale-105` ile %5 zoom efekti. Alt kısımda `bg-gradient-to-t from-black/70` koyu overlay + beyaz lokasyon metni.

#### 10.2.3 Scrollbar Custom CSS

Variant B'deki scrollable metin alanı için özelleştirilmiş scrollbar stillemesi. Bu CSS `src/styles/seller/seller-storefront.css` dosyasına eklenir.

```css
/* Company Info Variant B — Custom Scrollbar */
.company-info__scrollable-text::-webkit-scrollbar {
  width: 6px;
}
.company-info__scrollable-text::-webkit-scrollbar-thumb {
  background: #c4a882;
  border-radius: 3px;
}
.company-info__scrollable-text::-webkit-scrollbar-track {
  background: #e8dfd2;
}

/* Firefox desteği */
.company-info__scrollable-text {
  scrollbar-width: thin;
  scrollbar-color: #c4a882 #e8dfd2;
}
```

| CSS Property | Değer | Açıklama |
|-------------|-------|----------|
| Scrollbar genişlik | `6px` | İnce scrollbar — standart browser scrollbar'ından dar |
| Thumb (kaydırıcı) rengi | `#c4a882` | Bej/altın tonunda — section arka planıyla uyumlu |
| Thumb border-radius | `3px` | Yuvarlak kaydırıcı ucu |
| Track (ray) rengi | `#e8dfd2` | Açık bej — section bg (`#f5f0e8`) ile uyumlu |
| Firefox scrollbar-width | `thin` | Firefox'ta ince scrollbar |
| Firefox scrollbar-color | `#c4a882 #e8dfd2` | Thumb + track renkleri (Firefox) |

#### 10.2.4 Variant B ASCII Layout (Görsel 18)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  bg-[#f5f0e8] (bej arka plan)                                                │
│                                                                              │
│         40%                          │              60%                       │
│  ┌──────────────────────────┐        │  ┌──────────────────────────────────┐  │
│  │                          │        │  │                                  │  │
│  │  About us                │        │  │    [Fabrika Carousel Görseli]    │  │
│  │  (italic, #8b5e3c)      │  gap-8 │  │                                  │  │
│  │                          │        │  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  │  ┌──────────────────┐ ▲  │        │  │  ▓ Smart Innovation Park    ▓  │  │  ← caption, text-white
│  │  │ Founded in 2004, │ █  │        │  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │     text-[14px], font-medium
│  │  │ Zhejiang Haers   │ █  │        │  │◀│                            │▶│  │  │
│  │  │ Vacuum Containers│ █  │        │  └──────────────────────────────────┘  │
│  │  │ Co., Ltd. is a   │ ║  │ 6px    │    h-[320px], object-cover            │
│  │  │ leading...       │ ║  │ scroll │    rounded-[var(--radius-md)]          │
│  │  │                  │ ║  │ bar    │    Swiper loop: true, speed: 500       │
│  │  │ max-h: 300px     │ ▼  │        │                                       │
│  │  └──────────────────┘    │        │                                       │
│  └──────────────────────────┘        │                                       │
│                                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐                 │
│  │           │  │           │  │           │  │           │                 │
│  │ [Loc 1]   │  │ [Loc 2]   │  │ [Loc 3]   │  │ [Loc 4]   │                 │  ← grid-cols-4, gap-3
│  │  ▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓  │                 │     aspect-[4/3]
│  │  ▓Yongk.▓ │  │  ▓Linan ▓ │  │  ▓Thai. ▓ │  │  ▓Anhui ▓ │                 │     hover:scale-105
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 10.2.5 Variant B Renk & Token Tablosu

| Element | Renk / Değer | Token / Not |
|---------|-------------|-------------|
| Section arka plan | `#f5f0e8` (bej/krem) | Hardcoded — Haers estetik tonu |
| Başlık ("About us") | `#8b5e3c` (kahverengi) | `font-normal`, `italic`, `text-[28px]` |
| Açıklama metin | `#4b5563` | `var(--color-text-secondary)` |
| Scrollable alan max-height | 300px | `max-h-[300px] overflow-y-auto` |
| Scrollbar thumb | `#c4a882` (bej-altın) | Custom CSS `::-webkit-scrollbar-thumb` |
| Scrollbar track | `#e8dfd2` (açık bej) | Custom CSS `::-webkit-scrollbar-track` |
| Scrollbar genişlik | 6px | `::-webkit-scrollbar { width: 6px }` |
| Carousel yükseklik | 320px | `h-[320px] object-cover` |
| Carousel köşe | 8px | `rounded-[var(--radius-md)]` |
| Caption overlay | alttan yukarı siyah | `bg-gradient-to-t from-black/70 to-transparent` |
| Caption metin | beyaz, 14px, medium | `text-white text-[14px] font-medium` |
| Nav buton bg | `#e5e5e5` | `hover:bg-[#d1d5db]`, `transition-colors` |
| Nav buton ok | `#6b7280` | `text-[#6b7280]`, `w-4 h-4` |
| Nav buton boyut | 32×48px | `w-8 h-12`, `rounded-sm` |
| Grid sütun (layout) | 40% / 60% | `grid-cols-[40%_60%]` |
| Grid boşluk (layout) | 32px | `gap-8` |

#### 10.2.6 Swiper.js Konfigürasyonu (Variant B Carousel)

```typescript
// src/components/seller/CompanyInfo.ts — Variant B Carousel

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export function initCompanyCarousel(): Swiper {
  return new Swiper('.company-info__carousel-swiper', {
    modules: [Navigation],
    loop: true,
    speed: 500,
    navigation: {
      nextEl: '.company-info__next',
      prevEl: '.company-info__prev',
    },
  });
}
```

**Swiper Konfigürasyon Detayları:**

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| `modules` | `[Navigation]` | Yalnızca Navigation modülü — Pagination yok |
| `loop` | `true` | Sonsuz döngü — son slide'dan sonra ilk slide'a geçer |
| `speed` | `500` | Geçiş animasyonu süresi (ms) |
| `nextEl` | `.company-info__next` | Sonraki slide butonu seçicisi |
| `prevEl` | `.company-info__prev` | Önceki slide butonu seçicisi |

> **Not:** Variant B carousel'i yalnızca Navigation modülü kullanır (Pagination yok). Bu, C3 Hero Banner carousel'inden farklıdır — hero'da hem Pagination hem Autoplay vardır. Company info carousel'inde kullanıcı manuel olarak gezinir (autoplay yok).

### 10.3 Lokasyon Kartları (Variant B)

Lokasyon kartları, Variant B'nin alt kısmında 4 sütunlu grid halinde gösterilir. Her kart, lokasyon fotoğrafı üzerine koyu gradient overlay ve beyaz metin içerir.

#### 10.3.1 Tekil Lokasyon Kartı HTML

```html
<!-- Tekil Lokasyon Kartı -->
<div class="company-info__location-card relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer">
  <!-- Arka Plan Görseli -->
  <img :src="loc.image" :alt="loc.name"
       class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
  <!-- Koyu Gradient Overlay + Lokasyon Metni -->
  <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
    <p class="text-white text-[13px] font-medium">{{ loc.name }}</p>
  </div>
</div>
```

#### 10.3.2 Lokasyon Kartı Spesifikasyonları

| Element | Değer | Açıklama |
|---------|-------|----------|
| Grid | 4 sütun (desktop), 2 (tablet), 1 (mobile) | `grid-cols-4 lg:grid-cols-2 md:grid-cols-1` |
| Grid boşluk | 12px | `gap-3` |
| Grid üst boşluk | 32px | `mt-8` |
| Aspect ratio | 4:3 | `aspect-[4/3]` — genişlik/yükseklik oranı sabit |
| Border radius | `var(--radius-md)` = 8px | `rounded-[var(--radius-md)]` |
| Overflow | hidden | Görsel ve hover efekti kart sınırı içinde kalır |
| Cursor | pointer | `cursor-pointer` — tıklanabilir görünüm |
| Overlay gradient | `bg-gradient-to-t from-black/70 to-transparent` | Alt kısımda %70 siyah, yukarı doğru şeffaflaşır |
| Overlay padding | `py-3 px-4` (12px dikey, 16px yatay) | Metin etrafında boşluk |
| Lokasyon metin rengi | Beyaz (`#ffffff`) | `text-white` |
| Lokasyon metin boyutu | 13px | `text-[13px]` |
| Lokasyon metin ağırlığı | medium (500) | `font-medium` |
| Hover efekti | `scale(1.05)` | `group-hover:scale-105` — %5 zoom |
| Hover transition | 300ms | `transition-transform duration-300` |

#### 10.3.3 Lokasyon Kartı ASCII Layout

```
┌──────────────────────┐
│                      │
│   [Lokasyon Fotoğrafı]│  ← w-full h-full, object-cover
│                      │     aspect-[4/3]
│                      │     hover: scale-105 (300ms)
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ▓ In Yongkang,     ▓│  ← bg-gradient-to-t from-black/70
│  ▓ China             ▓│     text-white, text-[13px], font-medium
└──────────────────────┘
  rounded-[var(--radius-md)] = 8px
  overflow-hidden
  cursor-pointer
```

### 10.4 Data Interface (TypeScript)

```typescript
// src/types/seller/types.ts — C7 Company Info

interface FactoryPhoto {
  id: string;
  image: string;
  caption: string;
}

interface CarouselPhoto {
  id: string;
  image: string;
  caption: string;
}

interface Location {
  id: string;
  name: string;
  image: string;
}

interface CompanyInfo {
  /** Variant A: Büyük fabrika hero görseli */
  heroImage: string;
  /** Variant A: Hero overlay başlık */
  heroTitle: string;
  /** Variant A: Hero overlay alt metin */
  heroSubtitle: string;
  /** Her iki variant: Şirket açıklama metni */
  description: string;
  /** Variant A: 3'lü fabrika fotoğraf grid */
  factoryPhotos: FactoryPhoto[];
  /** Variant B: Swiper carousel fotoğrafları */
  carouselPhotos: CarouselPhoto[];
  /** Variant B: 4'lü lokasyon kartları */
  locations: Location[];
}
```

### 10.5 Mock Data Örneği

```json
{
  "company": {
    "heroImage": "/assets/mock/factory-hero.jpg",
    "heroTitle": "Concentration",
    "heroSubtitle": "Focus on providing tailored metering solutions for 20+ years",
    "description": "Founded in 2004, Shenzhen Calinmeter Co., Ltd. is a high-tech enterprise specializing in the R&D, manufacturing, and sales of smart energy metering products. With over 500 employees and a 30,000 sqm manufacturing facility, we deliver innovative prepaid electricity meters, water meters, and gas meters to customers in more than 60 countries worldwide. Our ISO 9001 certified production line ensures consistent quality and reliability. We are committed to providing customized OEM/ODM solutions that meet international standards including IEC, ANSI, and BS.",
    "factoryPhotos": [
      { "id": "fp-1", "image": "/assets/mock/factory-1.jpg", "caption": "Production Line" },
      { "id": "fp-2", "image": "/assets/mock/factory-2.jpg", "caption": "Quality Testing Lab" },
      { "id": "fp-3", "image": "/assets/mock/factory-3.jpg", "caption": "Assembly Workshop" }
    ],
    "carouselPhotos": [
      { "id": "cp-1", "image": "/assets/mock/carousel-1.jpg", "caption": "Smart Innovation Park" },
      { "id": "cp-2", "image": "/assets/mock/carousel-2.jpg", "caption": "Automated Production" },
      { "id": "cp-3", "image": "/assets/mock/carousel-3.jpg", "caption": "R&D Center" }
    ],
    "locations": [
      { "id": "loc-1", "name": "In Yongkang, China", "image": "/assets/mock/loc-yongkang.jpg" },
      { "id": "loc-2", "name": "In Linan, China", "image": "/assets/mock/loc-linan.jpg" },
      { "id": "loc-3", "name": "In Thailand", "image": "/assets/mock/loc-thailand.jpg" },
      { "id": "loc-4", "name": "In Anhui, China", "image": "/assets/mock/loc-anhui.jpg" }
    ]
  }
}
```

### 10.6 Tailwind / CSS Sınıfları (Tüm Varyantlar)

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Section (Variant A) | `company-info__variant-a` | `py-12` | 48px dikey padding, şeffaf bg |
| Section (Variant B) | `company-info__variant-b` | `py-12 bg-[#f5f0e8]` | 48px dikey padding, bej bg |
| İç container | — | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Başlık (Variant A) | — | `text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#1e3a5f] uppercase text-center tracking-tight mb-8` | Büyük koyu mavi başlık |
| Başlık (Variant B) | `company-info__title-b` | `text-[28px] font-normal text-[#8b5e3c] mb-6 italic` | Küçük kahverengi italic başlık |
| Verified banner | `company-info__verified-banner` | `flex items-center gap-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white px-6 py-3 rounded-t-[var(--radius-md)] text-[13px]` | Turuncu-kırmızı gradient banner |
| Content grid (A) | `company-info__content` | `grid grid-cols-[55%_45%] gap-6 mt-0 lg:grid-cols-1` | 55/45 iki sütun |
| Content grid (B) | — | `grid grid-cols-[40%_60%] gap-8 lg:grid-cols-1` | 40/60 iki sütun |
| Hero image wrapper (A) | `company-info__hero-image` | `relative rounded-bl-[var(--radius-md)] overflow-hidden` | Sol-alt köşe yuvarlak |
| Hero image (A) | — | `w-full h-[400px] lg:h-[300px] object-cover` | Sabit yükseklik, kırpma |
| Gradient overlay (A) | — | `absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6` | Alt kısım karartma |
| Description panel (A) | `company-info__description` | `flex flex-col gap-4 py-4` | Logo + açıklama dikey layout |
| Logo (A) | — | `w-[120px] object-contain` | Sabit genişlik logo |
| Description text | — | `text-[14px] text-[#4b5563] leading-[1.7]` | Okunabilir paragraf |
| Text panel (B) | `company-info__text-panel` | — | Sol metin paneli wrapper |
| Scrollable text (B) | `company-info__scrollable-text` | `max-h-[300px] overflow-y-auto pr-4 text-[14px] text-[#4b5563] leading-[1.7]` | Scrollable metin alanı |
| Carousel wrapper (B) | `company-info__carousel` | `relative` | Carousel + nav butonları sarmalayıcı |
| Swiper container (B) | `company-info__carousel-swiper` | `swiper rounded-[var(--radius-md)] overflow-hidden` | Swiper kök element |
| Carousel image (B) | — | `w-full h-[320px] object-cover` | Slide görsel boyutu |
| Carousel caption overlay (B) | — | `absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-4 px-6` | Alt caption alanı |
| Nav buton (prev/next) | `company-info__prev / __next` | `absolute left-2/right-2 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors` | Carousel gezinme butonları |
| Factory grid (A) | `company-info__factory-grid` | `grid grid-cols-3 gap-4 mt-6 lg:grid-cols-2 md:grid-cols-1` | 3'lü fabrika fotoğraf |
| Factory photo (A) | — | `w-full h-[200px] object-cover rounded-[var(--radius-md)]` | Fabrika görseli |
| Location grid (B) | `company-info__locations` | `grid grid-cols-4 gap-3 mt-8 lg:grid-cols-2 md:grid-cols-1` | 4'lü lokasyon kartları |
| Location card (B) | — | `relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer` | Tekil lokasyon kartı |
| Location image (B) | — | `w-full h-full object-cover transition-transform duration-300 group-hover:scale-105` | Hover zoom efekti |
| Location overlay (B) | — | `absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4` | Koyu gradient overlay |
| Location text (B) | — | `text-white text-[13px] font-medium` | Beyaz lokasyon metni |

### 10.7 Responsive

| Breakpoint | Variant A | Variant B |
|------------|-----------|-----------|
| **Desktop (>1024px)** | 2 sütun (55/45), 3'lü fabrika grid, hero h-400px | 2 sütun (40/60), 4'lü lokasyon grid, carousel h-320px |
| **Tablet (768–1024px)** | Tek sütun stack, 2'li fabrika grid (`lg:grid-cols-2`), hero h-300px (`lg:h-[300px]`) | Tek sütun stack, 2'li lokasyon grid (`lg:grid-cols-2`) |
| **Mobile (<768px)** | Tek sütun, 1'li fabrika grid (`md:grid-cols-1`) | Tek sütun, 1'li lokasyon grid (`md:grid-cols-1`) |

**Responsive Davranış Detayları:**

| Özellik | Desktop (>1024px) | Tablet (768–1024px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Variant A başlık | `text-[54px]` | `xl:text-[48px]` | `md:text-[36px]` |
| Variant A grid | `grid-cols-[55%_45%]` | `lg:grid-cols-1` (stack) | `lg:grid-cols-1` (stack) |
| Variant A hero height | `h-[400px]` | `lg:h-[300px]` | `lg:h-[300px]` |
| Variant A factory grid | `grid-cols-3` | `lg:grid-cols-2` | `md:grid-cols-1` |
| Variant B grid | `grid-cols-[40%_60%]` | `lg:grid-cols-1` (stack) | `lg:grid-cols-1` (stack) |
| Variant B location grid | `grid-cols-4` | `lg:grid-cols-2` | `md:grid-cols-1` |

> **TailwindCSS v4 responsive notu:** Her iki varyant da `lg:` breakpoint'inde iki sütundan tek sütuna geçer. Bu sayede metin ve görsel alanları dikey olarak üst üste yığılır. Variant A'da fabrika fotoğraf grid'i 3 → 2 → 1, Variant B'de lokasyon kartları 4 → 2 → 1 şeklinde kademeli olarak azalır.

### 10.8 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Carousel next tıklama** (B) | `.company-info__next` | `click` | Sonraki slide'a geçer | Swiper Navigation — loop mode, `speed: 500` |
| 2 | **Carousel prev tıklama** (B) | `.company-info__prev` | `click` | Önceki slide'a geçer | Swiper Navigation — loop mode |
| 3 | **Lokasyon kartı hover** (B) | `.company-info__locations > div` | `mouseenter` | Görsel `scale(1.05)` zoom efekti | Pure CSS — `group-hover:scale-105 transition-transform duration-300` |
| 4 | **Lokasyon kartı hover çıkış** (B) | `.company-info__locations > div` | `mouseleave` | Görsel `scale(1.0)` normal boyut | CSS transition geri dönüşü |
| 5 | **Lokasyon kartı tıklama** (B) | `.company-info__locations > div` | `click` | Opsiyonel — lokasyon detay sayfasına yönlendirme | Gelecek implementasyon; şu an statik `cursor-pointer` |
| 6 | **Scrollable alan kaydırma** (B) | `.company-info__scrollable-text` | `scroll` | İçerik dikey olarak kayar, custom scrollbar görünür | Native scroll — `overflow-y: auto`, custom scrollbar CSS |
| 7 | **Nav buton hover** (B) | `.company-info__prev / __next` | `mouseenter` | Arka plan `#e5e5e5` → `#d1d5db` koyulaşır | Pure CSS — `hover:bg-[#d1d5db] transition-colors` |
| 8 | **Keyboard focus** (B) | `.company-info__prev / __next` | `focus` | Buton `ring-2 ring-[#6b7280] ring-offset-2` outline alır | Erişilebilirlik — tab ile navigasyon |

> **Not:** C7 Company Info bileşeninin Variant A'sı tamamen statik bir layout'tur — JavaScript etkileşimi gerektirmez. Variant B'de Swiper.js carousel gezinme ve native scroll davranışı aktiftir. Lokasyon kartlarının hover zoom efekti pure CSS ile yönetilir.

### 10.9 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Nav buton (prev/next) | `bg-[#e5e5e5]` | `bg-[#d1d5db]` | `ring-2 ring-[#6b7280] ring-offset-2` | `bg-[#c4c4c4]` |
| Nav buton ok ikonu | `text-[#6b7280]` | `text-[#4b5563]` | — | — |
| Lokasyon kartı görseli | `scale-100` | `scale-105` | — | — |
| Lokasyon kartı overlay | Sabit gradient | Sabit gradient | — | — |
| Fabrika fotoğraf (A) | `opacity-100` | Opsiyonel `opacity-90` | — | — |
| Scrollbar thumb (B) | `#c4a882` | Opsiyonel `#b89970` (koyu) | — | — |

### 10.10 Dark Mode Notları

C7 Company Info dark mode'da arka plan, metin renkleri ve overlay'lerde değişiklik gerektirir. Her iki varyant için ayrı dark mode ayarları:

**Variant A Dark Mode:**

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent | Transparent | Değişmez |
| Başlık ("COMPANY") | `#1e3a5f` | `#93c5fd` (açık mavi) | `dark:text-blue-300` |
| Verified banner | Gradient (turuncu→kırmızı) | Gradient (değişmez) | Sabit — gradient korunur |
| Açıklama metin | `#4b5563` | `#d1d5db` | `dark:text-gray-300` |
| Hero overlay | `from-black/60` | `from-black/70` | `dark:from-black/70` |
| Fabrika fotoğraf radius | `var(--radius-md)` | Aynı | Değişmez |

**Variant B Dark Mode:**

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | `#f5f0e8` (bej) | `#1f2937` (gray-800) | `dark:bg-gray-800` |
| Başlık ("About us") | `#8b5e3c` (kahverengi) | `#d4a76a` (açık kahverengi) | `dark:text-[#d4a76a]` |
| Açıklama metin | `#4b5563` | `#d1d5db` | `dark:text-gray-300` |
| Scrollbar thumb | `#c4a882` | `#8b7355` | Dark mode CSS — `:root.dark .company-info__scrollable-text` |
| Scrollbar track | `#e8dfd2` | `#374151` | Dark mode CSS |
| Nav buton bg | `#e5e5e5` | `#374151` | `dark:bg-gray-700` |
| Nav buton hover bg | `#d1d5db` | `#4b5563` | `dark:hover:bg-gray-600` |
| Nav buton ok | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| Lokasyon overlay | `from-black/70` | `from-black/80` | `dark:from-black/80` |
| Lokasyon metin | Beyaz | Beyaz | Sabit — değişmez |

> **Genel Not:** Variant A'daki verified supplier banner gradient her iki modda da sabit kalır — turuncu-kırmızı gradient koyu arka plan üzerinde de okunaklıdır. Variant B'nin bej arka planı dark mode'da koyu griye döner. Lokasyon kartlarındaki beyaz metin + koyu overlay her iki temada okunabilir. Scrollbar renkleri dark mode'da ayrı CSS kuralıyla yönetilmelidir.

---

## 11. Component 8: Certificates Carousel (C8)

> **Dosya:** `src/components/seller/Certificates.ts`
> **BEM Block:** `certificates`
> **Referans Görseller:** Görsel 6 (Calin — sertifika kartları carousel), Görsel 19 (Haers — certificates bölümü alt kısımda görünür)
> **Durum:** ⚪ Opsiyonel — Satıcının sertifika verisi mevcutsa gösterilir.

Certificates Carousel, satıcının kalite ve uyumluluk sertifikalarını (ISO, CE, TÜV vb.) yatay bir Swiper.js carousel'inde sergileyen opsiyonel bir bileşendir. Koyu mavi "CERTIFICATES" başlığı altında 4 sütunlu (desktop) sertifika kartları yer alır. Her kart beyaz arka plan, ince border ve hafif gölge ile çerçevelenmiş dikey (portrait) bir sertifika görselinden oluşur. Sol ve sağ kenarlarında gri navigasyon okları, altta turuncu/gri nokta pagination bulunur. Swiper breakpoint'leri ile responsive olarak 4 → 3 → 2 → 1 slide gösterilir.

### 11.1 Swiper Yapısı + Konfigürasyon

#### 11.1.1 HTML Yapısı

```html
<section id="certificates" class="certificates py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <h2 class="certificates__title text-[28px] font-bold text-[#1e3a5f] uppercase text-center mb-8">
      CERTIFICATES
    </h2>

    <div class="certificates__wrapper relative">
      <div class="certificates__swiper swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="cert in certificates">
            <div class="certificates__card bg-white border border-[var(--card-border-color)] shadow-sm rounded-[var(--radius-md)] p-2 flex items-center justify-center">
              <img :src="cert.image" :alt="cert.name"
                   class="w-full aspect-[3/4] object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button class="certificates__prev absolute -left-4 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors"
              aria-label="Önceki sertifika">
        <svg class="w-4 h-4 text-[#6b7280]"><!-- left arrow ◀ --></svg>
      </button>
      <button class="certificates__next absolute -right-4 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors"
              aria-label="Sonraki sertifika">
        <svg class="w-4 h-4 text-[#6b7280]"><!-- right arrow ▶ --></svg>
      </button>

      <!-- Dot Pagination -->
      <div class="certificates__dots swiper-pagination flex justify-center gap-2 mt-6"></div>
    </div>

  </div>
</section>
```

#### 11.1.2 HTML Yapı Notları

- **Section:** `py-12` (48px) dikey padding. `id="certificates"` ile store navigation bar (C2) anchor hedefi olarak kullanılabilir.
- **Başlık (`<h2>`):** `text-[28px]` orta büyüklükte, `font-bold` (700 weight), `text-[#1e3a5f]` koyu mavi renk (section başlık rengi), `uppercase`, `text-center` ortalı, `mb-8` (32px) alt boşluk.
- **Swiper Container:** `.certificates__swiper` sınıfı ile Swiper.js bağlanır. `swiper-wrapper` içindeki `swiper-slide`'lar sertifika kartlarını barındırır.
- **Navigation Arrows:** Absolute positioned, Swiper container'ın sol/sağ kenarlarının 16px dışında (`-left-4`, `-right-4`). `w-8 h-12` (32×48px) boyutunda, `bg-[#e5e5e5]` gri arka plan, `hover:bg-[#d1d5db]` hover'da koyu gri. `z-10` ile slide'ların üzerinde görünür.
- **Dot Pagination:** `.swiper-pagination` Swiper.js tarafından otomatik doldurulur. `flex justify-center gap-2 mt-6` ile ortalanmış, 8px boşluklu, 24px üst margin.

#### 11.1.3 Swiper JavaScript Konfigürasyonu

```typescript
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export function initCertificatesSwiper(): Swiper {
  return new Swiper('.certificates__swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 4,
    spaceBetween: 16,
    loop: false,
    navigation: {
      nextEl: '.certificates__next',
      prevEl: '.certificates__prev',
    },
    pagination: {
      el: '.certificates__dots',
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 8 },
      480: { slidesPerView: 2, spaceBetween: 12 },
      768: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 4, spaceBetween: 16 },
    },
  });
}
```

**Swiper Konfigürasyon Tablosu:**

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| `slidesPerView` | 4 (desktop) | Aynı anda görünür slide sayısı |
| `spaceBetween` | 16px | Slide'lar arası boşluk |
| `loop` | `false` | Sonsuz döngü kapalı — başa/sona gelince ok disabled olur |
| `navigation.nextEl` | `.certificates__next` | İleri ok butonu seçicisi |
| `navigation.prevEl` | `.certificates__prev` | Geri ok butonu seçicisi |
| `pagination.el` | `.certificates__dots` | Dot pagination container seçicisi |
| `pagination.clickable` | `true` | Dot'lara tıklayarak slide'a atlama aktif |

#### 11.1.4 ASCII Layout (Görsel 6, 19)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CERTIFICATES                                    │  ← text-[28px], font-bold, #1e3a5f
│                                                                              │     uppercase, text-center
├──────────────────────────────────────────────────────────────────────────────┤
│      ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│      │          │  │          │  │          │  │          │                │
│      │ [Cert 1] │  │ [Cert 2] │  │ [Cert 3] │  │ [Cert 4] │                │
│  ◀  │   3:4    │  │   3:4    │  │   3:4    │  │   3:4    │  ▶            │
│      │ portrait │  │ portrait │  │ portrait │  │ portrait │                │
│      │          │  │          │  │          │  │          │                │
│      └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
│  ←prev                16px gap                              next→          │
│  32×48px                                                    32×48px         │
│  bg #e5e5e5                                                 bg #e5e5e5      │
│                                                                              │
│                         ● ● ○ ○ ○                                           │  ← dot pagination
│                     active: #f97316                                          │     inactive: #d1d5db
│                      size: 8×8px                                             │     rounded-full
└──────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Sertifika Kartı

**Kart Yapısı Detay:**

| Element | Değer | Token / Not |
|---------|-------|-------------|
| Arka plan | `#ffffff` (beyaz) | `var(--card-bg)` |
| Border | `1px solid #e5e5e5` | `var(--card-border-color)` |
| Shadow | `shadow-sm` | `var(--shadow-sm)` = `0 1px 2px rgba(0,0,0,0.05)` |
| Padding | 8px | `p-2` |
| Border-radius | 8px | `var(--radius-md)` |
| Görsel aspect ratio | 3:4 (portrait) | `aspect-[3/4]` — sertifikalar dikey formatta |
| Object-fit | `contain` | Sertifika görseli kırpılmadan tam gösterilir |
| Display | `flex items-center justify-center` | Görsel kartın ortasında hizalanır |

**Data Interface:**

```typescript
interface Certificate {
  id: string;
  name: string;
  image: string;
}
```

**Mock Data Örneği (6 sertifika):**

```json
{
  "certificates": [
    { "id": "cert-1", "name": "ISO 9001:2015 Quality Management System", "image": "/assets/mock/cert-iso9001.jpg" },
    { "id": "cert-2", "name": "ISO 14001:2015 Environmental Management", "image": "/assets/mock/cert-iso14001.jpg" },
    { "id": "cert-3", "name": "CE Certificate of Conformity", "image": "/assets/mock/cert-ce.jpg" },
    { "id": "cert-4", "name": "SGS Inspection Report", "image": "/assets/mock/cert-sgs.jpg" },
    { "id": "cert-5", "name": "TÜV Rheinland Product Safety", "image": "/assets/mock/cert-tuv.jpg" },
    { "id": "cert-6", "name": "RoHS Compliance Certificate", "image": "/assets/mock/cert-rohs.jpg" }
  ]
}
```

### 11.3 Navigation Arrows CSS + Dots

**Arrows (Prev/Next Butonları):**

| Özellik | Değer | CSS/Tailwind |
|---------|-------|-------------|
| Width | 32px | `w-8` |
| Height | 48px | `h-12` |
| Background (normal) | `#e5e5e5` | `bg-[#e5e5e5]` |
| Background (hover) | `#d1d5db` | `hover:bg-[#d1d5db]` |
| Icon color | `#6b7280` | `text-[#6b7280]` |
| Icon size | 16px × 16px | `w-4 h-4` |
| Border-radius | 4px | `rounded-sm` = `var(--radius-sm)` |
| Position | Absolute, sol/sağ kenar dışı, dikey ortalı | `-left-4` / `-right-4`, `top-1/2 -translate-y-1/2` |
| Z-index | 10 | `z-10` — slide'ların üzerinde |
| Transition | Renk geçişi | `transition-colors` |

**Custom CSS (seller-storefront.css):**

```css
/* Certificates Navigation Arrows */
.certificates__prev,
.certificates__next {
  width: 32px;
  height: 48px;
  background: #e5e5e5;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: background-color 0.2s ease;
}

.certificates__prev { left: -16px; }
.certificates__next { right: -16px; }

.certificates__prev:hover,
.certificates__next:hover {
  background: #d1d5db;
}

/* Swiper disabled state */
.certificates__prev.swiper-button-disabled,
.certificates__next.swiper-button-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Dots (Nokta Pagination):**

| Özellik | Değer | CSS/Tailwind |
|---------|-------|-------------|
| Active renk | `#f97316` (turuncu) | `--store-accent` |
| Inactive renk | `#d1d5db` (açık gri) | `--color-border-strong` |
| Boyut | 8px × 8px | Custom CSS |
| Border-radius | `rounded-full` | Tam yuvarlak |
| Gap | 8px | `gap-2` |
| Margin-top | 24px | `mt-6` |

**Custom CSS (Dots):**

```css
/* Certificates Dot Pagination */
.certificates__dots .swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #d1d5db;
  opacity: 1;
  transition: background-color 0.2s ease;
}

.certificates__dots .swiper-pagination-bullet-active {
  background: #f97316;
}
```

### 11.4 Tailwind / CSS Sınıfları

| Element | Classes | Açıklama |
|---------|---------|----------|
| Section | `py-12` | 48px dikey padding |
| İç container | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Başlık | `text-[28px] font-bold text-[#1e3a5f] uppercase text-center mb-8` | Koyu mavi, ortalı başlık |
| Wrapper | `relative` | Navigation arrow'lar için positioning context |
| Kart | `bg-white border border-[var(--card-border-color)] shadow-sm rounded-[var(--radius-md)] p-2 flex items-center justify-center` | Beyaz kart, ince border, hafif gölge |
| Görsel | `w-full aspect-[3/4] object-contain` | Portrait format, oran korunur |
| Prev buton | `absolute -left-4 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors` | Sol ok butonu |
| Next buton | `absolute -right-4 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors` | Sağ ok butonu |
| Ok ikonu | `w-4 h-4 text-[#6b7280]` | Gri ok ikonu |
| Dots container | `swiper-pagination flex justify-center gap-2 mt-6` | Ortalanmış dot pagination |

### 11.5 Responsive

| Breakpoint | Slides Per View | Space Between | Arrows | Dots |
|------------|----------------|---------------|--------|------|
| Desktop (>1024px) | 4 | 16px | Görünür | Görünür |
| Tablet (768–1024px) | 3 | 16px | Görünür | Görünür |
| Small Tablet (480–768px) | 2 | 12px | Görünür | Görünür |
| Mobile (<480px) | 1 | 8px | Gizli (opsiyonel) | Görünür |

> **TailwindCSS v4 responsive notu:** Swiper breakpoint'leri Swiper.js tarafından yönetilir (CSS breakpoint'leri değil, JavaScript breakpoint'leri). `slidesPerView` değeri ekran genişliğine göre `4 → 3 → 2 → 1` kademeli olarak azalır. `spaceBetween` değeri de küçük ekranlarda azaltılır. Mobile'da ok butonları kart görsellerine binebileceğinden gizlenebilir veya küçültülebilir.

### 11.6 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Next ok tıklama** | `.certificates__next` | `click` | Sonraki slide grubuna geçer | Swiper Navigation — `loop: false`, son slide'dayken disabled |
| 2 | **Prev ok tıklama** | `.certificates__prev` | `click` | Önceki slide grubuna geçer | Swiper Navigation — ilk slide'dayken disabled |
| 3 | **Dot tıklama** | `.swiper-pagination-bullet` | `click` | Tıklanan dot'un temsil ettiği slide'a atlar | Swiper Pagination — `clickable: true` |
| 4 | **Touch swipe** | `.certificates__swiper` | `touchmove` | Parmak kaydırma ile slide geçişi | Swiper built-in — mobilde birincil navigasyon yöntemi |
| 5 | **Ok hover** | `.certificates__prev / __next` | `mouseenter` | Arka plan `#e5e5e5` → `#d1d5db` | Pure CSS — `hover:bg-[#d1d5db] transition-colors` |
| 6 | **Keyboard focus** | `.certificates__prev / __next` | `focus` | `ring-2 ring-[#6b7280] ring-offset-2` outline | Erişilebilirlik — tab ile navigasyon |

> **Not:** C8 Certificates bileşeninin carousel davranışı Swiper.js tarafından yönetilir. `loop: false` nedeniyle ilk/son slide'da ok butonları disabled olur (`.swiper-button-disabled` class'ı eklenir). Dot pagination tıklanabilir olduğundan doğrudan slide navigasyonu mümkündür.

### 11.7 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Nav buton (prev/next) | `bg-[#e5e5e5]` | `bg-[#d1d5db]` | `ring-2 ring-[#6b7280] ring-offset-2` | `bg-[#c4c4c4]` |
| Nav buton ok ikonu | `text-[#6b7280]` | `text-[#4b5563]` | — | — |
| Sertifika kartı | `shadow-sm` | `shadow-md` (opsiyonel) | — | — |
| Dot (inactive) | `bg-[#d1d5db]` | `bg-[#9ca3af]` (opsiyonel) | — | — |
| Dot (active) | `bg-[#f97316]` | — | — | — |
| Nav buton (disabled) | `opacity-0.4, cursor-not-allowed` | — | — | — |

### 11.8 Dark Mode Notları

C8 Certificates dark mode'da kart arka plan, border ve pagination renklerinde değişiklik gerektirir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent | Transparent | Değişmez |
| Başlık rengi | `#1e3a5f` (koyu mavi) | `#93c5fd` (açık mavi) | `dark:text-blue-300` |
| Kart bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Kart border | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| Kart shadow | `shadow-sm` | `shadow-sm` | Değişmez |
| Nav buton bg | `#e5e5e5` | `#374151` | `dark:bg-gray-700` |
| Nav buton hover bg | `#d1d5db` | `#4b5563` | `dark:hover:bg-gray-600` |
| Dot active | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Dot inactive | `#d1d5db` | `#4b5563` | Dark CSS override |

> **Genel Not:** Sertifika görsellerinin kendisi her iki temada da değişmez — beyaz arka planlı sertifika belgeleri koyu kartların içinde kontrast oluşturur. Dot pagination'ın turuncu active rengi sabit kalır, inactive renk koyu griye döner.

---

## 12. Component 9: Why Choose Us / Advantages (C9)

> **Dosya:** `src/components/seller/WhyChooseUs.ts`
> **BEM Block:** `why-choose`
> **Referans Görseller:** Görsel 7 (Calin — Variant A: 5 ikon kartlı büyük turuncu başlık), Görsel 20 (Haers — Variant B: 3 yatay koyu altın feature bar'ı)
> **Durum:** ⚪ Opsiyonel — Satıcının avantaj verisi mevcutsa gösterilir. Mağaza tipine göre Variant A veya Variant B render edilir.

Why Choose Us, satıcının rekabet avantajlarını ve güçlü yönlerini vurgulayan opsiyonel bir bileşendir. İki varyant mevcuttur: **Variant A (Calin tarzı)** — büyük turuncu "WHY CHOOSE US" başlığı altında 5 sütunlu ikon kartları grid'i. Her kart 120px turuncu daire border içinde outline ikon, kalın başlık ve açıklama paragrafından oluşur. **Variant B (Haers tarzı)** — başlıksız, 3 sütunlu yatay koyu altın/kahverengi renkte feature bar'ları. Her bar ikon ve beyaz metin içerir. Hover'da arka plan koyulaşır.

### 12.1 Variant A — 5 İkon Kartı (Calin tarzı)

**Referans: Görsel 7**

#### 12.1.1 HTML Yapısı

```html
<section id="why-choose" class="why-choose why-choose__variant-a py-16">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <h2 class="why-choose__title text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#f97316] uppercase text-center tracking-tight mb-12">
      WHY CHOOSE US
    </h2>

    <div class="why-choose__grid grid grid-cols-5 gap-6 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
      <div v-for="item in advantages" :key="item.id"
           class="why-choose__icon-card flex flex-col items-center text-center px-4">
        <!-- Daire İkon -->
        <div class="why-choose__icon w-[120px] h-[120px] rounded-full border-[3px] border-[#f97316] flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-[#f97316]"><!-- {{ item.icon }} --></svg>
        </div>
        <!-- Başlık -->
        <h3 class="why-choose__card-title text-[16px] font-bold text-[#111827] uppercase mb-2">
          {{ item.title }}
        </h3>
        <!-- Açıklama -->
        <p class="why-choose__card-desc text-[13px] text-[#6b7280] leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>

  </div>
</section>
```

#### 12.1.2 HTML Yapı Notları (Variant A)

- **Section:** `py-16` (64px) dikey padding — diğer section'lardan biraz daha geniş. `id="why-choose"` anchor hedefi. `why-choose__variant-a` class'ı ile variant ayrımı yapılır.
- **Başlık (`<h2>`):** `text-[54px]` desktop'ta, `xl:text-[48px]` (≤1024px), `md:text-[36px]` (≤640px) ile responsive. `font-black` (900 weight), `text-[#f97316]` turuncu (store-accent), `uppercase`, `tracking-tight` dar harf aralığı, `text-center` ortalı, `mb-12` (48px) alt boşluk. Hot Products (C5) başlığıyla aynı stil.
- **Grid:** `grid-cols-5` ile 5 sütunlu. `gap-6` (24px) kart arası boşluk. Responsive: `xl:grid-cols-3` → `lg:grid-cols-2` → `md:grid-cols-1`.
- **İkon Kartı:** `flex flex-col items-center text-center px-4` ile dikey, ortalı layout. Border veya shadow yok — minimal, açık tasarım.
- **Daire İkon Container:** `w-[120px] h-[120px]` sabit boyut, `rounded-full` tam daire, `border-[3px] border-[#f97316]` turuncu kalın çerçeve. `flex items-center justify-center` ile ikon ortalanır.
- **İkon SVG:** `w-12 h-12 text-[#f97316]` turuncu outline ikonlar. Boyut 48×48px.
- **Kart Başlığı:** `text-[16px] font-bold text-[#111827] uppercase mb-2` — koyu, kalın, büyük harf.
- **Açıklama:** `text-[13px] text-[#6b7280] leading-relaxed` — gri, küçük metin, rahat satır yüksekliği.

#### 12.1.3 Variant A ASCII Layout (Görsel 7)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           WHY CHOOSE US                                      │  ← text-[54px], font-black, #f97316
│                                                                              │     uppercase, tracking-tight, text-center
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐           │
│   │  🛡️   │    │  📋   │    │  💡   │    │  🎧   │    │  ⚙️   │           │  ← 120×120px daire
│   │ (icon) │    │ (icon) │    │ (icon) │    │ (icon) │    │ (icon) │           │     border 3px #f97316
│   └───────┘    └───────┘    └───────┘    └───────┘    └───────┘           │     icon 48×48px #f97316
│                                                                              │
│   SECURITY     QUALITY     INNOVATION    SERVICE     OEM/ODM               │  ← 16px, bold, uppercase, #111827
│                                                                              │
│   International  ISO9001     Highly       Online      Offer OEM/            │  ← 13px, normal, #6b7280
│   Fingerprint    Certificated skilled R&D Technical   ODM Service           │     leading-relaxed
│   IEC compli...  Meter...    team 50+    Support     OEM Order...          │
│                                                                              │
│          gap-6 (24px)         grid-cols-5                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 12.1.4 Variant A Renk & Token Tablosu

| Element | Renk / Değer | Token / Not |
|---------|-------------|-------------|
| Section padding | 64px | `py-16` |
| Başlık rengi | `#f97316` (turuncu) | `var(--store-accent)` |
| Başlık font | `font-black` (900), `text-[54px]` | `uppercase`, `tracking-tight` |
| Daire boyut | 120px × 120px | `w-[120px] h-[120px]` |
| Daire border | 3px solid `#f97316` | `border-[3px] border-[#f97316]` |
| İkon renk | `#f97316` (turuncu outline) | `text-[#f97316]` |
| İkon boyut | 48px × 48px | `w-12 h-12` |
| Kart başlık | `#111827`, bold, 16px, uppercase | `var(--color-text-primary)` |
| Açıklama | `#6b7280`, normal, 13px | `var(--color-text-tertiary)` |
| Grid gap | 24px | `gap-6` |

**İkon Kartı Detay Tablosu:**

| Element | Değer |
|---------|-------|
| Daire boyut | 120px × 120px |
| Daire border | 3px solid `#f97316` |
| İkon renk | `#f97316` (turuncu outline icon) |
| İkon boyut | 48px × 48px |
| Başlık | 16px, bold, uppercase, `#111827` |
| Açıklama | 13px, normal, `#6b7280`, line-height 1.6 |

**5 Kart İçeriği (Görsel 7'den):**

| # | İkon | Başlık | Açıklama |
|---|------|--------|----------|
| 1 | Kalkan (shield) | SECURITY | International Fingerprint IEC compliant protocol — 15,000+ DLMS security |
| 2 | Sertifika (certificate) | QUALITY | ISO9001 Certificated Meter with Bureau Veritas approval |
| 3 | Ampul (lightbulb) | INNOVATION | Highly skilled R&D team 50+ patents |
| 4 | Kulaklık (headset) | SERVICE | Online Technical Support 24 Hours Business Consult |
| 5 | Çark (gear) | OEM/ODM | Offer OEM/ODM Service, OEM Order Customize |

**Data Interface:**

```typescript
interface Advantage {
  id: string;
  icon: string;       // SVG icon adı veya path
  title: string;
  description: string;
}
```

**Mock Data Örneği:**

```json
{
  "advantages": [
    { "id": "adv-1", "icon": "shield", "title": "Security", "description": "International Fingerprint IEC compliant protocol — 15,000+ DLMS security" },
    { "id": "adv-2", "icon": "certificate", "title": "Quality", "description": "ISO9001 Certificated Meter with Bureau Veritas approval" },
    { "id": "adv-3", "icon": "lightbulb", "title": "Innovation", "description": "Highly skilled R&D team 50+ patents" },
    { "id": "adv-4", "icon": "headset", "title": "Service", "description": "Online Technical Support 24 Hours Business Consult" },
    { "id": "adv-5", "icon": "gear", "title": "OEM/ODM", "description": "Offer OEM/ODM Service, OEM Order Customize" }
  ]
}
```

### 12.2 Variant B — 3 Feature Bar (Haers tarzı)

**Referans: Görsel 20**

> **Not:** Görsel 20 için doğrudan screenshot mevcut değildir. Bu variant spec.md'deki yazılı tanımdan üretilmiştir. Koyu altın/kahverengi yatay bar'lar, beyaz ikon ve metin içerir.

#### 12.2.1 HTML Yapısı

```html
<section id="why-choose" class="why-choose why-choose__variant-b py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <div class="why-choose__bars grid grid-cols-3 gap-4 lg:grid-cols-1">
      <div v-for="feature in features" :key="feature.id"
           class="why-choose__feature-bar flex items-center gap-4 bg-[#7c6340] rounded-[var(--radius-lg)] px-8 py-5 hover:bg-[#6b5535] transition-colors cursor-pointer">
        <svg class="w-10 h-10 text-white flex-shrink-0"><!-- {{ feature.icon }} --></svg>
        <span class="text-white text-[16px] font-medium">{{ feature.title }}</span>
      </div>
    </div>

  </div>
</section>
```

#### 12.2.2 HTML Yapı Notları (Variant B)

- **Section:** `py-12` (48px) dikey padding. `why-choose__variant-b` class'ı ile variant ayrımı.
- **Başlık:** Variant B'de ayrı bir başlık **bulunmaz** — direkt feature bar'lar görünür.
- **Grid:** `grid-cols-3` ile 3 sütunlu. `gap-4` (16px) bar arası boşluk. `lg:grid-cols-1` ile tablet altında tek sütuna düşer.
- **Feature Bar:** `flex items-center gap-4` yatay layout. `bg-[#7c6340]` koyu altın/kahverengi arka plan. `rounded-[var(--radius-lg)]` (16px) geniş köşe yuvarlaklığı. `px-8 py-5` (32px × 20px) padding. `hover:bg-[#6b5535] transition-colors` ile hover'da koyulaşır.
- **İkon:** `w-10 h-10 text-white flex-shrink-0` — beyaz, 40×40px, esnemez.
- **Metin:** `text-white text-[16px] font-medium` — beyaz, orta kalınlık.

#### 12.2.3 Variant B ASCII Layout (Görsel 20)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │  ← Başlık YOK
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │ 🛡️ Quality          │  │ 🏭 OEM ODM          │  │ 🎧 Attentive        │  │  ← bg #7c6340
│  │   assurance         │  │   Approved          │  │   service           │  │     hover: #6b5535
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │     rounded 16px
│                                                                              │     icon 40×40px white
│     gap-4 (16px)              grid-cols-3                                    │     text 16px white medium
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 12.2.4 Variant B Renk & Token Tablosu

| Element | Renk / Değer | Token / Not |
|---------|-------------|-------------|
| Bar arka plan | `#7c6340` (koyu altın/kahverengi) | Hardcoded — Haers marka rengi |
| Bar hover bg | `#6b5535` | Hover'da koyulaşma |
| Border-radius | 16px | `var(--radius-lg)` |
| Padding | 20px 32px | `py-5 px-8` |
| İkon renk | `#ffffff` (beyaz) | `text-white` |
| İkon boyut | 40px × 40px | `w-10 h-10` |
| Metin renk | `#ffffff` (beyaz) | `text-white` |
| Metin boyut | 16px, font-medium | `text-[16px] font-medium` |
| Grid gap | 16px | `gap-4` |

**Feature Bar Detay Tablosu:**

| Element | Değer |
|---------|-------|
| Arka plan | `#7c6340` (koyu altın/kahverengi) |
| Hover bg | `#6b5535` |
| Border-radius | `var(--radius-lg)` = 16px |
| Padding | 20px 32px |
| İkon | Beyaz, 40px × 40px |
| Text | Beyaz, 16px, font-medium |

**3 Feature İçeriği (Görsel 20'den):**

| # | İkon | Başlık |
|---|------|--------|
| 1 | Kalkan + check (shield-check) | Quality assurance |
| 2 | Fabrika (factory) | OEM ODM Approved |
| 3 | Müşteri destek (headset) | Attentive service |

**Data Interface:**

```typescript
interface Feature {
  id: string;
  icon: string;
  title: string;
}
```

**Mock Data Örneği:**

```json
{
  "features": [
    { "id": "feat-1", "icon": "shield-check", "title": "Quality assurance" },
    { "id": "feat-2", "icon": "factory", "title": "OEM ODM Approved" },
    { "id": "feat-3", "icon": "headset", "title": "Attentive service" }
  ]
}
```

### 12.3 Tailwind / CSS Sınıfları (Tüm Varyantlar)

**Variant A — İkon Kartları:**

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Section wrapper | `why-choose__variant-a` | `py-16` | 64px dikey padding |
| Container | — | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Başlık | `why-choose__title` | `text-[54px] xl:text-[48px] md:text-[36px] font-black text-[#f97316] uppercase text-center tracking-tight mb-12` | Büyük turuncu başlık, responsive boyut |
| Grid container | `why-choose__grid` | `grid grid-cols-5 gap-6 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1` | 5 sütunlu responsive grid |
| İkon kartı | `why-choose__icon-card` | `flex flex-col items-center text-center px-4` | Dikey, ortalı layout |
| Daire ikon container | `why-choose__icon` | `w-[120px] h-[120px] rounded-full border-[3px] border-[#f97316] flex items-center justify-center mb-4` | 120px daire, turuncu 3px border |
| İkon SVG | — | `w-12 h-12 text-[#f97316]` | 48×48px turuncu outline ikon |
| Kart başlığı | `why-choose__card-title` | `text-[16px] font-bold text-[#111827] uppercase mb-2` | Koyu, kalın, büyük harf |
| Açıklama | `why-choose__card-desc` | `text-[13px] text-[#6b7280] leading-relaxed` | Gri küçük metin, rahat satır yüksekliği |

**Variant B — Feature Bar'ları:**

| Element | BEM Sınıfı | Tailwind Classes | Açıklama |
|---------|-----------|-----------------|----------|
| Section wrapper | `why-choose__variant-b` | `py-12` | 48px dikey padding |
| Container | — | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Grid container | `why-choose__bars` | `grid grid-cols-3 gap-4 lg:grid-cols-1` | 3 sütunlu, tablet altında tek sütun |
| Feature bar | `why-choose__feature-bar` | `flex items-center gap-4 bg-[#7c6340] rounded-[var(--radius-lg)] px-8 py-5 hover:bg-[#6b5535] transition-colors cursor-pointer` | Koyu altın yatay bar, hover koyulaşma |
| Bar ikon | — | `w-10 h-10 text-white flex-shrink-0` | 40×40px beyaz ikon |
| Bar metin | — | `text-white text-[16px] font-medium` | Beyaz, 16px, orta kalınlık |

### 12.4 Responsive

| Breakpoint | Variant A (İkon Kartları) | Variant B (Feature Bar) |
|------------|--------------------------|------------------------|
| Desktop (>1280px) | 5 sütun (`grid-cols-5`) | 3 sütun (`grid-cols-3`) |
| Large (1024–1280px) | 3 sütun (`xl:grid-cols-3`) | 3 sütun (`grid-cols-3`) |
| Tablet (768–1024px) | 2 sütun (`lg:grid-cols-2`) | 1 sütun (`lg:grid-cols-1`) |
| Mobile (<768px) | 1 sütun (`md:grid-cols-1`) | 1 sütun (`lg:grid-cols-1`) |

**Responsive Davranış Detayları:**

| Özellik | Desktop (>1280px) | Tablet (768–1024px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Variant A başlık | `text-[54px]` | `xl:text-[48px]` | `md:text-[36px]` |
| Variant A grid | `grid-cols-5` | `lg:grid-cols-2` | `md:grid-cols-1` |
| Variant A daire boyut | 120px (sabit) | 120px (sabit) | 120px (sabit) |
| Variant B grid | `grid-cols-3` | `lg:grid-cols-1` (stack) | `lg:grid-cols-1` (stack) |
| Variant B bar padding | `px-8 py-5` | `px-8 py-5` (sabit) | `px-6 py-4` (opsiyonel küçültme) |

> **TailwindCSS v4 responsive notu:** Variant A'nın 5 sütunlu grid'i geniş ekranlarda 5 kart yan yana gösterirken, kademeli olarak 3 → 2 → 1 sütuna düşer. Daire ikon boyutu (120px) tüm breakpoint'lerde sabit kalır — mobilde tek sütunda ortalanır. Variant B'nin 3 sütunlu bar layout'u tablet altında tam genişlik tek sütuna dönüşür, her bar alt alta yığılır.

### 12.5 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Feature bar hover** (B) | `.why-choose__feature-bar` | `mouseenter` | Arka plan `#7c6340` → `#6b5535` koyulaşır | Pure CSS — `hover:bg-[#6b5535] transition-colors` |
| 2 | **Feature bar hover çıkış** (B) | `.why-choose__feature-bar` | `mouseleave` | Arka plan orijinal renge döner | CSS transition geri dönüşü |
| 3 | **Feature bar tıklama** (B) | `.why-choose__feature-bar` | `click` | Opsiyonel — avantaj detay sayfasına yönlendirme | Gelecek implementasyon; şu an `cursor-pointer` |
| 4 | **İkon kartı hover** (A) | `.why-choose__icon-card` | `mouseenter` | Opsiyonel — daire border `scale(1.05)` hafif büyüme | CSS transform — `hover:scale-105 transition-transform` |
| 5 | **Keyboard focus** | `.why-choose__feature-bar` | `focus` | `ring-2 ring-[#f97316] ring-offset-2` outline | Erişilebilirlik — tab ile navigasyon |

> **Not:** C9 Why Choose Us bileşeninin her iki varyantı da ağırlıklı olarak statik layout'lardır. Variant A tamamen statik bir ikon grid'idir — JavaScript etkileşimi gerektirmez. Variant B'de hover renk geçişi pure CSS ile yönetilir, opsiyonel tıklama davranışı gelecek implementasyona bırakılmıştır.

### 12.6 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Feature bar (B) | `bg-[#7c6340]` | `bg-[#6b5535]` | `ring-2 ring-[#f97316] ring-offset-2` | `bg-[#5a4a2a]` |
| Feature bar ikon (B) | `text-white` | `text-white` | — | — |
| İkon daire (A) | `border-[#f97316]` | Opsiyonel `scale-105` | — | — |
| Kart başlık (A) | `text-[#111827]` | — | — | — |

### 12.7 Dark Mode Notları

C9 Why Choose Us dark mode'da her iki varyant için ayrı ayarlar gerektirir:

**Variant A Dark Mode:**

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent | Transparent | Değişmez |
| Başlık rengi | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Daire border | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| İkon renk | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Kart başlık | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| Açıklama | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |

**Variant B Dark Mode:**

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | Transparent | Transparent | Değişmez |
| Bar bg | `#7c6340` | `#5a4a2a` (koyu) | `dark:bg-[#5a4a2a]` |
| Bar hover bg | `#6b5535` | `#4a3d22` | `dark:hover:bg-[#4a3d22]` |
| Bar ikon | `#ffffff` | `#ffffff` | Sabit — beyaz değişmez |
| Bar metin | `#ffffff` | `#ffffff` | Sabit — beyaz değişmez |

> **Genel Not:** Variant A'nın turuncu renkleri (başlık, daire border, ikon) her iki modda da sabit kalır — marka renkleri tema değişiminden etkilenmez. Kart başlık ve açıklama metinleri koyu/açık modda değişir. Variant B'nin koyu altın bar'ları dark mode'da biraz daha koyu tonlara geçer, beyaz ikon ve metin sabit kalır.

---

## 13. Component 10: Company Introduction Detail (C10)

> **Dosya:** `src/components/seller/CompanyIntroduction.ts`
> **BEM Block:** `company-intro`
> **Referans Görseller:** Görsel 19 (Haers — COMPANY INTRODUCTION başlığı, verification satırı, 3×2 info grid, fabrika fotoğraf grid, CTA butonları)
> **Durum:** ⚪ Opsiyonel — Genellikle Haers tipi PRO mağazalarda görünür. C7 Company Info'dan farklı olarak daha yapılandırılmış, grid tabanlı bilgi sunumu içerir.

Company Introduction Detail, satıcının şirket bilgilerini yapılandırılmış bir grid formatında sunan opsiyonel bir bileşendir. Beyaz kartlı, gölgeli bir container içinde koyu mavi "COMPANY INTRODUCTION" başlığı, doğrulama badge satırı (Verified, Supplier Assessment, TÜV, Onsite Check), 3×2 bilgi grid'i (Country/Region, Year Established, Business Type, Main Products, Main Markets, Revenue — her biri ikon + label + değer + onay işaretinden oluşur), 4'lü fabrika fotoğraf/video grid'i ve CTA butonları (Contact Supplier turuncu, Start Order outlined, Learn more link) barındırır.

### 13.1 HTML Yapısı

```html
<section id="company-intro" class="company-intro py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">
    <div class="company-intro__card bg-white shadow-md rounded-[var(--radius-lg)] p-10 lg:p-6">

      <!-- Başlık -->
      <h2 class="company-intro__title text-[24px] font-bold text-[#1e3a5f] uppercase text-center mb-6">
        COMPANY INTRODUCTION
      </h2>

      <!-- Verification Satırı -->
      <div class="company-intro__verification flex items-center justify-center gap-4 flex-wrap mb-8 text-[13px]">
        <span class="text-[#6b7280]">Verification Type:</span>
        <span class="inline-flex items-center gap-1 bg-[#eff6ff] text-[#1e40af] px-2 py-0.5 rounded-sm font-medium">
          <svg class="w-3.5 h-3.5"><!-- check icon ✓ --></svg> Verified
        </span>
        <span class="text-[#374151]">Supplier Assessment</span>
        <img src="/assets/tuv-logo.svg" alt="TÜV Rheinland" class="h-4" />
        <span class="text-[#374151]">Onsite Check</span>
      </div>

      <!-- 3x2 Info Grid -->
      <div class="company-intro__grid grid grid-cols-3 gap-6 mb-8 lg:grid-cols-2 md:grid-cols-1">
        <div v-for="info in companyInfo" :key="info.label"
             class="company-intro__cell flex items-start gap-3">
          <!-- İkon Daire -->
          <div class="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-[#f97316]"><!-- {{ info.icon }} --></svg>
          </div>
          <!-- Label + Değer -->
          <div>
            <p class="text-[13px] text-[#f97316] font-medium">{{ info.label }}</p>
            <p class="text-[14px] text-[#374151] flex items-center gap-1">
              {{ info.value }}
              <svg class="w-4 h-4 text-[#f97316]"><!-- check ✓ --></svg>
            </p>
          </div>
        </div>
      </div>

      <!-- Fabrika Fotoğraf Grid -->
      <div class="company-intro__photos grid grid-cols-4 gap-3 mb-8 lg:grid-cols-2">
        <div v-for="(photo, index) in companyPhotos" :key="photo.id"
             class="relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3]">
          <img :src="photo.image" :alt="photo.caption" class="w-full h-full object-cover" />
          <!-- Video play icon (ilk fotoda) -->
          <button v-if="index === 0 && photo.hasVideo"
                  class="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                  aria-label="Videoyu oynat">
            <svg class="w-6 h-6 text-white ml-1"><!-- play ▶ --></svg>
          </button>
        </div>
      </div>

      <!-- CTA Butonları -->
      <div class="company-intro__cta flex items-center justify-center gap-4 flex-wrap">
        <button class="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4"><!-- mail icon --></svg>
          Contact Supplier
        </button>
        <button class="bg-transparent border border-[#d1d5db] hover:bg-[#f9fafb] text-[#374151] font-medium text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 transition-colors">
          Start Order
        </button>
        <a href="#" class="text-[#f97316] text-[14px] font-medium hover:underline">
          Learn more about us &gt;
        </a>
      </div>

    </div>
  </div>
</section>
```

#### 13.1.1 HTML Yapı Notları

- **Section:** `py-12` (48px) dikey padding. `id="company-intro"` anchor hedefi.
- **Card Container:** `bg-white shadow-md rounded-[var(--radius-lg)] p-10 lg:p-6` — beyaz arka plan, orta gölge (`shadow-md`), 16px yuvarlak köşe, 40px padding (tablet'te 24px'e düşer). Tüm içerik bu kart içinde yer alır.
- **Başlık (`<h2>`):** `text-[24px]` orta boyut, `font-bold` (700 weight), `text-[#1e3a5f]` koyu mavi, `uppercase`, `text-center`, `mb-6` (24px) alt boşluk.
- **Verification Satırı:** `flex items-center justify-center gap-4 flex-wrap` ile yatay, ortalı, sarmalanan layout. `text-[13px]` küçük metin. İçerik: "Verification Type:" etiketi (gri), "Verified" badge'i (mavi arka plan `#eff6ff`, mavi metin `#1e40af`, check ikonu), "Supplier Assessment" metni, TÜV logosu, "Onsite Check" metni. `mb-8` ile info grid'den ayrılır.
- **Info Grid:** `grid-cols-3 gap-6 mb-8` 3 sütunlu, 24px boşluklu. `lg:grid-cols-2` tablet'te 2 sütun, `md:grid-cols-1` mobilde tek sütun.
- **Info Hücresi:** `flex items-start gap-3` ile yatay layout, üst hizalı. Sol'da 40×40px gri arka planlı ikon dairesi, sağ'da turuncu label + koyu değer + turuncu check ikonu.
- **Fotoğraf Grid:** `grid-cols-4 gap-3 mb-8` 4 sütunlu, 12px boşluklu. `lg:grid-cols-2` tablet'te 2 sütun. Her fotoğraf `aspect-[4/3]` oranında, `rounded-[var(--radius-md)]` yuvarlak köşeli. İlk fotoğrafta video play ikonu (eğer `hasVideo` true ise).
- **Video Play Butonu:** `absolute inset-0 m-auto` ile fotoğrafın tam ortasında konumlanır. `w-14 h-14` (56×56px) daire, `bg-black/50` yarı saydam siyah, `hover:bg-black/70` hover'da koyulaşır. İçindeki play ikonu `w-6 h-6 text-white ml-1` — beyaz, hafif sağa kaydırılmış (optik ortalama).
- **CTA Butonları:** `flex items-center justify-center gap-4 flex-wrap` ile ortalanmış, sarmalanan buton satırı. Üç buton: Contact Supplier (turuncu dolgu), Start Order (outlined), Learn more (link).

#### 13.1.2 ASCII Layout (Görsel 19)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                      COMPANY INTRODUCTION                              │  │  ← text-[24px], font-bold, #1e3a5f
│  │                                                                        │  │     uppercase, text-center
│  │  Verification Type:  [✓ Verified]  Supplier Assessment  [TÜV]  Onsite │  │  ← text-[13px], flex center
│  │                                                                        │  │     badge: bg #eff6ff, text #1e40af
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │  │
│  │  │ 🌐 Country/Region│  │ 📅 Year Est.     │  │ 🏭 Business Type │    │  │  ← 3×2 Info Grid
│  │  │    Zhejiang,     │  │    1995 ✓        │  │    Custom Mfr ✓  │    │  │     icon 40px circle bg #f3f4f6
│  │  │    China ✓       │  │                  │  │                  │    │  │     label: 13px #f97316
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘    │  │     value: 14px #374151
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │  │     check: 16px #f97316
│  │  │ 📦 Main Products │  │ 🗺️ Main Markets  │  │ 📊 Revenue       │    │  │
│  │  │    Water Bottle, │  │    North America │  │    475,931,738 ✓ │    │  │
│  │  │    Cups... ✓     │  │    Domestic... ✓ │  │                  │    │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘    │  │
│  │                                                                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │  ▶ Play  │  │          │  │          │  │          │            │  │  ← 4 sütun fotoğraf grid
│  │  │ [Video]  │  │ [Photo2] │  │ [Photo3] │  │ [Photo4] │            │  │     aspect 4:3, gap-3
│  │  │          │  │          │  │          │  │          │            │  │     rounded-md
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │  │     play: 56px circle
│  │                                                                        │  │            bg-black/50
│  │         [Contact Supplier]  [Start Order]  Learn more >               │  │  ← CTA buttons centered
│  │          bg #f97316          border #d1d5db  text #f97316             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│     shadow-md, rounded-lg, p-10                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 3×2 Info Grid

**6 Bilgi Hücresi (Görsel 19'dan):**

| # | Label | Örnek Değer | İkon |
|---|-------|-------------|------|
| 1 | Country / Region | Zhejiang, China ✓ | Globe (🌐) |
| 2 | Year Established | 1995 ✓ | Calendar (📅) |
| 3 | Business Type | Custom Manufacturer ✓ | Factory (🏭) |
| 4 | Main Products | Water Bottle, Cups, Tumbler, Mug... ✓ | Box (📦) |
| 5 | Main Markets | North America, Domestic Market... ✓ | Map (🗺️) |
| 6 | Total Annual Revenue | 475,931,738 ✓ | Chart (📊) |

**Hücre Styling:**

| Element | Değer | CSS/Tailwind |
|---------|-------|-------------|
| İkon daire boyut | 40px × 40px | `w-10 h-10` |
| İkon daire bg | `#f3f4f6` (açık gri) | `bg-[#f3f4f6]` |
| İkon renk | `#f97316` (turuncu) | `text-[#f97316]` |
| İkon boyut | 20px × 20px | `w-5 h-5` |
| Label | 13px, `#f97316`, font-medium | `text-[13px] text-[#f97316] font-medium` |
| Değer | 14px, `#374151` | `text-[14px] text-[#374151]` |
| Check ikonu | 16px, `#f97316` | `w-4 h-4 text-[#f97316]` |
| Hücre gap | 12px | `gap-3` |
| Hücre alignment | Üst hizalı | `items-start` |

**Data Interface:**

```typescript
interface CompanyInfoCell {
  label: string;
  value: string;
  icon: string;       // SVG icon adı
  verified: boolean;   // ✓ check ikonu gösterilsin mi
}
```

**Mock Data Örneği:**

```json
{
  "companyInfo": [
    { "label": "Country / Region", "value": "Zhejiang, China", "icon": "globe", "verified": true },
    { "label": "Year Established", "value": "1995", "icon": "calendar", "verified": true },
    { "label": "Business Type", "value": "Custom Manufacturer", "icon": "factory", "verified": true },
    { "label": "Main Products", "value": "Water Bottle, Cups, Tumbler, Mug, Lunch Box", "icon": "box", "verified": true },
    { "label": "Main Markets", "value": "North America, Domestic Market, Western Europe", "icon": "map", "verified": true },
    { "label": "Total Annual Revenue", "value": "475,931,738", "icon": "chart", "verified": true }
  ]
}
```

### 13.3 Fabrika Fotoğraf / Video Grid

| Element | Değer | CSS/Tailwind |
|---------|-------|-------------|
| Grid sütun | 4 (desktop), 2 (tablet) | `grid-cols-4 lg:grid-cols-2` |
| Grid gap | 12px | `gap-3` |
| Aspect ratio | 4:3 | `aspect-[4/3]` |
| Border-radius | 8px | `rounded-[var(--radius-md)]` |
| Object-fit | cover | `object-cover` |
| Overflow | hidden | `overflow-hidden` |
| Video play daire | 56px × 56px | `w-14 h-14` |
| Play daire bg | `rgba(0,0,0,0.5)` | `bg-black/50` |
| Play daire hover bg | `rgba(0,0,0,0.7)` | `hover:bg-black/70` |
| Play ikon boyut | 24px × 24px | `w-6 h-6` |
| Play ikon renk | `#ffffff` (beyaz) | `text-white` |
| Play ikon offset | Hafif sağa (optik ortalama) | `ml-1` |

**Fotoğraf Data Interface:**

```typescript
interface CompanyPhoto {
  id: string;
  image: string;
  caption: string;
  hasVideo?: boolean;   // İlk fotoğrafta video play ikonu
}
```

**Mock Data Örneği (4 fotoğraf):**

```json
{
  "companyPhotos": [
    { "id": "cp-1", "image": "/assets/mock/factory-video-thumb.jpg", "caption": "Factory Overview", "hasVideo": true },
    { "id": "cp-2", "image": "/assets/mock/factory-production.jpg", "caption": "Production Line" },
    { "id": "cp-3", "image": "/assets/mock/factory-warehouse.jpg", "caption": "Warehouse" },
    { "id": "cp-4", "image": "/assets/mock/factory-quality.jpg", "caption": "Quality Control" }
  ]
}
```

### 13.4 CTA Butonları

| Buton | Background | Text | Border | Hover | Diğer |
|-------|-----------|------|--------|-------|-------|
| Contact Supplier | `#f97316` | `#ffffff` (beyaz) | — | `bg-[#ea580c]` | `font-semibold`, mail ikonu, `px-6 py-2.5` |
| Start Order | `transparent` | `#374151` | `1px solid #d1d5db` | `bg-[#f9fafb]` | `font-medium`, `px-6 py-2.5` |
| Learn more | — (link) | `#f97316` | — | `underline` | `font-medium`, `>` oku |

**CTA Buton Detayları:**

| Özellik | Contact Supplier | Start Order | Learn more |
|---------|-----------------|-------------|------------|
| Tür | `<button>` | `<button>` | `<a>` |
| Font size | 14px | 14px | 14px |
| Font weight | 600 (semibold) | 500 (medium) | 500 (medium) |
| Border-radius | `var(--radius-button)` = 8px | `var(--radius-button)` = 8px | — |
| Padding | `10px 24px` | `10px 24px` | — |
| İkon | Mail ikonu (sol) | — | `>` ok işareti (sağ) |
| Transition | `transition-colors` | `transition-colors` | — |

### 13.5 Tailwind / CSS Sınıfları

| Element | Classes | Açıklama |
|---------|---------|----------|
| Section | `py-12` | 48px dikey padding |
| İç container | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px max genişlik, 32px yatay padding |
| Kart container | `bg-white shadow-md rounded-[var(--radius-lg)] p-10 lg:p-6` | Beyaz kart, gölge, yuvarlak köşe |
| Başlık | `text-[24px] font-bold text-[#1e3a5f] uppercase text-center mb-6` | Koyu mavi başlık |
| Verification satırı | `flex items-center justify-center gap-4 flex-wrap mb-8 text-[13px]` | Ortalanmış badge satırı |
| Verified badge | `inline-flex items-center gap-1 bg-[#eff6ff] text-[#1e40af] px-2 py-0.5 rounded-sm font-medium` | Mavi badge |
| Info grid | `grid grid-cols-3 gap-6 mb-8 lg:grid-cols-2 md:grid-cols-1` | 3×2 info grid, responsive |
| Info hücresi | `flex items-start gap-3` | Yatay layout, üst hizalı |
| İkon daire | `w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center flex-shrink-0` | Gri arka planlı ikon dairesi |
| Label | `text-[13px] text-[#f97316] font-medium` | Turuncu label |
| Değer | `text-[14px] text-[#374151] flex items-center gap-1` | Koyu değer + check |
| Fotoğraf grid | `grid grid-cols-4 gap-3 mb-8 lg:grid-cols-2` | 4 sütunlu fotoğraf grid |
| Fotoğraf wrapper | `relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3]` | Yuvarlak köşeli fotoğraf container |
| Play butonu | `absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors` | Ortadaki play ikonu |
| CTA container | `flex items-center justify-center gap-4 flex-wrap` | Ortalanmış CTA satırı |
| Contact Supplier btn | `bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 flex items-center gap-2 transition-colors` | Turuncu CTA |
| Start Order btn | `bg-transparent border border-[#d1d5db] hover:bg-[#f9fafb] text-[#374151] font-medium text-[14px] rounded-[var(--radius-button)] px-6 py-2.5 transition-colors` | Outlined buton |
| Learn more link | `text-[#f97316] text-[14px] font-medium hover:underline` | Turuncu link |

### 13.6 Responsive

| Breakpoint | Info Grid | Foto Grid | CTA Layout | Card Padding |
|------------|-----------|-----------|------------|-------------|
| Desktop (>1024px) | 3 sütun (`grid-cols-3`) | 4 sütun (`grid-cols-4`) | Flex row center | 40px (`p-10`) |
| Tablet (768–1024px) | 2 sütun (`lg:grid-cols-2`) | 2 sütun (`lg:grid-cols-2`) | Flex row center | 24px (`lg:p-6`) |
| Mobile (<768px) | 1 sütun (`md:grid-cols-1`) | 2 sütun (`lg:grid-cols-2`) | Flex col, full-width butonlar | 24px (`lg:p-6`) |

**Responsive Davranış Detayları:**

| Özellik | Desktop (>1024px) | Tablet (768–1024px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Info grid sütun | `grid-cols-3` (3 sütun) | `lg:grid-cols-2` (2 sütun) | `md:grid-cols-1` (tek sütun) |
| Fotoğraf grid sütun | `grid-cols-4` (4 sütun) | `lg:grid-cols-2` (2 sütun) | `lg:grid-cols-2` (2 sütun) |
| Kart padding | `p-10` (40px) | `lg:p-6` (24px) | `lg:p-6` (24px) |
| CTA düzeni | Yatay, ortalı | Yatay, ortalı | Dikey stack, tam genişlik butonlar |
| Verification satırı | Tek satır | Sarmalanan (`flex-wrap`) | Sarmalanan (`flex-wrap`) |
| Play ikonu | 56px daire | 56px daire (sabit) | 48px daire (opsiyonel küçültme) |

> **TailwindCSS v4 responsive notu:** Info grid 3 → 2 → 1 sütuna düşerken, fotoğraf grid 4 → 2 sütuna düşer (mobilde de 2 sütun kalır — fotoğraflar küçük boyutta da yan yana gösterilir). CTA butonları mobilde `flex-col` ile dikey stack olabilir, her buton tam genişlik alabilir. Kart padding'i tablet ve altında küçülür (`p-10` → `lg:p-6`).

### 13.7 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Contact Supplier tıklama** | `.company-intro__cta button:first-child` | `click` | İletişim formuna (C12) scroll veya modal açma | `scrollIntoView({ behavior: 'smooth' })` ile C12'ye yumuşak kaydırma |
| 2 | **Contact Supplier hover** | `.company-intro__cta button:first-child` | `mouseenter` | Arka plan `#f97316` → `#ea580c` | Pure CSS — `hover:bg-[#ea580c] transition-colors` |
| 3 | **Start Order tıklama** | `.company-intro__cta button:nth-child(2)` | `click` | Sipariş sayfasına yönlendirme | Harici link — gelecek implementasyon |
| 4 | **Start Order hover** | `.company-intro__cta button:nth-child(2)` | `mouseenter` | Arka plan `transparent` → `#f9fafb` | Pure CSS — `hover:bg-[#f9fafb] transition-colors` |
| 5 | **Learn more tıklama** | `.company-intro__cta a` | `click` | Şirket profil detay sayfasına yönlendirme | Harici link |
| 6 | **Learn more hover** | `.company-intro__cta a` | `mouseenter` | Altı çizili olur | Pure CSS — `hover:underline` |
| 7 | **Video play tıklama** | `.company-intro__photos button` | `click` | Video modal açma veya lightbox | JavaScript — video player modal |
| 8 | **Video play hover** | `.company-intro__photos button` | `mouseenter` | Arka plan `bg-black/50` → `bg-black/70` | Pure CSS — `hover:bg-black/70 transition-colors` |
| 9 | **Keyboard focus** | Tüm butonlar ve link | `focus` | `ring-2 ring-[#f97316] ring-offset-2` outline | Erişilebilirlik — tab ile navigasyon |

> **Not:** C10 Company Introduction'ın CTA butonları kullanıcıyı farklı hedeflere yönlendirir. "Contact Supplier" butonu genellikle sayfadaki C12 Contact Form'a smooth scroll yapar. "Start Order" ve "Learn more" harici sayfalara yönlendirir. Video play butonu bir video modal/lightbox açar — bu davranış JavaScript ile yönetilir.

### 13.8 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Contact Supplier btn | `bg-[#f97316]` | `bg-[#ea580c]` | `ring-2 ring-[#f97316] ring-offset-2` | `bg-[#c2410c]` |
| Start Order btn | `bg-transparent border-[#d1d5db]` | `bg-[#f9fafb]` | `ring-2 ring-[#d1d5db] ring-offset-2` | `bg-[#f3f4f6]` |
| Learn more link | `text-[#f97316]` | `underline` | `ring-2 ring-[#f97316] ring-offset-2` | — |
| Video play btn | `bg-black/50` | `bg-black/70` | `ring-2 ring-white ring-offset-2` | `bg-black/80` |
| Fotoğraf | `scale-100` | Opsiyonel `scale-[1.02]` | — | — |
| İkon daire | `bg-[#f3f4f6]` | Opsiyonel `bg-[#e5e7eb]` | — | — |

### 13.9 Dark Mode Notları

C10 Company Introduction dark mode'da kart container, metin renkleri ve badge'lerde değişiklik gerektirir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Kart bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Kart shadow | `shadow-md` | `shadow-lg` | `dark:shadow-lg` |
| Başlık rengi | `#1e3a5f` (koyu mavi) | `#93c5fd` (açık mavi) | `dark:text-blue-300` |
| Verification label | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| Verified badge bg | `#eff6ff` | `#1e3a5f` | `dark:bg-blue-900` |
| Verified badge metin | `#1e40af` | `#93c5fd` | `dark:text-blue-300` |
| Info label | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Info değer | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Check ikonu | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| İkon daire bg | `#f3f4f6` | `#374151` | `dark:bg-gray-700` |
| CTA assessment metin | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Contact Supplier bg | `#f97316` | `#f97316` | Sabit — değişmez |
| Start Order border | `#d1d5db` | `#4b5563` | `dark:border-gray-600` |
| Start Order metin | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Learn more renk | `#f97316` | `#f97316` | Sabit — değişmez |

> **Genel Not:** C10 Company Introduction'ın kart container'ı dark mode'da koyu griye döner, gölge biraz daha belirgin olur. Turuncu renkler (info label, check ikonu, Contact Supplier buton, Learn more link) her iki modda da sabit kalır. Verified badge mavi tonu dark mode'da koyu mavi arka plan + açık mavi metin kombinasyonuna geçer. Info değer metinleri ve assessment metinleri açık griye döner.

---

## 14. Component 11: Gallery / Factory Photos (C11)

> **Dosya:** `src/components/seller/Gallery.ts`
> **BEM Block:** `gallery`
> **Referans Görseller:** Görsel 5-8 (Calin — fabrika fotoğrafları, üretim hattı ve tesis görselleri)
> **Durum:** ⚪ Opsiyonel — Satıcının fabrika/tesis fotoğrafları mevcutsa gösterilir. Veri yoksa section tamamen gizlenir.

Gallery / Factory Photos, satıcının üretim tesisi, fabrika ortamı, kalite kontrol laboratuvarı, depo ve ofis gibi fiziksel altyapı görsellerini grid düzeninde sergileyen opsiyonel bir bileşendir. Koyu mavi "MORE" başlığı altında 3 sütunlu (desktop) fotoğraf grid'i yer alır. Her fotoğraf `rounded-md` köşeli, `object-cover` ile kırpılmış ve `aspect-ratio 4:3` oranında sunulur. Hover'da görsel `scale(1.05)` ile hafifçe büyür, üzerine yarı saydam siyah gradient overlay gelir ve opsiyonel caption metni alt kısımda fade-in ile görünür. Grid responsive olarak 3 → 2 → 1 sütuna daraltılır. Fotoğraflara tıklandığında lightbox modal açılır (placeholder).

### 14.1 Grid Yapısı

#### 14.1.1 HTML Yapısı

```html
<section id="gallery" class="gallery py-12">
  <div class="max-w-[var(--container-lg)] mx-auto px-8">

    <h2 class="gallery__title text-[28px] font-bold text-[#1e3a5f] uppercase text-center mb-8">
      MORE
    </h2>

    <div class="gallery__grid grid grid-cols-3 gap-4 lg:grid-cols-2 md:grid-cols-1">
      <div v-for="photo in galleryPhotos" :key="photo.id"
           class="gallery__item relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer">
        <img :src="photo.image" :alt="photo.caption"
             class="gallery__image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <!-- Hover Overlay -->
        <div class="gallery__overlay absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <p class="gallery__caption text-white text-[13px] font-medium px-4 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" v-if="photo.caption">
            {{ photo.caption }}
          </p>
        </div>
      </div>
    </div>

  </div>
</section>
```

#### 14.1.2 HTML Yapı Notları

- **Section:** `py-12` (48px) dikey padding. `id="gallery"` anchor hedefi — Store Nav (C2) "Gallery" linki bu section'a scroll eder. Section opsiyoneldir; `galleryPhotos` boşsa section render edilmez.
- **Başlık (`<h2>`):** `text-[28px]` font boyutu, `font-bold` (700 weight), `text-[#1e3a5f]` koyu mavi (C7/C8/C10 ile tutarlı), `uppercase`, `text-center` ortalı, `mb-8` (32px) alt boşluk. Diğer section başlıklarıyla aynı stil.
- **Grid Container:** `grid grid-cols-3` ile 3 sütunlu grid layout. `gap-4` (16px) grid boşluğu. Responsive: `lg:grid-cols-2` (≤768px), `md:grid-cols-1` (≤640px).
- **Gallery Item:** `relative` overlay konumlandırması için. `rounded-[var(--radius-md)]` = 8px köşe yuvarlatma. `overflow-hidden` — scale animasyonu sırasında görsel taşmaz. `aspect-[4/3]` — tüm kartlar 4:3 oranında sabit. `group` class'ı — hover state'i child'lara aktarır. `cursor-pointer` — tıklanabilir görünüm (lightbox için).
- **Görsel (`<img>`):** `w-full h-full` tam kaplama. `object-cover` — görsel oranı bozulmadan kırpılır. `transition-transform duration-300` — hover animasyonu 300ms. `group-hover:scale-105` — %5 büyütme efekti.
- **Overlay (`gallery__overlay`):** `absolute inset-0` tam kaplama. `bg-gradient-to-t from-black/40 via-black/0 to-transparent` — alttan üste gradient (alt kısımda %40 siyahlık, üstte tamamen saydam). `opacity-0 group-hover:opacity-100` — hover'da fade-in. `transition-opacity duration-300` — 300ms geçiş. `flex items-end` — caption'ı alt kısıma hizalar.
- **Caption (`gallery__caption`):** `text-white text-[13px] font-medium` beyaz küçük metin. `px-4 py-3` padding. `translate-y-2 group-hover:translate-y-0` — hover'da hafif yukarı kayma efekti. `v-if="photo.caption"` — caption yoksa render edilmez.

#### 14.1.3 Grid Layout Notları

| Özellik | Değer | Açıklama |
|---------|-------|----------|
| Grid sütun | `grid-cols-3` | Desktop'ta 3 sütun (4 sütun opsiyonel: `grid-cols-4`) |
| Grid boşluğu | `gap-4` (16px) | Kartlar arası eşit boşluk |
| Aspect ratio | `aspect-[4/3]` | Tüm kartlar sabit 4:3 oranı |
| Border-radius | `var(--radius-md)` = 8px | `rounded-md` köşe yuvarlatma |
| Overflow | `overflow-hidden` | Scale animasyonu taşma önlenir |
| Object-fit | `object-cover` | Görsel kırpılarak alana sığdırılır |

> **Not:** Bazı mağazalarda 4 sütunlu grid tercih edilebilir. Bu durumda `grid-cols-3` yerine `grid-cols-4` kullanılır ve responsive breakpoint'ler `lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1` olarak güncellenir. Aspect ratio tercihen 4:3 kalır ancak 16:10 (`aspect-[16/10]`) de alternatif olarak kullanılabilir.

#### 14.1.4 ASCII Layout (Görsel 5-8)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  py-12                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                              MORE                                      │  │
│  │                    text-[28px] font-bold #1e3a5f                       │  │
│  │                        uppercase text-center                           │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                mb-8 (32px)                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │                     │  │
│  │   gallery-1.jpg     │  │   gallery-2.jpg     │  │   gallery-3.jpg     │  │
│  │   aspect-[4/3]      │  │   aspect-[4/3]      │  │   aspect-[4/3]      │  │
│  │   object-cover      │  │   object-cover      │  │   object-cover      │  │
│  │   rounded-md        │  │   rounded-md        │  │   rounded-md        │  │
│  │                     │  │                     │  │                     │  │
│  │ ░░░░░░░░░░░░░░░░░░░│  │                     │  │                     │  │
│  │ "Automated Assembly"│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│              gap-4                  gap-4                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │                     │  │
│  │   gallery-4.jpg     │  │   gallery-5.jpg     │  │   gallery-6.jpg     │  │
│  │   aspect-[4/3]      │  │   aspect-[4/3]      │  │   aspect-[4/3]      │  │
│  │   object-cover      │  │   object-cover      │  │   object-cover      │  │
│  │   rounded-md        │  │   rounded-md        │  │   rounded-md        │  │
│  │                     │  │                     │  │                     │  │
│  │                     │  │                     │  │                     │  │
│  │                     │  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Hover Durumu (sol üst kart üzerinde):
┌─────────────────────┐
│                     │
│   scale(1.05)       │  ← group-hover:scale-105
│   object-cover      │
│                     │
│ ░░░░░░░░░░░░░░░░░░░│  ← bg-gradient-to-t from-black/40
│ ░"Automated Assemb."│  ← text-white text-[13px]
│ ░░░░░░░░░░░░░░░░░░░│     px-4 py-3, fade-in
└─────────────────────┘
```

### 14.2 Hover Overlay / Caption

#### 14.2.1 Overlay Detay Tablosu

| Element | Değer | Açıklama |
|---------|-------|----------|
| Overlay default | `opacity-0` | Tamamen gizli |
| Overlay hover | `opacity-100` | Tam görünür |
| Gradient tipi | `bg-gradient-to-t` | Alttan üste gradient |
| Gradient from | `from-black/40` | Alt kısımda %40 siyah |
| Gradient via | `via-black/0` | Ortada tamamen saydam |
| Gradient to | `to-transparent` | Üst kısımda tamamen saydam |
| Transition | `transition-opacity duration-300` | 300ms fade geçişi |
| Konumlama | `absolute inset-0` | Tam kaplama |
| Flex hizalama | `flex items-end` | İçerik alt kısıma yaslanır |

#### 14.2.2 Caption Detay Tablosu

| Özellik | Değer | Açıklama |
|---------|-------|----------|
| Renk | `text-white` | Beyaz metin |
| Font boyutu | `text-[13px]` | Küçük, okunabilir |
| Font weight | `font-medium` (500) | Orta kalınlık |
| Padding | `px-4 py-3` | 16px yatay, 12px dikey |
| Giriş animasyonu | `translate-y-2 → translate-y-0` | 8px yukarı kayma |
| Transition | `transition-transform duration-300` | 300ms kayma geçişi |
| Koşul | `v-if="photo.caption"` | Caption verisi varsa gösterilir |

#### 14.2.3 Image Zoom Detayları

| Özellik | Değer | Açıklama |
|---------|-------|----------|
| Normal scale | `scale-100` (varsayılan) | Normal boyut |
| Hover scale | `group-hover:scale-105` | %5 büyütme |
| Transition | `transition-transform duration-300` | 300ms yumuşak geçiş |
| Overflow | `overflow-hidden` (parent) | Büyüyen görsel dışarı taşmaz |
| Timing function | `ease` (Tailwind default) | Doğal hız eğrisi |

> **Not:** Zoom efekti opsiyoneldir. Performans kaygısı olan mağazalarda `group-hover:scale-105` kaldırılabilir. Bu durumda sadece overlay gradient + caption animasyonu aktif kalır.

### 14.3 Responsive

| Breakpoint | Grid Sütun | Gap | Aspect Ratio | Başlık Boyutu |
|------------|-----------|-----|-------------|---------------|
| Desktop (>1024px) | `grid-cols-3` (veya 4) | `gap-4` (16px) | `aspect-[4/3]` | `text-[28px]` |
| Tablet (768–1024px) | `grid-cols-2` | `gap-4` (16px) | `aspect-[4/3]` | `text-[28px]` |
| Mobile (<768px) | `grid-cols-1` | `gap-4` (16px) | `aspect-[4/3]` | `text-[24px]` |

#### 14.3.1 Responsive Tailwind Sınıfları

```
gallery__grid:
  Desktop  → grid grid-cols-3 gap-4
  Tablet   → lg:grid-cols-2
  Mobile   → md:grid-cols-1

gallery__title:
  Desktop  → text-[28px]
  Mobile   → md:text-[24px]

Container padding:
  Desktop  → px-8
  Tablet   → lg:px-6
  Mobile   → md:px-4
```

#### 14.3.2 4 Sütunlu Grid Varyantı (Opsiyonel)

Daha fazla fotoğrafı olan mağazalar için 4 sütunlu grid alternatifi:

| Breakpoint | Grid Sütun |
|------------|-----------|
| Desktop (>1024px) | `grid-cols-4` |
| Tablet (768–1024px) | `grid-cols-3` |
| Small Tablet (640–768px) | `grid-cols-2` |
| Mobile (<640px) | `grid-cols-1` |

```html
<!-- 4 sütunlu varyant -->
<div class="gallery__grid grid grid-cols-4 gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
  ...
</div>
```

### 14.4 Data Interface (TypeScript)

```typescript
/** Tek bir galeri/fabrika fotoğrafı */
export interface GalleryPhoto {
  /** Benzersiz tanımlayıcı (ör. "gal-1") */
  id: string;
  /** Fotoğraf URL'si */
  image: string;
  /** Opsiyonel başlık metni — hover overlay'de gösterilir */
  caption?: string;
}

/** Gallery component props */
export interface GalleryData {
  /** Section başlığı (varsayılan: "MORE") */
  title?: string;
  /** Fotoğraf listesi */
  photos: GalleryPhoto[];
  /** Grid sütun sayısı: 3 (varsayılan) veya 4 */
  columns?: 3 | 4;
}
```

### 14.5 Mock Data Örneği

```json
{
  "galleryPhotos": [
    { "id": "gal-1", "image": "/assets/mock/gallery-1.jpg", "caption": "Automated Assembly Line" },
    { "id": "gal-2", "image": "/assets/mock/gallery-2.jpg", "caption": "Quality Control Lab" },
    { "id": "gal-3", "image": "/assets/mock/gallery-3.jpg", "caption": "Raw Material Storage" },
    { "id": "gal-4", "image": "/assets/mock/gallery-4.jpg", "caption": "Packaging Department" },
    { "id": "gal-5", "image": "/assets/mock/gallery-5.jpg", "caption": "R&D Center" },
    { "id": "gal-6", "image": "/assets/mock/gallery-6.jpg", "caption": "Office Building" }
  ]
}
```

### 14.6 Tailwind / CSS Sınıfları

| Element | Tailwind Sınıfları | Açıklama |
|---------|-------------------|----------|
| `section.gallery` | `py-12` | 48px dikey padding |
| Container | `max-w-[var(--container-lg)] mx-auto px-8` | 1472px maks genişlik, ortalı, 32px yatay padding |
| `gallery__title` | `text-[28px] font-bold text-[#1e3a5f] uppercase text-center mb-8` | Koyu mavi, kalın, büyük harf, ortalı başlık |
| `gallery__grid` | `grid grid-cols-3 gap-4 lg:grid-cols-2 md:grid-cols-1` | 3 sütunlu responsive grid |
| `gallery__item` | `relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer` | Yuvarlatılmış köşe, sabit oran, tıklanabilir |
| `gallery__image` | `w-full h-full object-cover transition-transform duration-300 group-hover:scale-105` | Kaplama, kırpma, hover zoom |
| `gallery__overlay` | `absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end` | Gradient overlay, fade-in |
| `gallery__caption` | `text-white text-[13px] font-medium px-4 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300` | Beyaz caption, kayma animasyonu |

### 14.7 Etkileşimler

| Etkileşim | Tetikleyici | Sonuç | Uygulama |
|-----------|-------------|-------|----------|
| Image Zoom | Mouse hover on `gallery__item` | Görsel `scale(1.05)` büyür | CSS `group-hover:scale-105` |
| Overlay Fade-in | Mouse hover on `gallery__item` | Gradient overlay görünür olur | CSS `group-hover:opacity-100` |
| Caption Slide-up | Mouse hover on `gallery__item` | Caption metni yukarı kayarak belirır | CSS `group-hover:translate-y-0` |
| Lightbox Open | Click on `gallery__item` | Lightbox modal açılır (placeholder) | JS `initGalleryLightbox()` |
| Keyboard Focus | Tab navigasyonu | Focus ring gösterilir | CSS `focus-visible:ring-2` |

#### 14.7.1 Lightbox Etkileşim Kodu (Placeholder)

```typescript
/**
 * Gallery Lightbox (Opsiyonel — C11)
 * Fotoğrafa tıklandığında lightbox modal açar
 */
export function initGalleryLightbox(): void {
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img') as HTMLImageElement;
      if (!img) return;
      // Placeholder: lightbox modal açılır
      // Gerçek implementasyonda bir lightbox kütüphanesi
      // veya custom modal kullanılabilir
      console.log('Open lightbox for:', img.src);
    });
  });
}
```

### 14.8 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Gallery item | `scale-100, opacity-0 overlay` | `scale-105, opacity-100 overlay` | `ring-2 ring-[#cc9900] ring-offset-2` | `scale-[1.02]` |
| Overlay | `opacity-0` | `opacity-100, bg-gradient-to-t from-black/40` | — | — |
| Caption | `translate-y-2, opacity-0` (overlay içinde) | `translate-y-0, opacity-100` (overlay ile) | — | — |
| Image | `scale-100` | `scale-105` | — | `scale-[1.02]` |

#### 14.8.1 Focus-Visible Desteği

```html
<div class="gallery__item relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/3] group cursor-pointer
            focus-visible:ring-2 focus-visible:ring-[#cc9900] focus-visible:ring-offset-2 outline-none"
     tabindex="0"
     role="button"
     aria-label="{{ photo.caption || 'Fabrika fotoğrafı' }}">
```

> **Erişilebilirlik Notu:** Her `gallery__item` `tabindex="0"` ile klavye navigasyonuna dahil edilir. `role="button"` ile tıklanabilir eleman olarak tanımlanır. `aria-label` ile ekran okuyucular için açıklayıcı metin sağlanır. Focus durumunda `ring-2 ring-[#cc9900]` altın rengi focus halkası gösterilir.

### 14.9 Dark Mode Notları

C11 Gallery dark mode'da minimal değişiklik gerektirir — görseller doğal olarak her iki modda da aynı görünür. Başlık rengi ve arka plan değişir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Section bg | `transparent` (sayfa bg) | `transparent` (sayfa bg) | — (parent bg devralır) |
| Başlık rengi | `#1e3a5f` (koyu mavi) | `#93c5fd` (açık mavi) | `dark:text-blue-300` |
| Grid gap | `gap-4` | `gap-4` | Sabit — değişmez |
| Item border-radius | `var(--radius-md)` | `var(--radius-md)` | Sabit — değişmez |
| Overlay gradient | `from-black/40` | `from-black/50` | `dark:from-black/50` (biraz daha koyu) |
| Caption text | `text-white` | `text-white` | Sabit — beyaz kalır |
| Image | Doğal renkler | Doğal renkler | Sabit — değişmez |
| Focus ring | `ring-[#cc9900]` | `ring-[#cc9900]` | Sabit — altın rengi değişmez |

> **Genel Not:** C11 Gallery bileşeni büyük oranda görsel odaklı olduğundan dark mode'da çok az değişiklik gerektirir. Başlık rengi koyu maviden açık maviye (`dark:text-blue-300`) döner ve overlay gradient'i biraz daha koyu olur (`dark:from-black/50`) ki görseller koyu arka plan üzerinde daha iyi ayrışsın. Geri kalan tüm elementler (görseller, caption metni, focus ring, border-radius) her iki modda da aynı kalır.

---

## 15. Component 12: Contact / Inquiry Form (C12)

> **Dosya:** `src/components/seller/ContactForm.ts`
> **BEM Block:** `contact-form`
> **Referans Görseller:** Görsel 10 (Calin — "Send message to supplier" formu)
> **Durum:** ✅ Zorunlu — Her satıcı mağazasında görünür. Alıcıların satıcıya mesaj göndermesini sağlayan temel iletişim bileşenidir.

Contact / Inquiry Form, satıcıya doğrudan mesaj göndermeyi sağlayan zorunlu bir form bileşenidir. Beyaz kart (`bg-white`, `border`, `shadow-md`) içinde ortalanmış, maksimum 800px genişliğinde render edilir. Kart üst kısmında "Send message to supplier" başlığı, altında "To: {{ contact.name }}" alıcı bilgisi (bold), ardından zorunlu mesaj textarea'sı (placeholder metni + 0/8000 karakter sayacı), turuncu "Send" butonu ve varsayılan olarak işaretli "Business Card" checkbox'ı bulunur. Form validasyonu mesajın zorunlu olmasını (min 10 karakter) ve 8000 karakter limitini denetler. Karakter sayacı canlı olarak güncellenir ve renk değişimiyle kullanıcıyı bilgilendirir. Mobilde form tam genişliğe yayılır ve padding küçültülür.

### 15.1 Form HTML Yapısı

#### 15.1.1 HTML Yapısı

```html
<section id="contact-form" class="contact-form py-12">
  <div class="max-w-[800px] mx-auto px-8">
    <div class="contact-form__card bg-white border border-[var(--card-border-color)] rounded-[var(--radius-lg)] shadow-md p-8">

      <!-- Başlık -->
      <h2 class="contact-form__title text-[18px] font-bold text-[#111827] text-center mb-6">
        Send message to supplier
      </h2>

      <!-- To: Kişi -->
      <div class="contact-form__recipient flex items-center gap-2 mb-4">
        <span class="text-[14px] text-[#6b7280]">To:</span>
        <span class="text-[14px] text-[#111827] font-semibold">{{ contact.name }}</span>
      </div>

      <!-- Message Alanı -->
      <div class="contact-form__message-wrapper mb-4">
        <label class="text-[14px] text-[#6b7280] mb-1 block">
          <span class="text-red-500">*</span> Message:
        </label>
        <div class="relative">
          <textarea
            class="contact-form__textarea w-full border border-[var(--input-border-color)] rounded-[var(--radius-input)] p-3 text-[14px] text-[#374151] min-h-[120px] resize-y focus:border-[var(--input-focus-border-color)] focus:outline-none focus:ring-2 focus:ring-[#cc9900]/20 transition-colors"
            placeholder="Enter your inquiry details such as product name, color, size, quantity, material, etc."
            maxlength="8000"
            aria-required="true"
            aria-describedby="char-counter"
          ></textarea>
          <span id="char-counter" class="contact-form__counter absolute right-3 bottom-3 text-[12px] text-[#9ca3af]">
            0/8000
          </span>
        </div>
      </div>

      <!-- Send Buton -->
      <div class="flex justify-center mb-4">
        <button class="contact-form__send bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-8 py-2 transition-colors">
          Send
        </button>
      </div>

      <!-- Business Card Checkbox -->
      <div class="contact-form__checkbox flex items-center gap-2 justify-center">
        <input type="checkbox" id="business-card" checked
               class="w-4 h-4 text-[#f97316] border-[#d1d5db] rounded focus:ring-[#f97316]" />
        <label for="business-card" class="text-[13px] text-[#6b7280]">
          I agree to share my Business Card to the supplier.
        </label>
      </div>

    </div>
  </div>
</section>
```

#### 15.1.2 HTML Yapı Notları

- **Section:** `py-12` (48px) dikey padding. `id="contact-form"` anchor hedefi — C13 Floating Actions'ın "Contact Supplier" butonu ve C10'un CTA'sı bu section'a smooth scroll eder. Section zorunludur ve her mağazada render edilir.
- **Dış container:** `max-w-[800px]` — formun maksimum genişliği 800px ile sınırlandırılmıştır. `mx-auto` ile ortalanır. `px-8` (32px) yatay padding. Mobilde `max-w` kaldırılır ve form tam genişliğe yayılır.
- **Kart container (`contact-form__card`):** `bg-white` beyaz arka plan. `border border-[var(--card-border-color)]` (#e5e5e5) ince kenarlık. `rounded-[var(--radius-lg)]` = 16px köşe yuvarlatma. `shadow-md` = `0 4px 6px rgba(0,0,0,0.07)` orta yoğunlukta gölge. `p-8` (32px) iç padding.
- **Başlık (`<h2>`):** `text-[18px]` font boyutu (normal sayfa başlıklarından daha küçük — form başlığı). `font-bold` (700 weight). `text-[#111827]` koyu metin rengi. `text-center` ortalı. `mb-6` (24px) alt boşluk.
- **Alıcı satırı (`contact-form__recipient`):** `flex items-center gap-2` yatay hizalama. "To:" etiketi `text-[14px] text-[#6b7280]` gri renkte. İsim `text-[14px] text-[#111827] font-semibold` koyu ve kalın — alıcının adı vurgulanır. `mb-4` (16px) alt boşluk.
- **Message label:** `text-[14px] text-[#6b7280]` gri metin. Kırmızı yıldız (`<span class="text-red-500">*</span>`) zorunlu alanı belirtir. `mb-1` (4px) label ile textarea arası boşluk.
- **Textarea:** `w-full` tam genişlik. `border border-[var(--input-border-color)]` (#e5e5e5) varsayılan kenarlık. `rounded-[var(--radius-input)]` = 8px. `p-3` (12px) iç padding. `text-[14px] text-[#374151]` koyu gri metin. `min-h-[120px]` minimum 120px yükseklik. `resize-y` — sadece dikey yeniden boyutlandırma. `maxlength="8000"` HTML seviyesinde karakter limiti. Focus durumunda `focus:border-[var(--input-focus-border-color)]` (#cc9900) altın kenarlık + `focus:ring-2 focus:ring-[#cc9900]/20` hafif altın halo.
- **Karakter sayacı:** `absolute right-3 bottom-3` — textarea'nın sağ alt köşesine sabitlenmiş. `text-[12px]` küçük font. `text-[#9ca3af]` varsayılan gri renk (dinamik olarak değişir). `id="char-counter"` — textarea'nın `aria-describedby` referansı.
- **Send butonu:** `bg-[#f97316]` turuncu arka plan (`--store-accent`). `hover:bg-[#ea580c]` hover'da koyu turuncu. `text-white` beyaz metin. `font-semibold` (600 weight). `text-[14px]` font boyutu. `rounded-[var(--radius-button)]` = 8px. `px-8 py-2` — 32px yatay, 8px dikey padding. `transition-colors` renk geçişi.
- **Checkbox:** `checked` varsayılan olarak işaretli. `w-4 h-4` 16×16px boyut. `text-[#f97316]` turuncu check rengi. `border-[#d1d5db]` gri kenarlık. `focus:ring-[#f97316]` turuncu focus halkası. Label `text-[13px] text-[#6b7280]` küçük gri metin.

#### 15.1.3 ASCII Layout (Görsel 10)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  py-12                                       │
│                                                                              │
│        ┌──────────────────────────────────────────────────────┐              │
│        │          max-w-[800px] mx-auto                       │              │
│        │  ┌──────────────────────────────────────────────┐    │              │
│        │  │   bg-white border shadow-md rounded-lg p-8   │    │              │
│        │  │                                              │    │              │
│        │  │        Send message to supplier               │    │              │
│        │  │        text-[18px] font-bold center           │    │              │
│        │  │                                              │    │              │
│        │  │   To: Edward Mo                               │    │              │
│        │  │   ───  font-semibold                          │    │              │
│        │  │                                              │    │              │
│        │  │   * Message:                                  │    │              │
│        │  │   ┌──────────────────────────────────────┐   │    │              │
│        │  │   │ Enter your inquiry details such as   │   │    │              │
│        │  │   │ product name, color, size, quantity,  │   │    │              │
│        │  │   │ material, etc.                        │   │    │              │
│        │  │   │                                      │   │    │              │
│        │  │   │                          0/8000  ░░░│   │    │              │
│        │  │   └──────────────────────────────────────┘   │    │              │
│        │  │             min-h-[120px] resize-y            │    │              │
│        │  │                                              │    │              │
│        │  │              ┌──────────┐                     │    │              │
│        │  │              │   Send   │                     │    │              │
│        │  │              └──────────┘                     │    │              │
│        │  │         bg-[#f97316] text-white px-8 py-2    │    │              │
│        │  │                                              │    │              │
│        │  │   ☑ I agree to share my Business Card...     │    │              │
│        │  │      text-[13px] text-[#6b7280] checked      │    │              │
│        │  │                                              │    │              │
│        │  └──────────────────────────────────────────────┘    │              │
│        └──────────────────────────────────────────────────────┘              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Validasyon Kuralları

#### 15.2.1 Alan Validasyon Tablosu

| Alan | Kural | Hata Mesajı | Hata Davranışı |
|------|-------|-------------|----------------|
| Message | Zorunlu — boş bırakılamaz | "Lütfen en az 10 karakter girin" | Textarea border kırmızıya döner (`border-[#ef4444]`) |
| Message | Minimum 10 karakter | "Lütfen en az 10 karakter girin" | Textarea border kırmızıya döner, focus tetiklenir |
| Message | Maksimum 8000 karakter | Counter kırmızıya döner | `maxlength="8000"` ile HTML'de engellenir + counter `text-[#ef4444]` |
| Checkbox | Opsiyonel — validasyon yok | — | — |

#### 15.2.2 Karakter Sayacı Davranışı

Karakter sayacı textarea'ya her input olayında dinamik olarak güncellenir:

| Karakter Aralığı | Sayaç Rengi | Renk Kodu | Tailwind Class |
|-------------------|-------------|-----------|----------------|
| 0 – 7499 | Gri (varsayılan) | `#9ca3af` | `text-[#9ca3af]` |
| 7500 – 7999 | Turuncu (uyarı) | `#f97316` | `text-[#f97316]` |
| 8000 (maksimum) | Kırmızı (limit) | `#ef4444` | `text-[#ef4444]` |

**Sayaç Format:** `{currentLength}/8000` — ör. `0/8000`, `1523/8000`, `8000/8000`

#### 15.2.3 Submit Davranışı (TypeScript)

```typescript
const form = document.querySelector('.contact-form__card');
const textarea = form?.querySelector('.contact-form__textarea') as HTMLTextAreaElement;
const counter = form?.querySelector('.contact-form__counter') as HTMLSpanElement;
const sendBtn = form?.querySelector('.contact-form__send') as HTMLButtonElement;

// Karakter sayacı - her input olayında güncellenir
textarea?.addEventListener('input', () => {
  const len = textarea.value.length;
  counter.textContent = `${len}/8000`;

  // Renk sınıflarını sıfırla
  counter.className = 'contact-form__counter absolute right-3 bottom-3 text-[12px]';

  // Karakter aralığına göre renk ata
  if (len >= 8000) {
    counter.classList.add('text-[#ef4444]');    // Kırmızı - limit
  } else if (len >= 7500) {
    counter.classList.add('text-[#f97316]');    // Turuncu - uyarı
  } else {
    counter.classList.add('text-[#9ca3af]');    // Gri - normal
  }
});

// Submit validasyonu
sendBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const msg = textarea.value.trim();

  if (msg.length < 10) {
    // Hata durumu: minimum 10 karakter gerekli
    textarea.classList.add('border-[#ef4444]', 'focus:ring-[#ef4444]/20');
    textarea.focus();
    return;
  }

  // Hata sınıflarını kaldır
  textarea.classList.remove('border-[#ef4444]', 'focus:ring-[#ef4444]/20');

  // Submit logic (placeholder)
  alert('Message sent successfully!');
  textarea.value = '';
  counter.textContent = '0/8000';
});
```

#### 15.2.4 Validasyon Akış Diyagramı

```
Kullanıcı "Send" tıklar
    │
    ▼
textarea.value.trim().length >= 10?
    │
    ├── HAYIR → Border kırmızıya döner (border-[#ef4444])
    │           Focus textarea'ya atanır
    │           Return (submit iptal)
    │
    └── EVET → Hata sınıfları kaldırılır
               Mesaj gönderilir (placeholder: alert)
               Textarea temizlenir
               Counter "0/8000" olarak sıfırlanır
```

### 15.3 Responsive

#### 15.3.1 Breakpoint Tablosu

| Breakpoint | Kart max-width | Kart Padding | Textarea min-height | Container Padding |
|------------|---------------|-------------|-------------------|-------------------|
| Desktop (>768px) | 800px | 32px (`p-8`) | 120px | 32px (`px-8`) |
| Tablet (480–768px) | 100% | 24px (`p-6`) | 100px | 24px (`px-6`) |
| Mobile (<480px) | 100% | 16px (`p-4`) | 80px | 16px (`px-4`) |

#### 15.3.2 Responsive Tailwind Sınıfları

```
contact-form container:
  Desktop  → max-w-[800px] mx-auto px-8
  Tablet   → sm:max-w-full sm:px-6
  Mobile   → xs:px-4

contact-form__card:
  Desktop  → p-8
  Tablet   → sm:p-6
  Mobile   → xs:p-4

contact-form__textarea:
  Desktop  → min-h-[120px]
  Tablet   → sm:min-h-[100px]
  Mobile   → xs:min-h-[80px]

contact-form__send:
  Desktop  → px-8 py-2 (inline-width)
  Mobile   → xs:w-full xs:py-3 (tam genişlik, daha yüksek)
```

#### 15.3.3 Responsive Davranış Detayları

| Özellik | Desktop (>768px) | Tablet (480–768px) | Mobile (<480px) |
|---------|-------------------|---------------------|-----------------|
| Kart max-width | `max-w-[800px]` (800px) | `100%` (tam genişlik) | `100%` (tam genişlik) |
| Kart padding | `p-8` (32px) | `p-6` (24px) | `p-4` (16px) |
| Textarea yüksekliği | `min-h-[120px]` | `min-h-[100px]` | `min-h-[80px]` |
| Container padding | `px-8` (32px) | `px-6` (24px) | `px-4` (16px) |
| Send butonu | `px-8 py-2` (inline) | `px-8 py-2` (inline) | `w-full py-3` (tam genişlik) |
| Başlık font | `text-[18px]` | `text-[18px]` (sabit) | `text-[16px]` (opsiyonel küçültme) |
| Checkbox label | `text-[13px]` tek satır | `text-[13px]` tek satır | `text-[12px]` sarmalanan |

> **Responsive Not:** Mobilde form kartı tam genişliğe yayılır (`max-w` kaldırılır), padding küçültülür ve textarea yüksekliği azaltılır. Send butonu mobilde tam genişlik alabilir (`w-full`) ve tıklama hedefi büyütülür (`py-3`). Genel form düzeni (`flex-col`) tüm breakpoint'lerde sabit kalır — yatay değişim gerektirmez.

### 15.4 Data Interface (TypeScript)

```typescript
/** Contact form alıcı bilgisi */
export interface ContactRecipient {
  /** Alıcı adı (ör. "Edward Mo") */
  name: string;
  /** Opsiyonel pozisyon/ünvan */
  title?: string;
}

/** Contact Form component props */
export interface ContactFormData {
  /** Form başlığı (varsayılan: "Send message to supplier") */
  title?: string;
  /** Alıcı bilgisi */
  recipient: ContactRecipient;
  /** Textarea placeholder metni */
  placeholder?: string;
  /** Maksimum karakter limiti (varsayılan: 8000) */
  maxLength?: number;
  /** Business card checkbox varsayılan durumu (varsayılan: true) */
  businessCardDefault?: boolean;
}
```

### 15.5 Mock Data Örneği

```json
{
  "contactForm": {
    "title": "Send message to supplier",
    "recipient": {
      "name": "Edward Mo",
      "title": "Sales Manager"
    },
    "placeholder": "Enter your inquiry details such as product name, color, size, quantity, material, etc.",
    "maxLength": 8000,
    "businessCardDefault": true
  }
}
```

### 15.6 Tailwind / CSS Sınıfları

| Element | Tailwind Sınıfları | Açıklama |
|---------|-------------------|----------|
| `section.contact-form` | `py-12` | 48px dikey padding |
| Container | `max-w-[800px] mx-auto px-8` | 800px maks genişlik, ortalı, 32px yatay padding |
| `contact-form__card` | `bg-white border border-[var(--card-border-color)] rounded-[var(--radius-lg)] shadow-md p-8` | Beyaz kart, kenarlık, gölge, 16px radius, 32px iç padding |
| `contact-form__title` | `text-[18px] font-bold text-[#111827] text-center mb-6` | 18px kalın başlık, ortalı |
| `contact-form__recipient` | `flex items-center gap-2 mb-4` | Yatay hizalama, 8px boşluk |
| Recipient "To:" label | `text-[14px] text-[#6b7280]` | Gri etiket |
| Recipient isim | `text-[14px] text-[#111827] font-semibold` | Koyu kalın isim |
| Message label | `text-[14px] text-[#6b7280] mb-1 block` | Gri label, alt boşluk |
| Zorunlu yıldız | `text-red-500` | Kırmızı `*` işareti |
| `contact-form__textarea` | `w-full border border-[var(--input-border-color)] rounded-[var(--radius-input)] p-3 text-[14px] text-[#374151] min-h-[120px] resize-y focus:border-[var(--input-focus-border-color)] focus:outline-none focus:ring-2 focus:ring-[#cc9900]/20 transition-colors` | Tam genişlik textarea, focus altın kenarlık |
| `contact-form__counter` | `absolute right-3 bottom-3 text-[12px] text-[#9ca3af]` | Sağ alt köşe karakter sayacı |
| `contact-form__send` | `bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-[14px] rounded-[var(--radius-button)] px-8 py-2 transition-colors` | Turuncu send butonu |
| Checkbox input | `w-4 h-4 text-[#f97316] border-[#d1d5db] rounded focus:ring-[#f97316]` | Turuncu checkbox |
| Checkbox label | `text-[13px] text-[#6b7280]` | Küçük gri metin |

### 15.7 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Textarea input** | `.contact-form__textarea` | `input` | Karakter sayacı güncellenir: `{len}/8000` | Her tuş vuruşunda tetiklenir |
| 2 | **Counter renk değişimi** | `.contact-form__counter` | (input tetikler) | 0-7499: gri, 7500-7999: turuncu, 8000: kırmızı | Renk sınıfları sıfırlanıp yeniden atanır |
| 3 | **Send tıklama** | `.contact-form__send` | `click` | Validasyon → 10 karakter altı ise hata, değilse submit | `e.preventDefault()` ile form submit engellenir |
| 4 | **Validasyon hatası** | `.contact-form__textarea` | (send tetikler) | Border kırmızıya döner, textarea'ya focus | `border-[#ef4444]` + `focus:ring-[#ef4444]/20` |
| 5 | **Başarılı submit** | Form | (send tetikler) | Alert, textarea temizlenir, counter sıfırlanır | Placeholder — gerçek API entegrasyonu sonra |
| 6 | **Send hover** | `.contact-form__send` | `mouseenter` | Arka plan `#f97316` → `#ea580c` | Pure CSS — `hover:bg-[#ea580c] transition-colors` |
| 7 | **Textarea focus** | `.contact-form__textarea` | `focus` | Kenarlık altın rengi, hafif altın halo | `focus:border-[var(--input-focus-border-color)] focus:ring-2 focus:ring-[#cc9900]/20` |
| 8 | **Checkbox toggle** | `#business-card` | `change` | Check/uncheck state değişir | Native checkbox davranışı, ek JS gerekmez |

#### 15.7.1 Contact Form Etkileşim Kodu

```typescript
/**
 * Contact Form Submit + Validation (C12)
 * Textarea karakter sayacı ve form validasyonu
 */
export function initContactForm(): void {
  const textarea = document.querySelector('.contact-form__textarea') as HTMLTextAreaElement;
  const counter = document.querySelector('.contact-form__counter') as HTMLSpanElement;
  const sendBtn = document.querySelector('.contact-form__send') as HTMLButtonElement;

  if (!textarea || !counter || !sendBtn) return;

  // Karakter sayacı — her input olayında güncellenir
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len}/8000`;
    counter.className = 'contact-form__counter absolute right-3 bottom-3 text-[12px]';

    if (len >= 8000) {
      counter.classList.add('text-[#ef4444]');    // Kırmızı - limit
    } else if (len >= 7500) {
      counter.classList.add('text-[#f97316]');    // Turuncu - uyarı
    } else {
      counter.classList.add('text-[#9ca3af]');    // Gri - normal
    }
  });

  // Submit validasyonu
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = textarea.value.trim();
    if (msg.length < 10) {
      textarea.classList.add('border-[#ef4444]', 'focus:ring-[#ef4444]/20');
      textarea.focus();
      return;
    }
    textarea.classList.remove('border-[#ef4444]', 'focus:ring-[#ef4444]/20');
    // Placeholder submit
    alert('Message sent successfully!');
    textarea.value = '';
    counter.textContent = '0/8000';
  });
}
```

### 15.8 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Send butonu | `bg-[#f97316]` | `bg-[#ea580c]` | `ring-2 ring-[#f97316] ring-offset-2` | `bg-[#c2410c]` |
| Textarea | `border-[var(--input-border-color)]` (#e5e5e5) | — | `border-[#cc9900] ring-2 ring-[#cc9900]/20` | — |
| Textarea (hata) | `border-[#ef4444]` | — | `ring-[#ef4444]/20` | — |
| Checkbox | `border-[#d1d5db]` | — | `ring-[#f97316]` | `text-[#f97316]` (checked) |
| Recipient isim | `text-[#111827] font-semibold` | — | — | — |

### 15.9 Dark Mode Notları

C12 Contact Form dark mode'da kart arka planı, textarea arka planı ve metin renkleri değişir:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Kart bg | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| Kart border | `var(--card-border-color)` (#e5e5e5) | `#374151` | `dark:border-gray-700` |
| Kart shadow | `shadow-md` | `shadow-lg` | `dark:shadow-lg` |
| Başlık rengi | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| "To:" label | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| Recipient isim | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| Message label | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| Textarea bg | `#ffffff` (via `--input-bg`) | `#374151` | `dark:bg-gray-700` |
| Textarea metin | `#374151` | `#d1d5db` | `dark:text-gray-300` |
| Textarea border | `#e5e5e5` | `#4b5563` | `dark:border-gray-600` |
| Counter rengi | `#9ca3af` | `#6b7280` | `dark:text-gray-500` |
| Send butonu | `#f97316` | `#f97316` | Sabit — turuncu değişmez |
| Checkbox label | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |

> **Genel Not:** C12 Contact Form dark mode'da kart beyaz arka planı koyu griye (`dark:bg-gray-800`) döner. Textarea arka planı da koyu griye (`dark:bg-gray-700`) geçer ve metin renkleri açık griye döner. Send butonu turuncu olarak kalır — her iki modda da değişmez. Karakter sayacının turuncu/kırmızı uyarı renkleri de sabit kalır. Checkbox checked rengi (`#f97316`) her iki modda aynıdır.

---

## 16. Component 13: Floating Action Buttons (C13)

> **Dosya:** `src/components/seller/FloatingActions.ts`
> **BEM Block:** `floating-actions`
> **Referans Görseller:** Görsel 10 (Calin — sağ kenarda "Contact Supplier" ve "Chat Now!" butonları)
> **Durum:** ✅ Zorunlu — Sayfanın her noktasında erişilebilir sabit konum butonları. Sayfa scroll edildiğinde de görünür kalır.

Floating Action Buttons, sayfanın sağ kenarında sabit konumda (`fixed right:0, top:40%`) dikey olarak yığılmış iki butondan oluşan zorunlu bir bileşendir. Üst buton "Contact Supplier" (`bg-[#f97316]` turuncu), alt buton "Chat Now!" (`bg-[#ea580c]` daha koyu turuncu). Her buton 55-60px genişliğinde, 80px yüksekliğinde, yalnızca sol tarafları yuvarlatılmış (`rounded-tl`, `rounded-bl`). İçlerinde SVG ikon ve küçük metin yer alır. `z-index: 40` (`var(--z-fixed)`) ile dropdown'ların üstünde ama modal'ların altında konumlanır. Mobilde (<480px) butonlar ekranın alt kısmına sabit yatay bar olarak dönüşür.

### 16.1 HTML + CSS (fixed positioning)

#### 16.1.1 HTML Yapısı

```html
<div id="floating-actions" class="floating-actions fixed right-0 top-[40%] z-[var(--z-fixed)] flex flex-col">
  <!-- Contact Supplier -->
  <button class="floating-actions__btn floating-actions__btn--contact bg-[#f97316] hover:bg-[#ea580c] text-white w-[56px] h-[80px] rounded-tl-[var(--radius-md)] rounded-bl-[var(--radius-md)] flex flex-col items-center justify-center gap-1 transition-colors shadow-lg"
          aria-label="Contact Supplier">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    <span class="text-[9px] font-medium leading-tight text-center">Contact<br/>Supplier</span>
  </button>

  <!-- Chat Now -->
  <button class="floating-actions__btn floating-actions__btn--chat bg-[#ea580c] hover:bg-[#dc2626] text-white w-[56px] h-[80px] rounded-bl-[var(--radius-md)] flex flex-col items-center justify-center gap-1 transition-colors shadow-lg"
          aria-label="Chat Now">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <span class="text-[9px] font-medium leading-tight text-center">Chat<br/>Now!</span>
  </button>
</div>
```

#### 16.1.2 HTML Yapı Notları

- **Container (`#floating-actions`):** `fixed` — viewport'a sabitlenmiş, scroll'dan bağımsız. `right-0` — sağ kenara yapışık (butonlar sayfanın sağından dışarı çıkmaz). `top-[40%]` — dikey olarak viewport'un %40 noktasında. `z-[var(--z-fixed)]` = z-index: 40. `flex flex-col` — butonlar dikey yığılır.
- **Contact Supplier butonu:** `bg-[#f97316]` açık turuncu arka plan (`--store-accent`). `hover:bg-[#ea580c]` hover'da koyu turuncu. `w-[56px]` genişlik ~56px. `h-[80px]` yükseklik 80px. `rounded-tl-[var(--radius-md)]` — yalnızca sol üst köşe yuvarlatılmış (8px). `rounded-bl-[var(--radius-md)]` — sol alt köşe de yuvarlatılmış. Sağ köşeler kare kalır (kenara yapışık olduğu için). `flex flex-col items-center justify-center gap-1` — ikon ve metin dikey ortalı, 4px boşluk. `shadow-lg` — belirgin gölge efekti.
- **Chat Now butonu:** `bg-[#ea580c]` daha koyu turuncu arka plan (`--store-accent-hover`). `hover:bg-[#dc2626]` hover'da kırmızıya yakın. `rounded-bl-[var(--radius-md)]` — yalnızca sol alt köşe yuvarlatılmış. Üst köşeler kare — Contact Supplier butonuyla birleşir. Boyut ve iç düzen Contact Supplier ile aynıdır.
- **İkon (`<svg>`):** `w-6 h-6` (24×24px). `fill="none" stroke="currentColor"` — outline stil ikon, beyaz renk (`text-white` parent'tan devralır). Contact Supplier: mail/zarf ikonu. Chat Now: mesaj balonu ikonu.
- **Metin (`<span>`):** `text-[9px]` çok küçük font (buton dar olduğu için). `font-medium` (500 weight). `leading-tight` sıkışık satır aralığı. `text-center` ortalı. `<br/>` ile iki satıra bölünmüş: "Contact / Supplier" ve "Chat / Now!".
- **ARIA:** Her buton `aria-label` ile tam açıklama taşır — ekran okuyucular küçük metni değil `aria-label` değerini okur.

#### 16.1.3 Boyut Detay Tablosu

| Özellik | Contact Supplier | Chat Now | Açıklama |
|---------|-----------------|----------|----------|
| Genişlik | `w-[56px]` (~56px) | `w-[56px]` (~56px) | Dar buton — sadece ikon + küçük metin |
| Yükseklik | `h-[80px]` (80px) | `h-[80px]` (80px) | Eşit yükseklik — dikey yığılma |
| Arka plan | `#f97316` (açık turuncu) | `#ea580c` (koyu turuncu) | İki ton ayrımı ile görsel hiyerarşi |
| Hover arka plan | `#ea580c` | `#dc2626` | Koyulaşma hover efekti |
| Sol köşe radius | `rounded-tl-md rounded-bl-md` | `rounded-bl-md` | Sol köşeler yuvarlatılmış |
| Sağ köşe radius | `0` (kare) | `0` (kare) | Sağ kenara yapışık |
| İkon boyutu | `w-6 h-6` (24px) | `w-6 h-6` (24px) | Eşit ikon boyutu |
| Metin boyutu | `text-[9px]` | `text-[9px]` | Çok küçük — dar alana sığması için |
| Gölge | `shadow-lg` | `shadow-lg` | Belirgin — sayfadan ayrışır |

#### 16.1.4 ASCII Layout

```
                    Sayfa sağ kenarı
                              │
                              │  right-0
                              │
    top-[40%] ─────────── ┌───┤
                          │ ✉ │
                          │Con│  w-[56px]
                          │tac│  h-[80px]
                          │t  │  bg-[#f97316]
                          │Sup│  rounded-tl-md
                          │pli│  rounded-bl-md
                          │er │
                          ├───┤
                          │ 💬│
                          │Cha│  w-[56px]
                          │t  │  h-[80px]
                          │Now│  bg-[#ea580c]
                          │!  │  rounded-bl-md
                          │   │
                          └───┤
                              │
                              │  z-[var(--z-fixed)] = 40
                              │  (dropdown üstünde, modal altında)
```

### 16.2 z-index Yönetimi

#### 16.2.1 z-index Katman Tablosu

Tüm sayfadaki z-index katmanlaması tutarlı olmalıdır. Floating Actions `z-40` seviyesinde konumlanır:

| Element | z-index | Token | Açıklama |
|---------|---------|-------|----------|
| Store Nav (sticky) | 20 | `var(--z-sticky)` | Scroll sonrası yapışkan navigasyon |
| Dropdowns | 30 | `var(--z-dropdown)` | Nav dropdown menüleri |
| **Floating Actions** | **40** | **`var(--z-fixed)`** | **Sabit konum butonları — dropdown'ların üstünde** |
| Modal / Lightbox | 50 | `var(--z-modal)` | Tam ekran modal'lar — en üst katman |

#### 16.2.2 z-index Kuralları

- Floating Actions **her zaman** dropdown menülerin üstünde görünür (`z-40 > z-30`)
- Modal/Lightbox açıldığında Floating Actions'ın **altında** kalır (`z-40 < z-50`)
- Store Nav sticky durumda Floating Actions'ın **altında** kalır (`z-20 < z-40`)
- Floating Actions kendi aralarında z-index farkı gerektirmez — dikey yığılma ile ayrışır

#### 16.2.3 z-index Görsel Hiyerarşi

```
z-50 ─── Modal / Lightbox (en üst)
          │
z-40 ─── Floating Actions (C13) ← BU BİLEŞEN
          │
z-30 ─── Dropdown Menüler (C2)
          │
z-20 ─── Sticky Store Nav (C2)
          │
z-auto ── Normal sayfa içeriği
```

### 16.3 Mobile Davranış

#### 16.3.1 Breakpoint Davranış Tablosu

| Breakpoint | Konum | Boyut | İçerik | Layout |
|------------|-------|-------|--------|--------|
| Desktop (>768px) | Fixed sağ kenar, `right-0 top-[40%]` | `w-[56px] h-[80px]` her buton | İkon + küçük metin ("Contact Supplier", "Chat Now!") | Dikey yığılma (`flex-col`) |
| Tablet (480–768px) | Fixed sağ kenar, `right-0 top-[40%]` | `w-[44px] h-[60px]` küçültülmüş | Sadece ikon — metin gizli (`span: hidden`) | Dikey yığılma (`flex-col`) |
| Mobile (<480px) | **Bottom bar — `fixed bottom-0 left-0 right-0`** | `h-[48px]`, her buton `width: 50%` | İkon + metin yan yana (row) | **Yatay** (`flex-row`) |

#### 16.3.2 Mobile Bottom Bar CSS

```css
/* Tablet küçültme */
@media (max-width: 768px) and (min-width: 481px) {
  .floating-actions__btn {
    width: 44px;
    height: 60px;
  }
  .floating-actions__btn span {
    display: none;  /* Metin gizli, sadece ikon */
  }
}

/* Mobile bottom bar dönüşümü */
@media (max-width: 480px) {
  .floating-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    flex-direction: row;
    z-index: var(--z-fixed);
  }
  .floating-actions__btn {
    width: 50%;
    height: 48px;
    border-radius: 0;
    flex-direction: row;
    gap: 8px;
  }
  .floating-actions__btn span {
    display: inline;
    font-size: 13px;
  }
}
```

#### 16.3.3 Mobile Bottom Bar ASCII Layout

```
Desktop (>768px):                     Mobile (<480px):

     Sayfa                            ┌──────────────────────────────────┐
     sağ kenarı                       │         Sayfa İçeriği            │
              │                       │                                  │
              │                       │                                  │
   ┌───┤      │                       │                                  │
   │ ✉ │      │                       ├──────────────┬───────────────────┤
   │Con│      │                       │ ✉ Contact    │ 💬 Chat Now!      │
   │tac│  right-0                     │  Supplier    │                   │
   │t  │      │                       │    50%       │     50%           │
   └───┤      │                       └──────────────┴───────────────────┘
   │ 💬│      │                           fixed bottom-0 left-0 right-0
   │Cha│      │                           h-[48px] flex-row
   │t  │      │
   └───┤      │
              │
```

#### 16.3.4 Mobile Bottom Bar Detayları

| Özellik | Değer | Açıklama |
|---------|-------|----------|
| Konum | `fixed bottom-0 left-0 right-0` | Ekranın en altına sabitlenmiş |
| `top` | `auto` | Desktop'taki `top-[40%]` geçersiz kılınır |
| Yön | `flex-direction: row` | Dikey → yatay dönüşüm |
| Yükseklik | `48px` | Kompakt mobil bar |
| Buton genişliği | `50%` | İki buton eşit bölünmüş |
| Border-radius | `0` | Tam kenara yapışık — köşe yok |
| Buton iç yönü | `flex-direction: row` | İkon ve metin yan yana |
| Buton iç boşluk | `gap: 8px` | İkon ile metin arası |
| Metin boyutu | `13px` | Mobilde daha büyük (desktop 9px → mobile 13px) |
| Metin görünürlük | `display: inline` | Desktop'ta 2 satır → mobilde tek satır |

> **Mobile Not:** Bottom bar dönüşümü `@media (max-width: 480px)` ile CSS üzerinden yapılır. JavaScript müdahalesi gerekmez. Tablet boyutunda (480-768px) butonlar küçültülür ve metin gizlenir, sadece ikon gösterilir. Mobilde ise bottom bar'da ikon + metin yan yana tek satırda gösterilir. Bottom bar tüm sayfa genişliğini kaplar ve `z-40` seviyesinde kalır. Bottom bar varken sayfa alt padding'ine `pb-[48px]` eklenmesi önerilir ki içerik bar'ın altında kalmasın.

### 16.4 Data Interface (TypeScript)

```typescript
/** Tek bir floating action buton tanımı */
export interface FloatingActionButton {
  /** Benzersiz tanımlayıcı (ör. "contact", "chat") */
  id: string;
  /** Buton etiketi (ör. "Contact Supplier") */
  label: string;
  /** SVG ikon HTML string'i */
  icon: string;
  /** Buton arka plan rengi (Tailwind class) */
  bgColor: string;
  /** Hover arka plan rengi (Tailwind class) */
  hoverColor: string;
  /** Tıklama aksiyonu: "scroll-to-contact" | "open-chat" */
  action: 'scroll-to-contact' | 'open-chat';
  /** ARIA label */
  ariaLabel: string;
}

/** Floating Actions component props */
export interface FloatingActionsData {
  /** Buton listesi (varsayılan: Contact Supplier + Chat Now) */
  buttons: FloatingActionButton[];
  /** Dikey pozisyon (varsayılan: "40%") */
  topPosition?: string;
}
```

### 16.5 Mock Data Örneği

```json
{
  "floatingActions": {
    "buttons": [
      {
        "id": "contact",
        "label": "Contact Supplier",
        "icon": "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\"/></svg>",
        "bgColor": "bg-[#f97316]",
        "hoverColor": "hover:bg-[#ea580c]",
        "action": "scroll-to-contact",
        "ariaLabel": "Contact Supplier"
      },
      {
        "id": "chat",
        "label": "Chat Now!",
        "icon": "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z\"/></svg>",
        "bgColor": "bg-[#ea580c]",
        "hoverColor": "hover:bg-[#dc2626]",
        "action": "open-chat",
        "ariaLabel": "Chat Now"
      }
    ],
    "topPosition": "40%"
  }
}
```

### 16.6 Tailwind / CSS Sınıfları

| Element | Tailwind Sınıfları | Açıklama |
|---------|-------------------|----------|
| `#floating-actions` | `fixed right-0 top-[40%] z-[var(--z-fixed)] flex flex-col` | Sabit konum, sağ kenar, z-40, dikey yığılma |
| `floating-actions__btn--contact` | `bg-[#f97316] hover:bg-[#ea580c] text-white w-[56px] h-[80px] rounded-tl-[var(--radius-md)] rounded-bl-[var(--radius-md)] flex flex-col items-center justify-center gap-1 transition-colors shadow-lg` | Turuncu Contact buton, sol köşeler yuvarlatılmış |
| `floating-actions__btn--chat` | `bg-[#ea580c] hover:bg-[#dc2626] text-white w-[56px] h-[80px] rounded-bl-[var(--radius-md)] flex flex-col items-center justify-center gap-1 transition-colors shadow-lg` | Koyu turuncu Chat buton, sol alt köşe yuvarlatılmış |
| İkon (`<svg>`) | `w-6 h-6` | 24×24px outline ikon, `currentColor` (beyaz) |
| Metin (`<span>`) | `text-[9px] font-medium leading-tight text-center` | Çok küçük metin, `<br/>` ile 2 satıra bölünmüş |

### 16.7 Etkileşimler

| # | Tetikleyici | Eleman | Olay | Davranış | Notlar |
|---|-------------|--------|------|----------|--------|
| 1 | **Contact Supplier tıklama** | `.floating-actions__btn--contact` | `click` | Sayfa C12 Contact Form'a smooth scroll | `document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })` |
| 2 | **Chat Now tıklama** | `.floating-actions__btn--chat` | `click` | Chat widget açılır (placeholder) | Gerçek implementasyonda canlı sohbet entegrasyonu |
| 3 | **Contact Supplier hover** | `.floating-actions__btn--contact` | `mouseenter` | Arka plan `#f97316` → `#ea580c` | Pure CSS — `hover:bg-[#ea580c] transition-colors` |
| 4 | **Chat Now hover** | `.floating-actions__btn--chat` | `mouseenter` | Arka plan `#ea580c` → `#dc2626` | Pure CSS — `hover:bg-[#dc2626] transition-colors` |
| 5 | **Keyboard focus** | Her iki buton | `focus` | `ring-2 ring-white ring-offset-2` focus halkası | Koyu arka plan üzerinde beyaz halo |

#### 16.7.1 Floating Actions Etkileşim Kodu

```typescript
/**
 * Floating Button Click Handlers (C13)
 * Contact Supplier → C12'ye scroll, Chat Now → chat widget (placeholder)
 */
export function initFloatingActions(): void {
  const contactBtn = document.querySelector('.floating-actions__btn--contact');
  const chatBtn = document.querySelector('.floating-actions__btn--chat');

  // Contact Supplier — C12 Contact Form'a smooth scroll
  contactBtn?.addEventListener('click', () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Chat Now — placeholder
  chatBtn?.addEventListener('click', () => {
    // Placeholder: canlı sohbet widget'ı açılır
    // Gerçek implementasyonda Alibaba chat SDK entegrasyonu
  });
}
```

### 16.8 Hover / Focus Durumları

| Element | Normal | Hover | Focus | Active |
|---------|--------|-------|-------|--------|
| Contact Supplier btn | `bg-[#f97316]` | `bg-[#ea580c]` | `ring-2 ring-white ring-offset-2` | `bg-[#c2410c]` |
| Chat Now btn | `bg-[#ea580c]` | `bg-[#dc2626]` | `ring-2 ring-white ring-offset-2` | `bg-[#b91c1c]` |
| İkon | `text-white` (currentColor) | `text-white` (sabit) | — | — |
| Metin | `text-white text-[9px]` | `text-white` (sabit) | — | — |

> **Focus Notu:** Floating buttons koyu turuncu arka plan üzerinde olduğundan focus halkası beyaz (`ring-white`) seçilmiştir. Bu, hem light hem dark modda koyu arka plan üzerinde yüksek kontrast sağlar. `ring-offset-2` ile halo butonun kenarından biraz ayrışır.

### 16.9 Dark Mode Notları

C13 Floating Actions dark mode'da minimal değişiklik gerektirir — butonlar zaten koyu arka plan üzerinde beyaz ikonludur:

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Contact btn bg | `#f97316` | `#f97316` | Sabit — değişmez |
| Chat btn bg | `#ea580c` | `#ea580c` | Sabit — değişmez |
| İkon rengi | `text-white` | `text-white` | Sabit — değişmez |
| Metin rengi | `text-white` | `text-white` | Sabit — değişmez |
| Gölge | `shadow-lg` | `shadow-xl` | `dark:shadow-xl` (biraz daha belirgin) |
| Focus ring | `ring-white` | `ring-white` | Sabit — beyaz kalır |

> **Genel Not:** C13 Floating Action Buttons bileşeni dark mode'da neredeyse hiç değişiklik gerektirmez. Turuncu arka plan renkleri, beyaz ikon ve metin renkleri her iki modda da aynı kalır. Tek fark, gölgenin dark mode'da biraz daha belirgin olmasıdır (`shadow-lg` → `dark:shadow-xl`) ki butonlar koyu arka plan üzerinde daha iyi ayrışsın. Mobile bottom bar'daki davranış da her iki modda aynıdır.

---

## 17. Mock Data (JSON)

> Tüm mock data **Türkçe** içerik ile hazırlanmıştır. Gerçekçi satıcı verileri kullanılmıştır. Bu veriler `src/data/seller/mockData.ts` dosyasında tutulacak ve component'ler tarafından import edilecektir.

### 17.1 Satıcı Profil Verisi

```typescript
interface SellerProfile {
  name: string;
  logo: string;
  verificationType: 'Verified' | 'Verified PRO';
  verificationBadgeType: 'standard' | 'pro';
  yearsOnPlatform: number;
  location: string;
  mainCategories: string[];
  email?: string;
  deliveryBadge?: string;
  assessmentBadge?: string;
  verificationDate: string;
}
```

```json
{
  "seller": {
    "name": "Anadolu Endüstriyel Ölçüm Sistemleri A.Ş.",
    "logo": "/assets/mock/anadolu-logo.png",
    "verificationType": "Verified",
    "verificationBadgeType": "standard",
    "yearsOnPlatform": 12,
    "location": "İstanbul, Türkiye",
    "mainCategories": ["Elektrik Sayaçları", "Su Sayaçları", "Doğalgaz Sayaçları"],
    "email": "info@anadoluolcum.com.tr",
    "deliveryBadge": "Elektrik Sayaçları kategorisinde #3 en yüksek zamanında teslimat oranı",
    "assessmentBadge": "Tedarikçi değerlendirme prosedürleri tamamlandı",
    "verificationDate": "2025.06.15"
  }
}
```

### 17.2 Navigation Menü Verisi

```json
{
  "navigation": {
    "items": [
      { "label": "Ana Sayfa", "href": "#", "isActive": true },
      { "label": "Ürünler", "href": "#", "hasDropdown": true },
      { "label": "Şirket Profili", "href": "#", "hasDropdown": true },
      { "label": "İletişim", "href": "#contacts" },
      { "label": "Kampanyalar", "href": "#" }
    ],
    "productCategories": [
      {
        "name": "Ön Ödemeli Elektrik Sayaçları",
        "hasSubcategories": true,
        "subcategories": [
          { "name": "Tek Fazlı Ön Ödemeli Sayaç", "href": "#" },
          { "name": "Üç Fazlı Ön Ödemeli Sayaç", "href": "#" },
          { "name": "STS Tokenli Sayaç", "href": "#" }
        ]
      },
      {
        "name": "Akıllı Elektrik Sayaçları",
        "hasSubcategories": true,
        "subcategories": [
          { "name": "Wi-Fi Modüllü Sayaç", "href": "#" },
          { "name": "LoRa Haberleşmeli Sayaç", "href": "#" },
          { "name": "GPRS/4G Sayaç", "href": "#" }
        ]
      },
      {
        "name": "Endüstriyel Enerji Sayaçları",
        "hasSubcategories": true,
        "subcategories": [
          { "name": "CT Bağlantılı Sayaç", "href": "#" },
          { "name": "Reaktif Enerji Sayacı", "href": "#" }
        ]
      },
      {
        "name": "Su Sayaçları",
        "hasSubcategories": true,
        "subcategories": [
          { "name": "Ultrasonik Su Sayacı", "href": "#" },
          { "name": "Mekanik Su Sayacı", "href": "#" }
        ]
      },
      { "name": "Doğalgaz Sayaçları", "hasSubcategories": false },
      { "name": "Yedek Parça ve Aksesuarlar", "hasSubcategories": false }
    ],
    "companyProfileItems": [
      { "label": "Şirkete Genel Bakış", "href": "#company-info" },
      { "label": "Değerlendirmeler ve Yorumlar", "href": "#" }
    ]
  }
}
```

### 17.3 Hero Slider Slides

```json
{
  "heroSlides": [
    {
      "id": "slide-1",
      "image": "/assets/mock/hero-oem-odm.jpg",
      "title": "OEM/ODM",
      "subtitle": "Hassas ölçüm teknolojisi\nKurum içi Ar-Ge inovasyon\nKüresel OEM/ODM ortaklıkları",
      "textPosition": "left",
      "textColor": "dark"
    },
    {
      "id": "slide-2",
      "image": "/assets/mock/hero-marka.jpg",
      "title": "SİZİN MARKANIZ\nSİZİN RENGİNİZ\nSİZİN YOLUNUZ",
      "textPosition": "left",
      "textColor": "dark"
    },
    {
      "id": "slide-3",
      "image": "/assets/mock/hero-akilli-sayac.jpg",
      "title": "AKILLI ÖLÇÜM ÇÖZÜMLERİ",
      "subtitle": "Geleceğin enerji altyapısı.\nSizin ihtiyaçlarınıza özel tasarım.",
      "textPosition": "center",
      "textColor": "white"
    }
  ]
}
```

### 17.4 Kategori Kartları (C4)

```json
{
  "categoryCards": [
    { "id": "cat-1", "name": "ÖN ÖDEMELİ ELEKTRİK SAYAÇLARI", "bgColor": "#d4e157", "image": "/assets/mock/cat-on-odemeli.png" },
    { "id": "cat-2", "name": "AKILLI ELEKTRİK SAYAÇLARI", "bgColor": "#90caf9", "image": "/assets/mock/cat-akilli-elektrik.png" },
    { "id": "cat-3", "name": "ENDÜSTRİYEL ENERJİ SAYAÇLARI", "bgColor": "#bdbdbd", "image": "/assets/mock/cat-endustriyel.png" },
    { "id": "cat-4", "name": "ULTRASONİK SU SAYAÇLARI", "bgColor": "#80deea", "image": "/assets/mock/cat-ultrasonik-su.png" },
    { "id": "cat-5", "name": "MEKANİK SU SAYAÇLARI", "bgColor": "#a5d6a7", "image": "/assets/mock/cat-mekanik-su.png" },
    { "id": "cat-6", "name": "DOĞALGAZ SAYAÇLARI", "bgColor": "#ffcc80", "image": "/assets/mock/cat-dogalgaz.png" },
    { "id": "cat-7", "name": "YEDEK PARÇA VE AKSESUARLAR", "bgColor": "#f48fb1", "image": "/assets/mock/cat-yedek-parca.png" }
  ]
}
```

### 17.5 Hot Products (C5)

```json
{
  "hotProducts": [
    { "id": "hp-1", "name": "DIN Ray Tipi Ön Ödemeli Sayaç (CIU Modüllü)", "image": "/assets/mock/prod-din-ray.jpg", "link": "#" },
    { "id": "hp-2", "name": "Tek Fazlı Ön Ödemeli Çift Kaynaklı Enerji Sayacı", "image": "/assets/mock/prod-tek-faz.jpg", "link": "#" },
    { "id": "hp-3", "name": "Üç Fazlı Ön Ödemeli Enerji Sayacı", "image": "/assets/mock/prod-uc-faz.jpg", "link": "#" },
    { "id": "hp-4", "name": "Ultrasonik Su Sayacı DN15-DN300", "image": "/assets/mock/prod-ultrasonik.jpg", "link": "#" },
    { "id": "hp-5", "name": "Akıllı Ön Ödemeli Tokenli Elektrik Sayacı", "image": "/assets/mock/prod-akilli-token.jpg", "link": "#" },
    { "id": "hp-6", "name": "Endüstriyel Doğalgaz Sayacı G4-G100", "image": "/assets/mock/prod-dogalgaz.jpg", "link": "#" },
    { "id": "hp-7", "name": "LoRa Haberleşmeli Uzaktan Okuma Sayacı", "image": "/assets/mock/prod-lora.jpg", "link": "#" },
    { "id": "hp-8", "name": "Çok Tarifeli Akıllı Elektrik Sayacı", "image": "/assets/mock/prod-cok-tarifeli.jpg", "link": "#" },
    { "id": "hp-9", "name": "Kompakt Tip Isı Sayacı DN20-DN100", "image": "/assets/mock/prod-isi-sayaci.jpg", "link": "#" }
  ]
}
```

### 17.6 Kategori Ürün Listeleri (C6)

```json
{
  "categoryListings": [
    {
      "id": "cl-1",
      "name": "ÖN ÖDEMELİ ELEKTRİK SAYAÇLARI",
      "bannerImage": "/assets/mock/banner-on-odemeli.jpg",
      "products": [
        {
          "id": "clp-1",
          "name": "STS Tokenli Tek Fazlı Ön Ödemeli Elektrik Sayacı 230V",
          "image": "/assets/mock/on-odemeli-1.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" },
            { "type": "certified", "label": "CE Sertifikalı" }
          ],
          "priceMin": 18.50,
          "priceMax": 24.00,
          "moq": 500,
          "moqUnit": "adet",
          "soldCount": 28212,
          "link": "#"
        },
        {
          "id": "clp-2",
          "name": "Üç Fazlı Ön Ödemeli Enerji Sayacı Klavyeli Giriş",
          "image": "/assets/mock/on-odemeli-2.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "certified", "label": "IEC Onaylı" }
          ],
          "priceMin": 32.00,
          "priceMax": 45.00,
          "moq": 300,
          "moqUnit": "adet",
          "soldCount": 15843,
          "link": "#"
        },
        {
          "id": "clp-3",
          "name": "DIN Ray Montajlı Ön Ödemeli Sayaç CIU Üniteli",
          "image": "/assets/mock/on-odemeli-3.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" }
          ],
          "priceMin": 22.00,
          "priceMax": 28.50,
          "moq": 500,
          "moqUnit": "adet",
          "soldCount": 12567,
          "link": "#"
        },
        {
          "id": "clp-4",
          "name": "Çift Kaynaklı Ön Ödemeli Elektrik Sayacı (Şebeke + Güneş)",
          "image": "/assets/mock/on-odemeli-4.jpg",
          "hasVideo": false,
          "badges": [],
          "priceMin": 35.00,
          "priceMax": 42.00,
          "moq": 200,
          "moqUnit": "adet",
          "soldCount": 8934,
          "link": "#"
        },
        {
          "id": "clp-5",
          "name": "Akıllı Ön Ödemeli Sayaç GPRS/4G Haberleşme Modüllü",
          "image": "/assets/mock/on-odemeli-5.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "certified", "label": "DLMS Uyumlu" }
          ],
          "priceMin": 28.00,
          "priceMax": 36.00,
          "moq": 300,
          "moqUnit": "adet",
          "soldCount": 19450,
          "link": "#"
        },
        {
          "id": "clp-6",
          "name": "Endüstriyel Tip Üç Fazlı Ön Ödemeli CT Sayacı",
          "image": "/assets/mock/on-odemeli-6.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" },
            { "type": "certified", "label": "CE Sertifikalı" }
          ],
          "priceMin": 55.00,
          "priceMax": 72.00,
          "moq": 100,
          "moqUnit": "adet",
          "soldCount": 6721,
          "link": "#"
        },
        {
          "id": "clp-7",
          "name": "Kompakt Ön Ödemeli Sayaç Dahili Röle ve LCD Ekranlı",
          "image": "/assets/mock/on-odemeli-7.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "certified", "label": "IEC 62055" }
          ],
          "priceMin": 15.00,
          "priceMax": 20.00,
          "moq": 1000,
          "moqUnit": "adet",
          "soldCount": 31245,
          "link": "#"
        },
        {
          "id": "clp-8",
          "name": "Duvara Monte Ön Ödemeli Sayaç Entegre Tuş Takımlı",
          "image": "/assets/mock/on-odemeli-8.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" }
          ],
          "priceMin": 19.00,
          "priceMax": 25.50,
          "moq": 500,
          "moqUnit": "adet",
          "soldCount": 14320,
          "link": "#"
        }
      ]
    },
    {
      "id": "cl-2",
      "name": "AKILLI SU SAYAÇLARI",
      "bannerImage": "/assets/mock/banner-su-sayaci.jpg",
      "products": [
        {
          "id": "clp-9",
          "name": "Ultrasonik Su Sayacı DN15 Konut Tipi LoRa Modüllü",
          "image": "/assets/mock/su-1.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" },
            { "type": "certified", "label": "MID Onaylı" }
          ],
          "priceMin": 42.00,
          "priceMax": 58.00,
          "moq": 200,
          "moqUnit": "adet",
          "soldCount": 22456,
          "link": "#"
        },
        {
          "id": "clp-10",
          "name": "Mekanik Çok Hüzmeli Kuru Tip Su Sayacı DN20",
          "image": "/assets/mock/su-2.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "certified", "label": "ISO 4064" }
          ],
          "priceMin": 8.50,
          "priceMax": 12.00,
          "moq": 500,
          "moqUnit": "adet",
          "soldCount": 34210,
          "link": "#"
        },
        {
          "id": "clp-11",
          "name": "Endüstriyel Ultrasonik Su Sayacı DN50-DN300 Flanşlı",
          "image": "/assets/mock/su-3.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" }
          ],
          "priceMin": 180.00,
          "priceMax": 450.00,
          "moq": 50,
          "moqUnit": "adet",
          "soldCount": 4560,
          "link": "#"
        },
        {
          "id": "clp-12",
          "name": "Ön Ödemeli IC Kartlı Su Sayacı DN15 Pirinç Gövdeli",
          "image": "/assets/mock/su-4.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "certified", "label": "CE Sertifikalı" }
          ],
          "priceMin": 25.00,
          "priceMax": 35.00,
          "moq": 300,
          "moqUnit": "adet",
          "soldCount": 18970,
          "link": "#"
        },
        {
          "id": "clp-13",
          "name": "Kablosuz NB-IoT Uzaktan Okuma Su Sayacı DN25",
          "image": "/assets/mock/su-5.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" },
            { "type": "certified", "label": "IP68 Koruma" }
          ],
          "priceMin": 55.00,
          "priceMax": 78.00,
          "moq": 200,
          "moqUnit": "adet",
          "soldCount": 11230,
          "link": "#"
        },
        {
          "id": "clp-14",
          "name": "Manyetik Debimetre Tip Su Sayacı DN100 Paslanmaz Çelik",
          "image": "/assets/mock/su-6.jpg",
          "hasVideo": false,
          "badges": [],
          "priceMin": 320.00,
          "priceMax": 520.00,
          "moq": 20,
          "moqUnit": "adet",
          "soldCount": 2340,
          "link": "#"
        },
        {
          "id": "clp-15",
          "name": "Woltman Tip Yatay Su Sayacı DN50 Endüstriyel Kullanım",
          "image": "/assets/mock/su-7.jpg",
          "hasVideo": true,
          "badges": [
            { "type": "certified", "label": "MID Onaylı" }
          ],
          "priceMin": 85.00,
          "priceMax": 120.00,
          "moq": 100,
          "moqUnit": "adet",
          "soldCount": 7650,
          "link": "#"
        },
        {
          "id": "clp-16",
          "name": "Kompakt Isı Sayacı Entegre Su Ölçüm DN20 Konut Tipi",
          "image": "/assets/mock/su-8.jpg",
          "hasVideo": false,
          "badges": [
            { "type": "main-product", "label": "Ana Ürün" }
          ],
          "priceMin": 65.00,
          "priceMax": 90.00,
          "moq": 200,
          "moqUnit": "adet",
          "soldCount": 9870,
          "link": "#"
        }
      ]
    }
  ]
}
```

### 17.7 Şirket Bilgisi (C7)

```json
{
  "company": {
    "heroImage": "/assets/mock/fabrika-hero.jpg",
    "heroTitle": "Odaklanma",
    "heroSubtitle": "20 yılı aşkın süredir özelleştirilmiş ölçüm çözümleri sunmaya odaklanıyoruz",
    "description": "2004 yılında kurulan Anadolu Endüstriyel Ölçüm Sistemleri A.Ş., akıllı enerji ölçüm ürünlerinin Ar-Ge, üretim ve satışı konusunda uzmanlaşmış yüksek teknoloji kuruluşudur. 500'den fazla çalışanı ve 30.000 m² üretim tesisi ile dünya genelinde 60'tan fazla ülkedeki müşterilerimize yenilikçi ön ödemeli elektrik sayaçları, su sayaçları ve doğalgaz sayaçları sunmaktayız. ISO 9001 sertifikalı üretim hattımız tutarlı kalite ve güvenilirlik sağlamaktadır.",
    "descriptionExtended": "Şirketimiz, IEC, ANSI ve BS dahil uluslararası standartları karşılayan özelleştirilmiş OEM/ODM çözümleri sunma konusunda kararlıdır. Enerji verimliliği ve akıllı şebeke altyapısı alanlarında lider konumdayız. Yıllık 2 milyon adet üretim kapasitemiz ile küçük ve büyük ölçekli siparişlere hızlı teslimat garantisi veriyoruz.",
    "factoryPhotos": [
      { "id": "fp-1", "image": "/assets/mock/fabrika-1.jpg", "caption": "Üretim Hattı" },
      { "id": "fp-2", "image": "/assets/mock/fabrika-2.jpg", "caption": "Kalite Test Laboratuvarı" },
      { "id": "fp-3", "image": "/assets/mock/fabrika-3.jpg", "caption": "Montaj Atölyesi" }
    ],
    "carouselPhotos": [
      { "id": "cp-1", "image": "/assets/mock/karusel-1.jpg", "caption": "Akıllı İnovasyon Parkı" },
      { "id": "cp-2", "image": "/assets/mock/karusel-2.jpg", "caption": "Otomatik Üretim Hattı" },
      { "id": "cp-3", "image": "/assets/mock/karusel-3.jpg", "caption": "Ar-Ge Merkezi" }
    ],
    "locations": [
      { "id": "loc-1", "name": "İstanbul, Türkiye (Genel Müdürlük)", "image": "/assets/mock/loc-istanbul.jpg" },
      { "id": "loc-2", "name": "Ankara, Türkiye (Bölge Ofisi)", "image": "/assets/mock/loc-ankara.jpg" },
      { "id": "loc-3", "name": "İzmir, Türkiye (Üretim Tesisi)", "image": "/assets/mock/loc-izmir.jpg" },
      { "id": "loc-4", "name": "Kocaeli, Türkiye (Depo & Lojistik)", "image": "/assets/mock/loc-kocaeli.jpg" }
    ]
  }
}
```

### 17.8 Sertifikalar (C8)

```json
{
  "certificates": [
    { "id": "cert-1", "name": "ISO 9001:2015 Kalite Yönetim Sistemi", "image": "/assets/mock/cert-iso9001.jpg" },
    { "id": "cert-2", "name": "ISO 14001:2015 Çevre Yönetim Sistemi", "image": "/assets/mock/cert-iso14001.jpg" },
    { "id": "cert-3", "name": "CE Uygunluk Belgesi", "image": "/assets/mock/cert-ce.jpg" },
    { "id": "cert-4", "name": "IEC 62052-11 Test Raporu", "image": "/assets/mock/cert-iec.jpg" },
    { "id": "cert-5", "name": "TÜV Rheinland Sertifikası", "image": "/assets/mock/cert-tuv.jpg" },
    { "id": "cert-6", "name": "SGS Denetim Raporu", "image": "/assets/mock/cert-sgs.jpg" },
    { "id": "cert-7", "name": "TSE Türk Standartları Uygunluk Belgesi", "image": "/assets/mock/cert-tse.jpg" },
    { "id": "cert-8", "name": "KEMA/DEKRA Tip Onay Sertifikası", "image": "/assets/mock/cert-kema.jpg" }
  ]
}
```

### 17.9 Why Choose Us Kartları (C9)

```json
{
  "advantages": [
    {
      "id": "adv-1",
      "icon": "shield-check",
      "title": "GÜVENLİK",
      "description": "Uluslararası Parmak İzi Doğrulama, BCI protokolü, Akıllı Ön Ödeme, Güvenli Kimlik Doğrulama, 15.000+ Kurulum"
    },
    {
      "id": "adv-2",
      "icon": "certificate",
      "title": "KALİTE",
      "description": "ISO 9001 Sertifikalı, Gelişmiş Test Altyapısı, %100 Kalite Kontrol, Otomatik Üretim Hattı, %0,1 Hata Oranı"
    },
    {
      "id": "adv-3",
      "icon": "lightbulb",
      "title": "İNOVASYON",
      "description": "Uzman Ar-Ge Ekibi, 50+ Patent, Sürekli İyileştirme, Akıllı IoT Entegrasyonu, Yapay Zeka Destekli Analitik"
    },
    {
      "id": "adv-4",
      "icon": "headset",
      "title": "HİZMET",
      "description": "Çevrimiçi Teknik Destek, 48 Saat İçinde Yanıt, 7/24 İş Danışmanlığı, Özel Müşteri Temsilcisi"
    },
    {
      "id": "adv-5",
      "icon": "cog",
      "title": "OEM/ODM",
      "description": "OEM ve ODM Hizmeti, Özel Firmware Geliştirme, Özel Etiket Üretimi, Ambalaj Tasarımı, Tasarım Danışmanlığı"
    }
  ],
  "features": [
    { "id": "feat-1", "icon": "shield", "title": "Kalite güvencesi" },
    { "id": "feat-2", "icon": "factory", "title": "OEM/ODM Onaylı" },
    { "id": "feat-3", "icon": "support", "title": "Özenli hizmet" }
  ]
}
```

### 17.10 Company Introduction Bilgileri (C10)

```json
{
  "companyInfo": [
    { "icon": "globe", "label": "Ülke / Bölge", "value": "İstanbul, Türkiye" },
    { "icon": "calendar", "label": "Kuruluş Yılı", "value": "2004" },
    { "icon": "factory", "label": "İş Türü", "value": "Özel Üretici (OEM/ODM)" },
    { "icon": "box", "label": "Ana Ürünler", "value": "Elektrik Sayacı, Su Sayacı, Doğalgaz Sayacı, Isı Sayacı, Enerji İzleme Sistemi" },
    { "icon": "map", "label": "Ana Pazarlar", "value": "Afrika, Orta Doğu, Güneydoğu Asya, Güney Amerika" },
    { "icon": "chart", "label": "Yıllık Toplam Ciro", "value": "85.000.000 USD" }
  ],
  "companyPhotos": [
    { "id": "cip-1", "image": "/assets/mock/tanitim-fabrika-1.jpg", "caption": "Fabrika Genel Görünüm", "hasVideo": true },
    { "id": "cip-2", "image": "/assets/mock/tanitim-fabrika-2.jpg", "caption": "Üretim Hattı", "hasVideo": false },
    { "id": "cip-3", "image": "/assets/mock/tanitim-fabrika-3.jpg", "caption": "Depo Alanı", "hasVideo": false },
    { "id": "cip-4", "image": "/assets/mock/tanitim-fabrika-4.jpg", "caption": "Showroom / Sergi Alanı", "hasVideo": false }
  ]
}
```

### 17.11 Fabrika Fotoğrafları / Gallery (C11)

```json
{
  "galleryPhotos": [
    { "id": "gal-1", "image": "/assets/mock/galeri-1.jpg", "caption": "Otomatik Montaj Hattı" },
    { "id": "gal-2", "image": "/assets/mock/galeri-2.jpg", "caption": "Kalite Kontrol Laboratuvarı" },
    { "id": "gal-3", "image": "/assets/mock/galeri-3.jpg", "caption": "Hammadde Depolama Alanı" },
    { "id": "gal-4", "image": "/assets/mock/galeri-4.jpg", "caption": "Ambalaj ve Paketleme Bölümü" },
    { "id": "gal-5", "image": "/assets/mock/galeri-5.jpg", "caption": "Ar-Ge Merkezi" },
    { "id": "gal-6", "image": "/assets/mock/galeri-6.jpg", "caption": "İdari Bina" },
    { "id": "gal-7", "image": "/assets/mock/galeri-7.jpg", "caption": "Kalibrasyon ve Test Odası" },
    { "id": "gal-8", "image": "/assets/mock/galeri-8.jpg", "caption": "Sevkiyat ve Lojistik Alanı" }
  ]
}
```

### 17.12 İletişim Kişisi (C12)

```json
{
  "contact": {
    "name": "Ahmet Yılmaz",
    "department": "Satış Departmanı",
    "title": "Dış Ticaret Müdürü"
  }
}
```

---

## 18. TypeScript Etkileşimleri

### 18.1 Ana Etkileşim Dosyası

Dosya: `src/utils/seller/interactions.ts`

```typescript
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/**
 * Tüm Swiper carousel'larını başlatır
 */
export function initAllSwipers(): void {
  initHeroSwiper();
  initCertificatesSwiper();
  initCompanyCarousel();
}

/**
 * Hero Banner Swiper (C3)
 */
function initHeroSwiper(): Swiper | null {
  const el = document.querySelector('.store-hero__swiper');
  if (!el) return null;

  return new Swiper('.store-hero__swiper', {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 600,
    pagination: {
      el: '.store-hero__pagination',
      clickable: true,
      bulletClass: 'store-hero__dot',
      bulletActiveClass: 'store-hero__dot--active',
    },
  });
}

/**
 * Certificates Carousel Swiper (C8)
 */
function initCertificatesSwiper(): Swiper | null {
  const el = document.querySelector('.certificates__swiper');
  if (!el) return null;

  return new Swiper('.certificates__swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 4,
    spaceBetween: 16,
    loop: false,
    navigation: { nextEl: '.certificates__next', prevEl: '.certificates__prev' },
    pagination: { el: '.certificates__dots', clickable: true },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 8 },
      480: { slidesPerView: 2, spaceBetween: 12 },
      768: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 4, spaceBetween: 16 },
    },
  });
}

/**
 * Company Info Carousel — Variant B (C7)
 */
function initCompanyCarousel(): Swiper | null {
  const el = document.querySelector('.company-info__carousel-swiper');
  if (!el) return null;

  return new Swiper('.company-info__carousel-swiper', {
    modules: [Navigation],
    loop: true,
    speed: 500,
    navigation: { nextEl: '.company-info__next', prevEl: '.company-info__prev' },
  });
}

/**
 * Store Nav Dropdown Toggle (C2)
 */
export function initStoreNavDropdowns(): void {
  const dropdownTriggers = document.querySelectorAll('.store-nav__item--dropdown');

  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling as HTMLElement;
    if (!dropdown) return;

    // Toggle on click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('hidden');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close on click outside
  document.addEventListener('click', () => closeAllDropdowns());

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

function closeAllDropdowns(): void {
  document.querySelectorAll('.store-nav__dropdown').forEach(dd => {
    dd.classList.add('hidden');
  });
  document.querySelectorAll('.store-nav__item--dropdown').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Store Nav Sticky Scroll Handler (C2)
 */
export function initStickyNav(): void {
  const nav = document.getElementById('store-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.classList.add('store-nav--scrolled');
    } else {
      nav.classList.remove('store-nav--scrolled');
    }
  }, { passive: true });
}

/**
 * Store Nav Search Input (C2)
 */
export function initSearchInput(): void {
  const searchInput = document.querySelector('.store-nav__search-input') as HTMLInputElement;
  const searchBtn = document.querySelector('.store-nav__search-btn') as HTMLButtonElement;

  if (!searchInput || !searchBtn) return;

  // Search on Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchInput.value.trim());
    }
  });

  // Search on button click
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch(searchInput.value.trim());
  });

  // Clear on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.blur();
    }
  });
}

function handleSearch(query: string): void {
  if (query.length < 2) return;
  // Placeholder: mağaza içi arama — backend entegrasyonu yapılacak
  const searchUrl = `?search=${encodeURIComponent(query)}`;
  window.location.href = searchUrl;
}

/**
 * Contact Form Submit + Validation (C12)
 */
export function initContactForm(): void {
  const textarea = document.querySelector('.contact-form__textarea') as HTMLTextAreaElement;
  const counter = document.querySelector('.contact-form__counter') as HTMLSpanElement;
  const sendBtn = document.querySelector('.contact-form__send') as HTMLButtonElement;

  if (!textarea || !counter || !sendBtn) return;

  // Character counter
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len}/8000`;
    counter.className = 'contact-form__counter absolute right-3 bottom-3 text-[12px]';

    if (len >= 8000) {
      counter.classList.add('text-[#ef4444]');
    } else if (len >= 7500) {
      counter.classList.add('text-[#f97316]');
    } else {
      counter.classList.add('text-[#9ca3af]');
    }
  });

  // Submit
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = textarea.value.trim();
    if (msg.length < 10) {
      textarea.classList.add('border-[#ef4444]', 'focus:ring-[#ef4444]/20');
      textarea.focus();
      return;
    }
    textarea.classList.remove('border-[#ef4444]', 'focus:ring-[#ef4444]/20');
    // Placeholder: backend submit
    alert('Mesajınız başarıyla gönderildi!');
    textarea.value = '';
    counter.textContent = '0/8000';
  });
}

/**
 * Floating Button Click Handlers (C13)
 */
export function initFloatingActions(): void {
  const contactBtn = document.querySelector('.floating-actions__btn--contact');
  const chatBtn = document.querySelector('.floating-actions__btn--chat');

  contactBtn?.addEventListener('click', () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  });

  chatBtn?.addEventListener('click', () => {
    // Placeholder: chat widget açılır
  });
}

/**
 * Kategori Grid Hover Animasyonları (C4)
 * CSS transition ile yönetilir, JS gerekmez — pure CSS group-hover
 * Tailwind class'ları: group-hover:scale-105, group-hover:shadow-lg
 * Transition: transition-all duration-300 ease-in-out
 */

/**
 * Gallery Lightbox (Opsiyonel — C11)
 */
export function initGalleryLightbox(): void {
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img') as HTMLImageElement;
      if (!img) return;
      // Placeholder: lightbox modal açılır
    });
  });
}

/**
 * Ana init — DOMContentLoaded'da çağrılır
 */
export function initSellerStorefront(): void {
  initAllSwipers();
  initStoreNavDropdowns();
  initStickyNav();
  initSearchInput();
  initContactForm();
  initFloatingActions();
  initGalleryLightbox();
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initSellerStorefront);
```

### 18.2 Etkileşim Özet Tablosu

| Etkileşim | Dosya | Tetikleyici | Sonuç |
|-----------|-------|-------------|-------|
| Hero Swiper | interactions.ts | DOMContentLoaded | Autoplay carousel, dot pagination |
| Certificates Swiper | interactions.ts | DOMContentLoaded | Navigasyonlu carousel |
| Company Carousel | interactions.ts | DOMContentLoaded | Sol/sağ ok navigasyonu |
| Nav Dropdown | interactions.ts | Click on trigger | Dropdown açılır/kapanır |
| Click Outside | interactions.ts | Click anywhere | Tüm dropdown'lar kapanır |
| Escape Key | interactions.ts | Keydown Escape | Tüm dropdown'lar kapanır |
| Sticky Shadow | interactions.ts | Scroll (passive) | scrollY > 10 → shadow eklenir |
| Search Input | interactions.ts | Enter key / Click | Mağaza içi arama tetiklenir |
| Search Escape | interactions.ts | Escape key | Input temizlenir, blur |
| Form Counter | interactions.ts | Textarea input | Karakter sayısı güncellenir |
| Form Submit | interactions.ts | Send click | Validasyon + submit |
| Floating Contact | interactions.ts | Click | Smooth scroll → #contact-form |
| Floating Chat | interactions.ts | Click | Chat widget (placeholder) |
| Gallery Lightbox | interactions.ts | Click on gallery item | Lightbox modal (placeholder) |
| Category Hover | seller-storefront.css | CSS group-hover | scale-105, shadow-lg animasyonu |

---

## 19. Erişilebilirlik (a11y)

### 19.1 ARIA Label'lar

| Component | ARIA Attribute | Değer |
|-----------|---------------|-------|
| Store Nav | `role="navigation"`, `aria-label="Store navigation"` | Nav container |
| Dropdown trigger | `aria-haspopup="true"`, `aria-expanded="false"` | Products, Company |
| Dropdown panel | `role="menu"` | Açılan menü |
| Dropdown item | `role="menuitem"` | Menü öğesi |
| Hero Swiper | `role="region"`, `aria-label="Hero banner carousel"` | Carousel container |
| Hero Dot | `role="tab"`, `aria-label="Go to slide N"` | Pagination dot |
| Active Dot | `aria-selected="true"` | Aktif dot |
| Certificates Swiper | `aria-label="Certificates carousel"` | Carousel container |
| Nav Prev/Next | `aria-label="Previous slide"` / `aria-label="Next slide"` | Nav arrows |
| Search Input | `role="search"`, `aria-label="Search store products"` | Arama alanı |
| Contact Form | `aria-label="Send inquiry to supplier"` | Form section |
| Textarea | `aria-required="true"`, `aria-describedby="char-counter"` | Mesaj alanı |
| Floating Contact | `aria-label="Contact Supplier"` | Fixed buton |
| Floating Chat | `aria-label="Chat Now"` | Fixed buton |
| Gallery Item | `role="button"`, `aria-label="View full image: {caption}"` | Galeri öğesi |
| Category Card | `role="link"`, `aria-label="{category name}"` | Kategori kartı |
| Product Card | `aria-label="{product name} - {price}"` | Ürün kartı |

### 19.2 Keyboard Navigation

| Bağlam | Tuş | Davranış |
|--------|-----|----------|
| Nav Dropdown | `Enter` / `Space` | Dropdown aç/kapat |
| Nav Dropdown | `Escape` | Dropdown kapat, trigger'a focus |
| Nav Dropdown | `ArrowDown` | Sonraki menü öğesine |
| Nav Dropdown | `ArrowUp` | Önceki menü öğesine |
| Nav Dropdown | `Tab` | Dropdown'dan çık, sonraki nav öğesine |
| Hero Carousel | `ArrowLeft` | Önceki slide |
| Hero Carousel | `ArrowRight` | Sonraki slide |
| Search Input | `Enter` | Aramayı çalıştır |
| Search Input | `Escape` | Input temizle, blur |
| Form Textarea | `Tab` | Send butonuna geç |
| Send Button | `Enter` | Form submit |
| Gallery Item | `Enter` / `Space` | Lightbox aç |
| Floating Btn | `Enter` / `Space` | İlgili aksiyonu çalıştır |

### 19.3 Focus Management

- Dropdown açılınca: İlk menü öğesine focus
- Dropdown kapanınca: Trigger butonuna focus geri dönüşü
- Modal/Lightbox açılınca: Focus trap aktif, Escape ile kapatır
- Form submit sonrası: Textarea'ya focus dönüşü
- Search input Escape: Input blur olur, önceki öğeye focus

### 19.4 Screen Reader Notları

- Carousel slide değişimlerinde `aria-live="polite"` ile duyuru: "Slide 2 of 5"
- Form karakter sayacı `aria-live="off"` (sürekli güncellenmesin)
- Badge'ler `role="status"` ile okunur
- Ürün kartlarında `aria-label` ile tam ürün bilgisi
- Kategori grid'deki her kart `aria-label` ile kategori adını içerir
- Floating butonlar `aria-label` ile amacını tanımlar

### 19.5 Tab Order (Doğal Akış)

```
1. Store Header (C1) — Logo, badge'ler, CTA butonları
2. Store Nav (C2) — Nav linkleri, dropdown trigger'lar, search input
3. Hero Banner (C3) — Pagination dot'lar (Tab ile geçiş)
4. Category Grid (C4) — Kategori kartları (sol→sağ, üst→alt)
5. Hot Products (C5) — "Tümünü Gör" link, ürün kartları
6. Category Listing (C6) — Kategori banner'lar, ürün kartları
7. Company Info (C7) — "Daha Fazla" link, carousel okları
8. Certificates (C8) — Prev/Next okları, sertifika kartları
9. Why Choose Us (C9) — Avantaj kartları
10. Company Introduction (C10) — Bilgi kartları, fotoğraf grid
11. Gallery (C11) — Galeri öğeleri (tıklanabilir)
12. Contact Form (C12) — Textarea, Send butonu
13. Floating Actions (C13) — Contact Supplier, Chat Now
```

---

## 20. Responsive Breakpoint Özet Tablosu

### 20.1 Breakpoint Tanımları

| Token | Piksel | Tailwind Prefix | Açıklama |
|-------|--------|-----------------|----------|
| xs | 320px | `xs:` | Küçük mobil |
| sm | 480px | `sm:` | Büyük mobil |
| md | 640px | `md:` | Küçük tablet |
| lg | 768px | `lg:` | Tablet |
| xl | 1024px | `xl:` | Küçük masaüstü |
| 2xl | 1280px | `2xl:` | Masaüstü |
| 3xl | 1536px | `3xl:` | Geniş ekran |

### 20.2 Component × Breakpoint Davranış Matrisi (5 Breakpoint)

| Component | Mobile (<480px) | SM (480–768px) | Tablet (768–1024px) | Desktop (1024–1280px) | XL (>1280px) |
|-----------|----------------|----------------|--------------------|-----------------------|--------------|
| **C1: Store Header** | Stack dikey: logo üst, bilgi orta, CTA alt (full-width). Avatar 48px. | Stack dikey: avatar 56px, bilgi + CTA alt yana geçer. | Flex row: logo sol, bilgi orta, CTA sağ. Avatar 64px. | Flex row tam layout. Avatar 72px. Tüm badge'ler görünür. | Tam genişlik layout. Avatar 80px. Max-w container. |
| **C2: Store Nav** | Hamburger ikon, arama full-width alt satır. Menü gizli. | Hamburger ikon, arama genişler. | Horizontal scroll menü, küçük arama kutusu sağda. | Tam menü görünür, arama kutusu sağda. Dropdown hover. | Tam menü + geniş arama. Max-w container ortalı. |
| **C3: Hero Banner** | h-[200px], title 18–20px, subtitle gizli. Dot pagination küçük. | h-[260px], title 22–24px, subtitle tek satır. | h-[340px], title 28–32px, subtitle görünür. CTA butonu. | h-[420px], title 36–40px. Text overlay padding artırılır. | h-[500px], title 42–48px. Tam overlay layout. |
| **C4: Category Grid** | 2 sütun (grid-cols-2), min-h 120px, gap-2. İkon 32px. | 2 sütun, min-h 140px, gap-3. İkon 36px. | 3 sütun (grid-cols-3), min-h 160px, gap-4. İkon 40px. | 3+4 satır düzeni, min-h 170px, gap-4. Hover efektleri. | 3+4 satır düzeni, min-h 180px, gap-6. Tam hover animasyon. |
| **C5: Hot Products** | 1 sütun (grid-cols-1), kart p-3, resim h-[160px]. | 2 sütun (grid-cols-2), kart p-4, resim h-[180px]. | 2 sütun, kart p-5, resim h-[200px]. | 3 sütun (grid-cols-3), kart p-5, resim h-[220px]. | 3 sütun, kart p-6, resim h-[240px]. Max-w container. |
| **C6: Category List** | 1 sütun, banner h-[140px], ürün grid 1 col. | 1 sütun, banner h-[160px], ürün grid 2 col. | 2 sütun ürün grid, banner h-[200px]. | 4 sütun ürün grid, banner h-[280px]. | 4 sütun, banner h-[350px]. Max-w container. |
| **C7: Company Info** | Tek sütun stack. Resim full-width. Metin altında. p-4. | Tek sütun stack. Resim max-h 300px. p-5. | Tek sütun stack. Var B: carousel görünür. p-6. | Var A: 55/45 flex. Var B: 40/60 flex. Gap-8. | Var A: 55/45 flex. Var B: 40/60 flex. Max-w container. |
| **C8: Certificates** | 1 slide görünür. Prev/Next gizli. Dots görünür. | 2 slide görünür. spaceBetween 12px. | 3 slide görünür. Prev/Next görünür. spaceBetween 16px. | 4 slide görünür. spaceBetween 16px. Tam navigasyon. | 4 slide, spaceBetween 16px. Max-w container. |
| **C9: Why Choose** | Var A: 1 col stack. Var B: 1 col stack. İkon 40px. | Var A: 2 col. Var B: 1 col stack. İkon 44px. | Var A: 2 col. Var B: 2 col. İkon 48px. | Var A: 3–5 col. Var B: 3 col. İkon 52px. | Var A: 5 col. Var B: 3 col. Max-w container. |
| **C10: Company Intro** | Info: 1 col stack. Foto: 2 col grid. p-4. | Info: 2 col. Foto: 2 col grid. p-5. | Info: 2 col. Foto: 3 col grid. p-6. | Info: 3 col. Foto: 4 col grid. Gap-6. | Info: 3 col. Foto: 4 col. Max-w container. |
| **C11: Gallery** | 1 sütun (grid-cols-1). Fotoğraf h-[180px]. | 2 sütun (grid-cols-2). Gap-3. | 2 sütun. Gap-4. Hover overlay görünür. | 3 sütun (grid-cols-3). Gap-4. Hover animasyon. | 3 sütun. Gap-6. Max-w container. |
| **C12: Contact Form** | Full-width, p-4. Textarea h-[120px]. Kişi bilgisi üstte stack. | Full-width, p-5. Textarea h-[140px]. | max-w 100%, p-6. Textarea h-[160px]. Kişi bilgisi yanda. | max-w 800px mx-auto, p-8. Textarea h-[180px]. | max-w 800px mx-auto, p-8. Max-w container. |
| **C13: Floating** | Bottom bar: fixed bottom-0, full-width, flex-row. 2 buton yan yana. | Bottom bar: fixed bottom-0, flex-row. Butonlar genişler. | Sağ kenar: fixed right-4 bottom-4. Küçük ikon butonlar. | Sağ kenar: fixed right-6 bottom-6. Tam buton + text. | Sağ kenar: fixed right-8 bottom-8. Büyük butonlar. |

### 20.3 Kritik Mobile Davranışlar

1. **Nav → Hamburger**: `xl:hidden` class ile hamburger gösterilir, menü gizlenir
2. **Floating → Bottom Bar**: `@media (max-width: 480px)` ile fixed bottom, flex-row
3. **Hero Text Overlay**: Mobile'da küçük font, az padding, drop-shadow artırılır
4. **Grid → Stack**: Çoğu grid mobile'da `grid-cols-1` veya `grid-cols-2` olur
5. **CTA Butonları**: Mobile'da full-width (`w-full`) ve `flex-col` stack
6. **Carousel Slides**: Mobile'da slidesPerView azaltılır (4→1)
7. **Typography**: Mobile'da tüm heading'ler bir kademe küçülür
8. **Spacing**: Mobile'da padding/gap değerleri yarıya düşer (p-8 → p-4)
9. **Images**: Mobile'da aspect-ratio korunur, max-height azaltılır
10. **Search Bar**: Mobile'da hamburger menü altında tam genişlik ayrı satır

---

## 21. Dark Mode Notları

> Dark mode class-based (`.dark`) toggle ile çalışır. Token mapping aşağıdadır.

### 21.1 Token Mapping (Light → Dark)

| Token (Light) | Light Değer | Dark Değer | Tailwind Class |
|---------------|------------|------------|----------------|
| `--color-surface` | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| `--color-surface-muted` | `#f9fafb` | `#111827` | `dark:bg-gray-900` |
| `--color-surface-raised` | `#ffffff` | `#374151` | `dark:bg-gray-700` |
| `--color-text-primary` | `#111827` | `#f9fafb` | `dark:text-gray-50` |
| `--color-text-secondary` | `#4b5563` | `#d1d5db` | `dark:text-gray-300` |
| `--color-text-tertiary` | `#6b7280` | `#9ca3af` | `dark:text-gray-400` |
| `--color-text-muted` | `#9ca3af` | `#6b7280` | `dark:text-gray-500` |
| `--color-border-default` | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| `--color-border-strong` | `#d1d5db` | `#4b5563` | `dark:border-gray-600` |
| `--color-border-focus` | `#cc9900` | `#cc9900` | Değişmez (primary sabit) |
| `--card-bg` | `#ffffff` | `#1f2937` | `dark:bg-gray-800` |
| `--card-border-color` | `#e5e5e5` | `#374151` | `dark:border-gray-700` |
| `--input-bg` | `#ffffff` | `#374151` | `dark:bg-gray-700` |
| `--input-border-color` | `#e5e5e5` | `#4b5563` | `dark:border-gray-600` |
| `--btn-bg` | `#cc9900` | `#cc9900` | Değişmez (primary sabit) |
| `--btn-text` | `#ffffff` | `#ffffff` | Değişmez |
| `--shadow-card` | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.3)` | `dark:shadow-lg` |

### 21.2 Component-Specific Dark Mode Notları

| Component | Dark Mode Değişiklik |
|-----------|---------------------|
| C1: Store Header | bg → gray-800, text → gray-50, badge renkleri sabit kalır |
| C2: Store Nav | Turuncu bar korunur (dark'ta değişmez), search input bg → gray-700 |
| C3: Hero Banner | Görseller değişmez, overlay text renkleri aynı kalır |
| C4: Category Grid | Kart bg → gray-800, border → gray-700, hover shadow güçlenir |
| C5: Hot Products | Kart bg → gray-800, border → gray-700, fiyat text → gray-50 |
| C6: Category List | Kart bg → gray-800, border → gray-700, price text → gray-50 |
| C7: Company Info | Variant A: bg → gray-900, Variant B: bej (#fdf6e9) → gray-900 |
| C8: Certificates | Kart bg → gray-800, sertifika border → gray-700 |
| C9: Why Choose Us | Kart bg → gray-800, ikon renkleri sabit kalır (primary) |
| C10: Company Intro | Kart bg → gray-800, info label turuncu kalır, foto overlay güçlenir |
| C11: Gallery | Kart bg → gray-800, hover overlay daha opak |
| C12: Contact Form | Kart bg → gray-800, textarea bg → gray-700, placeholder text → gray-400 |
| C13: Floating | Buton renkleri sabit (turuncu/primary), shadow güçlenir |

### 21.3 Dark Mode Implementasyon

```html
<!-- HTML root'ta class toggle -->
<html class="dark">
  ...
</html>
```

```css
/* style.css — dark mode override */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #1f2937;
    --color-surface-muted: #111827;
    --color-surface-raised: #374151;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #9ca3af;
    --color-text-muted: #6b7280;
    --color-border-default: #374151;
    --color-border-strong: #4b5563;
    --card-bg: #1f2937;
    --card-border-color: #374151;
    --input-bg: #374151;
    --input-border-color: #4b5563;
  }
}

/* Manual .dark class override */
.dark {
  --color-surface: #1f2937;
  --color-surface-muted: #111827;
  --color-surface-raised: #374151;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-tertiary: #9ca3af;
  --color-text-muted: #6b7280;
  --color-border-default: #374151;
  --color-border-strong: #4b5563;
  --card-bg: #1f2937;
  --card-border-color: #374151;
  --input-bg: #374151;
  --input-border-color: #4b5563;
}
```

> **Not**: Store Nav turuncu bar (`#e8540c`) ve CTA butonları (`#f97316`) dark mode'da değişmez. Primary altın/amber (`#cc9900`) aksanlar her iki temada da aynı kalır. Bu aksanlar marka kimliği taşıdığı için dark/light farketmeksizin korunur.
