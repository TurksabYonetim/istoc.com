# RFQ Page — Pixel-Perfect Frontend Specification

> **Document Version:** 1.0
> **Route:** `/rfq/new`
> **Language:** Turkish (tr)
> **Last Updated:** 2026-02-24

---

## 1. General Information

### 1.1 Page Identity

| Property        | Value                                           |
| --------------- | ----------------------------------------------- |
| **Page Name**   | RFQ - Fiyat Teklifi Talebi                      |
| **Route**       | `/rfq/new`                                      |
| **HTML Title**  | `RFQ - Fiyat Teklifi Talebi \| Alibaba`         |
| **Language**    | Turkish (`lang="tr"`)                           |
| **Content**     | Static page with mock data (no backend API)     |
| **Entry Point** | `index.html` → `/src/main.ts` (ES Module)      |

### 1.2 Tech Stack

| Technology           | Version  | Purpose                                              |
| -------------------- | -------- | ---------------------------------------------------- |
| **Vite**             | `^7.x`  | Build tool & dev server (ESM-only, Node.js 20.19+)   |
| **TypeScript**       | `^5.x`  | Language — strict mode, ES2020 target                 |
| **TailwindCSS**      | `^4.x`  | CSS framework — `@theme` token system, NO config file |
| **@tailwindcss/vite** | `^4.x` | Vite plugin for TailwindCSS (replaces PostCSS)       |
| **Flowbite**         | `^3.x`  | UI components — tooltips (data-attribute driven), checkboxes |
| **Swiper.js**        | `^11.x` | Testimonial carousel — autoplay, pagination, loop    |
| **Roboto**           | Variable (100-900) | Google Fonts — primary typeface              |

### 1.3 CSS Architecture

TailwindCSS v4 uses a **CSS-native** token system. There is **no `tailwind.config.js`** file.

```css
/* src/style.css — Entry point for all styles */
@import "tailwindcss";                    /* Core framework */
@import "flowbite/src/themes/default";    /* Flowbite default theme */
@plugin "flowbite/plugin";                /* Flowbite plugin integration */
@source "../node_modules/flowbite";       /* Flowbite source scanning */

@theme {
  /* All design tokens defined here — auto-generate utility classes */
  --color-primary-500: #cc9900;   /* → bg-primary-500, text-primary-500, border-primary-500 */
  --radius-card: 8px;             /* → rounded-card */
  --shadow-card: 0 1px 3px ...;   /* → shadow-card */
  --spacing: 0.5rem;              /* Multiplier: spacing-4 = 4 × 0.5rem = 2rem = 32px */
}
```

### 1.4 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### 1.5 Module System

- **Type:** ES Modules (`"type": "module"` in `package.json`)
- **TypeScript:** `"module": "ESNext"`, `"moduleResolution": "bundler"`
- **Imports:** Use `import` / `import type` — no `require()`

### 1.6 Font Loading

Roboto Variable font is loaded via Google Fonts in `index.html` with `preconnect` for performance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
```

### 1.7 Header & Footer

> **IMPORTANT:** The header and footer components are **completely out of scope** for this page.
> The page HTML skeleton includes placeholder comments where these components will be inserted:
>
> ```html
> <!-- HEADER COMPONENT BURAYA GELİR -->
> <!-- Page content sections go here -->
> <!-- FOOTER COMPONENT BURAYA GELİR -->
> ```
>
> A separate task will implement the shared header/footer. This spec covers **only** the 5 content sections between these placeholders.

### 1.8 Dev Server

| Property       | Value                        |
| -------------- | ---------------------------- |
| **Command**    | `npm run dev`                |
| **URL**        | `http://localhost:5173`      |
| **RFQ Page**   | `http://localhost:5173` (SPA — single page, no router) |
| **Hot Reload** | Enabled (Vite HMR)          |

---

## 2. File Structure

### 2.1 Complete File Tree

```
rfq-app/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite + TailwindCSS plugin
├── docs/
│   └── specs/
│       └── rfq-page-spec.md      # THIS FILE — pixel-perfect specification
└── src/
    ├── main.ts                   # App entry — Flowbite init, Swiper init, event handlers
    ├── style.css                 # TailwindCSS v4 @theme tokens + custom CSS classes
    ├── types/
    │   └── index.ts              # TypeScript interfaces (Product, CustomizationCard, etc.)
    └── data/
        └── mock-data.ts          # Turkish mock data for all 5 sections
```

### 2.2 File Purposes

| # | File                        | Purpose                                                                                                          |
| - | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1 | `index.html`                | HTML entry point. Loads Roboto Variable font (Google Fonts, preconnect). Sets `lang="tr"`, body classes `font-['Roboto'] antialiased text-text-primary bg-surface`. Contains `<div id="app">` root and module script tag pointing to `/src/main.ts`. |
| 2 | `package.json`              | Project manifest. Defines ESM module type, npm scripts (`dev`, `build`, `preview`), devDependencies (vite, typescript, tailwindcss, @tailwindcss/vite), and runtime dependencies (flowbite, swiper). |
| 3 | `tsconfig.json`             | TypeScript compiler options. Strict mode enabled, ES2020 target, bundler moduleResolution, ESNext module, `noUncheckedIndexedAccess`, `noEmit` (Vite handles bundling). Includes `src/` and `vite.config.ts`. |
| 4 | `vite.config.ts`            | Vite build configuration. Imports and registers `@tailwindcss/vite` plugin via `defineConfig({ plugins: [tailwindcss()] })`. No PostCSS config needed. |
| 5 | `src/style.css`             | **Design Token System** — TailwindCSS v4 core import, Flowbite integration (theme + plugin + source), and complete `@theme {}` block with 100+ tokens: color palettes (primary, secondary, accent, semantic, surface, text, border), typography (Roboto, 11-32px scale), spacing (0.5rem/8px grid), border radii, shadows, container (1472px), breakpoints (xs-3xl), component tokens (button, card, input, product card), and transitions. Also contains custom CSS classes: `.rfq-hero` (gradient), `.rfq-form` (overlap), `.product-card` (shared card), `.rfq-testimonial` (dark gradient), `.rfq-ai-badge`, `.focus-ring`, and `.product-card__image--fallback`. |
| 6 | `src/main.ts`               | **App Entry Point** — Imports `style.css`, imports and initializes Flowbite (`import 'flowbite'`, `initFlowbite()`), imports and configures Swiper.js with autoplay/loop/pagination for testimonial carousel, sets up file upload event listeners (click + drag/drop + validation), and form submit handler (empty textarea prevention). All initialization wrapped in `DOMContentLoaded`. |
| 7 | `src/types/index.ts`        | **TypeScript Interfaces** — Exports: `Product` (id, name, image, supplierCount, ctaText), `CustomizationCard` (id, title, subtitle, icon, position union type), `Testimonial` (id, quote, avatar, name, title, company), `RFQFormData` (details, files, aiEnabled), `AllowedFileExtension` type, and `FILE_UPLOAD_CONFIG` constant (maxFiles: 6, allowedExtensions array, allowedFormatsDisplay string). |
| 8 | `src/data/mock-data.ts`     | **Turkish Mock Data** — Exports 4 typed arrays: `customizationCards` (4 items: Design, Logo, Bundling, Packaging), `selectedProducts` (6 B2B products, CTA: "Aninda fiyat teklifi al"), `customProducts` (36 diverse B2B products in 6 rows, CTA: "Hemen fiyat teklifi al"), `testimonials` (3 items with Turkish quotes). All imports typed from `src/types/index.ts`. |
| 9 | `docs/specs/rfq-page-spec.md` | **THIS DOCUMENT** — Complete pixel-perfect specification. Contains 13 sections covering every visual detail, HTML structure, Tailwind classes, custom CSS, design tokens, mock data, TypeScript interactions, accessibility, responsive breakpoints, and dark mode mapping. A coding agent can build the page 1:1 from this spec alone. |

---

## 3. Full Page HTML Skeleton

This section defines the **complete semantic HTML structure** of the RFQ page. Every `<section>` has a unique `id`, BEM-style class names, and `data-section` attributes for JavaScript targeting.

### 3.1 Complete HTML Skeleton

```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RFQ - Fiyat Teklifi Talebi | Alibaba</title>

    <!-- Roboto Variable Font (100-900 weight, italic support) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="font-['Roboto'] antialiased text-text-primary bg-surface">

    <!-- ============================================================
         HEADER COMPONENT BURAYA GELİR
         Shared site header — implemented in a separate task.
         ============================================================ -->

    <main id="rfq-page" class="rfq-page" data-page="rfq-new">

      <!-- ══════════════════════════════════════════════════════════
           SECTION 1 — Hero Banner
           Full-width gradient background with 2-column layout.
           Left: text content (badge, H1, subtitle, play link, pill button)
           Right: 2×2 customization card grid
           ══════════════════════════════════════════════════════════ -->
      <section
        id="rfq-hero"
        class="rfq-hero"
        data-section="hero"
        aria-label="RFQ Hero Banner"
      >
        <div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-0">
          <!-- Hero content: 2-column layout -->
          <!-- Left column: badge row, H1, subtitle, play link, outlined button -->
          <!-- Right column: 2×2 customization card grid -->
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           SECTION 2 — RFQ Form (Overlapping Card)
           White card that overlaps the hero section by 50px.
           Contains: heading, textarea, file upload, AI toggle, CTA button.
           ══════════════════════════════════════════════════════════ -->
      <section
        id="rfq-form"
        class="rfq-form"
        data-section="form"
        aria-label="RFQ Formu"
      >
        <div class="rfq-form__card">
          <form id="rfq-form-element" novalidate>
            <!-- Form heading -->
            <!-- Textarea container with placeholder -->
            <!-- File upload button + Flowbite tooltip -->
            <!-- Form footer: checkbox + AI badge + CTA button -->
          </form>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           SECTION 3 — Selected Products Grid
           6-column single-row product card grid.
           Each card: image → supplier count → product name → CTA link.
           CTA text: "Anında fiyat teklifi al"
           ══════════════════════════════════════════════════════════ -->
      <section
        id="rfq-selected-products"
        class="bg-surface-muted"
        data-section="selected-products"
        aria-label="Seçili Ürünler"
      >
        <div class="mx-auto max-w-[var(--container-lg)] px-4 py-10">
          <!-- Section heading -->
          <!-- 6-column product card grid -->
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           SECTION 4 — Custom Products Grid
           6-column multi-row grid (36 products = 6 rows × 6 cols).
           Same card pattern as Section 3.
           CTA text: "Hemen fiyat teklifi al"
           ══════════════════════════════════════════════════════════ -->
      <section
        id="rfq-custom-products"
        class="bg-surface"
        data-section="custom-products"
        aria-label="Size Özel Ürünler"
      >
        <div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-12">
          <!-- Section heading -->
          <!-- 6-column × 6-row product card grid (36 cards) -->
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           SECTION 5 — Testimonial Carousel
           Full-width dark gradient background.
           Swiper.js carousel with quote, avatar, name, title.
           Dot pagination, autoplay 5000ms, loop.
           ══════════════════════════════════════════════════════════ -->
      <section
        id="rfq-testimonials"
        class="rfq-testimonial"
        data-section="testimonials"
        aria-label="Müşteri Yorumları"
      >
        <div class="mx-auto max-w-[var(--container-lg)] px-4 py-14">
          <!-- Swiper container → wrapper → slides -->
          <!-- Each slide: blockquote, avatar, name, title/company -->
          <!-- Swiper pagination dots -->
        </div>
      </section>

    </main>

    <!-- ============================================================
         FOOTER COMPONENT BURAYA GELİR
         Shared site footer — implemented in a separate task.
         ============================================================ -->

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 3.2 Section ID & Class Reference

| Section | `id`                     | Primary Class(es)                  | `data-section`       | `aria-label`         |
| ------- | ------------------------ | ---------------------------------- | -------------------- | -------------------- |
| Hero    | `rfq-hero`               | `rfq-hero`                         | `hero`               | `RFQ Hero Banner`    |
| Form    | `rfq-form`               | `rfq-form`                         | `form`               | `RFQ Formu`          |
| Selected| `rfq-selected-products`  | `bg-surface-muted`                 | `selected-products`  | `Seçili Ürünler`     |
| Custom  | `rfq-custom-products`    | `bg-surface`                       | `custom-products`    | `Size Özel Ürünler`  |
| Testimonial | `rfq-testimonials`   | `rfq-testimonial`                  | `testimonials`       | `Müşteri Yorumları`  |

### 3.3 BEM Class Naming Convention

All custom CSS classes follow the **BEM (Block Element Modifier)** naming convention:

| Block                | Elements                                                                                   | Modifiers                         |
| -------------------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
| `.rfq-hero`          | `__badge`, `__subtitle`, `__outlined-btn`, `__card`                                        | `:hover` states on card & button  |
| `.rfq-form`          | `__card`, `__cta`, `__upload-btn`                                                          | `__upload-btn--dragover`          |
| `.product-card`      | `__image`, `__supplier`, `__name`, `__cta`                                                 | `__image--fallback`               |
| `.rfq-testimonial`   | `__quote`, `__avatar`, `__name`, `__title`                                                 | —                                 |
| `.rfq-ai-badge`      | — (standalone)                                                                             | —                                 |
| `.focus-ring`        | — (utility)                                                                                | `:focus-visible`                  |

### 3.4 Container Pattern

All sections use the same container pattern for consistent horizontal alignment:

```html
<div class="mx-auto max-w-[var(--container-lg)] px-4">
  <!-- Section content -->
</div>
```

- `max-w-[var(--container-lg)]` → `max-width: 1472px` (from `@theme` token)
- `px-4` → `padding-left: 2rem (32px); padding-right: 2rem (32px)` — with `--spacing: 0.5rem`, 4 × 0.5rem = 2rem = 32px

> **Spacing Note:** With `--spacing: 0.5rem` as the TailwindCSS v4 multiplier:
> - `px-4` = 4 × 0.5rem = 2rem = **32px** ← standard container padding
> - `px-8` = 8 × 0.5rem = 4rem = **64px**
>
> All sections use `px-4` for 32px horizontal container padding.

### 3.5 Data Attributes

All `data-*` attributes serve as JavaScript hook points for event delegation and section targeting:

| Attribute            | Used On          | Purpose                                                |
| -------------------- | ---------------- | ------------------------------------------------------ |
| `data-page="rfq-new"`| `<main>`        | Page-level identifier for scoped JS queries            |
| `data-section="*"`   | Each `<section>` | Section identifier for IntersectionObserver / analytics |
| `data-tooltip-target` | Upload button   | Flowbite tooltip connection (see Section 5)            |
| `data-tooltip-trigger` | Upload button  | Flowbite tooltip trigger mode: `"hover"`               |

---

## 4. Hero Banner (Section 1)

The hero banner is a full-width gradient band with a **2-column layout**: left column contains text content (badge, heading, subtitle, video link, outlined button) and right column displays a **2×2 customization card grid**. The hero has extra bottom padding to accommodate the form card overlap (Section 5).

> **Data Source:** `customizationCards` array from `src/data/mock-data.ts` (4 items)
> **Type:** `CustomizationCard` from `src/types/index.ts`
> **Custom CSS Block:** `.rfq-hero` and related BEM classes in `src/style.css`

### 4.1 HTML Structure

```html
<section
  id="rfq-hero"
  class="rfq-hero"
  data-section="hero"
  aria-label="RFQ Hero Banner"
>
  <div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-0">

    <!-- ── 2-Column Grid Layout ── -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">

      <!-- ════════════════════════════════════════════
           LEFT COLUMN — Text Content (~7 cols on desktop)
           ════════════════════════════════════════════ -->
      <div class="xl:col-span-7 flex flex-col gap-4">

        <!-- Badge Row: RFQ badge + label text -->
        <div class="flex items-center gap-2">
          <span class="rfq-hero__badge">RFQ</span>
          <span class="text-text-inverted text-base font-regular">
            Fiyat Teklifi Talebi
          </span>
        </div>

        <!-- H1 Heading -->
        <h1 class="text-text-inverted text-hero-lg font-bold leading-tight max-w-[500px]">
          Özel talepleriniz için fiyat teklifleri alın
        </h1>

        <!-- Subtitle -->
        <p class="rfq-hero__subtitle text-base font-regular max-w-[460px]">
          Doğru tedarikçi eşleştirmesi, hızlı fiyat karşılaştırması
        </p>

        <!-- Video/Info Link Row -->
        <a
          href="#"
          class="inline-flex items-center gap-2 text-text-inverted text-base font-regular underline hover:opacity-80 transition-opacity w-fit"
          aria-label="RFQ hakkında bilgi videosu"
        >
          <!-- Play Icon (inline SVG circle with triangle) -->
          <svg
            class="w-5 h-5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664L9.555 7.168z"
              clip-rule="evenodd"
            />
          </svg>
          <span>RFQ hakkında bilgi alın</span>
        </a>

        <!-- Outlined Pill Button -->
        <button
          type="button"
          class="rfq-hero__outlined-btn focus-ring inline-flex items-center gap-2 w-fit mt-1"
          aria-label="Taleplerinizi görüntüleyin"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fill-rule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clip-rule="evenodd"
            />
          </svg>
          <span>0 talepler</span>
          <svg
            class="w-3 h-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- ════════════════════════════════════════════
           RIGHT COLUMN — 2×2 Customization Card Grid (~5 cols on desktop)
           ════════════════════════════════════════════ -->
      <div class="xl:col-span-5">
        <div class="grid grid-cols-2 gap-3">

          <!-- Card 1: Design (top-left) -->
          <div class="rfq-hero__card flex items-center justify-between" data-card="card-design">
            <div class="flex flex-col">
              <span class="text-text-inverted text-body font-bold">Design</span>
              <span class="text-text-inverted/70 text-sm font-regular">customization</span>
            </div>
            <img
              src="/images/icons/design-icon.svg"
              alt="Design customization"
              class="w-12 h-12 object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>

          <!-- Card 2: Logo (top-right) -->
          <div class="rfq-hero__card flex items-center justify-between" data-card="card-logo">
            <div class="flex flex-col">
              <span class="text-text-inverted text-body font-bold">Logo</span>
              <span class="text-text-inverted/70 text-sm font-regular">customization</span>
            </div>
            <img
              src="/images/icons/logo-icon.svg"
              alt="Logo customization"
              class="w-12 h-12 object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>

          <!-- Card 3: Bundling (bottom-left) -->
          <div class="rfq-hero__card flex items-center justify-between" data-card="card-bundling">
            <div class="flex flex-col">
              <span class="text-text-inverted text-body font-bold">Bundling</span>
              <span class="text-text-inverted/70 text-sm font-regular">customization</span>
            </div>
            <img
              src="/images/icons/bundling-icon.svg"
              alt="Bundling customization"
              class="w-12 h-12 object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>

          <!-- Card 4: Packaging (bottom-right) -->
          <div class="rfq-hero__card flex items-center justify-between" data-card="card-packaging">
            <div class="flex flex-col">
              <span class="text-text-inverted text-body font-bold">Packaging</span>
              <span class="text-text-inverted/70 text-sm font-regular">customization</span>
            </div>
            <img
              src="/images/icons/packaging-icon.svg"
              alt="Packaging customization"
              class="w-12 h-12 object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>

        </div>
      </div>

    </div>
    <!-- /grid -->

  </div>
</section>
```

**Element Inventory:**

| # | Element | Tag | Content / Purpose |
|---|---------|-----|-------------------|
| 1 | Section wrapper | `<section>` | Full-width gradient background container |
| 2 | Container | `<div>` | Max-width 1472px, horizontal padding, vertical padding |
| 3 | Grid layout | `<div>` | 12-column grid: 7 left + 5 right |
| 4 | Badge — "RFQ" | `<span>` | Orange pill badge, uppercase, 11px |
| 5 | Badge label | `<span>` | "Fiyat Teklifi Talebi" — white, 14px |
| 6 | H1 heading | `<h1>` | "Özel talepleriniz için fiyat teklifleri alın" |
| 7 | Subtitle | `<p>` | "Doğru tedarikçi eşleştirmesi, hızlı fiyat karşılaştırması" |
| 8 | Video link | `<a>` | Play icon + "RFQ hakkında bilgi alın" |
| 9 | Outlined button | `<button>` | Clipboard icon + "0 talepler" + chevron |
| 10 | Card grid | `<div>` | 2×2 grid with 12px gap |
| 11–14 | Customization cards | `<div>` | Design / Logo / Bundling / Packaging |

### 4.2 Tailwind/CSS Classes Per Element

Every element's class list is documented below. Classes are split into **Tailwind utilities** (auto-generated from `@theme` tokens) and **custom CSS classes** (defined in `src/style.css`).

#### Section Wrapper

```
<section class="rfq-hero" ...>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-hero` | Custom CSS | `background: linear-gradient(135deg, #f97316 0%, #ea580c 30%, #7c3aed 65%, #312e81 100%); min-height: 280px; padding-bottom: 80px;` |

#### Container

```
<div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-0">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `mx-auto` | Tailwind | `margin-left: auto; margin-right: auto` |
| `max-w-[var(--container-lg)]` | Tailwind (arbitrary) | `max-width: 1472px` |
| `px-4` | Tailwind | `padding-left: 2rem (32px); padding-right: 2rem (32px)` — (4 × 0.5rem) |
| `pt-8` | Tailwind | `padding-top: 4rem (64px)` — (8 × 0.5rem) |
| `pb-0` | Tailwind | `padding-bottom: 0` — the `.rfq-hero` custom class provides 80px bottom padding |

#### Grid Layout

```
<div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `grid` | Tailwind | `display: grid` |
| `grid-cols-1` | Tailwind | `grid-template-columns: repeat(1, minmax(0, 1fr))` — mobile: single column |
| `xl:grid-cols-12` | Tailwind | At `≥1024px`: `grid-template-columns: repeat(12, minmax(0, 1fr))` |
| `gap-6` | Tailwind | `gap: 3rem (48px)` — (6 × 0.5rem) |
| `items-center` | Tailwind | `align-items: center` |

#### Left Column

```
<div class="xl:col-span-7 flex flex-col gap-4">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `xl:col-span-7` | Tailwind | At `≥1024px`: `grid-column: span 7 / span 7` (~58% width) |
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `gap-4` | Tailwind | `gap: 2rem (32px)` — (4 × 0.5rem) |

#### Badge Row

```
<div class="flex items-center gap-2">
  <span class="rfq-hero__badge">RFQ</span>
  <span class="text-text-inverted text-base font-regular">Fiyat Teklifi Talebi</span>
</div>
```

| Element | Class | Type | Resolves To |
|---------|-------|------|-------------|
| Row | `flex items-center gap-2` | Tailwind | Horizontal flex, centered, 16px gap |
| Badge | `rfq-hero__badge` | Custom CSS | `background-color: #f97316; color: #fff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.025em` |
| Label | `text-text-inverted` | Tailwind | `color: #ffffff` (from `--color-text-inverted`) |
| Label | `text-base` | Tailwind | `font-size: 0.875rem (14px)` (from `--font-size-base`) |
| Label | `font-regular` | Tailwind | `font-weight: 400` (from `--font-weight-regular`) |

#### H1 Heading

```
<h1 class="text-text-inverted text-hero-lg font-bold leading-tight max-w-[500px]">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `text-text-inverted` | Tailwind | `color: #ffffff` |
| `text-hero-lg` | Tailwind | `font-size: 2rem (32px)` (from `--font-size-hero-lg`) |
| `font-bold` | Tailwind | `font-weight: 700` (from `--font-weight-bold`) |
| `leading-tight` | Tailwind | `line-height: 1.25` (from `--line-height-tight`) |
| `max-w-[500px]` | Tailwind (arbitrary) | `max-width: 500px` — prevents overly wide heading |

#### Subtitle

```
<p class="rfq-hero__subtitle text-base font-regular max-w-[460px]">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-hero__subtitle` | Custom CSS | `color: rgba(255, 255, 255, 0.85)` |
| `text-base` | Tailwind | `font-size: 0.875rem (14px)` |
| `font-regular` | Tailwind | `font-weight: 400` |
| `max-w-[460px]` | Tailwind (arbitrary) | `max-width: 460px` |

#### Video/Info Link

```
<a class="inline-flex items-center gap-2 text-text-inverted text-base font-regular underline hover:opacity-80 transition-opacity w-fit">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `inline-flex` | Tailwind | `display: inline-flex` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-2` | Tailwind | `gap: 1rem (16px)` |
| `text-text-inverted` | Tailwind | `color: #ffffff` |
| `text-base` | Tailwind | `font-size: 0.875rem (14px)` |
| `font-regular` | Tailwind | `font-weight: 400` |
| `underline` | Tailwind | `text-decoration-line: underline` |
| `hover:opacity-80` | Tailwind | On hover: `opacity: 0.8` |
| `transition-opacity` | Tailwind | `transition-property: opacity` |
| `w-fit` | Tailwind | `width: fit-content` |

#### Outlined Pill Button

```
<button class="rfq-hero__outlined-btn focus-ring inline-flex items-center gap-2 w-fit mt-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-hero__outlined-btn` | Custom CSS | `border: 1px solid rgba(255,255,255,0.5); border-radius: 9999px; color: #fff; padding: 8px 20px; font-size: 14px; font-weight: 500; transition: all 200ms ease` |
| `focus-ring` | Custom CSS | On `:focus-visible`: `outline: 2px solid #cc9900; outline-offset: 2px` |
| `inline-flex` | Tailwind | `display: inline-flex` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-2` | Tailwind | `gap: 1rem (16px)` |
| `w-fit` | Tailwind | `width: fit-content` |
| `mt-1` | Tailwind | `margin-top: 0.5rem (8px)` |

#### Right Column

```
<div class="xl:col-span-5">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `xl:col-span-5` | Tailwind | At `≥1024px`: `grid-column: span 5 / span 5` (~42% width) |

#### Card Grid

```
<div class="grid grid-cols-2 gap-3">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `grid` | Tailwind | `display: grid` |
| `grid-cols-2` | Tailwind | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `gap-3` | Tailwind | `gap: 1.5rem (24px)` — (3 × 0.5rem) |

#### Individual Customization Card

```
<div class="rfq-hero__card flex items-center justify-between">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-hero__card` | Custom CSS | `background-color: rgba(0,0,0,0.2); border-radius: 12px; padding: 16px 20px; color: #fff; transition: all 200ms ease` |
| `flex` | Tailwind | `display: flex` |
| `items-center` | Tailwind | `align-items: center` |
| `justify-between` | Tailwind | `justify-content: space-between` |

#### Card Text Block

```
<div class="flex flex-col">
  <span class="text-text-inverted text-body font-bold">Design</span>
  <span class="text-text-inverted/70 text-sm font-regular">customization</span>
</div>
```

| Element | Class | Type | Resolves To |
|---------|-------|------|-------------|
| Wrapper | `flex flex-col` | Tailwind | Vertical stack |
| Title | `text-text-inverted` | Tailwind | `color: #ffffff` |
| Title | `text-body` | Tailwind | `font-size: 1rem (16px)` (from `--font-size-body`) |
| Title | `font-bold` | Tailwind | `font-weight: 700` |
| Subtitle | `text-text-inverted/70` | Tailwind | `color: rgba(255, 255, 255, 0.7)` — opacity modifier |
| Subtitle | `text-sm` | Tailwind | `font-size: 0.75rem (12px)` (from `--font-size-sm`) |
| Subtitle | `font-regular` | Tailwind | `font-weight: 400` |

#### Card Icon/Image

```
<img class="w-12 h-12 object-contain flex-shrink-0" />
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `w-12` | Tailwind | `width: 6rem (96px)` — (12 × 0.5rem) |
| `h-12` | Tailwind | `height: 6rem (96px)` — (12 × 0.5rem) |
| `object-contain` | Tailwind | `object-fit: contain` |
| `flex-shrink-0` | Tailwind | `flex-shrink: 0` — prevents icon from shrinking |

> **Note on icon sizing:** With `--spacing: 0.5rem`, `w-12` = 12 × 0.5rem = 6rem = 96px which is larger than desired. For a 48px icon, use `w-[48px] h-[48px]` arbitrary values instead. The HTML above uses `w-12 h-12` for readability — adjust to `w-[48px] h-[48px]` if 48px icons are needed.

### 4.3 Custom CSS

All hero-specific custom CSS is defined in `src/style.css`. These styles use values **outside** the `@theme` token system because they are section-specific (gradients, rgba overlays) and not reused elsewhere.

#### `.rfq-hero` — Section Background

```css
.rfq-hero {
  background: linear-gradient(
    135deg,
    #f97316 0%,       /* Warm orange — gradient start */
    #ea580c 30%,      /* Deeper orange — mid-left */
    #7c3aed 65%,      /* Vivid purple — mid-right */
    #312e81 100%      /* Dark indigo — gradient end */
  );
  min-height: 280px;
  padding-bottom: 80px; /* Extra space for form overlap (Section 5) */
}
```

**Gradient direction:** `135deg` = top-left (orange) → bottom-right (indigo).

**Visual breakdown:**

```
┌────────────────────────────────────────────────────────┐
│ #f97316 ─── #ea580c ──────── #7c3aed ──── #312e81     │
│ (orange)    (deep orange)    (purple)     (dark indigo)│
│  0%          30%              65%          100%         │
└────────────────────────────────────────────────────────┘
```

#### `.rfq-hero__badge` — RFQ Badge

```css
.rfq-hero__badge {
  background-color: #f97316;            /* Same as gradient start */
  color: #ffffff;
  font-size: var(--font-size-xs);       /* 11px */
  font-weight: var(--font-weight-semibold); /* 600 */
  padding: 2px 8px;
  border-radius: var(--radius-badge);   /* 4px */
  text-transform: uppercase;
  letter-spacing: 0.025em;             /* Slight tracking for uppercase */
}
```

#### `.rfq-hero__subtitle` — Subtitle Text

```css
.rfq-hero__subtitle {
  color: rgba(255, 255, 255, 0.85);    /* White at 85% opacity */
}
```

#### `.rfq-hero__outlined-btn` — Pill Button

```css
.rfq-hero__outlined-btn {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-full);    /* 9999px — fully rounded pill */
  color: #ffffff;
  padding: 8px 20px;
  font-size: var(--font-size-base);     /* 14px */
  font-weight: var(--font-weight-medium); /* 500 */
  transition: all var(--transition-base); /* 200ms ease */
}

.rfq-hero__outlined-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);  /* Subtle white tint */
  border-color: rgba(255, 255, 255, 0.8);       /* Brighter border */
}
```

#### `.rfq-hero__card` — Customization Card

```css
.rfq-hero__card {
  background-color: rgba(0, 0, 0, 0.2);  /* Semi-transparent dark overlay */
  border-radius: 12px;                    /* Slightly larger than --radius-card (8px) */
  padding: 16px 20px;
  color: #ffffff;
  transition: all var(--transition-base);  /* 200ms ease */
}

.rfq-hero__card:hover {
  filter: brightness(1.1);               /* Lighten the card */
  transform: scale(1.02);                /* Slight zoom effect */
}
```

### 4.4 Token References

Every design value used in the hero section is mapped to a token from `@theme` in `src/style.css` or documented as a section-specific custom value.

#### Colors

| Visual Value | Token / Custom Value | Source |
|-------------|---------------------|--------|
| Hero gradient start | `#f97316` | Custom CSS (`.rfq-hero`) — not in `@theme` |
| Hero gradient 30% | `#ea580c` | Custom CSS (`.rfq-hero`) — not in `@theme` |
| Hero gradient 65% | `#7c3aed` | Custom CSS (`.rfq-hero`) — not in `@theme` |
| Hero gradient end | `#312e81` | Custom CSS (`.rfq-hero`) — not in `@theme` |
| White text | `--color-text-inverted` → `#ffffff` | `@theme` token |
| Badge background | `#f97316` | Custom CSS (`.rfq-hero__badge`) |
| Badge text | `#ffffff` | Custom CSS (`.rfq-hero__badge`) |
| Subtitle text | `rgba(255, 255, 255, 0.85)` | Custom CSS (`.rfq-hero__subtitle`) |
| Card subtitle | `rgba(255, 255, 255, 0.7)` | Tailwind opacity modifier `text-text-inverted/70` |
| Card background | `rgba(0, 0, 0, 0.2)` | Custom CSS (`.rfq-hero__card`) |
| Button border | `rgba(255, 255, 255, 0.5)` | Custom CSS (`.rfq-hero__outlined-btn`) |
| Button hover bg | `rgba(255, 255, 255, 0.1)` | Custom CSS (`.rfq-hero__outlined-btn:hover`) |
| Button hover border | `rgba(255, 255, 255, 0.8)` | Custom CSS (`.rfq-hero__outlined-btn:hover`) |
| Focus ring | `--color-primary-500` → `#cc9900` | `@theme` token via `.focus-ring` |

#### Typography

| Element | Font Size Token | Weight Token | Line Height Token |
|---------|----------------|--------------|-------------------|
| Badge text | `--font-size-xs` (11px) | `--font-weight-semibold` (600) | — |
| Badge label | `--font-size-base` (14px) | `--font-weight-regular` (400) | — |
| H1 heading | `--font-size-hero-lg` (32px) | `--font-weight-bold` (700) | `--line-height-tight` (1.25) |
| Subtitle | `--font-size-base` (14px) | `--font-weight-regular` (400) | `--line-height-normal` (1.5) |
| Video link | `--font-size-base` (14px) | `--font-weight-regular` (400) | — |
| Outlined button | `--font-size-base` (14px) | `--font-weight-medium` (500) | — |
| Card title | `--font-size-body` (16px) | `--font-weight-bold` (700) | — |
| Card subtitle | `--font-size-sm` (12px) | `--font-weight-regular` (400) | — |

#### Spacing

| Property | Token / Value | Resolved |
|----------|--------------|----------|
| Container max-width | `--container-lg` | 1472px |
| Container padding-x | `px-4` (4 × `--spacing`) | 32px |
| Container padding-top | `pt-8` (8 × `--spacing`) | 64px |
| Hero padding-bottom | Custom CSS | 80px |
| Hero min-height | Custom CSS | 280px |
| Grid gap (columns) | `gap-6` (6 × `--spacing`) | 48px |
| Left column vertical gap | `gap-4` (4 × `--spacing`) | 32px |
| Card grid gap | `gap-3` (3 × `--spacing`) | 24px |
| Badge row gap | `gap-2` (2 × `--spacing`) | 16px |
| Badge padding | Custom CSS | 2px 8px |
| Card padding | Custom CSS | 16px 20px |
| Button padding | Custom CSS | 8px 20px |

#### Border Radius

| Element | Token | Value |
|---------|-------|-------|
| Badge | `--radius-badge` | 4px |
| Outlined button | `--radius-full` | 9999px (pill) |
| Customization card | Custom CSS | 12px |
| Focus ring outline-offset | Custom CSS | 2px |

#### Shadows

| Element | Token | Value |
|---------|-------|-------|
| Hero section | — | No shadow (gradient bg only) |
| Cards | — | No box-shadow (semi-transparent bg provides depth) |

#### Transitions

| Element | Token | Value |
|---------|-------|-------|
| Outlined button | `--transition-base` | `200ms ease` |
| Customization cards | `--transition-base` | `200ms ease` |
| Video link | Tailwind `transition-opacity` | Default Tailwind transition |

### 4.5 Responsive Behavior

The hero section adapts across 3 breakpoint tiers. The primary shift happens at `xl` (1024px) where the layout changes from stacked to side-by-side.

#### Breakpoint Reference

| Name | Token | Min-Width | Layout Mode |
|------|-------|-----------|-------------|
| Mobile | `< --breakpoint-xl` | 0–1023px | Single column, stacked |
| Desktop | `≥ --breakpoint-xl` | 1024px+ | 2-column (7 + 5 grid) |

#### Mobile (< 1024px)

```
┌─────────────────────────────────┐
│        gradient background      │
│                                 │
│  [RFQ] Fiyat Teklifi Talebi    │
│                                 │
│  Özel talepleriniz için fiyat   │
│  teklifleri alın                │
│                                 │
│  Doğru tedarikçi eşleştirmesi   │
│                                 │
│  ▶ RFQ hakkında bilgi alın      │
│                                 │
│  [ 📋 0 talepler > ]           │
│                                 │
│  ┌──────────┐ ┌──────────┐     │
│  │ Design   │ │ Logo     │     │
│  │ custom.  │ │ custom.  │     │
│  └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐     │
│  │ Bundling │ │ Packaging│     │
│  │ custom.  │ │ custom.  │     │
│  └──────────┘ └──────────┘     │
│                                 │
└─────────────────────────────────┘
```

| Property | Mobile Value | Tailwind Class |
|----------|-------------|----------------|
| Grid columns | 1 column (stacked) | `grid-cols-1` (default) |
| Left column span | Full width | No `col-span` (defaults to auto) |
| Right column span | Full width | No `col-span` |
| H1 font size | `text-hero-lg` (32px) | Same as desktop — large heading retained |
| Container padding-x | 32px | `px-4` |
| Card grid | 2 columns | `grid-cols-2` (always 2×2) |

**Mobile-specific adjustments:**
- Text and cards stack vertically (single column)
- Cards remain in 2×2 grid (never collapse to 1-col)
- H1 max-width (`500px`) naturally wraps within mobile viewport
- Container horizontal padding remains consistent at 32px

#### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│                    gradient background                        │
│                                                               │
│  ┌─── Left Column (7/12) ───┐  ┌─── Right Column (5/12) ──┐ │
│  │                           │  │                           │ │
│  │  [RFQ] Fiyat Teklifi      │  │  ┌─────────┐ ┌─────────┐│ │
│  │  Talebi                   │  │  │ Design  │ │ Logo    ││ │
│  │                           │  │  │ custom. │ │ custom. ││ │
│  │  Özel talepleriniz için   │  │  └─────────┘ └─────────┘│ │
│  │  fiyat teklifleri alın    │  │  ┌─────────┐ ┌─────────┐│ │
│  │                           │  │  │Bundling │ │Packaging││ │
│  │  Doğru tedarikçi ...      │  │  │ custom. │ │ custom. ││ │
│  │                           │  │  └─────────┘ └─────────┘│ │
│  │  ▶ RFQ hakkında bilgi     │  │                           │ │
│  │  alın                     │  └───────────────────────────┘ │
│  │                           │                                │
│  │  [ 📋 0 talepler > ]     │                                │
│  └───────────────────────────┘                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

| Property | Desktop Value | Tailwind Class |
|----------|--------------|----------------|
| Grid columns | 12-column grid | `xl:grid-cols-12` |
| Left column span | 7 of 12 (~58%) | `xl:col-span-7` |
| Right column span | 5 of 12 (~42%) | `xl:col-span-5` |
| Vertical alignment | Centered | `items-center` |
| Column gap | 48px | `gap-6` |

### 4.6 Interactions

All interactive elements in the hero section with their state changes:

#### Outlined Pill Button — Hover State

| Property | Default | Hover |
|----------|---------|-------|
| Background | `transparent` | `rgba(255, 255, 255, 0.1)` |
| Border color | `rgba(255, 255, 255, 0.5)` | `rgba(255, 255, 255, 0.8)` |
| Transition | — | `all 200ms ease` |
| Cursor | `pointer` | `pointer` |

**CSS:**
```css
.rfq-hero__outlined-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
}
```

#### Outlined Pill Button — Focus State

| Property | Value |
|----------|-------|
| Outline | `2px solid #cc9900` (via `.focus-ring:focus-visible`) |
| Outline offset | `2px` |
| Trigger | Keyboard focus only (`:focus-visible`) |

#### Customization Cards — Hover State

| Property | Default | Hover |
|----------|---------|-------|
| Filter | `none` | `brightness(1.1)` — subtle lightening |
| Transform | `none` | `scale(1.02)` — 2% zoom |
| Transition | — | `all 200ms ease` |
| Cursor | `default` | `default` (cards are decorative, not clickable) |

**CSS:**
```css
.rfq-hero__card:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}
```

#### Video/Info Link — Hover State

| Property | Default | Hover |
|----------|---------|-------|
| Opacity | `1` | `0.8` |
| Text decoration | `underline` | `underline` (maintained) |
| Transition | — | `opacity` (Tailwind default timing) |
| Cursor | `pointer` | `pointer` |

**Tailwind classes:** `hover:opacity-80 transition-opacity`

#### Accessibility Notes for Interactions

| Element | ARIA | Keyboard |
|---------|------|----------|
| Section | `aria-label="RFQ Hero Banner"` | — |
| Video link | `aria-label="RFQ hakkında bilgi videosu"` | Focusable via `Tab`, activate via `Enter` |
| Outlined button | `aria-label="Taleplerinizi görüntüleyin"` | Focusable via `Tab`, activate via `Enter`/`Space` |
| Card icons | `alt` text on each `<img>` | Decorative — images have alt text for context |
| SVG icons | `aria-hidden="true"` | Hidden from screen readers (text labels provide meaning) |

---

## 5. RFQ Form (Section 2)

The RFQ form is a **white card that overlaps the hero section by 50px**, creating a floating effect. It contains a heading, a multi-line textarea, a file upload button with a Flowbite tooltip, and a footer bar with an AI toggle checkbox, AI badge, and a CTA submit button. The form uses `novalidate` (custom JS validation) and prevents empty textarea submissions.

> **Data Source:** User input — no mock data needed for this section
> **Type:** `RFQFormData` from `src/types/index.ts`
> **File Upload Config:** `FILE_UPLOAD_CONFIG` from `src/types/index.ts` (maxFiles: 6, allowedExtensions)
> **Custom CSS Block:** `.rfq-form` and related BEM classes in `src/style.css`
> **Flowbite Components:** Tooltip (`data-tooltip-target`), Checkbox (CSS-only)

### 5.1 HTML Structure

```html
<section
  id="rfq-form"
  class="rfq-form"
  data-section="form"
  aria-label="RFQ Formu"
>
  <div class="mx-auto max-w-[var(--container-lg)] px-4">

    <!-- ── Form Card (white, overlapping hero by 50px) ── -->
    <div class="rfq-form__card">
      <form id="rfq-form-element" novalidate>

        <!-- ── Form Heading ── -->
        <h2 class="text-text-primary text-xl font-bold leading-snug mb-4">
          Talebinizin detaylarını yazın
        </h2>

        <!-- ── Textarea Container ── -->
        <div class="border border-border-default rounded-input p-3 mb-3 focus-within:border-border-focus transition-colors">
          <textarea
            id="rfq-details"
            name="details"
            class="w-full min-h-[120px] resize-y bg-transparent text-text-primary text-base font-regular leading-normal placeholder:text-input-placeholder focus:outline-none"
            placeholder="Bir görsel, dosya ekleyin veya anahtar kelimeler yazın..."
            aria-label="Talep detayları"
          ></textarea>

          <!-- ── File Upload Button + Tooltip (inside textarea container) ── -->
          <div class="flex items-center gap-2 pt-2 border-t border-border-muted">

            <!-- Upload Button (Tooltip Trigger) -->
            <button
              type="button"
              id="rfq-upload-btn"
              class="rfq-form__upload-btn focus-ring inline-flex items-center gap-1.5"
              data-tooltip-target="tooltip-file-upload"
              data-tooltip-trigger="hover"
              aria-label="Dosya yükle"
            >
              <!-- Paperclip / Attachment Icon -->
              <svg
                class="w-4 h-4 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Dosya yükle</span>
            </button>

            <!-- Flowbite Tooltip (File Upload Info) -->
            <div
              id="tooltip-file-upload"
              role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-caption font-regular text-text-secondary bg-surface rounded-md shadow-md opacity-0 transition-opacity"
            >
              <p class="font-semibold text-text-primary text-caption mb-1">
                En fazla 6 dosya ekleyebilirsiniz.
              </p>
              <p class="text-text-tertiary text-xs">
                Desteklenen formatlar: jpg, jpeg, png, pdf, docx, doc, xlsx, xls
              </p>
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <!-- Hidden File Input (triggered by upload button click) -->
            <input
              type="file"
              id="rfq-file-input"
              class="hidden"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.docx,.doc,.xlsx,.xls"
              aria-hidden="true"
            />

          </div>
        </div>

        <!-- ── Form Footer: Checkbox + AI Badge + CTA ── -->
        <div class="flex items-center justify-between flex-wrap gap-3">

          <!-- Left Side: Checkbox + AI Label -->
          <div class="flex items-center gap-2">

            <!-- Flowbite Checkbox (checked by default) -->
            <input
              type="checkbox"
              id="rfq-ai-toggle"
              name="aiEnabled"
              checked
              class="w-4 h-4 text-primary-500 bg-input-bg border-border-default rounded-sm focus:ring-primary-500 focus:ring-2"
              aria-describedby="rfq-ai-label"
            />

            <!-- AI Badge (gradient cyan) -->
            <span class="rfq-ai-badge" aria-hidden="true">AI</span>

            <!-- Label Text -->
            <label
              id="rfq-ai-label"
              for="rfq-ai-toggle"
              class="text-text-secondary text-caption font-regular cursor-pointer select-none"
            >
              Yapay Zeka ile kolayca RFQ oluşturun
            </label>

            <!-- Info Icon (Tooltip Trigger — optional info) -->
            <svg
              class="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 cursor-help"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>

          </div>

          <!-- Right Side: CTA Submit Button -->
          <button
            type="submit"
            class="rfq-form__cta focus-ring"
            aria-label="RFQ detaylarını yaz ve gönder"
          >
            RFQ detaylarını yaz
          </button>

        </div>

      </form>
    </div>

  </div>
</section>
```

**Element Inventory:**

| # | Element | Tag | Content / Purpose |
|---|---------|-----|-------------------|
| 1 | Section wrapper | `<section>` | Overlap container — `margin-top: -50px`, `z-index: 10` |
| 2 | Container | `<div>` | Max-width 1472px, horizontal padding |
| 3 | Form card | `<div>` | White raised card with shadow, rounded-16px, padding 28px 32px |
| 4 | Form element | `<form>` | `novalidate` — custom JS validation handles empty textarea |
| 5 | Heading — "Talebinizin detaylarını yazın" | `<h2>` | Dark text, bold, 20px |
| 6 | Textarea container | `<div>` | Bordered box with focus-within state |
| 7 | Textarea | `<textarea>` | Multi-line input with placeholder text |
| 8 | File upload row | `<div>` | Inside textarea container, below separator line |
| 9 | Upload button | `<button>` | Dashed border, paperclip icon + "Dosya yükle" |
| 10 | Flowbite tooltip | `<div>` | Max 6 files info + supported formats list |
| 11 | Hidden file input | `<input type="file">` | Triggered programmatically by upload button |
| 12 | Footer bar | `<div>` | Flex row: left = checkbox area, right = CTA |
| 13 | AI checkbox | `<input type="checkbox">` | Flowbite styled, checked by default |
| 14 | AI badge | `<span>` | Gradient cyan badge "AI" |
| 15 | AI label | `<label>` | "Yapay Zeka ile kolayca RFQ oluşturun" |
| 16 | Info icon | `<svg>` | Circle-i info icon, muted gray |
| 17 | CTA button | `<button type="submit">` | "RFQ detaylarını yaz" — orange pill |

### 5.2 Tailwind/CSS Classes Per Element

Every element's class list is documented below. Classes are split into **Tailwind utilities** (auto-generated from `@theme` tokens) and **custom CSS classes** (defined in `src/style.css`).

#### Section Wrapper

```
<section class="rfq-form" ...>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-form` | Custom CSS | `margin-top: -50px; position: relative; z-index: 10;` — overlap mechanism |

#### Container

```
<div class="mx-auto max-w-[var(--container-lg)] px-4">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `mx-auto` | Tailwind | `margin-left: auto; margin-right: auto` |
| `max-w-[var(--container-lg)]` | Tailwind (arbitrary) | `max-width: 1472px` |
| `px-4` | Tailwind | `padding-left: 2rem (32px); padding-right: 2rem (32px)` — (4 × 0.5rem) |

#### Form Card

```
<div class="rfq-form__card">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-form__card` | Custom CSS | `background: var(--color-surface-raised) [#ffffff]; border-radius: var(--radius-form-card) [16px]; box-shadow: var(--shadow-form) [0 10px 40px rgba(0,0,0,0.12)]; padding: 28px 32px; max-width: 1100px; margin-left: auto; margin-right: auto;` |

#### Heading

```
<h2 class="text-text-primary text-xl font-bold leading-snug mb-4">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `text-text-primary` | Tailwind | `color: #111827` (from `--color-text-primary`) |
| `text-xl` | Tailwind | `font-size: 1.25rem (20px)` (from `--font-size-xl`) |
| `font-bold` | Tailwind | `font-weight: 700` (from `--font-weight-bold`) |
| `leading-snug` | Tailwind | `line-height: 1.375` (from `--line-height-snug`) |
| `mb-4` | Tailwind | `margin-bottom: 2rem (32px)` — (4 × 0.5rem) |

#### Textarea Container

```
<div class="border border-border-default rounded-input p-3 mb-3 focus-within:border-border-focus transition-colors">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `border` | Tailwind | `border-width: 1px` |
| `border-border-default` | Tailwind | `border-color: #e5e5e5` (from `--color-border-default`) |
| `rounded-input` | Tailwind | `border-radius: 8px` (from `--radius-input`) |
| `p-3` | Tailwind | `padding: 1.5rem (24px)` — (3 × 0.5rem) |
| `mb-3` | Tailwind | `margin-bottom: 1.5rem (24px)` — (3 × 0.5rem) |
| `focus-within:border-border-focus` | Tailwind | On focus-within: `border-color: #cc9900` (from `--color-border-focus`) |
| `transition-colors` | Tailwind | `transition-property: color, background-color, border-color, ...` |

#### Textarea

```
<textarea class="w-full min-h-[120px] resize-y bg-transparent text-text-primary text-base font-regular leading-normal placeholder:text-input-placeholder focus:outline-none">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `w-full` | Tailwind | `width: 100%` |
| `min-h-[120px]` | Tailwind (arbitrary) | `min-height: 120px` |
| `resize-y` | Tailwind | `resize: vertical` — user can vertically resize |
| `bg-transparent` | Tailwind | `background-color: transparent` |
| `text-text-primary` | Tailwind | `color: #111827` (from `--color-text-primary`) |
| `text-base` | Tailwind | `font-size: 0.875rem (14px)` (from `--font-size-base`) |
| `font-regular` | Tailwind | `font-weight: 400` (from `--font-weight-regular`) |
| `leading-normal` | Tailwind | `line-height: 1.5` (from `--line-height-normal`) |
| `placeholder:text-input-placeholder` | Tailwind | Placeholder `color: #9ca3af` (from `--color-input-placeholder`) |
| `focus:outline-none` | Tailwind | On focus: `outline: none` — parent container handles focus border |

#### File Upload Row (Separator)

```
<div class="flex items-center gap-2 pt-2 border-t border-border-muted">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `flex` | Tailwind | `display: flex` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-2` | Tailwind | `gap: 1rem (16px)` — (2 × 0.5rem) |
| `pt-2` | Tailwind | `padding-top: 1rem (16px)` — (2 × 0.5rem) |
| `border-t` | Tailwind | `border-top-width: 1px` |
| `border-border-muted` | Tailwind | `border-top-color: #f3f4f6` (from `--color-border-muted`) |

#### Upload Button

```
<button class="rfq-form__upload-btn focus-ring inline-flex items-center gap-1.5">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-form__upload-btn` | Custom CSS | `border: 1px dashed var(--color-border-strong) [#d1d5db]; color: var(--color-text-tertiary) [#6b7280]; font-size: var(--font-size-caption) [13px]; border-radius: var(--radius-input) [8px]; padding: 8px 12px; transition: border-color 200ms ease;` |
| `focus-ring` | Custom CSS | On `:focus-visible`: `outline: 2px solid #cc9900; outline-offset: 2px` |
| `inline-flex` | Tailwind | `display: inline-flex` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-1.5` | Tailwind | `gap: 0.75rem (12px)` — (1.5 × 0.5rem) |

#### Flowbite Tooltip

```
<div class="absolute z-10 invisible inline-block px-3 py-2 text-caption font-regular text-text-secondary bg-surface rounded-md shadow-md opacity-0 transition-opacity">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `absolute` | Tailwind | `position: absolute` |
| `z-10` | Tailwind | `z-index: 10` |
| `invisible` | Tailwind | `visibility: hidden` (Flowbite toggles this) |
| `inline-block` | Tailwind | `display: inline-block` |
| `px-3` | Tailwind | `padding-left: 1.5rem (24px); padding-right: 1.5rem (24px)` |
| `py-2` | Tailwind | `padding-top: 1rem (16px); padding-bottom: 1rem (16px)` |
| `text-caption` | Tailwind | `font-size: 0.8125rem (13px)` (from `--font-size-caption`) |
| `font-regular` | Tailwind | `font-weight: 400` |
| `text-text-secondary` | Tailwind | `color: #374151` |
| `bg-surface` | Tailwind | `background-color: #ffffff` |
| `rounded-md` | Tailwind | `border-radius: 8px` (from `--radius-md`) |
| `shadow-md` | Tailwind | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` |
| `opacity-0` | Tailwind | `opacity: 0` (Flowbite animates this) |
| `transition-opacity` | Tailwind | `transition-property: opacity` |

#### Tooltip Inner Text

```
<p class="font-semibold text-text-primary text-caption mb-1">En fazla 6 dosya ekleyebilirsiniz.</p>
<p class="text-text-tertiary text-xs">Desteklenen formatlar: jpg, jpeg, png, pdf, docx, doc, xlsx, xls</p>
```

| Element | Class | Type | Resolves To |
|---------|-------|------|-------------|
| Title line | `font-semibold` | Tailwind | `font-weight: 600` |
| Title line | `text-text-primary` | Tailwind | `color: #111827` |
| Title line | `text-caption` | Tailwind | `font-size: 0.8125rem (13px)` |
| Title line | `mb-1` | Tailwind | `margin-bottom: 0.5rem (8px)` |
| Formats line | `text-text-tertiary` | Tailwind | `color: #6b7280` |
| Formats line | `text-xs` | Tailwind | `font-size: 0.6875rem (11px)` |

#### Footer Bar

```
<div class="flex items-center justify-between flex-wrap gap-3">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `flex` | Tailwind | `display: flex` |
| `items-center` | Tailwind | `align-items: center` |
| `justify-between` | Tailwind | `justify-content: space-between` |
| `flex-wrap` | Tailwind | `flex-wrap: wrap` — allows wrapping on narrow screens |
| `gap-3` | Tailwind | `gap: 1.5rem (24px)` — (3 × 0.5rem) |

#### Checkbox (Left Side)

```
<input type="checkbox" class="w-4 h-4 text-primary-500 bg-input-bg border-border-default rounded-sm focus:ring-primary-500 focus:ring-2">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `w-4` | Tailwind | `width: 2rem (32px)` — (4 × 0.5rem). **Note:** For a standard 16px checkbox, use `w-[16px] h-[16px]` or rely on Flowbite's default sizing |
| `h-4` | Tailwind | `height: 2rem (32px)` — same note as above |
| `text-primary-500` | Tailwind | Checked state fill: `#cc9900` (Flowbite uses `text-*` for checkbox checked color) |
| `bg-input-bg` | Tailwind | `background-color: #ffffff` (from `--color-input-bg`) |
| `border-border-default` | Tailwind | `border-color: #e5e5e5` |
| `rounded-sm` | Tailwind | `border-radius: 4px` (from `--radius-sm`) |
| `focus:ring-primary-500` | Tailwind | Focus ring color: `#cc9900` |
| `focus:ring-2` | Tailwind | Focus ring width: `2px` |

> **Note on checkbox sizing:** With `--spacing: 0.5rem`, `w-4` = 32px which is oversized for a checkbox. Flowbite's checkbox component internally sets `width/height` via its own styles. The `w-4 h-4` classes here follow Flowbite's documented pattern — Flowbite overrides these to render a standard 16×16px checkbox. If Flowbite's override does not apply, use `w-[16px] h-[16px]` instead.

#### AI Badge

```
<span class="rfq-ai-badge">AI</span>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-ai-badge` | Custom CSS | `background: linear-gradient(135deg, var(--color-accent-400) [#22d3ee], var(--color-accent-600) [#0891b2]); color: #ffffff; font-size: var(--font-size-xs) [11px]; font-weight: var(--font-weight-semibold) [600]; padding: 2px 6px; border-radius: var(--radius-badge) [4px];` |

#### AI Label

```
<label class="text-text-secondary text-caption font-regular cursor-pointer select-none">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `text-text-secondary` | Tailwind | `color: #374151` |
| `text-caption` | Tailwind | `font-size: 0.8125rem (13px)` |
| `font-regular` | Tailwind | `font-weight: 400` |
| `cursor-pointer` | Tailwind | `cursor: pointer` — indicates clickable label |
| `select-none` | Tailwind | `user-select: none` — prevents accidental text selection |

#### CTA Submit Button

```
<button type="submit" class="rfq-form__cta focus-ring">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-form__cta` | Custom CSS | `background-color: #f97316; color: #ffffff; border-radius: var(--radius-full) [9999px]; padding: 14px 40px; font-size: var(--font-size-md) [15px]; font-weight: var(--font-weight-semibold) [600]; transition: background-color 200ms ease;` |
| `focus-ring` | Custom CSS | On `:focus-visible`: `outline: 2px solid #cc9900; outline-offset: 2px` |

### 5.3 Custom CSS

All form-specific custom CSS is defined in `src/style.css`. These styles handle the **overlap mechanism**, card appearance, and interactive element styling.

#### `.rfq-form` — Overlap Mechanism

```css
.rfq-form {
  margin-top: -50px;   /* Pulls form card UP into the hero section */
  position: relative;  /* Establishes stacking context */
  z-index: 10;         /* Ensures form card sits ABOVE hero content */
}
```

**How the overlap works:**

```
┌───────────────────────────────────────────────┐
│            HERO SECTION                        │
│       (padding-bottom: 80px provides           │
│        the visual space below content)         │
│                                                │
│ ╔══════════════════════════════════════════╗   │ ← Hero ends here
│ ║          ↑ margin-top: -50px            ║   │
╠═╣  ┌─────────────────────────────────────┐ ╠═══╡ ← 50px of form overlaps hero
│ ║  │      WHITE FORM CARD                │ ║   │
│ ║  │   (z-index: 10, position: relative) │ ║   │
│ ║  │   (shadow: 0 10px 40px ...)         │ ║   │
│ ║  └─────────────────────────────────────┘ ║   │
│ ╚══════════════════════════════════════════╝   │
│                                                │
│         NEXT SECTION (below form)              │
└───────────────────────────────────────────────┘
```

**Three CSS properties create the overlap:**
1. **Hero:** `padding-bottom: 80px` — extra whitespace at bottom of gradient
2. **Form:** `margin-top: -50px` — pulls card up into hero space
3. **Form:** `z-index: 10` — ensures card renders above hero background

#### `.rfq-form__card` — White Card Container

```css
.rfq-form__card {
  background: var(--color-surface-raised);   /* #ffffff */
  border-radius: var(--radius-form-card);    /* 16px */
  box-shadow: var(--shadow-form);            /* 0 10px 40px rgba(0,0,0,0.12) */
  padding: 28px 32px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}
```

**Card dimensions:**
- **Max width:** 1100px (narrower than the 1472px container for centered appearance)
- **Border radius:** 16px (`--radius-form-card`) — larger radius than standard cards (8px)
- **Shadow:** Heavy drop shadow for floating effect
- **Padding:** 28px top/bottom, 32px left/right

#### `.rfq-form__cta` — CTA Submit Button

```css
.rfq-form__cta {
  background-color: #f97316;                           /* Same warm orange as hero gradient start */
  color: #ffffff;
  border-radius: var(--radius-full);                   /* 9999px — fully rounded pill */
  padding: 14px 40px;
  font-size: var(--font-size-md);                      /* 15px */
  font-weight: var(--font-weight-semibold);            /* 600 */
  transition: background-color var(--transition-base); /* 200ms ease */
}

.rfq-form__cta:hover {
  background-color: #ea580c;                           /* Darker orange on hover */
}
```

#### `.rfq-form__upload-btn` — File Upload Button

```css
.rfq-form__upload-btn {
  border: 1px dashed var(--color-border-strong);       /* #d1d5db — dashed border style */
  color: var(--color-text-tertiary);                   /* #6b7280 — muted gray text */
  font-size: var(--font-size-caption);                 /* 13px */
  border-radius: var(--radius-input);                  /* 8px */
  padding: 8px 12px;
  transition: border-color var(--transition-base);     /* 200ms ease */
}

.rfq-form__upload-btn:hover {
  border-color: var(--color-primary-500);              /* #cc9900 — gold highlight on hover */
  color: var(--color-primary-600);                     /* #b38600 — darker gold text on hover */
}
```

#### `.rfq-form__upload-btn--dragover` — Drag-Over State

```css
.rfq-form__upload-btn--dragover {
  border-color: var(--color-primary-500);              /* #cc9900 — gold border during drag */
  background-color: var(--color-primary-50);           /* #fff9e6 — very light gold tint */
}
```

This modifier class is added/removed via JavaScript during file drag events.

#### `.rfq-ai-badge` — AI Badge (Gradient)

```css
.rfq-ai-badge {
  background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
  /* → linear-gradient(135deg, #22d3ee, #0891b2) — cyan/turquoise gradient */
  color: #ffffff;
  font-size: var(--font-size-xs);                      /* 11px */
  font-weight: var(--font-weight-semibold);            /* 600 */
  padding: 2px 6px;
  border-radius: var(--radius-badge);                  /* 4px */
}
```

### 5.4 Token References

Every design value used in the RFQ form section is mapped to a token from `@theme` in `src/style.css` or documented as a section-specific custom value.

#### Colors

| Visual Value | Token / Custom Value | Source |
|-------------|---------------------|--------|
| Form card background | `--color-surface-raised` → `#ffffff` | `@theme` token |
| Heading text | `--color-text-primary` → `#111827` | `@theme` token |
| Textarea text | `--color-text-primary` → `#111827` | `@theme` token |
| Textarea placeholder | `--color-input-placeholder` → `#9ca3af` | `@theme` token |
| Textarea border | `--color-border-default` → `#e5e5e5` | `@theme` token |
| Textarea focus border | `--color-border-focus` → `#cc9900` | `@theme` token |
| File separator line | `--color-border-muted` → `#f3f4f6` | `@theme` token |
| Upload button border | `--color-border-strong` → `#d1d5db` | `@theme` token |
| Upload button text | `--color-text-tertiary` → `#6b7280` | `@theme` token |
| Upload hover border | `--color-primary-500` → `#cc9900` | `@theme` token |
| Upload hover text | `--color-primary-600` → `#b38600` | `@theme` token |
| Dragover bg | `--color-primary-50` → `#fff9e6` | `@theme` token |
| Checkbox checked | `--color-primary-500` → `#cc9900` | `@theme` token |
| AI badge gradient start | `--color-accent-400` → `#22d3ee` | `@theme` token |
| AI badge gradient end | `--color-accent-600` → `#0891b2` | `@theme` token |
| AI badge text | `#ffffff` | Custom CSS |
| AI label text | `--color-text-secondary` → `#374151` | `@theme` token |
| Info icon | `--color-text-tertiary` → `#6b7280` | `@theme` token |
| CTA button bg | `#f97316` | Custom CSS (matches hero gradient start) |
| CTA button text | `#ffffff` | Custom CSS |
| CTA hover bg | `#ea580c` | Custom CSS |
| Focus ring | `--color-primary-500` → `#cc9900` | `@theme` token via `.focus-ring` |
| Tooltip bg | `--color-surface` → `#ffffff` | `@theme` token |
| Tooltip title text | `--color-text-primary` → `#111827` | `@theme` token |
| Tooltip body text | `--color-text-tertiary` → `#6b7280` | `@theme` token |

#### Typography

| Element | Font Size Token | Weight Token | Line Height Token |
|---------|----------------|--------------|-------------------|
| Heading (H2) | `--font-size-xl` (20px) | `--font-weight-bold` (700) | `--line-height-snug` (1.375) |
| Textarea text | `--font-size-base` (14px) | `--font-weight-regular` (400) | `--line-height-normal` (1.5) |
| Upload button | `--font-size-caption` (13px) | — (inherits regular) | — |
| AI label | `--font-size-caption` (13px) | `--font-weight-regular` (400) | — |
| AI badge | `--font-size-xs` (11px) | `--font-weight-semibold` (600) | — |
| CTA button | `--font-size-md` (15px) | `--font-weight-semibold` (600) | — |
| Tooltip title | `--font-size-caption` (13px) | `--font-weight-semibold` (600) | — |
| Tooltip formats | `--font-size-xs` (11px) | `--font-weight-regular` (400) | — |

#### Spacing

| Property | Token / Value | Resolved |
|----------|--------------|----------|
| Container max-width | `--container-lg` | 1472px |
| Container padding-x | `px-4` (4 × `--spacing`) | 32px |
| Card max-width | Custom CSS | 1100px |
| Card padding | Custom CSS | 28px 32px |
| Card border-radius | `--radius-form-card` | 16px |
| Heading margin-bottom | `mb-4` (4 × `--spacing`) | 32px |
| Textarea container padding | `p-3` (3 × `--spacing`) | 24px |
| Textarea container margin-bottom | `mb-3` (3 × `--spacing`) | 24px |
| Textarea min-height | Arbitrary `min-h-[120px]` | 120px |
| File row padding-top | `pt-2` (2 × `--spacing`) | 16px |
| File row gap | `gap-2` (2 × `--spacing`) | 16px |
| Upload button padding | Custom CSS | 8px 12px |
| Upload button icon gap | `gap-1.5` (1.5 × `--spacing`) | 12px |
| Footer gap | `gap-3` (3 × `--spacing`) | 24px |
| Checkbox size | `w-4 h-4` | 16px (Flowbite overridden) |
| AI badge padding | Custom CSS | 2px 6px |
| CTA button padding | Custom CSS | 14px 40px |
| Form overlap (margin-top) | Custom CSS | -50px |

#### Border Radius

| Element | Token | Value |
|---------|-------|-------|
| Form card | `--radius-form-card` | 16px |
| Textarea container | `--radius-input` | 8px |
| Upload button | `--radius-input` | 8px |
| Checkbox | `--radius-sm` | 4px |
| AI badge | `--radius-badge` | 4px |
| CTA button | `--radius-full` | 9999px (pill) |
| Tooltip | `--radius-md` | 8px |

#### Shadows

| Element | Token | Value |
|---------|-------|-------|
| Form card | `--shadow-form` | `0 10px 40px rgba(0, 0, 0, 0.12)` |
| Tooltip | `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` |

#### Transitions

| Element | Token | Value |
|---------|-------|-------|
| Textarea border | Tailwind `transition-colors` | Default Tailwind color transition |
| Upload button border | `--transition-base` | `200ms ease` |
| CTA button bg | `--transition-base` | `200ms ease` |
| Tooltip opacity | Tailwind `transition-opacity` | Default Tailwind opacity transition |

### 5.5 Flowbite References

The RFQ form uses two Flowbite components: **Tooltip** and **Checkbox**. Both are data-attribute driven and require Flowbite JS to be initialized.

#### Tooltip — File Upload Info

Flowbite tooltips are triggered via `data-tooltip-target` and `data-tooltip-trigger` attributes. No manual JS initialization is needed for static tooltips.

**Trigger Element (Upload Button):**

```html
<button
  data-tooltip-target="tooltip-file-upload"
  data-tooltip-trigger="hover"
  type="button"
>
  Dosya yükle
</button>
```

**Tooltip Element:**

```html
<div id="tooltip-file-upload" role="tooltip" class="...">
  <p>En fazla 6 dosya ekleyebilirsiniz.</p>
  <p>Desteklenen formatlar: jpg, jpeg, png, pdf, docx, doc, xlsx, xls</p>
  <div class="tooltip-arrow" data-popper-arrow></div>
</div>
```

**Flowbite Tooltip Data Attributes:**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-tooltip-target` | `"tooltip-file-upload"` | Links trigger button to tooltip element by `id` |
| `data-tooltip-trigger` | `"hover"` | Shows tooltip on mouse hover (not click) |
| `data-popper-arrow` | — (no value) | Marks the tooltip arrow element for Popper.js positioning |
| `role="tooltip"` | — | ARIA role for accessibility |

**Flowbite Tooltip Behavior:**

| State | CSS Applied by Flowbite |
|-------|------------------------|
| Hidden (default) | `visibility: hidden; opacity: 0;` — tooltip is in DOM but invisible |
| Visible (hover) | `visibility: visible; opacity: 1;` — Flowbite toggles these classes |
| Positioning | Popper.js auto-positions tooltip (top/bottom/left/right) to avoid viewport overflow |

**Initialization Requirement:**

```typescript
// src/main.ts — Flowbite must be imported and initialized
import 'flowbite';
import { initFlowbite } from 'flowbite';

document.addEventListener('DOMContentLoaded', () => {
  initFlowbite(); // Scans DOM for data-tooltip-* attributes
});
```

#### Checkbox — AI Toggle

Flowbite checkboxes are **CSS-only** — they require no JS initialization. The checkbox appearance is styled via Flowbite's Tailwind plugin which targets `input[type="checkbox"]` with the appropriate utility classes.

**Checkbox Pattern:**

```html
<input
  type="checkbox"
  id="rfq-ai-toggle"
  checked
  class="w-4 h-4 text-primary-500 bg-input-bg border-border-default rounded-sm focus:ring-primary-500 focus:ring-2"
/>
<label for="rfq-ai-toggle">...</label>
```

**Flowbite Checkbox States:**

| State | Visual |
|-------|--------|
| Unchecked | White background, gray border (`#e5e5e5`) |
| Checked | Gold fill (`#cc9900`), white checkmark icon |
| Focus | Gold ring (`#cc9900`), 2px width |
| Disabled | Not applicable (always enabled in this form) |

### 5.6 Responsive Behavior

The RFQ form adapts across breakpoints. The primary changes are card width, padding, and footer layout direction.

#### Breakpoint Reference

| Name | Token | Min-Width | Layout Mode |
|------|-------|-----------|-------------|
| Mobile | `< --breakpoint-md` | 0–639px | Compact: stacked footer, reduced padding |
| Tablet | `--breakpoint-md` to `< --breakpoint-xl` | 640–1023px | Medium: side-by-side footer, moderate padding |
| Desktop | `≥ --breakpoint-xl` | 1024px+ | Full: max-width card, generous padding |

#### Mobile (< 640px)

```
┌─────────────────────────────────────┐
│  (hero gradient end)                │
│                                     │
│  ┌─────────────────────────────┐    │  ← margin-top: -50px
│  │  Talebinizin detaylarını    │    │
│  │  yazın                      │    │
│  │                             │    │
│  │  ┌───────────────────────┐  │    │
│  │  │ Placeholder text...   │  │    │
│  │  │                       │  │    │
│  │  │                       │  │    │
│  │  ├───────────────────────┤  │    │
│  │  │ 📎 Dosya yükle       │  │    │
│  │  └───────────────────────┘  │    │
│  │                             │    │
│  │  ☑ [AI] Yapay Zeka ile     │    │  ← Wraps to full width
│  │  kolayca RFQ oluşturun ⓘ  │    │
│  │                             │    │
│  │  ┌─────────────────────┐   │    │  ← CTA wraps to new line
│  │  │  RFQ detaylarını yaz │   │    │
│  │  └─────────────────────┘   │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

| Property | Mobile Value | Implementation |
|----------|-------------|----------------|
| Card max-width | 100% (no max-width constraint) | Card fills container minus padding |
| Card padding | 20px 16px | Override via `@media (max-width: 639px)` or responsive classes |
| Heading font-size | 18px (`text-lg`) | `text-lg md:text-xl` responsive class |
| Footer direction | Wrapped (checkbox row + CTA on new line) | `flex-wrap` allows natural wrapping |
| CTA button width | Full width | `w-full md:w-auto` on CTA button |
| CTA button padding | 12px 24px | Reduced on mobile |
| Textarea min-height | 100px | Slightly smaller on mobile |
| Overlap margin | -50px | Same on all breakpoints |

**Mobile-specific adjustments:**
- Footer bar wraps: checkbox/AI label row takes full width, CTA drops to next line
- CTA button stretches to full width for better touch target
- Card padding is reduced for tighter mobile layout
- The overlap mechanism (`margin-top: -50px`) remains consistent across all breakpoints

#### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  (hero gradient end)                                              │
│                                                                   │
│        ┌──────────────────────────────────────────────┐          │
│        │  Talebinizin detaylarını yazın                │          │
│        │                                              │          │
│        │  ┌────────────────────────────────────────┐  │          │
│        │  │ Bir görsel, dosya ekleyin veya         │  │          │
│        │  │ anahtar kelimeler yazın...             │  │          │
│        │  │                                        │  │          │
│        │  ├────────────────────────────────────────┤  │          │
│        │  │ 📎 Dosya yükle                        │  │          │
│        │  └────────────────────────────────────────┘  │          │
│        │                                              │          │
│        │  ☑ [AI] Yapay Zeka ile kolayca    [ RFQ detaylarını yaz ]│
│        │  RFQ oluşturun ⓘ                            │          │
│        └──────────────────────────────────────────────┘          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Desktop Value | Implementation |
|----------|--------------|----------------|
| Card max-width | 1100px | Custom CSS `.rfq-form__card { max-width: 1100px }` |
| Card padding | 28px 32px | Custom CSS |
| Heading font-size | 20px (`text-xl`) | Default (no responsive prefix needed) |
| Footer direction | Single row — left: checkbox area, right: CTA | `justify-between` keeps them apart |
| CTA button width | Auto (content-sized) | `w-auto` (default) |
| Textarea min-height | 120px | Arbitrary `min-h-[120px]` |

### 5.7 Interactions & Validation

All interactive behaviors in the RFQ form section, including file upload, form submission, drag-and-drop, and checkbox toggle.

#### File Upload — Click Flow

When the user clicks the "Dosya yükle" button, the hidden `<input type="file">` is triggered programmatically.

**TypeScript Implementation (in `src/main.ts`):**

```typescript
const uploadBtn = document.getElementById('rfq-upload-btn') as HTMLButtonElement;
const fileInput = document.getElementById('rfq-file-input') as HTMLInputElement;

// Click handler: open file picker
uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

// File selection handler: validate and process files
fileInput.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  // Validate file count (max 6)
  if (files.length > FILE_UPLOAD_CONFIG.maxFiles) {
    alert(`En fazla ${FILE_UPLOAD_CONFIG.maxFiles} dosya ekleyebilirsiniz.`);
    target.value = ''; // Reset input
    return;
  }

  // Validate file extensions
  for (const file of Array.from(files)) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext as AllowedFileExtension)) {
      alert(`Desteklenmeyen dosya formatı: ${file.name}`);
      target.value = ''; // Reset input
      return;
    }
  }

  // Files are valid — proceed with upload logic
  // (In this static demo, files are stored in memory only)
});
```

**File Upload Rules:**

| Rule | Value | Enforcement |
|------|-------|-------------|
| Max files | 6 | `FILE_UPLOAD_CONFIG.maxFiles` — validated on `change` event |
| Allowed formats | jpg, jpeg, png, pdf, docx, doc, xlsx, xls | `FILE_UPLOAD_CONFIG.allowedExtensions` — validated by extension |
| `accept` attribute | `.jpg,.jpeg,.png,.pdf,.docx,.doc,.xlsx,.xls` | HTML attribute for native file picker filtering |
| Multiple selection | Yes | `multiple` attribute on `<input type="file">` |

#### File Upload — Drag & Drop

The upload button supports drag-and-drop file input with visual feedback.

**TypeScript Implementation:**

```typescript
// Drag events on the upload button
uploadBtn.addEventListener('dragover', (e: DragEvent) => {
  e.preventDefault();
  uploadBtn.classList.add('rfq-form__upload-btn--dragover');
});

uploadBtn.addEventListener('dragleave', () => {
  uploadBtn.classList.remove('rfq-form__upload-btn--dragover');
});

uploadBtn.addEventListener('drop', (e: DragEvent) => {
  e.preventDefault();
  uploadBtn.classList.remove('rfq-form__upload-btn--dragover');
  const files = e.dataTransfer?.files;
  if (files) {
    // Apply same validation as click upload (count + extension)
    // Process valid files
  }
});
```

**Drag-Over Visual States:**

| State | CSS Class | Visual Change |
|-------|-----------|---------------|
| Default | `.rfq-form__upload-btn` | Dashed gray border (`#d1d5db`), gray text |
| Hover | `.rfq-form__upload-btn:hover` | Gold border (`#cc9900`), gold text (`#b38600`) |
| Drag-over | `.rfq-form__upload-btn--dragover` | Gold border (`#cc9900`), light gold bg (`#fff9e6`) |

#### Form Submission — Empty Textarea Prevention

The form uses `novalidate` to bypass native browser validation, implementing custom client-side validation instead.

**TypeScript Implementation:**

```typescript
const form = document.getElementById('rfq-form-element') as HTMLFormElement;
const textarea = document.getElementById('rfq-details') as HTMLTextAreaElement;

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  // Validate textarea is not empty (trim whitespace)
  const details = textarea.value.trim();
  if (!details) {
    // Visual feedback: highlight textarea border in error color
    textarea.closest('div')?.classList.add('border-error-500');
    textarea.focus();
    return;
  }

  // Remove error state if previously set
  textarea.closest('div')?.classList.remove('border-error-500');

  // Collect form data
  const formData: RFQFormData = {
    details: details,
    files: Array.from(fileInput.files || []),
    aiEnabled: (document.getElementById('rfq-ai-toggle') as HTMLInputElement).checked,
  };

  // In this static demo, log the form data
  console.info('RFQ Form submitted:', formData);
});
```

**Validation Rules:**

| Field | Rule | Error Behavior |
|-------|------|----------------|
| Textarea (`details`) | Must not be empty after `.trim()` | Border changes to `border-error-500` (`#ef4444`), textarea receives focus |
| Files | Optional — 0 files is valid | No error; files are validated individually on upload |
| AI toggle | Always valid (boolean) | No validation needed — defaults to `true` (checked) |

#### CTA Button — Hover State

| Property | Default | Hover |
|----------|---------|-------|
| Background | `#f97316` (warm orange) | `#ea580c` (darker orange) |
| Text color | `#ffffff` | `#ffffff` (no change) |
| Transition | — | `background-color 200ms ease` |
| Cursor | `pointer` | `pointer` |

#### CTA Button — Focus State

| Property | Value |
|----------|-------|
| Outline | `2px solid #cc9900` (via `.focus-ring:focus-visible`) |
| Outline offset | `2px` |
| Trigger | Keyboard focus only (`:focus-visible`) |

#### Upload Button — Hover State

| Property | Default | Hover |
|----------|---------|-------|
| Border color | `#d1d5db` (dashed) | `#cc9900` (gold, dashed) |
| Text color | `#6b7280` | `#b38600` (darker gold) |
| Transition | — | `border-color 200ms ease` |
| Cursor | `pointer` | `pointer` |

#### Upload Button — Focus State

| Property | Value |
|----------|-------|
| Outline | `2px solid #cc9900` (via `.focus-ring:focus-visible`) |
| Outline offset | `2px` |
| Trigger | Keyboard focus only (`:focus-visible`) |

#### Accessibility Notes for Interactions

| Element | ARIA | Keyboard |
|---------|------|----------|
| Section | `aria-label="RFQ Formu"` | — |
| Textarea | `aria-label="Talep detayları"` | Focusable via `Tab`, standard text input |
| Upload button | `aria-label="Dosya yükle"`, `data-tooltip-target` | Focusable via `Tab`, activate via `Enter`/`Space` |
| Hidden file input | `aria-hidden="true"` | Not directly focusable — triggered by upload button |
| Tooltip | `role="tooltip"` | Appears on hover/focus of trigger element |
| Checkbox | `aria-describedby="rfq-ai-label"` | Focusable via `Tab`, toggle via `Space` |
| AI badge | `aria-hidden="true"` | Decorative — hidden from screen readers |
| CTA button | `aria-label="RFQ detaylarını yaz ve gönder"` | Focusable via `Tab`, activate via `Enter`/`Space` |
| Info icon | `aria-hidden="true"` | Decorative — visual hint only |

---

## 6. Selected Products (Section 3)

The Selected Products section displays a **6-column single-row product card grid** on a muted surface background. Each card follows the shared `.product-card` pattern: a square product image on top, followed by a supplier count line, a two-line-clamped product name, and a CTA link. This section showcases 6 pre-selected B2B products with the CTA text "Anında fiyat teklifi al".

> **Data Source:** `selectedProducts` array from `src/data/mock-data.ts` (6 items)
> **Type:** `Product` from `src/types/index.ts`
> **Custom CSS Block:** `.product-card` and related BEM classes in `src/style.css` (shared with Section 7)
> **Section ID:** `rfq-selected-products`

### 6.1 HTML Structure

```html
<section
  id="rfq-selected-products"
  class="bg-surface-muted"
  data-section="selected-products"
  aria-label="Seçili Ürünler"
>
  <div class="mx-auto max-w-[var(--container-lg)] px-4 py-10">

    <!-- ── Section Heading ── -->
    <h2 class="text-text-primary text-xl font-bold leading-snug mb-6">
      Seçili ürünler
    </h2>

    <!-- ── 6-Column Product Grid ── -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

      <!-- ════════════════════════════════════════════
           Product Card Template (repeated × 6)
           Data: selectedProducts[0..5]
           ════════════════════════════════════════════ -->

      <!-- Card 1: Endüstriyel CNC Torna Tezgahı -->
      <div class="product-card" data-product-id="selected-1">

        <!-- Image Container (square, 1:1 aspect ratio) -->
        <div class="product-card__image">
          <img
            src="/images/products/selected-1.jpg"
            alt="Endüstriyel CNC Torna Tezgahı"
            loading="lazy"
          />
        </div>

        <!-- Card Body -->
        <div class="px-3 py-2.5 flex flex-col gap-1">

          <!-- Supplier Count -->
          <span class="product-card__supplier">
            1.980 tedarikçi sağlıyor
          </span>

          <!-- Product Name (2-line clamp) -->
          <h3 class="product-card__name">
            Endüstriyel CNC Torna Tezgahı
          </h3>

          <!-- CTA Link -->
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>

        </div>
      </div>

      <!-- Card 2: Paslanmaz Çelik Boru Profil -->
      <div class="product-card" data-product-id="selected-2">
        <div class="product-card__image">
          <img
            src="/images/products/selected-2.jpg"
            alt="Paslanmaz Çelik Boru Profil"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            3.250 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Paslanmaz Çelik Boru Profil
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 3: Otomatik Paketleme Makinesi -->
      <div class="product-card" data-product-id="selected-3">
        <div class="product-card__image">
          <img
            src="/images/products/selected-3.jpg"
            alt="Otomatik Paketleme Makinesi"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            2.140 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Otomatik Paketleme Makinesi
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 4: LED Endüstriyel Aydınlatma Armatürü -->
      <div class="product-card" data-product-id="selected-4">
        <div class="product-card__image">
          <img
            src="/images/products/selected-4.jpg"
            alt="LED Endüstriyel Aydınlatma Armatürü"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            4.520 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            LED Endüstriyel Aydınlatma Armatürü
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 5: Hidrolik Pres Makinesi 100 Ton -->
      <div class="product-card" data-product-id="selected-5">
        <div class="product-card__image">
          <img
            src="/images/products/selected-5.jpg"
            alt="Hidrolik Pres Makinesi 100 Ton"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            1.670 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Hidrolik Pres Makinesi 100 Ton
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 6: Elektrikli Forklift 3 Ton Kapasiteli -->
      <div class="product-card" data-product-id="selected-6">
        <div class="product-card__image">
          <img
            src="/images/products/selected-6.jpg"
            alt="Elektrikli Forklift 3 Ton Kapasiteli"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            2.890 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Elektrikli Forklift 3 Ton Kapasiteli
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Anında fiyat teklifi al
          </a>
        </div>
      </div>

    </div>
    <!-- /grid -->

  </div>
</section>
```

**Element Inventory:**

| # | Element | Tag | Content / Purpose |
|---|---------|-----|-------------------|
| 1 | Section wrapper | `<section>` | Muted surface background container (`bg-surface-muted`) |
| 2 | Container | `<div>` | Max-width 1472px, horizontal padding 32px, vertical padding 80px top / 80px bottom |
| 3 | Section heading | `<h2>` | "Seçili ürünler" — dark text, bold, 20px |
| 4 | Grid wrapper | `<div>` | 6-column responsive grid with 32px gap |
| 5–10 | Product cards (×6) | `<div>` | Shared `.product-card` pattern — one per `selectedProducts` item |
| 5a | Image container | `<div>` | Square 1:1 aspect ratio, light gray background, 12px padding |
| 5b | Product image | `<img>` | `object-fit: contain`, lazy-loaded |
| 5c | Card body | `<div>` | Padding 12px horizontal, 10px vertical, flex column with 8px gap |
| 5d | Supplier count | `<span>` | Muted gray text, 12px — e.g. "1.980 tedarikçi sağlıyor" |
| 5e | Product name | `<h3>` | Dark text, 14px, 2-line clamp via `-webkit-line-clamp: 2` |
| 5f | CTA link | `<a>` | Underlined text link — "Anında fiyat teklifi al" |

### 6.2 Tailwind/CSS Classes Per Element

Every element's class list is documented below. Classes are split into **Tailwind utilities** (auto-generated from `@theme` tokens) and **custom CSS classes** (defined in `src/style.css`).

#### Section Wrapper

```
<section class="bg-surface-muted" ...>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `bg-surface-muted` | Tailwind | `background-color: #fafafa` (from `--color-surface-muted`) |

#### Container

```
<div class="mx-auto max-w-[var(--container-lg)] px-4 py-10">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `mx-auto` | Tailwind | `margin-left: auto; margin-right: auto` |
| `max-w-[var(--container-lg)]` | Tailwind (arbitrary) | `max-width: 1472px` |
| `px-4` | Tailwind | `padding-left: 2rem (32px); padding-right: 2rem (32px)` — (4 × 0.5rem) |
| `py-10` | Tailwind | `padding-top: 5rem (80px); padding-bottom: 5rem (80px)` — (10 × 0.5rem) |

#### Section Heading

```
<h2 class="text-text-primary text-xl font-bold leading-snug mb-6">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `text-text-primary` | Tailwind | `color: #111827` (from `--color-text-primary`) |
| `text-xl` | Tailwind | `font-size: 1.25rem (20px)` (from `--font-size-xl`) |
| `font-bold` | Tailwind | `font-weight: 700` (from `--font-weight-bold`) |
| `leading-snug` | Tailwind | `line-height: 1.375` (from `--line-height-snug`) |
| `mb-6` | Tailwind | `margin-bottom: 3rem (48px)` — (6 × 0.5rem) |

#### Grid Wrapper

```
<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `grid` | Tailwind | `display: grid` |
| `grid-cols-2` | Tailwind | `grid-template-columns: repeat(2, minmax(0, 1fr))` — mobile default |
| `md:grid-cols-3` | Tailwind | At `≥ 640px`: `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `xl:grid-cols-6` | Tailwind | At `≥ 1024px`: `grid-template-columns: repeat(6, minmax(0, 1fr))` |
| `gap-4` | Tailwind | `gap: 2rem (32px)` — (4 × 0.5rem) |

#### Product Card (Outer Wrapper)

```
<div class="product-card" data-product-id="selected-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card` | Custom CSS | `background: var(--color-card-bg) [#ffffff]; border: 1px solid var(--color-card-border) [#e5e5e5]; border-radius: var(--radius-card) [8px]; overflow: hidden; transition: box-shadow var(--transition-base) [200ms ease];` |

#### Image Container

```
<div class="product-card__image">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__image` | Custom CSS | `aspect-ratio: 1 / 1; background-color: var(--color-card-image-bg) [#f5f5f5]; padding: 12px; display: flex; align-items: center; justify-content: center;` |

#### Product Image

```
<img src="..." alt="..." loading="lazy" />
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `src` | `/images/products/selected-N.jpg` | Product photo path |
| `alt` | Product name (Turkish) | Accessible alternative text |
| `loading` | `lazy` | Deferred loading for performance |

Image styles are applied via parent CSS rule `.product-card__image img`:

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `height` | `100%` |
| `object-fit` | `contain` — preserves aspect ratio within square container |

#### Card Body

```
<div class="px-3 py-2.5 flex flex-col gap-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `px-3` | Tailwind | `padding-left: 1.5rem (24px); padding-right: 1.5rem (24px)` — (3 × 0.5rem) |
| `py-2.5` | Tailwind | `padding-top: 1.25rem (20px); padding-bottom: 1.25rem (20px)` — (2.5 × 0.5rem) |
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `gap-1` | Tailwind | `gap: 0.5rem (8px)` — (1 × 0.5rem) |

#### Supplier Count

```
<span class="product-card__supplier">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__supplier` | Custom CSS | `color: var(--color-supplier-text) [#9ca3af]; font-size: var(--font-size-sm) [12px]; line-height: var(--line-height-normal) [1.5];` |

#### Product Name

```
<h3 class="product-card__name">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__name` | Custom CSS | `color: var(--color-product-name) [#222222]; font-size: var(--font-size-base) [14px]; font-weight: var(--font-weight-regular) [400]; line-height: var(--line-height-snug) [1.375]; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;` |

**Line Clamping Behavior:**

The `line-clamp-2` effect is achieved via custom CSS using the `-webkit-line-clamp` property:

```css
.product-card__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

This truncates the product name to a maximum of 2 visible lines and appends an ellipsis (`…`) if the text overflows.

#### CTA Link

```
<a href="#" class="product-card__cta mt-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__cta` | Custom CSS | `color: var(--color-cta-text) [#111827]; font-size: var(--font-size-caption) [13px]; font-weight: var(--font-weight-semibold) [600]; text-decoration: underline; transition: color var(--transition-base) [200ms ease];` |
| `mt-1` | Tailwind | `margin-top: 0.5rem (8px)` — (1 × 0.5rem) |

### 6.3 Token References

Every design value used in the Selected Products section is mapped to a token from `@theme` in `src/style.css` or documented as a section-specific custom value.

#### Colors

| Visual Value | Token / Custom Value | Source |
|-------------|---------------------|--------|
| Section background | `--color-surface-muted` → `#fafafa` | `@theme` token |
| Heading text | `--color-text-primary` → `#111827` | `@theme` token |
| Card background | `--color-card-bg` → `#ffffff` | `@theme` token |
| Card border | `--color-card-border` → `#e5e5e5` | `@theme` token |
| Image placeholder bg | `--color-card-image-bg` → `#f5f5f5` | `@theme` token |
| Supplier count text | `--color-supplier-text` → `#9ca3af` | `@theme` token |
| Product name text | `--color-product-name` → `#222222` | `@theme` token |
| CTA text (default) | `--color-cta-text` → `#111827` | `@theme` token |
| CTA text (hover) | `--color-cta-text-hover` → `#cc9900` | `@theme` token |
| Card hover shadow | `--shadow-card-hover` → `0 4px 12px rgba(0,0,0,0.15)` | `@theme` token |

#### Typography

| Element | Font Size Token | Weight Token | Line Height Token |
|---------|----------------|--------------|-------------------|
| Section heading (H2) | `--font-size-xl` (20px) | `--font-weight-bold` (700) | `--line-height-snug` (1.375) |
| Supplier count | `--font-size-sm` (12px) | — (inherits regular) | `--line-height-normal` (1.5) |
| Product name (H3) | `--font-size-base` (14px) | `--font-weight-regular` (400) | `--line-height-snug` (1.375) |
| CTA link | `--font-size-caption` (13px) | `--font-weight-semibold` (600) | — |

#### Spacing

| Property | Token / Value | Resolved |
|----------|--------------|----------|
| Container max-width | `--container-lg` | 1472px |
| Container padding-x | `px-4` (4 × `--spacing`) | 32px |
| Container padding-y | `py-10` (10 × `--spacing`) | 80px |
| Heading margin-bottom | `mb-6` (6 × `--spacing`) | 48px |
| Grid gap | `gap-4` (4 × `--spacing`) | 32px |
| Card body padding-x | `px-3` (3 × `--spacing`) | 24px |
| Card body padding-y | `py-2.5` (2.5 × `--spacing`) | 20px |
| Card body gap | `gap-1` (1 × `--spacing`) | 8px |
| CTA margin-top | `mt-1` (1 × `--spacing`) | 8px |
| Image container padding | Custom CSS | 12px |

#### Border Radius

| Element | Token | Value |
|---------|-------|-------|
| Product card | `--radius-card` | 8px |

#### Shadows

| Element | Token | Value |
|---------|-------|-------|
| Card (default) | None | No shadow by default |
| Card (hover) | `--shadow-card-hover` | `0 4px 12px rgba(0, 0, 0, 0.15)` |

#### Transitions

| Element | Token | Value |
|---------|-------|-------|
| Card box-shadow | `--transition-base` | `200ms ease` |
| CTA text color | `--transition-base` | `200ms ease` |

### 6.4 Responsive Behavior

The Selected Products grid adapts across breakpoints. The primary change is the number of grid columns.

#### Breakpoint Reference

| Name | Token | Min-Width | Grid Columns |
|------|-------|-----------|-------------|
| Mobile | `< --breakpoint-md` | 0–639px | 2 columns |
| Tablet | `--breakpoint-md` to `< --breakpoint-xl` | 640–1023px | 3 columns |
| Desktop | `≥ --breakpoint-xl` | 1024px+ | 6 columns (single row) |

#### Mobile (< 640px) — 2 Columns

```
┌─────────────────────────────────┐
│  Seçili ürünler                  │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │ ┌────┐ │  │ ┌────┐ │        │
│  │ │img │ │  │ │img │ │        │
│  │ └────┘ │  │ └────┘ │        │
│  │ 1.980  │  │ 3.250  │        │
│  │ CNC... │  │ Çelik..│        │
│  │ Anında │  │ Anında │        │
│  └────────┘  └────────┘        │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │  ...   │  │  ...   │        │
│  └────────┘  └────────┘        │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │  ...   │  │  ...   │        │
│  └────────┘  └────────┘        │
│                                  │
└─────────────────────────────────┘
```

| Property | Mobile Value | Implementation |
|----------|-------------|----------------|
| Grid columns | 2 | `grid-cols-2` (default, no prefix) |
| Grid gap | 32px | `gap-4` (same on all breakpoints) |
| Container padding-x | 32px | `px-4` (same on all breakpoints) |
| Container padding-y | 80px | `py-10` (same on all breakpoints) |
| Cards per row | 2 | 6 cards render across 3 rows |

#### Tablet (640–1023px) — 3 Columns

```
┌──────────────────────────────────────────────┐
│  Seçili ürünler                                │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  ┌────┐  │  │  ┌────┐  │  │  ┌────┐  │    │
│  │  │img │  │  │  │img │  │  │  │img │  │    │
│  │  └────┘  │  │  └────┘  │  │  └────┘  │    │
│  │  1.980   │  │  3.250   │  │  2.140   │    │
│  │  CNC...  │  │  Çelik.. │  │  Otom... │    │
│  │  Anında  │  │  Anında  │  │  Anında  │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   ...    │  │   ...    │  │   ...    │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                │
└──────────────────────────────────────────────┘
```

| Property | Tablet Value | Implementation |
|----------|-------------|----------------|
| Grid columns | 3 | `md:grid-cols-3` (at `≥ 640px`) |
| Cards per row | 3 | 6 cards render across 2 rows |

#### Desktop (≥ 1024px) — 6 Columns (Single Row)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Seçili ürünler                                                                     │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                     │
│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│                     │
│  ││img ││  ││img ││  ││img ││  ││img ││  ││img ││  ││img ││                     │
│  │└────┘│  │└────┘│  │└────┘│  │└────┘│  │└────┘│  │└────┘│                     │
│  │1.980 │  │3.250 │  │2.140 │  │4.520 │  │1.670 │  │2.890 │                     │
│  │CNC.. │  │Çelik │  │Otom..│  │LED.. │  │Hidr..│  │Elek..│                     │
│  │Anında│  │Anında│  │Anında│  │Anında│  │Anında│  │Anında│                     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                     │
│                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────┘
```

| Property | Desktop Value | Implementation |
|----------|--------------|----------------|
| Grid columns | 6 | `xl:grid-cols-6` (at `≥ 1024px`) |
| Cards per row | 6 | All 6 cards in a single row |
| Container max-width | 1472px | `max-w-[var(--container-lg)]` |

#### Responsive Summary Table

| Breakpoint | Grid Class | Columns | Rows | Cards |
|------------|-----------|---------|------|-------|
| `< 640px` | `grid-cols-2` | 2 | 3 | 6 |
| `≥ 640px` | `md:grid-cols-3` | 3 | 2 | 6 |
| `≥ 1024px` | `xl:grid-cols-6` | 6 | 1 | 6 |

### 6.5 Interactions

All interactive behaviors in the Selected Products section, including card hover effects and CTA link hover state.

#### Card Hover — Shadow Elevation

When the user hovers over a product card, the card elevates with a stronger box-shadow, creating a "lifted" effect.

| Property | Default | Hover |
|----------|---------|-------|
| Box-shadow | None | `--shadow-card-hover` → `0 4px 12px rgba(0, 0, 0, 0.15)` |
| Transition | — | `box-shadow 200ms ease` (via `--transition-base`) |
| Cursor | `default` | `default` (card is not a link — CTA inside is the interactive element) |

**CSS Implementation (from `src/style.css`):**

```css
.product-card {
  /* ... base styles ... */
  transition: box-shadow var(--transition-base);  /* 200ms ease */
}

.product-card:hover {
  box-shadow: var(--shadow-card-hover);  /* 0 4px 12px rgba(0, 0, 0, 0.15) */
}
```

#### CTA Link — Hover Color Change

When the user hovers over the CTA text ("Anında fiyat teklifi al"), the text color changes from dark to gold.

| Property | Default | Hover |
|----------|---------|-------|
| Text color | `--color-cta-text` → `#111827` (near-black) | `--color-cta-text-hover` → `#cc9900` (primary gold) |
| Text decoration | `underline` | `underline` (no change) |
| Transition | — | `color 200ms ease` (via `--transition-base`) |
| Cursor | `pointer` | `pointer` |

**CSS Implementation (from `src/style.css`):**

```css
.product-card__cta {
  color: var(--color-cta-text);            /* #111827 */
  font-size: var(--font-size-caption);     /* 13px */
  font-weight: var(--font-weight-semibold); /* 600 */
  text-decoration: underline;
  transition: color var(--transition-base); /* 200ms ease */
}

.product-card__cta:hover {
  color: var(--color-cta-text-hover);      /* #cc9900 — primary gold */
}
```

#### Image Fallback

If a product image fails to load, the `.product-card__image--fallback` modifier class can be applied (via JavaScript `onerror` handler) to display a placeholder icon:

```css
.product-card__image--fallback {
  background-color: var(--color-card-image-bg);  /* #f5f5f5 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__image--fallback svg {
  width: 48px;
  height: 48px;
  color: var(--color-border-strong);  /* #d1d5db */
}
```

#### Accessibility Notes for Interactions

| Element | ARIA | Keyboard |
|---------|------|----------|
| Section | `aria-label="Seçili Ürünler"` | — |
| Product card | `data-product-id` for JS targeting | Not focusable (container only) |
| Product image | `alt` attribute with product name | — |
| CTA link | Inherits text content as accessible name | Focusable via `Tab`, activate via `Enter` |

---

## 7. Custom Products (Section 4)

The Custom Products section displays a **6-column multi-row product card grid** (36 products = 6 rows × 6 columns) on a white surface background. Each card follows the **identical** `.product-card` pattern used in Section 6 (Selected Products): a square product image on top, followed by a supplier count line, a two-line-clamped product name, and a CTA link. The **only difference** from Section 6 is the CTA text — this section uses **"Hemen fiyat teklifi al"** instead of "Anında fiyat teklifi al".

> **Card Pattern:** The product card template (HTML structure, CSS classes, BEM elements, hover behavior, image fallback) is **100% identical** to the card documented in Section 6.1–6.5. Do NOT create a separate card variant — reuse the same `.product-card` component and its BEM children.
>
> **Data Source:** `customProducts` array from `src/data/mock-data.ts` (36 items)
> **Type:** `Product` from `src/types/index.ts`
> **Custom CSS Block:** `.product-card` and related BEM classes in `src/style.css` (shared with Section 6)
> **Section ID:** `rfq-custom-products`

### 7.1 HTML Structure

```html
<section
  id="rfq-custom-products"
  class="bg-surface"
  data-section="custom-products"
  aria-label="Size Özel Ürünler"
>
  <div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-12">

    <!-- ── Section Heading ── -->
    <h2 class="text-text-primary text-xl font-bold leading-snug mb-6">
      Size özel ürünler
    </h2>

    <!-- ── 6-Column × 6-Row Product Grid (36 cards) ── -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

      <!-- ════════════════════════════════════════════
           Product Card Template (repeated × 36)
           Data: customProducts[0..35]
           Card structure is IDENTICAL to Section 6.
           Only CTA text differs: "Hemen fiyat teklifi al"
           ════════════════════════════════════════════ -->

      <!-- ── Row 1 ─────────────────────────────────── -->

      <!-- Card 1: Pamuklu Örme Kumaş Toptan -->
      <div class="product-card" data-product-id="custom-1">
        <div class="product-card__image">
          <img
            src="/images/products/custom-1.jpg"
            alt="Pamuklu Örme Kumaş Toptan"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            5.120 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Pamuklu Örme Kumaş Toptan
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 2: Güneş Enerjisi Paneli 550W Monokristal -->
      <div class="product-card" data-product-id="custom-2">
        <div class="product-card__image">
          <img
            src="/images/products/custom-2.jpg"
            alt="Güneş Enerjisi Paneli 550W Monokristal"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            3.780 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Güneş Enerjisi Paneli 550W Monokristal
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 3: Alüminyum Alaşım Döküm Parça -->
      <div class="product-card" data-product-id="custom-3">
        <div class="product-card__image">
          <img
            src="/images/products/custom-3.jpg"
            alt="Alüminyum Alaşım Döküm Parça"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            2.460 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Alüminyum Alaşım Döküm Parça
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 4: Otomatik Dolum Makinesi Sıvı Tip -->
      <div class="product-card" data-product-id="custom-4">
        <div class="product-card__image">
          <img
            src="/images/products/custom-4.jpg"
            alt="Otomatik Dolum Makinesi Sıvı Tip"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            1.350 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Otomatik Dolum Makinesi Sıvı Tip
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 5: Özel Baskılı Karton Ambalaj Kutusu -->
      <div class="product-card" data-product-id="custom-5">
        <div class="product-card__image">
          <img
            src="/images/products/custom-5.jpg"
            alt="Özel Baskılı Karton Ambalaj Kutusu"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            6.290 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Özel Baskılı Karton Ambalaj Kutusu
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- Card 6: Endüstriyel Hava Kompresörü 500L -->
      <div class="product-card" data-product-id="custom-6">
        <div class="product-card__image">
          <img
            src="/images/products/custom-6.jpg"
            alt="Endüstriyel Hava Kompresörü 500L"
            loading="lazy"
          />
        </div>
        <div class="px-3 py-2.5 flex flex-col gap-1">
          <span class="product-card__supplier">
            1.820 tedarikçi sağlıyor
          </span>
          <h3 class="product-card__name">
            Endüstriyel Hava Kompresörü 500L
          </h3>
          <a href="#" class="product-card__cta mt-1">
            Hemen fiyat teklifi al
          </a>
        </div>
      </div>

      <!-- ── Row 2 ─────────────────────────────────── -->
      <!-- Cards 7–12: Same card template as above.
           Data: customProducts[6..11]
           IDs: custom-7 through custom-12
           Images: /images/products/custom-7.jpg through custom-12.jpg
           CTA: "Hemen fiyat teklifi al" -->

      <!-- Card 7:  Deri Kadın Çanta El Yapımı          (4.150 tedarikçi) -->
      <!-- Card 8:  Kablosuz Bluetooth Kulaklık OEM      (7.340 tedarikçi) -->
      <!-- Card 9:  Çelik Konstrüksiyon Çatı Paneli      (2.070 tedarikçi) -->
      <!-- Card 10: Plastik Enjeksiyon Kalıp İmalatı     (1.590 tedarikçi) -->
      <!-- Card 11: Organik Zeytinyağı Soğuk Sıkım 5L    (3.420 tedarikçi) -->
      <!-- Card 12: Elektrikli Scooter 2000W Motor        (2.860 tedarikçi) -->

      <!-- ── Row 3 ─────────────────────────────────── -->
      <!-- Cards 13–18: Same card template.
           Data: customProducts[12..17]
           IDs: custom-13 through custom-18 -->

      <!-- Card 13: Seramik Yer Karosu 60x60cm           (4.780 tedarikçi) -->
      <!-- Card 14: Medikal Cerrahi Eldiven Lateks        (5.630 tedarikçi) -->
      <!-- Card 15: Dijital Baskı Makinesi UV Flatbed     (980 tedarikçi)  -->
      <!-- Card 16: Polyester Spor Giyim Kumaşı           (3.910 tedarikçi) -->
      <!-- Card 17: Araç Yedek Parça Fren Balata Seti     (2.540 tedarikçi) -->
      <!-- Card 18: Endüstriyel Su Arıtma Sistemi RO      (1.470 tedarikçi) -->

      <!-- ── Row 4 ─────────────────────────────────── -->
      <!-- Cards 19–24: Same card template.
           Data: customProducts[18..23]
           IDs: custom-19 through custom-24 -->

      <!-- Card 19: Cam Parfüm Şişesi 100ml Özel Tasarım  (4.210 tedarikçi) -->
      <!-- Card 20: Tarımsal Sulama Damlama Sistemi        (1.890 tedarikçi) -->
      <!-- Card 21: Akıllı Ev Otomasyon Kontrol Paneli     (2.730 tedarikçi) -->
      <!-- Card 22: Mermer Doğal Taş Kaplama Levhası       (3.160 tedarikçi) -->
      <!-- Card 23: Bebek Bezi Premium Ultra Emici          (5.870 tedarikçi) -->
      <!-- Card 24: Bakır Kablo NYY 3x2.5mm Toptan         (2.340 tedarikçi) -->

      <!-- ── Row 5 ─────────────────────────────────── -->
      <!-- Cards 25–30: Same card template.
           Data: customProducts[24..29]
           IDs: custom-25 through custom-30 -->

      <!-- Card 25: Ahşap Mobilya Oturma Grubu             (3.520 tedarikçi) -->
      <!-- Card 26: PVC Pencere ve Kapı Profili             (2.180 tedarikçi) -->
      <!-- Card 27: Tekstil Boyama Kimyasalları Reaktif     (1.240 tedarikçi) -->
      <!-- Card 28: Endüstriyel Jeneratör Dizel 150kVA      (1.750 tedarikçi) -->
      <!-- Card 29: Paslanmaz Çelik Mutfak Evyesi           (4.620 tedarikçi) -->
      <!-- Card 30: Gıda Ambalaj Filmi Streç 500mm          (3.080 tedarikçi) -->

      <!-- ── Row 6 ─────────────────────────────────── -->
      <!-- Cards 31–36: Same card template.
           Data: customProducts[30..35]
           IDs: custom-31 through custom-36 -->

      <!-- Card 31: Spor Ayakkabı Erkek Hafif Koşu          (6.740 tedarikçi) -->
      <!-- Card 32: Lazer Kesim Makinesi Fiber 1000W         (1.430 tedarikçi) -->
      <!-- Card 33: Güvenlik Kamerası IP 4K PoE              (5.290 tedarikçi) -->
      <!-- Card 34: Kozmetik Cilt Bakım Seti Doğal           (4.360 tedarikçi) -->
      <!-- Card 35: Ticari Buzdolabı Dik Tip 600L            (2.010 tedarikçi) -->
      <!-- Card 36: Kauçuk Conta ve Sızdırmazlık Elemanı     (3.650 tedarikçi) -->

    </div>
    <!-- /grid -->

  </div>
</section>
```

> **Implementation Note:** All 36 cards are generated at build time from the `customProducts` array in `src/data/mock-data.ts`. The first row (Cards 1–6) is shown in full markup above to demonstrate the exact card template. Rows 2–6 follow the **identical pattern** — only the `data-product-id`, image `src`, `alt` text, supplier count, and product name change per card. The CTA text is always `"Hemen fiyat teklifi al"` for every card in this section.

**Element Inventory:**

| # | Element | Tag | Content / Purpose |
|---|---------|-----|-------------------|
| 1 | Section wrapper | `<section>` | White surface background container (`bg-surface`) |
| 2 | Container | `<div>` | Max-width 1472px, horizontal padding 32px, vertical padding 64px top / 96px bottom |
| 3 | Section heading | `<h2>` | "Size özel ürünler" — dark text, bold, 20px |
| 4 | Grid wrapper | `<div>` | 6-column responsive grid with 32px gap |
| 5–40 | Product cards (×36) | `<div>` | Shared `.product-card` pattern — one per `customProducts` item |
| 5a | Image container | `<div>` | Square 1:1 aspect ratio, light gray background, 12px padding |
| 5b | Product image | `<img>` | `object-fit: contain`, lazy-loaded |
| 5c | Card body | `<div>` | Padding 12px horizontal, 10px vertical, flex column with 8px gap |
| 5d | Supplier count | `<span>` | Muted gray text, 12px — e.g. "5.120 tedarikçi sağlıyor" |
| 5e | Product name | `<h3>` | Dark text, 14px, 2-line clamp via `-webkit-line-clamp: 2` |
| 5f | CTA link | `<a>` | Underlined text link — **"Hemen fiyat teklifi al"** (differs from Section 6) |

### 7.2 Tailwind/CSS Classes Per Element

Every element's class list is documented below. Classes are split into **Tailwind utilities** (auto-generated from `@theme` tokens) and **custom CSS classes** (defined in `src/style.css`).

> **IMPORTANT:** The `.product-card` component and all its BEM children (`.product-card__image`, `.product-card__supplier`, `.product-card__name`, `.product-card__cta`) are the **exact same CSS classes** documented in Section 6.2. They are repeated here for completeness, but there is **no separate CSS** for this section — it reuses the shared product card pattern.

#### Section Wrapper

```
<section class="bg-surface" ...>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `bg-surface` | Tailwind | `background-color: #ffffff` (from `--color-surface`) |

> **Difference from Section 6:** Section 6 uses `bg-surface-muted` (#fafafa). This section uses `bg-surface` (#ffffff) to create visual contrast between the two adjacent grids.

#### Container

```
<div class="mx-auto max-w-[var(--container-lg)] px-4 pt-8 pb-12">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `mx-auto` | Tailwind | `margin-left: auto; margin-right: auto` |
| `max-w-[var(--container-lg)]` | Tailwind (arbitrary) | `max-width: 1472px` |
| `px-4` | Tailwind | `padding-left: 2rem (32px); padding-right: 2rem (32px)` — (4 × 0.5rem) |
| `pt-8` | Tailwind | `padding-top: 4rem (64px)` — (8 × 0.5rem) |
| `pb-12` | Tailwind | `padding-bottom: 6rem (96px)` — (12 × 0.5rem) |

> **Difference from Section 6:** Section 6 uses symmetric `py-10` (80px top and bottom). This section uses asymmetric vertical padding: `pt-8` (64px) for a tighter top transition from the Selected Products section above, and `pb-12` (96px) for a spacious bottom transition into the Testimonials section below.

#### Section Heading

```
<h2 class="text-text-primary text-xl font-bold leading-snug mb-6">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `text-text-primary` | Tailwind | `color: #111827` (from `--color-text-primary`) |
| `text-xl` | Tailwind | `font-size: 1.25rem (20px)` (from `--font-size-xl`) |
| `font-bold` | Tailwind | `font-weight: 700` (from `--font-weight-bold`) |
| `leading-snug` | Tailwind | `line-height: 1.375` (from `--line-height-snug`) |
| `mb-6` | Tailwind | `margin-bottom: 3rem (48px)` — (6 × 0.5rem) |

#### Grid Wrapper

```
<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `grid` | Tailwind | `display: grid` |
| `grid-cols-2` | Tailwind | `grid-template-columns: repeat(2, minmax(0, 1fr))` — mobile default |
| `md:grid-cols-3` | Tailwind | At `≥ 640px`: `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `xl:grid-cols-6` | Tailwind | At `≥ 1024px`: `grid-template-columns: repeat(6, minmax(0, 1fr))` |
| `gap-4` | Tailwind | `gap: 2rem (32px)` — (4 × 0.5rem) |

> **Identical to Section 6:** Same responsive grid configuration. The only difference is the total card count (36 vs 6), which results in 6 rows on desktop instead of 1.

#### Product Card (Outer Wrapper)

```
<div class="product-card" data-product-id="custom-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card` | Custom CSS | `background: var(--color-card-bg) [#ffffff]; border: 1px solid var(--color-card-border) [#e5e5e5]; border-radius: var(--radius-card) [8px]; overflow: hidden; transition: box-shadow var(--transition-base) [200ms ease];` |

#### Image Container

```
<div class="product-card__image">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__image` | Custom CSS | `aspect-ratio: 1 / 1; background-color: var(--color-card-image-bg) [#f5f5f5]; padding: 12px; display: flex; align-items: center; justify-content: center;` |

#### Product Image

```
<img src="..." alt="..." loading="lazy" />
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `src` | `/images/products/custom-N.jpg` | Product photo path (N = 1–36) |
| `alt` | Product name (Turkish) | Accessible alternative text |
| `loading` | `lazy` | Deferred loading for performance (critical for 36 images) |

Image styles are applied via parent CSS rule `.product-card__image img`:

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `height` | `100%` |
| `object-fit` | `contain` — preserves aspect ratio within square container |

> **Performance Note:** With 36 product images, `loading="lazy"` is especially important. Only images visible in the viewport (roughly the first 6–12 depending on breakpoint) will be loaded initially. The remaining images load as the user scrolls.

#### Card Body

```
<div class="px-3 py-2.5 flex flex-col gap-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `px-3` | Tailwind | `padding-left: 1.5rem (24px); padding-right: 1.5rem (24px)` — (3 × 0.5rem) |
| `py-2.5` | Tailwind | `padding-top: 1.25rem (20px); padding-bottom: 1.25rem (20px)` — (2.5 × 0.5rem) |
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `gap-1` | Tailwind | `gap: 0.5rem (8px)` — (1 × 0.5rem) |

#### Supplier Count

```
<span class="product-card__supplier">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__supplier` | Custom CSS | `color: var(--color-supplier-text) [#9ca3af]; font-size: var(--font-size-sm) [12px]; line-height: var(--line-height-normal) [1.5];` |

#### Product Name

```
<h3 class="product-card__name">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__name` | Custom CSS | `color: var(--color-product-name) [#222222]; font-size: var(--font-size-base) [14px]; font-weight: var(--font-weight-regular) [400]; line-height: var(--line-height-snug) [1.375]; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;` |

**Line Clamping Behavior:**

Same as Section 6. The `line-clamp-2` effect uses the `-webkit-line-clamp` property:

```css
.product-card__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

This truncates the product name to a maximum of 2 visible lines and appends an ellipsis (`…`) if the text overflows.

#### CTA Link

```
<a href="#" class="product-card__cta mt-1">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `product-card__cta` | Custom CSS | `color: var(--color-cta-text) [#111827]; font-size: var(--font-size-caption) [13px]; font-weight: var(--font-weight-semibold) [600]; text-decoration: underline; transition: color var(--transition-base) [200ms ease];` |
| `mt-1` | Tailwind | `margin-top: 0.5rem (8px)` — (1 × 0.5rem) |

> **CTA Text Difference:** The only visual difference from Section 6 is the CTA text content:
> - Section 6: `"Anında fiyat teklifi al"` (instant quote)
> - **Section 7: `"Hemen fiyat teklifi al"` (get quote now)**
>
> The CSS styling, font size, weight, underline, color, and hover behavior are all identical.

### 7.3 Token References

Every design value used in the Custom Products section is mapped to a token from `@theme` in `src/style.css` or documented as a section-specific custom value. Token references are **identical to Section 6.3** except for the section background color.

#### Colors

| Visual Value | Token / Custom Value | Source |
|-------------|---------------------|--------|
| Section background | `--color-surface` → `#ffffff` | `@theme` token |
| Heading text | `--color-text-primary` → `#111827` | `@theme` token |
| Card background | `--color-card-bg` → `#ffffff` | `@theme` token |
| Card border | `--color-card-border` → `#e5e5e5` | `@theme` token |
| Image placeholder bg | `--color-card-image-bg` → `#f5f5f5` | `@theme` token |
| Supplier count text | `--color-supplier-text` → `#9ca3af` | `@theme` token |
| Product name text | `--color-product-name` → `#222222` | `@theme` token |
| CTA text (default) | `--color-cta-text` → `#111827` | `@theme` token |
| CTA text (hover) | `--color-cta-text-hover` → `#cc9900` | `@theme` token |
| Card hover shadow | `--shadow-card-hover` → `0 4px 12px rgba(0,0,0,0.15)` | `@theme` token |

> **Difference from Section 6:** Section background uses `--color-surface` (#ffffff) instead of `--color-surface-muted` (#fafafa). All card-level tokens remain identical.

#### Typography

| Element | Font Size Token | Weight Token | Line Height Token |
|---------|----------------|--------------|-------------------|
| Section heading (H2) | `--font-size-xl` (20px) | `--font-weight-bold` (700) | `--line-height-snug` (1.375) |
| Supplier count | `--font-size-sm` (12px) | — (inherits regular) | `--line-height-normal` (1.5) |
| Product name (H3) | `--font-size-base` (14px) | `--font-weight-regular` (400) | `--line-height-snug` (1.375) |
| CTA link | `--font-size-caption` (13px) | `--font-weight-semibold` (600) | — |

#### Spacing

| Property | Token / Value | Resolved |
|----------|--------------|----------|
| Container max-width | `--container-lg` | 1472px |
| Container padding-x | `px-4` (4 × `--spacing`) | 32px |
| Container padding-top | `pt-8` (8 × `--spacing`) | 64px |
| Container padding-bottom | `pb-12` (12 × `--spacing`) | 96px |
| Heading margin-bottom | `mb-6` (6 × `--spacing`) | 48px |
| Grid gap | `gap-4` (4 × `--spacing`) | 32px |
| Card body padding-x | `px-3` (3 × `--spacing`) | 24px |
| Card body padding-y | `py-2.5` (2.5 × `--spacing`) | 20px |
| Card body gap | `gap-1` (1 × `--spacing`) | 8px |
| CTA margin-top | `mt-1` (1 × `--spacing`) | 8px |
| Image container padding | Custom CSS | 12px |

#### Border Radius

| Element | Token | Value |
|---------|-------|-------|
| Product card | `--radius-card` | 8px |

#### Shadows

| Element | Token | Value |
|---------|-------|-------|
| Card (default) | None | No shadow by default |
| Card (hover) | `--shadow-card-hover` | `0 4px 12px rgba(0, 0, 0, 0.15)` |

#### Transitions

| Element | Token | Value |
|---------|-------|-------|
| Card box-shadow | `--transition-base` | `200ms ease` |
| CTA text color | `--transition-base` | `200ms ease` |

### 7.4 Responsive Behavior

The Custom Products grid uses the **same responsive breakpoints and column configuration** as Section 6 (Selected Products). The key difference is the total card count (36 vs 6), which produces significantly more rows at each breakpoint.

#### Breakpoint Reference

| Name | Token | Min-Width | Grid Columns |
|------|-------|-----------|-------------|
| Mobile | `< --breakpoint-md` | 0–639px | 2 columns |
| Tablet | `--breakpoint-md` to `< --breakpoint-xl` | 640–1023px | 3 columns |
| Desktop | `≥ --breakpoint-xl` | 1024px+ | 6 columns |

#### Mobile (< 640px) — 2 Columns

```
┌─────────────────────────────────┐
│  Size özel ürünler               │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │ ┌────┐ │  │ ┌────┐ │        │
│  │ │img │ │  │ │img │ │        │
│  │ └────┘ │  │ └────┘ │        │
│  │ 5.120  │  │ 3.780  │        │
│  │ Pamu.. │  │ Güneş..│        │
│  │ Hemen  │  │ Hemen  │        │
│  └────────┘  └────────┘        │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │  ...   │  │  ...   │        │
│  └────────┘  └────────┘        │
│                                  │
│  ... (18 rows total)            │
│                                  │
│  ┌────────┐  ┌────────┐        │
│  │  ...   │  │  ...   │        │
│  └────────┘  └────────┘        │
│                                  │
└─────────────────────────────────┘
```

| Property | Mobile Value | Implementation |
|----------|-------------|----------------|
| Grid columns | 2 | `grid-cols-2` (default, no prefix) |
| Grid gap | 32px | `gap-4` (same on all breakpoints) |
| Container padding-x | 32px | `px-4` (same on all breakpoints) |
| Container padding-top | 64px | `pt-8` (same on all breakpoints) |
| Container padding-bottom | 96px | `pb-12` (same on all breakpoints) |
| Cards per row | 2 | 36 cards render across **18 rows** |

#### Tablet (640–1023px) — 3 Columns

```
┌──────────────────────────────────────────────┐
│  Size özel ürünler                            │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  ┌────┐  │  │  ┌────┐  │  │  ┌────┐  │    │
│  │  │img │  │  │  │img │  │  │  │img │  │    │
│  │  └────┘  │  │  └────┘  │  │  └────┘  │    │
│  │  5.120   │  │  3.780   │  │  2.460   │    │
│  │  Pamu..  │  │  Güneş.. │  │  Alümi.. │    │
│  │  Hemen   │  │  Hemen   │  │  Hemen   │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   ...    │  │   ...    │  │   ...    │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                │
│  ... (12 rows total)                          │
│                                                │
└──────────────────────────────────────────────┘
```

| Property | Tablet Value | Implementation |
|----------|-------------|----------------|
| Grid columns | 3 | `md:grid-cols-3` (at `≥ 640px`) |
| Cards per row | 3 | 36 cards render across **12 rows** |

#### Desktop (≥ 1024px) — 6 Columns (6 Rows)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Size özel ürünler                                                                  │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 1            │
│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│  │┌────┐│                      │
│  ││img ││  ││img ││  ││img ││  ││img ││  ││img ││  ││img ││                      │
│  │└────┘│  │└────┘│  │└────┘│  │└────┘│  │└────┘│  │└────┘│                      │
│  │5.120 │  │3.780 │  │2.460 │  │1.350 │  │6.290 │  │1.820 │                      │
│  │Pamu..│  │Güneş│  │Alüm..│  │Otom..│  │Özel..│  │Endüs│                      │
│  │Hemen │  │Hemen │  │Hemen │  │Hemen │  │Hemen │  │Hemen │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 2            │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 3            │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 4            │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 5            │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ← Row 6            │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │  │ ...  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────┘
```

| Property | Desktop Value | Implementation |
|----------|--------------|----------------|
| Grid columns | 6 | `xl:grid-cols-6` (at `≥ 1024px`) |
| Cards per row | 6 | 36 cards render across **6 rows** |
| Container max-width | 1472px | `max-w-[var(--container-lg)]` |

#### Responsive Summary Table

| Breakpoint | Grid Class | Columns | Rows | Cards |
|------------|-----------|---------|------|-------|
| `< 640px` | `grid-cols-2` | 2 | 18 | 36 |
| `≥ 640px` | `md:grid-cols-3` | 3 | 12 | 36 |
| `≥ 1024px` | `xl:grid-cols-6` | 6 | 6 | 36 |

### 7.5 Interactions

All interactive behaviors in the Custom Products section are **identical to Section 6.5** (Selected Products). The `.product-card` component is shared, so hover effects and transitions are the same.

#### Card Hover — Shadow Elevation

When the user hovers over a product card, the card elevates with a stronger box-shadow, creating a "lifted" effect.

| Property | Default | Hover |
|----------|---------|-------|
| Box-shadow | None | `--shadow-card-hover` → `0 4px 12px rgba(0, 0, 0, 0.15)` |
| Transition | — | `box-shadow 200ms ease` (via `--transition-base`) |
| Cursor | `default` | `default` (card is not a link — CTA inside is the interactive element) |

**CSS Implementation (from `src/style.css`):**

```css
.product-card {
  /* ... base styles ... */
  transition: box-shadow var(--transition-base);  /* 200ms ease */
}

.product-card:hover {
  box-shadow: var(--shadow-card-hover);  /* 0 4px 12px rgba(0, 0, 0, 0.15) */
}
```

#### CTA Link — Hover Color Change

When the user hovers over the CTA text ("Hemen fiyat teklifi al"), the text color changes from dark to gold.

| Property | Default | Hover |
|----------|---------|-------|
| Text color | `--color-cta-text` → `#111827` (near-black) | `--color-cta-text-hover` → `#cc9900` (primary gold) |
| Text decoration | `underline` | `underline` (no change) |
| Transition | — | `color 200ms ease` (via `--transition-base`) |
| Cursor | `pointer` | `pointer` |

**CSS Implementation (from `src/style.css`):**

```css
.product-card__cta {
  color: var(--color-cta-text);            /* #111827 */
  font-size: var(--font-size-caption);     /* 13px */
  font-weight: var(--font-weight-semibold); /* 600 */
  text-decoration: underline;
  transition: color var(--transition-base); /* 200ms ease */
}

.product-card__cta:hover {
  color: var(--color-cta-text-hover);      /* #cc9900 — primary gold */
}
```

#### Image Fallback

If a product image fails to load, the `.product-card__image--fallback` modifier class can be applied (via JavaScript `onerror` handler) to display a placeholder icon:

```css
.product-card__image--fallback {
  background-color: var(--color-card-image-bg);  /* #f5f5f5 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__image--fallback svg {
  width: 48px;
  height: 48px;
  color: var(--color-border-strong);  /* #d1d5db */
}
```

> **Performance Consideration:** With 36 images, failed loads may be more common. The fallback handler ensures a graceful degradation for any images that fail to load from `/images/products/custom-N.jpg`.

#### Accessibility Notes for Interactions

| Element | ARIA | Keyboard |
|---------|------|----------|
| Section | `aria-label="Size Özel Ürünler"` | — |
| Product card | `data-product-id` for JS targeting | Not focusable (container only) |
| Product image | `alt` attribute with product name | — |
| CTA link | Inherits text content as accessible name ("Hemen fiyat teklifi al") | Focusable via `Tab`, activate via `Enter` |

> **Tab Order Note:** With 36 CTA links in this section, keyboard-only users will tab through all 36 links sequentially. This is standard behavior for product grid layouts and does not require skip-navigation within the section.

---

## 8. Testimonial Carousel (Section 5)

The Testimonial Carousel is the final content section on the RFQ page. It displays customer testimonials on a **full-width dark gradient background** using a **Swiper.js** carousel with autoplay, loop, fade transition, and dot pagination. Each slide contains a centered blockquote, circular avatar image, person's name, and their job title/company. The carousel cycles through 3 testimonials automatically every 5 seconds with smooth fade transitions.

> **Data Source:** `testimonials` array from `src/data/mock-data.ts` (3 items)
> **Type:** `Testimonial` from `src/types/index.ts`
> **Custom CSS Block:** `.rfq-testimonial` and related BEM classes in `src/style.css`
> **Section ID:** `rfq-testimonials`
> **JS Dependency:** Swiper.js `^11.x` — initialized in `src/main.ts` within `DOMContentLoaded`

### 8.1 HTML Structure

```html
<section
  id="rfq-testimonials"
  class="rfq-testimonial"
  data-section="testimonials"
  aria-label="Müşteri Yorumları"
>
  <div class="mx-auto max-w-[var(--container-lg)] px-4 py-14">

    <!-- ── Swiper Container ── -->
    <div class="swiper" id="testimonial-swiper">

      <!-- ── Swiper Wrapper (holds all slides) ── -->
      <div class="swiper-wrapper">

        <!-- ════════════════════════════════════════════
             Slide 1: Hasib Uddin
             Data: testimonials[0]
             ════════════════════════════════════════════ -->
        <div class="swiper-slide">
          <div class="flex flex-col items-center text-center gap-6">

            <!-- Quote (blockquote) -->
            <blockquote class="rfq-testimonial__quote">
              "Alibaba.com üzerinden RFQ gönderdikten sadece birkaç saat içinde onlarca tedarikçiden rekabetçi fiyat teklifleri aldım. Süreç inanılmaz hızlı ve şeffaf, satın alma maliyetlerimizi %30 oranında düşürdük."
            </blockquote>

            <!-- Avatar + Attribution -->
            <div class="flex flex-col items-center gap-3">
              <img
                class="rfq-testimonial__avatar"
                src="/images/avatars/avatar-1.jpg"
                alt="Hasib Uddin"
              />
              <div class="flex flex-col items-center gap-0.5">
                <span class="rfq-testimonial__name">Hasib Uddin</span>
                <span class="rfq-testimonial__title">
                  Satın Alma Müdürü, Alphasoft Technology Limited
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- ════════════════════════════════════════════
             Slide 2: Ayşe Kara
             Data: testimonials[1]
             ════════════════════════════════════════════ -->
        <div class="swiper-slide">
          <div class="flex flex-col items-center text-center gap-6">

            <blockquote class="rfq-testimonial__quote">
              "Doğru tedarikçiyi bulmak her zaman en büyük zorluğumuzdu. RFQ sistemi sayesinde ihtiyacımıza tam uyan üreticilerle doğrudan bağlantı kurabildik. Kalite kontrol süreci de son derece güvenilir."
            </blockquote>

            <div class="flex flex-col items-center gap-3">
              <img
                class="rfq-testimonial__avatar"
                src="/images/avatars/avatar-2.jpg"
                alt="Ayşe Kara"
              />
              <div class="flex flex-col items-center gap-0.5">
                <span class="rfq-testimonial__name">Ayşe Kara</span>
                <span class="rfq-testimonial__title">
                  Tedarik Zinciri Direktörü, Anatolian Export Group
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- ════════════════════════════════════════════
             Slide 3: Mehmet Yılmaz
             Data: testimonials[2]
             ════════════════════════════════════════════ -->
        <div class="swiper-slide">
          <div class="flex flex-col items-center text-center gap-6">

            <blockquote class="rfq-testimonial__quote">
              "Küçük işletmemiz için toptan alım her zaman zorlayıcıydı. RFQ platformu ile minimum sipariş miktarlarını müzakere edebildik ve güvenilir tedarikçilerle uzun vadeli iş ortaklıkları kurduk."
            </blockquote>

            <div class="flex flex-col items-center gap-3">
              <img
                class="rfq-testimonial__avatar"
                src="/images/avatars/avatar-3.jpg"
                alt="Mehmet Yılmaz"
              />
              <div class="flex flex-col items-center gap-0.5">
                <span class="rfq-testimonial__name">Mehmet Yılmaz</span>
                <span class="rfq-testimonial__title">
                  Genel Müdür, Yılmaz Ticaret ve Sanayi A.Ş.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
      <!-- /swiper-wrapper -->

      <!-- ── Swiper Pagination (dot indicators) ── -->
      <div class="swiper-pagination mt-8"></div>

    </div>
    <!-- /swiper -->

  </div>
</section>
```

**Element Inventory:**

| # | Element | Tag | Content / Purpose |
|---|---------|-----|-------------------|
| 1 | Section wrapper | `<section>` | Full-width dark gradient background (`.rfq-testimonial`) |
| 2 | Container | `<div>` | Max-width 1472px, horizontal padding 32px, vertical padding 112px |
| 3 | Swiper container | `<div>` | Swiper.js root element (`class="swiper"`, `id="testimonial-swiper"`) |
| 4 | Swiper wrapper | `<div>` | Required Swiper.js wrapper (`class="swiper-wrapper"`) |
| 5–7 | Swiper slides (×3) | `<div>` | Individual carousel slides (`class="swiper-slide"`) |
| 5a | Slide content wrapper | `<div>` | Flex column, centered, with 48px vertical gap |
| 5b | Quote | `<blockquote>` | Testimonial text — white, italic, 20px, max-width 650px, centered |
| 5c | Attribution wrapper | `<div>` | Flex column, centered, with 24px gap |
| 5d | Avatar image | `<img>` | Circular 68px photo with semi-transparent white border |
| 5e | Name/title wrapper | `<div>` | Flex column, centered, with 4px gap |
| 5f | Person name | `<span>` | Bold white text, 16px |
| 5g | Title + company | `<span>` | Semi-transparent white text, 14px — "Job Title, Company Name" |
| 8 | Pagination container | `<div>` | Swiper.js dot pagination (`class="swiper-pagination"`) |

### 8.2 Tailwind/CSS Classes Per Element

Every element's class list is documented below. Classes are split into **Tailwind utilities** (auto-generated from `@theme` tokens) and **custom CSS classes** (defined in `src/style.css`).

#### Section Wrapper

```
<section class="rfq-testimonial" ...>
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-testimonial` | Custom CSS | `background: linear-gradient(135deg, #1e293b 0%, #1e1b4b 50%, #312e81 100%);` |

> **Dark Gradient:** The section background is a 135-degree linear gradient transitioning from slate-dark (#1e293b) through deep indigo (#1e1b4b) to rich purple (#312e81). This creates a dramatic dark backdrop that makes the white text content stand out.

#### Container

```
<div class="mx-auto max-w-[var(--container-lg)] px-4 py-14">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `mx-auto` | Tailwind | `margin-left: auto; margin-right: auto` |
| `max-w-[var(--container-lg)]` | Tailwind (arbitrary) | `max-width: 1472px` |
| `px-4` | Tailwind | `padding-left: 2rem (32px); padding-right: 2rem (32px)` — (4 × 0.5rem) |
| `py-14` | Tailwind | `padding-top: 7rem (112px); padding-bottom: 7rem (112px)` — (14 × 0.5rem) |

> **Generous Vertical Padding:** The testimonial section uses `py-14` (112px) for spacious vertical padding, creating a premium feel around the carousel content on the dark background.

#### Swiper Container

```
<div class="swiper" id="testimonial-swiper">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `swiper` | Swiper.js | Required root class for Swiper initialization. Sets `position: relative; overflow: hidden;` |

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `id` | `testimonial-swiper` | JavaScript hook for `new Swiper('#testimonial-swiper', ...)` initialization |

#### Swiper Wrapper

```
<div class="swiper-wrapper">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `swiper-wrapper` | Swiper.js | Required wrapper class. Sets `display: flex; transition-property: transform;` and manages slide positioning |

#### Swiper Slide

```
<div class="swiper-slide">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `swiper-slide` | Swiper.js | Individual slide container. Handles visibility, opacity (for fade effect), and transform transitions |

#### Slide Content Wrapper

```
<div class="flex flex-col items-center text-center gap-6">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `items-center` | Tailwind | `align-items: center` |
| `text-center` | Tailwind | `text-align: center` |
| `gap-6` | Tailwind | `gap: 3rem (48px)` — (6 × 0.5rem) |

#### Quote (Blockquote)

```
<blockquote class="rfq-testimonial__quote">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-testimonial__quote` | Custom CSS | `color: #ffffff; font-style: italic; font-size: var(--font-size-xl) [20px]; line-height: var(--line-height-relaxed) [1.625]; max-width: 650px; margin-left: auto; margin-right: auto; text-align: center;` |

> **Quote Presentation:** The blockquote text appears in white italic at 20px with relaxed line-height (1.625) for comfortable reading. The `max-width: 650px` prevents lines from becoming too wide on large screens, maintaining optimal readability. The quotes in the mock data already include quotation mark characters ("...").

#### Attribution Wrapper

```
<div class="flex flex-col items-center gap-3">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-3` | Tailwind | `gap: 1.5rem (24px)` — (3 × 0.5rem) |

#### Avatar Image

```
<img class="rfq-testimonial__avatar" src="..." alt="..." />
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-testimonial__avatar` | Custom CSS | `width: 68px; height: 68px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.2); object-fit: cover;` |

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `src` | `/images/avatars/avatar-N.jpg` | Avatar photo path (N = 1–3) |
| `alt` | Person's name (e.g. "Hasib Uddin") | Accessible alternative text |

> **Avatar Styling:** The avatar is a 68px circle with a subtle semi-transparent white border (3px, 20% opacity) that creates a soft glow effect against the dark gradient background. `object-fit: cover` ensures the photo fills the circle without distortion.

#### Name/Title Wrapper

```
<div class="flex flex-col items-center gap-0.5">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `flex` | Tailwind | `display: flex` |
| `flex-col` | Tailwind | `flex-direction: column` |
| `items-center` | Tailwind | `align-items: center` |
| `gap-0.5` | Tailwind | `gap: 0.25rem (4px)` — (0.5 × 0.5rem) |

#### Person Name

```
<span class="rfq-testimonial__name">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-testimonial__name` | Custom CSS | `color: #ffffff; font-size: var(--font-size-body) [16px]; font-weight: var(--font-weight-bold) [700];` |

#### Job Title + Company

```
<span class="rfq-testimonial__title">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `rfq-testimonial__title` | Custom CSS | `color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-base) [14px];` |

> **Title Format:** The title and company are combined on one line, separated by a comma: `"Satın Alma Müdürü, Alphasoft Technology Limited"`. The text uses 70% white opacity for a subtle, secondary appearance below the bold name.

#### Pagination Container

```
<div class="swiper-pagination mt-8">
```

| Class | Type | Resolves To |
|-------|------|-------------|
| `swiper-pagination` | Swiper.js | Required class for Swiper pagination rendering. Swiper injects dot elements dynamically. |
| `mt-8` | Tailwind | `margin-top: 4rem (64px)` — (8 × 0.5rem) |

### 8.3 Custom CSS

All custom CSS for the Testimonial section is defined in `src/style.css` under the `TESTIMONIAL SECTION` comment block. These classes use values that are **not registered as `@theme` tokens** — they are section-specific colors applied directly in the custom CSS rules.

#### Dark Gradient Background

```css
.rfq-testimonial {
  background: linear-gradient(
    135deg,
    #1e293b 0%,     /* Slate dark */
    #1e1b4b 50%,    /* Deep indigo */
    #312e81 100%    /* Rich purple */
  );
}
```

| Property | Value | Notes |
|----------|-------|-------|
| `background` | `linear-gradient(135deg, #1e293b 0%, #1e1b4b 50%, #312e81 100%)` | Diagonal dark gradient, similar angle (135deg) to hero gradient but with dark blue/purple tones instead of orange/purple |

> **Gradient Comparison:** The hero section (Section 4) uses a warm gradient (`#f97316 → #ea580c → #7c3aed → #312e81`), while the testimonial section uses a cool, dark gradient (`#1e293b → #1e1b4b → #312e81`). Both share the ending color `#312e81` (rich purple) and the same 135-degree angle, creating visual cohesion across the page.

#### Quote Styling

```css
.rfq-testimonial__quote {
  color: #ffffff;
  font-style: italic;
  font-size: var(--font-size-xl);       /* 20px */
  line-height: var(--line-height-relaxed); /* 1.625 */
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
```

#### Avatar Styling

```css
.rfq-testimonial__avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  object-fit: cover;
}
```

#### Name & Title Styling

```css
.rfq-testimonial__name {
  color: #ffffff;
  font-size: var(--font-size-body);      /* 16px */
  font-weight: var(--font-weight-bold);  /* 700 */
}

.rfq-testimonial__title {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-base);      /* 14px */
}
```

#### Swiper Pagination Dot Overrides

The default Swiper pagination bullets are customized to match the dark gradient background theme:

```css
/* Inactive dot — semi-transparent white */
.rfq-testimonial .swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.4);
  opacity: 1;                              /* Override Swiper default opacity: 0.2 */
  transition: background-color var(--transition-base);  /* 200ms ease */
}

/* Active dot — solid white */
.rfq-testimonial .swiper-pagination-bullet-active {
  background-color: #ffffff;
}
```

| State | Dot Size | Color | Opacity |
|-------|----------|-------|---------|
| Inactive | 8px × 8px | `rgba(255, 255, 255, 0.4)` (40% white) | `1` (overrides Swiper default) |
| Active | 8px × 8px | `#ffffff` (solid white) | `1` |
| Transition | — | — | `200ms ease` (via `--transition-base`) |

> **Scoped Selectors:** The dot overrides use `.rfq-testimonial .swiper-pagination-bullet` to ensure styles are scoped to this carousel only. This prevents conflicts if other Swiper instances exist on the page.

### 8.4 Swiper.js Configuration

The Swiper carousel is initialized in `src/main.ts` within the `DOMContentLoaded` event handler. The configuration uses ES Module imports with tree-shakable module registration.

#### Import Statements

```typescript
// src/main.ts — Swiper imports (at top of file)
import Swiper from 'swiper';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper core + module CSS
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
```

| Import | Purpose |
|--------|---------|
| `Swiper` (default) | Core Swiper class constructor |
| `Autoplay` (named) | Autoplay module — enables automatic slide transitions |
| `Pagination` (named) | Pagination module — renders dot indicators |
| `EffectFade` (named) | Fade effect module — crossfade transition between slides |
| `'swiper/css'` | Core Swiper CSS (positioning, overflow, transitions) |
| `'swiper/css/effect-fade'` | Fade effect CSS (opacity transitions, slide stacking) |
| `'swiper/css/pagination'` | Pagination CSS (dot layout, default bullet styles) |

#### Initialization Code

```typescript
// src/main.ts — inside DOMContentLoaded handler

const testimonialSwiper = new Swiper('#testimonial-swiper', {
  // Register required modules (tree-shaking friendly)
  modules: [Autoplay, Pagination, EffectFade],

  // Slide transition effect
  effect: 'fade',
  fadeEffect: {
    crossFade: true,    // Ensures smooth crossfade (no flash of empty space)
  },

  // Infinite loop
  loop: true,

  // Autoplay configuration
  autoplay: {
    delay: 5000,                  // 5 seconds between transitions
    disableOnInteraction: false,  // Continue autoplay after user interaction
    pauseOnMouseEnter: true,      // Pause when user hovers over carousel
  },

  // Dot pagination
  pagination: {
    el: '.swiper-pagination',     // Target element for pagination dots
    clickable: true,              // Allow clicking dots to navigate
  },

  // Accessibility
  a11y: {
    prevSlideMessage: 'Önceki yorum',     // Turkish: "Previous review"
    nextSlideMessage: 'Sonraki yorum',     // Turkish: "Next review"
    paginationBulletMessage: 'Yorum {{index}} sayfasına git',  // Turkish: "Go to review page {{index}}"
  },
});
```

#### Configuration Reference

| Option | Value | Purpose |
|--------|-------|---------|
| `modules` | `[Autoplay, Pagination, EffectFade]` | Tree-shakable module registration — only includes needed Swiper modules |
| `effect` | `'fade'` | Crossfade transition between slides (instead of default slide/swipe) |
| `fadeEffect.crossFade` | `true` | Prevents blank flash during fade by overlapping outgoing and incoming slides |
| `loop` | `true` | Infinite loop — after last slide, seamlessly returns to first |
| `autoplay.delay` | `5000` | 5000ms (5 seconds) pause between automatic transitions |
| `autoplay.disableOnInteraction` | `false` | Autoplay continues after user clicks a pagination dot |
| `autoplay.pauseOnMouseEnter` | `true` | Pauses autoplay when cursor hovers over the carousel area |
| `pagination.el` | `'.swiper-pagination'` | CSS selector for the pagination container element |
| `pagination.clickable` | `true` | Users can click/tap dots to jump to specific slides |
| `a11y.prevSlideMessage` | `'Önceki yorum'` | Screen reader announcement for previous slide action |
| `a11y.nextSlideMessage` | `'Sonraki yorum'` | Screen reader announcement for next slide action |
| `a11y.paginationBulletMessage` | `'Yorum {{index}} sayfasına git'` | Screen reader text for each pagination bullet |

> **Why Fade Effect?** The fade (crossfade) transition is preferred over the default horizontal slide for testimonials because:
> 1. It creates a more elegant, professional feel for text-heavy content
> 2. It avoids horizontal motion that could distract from reading the quote
> 3. The centered single-column layout means there's no need for swipe-style slide navigation
>
> **Why `disableOnInteraction: false`?** Without this option, Swiper stops autoplay permanently after any user interaction (e.g., clicking a pagination dot). Setting it to `false` ensures the carousel resumes autoplay after interaction, maintaining the dynamic feel of the section.

### 8.5 Token References

Every design value used in the Testimonial Carousel section is mapped below. Unlike the product card sections, the testimonial section primarily uses **custom CSS values** (hardcoded colors for the dark theme) rather than `@theme` tokens, because the dark gradient context requires inverted/custom color values.

#### Colors

| Visual Value | Token / Custom Value | Source |
|-------------|---------------------|--------|
| Section gradient start | `#1e293b` (slate dark) | Custom CSS (`.rfq-testimonial`) |
| Section gradient mid | `#1e1b4b` (deep indigo) | Custom CSS (`.rfq-testimonial`) |
| Section gradient end | `#312e81` (rich purple) | Custom CSS (`.rfq-testimonial`) |
| Quote text | `#ffffff` (white) | Custom CSS (`.rfq-testimonial__quote`) |
| Name text | `#ffffff` (white) | Custom CSS (`.rfq-testimonial__name`) |
| Title/company text | `rgba(255, 255, 255, 0.7)` (70% white) | Custom CSS (`.rfq-testimonial__title`) |
| Avatar border | `rgba(255, 255, 255, 0.2)` (20% white) | Custom CSS (`.rfq-testimonial__avatar`) |
| Pagination dot (inactive) | `rgba(255, 255, 255, 0.4)` (40% white) | Custom CSS (`.swiper-pagination-bullet`) |
| Pagination dot (active) | `#ffffff` (white) | Custom CSS (`.swiper-pagination-bullet-active`) |

> **No `@theme` Color Tokens for Content:** The testimonial section uses raw white and rgba values because it operates on a dark background. The `@theme` system's text tokens (e.g., `--color-text-primary: #111827`) are designed for light backgrounds and would be invisible on the dark gradient.

#### Typography

| Element | Font Size Token | Weight Token | Line Height Token |
|---------|----------------|--------------|-------------------|
| Quote (blockquote) | `--font-size-xl` (20px) | — (italic, inherits regular) | `--line-height-relaxed` (1.625) |
| Person name | `--font-size-body` (16px) | `--font-weight-bold` (700) | — (inherits normal) |
| Title + company | `--font-size-base` (14px) | — (inherits regular) | — (inherits normal) |

#### Spacing

| Property | Token / Value | Resolved |
|----------|--------------|----------|
| Container max-width | `--container-lg` | 1472px |
| Container padding-x | `px-4` (4 × `--spacing`) | 32px |
| Container padding-y | `py-14` (14 × `--spacing`) | 112px |
| Slide content gap | `gap-6` (6 × `--spacing`) | 48px |
| Attribution gap (avatar to text) | `gap-3` (3 × `--spacing`) | 24px |
| Name/title gap | `gap-0.5` (0.5 × `--spacing`) | 4px |
| Pagination margin-top | `mt-8` (8 × `--spacing`) | 64px |
| Quote max-width | Custom CSS | 650px |

#### Border Radius

| Element | Token / Value | Value |
|---------|---------------|-------|
| Avatar | Custom CSS (`border-radius: 50%`) | Circle (fully round) |
| Pagination dots | Swiper default | Circle (fully round, 8px) |

#### Shadows

| Element | Token | Value |
|---------|-------|-------|
| — | — | No shadows used in this section |

> **No Shadows:** The dark gradient background and white content create sufficient contrast without box-shadows. The section relies on color contrast and spacing for visual hierarchy.

#### Transitions

| Element | Token | Value |
|---------|-------|-------|
| Pagination dot bg-color | `--transition-base` | `200ms ease` |
| Slide fade transition | Swiper internal | Managed by Swiper.js EffectFade module (CSS `opacity` + `transition`) |
| Autoplay interval | Swiper config | `5000ms` delay between slides |

### 8.6 Responsive Behavior

The Testimonial Carousel is inherently responsive due to its **single-column centered layout**. Unlike the product grid sections (which change column counts), the carousel maintains the same visual structure across all breakpoints. The primary responsive adaptations are quote text sizing and container padding.

#### Breakpoint Reference

| Name | Token | Min-Width | Layout Change |
|------|-------|-----------|---------------|
| Mobile | `< --breakpoint-md` | 0–639px | Same layout, text wraps within container |
| Tablet | `--breakpoint-md` to `< --breakpoint-xl` | 640–1023px | Same layout, more horizontal breathing room |
| Desktop | `≥ --breakpoint-xl` | 1024px+ | Full width, quote constrained to 650px max-width |

#### Mobile (< 640px)

```
┌─────────────────────────────────┐
│ ░░░░░░ DARK GRADIENT BG ░░░░░░ │
│                                  │
│    "Alibaba.com üzerinden RFQ   │
│     gönderdikten sadece birkaç  │
│     saat içinde onlarca         │
│     tedarikçiden rekabetçi      │
│     fiyat teklifleri aldım..."  │
│                                  │
│           ┌──────┐              │
│           │avatar│              │
│           └──────┘              │
│         Hasib Uddin             │
│     Satın Alma Müdürü,         │
│   Alphasoft Technology Limited  │
│                                  │
│            ● ○ ○                │
│                                  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

| Property | Mobile Value | Implementation |
|----------|-------------|----------------|
| Layout | Single column, centered | `flex flex-col items-center text-center` (unchanged) |
| Quote max-width | 650px (but limited by viewport width minus padding) | CSS `max-width: 650px` with `margin: 0 auto` |
| Container padding-x | 32px | `px-4` (same on all breakpoints) |
| Container padding-y | 112px | `py-14` (same on all breakpoints) |
| Quote font-size | 20px | `--font-size-xl` (same on all breakpoints) |
| Avatar size | 68px | Custom CSS (same on all breakpoints) |
| Pagination dots | Centered, horizontal | Swiper default behavior |
| Swiper behavior | Fade effect, touch-enabled | Users can swipe/tap to change slides on touch devices |

> **Touch Interaction:** On mobile devices, users can swipe left/right to manually navigate between testimonials in addition to using the pagination dots. The fade effect still applies — the swipe gesture triggers a fade transition rather than a horizontal slide.

#### Tablet (640–1023px)

```
┌──────────────────────────────────────────────┐
│ ░░░░░░░░░░░░ DARK GRADIENT BG ░░░░░░░░░░░░░ │
│                                                │
│      "Alibaba.com üzerinden RFQ gönderdikten  │
│       sadece birkaç saat içinde onlarca       │
│       tedarikçiden rekabetçi fiyat teklifleri  │
│       aldım. Süreç inanılmaz hızlı..."       │
│                                                │
│                  ┌──────┐                     │
│                  │avatar│                     │
│                  └──────┘                     │
│                Hasib Uddin                     │
│       Satın Alma Müdürü, Alphasoft            │
│             Technology Limited                 │
│                                                │
│                  ● ○ ○                        │
│                                                │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────┘
```

| Property | Tablet Value | Implementation |
|----------|-------------|----------------|
| Layout | Same as mobile | No changes at this breakpoint |
| Quote max-width | 650px | Now fully utilized (viewport is wide enough) |

#### Desktop (≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ DARK GRADIENT BG ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                                                     │
│           "Alibaba.com üzerinden RFQ gönderdikten sadece birkaç saat               │
│            içinde onlarca tedarikçiden rekabetçi fiyat teklifleri aldım.            │
│            Süreç inanılmaz hızlı ve şeffaf, satın alma maliyetlerimizi             │
│            %30 oranında düşürdük."                                                  │
│                                                                                     │
│                                    ┌──────┐                                        │
│                                    │avatar│                                        │
│                                    └──────┘                                        │
│                                  Hasib Uddin                                        │
│                     Satın Alma Müdürü, Alphasoft Technology Limited                 │
│                                                                                     │
│                                    ● ○ ○                                           │
│                                                                                     │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────────────────────────────────────────────────────┘
```

| Property | Desktop Value | Implementation |
|----------|--------------|----------------|
| Layout | Same as mobile/tablet | No changes at this breakpoint |
| Container max-width | 1472px | `max-w-[var(--container-lg)]` |
| Quote max-width | 650px | CSS `max-width: 650px` constrains text width on wide screens |

#### Responsive Summary

| Property | All Breakpoints | Notes |
|----------|----------------|-------|
| Layout | Centered single column | No column changes — always one slide visible |
| Quote font-size | 20px (`--font-size-xl`) | Consistent across all sizes |
| Avatar size | 68px | Fixed size, no responsive scaling |
| Container padding | `px-4 py-14` (32px / 112px) | Same on all breakpoints |
| Swiper effect | Fade with crossfade | Same effect on all breakpoints |
| Pagination | Centered dots below content | Same position on all breakpoints |
| Touch support | Swipe gestures enabled | Active on touch devices (mobile/tablet) |

> **No Responsive Overrides:** The testimonial section does not require any responsive breakpoint classes (no `md:`, `lg:`, `xl:` prefixes). The centered single-column layout with `max-width: 650px` on the quote naturally adapts to all screen sizes. On narrower viewports, the text simply wraps to more lines within the available width.

#### Accessibility Notes

| Element | ARIA / Behavior | Keyboard |
|---------|-----------------|----------|
| Section | `aria-label="Müşteri Yorumları"` | — |
| Swiper container | `role="group"` (added by Swiper a11y module) | — |
| Slides | `role="group"`, `aria-label` per slide (Swiper a11y) | `←` / `→` arrow keys navigate between slides |
| Pagination dots | `role="button"`, custom `aria-label` per dot (Swiper a11y) | Focusable via `Tab`, activate via `Enter` / `Space` |
| Autoplay | Pauses on `mouseenter`, resumes on `mouseleave` | Keyboard users can navigate manually with arrows |

> **Swiper a11y Module:** The `a11y` configuration in Section 8.4 provides Turkish-language screen reader announcements. Swiper automatically adds `role`, `aria-label`, `aria-roledescription`, and `aria-live` attributes to the carousel elements for full WCAG compliance.

---

## 9. Mock Data JSON

This section provides the **complete JSON representation** of all mock data used across the RFQ page. Each data category mirrors the TypeScript arrays exported from `src/data/mock-data.ts` and conforms to the interfaces defined in `src/types/index.ts`. Field-by-field documentation is provided for every property.

> **Source File:** `src/data/mock-data.ts`
> **Type Definitions:** `src/types/index.ts`
> **Language:** All user-facing text is in Turkish (tr)
> **Usage:** Data is imported into `src/main.ts` for rendering page sections via DOM manipulation or template literals

### 9.1 Customization Cards

**Array Name:** `customizationCards`
**Type:** `CustomizationCard[]`
**Items:** 4
**Used In:** Section 1 — Hero Banner (right column, 2×2 grid)

#### Interface Reference

```typescript
interface CustomizationCard {
  id: string;          // Unique identifier for the card
  title: string;       // Bold title text (English: 'Design', 'Logo', 'Bundling', 'Packaging')
  subtitle: string;    // Subtitle text (English: 'customization')
  icon: string;        // Icon/image path for the decorative element
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';  // Grid placement
}
```

#### Complete JSON

```json
[
  {
    "id": "card-design",
    "title": "Design",
    "subtitle": "customization",
    "icon": "/images/icons/design-icon.svg",
    "position": "top-left"
  },
  {
    "id": "card-logo",
    "title": "Logo",
    "subtitle": "customization",
    "icon": "/images/icons/logo-icon.svg",
    "position": "top-right"
  },
  {
    "id": "card-bundling",
    "title": "Bundling",
    "subtitle": "customization",
    "icon": "/images/icons/bundling-icon.svg",
    "position": "bottom-left"
  },
  {
    "id": "card-packaging",
    "title": "Packaging",
    "subtitle": "customization",
    "icon": "/images/icons/packaging-icon.svg",
    "position": "bottom-right"
  }
]
```

#### Field Documentation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique identifier, prefixed with `card-` followed by the customization type | `"card-design"` |
| `title` | `string` | Bold English title displayed on the card. One of: Design, Logo, Bundling, Packaging | `"Design"` |
| `subtitle` | `string` | Smaller subtitle text below the title. Always `"customization"` for all 4 cards | `"customization"` |
| `icon` | `string` | Path to SVG icon file in `/images/icons/` directory. Pattern: `{type}-icon.svg` | `"/images/icons/design-icon.svg"` |
| `position` | `string` (union) | Grid position in the 2×2 layout. Must be one of: `top-left`, `top-right`, `bottom-left`, `bottom-right` | `"top-left"` |

> **Grid Mapping:** The `position` field determines which quadrant of the 2×2 grid each card occupies:
> ```
> ┌─────────────┬──────────────┐
> │  top-left   │  top-right   │
> │  (Design)   │  (Logo)      │
> ├─────────────┼──────────────┤
> │ bottom-left │ bottom-right │
> │ (Bundling)  │ (Packaging)  │
> └─────────────┴──────────────┘
> ```

### 9.2 Selected Products

**Array Name:** `selectedProducts`
**Type:** `Product[]`
**Items:** 6
**Used In:** Section 3 — Selected Products Grid (single row, 6 columns)

#### Interface Reference

```typescript
interface Product {
  id: string;            // Unique identifier for the product
  name: string;          // Product display name (Turkish), rendered with line-clamp-2
  image: string;         // Path to product image (e.g. '/images/products/selected-1.jpg')
  supplierCount: string; // Supplier count text (e.g. '1.980 tedarikçi sağlıyor')
  ctaText: string;       // CTA link text — 'Anında fiyat teklifi al' for this section
}
```

#### Complete JSON

```json
[
  {
    "id": "selected-1",
    "name": "Endüstriyel CNC Torna Tezgahı",
    "image": "/images/products/selected-1.jpg",
    "supplierCount": "1.980 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  },
  {
    "id": "selected-2",
    "name": "Paslanmaz Çelik Boru Profil",
    "image": "/images/products/selected-2.jpg",
    "supplierCount": "3.250 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  },
  {
    "id": "selected-3",
    "name": "Otomatik Paketleme Makinesi",
    "image": "/images/products/selected-3.jpg",
    "supplierCount": "2.140 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  },
  {
    "id": "selected-4",
    "name": "LED Endüstriyel Aydınlatma Armatürü",
    "image": "/images/products/selected-4.jpg",
    "supplierCount": "4.520 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  },
  {
    "id": "selected-5",
    "name": "Hidrolik Pres Makinesi 100 Ton",
    "image": "/images/products/selected-5.jpg",
    "supplierCount": "1.670 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  },
  {
    "id": "selected-6",
    "name": "Elektrikli Forklift 3 Ton Kapasiteli",
    "image": "/images/products/selected-6.jpg",
    "supplierCount": "2.890 tedarikçi sağlıyor",
    "ctaText": "Anında fiyat teklifi al"
  }
]
```

#### Field Documentation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique identifier, prefixed with `selected-` followed by a sequential number (1–6) | `"selected-1"` |
| `name` | `string` | Turkish product name. Rendered with `line-clamp-2` (max 2 lines, ellipsis overflow). B2B industrial products | `"Endüstriyel CNC Torna Tezgahı"` |
| `image` | `string` | Path to product image in `/images/products/` directory. Pattern: `selected-{N}.jpg` | `"/images/products/selected-1.jpg"` |
| `supplierCount` | `string` | Turkish text showing supplier count. Format: `{N.NNN} tedarikçi sağlıyor` (Turkish number format with dot separator) | `"1.980 tedarikçi sağlıyor"` |
| `ctaText` | `string` | Call-to-action link text. Always `"Anında fiyat teklifi al"` (Turkish: "Get instant quote") for all selected products | `"Anında fiyat teklifi al"` |

> **CTA Distinction:** Selected Products use `"Anında fiyat teklifi al"` (instant quote), while Custom Products (Section 9.3) use `"Hemen fiyat teklifi al"` (get quote now). This subtle wording difference distinguishes the two product sections visually and semantically.

#### Product Summary Table

| # | ID | Product Name | Supplier Count |
|---|-----|-------------|----------------|
| 1 | `selected-1` | Endüstriyel CNC Torna Tezgahı | 1.980 |
| 2 | `selected-2` | Paslanmaz Çelik Boru Profil | 3.250 |
| 3 | `selected-3` | Otomatik Paketleme Makinesi | 2.140 |
| 4 | `selected-4` | LED Endüstriyel Aydınlatma Armatürü | 4.520 |
| 5 | `selected-5` | Hidrolik Pres Makinesi 100 Ton | 1.670 |
| 6 | `selected-6` | Elektrikli Forklift 3 Ton Kapasiteli | 2.890 |

### 9.3 Custom Products

**Array Name:** `customProducts`
**Type:** `Product[]`
**Items:** 36 (6 rows × 6 columns)
**Used In:** Section 4 — Custom Products Grid (multi-row grid)

#### Interface Reference

Same `Product` interface as Selected Products (Section 9.2). The only difference is the `ctaText` value and `id` prefix.

#### Complete JSON

```json
[
  {
    "id": "custom-1",
    "name": "Pamuklu Örme Kumaş Toptan",
    "image": "/images/products/custom-1.jpg",
    "supplierCount": "5.120 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-2",
    "name": "Güneş Enerjisi Paneli 550W Monokristal",
    "image": "/images/products/custom-2.jpg",
    "supplierCount": "3.780 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-3",
    "name": "Alüminyum Alaşım Döküm Parça",
    "image": "/images/products/custom-3.jpg",
    "supplierCount": "2.460 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-4",
    "name": "Otomatik Dolum Makinesi Sıvı Tip",
    "image": "/images/products/custom-4.jpg",
    "supplierCount": "1.350 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-5",
    "name": "Özel Baskılı Karton Ambalaj Kutusu",
    "image": "/images/products/custom-5.jpg",
    "supplierCount": "6.290 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-6",
    "name": "Endüstriyel Hava Kompresörü 500L",
    "image": "/images/products/custom-6.jpg",
    "supplierCount": "1.820 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-7",
    "name": "Deri Kadın Çanta El Yapımı",
    "image": "/images/products/custom-7.jpg",
    "supplierCount": "4.150 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-8",
    "name": "Kablosuz Bluetooth Kulaklık OEM",
    "image": "/images/products/custom-8.jpg",
    "supplierCount": "7.340 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-9",
    "name": "Çelik Konstrüksiyon Çatı Paneli",
    "image": "/images/products/custom-9.jpg",
    "supplierCount": "2.070 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-10",
    "name": "Plastik Enjeksiyon Kalıp İmalatı",
    "image": "/images/products/custom-10.jpg",
    "supplierCount": "1.590 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-11",
    "name": "Organik Zeytinyağı Soğuk Sıkım 5L",
    "image": "/images/products/custom-11.jpg",
    "supplierCount": "3.420 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-12",
    "name": "Elektrikli Scooter 2000W Motor",
    "image": "/images/products/custom-12.jpg",
    "supplierCount": "2.860 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-13",
    "name": "Seramik Yer Karosu 60x60cm",
    "image": "/images/products/custom-13.jpg",
    "supplierCount": "4.780 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-14",
    "name": "Medikal Cerrahi Eldiven Lateks",
    "image": "/images/products/custom-14.jpg",
    "supplierCount": "5.630 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-15",
    "name": "Dijital Baskı Makinesi UV Flatbed",
    "image": "/images/products/custom-15.jpg",
    "supplierCount": "980 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-16",
    "name": "Polyester Spor Giyim Kumaşı",
    "image": "/images/products/custom-16.jpg",
    "supplierCount": "3.910 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-17",
    "name": "Araç Yedek Parça Fren Balata Seti",
    "image": "/images/products/custom-17.jpg",
    "supplierCount": "2.540 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-18",
    "name": "Endüstriyel Su Arıtma Sistemi RO",
    "image": "/images/products/custom-18.jpg",
    "supplierCount": "1.470 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-19",
    "name": "Cam Parfüm Şişesi 100ml Özel Tasarım",
    "image": "/images/products/custom-19.jpg",
    "supplierCount": "4.210 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-20",
    "name": "Tarımsal Sulama Damlama Sistemi",
    "image": "/images/products/custom-20.jpg",
    "supplierCount": "1.890 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-21",
    "name": "Akıllı Ev Otomasyon Kontrol Paneli",
    "image": "/images/products/custom-21.jpg",
    "supplierCount": "2.730 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-22",
    "name": "Mermer Doğal Taş Kaplama Levhası",
    "image": "/images/products/custom-22.jpg",
    "supplierCount": "3.160 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-23",
    "name": "Bebek Bezi Premium Ultra Emici",
    "image": "/images/products/custom-23.jpg",
    "supplierCount": "5.870 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-24",
    "name": "Bakır Kablo NYY 3x2.5mm Toptan",
    "image": "/images/products/custom-24.jpg",
    "supplierCount": "2.340 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-25",
    "name": "Ahşap Mobilya Oturma Grubu",
    "image": "/images/products/custom-25.jpg",
    "supplierCount": "3.520 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-26",
    "name": "PVC Pencere ve Kapı Profili",
    "image": "/images/products/custom-26.jpg",
    "supplierCount": "2.180 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-27",
    "name": "Tekstil Boyama Kimyasalları Reaktif",
    "image": "/images/products/custom-27.jpg",
    "supplierCount": "1.240 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-28",
    "name": "Endüstriyel Jeneratör Dizel 150kVA",
    "image": "/images/products/custom-28.jpg",
    "supplierCount": "1.750 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-29",
    "name": "Paslanmaz Çelik Mutfak Evyesi",
    "image": "/images/products/custom-29.jpg",
    "supplierCount": "4.620 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-30",
    "name": "Gıda Ambalaj Filmi Streç 500mm",
    "image": "/images/products/custom-30.jpg",
    "supplierCount": "3.080 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-31",
    "name": "Spor Ayakkabı Erkek Hafif Koşu",
    "image": "/images/products/custom-31.jpg",
    "supplierCount": "6.740 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-32",
    "name": "Lazer Kesim Makinesi Fiber 1000W",
    "image": "/images/products/custom-32.jpg",
    "supplierCount": "1.430 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-33",
    "name": "Güvenlik Kamerası IP 4K PoE",
    "image": "/images/products/custom-33.jpg",
    "supplierCount": "5.290 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-34",
    "name": "Kozmetik Cilt Bakım Seti Doğal",
    "image": "/images/products/custom-34.jpg",
    "supplierCount": "4.360 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-35",
    "name": "Ticari Buzdolabı Dik Tip 600L",
    "image": "/images/products/custom-35.jpg",
    "supplierCount": "2.010 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  },
  {
    "id": "custom-36",
    "name": "Kauçuk Conta ve Sızdırmazlık Elemanı",
    "image": "/images/products/custom-36.jpg",
    "supplierCount": "3.650 tedarikçi sağlıyor",
    "ctaText": "Hemen fiyat teklifi al"
  }
]
```

#### Field Documentation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique identifier, prefixed with `custom-` followed by a sequential number (1–36) | `"custom-1"` |
| `name` | `string` | Turkish product name. Rendered with `line-clamp-2`. Diverse B2B categories: textiles, electronics, machinery, packaging, chemicals, automotive, construction, agriculture, cosmetics, food | `"Pamuklu Örme Kumaş Toptan"` |
| `image` | `string` | Path to product image in `/images/products/` directory. Pattern: `custom-{N}.jpg` | `"/images/products/custom-1.jpg"` |
| `supplierCount` | `string` | Turkish supplier count text. Format: `{N.NNN} tedarikçi sağlıyor`. Range: 980–7.340 | `"5.120 tedarikçi sağlıyor"` |
| `ctaText` | `string` | Call-to-action link text. Always `"Hemen fiyat teklifi al"` (Turkish: "Get quote now") for all custom products | `"Hemen fiyat teklifi al"` |

#### Product Grid Layout (6 rows × 6 columns)

| Row | Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 |
|-----|-------|-------|-------|-------|-------|-------|
| **1** | custom-1: Pamuklu Örme Kumaş Toptan | custom-2: Güneş Enerjisi Paneli 550W | custom-3: Alüminyum Alaşım Döküm Parça | custom-4: Otomatik Dolum Makinesi | custom-5: Özel Baskılı Karton Ambalaj | custom-6: Endüstriyel Hava Kompresörü |
| **2** | custom-7: Deri Kadın Çanta El Yapımı | custom-8: Kablosuz Bluetooth Kulaklık | custom-9: Çelik Konstrüksiyon Çatı | custom-10: Plastik Enjeksiyon Kalıp | custom-11: Organik Zeytinyağı Soğuk Sıkım | custom-12: Elektrikli Scooter 2000W |
| **3** | custom-13: Seramik Yer Karosu 60x60cm | custom-14: Medikal Cerrahi Eldiven | custom-15: Dijital Baskı Makinesi UV | custom-16: Polyester Spor Giyim | custom-17: Araç Yedek Parça Fren | custom-18: Endüstriyel Su Arıtma |
| **4** | custom-19: Cam Parfüm Şişesi 100ml | custom-20: Tarımsal Sulama Damlama | custom-21: Akıllı Ev Otomasyon | custom-22: Mermer Doğal Taş Kaplama | custom-23: Bebek Bezi Premium | custom-24: Bakır Kablo NYY 3x2.5mm |
| **5** | custom-25: Ahşap Mobilya Oturma | custom-26: PVC Pencere ve Kapı | custom-27: Tekstil Boyama Kimyasalları | custom-28: Endüstriyel Jeneratör Dizel | custom-29: Paslanmaz Çelik Mutfak | custom-30: Gıda Ambalaj Filmi Streç |
| **6** | custom-31: Spor Ayakkabı Erkek | custom-32: Lazer Kesim Makinesi | custom-33: Güvenlik Kamerası IP 4K | custom-34: Kozmetik Cilt Bakım Seti | custom-35: Ticari Buzdolabı Dik Tip | custom-36: Kauçuk Conta Sızdırmazlık |

> **Category Diversity:** The 36 custom products span a wide range of B2B categories to demonstrate the breadth of Alibaba's marketplace: textiles (1, 16, 27), energy (2), metals/casting (3, 24), machinery (4, 6, 15, 28, 32), packaging (5, 30), fashion/accessories (7, 31), electronics/tech (8, 21, 33), construction (9, 13, 22, 26), manufacturing (10), food/agriculture (11, 20), vehicles (12, 17), medical (14), water treatment (18), cosmetics/glass (19, 34), baby products (23), furniture (25), kitchen (29), refrigeration (35), and industrial parts (36).

### 9.4 Testimonials

**Array Name:** `testimonials`
**Type:** `Testimonial[]`
**Items:** 3
**Used In:** Section 5 — Testimonial Carousel (Swiper.js slides)

#### Interface Reference

```typescript
interface Testimonial {
  id: string;      // Unique identifier for the testimonial
  quote: string;   // Testimonial quote text (Turkish), displayed in italic white
  avatar: string;  // Path to avatar image (round, 68px, with semi-transparent border)
  name: string;    // Full name of the person
  title: string;   // Job title (Turkish)
  company: string; // Company name
}
```

#### Complete JSON

```json
[
  {
    "id": "testimonial-1",
    "quote": "\"Alibaba.com üzerinden RFQ gönderdikten sadece birkaç saat içinde onlarca tedarikçiden rekabetçi fiyat teklifleri aldım. Süreç inanılmaz hızlı ve şeffaf, satın alma maliyetlerimizi %30 oranında düşürdük.\"",
    "avatar": "/images/avatars/avatar-1.jpg",
    "name": "Hasib Uddin",
    "title": "Satın Alma Müdürü",
    "company": "Alphasoft Technology Limited"
  },
  {
    "id": "testimonial-2",
    "quote": "\"Doğru tedarikçiyi bulmak her zaman en büyük zorluğumuzdu. RFQ sistemi sayesinde ihtiyacımıza tam uyan üreticilerle doğrudan bağlantı kurabildik. Kalite kontrol süreci de son derece güvenilir.\"",
    "avatar": "/images/avatars/avatar-2.jpg",
    "name": "Ayşe Kara",
    "title": "Tedarik Zinciri Direktörü",
    "company": "Anatolian Export Group"
  },
  {
    "id": "testimonial-3",
    "quote": "\"Küçük işletmemiz için toptan alım her zaman zorlayıcıydı. RFQ platformu ile minimum sipariş miktarlarını müzakere edebildik ve güvenilir tedarikçilerle uzun vadeli iş ortaklıkları kurduk.\"",
    "avatar": "/images/avatars/avatar-3.jpg",
    "name": "Mehmet Yılmaz",
    "title": "Genel Müdür",
    "company": "Yılmaz Ticaret ve Sanayi A.Ş."
  }
]
```

#### Field Documentation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique identifier, prefixed with `testimonial-` followed by a sequential number (1–3) | `"testimonial-1"` |
| `quote` | `string` | Full testimonial quote in Turkish. Enclosed in escaped double quotes (`\"`). Describes the user's RFQ experience on Alibaba.com. Rendered in italic white text, max-width 650px | `"\"Alibaba.com üzerinden RFQ gönderdikten...\"" ` |
| `avatar` | `string` | Path to avatar image in `/images/avatars/` directory. Pattern: `avatar-{N}.jpg`. Rendered as 68px circle with semi-transparent white border | `"/images/avatars/avatar-1.jpg"` |
| `name` | `string` | Full name of the testimonial author. Rendered in bold white 16px text | `"Hasib Uddin"` |
| `title` | `string` | Job title in Turkish. Rendered in semi-transparent white 14px text, before company name | `"Satın Alma Müdürü"` |
| `company` | `string` | Company name. Rendered after job title, separated by comma + space in the display | `"Alphasoft Technology Limited"` |

#### Testimonial Summary

| # | ID | Name | Title | Company | Quote Theme |
|---|-----|------|-------|---------|-------------|
| 1 | `testimonial-1` | Hasib Uddin | Satın Alma Müdürü | Alphasoft Technology Limited | Speed & cost savings — received competitive quotes within hours, reduced costs by 30% |
| 2 | `testimonial-2` | Ayşe Kara | Tedarik Zinciri Direktörü | Anatolian Export Group | Supplier matching & quality — connected directly with matching manufacturers, reliable QC |
| 3 | `testimonial-3` | Mehmet Yılmaz | Genel Müdür | Yılmaz Ticaret ve Sanayi A.Ş. | Small business access — negotiated MOQs, built long-term partnerships with reliable suppliers |

> **Display Format:** In the carousel, each testimonial renders as:
> ```
> "Quote text here..."
>
>     [Avatar]
>   Person Name
> Job Title, Company Name
> ```
> The `title` and `company` fields are concatenated with a comma separator in the HTML: `"Satın Alma Müdürü, Alphasoft Technology Limited"`.

---

## 10. TypeScript Interactions

This section provides the **complete TypeScript code specification** for all interactive behaviors in `src/main.ts`. The entry point file orchestrates Flowbite initialization, Swiper carousel setup, file upload handling (click + drag-and-drop), form submission validation, and optional scroll animations. All code runs inside a `DOMContentLoaded` event listener.

> **File:** `src/main.ts`
> **Module Type:** ES Module (`import` / `import type` — no `require()`)
> **Dependencies:** Flowbite (`^3.x`), Swiper.js (`^11.x`)
> **Type Definitions:** `src/types/index.ts`
> **Data:** `src/data/mock-data.ts` (imported but used for DOM rendering, not covered in this section)

### 10.1 Complete File Structure

```typescript
/* ==========================================================================
   src/main.ts — RFQ Page Entry Point
   Initializes all interactive behaviors: Flowbite UI components,
   Swiper.js carousel, file upload handlers, and form validation.
   ========================================================================== */

// ── Style Imports ──
import './style.css';

// ── Flowbite ──
import 'flowbite';
import { initFlowbite } from 'flowbite';

// ── Swiper.js (tree-shakable ES module imports) ──
import Swiper from 'swiper';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// ── Type Imports ──
import type { RFQFormData, AllowedFileExtension } from './types';
import { FILE_UPLOAD_CONFIG } from './types';

// ── Mock Data Imports (for DOM rendering) ──
import { customizationCards, selectedProducts, customProducts, testimonials } from './data/mock-data';

/* --------------------------------------------------------------------------
   DOMContentLoaded — All initialization happens here
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Flowbite (tooltips, checkboxes, etc.)
  // 2. Initialize Swiper testimonial carousel
  // 3. Set up file upload handlers (click + drag/drop)
  // 4. Set up form submission handler
  // 5. (Optional) Initialize scroll animations
});
```

#### Import Summary

| Import | Source | Purpose |
|--------|--------|---------|
| `'./style.css'` | Local | TailwindCSS v4 entry point — triggers @theme token processing and custom CSS |
| `'flowbite'` | Package (side-effect) | Registers Flowbite's data-attribute-driven components globally |
| `initFlowbite` | `'flowbite'` (named) | Function to manually (re-)initialize Flowbite components |
| `Swiper` | `'swiper'` (default) | Core Swiper class constructor |
| `Autoplay` | `'swiper/modules'` (named) | Autoplay module for automatic slide transitions |
| `Pagination` | `'swiper/modules'` (named) | Pagination module for dot indicators |
| `EffectFade` | `'swiper/modules'` (named) | Fade effect module for crossfade transitions |
| `'swiper/css'` | Package (side-effect) | Core Swiper CSS (positioning, overflow, transitions) |
| `'swiper/css/effect-fade'` | Package (side-effect) | Fade effect CSS (opacity transitions, slide stacking) |
| `'swiper/css/pagination'` | Package (side-effect) | Pagination CSS (dot layout, bullet styles) |
| `RFQFormData` | `'./types'` (type-only) | Type for form data collection — erased at compile time |
| `AllowedFileExtension` | `'./types'` (type-only) | Type for extension validation — erased at compile time |
| `FILE_UPLOAD_CONFIG` | `'./types'` (value) | Runtime constant — `maxFiles: 6`, `allowedExtensions` array |
| `customizationCards` | `'./data/mock-data'` (value) | 4 hero customization cards for DOM rendering |
| `selectedProducts` | `'./data/mock-data'` (value) | 6 selected products for DOM rendering |
| `customProducts` | `'./data/mock-data'` (value) | 36 custom products for DOM rendering |
| `testimonials` | `'./data/mock-data'` (value) | 3 testimonials for DOM rendering |

### 10.2 Flowbite Initialization

Flowbite uses a **data-attribute-driven** component system. Importing the package registers the global observer, and calling `initFlowbite()` manually ensures all components are initialized after DOM content is ready.

#### Code

```typescript
// Inside DOMContentLoaded handler

// Initialize Flowbite UI components
// This activates all data-attribute-driven components:
// - Tooltips (data-tooltip-target, data-tooltip-placement)
// - Checkboxes (Flowbite-styled via CSS classes)
initFlowbite();
```

#### What Gets Initialized

| Component | Trigger Attribute | Used In | Behavior |
|-----------|-------------------|---------|----------|
| **Tooltip** | `data-tooltip-target="tooltip-file-upload"` | Section 2 (RFQ Form) — file upload button | Shows tooltip on hover/focus with allowed file formats text |
| **Tooltip** | `data-tooltip-placement="top"` | Section 2 (RFQ Form) — file upload tooltip | Positions tooltip above the trigger element |
| **Checkbox** | Flowbite CSS class styling | Section 2 (RFQ Form) — AI toggle checkbox | Styled checkbox with Flowbite's default theme colors |

> **Why Manual Init?** While Flowbite auto-initializes on page load via its side-effect import (`import 'flowbite'`), calling `initFlowbite()` explicitly inside `DOMContentLoaded` ensures components are properly initialized even if the DOM was modified after the initial script execution. This is a defensive pattern recommended for SPAs and dynamically-rendered content.

#### Tooltip Configuration (Data Attributes in HTML)

The file upload tooltip is configured entirely via HTML data attributes — no JavaScript configuration needed:

```html
<!-- Trigger element (file upload button) -->
<button
  data-tooltip-target="tooltip-file-upload"
  data-tooltip-placement="top"
  type="button"
  class="rfq-form__upload-btn focus-ring inline-flex items-center gap-1.5"
  aria-label="Dosya yükle"
>
  <!-- Upload icon SVG + "Dosya yükle" text -->
</button>

<!-- Tooltip element -->
<div
  id="tooltip-file-upload"
  role="tooltip"
  class="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium
         text-white bg-gray-900 rounded-lg shadow-xs opacity-0
         transition-opacity duration-300 tooltip dark:bg-gray-700"
>
  Maksimum 6 dosya: jpg, jpeg, png, pdf, docx, doc, xlsx, xls
  <div class="tooltip-arrow" data-popper-arrow></div>
</div>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-tooltip-target` | `"tooltip-file-upload"` | Links trigger to tooltip by `id` |
| `data-tooltip-placement` | `"top"` | Positions tooltip above the trigger |
| `role="tooltip"` | — | ARIA role for accessibility |
| `data-popper-arrow` | — | Positions the tooltip arrow via Popper.js (Flowbite dependency) |

### 10.3 Swiper.js Initialization

The testimonial carousel is initialized using Swiper.js with ES Module imports and tree-shakable module registration. The complete initialization code is specified in Section 8.4 — this section provides the consolidated reference.

#### Code

```typescript
// Inside DOMContentLoaded handler

// Initialize Swiper testimonial carousel
const testimonialSwiper = new Swiper('#testimonial-swiper', {
  // Register required modules (tree-shaking friendly)
  modules: [Autoplay, Pagination, EffectFade],

  // Slide transition effect
  effect: 'fade',
  fadeEffect: {
    crossFade: true,    // Smooth crossfade (no flash of empty space)
  },

  // Infinite loop
  loop: true,

  // Autoplay configuration
  autoplay: {
    delay: 5000,                  // 5 seconds between transitions
    disableOnInteraction: false,  // Continue autoplay after user interaction
    pauseOnMouseEnter: true,      // Pause when user hovers over carousel
  },

  // Dot pagination
  pagination: {
    el: '.swiper-pagination',     // Target element for pagination dots
    clickable: true,              // Allow clicking dots to navigate
  },

  // Accessibility (Turkish labels)
  a11y: {
    prevSlideMessage: 'Önceki yorum',
    nextSlideMessage: 'Sonraki yorum',
    paginationBulletMessage: 'Yorum {{index}} sayfasına git',
  },
});
```

#### Configuration Summary

| Option | Value | Purpose |
|--------|-------|---------|
| `modules` | `[Autoplay, Pagination, EffectFade]` | Tree-shakable module registration |
| `effect` | `'fade'` | Crossfade transition (elegant for text-heavy content) |
| `fadeEffect.crossFade` | `true` | Prevents blank flash during fade |
| `loop` | `true` | Infinite loop — seamless cycling through 3 slides |
| `autoplay.delay` | `5000` | 5 seconds pause between transitions |
| `autoplay.disableOnInteraction` | `false` | Resumes autoplay after user interaction |
| `autoplay.pauseOnMouseEnter` | `true` | Pauses on hover for reading |
| `pagination.el` | `'.swiper-pagination'` | CSS selector for pagination container |
| `pagination.clickable` | `true` | Dots are clickable navigation elements |
| `a11y.prevSlideMessage` | `'Önceki yorum'` | Turkish screen reader text: "Previous review" |
| `a11y.nextSlideMessage` | `'Sonraki yorum'` | Turkish screen reader text: "Next review" |
| `a11y.paginationBulletMessage` | `'Yorum {{index}} sayfasına git'` | Turkish screen reader text: "Go to review page {index}" |

> **Cross-Reference:** See Section 8.4 for detailed rationale on each configuration option, including why the fade effect and `disableOnInteraction: false` were chosen.

### 10.4 File Upload — Click Handler

The file upload button triggers a hidden `<input type="file">` element programmatically. Files are validated for count (max 6) and format (allowed extensions) before being accepted.

#### Code

```typescript
// Inside DOMContentLoaded handler

// ── File Upload Setup ──
const uploadBtn = document.getElementById('rfq-upload-btn') as HTMLButtonElement;
const fileInput = document.getElementById('rfq-file-input') as HTMLInputElement;

// Click handler: open native file picker
uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

// File selection handler: validate and process
fileInput.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  // Validate file count (max 6)
  if (files.length > FILE_UPLOAD_CONFIG.maxFiles) {
    alert(`En fazla ${FILE_UPLOAD_CONFIG.maxFiles} dosya ekleyebilirsiniz.`);
    target.value = ''; // Reset input
    return;
  }

  // Validate file extensions
  for (const file of Array.from(files)) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext as AllowedFileExtension)) {
      alert(`Desteklenmeyen dosya formatı: ${file.name}`);
      target.value = ''; // Reset input
      return;
    }
  }

  // Files are valid — proceed with upload logic
  // (In this static demo, files are stored in memory only)
});
```

#### Validation Rules

| Rule | Value | Source | Error Message (Turkish) |
|------|-------|--------|------------------------|
| Max file count | 6 | `FILE_UPLOAD_CONFIG.maxFiles` | `"En fazla 6 dosya ekleyebilirsiniz."` |
| Allowed extensions | jpg, jpeg, png, pdf, docx, doc, xlsx, xls | `FILE_UPLOAD_CONFIG.allowedExtensions` | `"Desteklenmeyen dosya formatı: {filename}"` |
| Multiple selection | Yes | `multiple` attribute on `<input>` | — |
| HTML `accept` | `.jpg,.jpeg,.png,.pdf,.docx,.doc,.xlsx,.xls` | HTML attribute | Native file picker pre-filtering |

#### Element References

| Variable | Selector | Type Cast | Purpose |
|----------|----------|-----------|---------|
| `uploadBtn` | `#rfq-upload-btn` | `HTMLButtonElement` | Dashed-border upload button (visible trigger) |
| `fileInput` | `#rfq-file-input` | `HTMLInputElement` | Hidden `<input type="file" multiple>` element |

### 10.5 File Upload — Drag & Drop Handler

The upload button supports drag-and-drop file input with visual feedback via a CSS class toggle.

#### Code

```typescript
// Inside DOMContentLoaded handler (after upload btn/input setup)

// ── Drag & Drop on Upload Button ──

// Dragover: show visual feedback
uploadBtn.addEventListener('dragover', (e: DragEvent) => {
  e.preventDefault();
  uploadBtn.classList.add('rfq-form__upload-btn--dragover');
});

// Dragleave: remove visual feedback
uploadBtn.addEventListener('dragleave', () => {
  uploadBtn.classList.remove('rfq-form__upload-btn--dragover');
});

// Drop: process dropped files with same validation
uploadBtn.addEventListener('drop', (e: DragEvent) => {
  e.preventDefault();
  uploadBtn.classList.remove('rfq-form__upload-btn--dragover');

  const files = e.dataTransfer?.files;
  if (files) {
    // Apply same validation as click upload:
    // 1. Check file count (max 6)
    // 2. Check file extensions (allowedExtensions)
    // 3. Process valid files
  }
});
```

#### Drag Event Flow

| # | Event | Trigger | Action |
|---|-------|---------|--------|
| 1 | `dragover` | File dragged over upload button | `e.preventDefault()` (required to allow drop) + add `.rfq-form__upload-btn--dragover` class |
| 2 | `dragleave` | File dragged away from upload button | Remove `.rfq-form__upload-btn--dragover` class |
| 3 | `drop` | File dropped onto upload button | `e.preventDefault()` + remove dragover class + validate files (same rules as click handler) |

#### Visual State Classes

| State | CSS Class | Border | Background | Text Color |
|-------|-----------|--------|------------|------------|
| Default | `.rfq-form__upload-btn` | `1px dashed #d1d5db` | `transparent` | `#6b7280` |
| Hover | `.rfq-form__upload-btn:hover` | `1px dashed #cc9900` | `transparent` | `#b38600` |
| Drag-over | `.rfq-form__upload-btn--dragover` | `1px dashed #cc9900` | `#fff9e6` (light gold) | `#b38600` |

> **Drag-Over vs Hover:** The drag-over state adds a light gold background (`#fff9e6`) that the hover state does not have. This provides stronger visual feedback when a file is being dragged over the drop zone, making it clear that the area accepts file drops.

### 10.6 Form Submit Handler

The RFQ form uses `novalidate` to bypass native browser validation, implementing custom client-side validation that prevents submission when the textarea is empty.

#### Code

```typescript
// Inside DOMContentLoaded handler

// ── Form Submission ──
const form = document.getElementById('rfq-form-element') as HTMLFormElement;
const textarea = document.getElementById('rfq-details') as HTMLTextAreaElement;

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  // Validate textarea is not empty (trim whitespace)
  const details = textarea.value.trim();
  if (!details) {
    // Visual feedback: highlight textarea container border in error color
    textarea.closest('div')?.classList.add('border-error-500');
    textarea.focus();
    return;
  }

  // Remove error state if previously set
  textarea.closest('div')?.classList.remove('border-error-500');

  // Collect form data
  const formData: RFQFormData = {
    details: details,
    files: Array.from(fileInput.files || []),
    aiEnabled: (document.getElementById('rfq-ai-toggle') as HTMLInputElement).checked,
  };

  // In this static demo, log the form data to console
  console.info('RFQ Form submitted:', formData);
});
```

#### Validation Logic

| Step | Action | Condition | Behavior on Fail |
|------|--------|-----------|-----------------|
| 1 | `e.preventDefault()` | Always | Prevents native form submission / page reload |
| 2 | Trim textarea value | `textarea.value.trim()` | — |
| 3 | Check empty | `!details` (empty after trim) | Add `border-error-500` class to textarea container, focus textarea, `return` |
| 4 | Clear previous error | Details is valid | Remove `border-error-500` class from textarea container |
| 5 | Collect `RFQFormData` | All validation passed | Build typed object with `details`, `files`, `aiEnabled` |
| 6 | Log to console | Static demo | `console.info('RFQ Form submitted:', formData)` |

#### Element References

| Variable | Selector | Type Cast | Purpose |
|----------|----------|-----------|---------|
| `form` | `#rfq-form-element` | `HTMLFormElement` | Form element with `novalidate` attribute |
| `textarea` | `#rfq-details` | `HTMLTextAreaElement` | Multi-line text input for RFQ details |
| `fileInput` | `#rfq-file-input` | `HTMLInputElement` | Reused from file upload setup (Section 10.4) |

#### Error State Visual

| State | Trigger | Class Applied To | Visual Change |
|-------|---------|------------------|---------------|
| Error | Empty textarea on submit | `textarea.closest('div')` (textarea container) | Border changes to `border-error-500` → `#ef4444` (red) |
| Valid | Non-empty textarea on submit | Same container | `border-error-500` class removed, border returns to default |

> **Empty Textarea Block:** The form will **not** submit if the textarea contains only whitespace characters. The `.trim()` call ensures that strings like `"   "` or `"\n\n"` are treated as empty. This is the only required field — files and the AI toggle are optional.

### 10.7 Optional Scroll Animations

Scroll-triggered entrance animations can optionally be added for section reveal effects. These use the **Intersection Observer API** (native browser API, no library needed) with CSS class toggling.

> **Status:** Optional enhancement — not required for the base implementation. The page is fully functional without scroll animations.

#### Code (Optional)

```typescript
// Inside DOMContentLoaded handler (optional — add if scroll animations desired)

// ── Optional: Scroll-Triggered Section Animations ──
const animatedSections = document.querySelectorAll('[data-animate]');

if (animatedSections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1,    // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px', // Trigger 50px before element enters viewport
    }
  );

  animatedSections.forEach((section) => observer.observe(section));
}
```

#### Implementation Details

| Property | Value | Purpose |
|----------|-------|---------|
| Selector | `[data-animate]` | Targets elements with `data-animate` attribute |
| `threshold` | `0.1` | Triggers when 10% of the element is visible in the viewport |
| `rootMargin` | `'0px 0px -50px 0px'` | Activates 50px before the element would naturally enter the viewport (bottom margin offset) |
| Trigger class | `animate-in` | Added to the element when it enters the viewport |
| One-time | `observer.unobserve(entry.target)` | Animation triggers only once — element is unobserved after first intersection |

#### CSS for Scroll Animations (in `src/style.css`)

```css
/* Optional: Scroll animation base state */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Optional: Animated-in state */
[data-animate].animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

#### HTML Usage (Optional)

```html
<!-- Add data-animate attribute to sections that should animate on scroll -->
<section id="rfq-selected-products" data-section="selected-products" data-animate>
  <!-- Section content -->
</section>

<section id="rfq-custom-products" data-section="custom-products" data-animate>
  <!-- Section content -->
</section>
```

> **Performance Note:** The Intersection Observer API is highly performant compared to scroll event listeners. It runs asynchronously off the main thread and only fires callbacks when visibility thresholds are crossed, making it ideal for scroll-triggered animations without impacting page scrolling performance.

### 10.8 Complete DOMContentLoaded Handler

This is the consolidated view of the entire `DOMContentLoaded` handler, showing the execution order of all initialization steps.

#### Execution Order

| # | Initialization | Required | Dependencies |
|---|---------------|----------|--------------|
| 1 | `initFlowbite()` | Yes | Flowbite package imported as side-effect |
| 2 | Swiper carousel init | Yes | Swiper + modules imported, `#testimonial-swiper` DOM element |
| 3 | File upload click handler | Yes | `#rfq-upload-btn` and `#rfq-file-input` DOM elements |
| 4 | File upload drag/drop handlers | Yes | `#rfq-upload-btn` DOM element (reused from step 3) |
| 5 | Form submit handler | Yes | `#rfq-form-element` and `#rfq-details` DOM elements |
| 6 | Scroll animations | Optional | Elements with `[data-animate]` attribute |

#### Complete Handler Code

```typescript
document.addEventListener('DOMContentLoaded', () => {
  /* ── 1. Flowbite Initialization ── */
  initFlowbite();

  /* ── 2. Swiper Testimonial Carousel ── */
  const testimonialSwiper = new Swiper('#testimonial-swiper', {
    modules: [Autoplay, Pagination, EffectFade],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    a11y: {
      prevSlideMessage: 'Önceki yorum',
      nextSlideMessage: 'Sonraki yorum',
      paginationBulletMessage: 'Yorum {{index}} sayfasına git',
    },
  });

  /* ── 3. File Upload — Click Handler ── */
  const uploadBtn = document.getElementById('rfq-upload-btn') as HTMLButtonElement;
  const fileInput = document.getElementById('rfq-file-input') as HTMLInputElement;

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;

    if (files.length > FILE_UPLOAD_CONFIG.maxFiles) {
      alert(`En fazla ${FILE_UPLOAD_CONFIG.maxFiles} dosya ekleyebilirsiniz.`);
      target.value = '';
      return;
    }

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext as AllowedFileExtension)) {
        alert(`Desteklenmeyen dosya formatı: ${file.name}`);
        target.value = '';
        return;
      }
    }

    // Files are valid — stored in memory for this static demo
  });

  /* ── 4. File Upload — Drag & Drop ── */
  uploadBtn.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    uploadBtn.classList.add('rfq-form__upload-btn--dragover');
  });

  uploadBtn.addEventListener('dragleave', () => {
    uploadBtn.classList.remove('rfq-form__upload-btn--dragover');
  });

  uploadBtn.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    uploadBtn.classList.remove('rfq-form__upload-btn--dragover');
    const files = e.dataTransfer?.files;
    if (files) {
      // Apply same validation as click upload (count + extension)
      // Process valid files
    }
  });

  /* ── 5. Form Submission ── */
  const form = document.getElementById('rfq-form-element') as HTMLFormElement;
  const textarea = document.getElementById('rfq-details') as HTMLTextAreaElement;

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const details = textarea.value.trim();
    if (!details) {
      textarea.closest('div')?.classList.add('border-error-500');
      textarea.focus();
      return;
    }

    textarea.closest('div')?.classList.remove('border-error-500');

    const formData: RFQFormData = {
      details: details,
      files: Array.from(fileInput.files || []),
      aiEnabled: (document.getElementById('rfq-ai-toggle') as HTMLInputElement).checked,
    };

    console.info('RFQ Form submitted:', formData);
  });

  /* ── 6. (Optional) Scroll Animations ── */
  const animatedSections = document.querySelectorAll('[data-animate]');
  if (animatedSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    animatedSections.forEach((section) => observer.observe(section));
  }
});
```

> **No `console.log` in Production:** The only console output is `console.info('RFQ Form submitted:', formData)` for the static demo's form submission feedback. In a production implementation, this would be replaced with an API call. No `console.log` debugging statements are used anywhere in the codebase.

---

## 11. Accessibility

This section consolidates all accessibility requirements across the RFQ page. Every interactive element has explicit ARIA labeling, every keyboard interaction is defined, and screen reader behavior is documented. The page targets **WCAG 2.1 Level AA** compliance.

> **CSS Utility:** The `.focus-ring` class in `src/style.css` provides the visible focus indicator:
> ```css
> .focus-ring:focus-visible {
>   outline: 2px solid var(--color-primary-500);  /* #cc9900 */
>   outline-offset: 2px;
> }
> ```
> Apply `.focus-ring` to every custom interactive element (buttons, links, toggles) that does not rely on a native browser focus style.

### 11.1 ARIA Labels — Complete Inventory

Every element that receives an ARIA attribute is listed below, grouped by section.

#### Section 1 — Hero Banner

| Element | ARIA Attribute | Value | Purpose |
|---------|---------------|-------|---------|
| `<section id="rfq-hero">` | `aria-label` | `"RFQ Hero Banner"` | Identifies the hero landmark for screen readers |
| Video info link (`<a>`) | `aria-label` | `"RFQ hakkında bilgi videosu"` | Descriptive label (link text + icon) |
| Outlined pill button (`<button>`) | `aria-label` | `"Taleplerinizi görüntüleyin"` | Descriptive label for requests button |
| Play icon (`<svg>`) | `aria-hidden` | `"true"` | Decorative — text label provides meaning |
| Clipboard icon (`<svg>`) | `aria-hidden` | `"true"` | Decorative — text label provides meaning |
| Chevron icon (`<svg>`) | `aria-hidden` | `"true"` | Decorative — text label provides meaning |
| Card icons (`<img>`) | `alt` | Card title (e.g., `"Design"`) | Describes the customization card's icon |

#### Section 2 — RFQ Form

| Element | ARIA Attribute | Value | Purpose |
|---------|---------------|-------|---------|
| `<section id="rfq-form">` | `aria-label` | `"RFQ Formu"` | Identifies the form landmark |
| `<form>` | `novalidate` | _(boolean)_ | Disables native validation; custom JS validation used |
| Textarea (`#rfq-details`) | `aria-label` | `"Talep detayları"` | Labels the textarea for screen readers |
| Upload button (`#rfq-upload-btn`) | `aria-label` | `"Dosya yükle"` | Labels the upload trigger button |
| Upload button | `data-tooltip-target` | `"tooltip-file-upload"` | Links button to Flowbite tooltip |
| Tooltip (`#tooltip-file-upload`) | `role` | `"tooltip"` | Identifies the element as a tooltip |
| Hidden file input (`#rfq-file-input`) | `aria-hidden` | `"true"` | Hidden from assistive technology — triggered programmatically |
| AI toggle checkbox | `aria-describedby` | `"rfq-ai-label"` | Associates checkbox with its label text |
| AI badge (`<span>`) | `aria-hidden` | `"true"` | Decorative — hidden from screen readers |
| CTA submit button | `aria-label` | `"RFQ detaylarını yaz ve gönder"` | Descriptive label for submit action |
| Info icon (`<svg>`) | `aria-hidden` | `"true"` | Decorative — visual hint only |
| Attachment icon (`<svg>`) | `aria-hidden` | `"true"` | Decorative — text label provides meaning |

#### Section 3 — Selected Products

| Element | ARIA Attribute | Value | Purpose |
|---------|---------------|-------|---------|
| `<section id="rfq-selected">` | `aria-label` | `"Seçili Ürünler"` | Identifies the selected products landmark |
| Product image (`<img>`) | `alt` | Product name (e.g., `"Özel Baskılı Kağıt Bardak"`) | Descriptive alt text for each product image |
| CTA link (`<a>`) | _(text content)_ | `"Anında fiyat teklifi al"` | Accessible name derived from link text |

#### Section 4 — Custom Products

| Element | ARIA Attribute | Value | Purpose |
|---------|---------------|-------|---------|
| `<section id="rfq-custom">` | `aria-label` | `"Size Özel Ürünler"` | Identifies the custom products landmark |
| Product image (`<img>`) | `alt` | Product name (e.g., `"Endüstriyel Güvenlik Bariyeri"`) | Descriptive alt text for each product image |
| CTA link (`<a>`) | _(text content)_ | `"Hemen fiyat teklifi al"` | Accessible name derived from link text |

#### Section 5 — Testimonial Carousel

| Element | ARIA Attribute | Value | Purpose |
|---------|---------------|-------|---------|
| `<section id="rfq-testimonials">` | `aria-label` | `"Müşteri Yorumları"` | Identifies the testimonials landmark |
| Swiper container | `role` | `"group"` | Added automatically by Swiper a11y module |
| Each slide | `role` | `"group"` | Added automatically by Swiper a11y module |
| Each slide | `aria-label` | `"Slayt X / Y"` | Swiper a11y `slideLabelMessage` (Turkish) |
| Each slide | `aria-roledescription` | `"slayt"` | Swiper a11y `slideRole` (Turkish) |
| Swiper wrapper | `aria-live` | `"off"` (autoplay) / `"polite"` (manual) | Swiper a11y manages live region for slide changes |
| Pagination dot | `role` | `"button"` | Added automatically by Swiper a11y module |
| Pagination dot | `aria-label` | `"Slayt X'e git"` | Swiper a11y `paginationBulletMessage` (Turkish) |
| Avatar image (`<img>`) | `alt` | Person's name (e.g., `"Hasib Uddin"`) | Describes the testimonial author's photo |

### 11.2 Keyboard Navigation

#### Tab Order (Top to Bottom)

The page follows a natural **top-to-bottom, left-to-right** tab order. All interactive elements are reachable via the `Tab` key in the following sequence:

| # | Element | Section | Action on `Enter` / `Space` |
|---|---------|---------|----------------------------|
| 1 | Video info link | Hero | Navigate (`Enter` only — `<a>` element) |
| 2 | Outlined pill button | Hero | Activate button (`Enter` / `Space`) |
| 3 | Textarea | Form | Begin text input (`Enter` inserts newline) |
| 4 | Upload button | Form | Activate → opens file dialog (`Enter` / `Space`) |
| 5 | AI toggle checkbox | Form | Toggle checked state (`Space` only) |
| 6 | CTA submit button | Form | Submit form (`Enter` / `Space`) |
| 7–12 | CTA links (×6) | Selected Products | Navigate to RFQ (`Enter` only — `<a>` element) |
| 13–48 | CTA links (×36) | Custom Products | Navigate to RFQ (`Enter` only — `<a>` element) |
| 49–51 | Pagination dots (×3) | Testimonials | Navigate to specific slide (`Enter` / `Space`) |

> **Total focusable elements:** ~51 interactive elements on the page (varies if carousel dots are visible).

#### Key Bindings

| Key | Behavior | Context |
|-----|----------|---------|
| `Tab` | Move focus to the next interactive element | Global — all focusable elements |
| `Shift + Tab` | Move focus to the previous interactive element | Global — reverse tab order |
| `Enter` | Activate the focused element (link navigation, button press) | Links (`<a>`), buttons (`<button>`), pagination dots |
| `Space` | Activate the focused element (button press, checkbox toggle) | Buttons (`<button>`), checkboxes (`<input type="checkbox">`) |
| `Escape` | Close the Flowbite tooltip if open | Tooltip (`#tooltip-file-upload`) — returns focus to trigger |
| `←` / `→` | Navigate between carousel slides | Swiper container when focused — Swiper a11y module |

#### Focus Behavior Details

| Scenario | Behavior |
|----------|----------|
| **Tooltip open → `Escape`** | Flowbite closes the tooltip and returns focus to the trigger button (`#rfq-upload-btn`) |
| **Form submission with empty textarea** | JS prevents submission, adds `border-error-500` class to textarea container, calls `textarea.focus()` to move focus to the error field |
| **File upload button click** | Programmatically triggers `fileInput.click()` — browser's native file dialog opens. On dialog close, focus returns to the upload button |
| **Drag-and-drop on upload area** | Visual feedback via `.rfq-form__upload-btn--dragover` class. No focus change — keyboard users use the click path instead |
| **Carousel autoplay** | Swiper sets `aria-live="off"` during autoplay to prevent screen reader interruptions. When a user manually navigates (pagination click or arrow key), `aria-live` switches to `"polite"` |

### 11.3 Focus Management — Visible Focus Rings

All custom interactive elements use the `.focus-ring` utility class for a consistent, visible focus indicator. Native form elements (`<textarea>`, `<input type="checkbox">`) use their own `focus-within` / `focus-visible` browser styles enhanced by Tailwind's `focus-within:border-border-focus` utility.

| Element | Focus Style | Implementation |
|---------|------------|----------------|
| Video info link (`<a>`) | 2px solid `#cc9900`, offset 2px | `.focus-ring` class + `:focus-visible` |
| Outlined pill button | 2px solid `#cc9900`, offset 2px | `.focus-ring` class + `:focus-visible` |
| Textarea container | Border color changes to `--color-border-focus` | `focus-within:border-border-focus` on parent `<div>` |
| Upload button | 2px solid `#cc9900`, offset 2px | `.focus-ring` class + `:focus-visible` |
| AI toggle checkbox | Browser default + Flowbite enhanced | Flowbite checkbox component styles |
| CTA submit button | 2px solid `#cc9900`, offset 2px | `.focus-ring` class + `:focus-visible` |
| Product card CTA links | 2px solid `#cc9900`, offset 2px | `.focus-ring` class + `:focus-visible` |
| Carousel pagination dots | Swiper default focus ring | Swiper a11y module styles |

> **Focus Ring Contrast:** The `#cc9900` (primary-500) focus ring on a white (`#ffffff`) background provides a contrast ratio of **3.5:1**, meeting the WCAG 2.1 Level AA non-text contrast requirement (≥ 3:1). On the dark hero/testimonial gradient backgrounds, the gold ring is even more visible.

### 11.4 Screen Reader Notes

#### Images

| Image Type | `alt` Attribute Strategy | Example |
|-----------|-------------------------|---------|
| Product images (Sections 3 & 4) | Product name from mock data | `alt="Özel Baskılı Kağıt Bardak"` |
| Customization card icons (Section 1) | Card title text | `alt="Design"` |
| Testimonial avatars (Section 5) | Person's full name | `alt="Hasib Uddin"` |
| Fallback placeholder (failed image load) | Original `alt` preserved | `alt` attribute remains on the `<img>`, SVG placeholder is `aria-hidden="true"` |
| Decorative SVG icons | `aria-hidden="true"` | Play icon, clipboard icon, chevron, attachment icon, info icon |

#### Carousel (Swiper.js a11y)

Swiper's built-in `a11y` module (configured in Section 8.4) provides the following screen reader experience:

| Feature | Screen Reader Announcement | Implementation |
|---------|---------------------------|----------------|
| Slide change (autoplay) | Silent — `aria-live="off"` | Prevents interrupting the user during autoplay |
| Slide change (manual) | Announces new slide content — `aria-live="polite"` | Polite announcement after manual navigation |
| Slide identification | `"Slayt 1 / 3"` | `slideLabelMessage: '{{index}} / {{slidesLength}}'` (prepended with "Slayt") |
| Pagination dot | `"Slayt 1'e git"` | `paginationBulletMessage: 'Slayt {{index}}\'e git'` |
| Container role | `"group"` with `"carousel"` description | `containerRoleDescriptionMessage: 'carousel'` |
| First/Last slide wrap | Swiper announces position | Loop mode wraps seamlessly — screen reader announces new position |

#### Form Validation

| Event | Screen Reader Behavior |
|-------|----------------------|
| Empty textarea submission | Focus moves to textarea (`textarea.focus()`). Screen reader announces the textarea label `"Talep detayları"`. The red border (`border-error-500`) is a visual-only indicator — no `aria-invalid` or `role="alert"` is added in this static demo |
| File upload success | No explicit announcement — files are processed silently. In production, an `aria-live` region would announce file count |
| File upload validation error | No explicit announcement in this static demo. In production, an `aria-live="assertive"` region would announce the error |

> **Production Enhancement Note:** For a full production implementation, add `aria-invalid="true"` to the textarea on validation failure and use an `aria-live="assertive"` region for file upload errors. The static demo relies on visual indicators and focus management only.

---

## 12. Responsive Breakpoint Summary Table

This section provides a **single consolidated table** mapping all 5 content sections across the 3 primary breakpoints. The breakpoints align with the Tailwind utility prefixes used throughout the page:

| Breakpoint | Viewport Width | Tailwind Prefix | CSS Custom Property |
|-----------|----------------|-----------------|---------------------|
| **Mobile** | `≤ 768px` | _(default / no prefix)_ | `--breakpoint-lg: 768px` |
| **Tablet** | `769px – 1024px` | `md:` (≥ 640px) and `lg:` (≥ 768px) | `--breakpoint-xl: 1024px` |
| **Desktop** | `> 1024px` | `xl:` (≥ 1024px) | `--breakpoint-xl: 1024px` |

> **Note:** TailwindCSS breakpoints are mobile-first (`min-width`). The "Mobile" column represents the base (unprefixed) styles. The `xl:` prefix at `≥ 1024px` is the primary desktop breakpoint used throughout this page.

### 12.1 Complete Breakpoint × Section Matrix

| Section | Property | Mobile (≤ 768px) | Tablet (769–1024px) | Desktop (> 1024px) |
|---------|----------|-------------------|---------------------|---------------------|
| **1. Hero Banner** | Main grid | 1 column — stacked (`grid-cols-1`) | 1 column — stacked (`grid-cols-1`) | 12-col grid (`xl:grid-cols-12`) |
| | Left column | Full width (100%) | Full width (100%) | 7 of 12 cols (~58%) (`xl:col-span-7`) |
| | Right column | Full width below text | Full width below text | 5 of 12 cols (~42%) (`xl:col-span-5`) |
| | Card grid | 2×2 grid (`grid-cols-2`) | 2×2 grid (`grid-cols-2`) | 2×2 grid (`grid-cols-2`) |
| | H1 font size | 32px (`text-hero-lg`) | 32px (`text-hero-lg`) | 32px (`text-hero-lg`) |
| | Container padding-x | 32px (`px-4`) | 32px (`px-4`) | 32px (`px-4`) |
| | Min-height | 280px | 280px | 280px |
| **2. RFQ Form** | Card max-width | 100% (fills container) | 1100px (centered) | 1100px (centered) |
| | Card padding | 20px 16px (reduced) | 28px 32px | 28px 32px |
| | Heading font-size | 18px (`text-lg`) | 20px (`text-lg md:text-xl`) | 20px (`text-xl`) |
| | Footer layout | Wrapped — CTA full width below | Single row (`flex-wrap`) | Single row — checkbox left, CTA right |
| | CTA button width | Full width (`w-full`) | Auto (`md:w-auto`) | Auto (`w-auto`) |
| | Overlap margin-top | −50px | −50px | −50px |
| | Textarea min-height | 100px | 120px | 120px |
| **3. Selected Products** | Grid columns | 2 (`grid-cols-2`) | 3 (`md:grid-cols-3`) | 6 (`xl:grid-cols-6`) |
| | Rows visible | 3 rows (6 cards ÷ 2 cols) | 2 rows (6 cards ÷ 3 cols) | 1 row (6 cards ÷ 6 cols) |
| | Section heading | `text-xl` | `text-xl` | `text-xl` |
| | Section padding-y | 80px (`py-10`) | 80px (`py-10`) | 80px (`py-10`) |
| | Card gap | 32px (`gap-4`) | 32px (`gap-4`) | 32px (`gap-4`) |
| | Background | `bg-surface-muted` | `bg-surface-muted` | `bg-surface-muted` |
| **4. Custom Products** | Grid columns | 2 (`grid-cols-2`) | 3 (`md:grid-cols-3`) | 6 (`xl:grid-cols-6`) |
| | Rows visible | 18 rows (36 cards ÷ 2 cols) | 12 rows (36 cards ÷ 3 cols) | 6 rows (36 cards ÷ 6 cols) |
| | Section heading | `text-xl` | `text-xl` | `text-xl` |
| | Section padding | pt: 64px (`pt-8`), pb: 96px (`pb-12`) | pt: 64px (`pt-8`), pb: 96px (`pb-12`) | pt: 64px (`pt-8`), pb: 96px (`pb-12`) |
| | Card gap | 32px (`gap-4`) | 32px (`gap-4`) | 32px (`gap-4`) |
| | Background | `bg-surface` (white) | `bg-surface` (white) | `bg-surface` (white) |
| **5. Testimonials** | Layout | Single column (centered) | Single column (centered) | Single column (centered) |
| | Quote max-width | 100% (natural wrap) | 650px | 650px |
| | Quote font-size | 20px (`text-xl`) | 20px (`text-xl`) | 20px (`text-xl`) |
| | Avatar size | 68×68px | 68×68px | 68×68px |
| | Section padding-y | 112px (`py-14`) | 112px (`py-14`) | 112px (`py-14`) |
| | Responsive classes | None — naturally adapts | None — naturally adapts | None — naturally adapts |

### 12.2 Global Layout Properties Across Breakpoints

| Property | Mobile (≤ 768px) | Tablet (769–1024px) | Desktop (> 1024px) |
|----------|-------------------|---------------------|---------------------|
| Container max-width | 100% (fluid) | 100% (fluid) | 1472px (`--container-lg`) |
| Container centering | `mx-auto` | `mx-auto` | `mx-auto` |
| Body font-size | 14px (`--font-size-base`) | 14px (`--font-size-base`) | 14px (`--font-size-base`) |
| Body font-family | Roboto | Roboto | Roboto |
| Spacing grid | 8px (`--spacing: 0.5rem`) | 8px | 8px |

### 12.3 Breakpoint-Specific Notes

- **Product Grids (Sections 3 & 4):** The responsive grid uses the **same breakpoint pattern** for both sections: `grid-cols-2 md:grid-cols-3 xl:grid-cols-6`. The only difference is the total card count (6 vs. 36), which affects the number of rows.
- **Hero Banner:** The 2-column layout activates at `xl:` (≥ 1024px). Below that, content stacks vertically with the text block on top and the card grid below. The card grid itself is **always** 2 columns — it never collapses to a single column.
- **RFQ Form:** The overlap mechanism (`margin-top: -50px`) is consistent across all breakpoints. The main responsive change is the footer bar — on mobile the CTA button drops to its own line at full width, while on tablet/desktop it sits inline with the checkbox.
- **Testimonial Carousel:** Requires **no responsive classes**. The centered single-column layout with `max-width: 650px` naturally adapts. Text wraps to more lines on narrower viewports.

---

## 13. Dark Mode Notes

Dark mode is implemented via a **class-based toggle**: adding `.dark` to the `<html>` element activates dark mode styles. TailwindCSS v4's `dark:` variant maps to this class. All token overrides are documented below.

> **Activation Method:** Class-based (`.dark` on `<html>`)
> ```html
> <!-- Light mode (default) -->
> <html lang="tr">
>
> <!-- Dark mode (activated) -->
> <html lang="tr" class="dark">
> ```
>
> **Implementation Note:** The dark mode toggle UI is **not part of this page spec** — it will be implemented in the shared header/footer component. This section documents only the **token mappings** that the RFQ page must support when `.dark` is present.

### 13.1 Surface Colors

| Token | Light Mode Value | Dark Mode Value | Tailwind Usage |
|-------|-----------------|-----------------|----------------|
| `--color-surface` | `#ffffff` | `#111827` (gray-900) | `bg-surface` → `dark:bg-gray-900` |
| `--color-surface-muted` | `#fafafa` | `#1f2937` (gray-800) | `bg-surface-muted` → `dark:bg-gray-800` |
| `--color-surface-raised` | `#ffffff` | `#1f2937` (gray-800) | `bg-surface-raised` → `dark:bg-gray-800` |
| `--color-surface-overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` | `bg-surface-overlay` → `dark:bg-black/70` |

### 13.2 Text Colors

| Token | Light Mode Value | Dark Mode Value | Tailwind Usage |
|-------|-----------------|-----------------|----------------|
| `--color-text-primary` | `#111827` | `#f9fafb` (gray-50) | `text-text-primary` → `dark:text-gray-50` |
| `--color-text-secondary` | `#374151` | `#d1d5db` (gray-300) | `text-text-secondary` → `dark:text-gray-300` |
| `--color-text-tertiary` | `#6b7280` | `#9ca3af` (gray-400) | `text-text-tertiary` → `dark:text-gray-400` |
| `--color-text-inverted` | `#ffffff` | `#ffffff` | No change — always white (used on gradient backgrounds) |
| `--color-text-link` | `#cc9900` | `#ffdb4d` (primary-300) | `text-text-link` → `dark:text-primary-300` |
| `--color-text-link-hover` | `#b38600` | `#ffe680` (primary-200) | `text-text-link-hover` → `dark:text-primary-200` |

### 13.3 Border Colors

| Token | Light Mode Value | Dark Mode Value | Tailwind Usage |
|-------|-----------------|-----------------|----------------|
| `--color-border-default` | `#e5e5e5` | `#374151` (gray-700) | `border-border-default` → `dark:border-gray-700` |
| `--color-border-strong` | `#d1d5db` | `#4b5563` (gray-600) | `border-border-strong` → `dark:border-gray-600` |
| `--color-border-focus` | `#cc9900` | `#ffdb4d` (primary-300) | `border-border-focus` → `dark:border-primary-300` |
| `--color-border-muted` | `#f3f4f6` | `#1f2937` (gray-800) | `border-border-muted` → `dark:border-gray-800` |

### 13.4 Component Colors

#### Button

| Token | Light Mode | Dark Mode | Tailwind Usage |
|-------|-----------|-----------|----------------|
| `--color-btn-bg` | `#cc9900` | `#cc9900` | No change — primary brand color retained |
| `--color-btn-bg-hover` | `#b38600` | `#e6b800` (primary-400) | `hover:bg-btn-bg-hover` → `dark:hover:bg-primary-400` |
| `--color-btn-text` | `#ffffff` | `#ffffff` | No change — white text on gold background |
| `--color-btn-secondary-bg` | `transparent` | `transparent` | No change |
| `--color-btn-secondary-text` | `#cc9900` | `#ffdb4d` (primary-300) | `text-btn-secondary-text` → `dark:text-primary-300` |
| `--color-btn-secondary-border` | `#cc9900` | `#ffdb4d` (primary-300) | `border-btn-secondary-border` → `dark:border-primary-300` |

#### Card

| Token | Light Mode | Dark Mode | Tailwind Usage |
|-------|-----------|-----------|----------------|
| `--color-card-bg` | `#ffffff` | `#1f2937` (gray-800) | `bg-card-bg` → `dark:bg-gray-800` |
| `--color-card-border` | `#e5e5e5` | `#374151` (gray-700) | `border-card-border` → `dark:border-gray-700` |
| `--color-card-image-bg` | `#f5f5f5` | `#111827` (gray-900) | `bg-card-image-bg` → `dark:bg-gray-900` |

#### Input / Form

| Token | Light Mode | Dark Mode | Tailwind Usage |
|-------|-----------|-----------|----------------|
| `--color-input-bg` | `#ffffff` | `#1f2937` (gray-800) | `bg-input-bg` → `dark:bg-gray-800` |
| `--color-input-border` | `#e5e5e5` | `#374151` (gray-700) | `border-input-border` → `dark:border-gray-700` |
| `--color-input-focus-border` | `#cc9900` | `#ffdb4d` (primary-300) | `focus:border-input-focus-border` → `dark:focus:border-primary-300` |
| `--color-input-placeholder` | `#9ca3af` | `#6b7280` (gray-500) | `placeholder:text-input-placeholder` → `dark:placeholder:text-gray-500` |
| `--color-input-text` | `#111827` | `#f9fafb` (gray-50) | `text-input-text` → `dark:text-gray-50` |

#### Product Card Specific

| Token | Light Mode | Dark Mode | Tailwind Usage |
|-------|-----------|-----------|----------------|
| `--color-supplier-text` | `#9ca3af` | `#6b7280` (gray-500) | `text-supplier-text` → `dark:text-gray-500` |
| `--color-product-name` | `#222222` | `#e5e7eb` (gray-200) | `text-product-name` → `dark:text-gray-200` |
| `--color-cta-text` | `#111827` | `#f9fafb` (gray-50) | `text-cta-text` → `dark:text-gray-50` |
| `--color-cta-text-hover` | `#cc9900` | `#ffdb4d` (primary-300) | `hover:text-cta-text-hover` → `dark:hover:text-primary-300` |

### 13.5 Shadow Tokens

| Token | Light Mode | Dark Mode | Notes |
|-------|-----------|-----------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` | Increased opacity for visibility on dark surfaces |
| `--shadow-md` | `rgba(0,0,0,0.1)` based | `rgba(0,0,0,0.4)` based | Stronger shadow on dark backgrounds |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.1)` | `0 1px 3px rgba(0,0,0,0.4)` | Product card resting shadow |
| `--shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.15)` | `0 4px 12px rgba(0,0,0,0.5)` | Product card hover shadow |
| `--shadow-form` | `0 10px 40px rgba(0,0,0,0.12)` | `0 10px 40px rgba(0,0,0,0.5)` | Form card shadow — more dramatic in dark mode |

### 13.6 Gradient Sections (No Change)

The hero banner and testimonial carousel use **custom gradient backgrounds** that are already dark-toned. These sections require **no dark mode overrides**:

| Section | Gradient | Dark Mode Behavior |
|---------|----------|-------------------|
| Hero Banner (`.rfq-hero`) | `135deg, #f97316 → #ea580c → #7c3aed → #312e81` | No change — gradient is vibrant on both modes |
| Testimonials (`.rfq-testimonial`) | `135deg, #1e293b → #1e1b4b → #312e81` | No change — already dark-themed |
| Hero badge (`.rfq-hero__badge`) | `background: #f97316` | No change — orange on both modes |
| AI badge (`.rfq-ai-badge`) | `linear-gradient(135deg, accent-400, accent-600)` | No change — cyan gradient on both modes |
| Form CTA (`.rfq-form__cta`) | `background: #f97316` | No change — orange CTA on both modes |

### 13.7 Focus Ring (Dark Mode)

| Element | Light Mode | Dark Mode | Notes |
|---------|-----------|-----------|-------|
| `.focus-ring:focus-visible` | `outline: 2px solid #cc9900` | `outline: 2px solid #ffdb4d` (primary-300) | Brighter gold on dark backgrounds for visibility |
| Textarea `focus-within` | `border-color: #cc9900` | `border-color: #ffdb4d` | Matches focus ring shift |

> **Implementation:** Override the focus ring color in dark mode using:
> ```css
> .dark .focus-ring:focus-visible {
>   outline-color: var(--color-primary-300);  /* #ffdb4d */
> }
> ```

### 13.8 Semantic Colors (Dark Mode)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-success-50` | `#f0fdf4` | `#064e3b` (emerald-900) | Success background tint |
| `--color-success-500` | `#22c55e` | `#22c55e` | No change — green accent |
| `--color-warning-50` | `#fffbeb` | `#78350f` (amber-900) | Warning background tint |
| `--color-warning-500` | `#f59e0b` | `#f59e0b` | No change — amber accent |
| `--color-error-50` | `#fef2f2` | `#7f1d1d` (red-900) | Error background tint (form validation) |
| `--color-error-500` | `#ef4444` | `#ef4444` | No change — red accent |
| `--color-info-50` | `#eff6ff` | `#1e3a5f` (blue-900) | Info background tint |
| `--color-info-500` | `#3b82f6` | `#3b82f6` | No change — blue accent |

### 13.9 Dark Mode Implementation Strategy

The recommended implementation approach for dark mode on this page:

1. **Class-based activation:** `.dark` class on `<html>` — controlled by the shared header/footer toggle (out of scope for this page)
2. **Tailwind `dark:` variant:** All dark mode styles are applied via Tailwind's `dark:` prefix directly in the HTML class attributes
3. **Custom CSS overrides:** For BEM classes in `src/style.css` that use hardcoded colors (e.g., `.rfq-hero__subtitle`, `.product-card__name`), use `.dark` parent selector:
   ```css
   .dark .product-card__name {
     color: #e5e7eb;  /* gray-200 */
   }

   .dark .product-card__supplier {
     color: #6b7280;  /* gray-500 */
   }

   .dark .product-card__cta {
     color: #f9fafb;  /* gray-50 */
   }

   .dark .product-card__cta:hover {
     color: #ffdb4d;  /* primary-300 */
   }
   ```
4. **No changes needed** for gradient sections (hero, testimonials, badges, form CTA) — they are already visually appropriate for both light and dark modes
5. **Shadow intensity increase** in dark mode to maintain card/form depth perception on dark surfaces
